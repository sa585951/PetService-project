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
            <div v-else-if="!isWalkMode && cartStore.hotelcartitems.length === 0">
                <!-- <p>目前沒有選擇服務,請先回購物車選擇服務</p> -->
            </div>
             <!-- 左側:明細 -->
            <div v-else class="payment-left">
                <div v-if="isWalkMode">
                  <!-- 散步服務明細 -->
                  <div class="order-item" v-for="item in cartStore.walkcartitems" :key="item.employeeServiceId + item.walkStart">
                    <div class="item-title">{{ item.name }}</div>
                    <div class="item-detail">時間：{{ formatDateTime(item.walkStart) }}</div>
                    <div class="item-detail">數量：{{ item.quantity }} 隻</div>
                    <div class="item-detail">單價：NT${{ item.price }}</div>
                    <div class="item-subtotal">小計：NT${{ item.price * item.quantity }}</div>
                  </div>
                 </div>
                 <div v-else>
                  <!-- 住宿服務明細 -->
                  <div class="order-item" v-for="item in cartStore.hotelcartitems" :key="getHotelItemKey(item)">
                    <div class="item-title">{{ item.hotelName }}</div>
                    <div class="item-detail">房型：{{item.backenedItem.roomDetailId}}</div>
                    <div class="item-detail">入住：{{ formatDateTime(item.backenedItem.checkIn) }}</div>
                    <div class="item-detail">退房：{{ formatDateTime(item.backenedItem.checkOut) }}</div>
                    <div class="item-detail">數量：{{ item.backenedItem.roomQty }} 間</div>
                    <div class="item-detail">單價：NT${{ item.pricePerRoom }}</div>
                    <div class="item-subtotal">小計：NT${{ item.pricePerRoom * item.backenedItem.roomQty }}</div>
                  </div>
                 </div>
            </div>
        </div>
    </div>
                 <!-- 右側:卡片總計與送出按鈕 -->
                  <div class="col-md-4">
                <div class="payment-right">
                    <div class="card-box">
                    <div class="summary-line">共 {{ isWalkMode ? cartStore.cartTotalItems : cartStore.cartTotalItems }} 件服務</div>
                    <div class="summary-total">總金額：NT${{ isWalkMode ? cartStore.cartTotalPrice : cartStore.cartTotalPrice }}</div>
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
    import { useRoute, useRouter } from 'vue-router';
    import Swal from 'sweetalert2';
    import { ref,onMounted } from 'vue';

    const route = useRoute();
    const cartStore = useCartStore();
    const authStore = useAuthStore();
    const router = useRouter();

    const isSubmitting = ref(false);

    const getHotelItemKey = (item) =>
    `${item.backenedItem.hotelId}-${item.backenedItem.roomDetailId}-${item.backenedItem.checkIn}-${item.backenedItem.checkOut}`

    const isWalkMode = computed (() =>
     route.query.type === 'walk');

    const handleSubmitOrder = async() =>{
      const isEmpty = isWalkMode.value
      ? cartStore.walkcartitems.length ===0
      : cartStore.hotelcartitems.length ===0;

      if (isEmpty) {
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
    const orderId = isWalkMode.value
      ? await cartStore.submitWalkOrder()
      : await cartStore.submitHotelOrder()

    Swal.close(); // ✅ 關閉 loading

    // 導向成功頁面
    router.push(`/orders/success/${orderId}?type=${isWalkMode.value ? 'Walk' : 'Hotel'}`);
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