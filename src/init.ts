import { REST, Routes } from 'discord.js';
import { config } from '@susc/config';

async function init() {
  const commands = [
    {
      name: 'register',
      description: 'Replies with Pong!',
    },
    {
      name: '등록',
      description: 'Replies with Pong!',
    },
  ];

  const rest = new REST().setToken(config.discord.token);

  try {
    await rest.put(Routes.applicationCommands(config.discord.clientId), {
      body: commands,
    });
  } catch (error) {
    console.error(error);
  }
}

init();
