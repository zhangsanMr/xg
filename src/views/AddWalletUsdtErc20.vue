<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { http } from '../http'
import { showToast } from 'vant'

const router = useRouter()
const { t } = useI18n()

// 定义 API 参数类型
interface AddUsdtParams {
  usdt: string // 钱包地址
  type: number // 类型：2 表示 USDT-ERC20（按后端约定调整）
}

interface ApiResponse {
  code: number
  info: string
  data: any
}

const walletAddress = ref('')
const submitting = ref(false)

const goBack = () => {
  router.back()
}

const validateForm = (): boolean => {
  if (!walletAddress.value.trim()) {
    console.error('請輸入錢包位址')
    return false
  }

  if (walletAddress.value.length < 10) {
    console.error('錢包位址長度過短')
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (submitting.value) return

  if (!validateForm()) return

  submitting.value = true

  try {
    const params: AddUsdtParams = {
      usdt: walletAddress.value.trim(),
      type: 2,
    }

    const response: ApiResponse = await http({
      url: '/api/user/add_usdt',
      method: 'POST',
      data: params as unknown as Record<string, unknown>,
      showLoading: true,
      disableError: false,
    })

    if (response.code === 0) {
      showToast(t('attest.submitSuccess'))
      router.back()
    }
  } catch (error) {
    console.error('提交失敗:', error)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="add-wallet-page">
    <div class="content">
      <div class="back-button" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor" />
        </svg>
      </div>

      <h4 class="title">{{ t('addwalletUsdtTrc20.title') }}</h4>

      <div class="card">
        <div class="card-header text-uppercase">USDT-ERC20</div>
        <form class="card-body" @submit.prevent="handleSubmit">
          <input
            v-model="walletAddress"
            type="text"
            class="form-control mb-3"
            :placeholder="t('addwalletUsdtTrc20.walletPlaceholder')"
            required
          />
          <div class="d-grid">
            <button class="btn btn-primary" type="submit" :disabled="submitting">
              {{ t('addwalletUsdtTrc20.submitButton') }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="br-back"></div>
  </main>
</template>

<style scoped>
.add-wallet-page {
  min-height: 100vh;
  background: #f6f7fb;
  position: relative;
}

.content {
  position: relative;
  z-index: 1;
}

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

.title {
  padding: 14px;
  text-align: center;
  font-size: 19px;
  font-weight: 500;
  color: #000;
  margin: 0 0 7px;
}

.card {
  margin: 0 12px 24px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.card-header {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid #f1f1f1;
}

.card-body {
  padding: 16px;
}

.form-control {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  padding: 0 12px;
  outline: none;
}

.form-control:focus {
  border-color: #00c853;
  box-shadow: 0 0 0 1px rgba(0, 200, 83, 0.16);
}

.btn-primary {
  height: 40px;
  border-radius: 8px;
  border: none;
  background: #00c853;
  font-size: 15px;
  font-weight: 500;
}

.btn-primary:disabled {
  opacity: 0.7;
}

.d-grid {
  display: grid;
}

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

@media (max-width: 768px) {
  .title {
    font-size: 18px;
  }

  .card {
    margin: 0 10px 20px;
  }
}

.mb-3 {
  margin-bottom: 0.5rem;
}
</style>
