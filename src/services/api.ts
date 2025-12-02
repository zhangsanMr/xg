// 交易相关API
export const tradeApi = {
  // 获取产品详情
  getProductDetail: (_id: string | number) => {},

  // 获取K线数据
  getKlineData: (_params: { symbol: string; period: string; size: number }) => {
    // return api.get(`/api/kline/data`, { params })
  },

  // 更新K线数据
  updateKlineData: (_params: { symbol: string; period: string; size: number }) => {
    // return api.get(`/api/kline/update`, { params })
  },

  // 获取订单列表
  getOrderList: (_params: { page: number; limit: number; status: string; product_id: string | number }) => {
    // return api.get(`/api/order/list`, { params })
  },

  // 创建订单（买涨/买跌）
  createOrder: (_data: { product_id: string | number; cycle_id: number; type: number; bet_amount: number }) => {
    // return api.post(`/api/order/create`, data)
  },
}

// export default api
