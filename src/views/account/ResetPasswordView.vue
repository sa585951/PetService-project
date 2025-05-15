<template>
    <div class="reset-password-container">
        <div class="reset-password-card">
        <h1 class="title">重設密碼</h1>
        <div class="input-group">
        <input
            :type="showPassword ? 'text' : 'password'"
            v-model="newPassword"
            placeholder="輸入新密碼"
        />
        </div>

    <div v-if="passwordPolicy" class="password-requirements">
      <p class="password-requirements-title">密碼要求：</p>
      <ul>
        <li :class="{ met: newPassword.length >= passwordPolicy.minLength }">
          至少 {{ passwordPolicy.minLength }} 字
        </li>
        <li v-if="passwordPolicy.requiresDigit" :class="{ met: /\d/.test(newPassword) }">
          需含數字
        </li>
        <li v-if="passwordPolicy.requiresUppercase" :class="{ met: /[A-Z]/.test(newPassword) }">
          需含大寫字母
        </li>
        <li v-if="passwordPolicy.requiresLowercase" :class="{ met: /[a-z]/.test(newPassword) }">
          需含小寫字母
        </li>
        <li v-if="passwordPolicy.requiresNonAlphanumeric" :class="{ met: /\W/.test(newPassword) }">
          需含特殊字元
        </li>
      </ul>
    </div>

    <button class="btn btn-primary" @click="handleResetClick" :disabled="isProcessing">
      {{ isProcessing ? '處理中...' : '確認重設' }}
    </button>

    <p :class="{'error-msg': isError, 'success-msg': isSuccess}">
      {{ message }}
    </p>
        </div>
    
  </div>
</template>

<script>
const baseAddress = 'https://localhost:7089';

export default {
  data() {
    return {
      newPassword: "",
      showPassword: false,
      message: "",
      isProcessing: false,
      isError: false,
      isSuccess: false,
      passwordPolicy: null,
    };
  },
  computed: {
    email() {
      return this.$route.query.email;
    },
    token() {
      // 取得未經處理的 token
      return this.$route.query.token;
    },
    // 後端預期的 token 是已經 URL 編碼的
    encodedToken() {
      // 當 token 從 URL 取得時已經是解碼狀態，我們需要再次對其進行編碼
      return this.token ? encodeURIComponent(this.token) : '';
    }
  },
  async mounted() {
    // Load password policy when component mounts
    try {
      const policyRes = await fetch(`${baseAddress}/api/PasswordPolicy/GetPasswordPolicy`);
      if (policyRes.ok) {
        const policyText = await policyRes.text();
        if (policyText) {
          try {
            this.passwordPolicy = JSON.parse(policyText);
          } catch (e) {
            this.setError("密碼規則載入錯誤");
          }
        }
      } else {
        this.setError("無法取得密碼規則");
      }
    } catch (err) {
      this.setError("載入密碼規則發生錯誤");
    }
  },
  methods: {
    async handleResetClick() {
      this.message = "";
      this.isError = false;
      this.isSuccess = false;
      this.isProcessing = true;

      if (!this.newPassword) {
        this.setError("請輸入新密碼");
        return;
      }

      if (!this.email || !this.token) {
        this.setError("無效的重設連結，請重新申請");
        return;
      }

      try {
        // 1. 驗證密碼規則
        if (this.passwordPolicy) {
          const policyErrors = this.validateAgainstPolicy(this.newPassword, this.passwordPolicy);
          if (policyErrors.length > 0) {
            this.setError(policyErrors.join("，"));
            return;
          }
        } else {
          this.setError("無法取得密碼規則");
          return;
        }

        // 2. 檢查是否為舊密碼
        try {
          const checkRes = await fetch(`${baseAddress}/api/Account/ValidateNewPassword`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: this.email,
              token: this.token,
              newPassword: this.newPassword,
            })
          });

          // 確保有回應才繼續解析 JSON
          if (!checkRes) {
            this.setError("密碼驗證請求失敗");
            return;
          }

          // 只有當回應狀態為 OK 才解析 JSON
          if (!checkRes.ok) {
            let errorMessage = "密碼驗證失敗";
            try {
              const checkJson = await checkRes.json();
              errorMessage = checkJson.message || errorMessage;
            } catch (parseError) {
              console.error("解析回應時出錯:", parseError);
            }
            this.setError(errorMessage);
            return;
          }
        } catch (checkError) {
          console.error("驗證密碼時出錯:", checkError);
          this.setError("密碼驗證失敗，請檢查連線");
          return;
        }

        // 3. 重設密碼
        try {
          const resetRes = await fetch(`${baseAddress}/api/Account/ResetPassword`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: this.email,
              token: this.encodedToken, // 使用編碼後的 token
              newPassword: this.newPassword,
            }),
          });

          // 確保有回應才繼續
          if (!resetRes) {
            this.setError("密碼重設請求失敗");
            return;
          }

          if (resetRes.ok) {
            this.setSuccess("密碼重設成功，3 秒後跳轉登入畫面");
            setTimeout(() => this.$router.push("/login"), 3000);
          } else {
            let errorMessage = "密碼重設失敗";
            try {
              const resetJson = await resetRes.json();
              errorMessage = resetJson.message || errorMessage;
            } catch (parseError) {
              console.error("解析回應時出錯:", parseError);
            }
            this.setError(errorMessage);
          }
        } catch (resetError) {
          console.error("重設密碼時出錯:", resetError);
          this.setError("密碼重設失敗，請檢查連線");
        }
      } catch (err) {
        console.error("整體操作發生錯誤:", err);
        this.setError("發生錯誤，請稍後再試");
      } finally {
        this.isProcessing = false;
      }
    },

    validateAgainstPolicy(password, policy) {
      const errors = [];
      
      if (password.length < policy.minLength) {
        errors.push(`至少 ${policy.minLength} 字`);
      }
      if (policy.requiresDigit && !/\d/.test(password)) {
        errors.push("需含數字");
      }
      if (policy.requiresUppercase && !/[A-Z]/.test(password)) {
        errors.push("需含大寫字母");
      }
      if (policy.requiresLowercase && !/[a-z]/.test(password)) {
        errors.push("需含小寫字母");
      }
      if (policy.requiresNonAlphanumeric && !/\W/.test(password)) {
        errors.push("需含特殊字元");
      }
      
      return errors;
    },

    setError(msg) {
      this.message = msg;
      this.isError = true;
      this.isSuccess = false;
      this.isProcessing = false;
    },

    setSuccess(msg) {
      this.message = msg;
      this.isSuccess = true;
      this.isError = false;
    }
  }
};
</script>

<style scoped>
.reset-password-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.reset-password-card{
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

.input-group {
  position: relative;
  display: flex;
  align-items: center;

}

input[type="password"],
input[type="text"] {
  flex-grow: 1;
  padding: 10px;
  padding-right: 40px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.eye-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
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

button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

.error-msg {
  color: #d00;
  margin-top: 12px;
}

.success-msg {
  color: #080;
  margin-top: 12px;
}

.password-requirements-title{
    font-weight: 700;
    margin-bottom:0;
}

.password-requirements {
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 0.9em;
  text-align: left;
}

.password-requirements ul {
  margin: 5px 0;
  text-align: left;
  padding-left: 20px;
}

/* .password-requirements li {
  color: #666;
  margin-bottom: 3px;
} */

.password-requirements li.met {
  color: #080;
}
</style>