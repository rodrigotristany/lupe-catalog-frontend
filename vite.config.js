import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
      '/media': {
        target: 'http://localhost:9000',
        rewrite: (path) => path.replace(/^\/media/, '/lupe-media'),
      },
    },
  },
});
