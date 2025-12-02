<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { type Result, http } from '../http'

const { t } = useI18n()
const router = useRouter()

// 接口返回字段
interface RechargeRecordApi {
  id: number
  uid: number
  money: string
  type: string
  orderid: string
  status: number
  warn: number
  reason: string
  time: string
  time2: string
  reaolae: string | null
  payments_id: number
}

// 页面展示用字段
interface RechargeRecord {
  id: number
  amount: number
  status: number
  createTime: string
  orderId: string
}

const rechargeList = ref<RechargeRecord[]>([])
const loading = ref(false)
const finished = ref(false)

// 获取状态样式类
const getStatusClass = (status: number) => {
  const classMap: Record<number, string> = {
    0: 'status-pending',
    1: 'status-success',
    2: 'status-failed',
  }
  console.log('classMap', classMap)
  console.log('status', status)

  return classMap[status] || ''
}

// 使用API获取充值记录
const loadRechargeRecords = async () => {
  loading.value = true
  try {
    const response: Result<RechargeRecordApi[]> = await http({
      url: '/api/user/recharge_record',
      method: 'POST',
      showLoading: true,
    })

    if (response.code === 0) {
      rechargeList.value = response.data.map(item => ({
        id: item.id,
        amount: parseFloat(item.money),
        status: item.status,
        createTime: item.time,
        orderId: item.orderid,
      }))
    } else {
      console.error('获取充值记录失败:', response.info)
    }
  } catch (error) {
    console.error('获取充值记录错误:', error)
  } finally {
    loading.value = false
    finished.value = true
  }
}

// 加载更多
const onLoad = () => {
  loadRechargeRecords()
}

// 返回上一页
const goBack = () => {
  router.back()
}

onMounted(() => {
  onLoad()
})
</script>

<template>
  <main class="withdraw-detail-page">
    <!-- 顶部标题栏 -->
    <div class="header">
      <div class="title">{{ t('user.rechargeDetail') }}</div>
      <div class="back" @click="goBack"></div>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <div class="list-container">
        <div class="record-list">
          <!-- 充值记录卡片 -->
          <div v-for="record in rechargeList" :key="record.id" class="record-card">
            <div class="card-header">
              <span class="amount">{{ record.amount.toFixed(2) }}元</span>
              <span>
                <span :class="['status-badge', getStatusClass(record.status)]">
                  {{ t('withdrawDetail.success') }}
                </span>
              </span>
            </div>
            <div class="time">{{ record.createTime }}</div>
            <div class="detail">
              <div>{{ t('withdrawDetail.rechargeAmount') }} {{ record.amount.toFixed(2) }}</div>
              <div>ID: {{ record.orderId }}</div>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="loading" class="loading-text">{{ t('withdrawDetail.loading') }}</div>

          <!-- 空状态 -->
          <div v-if="finished && rechargeList.length === 0" class="empty-text">
            <div class="empty-state">
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
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.withdraw-detail-page {
  min-height: 100vh;
  background: #f6f7fb;
}

/* 顶部标题栏 */
.header {
  position: relative;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 14px;
  color: #000;
  font-weight: 400;
  text-align: center;
}

.back {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.back::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  border-left: 2px solid #000;
  border-bottom: 2px solid #000;
}

/* 内容区域 */
.content {
  padding: 0;
}

.list-container {
  padding: 12px;
  margin-top: 12px;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

/* 记录卡片 */
.record-card {
  background: #fff;
  border-radius: 7px;
  padding: 14px;
  box-shadow:
    0 3.5px 5.25px -0.875px rgba(0, 0, 0, 0.1),
    0 1.75px 3.5px -1.75px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3.5px;
}

.amount {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.status-badge {
  display: inline-block;
  padding: 3.5px 7px;
  border-radius: 5.25px;
  color: #fff;
  font-size: 10.5px;
  font-weight: 500;
}

.status-success {
  background: #22c55e;
}

.status-failed {
  background: #ef4444;
}

.status-pending {
  background: #f59e0b;
}

.time {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 3.5px;
}

.detail {
  font-size: 12px;
  color: #4b5563;
  margin-top: 3.5px;
  margin-bottom: 3.5px;
}

/* 加载和空状态 */
.loading-text,
.empty-text {
  text-align: center;
  padding: 20px;
  color: #9ca3af;
  font-size: 14px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .header {
    height: 44px;
  }

  .title {
    font-size: 16px;
  }

  .amount {
    font-size: 16px;
  }
}
</style>
