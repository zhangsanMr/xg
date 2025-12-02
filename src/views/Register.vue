<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import { http } from '../http'

const router = useRouter()

// 表单数据
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const payPassword = ref('')
const confirmPayPassword = ref('')
const realName = ref('')

// 密码可见性控制
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showPayPassword = ref(false)
const showConfirmPayPassword = ref(false)

// 注册
const handleRegister = async () => {
  // 验证账号
  if (!username.value) {
    showToast('請輸入賬號')
    return
  }
  if (username.value.length < 6 || username.value.length > 12) {
    showToast('賬號長度為6-12位')
    return
  }

  // 验证密码
  if (!password.value) {
    showToast('請輸入密碼')
    return
  }
  if (password.value.length < 6 || password.value.length > 32) {
    showToast('密碼長度為6-32位')
    return
  }

  // 验证确认密码
  if (!confirmPassword.value) {
    showToast('請確認密碼')
    return
  }
  if (password.value !== confirmPassword.value) {
    showToast('兩次密碼輸入不一致')
    return
  }

  // 验证支付密码
  if (!payPassword.value) {
    showToast('請輸入支付密碼')
    return
  }
  if (!/^\d{6}$/.test(payPassword.value)) {
    showToast('支付密碼必須為6位純數字')
    return
  }

  // 验证确认支付密码
  if (!confirmPayPassword.value) {
    showToast('請確認支付密碼')
    return
  }
  if (payPassword.value !== confirmPayPassword.value) {
    showToast('兩次支付密碼輸入不一致')
    return
  }

  // 验证真实姓名
  if (!realName.value) {
    showToast('請輸入真實姓名')
    return
  }

  // TODO: 调用注册 API
  const registerData = {
    phone: username.value,
    password: password.value,
    password2: confirmPassword.value,
    password3: payPassword.value,
    password4: confirmPayPassword.value,
    name: realName.value,
  }

  try {
    await http({
      url: '/api/login/reg',
      method: 'POST',
      data: registerData,
      disableError: false,
      showLoading: true,
    })
    showSuccessToast('注册成功')
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  } catch (error) {
    // 具體錯誤提示已在 http 封裝中處理
    console.error('login error', error)
  }
}

// 去登录
const goLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="register-page">
    <div class="content">
      <!-- 顶部导航 -->
      <AppHeader />
      <!-- 表单内容 -->
      <div class="register-content">
        <h1 class="title">註冊賬號</h1>

        <div class="form-container">
          <!-- 账号 -->
          <div class="form-item">
            <label class="form-label">賬號</label>
            <input v-model="username" class="form-input" type="text" placeholder="6~12位英文和字母組合" />
          </div>

          <!-- 密码 -->
          <div class="form-item">
            <label class="form-label">密碼</label>
            <div class="input-wrapper">
              <input
                v-model="password"
                class="form-input"
                :type="showPassword ? 'text' : 'password'"
                placeholder="6~32 英文和字母組合"
              />
              <span class="eye-icon" @click="showPassword = !showPassword">
                <svg
                  v-if="showPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  ></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </span>
            </div>
          </div>

          <!-- 确认密码 -->
          <div class="form-item">
            <label class="form-label">確認密碼</label>
            <div class="input-wrapper">
              <input
                v-model="confirmPassword"
                class="form-input"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="再次輸入登陸密碼"
              />
              <span class="eye-icon" @click="showConfirmPassword = !showConfirmPassword">
                <svg
                  v-if="showConfirmPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  ></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </span>
            </div>
          </div>

          <!-- 支付密码 -->
          <div class="form-item">
            <label class="form-label">支付密碼</label>
            <div class="input-wrapper">
              <input
                v-model="payPassword"
                class="form-input"
                :type="showPayPassword ? 'text' : 'password'"
                placeholder="6位純數字"
                maxlength="6"
              />
              <span class="eye-icon" @click="showPayPassword = !showPayPassword">
                <svg
                  v-if="showPayPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  ></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </span>
            </div>
          </div>

          <!-- 确认支付密码 -->
          <div class="form-item">
            <label class="form-label">確認密碼</label>
            <div class="input-wrapper">
              <input
                v-model="confirmPayPassword"
                class="form-input"
                :type="showConfirmPayPassword ? 'text' : 'password'"
                placeholder="再次輸入支付密碼"
                maxlength="6"
              />
              <span class="eye-icon" @click="showConfirmPayPassword = !showConfirmPayPassword">
                <svg
                  v-if="showConfirmPayPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  ></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </span>
            </div>
          </div>

          <!-- 真实姓名 -->
          <div class="form-item">
            <label class="form-label">真實姓名</label>
            <input v-model="realName" class="form-input" type="text" placeholder="真實姓名" />
          </div>

          <!-- 注册按钮 -->
          <button class="register-btn" @click="handleRegister">註冊</button>
        </div>
        <!-- 返回登录 -->
      </div>
    </div>

    <div class="back-login" @click="goLogin">返回登錄</div>
  </div>
</template>

<style scoped>
.register-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background-color: #f6f7fb !important;
  color: #000000 !important;
}
.content {
  flex-grow: 1;
  width: 100%;
  height: 0;
  overflow-y: auto;
}

/* 顶部导航 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
  border-radius: 50%;
  position: relative;
}

.logo-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-en {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.logo-cn {
  font-size: 12px;
  color: #666;
}

.language-selector {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

/* 内容区域 */
.register-content {
  padding: 24px 16px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #000;
  margin: 0 0 24px 0;
}

/* 表单容器 */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 表单项 */
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

/* 输入框包装器 */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper .form-input {
  padding-right: 44px;
}

.eye-icon {
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #999;
  padding: 4px;
}

.eye-icon:active {
  color: #666;
}

/* 注册按钮 */
.register-btn {
  width: 100%;
  height: 50px;
  background: #4caf50;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.3s;
}

.register-btn:active {
  background: #45a049;
}

/* 返回登录 */
.back-login {
  text-align: center;
  color: #4caf50;
  font-size: 14px;
  padding: 16px 0;
  cursor: pointer;
}

@media (max-width: 768px) {
  .register-content {
    padding: 20px 16px;
  }

  .title {
    font-size: 22px;
    margin-bottom: 20px;
  }

  .form-input {
    height: 44px;
    font-size: 13px;
  }

  .register-btn {
    height: 46px;
    font-size: 15px;
  }
}
</style>
