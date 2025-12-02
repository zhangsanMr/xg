<template>
  <transition name="bottom-sheet-fade">
    <div v-if="visable" class="bottom-sheet-overlay fixed-center-viewport" @click.self="handleClose">
      <div class="bottom-sheet-panel">
        <!-- 顶部标题栏 -->
        <header class="sheet-header">
          <div class="sheet-title">
            <span class="sheet-title-main">{{ productDetail?.title }}</span>
            <span class="sheet-tag" :class="[orderType == 0 ? 'sheet-tag--long' : 'sheet-tag--short']">
              {{ orderType == 0 ? t('trade.buyLong') : t('trade.buyShort') }}
            </span>
          </div>
          <button type="button" class="sheet-cancel" @click="handleClose">
            {{ t('trade.close') }}
          </button>
        </header>

        <!-- 内容区，可通过插槽完全覆盖 -->
        <div class="sheet-body">
          <slot>
            <!-- 金额 -->
            <section class="sheet-section">
              <div class="sheet-section-label">{{ t('trade.amount') }}</div>
              <div class="amount-input-wrapper">
                <input v-model="localAmount" class="amount-input" type="number" :placeholder="t('trade.enterAmount')" />
                <div class="amount-unit">HKD</div>
              </div>
              <div class="amount-footer">
                <span class="amount-balance-label">{{ t('trade.balance') + ':' + productDetail?.user_money }}</span>
                <button type="button" class="amount-all" @click="emitAll">
                  {{ t('trade.orderAll') }}
                </button>
              </div>
            </section>

            <!-- 时间 -->
            <section class="sheet-section sheet-section-time">
              <div class="sheet-section-label">{{ t('trade.time') }}</div>
              <div class="time-grid" v-if="timeOptions">
                <div
                  v-for="item in timeOptions"
                  :key="item.id"
                  class="time-item"
                  :class="{ 'time-item--active': item.id === currentTimeOption?.id }"
                  @click="currentTimeOption = item"
                >
                  <div style="font-size: 16px; color: #000">
                    {{ item.protime }}
                    <span style="font-size: 12px; color: darkgray">{{ t('trade.seconds') }}</span>
                  </div>
                  <div style="font-size: 12px">
                    {{ t('trade.profitPercent') }}
                    <span style="color: #2dc08e">{{ item.proscale }}</span>
                    %
                  </div>
                  <div style="font-size: 12px">
                    {{ t('trade.min') }}:
                    <span style="color: red">{{ item.jine }}</span>
                  </div>
                </div>
              </div>
            </section>

            <!-- 底部统计 -->
            <section class="sheet-section sheet-section-summary">
              <div class="summary-row">
                <div class="summary-item">
                  <div class="summary-label">{{ t('trade.currentPrice') }}</div>
                  <div class="summary-value">{{ props.curPrice }}</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">{{ t('trade.amount') }}</div>
                  <div class="summary-value">{{ localAmount || '0' }}</div>
                </div>

                <div class="summary-item">
                  <div class="summary-label">{{ t('trade.estimate') }}</div>
                  <div class="summary-value">{{ displayIncome }}</div>
                </div>
              </div>
            </section>
          </slot>
        </div>

        <!-- 底部按钮 -->
        <footer class="sheet-footer">
          <button type="button" class="sheet-confirm" @click="handleConfirm">
            {{ t('trade.confirmOrder') }}
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchProductAjaxPro } from '../services/trade'
import { addOrder, type AddOrderPayload } from '../services/order'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'

const { t } = useI18n()
const route = useRoute()

const props = withDefaults(defineProps<{ curPrice: string }>(), {
  curPrice: '0.00',
})

const productId = ref((route.query.id as string) || '0')
const productDetail = ref<{ user_money?: number | string; Price?: number | string } & Record<string, any>>({})
const localAmount = ref()

const timeOptions = ref()
const currentTimeOption = ref()

const emit = defineEmits<{
  'update:amount': [value: number]
  'update:time': [value: number]
  confirm: [payload: { amount: number; time: number | null }]
  all: []
}>()

const displayIncome = computed(() => {
  if (!productDetail.value) return 0
  if (!localAmount.value) return 0
  if (!currentTimeOption.value) return 0
  const n = (Number(localAmount.value) * Number(currentTimeOption.value.proscale)) / 100
  return Number.isNaN(n) ? '0.00' : n.toFixed(2)
})

const loadProductDetail = async () => {
  const res = await fetchProductAjaxPro(productId.value)
  if (res && res.code === 0 && res.data) {
    productDetail.value = res.data
    // 动态生成周期选项，过滤掉为 0 的值
    const d = res.data

    const newOptions: any[] = []
    getTimeOption(newOptions, d.protime_1, d.proscale_1, d.lossrate_1, d.jine1, 1)
    getTimeOption(newOptions, d.protime_2, d.proscale_2, d.lossrate_2, d.jine2, 2)
    getTimeOption(newOptions, d.protime_3, d.proscale_3, d.lossrate_3, d.jine3, 3)
    getTimeOption(newOptions, d.protime_4, d.proscale_4, d.lossrate_4, d.jine4, 4)
    getTimeOption(newOptions, d.protime_5, d.proscale_5, d.lossrate_5, d.jine5, 5)
    getTimeOption(newOptions, d.protime_6, d.proscale_6, d.lossrate_6, d.jine6, 6)
    // getTimeOption(newOptions, d.protime_7, d.proscale_7, d.lossrate_7, 7)
    timeOptions.value = newOptions
  }
}

