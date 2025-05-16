import { defineStore } from "pinia";
import axios from "axios";

export const useOrderStore = defineStore('order', {
  state: () => ({
    /** @type {TOrder[]} */
    orders: [],
    TotalPages:0,
    loading: false,
    error: null,
  }),
  actions: {
    /**
     * 從後端拿整批分頁／篩選後的訂單
     * @param {Object} params  // 直接把 OrdersSearchDTO 傳進來
     * @param {number} params.memberId
     * @param {string} [params.keyword]
     * @param {string} [params.orderType]
     * @param {string} [params.sortBy]
     * @param {number} [params.page]
     * @param {number} [params.pageSize]
     */
    async fetchOrders(params){
      this.loading = true
      this.error = null
      try{
        const res = await axios.get(`/api/Order/members/${params.memberId}`,{params}
        )
        console.log('API 回傳:', res.data)
          //後端回傳的是OrderPagingDTO
          this.orders = res.data.ordersResult
          this.TotalPages = res.data.totalPages
        }catch(err){
          this.error = err
          this.orders = []
        } finally {
          this.loading = false
        }
      },
    },
  })
//   getters: {
//     filterByStatus: (state) => {
//       return (status) => {
//         if (!Array.isArray(state.orders)) {
//           console.warn('orders 不是陣列！', state.orders)
//           return []
//         }
//         return state.orders.filter(o => o.fOrderStatus === status)
//       }
//     },
//     /**
//      * 根據狀態過濾（例如「未付款」、「已付款」、「已取消」）
//      * @return {(status: string) => Order[]}
//      */
//     filterByStatus: (state) => {
//       return (status) => {
//         return state.orders.filter(o => o.fOrderStatus === status)
//       }
//     }
//   }
// })
