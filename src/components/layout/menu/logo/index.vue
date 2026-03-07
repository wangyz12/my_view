<template>
    <!-- 上方 Logo 区域，预留插槽便于自定义 -->
    <div class="logo-area cursor-pointer" @click="logcLick">
      <slot name="logo">
        <div class="default-logo">
          <span class="logo-text">Admin</span>
        </div>
      </slot>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['goHome'])
const logcLick = ()=>{
  emit('goHome')
}
</script>