<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { http } from '../http'
import BottomOrderSheet from '../components/BottomOrderSheet.vue'
import type { Order } from '../model/order'
import { init, dispose, type Chart } from 'klinecharts'
import { randomFloatByPercent } from '../utils/number'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const orderSheetRef = ref()

// 从路由获取参数
const id = ref((route.query.id as string) || '0')

const product = ref<any | null>(null)

const klineData = ref<any[]>([])

// K 线图表实例
const klineChart = ref<Chart | null>(null)

// K线时间周期
const timeframes = ref([
  { id: 0, name: '1m', value: '1', typeValue: 1, type: 'minute' },
  { id: 1, name: '15m', value: '15', typeValue: 15, type: 'minute' },
  { id: 2, name: '30m', value: '30', typeValue: 30, type: 'minute' },
  { id: 3, name: '60m', value: '60', typeValue: 60, type: 'minute' },
  { id: 4, name: '1d', value: 'd', typeValue: 1, type: 'day' },
])

const klineParams = ref('60')

const orders = ref<Order[]>([])
const loading = ref(false)
const finished = ref(false)
const orderParams = ref({
  page: 1,
  limit: 10,
  status: 'all',
  product_id: id.value,
})

// 加载产品信息
async function loadProductDetail() {
  try {
    const response = await http<any>({
      url: '/api/index/getkdata',
      method: 'POST',
      data: { pid: id.value, num: 60, interval: klineParams.value },
    })
    if (response && response.data) {
      console.log('当前价格：', response.data.topdata.Price)
      const topdata = response.data.topdata
      const klineItems = response.data.items
      product.value = {
        ...topdata,
        change: (((topdata.Price - topdata.close) / topdata.Price) * 100).toFixed(2) + '%',
      }

      const candles = klineItems.map((item: any) => ({
        timestamp: Number(item[0]) * 1000,
        open: Number(item[1]),
        close: Number(item[2]),
        low: Number(item[3]),
        high: Number(item[4]),
      }))

      candles.push({
        timestamp: topdata.topdata * 1000,
        open: Number(topdata.Open),
        close: Number(topdata.Price),
        low: Number(topdata.Low),
        high: Number(topdata.High),
      })
      klineData.value = candles
      kLineCallback.value?.(candles)
    }
  } catch (error) {
    console.error('加载产品信息失败:', error)
  }
}

// 格式化时间戳为日期时间字符串
const formatTimestamp = (timestamp: number | null): string => {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp * 1000)
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 切换时间周期
const changeTimeframe = async (timeframe: any) => {
  klineParams.value = timeframe.value
  klineChart.value?.setPeriod({ span: timeframe.typeValue, type: timeframe.type })
  loadProductDetail()
}

const statusText = (item: Order) => {
  return item.ostaus === 0 ? t('trade.waitClose') : (item.ploss || 0) >= 0 ? t('trade.profit') : t('trade.loss')
}

// 加载订单列表
const loadOrders = async () => {
  try {
    const params = {
      page: 1,
      pid: orderParams.value.product_id,
    }
    const response: any = await http({
      url: '/api/user/orderlist',
      method: 'POST',
      data: params,
      decode: true, // 启用解密
    })
    orders.value = response?.data?.data || []
    loading.value = false
    finished.value = true
  } catch (error) {
    console.error('加载订单列表失败:', error)
    loading.value = false
    finished.value = true
  }
}

// 打开下单对话框
const openBuyDialog = (type: number) => {
  orderSheetRef.value?.open(type)
}

// 定时更新
let updateTimer: number | null = null

// 每 3 秒刷新一次产品信息，并在已有图表实例上增量更新数据
const startUpdate = () => {
  updateTimer = setInterval(() => loadProductDetail(), 5000)
}

const stopUpdate = () => {
  if (updateTimer) {
    clearInterval(updateTimer)
    updateTimer = null
  }
}
let randomTimer: number | null = null

// 每 3 秒刷新一次产品信息，并在已有图表实例上增量更新数据
const startRandom = () => {
  randomTimer = window.setInterval(async () => {
    const pre = randomFloatByPercent(product.value.Price, 0.1, 0.3, true)
    product.value.Price = pre
    product.value.change = (((product.value.Price - product.value.close) / product.value.Price) * 100).toFixed(2) + '%'
    const item = klineData.value.pop()
    item.close = pre
    subCallback.value?.(item)
  }, 5000)
}

const stopRandom = () => {
  if (randomTimer) {
    clearInterval(randomTimer)
    randomTimer = null
  }
}

