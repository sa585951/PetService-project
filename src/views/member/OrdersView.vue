<template>
  <div class="container-fluid">
    <div class="row">
      <MemberSidebar />
      <div class="col-md-10 content-area py-4">
        <div class="card bg-light">
          <div class="card-header">
            <h2>訂單管理
              <span v-if="lastSearch"> (搜尋:「{{ lastSearch }}」)</span>
            </h2>
            <div class="row w-100">
              <div class="col-md-10">
                <input v-model="searchQuery" type="text" class="form-control"
                  placeholder="輸入訂單編號（#100123）或日期（2024/05/30）" />
              </div>
              <div class="col-md-2">
                <button class="btn btn-primary w-100" @click="searchOrders">
                  搜尋
                </button>
              </div>
            </div>
            <div class="btn-group mb-3">
              <button class="btn btn-outline-primary" @click="setFilterType('all')">全部</button>
              <button class="btn btn-outline-primary" @click="setFilterType('walk')">散步</button>
              <button class="btn btn-outline-primary" @click="setFilterType('hotel')">住宿</button>
            </div>
          </div>
          <!-- Tab 標籤 -->
          <ul class="nav nav-tabs mt-3">
            <li class="nav-item">
              <button class="nav-link" :class="{ active: activeTab === 'all' }" @click="changeTab('all')">
                全部
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" :class="{ active: activeTab === '未付款' }" @click="changeTab('未付款')">
                未付款
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" :class="{ active: activeTab === '已付款' }" @click="changeTab('已付款')">
                已付款
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" :class="{ active: activeTab === '已取消' }" @click="changeTab('已取消')">
                已取消
              </button>
            </li>
          </ul>
          <!-- 卡片列表 -->
          <div class="list-group list-group-flush">
            <OrderCard v-for="o in filterOrders" :key="o.id" :order="o"
              class="list-group-item list-group-item-action p-3" />
            <div v-if="orderStore.orders.length === 0" class="list-group-item text-center text-muted">
              目前沒有訂單
            </div>
          </div>
          <!-- 分頁 -->
          <nav aria-label="Page navigation" class="mt-3">
            <ul class="pagination justify-content-center mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="changePage(currentPage - 1)">«</button>
              </li>
              <li class="page-item" v-for="page in orderStore.totalPages" :key="page"
                :class="{ active: currentPage === page }">
                <button class="page-link" @click="changePage(page)">{{ page }}</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === orderStore.totalPages }">
                <button class="page-link" @click="changePage(currentPage + 1)">»</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import MemberSidebar from '@/components/MemberSidebar.vue'
import OrderCard from '@/components/cards/OrderCard.vue'
import { useOrderStore } from '@/stores/order'
import { useAuthStore } from '@/stores/authStore'
const orderStore = useOrderStore()
const authStore = useAuthStore()
function formatDate(date) {
  return new Date(date).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const searchQuery = ref('')
const activeTab = ref('all')
const currentPage = ref(1)
const pageSize = 10
const filterType = ref('all')
const lastSearch = ref('');

const filterOrders = computed(() => {
  if (filterType.value === 'all') return orderStore.orders;
  return orderStore.orders.filter(o => o.orderTypeCode === filterType.value);
});

function loadOrders() {
  orderStore.fetchOrders({
    keyword: searchQuery.value,
    orderType: filterType.value,
    orderStatus: activeTab.value,
    sortBy: 'date_desc',
    page: currentPage.value,
    pageSize,
  })

  console.log("Fetch Params:", {
    keyword: searchQuery.value,
    orderType: filterType.value,
    orderStatus: activeTab.value,
    sortBy: 'date_desc',
    page: currentPage.value,
    pageSize,
  })
}

// 切tab重新抓資料
function changeTab(tab) {
  activeTab.value = tab
  currentPage.value = 1
  loadOrders()
}

//篩選訂單狀態
function setFilterType(type) {
  filterType.value = type
  loadOrders()
}

function isDateLike(str) {
  //偵測是否為日期格式：含 /、-、數字、月日字樣
  return /[\d]{1,4}[\/\-年月日]/.test(str);
}

function normalizeDateKeyword(str) {
  if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(str)) {
    return str; //已經是標準格式
  }
  //若使用者輸入 "05/30" 就補上當前年份
  const today = new Date();
  const year = today.getFullYear();
  if (/^\d{1,2}\/\d{1,2}$/.test(str)) {
    return `${year}/${str}`;
  }
  return str;
}

//搜尋按鈕
function searchOrders() {
  currentPage.value = 1

  let keyword = searchQuery.value.trim();
  //若使用者輸入 #100123 轉換為"123"
  if (/^#?100\d+/.test(keyword)) {
    keyword = keyword.replace(/^#?100/, '');
  }

  if (isDateLike(keyword)) {
    keyword = normalizeDateKeyword(keyword);
  }
  orderStore.fetchOrders({
    keyword,
    orderType: filterType.value,
    orderStatus: activeTab.value,
    sortBy: 'date_desc',
    page: currentPage.value,
    pageSize
  })
  lastSearch.value = keyword;
  searchQuery.value = '';
}

//換頁
function changePage(page) {
  if (page < 1 || page > orderStore.TotalPages) return
  currentPage.value = page
  loadOrders()
}


onMounted(() => {
  if (authStore.memberId) loadOrders()
})
</script>

<style scoped>
.content-area {
  overflow: auto;
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-top-left-radius: 15px !important;
}

.nav-tabs .nav-link {
  cursor: pointer;
}

.btn-outline-primary {
  border-color: #8B4513;
  color: #8B4513;
}

.btn-outline-primary:hover {
  background-color: #8B4513;
  color: white;
}

.nav-tabs .nav-link {
  color: #8B4513;
  /* 預設深棕色 */
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
}

.nav-tabs .nav-link.active {
  background-color: rgb(235, 207, 170);
  border-color: rgb(228, 187, 134);
  font-weight: bold;
}

.pagination{
  padding-bottom: 10px;
}

.page-link{
  color: #Acc572;
}
</style>
