import { createApp } from 'vue';
import App from './App.vue';
// 1. 引入 Element Plus 核心库和样式
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// 2. 可选：引入所有图标（如果安装了图标库）
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import pinia from '@/store';
import '@/styles/index.scss';
import { setupRouter } from '@/utils/router';
import { useThemeStore } from '@/store/modules/theme';
import moment from 'moment';
window.moment = moment;
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(pinia);

// 初始化主题设置
const themeStore = useThemeStore();
themeStore.setThemeColor(themeStore.themeColor);

app.use(ElementPlus, {
  locale: zhCn,
});
// 保持路由
setupRouter(app).then(() => {
  // 5. 挂载应用
  app.mount('#app');
});
