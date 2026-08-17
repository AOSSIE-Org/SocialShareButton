import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: path.resolve(import.meta.dirname, 'src/social-share-button.js'),
      name: 'SocialShareButton',
      formats: ['es', 'umd'],
      fileName: (format) => format === 'es' 
        ? 'social-share-button.es.js' 
        : 'social-share-button.umd.cjs',
      cssFileName: 'style'
    },
    rollupOptions: {
      external: ['preact', '@builder.io/qwik', 'react'],
      output: {
        globals: {
          preact: 'Preact',
          '@builder.io/qwik': 'Qwik',
          react: 'React'
        }
      }
    }
  }
});
