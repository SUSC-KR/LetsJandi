import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  discord: {
    clientId: process.env.DISCORD_BOT_CLIENT_ID || '',
    token: process.env.DISCORD_BOT_TOKEN || '',
  },
};
