<template>
  <div class="cart-dropdown" @mouseenter="openDropdown" @mouseleave="closeDropdown">
    <div class="cart-icon">
      <RouterLink to="/cart" class="nav-link">
        <i class="fa fa-shopping-cart"></i> 購物車
        <span v-if="cartStore.cartTotalItems > 0" class="badge bg-danger ms-1">{{ cartStore.cartTotalItems }}</span>
      </RouterLink>
    </div>

    <div class="cart-menu" v-show="show">
      <p v-if="cartStore.walkcartitems.length === 0 && cartStore.hotelcartitems.length === 0">購物車是空的</p>
      <div v-if="cartStore.walkcartitems.length > 0 && cartStore.hotelcartitems.length === 0">
        <div class="cart-item" v-for="item in cartStore.walkcartitems" :key="item.employeeServiceId + item.walkStart">
          <img :src="item.imageUrl" class="item-img" />
          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-date">{{ formatDateTime(item.walkStart) }}</div>
            <div class="item-qty">隻 x {{ item.quantity }}</div>
            <div class="item-price">NT${{ item.price }}</div>
          </div>
        </div>
      </div>

      <!-- 住宿服務 -->
      <div v-else-if="cartStore.hotelcartitems.length > 0 && cartStore.walkcartitems.length === 0">
        <div class="cart-item" v-for="item in cartStore.hotelcartitems"
          :key="item.backenedItem.hotelId + item.backenedItem.checkIn">
          <img :src="`/Hotel/${item.hotelImage}`" class="item-img" />
          <div class="item-info">
            <div class="item-name">{{ item.hotelName }}</div>
            <div class="item-date">入住：{{ item.backenedItem.checkIn }}<br>退房：{{ item.backenedItem.checkOut }}</div>
            <div class="item-qty">房間數 x {{ item.backenedItem.roomQty }}</div>
            <div class="item-price">NT${{ item.pricePerRoom }}</div>
          </div>
        </div>
      </div>

      <div class="cart-total mt-2 mb-2">
        共 {{ cartStore.cartTotalItems }} 件商品 合計：
        <strong>NT${{ cartStore.cartTotalPrice }}</strong>
      </div>

      <RouterLink to="/cart">
        <button class="btn btn-checkCart w-100">查看購物車</button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();
const show = ref(false);
let hideTimer = null

function openDropdown() {
  clearTimeout(hideTimer)
  show.value = true
}

function closeDropdown() {
  hideTimer = setTimeout(() => {
    show.value = false
  }, 200) // 延遲200毫秒再關閉
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
</script>

<style scoped>
.cart-dropdown {
  position: relative;
  margin-left: 20px;
}

.cart-icon {
  pointer-events: auto;
}

.cart-menu {
  position: absolute;
  top: 120%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  padding: 10px;
  width: 320px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  pointer-events: auto;
}

.cart-item {
  display: flex;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.item-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 10px;
}

.item-info {
  flex-grow: 1;
  font-size: 14px;
}

.item-name {
  font-weight: bold;
}

.item-date,
.item-qty,
.item-price {
  font-size: 13px;
  color: #555;
}

.cart-total {
  font-size: 14px;
  text-align: right;
}

.btn-checkCart {
  background-color: #Acc572;
  color: white;
}

.btn-checkCart:hover {
  background-color: #7a8c51;
  color: white;
}
</style>
