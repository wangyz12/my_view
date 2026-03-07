<template>
  <div class="text-[22px] h-full flex items-center cursor-pointer">
    <el-icon @click="()=>{userStore.set_isCollapse(!userStore.isCollapse)}">
      <Fold v-if="!userStore.isCollapse"/>
      <Expand v-else/>
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore()
</script>

<style lang="scss" scoped>
</style>