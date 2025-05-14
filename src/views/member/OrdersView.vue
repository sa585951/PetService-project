<template>
  <div class="container-fluid">
    <div class="row">
        <MemberSidebar />
      <div class="col-md-10 content-area py-4">
        <div class="card bg-light">
          <div class="card-header">
            <h2>訂單管理</h2>
            <div class="row w-100">
              <div class="col-md-10">
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control"
                  placeholder="搜尋訂單編號或日期"
                />
              </div>
              <div class="col-md-2">
                <button class="btn btn-primary w-100" @click="searchOrders">
                  搜尋
                </button>
              </div>
            </div>
          </div>

          <!-- Tab 標籤 -->
          <ul class="nav nav-tabs mt-3" role="tablist">
             <li class="nav-item">
              <button
                class="nav-link"
                :class="{ active: activeTab === 'all' }"
                @click="activeTab = 'all'"
              >
                全部訂單
              </button>
            </li>
            <li class="nav-item">
              <button
                class="nav-link"
                :class="{ active: activeTab === 'unpaid' }"
                @click="activeTab = 'unpaid'"
              >
                未付款
              </button>
            </li>
            <li class="nav-item">
              <button
                class="nav-link"
                :class="{ active: activeTab === 'paid' }"
                @click="activeTab = 'paid'"
              >
                已付款
              </button>
            </li>
            <li class="nav-item">
              <button
                class="nav-link"
                :class="{ active: activeTab === 'cancelled' }"
                @click="activeTab = 'cancelled'"
              >
                已取消
              </button>
            </li>
          </ul>
        </div>

        <!-- 卡片列表 -->
        <div class="mt-3">
          <!-- 所有訂單 -->
          <div v-if="activeTab === 'all'">
            <OrderCard
              v-for="o in filteredAll"
              :key="o.fId"
              :order="o"
            />
            <p v-if="filteredAll.length === 0" class="text-center my-4">
              目前沒有任何訂單
            </p>
          </div>
          <!-- 未付款 -->
          <div v-if="activeTab === 'unpaid'">
            <OrderCard
              v-for="o in filteredUnpaid"
              :key="o.fId"
              :order="o"
            />
            <p v-if="filteredUnpaid.length === 0" class="text-center my-4">
              目前沒有未付款訂單
            </p>
          </div>

          <!-- 已付款 -->
          <div v-if="activeTab === 'paid'">
            <OrderCard
              v-for="o in filteredPaid"
              :key="o.fId"
              :order="o"
            />
            <p v-if="filteredPaid.length === 0" class="text-center my-4">
              目前沒有已付款訂單
            </p>
          </div>

          <!-- 已取消 -->
          <div v-if="activeTab === 'cancelled'">
            <OrderCard
              v-for="o in filteredCancelled"
              :key="o.fId"
              :order="o"
            />
            <p v-if="filteredCancelled.length === 0" class="text-center my-4">
              目前沒有已取消訂單
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MemberSidebar from '@/components/MemberSidebar.vue'
import OrderCard from '@/components/OrderCard.vue' // 下方範例元件
import { useOrderStore } from '@/stores/order'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const searchQuery = ref('')
const activeTab = ref('unpaid')

const orderStore = useOrderStore()
const authStore = useAuthStore()

// 三種狀態資料
const unpaidOrders = computed(() =>
  orderStore.filterByStatus('未付款')
)
const paidOrders = computed(() =>
  orderStore.filterByStatus('已付款')
)
const cancelledOrders = computed(() =>
  orderStore.filterByStatus('已取消')
)
// 全部訂單
const allorders =computed(()=> orderStore.orders)

// 搜尋過濾
const filteredUnpaid = computed(() =>
  unpaidOrders.value.filter(
    o =>
      String(o.fId).includes(searchQuery.value) ||
      o.fCreatedAt.includes(searchQuery.value)
  )
)
const filteredPaid = computed(() =>
  paidOrders.value.filter(
    o =>
      String(o.fId).includes(searchQuery.value) ||
      o.fCreatedAt.includes(searchQuery.value)
  )
)
const filteredCancelled = computed(() =>
  cancelledOrders.value.filter(
    o =>
      String(o.fId).includes(searchQuery.value) ||
      o.fCreatedAt.includes(searchQuery.value)
  )
)
const filteredAll = computed(() =>
    allorders.value.filter(o=>
        String(o.fId).includes(searchQuery.value)||
        o.fCreated_at.includes(searchQuery.value)
    )
)
const searchOrders = () => {
  // 如果你想每次搜尋時重抓資料，可放在這裡：
  // orderStore.fetchByMember(authStore.userId)
}

onMounted(() => {
  if (authStore.memberId) {
    orderStore.fetchByMember(authStore.memberId)
  }
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
}
.nav-tabs .nav-link {
  cursor: pointer;
}
</style>
