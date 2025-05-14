import { defineStore } from "pinia";
import axios from "axios";

/**
 * 訂單物件結構
 * @typedef {Object} Order
 * @property {number}        fId             訂單主鍵
 * @property {number|null}   fMemberId       會員 ID
 * @property {string|null}   fOrderType      訂單類型
 * @property {string|null}   fOrderStatus    訂單狀態
 * @property {number|null}   fTotalAmount    總金額
 * @property {string|null}   fCreated_at     建立時間 (ISO 字串)
 * @property {string|null}   fUpdated_at     更新時間 (ISO 字串)
 */

export const useOrderStore = defineStore('order', {
  state: () => ({
    /** @type {Order[]} */
    orders: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchByMember(memberId) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(`https://localhost:7089/api/Order/members/${memberId}`
        )
        console.log('後端回傳的orders資料', res.data)
        this.orders = res.data
      } catch (err) {
        this.error = err
        this.orders = []
      } finally {
        this.loading = false
      }
    },
  },
  getters: {
    filterByStatus: (state) => {
      return (status) => {
        if (!Array.isArray(state.orders)) {
          console.warn('orders 不是陣列！', state.orders)
          return []
        }
        return state.orders.filter(o => o.fOrderStatus === status)
      }
    },
    /**
     * 根據狀態過濾（例如「未付款」、「已付款」、「已取消」）
     * @return {(status: string) => Order[]}
     */
    filterByStatus: (state) => {
      return (status) => {
        return state.orders.filter(o => o.fOrderStatus === status)
      }
    }
  }
})
