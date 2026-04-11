<!-- searchForm/index.vue -->
<template>
  <div class="query-form">
    <el-form :model="formData" :inline="true" label-width="80px" class="query-form-inline">
      <!-- 显示的查询项 -->
      <div class="query-items-container">
        <el-form-item 
          v-for="(item, index) in displayQueryList" 
          :key="item.field"
          :label="item.label"
          class="query-form-item"
        >
          <!-- 插槽类型 -->
          <slot 
            v-if="item.isSlot" 
            :name="item.slotName || item.field"
            :item="item"
            :formData="formData"
            :updateFormData="updateFormData"
          />
          
          <!-- 文本输入 -->
          <el-input 
            v-else-if="item.type === 'text'"
            v-model="formData[item.field]" 
            :placeholder="`请输入${item.label}`"
            clearable
          />
          
          <!-- 远程搜索 -->
          <el-select
            v-else-if="item.type === 'remote'"
            v-model="formData[item.field]"
            :placeholder="`请输入${item.label}进行搜索`"
            filterable
            remote
            :remote-method="(query: string) => handleRemoteSearch(item, query)"
            :loading="remoteLoadingMap[item.field]"
            clearable
            :default-first-option="item.defaultFirstOption || false"
            :reserve-keyword="item.reserveKeyword || false"
          >
            <el-option
              v-for="opt in remoteOptionsMap[item.field] || []"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
          
          <!-- 下拉选择 -->
          <el-select 
            v-else-if="item.type === 'select'"
            v-model="formData[item.field]" 
            :placeholder="`请选择${item.label}`"
            :loading="selectLoadingMap[item.field]"
            clearable
            filterable
            @focus="() => loadSelectData(item)"
          >
            <el-option 
              v-for="opt in selectOptionsMap[item.field] || []" 
              :key="opt.value" 
              :label="opt.label" 
              :value="opt.value"
            />
          </el-select>
          
          <!-- 级联选择 - 修复 change 事件 -->
          <el-cascader 
            v-else-if="item.type === 'cascader'"
            v-model="formData[item.field]" 
            :options="cascaderOptionsMap[item.field] || []"
            :props="getCascaderProps(item)"
            :placeholder="`请选择${item.label}`"
            :loading="cascaderLoadingMap[item.field]"
            clearable
            @change="(value:any) => handleCascaderChange(item.field, value)"
          />
          
          <!-- 日期范围 -->
          <el-date-picker
            v-else-if="item.type === 'daterange'"
            v-model="formData[item.field]"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :style="{ width: '100%' }"
          />
          
          <!-- 默认 -->
          <el-input 
            v-else
            v-model="formData[item.field]" 
            :placeholder="`请输入${item.label}`"
            clearable
          />
        </el-form-item>
      </div>
      
      <!-- 操作按钮 -->
      <div class="query-actions">
        <slot name="extra-buttons" :formData="formData" :handleSearch="handleSearch" :handleReset="handleReset" />
        
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
        
        <el-button 
          v-if="hasMoreItems"
          type="primary" 
          link
          @click="toggleExpand"
        >
          {{ isExpanded ? '收起' : '展开' }}
          <el-icon>
            <component :is="isExpanded ? 'ArrowUp' : 'ArrowDown'" />
          </el-icon>
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useQueryData } from './useQueryData'

