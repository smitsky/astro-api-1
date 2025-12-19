import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',
  adapter: netlify(),
  vite: {
    ssr: {
      // This tells Vite not to bundle this package
      external: ['@google/generative-ai']
    },
    optimizeDeps: {
      // This helps local development stability
      exclude: ['@google/generative-ai']
    }
  }
});