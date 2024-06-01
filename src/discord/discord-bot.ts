import { MikroORM, RequestContext } from '@mikro-orm/core';
import {
  ChatInputCommandInteraction,
  Client as DiscordClient,
  GatewayIntentBits,
} from 'discord.js';

import { Type } from '@susc/common/types';
import { config, DiscordConfig } from '@susc/config';
import { BaseDiscordCommandHandler } from '@susc/discord/base-discord-command-handler';
import {
  GetGithubClientMetadata,
  GetGithubClientMetadataKey,
} from '@susc/discord/get-github-client.decorator';
import {
  GetRepositoryMetadata,
  GetRepositoryMetadataKey,
} from '@susc/discord/get-repository.decorator';
import { GithubClient } from '@susc/github/github-client';

export class DiscordBot {
  private discordClient: DiscordClient;
  private config: DiscordConfig;

  private githubClient: GithubClient;
  private orm: MikroORM | null = null;

  private handlerMap: Map<string, BaseDiscordCommandHandler> = new Map();

  constructor() {
    this.discordClient = new DiscordClient({
      intents: [GatewayIntentBits.Guilds],
    });
    this.config = config.discord;

    this.githubClient = new GithubClient();
  }

  async init(): Promise<void> {
    this.orm = await MikroORM.init();
  }

  async listen(): Promise<void> {
    this.discordClient.on('interactionCreate', async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      if (!this.orm) {
        throw new Error('ORM not initialized');
      }

      RequestContext.create(this.orm.em, async () => {
        await this.handle(interaction);
      });
    });

    await this.discordClient.login(this.config.token);
  }

  async close(): Promise<void> {
    await this.orm?.close();
    await this.discordClient.destroy();
  }

  registerHandler(handler: Type<BaseDiscordCommandHandler>): void {
    const instance = new handler();
    if (this.handlerMap.has(instance.command)) {
      throw new Error(`Handler for command ${instance.command} already exists`);
    }

    this.injectInstance(handler, instance);
    this.handlerMap.set(instance.command, instance);
  }

  injectInstance(
    handler: Type<BaseDiscordCommandHandler>,
    instance: BaseDiscordCommandHandler,
  ): void {
    if (!this.orm) {
      throw new Error('ORM not initialized. Call init() first.');
    }

    // Repository injection
    const repositoryMetadata: GetRepositoryMetadata | undefined =
      Reflect.getMetadata(GetRepositoryMetadataKey, handler.prototype);
    repositoryMetadata?.forEach(({ propertyKey, entity }) => {
      (instance as any)[propertyKey as string] =
        this.orm!.em.getRepository(entity);
    });

    // Github client injection
    const githubClientMetadata: GetGithubClientMetadata | undefined =
      Reflect.getMetadata(GetGithubClientMetadataKey, handler.prototype);
    githubClientMetadata?.forEach(({ propertyKey }) => {
      (instance as any)[propertyKey as string] = this.githubClient;
    });
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
