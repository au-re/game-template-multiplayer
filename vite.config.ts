import { defineConfig } from 'vite';
import replace from '@rollup/plugin-replace';
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    host: true,
    port: 8080
  },
  preview: {
    host: true,
    port: 8081
  },
  build: {
    rollupOptions: {
      plugins: [
        react(),
        //  Toggle the booleans here to enable / disable Phaser 3 features:
        replace({
          'typeof CANVAS_RENDERER': "'true'",
          'typeof WEBGL_RENDERER': "'true'",
          'typeof EXPERIMENTAL': "'true'",
          'typeof PLUGIN_CAMERA3D': "'false'",
          'typeof PLUGIN_FBINSTANT': "'false'",
          'typeof FEATURE_SOUND': "'true'"
        })
      ]
    }
  }
});
