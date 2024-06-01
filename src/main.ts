import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { RegisterCommandHandler } from './commands/register';
import { DiscordBot } from './discord/discord-bot';

dayjs.extend(utc);
dayjs.extend(timezone);

async function bootstrap() {
  const client = new DiscordBot();
  await client.init();

  client.registerHandler(RegisterCommandHandler);

  await client.listen();
}

bootstrap();
