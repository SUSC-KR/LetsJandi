import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { ConfirmCommandHandler } from '@susc/commands/confirm';
import { RegisterCommandHandler } from '@susc/commands/register';
import { DiscordBot } from '@susc/discord/discord-bot';

dayjs.extend(utc);
dayjs.extend(timezone);

async function bootstrap() {
  const client = new DiscordBot();
  await client.init();

  client.registerHandler(RegisterCommandHandler);
  client.registerHandler(ConfirmCommandHandler);

  await client.listen();
}

bootstrap();