let countdownTimer: number | null = null
const startCountdown = () => {
  countdownTimer = setInterval(() => {
    // 过滤出order.ostaus=== 0 的订单，然后执行倒计时，倒计时为0 后，刷新页面
    orders.value
      ?.filter(item => item.ostaus === 0)
      ?.forEach(order => {
        //endloss-  (当前时间秒 - buytime秒) 并向上取整
        order.conutDown = Math.max(
          Math.ceil(Number(order.endprofit || '0') - (Date.now() / 1000 - (order.buytime || 0))),
          0
        )
        //状态发生变化了。需要重新请求接口
        if (order.conutDown <= 0) {
          loadOrders()
          return
        }
      })
  }, 1000)
}

const stopCountdown = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

const kLineCallback = ref()
const subCallback = ref()

// 初始化 K 线图表
const initKlineChart = () => {
  if (klineChart.value) {
    return
  }
  klineChart.value = init('kline-chart')
  klineChart.value?.setSymbol({ ticker: 'TestSymbol' })
  klineChart.value?.setPeriod({ span: 60, type: 'minute' })
  klineChart.value?.setDataLoader({
    getBars: ({ callback }) => {
      kLineCallback.value = callback
    },
    subscribeBar: ({ callback }) => {
      subCallback.value = callback
    },
  })
  klineChart.value?.setStyles({
    candle: {
      priceMark: {
        low: {
          show: false,
        },
        high: {
          show: false,
        },
      },
      tooltip: {
        showRule: 'follow_cross',
      },
    },
  })
  klineChart.value?.setLocale('zh-CN')
}

// 监听 K 线数据变化，更新图表

onMounted(async () => {
  initKlineChart()
  loadProductDetail()
  startUpdate()
  setTimeout(() => {
    startRandom()
  }, 2500)
  startCountdown()
})

onUnmounted(() => {
  stopUpdate()
  stopRandom()
  dispose('kline-chart')
  stopCountdown()
})

const goBack = () => {
  router.back()
}
</script>

