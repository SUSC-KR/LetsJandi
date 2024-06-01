import * as dotenv from 'dotenv';

dotenv.config();

export type DiscordConfig = {
  clientId: string;
  token: string;
};

export type RootConfig = {
  discord: DiscordConfig;
};

export const config: RootConfig = {
  discord: {
    clientId: process.env.DISCORD_BOT_CLIENT_ID || '',
    token: process.env.DISCORD_BOT_TOKEN || '',
  },
};
