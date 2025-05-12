<template>
    <div class="welcome-container">
        <div class="welcome-card">
            <h1 class="title">會員登入</h1>
      <LoginForm />
      <div>
        <!-- 忘記密碼 -->
        <div class="forgot-password">
          <a href="#" @click.prevent="forgotPassword">忘記密碼?</a>
        </div>
        <!-- 長分隔線 -->
        <div class="long-divider"></div>
        
        <!-- 註冊提示 -->
        <div class="register-prompt">
          <span>還不是會員？</span>
          <a href="#" @click.prevent="register">立即註冊</a>
        </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import LoginForm from '../../components/LoginForm.vue';

  
  export default {
    components: {
      LoginForm
    },
  
  methods:{
    register() {
      // 註冊邏輯
      console.log('前往註冊頁面')
      this.$router.push('/RegisterStart');
    },
    forgotPassword() {
      // 忘記密碼邏輯
      console.log('前往忘記密碼頁面')
      this.$router.push('/forgotpassword');
    }
  }
  }

  </script>

  <style scoped>
  .welcome-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  padding: 20px;
  overflow: hidden;
}

.welcome-card {
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 480px;
  position: relative;
  overflow: hidden;
  text-align: center;
}
    .title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #3d5a80;
    margin-bottom: 30px;
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
  </style>
  
  
