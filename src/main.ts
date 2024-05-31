import { Client, GatewayIntentBits } from 'discord.js';
import { config } from '@susc/config';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === '등록') {
    await interaction.reply('Pong!');
  }
});

client.login(config.discord.token);
