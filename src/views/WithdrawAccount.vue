<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { http } from '../http'

const { t } = useI18n()
const router = useRouter()

// 定义API返回的数据类型
interface BankData {
  id: number
  uid: number
  bank: string
  area: string
  account: string
  name: string
  mobile: number
  phone: string
}

interface UsdtData {
  id: number
  uid: number
  usdt: string
  type: number
}

interface AccountData {
  bank?: BankData
  usdt?: UsdtData
  usdt2?: UsdtData
}

const accounts = ref<AccountData | null>(null)

const formatBankAccount = (account?: string) => {
  if (!account) return '--'
  const len = account.length
  if (len <= 4) return account
  const last4 = account.slice(-4)
  const masked = '*'.repeat(len - 4)
  return `${masked}${last4}`
}

const queryAccount = async () => {
  try {
    const response: any = await http({
      url: '/api/user/bank_card',
      method: 'POST',
      decode: true, // 启用解密
      showLoading: true,
    })

    if (response.code === 0 && response.data) {
      accounts.value = response.data as AccountData
    } else {
      console.error('获取账户信息失败:', response.info)
    }
  } catch (error) {
    console.error('获取账户信息错误:', error)
  }
}

onMounted(() => {
  queryAccount()
})

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<template>
  <main class="withdraw-account-page">
    <div class="content">
      <!-- 返回按钮 -->
      <div class="back-button" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor" />
        </svg>
      </div>

      <!-- 标题 -->
      <h4 class="title">{{ t('withdrawAccount.title') }}</h4>

      <!-- 主图 -->
      <div class="image-container">
        <img src="/images/withdraw-account/img_4.png" alt="log" class="account-image" width="230" />
      </div>

      <!-- 银行卡 -->
      <div class="wallet-card wallet-bank">
        <div>
          <div class="card-header">
            <img src="https://zj4.cicc9658.cfd:2083/h5/img/icon/debit-cards.png" alt="card" width="20" />
            <span class="card-number">
              {{ accounts?.bank?.account ? formatBankAccount(accounts.bank.account) : '--' }}
            </span>
          </div>
          <div class="card-type">{{ accounts?.bank?.bank || t('withdrawAccount.bankCard') }}</div>
        </div>
        <div v-if="!accounts?.bank?.bank" class="ms-auto">
          <a data-v-bed93747="" href="#/addwallet/bank" class="">
            <img
              data-v-bed93747=""
              src="https://zj4.cicc9658.cfd:2083/h5/img/icon/add-payment.png"
              alt="icon"
              width="30"
            />
          </a>
        </div>
      </div>

      <!-- USDT-TRC20 -->
      <div class="wallet-card wallet-trc">
        <div>
          <div class="card-header">
            <img src="https://zj4.cicc9658.cfd:2083/h5/img/icon/usdt.png" alt="card" width="20" />
            <span class="card-number">{{ accounts?.usdt?.usdt ? formatBankAccount(accounts.usdt.usdt) : '--' }}</span>
          </div>
          <div class="card-type">USDT-TRC20</div>
        </div>
        <div v-if="!accounts?.usdt?.usdt" data-v-bed93747="" class="ms-auto">
          <a data-v-bed93747="" href="#/addwallet/usdt-trc20" class="">
            <img
              data-v-bed93747=""
              src="https://zj4.cicc9658.cfd:2083/h5/img/icon/add-payment.png"
              alt="icon"
              width="30"
            />
          </a>
        </div>
      </div>

      <!-- USDT-ERC20 -->
      <div class="wallet-card wallet-erc">
        <div>
          <div class="card-header">
            <img src="https://zj4.cicc9658.cfd:2083/h5/img/icon/usdt.png" alt="card" width="20" />
            <span class="card-number">{{ accounts?.usdt2?.usdt ? formatBankAccount(accounts.usdt2.usdt) : '--' }}</span>
          </div>
          <div class="card-type">USDT-ERC20</div>
        </div>
        <div v-if="!accounts?.usdt2?.usdt" class="ms-auto">
          <a data-v-bed93747="" href="#/addwallet/usdt-erc20" class="">
            <img
              data-v-bed93747=""
              src="https://zj4.cicc9658.cfd:2083/h5/img/icon/add-payment.png"
              alt="icon"
              width="30"
            />
          </a>
        </div>
      </div>

      <!-- 显示加载状态或空状态 -->
      <div v-if="!accounts" class="loading-state">
        <p>{{ t('withdrawAccount.loading') }}</p>
      </div>
    </div>
    <div class="br-back"></div>
  </main>
</template>

<style scoped>
.withdraw-account-page {
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

/* 图片容器 */
.image-container {
  text-align: center;
  padding: 14px;
}

.account-image {
  margin: 0 auto;
  display: block;
}

/* 卡片通用样式 */
.wallet-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 28px;
  margin: 14px;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  overflow: hidden;
}

.card-header {
  margin-bottom: 7px;
  display: flex;
  align-items: center;
}

.card-header img {
  width: 20px;
  height: 20px;
}

.card-number {
  padding-left: 7px;
  font-size: 14px;
  color: #fff;
}

.card-type {
  font-size: 14px;
  color: #fff;
}

/* 银行卡 - 使用背景图片 */
.wallet-bank {
  background-image: url('/images/withdraw-account/card-bank-bg.png');
}

/* USDT-TRC - 使用背景图片 */
.wallet-trc {
  background-image: url('/images/withdraw-account/card-trc-bg.png');
}

/* USDT-ERC - 使用背景图片 */
.wallet-erc {
  background-image: url('/images/withdraw-account/card-erc-bg.png');
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

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 20px;
  color: #9ca3af;
  font-size: 14px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .title {
    font-size: 18px;
  }

  .wallet-card {
    margin: 12px;
    padding: 12px 24px;
  }
}
</style>
