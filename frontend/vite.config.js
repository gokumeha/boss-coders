import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const rootDirectory = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(rootDirectory, '../shared'),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(rootDirectory, '..')],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three';
          }

          if (id.includes('node_modules/firebase')) {
            return 'firebase';
          }

          if (id.includes('node_modules/react-router')) {
            return 'router';
          }

          if (id.includes('node_modules/react')) {
            return 'react-vendor';
          }

          return undefined;
        },
      },
    },
  },
});
