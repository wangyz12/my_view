<!-- src/pages/login/index.vue -->
<template>
  <div class="login-container">
    <el-card class="login-card" header="用户登录">
      <el-form :model="loginForm" :rules="loginRules" label-width="80px">
        <el-form-item label="用户名" prop="account">
          <el-input v-model="loginForm.account" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" @keyup.enter="submit" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="submit" block>
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { login as loginApi } from '@/api/modules/login'
import storage from '@/utils/storage'
import { getMenuListApi } from '@/api'
import {handleLoginSuccess} from '@/utils/auth'
const userStore = useUserStore()
const loading = ref(false)
const loginForm = reactive({
  account: 'test',
  password: 'www13com_'
})
const loginRules = {
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}
const submit = async () => {
  loading.value = true
  try {
    // 调用登录接口
    const { data }: any = await loginApi(loginForm)
    storage.set('token', data.accessToken)
    const res:any = await getMenuListApi()
    storage.set('menus', res.data)
    // 保存用户信息到store
    userStore.set_state({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      userInfo: data.userInfo,
      menusLoaded: false,
      menus: res.data
    })
    handleLoginSuccess(data.accessToken,res.data)
  } catch (error: any) {
    console.error('登录失败:', error)
    ElMessage.error(error.message || '登录失败，请检查账号密码！')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
}

:deep(.el-card__header) {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
</style>