// 订单列表
export interface Order {
  id: number
  order_no: string
  open_price: number
  close_price: number | null
  bet_amount: number
  type: number
  createtime: string
  period: number
  reward_amount: number
  compensate_amount: number
  open_result: number
  close_time: number
  ostaus: number
  // 下面字段用于前端展示订单详情（部分来自原接口字段或映射）
  orderno?: string
  buyprice?: number
  sellprice?: number | null
  fee?: number
  ploss?: number
  ostyle?: number
  buytime?: number
  endloss?: number
  endprofit?: number
  conutDown?: number
}
