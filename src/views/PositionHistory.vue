<template>
  <div class="position-history-page">
    <!-- 搜索栏 -->
    <div class="search-bar card-box d-flex align-items-center p-2 mb-3">
      <div class="px-2">
        <img alt="search" src="/src/assets/images/loupe.png" width="20" />
      </div>
      <div class="flex-grow-1">
        <input
          v-model="searchDate"
          class="form-control form-control-sm"
          type="date"
          readonly
          @click="showDatePicker = true"
        />
      </div>
      <div class="px-2">
        <button class="btn btn-success btn-sm" @click="handleSearch">
          搜尋
        </button>
      </div>
    </div>

    <!-- 日期选择器 -->
    <van-popup v-model:show="showDatePicker" position="bottom">
      <van-date-picker 
        title="選擇日期" 
        @confirm="onConfirmDate" 
        @cancel="showDatePicker = false" 
      />
    </van-popup>

    <!-- 标签切换 -->
    <div class="d-flex text-center card-box mb-3 tabs-container">
      <div 
        class="flex-grow-1 p-3 tab-item" 
        :class="{ active: activeTab === 'record' }"
        @click="switchTab('record')"
      >
        <span>持倉記錄</span>
      </div>
      <div 
        class="flex-grow-1 p-3 tab-item active" 
        :class="{ active: activeTab === 'history' }"
        @click="switchTab('history')"
      >
        <span>持倉歷史</span>
      </div>
    </div>

    <!-- 历史持仓列表 -->
    <div role="feed" class="van-list tw-space-y-4 position-list">
      <div 
        v-for="position in positionHistory" 
        :key="position.id" 
        class="tw-bg-white tw-rounded-lg tw-p-4 tw-shadow-sm tw-mb-3 tw-transition-transform tw-duration-200 hover:tw-transform hover:tw-scale-105 position-item"
      >
        <div class="tw-flex tw-mb-2 tw-items-center tw-gap-3">
          <div class="tw-text-gray-500">
            <img 
              :src="position.avatar" 
              class="tw-w-[40px] tw-rounded-full" 
              :alt="position.name"
            />
          </div>
          <div class="tw-font-500 tw-text-16">{{ position.name }}</div>
        </div>
        <div class="tw-flex tw-justify-between tw-items-center tw-mb-2">
          <span class="tw-text-14 tw-font-medium tw-text-gray-600">訂單號:{{ position.orderId }}</span>
          <div class="tw-flex tw-items-center tw-gap-1.5">
            <span 
              class="tw-text-white tw-py-1 tw-px-3 tw-rounded-2xl tw-text-12"
              :class="position.profitStatus === '盈利' ? 'tw-bg-green-500' : 'tw-bg-red-500'"
            >
              {{ position.profitStatus }}
            </span>
          </div>
        </div>
        <div class="tw-grid tw-grid-cols-2 tw-gap-3 tw-text-12 tw-mb-2">
          <div>
            <div class="tw-text-gray-500">建倉價</div>
            <div class="tw-font-medium">{{ position.openPrice }}</div>
          </div>
          <div>
            <div class="tw-text-gray-500">平倉價</div>
            <div class="tw-font-medium">{{ position.closePrice }}</div>
          </div>
          <div>
            <div class="tw-text-gray-500">購買金額</div>
            <div class="tw-font-medium">{{ position.amount }}</div>
          </div>
          <div>
            <div class="tw-text-gray-500">盈虧金額</div>
            <div 
              class="tw-font-medium"
              :class="position.profitStatus === '盈利' ? 'tw-text-green-500' : 'tw-text-red-500'"
            >
              {{ position.profitAmount }}
            </div>
          </div>
        </div>
        <div class="tw-flex tw-justify-between tw-items-center">
          <div class="tw-text-gray-500 tw-text-12">創建時間: {{ position.createTime }}</div>
          <div class="tw-text-gray-500 tw-text-12">週期: {{ position.period }}</div>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <AppTabBar />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppTabBar from '../components/AppTabBar.vue'

// 当前激活的标签页
const activeTab = ref('history') // 默认显示历史标签

// 日期搜索
const searchDate = ref('')
const showDatePicker = ref(false)

// 持仓历史数据
const positionHistory = ref([
  {
    id: 1,
    name: '央行數字貨幣',
    orderId: 'O202511112044037511',
    profitStatus: '盈利',
    openPrice: '4.5678',
    closePrice: '4.6123',
    amount: '1,000',
    profitAmount: '+23.45',
    createTime: '2025/04/10 15:30',
    period: '5分鐘',
    avatar: 'https://api.zdvfyu.top/uploads/20250410/500df2fa65029a7ad493cd1fd2884312.png'
  },
  {
    id: 2,
    name: '比特幣',
    orderId: 'O202511112044037512',
    profitStatus: '虧損',
    openPrice: '68000',
    closePrice: '67500',
    amount: '0.5',
    profitAmount: '-250.00',
    createTime: '2025/04/09 10:15',
    period: '3分鐘',
    avatar: 'https://api.zdvfyu.top/uploads/20250410/bitcoin-icon.png'
  },
  {
    id: 3,
    name: '以太坊',
    orderId: 'O202511112044037513',
    profitStatus: '盈利',
    openPrice: '3200',
    closePrice: '3250',
    amount: '2',
    profitAmount: '+100.00',
    createTime: '2025/04/08 18:45',
    period: '10分鐘',
    avatar: 'https://api.zdvfyu.top/uploads/20250410/ethereum-icon.png'
  }
])

// 切换标签页
const switchTab = (tab: string) => {
  activeTab.value = tab
  if (tab === 'record') {
    // 跳转到持仓记录页面
    // 这里可以根据需要实现路由跳转
  }
}

// 确认日期选择
const onConfirmDate = (value: Date) => {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  searchDate.value = `${year}/${month}/${day}`
  showDatePicker.value = false
}

// 搜索功能
const handleSearch = () => {
  console.log('搜索日期:', searchDate.value)
  // TODO: 实现搜索逻辑
}
</script>

<style scoped>
.position-history-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 60px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 搜索栏 */
.search-bar {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  font-size: 14px;
}

.form-control-sm {
  height: 36px;
}

.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 8px 16px;
  font-size: 14px;
  line-height: 1.5;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-sm {
  padding: 4px 12px;
  font-size: 12px;
}

.btn-success {
  color: #fff;
  background-color: #28a745;
  border-color: #28a745;
}

/* 卡片盒子 */
.card-box {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 标签容器 */
.tabs-container {
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

/* 列表 */
.position-list {
  padding: 16px;
}

.position-item {
  transition: transform 0.2s, box-shadow 0.2s;
}

.position-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  margin-bottom: 0.75rem;
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

.tw-grid-cols-2 {
  grid-template-columns: 1fr 1fr;
}

.tw-gap-3 {
  gap: 0.75rem;
}

.tw-text-12 {
  font-size: 0.75rem;
}

.tw-text-14 {
  font-size: 0.875rem;
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
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.hover\:tw-scale-105:hover {
  --tw-scale-x: 1.05;
  --tw-scale-y: 1.05;
}

.tw-w-\[40px\] {
  width: 40px;
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

.tw-text-12 {
  font-size: 0.75rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .position-history-page {
    padding-bottom: 70px;
  }

  .search-bar {
    padding: 12px;
  }

  .position-list {
    padding: 12px;
  }
}
</style>