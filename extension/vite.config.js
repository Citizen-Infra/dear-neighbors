import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [preact()],
  base: '',
  build: {
    rollupOptions: {
      input: {
        newtab: resolve(__dirname, 'src/newtab.html'),
        popup: resolve(__dirname, 'src/popup.html'),
      },
    },
    outDir: 'dist',
  },
});
