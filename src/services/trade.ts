import { http } from '../http'

export interface AjaxProData {
  title: string
  img: string
  Price: string
  Open: string
  Close: string
  High: string
  Low: string
  UpdateTime: string
  protime_1: number
  protime_2: number
  protime_3: number
  protime_4: number
  protime_5: number
  protime_6: number
  protime_7: number
  proscale_1: string
  proscale_2: string
  proscale_3: string
  proscale_4: string
  proscale_5: string
  proscale_6: string
  proscale_7: string
  lossrate_1: string
  lossrate_2: string
  lossrate_3: string
  lossrate_4: string
  lossrate_5: string
  lossrate_6: string
  lossrate_7: string
  jine1?: string
  jine2?: string
  jine3?: string
  jine4?: string
  jine5?: string
  jine6?: string
}

export interface AjaxProResponse {
  code: number
  info: any[]
  data: AjaxProData
}

export const fetchProductAjaxPro = (pid: string | number) => {
  return http<AjaxProData>({
    url: '/api/index/ajaxpro',
    method: 'POST',
    data: { pid },
  })
}
