<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <main class="article-page">
    <div class="content">
      <h6 class="p-3 text-center mt-2 article-title">幫助中心</h6>
      <div class="p-3 article-body">
        <p>溫馨提示</p>
        <p>
          親愛的用戶您好，入市請聯繫在線客服獲取最新的入市賬戶，有任何問題請第一時間咨詢在線客服。客服人員服務時間為：09:00-23:00，平台不定期維護請留意平台公告，謝謝！！。
        </p>
        <p>尊敬的會員：</p>
        <p>
          您好，即日起，為了保障每一位會員用戶資金安全，用戶每日提現次數為一次，提現到賬時間約為兩個小時之內，具體到賬時間取決於出款信息的準確性以及收款行業務處理效率，如在節假日期間出款，超過24小時未收到款項，建議您下一工作日查詢款項到賬情況（到賬或退回）;大額出款，在工作日正常24小時內到賬，遇節假日順延至工作日到賬。
        </p>
        <p>提款時間為：10:00-22:00</p>
        <p>本平台禁止非法洗黑錢</p>
        <p>請知悉！感謝您的支持</p>
      </div>
    </div>
    <div class="br-back" @click="goBack"></div>
  </main>
</template>

<style scoped>
.article-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  color: #000000 !important;
}

.content {
  flex-grow: 1;
  width: 100%;
  height: 0;
  overflow-y: auto;
  background: #ffffff;
}

.article-title {
  font-size: 15px;
  font-weight: 600;
}

.article-body {
  font-size: 13px;
  line-height: 1.6;
  color: #1f1f1f;
  font-family:
    monospace, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}

.article-body p {
  margin-bottom: 0.5rem;
}

.p-3 {
  padding: 1rem !important;
}

.text-center {
  text-align: center;
}

.mt-2 {
  margin-top: 0.5rem !important;
}

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
</style>
