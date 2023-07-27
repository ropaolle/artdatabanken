import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  },
});
