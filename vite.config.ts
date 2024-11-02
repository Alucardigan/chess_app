import { defineConfig
  , loadEnv
   } from 'vite'
  
  export default defineConfig
  (({ command, mode}) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env= loadEnv(mode, process.cwd(), '')
    return defineConfig({
      server: {
          host: "0.0.0.0",
          port: 3000,
          proxy: {
              "/api": {
                  target: env.VITE_BACKEND_TARGET,
                  changeOrigin: true
              }
          }
      }
    });
  })