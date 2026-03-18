<template>
  <el-card class="search-card">
    <el-form :model="searchForm" inline>
      <el-form-item label="关键词">
        <el-input
          v-model="searchForm.keyword"
          placeholder="账号/姓名/手机号"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item label="部门">
        <el-cascader
          v-model="searchForm.deptId"
          :options="deptOptions"
          :props="deptProps"
          placeholder="选择部门"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="全部" style="width: 200px" clearable>
          <el-option label="正常" value="0" />
          <el-option label="停用" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { useDeptTree, type Dept } from '../hooks/useDeptTree'

interface SearchForm {
  keyword: string
  deptId: string | string[]
  status: string
}

interface Props {
  searchForm: SearchForm
  deptOptions: Dept[]
}

interface Emits {
  (e: 'update:searchForm', form: SearchForm): void
  (e: 'search'): void
  (e: 'reset'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { processDeptId } = useDeptTree()

// 部门选择器配置
const deptProps = {
  value: 'id',
  label: 'name',
  children: 'children',
  checkStrictly: true
}

// 搜索
const handleSearch = () => {
  emit('search')
}

// 重置搜索
const resetSearch = () => {
  emit('update:searchForm', {
    keyword: '',
    deptId: '',
    status: ''
  })
  emit('reset')
}
</script>

<style lang="scss" scoped>
.search-card {
  margin-bottom: 20px;
}
</style>