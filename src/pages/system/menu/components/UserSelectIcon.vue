<template>
  <div>
    <div style="margin-bottom: 15px;">
      <el-input v-model="iconSearch" placeholder="搜索图标..." clearable @input="filterIcons" @clear="filterIcons">
        
      </el-input>
    </div>
    <div style="max-height: 400px; overflow-y: auto;">
      <div v-if="filteredIcons.length === 0" style="text-align: center; padding: 20px; color: #999;">
        未找到匹配的图标
      </div>
      <div v-else style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px;">
        <div 
          v-for="icon in filteredIcons" 
          :key="icon" 
          :class="['icon-item', { 'selected': selectedIcon === icon }]"
          @click="selectIcon(icon)"
          style="padding: 10px; text-align: center; cursor: pointer; border-radius: 4px; border: 1px solid #e4e7ed;"
          @mouseenter="(e:any) => e.currentTarget.style.borderColor = '#409eff'"
          @mouseleave="(e:any) => e.currentTarget.style.borderColor = selectedIcon === icon ? '#409eff' : '#e4e7ed'"
        >
          <el-icon :size="24">
            <component :is="iconComponents[icon]" />
          </el-icon>
          <div style="font-size: 12px; margin-top: 5px; word-break: break-all;">{{ icon }}</div>
        </div>
      </div>
    </div>
    <footer>
      <div class="flex justify-center mt-5">
        <el-button size="default" @click="emit('close')">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const emit = defineEmits<{
  (e: 'success', data: any): void
  (e: 'close'): void
}>()
const iconComponents:any = markRaw(ElementPlusIconsVue)
// 直接从 Element Plus 获取所有图标名称, ToDo 可以自己进行添加
const allIcons = Object.keys(ElementPlusIconsVue as any).filter(key => 
  key !== 'install' && typeof (ElementPlusIconsVue as any)[key] === 'object'
)

const iconSearch = ref('')
const selectedIcon = ref('')
const filteredIcons = ref([...allIcons])

const filterIcons = () => {
  if (!iconSearch.value) {
    filteredIcons.value = [...allIcons]
  } else {
    filteredIcons.value = allIcons.filter(icon =>
      icon.toLowerCase().includes(iconSearch.value.toLowerCase())
    )
  }
}
const selectIcon = (icon: string) => {
  selectedIcon.value = icon
  iconSearch.value = ''
  filterIcons()
}
const onSubmit = ()=>{
  emit('success',selectedIcon.value)
}
</script>