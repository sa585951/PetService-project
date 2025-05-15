<template>
  <div class="card mb-4">
    <div class="card-header d-flex justify-content-between align-items-center">
      <span>訂單 #{{ order.fId }} • {{ order.fOrderType }}</span>
      <span class="badge" :class="statusClass">{{ order.fOrderStatus }}</span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-3">
          <p><strong>總金額：</strong>{{ order.fTotalAmount }}</p>
        </div>
        <div class="col-md-4">
          <p><strong>建立時間：</strong>{{ formatDate(order.fCreatedAt) }}</p>
        </div>
        <div class="col-md-4">
          <p><strong>更新時間：</strong>{{ formatDate(order.fUpdatedAt) }}</p>
        </div>
      </div>
      <div class="text-end">
        <button class="btn btn-sm btn-primary" @click="viewDetail">
          查看詳細
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs' // 可選：用 dayjs 格式化日期

const{order} = defineProps({
  order: {
    type: Object,
    required: true
  }
})
const router = useRouter()

const viewDetail = () => {
  router.push(`/orders/${order.fId}`)
}

// 根據狀態套色，可自行調整
const statusClass = computed(() => {
  switch (order.fOrderStatus) {
    case '未付款':
      return 'bg-warning text-dark'
    case '已付款':
      return 'bg-success text-white'
    case '已取消':
      return 'bg-secondary text-white'
    default:
      return 'bg-light text-dark'
  }
})

const formatDate = val => {
  return dayjs(val).format('YYYY-MM-DD HH:mm')
}
</script>

<style scoped>
.badge {
  padding: 0.5em 0.75em;
  border-radius: 0.25rem;
}
</style>
