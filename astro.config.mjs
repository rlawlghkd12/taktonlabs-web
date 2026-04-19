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
          'infinity',
          'unlock',
          'receipt',
          'package',
          'headphones',
          // Tutomate mockup (실제 앱과 동일)
          'layout-dashboard',
          'book-open',
          'users',
          'calendar',
          'circle-dollar-sign',
          'settings',
          'search',
          'bell',
        ],
      },
    }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
