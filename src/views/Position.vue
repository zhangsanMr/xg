<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { http } from '../http'
import AppTabBar from '../components/AppTabBar.vue'

const { t } = useI18n()

// 当前激活的标签页
const activeTab = ref('0')

// 日期搜索
const searchDate = ref('')
const showDatePicker = ref(false)

// 定义接口类型
interface OrderData {
  id: number
  orderno: string
  ptitle: string
  buytime: number
  selltime: number | null
  buyprice: number
  sellprice: number | null
  endprofit: string
  endloss: number
  ploss: number
  ostaus: number
  ostyle: number
  commission: number
  sx_fee: string
  lossrate: number
  warn: number
  // 添加其他API返回的字段
  uid: number
  pid: number
  onumber: number | null
  fee: number
  eid: number
  display: number
  isshow: number
  is_win: number | null
  kong_type: number
  limit_points: number | null
  stop_points: number | null
}

interface OrderListResponse {
  total: number
  per_page: number
  current_page: string
  last_page: number
  data: OrderData[]
}

interface ApiResponse {
  code: number
  info: string
  data: OrderListResponse
}

// 持仓记录数据
const positionRecords = ref<OrderData[]>([])

// 持仓历史数据
const positionHistory = ref<OrderData[]>([])

// 分页状态 - 持仓记录
const currentPageRecords = ref(1)
const lastPageRecords = ref(1)
const loadingRecords = ref(false)
const finishedRecords = ref(false)

// 分页状态 - 持仓历史
const currentPageHistory = ref(1)
const lastPageHistory = ref(1)
const loadingHistory = ref(false)
const finishedHistory = ref(false)

// 切换标签页
const switchTab = (tab: string) => {
  activeTab.value = tab
  // 切换标签时重置分页并重新加载
  resetPaginationForActiveTab()
  loadPositionDataWithFilter({ reset: true })
}

// 确认日期选择
const onConfirmDate = (value: any) => {
  console.log(value)
  searchDate.value = value.selectedValues.join('-')
  showDatePicker.value = false
}

// 根据当前激活 tab 重置对应分页状态
const resetPaginationForActiveTab = () => {
  if (activeTab.value === '0') {
    currentPageRecords.value = 1
    lastPageRecords.value = 1
    finishedRecords.value = false
    positionRecords.value = []
  } else {
    currentPageHistory.value = 1
    lastPageHistory.value = 1
    finishedHistory.value = false
    positionHistory.value = []
  }
}

// 清空日期
const clearSearchDate = async () => {
  searchDate.value = ''
  resetPaginationForActiveTab()
  await loadPositionDataWithFilter({ reset: true })
}

// 搜索功能
const handleSearch = async () => {
  console.log('搜索日期:', searchDate.value)
  resetPaginationForActiveTab()
  await loadPositionDataWithFilter({ reset: true })
}

// 带过滤条件的持仓数据加载（支持分页）
const loadPositionDataWithFilter = async ({ reset = false }: { reset?: boolean } = {}) => {
  const isRecordsTab = activeTab.value === '0'

  const currentPageRef = isRecordsTab ? currentPageRecords : currentPageHistory
  const lastPageRef = isRecordsTab ? lastPageRecords : lastPageHistory
  const loadingRef = isRecordsTab ? loadingRecords : loadingHistory
  const finishedRef = isRecordsTab ? finishedRecords : finishedHistory

  // 已在加载或已加载完，且不是重置时，不再重复请求
  if (loadingRef.value) return
  if (!reset && finishedRef.value) return

  if (reset) {
    currentPageRef.value = 1
    finishedRef.value = false
  }

  loadingRef.value = true

  try {
    const params: Record<string, unknown> = {
      ostaus: activeTab.value,
      page: currentPageRef.value,
    }

    // 如果搜索日期存在，添加到请求参数中
    if (searchDate.value) {
      params.buytime = searchDate.value // 开始时间戳
    }

    const response: ApiResponse = await http({
      url: '/api/user/orderlist',
      method: 'POST',
      data: params,
      decode: true, // 启用解密
    })

    if (response.code === 0) {
      console.log('获取持仓数据成功:', response.data)

      const { data, current_page, last_page } = response.data

      // 更新分页信息
      currentPageRef.value = Number(current_page) || currentPageRef.value
      lastPageRef.value = last_page

      // 区分持仓记录和历史记录，按 tab 追加数据
      if (isRecordsTab) {
        const list = data?.filter(order => order.ostaus === 0) || []
        positionRecords.value = reset ? list : [...positionRecords.value, ...list]
      } else {
        const list = data?.filter(order => order.ostaus !== 0) || []
        positionHistory.value = reset ? list : [...positionHistory.value, ...list]
      }

      // 判断是否还有更多数据
      if (currentPageRef.value >= lastPageRef.value || !data || data.length === 0) {
        finishedRef.value = true
      } else {
        currentPageRef.value += 1
      }
    } else {
      console.error('获取持仓数据失败:', response.info)
    }
  } catch (error) {
    console.error('获取持仓数据错误:', error)
  } finally {
    loadingRef.value = false
  }
}

