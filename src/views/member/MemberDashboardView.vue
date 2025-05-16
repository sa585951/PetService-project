<template>
<template v-if="isLoggedIn">
  <div class="container-fluid">
    <div class="row">
      <!-- 左側選單 -->
      <MemberSidebar/>
      
      <!-- 右側內容 -->
      <div class="col-md-10 p-4 content-area">
        <div v-if="activeTab === 'memberdashboard'" class="dashboard-content">
          <div class="row">
            <!-- 左側內容: 會員資料和寵物 -->
            <div class="col-6 left-column">
              <!-- 會員資料卡片 -->
              <div class="card member-card">
                <div class="card-header d-flex align-items-center">
                  <span>個人資料</span>
                  <button class="secondary-btn" @click="setActiveTab('profile')">
                    <i class="bi bi-pencil"></i> 編輯
                  </button>
                </div>
                <div class="card-body">
                  <div class="row align-items-center">
                      <div class="col-md-4 text-center">
                        <img :src="processedImageUrl" class="avatar rounded-circle" alt="會員頭像" />
                      </div>
                    <div class="col-md-8">
                      <h5>{{ user.name }}</h5>
                      <p class="mb-1"><i class="bi bi-envelope me-2"></i>{{ user.email }}</p>
                      <p class="mb-1"><i class="bi bi-telephone me-2"></i>{{ user.phone }}</p>
                      <p class="mb-0"><i class="bi bi-geo-alt me-2"></i>{{ user.address }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 我的寵物 -->
              <div class="card pet-section">
                <div class="card-header d-flex align-items-center">
                  <span>我的寵物</span>
                  <button class="secondary-btn" @click="setActiveTab('pet')">
                    <i class="bi bi-gear"></i> 管理
                  </button>
                </div>
                <div class="card-body pet-scrollable">
                        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            <div class="col" v-for="pet in pets" :key="pet.id">
                                <div class="pet-card card h-100 position-relative shadow-sm">
                                    <div class="pet-name-overlay  text-white text-center ">
                                        <div class="pet-name-text" style="font-size: 1.25rem; font-weight: bold;">
                                        {{ pet.petName }}
                                       </div>
                                    </div>
                                    <img :src="getPetPhotoUrl(pet.petImagePath)" class="card-img-top pet-photo" :alt="pet.petName">
                                    
                                    <div class="card-body">
                                        <p class="card-text">
                                            <i class="fas fa-paw"></i>
                                             年紀: {{ pet.petAge !== null && pet.petAge !== undefined ? pet.petAge + '歲' : '未知' }}<br>
                                            <i class="bi bi-cake2 me-1"></i>
                                            生日: {{ formatBirthday(pet.petBirthday) }}<br>
                                        </p>
                                    </div>
                                </div>
                            </div>
                  </div>
                 </div>
              </div>
            </div>
                          <!-- 右側內容: 訂單資訊 -->
            <div class="col-6 right-column">
              <!-- 訂單資訊 -->
              <div class="card order-card">
                <div class="card-header d-flex align-items-center">
                  <span>我的訂單</span>
                  <button class="secondary-btn" @click="router.push(`/member/orders`)">
                    查看所有訂單
                  </button>
                </div>
                <div class="card-body order-scrollable p-0">
                  <div v-for="o in orders" :key="o.fId" class="order-item d-flex align-items-center justify-content-between p-3 border-bottom">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-box fs-4 me-3"></i>
                         <span class="fw-bold me-3">訂單 #{{ o.fId }}</span>
                      <div>
                        <span class="badge me-3" :class="{
                          'bg-warning text-dark': o.fOrderStatus === '未付款',
                          'bg-success text-white': o.fOrderStatus === '已付款',
                          'bg-secondary text-white': o.fOrderStatus === '已取消'
                        }">
                         {{ o.fOrderStatus }}
                        </span>
                      </div>
                    </div>
                        <span class="fw-bold me-3">NT$ {{ o.fTotalAmount }}</span>
                        <small class="">{{ formatDate(o.fCreatedAt) }}</small>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
    </div>
      </div>

</template>
<template v-else>
      {/* 未登入狀態顯示 */}
      <p>請登入以查看會員中心</p>
   </template>
</template>

  
<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

// 引入 Pinia Store
import { useAuthStore } from '@/stores/authStore'; // 確保路徑正確
import { useOrderStore } from '@/stores/order'; // 確保路徑正確
import { storeToRefs } from 'pinia';
import MemberSidebar from '@/components/MemberSidebar.vue';

import defaultAvatarImage from '@/assets/picture/user-avatar.png';
import defaultPetAvatarImage from '@/assets/picture/paws-avatar.png';
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const orderStore = useOrderStore();
const { orders } = storeToRefs(orderStore);

