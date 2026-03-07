<!-- src/pages/login/index.vue -->
<template>
  <div
    class="login-container relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] overflow-hidden"
  >
    <!-- 过渡遮罩 -->
    <transition name="fade">
      <div
        v-if="showTransition"
        class="transition-mask fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-[9999]"
      >
        <div
          class="flex flex-col items-center gap-4 animate-[scaleIn_0.5s_ease]"
        >
          <el-icon
            class="is-loading !text-4xl"
            :class="{ 'text-[#667eea]': true }"
          >
            <Loading />
          </el-icon>
          <span class="text-lg font-medium text-[#667eea]">{{
            transitionText
          }}</span>
        </div>
      </div>
    </transition>

    <!-- 登录卡片 -->
    <el-card
      class="login-card w-[400px] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] animate-[slideIn_0.5s_ease] transition-all duration-300"
      :class="{ 'card-exit': showTransition }"
    >
      <template #header>
        <div class="text-center">
          <h2 class="m-0 text-3xl text-gray-800">用户登录</h2>
          <p class="mt-1 mb-0 text-sm text-gray-400">
            欢迎使用本系统
          </p>
        </div>
      </template>

      <el-form
        :model="loginForm"
        :rules="loginRules"
        label-width="0"
        @keyup.enter="submit"
      >
        <el-form-item prop="account">
          <el-input
            v-model="loginForm.account"
            placeholder="请输入用户名"
            :disabled="loading"
            size="large"
            class="[&_.el-input__wrapper]:rounded-lg [&_.el-input__wrapper]:px-3 [&_.el-input__wrapper]:py-1"
          >
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :disabled="loading"
            size="large"
            show-password
            class="[&_.el-input__wrapper]:rounded-lg [&_.el-input__wrapper]:px-3 [&_.el-input__wrapper]:py-1"
          >
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="submit"
            size="large"
            class="submit-btn w-full h-11 text-base rounded-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] border-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(102,126,234,0.4)] active:translate-y-0"
            :loading-icon="Loading"
          >
            {{ loading ? '登录中...' : '登 录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 底部提示 -->
      <div class="mt-5 text-center text-xs text-gray-400">
        <p>测试账号：test / www13com_</p>
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
import { login as loginApi } from '@/api/modules/login';
import { getMenuListApi } from '@/api';
import storage from '@/utils/storage';
import { getGreeting } from '@/utils/timeUtils';

const router = useRouter();
const userStore = useUserStore();

// 状态管理
const loading = ref(false);
const showTransition = ref(false);
const transitionText = ref('正在登录...');

// 表单数据
const loginForm = reactive({
  account: 'test',
  password: 'www13com_',
});

// 表单校验规则
const loginRules = {
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      min: 3,
      max: 20,
      message: '长度在 3 到 20 个字符',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      min: 6,
      max: 20,
      message: '长度在 6 到 20 个字符',
      trigger: 'blur',
    },
  ],
};

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

    // 3. 获取菜单数据
    transitionText.value = '正在加载资源...';
    const res: any = await getMenuListApi();
    const menus = res.data || [];
    storage.set('menus', menus);

    // 4. 保存用户信息到store
    userStore.set_state({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      userInfo: data.userInfo,
      menusLoaded: true,
      menus: menus,
    });

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
    console.error('登录失败:', error);

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
  } finally {
    loading.value = false;
  }
};

// 页面加载时清除可能残留的过渡遮罩
onMounted(() => {
  showTransition.value = false;
});
</script>

<style scoped lang="scss">
@import './index.scss'

</style>
