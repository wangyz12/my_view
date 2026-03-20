<template>
  <div class="system-status">
    <div class="section-header">
      <h3 class="section-title">系统状态</h3>
      <p class="section-subtitle">系统运行状态概览</p>
    </div>
    
    <div class="status-list">
      <div class="status-item">
        <div class="status-info">
          <div class="status-label">系统版本</div>
          <div class="status-value">v2.5.0</div>
        </div>
        <div class="status-tag stable">稳定版</div>
      </div>
      
      <div class="status-item">
        <div class="status-info">
          <div class="status-label">运行时间</div>
          <div class="status-value">15天 8小时</div>
        </div>
        <div class="status-tag normal">正常</div>
      </div>
      
      <div class="status-item">
        <div class="status-info">
          <div class="status-label">最后备份</div>
          <div class="status-value">2024-03-19 23:00</div>
        </div>
        <div class="status-tag success">已完成</div>
      </div>
      
      <div class="status-item">
        <div class="status-info">
          <div class="status-label">安全状态</div>
          <div class="status-value">无风险</div>
        </div>
        <div class="status-tag safe">安全</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 系统状态组件 - 简化版
</script>

<style scoped lang="scss">
.system-status {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid var(--el-border-color);
  
  .section-header {
    margin-bottom: 16px;
    
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 4px;
    }
    
    .section-subtitle {
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }
  }
  
  .status-list {
    .status-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid var(--el-border-color);
      
      &:last-child {
        border-bottom: none;
      }
      
      .status-info {
        .status-label {
          font-size: 13px;
          color: var(--el-text-color-secondary);
          margin-bottom: 2px;
        }
        
        .status-value {
          font-size: 14px;
          font-weight: 500;
          color: var(--el-text-color-primary);
        }
      }
      
      .status-tag {
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 12px;
        font-weight: 500;
        
        &.stable {
          background: rgba(var(--el-color-primary-rgb), 0.1);
          color: var(--el-color-primary);
        }
        
        &.normal {
          background: rgba(var(--el-color-success-rgb), 0.1);
          color: var(--el-color-success);
        }
        
        &.success {
          background: rgba(var(--el-color-success-rgb), 0.1);
          color: var(--el-color-success);
        }
        
        &.safe {
          background: rgba(var(--el-color-success-rgb), 0.1);
          color: var(--el-color-success);
        }
      }
    }
  }
}
</style>