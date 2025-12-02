<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

// 导入国旗图片
import chinaFlag from '@/assets/images/flags/china.png'
import hongKongFlag from '@/assets/images/flags/hong-kong.png'
import usFlag from '@/assets/images/flags/us.png'
import jpFlag from '@/assets/images/flags/jp.png'
import viFlag from '@/assets/images/flags/vi.png'
import koFlag from '@/assets/images/flags/ko.png'

const { locale } = useI18n()
const router = useRouter()

interface LanguageOption {
  code: string
  name: string
  flag: string
}

const languages: LanguageOption[] = [
  { code: 'zh-CN', name: '简体中文', flag: chinaFlag },
  { code: 'zh-TW', name: '繁體中文', flag: hongKongFlag },
  { code: 'en', name: 'English', flag: usFlag },
  { code: 'ja', name: '日本語', flag: jpFlag },
  { code: 'vi', name: 'Tiếng Việt', flag: viFlag },
  { code: 'ko', name: '한국인', flag: koFlag },
]

const changeLanguage = (langCode: string) => {
  locale.value = langCode
  localStorage.setItem('language', langCode)
  // 切换语言后返回首页
  router.go(-1)
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <main class="language-page">
    <div class="content">
      <div class="title">切換語言</div>
      <div class="language-list">
        <div
          v-for="lang in languages"
          :key="lang.code"
          class="language-item"
          :class="{ active: locale === lang.code }"
          @click="changeLanguage(lang.code)"
        >
          <img :src="lang.flag" :alt="lang.name" class="flag-icon" />
          {{ lang.name }}
        </div>
      </div>
    </div>
    <!-- <div class="back-button" @click="goBack">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M15 18L9 12L15 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div> -->
    <div class="br-back back-button" @click="goBack"></div>
  </main>
</template>

<style scoped>
.language-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f5f5 0%, #e8e8e8 100%);
  position: relative;
}

.content {
  padding: 0;
}

.title {
  padding: 1rem;
  text-align: center;
  margin-top: 0.5rem;
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}

.language-list {
  padding: 1rem;
}

.language-item {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  padding: 0.875rem;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  color: #333;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.language-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.language-item.active {
  background: #d4e7ff;
  color: #1a5fa8;
  font-weight: 500;
}

.flag-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.back-button {
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

.back-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(78, 204, 163, 0.4);
}

.back-button:active {
  transform: scale(0.95);
}
</style>