const props = defineProps({
  queryList: {
    type: Array as any,
    default: () => []
  },
  modelValue: {
    type: Object,
    default: () => ({})
  },
  columnsPerRow: {
    type: Number,
    default: 3
  },
  defaultExpand: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['search', 'reset', 'update:modelValue'])

// 表单数据
const formData = reactive<any>({})
const isExpanded = ref(props.defaultExpand)

// 使用数据加载逻辑
const {
  cascaderOptionsMap,
  cascaderLoadingMap,
  selectOptionsMap,
  selectLoadingMap,
  selectLoadedMap,
  remoteOptionsMap,
  remoteLoadingMap,
  loadCascaderData,
  loadSelectData,
  handleRemoteSearch,
  clearAllData
} = useQueryData()

// 是否有更多项
const hasMoreItems = computed(() => props.queryList.length > props.columnsPerRow)

// 显示的列表
const displayQueryList = computed(() => {
  if (isExpanded.value) {
    return props.queryList
  } else {
    return props.queryList.slice(0, props.columnsPerRow)
  }
})

// 切换展开
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 更新表单数据（供插槽使用）
const updateFormData = (field: string, value: any) => {
  formData[field] = value
  emit('update:modelValue', { ...formData })
}

// 获取级联选择器配置
const getCascaderProps = (item: any) => {
  const defaultProps = {
    checkStrictly: true,
    value: 'value',
    label: 'label',
    children: 'children',
    emitPath: false
  }
  if (item.lazy) {
    return {
      ...defaultProps,
      lazy: true,
      lazyLoad: (node: any, resolve: any) => {
        handleLazyLoad(item, node, resolve)
      }
    }
  }
  
  if (item.lazy) {
    // 合并配置，确保 value、label、children 字段正确映射
    return { 
      ...defaultProps, 
      ...item.props, 
      emitPath: false,
      // 确保这些字段被正确设置
      value: item.props.value || 'value',
      label: item.props.label || 'label',
      children: item.props.children || 'children'
    }
  }
  return defaultProps
}

// 级联懒加载处理
const handleLazyLoad = async (item: any, node: any, resolve: any) => {
  try {
    const params = node.value ? { parentId: node.value } : {}
    const res = await item.queryApi(params)
    const nodes = res.data || res || []
    
    const formattedNodes = nodes.map((nodeItem: any) => ({
      value: nodeItem[item.props?.value || 'value'],
      label: nodeItem[item.props?.label || 'label'],
      leaf: !nodeItem[item.props?.children || 'children']?.length
    }))
    resolve(formattedNodes)
  } catch (error) {
    console.error('加载级联数据失败:', error)
    resolve([])
  }
}

// 级联选择变化 - 修复：接收 value 参数
const handleCascaderChange = (field: string, value: any) => {
  // 可以在这里处理级联选择的值
  console.log(`${field} 变化:`, value)
  emit('update:modelValue', { ...formData })
}

// 初始化表单数据
const initFormData = () => {
  props.queryList.forEach((item: any) => {
    if (formData[item.field] === undefined) {
      if (item.type === 'daterange') {
        formData[item.field] = []
      } else {
        formData[item.field] = item.defaultValue !== undefined ? item.defaultValue : ''
      }
    }
  })
}

// 初始化所有数据
const initAllData = async () => {
  // 加载级联数据
  for (const item of props.queryList) {
    if (item.type === 'cascader' && !item.lazy) {
      await loadCascaderData(item)
    }
  }
  
  // 加载非懒加载的下拉数据
  for (const item of props.queryList) {
    if (item.type === 'select' && !item.lazy && !item.isSlot) {
      await loadSelectData(item)
    }
  }
}

// 重置并初始化
const resetAndInit = async () => {
  // 清空表单
  Object.keys(formData).forEach(key => {
    delete formData[key]
  })
  
  // 清空缓存数据
  clearAllData()
  
  // 重新初始化
  initFormData()
  await initAllData()
}

// 搜索
const handleSearch = () => {
  const searchData = { ...formData }
  Object.keys(searchData).forEach(key => {
    if (searchData[key] === '' || searchData[key] === null || searchData[key] === undefined) {
      delete searchData[key]
    }
  })
  emit('search', searchData)
}

// 重置
const handleReset = () => {
  Object.keys(formData).forEach(key => {
    const queryItem = props.queryList.find((item: any) => item.field === key)
    if (queryItem?.type === 'daterange') {
      formData[key] = []
    } else if (queryItem?.defaultValue !== undefined) {
      formData[key] = queryItem.defaultValue
    } else {
      formData[key] = ''
    }
  })
  emit('reset')
  handleSearch()
}

// 监听外部传入的值
watch(() => props.modelValue, (newVal) => {
  if (newVal && Object.keys(newVal).length) {
    Object.assign(formData, newVal)
  }
}, { deep: true, immediate: true })

// 监听queryList变化
let initTimer: any = null
watch(() => props.queryList, () => {
  if (initTimer) clearTimeout(initTimer)
  initTimer = setTimeout(async () => {
    await resetAndInit()
  }, 100)
}, { deep: true })

// 组件挂载
onMounted(async () => {
  initFormData()
  await initAllData()
})

// 组件卸载
onBeforeUnmount(() => {
  if (initTimer) clearTimeout(initTimer)
})

// 暴露方法
defineExpose({
  resetAndInit,
  handleSearch,
  handleReset,
  formData,
  updateFormData
})
</script>

<style scoped lang="scss">
.query-form {
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 15px;
  
  .query-form-inline {
    display: flex;
    flex-direction: column;
    
    .query-items-container {
      display: grid;
      grid-template-columns: repeat(v-bind(columnsPerRow), 1fr);
      gap: 0 16px;
      flex: 1;
      
      .query-form-item {
        margin-bottom: 16px;
        margin-right: 0;
        
        :deep(.el-form-item__content) {
          width: 100%;
        }
        
        :deep(.el-input),
        :deep(.el-select),
        :deep(.el-cascader),
        :deep(.el-date-editor) {
          width: 100%;
        }
      }
    }
    
    .query-actions {
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: flex-end;
      margin-top: 0;
      
      .el-button {
        margin-left: 0;
        
        & + .el-button {
          margin-left: 0;
        }
      }
      
      .el-button--link {
        padding: 8px 0;
        
        .el-icon {
          margin-left: 4px;
        }
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .query-form .query-form-inline .query-items-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .query-form .query-form-inline .query-items-container {
    grid-template-columns: 1fr;
  }
}
</style>