<!-- src/pages/login/index.vue -->
<template>
  <div class="login-container relative px-20 min-h-screen flex items-center justify-between overflow-hidden">
    <BusinessBackground />
    <!-- 过渡遮罩：使用 Tailwind 类替代自定义样式 -->
    <transition name="fade">
      <div
        v-if="showTransition"
        class="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-[9999]"
      >
        <div class="flex flex-col items-center gap-4 animate-[scaleIn_0.5s_ease]">
          <span class="text-lg font-medium text-indigo-500">{{ transitionText }}</span>
        </div>
      </div>
    </transition>
    <div class="flex imageBox pl-10">
      <img :src="Group" alt="" class="w-[500px] h-[400px]">
    </div>
    <!-- 登录卡片：简化类名，保留关键动画 -->
    <el-card class="w-[400px] flex card">
      <template #header>
        <div class="card-header flex flex-col items-center">
          <h2 class="m-0 text-3xl text-gray-800">用户登录</h2>
          <p class="mt-1 mb-0 text-sm text-gray-400">欢迎使用本系统</p>
        </div>
      </template>
      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="0"
        @keyup.enter="submit"
      >
        <!-- 用户名 -->
        <el-form-item prop="account">
          <el-input
            v-model="loginForm.account"
            placeholder="请输入用户名"
            :disabled="loading"
            size="large"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :disabled="loading"
            size="large"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 验证码 -->
        <el-form-item prop="code">
          <div class="flex w-full gap-2">
            <el-input
              v-model="loginForm.code"
              placeholder="请输入验证码"
              :disabled="loading"
              size="large"
              class="flex-1"
            />
            <img
              :src="imgSrc"
              alt="验证码"
              @click="getCaptchaFunc"
            />
          </div>
        </el-form-item>

        <!-- 登录按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="submit"
            size="large"
            class="w-[100%]"
            :loading-icon="Loading"
          >
            {{ loading ? '登录中...' : '登 录' }}
          </el-button>
        </el-form-item>
      </el-form>
      <!-- 底部提示 -->
      <div class="flex foot justify-between">
       <span v-for="(item,i) in usernameList" :key="i" @click="testUser(item)">
        {{ item.label }}
       </span>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { User, Lock, Loading } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { useBreadcrumbStore } from '@/store/modules/breadcrumb';
import { login as loginApi, getCaptcha } from '@/api/modules/login';
import storage from '@/utils/storage';
import { getGreeting } from '@/utils/timeUtils';
import BusinessBackground from './components/BusinessBackground/BusinessBackground.vue';
import {loginRules,usernameList} from './config'
import Group from '@/assets/login/Group.png'

const router = useRouter();
const userStore = useUserStore();
const breadcrumbStore = useBreadcrumbStore();

// 状态管理
const loading = ref(false);
const showTransition = ref(false);
const transitionText = ref('正在登录...');
const imgSrc = ref('')
// 表单数据
const loginForm = reactive({
  account: 'superadmin',
  password: 'SuperAdmin_123',
  uuid:'',
  code:''
});

// 登录提交
const submit = async () => {
  // 表单校验
  if (!loginForm.account || !loginForm.password) {
    ElMessage.warning('请输入账号和密码');
    return;
  }
  loading.value = true;
  try {
    // 1. 调用登录接口
    transitionText.value = '正在验证身份...';
    const { data }: any = await loginApi(loginForm);
    
    // 2. 保存token
    storage.set('token', data.accessToken);
    
    // 3. 获取用户权限信息（菜单、权限标识、角色）
    transitionText.value = '正在加载权限信息...';
    
    // 使用新的权限API获取完整权限信息
    const { getCurrentUserMenus, getCurrentUserPermissions, getCurrentUserDataScope } = await import('@/api/system/userRole');
    const { getUserDetail } = await import('@/api/system/user');
    // 并行获取权限信息
    const [menuRes, permRes, dataScopeRes, userDetailRes] = await Promise.all([
      getCurrentUserMenus(),
      getCurrentUserPermissions(),
      getCurrentUserDataScope(),
      getUserDetail(data.user.id)
    ]);
    
    const menus = menuRes.data || [];
    const permissions = permRes.data || [];
    const roles = userDetailRes.data.roles || [];
    
    // 4. 保存用户信息到store（包含权限信息）
    userStore.set_state({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      userInfo: {
        ...data.userInfo,
        ...userDetailRes.data
      },
      menusLoaded: true,
      menus: menus,
      permissions: permissions,
      roles: roles,
      isSuperAdmin: roles.some((role: any) => role.name === 'admin')
    });
    
    // 5. 持久化存储权限信息
    storage.set('menus', menus);
    storage.set('permissions', permissions);
    storage.set('roles', roles);
    
    // 6. 重置标签页（确保新用户登录时看到干净的标签页）
    breadcrumbStore.resetTabs();
    // 5. 显示欢迎消息
    const greeting = getGreeting(new Date());
    const userName =
      data.userInfo?.realName ||
      data.userInfo?.nickName ||
      '欢迎回来';
    ElMessage.success(`${greeting}，${userName}！`);
    // 6. 显示过渡遮罩
    showTransition.value = true;
    transitionText.value = '即将进入系统...';
    // 7. 延迟跳转
    setTimeout(() => {
      router.replace('/').then(() => {
        setTimeout(() => {
          showTransition.value = false;
        }, 500);
      });
    }, 800);
  } catch (error: any) {
    let errorMsg = '登录失败，请稍后重试！';
    if (
      error.message?.includes('401') ||
      error.message?.includes('密码')
    ) {
      errorMsg = '账号或密码错误！';
    } else if (error.message?.includes('network')) {
      errorMsg = '网络连接失败，请检查网络！';
    }
    ElMessage.error(errorMsg);
    showTransition.value = false;
    getCaptchaFunc()
  } finally {
    loading.value = false;
  }
};
const getCaptchaFunc = async () => {
  const {data}:any = await getCaptcha({uuid:loginForm.uuid})
  loginForm.uuid = data.uuid
  imgSrc.value = 'data:image/svg+xml;utf8,' + encodeURIComponent(data.image);
}
// 页面加载时清除可能残留的过渡遮罩
onMounted(async () => {
  showTransition.value = false;
  await getCaptchaFunc()
});
// 测试账号点击
const testUser = ({obj}:any)=>{
  const {account,password} = obj
  loginForm.account = account
  loginForm.password = password
} 
</script>

<style scoped lang="scss">
.card{
  position: relative;
  box-shadow: none !important;
  border: 0;
}
.imageBox{
  position: relative;
}
.foot{
  span{
    color:#a3a3a3;
    cursor: pointer;
  }
  span:hover{
    color: #409EFF;
  }
}
</style>
