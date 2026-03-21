<template>
  <el-card class="search-card">
    <el-form :model="searchForm" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="账号">
            <el-input 
              v-model="searchForm.account" 
              placeholder="请输入账号" 
              clearable
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="6">
          <el-form-item label="姓名">
            <el-input 
              v-model="searchForm.username" 
              placeholder="请输入姓名" 
              clearable
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="6">
          <el-form-item label="部门">
            <el-cascader
              v-model="searchForm.deptId"
              :options="deptOptions"
              :props="deptProps"
              placeholder="请选择部门"
              style="width: 100%"
              clearable
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select 
              v-model="searchForm.status" 
              placeholder="请选择状态"
              style="width: 100%"
              clearable
            >
              <el-option label="正常" value="0" />
              <el-option label="停用" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="手机号">
            <el-input 
              v-model="searchForm.phone" 
              placeholder="请输入手机号" 
              clearable
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="18">
          <el-form-item label-width="0">
            <div class="search-actions">
              <el-button type="primary" @click="handleSearch">
                <el-icon><Search /></el-icon>搜索
              </el-button>
              <el-button @click="handleReset">
                <el-icon><Refresh /></el-icon>重置
              </el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { Search, Refresh } from '@element-plus/icons-vue'
import type { SearchForm, Dept } from '../hooks/useUserManagement'

interface Props {
  searchForm: SearchForm
  deptOptions: Dept[]
  deptProps: any
  onSearch?: () => void
  onReset?: () => void
}

const props = defineProps<Props>()

// 处理搜索
const handleSearch = () => {
  props.onSearch?.()
}

// 处理重置
const handleReset = () => {
  props.onReset?.()
}
</script>

<style lang="scss" scoped>
.search-card {
  margin-bottom: 20px;
}

.search-actions {
  display: flex;
  gap: 12px;
}
</style>