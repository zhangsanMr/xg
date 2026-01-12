import axios, { type AxiosRequestConfig } from 'axios'
import { HTTPCode } from './constants'
import router from '../router'
import { showToast, showLoadingToast, closeToast } from 'vant'
import i18n from '../i18n'

const t = i18n.global.t
export const refreshAppToken = () => {}

// 开发环境使用写死地址，生产环境通过环境变量配置后端接口地址
const baseUrl = import.meta.env.DEV ? 'https://llcc.viagogo.icu' : 'https://www.zjgjft.shop/'

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 60000,
})

instance.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
)

instance.interceptors.response.use(
  response => {
    console.log('response', response)

    if (response && (response.data?.code == HTTPCode.REFREASH_TOKEN || response.data?.code == HTTPCode.REFREASH_MISS)) {
      showToast(t('login.loginFailed'))
      router.push('/login')
      return Promise.reject(new Error(t('login.loginFailed')))
    }
    return response
  },
  error => Promise.reject(error)
)

interface Options {
  url: string
  data?: Record<string, unknown> | FormData
  params?: Record<string, unknown>
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  disableError?: boolean
  contentType?: boolean
  decode?: boolean // 添加解密参数，默认为false
  showLoading?: boolean
}

export const getToken = (): string | null => {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

const getLanguage = (): string | null => {
  const map = {
    'zh-CN': 'zh',
    'zh-TW': 'hk',
    en: 'en',
    ja: 'ja',
    vi: 'vi',
    ko: 'kor',
  }
  const lang = localStorage.getItem('language') || 'zh-CN'
  return map[lang as keyof typeof map]
}

interface Result<T> {
  data: T
  image?: string
  info: string
  code: number
}

// Base64 解码函数
const base64Decode = (str: string): string => {
  return atob(str)
}

const http = async <T = unknown>(options: Options): Promise<Result<T>> => {
  const method = options.method ?? 'GET'
  const token = getToken()
  const language = getLanguage()
  const decode = options.decode ?? false // 默认为false
  const needLoading = options.showLoading === true

  let params: Record<string, unknown> = {
    ...(options.params ?? {}),
  }

  const hasFormData = options.data instanceof FormData
  const headers: Record<string, string> = {
    ...(options.headers ?? {}),
  }

  // 非 FormData 情况下才主动设置 content-type；FormData 让浏览器自动带 multipart/form-data 边界
  if (!hasFormData) {
    headers['content-type'] = options.contentType ? 'application/x-www-form-urlencoded' : 'application/json'
  }

  let data: Record<string, unknown> | FormData | undefined

  if (method === 'GET') {
    data = undefined
  } else if (hasFormData) {
    data = options.data
  } else if (options.data) {
    data = { ...(options.data as Record<string, unknown>), token: token, language: language }
  } else {
    data = {}
  }

  params.language = language
  if (token) {
    params.token = token
  }

  const config: AxiosRequestConfig = {
    url: options.url,
    method,
    headers,
    params,
    data,
  }

  try {
    if (needLoading) {
      showLoadingToast({
        message: t('trade.loading'),
        forbidClick: true,
        overlay: true,
        duration: 0,
      })
    }

    const response = await instance.request(config)
    let responseData = response.data

    // 如果需要解密
    if (decode && responseData.data) {
      try {
        // 对加密的 data 进行解码
        const decodedData = base64Decode(responseData.data)
        const parsedData = JSON.parse(decodedData)
        responseData.data = parsedData
      } catch (decodeError) {
        console.error('数据解密失败:', decodeError)
        throw new Error('数据解密失败')
      }
    }

    if (responseData.code !== HTTPCode.SUCCESS) {
      if (!options.disableError) {
        setTimeout(() => {
          showToast(responseData.info || '请求失败')
        }, 300)
      }
      throw responseData
    }

    return responseData
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      router.push({ name: 'login' })
      throw error
    }

    throw error
  } finally {
    if (needLoading) {
      closeToast()
    }
  }
}

export { http, baseUrl, type Result }
