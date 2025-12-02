<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppTabBar from '../components/AppTabBar.vue'
import { http } from '../http'

const { t } = useI18n()
const router = useRouter()

interface ApiUserInfo {
  id: number
  phone: string
  name: string
  idcard: string
  auth: number
  money: string
  id_type: number
  card_front: string
  card_bank: string
  score: number
  ploss: number
  todayploss: number
  usdtavg: number
}

interface UserInfoView {
  username: string
  userId: string
  creditScore: number
  totalAssets: number
  totalAssetsUSD: number
  availableBalance: number
  accountProfit: number
  todayProfit: number
  phone: string
}

const userInfo = ref<UserInfoView>({
  username: '',
  userId: '',
  creditScore: 0,
  totalAssets: 0,
  totalAssetsUSD: 0,
  availableBalance: 0,
  accountProfit: 0,
  todayProfit: 0,
  phone: '',
})

// 实名认证状态：0 未认证 / 1 已认证 / 2 驳回 / 3 待审核
const authStatus = ref<number | null>(null)

const getAuthStatusText = (): string => {
  const status = authStatus.value
  if (status === 1) return t('user.authStatusVerified')
  if (status === 2) return t('user.authStatusRejected')
  if (status === 3) return t('user.authStatusPending')
  return t('user.authStatusUnverified')
}

onMounted(async () => {
  try {
    const { data } = await http<ApiUserInfo>({
      url: '/api/user/index',
      method: 'POST',
      decode: true,
      disableError: true,
    })

    const money = Number(data.money || 0)
    const usdtavg = Number(data.usdtavg || 1) || 1

    userInfo.value = {
      username: data.name || data.phone || '',
      userId: String(data.id ?? ''),
      creditScore: data.score ?? 0,
      totalAssets: money,
      totalAssetsUSD: money / usdtavg,
      availableBalance: money,
      accountProfit: Number(data.ploss || 0),
      todayProfit: Number(data.todayploss || 0),
      phone: data.phone || '',
    }

    authStatus.value = typeof data.auth === 'number' ? data.auth : 0
  } catch (error) {
    console.error('fetch user info error:', error)
  }
})

const logout = () => {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
  handleRoute('/login')
}

const jump2Auth = () => {
  if (authStatus.value === 0 || authStatus.value === 2) {
    handleRoute('/attest')
  }
}

// 处理路由跳转
const handleRoute = (route: string) => {
  if (route) {
    router.push(route)
  }
}
</script>

<template>
  <div class="user-page-wrapper">
    <main>
      <div class="content p-3 !tw-mb-14 fs-14">
        <!-- 用户信息头部 -->
        <div class="py-3">
          <div class="tw-flex tw-justify-between tw-items-center">
            <div>{{ userInfo.phone }}</div>
          </div>
          <div class="d-flex fs-7 align-items-center tw-mt-[5px]">
            <div>ID:{{ userInfo.userId }}</div>
            <div class="card-box text-green d-flex align-items-center ms-2 px-2">
              <img alt="credit" src="@/assets/images/user/credit-badge.png" width="16" />
              <div class="tw-text-12">{{ t('user.creditScore') }}:{{ userInfo.creditScore }}</div>
            </div>
          </div>
        </div>

        <!-- 总资产卡片 -->
        <div class="card-box d-flex px-3 py-2 user-balance align-items-end">
          <div class="flex-grow-1">
            <small>{{ t('user.totalAssets') }}</small>
            <div class="my-2 d-flex align-items-center fs-14">
              <span>HK$</span>
              <b>{{ userInfo.totalAssets.toFixed(2) }}</b>
            </div>
            <small>≈ {{ userInfo.totalAssetsUSD.toFixed(2) }} USD</small>
          </div>
          <div class="text-center px-3">
            <small>{{ t('user.accountProfit') }}</small>
            <div class="text-success">{{ userInfo.accountProfit.toFixed(2) }}</div>
          </div>
          <div class="text-center">
            <div>
              <img alt="cny" src="https://zj4.cicc9658.cfd:2083/h5/img/cny.png" width="60" />
            </div>
            <small>{{ t('user.todayProfit') }}</small>
            <div class="text-success">{{ userInfo.todayProfit.toFixed(2) }}</div>
          </div>
        </div>

        <!-- 可用余额和按钮 -->
        <div class="row mt-3">
          <div class="col-6">
            <div class="card-box p-3">
              <small>{{ t('user.availableBalance') }}</small>
              <div class="tw-flex tw-items-center fs-14" style="margin-top: 5px">
                <span>HK$</span>
                <b>{{ userInfo.availableBalance.toFixed(2) }}</b>
              </div>
            </div>
          </div>
          <div class="col-3 p-0 pe-2">
            <a href="#/chat" class @click.prevent="handleRoute('/chat')">
              <div class="card-box py-2 text-center w-100">
                <div class="my-1">
                  <img alt="rj" class="tw-m-auto" src="@/assets/images/user/chongzhi.png" width="28" />
                </div>
                <small>{{ t('user.recharge') }}</small>
              </div>
            </a>
          </div>
          <div class="col-3 ps-0 mr-16">
            <a href="#/withdraw" class @click.prevent="handleRoute('/withdraw')">
              <div class="card-box py-2 text-center w-100">
                <div class="my-1">
                  <img alt="cj" class="tw-m-auto" src="@/assets/images/user/tixian.png" width="28" />
                </div>
                <small>{{ t('user.withdraw') }}</small>
              </div>
            </a>
          </div>
        </div>

        <!-- 菜单列表 -->
        <div class="card-box mt-3 p-3 d-flex align-items-center" @click="jump2Auth()">
          <div class="me-2">
            <img alt="attest" src="@/assets/images/user/authentication.png" width="22" />
          </div>
          <div>{{ t('user.realNameAuth') }}</div>
          <div class="flex-grow-1 text-end fs-7">{{ getAuthStatusText() }}</div>
          <div class="ms-auto">
            <van-icon name="arrow" size="16" color="#c8c9cc" />
          </div>
        </div>

        <a
          href="#/rechargeDetail"
          class="card-box mt-2 p-3 d-flex align-items-center"
          @click.prevent="handleRoute('/rechargeDetail')"
        >
          <div class="me-2">
            <img alt="attest" src="@/assets/images/user/chongzhi.png" width="22" />
          </div>
          <div>{{ t('user.rechargeDetail') }}</div>
          <div class="ms-auto">
            <van-icon name="arrow" size="16" color="#c8c9cc" />
          </div>
        </a>

        <a
          href="#/withdrawDetail"
          class="card-box mt-2 p-3 d-flex align-items-center"
          @click.prevent="handleRoute('/withdrawDetail')"
        >
          <div class="me-2">
            <img alt="attest" src="@/assets/images/user/tixian.png" width="22" />
          </div>
          <div>{{ t('user.withdrawDetail') }}</div>
          <div class="ms-auto">
            <van-icon name="arrow" size="16" color="#c8c9cc" />
          </div>
        </a>

        <a
          href="#/withdrawAccount"
          class="card-box mt-2 p-3 d-flex align-items-center"
          @click.prevent="handleRoute('/withdrawAccount')"
        >
          <div class="me-2">
            <img alt="attest" src="@/assets/images/user/num.png" width="22" />
          </div>
          <div>{{ t('user.accountNumber') }}</div>
          <div class="ms-auto">
            <van-icon name="arrow" size="16" color="#c8c9cc" />
          </div>
        </a>

        <a
          href="#/editpawd"
          class="card-box mt-2 p-3 d-flex align-items-center"
          @click.prevent="handleRoute('/editpawd')"
        >
          <div class="me-2">
            <img alt="attest" src="@/assets/images/user/xiugai.png" width="22" />
          </div>
          <div>{{ t('user.changePassword') }}</div>
          <div class="ms-auto">
            <van-icon name="arrow" size="16" color="#c8c9cc" />
          </div>
        </a>

        <a
          href="#/language"
          class="card-box mt-2 p-3 d-flex align-items-center"
          @click.prevent="handleRoute('/language')"
        >
          <div class="me-2">
            <img alt="attest" src="@/assets/images/user/lang.png" width="22" />
          </div>
          <div>{{ t('user.switchLanguage') }}</div>
          <div class="ms-auto">
            <van-icon name="arrow" size="16" color="#c8c9cc" />
          </div>
        </a>

        <div class="card-box mt-2 p-3 d-flex align-items-center" @click="logout()">
          <div class="me-2">
            <img alt="attest" src="@/assets/images/user/tuichu.png" width="22" />
          </div>
          <div>{{ t('user.logout') }}</div>
          <div class="ms-auto">
            <van-icon name="arrow" size="16" color="#c8c9cc" />
          </div>
        </div>
      </div>
    </main>

    <!-- 底部导航 -->
    <AppTabBar />
  </div>
