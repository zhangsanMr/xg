import { createI18n } from 'vue-i18n'
import zhTW from './locales/zh-TW'
import zhCN from './locales/zh-CN'
import en from './locales/en'
import ja from './locales/ja'
import ko from './locales/ko'
import vi from './locales/vi'
const savedLang = localStorage.getItem('language') || 'zh-TW'

const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-TW': zhTW,
    'zh-CN': zhCN,
    en: en,
    ja: ja,
    ko: ko,
    vi: vi,
  },
})

export default i18n
