<template>
<template v-if="isLoggedIn">
  <div class="container-fluid">
    <div class="row">
      <!-- 左側選單 -->
      <div class="col-md-2 sidebar py-4">
        <router-link to="/memberdashboard" class="sidebar-link" :class="{ active: activeTab === 'memberdashboard' }" @click="setActiveTab('memberdashboard')">
          <i class="bi bi-house-door"></i> 總覽
        </router-link>
        <router-link to="/profile" class="sidebar-link" :class="{ active: activeTab === 'profile' }" @click="activeTab = 'profile'">
          <i class="bi bi-person"></i> 個人資料
        </router-link>
        <router-link to="/orders" class="sidebar-link" :class="{ active: activeTab === 'orders' }" @click="activeTab = 'orders'">
            <i class="bi bi-bag-check"></i> 我的訂單
        </router-link>
        <router-link to="/pets" class="sidebar-link" :class="{ active: activeTab === 'pets' }" @click="activeTab = 'pets'">
            <i class="bi bi-heart"></i> 我的寵物
        </router-link>
      </div>
      
      <!-- 右側內容 -->
      <div class="col-md-10 p-4 content-area">
        <div v-if="activeTab === 'memberdashboard'" class="dashboard-content">
          <div class="row">
            <!-- 左側內容: 會員資料和寵物 -->
            <div class="col-md-6 left-column">
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
                      <img :src="user.avatar" class="avatar mb-2" :alt="user.name">
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
                  <button class="secondary-btn" @click="activeTab = 'pets'"><i class="bi bi-gear"></i> 管理
                  </button>
                </div>
                <div class="card-body pet-scrollable">
                  <div class="row">
                    <div v-for="pet in pets" :key="pet.id" class="col-md-6 col-xl-4">
                      <div class="pet-card">
                        <img :src="pet.image" class="pet-avatar" :alt="pet.name">
                        <div class="pet-name">{{ pet.name }}</div>
                        <div class="text-muted small">{{ pet.breed }}</div>
                      </div>
                    </div>
                    <div class="col-md-6 col-xl-4">
                      <div class="add-pet-card" @click="activeTab = 'pets'">
                        <i class="bi bi-plus-circle add-pet-icon"></i>
                        <div>新增寵物</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 右側內容: 訂單資訊 -->
            <div class="col-md-6 right-column">
              <!-- 訂單資訊 -->
              <div class="card order-card">
                <div class="card-header d-flex align-items-center">
                  <span>我的訂單</span>
                  <button class="secondary-btn" @click="activeTab = 'orders'">
                    查看所有訂單
                  </button>
                </div>
                <div class="card-body order-scrollable p-0">
                  <div v-for="order in orders" :key="order.id" class="order-item">
                    <div class="row align-items-center">
                      <div class="col-md-3">
                        <span class="badge" :class="getOrderStatusClass(order.status)">{{ order.status }}</span>
                      </div>
                      <div class="col-md-9">
                        <p class="mb-0 fw-bold">訂單編號: {{ order.id }}</p>
                        <small class="text-muted">{{ order.date }}</small>
                      </div>
                    </div>
                    <div class="row mt-2">
                      <div class="col-md-7">
                        <div class="d-flex align-items-center">
                          <i class="bi bi-box me-2"></i>
                          <span>{{ order.items }} 件商品</span>
                        </div>
                      </div>
                      <div class="col-md-5 text-end">
                        <p class="mb-0 fw-bold">NT$ {{ order.total }}</p>
                      </div>
                    </div>
                    <div class="mt-2 order-detail">
                      <div v-for="(product, idx) in order.products" :key="idx" class="order-product">
                        <div class="d-flex align-items-center">
                          <div class="product-img-container me-2">
                            <img :src="product.image" alt="商品圖片" class="product-img">
                          </div>
                          <div class="flex-grow-1">
                            <div class="product-name">{{ product.name }}</div>
                            <div class="d-flex justify-content-between">
                              <span class="text-muted">x{{ product.quantity }}</span>
                              <span>NT$ {{ product.price }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
// 引入必要的 Composition API 函數和 Router Hooks
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 引入 Pinia Store
import { useAuthStore } from '@/stores/authStore'; // 確保路徑正確

// 獲取 Router 和當前 Route 實例
const route = useRoute();
const router = useRouter();

// 獲取 Auth Store 實例
const authStore = useAuthStore();

// 從 Auth Store 獲取登入狀態（假設你需要用它控制最外層的 v-if）
const isLoggedIn = computed(() => authStore.isLoggedIn);


// === 新增：用於管理左側選單 active 狀態和內容顯示的狀態變數 ===
const activeTab = ref('memberdashboard'); // 初始化 activeTab，預設為 'memberdashboard'


// === 新增：處理選單點擊及導向的函數 ===
const setActiveTab = (tabName) => {
    activeTab.value = tabName; // 設定 activeTab 狀態
    // 執行路由導向到對應的路徑
    router.push(`/${tabName}`); // 假設路由路徑就是 / + tabName
};


// === 新增：組件載入時，根據當前路由設定 activeTab 的初始值 ===
onMounted(() => {
    // 根據當前的路由路徑來判斷哪個 tab 應該是 active
    const currentPath = route.path;
    if (currentPath.includes('/memberdashboard')) {
        activeTab.value = 'memberdashboard';
    } else if (currentPath.includes('/profile')) {
        activeTab.value = 'profile';
    } else if (currentPath.includes('/orders')) {
        activeTab.value = 'orders';
    } else if (currentPath.includes('/pets')) {
        activeTab.value = 'pets';
    }
    // 添加其他 tab 的判斷...
    console.log('MemberDashboard mounted. Initial activeTab:', activeTab.value, 'Current path:', currentPath); // 可選：用於除錯
});


// === 新增：監聽路由變化，保持 activeTab 與路由同步 ===
watch(() => route.path, (newPath) => {
    console.log('Route path changed to:', newPath); // 可選：用於除錯
    // 根據新的路由路徑來更新 activeTab
    if (newPath.includes('/memberdashboard')) {
        activeTab.value = 'memberdashboard';
    } else if (newPath.includes('/profile')) {
        activeTab.value = 'profile';
    } else if (newPath.includes('/orders')) {
        activeTab.value = 'orders';
    } else if (newPath.includes('/pets')) {
        activeTab.value = 'pets';
    }
    // 添加其他 tab 的判斷...
     console.log('activeTab updated to:', activeTab.value); // 可選：用於除錯
});


// === 新增：模板中使用的用戶數據狀態 (需要從後端獲取) ===
// 這裡先用一個假的數據結構，你需要在 mounted 或其他地方獲取真實數據
const user = ref({
    name: '載入中...',
    avatar: 'https://via.placeholder.com/150/007bff/fff?text=User',
    email: 'loading@example.com',
    phone: 'N/A',
    address: '載入中...'
});

// === 你需要實現獲取用戶數據的邏輯（例如在 onMounted 中） ===
// 這裡只提供一個框架，你需要填寫實際的 fetch 或 axios 呼叫
/*
onMounted(async () => {
   // 獲取真實用戶數據並更新 user.value
});
*/

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


.sidebar {
  height: 100vh;
  border-right: 1px solid #e5e5e5;
  overflow-y: auto;
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

.pet-avatar {
  width: 80px;
  height: 80px;
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
  margin-bottom: 20px;
}

.pet-name {
  margin-top: 10px;
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