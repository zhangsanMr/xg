<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { http } from '../http'
import { showToast } from 'vant'

const router = useRouter()
const { t } = useI18n()

// 定义API参数类型
interface AddCardParams {
  bank: string // 银行名称
  area: string // 银行代码
  account: string // 收款账户
  name: string // 收款户名
}

// 定义API响应类型
interface ApiResponse {
  code: number
  info: string
  data: any
}

const bankName = ref('')
const accountNumber = ref('')
const rtgsCode = ref('')
const accountHolder = ref('')

const submitting = ref(false)

const goBack = () => {
  router.back()
}

// 表单验证函数
const validateForm = (): boolean => {
  if (!bankName.value.trim()) {
    console.error('请输入银行名称')
    return false
  }

  if (!accountNumber.value.trim()) {
    console.error('请输入收款账户')
    return false
  }

  if (!rtgsCode.value.trim()) {
    console.error('请输入银行代码')
    return false
  }

  if (!accountHolder.value.trim()) {
    console.error('请输入收款户名')
    return false
  }

  // 可以添加更具体的验证规则，比如账户号格式验证等
  if (accountNumber.value.length < 6) {
    console.error('收款账户长度至少6位')
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (submitting.value) return

  // 表单验证
  if (!validateForm()) {
    return
  }

  submitting.value = true

  try {
    // 构建API参数
    const params: AddCardParams = {
      bank: bankName.value.trim(),
      area: rtgsCode.value.trim(), // 根据用户提供的参数，area 对应 rtgsCode
      account: accountNumber.value.trim(),
      name: accountHolder.value.trim(),
    }

    // 调用API
    const response: ApiResponse = await http({
      url: '/api/user/add_card',
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
    console.error('提交失败:', error)
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

      <h4 class="title">{{ t('addwalletBank.title') }}</h4>

      <div class="card">
        <div class="card-header text-uppercase">
          {{ t('addwalletBank.bankSectionTitle') }}
        </div>
        <form class="card-body" @submit.prevent="handleSubmit">
          <input
            v-model="bankName"
            type="text"
            class="form-control mb-3"
            :placeholder="t('addwalletBank.bankNamePlaceholder')"
            required
          />
          <input
            v-model="accountNumber"
            type="text"
            class="form-control mb-3"
            :placeholder="t('addwalletBank.accountPlaceholder')"
            required
          />
          <input
            v-model="rtgsCode"
            type="text"
            class="form-control mb-3"
            :placeholder="t('addwalletBank.rtgsPlaceholder')"
            required
          />
          <input
            v-model="accountHolder"
            type="text"
            class="form-control mb-3"
            :placeholder="t('addwalletBank.accountNamePlaceholder')"
            required
          />
          <div class="d-grid">
            <button class="btn btn-primary" type="submit" :disabled="submitting">
              {{ t('addwalletBank.submitButton') }}
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
