import { MikroORM, RequestContext } from '@mikro-orm/core';
import {
  ChatInputCommandInteraction,
  Client,
  GatewayIntentBits,
} from 'discord.js';

import { Type } from '@susc/common/types';
import { config, DiscordConfig } from '@susc/config';
import { BaseDiscordCommandHandler } from '@susc/discord/base-discord-command-handler';
import {
  RepositoryMetadata,
  RepositoryMetadataKey,
} from '@susc/discord/repository.decorator';

export class DiscordBot {
  private client: Client;
  private config: DiscordConfig;
  private orm: MikroORM | null = null;

  private handlerMap: Map<string, BaseDiscordCommandHandler> = new Map();

  constructor() {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.config = config.discord;
  }

  async init(): Promise<void> {
    this.orm = await MikroORM.init();
  }

  async listen(): Promise<void> {
    this.client.on('interactionCreate', async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      if (!this.orm) {
        throw new Error('ORM not initialized');
      }

      RequestContext.create(this.orm.em, async () => {
        await this.handle(interaction);
      });
    });

    await this.client.login(this.config.token);
  }

  async close(): Promise<void> {
    await this.orm?.close();
    await this.client.destroy();
  }

  registerHandler(handler: Type<BaseDiscordCommandHandler>): void {
    if (!this.orm) {
      throw new Error('ORM not initialized. Call init() first.');
    }

    const repositoryMetadata: RepositoryMetadata | undefined =
      Reflect.getMetadata(RepositoryMetadataKey, handler.prototype);

    const instance = new handler();
    if (this.handlerMap.has(instance.command)) {
      throw new Error(`Handler for command ${instance.command} already exists`);
    }

    repositoryMetadata?.forEach(({ propertyKey, entity }) => {
      (instance as any)[propertyKey as string] =
        this.orm!.em.getRepository(entity);
    });

    this.handlerMap.set(instance.command, instance);
  }

  async handle(interaction: ChatInputCommandInteraction): Promise<void> {
    const handler = this.handlerMap.get(interaction.commandName);

    if (!handler) {
      await interaction.reply('알 수 없는 명령어에요.');
      return;
    }

    await handler.handle(interaction);
  }
}