const getTimeOption = (
  list: any[],
  protime: number,
  proscale: string,
  lossrate: string,
  jine: string | undefined,
  index: number
) => {
  if (!protime) return
  list.push({
    id: index,
    protime,
    proscale,
    lossrate,
    jine,
  })
}

const handleClose = () => {
  visable.value = false
}

const handleConfirm = async () => {
  const amountNum = Number(localAmount.value || 0)
  if (!productDetail.value || !currentTimeOption.value || Number.isNaN(amountNum) || amountNum <= 0) {
    showToast(t('trade.amountError1'))
    return
  }
  // 下单金额不能大于余额
  if (amountNum > Number(productDetail.value.user_money ?? 0)) {
    showToast(t('trade.amountError2'))
    return
  }
  // 下单金额不能小于最小值
  if (amountNum < Number(currentTimeOption.value.jine)) {
    showToast(t('trade.amountError3'))
    return
  }

  const payload: AddOrderPayload = {
    order_type: orderType.value,
    order_pid: productId.value,
    order_price: amountNum,
    order_sen: currentTimeOption.value.protime,
    order_shouyi: currentTimeOption.value.proscale,
    order_kuishun: currentTimeOption.value.lossrate,
  }

  try {
    const res = await addOrder(payload)
    console.log('addorder result', res)
    // 下单成功后关闭弹层并回传参数，具体成功判断根据后端 code 调整
    visable.value = false
    showToast(t('trade.orderSuccess'))
    emit('confirm', { amount: amountNum, time: currentTimeOption.value.protime })
  } catch (error) {
    console.error('addorder failed', error)
  }
}

const emitAll = () => {
  localAmount.value = productDetail.value.user_money ?? 0
}

const visable = ref(false)
const orderType = ref(0)

const open = (type: number) => {
  visable.value = true
  orderType.value = type
  loadProductDetail()
}

defineExpose({
  open,
})

onMounted(() => {
  loadProductDetail()
})
</script>

<style scoped>
.bottom-sheet-overlay {
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
}

.bottom-sheet-panel {
  width: 100%;
  max-width: 480px;
  background: #f7f7f9;
  border-radius: 16px 16px 0 0;
  padding: 16px 16px 24px;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.12);
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.sheet-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sheet-title-main {
  font-size: 16px;
  font-weight: 600;
  color: #111;
}

.sheet-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  color: #fff;
}
.sheet-tag--short {
  background: #2dc08e;
}
.sheet-tag--long {
  background: #ff4d5b;
}

.sheet-cancel {
  border: none;
  background: transparent;
  font-size: 14px;
  color: #6c757d;
}

.sheet-body {
  max-height: 70vh;
  overflow-y: auto;
}

.sheet-section {
  margin-bottom: 20px;
}

.sheet-section-label {
  font-size: 14px;
  color: #7b7b80;
  margin-bottom: 8px;
}

.amount-input-wrapper {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f3f4fb;
  border-radius: 12px;
}

.amount-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: #111;
}

.amount-input::placeholder {
  color: #c4c4c8;
}

.amount-unit {
  margin-left: 8px;
  font-size: 14px;
  color: #c4c4c8;
}

.amount-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
}

.amount-balance-label {
  color: #c4c4c8;
}

.amount-balance-unit {
  color: #c4c4c8;
  margin-left: 4px;
}

.amount-all {
  border: none;
  background: transparent;
  font-size: 12px;
  color: #ff4d5b;
}

.sheet-section-time {
  margin-top: 8px;
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.time-item {
  height: 80px;
  border-radius: 4px;
  border: none;
  background: #f3f4fb;
  font-size: 14px;
  color: #7b7b80;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.time-item--active {
  border: 1px solid #008a42;
}

.sheet-section-summary {
  margin-top: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.summary-item {
}

.summary-label {
  font-size: 12px;
  color: #c4c4c8;
}

.summary-value {
  margin-top: 4px;
  font-size: 14px;
  color: #111;
}

.sheet-footer {
  margin-top: 16px;
}

.sheet-confirm {
  width: 100%;
  height: 48px;
  background: #fff;
  font-size: 16px;
  border: 1px solid #008a42;
  border-radius: 24px;
  color: #008a42;
}

.bottom-sheet-fade-enter-active,
.bottom-sheet-fade-leave-active {
  transition: opacity 0.2s ease;
}

.bottom-sheet-fade-enter-from,
.bottom-sheet-fade-leave-to {
  opacity: 0;
}
</style>
