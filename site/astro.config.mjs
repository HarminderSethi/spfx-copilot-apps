// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pnp.github.io',
  base: '/spfx-copilot-components',
  trailingSlash: 'always',
  integrations: [sitemap()],
});