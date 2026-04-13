// 动画工具函数
import { type PageAnimationType } from '@/store/modules/theme'

// 动画配置接口
export interface AnimationConfig {
  type: PageAnimationType
  duration: number
  delay?: number
  easing?: string
}

// 动画类名映射
export const animationClassMap: Record<PageAnimationType, string> = {
  'fade': 'animate-fade-in',
  'fade-slide': 'animate-fade-slide-up',
  'scale': 'animate-scale-in',
  'slide-x': 'animate-slide-in-x',
  'slide-y': 'animate-slide-in-y',
  'none': ''
}

// 动画样式生成器
export function generateAnimationStyles(config: AnimationConfig): string {
  if (config.type === 'none') return ''
  
  const styles: string[] = []
  
  // 基础动画属性
  styles.push(`animation-duration: ${config.duration}ms`)
  styles.push(`animation-timing-function: ${config.easing || 'ease-out'}`)
  styles.push(`animation-fill-mode: both`)
  
  // 延迟
  if (config.delay) {
    styles.push(`animation-delay: ${config.delay}ms`)
  }
  
  return styles.join('; ')
}

// 获取组件入场动画配置
export function getComponentAnimation(
  animationType: PageAnimationType,
  duration: number,
  componentIndex: number,
  totalComponents: number = 6
): AnimationConfig {
  // 计算延迟：根据组件位置顺序入场
  const baseDelay = 50 // 基础延迟
  const staggerDelay = 80 // 组件间延迟
  const delay = baseDelay + (componentIndex * staggerDelay)
  
  return {
    type: animationType,
    duration,
    delay,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)' // 平滑的缓动函数
  }
}

// 组件动画顺序配置
export const componentAnimationOrder = {
  'user-info': 0,      // 用户信息卡片
  'system-intro': 1,   // 系统介绍卡片
  'quick-access': 2,   // 快速访问卡片
  'access-trend': 3,   // 访问趋势图表
  'role-distribution': 4, // 角色分布图表
  'activity-list': 5   // 最近活动列表
}

// 暗黑/明亮模式动画配置
export function getThemeBasedAnimation(
  themeMode: 'light' | 'dark',
  baseAnimation: PageAnimationType
): PageAnimationType {
  // 根据主题模式调整动画效果
  if (themeMode === 'dark') {
    // 暗黑模式下使用更柔和的动画
    switch (baseAnimation) {
      case 'fade-slide':
        return 'fade' // 暗黑模式下使用简单的淡入
      case 'slide-x':
      case 'slide-y':
        return 'fade-slide' // 使用更温和的上浮效果
      default:
        return baseAnimation
    }
  }
  return baseAnimation
}

// 生成动画关键帧CSS
export function generateAnimationKeyframes(): string {
  return `
    /* 淡入动画 */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    /* 淡入上浮动画 */
    @keyframes fadeSlideUp {
      from { 
        opacity: 0; 
        transform: translateY(20px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
    
    /* 缩放淡入动画 */
    @keyframes scaleIn {
      from { 
        opacity: 0; 
        transform: scale(0.95); 
      }
      to { 
        opacity: 1; 
        transform: scale(1); 
      }
    }
    
    /* 水平滑动动画 */
    @keyframes slideInX {
      from { 
        opacity: 0; 
        transform: translateX(-30px); 
      }
      to { 
        opacity: 1; 
        transform: translateX(0); 
      }
    }
    
    /* 垂直滑动动画 */
    @keyframes slideInY {
      from { 
        opacity: 0; 
        transform: translateY(-30px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
    
    /* 动画类 */
    .animate-fade-in {
      animation-name: fadeIn;
    }
    
    .animate-fade-slide-up {
      animation-name: fadeSlideUp;
    }
    
    .animate-scale-in {
      animation-name: scaleIn;
    }
    
    .animate-slide-in-x {
      animation-name: slideInX;
    }
    
    .animate-slide-in-y {
      animation-name: slideInY;
    }
    
    /* 动画容器 */
    .animation-container {
      opacity: 0;
    }
    
    .animation-container.animate-in {
      opacity: 1;
    }
  `
}

// 检查动画是否应该启用
export function shouldAnimate(animationType: PageAnimationType): boolean {
  return animationType !== 'none'
}

// 获取动画总时长（用于计算骨架屏到内容的过渡）
export function getTotalAnimationDuration(
  animationType: PageAnimationType,
  baseDuration: number,
  componentCount: number = 6
): number {
  if (animationType === 'none') return 0
  
  const baseDelay = 50
  const staggerDelay = 80
  const lastComponentDelay = baseDelay + ((componentCount - 1) * staggerDelay)
  
  return lastComponentDelay + baseDuration + 100 // 额外100ms缓冲
}

export type { PageAnimationType }
