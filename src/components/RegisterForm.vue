<template>
    <div class="register-container">
        <div v-if="isLoading" class="loading-overlay">
          <div class="loading-content">
              <div class="spinner"></div>
              <p class="loading-text">載入中...</p>
          </div>
    </div>
    <div class="register-form" :class="{ 'blur-content': isLoading }">
    <form @submit.prevent="submitForm" >
    <!-- 姓名 -->
    <div class=""> <label for="name" class="form-label"></label>
      <input 
        id="name"
        placeholder="姓名" 
        v-model="userData.name" 
        type="text" 
        class="form-control" 
        @input="() => { clearError('name'); checkFormValidity(); }"
        @blur="validateField('name')" 
      />
      <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
<!-- 信箱 -->
      <label for="email" class="form-label"></label>
      <input 
        id="email"
        placeholder="Email" 
        v-model="userData.email" 
        type="email" 
        class="form-control" 
        @input="() => { clearError('email'); checkFormValidity(); }"
        @blur="validateField('email')" 
      />
      <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
</div>
<!-- 手機 -->

    <div class="">
      <label for="phone" class="form-label"></label>
      <input 
        id="phone"
        placeholder="手機" 
        v-model="userData.phone" 
        type="text" 
        class="form-control" 
        @input="() => { clearError('phone'); checkFormValidity(); }"
        @blur="validateField('phone')"
      />
      <p v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</p>

<!-- 密碼 -->

      <label for="password" class="form-label"></label>
      <input 
        id="password"
        placeholder="密碼" 
        v-model="userData.password" 
        type="password" 
        class="form-control" 
        @input="() => { clearError('password'); checkFormValidity(); }" 
        @blur="validateField('password')" 
      /> 
      <p v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</p>
    </div>

<!-- 再次密碼 -->

    <div class="mb-3">
      <label for="confirmPassword" class="form-label"></label>
      <input 
        id="confirmPassword"
        placeholder="確認密碼" 
        v-model="userData.confirmPassword" 
        type="password" 
        class="form-control"
        @input="validateField('confirmPassword')"
        @blur="validateField('confirmPassword')" 
      />
      <p v-if="errors.confirmPassword" class="text-red-500 text-sm">{{ errors.confirmPassword }}</p>

<!-- 地址 -->

      <label for="address" class="form-label"></label>
      <input 
        id="address"
        placeholder="地址" 
        v-model="userData.address" 
        type="text" 
        class="form-control" 
        @input="() => { clearError('address'); checkFormValidity(); }"
      />
      <p v-if="errors.address" class="text-red-500 text-sm">{{ errors.address }}</p>
    </div>

<div class="row">
    <div>
        <label>您是從哪裡得知我們的？(可複選)</label>
        <div class="checkbox-group-horizontal">
            <div v-for="source in sources" :key="source.id" class="checkbox-item">
                <input class="checkbox-input"
                    type="checkbox"
                    :value="source.id"
                    v-model="selectedSources"
                />
                <span class="checkbox-label">{{ source.name }}</span>
            </div>
        </div>
        <p v-if="errors.sources" class="text-red-500 text-sm">{{ errors.sources }}</p>
    </div>
</div>
     <!-- 驗證碼 -->
<div class="row">
  <div class="col-5"><input type="text" v-model="inputValue" placeholder="驗證碼" @input="verifyCode" Class="form-control"></div>
  <div class="col-6">  <button @click="handleClick" :disabled="countdown > 0" class="btn btn-secondary">{{ countdown>0 ? `${countdown} 秒後可重新發送` : `發送驗證碼`}}</button></div>
    <div class="col-1">
        <span v-if="verifyStatus === true" class="verified">✅</span>
        <span v-else-if="verifyStatus === false" class="unverified">❌</span>
    </div>
</div>
      <!-- Recaptcha -->
      <div class="mt-4">
        <div ref="recaptchaContainer"></div>
      </div>

      <!-- 送出按鈕 -->
      <button 
        class="btn btn-primary" 
        type="submit"
        :disabled="!recaptchaVerified || !verifyStatus || isSubmitting"
      >
        註冊並完成
      </button>
    </form>
  </div>
</div>

