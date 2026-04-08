// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://taktonlabs.com',
  integrations: [
    icon({
      include: {
        lucide: [
          'layout-grid',
          'app-window',
          'blocks',
          'mail',
          'send',
          'arrow-right',
          'arrow-up-right',
          'chevron-down',
          'check',
        ],
      },
    }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