const currentPage = ref(1);
const pageSize = 10;
function loadDashboardOrders(){
  orderStore.fetchOrders({
    memberId: authStore.memberId,
    keywords: '',
    orderType: 'all',
    sortBy:'date_asc',
    page: currentPage.value,
    pageSize
  })
}
// 從 Auth Store 獲取登入狀態
const isLoggedIn = computed(() => authStore.isLoggedIn);

const baseAddress = 'https://localhost:7089';
const defaultAvatar = defaultAvatarImage;
const defaultPetPhoto = defaultPetAvatarImage;
const pets = ref([]);
// 從orderStore取得訂單摘要
// formatDate函數
const formatDate = val => {
  return new Date(val).toLocaleString('zh-TW', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}
// 響應式資料
const activeTab = ref('memberdashboard'); // 初始化 activeTab
const previewUrl = ref(null); // 用於顯示預覽圖（如果需要的話）

const user = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  avatarUrl: ''
});

// 計算屬性 - 處理頭像URL
const processedImageUrl = computed(() => {
  if (previewUrl.value) {
    // 如果是選擇檔案後的預覽（base64格式）
    return previewUrl.value;
  } else if (user.value.avatarUrl) {
    // 處理從API返回的圖片URL
    if (user.value.avatarUrl.startsWith('http') || user.value.avatarUrl.startsWith('blob')) {
      // 如果是完整URL或blob URL
      return user.value.avatarUrl;
    } else if (user.value.avatarUrl.startsWith('/')) {
      // 如果是相對路徑（如: /uploads/avatars/avatar_xxx.jpg），加上基礎地址
      return `${baseAddress}${user.value.avatarUrl}`;
    } else {
      // 如果沒有斜線開頭，也加上基礎地址和斜線
      return `${baseAddress}/${user.value.avatarUrl}`;
    }
  }
  // 預設頭像
  return defaultAvatar;
});
const setActiveTab = (tabName) => {
  activeTab.value = tabName; // 設定 activeTab 狀態
  
  // 根據 tabName 導向對應的路由
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

const fetchProfile = async () => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    router.push('/login');
    return;
  }
  
  try {
    const response = await axios.get(`${baseAddress}/api/Member/GetProfile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const data = response.data;
    console.log('獲取的用戶資料:', data);
    console.log('頭像URL:', data.avatarUrl); // 調試用，確認頭像路徑
    
    // 更新用戶資料
    user.value = {
      name: data.userName || data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      avatarUrl: data.avatarUrl || ''
    };
    
    // ****** 添加這段程式碼來更新 Pinia Store 的 userName ******
    // 從新獲取的資料中取出使用者名稱 (使用與更新 user.value.name 相同的邏輯)
    const newUserName = data.userName || data.name || '';
    // 將新的使用者名稱賦值給 Pinia Store 的 userName 狀態
    authStore.userName = newUserName;
    // ********************************************************

    // 調試用，確認處理後的完整頭像URL
    console.log('處理後的頭像URL:', processedImageUrl.value);
  } catch (error) {
    console.error('獲取用戶資料失敗:', error);
    if (error.response && error.response.status === 401) {
      // 如果是認證失敗，導向登入頁
      router.push('/login');
    }
    authStore.userName = null;
    authStore.isLoggedIn(false);
  }
};


// 根據路由路徑決定 activeTab 的輔助函數
const getActiveTabFromPath = (path) => {
  if (path.includes('/memberdashboard')) {
    return 'memberdashboard';
  } else if (path.includes('/profile')) {
    return 'profile';
  } else if (path.includes('/member/orders')) {
    return 'orders';
  } else if (path.includes('/pet')) {
    return 'pet';
  }
  return 'memberdashboard'; // 預設值
};
// 載入寵物資料的函式
const fetchPets = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert('您尚未登入，請先登入。');
        router.push('/login');
        return;
    }
    try {
        const response = await axios.get(`${baseAddress}/api/Pet/GetPetData`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        pets.value = response.data || [];
        console.log('寵物資料載入成功:', pets.value);
    } catch (error) {
        console.error('載入寵物資料失敗:', error);
        if (error.response && error.response.status === 401) {
            alert('登入狀態已過期，請重新登入。');
            // authStore.logout(); // 如果有 logout action
            router.push('/login');
        } else {
            alert('載入寵物資料失敗，請稍後再試。' + (error.response?.data?.message || error.message));
        }
    }
};

// 處理寵物圖片 URL
const getPetPhotoUrl = (photoPath) => {
    if (photoPath && (photoPath.startsWith('http://') || photoPath.startsWith('https://'))) {
        return photoPath;
    } else if (photoPath && photoPath.startsWith('/')) {
        return `${baseAddress}${photoPath}`;
    } else if (photoPath) {
        return `${baseAddress}/${photoPath}`;
    }
    return defaultPetPhoto; // 否則回傳預設圖片
};

// 格式化生日為本地日期字串
const formatBirthday = (birthday) => {
    if (!birthday) return '未知';
    try {
        // 嘗試從各種格式創建 Date 物件
        const date = new Date(birthday);
        // 檢查是否是有效的日期
        if (!isNaN(date.getTime())) {
            // 使用 toLocaleDateString 格式化為本地日期字串
            return date.toLocaleDateString();
        } else {
            return '格式錯誤';
        }
    } catch {
        return '格式錯誤';
    }
};
// 生命週期
onMounted(() => {
  // 根據當前的路由路徑來判斷 activeTab
  const currentPath = route.path;
  activeTab.value = getActiveTabFromPath(currentPath);
  
  console.log('MemberDashboard mounted. Initial activeTab:', activeTab.value, 'Current path:', currentPath);
  
  // 獲取用戶資料
  fetchProfile();
  // 若會員ID存在,獲取訂單資料
  if(authStore.memberId){
    loadDashboardOrders();
  }
  fetchPets();
});
// 監聽路由變化，保持 activeTab 與路由同步
watch(() => route.path, (newPath) => {
  console.log('Route path changed to:', newPath);
  activeTab.value = getActiveTabFromPath(newPath);
  console.log('activeTab updated to:', activeTab.value);
});
</script>
  
<style scoped>
body {
  font-family: 'Microsoft JhengHei', Arial, sans-serif;
  overflow: hidden;
}

.container-fluid {
  overflow: hidden;
}

.content-area {
  overflow: auto;
}

.dashboard-content {
  height: 100%;
  overflow: hidden;
}

.member-card {
    height: 200px;
  margin-bottom: 20px;
}

.pet-section {
    height: calc(100% - 220px); /* 減去會員卡片高度和間距 */
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
}

.pet-scrollable {
  overflow-y: auto;
  height: calc(100% - 56px); /* 減去卡片頭部高度 */
}
.pet-photo{
  width: 100px;
  height: 100px;
  margin-top: 10px;
}

.order-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
}

.order-scrollable {
  overflow-y: auto;
  flex: 1;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.left-column, .right-column {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  padding-bottom: 20px; /* 添加底部間距，防止內容被擋住 */
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
  padding: 5px 20px;
  border-top-left-radius: 15px !important;
  border-top-right-radius: 15px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.primary-btn {
  padding: 8px 20px;
  background-color: #ACC572;
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn:hover {
  background-color: #95bf33;
}

.secondary-btn {
  padding: 3px 15px;
  background-color: transparent;
  color: goldenrod;
  border: 2px solid goldenrod;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  background-color: rgb(231, 179, 34);
  color: white;
}

.order-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.order-item:last-child {
  border-bottom: none;
}

.order-item:hover {
  background-color: #f8f9fa; /* Bootstrap table-hover 類似顏色 */
  transition: background-color 0.2s;
}

.order-detail {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 10px;
}

.order-product {
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
}

.order-product:last-child {
  border-bottom: none;
}

.product-img-container {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-name {
  font-weight: 500;
  font-size: 0.9rem;
}

.pet-card {
  text-align: center;
  align-items: center;

}

.pet-name {
  margin: 10px;
  font-weight: 600;
}

.add-pet-card {
  height: 100%;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ddd;
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
}

.add-pet-card:hover {
  border-color: #ACC572;
}

.add-pet-icon {
  font-size: 2rem;
  color: #ACC572;
  margin-bottom: 10px;
}
.pet-name-text{
  margin:5px
}
/* 假設你的樣式檔 */
.pet-name-overlay {
  /* 使用 RGBA 設定半透明黑色背景，0.6 表示 60% 不透明度 */
  background-color: rgba(153, 151, 54, 0.6);
  /* 確保疊加層在圖片上方 (如果圖片或其他元素有 z-index 設定，可能需要調整) */
  /* 確保文字能正常換行，防止名字太長跑版 */
  white-space: normal;
  word-break: break-word; /* 或 overflow-wrap: break-word; */
  border-radius: 80px;
}

/* 如果你使用了 div 內部 div 顯示名字，可以這樣控制字體大小和粗細 */
.pet-name-overlay .pet-name-text {
    font-size: 1.25rem; /* 或其他你想要的大小 */
    font-weight: bold;
}
@media (max-width: 992px) {
  .left-column, .right-column {
    height: auto;
  }
  
  .member-card {
    height: auto;
  }
  
  .pet-section {
    height: 400px;
  }
  
  .order-card {
    height: 800px; /* 等於會員卡片和寵物區域的總高度 */
    margin-bottom: 20px;
  }
  
}
</style>