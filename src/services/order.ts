import { http } from '../http'

export interface AddOrderPayload {
  order_type: number | string
  order_pid: number | string
  order_price: number
  order_sen: number
  order_shouyi: string
  order_kuishun: string
}

export interface AddOrderResponse {
  code: number
  msg?: string
  [key: string]: any
}

export const addOrder = (data: AddOrderPayload) => {
  return http<AddOrderResponse>({
    url: '/api/user/addorder',
    method: 'POST',
    data: data as unknown as Record<string, unknown>,
  })
}
