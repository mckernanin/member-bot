import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import config from "../config";
import ESIRequest from "../esi";
import { checkAccessToken, TokenValues } from "../authentication/oauth";
import { createCorporation, getCorporation } from "../db";
import { memberDiffMessage, unchangedMessage } from "../webhook";

const diff = require("diff-arrays-of-objects");

interface Member {
  category: string;
  id: number;
  name: string;
}

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
  if (!currentCorporation) {
    return res.send(`${corporationName} now being tracked.`);
  }
  const { same, ...diffMembers } = diff(
    JSON.parse(currentCorporation.data),
    members
  );
  const changes = Object.values(diffMembers).filter((a: any) => a.length > 0);
  if (changes.length === 0) {
    unchangedMessage(
      "Corporation membership unchanged.",
      members.length,
      corporationName
    );
    return res.json({
      message: "Corp membership unchanged.",
      corporation: {
        corporationId,
        corporationName
      },
      members: members.length
    });
  }
  await createCorporation({
    corporationId,
    corporationName,
    data: JSON.stringify(members),
    createdAt: Date.now()
  });
  const response = {
    message: `Corporation membership updated. ${diffMembers.added.length ||
      0} joined, ${diffMembers.removed.length || 0} left.`,
    details: {
      joined: diffMembers.added
        .map((member: Member) => member.name)
        .sort()
        .join(", "),
      left: diffMembers.removed
        .map((member: Member) => member.name)
        .sort()
        .join(", ")
    },
    corporationId,
    corporationName,
    members: {
      added: diffMembers.added,
      removed: diffMembers.removed
    }
  };
  memberDiffMessage(response);
  return res.json(response);
};