</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import Swal from 'sweetalert2';
var baseAddress = 'https://localhost:7089';
export default {
  data() {
    return {
      userData: {
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        address: '',
        sources: [],
      },
      isLoading:true,// 控制畫面是否準備好顯示
      selectedSources: [],
      errors: {},
      recaptchaVerified: false,
      isSubmitting: false,
      passwordPolicy: null,
      sources: [], // 這裡新增 sources 屬性，並初始化為空陣列
      passwordErrors: [], // 新增此屬性用來儲存密碼錯誤訊息
      inputValue:'',
      countdown: 0,
      verifyStatus: null,
      timer: null,
      isFormInvalid: false, // 用來檢查表單是否有效
    };
  },
  
  mounted() {
    if (!window.grecaptcha) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?compat=recaptcha';
      script.onload = () => {
        if (typeof this.renderRecaptcha === 'function') {
          this.renderRecaptcha();
        }
      };
      document.head.appendChild(script);
    } else {
      this.renderRecaptcha();
    }
     Promise.all([this.fetchSources(), this.fetchPasswordPolicy()])
  .then(() => {
    // 添加最小載入時間，避免畫面閃爍
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  });
},

  methods: {

    // 1️⃣ 獲取消息來源
    fetchSources() {
      return axios.get(`${baseAddress}/api/Source/GetSources`) // 使用 baseAddress
        .then(response => {
          this.sources = response.data;
        })
        .catch(error => {
          console.error('載入來源失敗', error);
        });
    },

    // 2️⃣ 從後端獲取密碼規則
    fetchPasswordPolicy() {
      return axios.get(`${baseAddress}/api/PasswordPolicy/GetPasswordPolicy`) // 使用 baseAddress
        .then(response => {
          this.passwordPolicy = response.data;
          console.log('密碼規則:', this.passwordPolicy);
        })
        .catch(error => {
          console.error('無法獲取密碼規則', error);
        });
    },

    // 3️⃣ 初始化 reCAPTCHA
    

    renderRecaptcha() {
      if (window.grecaptcha) {
        setTimeout(() => {
          window.grecaptcha.render(this.$refs.recaptchaContainer, {
            sitekey: '0x4AAAAAABaaHio6mXGtfxmE',
            callback: this.onRecaptchaSuccess,
          });
        }, 500);
      }
    },

    // 4️⃣ reCAPTCHA 驗證成功
    onRecaptchaSuccess(response) {
      this.recaptchaVerified = true;
      this.recaptchaResponse = response;
    },

    // 5️⃣ 驗證單個欄位
    async validateField(field) {
      if (!this.errors) this.errors = {};

      switch (field) {
        case 'name':
          this.errors.name = !this.userData.name.trim() ? '❗姓名是必填的' : null;
          break;
        case 'email':
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!this.userData.email.trim()) {
            this.errors.email = '❗信箱是必填的';
          } else if (!emailPattern.test(this.userData.email)) {
            this.errors.email = '❗信箱格式錯誤';
          } else {
            // 呼叫檢查 Email 是否存在
            const res = await axios.get(`${baseAddress}/api/Account/CheckEmailExists`, {
              params: { email: this.userData.email }
            });
            this.errors.email = res.data.exists ? '❗此信箱已被註冊' : null;
          }
          break;
        case 'phone':
          const phonePattern = /^[0-9]{10}$/;
          if (!this.userData.phone.trim()) {
            this.errors.phone = '❗手機是必填的';
          } else if (!phonePattern.test(this.userData.phone)) {
            this.errors.phone = '❗手機必須是10位數字';
          } else {
            // 呼叫檢查 phone是否存在
            const res = await axios.get(`${baseAddress}/api/Account/CheckPhoneExists`, {
              params: { phone: this.userData.phone }
            });
            this.errors.phone = res.data.exists ? '❗此手機已被註冊' : null;
          }
          break;
        case 'password':
          this.passwordErrors = [];

          if (!this.userData.password || this.userData.password.trim() === '') {
            this.passwordErrors.push('❗密碼是必填的');
          } else if (this.passwordPolicy) {
            console.log('正在檢查密碼規則', this.passwordPolicy);  // 加入此行來檢查 passwordPolicy

            if (this.passwordPolicy.requiresDigit && !/\d/.test(this.userData.password)) {
              this.passwordErrors.push('❗密碼必須包含數字');
            }
            if (this.passwordPolicy.requiresLowercase && !/[a-z]/.test(this.userData.password)) {
              this.passwordErrors.push('❗密碼必須包含小寫字母');
            }
            if (this.passwordPolicy.requiresUppercase && !/[A-Z]/.test(this.userData.password)) {
              this.passwordErrors.push('❗密碼必須包含大寫字母');
            }
            if (this.passwordPolicy.requiresNonAlphanumeric && !/[!@#$%^&*(),.?":{}|<>]/.test(this.userData.password)) {
              this.passwordErrors.push('❗密碼必須包含特殊字符');
            }
            if (this.passwordPolicy.minLength && this.userData.password.length < this.passwordPolicy.minLength) {
              this.passwordErrors.push(`❗密碼至少需要${this.passwordPolicy.minLength}個字符`);
            }
          }

          this.errors.password = this.passwordErrors.length > 0 ? this.passwordErrors.join(', ') : null;
          console.log('密碼錯誤訊息:', this.errors.password);
          break;

          case 'confirmPassword':
            // 確認密碼是否與原始密碼一致
            if (this.userData.confirmPassword !== this.userData.password) {
              this.errors.confirmPassword = '❗與密碼不一致';
            } else {
              this.errors.confirmPassword = null;
            }
            break;
          case 'address':
            this.errors.address = !this.userData.address.trim() ? '❗地址是必填的' : null;
            break;
      }

      this.checkFormValidity();
    },
    clearError(field) {
      if (this.errors && this.errors[field]) {
      this.errors[field] = null;
    }
    },
    // 6️⃣ 檢查表單是否有錯誤
    checkFormValidity() {
      const hasFieldErrors = Object.values(this.errors).some(error => error !== null);
      const hasPasswordErrors = this.passwordErrors.length > 0;

      this.isFormInvalid = hasFieldErrors || hasPasswordErrors;
    },
    handleClick() {
      // 驗證欄位（你可自訂哪些欄位是發送驗證碼前要驗的）
      ['name', 'email', 'phone', 'password', 'confirmPassword', 'address'].forEach(field => this.validateField(field));

      // 檢查驗證結果
      if (this.isFormInvalid) {
        //console.log('有欄位驗證失敗，取消發送驗證碼');
        Swal.fire({
            icon: 'warning',
            text:"請檢查表單欄位",
            confirmButtonColor: '#ACC572',
        })
        return;
      }
      this.SendEmailVerificationCode();
      this.countdown = 60;
      this.startCountdown();
      this.verifyStatus = null;
    },
    startCountdown() {
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.timer);
        }
      }, 1000);
    },
    async verifyCode() {
      if (!this.inputValue){
        this.verifyStatus = false;
        return;
      }
      try {
        // 假設後端有驗證 API
        const res = await fetch(`${baseAddress}/api/Account/VerifyEmailVerificationCode`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.userData.email,  // 你要補上 email 來源
            code: this.inputValue
          })
        });
        this.verifyStatus = res.ok;
      } catch (err) {
        this.verifyStatus = false;
      }
    },
    beforeUnmount(){
      clearInterval(this.timer);
    },
    // 7️⃣ 提交表單（確保所有欄位都驗證）
    submitForm() {
      ['name', 'email', 'phone', 'password','address'].forEach(field => this.validateField(field));
      console.log('Selected sources:', this.selectedSources);
      if (this.isFormInvalid || !this.recaptchaVerified || !this.verifyStatus) {
        console.log('表單有錯誤或未通過 reCAPTCHA or 驗證碼，不提交');
        return;
      }

      this.submitToDatabase();
    },
    SendEmailVerificationCode() {
      axios.post(`${baseAddress}/api/Account/SendEmailVerificationCode`, {
        email: this.userData.email
      })
      .then(response => {
        console.log('驗證碼已發送', response.data);
        //alert('驗證碼已發送');
        Swal.fire({
            text:"驗證碼已發送，請至信箱檢查",
            confirmButtonColor: '#ACC572',
        })
      })
      .catch(error => {
        console.error('發送驗證碼失敗', error);
        alert('發送驗證碼失敗');
        // 顯示錯誤訊息（例如 email 無效或已註冊）
      });
    },

    // 8️⃣ 提交到後端 API
    submitToDatabase() {
      const userData = {
        name: this.userData.name,
        email: this.userData.email,
        phone: this.userData.phone, // 添加手機號碼
        password: this.userData.password,
        address: this.userData.address,
        sources: [...this.selectedSources],
      };

      axios.post(`${baseAddress}/api/Account/EmailRegister`, userData)
        .then(response => {
          //console.log('註冊成功', response);
          localStorage.setItem('token', response.data.token); // 儲存 JWT
          localStorage.setItem('userName', response.data.name); // 儲存使用者名稱

          // 更新應用程式的登入狀態
          const authStore=useAuthStore();
          authStore.login({
            userName: response.data.name,
            token: response.data.token
          })

          this.$router.push({ name: 'MemberDashboard' });
        })
        .catch(error => {
          console.error('註冊失敗', error.response ? error.response.data : error);
          alert('註冊失敗');
        });
    }
  }
};
</script>

