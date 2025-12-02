<template>
  <div class="app-root">
    <main class="app-container">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { http } from './http'

const fetchChatService = async () => {
  try {
    const { data } = await http<{ service: string }>({
      url: '/api/login/service',
      method: 'POST',
      disableError: true,
    })

    if (data.service) {
      localStorage.setItem('chatServiceUrl', data.service)
    }
  } catch (error) {
    console.error('fetch chat service url error:', error)
  }
}

onMounted(() => {
  fetchChatService()
})
</script>

<style>
/**
 * 全局样式设置
 */
html,
body,
#app {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
html,
body {
  max-width: 100%;
  overflow-x: hidden;
}

.app-root {
  min-height: 100vh;
}

.app-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  min-height: 100vh;
  margin: 0 auto;
  font-family:
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Ubuntu,
    Cantarell,
    Noto Sans,
    sans-serif;
  line-height: 1.6;
}

/* 适用于需要在视口中 fixed，但宽度与移动端一致并在 PC 居中的元素 */
.fixed-center-viewport {
  position: fixed;
  left: 50% !important;
  transform: translateX(-50%);
  width: 100%;
  max-width: 600px;
  z-index: 999;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nav {
  display: flex;
  gap: 12px;
}

/**
 * 修复按钮文字对齐问题
 * Apple 官网样式文件重置了 button 样式但未设置 text-align
 * 这里统一设置所有按钮文字居中显示
 */
button {
  text-align: center;
}
</style>
