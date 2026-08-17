import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      // Defines the entry point of your core logic
      entry: resolve(import.meta.dirname, 'src/social-share-button.js'),
      name: 'SocialShareButton',
      // This will automatically output both .js (ESM) and .umd.cjs (CJS) files
      fileName: (format) => `social-share-button.${format}.js`,
    },
    outDir: 'dist', // The folder where compiled files will go
    rollupOptions: {
      // If your component has external dependencies, add them here
      external: [], 
      output: {
        globals: {
          // Provide global variables to use in the UMD build for externalized deps
        },
      },
    },
  },
});
