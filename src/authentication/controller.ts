import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import config from "../config";
import ESIRequest from "../esi";
import { authorizationUri, getToken } from "./oauth";

/**
 * Redirect user to EVE SSO
 * @param req
 * @param res
 */
export const login = (req: Request, res: Response) => {
  return res.redirect(authorizationUri);
};

/**
 * Create JWT with response from EVE API
 *
 * @param req
 * @param res
 */
export const callback = async (req: Request, res: Response) => {
  const { code } = req.query;
  const token = await getToken(code);
  const esi = new ESIRequest(token.access_token);
  await esi.getCharacter();
  const jwt = sign({ token, character: esi.character }, config.jwtSecret, {
    expiresIn: config.jwtExpire
  });
  return res.redirect(`/v1/members/setup?jwt=${jwt}`);
};
