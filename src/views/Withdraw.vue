<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { http } from '../http'
import { showToast } from 'vant'

const { t } = useI18n()
const router = useRouter()

// 表单数据
const amount = ref('')
const withdrawMethod = ref('')
const password = ref('')

// 提现方式选项 - 从实际页面获取
// idtype: 1 銀行卡, 2 TRC, 3 ERC
const withdrawMethods = ref<{ value: string; label: string }[]>([])

const maskAccount = (value: string) => {
  if (!value) return '*****'
  const str = String(value)
  if (str.length <= 4) return `*****${str}`
  return `*****${str.slice(-4)}`
}

const loadWithdrawMethods = async () => {
  try {
    const response: any = await http({
      url: '/api/user/bank_card',
      method: 'POST',
      decode: true,
      disableError: false,
    })

    if (response.code === 0 && response.data) {
      const methods: { value: string; label: string }[] = []
      const data = response.data

      if (data.bank && data.bank.account) {
        methods.push({
          value: '1',
          label: `銀行卡：${maskAccount(data.bank.account)}`,
        })
      }

      if (data.usdt && data.usdt.usdt) {
        methods.push({
          value: '2',
          label: `USDT-TRC：${maskAccount(data.usdt.usdt)}`,
        })
      }

      if (data.usdt2 && data.usdt2.usdt) {
        methods.push({
          value: '3',
          label: `USDT-ERC：${maskAccount(data.usdt2.usdt)}`,
        })
      }

      withdrawMethods.value = methods
    }
  } catch (error) {
    console.error('load withdraw methods error', error)
  }
}

const userInfo = ref<any>({})

const getUserInfo = async () => {
  const { data } = await http({
    url: '/api/user/index',
    method: 'POST',
    decode: true,
    disableError: true,
  })
  userInfo.value = data
}

onMounted(() => {
  loadWithdrawMethods()
  getUserInfo()
})

// 提交提现
const handleSubmit = async () => {
  // 验证表单
  if (!amount.value) {
    showToast(t('withdraw.amountRequired'))
    return
  }

  if (!withdrawMethod.value) {
    showToast(t('withdraw.methodRequired'))
    return
  }
  if (!password.value) {
    showToast(t('withdraw.passwordRequired'))
    return
  }

  try {
    await http({
      url: '/api/user/cash',
      method: 'POST',
      data: {
        money: amount.value,
        pwd: password.value,
        idtype: withdrawMethod.value,
      },
      decode: false,
      disableError: false,
      showLoading: true,
    })

    showToast(t('withdraw.submitSuccess'))
    goBack()
  } catch (error) {
    // 具體錯誤提示已在 http 封裝中處理
    console.error('withdraw error', error)
  }
}

// 返回
const goBack = () => {
  router.back()
}
</script>

<template>
  <main class="withdraw-page">
    <div class="content">
      <!-- 标题 -->
      <h4 class="title">{{ t('withdraw.title') }}</h4>

      <!-- 提现金额卡片 -->
      <div class="card">
        <div class="card-label">{{ t('withdraw.amountLabel') }}</div>
        <div class="amount-input-wrapper">
          <h1 class="currency">HK$</h1>
          <div class="input-container">
            <input v-model="amount" class="amount-input" :placeholder="t('withdraw.amountPlaceholder')" type="number" />
          </div>
        </div>
        <div class="info-row">
          <small class="available-balance">
            {{ t('withdraw.available') }}:
            <span class="balance-value">{{ userInfo?.money ? Number(userInfo?.money).toFixed(2) : '0.00' }}</span>
          </small>
          <small class="fee-text">{{ t('withdraw.fee') }}：{{ userInfo?.cash_charge }} %</small>
        </div>
      </div>

      <!-- 选择提现方式 -->
      <div class="select-card">
        <select v-model="withdrawMethod" class="withdraw-select" :placeholder="t('withdraw.methodPlaceholder')">
          <option disabled value="">{{ t('withdraw.methodPlaceholder') }}</option>
          <option v-for="method in withdrawMethods" :key="method.value" :value="method.value">
            {{ method.label }}
          </option>
        </select>
      </div>

      <!-- 提现密码 -->
      <div class="password-card">
        <input
          v-model="password"
          class="password-input"
          :placeholder="t('withdraw.passwordPlaceholder')"
          type="password"
        />
      </div>

      <!-- 提交按钮 -->
      <div class="submit-container">
        <button class="submit-btn" @click="handleSubmit">
          {{ t('withdraw.submitButton') }}
        </button>
      </div>
    </div>
    <div class="br-back" @click="goBack"></div>
  </main>
