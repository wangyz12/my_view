<template>
  <el-form>
    <el-form-item label="选择角色">
      <el-select
        v-model="localSelectedRoleIds"
        multiple
        placeholder="请选择角色"
        style="width: 100%"
      >
        <el-option
          v-for="role in roleOptions"
          :key="role.id"
          :label="role.label"
          :value="role.id"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Role } from '../hooks/useUserManagement'

interface Props {
  roleOptions: Role[]
  selectedRoleIds: string[]
}

interface Emits {
  (e: 'update:selectedRoleIds', ids: string[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 使用 computed 实现双向绑定
const localSelectedRoleIds = computed({
  get: () => props.selectedRoleIds,
  set: (value) => emit('update:selectedRoleIds', value)
})
</script>

<style lang="scss" scoped>
:deep(.el-form-item) {
  margin-bottom: 0;
}
</style>