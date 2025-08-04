import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

import vue from '@vitejs/plugin-vue';
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/

export default defineConfig(() => {
  return {
    base: '/spa-geo/',
    plugins: [
      vue(),
      tailwindcss(),
      // vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    optimizeDeps: {
      include: ['@turf/turf'],
    },
    server: {
      proxy: {
        '/api/nominatim': {
          target: 'https://nominatim.openstreetmap.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/nominatim/, ''),
          secure: false,
          headers: {
            'User-Agent': 'SPA Polygons map',
          },
        },
      },
    },
  };
});