<template>
  <main class="trade-page">
    <div class="content">
      <div>
        <!-- 标题 -->
        <h4 class="text-center p-3 text-secondary">{{ product?.title || t('trade.title') }}</h4>

        <!-- 价格信息 -->
        <div class="item-box">
          <div v-if="product" :class="product?.change && product.change > '0' ? 'item-left-red' : 'item-left'">
            <div class="tw-text-24 tw-text-green-500">
              <span :class="{ 'tw-text-red-500': product?.change && product.change > '0' }" style="font-weight: 600">
                {{ product?.Price || '0.00' }}
              </span>
            </div>
            <b
              :class="[
                product?.change && product.change > '0' ? 'tw-text-red-500' : 'tw-text-green-500',
                'tw-flex tw-items-center',
              ]"
            >
              <span
                :class="product?.change && product.change > '0' ? 'tw-text-red-500 tw-rotate-180' : 'tw-text-green-600'"
              >
                <svg fill="none" height="18" viewBox="0 0 48 48" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13 30L25 18L37 30"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                  ></path>
                </svg>
              </span>
              {{ product?.change }}
            </b>
          </div>

          <div v-if="product" class="item-right">
            <div class="tw-grid tw-grid-cols-2">
              <div class="col">
                <div class="fs-7">{{ t('trade.high24h') }}</div>
                <small>{{ product?.High || '0.0000' }}</small>
              </div>
              <div class="col">
                <div class="fs-7">{{ t('trade.volume24h') }}</div>
                <small>{{ product?.Open || '0.00' }}</small>
              </div>
            </div>
            <div class="tw-grid tw-grid-cols-2">
              <div class="col">
                <div class="fs-7">{{ t('trade.low24h') }}</div>
                <small>{{ product?.Low || '0.0000' }}</small>
              </div>
              <div class="col">
                <div class="fs-7">{{ t('trade.amount24h') }}</div>
                <small>{{ product?.close || '0.00' }}</small>
              </div>
            </div>
          </div>
        </div>

        <!-- 时间周期选择 -->
        <ul class="kline-item tw-px-3">
          <li
            v-for="tf in timeframes"
            :key="tf.id"
            :class="{ active: klineParams === tf.value }"
            @click="changeTimeframe(tf)"
          >
            {{ tf.name }}
          </li>
        </ul>

        <!-- K线图 -->
        <div id="kline-chart" style="height: 325px"></div>
        <!-- 持仓记录标题 -->
        <!-- <p class="text-center text-secondary mt-3">—— {{ t('trade.positionRecords') }} ——</p> -->

        <!-- 订单列表 -->
        <div class="mt-3 p-3">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text=""
            class="tw-space-y-4"
            @load="loadOrders"
          >
            <div
              v-for="item in orders"
              :key="item.id"
              class="tw-bg-white tw-rounded-lg tw-p-4 tw-shadow-sm tw-mb-3 tw-transition-transform tw-duration-200 hover:tw-transform hover:tw-scale-105"
            >
              <!-- 订单头部 -->

              <div class="tw-flex tw-justify-between tw-items-center tw-mb-2">
                <span class="tw-text-14">{{ t('trade.orderNo') }}:{{ item.orderno }}</span>
                <div class="tw-flex tw-items-center tw-gap-1.5">
                  <span
                    class="tw-text-white tw-py-1 tw-px-3 tw-rounded-2xl tw-text-12"
                    :class="(item.ploss ?? 0) >= 0 ? 'tw-bg-green-500' : 'tw-bg-red-500'"
                  >
                    {{ statusText(item) }}
                  </span>
                </div>
              </div>
              <div class="tw-grid tw-grid-cols-2 tw-gap-3 tw-text-12 tw-mb-2">
                <div>
                  <div class="tw-text-gray-500">{{ t('trade.openPrice') }}</div>
                  <div class="tw-font-medium">{{ item.buyprice }}</div>
                </div>
                <div v-if="item.ostaus == 1">
                  <div class="tw-text-gray-500">{{ t('trade.closePrice') }}</div>
                  <div class="tw-font-medium">{{ item.sellprice || 'N/A' }}</div>
                </div>
                <div v-else>
                  <div class="tw-text-gray-500">{{ t('trade.counting') }}</div>
                  <div class="tw-font-medium">{{ item.conutDown || '0' + ' ' + t('trade.seconds') }}</div>
                </div>
                <div>
                  <div class="tw-text-gray-500">{{ t('trade.betAmount') }}</div>
                  <div class="tw-font-medium">{{ item.fee }}</div>
                </div>
                <div>
                  <div class="tw-text-gray-500">{{ t('trade.type') }}</div>
                  <div class="tw-font-medium" :class="item.ostyle === 0 ? 'tw-text-green-500' : 'tw-text-red-500'">
                    {{ item.ostyle === 0 ? t('trade.buyLong') : t('trade.buyShort') }}
                  </div>
                </div>
                <div>
                  <div class="tw-text-gray-500">{{ t('trade.createTime') }}</div>
                  <div class="tw-font-medium">{{ formatTimestamp(item.buytime ?? null) }}</div>
                </div>
                <div>
                  <div class="tw-text-gray-500">{{ t('trade.period') }}</div>
                  <div class="tw-font-medium">{{ item.endprofit + ' ' + t('trade.seconds') }}</div>
                </div>
              </div>
              <div
                v-if="(item.ostaus || 0) !== 0"
                class="tw-flex tw-justify-between tw-border-t tw-pt-2 border-t"
                style="font-size: 16px"
              >
                <div>
                  <div class="tw-text-gray-500" style="font-size: 14px">{{ t('trade.betAmount') }}</div>
                  <div class="tw-font-medium" style="font-size: 14px">{{ item.fee }}</div>
                </div>
                <div>
                  <div class="tw-text-gray-500 tw-text-right" style="font-size: 14px">{{ t('trade.profit') }}</div>
                  <div class="tw-font-medium tw-text-green-500" style="font-size: 14px">{{ item.ploss ?? 0 }}</div>
                </div>
              </div>
            </div>
          </van-list>

          <!-- 空数据 -->
          <div v-if="orders.length === 0" class="text-center">
            <img alt="empty" class="tw-m-auto tw-w-160px" src="/src/assets/images/empty.png" />
            <p class="fs-7">{{ t('trade.noData') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <div class="bottom-actions">
      <div class="d-grid flex-grow-1 p-3">
        <button class="btn btn-danger" @click="openBuyDialog(0)">{{ t('trade.buyLong') }}</button>
      </div>
      <div class="d-grid flex-grow-1 p-3">
        <button class="btn btn-success" @click="openBuyDialog(1)">{{ t('trade.buyShort') }}</button>
      </div>
    </div>

    <!-- 底部下单弹窗 -->
    <BottomOrderSheet ref="orderSheetRef" @confirm="loadOrders" :curPrice="product?.Price || '0.00'" />

    <!-- 返回按钮 -->
    <div class="br-back" @click="goBack"></div>
  </main>
</template>

<style scoped>
.trade-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--main-bg) !important;
  color: var(--main-color) !important;
}

.content {
  flex-grow: 1;
  width: 100%;
  height: 0;
  overflow-y: auto;
}

