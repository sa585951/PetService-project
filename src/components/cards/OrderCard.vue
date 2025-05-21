<template>
  <div class="card mb-4">
    <div class="card-header d-flex justify-content-between align-items-center">
      <span>訂單 #100{{ order.fId }} • {{ order.fOrderType }}</span>
      <span class="badge" :class="statusClass">{{ order.fOrderStatus }}</span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-3">
          <span class="fw-bold me-3">總金額: NT${{ order.fTotalAmount }}</span>
        </div>
        <div class="col-md-4">
           <small class="text-muted">建立時間: {{ formatDate(order.fCreatedAt) }}</small>
        </div>
        <div class="col-md-4">
           <small class="text-muted">更新時間: {{ formatDate(order.fUpdatedAt) }}</small>
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
  router.push({
    name: 'OrderDetail',
    params: { id: order.fId },
    query: { type: order.fOrderType }
  });

  console.log('前望訂單頁面',{
        id:order.fId,
        type:order.fOrderType
    })
};

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
.list-group-item {
  border: none;               /* 只有下方做分隔線 */
  border-bottom: 1px solid #eee;
  border-radius: 0;
}
.list-group-item:last-child {
  border-bottom: none;
}
.list-group-item:hover {
  background-color: #f8f9fa;
}

</style>
