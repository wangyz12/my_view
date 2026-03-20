<template>
  <div class="system-features">
    <div class="section-header">
      <h3 class="section-title">系统功能</h3>
      <p class="section-subtitle">后台管理系统核心功能模块</p>
    </div>
    
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">
          <i class="el-icon-user"></i>
        </div>
        <div class="feature-content">
          <h4 class="feature-title">用户管理</h4>
          <p class="feature-desc">完整的用户生命周期管理，支持角色分配、权限控制、登录审计等功能。</p>
          <div class="feature-tags">
            <span class="tag">用户注册</span>
            <span class="tag">角色分配</span>
            <span class="tag">权限控制</span>
          </div>
        </div>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <i class="el-icon-s-grid"></i>
        </div>
        <div class="feature-content">
          <h4 class="feature-title">角色权限</h4>
          <p class="feature-desc">灵活的RBAC权限模型，支持菜单权限、数据权限、操作权限的精细控制。</p>
          <div class="feature-tags">
            <span class="tag">RBAC模型</span>
            <span class="tag">菜单权限</span>
            <span class="tag">数据权限</span>
          </div>
        </div>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <i class="el-icon-menu"></i>
        </div>
        <div class="feature-content">
          <h4 class="feature-title">菜单管理</h4>
          <p class="feature-desc">动态菜单配置，支持多级菜单、图标设置、权限绑定，菜单实时生效。</p>
          <div class="feature-tags">
            <span class="tag">动态菜单</span>
            <span class="tag">多级嵌套</span>
            <span class="tag">图标配置</span>
          </div>
        </div>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <i class="el-icon-office-building"></i>
        </div>
        <div class="feature-content">
          <h4 class="feature-title">组织架构</h4>
          <p class="feature-desc">树形组织架构管理，支持部门创建、调整、负责人设置，清晰的组织关系。</p>
          <div class="feature-tags">
            <span class="tag">部门管理</span>
            <span class="tag">树形结构</span>
            <span class="tag">负责人设置</span>
          </div>
        </div>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <i class="el-icon-setting"></i>
        </div>
        <div class="feature-content">
          <h4 class="feature-title">系统设置</h4>
          <p class="feature-desc">全面的系统参数配置，包括主题设置、水印配置、系统参数等个性化选项。</p>
          <div class="feature-tags">
            <span class="tag">主题切换</span>
            <span class="tag">参数配置</span>
            <span class="tag">水印设置</span>
          </div>
        </div>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <i class="el-icon-data-analysis"></i>
        </div>
        <div class="feature-content">
          <h4 class="feature-title">数据监控</h4>
          <p class="feature-desc">实时系统监控和数据分析，包括用户行为、系统性能、业务数据统计。</p>
          <div class="feature-tags">
            <span class="tag">实时监控</span>
            <span class="tag">数据分析</span>
            <span class="tag">性能统计</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="tech-stack">
      <div class="tech-header">
        <h4 class="tech-title">技术栈</h4>
        <p class="tech-subtitle">基于现代前端技术构建</p>
      </div>
      <div class="tech-tags">
        <span class="tech-tag vue">Vue 3</span>
        <span class="tech-tag typescript">TypeScript</span>
        <span class="tech-tag element">Element Plus</span>
        <span class="tech-tag pinia">Pinia</span>
        <span class="tech-tag vite">Vite</span>
        <span class="tech-tag tailwind">Tailwind CSS</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 系统功能介绍组件
</script>

<style scoped lang="scss">
.system-features {
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--el-border-color);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  
  .section-header {
    margin-bottom: 24px;
    
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 4px;
    }
    
    .section-subtitle {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
    
    .feature-card {
      background: var(--el-fill-color-light);
      border-radius: 10px;
      padding: 20px;
      border: 1px solid var(--el-border-color);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        border-color: var(--el-color-primary);
      }
      
      .feature-icon {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
        
        i {
          font-size: 20px;
          color: white;
        }
      }
      
      .feature-content {
        .feature-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--el-text-color-primary);
          margin-bottom: 8px;
        }
        
        .feature-desc {
          font-size: 14px;
          color: var(--el-text-color-secondary);
          line-height: 1.5;
          margin-bottom: 12px;
        }
        
        .feature-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          
          .tag {
            font-size: 12px;
            padding: 4px 8px;
            background: rgba(var(--el-color-primary-rgb), 0.1);
            color: var(--el-color-primary);
            border-radius: 6px;
          }
        }
      }
    }
  }
  
  .tech-stack {
    padding-top: 24px;
    border-top: 1px solid var(--el-border-color);
    
    .tech-header {
      margin-bottom: 16px;
      
      .tech-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 4px;
      }
      
      .tech-subtitle {
        font-size: 14px;
        color: var(--el-text-color-secondary);
      }
    }
    
    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      
      .tech-tag {
        font-size: 13px;
        padding: 6px 12px;
        border-radius: 8px;
        font-weight: 500;
        
        &.vue {
          background: rgba(66, 184, 131, 0.1);
          color: #42b883;
          border: 1px solid rgba(66, 184, 131, 0.2);
        }
        
        &.typescript {
          background: rgba(49, 120, 198, 0.1);
          color: #3178c6;
          border: 1px solid rgba(49, 120, 198, 0.2);
        }
        
        &.element {
          background: rgba(64, 158, 255, 0.1);
          color: #409EFF;
          border: 1px solid rgba(64, 158, 255, 0.2);
        }
        
        &.pinia {
          background: rgba(255, 107, 107, 0.1);
          color: #ff6b6b;
          border: 1px solid rgba(255, 107, 107, 0.2);
        }
        
        &.vite {
          background: rgba(100, 108, 255, 0.1);
          color: #646cff;
          border: 1px solid rgba(100, 108, 255, 0.2);
        }
        
        &.tailwind {
          background: rgba(6, 182, 212, 0.1);
          color: #06b6d4;
          border: 1px solid rgba(6, 182, 212, 0.2);
        }
      }
    }
  }
}

// 暗黑模式适配
:deep(.dark) .system-features {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  
  .feature-card {
    background: var(--el-fill-color-dark);
    
    &:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>