import { EntityRepository } from '@mikro-orm/core';
import dayjs from 'dayjs';
import { CacheType, ChatInputCommandInteraction } from 'discord.js';

import { ErrorReply } from '@susc/common/reply';
import { BaseDiscordCommandHandler } from '@susc/discord/base-discord-command-handler';
import { GetGithubClient } from '@susc/discord/get-github-client.decorator';
import { GetRepository } from '@susc/discord/get-repository.decorator';
import { ConfirmHistoryEntity } from '@susc/entities/confirm-history.entity';
import { UserEntity } from '@susc/entities/user.entity';
import { GithubClient } from '@susc/github/github-client';

export class ConfirmCommandHandler extends BaseDiscordCommandHandler {
  @GetRepository(UserEntity)
  private readonly userRepository!: EntityRepository<UserEntity>;

  @GetRepository(ConfirmHistoryEntity)
  private readonly confirmHistoryRepository!: EntityRepository<ConfirmHistoryEntity>;

  @GetGithubClient()
  private readonly githubClient!: GithubClient;

  constructor() {
    super('인증');
  }

  async handle(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      discordId: interaction.user.id,
    });

    if (!user) {
      await interaction.reply(
        ErrorReply(
          '아직 깃허브 계정을 등록하지 않았어요. **/등록** 명령어를 사용해서 깃허브 계정을 등록해주세요!',
        ),
      );
      return;
    }

    const githubId = user.githubId;
    const contributionInfo = await this.githubClient.getContribution(githubId);

    if (!contributionInfo) {
      await interaction.reply(
        ErrorReply(
          '깃허브 계정이 잘못되었거나, 깃허브 API에 문제가 발생했어요.',
        ),
      );
      return;
    }

    const { hasAnyContributions, hasAnyRestrictedContributions } =
      contributionInfo.contributionsCollection;
    if (!hasAnyContributions && !hasAnyRestrictedContributions) {
      await interaction.reply(
        ErrorReply('잔디를 심고 다시 시도해주세요.', '🪴 아직 잔디가 없어요!'),
      );
      return;
    }

    const confirmDate = dayjs().tz('Asia/Seoul').startOf('day').toDate();

    const prevConfirmHistory = await this.confirmHistoryRepository.findOne({
      userId: user.id,
      confirmDate,
    });
    if (prevConfirmHistory) {
      await interaction.reply(
        ErrorReply(
          '내일 다시 인증해주세요.',
          '🌱 오늘은 이미 잔디를 심었어요!',
        ),
      );
      return;
    }

    const yesterday = dayjs(confirmDate).subtract(1, 'day').toDate();
    const isContributedYesterday = await this.isContributedYesterday(
      user.id,
      yesterday,
    );

    const newConfirmHistory = new ConfirmHistoryEntity(user.id, confirmDate);
    await this.confirmHistoryRepository.insert(newConfirmHistory);

    const totalConfirmHistoryCount = await this.confirmHistoryRepository.count({
      userId: user.id,
    });

    user.streak = isContributedYesterday ? user.streak + 1 : 1;
    user.maxStreak = Math.max(user.streak, user.maxStreak);
    await this.userRepository.nativeUpdate(
      { id: user.id },
      { streak: user.streak, maxStreak: user.maxStreak },
    );

    const celebrationPoint = [1, 3, 7, 14, 30, 50, 100];

    await interaction.reply({
      embeds: [
        {
          color: 0x57ad68,
          title: '🌱 인증 완료!',
          description: [
            '오늘도 한 단계 성장했어요.',
            celebrationPoint.includes(user.streak)
              ? `🎉 연속 ${user.streak}일동안 잔디를 인증했어요! 🎉`
              : '',
            '‎ ',
          ]
            .filter((v) => !!v)
            .join('\n'),
          fields: [
            {
              name: '연속 잔디',
              value: `${user.streak}일`,
            },
            {
              name: '최대 연속 잔디',
              value: `${user.maxStreak}일`,
            },
            {
              name: '총 잔디 수',
              value: `${totalConfirmHistoryCount}일`,
            },
          ],
        },
      ],
    });
  }

  private async isContributedYesterday(
    userId: string,
    yesterday: Date,
  ): Promise<boolean> {
    const yesterdayConfirmHistory = await this.confirmHistoryRepository.findOne(
      { userId, confirmDate: yesterday },
    );
    return !!yesterdayConfirmHistory;
  }
}
