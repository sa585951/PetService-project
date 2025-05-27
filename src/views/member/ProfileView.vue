<template>
    <div class="container-fluid">
        <div class="row">
            <MemberSidebar/>

            <div class="col-md-10 p-4 content-area">
                <div class="card mb-4">
                   <div class="card-header d-flex align-items-center justify-content-between">
                   <span>個人資料設定</span>
                   <div class="d-flex">
                       <button class="btn btn-outline-danger me-2" @click="cancelChanges" :disabled="!formChanged" v-if="formChanged">
                           <i class="bi bi-x-lg"></i> 取消
                       </button>
                       <button class="btn btn-save" @click="saveProfile" :disabled="!formChanged">
                           <i class="bi bi-check-lg"></i> 儲存
                       </button>
                   </div>
                   </div>
                   <div class="card-body">
                       <div class="row mb-4">
                           <div class="col-md-4 text-center">
                               <div class="position-relative d-inline-block">
                                   <img :src="processedImageUrl" class="avatar rounded-circle" alt="會員頭像" />
                                   <div class="upload-overlay" @click="triggerFileUpload">
                                       <i class="bi bi-camera camera-icon"></i>
                                   </div>
                                   <input 
                                       type="file" 
                                       ref="fileInput" 
                                       class="d-none" 
                                       accept="image/*" 
                                       @change="handleAvatarChange"
                                   >
                               </div>
                               <p class="text-muted small">點擊相機更換照片</p>
                           </div>
                           <div class="col-md-8">
                               <div class="row">
                                   <div class="col-md-6">
                                       <div class="mb-3">
                                           <label for="name" class="form-label">姓名</label>
                                           <small class="text-muted">(無法修改)</small>
                                           <input 
                                               type="text" 
                                               class="form-control bg-light" 
                                               id="name" 
                                               v-model="user.name" placeholder="請輸入您的姓名"
                                               readonly
                                           >
                                       </div>
                                   </div>
                                   <div class="col-md-6">
                                       <div class="mb-3">
                                           <label for="email" class="form-label">電子信箱</label>
                                           <small class="text-muted">(帳號識別，無法修改)</small>
                                           <div class="input-group">
                                               <input 
                                                   type="email" 
                                                   class="form-control bg-light" 
                                                   id="email" 
                                                   v-model="user.email" placeholder="請輸入您的電子信箱"
                                                   readonly
                                               >
                                           </div>
                                       </div>
                                   </div>
                               </div>
                               <div class="row">
                                   <div class="col-md-6">
                                       <div class="mb-3">
                                           <label for="phone" class="form-label">手機號碼</label>
                                           <div class="input-group">
                                               <input 
                                                   type="tel" 
                                                   class="form-control" 
                                                   @input="clearError('phone'); checkFormValidity;validateField('phone')"
                                                  
                                                   id="phone" 
                                                   v-model="user.phone" placeholder="請輸入您的手機號碼"
                                               >
                                           </div>
                                            <p v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</p>
                                       </div>
                                   </div>
                                   <div class="col-md-6">
                                       <div class="mb-3">
                                           <label for="address" class="form-label">地址</label>
                                           <div class="input-group">
                                               <input 
                                                   type="text" 
                                                   class="form-control" 
                                                   @input="clearError('address'); checkFormValidity"
                                                   @blur="validateField('address')"
                                                   id="address" 
                                                   v-model="user.address" placeholder="請輸入您的地址"
                                               >
                                               <p v-if="errors.address" class="text-red-500 text-sm">{{ errors.address }}</p>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
                </div>
            <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between">
                   <h6 class="mb-3">通知設定</h6>
                            <div class="notification-toggle-row mb-3">
                                <div>
                                    <div class="fw-medium">接收系統通知</div>
                                    <div class="text-muted small">開啟後您將收到訂單狀態、活動提醒等系統通知</div>
                                </div>
                                <div class="form-check form-switch">
                                    <input 
                                        class="form-check-input toggle-input" 
                                        type="checkbox" 
                                        id="notificationToggle"
                                        v-model="user.notificationsEnabled" >
                                </div>
                            </div>
                            
                            <div class="notification-toggle-row mb-3">
                                <div>
                                    <div class="fw-medium">接收行銷通知</div>
                                    <div class="text-muted small">開啟後您將收到最新的優惠、折扣及活動資訊</div>
                                </div>
                                <div class="form-check form-switch">
                                    <input 
                                        class="form-check-input toggle-input" 
                                        type="checkbox" 
                                        id="adsToggle"
                                        v-model="user.adsEnabled" >
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import MemberSidebar from '@/components/MemberSidebar.vue'
import defaultAvatarImage from '@/assets/picture/user-avatar.png';
import Swal from 'sweetalert2';
const authStore = useAuthStore()
const router = useRouter()

