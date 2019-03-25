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
      `https://esi.tech.ccp.is/${path}`,
      requestOptions
    );
    return request.body;
  }

  /**
   * Get current logged in character, and its affiliations
   */
  async getCharacter(): Promise<void> {
    const { body: character }: { body: CharacterObject } = await got(
      "https://login.eveonline.com/oauth/verify",
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        json: true
      }
    );
    const affiliations = await this.call(`latest/characters/affiliation`, {
      method: "POST",
      body: [character.CharacterID]
    });
    this.character = character;
    this.affiliations = affiliations;
  }

  async getNames(body: Array<number>) {
    if (!body.length) {
      return [];
    }
    const names = await this.call("v2/universe/names", {
      method: "POST",
      body
    });
    return names;
  }

  async getCorporationMemberIds(): Promise<Array<number>> {
    if (!this.character) {
      await this.getCharacter();
    }
    const [{ corporation_id: corporationId }] = this.affiliations;
    const corporationMemberIds: Array<number> = await this.call(
      `latest/corporations/${corporationId}/members`
    );
    return corporationMemberIds;
  }
}
