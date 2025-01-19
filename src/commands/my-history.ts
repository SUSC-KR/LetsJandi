import { EntityRepository } from '@mikro-orm/core';
import dayjs from 'dayjs';
import { CacheType, ChatInputCommandInteraction } from 'discord.js';

import { ErrorReply } from '@susc/common/reply';
import { BaseDiscordCommandHandler } from '@susc/discord/base-discord-command-handler';
import { GetRepository } from '@susc/discord/get-repository.decorator';
import { ConfirmHistoryEntity } from '@susc/entities/confirm-history.entity';
import { UserEntity } from '@susc/entities/user.entity';

export class MyHistoryCommandHandler extends BaseDiscordCommandHandler {
  @GetRepository(UserEntity)
  private readonly userRepository!: EntityRepository<UserEntity>;

  @GetRepository(ConfirmHistoryEntity)
  private readonly confirmHistoryRepository!: EntityRepository<ConfirmHistoryEntity>;

  constructor() {
    super('인증내역');
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

    const [confirmHistories, count] =
      await this.confirmHistoryRepository.findAndCount(
        { userId: user.id },
        { limit: 10, orderBy: { createdAt: 'desc' } },
      );

    if (confirmHistories.length === 0) {
      await interaction.reply(
        ErrorReply(
          '아직 인증한 내역이 없어요.',
          '📜 아직 인증한 내역이 없어요!',
        ),
      );
      return;
    }

    const confirmHistoryList = confirmHistories
      .map((confirmHistory) => {
        const date = dayjs(confirmHistory.createdAt)
          .tz('Asia/Seoul')
          .format('YYYY년 MM월 DD일 HH시 mm분');
        return `- ${date}`;
      })
      .join('\n');

    const description = [
      `📌 총 인증 횟수: **${count}회**`,
      confirmHistoryList,
    ].join('\n\n');

    await interaction.reply({
      embeds: [{ color: 0x57ad68, title: '📜 내 인증 내역', description }],
    });
  }
}
