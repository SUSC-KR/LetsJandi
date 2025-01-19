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
    const usersInRanking = await this.userRepository.find(
      {
        maxStreak: {
          $gt: 0,
        },
      },
      { orderBy: { maxStreak: 'DESC' }, limit: 10 },
    );

    type RankingUser = {
      rank: number;
      githubId: string;
      maxStreak: number;
    };

    const rankingWithSequentialRank: RankingUser[] = usersInRanking.map(
      (user, idx) => ({
        rank: idx + 1,
        githubId: user.githubId,
        maxStreak: user.maxStreak,
      }),
    );

    const ranking: RankingUser[] = [];
    rankingWithSequentialRank.forEach((current, idx) => {
      const lastUser: RankingUser | undefined = ranking[idx - 1];

      ranking.push({
        ...current,
        rank:
          lastUser?.maxStreak === current.maxStreak
            ? lastUser.rank
            : current.rank,
      });
    });

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
            .map(({ rank, githubId, maxStreak }) => {
              return `${emojis[rank - 1]} [${githubId}](${buildGithubUrl(githubId)}) **${maxStreak}일**`;
            })
            .join('\n\n'),
        },
      ],
    });
  }
}
