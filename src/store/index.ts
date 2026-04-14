import { createPinia } from 'pinia'
// 可选：导入持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 创建 Pinia 实例
const pinia = createPinia()

// 可选：注册持久化插件（实现状态持久化）
pinia.use(piniaPluginPersistedstate)

export default pinia