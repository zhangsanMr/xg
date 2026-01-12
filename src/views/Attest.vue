<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import sfZmImg from '@/assets/images/sf_zm.png'

import sfFmImg from '@/assets/images/sf_fm.png'
import { http, baseUrl } from '../http'
import { showToast } from 'vant'

const router = useRouter()
const { t } = useI18n()

const realName = ref('')
const idType = ref('1')
const idNumber = ref('')

// 上传后返回的图片地址
const frontImageUrl = ref('')
const backImageUrl = ref('')

// 上传中的状态，方便后续做 loading
const uploadingFront = ref(false)
const uploadingBack = ref(false)

// 图片加载状态
const frontImageLoading = ref(false)
const backImageLoading = ref(false)

const goBack = () => {
  router.back()
}

const onSelectFront = () => {
  const input = document.getElementById('fileZm') as HTMLInputElement | null
  input?.click()
}

const onSelectBack = () => {
  const input = document.getElementById('fileFm') as HTMLInputElement | null
  input?.click()
}

// 图片压缩，限制最大 1MB
const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1MB

const compressImage = (file: File, maxSize: number = MAX_FILE_SIZE): Promise<File> => {
  return new Promise((resolve, reject) => {
    // 如果文件已经小于限制，直接返回
    if (file.size <= maxSize) {
      resolve(file)
      return
    }

    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        // 计算压缩比例
        const ratio = Math.sqrt(maxSize / file.size)
        width = Math.floor(width * ratio)
        height = Math.floor(height * ratio)

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('无法创建 canvas 上下文'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        // 递归压缩直到满足大小要求
        const compress = (quality: number) => {
          canvas.toBlob(
            blob => {
              if (!blob) {
                reject(new Error('压缩失败'))
                return
              }

              if (blob.size <= maxSize || quality <= 0.1) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                })
                resolve(compressedFile)
              } else {
                // 继续降低质量
                compress(quality - 0.1)
              }
            },
            'image/jpeg',
            quality
          )
        }

        compress(0.8)
      }

      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = e.target?.result as string
    }

    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

const uploadImage = async (file: File, type: 'front' | 'back') => {
  if (!file) return

  try {
    if (type === 'front') {
      uploadingFront.value = true
    } else {
      uploadingBack.value = true
    }

    // 压缩图片
    const compressedFile = await compressImage(file)
    console.log(`压缩前: ${(file.size / 1024).toFixed(2)}KB, 压缩后: ${(compressedFile.size / 1024).toFixed(2)}KB`)

    const formData = new FormData()
    // 接口字段为 image，对应 curl 中 --form 'image=@"..."'
    formData.append('image', compressedFile)

    const res = await http<{ image?: string }>({
      url: '/api/user/uploadImage',
      method: 'POST',
      data: formData,
    })

    if (type === 'front') {
      frontImageLoading.value = true
      frontImageUrl.value = res?.data?.image ?? res?.image ?? ''
    } else {
      backImageLoading.value = true
      backImageUrl.value = res?.data?.image ?? res?.image ?? ''
    }

    console.log('Upload result:', frontImageUrl.value, backImageUrl.value)
  } finally {
    if (type === 'front') {
      uploadingFront.value = false
    } else {
      uploadingBack.value = false
    }
  }
}

const onFrontFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  const file = target?.files?.[0]
  if (!file) return
  uploadImage(file, 'front')
}

const onBackFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  const file = target?.files?.[0]
  if (!file) return
  uploadImage(file, 'back')
}

const joinUrl = (base: string, path: string) => {
  return base.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '')
}

const frontImageUrlComputed = computed(() => {
  return frontImageUrl.value ? joinUrl(baseUrl, frontImageUrl.value) : ''
})

const backImageUrlComputed = computed(() => {
  return backImageUrl.value ? joinUrl(baseUrl, backImageUrl.value) : ''
})

// 图片加载完成
const onFrontImageLoad = () => {
  frontImageLoading.value = false
}

const onBackImageLoad = () => {
  backImageLoading.value = false
}

// 图片加载失败
const onFrontImageError = () => {
  frontImageLoading.value = false
  showToast(t('attest.imageLoadError'))
}

const onBackImageError = () => {
  backImageLoading.value = false
  showToast(t('attest.imageLoadError'))
}

const onSubmit = async () => {
  // 简单必填校验
  if (!realName.value.trim()) {
    showToast(t('attest.nameRequired'))
    return
  }

  if (!idType.value) {
    showToast(t('attest.idTypeRequired'))
    return
  }

  if (!idNumber.value.trim()) {
    showToast(t('attest.idNumberRequired'))
    return
  }

  if (!frontImageUrl.value) {
    showToast(t('attest.frontImageRequired'))
    return
  }

  if (!backImageUrl.value) {
    showToast(t('attest.backImageRequired'))
    return
  }

  await http({
    url: '/api/user/real_name',
    method: 'POST',
    data: {
      id_type: idType.value, // 1身份证 2护照 3驾照 4其他
      card_front: frontImageUrl.value,
      card_bank: backImageUrl.value,
      idcard: idNumber.value,
    },
  })

  showToast(t('attest.submitSuccess'))
  router.go(-1)
}
</script>

