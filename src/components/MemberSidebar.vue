<template>
  <div class="col-md-2 sidebar py-4">
    <router-link
      v-for="(route, key) in links"
      :key="key"
      :to="route.path"
      class="sidebar-link"
      active-class="active"
      :class="{ active: activeTab === key }"
      @click="setActiveTab(key)"
    >
      <i :class="route.icon"></i> {{ route.label }}
    </router-link>

    <router-link
      v-if="authStore.role === 'Admin'" :to="{ path: '/membersourcechart' }" class="sidebar-link admin-link"
      active-class="active"
      :class="{ active: activeTab === 'analytics' }"
      @click="setActiveTab('analytics')"
    >
      <i class="bi bi-bar-chart"></i> 數據分析
    </router-link>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const route = useRoute();
const activeTab = ref('');
const authStore = useAuthStore();

const links = {
  memberdashboard: { label: '總覽', icon: 'bi bi-house-door', path: '/memberdashboard' },
  profile: { label: '個人資料', icon: 'bi bi-person', path: '/profile' },
  orders: { label: '我的訂單', icon: 'bi bi-bag-check', path: '/orders' },
  pets: { label: '我的寵物', icon: 'bi bi-heart', path: '/pet' },
};


const setActiveTab = (tabName) => {
  activeTab.value = tabName; // 設定 activeTab 狀態
  
  // 根據 tabName 導向對應的路由
  const routeMap = {
    'memberdashboard': '/memberdashboard',
    'profile': '/profile',
    'orders': '/orders',
    'pet': '/pet',
    'analytics': '/membersourcechart'
  };
  
  if (routeMap[tabName]) {
    router.push(routeMap[tabName]);
  }
};

// 根據路由路徑決定 activeTab 的輔助函數
const getActiveTabFromPath = (path) => {
  if (path.includes('/dashboard')) {
    return 'memberdashboard';
  } else if (path.includes('/profile')) {
    return 'profile';
  } else if (path.includes('/orders')) {
    return 'orders';
  } else if (path.includes('/pet')) {
    return 'pet';
  }else if (path.includes('/membersourcechart')) {
    return 'membersourcechart';
  }
  return 'memberdashboard'; // 預設值
};

// 當路由改變時，自動設定 activeTab
watch(() => route.path, (newPath) => {
  console.log('Route path changed to:', newPath);
  activeTab.value = getActiveTabFromPath(newPath);
  console.log('activeTab updated to:', activeTab.value);
});
</script>

<style scoped>
.sidebar {
  /* height: 100vh; */
  min-height: 200px;
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
  outline: #ACC572 solid 3px;
  border-radius: 20ch;
  color: #ACC572;
}

.sidebar-link i {
  margin-right: 10px;
  font-size: 1.2rem;
}
</style>