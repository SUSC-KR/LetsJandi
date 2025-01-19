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
    new SlashCommandBuilder()
      .setName('인증')
      .setDescription('여러분이 심은 잔디를 매일매일 인증해요.')
      .toJSON(),
    new SlashCommandBuilder()
      .setName('랭킹')
      .setDescription(
        '최대 연속 잔디 랭킹을 확인해요. 최소 한 번 이상 인증한 사람들 중 상위 10명이 나와요.',
      )
      .toJSON(),
    new SlashCommandBuilder()
      .setName('인증내역')
      .setDescription(
        '여러분이 심은 잔디 인증 내역을 확인해요. 최근 10개의 인증 일시와 총 인증 횟수가 나와요.',
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
