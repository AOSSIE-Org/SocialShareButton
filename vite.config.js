import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/social-share-button.js'),
      name: 'SocialShareButton',
      formats: ['es', 'umd'],
      fileName: (format) => format === 'es' 
        ? `social-share-button.es.js` 
        : `social-share-button.umd.cjs`,
    },
    rollupOptions: {
      external: [], 
      output: {
        globals: {},
      },
    },
  },
});
