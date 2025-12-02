<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { http } from '../http'

const chatUrl = ref('')

onMounted(async () => {
  try {
    const { data } = await http<{ service: string }>({
      url: '/api/login/service',
      method: 'POST',
      disableError: true,
    })

    chatUrl.value = data.service || ''
  } catch (error) {
    console.error('fetch chat service url error:', error)
  }
})
</script>

<template>
  <main class="chat-page">
    <div class="content">
      <iframe v-if="chatUrl" class="myframe" :src="chatUrl" frameborder="0" />
    </div>
  </main>
</template>

<style scoped>
.chat-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
}

.content {
  flex-grow: 1;
  width: 100%;
  height: 0;
  overflow: hidden;
}

.myframe {
  width: 100%;
  height: 100%;
  border: 0;
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
