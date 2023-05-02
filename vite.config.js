import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    port: 8080
  },
  build: {
    lib: {
      // the entry file that is loaded whenever someone imports
      // your plugin in their app
      entry: 'src/kirbyRestApiVuePlugin/index.js',

      // the exposed global variable
      // is required when formats includes 'umd' or 'iife'
      name: 'KirbyRestApiVuePlugin',

      // the proper extensions will be added, ie:
      // name.js (es module)
      // name.umd.cjs) (common js module)
      // default fileName is the name option of package.json
      fileName: 'index',
      sourcemap: 'hidden',
    },
    rollupOptions: {

      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
