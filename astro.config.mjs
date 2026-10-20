import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  output: 'static',
  adapter: cloudflare({
    imageService: 'passthrough',
    // workerd needs glibc 2.35 or newer. Keep local dev on Node.
    platformProxy: {
      enabled: false,
    },
  }),
});