<template>
  <main class="attest-page">
    <div class="content">
      <h4 class="p-3 text-center">{{ t('attest.title') }}</h4>

      <div class="p-3">
        <input
          v-model="realName"
          class="form-control mb-3"
          type="text"
          :placeholder="t('attest.realNamePlaceholder')"
        />

        <select v-model="idType" class="form-select mb-3">
          <option value="1">{{ t('attest.idType.hkId') }}</option>
          <option value="2">{{ t('attest.idType.driver') }}</option>
          <option value="3">{{ t('attest.idType.passport') }}</option>
          <option value="4">{{ t('attest.idType.other') }}</option>
        </select>

        <input v-model="idNumber" class="form-control" type="text" :placeholder="t('attest.idNumberPlaceholder')" />
      </div>

      <div class="text-center mb-3 position-relative">
        <div class="mx-auto attest-img-wrapper">
          <!-- 占位图 -->
          <img v-if="!frontImageUrl" :src="sfZmImg" alt="sfzm" width="100%" height="100%" />
          <!-- 实际图片 + loading -->
          <template v-else>
            <div v-if="frontImageLoading || uploadingFront" class="img-loading-overlay">
              <div class="loading-spinner"></div>
            </div>
            <img
              :src="frontImageUrlComputed"
              alt="sfzm"
              width="100%"
              height="100%"
              @load="onFrontImageLoad"
              @error="onFrontImageError"
            />
          </template>
        </div>
        <div class="position-absolute top-50 start-50 translate-middle attest-upload-overlay" @click="onSelectFront">
          <img src="/images/withdraw-account/gallery.png" alt="icon" width="50" />
          <div>{{ t('attest.frontLabel') }}</div>
          <input
            id="fileZm"
            class="d-none"
            accept="image/png,image/jpg,image/gif,image/jpeg"
            type="file"
            @change="onFrontFileChange"
          />
        </div>
      </div>

      <div class="text-center mb-3 position-relative">
        <div class="mx-auto attest-img-wrapper">
          <!-- 占位图 -->
          <img v-if="!backImageUrl" :src="sfFmImg" alt="sffm" width="100%" height="100%" />
          <!-- 实际图片 + loading -->
          <template v-else>
            <div v-if="backImageLoading || uploadingBack" class="img-loading-overlay">
              <div class="loading-spinner"></div>
            </div>
            <img
              :src="backImageUrlComputed"
              alt="sffm"
              width="100%"
              height="100%"
              @load="onBackImageLoad"
              @error="onBackImageError"
            />
          </template>
        </div>
        <div class="position-absolute top-50 start-50 translate-middle attest-upload-overlay" @click="onSelectBack">
          <img src="/images/withdraw-account/gallery.png" alt="icon" width="50" />
          <div>{{ t('attest.backLabel') }}</div>
          <input
            id="fileFm"
            class="d-none"
            accept="image/png,image/jpg,image/gif,image/jpeg"
            type="file"
            @change="onBackFileChange"
          />
        </div>
      </div>

      <div class="d-grid m-3">
        <button class="btn btn-info" type="button" @click="onSubmit">
          {{ t('attest.submit') }}
        </button>
      </div>
    </div>
    <div class="br-back" @click="goBack"></div>
  </main>
</template>

<style scoped>
.attest-page {
  min-height: 100vh;
  background: #f6f7fb;
  position: relative;
}

.content {
  position: relative;
  z-index: 1;
}

.p-3 {
  padding: 1rem;
}

.text-center {
  text-align: center;
}

.form-control {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  padding: 0 12px;
  outline: none;
}

.form-select {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  padding: 0 12px;
  outline: none;
  background-color: #fff;
}

.mb-3 {
  margin-bottom: 1rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.m-3 {
  margin: 1rem;
}

.d-grid {
  display: grid;
}

.btn {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: none;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}

.btn-info {
  background: #0dcaf0;
  color: #fff;
}

.text-center.mb-3.position-relative {
  position: relative;
}

.attest-img-wrapper {
  width: 15rem;
  height: 10rem;
  position: relative;
}

.img-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #e5e7eb;
  border-top-color: #0dcaf0;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.position-absolute {
  position: absolute;
}

.top-50 {
  top: 50%;
}

.start-50 {
  left: 50%;
}

.translate-middle {
  transform: translate(-50%, -50%);
}

.attest-upload-overlay {
  cursor: pointer;
  color: #212529;
}

.d-none {
  display: none;
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
