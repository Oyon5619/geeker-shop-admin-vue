import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import path from "path";

// Naive UI 组件按需引入
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

// 配置TailwindCss
import TailwindCssVite from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    TailwindCssVite(),
    AutoImport({
      imports: [
        "vue",
        {
          "naive-ui": [
            "useDialog",
            "useMessage",
            "useNotification",
            "useLoadingBar",
          ],
        },
      ],
    }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
    },
    extensions: [".js", ".ts", ".vue"],
  },
});
