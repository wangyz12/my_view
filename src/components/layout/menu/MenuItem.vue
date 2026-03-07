<template>
  <!-- 如果有子菜单且类型为菜单，并且不隐藏，则渲染为 el-sub-menu -->
  <el-sub-menu
    v-if="hasChildren && menuItem.type === 'menu' && !menuItem.hidden"
    :index="resolvePath(menuItem.path)"
    :key="`sub-${menuItem.id}`"  
  >
    <template #title>
      <el-icon v-if="menuItem.icon">
        <component :is="menuItem.icon" />
      </el-icon>
      <span>{{ menuItem.title }}</span>
    </template>

    <!-- 递归渲染子项 -->
    <MenuItem
      v-for="child in menuItem.children"
      :key="`item-${child.id}`" 
      :menu-item="child"
      :base-path="resolvePath(child.path)"
    />
  </el-sub-menu>

  <!-- 叶子菜单项（没有子菜单）且不隐藏，且类型为菜单 -->
  <el-menu-item
    v-else-if="!menuItem.hidden && menuItem.type === 'menu'"
    :index="resolvePath(menuItem.path)"
    :key="menuItem.id"
  >
    <el-icon v-if="menuItem.icon">
      <component :is="menuItem.icon" />
    </el-icon>
    <template #title>
      <span>{{ menuItem.title }}</span>
    </template>
  </el-menu-item>
  <!-- 其他类型（如按钮）暂不渲染，可根据需要扩展 -->
</template>

<script setup lang="ts">
import { computed } from 'vue'
defineOptions({
  name: 'MenuItem'
})
const props = defineProps<{
  menuItem: any // 菜单项数据
  basePath?: string // 父级路径，用于拼接
}>()

// 判断是否有子菜单（且子菜单长度大于0）
const hasChildren = computed(() => {
  return props.menuItem.children && props.menuItem.children.length > 0
})

// 拼接完整的路径，用于 el-menu-item / el-sub-menu 的 index
const resolvePath = (routePath?: string): string => {
  // 如果没有传入路径，则返回 basePath
  if (!routePath) return props.basePath || ''

  // 外部链接直接返回
  if (props.menuItem.external) return routePath

  // 如果是绝对路径（以 / 开头），直接返回
  if (routePath.startsWith('/')) return routePath

  // 如果是 http 等协议开头，直接返回
  if (/^(https?:|mailto:|tel:)/.test(routePath)) return routePath

  // 否则，拼接 basePath 和 routePath，并去除多余的斜杠
  const base = props.basePath || ''
  // 如果 base 以 / 结尾，去掉它
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base
  // 如果 routePath 以 / 开头，已经在上面处理过了，所以这里直接拼接
  return cleanBase ? `${cleanBase}/${routePath}` : routePath
}
</script>