import { Plugin } from 'vite';
import path from 'path';

/**
 * 自动为 Vue 组件添加 name 属性
 * 用于路由缓存，避免手动写 defineOptions
 * 
 * 转换示例：
 * <script setup> → <script setup name="ComponentName">
 * <script setup lang="ts"> → <script setup lang="ts" name="ComponentName">
 */
const autoSetScriptName = (): Plugin => {
  return {
    name: 'vite-plugin-auto-set-name',
    enforce: 'pre',
    transform(code, id) {
      // 只处理 .vue 文件，排除 node_modules
      if (!/\.vue$/.test(id) || /node_modules/.test(id)) {
        return code;
      }

      // 检查是否已经手动定义了 name
      if (hasManualName(code)) {
        return code;
      }

      const fileName = path.basename(id, '.vue');
      const componentName = toPascalCase(fileName);

      // 匹配 <script setup> 标签（支持各种属性组合）
      const newCode = addNameToScriptSetup(code, componentName);
      
      if (newCode !== code) {
        // console.log(`[auto-set-name] ${fileName} -> ${componentName}`);
      }
      
      return newCode;
    },
  };
};

/**
 * 检查是否已经手动定义了组件名
 */
function hasManualName(code: string): boolean {
  // 检查 defineOptions
  if (code.includes('defineOptions')) {
    // 简单检查 defineOptions 中是否有 name
    const defineOptionsMatch = code.match(/defineOptions\(\s*{\s*name\s*:/);
    if (defineOptionsMatch) return true;
  }
  
  // 检查 <script> 标签上的 name 属性
  if (/<script[^>]*\s+name\s*=\s*["'][^"']*["']/.test(code)) {
    return true;
  }
  
  return false;
}

/**
 * 为 <script setup> 标签添加 name 属性
 */
function addNameToScriptSetup(code: string, componentName: string): string {
  // 匹配 <script setup ...> 标签
  // 支持：lang="ts", scoped, 等各种属性
  const scriptSetupRegex = /<script\s+setup\s+([^>]*?)>/i;
  const match = code.match(scriptSetupRegex);
  
  if (!match) return code;
  
  const fullTag = match[0];
  const attributes = match[1] || '';
  
  // 检查是否已经有 name 属性
  if (/\bname\s*=\s*["'][^"']*["']/.test(attributes)) {
    return code;
  }
  
  // 构建新标签
  let newTag: string;
  if (attributes.trim()) {
    newTag = `<script setup ${attributes} name="${componentName}">`;
  } else {
    newTag = `<script setup name="${componentName}">`;
  }
  
  return code.replace(fullTag, newTag);
}

/**
 * 将文件名转换为 PascalCase 格式
 * 
 * 转换示例：
 * - user-list.vue -> UserList
 * - user_list.vue -> UserList
 * - userList.vue -> UserList
 * - user.vue -> User
 * - userAPI.vue -> UserApi
 * - user-api.vue -> UserApi
 */
function toPascalCase(str: string): string {
  // 先处理连字符和下划线
  let result = str.replace(/[-_]/g, ' ');
  
  // 处理连续大写的情况（如 API -> Api, ID -> Id）
  // 这样 userAPI.vue 会变成 UserApi 而不是 UserAPI
  result = result.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
  result = result.replace(/([a-z\d])([A-Z])/g, '$1 $2');
  
  // 转换为 PascalCase
  result = result
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
  
  return result;
}

export default autoSetScriptName;