<template>
  <div class="introduce-page">
    <!-- 顶部导航栏 -->
    <header class="page-header">
      <div class="header-container">
        <div class="logo">
          <img src="https://www.cicc.com/upload/repository/image/L6EnXt9MT6akp5dErvMDhw.png" alt="CICC Logo" />
        </div>
        <nav class="navigation">
          <a href="#" class="nav-item">{{ $t('introduce.home') }}</a>
          <a href="#about" class="nav-item">{{ $t('introduce.about') }}</a>
          <a href="#business" class="nav-item">{{ $t('introduce.business') }}</a>
          <a href="#investor" class="nav-item">{{ $t('introduce.investor') }}</a>
        </nav>
        <div class="auth-buttons">
          <router-link to="/register" class="btn-register">{{ $t('introduce.register') }}</router-link>
          <router-link to="/login" class="btn-login">{{ $t('introduce.login') }}</router-link>
        </div>
      </div>
    </header>

    <!-- Banner轮播区 -->
    <section class="banner-section">
      <div class="banner-slider">
        <div class="banner-slide active">
          <img
            src="https://www.cicc.com/upload/image/2023/05/29/040ec362-d48e-4b84-908d-e98522fe77c7.jpg"
            alt="Banner 1"
          />
          <div class="banner-content">
            <h2>{{ $t('introduce.bannerTitle1') }}</h2>
          </div>
        </div>
      </div>
    </section>

    <!-- 关于中金 -->
    <section id="about" class="about-section">
      <div class="video-background">
        <!-- <video autoplay muted loop playsinline> -->
        <!-- <source src="/static/assets-temp/video.mp4" type="video/mp4" /> -->
        <!-- </video> -->
      </div>
      <div class="about-content">
        <div class="container">
          <h2>{{ $t('introduce.aboutTitle') }}</h2>
          <p>{{ $t('company.intro1') }}</p>
        </div>
      </div>
    </section>

    <!-- 中金观点 -->
    <section class="opinion-section">
      <div class="container">
        <div class="section-title">
          <h2>{{ $t('introduce.opinionTitle') }}</h2>
        </div>
        <div class="opinion-content">
          <div class="opinion-image">
            <img
              src="https://www.cicc.com/upload/repository/image/jsZxRE-FQKmtUlI-YnNbuA.jpg_280x180f.jpg"
              alt="Opinion"
            />
          </div>
          <div class="opinion-text">
            <p class="date">2024-07-19</p>
            <h3>{{ $t('introduce.opinionHeadline') }}</h3>
            <p class="summary">{{ $t('introduce.opinionSummary') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 业务介绍 -->
    <section id="business" class="business-section">
      <div class="container">
        <div class="section-title">
          <h2>{{ $t('introduce.businessTitle') }}</h2>
        </div>
        <div class="business-content">
          <ul class="business-list">
            <li
              v-for="(item, index) in businessItems"
              :key="index"
              :class="{ active: activeBusiness === index }"
              @click="selectBusiness(index)"
            >
              {{ item.title }}
            </li>
          </ul>
          <div v-if="businessItems[activeBusiness]" class="business-detail">
            <div class="detail-image">
              <img :src="businessItems[activeBusiness]?.image" :alt="businessItems[activeBusiness]?.title" />
            </div>
            <p class="detail-text">{{ businessItems[activeBusiness]?.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 全球布局 -->
    <section class="global-section">
      <div class="container">
        <div class="section-title">
          <h2>{{ $t('introduce.globalTitle') }}</h2>
        </div>
        <div class="global-content">
          <p>{{ $t('introduce.globalDescription') }}</p>
        </div>
      </div>
    </section>

    <!-- 投资人关系 -->
    <section id="investor" class="investor-section">
      <div class="container">
        <div class="section-title">
          <h2>{{ $t('introduce.investorTitle') }}</h2>
        </div>
        <div class="investor-content">
          <div class="investor-box">
            <h3>{{ $t('introduce.investorSubtitle') }}</h3>
            <p>{{ $t('introduce.investorDescription') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 语言切换器 -->
    <div class="language-switcher">
      <button @click="changeLanguage('zh-TW')" :class="{ active: currentLocale === 'zh-TW' }">繁體</button>
      <button @click="changeLanguage('zh-CN')" :class="{ active: currentLocale === 'zh-CN' }">简体</button>
      <button @click="changeLanguage('en')" :class="{ active: currentLocale === 'en' }">EN</button>
      <button @click="changeLanguage('ja')" :class="{ active: currentLocale === 'ja' }">日本語</button>
      <button @click="changeLanguage('ko')" :class="{ active: currentLocale === 'ko' }">한국어</button>
      <button @click="changeLanguage('vi')" :class="{ active: currentLocale === 'vi' }">Tiếng Việt</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()
const currentLocale = computed(() => locale.value)

const activeBusiness = ref(0)

const businessItems = computed(() => [
  {
    title: t('introduce.business1Title'),
    image: 'https://www.cicc.com/upload/image/2024/06/17/02c5c437-e38b-4692-8d80-dd1eaa22c912.jpg',
    description: t('introduce.business1Desc'),
  },
  {
    title: t('introduce.business2Title'),
    image: 'https://www.cicc.com/upload/image/2024/06/17/aa2b262f-2335-4148-898a-d7431ea0d517.jpg',
    description: t('introduce.business2Desc'),
  },
  {
    title: t('introduce.business3Title'),
    image: 'https://www.cicc.com/upload/image/2024/06/17/74dcebf9-0137-4d7d-947d-5ed22d0c2c21.jpg',
    description: t('introduce.business3Desc'),
  },
  {
    title: t('introduce.business4Title'),
    image: 'https://www.cicc.com/upload/image/2024/06/17/f11daa35-2735-426b-ba9e-07ca6967c086.jpg',
    description: t('introduce.business4Desc'),
  },
  {
    title: t('introduce.business5Title'),
    image: 'https://www.cicc.com/upload/image/2024/06/17/3c58b0d3-6f54-466e-b3e0-2f1f979ca9d1.jpg',
    description: t('introduce.business5Desc'),
  },
  {
    title: t('introduce.business6Title'),
    image: 'https://www.cicc.com/upload/image/2024/06/17/de466cde-267c-4e63-aa59-e2cf7f4db0cf.jpg',
    description: t('introduce.business6Desc'),
  },
  {
    title: t('introduce.business7Title'),
    image: 'https://www.cicc.com/upload/image/2024/06/17/4a73e47d-836f-4bf4-9596-4e1d3c1436ec.jpg',
    description: t('introduce.business7Desc'),
  },
])

const changeLanguage = (lang: string) => {
  locale.value = lang
}

const selectBusiness = (index: number) => {
  activeBusiness.value = index
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.introduce-page {
  font-family: -apple-system, 'system-ui', 'Helvetica Neue', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background-color: #ffffff;
  color: #333;
  min-height: 100vh;
}

/* 顶部导航栏 */
.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo img {
  height: 48px;
}

.navigation {
  display: flex;
  gap: 32px;
  flex: 1;
  justify-content: center;
}

.nav-item {
  text-decoration: none;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-item:hover {
  color: #7d2522;
}

.auth-buttons {
  display: flex;
  gap: 12px;
}

.btn-register,
.btn-login {
  padding: 8px 20px;
  border-radius: 20px;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-register {
  background: rgba(229, 229, 229, 0.8);
  color: #5f1115;
  border: 1px solid #fff;
}

.btn-login {
  background: #692d33;
  color: #fff;
  border: 1px solid #692d33;
}

.btn-register:hover,
.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Banner区域 */
.banner-section {
  margin-top: 80px;
  position: relative;
  height: 600px;
  overflow: hidden;
}

.banner-slider {
  width: 100%;
  height: 100%;
}

.banner-slide {
  position: relative;
  width: 100%;
  height: 100%;
}

.banner-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-content {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  text-align: center;
}

.banner-content h2 {
  font-size: 48px;
  font-weight: 600;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

/* 关于中金 */
.about-section {
  position: relative;
  height: 600px;
  overflow: hidden;
}

.video-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.video-background video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.about-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  color: #fff;
}

.about-content .container {
  max-width: 800px;
  padding: 0 40px;
  text-align: center;
}

.about-content h2 {
  font-size: 36px;
  margin-bottom: 24px;
}

.about-content p {
  font-size: 18px;
  line-height: 1.8;
}

/* 通用容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

.section-title {
  text-align: center;
  padding: 60px 0 40px;
}

.section-title h2 {
  font-size: 32px;
  color: #333;
  font-weight: 600;
}

/* 中金观点 */
.opinion-section {
  background: url(/static/img/index/opinion.jpg) center/cover;
  background-color: #f5f5f5;
  padding: 80px 0;
}

.opinion-content {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.opinion-image {
  width: 280px;
  flex-shrink: 0;
}

.opinion-image img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
}

.opinion-text {
  flex: 1;
}

.opinion-text .date {
  color: #999;
  font-size: 14px;
  margin-bottom: 12px;
}

.opinion-text h3 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #333;
}

.opinion-text .summary {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
}

/* 业务介绍 */
.business-section {
  background: url(/static/img/index/business.jpg) center/cover;
  background-color: #fff;
  padding: 80px 0;
}

.business-content {
  display: flex;
  gap: 40px;
}

.business-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 200px;
}

.business-list li {
  padding: 12px 24px;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 16px;
  color: #333;
}

.business-list li:hover {
  background: #692d33;
  color: #fff;
  transform: translateX(8px);
}

.business-list li.active {
  background: #7d2522;
  color: #fff;
  font-weight: 600;
}

.business-detail {
  flex: 1;
}

.detail-image {
  width: 100%;
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
}

.detail-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.detail-text {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
}

/* 全球布局 */
.global-section {
  background: #f9f9f9;
  padding: 80px 0;
}

.global-content {
  text-align: center;
}

.global-content p {
  font-size: 18px;
  line-height: 1.8;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
}

/* 投资人关系 */
.investor-section {
  background: #fff;
  padding: 80px 0;
}

.investor-content {
  display: flex;
  justify-content: center;
}

.investor-box {
  max-width: 800px;
  padding: 40px;
  background: #f5f5f5;
  border-radius: 8px;
  text-align: center;
}

.investor-box h3 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.investor-box p {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
}

/* 语言切换器 */

.language-switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  z-index: 1000;
  flex-wrap: wrap;
  max-width: 450px;
  justify-content: flex-end;
}

.language-switcher button {
  padding: 8px 12px;
  background-color: #333;
  color: #fff;
  border: 1px solid #555;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
  white-space: nowrap;
}

.language-switcher button:hover {
  background-color: #444;
}

.language-switcher button.active {
  background-color: #4caf50;
  border-color: #4caf50;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    padding: 10px 0;
  }

  .header-container {
    padding: 15px 20px;
    flex-wrap: wrap;
  }

  .logo img {
    height: 36px;
  }

  .navigation {
    display: none;
  }

  .auth-buttons {
    gap: 8px;
  }

  .btn-register,
  .btn-login {
    padding: 6px 16px;
    font-size: 12px;
  }

  .banner-section {
    height: 400px;
    margin-top: 60px;
  }

  .banner-content h2 {
    font-size: 28px;
  }

  .about-section {
    height: 400px;
  }

  .about-content h2 {
    font-size: 24px;
  }

  .about-content p {
    font-size: 14px;
  }

  .container {
    padding: 0 20px;
  }

  .section-title {
    padding: 40px 0 24px;
  }

  .section-title h2 {
    font-size: 24px;
  }

  .opinion-section {
    padding: 40px 0;
  }

  .opinion-content {
    flex-direction: column;
  }

  .opinion-image {
    width: 100%;
  }

  .opinion-text h3 {
    font-size: 20px;
  }

  .business-section {
    padding: 40px 0;
  }

  .business-content {
    flex-direction: column;
  }

  .business-list {
    flex-direction: row;
    flex-wrap: wrap;
    min-width: unset;
  }

  .business-list li {
    padding: 8px 16px;
    font-size: 14px;
  }

  .detail-image img {
    height: 250px;
  }

  .global-section,
  .investor-section {
    padding: 40px 0;
  }

  .investor-box {
    padding: 24px;
  }

  .investor-box h3 {
    font-size: 20px;
  }

  .language-switcher {
    top: 10px;
    right: 10px;
    max-width: 95%;
    gap: 6px;
  }

  .language-switcher button {
    padding: 6px 10px;
    font-size: 11px;
  }
}
</style>
