<template>
        <div class="container">
            <h3>訂單完成</h3>
            <Transition name="fade">
            <OrderDetail :order-data="orderDetail" :order-type="orderType" v-if="!isLoading && orderDetail" />
            </Transition>
        </div>
</template>
    
<script setup >
    import { onMounted,ref,computed } from 'vue';
    import { useRoute } from 'vue-router';
    import axios from 'axios';
    import Swal from 'sweetalert2';
    import { useAuthStore } from '@/stores/authStore';
    import OrderDetail from '@/components/OrderDetail.vue';

    const authStore = useAuthStore();
    const route = useRoute();
    const orderId = route.params.id;
    const orderType = computed(() => route.query.type || 'Walk'); // 預設為 Walk

    const orderDetail = ref(null);
    const isLoading = ref(true);

    function normalizeType(type) {
        if (type === '散步' || type === 'Walk') return 'Walk';
        if (type === '住宿' || type === 'Hotel') return 'Hotel';
     return '';
    }
    onMounted(async () => {
  try {
     Swal.fire({
      title: '處理中',
      text: '正在送出訂單，請稍後...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    });

    const normalizedType = normalizeType(orderType.value).toLowerCase();
    const apiUrl = `/api/order/${normalizedType}/${orderId}`
    const res = await axios.get(apiUrl,{
        headers: {
            Authorization: `Bearer ${authStore.token}`
        }
    });
    orderDetail.value = res.data;

    Swal.close();

    Swal.fire({
      icon: 'success',
      title: '訂單送出成功!',
      text: `您的訂單編號為 ${res.data.orderId}`,
      timer: 3000,
      showConfirmButton: false
    });
  } catch (error) {
    console.error('載入訂單失敗', error);
    Swal.fire({
      icon: 'error',
      title: '查無訂單資料',
      text: '請稍後再試'
    });
  } finally {
    isLoading.value = false;
  }
});
</script>
    
<style scoped>
.container {
  padding: 20px;
}
ul {
  padding-left: 1rem;
}
li {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>