const errors = reactive({});

const formChanged = ref(false)
const originalForm = ref({}) // 用於暫存原始表單資料
const activeTab = ref('profile')

const isLoggedIn = computed(() => authStore.isLoggedIn);
const baseAddress = 'https://localhost:7089';
const defaultAvatar = defaultAvatarImage;

const previewUrl = ref(null); // 用於顯示新選擇的頭像預覽圖 (blob URL)
const newAvatarFile = ref(null); // 用於儲存新選擇的頭像檔案
// === 修正點 1: 確保 fileInput 只有一個宣告 ===
const fileInput = ref(null); 
const isFormInvalid = ref(false);

const setActiveTab = (tabName) => {
    activeTab.value = tabName;
    const routeMap = {
        'memberdashboard': '/memberdashboard',
        'profile': '/profile',
        'orders': '/member/orders',
        'pet': '/pet'
    };
    if (routeMap[tabName]) {
        router.push(routeMap[tabName]);
    }
};

// 表單資料 (統一使用 user 物件，且為 reactive)
const user = reactive({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatarUrl: '', // 統一使用 avatarUrl
    notificationsEnabled: true,
    adsEnabled: false
});

// 計算屬性 - 處理頭像URL
const processedImageUrl = computed(() => {
    if (previewUrl.value) {
        return previewUrl.value;
    } else if (user.avatarUrl) { 
        // 處理從API返回的圖片URL
        if (user.avatarUrl.startsWith('http') || user.avatarUrl.startsWith('blob')) {
            return user.avatarUrl;
        } else if (user.avatarUrl.startsWith('/')) {
            // 如果是相對路徑，加上 baseAddress
            return `${baseAddress}${user.avatarUrl}`;
        } else {
            // 如果沒有前綴斜槓，也加上 baseAddress 和斜槓
            return `${baseAddress}/${user.avatarUrl}`;
        }
    }
    // 預設頭像
    return defaultAvatar;
});

const triggerFileUpload = () => {
    fileInput.value.click()
}

// === 修正點 2: 確保 newAvatarFile 被賦值 ===
const handleAvatarChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        newAvatarFile.value = file; // <-- 關鍵修正：將檔案儲存到 newAvatarFile
        previewUrl.value = URL.createObjectURL(file); // 將新預覽 URL 賦值給 previewUrl
        formChanged.value = true; // 圖片變更也視為表單變更
    } else {
        // 如果取消選擇檔案，則清除相關狀態
        newAvatarFile.value = null;
        if (previewUrl.value) {
            URL.revokeObjectURL(previewUrl.value);
            previewUrl.value = null;
        }
        // 這裡可以考慮是否需要重置 formChanged。如果只有頭像變更然後又取消，
        // 且其他表單欄位沒有變更，formChanged 應該設為 false。
        // 但在目前的 watch 邏輯下，它會自動重新計算。
    }
}

// 驗證表單欄位
const validateField = async (field) => {
    switch (field) {
        case 'phone':
            const phonePattern = /^[0-9]{10}$/;
            if (!user.phone.trim()) {
                errors.phone = '❗手機是必填的';
            } else if (!phonePattern.test(user.phone)) {
                errors.phone = '❗手機必須是10位數字';
            } else {
                if(user.phone === originalForm.value.phone) {
                    errors.phone = null;
                }else{
                   // 呼叫檢查 phone是否存在
                try {
                    const res = await axios.get(`${baseAddress}/api/Account/CheckPhoneExists`, {
                        params: { phone: user.phone }
                    });
                    errors.phone = res.data.exists ? '❗此手機已被註冊' : null;
                } catch (error) {
                    console.error('檢查手機失敗:', error);
                    // 如果檢查失敗，暫時允許繼續（可以根據需求調整）
                    errors.phone = null;
                } 
                }
            }
            break;
    
        case 'address':
            errors.address = !user.address.trim() ? '❗地址是必填的' : null;
            break;
    }

    checkFormValidity();
};
const clearError = (field) => {
    // 如果 errors 是 reactive 物件，直接修改屬性
    if (errors && errors[field] !== undefined) { // 檢查屬性是否存在
        errors[field] = null;
    }
};
// 檢查表單有效性
const checkFormValidity = () => {
    // 檢查必填欄位是否為空
    const requiredFields = ['phone', 'address'];
    let hasEmptyFields = false;
    let hasFieldErrors = false;

    for (const field of requiredFields) {
        if (!user[field] || !user[field].trim()) {
            hasEmptyFields = true;
            break;
        }
    }

    // 檢查是否有錯誤訊息
    hasFieldErrors = Object.values(errors).some(error => error !== null);

    isFormInvalid.value = hasEmptyFields || hasFieldErrors;
};


