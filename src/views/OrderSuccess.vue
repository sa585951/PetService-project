<template>
        <div class="container">
            <h3>訂單完成</h3>
            <Transition name="fade">
            <OrderDetail 
            :order-id="orderId"  :order-data="orderDetail" :order-type="orderType" v-if="!isLoading && orderDetail" />
            </Transition>
        </div>
</template>
    
<script setup >
    import { onMounted,ref,computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import axios from 'axios';
    import Swal from 'sweetalert2';
    import { useAuthStore } from '@/stores/authStore';
    import OrderDetail from '@/components/OrderDetail.vue';

    const authStore = useAuthStore();
    const route = useRoute();
    const router = useRouter();

    const orderId = route.params.id;
    const orderType = computed(() => route.query.type?.toString().toLowerCase() || 'walk'); // 預設為 Walk

    const orderDetail = ref(null);
    const isLoading = ref(true);

    onMounted(async () => {
      Swal.fire({
      title: '處理中',
      text: '正在送出訂單，請稍後...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    });
      try {
     
      
        const res = await axios.get(`/api/order/${orderType.value}/${orderId}`,{
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