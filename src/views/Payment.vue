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
          <!-- 左側:明細 -->
          <div v-if="!hasWalkItems && !hasHotelItems">
            <p>目前沒有選擇服務,請先回購物車選擇服務</p>
          </div>
          <div v-else-if="hasWalkItems" class="payment-left">
            <!-- 散步服務明細 -->
            <div class="order-item" v-for="item in cartStore.walkcartitems"
              :key="item.employeeServiceId + item.walkStart">
              <div class="d-flex align-items-center">
                <img :src="item.imageUrl" alt="員工照片" class="item-image me-3" />
                <div>
                  <div class="item-title mb-1">{{ item.name }}</div>
                  <div class="text-muted small">時間：{{ formatDateTime(item.walkStart) }}</div>
                  <div class="text-muted small">數量：{{ item.quantity }} 隻</div>
                </div>
              </div>
              <div class="text-end fw-bold">
                <div>NT${{ item.price }}</div>
                <div class="small text-muted">小計：NT${{ item.price * item.quantity }}</div>
              </div>
            </div>
          </div>
          <div v-else-if="hasHotelItems" class="payment-left">
            <!-- 住宿服務明細 -->
            <div class="order-item" v-for="item in cartStore.hotelcartitems" :key="getHotelItemKey(item)">
              <div class="d-flex align-items-center">
                <img :src="`/Hotel/${item.hotelImage}`" alt="飯店照片" class="item-image me-3" />
                <div>
                  <div class="item-title mb-1">{{ item.hotelName }}</div>
                  <div class="text-muted small">房型：{{ item.roomName }}</div>
                  <div class="text-muted small">入住：{{ formatDateTime(item.backenedItem.checkIn) }}</div>
                  <div class="text-muted small">退房：{{ formatDateTime(item.backenedItem.checkOut) }}</div>
                  <div class="text-muted small">天數：{{ getNights(item) }} 晚，數量：{{ item.backenedItem.roomQty }} 間</div>
                </div>
              </div>
              <div class="text-end fw-bold">
                <div>NT${{ item.pricePerRoom }}</div>
                <div class="small text-muted">
                  小計：NT${{ getNights(item) * item.pricePerRoom * item.backenedItem.roomQty }}
                </div>
              </div>
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

<script setup>
import { useCartStore, getNights } from '@/stores/cart';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { ref, onMounted, computed } from 'vue';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();
const isSubmitting = ref(false);

const hasWalkItems = computed(() => cartStore.walkcartitems.length > 0);
const hasHotelItems = computed(() => cartStore.hotelcartitems.length > 0);

function getHotelItemKey(item) {
  return `${item.backenedItem.hotelId}-${item.backenedItem.roomDetailId}-${item.backenedItem.checkIn}-${item.backenedItem.checkOut}`
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


async function handleSubmitOrder() {
  if (!hasWalkItems.value && !hasHotelItems.value) {
    return alert('購物車是空的，請先選擇服務');
  }

  const isWalk = hasWalkItems.value;

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
    let orderId
    if (isWalk) {
      orderId = await cartStore.submitWalkOrder()
    } else {
      orderId = await cartStore.submitHotelOrder()
    }

    Swal.close(); // 關閉 loading
    await Swal.fire({
      icon: 'success',
      title: '訂單成立成功',
      text: '已寄送訂單確認信至您的信箱，請查收📧！'
    });
    // 導向成功頁面
    const type = isWalk ? 'walk' : 'hotel'
    router.push({
      path: `/orders/success/${orderId}`,
      query: { type }
    });
    ;
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


onMounted(() => {
  if (!authStore.isLoggedIn) {
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
  padding: 0px, 15px;
}

ol.breadcrumb {
  padding: 20px 0px;
  margin-bottom: 0%;
}

.breadcrumb-black li.active {
  color: #333;
  font-weight: 700;
}

.breadcrumb-black li {
  color: #aaa;
  font-size: 18px;
}

.payment-box {
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
  top: 100px;
  /* 滾動時固定在視窗 */
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
  margin-bottom: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.col-md-8,
.col-md-4 {
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
  background-color: #Acc572;
  color: white;
  font-size: 16px;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-submit:hover {
  background-color: #7a8c51;
}

.item-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 15px;
}
</style>