</template>

<style scoped>
.withdraw-page {
  min-height: 100vh;
  background: #f6f7fb;
  position: relative;
}

.content {
  position: relative;
  z-index: 1;
}

.background {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: #f6f7fb;
  z-index: 0;
}

/* 标题 */
.title {
  padding: 14px;
  text-align: center;
  font-size: 19px;
  font-weight: 500;
  color: #000;
  margin: 0;
}

/* 卡片通用样式 */
.card,
.select-card,
.password-card {
  background: white;
  margin: 14px;
  padding: 14px;
  border-radius: 5.25px;
}

/* 提现金额卡片 */
.card-label {
  font-size: 14px;
  color: #212529;
  margin-bottom: 12px;
}

.amount-input-wrapper {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 5.25px;
  margin-bottom: 5.25px;
}

.currency {
  font-size: 20px;
  font-weight: 500;
  color: #000;
  margin: 0;
  margin-right: 8px;
}

.input-container {
  flex: 1;
}

.amount-input {
  width: 100%;
  border: 0;
  outline: none;
  font-size: 14px;
  color: #212529;
  padding: 5.25px 10.5px;
  background: transparent;
}

.amount-input:focus {
  outline: none;
  box-shadow: none;
}
/* 返回按钮 */
.br-back {
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 28px;
  height: 28px;
  background-image: url(/src//assets/images/previous-ByDCw9PD.png);
  background-repeat: no-repeat;
  background-size: 100%;
  z-index: 88888888;
}

.amount-input::placeholder {
  color: #6c757d;
}

/* 移除数字输入框的上下箭头 */
.amount-input::-webkit-outer-spin-button,
.amount-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.amount-input[type='number'] {
  -moz-appearance: textfield;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.available-balance {
  font-size: 12px;
  color: #6c757d;
}

.balance-value {
  color: #198754;
  margin-left: 4px;
}

.fee-text {
  font-size: 12px;
  color: #6c757d;
}

/* 选择提现方式 */
.withdraw-select {
  width: 100%;
  border: 0;
  outline: none;
  font-size: 14px;
  color: #212529;
  padding: 5.25px 10.5px;
  background: transparent;
  cursor: pointer;
}

.withdraw-select:focus {
  outline: none;
  box-shadow: none;
}

.withdraw-select option {
  color: #212529;
}

.withdraw-select option:disabled {
  color: #6c757d;
}

/* 提现密码 */
.password-input {
  width: 100%;
  border: 0;
  outline: none;
  font-size: 14px;
  color: #212529;
  padding: 5.25px 10.5px;
  background: transparent;
}

.password-input:focus {
  outline: none;
  box-shadow: none;
}

.password-input::placeholder {
  color: #6c757d;
}

/* 提交按钮 */
.submit-container {
  margin: 14px;
}

.submit-btn {
  width: 100%;
  background: #198754;
  color: #fff;
  font-size: 17.5px;
  padding: 7px 14px;
  border: none;
  border-radius: 7px;
  height: 42.25px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background: #157347;
}

.submit-btn:active {
  background: #146c43;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .title {
    font-size: 18px;
  }

  .currency {
    font-size: 18px;
  }

  .submit-btn {
    font-size: 16px;
  }
}
</style>
