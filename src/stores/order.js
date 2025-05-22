import { defineStore } from "pinia";
import axios from "axios"; // 使用自定義的 axios 實例
import { useAuthStore } from "./authStore";

export const useOrderStore = defineStore('order', {
  state: () => ({
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

      const authStore = useAuthStore()
      try{
        const res = await axios.get(`/api/Order`,{params,
          headers:{
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        console.log('API 回傳:', res.data)
          //後端回傳的是OrderPagingDTO
          this.orders = res.data.ordersResult.map(order =>({
            orderType:order.orderType,
            orderTypeCode: order.orderTypeCode,
            orderStatus: order.orderStatus,
            id:order.id,
            totalAmount:order.totalAmount,
            createdAt: order.createdAt,
            updatedAt:order.updatedAt
          }))
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
