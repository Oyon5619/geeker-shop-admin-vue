import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { visualizer } from "rollup-plugin-visualizer";

import path from "path";

// Naive UI 组件按需引入
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

// 配置TailwindCss
import TailwindCssVite from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const { VITE_BASE_URL, VITE_PROXY_API } = env;

  return {
    base: VITE_BASE_URL,
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
      visualizer({
        open: true, // 打包后自动代开分析图
        filename: "./distAnalyse/visualizer.html",
        gzipSize: true, // 显示gzip压缩大小
        brotliSize: true, // 显示brotliSize压缩大小
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src/"),
      },
      extensions: [".js", ".ts", ".vue"],
    },
    server: {
      proxy: {
        "/api": {
          target: VITE_PROXY_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    // Optimization
    build: {
      // sourcemap: true,
      rolldownOptions: {
        output: {
          // 静态文件按类型分包
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
          codeSplitting: {
            groups: [
              {
                name: "vue-vendor",
                test: /node_modules[\\/]vue/,
                priority: 20,
              },
              {
                name: "ui-vendor",
                test: /node_modules[\\/]naive-ui/,
                priority: 15,
              },
              {
                name: "vender",
                test: /node_modules/,
                priority: 10,
              },
              {
                name: "common",
                minShareCount: 2,
                minSize: 10000,
                priority: 5,
              },
            ],
          },
        },
      },
    },
  };
});