// 載入使用者資料
const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        router.push('/login');
        return;
    }

    try {
        const response = await axios.get(`${baseAddress}/api/Member/GetProfile`,{
            method: 'GET', // GET 請求不需要 method 屬性，axios.get 已預設
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        
        const data = response.data
        console.log('獲取的用戶資料:', data)

        user.name = data.userName || data.name || '';
        user.email = data.email || '';
        user.phone = data.phone || '';
        user.address = data.address || '';

            if (data.avatarUrl && typeof data.avatarUrl === 'string' && data.avatarUrl.trim() !== '' && data.avatarUrl.toLowerCase() !== 'null' && data.avatarUrl.toLowerCase() !== 'undefined') {
         user.avatarUrl = data.avatarUrl;
    } else {
         // 如果從後端拿到的 avatarUrl 無效或為空，則設定為空字串，確保 else if (user.avatarUrl) 判斷為假
         user.avatarUrl = '';
    }
        // user.avatarUrl = data.avatarUrl || defaultAvatar; // 如果後端沒有回傳或為空，使用 defaultAvatar
        user.notificationsEnabled = data.notificationsEnabled ?? true;
        user.adsEnabled = data.adsEnabled ?? false;

        originalForm.value = { ...user }; 

        previewUrl.value = null; // 確保每次載入新資料時，清除舊的預覽
        if (fileInput.value) {
            fileInput.value.value = ''; // 重置檔案輸入框
        }
        newAvatarFile.value = null; // 清除任何待上傳的檔案狀態

        formChanged.value = false;

    } catch (error) {
        console.error('獲取用戶資料失敗:', error);
        if (error.response && error.response.status === 401) {
            router.push('/login');
        }
    }
};

// 監聽表單變更 (同時監聽 user 物件和 previewUrl)
watch([user, previewUrl], ([newUser, newPreviewUrl]) => {
    let changed = false;

    // 比較一般表單欄位
    if (originalForm.value.name !== newUser.name ||
        originalForm.value.phone !== newUser.phone ||
        originalForm.value.address !== newUser.address ||
        originalForm.value.notificationsEnabled !== newUser.notificationsEnabled ||
        originalForm.value.adsEnabled !== newUser.adsEnabled) {
        changed = true;
    }

    // 比較頭像變更
    // 如果有新的本地預覽圖片（意味著使用者選了新檔案），表示有變更
    if (newPreviewUrl !== null) { 
        changed = true;
    } else if (originalForm.value.avatarUrl !== newUser.avatarUrl) {
        // 如果沒有本地預覽，但已儲存的 avatarUrl 有變更 
        // (例如：儲存成功後後端返回新 URL，或者從後端載入時圖片 URL 變了)
        changed = true;
    }
    
    formChanged.value = changed;
}, { deep: true });



// 取消變更 (實現「取消」按鈕功能)
const cancelChanges = () => {
    Object.assign(user, originalForm.value);
    Object.keys(errors).forEach(key => {
        errors[key] = null;
    });
    if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value); 
        previewUrl.value = null;
    }

    if (fileInput.value) {
        fileInput.value.value = '';
    }
    // === 修正點 4: 重置 newAvatarFile ===
    newAvatarFile.value = null; 

    formChanged.value = false;
    //alert('變更已取消');
    Swal.fire({
    text:"變更已取消",
    confirmButtonColor: '#ACC572', // 依然可以設定背景色
        });
};

// 上傳頭像函式
const uploadAvatar = async () => {
    if (!newAvatarFile.value) {
        console.log('沒有新頭像檔案，跳過上傳');
        return user.avatarUrl; 
    }
    
    console.log('準備上傳新頭像檔案:', newAvatarFile.value.name);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append('file', newAvatarFile.value); // 確保後端 API 接收的欄位名是 'file'
    
    try {
        const response = await fetch(`${baseAddress}/api/Member/UploadAvatar`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('上傳頭像失敗:', errorText);
            throw new Error('上傳頭像失敗: ' + errorText);
        }
        
        const data = await response.json();
        console.log('頭像上傳成功，新URL:', data.avatarUrl);
        return data.avatarUrl; // 回傳從伺服器得到的新 URL
    } catch (error) {
        console.error('上傳頭像出錯:', error);
        throw error; 
    }
};

