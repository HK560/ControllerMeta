import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import VueInspector from 'vite-plugin-vue-inspector';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import pkg from './package.json' with { type: 'json' };

// Build timestamp: prefer CI-injected env var, fall back to local time
const buildTime = process.env.BUILD_TIMESTAMP
  ?? new Date().toISOString().replace('T', ' ').slice(0, 19);

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_TIME__: JSON.stringify(buildTime),
  },
  plugins: [
    vue(), 
    tailwindcss(), 
    viteSingleFile(),
    VueInspector({
      toggleComboKey: 'control-shift',
    }),
    codeInspectorPlugin({
      bundler: 'vite',
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
