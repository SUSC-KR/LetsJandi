import { RegisterCommandHandler } from './commands/register';
import { DiscordBot } from './discord/discord-bot';

async function bootstrap() {
  const client = new DiscordBot();
  await client.init();

  client.registerHandler(RegisterCommandHandler);

  await client.listen();
}

bootstrap();
