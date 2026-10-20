/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<{
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
}>;

declare namespace App {
  interface Locals extends Runtime {}
}
