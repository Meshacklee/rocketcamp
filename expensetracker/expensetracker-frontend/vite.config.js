// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic', // or just ensure proper setup
    })
  ],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/
  }
});