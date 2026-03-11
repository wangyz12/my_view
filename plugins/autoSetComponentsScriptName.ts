import { Plugin } from 'vite';
import path from 'path';

const autoSetScriptName = (): Plugin => {
  return {
    name: 'auto-set-component-name',
    // 关键：在 Vue 插件之前执行
    enforce: 'pre',
    transform(code, id) {
      if (/\.vue$/.test(id) && !/node_modules/.test(id)) {
        console.log('处理原始Vue文件:', id);
        
        const fileName = path.basename(id, '.vue');
        const componentName = toPascalCase(fileName);

        // 检查是否已经有 name 定义
        if (code.includes('defineOptions') || /<script[^>]*\s+name=/.test(code)) {
          return code;
        }

        // 匹配原始 <script setup> 标签
        const scriptSetupRegex = /<script\s+setup\s*([^>]*?)>/i;
        const match = code.match(scriptSetupRegex);

        if (match) {
          const fullTag = match[0];
          const attributes = match[1] || '';
          
          // 添加 name 属性
          let newTag;
          if (attributes.trim()) {
            newTag = `<script setup ${attributes} name="${componentName}">`;
          } else {
            newTag = `<script setup name="${componentName}">`;
          }
          
          console.log('原始标签:', fullTag);
          console.log('新标签:', newTag);
          
          return code.replace(fullTag, newTag);
        }
      }
      return code;
    },
  };
};

function toPascalCase(str: string): string {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\s+/g, '');
}

export default autoSetScriptName;