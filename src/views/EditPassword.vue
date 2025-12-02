<script setup lang="ts">
import { showToast } from 'vant'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { http } from '../http'

const { t } = useI18n()
const router = useRouter()

// 登录密码
const oldLoginPassword = ref('')
const newLoginPassword = ref('')
const confirmLoginPassword = ref('')

// 提现密码
const oldWithdrawPassword = ref('')
const newWithdrawPassword = ref('')
const confirmWithdrawPassword = ref('')

// 返回上一页
const goBack = () => {
  router.back()
}

// 修改登录密码
const updateLoginPassword = async () => {
  if (!oldLoginPassword.value) {
    showToast(t('editPassword.oldPasswordRequired'))
    return
  }
  if (!newLoginPassword.value) {
    showToast(t('editPassword.newPasswordRequired'))
    return
  }
  if (newLoginPassword.value.length < 6 || newLoginPassword.value.length > 32) {
    showToast(t('editPassword.passwordLength'))
    return
  }
  if (newLoginPassword.value !== confirmLoginPassword.value) {
    showToast(t('editPassword.passwordNotMatch'))
    return
  }

  try {
    const response: any = await http({
      url: '/api/user/pwd_login',
      method: 'POST',
      data: {
        pwd: newLoginPassword.value,
        pwd2: confirmLoginPassword.value,
        oldpwd: oldLoginPassword.value,
      },
      disableError: false,
      showLoading: true,
    })

    if (response.code === 0) {
      showToast(t('editPassword.updateSuccess'))
      // 清空表单
      oldLoginPassword.value = ''
      newLoginPassword.value = ''
      confirmLoginPassword.value = ''
    } else {
      showToast(response.msg || t('editPassword.updateFailed'))
    }
  } finally {
  }
}

// 修改提现密码
const updateWithdrawPassword = async () => {
  if (!oldWithdrawPassword.value) {
    showToast(t('editPassword.oldPasswordRequired'))
    return
  }
  if (!newWithdrawPassword.value) {
    showToast(t('editPassword.newPasswordRequired'))
    return
  }
  if (newWithdrawPassword.value.length < 6 || newWithdrawPassword.value.length > 32) {
    showToast(t('editPassword.passwordLength'))
    return
  }
  if (newWithdrawPassword.value !== confirmWithdrawPassword.value) {
    showToast(t('editPassword.passwordNotMatch'))
    return
  }

  try {
    const response: any = await http({
      url: '/api/user/pwd_pay', // 提现密码可能使用的端点
      method: 'POST',
      data: {
        pwd: newWithdrawPassword.value,
        pwd2: confirmWithdrawPassword.value,
        oldpwd: oldWithdrawPassword.value,
      },
      disableError: false,
      showLoading: true,
    })

    if (response.code === 0) {
      showToast(t('editPassword.updateSuccess'))
      // 清空表单
      oldWithdrawPassword.value = ''
      newWithdrawPassword.value = ''
      confirmWithdrawPassword.value = ''
    } else {
      showToast(response.msg || t('editPassword.updateFailed'))
    }
  } catch (error) {
    showToast(t('editPassword.updateFailed'))
    console.error('修改提现密码失败:', error)
  }
}
</script>

<template>
  <main class="edit-password-page">
    <div class="content">
      <!-- 返回按钮 -->
      <div class="back-button" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor" />
        </svg>
      </div>

      <!-- 标题 -->
      <h4 class="title">{{ t('editPassword.title') }}</h4>

      <!-- 登录密码卡片 -->
      <div class="card">
        <div class="card-header">{{ t('editPassword.loginPassword') }}</div>
        <div class="card-body">
          <input
            v-model="oldLoginPassword"
            class="form-control"
            type="password"
            :placeholder="t('editPassword.oldLoginPasswordPlaceholder')"
          />
          <input
            v-model="newLoginPassword"
            class="form-control"
            type="password"
            :placeholder="t('editPassword.newLoginPasswordPlaceholder')"
          />
          <input
            v-model="confirmLoginPassword"
            class="form-control"
            type="password"
            :placeholder="t('editPassword.confirmPasswordPlaceholder')"
          />
          <div class="d-grid">
            <button class="btn btn-success" @click="updateLoginPassword">
              {{ t('editPassword.updateButton') }}
            </button>
          </div>
        </div>
      </div>

      <!-- 提现密码卡片 -->
      <div class="card">
        <div class="card-header">{{ t('editPassword.withdrawPassword') }}</div>
        <div class="card-body">
          <input
            v-model="oldWithdrawPassword"
            class="form-control"
            type="password"
            :placeholder="t('editPassword.oldWithdrawPasswordPlaceholder')"
          />
          <input
            v-model="newWithdrawPassword"
            class="form-control"
            type="password"
            :placeholder="t('editPassword.newWithdrawPasswordPlaceholder')"
          />
          <input
            v-model="confirmWithdrawPassword"
            class="form-control"
            type="password"
            :placeholder="t('editPassword.confirmPasswordPlaceholder')"
          />
          <div class="d-grid">
            <button class="btn btn-info" @click="updateWithdrawPassword">
              {{ t('editPassword.updateButton') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="br-back"></div>
  </main>
</template>

<style scoped>
.edit-password-page {
  min-height: 100vh;
  background: #f6f7fb;
  position: relative;
}

.content {
  position: relative;
  z-index: 1;
}

/* 返回按钮 */
.back-button {
  position: absolute;
  top: 14px;
  left: 14px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #00c853;
  z-index: 10;
}

.back-button svg {
  width: 24px;
  height: 24px;
}

/* 标题 */
.title {
  padding: 14px;
  text-align: center;
  font-size: 19px;
  font-weight: 500;
  color: #000;
  margin: 0 0 7px;
}

/* 卡片 */
.card {
  background: #fff;
  margin: 14px;
  border-radius: 5.25px;
  border: 1px solid rgba(0, 0, 0, 0.176);
}

.card-header {
  background-color: rgba(33, 37, 41, 0.03);
  padding: 7px 14px;
  font-size: 14px;
  color: #000;
  border-radius: 4.375px 4.375px 0 0;
  font-weight: 500;
}

.card-body {
  padding: 14px;
}

/* 表单控件 */
.form-control {
  width: 100%;
  padding: 5.25px 10.5px;
  margin-bottom: 14px;
  font-size: 14px;
  color: #212529;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 5.25px;
  outline: none;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.form-control::placeholder {
  color: #6c757d;
  opacity: 0.5;
}

/* 按钮网格布局 */
.d-grid {
  display: grid;
}

/* 按钮通用样式 */
.btn {
  padding: 5.25px 10.5px;
  font-size: 14px;
  border-radius: 5.25px;
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 400;
  text-align: center;
  transition: all 0.15s ease-in-out;
}

.btn:hover {
  opacity: 0.9;
}

/* 成功按钮 (绿色) */
.btn-success {
  background-color: #198754;
  color: #fff;
  border-color: #198754;
}

.btn-success:hover {
  background-color: #157347;
  border-color: #146c43;
}

/* 信息按钮 (青色) */
.btn-info {
  background-color: #0dcaf0;
  color: #000;
  border-color: #0dcaf0;
}

.btn-info:hover {
  background-color: #31d2f2;
  border-color: #25cff2;
}

/* 底部背景 */
.br-back {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 50%;
  background: #f6f7fb;
  z-index: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .title {
    font-size: 18px;
  }

  .card {
    margin: 12px;
  }
}
</style>
