import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

/** @type {import('astro').AstroUserConfig} */
const config = {
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  output: 'server'
};

export default config;
