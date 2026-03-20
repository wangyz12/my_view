<template>
  <div class="loading-demo">
    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>Loading 演示页面</span>
        </div>
      </template>
      
      <div class="demo-content">
        <p>这个页面演示了新的顶部导航进度条效果。</p>
        <p>点击下面的按钮可以模拟数据加载：</p>
        
        <div class="button-group">
          <el-button type="primary" @click="simulateFastLoad">
            快速加载 (0.5秒)
          </el-button>
          <el-button type="success" @click="simulateNormalLoad">
            正常加载 (2秒)
          </el-button>
          <el-button type="warning" @click="simulateSlowLoad">
            慢速加载 (5秒)
          </el-button>
          <el-button type="danger" @click="simulateErrorLoad">
            错误加载 (3秒后失败)
          </el-button>
        </div>
        
        <div class="table-demo" style="margin-top: 30px;">
          <p>表格加载演示：</p>
          <el-table
            v-loading="tableLoading"
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="age" label="年龄" width="80" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="address" label="地址" />
          </el-table>
          
          <div style="margin-top: 20px;">
            <el-button @click="loadTableData" :loading="tableLoading">
              加载表格数据
            </el-button>
            <el-button @click="clearTableData">
              清空表格
            </el-button>
          </div>
        </div>
        
        <div class="explanation" style="margin-top: 40px; padding: 20px; background: #f5f7fa; border-radius: 8px;">
          <h3>修改说明：</h3>
          <p>1. 移除了全屏的 ElLoading，改为顶部导航进度条</p>
          <p>2. 进度条在路由跳转和API请求时都会显示</p>
          <p>3. 表格仍然保留自己的 loading 状态，但不会与全屏 loading 冲突</p>
          <p>4. 进度条支持成功（绿色）和失败（红色）两种状态</p>
          <p>5. 多个请求会合并显示一个进度条</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const tableLoading = ref(false)
const tableData = ref<any[]>([])

// 模拟快速加载
const simulateFastLoad = () => {
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
    ElMessage.success('快速加载完成！')
  }, 500)
}

// 模拟正常加载
const simulateNormalLoad = () => {
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
    ElMessage.success('正常加载完成！')
  }, 2000)
}

// 模拟慢速加载
const simulateSlowLoad = () => {
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
    ElMessage.warning('慢速加载完成！')
  }, 5000)
}

// 模拟错误加载
const simulateErrorLoad = () => {
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
    ElMessage.error('加载失败！')
  }, 3000)
}

// 加载表格数据
const loadTableData = () => {
  tableLoading.value = true
  tableData.value = []
  
  // 模拟API请求
  setTimeout(() => {
    tableData.value = [
      { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com', address: '北京市朝阳区' },
      { id: 2, name: '李四', age: 30, email: 'lisi@example.com', address: '上海市浦东新区' },
      { id: 3, name: '王五', age: 28, email: 'wangwu@example.com', address: '广州市天河区' },
      { id: 4, name: '赵六', age: 35, email: 'zhaoliu@example.com', address: '深圳市南山区' },
      { id: 5, name: '孙七', age: 22, email: 'sunqi@example.com', address: '杭州市西湖区' },
    ]
    tableLoading.value = false
    ElMessage.success('表格数据加载完成！')
  }, 1500)
}

// 清空表格数据
const clearTableData = () => {
  tableData.value = []
}
</script>

<style lang="scss" scoped>
.loading-demo {
  padding: 20px;
}

.demo-card {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.demo-content {
  line-height: 1.6;
  
  p {
    margin: 10px 0;
  }
}

.button-group {
  margin: 20px 0;
  
  .el-button {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}

.explanation {
  h3 {
    margin-top: 0;
    color: #333;
  }
  
  p {
    margin: 8px 0;
    color: #666;
  }
}
</style>