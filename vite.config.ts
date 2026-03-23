import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import autoSetScriptName from './plugins/autoSetComponentsScriptName'
// 关键：导入 path 模块（Node.js 内置，需安装 @types/node 确保 TS 识别）
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173, // 设置开发服务器端口（可选）
    open: false, // 启动后自动打开浏览器
    // 新增：配置代理
    proxy: {
      // 代理所有以 /api 开头的请求
      '/api': {
        target: 'https://47.102.196.166',  // 服务器地址
        changeOrigin: true,                // 支持跨域
        secure: false,                     // 忽略自签名证书错误
        rewrite: (path) => path,           // 保留 /api 前缀
        // 可选：查看代理日志
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        }
      }
    },
  },
  // 配置路径别名
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // @ 指向项目根目录下的 src 文件夹
    },
  },
  // SCSS 全局配置
  css: {
    preprocessorOptions: {
      scss: {
        // 自动导入全局变量文件（多个文件用 ; 分隔）
        additionalData: `
            @use "@/styles/variables.scss" as *;
            @use "@/styles/mixins.scss" as *;
          `,
        // 关闭 deprecated 警告（可选）
        quietDeps: true,
      },
    },
  },
  plugins: [
    vue({
      script: {
        // 启用 defineModel 支持
        defineModel: true,
        // 启用 props 解构支持
        propsDestructure: true,
        // 支持 script setup 上的 name 属性
      }
    }),
    AutoImport({
      // 1. 配置自动导入 Vue 核心 API（ref、reactive、onMounted 等）
      imports: [
        "vue", // 自动导入 Vue 的所有 API
        "vue-router", // 可选：如果用了 vue-router，也自动导入
      ],
      // 2. 配置 Element Plus 自动导入（保留之前的）
      resolvers: [ElementPlusResolver()],
      // 3. 生成自动导入的类型声明文件（关键：解决 TS 类型提示）
      dts: "src/auto-imports.d.ts",
      // 可选：关闭 eslint 报错（如果 eslint 提示未定义）
      eslintrc: {
        enabled: true, // 生成 .eslintrc-auto-import.json 文件
      },
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    autoSetScriptName(),
  ],
});