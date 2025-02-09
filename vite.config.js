import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',  // Este es el alias correcto
    },
  },
  plugins: [vue()],
});
