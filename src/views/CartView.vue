<template>
  <div class="container">
    <div style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
      <ol class="breadcrumb breadcrumb-black">
        <li class="breadcrumb-item active">購物車</li>
        <li class="breadcrumb-item">確認訂單資訊</li>
        <li class="breadcrumb-item">訂單送出</li>
      </ol>
    </div>

    <div class="shopping-cart">
      <h3>購物車</h3>
      <hr>
      <!-- Walk 購物車 -->
      <div v-if="cartStore.walkcartitems.length > 0 && cartStore.hotelcartitems.length === 0">
        <div class="cart-item" v-for="item in cartStore.walkcartitems" :key="getWalkItemKey(item)">
          <input type="checkbox" class="checkbox" :value="getWalkItemKey(item)" v-model="selectedWalkItems" />
          <img :src="item.imageUrl" alt="walk" class="item-image" />
          <div class="item-info">
            <div class="item-row-inline">
              <div class="item-name">{{ item.name }}</div>
              <div>時間：{{ formatDateTime(item.walkStart) }} ~ {{ getWalkEnd(item.walkStart) }}</div>
              <div class="item-quantity">
              隻 x
              <input type="number" :value="item.quantity" @input="e => updateWalkQuantity(item, e)" min="1" max="5" />
            </div>
            </div>
          </div>
          <div class="item-price">NT${{ item.price }}</div>
          <div class="item-actions">
            <button class="remove-btn" @click="removeWalkItem(item)">🗑</button>
          </div>
        </div>

        <!-- 控制區 (Walk) -->
        <div class="select-all">
          <input type="checkbox" v-model="isAllWalkSelected" @change="toggleSelectAllWalk" />
          <label>全選 ({{ selectedWalkItems.length }})</label>
          <span>|</span>
          <button @click="removeselectedWalkItems" :disabled="selectedWalkItems.length === 0"
            class="btn btn-outline-primary">刪除已選項目</button>
        </div>
      </div>

      <!-- Hotel 購物車 -->
      <div v-else-if="cartStore.hotelcartitems.length > 0 && cartStore.walkcartitems.length === 0">
        <div class="cart-item" v-for="item in cartStore.hotelcartitems"
          :key="getHotelItemKey(item.backenedItem.roomDetailId)">
          <input type="checkbox" class="checkbox" :value="getHotelItemKey(item.backenedItem)"
            v-model="selectedHotelItems" />
          <img :src="`/Hotel/${item.hotelImage}`" alt="hotel" class="item-image" />
          <div class="item-info">
            <div class="item-row-inline">
              <div class="item-name">{{ item.hotelName }}</div>
              <div>房型：{{ item.roomName }}</div>
              <div>入住：{{ item.backenedItem.checkIn }}</div>
              <div>退房：{{ item.backenedItem.checkOut }}</div>
              <div>數量：{{ item.backenedItem.roomQty }} 間</div>
            </div>
          </div>
          <div class="item-price">NT${{ item.pricePerRoom }}</div>
          <div class="item-actions">
            <button class="remove-btn" @click="removeHotelItem(item)">🗑</button>
          </div>

        </div>

        <!-- 控制區 (Hotel) -->
        <div class="select-all">
          <input type="checkbox" v-model="isAllHotelSelected" @change="toggleSelectAllHotel" />
          <label>全選 ({{ selectedHotelItems.length }})</label>
          <span>|</span>
          <button @click="removeSelectedHotelItems" :disabled="selectedHotelItems.length === 0"
            class="btn btn-outline-primary">刪除已選項目</button>
        </div>
      </div>

      <!-- 混合狀態警告 -->
      <div v-if="cartStore.walkcartitems.length > 0 && cartStore.hotelcartitems.length > 0">
        <p class="text-danger">❗目前兩種服務同時存在，請先清空其中一項再進行結帳。</p>
        <button @click="cartStore.clearCart()">清空購物車</button>
      </div>

      <!-- 空購物車 -->
      <div v-if="cartStore.walkcartitems.length === 0 && cartStore.hotelcartitems.length === 0">
        <p class="text-muted">購物車是空的，請先選擇服務</p>
      </div>

      <!-- 結帳 -->
      <div class="cart-summary">
        <div class="cart-footer">
          <div>
            <span class="text-grey-light text-xs">{{ cartStore.cartTotalItems }} 件服務合計</span>
            <span class="text-dark">
              <div>NT${{ cartStore.cartTotalPrice }}</div>
            </span>
          </div>
          <RouterLink to="/payment">
            <BookingButton>
              前往結帳
            </BookingButton>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart';
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import BookingButton from '@/components/hotel/HotelBookingButton.vue';
import dayjs from 'dayjs';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();


function formatDateTime(val){
  return dayjs(val).format('YYYY-MM-DD HH:mm');
}

function getWalkEnd(startTime){
  return dayjs(startTime).add(1, 'hour').format('YYYY-MM-DD HH:mm');
}

const getWalkItemKey = (item) => `${item.employeeServiceId}-${item.walkStart}`;
const getHotelItemKey = (item) => `${item.hotelId}-${item.roomDetailId}-${item.checkIn}-${item.checkOut}`;

const selectedWalkItems = ref(cartStore.walkcartitems.map(getWalkItemKey))
const isAllWalkSelected = ref(false);

const selectedHotelItems = ref(cartStore.hotelcartitems.map(getHotelItemKey));
const isAllHotelSelected = ref(false);

