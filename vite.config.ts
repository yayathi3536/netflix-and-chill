import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({ command }) => {
  // Determine base path:
  // - In local development (command === 'serve'), always use root '/'
  // - In production build, use process.env.VITE_BASE_PATH (ensuring leading & trailing slash) or fallback to '/'
  const rawBasePath = process.env.VITE_BASE_PATH;
  let basePath = '/';

  if (command === 'build' && rawBasePath && rawBasePath.trim() !== '') {
    const trimmed = rawBasePath.trim();
    if (trimmed === '.' || trimmed === './') {
      basePath = './';
    } else {
      basePath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
      if (!basePath.endsWith('/')) {
        basePath = `${basePath}/`;
      }
    }
  }

  return {
    base: basePath,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.', '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
