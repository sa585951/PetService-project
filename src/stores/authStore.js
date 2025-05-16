// src/stores/authStore.js（或 authStore.ts）
import { defineStore } from 'pinia'


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

    isLoggingIn: false,
    loginStatusText: '',
  }),

  // === 2. 定義 Actions ===
  actions: {
    // 修改了方法名稱為 login，更符合語意
    // 如果你在登入頁面是呼叫 setLoginState，則那邊也需要同步修改
    login({ userName, token, memberId }) { // 接收一個包含 userName 和 token 的物件
      console.log('Executing login action:', { userName, token, memberId }); // 添加 log
      this.isLoggedIn = true;
      this.userName = userName;
      this.token = token;
      this.memberId = memberId
      // 使用 localStorage 儲存個別項目
      localStorage.setItem('token', token);
      localStorage.setItem('userName', userName);
      localStorage.setItem('memberId', memberId);

      this.stopLoading();
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
      this.stopLoading();
    },

    initialize() {
      console.log('Executing initialize action'); // 添加 log
      const token = localStorage.getItem('token');
      const userName = localStorage.getItem('userName'); // 注意這裡的變數名要跟 localStorage key 對應
      const memberId = localStorage.getItem('memberId');

      if (token && userName) {
        console.log('Found state in localStorage:', { token, userName , memberId}); // 添加 log
        this.token = token;
        this.userName = userName;
        this.isLoggedIn = true;
        this.memberId = memberId
        console.log('登入狀態還原成功');
      } else {
         console.log('No state found or state incomplete in localStorage'); // 添加 log
        // 如果 localStorage 沒有完整的狀態，也需要清除 store 的狀態
        this.token = null;
        this.userName = null;
        this.isLoggedIn = false;
        this.memberId = null
        console.log('尚未登入或資料遺失，狀態已清空');
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
