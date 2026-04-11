<template>
  <div class="pagination-container">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  page: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 20
  },
  total: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:page', 'update:pageSize', 'change'])

const currentPage = computed({
  get: () => props.page,
  set: (val) => emit('update:page', val)
})

const pageSize = computed({
  get: () => props.pageSize,
  set: (val) => emit('update:pageSize', val)
})

const handleSizeChange = (val: number) => {
  emit('update:pageSize', val)
  emit('change', { page: currentPage.value, pageSize: val })
}

const handleCurrentChange = (val: number) => {
  emit('update:page', val)
  emit('change', { page: val, pageSize: pageSize.value })
}
</script>

<style scoped lang="scss">
.pagination-container {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  border-radius: 4px;
}
</style>