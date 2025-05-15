<template>
    <div class="welcome-container">
    <div class="welcome-card">      
      <h1 class="title">註冊新帳號</h1>
      
      <!-- Google 登入按鈕 -->
      <GoogleLogin class="w-100 mb-3"/>
      
      <div class="divider">
        <span class="line"></span>
        <span class="divider-text">或</span>
        <span class="line"></span>
      </div>
      
      <!-- 以 Email 註冊按鈕 -->
      <button class="btn-primary" @click="emailSignup">
        <i class="fas fa-envelope me-2"></i> 以 Email 註冊
      </button>
      
      <p class="terms">
        註冊即表示您已閱讀並同意
        <a href="#" class="link-text">隱私權政策</a>
      </p>
      
      <div class="login-section">
        <p>已經是毛孩管家的會員了嗎？</p>
        <button class="btn-secondary" @click="login">
          登入
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import GoogleLogin from '@/components/GoogleLogin.vue';

export default {
  components: {
    GoogleLogin
  },
  methods: {
    emailSignup() {
      this.$router.push('/register');
    },
    login() {
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.welcome-container {
  display: flex;
  align-items: center;
  justify-content: center;
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
  margin: 0 auto;
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

.divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.line {
  flex-grow: 1;
  height: 1px;
  background-color: #e0e0e0;
}

.divider-text {
  padding: 0 15px;
  font-weight: 600;
  color: #6c757d;
}

.btn-primary {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #ACC572;
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #95bf33;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(146, 134, 27, 0.3);
}

.terms {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 20px 0;
}

.link-text {
  color: #3d5a80;
  text-decoration: none;
  font-weight: 600;
}

.link-text:hover {
  text-decoration: underline;
}

.login-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eaeaea;
}

.btn-secondary {
  padding: 10px 30px;
  background-color: transparent;
  color: goldenrod;
  border: 2px solid goldenrod;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: rgb(231, 179, 34);
  color: white;
}


.top-left {
  top: 0;
  left: 0;
  transform: translate(-50%, -50%) rotate(45deg);
}

.bottom-right {
  bottom: 0;
  right: 0;
  transform: translate(50%, 50%) rotate(225deg);
}

/* 響應式設計 */
@media (max-width: 576px) {
  .welcome-card {
    padding: 30px 20px;
  }
  
  .title {
    font-size: 1.5rem;
  }
}
</style>