/* 价格信息区域 */
.item-box {
  margin: 1rem;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 1rem;
}

.item-left {
  margin: 1rem 0;
  padding: 0 1rem;
  border-left: 0.1875rem solid #008a42;
  width: 10rem;
}
.item-left-red {
  margin: 1rem 0;
  padding: 0 1rem;
  border-left: 0.1875rem solid #ef4444;
  width: 10rem;
}

.tw-text-24 {
  font-size: 1.5rem;
}
.tw-text-green-600 {
  --tw-text-opacity: 1;
  color: rgb(25 135 84 / var(--tw-text-opacity));
}

.item-right {
  position: relative;
  flex-grow: 1;
  padding: 0.75rem 1.3rem 0.75rem 0;
  text-align: end;
  border-left: 0.0625rem solid #eee;
}
.item-right::before {
  content: '';
  width: 1rem;
  height: 1rem;
  border-top: 0.0625rem solid #eee;
  border-right: 0.0625rem solid #eee;
  position: absolute;
  background-color: #fff;
  left: -0.5rem;
  top: calc(50% - 0.5rem);
  transform: rotate(50deg);
}

.tw-grid {
  display: grid;
}
.tw-grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.col {
  display: flex;
  flex-direction: column;
}

.fs-7 {
  font-size: 0.75rem;
  color: #6c757d;
  margin-bottom: 0.125rem;
}

.col small {
  font-size: 0.875rem;
  color: #6c757d;
}

/* 时间周期选择 */
.kline-item {
  display: flex;
  list-style-type: none;
  padding: 0;
}
.tw-px-3 {
  padding-left: 0.75rem !important;
  padding-right: 0.75rem !important;
}

.kline-item li {
  position: relative;
  padding: 0.3125rem 0.625rem;
}

.kline-item li.active {
  color: #198754;
  border-bottom-color: #198754;
  font-weight: 600;
}

/* K线图 */
#kline-chart {
  background: white;
}

/* 底部操作按钮 */
.bottom-actions {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  flex-shrink: 0;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  background: white;
  position: relative;
  z-index: 10;
}

.d-flex {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}

.bg-white {
  background: white;
}

.d-grid {
  display: grid;
}

.flex-grow-1 {
  flex: 1;
}

.p-3 {
  padding: 1rem;
}
.tw-w-160px {
  width: 160px;
}