</template>

<style scoped>
.user-page-wrapper {
  min-height: 100vh;
  background: #f5f5f5;
}

main {
  padding-bottom: 60px;
}

/* Bootstrap-like utilities */
.d-flex {
  display: flex;
}

.flex-grow-1 {
  flex-grow: 1;
}

.align-items-center {
  align-items: center;
}

.align-items-end {
  align-items: flex-end;
}

.text-center {
  text-align: center;
}

.text-end {
  text-align: end;
}

.text-success {
  color: #00a651;
}

.text-green {
  color: #00a651;
}

/* Padding utilities */
.p-0 {
  padding: 0;
}

.p-3 {
  padding: 1rem;
}

.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.px-3 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.py-3 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.pe-2 {
  padding-right: 0.5rem;
}

.ps-0 {
  padding-left: 0;
}

/* Margin utilities */
.m-auto {
  margin: auto;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-3 {
  margin-top: 1rem;
}

.my-1 {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.my-2 {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.me-2 {
  margin-right: 0.5rem;
}

.ms-2 {
  margin-left: 0.5rem;
}

.ms-auto {
  margin-left: auto;
}

/* Width utilities */
.w-100 {
  width: 100%;
}

/* Font size */
.fs-7 {
  font-size: 0.875rem;
}

/* Row and Column (Grid) */
.row {
  display: flex;
  flex-wrap: wrap;
  margin-left: -0.75rem;
  margin-right: -0.75rem;
}

.col-3 {
  flex: 0 0 25%;
  max-width: 25%;
}

.mr-16 {
  padding-right: 0.75rem;
}
.col-6 {
  flex: 0 0 50%;
  max-width: 50%;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

/* Card styles */
.card-box {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s;
}

.card-box:active {
  opacity: 0.8;
  transform: scale(0.99);
}

/* User specific styles */
.content {
  min-height: 100vh;
  background: #f5f5f5;
}

.user-balance {
  background-image: url('@/assets/images/user_bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

/* Tailwind-like utilities */
.tw-flex {
  display: flex;
}

.tw-items-center {
  align-items: center;
}

.tw-justify-between {
  justify-content: space-between;
}

.tw-text-12 {
  font-size: 12px;
}

.tw-mt-\[5px\] {
  margin-top: 5px;
}

.tw-m-auto {
  margin: auto;
}

.tw-mb-14,
.\!tw-mb-14 {
  margin-bottom: 3.5rem !important;
}

a {
  text-decoration: none;
  color: inherit;
}

b {
  font-weight: 600;
}

small {
  font-size: 12px;
  color: #6c757d;
}
.fs-14 {
  font-size: 14px;
}
</style>
