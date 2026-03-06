import { createApp } from 'vue'
import App from './App.vue'
// 1. 引入 Element Plus 核心库和样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 2. 可选：引入所有图标（如果安装了图标库）
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import pinia from '@/store'
import '@/styles/index.scss'
import router from '@/router/index'
const app = createApp(App)
// 使用路由
app.use(router)
app.use(ElementPlus)
// 4. 可选：全局注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(pinia)
app.use(ElementPlus, {
  locale: zhCn,
})
// 5. 挂载应用
app.mount('#app')