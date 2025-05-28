// src/stores/authStore.js（或 authStore.ts）
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode';


// 將打字特效需要的變數定義在 Store 外部，以便 Actions 可以共用它們
let typingInterval = null; // 用於儲存定時器的 ID
let textIndex = 0; // 打字動畫的索引
const fullLoadingText = '登入中...'; // 完整的載入文字

export const useAuthStore = defineStore('auth', {
  // === 1. 定義狀態 (State) ===
  state: () => ({
    token: null, // 初始狀態為 null 或 ''
    userName: null, // 初始狀態為 null 或 ''
    isLoggedIn: false, // 初始狀態為 false
    memberId: null,
    role: null,

    isLoggingIn: false,
    loginStatusText: '',
  }),

  // === 2. 定義 Actions ===
  actions: {
    // 修改了方法名稱為 login，更符合語意
    // 如果你在登入頁面是呼叫 setLoginState，則那邊也需要同步修改
    login({ userName, token, memberId }) { // 接收一個包含 userName 和 token 的物件
      console.log('Executing login action:', { userName, token, memberId }); // 添加 log

      const tokenString = typeof token === 'object' && token.result ? token.result : token;

      this.isLoggedIn = true;
      this.userName = userName;
      this.token = tokenString;
      this.memberId = memberId;
      this.role = this.getRole(tokenString);

      // 使用 localStorage 儲存個別項目
      localStorage.setItem('token', tokenString);
      localStorage.setItem('userName', userName);
      localStorage.setItem('memberId', memberId);
      localStorage.setItem('role', this.role);

      this.stopLoading();
    },

    logout() {
      console.log('Executing logout action'); // 添加 log
      this.isLoggedIn = false;
      this.userName = null; // 登出時狀態改回 null 更符合「沒有值」的語意
      this.token = null; // 登出時狀態改回 null
      this.memberId = null;
      this.role = null;
      
      // 從 localStorage 移除個別項目
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('memberId');
      localStorage.removeItem('role');
      this.stopLoading();
    },

    initialize() {
      console.log('Executing initialize action');

      const rawToken = localStorage.getItem('token');
      const token = typeof rawToken === 'object' && rawToken.result ? rawToken.result : rawToken;

      const userName = localStorage.getItem('userName');
      const memberId = localStorage.getItem('memberId');

      try {
        if (token && userName) {
          const decoded = jwtDecode(token); // ✅ 如果不是有效 token，會跳 catch
          const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;

          this.token = token;
          this.userName = userName;
          this.isLoggedIn = true;
          this.memberId = memberId;
          this.role = role;

          console.log('登入狀態還原成功');
        } else {
          throw new Error('token or userName is missing');
        }
      } catch (error) {
        console.warn('Token 解碼失敗，清除登入狀態', error);
        this.logout(); // 清除所有狀態
      }
    },
  clearState() {
    this.token = null;
    this.userName = null;
    this.memberId = null;
    this.isLoggedIn = false;
    this.role = null;

    // 你可以選擇只清除部分項目
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('memberId');

    console.log('🧹 已清除登入狀態');
  },
    getRole(token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded JWT:', decoded);
        return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
      } catch {
        return null;
      }
    },

    // === 【新增】全域載入控制 Action ===// 啟動載入狀態和文字特效
startLoading(initialText = '處理中...') {
 this.isLoggingIn = true;
 // this.loginStatusText = initialText; // 如果不需要打字動畫，可以直接設定這裡的文字
 this.startTypingAnimation(); // 啟動打字動畫
},

 // 停止載入狀態和文字特效
stopLoading(clearText = true) {
 this.isLoggingIn = false;
 this.stopTypingAnimation(); // 確保停止打字動畫
 if (clearText) {
this.loginStatusText = ''; // 清除顯示的文字
 }
},

 // === 【新增】打字動畫邏輯 Action (放在 Store 裡管理) ===
// 【修正】: 將 startTypingAnimation 定義移到 actions 物件內部
 startTypingAnimation() {
 this.loginStatusText = ''; // 從空字串開始打字
 textIndex = 0; // 重設索引
// 清除可能正在運行的舊定時器，防止多個定時器同時運行
 if (typingInterval) clearInterval(typingInterval);

 typingInterval = setInterval(() => {
 if (textIndex < fullLoadingText.length) {
 // 使用 Store 的 state (this.loginStatusText) 來更新文字
this.loginStatusText += fullLoadingText[textIndex];
 textIndex++;
} else {

clearInterval(typingInterval); // 清除定時器
 typingInterval = null; // 設定為 null 表示已停止
}
 }, 150); // 打字速度 (毫秒)
},

// 停止打字動畫 (由 stopLoading 呼叫)
// 【修正】: 將 stopTypingAnimation 定義移到 actions 物件內部
 stopTypingAnimation() {
 if (typingInterval) { // 檢查定時器是否存在
 clearInterval(typingInterval); // 清除定時器
 typingInterval = null; // 設定為 null
 textIndex = 0; // 重設索引

}
  }
}
})
