import { APIEmbed } from 'discord.js';

type EmbeddedReply = {
  embeds: APIEmbed[];
};

export const ErrorReply = (message: string, title?: string): EmbeddedReply => {
  return {
    embeds: [
      {
        color: 0xed2939,
        title: title ?? '🚨 처리 중에 문제가 발생했어요!',
        description: message,
      },
    ],
  };
};
