import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',
  adapter: netlify(),
  vite: {
    ssr: {
      // This tells the bundler: "Don't try to build these, 
      // they will be provided by the server environment."
      external: [
        '@google/generative-ai',
        '@supabase/supabase-js'
      ]
    },
    optimizeDeps: {
      // Helps local development on Windows
      exclude: [
        '@google/generative-ai', 
        '@supabase/supabase-js'
      ]
    }
  }
});