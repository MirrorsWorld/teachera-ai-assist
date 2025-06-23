import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    proxy: {
      '/api': {
        target: 'https://www.gxxuetu.cn/',
        // target: 'http://localhost:8000/',
        // target: 'http://106.52.162.78:8001/',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // '/chat/stream': {
      //   target: 'http://127.0.0.1:8080',
      //   changeOrigin: true,
      // },
    },
    host: "::",
    port: 8000,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
