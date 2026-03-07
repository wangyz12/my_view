// env.d.ts（根目录）
/// <reference types="vite/client" />

// 声明 Element Plus 语言包模块
declare module 'element-plus/dist/locale/zh-cn.mjs'

// 声明环境变量类型
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}