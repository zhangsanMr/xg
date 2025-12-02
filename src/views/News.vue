<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppTabBar from '../components/AppTabBar.vue'
import { http, baseUrl } from '../http'
import { randomFloatByPercent } from '../utils/number'

const router = useRouter()
const { t } = useI18n()

// 跳转到交易页面
const goToTrade = (id: any) => {
  router.push({
    path: '/trade',
    query: { id: id },
  })
}

const queryProductList = async () => {
  try {
    const { data } = await http<any>({
      url: '/api/index/home',
      method: 'POST',
      disableError: true,
    })
    const list = data?.product || []
    setDataInfo(list)
    products.value = list
  } finally {
  }
}

let productTimer: ReturnType<typeof setInterval> | null = null

let secondTimer: ReturnType<typeof setInterval> | null = null

const startRandom = () => {
  secondTimer = setInterval(() => {
    products.value?.forEach((item: any) => {
      item.Price = randomFloatByPercent(item.Price, 0.1, 0.3, true)
    })
    setDataInfo(products.value)
  }, 5000)
}

const setDataInfo = (list: any[]) => {
  list?.forEach((item: any) => {
    item.logo = baseUrl.replace(/\/$/, '') + item.img
    item.change = (((item.Price - item.Close) / item.Price) * 100).toFixed(2) + '%'
    item.trend = item.Price - item.Close > 0 ? 'down' : 'up'
    item.arrow = new URL(`../assets/images/${item.trend}.png`, import.meta.url).href
    item.sign = item.Price - item.Close > 0 ? true : false
    const randomNum = Math.floor(Math.random() * 5)
    item.trendImg = new URL(`../assets/images/${item.trend}_${randomNum}.png`, import.meta.url).href
  })
}

onMounted(() => {
  queryProductList()
  productTimer = setInterval(() => {
    queryProductList()
  }, 5000)
  setTimeout(() => {
    startRandom()
  }, 2500)
})

onBeforeUnmount(() => {
  if (productTimer) {
    clearInterval(productTimer)
    productTimer = null
  }
  if (secondTimer) {
    clearInterval(secondTimer)
    secondTimer = null
  }
})

// 产品推荐数据 - 真实数据
const products = ref()

// 不再需要 getTrentImg 函数，因为直接使用 product.trendImg
</script>

<template>
  <div class="home-page">
    <AppHeader />

    <div class="home-content">
      <!-- 市场 -->
      <div class="section market-section">
        <div class="market-header">
          <div class="market-col">{{ t('home.name') }}</div>
          <div class="market-col text-center">{{ t('home.latestPrice') }}</div>
          <div class="market-col text-end">{{ t('home.change24h') }}</div>
        </div>

        <div class="market-list">
          <div v-for="(market, index) in products" :key="index" class="market-item" @click="goToTrade(market.id)">
            <div class="market-info">
              <div class="market-icon-wrapper">
                <img :src="market.logo" alt="" class="market-icon-img" />
              </div>
              <div class="market-name">
                <div class="name-main">{{ market.title }}</div>
                <div class="name-sub">{{ market.code }}</div>
              </div>
            </div>
            <div class="market-price">{{ market.Price }}</div>
            <div class="market-change-wrapper">
              <div
                :class="[
                  'market-change',
                  market.trend === 'up' ? 'trend-up' : market.trend === 'down' ? 'trend-down' : 'trend-neutral',
                ]"
              >
                {{ market.change }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AppTabBar />
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  background-image: url('@/assets/images/bg-NP1tUCx5.png');
  background-repeat: no-repeat;
  background-attachment: local;
  background-size: 100% 50%;
}

/* 顶部导航栏 */
.top-header {
  padding: 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-box {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 26px;
}

.language-switcher {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #000;
}

.globe-icon {
  flex-shrink: 0;
}

.lang-link {
  text-decoration: none;
  color: #000;
}

.lang-text {
  font-size: 15px;
}

.home-content {
  padding-bottom: 50px;
}

/* 轮播图 */
.banner-wrapper {
  padding: 0 1rem 0 1rem;
}

.banner {
  width: 100%;
  height: 142px;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}

/* 通知栏 */
.notice-bar-wrapper {
  height: 30px;
}

.notice-bar-wrapper :deep(.van-notice-bar) {
  height: 30px;
  font-size: 12px;
  line-height: 30px;
}

/* 快捷操作 */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10.5px;
  height: 65px;
  margin: 7px 16px 16px 12px;
}

.action-item {
  background: #fff;
  border-radius: 14px;
  padding: 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  color: inherit;
}

.action-icon-img {
  width: 30px;
  height: 30px;
}

.action-text {
  font-size: 11px;
  line-height: 13px;
  color: #6c757d;
}

/* 区块标题 */
.section {
  /* margin: 12px 0; */
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-title .text {
  font-size: 14px;
  color: #6c757d;
  font-weight: 400;
  white-space: nowrap;
}

/* 产品推荐 */
.product-section {
  padding: 0 12px;
}

.product-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 12px 0;
  scrollbar-width: none;
}

.product-scroll::-webkit-scrollbar {
  display: none;
}

.product-card {
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 96px;
  flex-shrink: 0;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-name {
  color: #008a42;
  font-size: 14px;
  width: 96px;
}

.product-price {
  font-size: 12px;
  line-height: 13px;
  color: #6c757d;
}

.product-chart-img {
  height: 52px;
  width: 100%;
  object-fit: contain;
}

.product-price-bottom {
  font-size: 12px;
  line-height: 13px;
  color: #6c757d;
}

.product-change {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
}

.product-change.trend-up {
  color: #198754;
}

.product-change.trend-down {
  color: #dc3545;
}

.product-change.trend-neutral {
  color: #6c757d;
}

.arrow-icon {
  width: 12px;
  height: 12px;
}

/* 市场 */
.market-section {
  padding: 0 12px;
}

.market-header {
  display: flex;
  padding: 12px 0px;
  margin: 0 4px;
}

.market-col {
  font-size: 11px;
  line-height: 13px;
  color: #6c757d;
}

.market-col:nth-child(1) {
  flex: 40%;
}

.market-col:nth-child(2) {
  flex: 30%;
}

.market-col:nth-child(3) {
  flex: 30%;
}

.text-center {
  text-align: center;
}

.text-end {
  text-align: end;
}

.market-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 12px;
}

.market-item {
  background: #fff;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.market-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.market-info {
  flex: 40%;
  display: flex;
  align-items: center;
  gap: 16px;
}

.market-icon-wrapper {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.market-icon-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.market-name {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.name-main {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  text-transform: uppercase;
}

.name-sub {
  font-size: 15px;
  color: #6c757d;
}

.market-price {
  flex: 30%;
  font-size: 15px;
  font-weight: 400;
  color: #6c757d;
  text-align: center;
}

.market-change-wrapper {
  flex: 30%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.market-change {
  font-size: 15px;
  font-weight: 400;
  color: #e9ecef;
  width: 84px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
}

.market-change.trend-up {
  background: #198754;
  color: #e9ecef;
}

.market-change.trend-down {
  background: #dc3545;
  color: #e9ecef;
}

.market-change.trend-neutral {
  background: transparent;
  color: #e9ecef;
}
</style>
