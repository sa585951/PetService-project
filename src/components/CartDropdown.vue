<template>
  <div class="cart-dropdown" @mouseenter="show = true" @mouseleave="show = false">
    <div class="cart-icon">
      <RouterLink to="/cart" class="nav-link">
        <i class="fa fa-shopping-cart"></i> 購物車
        <span v-if="cartStore.cartTotalItems > 0" class="badge bg-danger ms-1">{{ cartStore.cartTotalItems }}</span>
      </RouterLink>
    </div>

    <div class="cart-menu" v-show="show">
      <p v-if="cartStore.walkcartitems.length === 0">購物車是空的</p>
      <div v-else>
        <div class="cart-item" v-for="item in cartStore.walkcartitems" :key="item.employeeServiceId + item.walkStart">
          <img :src="item.imageUrl" class="item-img" />
          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-date">{{ formatDateTime(item.walkStart) }}</div>
            <div class="item-qty">隻 x {{ item.quantity }}</div>
            <div class="item-price">NT${{ item.price }}</div>
          </div>
        </div>

        <div class="cart-total mt-2 mb-2">
          共 {{ cartStore.cartTotalItems }} 件商品 合計：
          <strong>NT${{ cartStore.cartTotalPrice }}</strong>
        </div>

        <RouterLink to="/cart">
          <button class="btn btn-primary w-100">查看購物車</button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
    
<script setup >
    import { ref } from 'vue';
    import { useCartStore } from '@/stores/cart';

    const cartStore = useCartStore();
    const show = ref(false);

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
  cursor: pointer;
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
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
.item-date, .item-qty, .item-price {
  font-size: 13px;
  color: #555;
}
.cart-total {
  font-size: 14px;
  text-align: right;
}
</style>
