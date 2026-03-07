<!-- src/components/popup/SignPopup.vue -->
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="width"
    :before-close="handleBeforeClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="showClose"
    :destroy-on-close="true"
    append-to-body
    class="sign-popup-dialog"
    @closed="handleClosed"
  >
    <!-- 弹窗内容区域 -->
    <div class="dialog-content" :style="{ height: height }">
      <!-- 使用原有的弹窗内容组件 -->
      <PopupContent
        ref="popupContentRef"
        :path="path"
        @success="handleContentSuccess"
        @close="handleContentClose"
      />
    </div>
    
    <!-- 底部按钮区域，根据 showFooter 控制是否显示 -->
    <template #footer v-if="showFooter">
      <span class="dialog-footer">
        <el-button @click="handleCancel" :disabled="loading">
          取消
        </el-button>
        <el-button 
          type="primary" 
          @click="handleConfirm" 
          :loading="loading"
        >
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { ElDialog, ElButton } from 'element-plus'
import PopupContent from './index.vue'

// 定义组件的 props
const props = defineProps<{
  // 必填参数
  path: string
  
  // 可选的对话框配置
  title?: string
  width?: string | number
  height?: string | number
  
  // 控制选项
  showFooter?: boolean        // 是否显示底部按钮
  showClose?: boolean         // 是否显示关闭按钮
  modelValue?: boolean        // v-model 绑定值，控制显示/隐藏
  
  // 其他配置
  closeOnClickModal?: boolean // 点击遮罩是否关闭
}>()

// 定义组件的事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success', data: any): void
  (e: 'close'): void
  (e: 'cancel'): void
  (e: 'open'): void
}>()

// 内部状态
const dialogVisible = ref(props.modelValue || false)
const loading = ref(false)
const popupContentRef = ref<InstanceType<typeof PopupContent>>()

// 监听外部 modelValue 的变化
watch(() => props.modelValue, (newVal) => {
  if (newVal !== dialogVisible.value) {
    dialogVisible.value = newVal || false
  }
})

// 监听内部 visible 的变化，同步到外部
watch(dialogVisible, (newVal) => {
  emit('update:modelValue', newVal)
  
  // 触发打开/关闭事件
  if (newVal) {
    emit('open')
  }
})

// 处理对话框关闭前的操作
const handleBeforeClose = (done: () => void) => {
  // 可以在这里添加确认关闭的逻辑
  done()
}

// 处理取消按钮点击
const handleCancel = () => {
  dialogVisible.value = false
  emit('cancel')
}

// 处理确认按钮点击
const handleConfirm = async () => {
  loading.value = true
  try {
    // 如果弹窗内容组件有 submit 方法，可以调用它
    if (popupContentRef.value && 'submit' in popupContentRef.value) {
      await (popupContentRef.value as any).submit()
    } else {
      // 否则直接返回成功
      emit('success', { confirmed: true, path: props.path })
      dialogVisible.value = false
    }
  } catch (error) {
    console.error('确认失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理内容组件的成功事件
const handleContentSuccess = (data: any) => {
  emit('success', data)
  dialogVisible.value = false
}

// 处理内容组件的关闭事件
const handleContentClose = () => {
  dialogVisible.value = false
}

// 处理对话框关闭后的清理
const handleClosed = () => {
  emit('close')
}

// 暴露方法给父组件
defineExpose({
  /**
   * 打开弹窗
   */
  open: () => {
    dialogVisible.value = true
  },
  
  /**
   * 关闭弹窗
   */
  close: () => {
    dialogVisible.value = false
  },
  
  /**
   * 设置加载状态
   */
  setLoading: (status: boolean) => {
    loading.value = status
  }
})
</script>

<style scoped>
.sign-popup-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

.dialog-content {
  overflow: auto;
  min-height: 200px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>