<style scoped>
    .form-control {
    border: 1px solid #ccc;
    padding: 0.5em;
    width: 100%;
    margin-bottom: 5px;
    height:35px;
    }

    .checkbox-group-horizontal {
    display: flex;
    flex-direction: row; /* 確保是橫向排列 */
    flex-wrap: wrap; /* 允許換行 */
    gap: 30px; /* 設定選項之間的間距 */
    justify-content: flex-start; /* <-- 建議使用 flex-start 代替 left */
    margin-bottom: 10px;
    column-gap: 50px;
    row-gap: 2px;
}

/* 您可以針對每個選項做細微調整 */
.checkbox-item {
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
  justify-content: center;

}
.checkbox-label{
  white-space: nowrap;
  flex-shrink: 0;
}
.checkbox-input {
    margin-bottom: 0px;
    margin-right:2px;
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

.btn-secondary {
  padding: 3px 15px;
  background-color: transparent;
  color: goldenrod;
  border: 2px solid goldenrod;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: rgb(231, 179, 34);
  color: white;
}
/* 載入遮罩樣式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
}

.loading-text {
  font-size: 1.2rem;
  color: #666;
  margin-top: 1rem;
}

/* 旋轉動畫 */
.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #ACC572;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 載入時模糊背景內容 */
.blur-content {
  filter: blur(2px);
  pointer-events: none;
}
</style>
