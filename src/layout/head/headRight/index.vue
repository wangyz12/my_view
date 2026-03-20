<template>
  <div class="flex items-center gap-4">
    <menu-search />
    <fullscreen-toggle 
      :show-text="false"
      :show-shortcut-hint="false"
      :is-circle="true"
    />
    <theme-settings />
    <user-info />
  </div>
</template>

<script setup lang="ts">
import UserInfo from './userInfo.vue';
import ThemeSettings from '@/components/ThemeSettings/index.vue';
import FullscreenToggle from '@/components/FullscreenToggle/index.vue';
import MenuSearch from '@/components/MenuSearch/index-simple.vue';
</script>

<style lang="scss" scoped>
</style>