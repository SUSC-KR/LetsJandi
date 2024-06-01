import { EntityRepository } from '@mikro-orm/core';
import { ChatInputCommandInteraction } from 'discord.js';

import { ErrorReply } from '@susc/common/reply';
import { BaseDiscordCommandHandler } from '@susc/discord/base-discord-command-handler';
import { GetGithubClient } from '@susc/discord/get-github-client.decorator';
import { GetRepository } from '@susc/discord/get-repository.decorator';
import { UserEntity } from '@susc/entities/user.entity';
import { GithubClient } from '@susc/github/github-client';

export class RegisterCommandHandler extends BaseDiscordCommandHandler {
  @GetRepository(UserEntity)
  private readonly userRepository!: EntityRepository<UserEntity>;

  @GetGithubClient()
  private readonly githubClient!: GithubClient;

  constructor() {
    super('등록');
  }

  async handle(interaction: ChatInputCommandInteraction): Promise<void> {
    const githubId = interaction.options.getString('github-id', true);
    const discordId = interaction.user.id;

    const existingUser = await this.userRepository.findOne({ discordId });
    if (existingUser) {
      await interaction.reply(
        ErrorReply(`이미 \`${existingUser.githubId}\`로 정보를 등록했어요.`),
      );
      return;
    }

    const existingGithubUser = await this.userRepository.findOne({ githubId });
    if (existingGithubUser) {
      await interaction.reply(
        ErrorReply(
          `이미 \`${githubId}\`는 다른 사용자가 등록한 정보에요. 다른 사람이 내 정보를 등록했다면 관리자에게 문의해주세요!`,
        ),
      );
      return;
    }

    const githubUser = await this.githubClient.getUser(githubId);
    if (!githubUser) {
      await interaction.reply(
        ErrorReply(`\`${githubId}\`로 깃허브 사용자를 찾을 수 없어요.`),
      );
      return;
    }

    const user = new UserEntity(githubId, discordId);
    await this.userRepository.insert(user);

    await interaction.reply({
      embeds: [
        {
          color: 0x57ad68,
          title: '🌱 깃허브 계정이 등록되었어요!',
          description: [
            '등록이 완료되었어요!',
            "이제 **'/인증'** 명령어로 오늘 잔디를 인증할 수 있어요.",
            '‎ ',
          ].join('\n'),
          thumbnail: { url: githubUser.avatarUrl },
          fields: [
            { name: '이름', value: githubUser.name, inline: true },
            { name: '아이디', value: githubUser.login, inline: true },
            ...(githubUser.bio
              ? [{ name: '자기소개', value: githubUser.bio }]
              : []),
            { name: '깃허브 링크', value: githubUser.url },
          ],
        },
      ],
    });
  }
}
