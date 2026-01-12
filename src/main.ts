import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import 'vant/lib/index.css'
// import DevicePixelRatio from './utils/devicePixelRatio'

// // 校正 Windows 系统缩放导致的页面放大问题
// new DevicePixelRatio().init()

createApp(App).use(router).use(i18n).mount('#app')
