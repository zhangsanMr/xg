<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { type Result, http } from '../http'
const { t } = useI18n()
const router = useRouter()

// 定义接口类型
interface CashRecordData {
  id: number
  uid: number
  name: string
  bid: number
  bank: string
  area: string
  code: string
  account: string
  money: string
  status: number
  time: string
  time2: string
  warn: number
  dzje: string
  sxf: number
  sxfbfb: string
  id_type: number
  reaolae?: string
}

// 提现记录列表
interface WithdrawRecord {
  id: number
  amount: number
  actualAmount: number
  status: number
  createTime: string
  // 添加来自API的字段
  name: string
  bank: string
  account: string
  dzje: string // 到账金额
  sxf: string // 手续费（百分比或描述字符串）
  idTypeView: string
  reaolae?: string
}

const withdrawList = ref<WithdrawRecord[]>([])

const loading = ref(false)
const finished = ref(false)

// 使用API获取提现记录
const loadWithdrawRecords = async () => {
  try {
    const response: Result<CashRecordData[]> = await http({
      url: '/api/user/cash_record',
      method: 'POST',
      showLoading: true,
    })

    if (response.code === 0) {
      // 将API返回的数据转换为组件使用的格式
      withdrawList.value = response.data.map(item => ({
        id: item.id,
        amount: parseFloat(item.money),
        actualAmount: parseFloat(item.dzje),
        status: item.status,
        createTime: item.time,
        name: item.name,
        bank: item.bank,
        account: item.account,
        dzje: item.dzje,
        sxf: item.sxfbfb,
        idTypeView:
          item.id_type === 1
            ? t('withdrawDetail.bankCard')
            : item.id_type === 2
              ? t('withdrawDetail.usdtTrc20')
              : t('withdrawDetail.usdtErc20'),
        reaolae: item.reaolae,
      }))

      console.log('提现记录:', withdrawList.value)
    } else {
      console.error('获取提现记录失败:', response.info)
    }
  } catch (error) {
    console.error('获取提现记录错误:', error)
  } finally {
    loading.value = false
    finished.value = true
  }
}

const formatBankAccount = (account?: string) => {
  if (!account) return '--'
  const len = account.length
  if (len <= 4) return account
  const last4 = account.slice(-4)
  const masked = '*'.repeat(len - 4)
  return `${masked}${last4}`
}

// 加载更多
const onLoad = () => {
  loadWithdrawRecords()
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 获取状态文本
const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    0: t('withdrawDetail.statusPending'),
    1: t('withdrawDetail.statusSuccess'),
    2: t('withdrawDetail.statusFailed'),
  }
  return statusMap[status] || status
}

// 获取状态样式类
const getStatusClass = (status: number) => {
  const classMap: Record<number, string> = {
    0: 'status-pending',
    1: 'status-success',
    2: 'status-failed',
  }
  return classMap[status] || ''
}

onMounted(() => {
  onLoad()
})
</script>

<template>
  <main class="withdraw-detail-page">
    <!-- 顶部标题栏 -->
    <div class="header">
      <div class="title">{{ t('withdrawDetail.title') }}</div>
      <div class="back" @click="goBack"></div>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <div class="list-container">
        <div class="record-list">
          <!-- 提现记录卡片 -->
          <div v-for="record in withdrawList" :key="record.id" class="record-card">
            <div class="card-header">
              <span class="amount">{{ record.amount.toFixed(2) }}元</span>
              <span>
                <span :class="['status-badge', getStatusClass(record.status)]">
                  {{ getStatusText(record.status) }}
                </span>
              </span>
            </div>
            <div class="time">{{ record.createTime }}</div>
            <div class="detail">
              <div>
                {{ t('withdrawDetail.withdrawAmount') }} {{ record.amount.toFixed(2) }},
                {{ t('withdrawDetail.actualAmount') }} {{ record.actualAmount.toFixed(2) }}
              </div>
            </div>
            <div class="detail">
              <div>
                {{ t('withdrawDetail.account') }} {{ record.idTypeView }}, {{ t('login.emailLabel') }}
                {{ formatBankAccount(record.account) }}
              </div>
            </div>
            <div v-if="record.status === 2 && record.reaolae" class="detail">
              <div>{{ t('withdrawDetail.reason') }}：{{ record.reaolae }}</div>
            </div>
          </div>
          <!-- 加载状态 -->
          <div v-if="loading" class="loading-text">{{ t('withdrawDetail.loading') }}</div>
          <div v-if="finished && withdrawList.length === 0" class="empty-text">
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