// 格式化时间戳为日期时间字符串
const formatTimestamp = (timestamp: number | null): string => {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp * 1000)
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 计算持仓周期
// const calculatePeriod = (buyTime: number, sellTime: number | null): string => {
//   if (!sellTime) return 'N/A'
//   const buyDateTime = new Date(buyTime * 1000)
//   const sellDateTime = new Date(sellTime * 1000)
//   const diffSeconds = sellDateTime.getTime() - buyDateTime.getTime()
//   const diffMinutes = Math.floor(diffSeconds / 1000 / 60)
//   return `${diffMinutes}分鐘`
// }

// 组件挂载时加载数据并监听滚动实现下拉加载
onMounted(() => {
  loadPositionDataWithFilter({ reset: true })

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const clientHeight = document.documentElement.clientHeight
    const scrollHeight = document.documentElement.scrollHeight

    // 距离底部 100px 内触发加载更多
    if (scrollHeight - (scrollTop + clientHeight) < 100) {
      loadPositionDataWithFilter()
    }
  }

  window.addEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="position-page">
    <!-- 搜索栏 -->
    <div class="search-bar card-box d-flex align-items-center p-2 mb-3">
      <div class="px-2">
        <img alt="search" src="../assets/images/loupe.png" width="20" />
      </div>
      <div class="flex-grow-1 date-input-wrapper">
        <input
          v-model="searchDate"
          type="text"
          :placeholder="t('position.datePlaceholder')"
          class="form-control form-control-sm"
          readonly
          @click="showDatePicker = true"
        />
        <button v-if="searchDate" class="clear-btn" type="button" @click="clearSearchDate">×</button>
      </div>
      <div class="px-2">
        <button class="search-btn" @click="handleSearch">
          {{ t('position.search') }}
        </button>
      </div>
    </div>

    <!-- 日期选择器 -->
    <van-popup v-model:show="showDatePicker" position="bottom">
      <van-date-picker :title="t('position.selectDate')" @confirm="onConfirmDate" @cancel="showDatePicker = false" />
    </van-popup>

    <!-- 标签切换 -->
    <div class="d-flex text-center card-box mb-3 tabs">
      <div :class="['flex-grow-1 p-3 tab-item', { active: activeTab === '0' }]" @click="switchTab('0')">
        <span>{{ t('position.recordTab') }}</span>
      </div>
      <div :class="['flex-grow-1 p-3 tab-item', { active: activeTab === '1' }]" @click="switchTab('1')">
        <span>{{ t('position.historyTab') }}</span>
      </div>
    </div>

    <!-- 持仓记录内容 -->
    <div v-if="activeTab === '0'" class="position-content">
      <div
        v-for="record in positionRecords"
        :key="record.id"
        class="tw-bg-white tw-rounded-lg tw-p-4 tw-shadow-sm tw-mb-3 tw-transition-transform tw-duration-200 position-item"
      >
        <div class="tw-flex tw-mb-2 tw-items-center tw-gap-3">
          <div class="tw-font-500 tw-text-16">{{ record.ptitle }}</div>
        </div>
        <div class="tw-flex tw-justify-between tw-items-center tw-mb-2">
          <span class="tw-text-14">{{ t('trade.orderNo') }}:{{ record.orderno }}</span>
          <div class="tw-flex tw-items-center tw-gap-1.5">
            <span
              class="tw-text-white tw-py-1 tw-px-3 tw-rounded-2xl tw-text-12"
              :class="record.ploss >= 0 ? 'tw-bg-green-500' : 'tw-bg-red-500'"
            >
              {{ t('trade.waitClose') }}
            </span>
          </div>
        </div>
        <div class="tw-grid tw-grid-cols-2 tw-gap-3 tw-text-12 tw-mb-2">
          <div>
            <div class="tw-text-gray-500">{{ t('trade.openPrice') }}</div>
            <div class="tw-font-medium">{{ record.buyprice }}</div>
          </div>
          <div>
            <div class="tw-text-gray-500">{{ t('trade.closePrice') }}</div>
            <div class="tw-font-medium">{{ record.sellprice || 'N/A' }}</div>
          </div>
          <div>
            <div class="tw-text-gray-500">{{ t('trade.betAmount') }}</div>
            <div class="tw-font-medium">{{ record.fee }}</div>
          </div>
          <div>
            <div class="tw-text-gray-500">{{ t('trade.type') }}</div>
            <div class="tw-font-medium" :class="record.ostyle === 0 ? 'tw-text-green-500' : 'tw-text-red-500'">
              {{ record.ostyle === 0 ? t('trade.buyLong') : t('trade.buyShort') }}
            </div>
          </div>
          <div>
            <div class="tw-text-gray-500">{{ t('trade.createTime') }}</div>
            <div class="tw-font-medium">{{ formatTimestamp(record.buytime) }}</div>
          </div>
          <div>
            <div class="tw-text-gray-500">{{ t('trade.period') }}</div>
            <div class="tw-font-medium">{{ record.endprofit + ' ' + t('trade.seconds') }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 持仓历史内容 -->
    <div v-else class="position-content">
      <div
        v-for="position in positionHistory"
        :key="position.id"
        class="tw-bg-white tw-rounded-lg tw-p-4 tw-shadow-sm tw-mb-3 tw-transition-transform tw-duration-200 position-item"
      >
        <div class="tw-flex tw-mb-2 tw-items-center tw-gap-3">
          <div class="tw-font-500 tw-text-16">{{ position.ptitle }}</div>
        </div>
        <div class="tw-flex tw-justify-between tw-items-center tw-mb-2">
          <span class="tw-text-14">{{ t('trade.orderNo') }}:{{ position.orderno }}</span>
          <div class="tw-flex tw-items-center tw-gap-1.5">
            <span
              class="tw-text-white tw-py-1 tw-px-3 tw-rounded-2xl tw-text-12"
              :class="position.ploss >= 0 ? 'tw-bg-green-500' : 'tw-bg-red-500'"
            >
              {{ position.ploss >= 0 ? t('trade.profit') : t('trade.loss') }}
            </span>
          </div>
        </div>
        <div class="tw-grid tw-grid-cols-2 tw-gap-3 tw-text-12 tw-mb-2">
          <div>
            <div class="tw-text-gray-500">{{ t('trade.openPrice') }}</div>
            <div class="tw-font-medium">{{ position.buyprice }}</div>
          </div>
          <div>
            <div class="tw-text-gray-500">{{ t('trade.closePrice') }}</div>
            <div class="tw-font-medium">{{ position.sellprice || 'N/A' }}</div>
          </div>
          <div>
            <div class="tw-text-gray-500">{{ t('trade.betAmount') }}</div>
            <div class="tw-font-medium">{{ position.fee }}</div>
          </div>
          <div>
            <div class="tw-text-gray-500">{{ t('trade.type') }}</div>
            <div class="tw-font-medium" :class="position.ostyle === 0 ? 'tw-text-green-500' : 'tw-text-red-500'">
              {{ position.ostyle === 0 ? t('trade.buyLong') : t('trade.buyShort') }}
            </div>
          </div>
          <div>
            <div class="tw-text-gray-500">{{ t('trade.createTime') }}</div>
            <div class="tw-font-medium">{{ formatTimestamp(position.buytime) }}</div>
          </div>
          <div>
            <div class="tw-text-gray-500">{{ t('trade.period') }}</div>
            <div class="tw-font-medium">{{ position.endprofit + ' ' + t('trade.seconds') }}</div>
          </div>
        </div>
        <div class="tw-flex tw-justify-between tw-border-t tw-pt-2 border-t" style="font-size: 16px">
          <div>
            <div class="tw-text-gray-500" style="font-size: 14px">{{ t('trade.betAmount') }}</div>
            <div class="tw-font-medium" style="font-size: 14px">{{ position.fee }}</div>
          </div>
          <div>
            <div class="tw-text-gray-500 tw-text-right" style="font-size: 14px">{{ t('trade.profit') }}</div>
            <div class="tw-font-medium tw-text-green-500" style="font-size: 14px">{{ position.ploss ?? 0 }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空数据状态 -->
    <div
      v-if="(activeTab === '0' && positionRecords.length === 0) || (activeTab === '1' && positionHistory.length === 0)"
      class="empty-state"
    >
      <div class="empty-icon">
        <svg viewBox="0 0 200 200" class="empty-svg">
          <!-- 文档图标 -->
          <rect x="60" y="40" width="80" height="100" rx="8" fill="#e8e8e8" />
          <rect x="60" y="40" width="80" height="20" rx="8" fill="#d0d0d0" />

          <!-- 文字线条 -->
          <line x1="70" y1="75" x2="100" y2="75" stroke="#b8b8b8" stroke-width="3" stroke-linecap="round" />
          <line x1="70" y1="85" x2="120" y2="85" stroke="#b8b8b8" stroke-width="3" stroke-linecap="round" />
          <line x1="70" y1="95" x2="115" y2="95" stroke="#b8b8b8" stroke-width="3" stroke-linecap="round" />
          <line x1="70" y1="105" x2="95" y2="105" stroke="#b8b8b8" stroke-width="3" stroke-linecap="round" />
          <line x1="70" y1="115" x2="110" y2="115" stroke="#b8b8b8" stroke-width="3" stroke-linecap="round" />
          <line x1="70" y1="125" x2="100" y2="125" stroke="#b8b8b8" stroke-width="3" stroke-linecap="round" />

          <!-- 放大镜 -->
          <circle cx="130" cy="120" r="20" fill="#d8d8d8" />
          <circle cx="130" cy="120" r="14" fill="white" />
          <line x1="143" y1="133" x2="155" y2="145" stroke="#d8d8d8" stroke-width="6" stroke-linecap="round" />
        </svg>
      </div>
      <div class="empty-text">{{ t('position.noData') }}</div>
    </div>

    <!-- 底部导航 -->
    <AppTabBar />
  </div>
</template>

<style scoped>
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
