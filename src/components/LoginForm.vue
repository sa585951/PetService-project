<template>
  <div class="login-container">
      <div class="login-form">
        
        <!-- Google 登入按鈕 -->
        <GoogleLogin />

        
        <!-- 分隔線 -->
        <div class="divider">
          <span class="line"></span>
          <span class="or-text">或</span>
          <span class="line"></span>
        </div>
        
        <!-- 帳號輸入 -->
        <div class="input-group">
          <label for="username">帳號</label>
          <input type="text" id="username" v-model="username" placeholder="請輸入帳號">
        </div>
        
        <!-- 密碼輸入 -->
        <div class="input-group">
          <label for="password">密碼</label>
          <input type="password" id="password" v-model="password" placeholder="請輸入密碼">
        </div>
        
        <!-- 登入按鈕 -->
        <button class="login-btn" @click="login" :disabled="authStore.isLoggingIn">
          <span v-if="authStore.isLoggingIn" >{{ authStore.loginStatusText }}</span>
          <span v-else>
          登入
          </span></button>
        
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'; // 引入 ref
import { useRouter } from 'vue-router'; // 引入 useRouter
import GoogleLogin from './GoogleLogin.vue'; // 引入 GoogleLogin (如果需要)
import { useAuthStore } from '@/stores/authStore'; // 引入 authStore (確認 @/stores/authStore 路徑正確)
import Swal from 'sweetalert2';

// 在 <script setup> 頂層獲取 hooks 實例
const router = useRouter();
const authStore = useAuthStore();

// === 狀態變數 (使用 ref) ===
const username = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref(null); // 初始化為 null
const typingText = ref('');
const fullText = '登入中...';
let interval = null;

// === 後端 API 地址 ===
// 注意：實際應用中建議使用環境變數管理 API 地址
const baseAddress = 'https://localhost:7089';

// === 登入處理函數 ===
async function login() {
  error.value = null; // 清除之前的錯誤訊息
   isLoading.value = true; // 設定載入狀態
  authStore.startLoading();

  try {
    console.log('Attempting login for:', username.value); // 使用 .value 存取 ref 的值

    const payload = {
      username: username.value, // 從 ref 獲取值
      password: password.value // 從 ref 獲取值
    };

    const res = await fetch(`${baseAddress}/api/Account/Login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      // 處理非 2xx 的響應狀態
      const errorData = await res.text(); // 根據後端返回的錯誤格式，可能需要用 res.json()
      throw new Error(`登入失敗: ${errorData || res.statusText}`); // 拋出錯誤以便在 catch 中捕獲
    }

    const data = await res.json(); // 假設後端成功時返回 { token: ..., name: ... }

    console.log('Login successful. Data:', data);
    Swal.fire({
      icon: 'success',
      title: '登入成功',
      text: '歡迎回來，' + data.userName,
      timer: 2000,
      showConfirmButton: false
    })

    // === 呼叫 Pinia 的 login Action ===
    // 根據 authStore.js 中 login Action 的定義 (login({ userName, token }))
    authStore.login({ userName: data.userName, token: data.token, memberId: data.memberId }); // 傳遞一個物件
    router.push({ name: 'MemberDashboard' });

  } catch (err) {
    console.error('Login error:', err);
    error.value = err.message; // 將錯誤訊息顯示在模板中
    authStore.stopLoading();
    Swal.fire({
      icon: 'error',
      title: '登入失敗',
      text: '帳號或密碼錯誤',
      confirmButtonColor: '#ACC572',
    })
  } finally {
    isLoading.value = false; // 無論成功或失敗，都結束載入狀態
  }
}

// 在 <script setup> 中，不需要 export default { components, name, data, methods }
// 導入的元件 GoogleLogin 會自動在模板中可用。
</script>

<style scoped>

  h2 {
    text-align: center;
    margin-bottom: 24px;
    color: #333;
  }
  
  .google-login-btn-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

  
  .google-login-btn:hover {
    background-color: #f1f1f1;
  }
  
  
  .divider {
    display: flex;
    align-items: center;
    margin: 20px 0;
  }
  
  .line {
    flex-grow: 1;
    height: 1px;
    background-color: #ddd;
  }
  
  .or-text {
    margin: 0 10px;
    color: #777;
    font-size: 14px;
  }
  
  .input-group {
    margin-bottom: 16px;
  }
  
  label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    color: #555;
  }
  
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 50px !important;
    font-size: 14px;
  }
  
  input:focus {
    outline: none;
    border-color: #4a90e2;
  }
  
  .login-btn {
    width: 100%;
    padding: 12px;
    background-color: #ACC572;
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .login-btn:hover {
    background-color: #95bf33;
  }
  
  .forgot-password {
    text-align: center;
    margin-top: 16px;
  }
  
  .forgot-password a {
    color: #4a90e2;
    text-decoration: none;
    font-size: 14px;
  }
  
  .long-divider {
    height: 1px;
    background-color: #ddd;
    margin: 20px 0;
  }
  
  .register-prompt {
    text-align: center;
    font-size: 14px;
  }
  
  .register-prompt a {
    color: #4a90e2;
    text-decoration: none;
    font-weight: bold;
    margin-left: 5px;
  }
  .spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  margin-left: 8px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

  </style>