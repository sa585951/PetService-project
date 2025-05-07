// src/stores/authStore.js（或 authStore.ts）
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    userName: '',
    token: ''
  }),
  actions: {
    setLoggedIn(value) {
      this.isLoggedIn = value
    },
    setUserName(name) {
      this.userName = name
    },
    setToken(token) {
      this.token = token
    },
    logout() {
      this.isLoggedIn = false
      this.userName = ''
      this.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem('userName')
    },
    initialize() {
      const token = localStorage.getItem('token')
      const userName = localStorage.getItem('userName')
      if (token && userName) {
        this.token = token
        this.userName = userName
        this.isLoggedIn = true
      } else {
        this.token = ''
        this.userName = ''
        this.isLoggedIn = false
      }
    }
    
  }
})
