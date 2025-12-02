<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const active = ref(0)

const tabs = [
  { name: 'home', icon: 'wap-home-o', label: t('tabbar.home'), path: '/home' },
  { name: 'position', icon: 'clock-o', label: t('tabbar.position'), path: '/position' },
  { name: 'news', icon: 'newspaper-o', label: t('tabbar.news'), path: '/news' },
  { name: 'service', icon: 'chat-o', label: t('tabbar.service'), path: '/chat' },
  { name: 'user', icon: 'user-o', label: t('tabbar.user'), path: '/user' },
]

// 根据当前路由设置 active
watch(
  () => route.path,
  path => {
    const index = tabs.findIndex(tab => tab.path === path)
    if (index !== -1) {
      active.value = index
    }
  },
  { immediate: true }
)

const onChange = (index: number) => {
  const tab = tabs[index]
  if (tab) {
    router.push(tab.path)
  }
}
</script>

<template>
  <van-tabbar v-model="active" fixed placeholder safe-area-inset-bottom active-color="#4caf50" @change="onChange">
    <van-tabbar-item v-for="tab in tabs" :key="tab.name" :icon="tab.icon">
      {{ tab.label }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<style scoped>
:deep(.van-tabbar) {
  position: fixed;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;
  z-index: 999;
  border-top: 1px solid #f0f0f0;
}

:deep(.van-tabbar-item__text) {
  font-size: 12px;
}
</style>
