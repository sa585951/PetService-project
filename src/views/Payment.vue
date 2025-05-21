<template>
    <div class="container">
        <div class="row">
            <div class="col-md-8">
            <div style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
                <ol class="breadcrumb breadcrumb-black">
                    <li class="breadcrumb-item">購物車</li>
                    <li class="breadcrumb-item active">確認訂單資訊</li>
                    <li class="breadcrumb-item">訂單送出</li>
                </ol>
            </div>
        <div class="payment-box">
            <h3>訂單確認</h3>
            <hr>
            <div v-if="cartStore.walkcartitems.length === 0">
                <p>目前沒有選擇服務,請先回購物車選擇服務</p>
            </div>
            <div v-else class="payment-left">
                <!-- 左側:明細 -->
                  <div class="order-item" v-for="item in cartStore.walkcartitems" :key="item.employeeServiceId + item.walkStart">
                    <div class="item-title">{{ item.name }}</div>
                    <div class="item-detail">時間：{{ formatDateTime(item.walkStart) }}</div>
                    <div class="item-detail">數量：{{ item.quantity }} 隻</div>
                    <div class="item-detail">單價：NT${{ item.price }}</div>
                    <div class="item-subtotal">小計：NT${{ item.price * item.quantity }}</div>
                 </div>
            </div>
        </div>
    </div>
                 <!-- 右側:卡片總計與送出按鈕 -->
                  <div class="col-md-4">
                <div class="payment-right">
                    <div class="card-box">
                    <div class="summary-line">共 {{ cartStore.cartTotalItems }} 件服務</div>
                    <div class="summary-total">總金額：NT${{ cartStore.cartTotalPrice }}</div>
                    <button class="btn-submit" @click="handleSubmitOrder" :disabled="isSubmitting">
                    {{ isSubmitting ? '送出中...' : '送出訂單' }}
                    </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
    
<script setup >
    import { useCartStore } from '@/stores/cart';
    import { useAuthStore } from '@/stores/authStore';
    import { useRouter } from 'vue-router';
    import Swal from 'sweetalert2';
    import { ref,onMounted } from 'vue';

    const cartStore = useCartStore();
    const authStore = useAuthStore();
    const router = useRouter();

    const isSubmitting = ref(false);

    const handleSubmitOrder = async() =>{
        if (cartStore.walkcartitems.length === 0) {
    alert('購物車是空的,請先選擇服務');
    return;
  }

  isSubmitting.value = true;

  // 顯示 loading 畫面
  Swal.fire({
    title: '處理中',
    text: '正在送出訂單，請稍後...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    const orderId = await cartStore.submitWalkOrder();

    Swal.close(); // ✅ 關閉 loading

    // 導向成功頁面
    router.push(`/orders/success/${orderId}?type=Walk`);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '送出訂單失敗',
      text: '請稍後再試',
    });
  } finally {
    isSubmitting.value = false;
  }
    }

    function formatDateTime(isoString) {
        return new Date(isoString).toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
        });
    }

    onMounted(() =>{
        if(!authStore.isLoggedIn){
            Swal.fire({
                title: '請先登入',
                text: '請先登入才能送出訂單',
                icon: 'warning',
                confirmButtonText: '前往登入頁',
            }).then(() => {
                    router.push('/login');
            });
        }
    })
    
</script>
    
<style scoped>
.container {
  padding: 20px;
}

ol.breadcrumb{
  padding: 20px 0px;
}

.breadcrumb-black li.active{
  color: #333;
  font-weight: 700;
}

.breadcrumb-black li{
  color: #aaa;
  font-size: 18px;
}

.payment-box{
  padding: 32px 20px 32px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 0px 0px 15px;
  background-color: white;
}

.payment-left {
  display: flex;
  gap: 30px;
  margin-top: 20px;
  flex: 2;
  flex-direction: column;
}

.payment-right {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  max-width: 360px;
  width: 100%;
  height: fit-content;
  position: sticky;
  top: 100px; /* 滾動時固定在視窗 */
}

.order-item {
  border-bottom: 1px solid #eee;
  padding: 15px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.col-md-8,.col-md-4{
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
}

.item-title {
  font-weight: bold;
  font-size: 18px;
}

.item-detail {
  color: #555;
  margin-top: 5px;
}

.item-subtotal {
  color: #333;
  margin-top: 10px;
  font-weight: bold;
}

.card-box {
  border: 1px solid #ddd;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  top: 163px;
  position: sticky;
}

.summary-line {
  font-size: 14px;
  color: #888;
  margin-bottom: 10px;
}

.summary-total {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.btn-submit {
  width: 100%;
  background-color: #00b5ad;
  color: white;
  font-size: 16px;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-submit:hover {
  background-color: #009c94;
}
</style>