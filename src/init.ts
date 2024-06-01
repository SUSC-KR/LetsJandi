import { REST, Routes, SlashCommandBuilder } from 'discord.js';

import { config } from '@susc/config';

async function init() {
  const commands = [
    new SlashCommandBuilder()
      .setName('등록')
      .setDescription('여러분이 심은 잔디를 인증할 깃허브를 등록해요.')
      .addStringOption((option) =>
        option
          .setName('github-id')
          .setDescription(
            '깃허브 아이디에요. `https://github.com/<여기>`에 들어가는 아이디를 입력해주세요.',
          )
          .setRequired(true),
      )
      .toJSON(),
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
