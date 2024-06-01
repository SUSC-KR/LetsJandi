import { ChatInputCommandInteraction } from 'discord.js';

export abstract class BaseDiscordCommandHandler {
  readonly command: string;

  constructor(command: string) {
    this.command = command;
  }

  abstract handle(interaction: ChatInputCommandInteraction): Promise<void>;
}
