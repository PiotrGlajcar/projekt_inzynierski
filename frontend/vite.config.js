import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: { sourcemap: true },
  server: {
    proxy: {
      "/oauth": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
