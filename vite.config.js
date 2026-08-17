import { defineConfig, build } from 'vite';
import path from 'path';
import fs from 'fs';

const entries = {
  'social-share-button': path.resolve(import.meta.dirname, 'src/social-share-button.js'),
  'social-share-button-preact': path.resolve(import.meta.dirname, 'src/social-share-button-preact.jsx'),
  'social-share-button-qwik': path.resolve(import.meta.dirname, 'src/social-share-button-qwik.tsx'),
  'social-share-button-react': path.resolve(import.meta.dirname, 'src/social-share-button-react.jsx')
};

export default defineConfig({
  plugins: [
    {
      name: 'multi-build-trigger',
      async closeBundle() {
        if (process.env.VITE_INTERNAL_BUILD) return;
        process.env.VITE_INTERNAL_BUILD = 'true';

        for (const [name, entryPath] of Object.entries(entries)) {
          await build({
            configFile: false,
            build: {
              emptyOutDir: false,
              lib: {
                entry: entryPath,
                name: 'SocialShareButton',
                formats: ['es', 'umd'],
                fileName: (format) => format === 'es' ? `${name}.es.js` : `${name}.umd.cjs`,
                cssFileName: 'style'
              },
              rollupOptions: {
                external: ['preact', '@builder.io/qwik', 'react'],
                output: {
                  exports: 'named',
                  globals: {
                    preact: 'Preact',
                    '@builder.io/qwik': 'Qwik',
                    react: 'React'
                  }
                }
              }
            }
          });
        }

        const tempFile = path.resolve(import.meta.dirname, 'dist/temporary.js');
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
      }
    }
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: entries['social-share-button'],
      name: 'SocialShareButton',
      formats: ['es'],
      fileName: () => 'temporary.js'
    }
  }
});