// 儲存資料 (更新資料庫)
const saveProfile = async () => {
    await validateField('phone');
    await validateField('address');

    if(isFormInvalid.value) {
        Swal.fire({
            text: '請修正表單中的錯誤後再試',
            icon: 'error',
            confirmButtonColor: '#ACC572',
        });
        return;
    }

    try {
        console.log('準備儲存的資料:', user);

        const token = localStorage.getItem("token")
        if (!token) {
            alert('您尚未登入，請先登入。');
            router.push('/login');
            return;
        }

        let finalAvatarUrlToSave = user.avatarUrl;
        if (newAvatarFile.value) { // 只有當 newAvatarFile 有值時才執行上傳
            try {
                finalAvatarUrlToSave = await uploadAvatar(); 
            } catch (uploadError) {
                console.error('頭像上傳失敗，無法儲存個人資料:', uploadError);
                alert('頭像上傳失敗，請稍後再試。');
                return;
            }
        }

        const response = await axios.put(`${baseAddress}/api/Member/UpdateProfile`, {
            name: user.name,
            email: user.email, // 確保 email 也包含在更新中，即使它是唯讀的
            phone: user.phone,
            address: user.address,
            avatarUrl: finalAvatarUrlToSave, // 使用上傳後獲得的或原有的 URL
            notificationsEnabled: user.notificationsEnabled,
            adsEnabled: user.adsEnabled
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        
        if (response.status !== 200) {
            throw new Error("更新用戶資料失敗")
        }

        // === 修正點 3: 修正 user.avatarUrl 賦值 ===
        user.avatarUrl = finalAvatarUrlToSave; // 使用正確的變數名

        originalForm.value = { ...user };

        if (previewUrl.value) {
            URL.revokeObjectURL(previewUrl.value);
            previewUrl.value = null;
        }
        if (fileInput.value) {
            fileInput.value.value = '';
        }
        // === 修正點 4 續：清除 newAvatarFile 的值 ===
        newAvatarFile.value = null; 

        formChanged.value = false;
        // alert('個人資料已更新成功！');
        Swal.fire({
            text:"個人資料已更新成功！",
            confirmButtonColor: '#ACC572', // 依然可以設定背景色
        });
        

    } catch (error) {
        console.error('儲存資料失敗:', error);
        if (error.response) {
            console.error('API 錯誤回應:', error.response.data);
            alert(`儲存失敗: ${error.response.data.message || '伺服器錯誤'}`);
        } else if (error.request) {
            console.error('API 無回應:', error.request);
            alert('儲存失敗：無法連接到伺服器，請檢查您的網路。');
        } else {
            alert('儲存失敗，請稍後再試。');
        }
    }
};

// 元件掛載時載入資料
onMounted(() => {
    fetchProfile()
    setActiveTab('profile') // 確保側邊欄的狀態正確
})
</script>

<style scoped>
/* 您的 CSS 樣式保持不變 */
body {
    font-family: 'Microsoft JhengHei', Arial, sans-serif;
    overflow: hidden;
}

.container-fluid {
    overflow: hidden;
}

.content-area {
    margin-left: auto;
}

.dashboard-content {
    height: 100%;
    overflow: hidden;
}

.sidebar-link {
    display: flex;
    align-items: center;
    padding: 15px;
    color: #333;
    text-decoration: none;
    transition: all 0.3s;
    margin-bottom: 5px;
}

.sidebar-link:hover, .sidebar-link.active {
    background-color: #f5f5f5;
    color: #ACC572;
}

.sidebar-link i {
    margin-right: 10px;
    font-size: 1.2rem;
}

.avatar {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #eee;
}

.upload-overlay {
    position: absolute;
    bottom: 10px;
    right: 0;
    background-color: #007bff;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
    border: 2px solid white;
}

.card {
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    border: none;
}

.card-header {
    background-color: white;
    border-bottom: 1px solid #eee;
    font-weight: bold;
    padding: 15px 20px;
    border-top-left-radius: 15px !important;
    border-top-right-radius: 15px !important;
    border-radius: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.notification-toggle-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
}

.toggle-input {
    width: 50px;
    height: 24px;
}
.input-group-text {
    padding-top: 0rem;
    padding-bottom: 0.3rem;
}
.form-check-input:checked {
    background-color: #ACC572;
    border-color: #ACC572;
}
.btn-save {
    background-color: #ACC572;
    border-color: #ACC572;
}


/* 響應式調整 */
@media (max-width: 768px) {
    .avatar {
        width: 120px;
        height: 120px;
    }
}
</style>