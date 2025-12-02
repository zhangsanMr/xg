<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const languages = [
  { text: '繁體中文', value: 'zh-TW' },
  { text: '简体中文', value: 'zh-CN' },
  { text: 'English', value: 'en' },
  { text: '日本語', value: 'ja' },
  { text: '한국어', value: 'ko' },
  { text: 'Tiếng Việt', value: 'vi' },
]

const currentLanguageText = computed(() => {
  const lang = languages.find(l => l.value === locale.value)
  return lang?.text || '简体中文'
})

// 语言实际选择在独立的 Language 页面完成，这里只展示当前语言文本
</script>

<template>
  <!-- 顶部导航栏 -->
  <div class="top-header">
    <div class="header-content">
      <div class="logo-box">
        <img class="logo-img" src="../assets/images/logo-KOkCftwx.png" alt="CICC Logo" />
      </div>
      <div class="language-switcher">
        <svg class="globe-icon" fill="currentColor" height="16" viewBox="0 0 16 16" width="16">
          <path
            d="m10.495 6.92 1.278-.619a.483.483 0 0 0 .126-.782c-.252-.244-.682-.139-.932.107-.23.226-.513.373-.816.53l-.102.054c-.338.178-.264.626.1.736a.476.476 0 0 0 .346-.027ZM7.741 9.808V9.78a.413.413 0 1 1 .783.183l-.22.443a.602.602 0 0 1-.12.167l-.193.185a.36.36 0 1 1-.5-.516l.112-.108a.453.453 0 0 0 .138-.326ZM5.672 12.5l.482.233A.386.386 0 1 0 6.32 12h-.416a.702.702 0 0 1-.419-.139l-.277-.206a.302.302 0 1 0-.298.52l.761.325Z"
          />
          <path
            d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM1.612 10.867l.756-1.288a1 1 0 0 1 1.545-.225l1.074 1.005a.986.986 0 0 0 1.36-.011l.038-.037a.882.882 0 0 0 .26-.755c-.075-.548.37-1.033.92-1.099.728-.086 1.587-.324 1.728-.957.086-.386-.114-.83-.361-1.2-.207-.312 0-.8.374-.8.123 0 .24-.055.318-.15l.393-.474c.196-.237.491-.368.797-.403.554-.064 1.407-.277 1.583-.973.098-.391-.192-.634-.484-.88-.254-.212-.51-.426-.515-.741a6.998 6.998 0 0 1 3.425 7.692 1.015 1.015 0 0 0-.087-.063l-.316-.204a1 1 0 0 0-.977-.06l-.169.082a1 1 0 0 1-.741.051l-1.021-.329A1 1 0 0 0 11.205 9h-.165a1 1 0 0 0-.945.674l-.172.499a1 1 0 0 1-.404.514l-.802.518a1 1 0 0 0-.458.84v.455a1 1 0 0 0 1 1h.257a1 1 0 0 1 .542.16l.762.49a.998.998 0 0 0 .283.126 7.001 7.001 0 0 1-9.49-3.409Z"
          />
        </svg>
        <a href="#/language" class="lang-link">
          <b class="lang-text">{{ currentLanguageText }}</b>
        </a>
      </div>
    </div>
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

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
  border-radius: 50%;
  position: relative;
}

.logo-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-en {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.logo-cn {
  font-size: 12px;
  color: #666;
}

.language-selector {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}
</style>
