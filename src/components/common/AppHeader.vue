<template>
  <header>
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <router-link to="/" class="navbar-brand">
          <img src="../icons/logo.png" alt="" class="logo"> 毛孩管家
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
            <li class="nav-item dropdown" @click="toggleDropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="fa fa-paw"></i> 服務項目
              </a>
              <ul class="dropdown-menu" :class="{ show: dropdownOpen }">
                <li>
                  <router-link to="/walk" class="dropdown-item">
                    <i class="fa fa-dog"></i> 寵物散步
                  </router-link>
                </li>
                <li>
                  <router-link to="/hotel" class="dropdown-item">
                    <i class="fa fa-building"></i> 寵物住宿
                  </router-link>
                </li>
              </ul>
            </li>
            <li class="nav-item">
              <router-link to="/news" class="nav-link">
                <i class="fa-solid fa-bullhorn"></i> 最新公告
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/qa" class="nav-link">
                <i class="fa fa-circle-question"></i> 常見問題
              </router-link>
            </li>
            <li class="nav-item">
              <CartDropdown />
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
                    <router-link to="/orders" class="dropdown-item">
                      <i class="bi bi-bag-check-fill"></i> 我的訂單
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/pet" class="dropdown-item">
                      <i class="bi bi-heart-fill"></i>我的寵物
                    </router-link>
                  </li>
                  <!-- Admin 專屬選項 -->
                  <li v-if="authStore.role === 'Admin'">
                    <router-link to="/membersourcechart" class="dropdown-item">
                      <i class="bi bi-bar-chart-fill"></i> 數據分析
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

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cart'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import CartDropdown from '../CartDropdown.vue'

const dropdownOpen = ref(false)
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}
// router
const router = useRouter()

// pinia stores
const authStore = useAuthStore()
const cartStore = useCartStore()

// computed state
const isLoggedIn = computed(() => authStore.isLoggedIn)
const username = computed(() => authStore.userName)

// logout method
const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
  font-weight: 600;
}

.navbar {
  background-color: #ffc272;
}



.navbar-brand i {
  color: #ff6b6b;
  margin-right: 5px;
}

.nav-link {
  color: #8B4513;
}

.nav-link i {
  margin-right: 5px;

}

.dropdown-item i {
  margin-right: 8px;
  width: 16px;
}

.logo {
  width: 50px;
  height: 50px;
}
</style>
