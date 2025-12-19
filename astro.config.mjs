import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',
  adapter: netlify(),
  vite: {
    ssr: {
      // Line 68 Fix: Explicitly externalize the AI SDK
      external: ['@google/generative-ai']
    },
    optimizeDeps: {
      // Improves local dev stability on Windows
      exclude: ['@google/generative-ai']
    }
  }
});