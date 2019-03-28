import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import config from "../config";
import ESIRequest from "../esi";
import { checkAccessToken, TokenValues } from "../authentication/oauth";
import { createCorporation, getCorporation } from "../db";

/**
 * Give the user a url with authentication to use to configure slack webhooks
 */
export const setup = (req: Request, res: Response) => {
  const { jwt } = req.query;
  res.send(`
  <style>
    div {
      font-family: 'Fira Code', 'Menlo', monospace;
      max-width: 90vw;
      margin: 0 auto;
      overflow-wrap: break-word;
      padding: 2em;
    }
  </style>
  Use the following url to set up a cron job:
  <div>${config.redirectUrl}/v1/members/check?token=${jwt}</div>
  `);
};

/**
 * Redirect user to EVE SSO
 * @param req
 * @param res
 */
export const check = async (req: Request, res: Response) => {
  const { token } = req.query;
  const decoded = verify(token, config.jwtSecret) as TokenValues;
  const accessToken = await checkAccessToken(decoded.token);

  const esi = new ESIRequest(accessToken);
  const {
    corporationId,
    corporationMemberIds,
    corporationName
  } = await esi.getCorporationInfo();
  const members = await esi.getNames(corporationMemberIds);
  const currentCorporation = await getCorporation(corporationId);
  if (
    currentCorporation &&
    currentCorporation.data === JSON.stringify(members)
  ) {
    return res.send("Corp membership has not changed since last check.");
  }
  await createCorporation({
    corporationId,
    corporationName,
    data: JSON.stringify(members),
    createdAt: Date.now()
  });
  return res.json({
    corporationId,
    corporationName,
    currentCorporation
    // members
  });
};

// export const getCorporations = async (req: Request, res: Response) => {

// }
