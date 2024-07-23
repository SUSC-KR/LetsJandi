import { EntityRepository } from '@mikro-orm/core';
import { CacheType, ChatInputCommandInteraction } from 'discord.js';

import { BaseDiscordCommandHandler } from '@susc/discord/base-discord-command-handler';
import { GetRepository } from '@susc/discord/get-repository.decorator';
import { UserEntity } from '@susc/entities/user.entity';

export class RankingCommandHandler extends BaseDiscordCommandHandler {
  @GetRepository(UserEntity)
  private readonly userRepository!: EntityRepository<UserEntity>;

  constructor() {
    super('랭킹');
  }

  async handle(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    const ranking = await this.userRepository.find(
      {
        maxStreak: {
          $gt: 0,
        },
      },
      { orderBy: { maxStreak: 'DESC' }, limit: 10 },
    );

    const emojis = [
      ':one:',
      ':two:',
      ':three:',
      ':four:',
      ':five:',
      ':six:',
      ':seven:',
      ':eight:',
      ':nine:',
      ':keycap_ten:',
    ];
    const buildGithubUrl = (githubId: string) =>
      `https://github.com/${githubId}`;

    await interaction.reply({
      embeds: [
        {
          color: 0x57ad68,
          title: '🌱 잔디 랭킹',
          description: ranking
            .map((user, index) => {
              return `${emojis[index]} [${user.githubId}](${buildGithubUrl(user.githubId)}) **${user.maxStreak}일**`;
            })
            .join('\n\n'),
        },
      ],
    });
  }
}
