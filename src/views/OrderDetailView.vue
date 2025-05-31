<template>
    <div class="container">
        <div class="page-header d-flex justify-content-between align-items-center mb-4">
            <h3 class="page-title">訂單詳細資訊</h3> 
        </div>
        <OrderDetail :order-id="orderId" :order-type="orderType" />
    </div>
</template>

<script setup>
import OrderDetail from '@/components/OrderDetail.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const orderId = route.params.id;
const orderType = route.query.type;
</script>

<style scoped>
.page-header {
  padding: 16px 24px;
  background-color: #f9f9f9;
  border-left: 6px solid #ACC572;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: #5a3e00;
}
</style>