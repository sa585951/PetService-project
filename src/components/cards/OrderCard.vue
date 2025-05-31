<template>
  <div class="card mb-4">
    <div class="card-header d-flex justify-content-between align-items-center">
      <span>訂單 #100{{ order.id }} • {{ order.orderType }}</span>
      <span class="badge" :class="statusClass">{{ order.orderStatus }}</span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-3">
          <span class="fw-bold me-3">總金額: NT${{ order.totalAmount }}</span>
        </div>
        <div class="col-md-4">
           <small class="text-muted">建立時間: {{ formatDate(order.createdAt) }}</small>
        </div>
        <div class="col-md-4">
           <small class="text-muted">更新時間: {{ formatDate(order.updatedAt) }}</small>
        </div>
      </div>
      <div class="text-end">
        <button class="btn btn-sm btn-detail" @click="viewDetail">
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
    params: { id: order.id },
    query: { type: order.orderTypeCode }
  });

  console.log('前望訂單頁面',{
        id:order.id,
        type:order.orderTypeCode
    })
};

// 根據狀態套色，可自行調整
const statusClass = computed(() => {
  switch (order.orderStatus) {
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
  border-radius: 0.5rem;
  font-weight: bold;
  font-size: 0.9rem;
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
.card{
  transition: transform 0.2s ease, box-shadow 0.2s ease;  
}
.card:hover {
  transform: scale(1.01);
  box-shadow: 0px 0px 10px 2px rgb(231, 203, 167);
  background-color: #fcfcfc;
}
.btn-detail{
  background-color: #879a5a;
  color: white;
  font-weight: bold; 
}
</style>
