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
        <button class="login-btn" @click="login" :disabled="isLoading">
          <span v-if="isLoading" class="spinner">
            <i class="fas fa-spinner fa-spin"></i> 登入中...
          </span>
          <span v-else>
          登入
          </span></button>
        
      </div>
    </div>
</template>

<script>
import GoogleLogin from './GoogleLogin.vue';
import { useAuthStore } from '@/stores/authStore';

var baseAddress = 'https://localhost:7150';
  export default {
    components: {
      GoogleLogin
    },
    name: 'LoginPage',
    data() {
      return {
        username: '',
        password: '',
        isLoading:false
         };
    },

    methods: {

      async login() {
        // 登入邏輯
        this.isLoading = true;
        try {
          console.log('登入中...', this.username, this.password)
        const payload = {
          username: this.username,
          password: this.password
        };

        const res = await fetch (`${baseAddress}/api/Account/Login`, {
          method: 'POST',
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if(!res.ok){
            const msg = await res.text()
            throw new Error(msg || '登入失敗');
          }

        const data = await res.json();
        localStorage.setItem('token', data.token);
        console.log('token', data.token);
        localStorage.setItem('userName', data.name);
        console.log('userName', data.name);
        const authStore=useAuthStore();
        authStore.setLoggedIn(true);
        authStore.setToken(data.token);
        this.$router.push({ name: 'successlogin' });

        } catch (err) {
          alert(err.message);
        } finally {
          this.isLoading = false;
        }
      }
    }
  }
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