const toggleSelectAllWalk = () => {
  if (isAllWalkSelected.value) {
    selectedWalkItems.value = []
  } else {
    selectedWalkItems.value = cartStore.walkcartitems.map(getWalkItemKey)
  }
  isAllWalkSelected.value = selectedWalkItems.value.length === cartStore.walkcartitems.length;
};

const toggleSelectAllHotel = () => {
  if (isAllHotelSelected.value) {
    selectedHotelItems.value = [];
  } else {
    selectedHotelItems.value = cartStore.hotelcartitems.map(item => getHotelItemKey(item.backenedItem));
  }
  isAllHotelSelected.value = selectedHotelItems.value.length === cartStore.hotelcartitems.length;
}

const removeWalkItem = (item) => {
  cartStore.removeWalkItemByKey(getWalkItemKey(item));
  selectedWalkItems.value = selectedWalkItems.value.filter(key => key !== getWalkItemKey(item));
  isAllWalkSelected.value = selectedWalkItems.value.length === cartStore.walkcartitems.length;
};

const removeselectedWalkItems = () => {
  selectedWalkItems.value.forEach(key => {
    cartStore.removeWalkItemByKey(key);
  });
  selectedWalkItems.value = [];
  isAllWalkSelected.value = false;
};

const updateWalkQuantity = (item, event) => {
  const quantity = parseInt(event.target.value)
  if (!isNaN(quantity) && quantity > 0) {
    cartStore.updateWalkItemQuantity(item.employeeServiceId, item.walkStart, quantity);
  }
}

const removeHotelItem = (item) => {
  const key = getHotelItemKey(item.backenedItem)
  cartStore.removeHotelItemByKey(key);
  selectedHotelItems.value = selectedHotelItems.value.filter(k => k !== key);
  isAllHotelSelected.value = selectedHotelItems.value.length === cartStore.hotelcartitems.length;
}

const removeSelectedHotelItems = () => {
  selectedHotelItems.value.forEach(k => {
    cartStore.removeHotelItemByKey(k);
  });
  selectedHotelItems.value = [];
  isAllHotelSelected.value = false;
}

onMounted(() => {
  if (!authStore.isLoggedIn) {
    Swal.fire({
      icon: 'warning',
      title: '請先登入後使用購物車功能',
      confirmButtonText: '前往登入頁'
    }).then(() => {
      router.push('/login')
    })
  };
  selectedWalkItems.value = cartStore.walkcartitems.map(item => getWalkItemKey(item));
  isAllWalkSelected.value = selectedWalkItems.value.length === cartStore.walkcartitems.length;

  selectedHotelItems.value = cartStore.hotelcartitems.map(item => getHotelItemKey(item.backenedItem));
  isAllHotelSelected.value = selectedHotelItems.value.length === cartStore.hotelcartitems.length;
});
</script>

<style scoped>
.container {
  padding: 0px;
  width: 100%;
}

ol.breadcrumb {
  padding: 20px 0px;
}

.breadcrumb-black li.active {
  color: #333;
  font-weight: 700;
}

.breadcrumb-black li {
  color: #aaa;
  font-size: 18px;
}

.shopping-cart {
  padding: 32px 20px 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 0px 0px 15px;
  background-color: white;
}

h3 {
  text-align: left;
  margin-bottom: 20px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.cart-item:last-child {
  border-bottom: none;
}

.select-checkbox {
  margin-right: 15px;
}

.item-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 15px;
  margin-left: 15px;
  border: 2px solid black;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 0.95rem;
  gap: 2px;
}

.item-row-inline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
  font-size: 1rem;
}

.item-name {
  font-weight: bold;
  color: #333;
}

.item-walktime {
  color: #777;
  font-size: 0.9em;
}

.item-quantity {
  margin-left: auto;
  margin-right: 15px;
  display: flex;
  align-items: center;
}

.item-quantity input {
  width: 50px;
  text-align: center;
  margin-left: 5px;
}

.item-price {
  font-weight: bold;
  min-width: 80px;
  text-align: right;
  color: #333;
}

.item-actions {
  margin-left: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-actions button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.remove-btn {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 1.2rem;
  cursor: pointer;
}

.cart-container {
  display: flex;
  gap: 20px;
}

.cart-left {
  flex: 2;
}

.cart-right {
  flex: 1;
  position: sticky;
  top: 100px;
}

.cart-summary {
  border: 1px solid #eee;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.cart-summary.fixed {
  background-color: #fff;
  border: 0;
  bottom: 0;
  left: 0;
  /* 修改為 0，使其佔滿底部寬度 */
  margin: 0;
  padding: 15px 20px;
  position: sticky;
  transform: none;
  /* 移除 transform，因為我們直接控制 left 和 bottom */
  width: 100%;
  z-index: 999;
  /* 確保總攬在其他內容之上 */
  box-shadow: 0px -2px 5px rgba(0, 0, 0, 0.1);
  /* 可選：添加底部陰影，使其更突出 */
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
}

.select-all {
  align-items: center;
  margin: 15px;
  align-self: flex-start;
}

.select-all label {
  margin-left: 5px;
  margin-right: 15px;
}

.select-all button {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
}

.checkout {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.checkout button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1em;
  margin-bottom: 5px;
  margin-left: 20px;
}

.breadcrumb {
  background: transparent;
  font-size: 1.2rem;
  margin: 0;
  overflow-x: hidden;
  padding: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-outline-primary {
  border-color: red;
  color: red;
  margin-left: 5px;
}

.btn-outline-primary:hover {
  background-color: red;
  color: white;
}
</style>