import { create } from "simple-oauth2";
import { verify } from "jsonwebtoken";
import config from "../config";
/**
 * Interface for JWT
 */
export interface TokenValues {
  token: {
    access_token: string;
  };
  character: {
    CharacterID: number;
    CharacterName: string;
    ExpiresOn: string;
    Scopes: string;
    TokenType: string;
    CharacterOwnerHash: string;
    IntellectualProperty: string;
  };
  iat: number;
  exp: number;
}

/**
 * oauth2 object
 */
export const oauth2 = create({
  client: {
    id: config.esiId,
    secret: config.esiSecret
  },
  auth: {
    tokenHost: "https://login.eveonline.com/"
  }
});

/**
 * Endpoint for receiving token from EVE SSO
 */
export const redirectUri = `${config.redirectUrl}/v1/authentication/oauth`;

/**
 * oauth scopes
 */
export const scope =
  "esi-contracts.read_corporation_contracts.v1 esi-universe.read_structures.v1";

/**
 * EVE SSO Login URL
 */
export const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: redirectUri,
  scope
});

/**
 * Get token from ESI
 * @param code auth code from SSO login
 */
export const getToken = async (code: string) => {
  const tokenConfig = {
    code,
    scope,
    redirect_uri: redirectUri
  };
  const result = await oauth2.authorizationCode.getToken(tokenConfig);
  const { token } = await oauth2.accessToken.create(result);
  return token;
};

/**
 * Check whether a token has expired, and if it has try to refresh it.
 * @param token
 */
export const checkAccessToken = async (token: TokenValues) => {
  let accessToken = oauth2.accessToken.create(token);

  if (accessToken.expired()) {
    try {
      accessToken = await accessToken.refresh();
    } catch (error) {
      console.log("Error refreshing access token: ", error.message);
    }
  }
  console.log(accessToken);
  return accessToken.token.access_token;
};
