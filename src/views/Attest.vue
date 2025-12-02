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

const uploadImage = async (file: File, type: 'front' | 'back') => {
  if (!file) return

  const formData = new FormData()
  // 接口字段为 image，对应 curl 中 --form 'image=@"..."'
  formData.append('image', file)

  try {
    if (type === 'front') {
      uploadingFront.value = true
    } else {
      uploadingBack.value = true
    }

    const res = await http<{ image?: string }>({
      url: '/api/user/uploadImage',
      method: 'POST',
      data: formData,
    })

    if (type === 'front') {
      frontImageUrl.value = res?.data?.image ?? res?.image ?? ''
    } else {
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

const frontImageUrlComputed = computed(() => {
  if (!frontImageUrl.value) {
    return sfZmImg
  } else {
    return baseUrl + frontImageUrl.value
  }
})

const backImageUrlComputed = computed(() => {
  if (!backImageUrl.value) {
    return sfFmImg
  } else {
    return baseUrl + backImageUrl.value
  }
})

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
          <img :src="frontImageUrlComputed" alt="sfzm" width="100%" height="100%" />
        </div>
        <div class="position-absolute top-50 start-50 translate-middle attest-upload-overlay" @click="onSelectFront">
          <img src="https://zj4.cicc9658.cfd:2083/h5/img/icon/gallery.png" alt="icon" width="50" />
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
          <img :src="backImageUrlComputed" alt="sfzm" width="100%" height="100%" />
        </div>
        <div class="position-absolute top-50 start-50 translate-middle attest-upload-overlay" @click="onSelectBack">
          <img src="https://zj4.cicc9658.cfd:2083/h5/img/icon/gallery.png" alt="icon" width="50" />
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
