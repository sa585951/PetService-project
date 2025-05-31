// src/stores/authStore.js（或 authStore.ts）
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';


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
    login({ userName, token, memberId }) { // 接收一個包含 userName 和 token 的物件
      console.log('Executing login action:', {
      userName,
      token,
      memberId,
      tokenType: typeof token, 
  });

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
    
      const token = localStorage.getItem('token');
      const userName = localStorage.getItem('userName');
      const memberId = localStorage.getItem('memberId');

      console.log('Token from localStorage:', typeof token, token)

      if (!token || !userName) {
        console.log('尚未登入，略過登入狀態還原');
        return;
      }

      try {
        if (token && userName) {
          const decoded = jwtDecode(token); // token格式
          //token校期
          if(decoded.exp && Date.now() >= decoded.exp * 1000) {
            throw new Error('Token 已過期');
          }

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
        console.warn('Token 驗證失敗，清除登入狀態', error);
        
        // 只有在特定錯誤情況下才顯示提示給用戶
        if (error.message === 'Token expired') {
          // Token 過期 - 用戶原本是登入狀態，需要提示
          Swal.fire({
            icon: 'warning',
            title: '登入已過期',
            text: '您的登入已過期，請重新登入',
            confirmButtonText: '確定',
            confirmButtonColor: '#3085d6'
          });
        } else if (error.message !== 'token or userName is missing') {
          // Token 格式錯誤或其他異常 - 但排除正常的「未登入」狀態
          Swal.fire({
            icon: 'error',
            title: '登入狀態異常',
            text: '登入資料有誤，請重新登入',
            confirmButtonText: '確定',
            confirmButtonColor: '#3085d6'
          });
        }
        this.logout(); // 清除所有狀態
      }
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
