<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { showToast, showSuccessToast } from 'vant'
import AppHeader from '../components/AppHeader.vue'
import { http } from '../http'

const router = useRouter()
const { t } = useI18n()

const phone = ref('')
const password = ref('')

const handleLogin = async () => {
  if (!phone.value) {
    showToast(t('login.accountRequired'))
    return
  }
  if (!password.value) {
    showToast(t('login.passwordRequired'))
    return
  }

  try {
    const { data } = await http<any>({
      url: '/api/login/index',
      method: 'POST',
      data: {
        phone: phone.value,
        password: password.value,
      },
      // 登录错误提示交给后台消息
      disableError: false,
      showLoading: true,
    })

    localStorage.setItem('token', data.token)

    showSuccessToast(t('login.loginSuccess'))
    setTimeout(() => {
      router.push('/home')
    }, 1000)
  } catch (error) {
    // 具體錯誤提示已在 http 封裝中處理
    console.error('login error', error)
  }
}

const goRegister = () => {
  router.push('/register')
}

const goChat = () => {
  router.push('/chat')
}

const goPolicy = () => {
  router.push('/article')
}

// 在线人数相关
const onlineCount = ref(2987690)
let onlineCountInterval: any = null

const updateOnlineCount = () => {
  // 在基准值2987690基础上随机增减，变动幅度在-20到+20之间
  const change = Math.floor(Math.random() * 41) - 20 // 生成-20到20之间的随机数
  onlineCount.value = 2987690 + change
}

onMounted(() => {
  localStorage.removeItem('token')
  // 每1秒更新一次在线人数
  onlineCountInterval = setInterval(updateOnlineCount, 1000)
  // 初始化显示
  updateOnlineCount()
})

// 组件销毁时清除定时器
onUnmounted(() => {
  if (onlineCountInterval) {
    clearInterval(onlineCountInterval)
  }
})
</script>

<template>
  <div class="login-page">
    <AppHeader />

    <div class="login-content">
      <h1 class="title">{{ t('login.title') }}</h1>

      <div class="form-container">
        <div class="form-item">
          <label class="form-label">{{ t('login.emailLabel') }}</label>
          <input v-model="phone" class="form-input" type="text" :placeholder="t('login.emailPlaceholder')" />
        </div>

        <div class="form-item">
          <label class="form-label">{{ t('login.passwordLabel') }}</label>
          <input v-model="password" class="form-input" type="password" :placeholder="t('login.passwordPlaceholder')" />
        </div>

        <button class="login-btn" @click="handleLogin">{{ t('login.loginButton') }}</button>

        <div class="action-links">
          <span class="link" @click="goRegister">{{ t('login.registerNow') }}</span>
          <span class="divider">|</span>
          <span class="link" @click="goChat">{{ t('login.onlineService') }}</span>
        </div>
        <!-- 在线人数显示 -->
        <div class="online-count">
          <span>
            {{ t('login.onlineCount') }}
            <span style="color: red">{{ onlineCount.toLocaleString() }}</span>
          </span>
        </div>
        <div class="policy-text">
          {{ t('login.agreePolicy') }}
          <span style="color: #198754" @click="goPolicy">{{ t('register.privacyPolicy') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.login-content {
  padding: 24px 16px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #000;
  margin: 0 0 40px 0;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  color: #000;
  font-weight: 500;
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  font-size: 14px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background: #fff;
  color: #333;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #c8c9cc;
}

.form-input:focus {
  outline: none;
  border-color: #4caf50;
}

.login-btn {
  width: 100%;
  height: 50px;
  background: #4caf50;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
}

.action-links {
  text-align: center;
  font-size: 14px;
  margin-top: 60px;
}

.link {
  color: #4caf50;
  cursor: pointer;
}

.divider {
  margin: 0 16px;
  color: #999;
}

.online-count {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.policy-text {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-top: 20px;
}
</style>
