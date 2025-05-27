import { defineStore } from 'pinia'

export const useSearchHotelStore = defineStore('search', {
  state: () => ({
    checkInDate: '',
    checkOutDate: '',
    petCount: 0,
  }),

})