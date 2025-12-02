<template>
  <div class="home-container">
    <div class="container">
      <img class="shield-icon" src="/src/assets/images/secure.svg" alt="" />
      <div class="title">{{ securityText }}</div>
      <div class="subtitle">{{ $t('security.notice') }}</div>
      <button class="enter-button" @click="goToIntroduce">
        {{ $t('security.enter') }}
      </button>
    </div>

    <div class="footer">
      <div>{{ $t('security.support') }}</div>
      <div>{{ $t('security.copyright') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const securityText = ref(t('security.checking'))

onMounted(() => {
  setTimeout(() => {
    securityText.value = t('security.passed')
  }, 2000)
})

const goToIntroduce = () => {
  // 跳转到静态HTML页面
  window.location.href = '/h5/aboutus.html'
}
</script>

<style scoped>
.home-container {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  color: #333;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  max-width: 500px;
  width: 100%;
  box-sizing: border-box;
  margin-top: 80px;
}

.shield-icon {
  width: 92px;
  height: 92px;
  margin-bottom: 20px;
}

.title {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 10px;
  text-align: center;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 40px;
  text-align: center;
}

.enter-button {
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 15px 0;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  max-width: 600px;
  text-align: center;
  transition: background-color 0.3s;
}

.enter-button:hover {
  background-color: #45a049;
}

.footer {
  position: fixed;
  bottom: 20px;
  text-align: center;
  font-size: 12px;
  color: #999;
  width: 100%;
}

@media (max-width: 768px) {
  .container {
    margin-top: 60px;
  }

  .shield-icon {
    font-size: 72px;
  }

  .title {
    font-size: 18px;
  }
}
</style>
