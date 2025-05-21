<template>
  <div class="container">
    <div style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
      <ol class="breadcrumb breadcrumb-black">
        <li class="breadcrumb-item active">購物車</li>
        <li class="breadcrumb-item">填寫資料以及付款</li>
        <li class="breadcrumb-item">訂購完成</li>
      </ol>
    </div>
    
    <div class="shopping-cart">
    <h3>購物車</h3>
    <hr>
    <div class="cart-item" v-for="item in cartStore.walkcartitems" :key="item.employeeServiceId + item.walkStart">
        <input type="checkbox" class="checkbox" :value="getItemKey(item)" v-model="selectedItems">
        <img :src="item.imageUrl" alt="">
      <div class="item-info">
        <div class="item-name">{{ item.name }}</div>
        <div class="item-walktime">{{item.walkStart}}</div>
        <div class="item-quantity">
        隻 x
        <input type="number" :value="item.quantity" @input="(e) =>updateQuantity(item, e)" min="1" max="5" />
      </div>
      </div>
      <div class="item-price">NT${{ item.price }}</div>
      <div class="item-actions">
        <button class="remove-btn" @click="removeItem(item)">🗑</button>
      </div>
    </div>

 
    <div class="cart-summary" ref="cart">
      <div class="select-all">
        <input type="checkbox" v-model="isAllSelected" @change="toggleSelectAll">
        <label>全選 ({{ selectedItems.length }})</label>
        <span>|</span>
        <button @click="removeSelectedItems" :disabled="selectedItems.length === 0">刪除已選項目</button>
      </div>
        <div class="checkout">
        <div class="cart-footer">
          <div>
        <span class="text-grey-light text-xs">{{ cartStore.cartTotalItems }} 件服務合計</span>
        <span class="text-dark">
          <div>NT${{ cartStore.cartTotalPrice }}</div>
        </span>
           </div>       
        <RouterLink to="/payment"><button>前往結帳</button></RouterLink>
      </div>
      </div>
    </div>
  </div>
  </div>
</template>
    
<script setup >
    import { useCartStore } from '@/stores/cart';
    import{ref,onMounted, computed} from 'vue';
    import { useAuthStore } from '@/stores/authStore';
    import Swal from 'sweetalert2';
    import { useRouter } from 'vue-router';

    const cartStore = useCartStore();
    const authStore = useAuthStore();
    const router = useRouter();

    const getItemKey = (item) =>`${item.employeeServiceId}-${item.walkStart}`;

    const selectedItems = ref(cartStore.walkcartitems .map(getItemKey))
    const isAllSelected = ref(false);

    const toggleSelectAll =() =>{
        if(isAllSelected.value){
            selectedItems.value = []
        }else{
            selectedItems.value = cartStore.walkcartitems.map(getItemKey)
        }
        isAllSelected.value = selectedItems.value.length === cartStore.walkcartitems.length;
    };

    const removeItem = (item) =>{
        cartStore.removeItemByKey(getItemKey(item));
        selectedItems.value = selectedItems.value.filter(key => key !== getItemKey(item));
        isAllSelected.value = selectedItems.value.length === cartStore.walkcartitems.length;
    };

    const removeSelectedItems = () => {
        selectedItems.value.forEach(key => {
          cartStore.removeItemByKey(key);
        });
        selectedItems.value = [];
        isAllSelected.value = false;
    };

    const updateQuantity = (item,event) => {
        const quantity = parseInt(event.target.value)
        if(!isNaN(quantity) && quantity > 0){
            cartStore.updateItemQuantity(item.employeeServiceId, item.walkStart , quantity);
        }
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
        isAllSelected.value = selectedItems.value.length === cartStore.walkcartitems.length;
    });
</script>
    
<style scoped>
.container{
  padding: 0px 15px;
  width: 100%;
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
.shopping-cart {
  padding: 32px 20px 0px;
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
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.select-checkbox {
  margin-right: 15px;
}

.item-image {
  width: 80px;
  height: 80px;
  margin-right: 15px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}

.item-info {
  flex-grow: 1;
}

.item-name {
  font-weight: bold;
  margin-bottom: 5px;
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
  margin-left: 15px;
  width: 80px;
  text-align: right;
}

.item-actions {
  margin-left: 15px;
}

.item-actions button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
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
  left: 0; /* 修改為 0，使其佔滿底部寬度 */
  margin: 0;
  padding: 15px 20px;
  position: sticky;
  transform: none; /* 移除 transform，因為我們直接控制 left 和 bottom */
  width: 100%;
  z-index: 999; /* 確保總攬在其他內容之上 */
  box-shadow: 0px -2px 5px rgba(0, 0, 0, 0.1); /* 可選：添加底部陰影，使其更突出 */
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

.breadcrumb{
    background: transparent;
    font-size: 1.2rem;
    margin: 0;
    overflow-x: hidden;
    padding: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>