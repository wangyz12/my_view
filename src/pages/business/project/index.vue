<!-- pages/system/user/index.vue -->
<template>
  <PageLayout type="table" :padding="true">
    <!-- 搜索表单 -->
    <template #search>
      <el-card shadow="never">
        <el-form :inline="true" :model="form">
          <el-form-item label="用户名">
            <el-input v-model="form.username" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="form.phone" placeholder="请输入" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary">搜索</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </template>
    
    <!-- 表格内容 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="flex justify-between items-center">
          <span>用户列表</span>
          <el-button type="primary" size="small">新增</el-button>
        </div>
      </template>
      
      <el-table 
        :data="[]" 
        height="100%"
        border
        stripe
      >
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="dept" label="部门" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default>
            <el-button link type="primary">编辑</el-button>
            <el-button link type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 分页 -->
    <template #footer>
      <div class="flex justify-end">
      </div>
    </template>
  </PageLayout>
</template>

<script setup lang="ts">
import PageLayout from '@/components/PageLayout/index.vue'
const form = ref<any>({})
// ... 其他代码
</script>

<style lang="scss" scoped>
.table-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}
</style>