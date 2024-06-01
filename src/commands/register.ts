import { EntityRepository } from '@mikro-orm/core';
import { BaseDiscordCommandHandler } from '@susc/discord/base-discord-command-handler';
import { Repository } from '@susc/discord/repository.decorator';
import { UserEntity } from '@susc/entities/user.entity';
import { ChatInputCommandInteraction } from 'discord.js';

export class RegisterCommandHandler extends BaseDiscordCommandHandler {
  @Repository(UserEntity)
  private readonly userRepository!: EntityRepository<UserEntity>;

  constructor() {
    super('등록');
  }

  async handle(interaction: ChatInputCommandInteraction): Promise<void> {
    const githubId = interaction.options.getString('github-id', true);
    const discordId = interaction.user.id;

    const existingUser = await this.userRepository.findOne({ discordId });
    if (existingUser) {
      await interaction.reply('이미 정보가 등록되어 있어요.');
      return;
    }

    const existingGithubUser = await this.userRepository.findOne({ githubId });
    if (existingGithubUser) {
      await interaction.reply(
        '이미 다른 사용자가 등록한 정보에요. 다른 사람이 내 정보를 등록했다면 관리자에게 문의해주세요!'
      );
      return;
    }

    const user = new UserEntity(githubId, discordId);
    await this.userRepository.insert(user);

    await interaction.reply('등록되었습니다.');
  }
}
