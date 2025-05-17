<template>
<div class="register-container">
<div class="register-card">
    <h2 class="title">會員註冊</h2>
     <div v-if="isLoading" class="loading-overlay">
          <div class="loading-content">
              <div class="spinner"></div>
              <p class="loading-text">載入中...</p>
          </div>
    </div>
        <div class="register-form" :class="{ 'blur-content': isLoading }">
      <form @submit.prevent="submitForm" class="space-y-4">
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
  
        <!-- 資訊來源 -->
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
  
        <!-- 送出按鈕 -->
        <button 
          class="btn btn-primary" 
          type="submit"
          :disabled="!canSubmit"
        >
          註冊並完成
        </button>
      </form>
    </div>
</div>
    </div>
  </template>

  <script>
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { computed } from 'vue';
var baseAddress = 'https://localhost:7089';
export default {
  data() {
    return {
      userData: {
        phone: '',
        address: '',
        sources: [],
      },
      isLoading:true,// 控制畫面是否準備好顯示
      selectedSources: [],
      errors: {
        phone:null,
        address:null
      },
      isSubmitting: false,
      sources: [], // 這裡新增 sources 屬性，並初始化為空陣列
      inputValue:'',
      isFormInvalid: false, // 用來檢查表單是否有效
    };
  },
  
  mounted() {
    Promise.all([this.fetchSources()])
    .then(() => {
        this.checkFormValidity();
      setTimeout(() => {
      this.isLoading = false;
    }, 500);
    });
  },

      computed: {
    // 計算屬性：判斷表單是否可以提交（手機和地址通過驗證且不正在提交）
    canSubmit() {
      // 檢查手機是否有內容且沒有錯誤
      const isPhoneValid = this.userData.phone.trim() !== '' && this.errors.phone === null;
      // 檢查地址是否有內容且沒有錯誤
      const isAddressValid = this.userData.address.trim() !== '' && this.errors.address === null;
      // 你也可以加入檢查 selectedSources 是否至少選擇一個，如果這是必選的
      // const isSourcesSelected = this.selectedSources.length > 0;


      // 按鈕可以提交的條件：手機有效 且 地址有效 且 不正在提交
      return isPhoneValid && isAddressValid && !this.isSubmitting;
      // 如果 sources 必選： return isPhoneValid && isAddressValid && isSourcesSelected && !this.isSubmitting;
    },
    // 保留 isFormInvalid 還是有用的，它用於顯示所有錯誤訊息
    isFormInvalid() {
         return Object.values(this.errors).some(error => error !== null);
    }
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
async validateField(field) {
      switch (field) {
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
    // 這個方法現在主要用來設定 isFormInvalid，可以保留用於其他可能的總體表單狀態判斷
    checkFormValidity() {
      // 注意：這裡的 isFormInvalid 仍然檢查所有 errors
      // 如果你只想根據手機和地址判斷總體狀態，應該使用 computed property 'canSubmit'
      // const hasFieldErrors = Object.values(this.errors).some(error => error !== null);
      // this.isFormInvalid = hasFieldErrors;
      console.log("checkFormValidity called, errors:", this.errors);
    },
    submitForm() {
     // 在提交前對所有相關欄位進行最後驗證
      // 這裡的驗證會更新 this.errors，進而影響 computed property 'canSubmit'
      this.validateField('phone');
      this.validateField('address');
       // 如果 sources 必選，也驗證一下
       // this.validateField('sources');


      console.log('Selected sources:', this.selectedSources);

      // 使用 computed property 來判斷是否可以提交
      // 如果 canSubmit 是 false (表示手機或地址有錯誤，或正在提交中)
      if (!this.canSubmit) {
        console.log('表單驗證未通過或正在提交，不提交');
        return; // 如果條件不符，停止提交
      }

      // 如果到這裡，表示 canSubmit 是 true，可以開始提交
      this.submitToDatabase();
    },
    async submitToDatabase() {
      this.isSubmitting = true;
      const dataToSend = {
        phone: this.userData.phone, // 添加手機號碼
        address: this.userData.address,
        sources: [...this.selectedSources],
      };

      try {
            // 獲取 JWT
            const authStore = useAuthStore();
            const token = authStore.token; // 從你的 Auth Store 獲取 Token

            if (!token) {
                 console.error("未找到 JWT Token，無法提交補充資料");
                 alert("登入狀態無效，請重新登入");
                 // 重新導向到登入頁面
                 // this.$router.push({ name: 'Login' });
                 return;
            }

            // 發送 POST 請求到新的後端 API
            const response = await axios.post(`${baseAddress}/api/Account/CompleteProfile`, dataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}` // 在 Header 中附帶 JWT
                }
            });

            // 如果請求成功
            console.log('補充資料更新成功', response.data);

            // 根據後端回傳的響應處理後續邏輯
            // 例如：導向到會員儀表板
            this.$router.push({ name: 'MemberDashboard' });

        } catch (error) {
            // 處理錯誤
            console.error('提交補充資料失敗', error.response ? error.response.data : error);
            // 顯示錯誤訊息給使用者
            let errorMessage = '提交資料失敗';
            if (error.response && error.response.data) {
                 // 如果後端有返回特定的錯誤訊息，顯示它
                 if (typeof error.response.data === 'string') {
                     errorMessage = error.response.data;
                 } else if (error.response.data.message) { // 假設後端錯誤響應中包含 message
                      errorMessage = error.response.data.message;
                 } else if (error.response.data.errors) { // 假設後端返回驗證錯誤列表
                     errorMessage = "資料驗證失敗：\n" + Object.values(error.response.data.errors).flat().join('\n');
                 }
            }
            alert(errorMessage);
        }finally{
          this.isSubmitting = false; // 提交完成後,設置 isSubmitting 為 false
        };
    }
  }
};
</script>

<style scoped>
.title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #3d5a80;
    margin-bottom: 30px;
}
.register-container {
      display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 100vh;
  padding: 20px;
  overflow: hidden;
}
.register-card {
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