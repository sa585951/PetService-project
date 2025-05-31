<template>
  <div class="order-container">
    <div v-if="isLoading" class="loading">載入中...</div>

    <div v-else-if="orderDetail">
      <div class="order-header mb-3">
        <h4 class="fw-bold mb-2">訂單編號：<span class="text-muted">#100{{ orderDetail.orderId }}</span></h4>
        <div class="text-muted">建立時間：{{ formatDate(orderDetail.createdAt) }}</div>
        <div class="status-badge my-2" :class="statusClass">{{ orderDetail.status }}</div>
        <div class="fs-5 fw-bold">總金額：NT${{ orderDetail.totalAmount }}</div>
        <div v-if="orderDetail.status === '未付款'" class="mt-3 d-flex gap-2">
          <button @click="handlePay" class="btn btn-outline-success">付款</button>
          <button @click="handleCancle" class="btn btn-outline-danger">取消訂單</button>
        </div>
      </div>

      <hr />
      <h5 class="fw-bold mb-3">訂單明細</h5>

      <!-- 散步訂單 -->
      <ul v-if="normalizedType === 'walk'" class="detail-list">
        <li v-for="(item, index) in orderDetail.items" :key="index" class="detail-card">
          <img :src="`${imgUrl}${item.employeePhoto}`" alt="員工照片" class="item-image" />
          <div class="detail-info">
            <p><strong>遛狗員：</strong>{{ item.employeeName }}</p>
            <p><strong>開始：</strong>{{ formatDate(item.walkStart) }}</p>
            <p><strong>結束：</strong>{{ formatDate(item.walkEnd) }}</p>
            <p><strong>數量：</strong>{{ item.amount }}</p>
            <p><strong>單價：</strong>NT${{ item.servicePrice }}</p>
            <p><strong>小計：</strong>NT${{ item.totalPrice }}</p>
            <p><strong>備註：</strong>{{ item.note }}</p>
          </div>
        </li>
      </ul>

      <!-- 住宿訂單 -->
      <ul v-else-if="normalizedType === 'hotel'" class="detail-list">
        <li v-for="(item, index) in orderDetail.items" :key="index" class="detail-card">
          <img :src="`/Hotel/${item.hotelPhoto}`" alt="飯店照片" class="item-image" />
          <div class="detail-info">
            <p><strong>飯店名稱：</strong>{{ item.hotelName }}</p>
            <p><strong>房型：</strong>{{ item.roomName }}</p>
            <p><strong>入住：</strong>{{ formatDate(item.checkIn) }}</p>
            <p><strong>退房：</strong>{{ formatDate(item.checkOut) }}</p>
            <p><strong>天數：</strong>{{ item.nights }} 晚</p>
            <p><strong>房間數量：</strong>{{ item.qty }}</p>
            <p><strong>每間房價：</strong>NT${{ item.pricePerRoom }}</p>
            <p><strong>小計：</strong>NT${{ item.totalPrice }}</p>
            <p><strong>備註：</strong>{{ item.note }}</p>
          </div>
        </li>
      </ul>

      <div class="text-center mt-4">
        <button @click="router.push('/orders')" class="btn btn-warning">回到訂單</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/authStore';
import router from '@/router';

const imgUrl = import.meta.env.VITE_API_IMAGE_URL;

const props = defineProps({
  orderId: [Number, String],
  orderType: String,
  orderData: Object
});

const authStore = useAuthStore();
const orderDetail = ref(props.orderData || null);
const isLoading = ref(!props.orderData);

const normalizedType = computed(() => {
  const t = (props.orderType || '').toString().toLowerCase();
  return t === 'hotel' || t === '住宿' ? 'hotel' : 'walk';
});

const formatDate = (val) => {
  return new Date(val).toLocaleString();
};

const statusClass = computed(() => {
  switch (orderDetail.value?.status) {
    case '未付款': return 'badge bg-warning text-dark';
    case '已付款': return 'badge bg-success';
    case '已取消': return 'badge bg-secondary';
    default: return 'badge bg-light text-dark';
  }
});

function handlePay() {
  router.push({ path: '/payment-gateway', query: { orderId: props.orderId } });
}

async function handleCancle() {
  const { isConfirmed } = await Swal.fire({
    title: '確定要取消這筆訂單嗎?',
    text: '取消後將無法恢復',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '是，我要取消',
    cancelButtonText: '再想想'
  });

  if (!isConfirmed) return;

  try {
    await axios.patch(`/api/order/${props.orderId}/cancel`, null, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    await Swal.fire('已取消', '訂單已成功取消', 'success');
    router.push('/orders');
  } catch (e) {
    console.error(e);
    Swal.fire('失敗', '取消訂單失敗，請稍後再試', 'error');
  }
}

onMounted(async () => {
  if (!orderDetail.value && props.orderId) {
    try {
      const url = `/api/order/${normalizedType.value}/${props.orderId}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      orderDetail.value = res.data;
    } catch (error) {
      console.error('載入訂單失敗', error);
      Swal.fire({ icon: 'error', title: '查無訂單資料', text: '請稍後再試' });
    } finally {
      isLoading.value = false;
    }
  } else {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.order-container {
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.loading {
  font-size: 18px;
  text-align: center;
  padding: 40px;
}
.order-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}
.detail-list {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}
.detail-card {
  display: flex;
  background-color: #fdfdfd;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 15px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
.item-image {
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 20px;
}
.detail-info p {
  margin: 4px 0;
}
.status-badge {
  display: inline-block;
  font-size: 0.875rem;
  padding: 5px 10px;
  border-radius: 20px;
  margin: 5px 0;
}
</style>
