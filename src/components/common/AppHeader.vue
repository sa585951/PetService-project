<template>
  <header>
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <router-link to="/" class="navbar-brand">
          <i class="fas fa-paw"></i> Pet Adoption & Care
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link to="/" class="nav-link">
                <i class="fa fa-home"></i> 首頁
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/news" class="nav-link">
                <i class="fa fa-home"></i> 最新公告
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/walk" class="nav-link">
                <i class="fa fa-dog"></i> 寵物散步
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/hotel" class="nav-link">
                <i class="fa fa-building"></i> 寵物住宿
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/qa" class="nav-link">
                <i class="fa fa-home"></i> 常見問題
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/about" class="nav-link">
                <i class="fa fa-info-circle"></i> 關於我們
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/contact" class="nav-link">
                <i class="fa fa-phone"></i> 聯繫我們
              </router-link>
            </li>
            <template v-if="isLoggedIn">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  <i class="fa fa-user"></i> {{ username }}
                </a>
                <ul class="dropdown-menu">
                  <li>
                    <router-link to="/memberdashboard" class="dropdown-item">
                      <i class="bi bi-house-door-fill"></i> 總覽
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/profile" class="dropdown-item">
                      <i class="bi bi-person-fill"></i> 個人資料
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/my-pets" class="dropdown-item">
                      <i class="bi bi-bag-check-fill"></i> 我的訂單
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/pet" class="dropdown-item">
                      <i class="bi bi-heart-fill"></i>我的寵物
                    </router-link>
                  </li>
                  <li>
                    <hr class="dropdown-divider">
                  </li>
                  <li>
                    <a class="dropdown-item" href="#" @click.prevent="logout">
                      <i class="fa fa-sign-out-alt"></i> 登出
                    </a>
                  </li>
                </ul>
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <router-link to="/login" class="nav-link">
                  <i class="fa fa-sign-in-alt"></i> 登入
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/registerstart" class="nav-link">
                  <i class="fa fa-user-plus"></i> 註冊
                </router-link>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { useAuthStore } from '../../stores/authStore';
import{computed} from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'AppHeader',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    // Pinia store中的登入狀態
    const isLoggedIn = computed(() => authStore.isLoggedIn);
    const username = computed(() => authStore.userName);

    // 登出處理
    const logout = () => {
      authStore.logout();  // 這裡假設你在authStore裡實現了logout方法
      router.push('/login');
    };
  

  return{
    isLoggedIn,
    username,
    logout
  };


  
  // data() {
  //   return {
  //     // 暫時使用靜態數據，實際應該從store獲取
  //     isLoggedIn: false,
  //     username: '用戶名'
  //   }
  // },
  // methods: {
  //   logout() {
  //     // 實際應該呼叫store的logout方法
  //     this.isLoggedIn = false;
  //     this.$router.push('/login');
  //   }
  // },
  // // 實際應用時應該使用store管理登入狀態
  // mounted() {
  //   // 檢查本地存儲中是否有用戶信息
  //   const userData = localStorage.getItem('user');
  //   if (userData) {
  //     const user = JSON.parse(userData);
  //     this.isLoggedIn = true;
  //     this.username = user.name;
  //   }
  // }
}
}
</script>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
  font-weight: 600;
}

.navbar{
  background-color: #ffc272;
}



.navbar-brand i {
  color: #ff6b6b;
  margin-right: 5px;
}

.nav-link{
  color: #8B4513;
}

.nav-link i {
  margin-right: 5px;
  
}

.dropdown-item i {
  margin-right: 8px;
  width: 16px;
}
</style>