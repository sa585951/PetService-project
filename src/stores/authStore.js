// src/stores/authStore.js（或 authStore.ts）
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  // === 1. 定義狀態 (State) ===
  state: () => ({
    token: null, // 初始狀態為 null 或 ''
    userName: null, // 初始狀態為 null 或 ''
    isLoggedIn: false, // 初始狀態為 false
    memberId: null
  }),

  // === 2. 定義 Actions ===
  actions: {
    // 修改了方法名稱為 login，更符合語意
    // 如果你在登入頁面是呼叫 setLoginState，則那邊也需要同步修改
    login({ userName, token, memberId }) { // 接收一個包含 userName 和 token 的物件
      console.log('Executing login action:', { userName, token }); // 添加 log
      this.isLoggedIn = true;
      this.userName = userName;
      this.token = token;
      this.memberId = memberId;

      // 使用 localStorage 儲存個別項目
      localStorage.setItem('token', token);
      localStorage.setItem('userName', userName);
      localStorage.setItem('memberId', memberId);
    },

    logout() {
      console.log('Executing logout action'); // 添加 log
      this.isLoggedIn = false;
      this.userName = null; // 登出時狀態改回 null 更符合「沒有值」的語意
      this.token = null; // 登出時狀態改回 null
      this.memberId = null;
      
      // 從 localStorage 移除個別項目
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('memberId');
    },

    initialize() {
      console.log('Executing initialize action'); // 添加 log
      const token = localStorage.getItem('token');
      const userName = localStorage.getItem('userName'); // 注意這裡的變數名要跟 localStorage key 對應
      const memberId = localStorage.getItem('memberId');

      if (token && userName) {
        console.log('Found state in localStorage:', { token, userName }); // 添加 log
        this.token = token;
        this.userName = userName;
        this.isLoggedIn = true;
        this.memberId = memberId;
        console.log('登入狀態還原成功');
      } else {
         console.log('No state found or state incomplete in localStorage'); // 添加 log
        // 如果 localStorage 沒有完整的狀態，也需要清除 store 的狀態
        this.token = null;
        this.userName = null;
        this.isLoggedIn = false;
        this.memberId = null;
        console.log('尚未登入或資料遺失，狀態已清空');
      }
    }
  }
})
