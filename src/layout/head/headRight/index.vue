<template>
  <div class="flex items-center gap-4">
    <theme-settings />
    <user-info />
  </div>
</template>

<script setup lang="ts">
import UserInfo from './userInfo.vue';
import ThemeSettings from '@/components/ThemeSettings/index.vue';
</script>

<style lang="scss" scoped>
</style>