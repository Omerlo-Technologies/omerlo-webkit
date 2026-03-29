import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { watch } from 'vite-plugin-watch';

export default defineConfig({
  plugins: [
    sveltekit(),
    watch({
      pattern: '../src/**/*.{ts,svelte}',
      command: 'cd .. && npm run package'
    })
  ]
});