.btn {
  width: 100%;
  padding: 0.875rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.btn-success {
  background: #198754;
}

.btn-success:hover {
  background: #146c43;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 135, 84, 0.3);
}

.btn-success:active {
  transform: translateY(0);
}

.btn-danger {
  background: #dc3545;
}

.btn-danger:hover {
  background: #bb2d3b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn-danger:active {
  transform: translateY(0);
}

.btn-outline-danger {
  background: transparent;
  border: 1px solid #dc3545;
  color: #dc3545;
}

.btn-outline-danger:hover {
  background: #dc3545;
  color: white;
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

.br-back:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(78, 204, 163, 0.4);
}

.br-back:active {
  transform: scale(0.95);
}

/* 下单弹窗 */
.order-item-lay {
  background: white;
  border-radius: 0.5rem;
  min-width: 320px;
  max-width: 90vw;
}

.text-secondary {
  color: #6c757d;
}

.text-nowrap {
  white-space: nowrap;
}

.text-danger {
  color: #dc3545;
}

.text-center {
  text-align: center;
  font-size: 14px;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-3 {
  margin-top: 1rem;
}

.mb-1 {
  margin-bottom: 0.25rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.me-2 {
  margin-right: 0.5rem;
}

.ms-auto {
  margin-left: auto;
}

.p-1 {
  padding: 0.25rem;
}

.p-2 {
  padding: 0.5rem;
}

.p-3 {
  padding: 1rem;
}

.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.rounded {
  border-radius: 0.375rem;
}

.border {
  border: 1px solid #dee2e6;
}

.bg-secondary-subtle {
  background-color: #f8f9fa;
}

.time-active {
  background-color: #e7f5ff !important;
  border-color: #198754 !important;
}

.input-group {
  display: flex;
  width: 100%;
}

.input-group-text {
  display: flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: center;
  white-space: nowrap;
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  cursor: pointer;
}

.form-control {
  flex: 1;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  border: 1px solid #ced4da;
  outline: none;
}

.justify-content-between {
  justify-content: space-between;
}

hr {
  margin: 1rem 0;
  color: inherit;
  border: 0;
  border-top: 1px solid #dee2e6;
  opacity: 0.25;
}

/* -------------- */

.position-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 1rem 1rem 70px !important;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.5rem;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.search-input {
  flex: 1;
  height: 30px;
  padding: 0 10px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  font-size: 12px;
  outline: none;
}

.search-input::placeholder {
  color: #999;
}

.search-btn {
  background: #198754;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.search-btn:active {
  opacity: 0.8;
}

/* 卡片盒子 */
.card-box {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 标签页 */
.tabs {
  display: flex;
  background: white;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 16px 0;
  font-size: 16px;
  color: #333;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-item.active {
  color: #4caf50;
  font-weight: 500;
}

.tab-item.active span {
  color: #4caf50;
}

/* 列表项 */
.position-item {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.position-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 内容区 */
.position-content {
  padding: 0;
}

/* 工具类样式 */
.d-flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.text-center {
  text-align: center;
}

.flex-grow-1 {
  flex-grow: 1;
}

.date-input-wrapper {
  position: relative;
}

.clear-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #999;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.clear-btn:active {
  opacity: 0.7;
}

.form-control {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: white;
  background-clip: padding-box;
  border: 1px solid #dee2e6;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0.375rem;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}
.form-control-sm {
  padding: 0.25rem 0.5rem;
  font-size: 12px;
  border-radius: 0.25rem;
}
.p-2 {
  padding: 0.5rem;
}

.p-3 {
  padding: 0.75rem;
}

.p-4 {
  padding: 1rem;
}

.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.gap-3 {
  gap: 0.75rem;
}

.gap-1\.5 {
  gap: 0.375rem;
}

.tw-grid {
  display: grid;
}
.tw-text-14 {
  font-size: 12px;
}
.tw-font-medium {
  font-weight: 500;
}
.tw-text-gray-600 {
  color: #6b7280;
}

.tw-justify-between {
  justify-content: space-between;
}
.tw-items-center {
  align-items: center;
}
.tw-mb-2 {
  margin-bottom: 0.5rem;
}

.tw-grid-cols-2 {
  grid-template-columns: 1fr 1fr;
}

.border-t {
  border-top: 1px solid #e5e5e5;
}
.tw-gap-3 {
  gap: 0.75rem;
}

.tw-text-12 {
  font-size: 10px;
}
.tw-text-16 {
  font-size: 1rem;
}

.tw-font-500 {
  font-weight: 500;
}

.tw-font-medium {
  font-weight: 500;
}

.tw-text-gray-500 {
  color: #6b7280;
}

.tw-text-white {
  color: white;
}

.tw-bg-white {
  background-color: white;
}

.tw-rounded-lg {
  border-radius: 0.5rem;
}

.tw-shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.tw-mb-3 {
  margin-bottom: 0.75rem;
}

.tw-transition-transform {
  transition-property: transform;
}

.tw-duration-200 {
  transition-duration: 200ms;
}

.tw-space-y-4 > :not(:first-child) {
  margin-top: 1rem;
}

.hover\:tw-transform:hover {
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x))
    skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.hover\:tw-scale-105:hover {
  --tw-scale-x: 1.05;
  --tw-scale-y: 1.05;
}
.tw-flex {
  display: flex;
  align-items: center;
}

.tw-w-\[40px\] {
  width: 30px;
}

.tw-rounded-full {
  border-radius: 9999px;
}

.tw-bg-green-500 {
  background-color: #10b981;
}

.tw-bg-red-500 {
  background-color: #ef4444;
}

.tw-py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.tw-px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.tw-rounded-2xl {
  border-radius: 1rem;
}

.tw-text-green-500 {
  color: #10b981;
}

.tw-text-red-500 {
  color: #ef4444;
}

.tw-font-medium {
  font-weight: 500;
}

.tw-text-blue-500 {
  color: #3b82f6;
}

/* 空数据状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  min-height: 400px;
}

.empty-icon {
  width: 200px;
  height: 200px;
  margin-bottom: 24px;
}

.empty-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08));
}

.empty-text {
  font-size: 16px;
  color: #999;
}

@media (max-width: 768px) {
  .position-page {
    padding-bottom: 70px;
  }

  .search-bar {
    gap: 8px;
    padding: 0.5rem;
  }

  .search-input {
    height: 26px;
  }

  .search-btn {
    padding: 0 10px;
    height: 26px;
    font-size: 12px;
  }

  .position-content {
    padding: 0;
  }
  .tw-p-4 {
    padding: 1rem;
  }
  .tw-pt-2 {
    padding-top: 0.5rem;
  }
  .tw-border-t {
    border-top-width: 0.0625rem;
  }
}
</style>
