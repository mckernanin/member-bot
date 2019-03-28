import * as got from "got";

export interface CharacterObject {
  CharacterID: number;
  CharacterName: string;
  ExpiresOn: string;
  Scopes: string;
  TokenType: string;
  CharacterOwnerHash: string;
  IntellectualProperty: string;
}

export interface RequestOptions {
  headers: {
    Authorization: string;
  };
  json: boolean;
}

/**
 * Base class for making ESI Requests
 */
export default class ESIRequest {
  token: string;
  character: CharacterObject;
  affiliations: any;
  affiliationNames: any;
  constructor(token: string) {
    this.token = token;
  }

  /**
   * Helper method for calling the EVE API
   * @param path
   * @param options
   */
  async call(path: string, options: object = {}): Promise<any> {
    const requestOptions: RequestOptions = {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      json: true,
      ...options
    };
    const request = await got(
      `https://esi.evetech.net/${path}`,
      requestOptions
    );
    return request.body;
  }

  /**
   * Get current logged in character, and its affiliations
   */
  async getCharacter(): Promise<void> {
    console.log("Getting character...");
    const { body: character }: { body: CharacterObject } = await got(
      "https://login.eveonline.com/oauth/verify",
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        json: true
      }
    );
    console.log("Getting affiliations...");
    const [affiliations] = await this.call(`latest/characters/affiliation`, {
      method: "POST",
      body: [character.CharacterID]
    });
    const affiliationNames = await this.getNames(Object.values(affiliations));
    this.character = character;
    this.affiliations = affiliations;
    this.affiliationNames = affiliationNames;
  }

  async getNames(body: Array<number>) {
    if (!body.length) {
      return [];
    }
    console.log("Getting names...");
    const names = await this.call("v2/universe/names", {
      method: "POST",
      body
    });
    return names;
  }

  async getCorporationInfo(): Promise<{
    corporationId: number;
    corporationMemberIds: Array<number>;
    corporationName: string;
  }> {
    if (!this.character) {
      await this.getCharacter();
    }
    const { corporation_id: corporationId } = this.affiliations;
    const corporationName = this.affiliationNames.find(
      ({ id }) => id === corporationId
    ).name;
    console.log("Getting corporation members...");
    const corporationMemberIds: Array<number> = await this.call(
      `latest/corporations/${corporationId}/members`
    );
    return {
      corporationId,
      corporationName,
      corporationMemberIds
    };
  }
}
