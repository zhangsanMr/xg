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
      <h6 class="p-3 text-center mt-2 article-title">關於我們</h6>
      <div class="p-3 article-body">
        <p>
          中國國際金融股份有限公司（中金公司，601995.SH，3908.HK）成立於1995年，憑藉率先採用市場最佳實踐以及深厚的專業知識，我們完成了眾多開創先河的交易，並深度參與中國經濟改革與發展，與客戶共同成長。我們的目標是打造成為具有國際競爭力的一流投資銀行。
        </p>
        <p>
          我們一直致力於為多元化的客戶群提供高品質金融增值服務，建立了以研究和資訊科技為基礎，投資銀行、股票業務、固定收益、資產管理、私募股權和財富管理全方位發展的均衡業務結構。
        </p>
        <p>
          憑藉著深厚的經濟、產業、法律、法規等領域的專業知識，我們優質的服務獲得了廣泛認可。同時，永續發展始終是我們的核心理念之一，我們期望為社會創造長期價值，並以行業高標準積極實踐企業社會責任。
        </p>
        <p>
          2015年，中金公司在香港聯交所主機板成功上市。
          2017年，中金公司與原中國中投證券的策略重組完成，本次交易使中金公司規模顯著擴大，實現了對大、中小企業及機構、個人客戶更為深度的覆蓋，構建了更為均衡的一二級市場業務結構。
          2020年，中金公司在上海證券交易所主機板成功掛牌上市。
        </p>
        <p>
          集團總部位於北京，境內擁有多家子公司，並在上海、深圳、廈門、成都、杭州、濟南、重慶、瀋陽、南京、蘇州設有分公司。此外，集團及下屬子公司在中國大陸30個省、自治區、直轄市擁有200多個證券營業部。集團也積極開拓境外市場，在中國香港、紐約、倫敦、新加坡、舊金山、法蘭克福、東京七個國際金融中心設有子公司或分公司。
        </p>
        <p>
          秉承「植根中國，融通世界」的概念，透過廣泛的業務網絡及傑出的跨境能力，中金公司將持續為客戶提供一流的金融服務，協助客戶實現其策略發展目標。
        </p>
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
