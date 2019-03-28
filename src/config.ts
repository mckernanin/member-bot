import "dotenv/config";

const throwIfUndefined = (env: string) => {
  if (!process.env[env]) {
    throw new Error(`Environment variable "${env}" is required.`);
  }
  return process.env[env];
};

interface EnvironmentVariables {
  esiId: string;
  esiSecret: string;
  redirectUrl: string;
  env: string;
  port: number | string;
  discordWebhook: string;
  jwtExpire: string | number;
  jwtSecret: string;
  aws: {
    accessKey: string;
    secretKey: string;
    region: string;
  };
}

const variables: EnvironmentVariables = {
  esiId: throwIfUndefined("ESI_CLIENT"),
  esiSecret: throwIfUndefined("ESI_SECRET"),
  redirectUrl: throwIfUndefined("REDIRECT_URL"),
  discordWebhook: throwIfUndefined("DISCORD_WEBHOOK"),
  env: throwIfUndefined("NODE_ENV"),
  port: throwIfUndefined("PORT"),
  jwtExpire: throwIfUndefined("JWT_EXPIRE"),
  jwtSecret: throwIfUndefined("JWT_SECRET"),
  aws: {
    accessKey: throwIfUndefined("AWS_ACCESS_KEY_ID"),
    secretKey: throwIfUndefined("AWS_SECRET_ACCESS_KEY"),
    region: throwIfUndefined("AWS_REGION")
  }
};

export default variables;
