<template>
    <div v-if="isLoading">載入中...</div>
    <div v-else-if="orderDetail">
    <p><strong>訂單編號：</strong>{{ orderDetail.orderId }}</p>
    <p><strong>建立時間：</strong>{{ formatDate(orderDetail.createdAt) }}</p>
    <p><strong>狀態：</strong>{{ orderDetail.status }}</p>
    <p><strong>總金額：</strong>NT${{ orderDetail.totalAmount }}</p>
    
    <div v-if="orderDetail.status ==='未付款'" class="order-action">
      <button @click="handlePay" class="btn btn-primary me-2">付款</button>
      <button @click="handleCancle" class="btn btn-danger">取消訂單</button>
    </div>
    
    <hr />
    <h5>訂單明細</h5>
    
    <ul v-if="normalizedType ==='walk'">
      <li v-for="(item, index) in orderDetail.items" :key="index">
        <img :src="`${imgUrl}${item.employeePhoto}`" alt="員工照片" class="item-image">
        <p>遛狗員：{{ item.employeeName }}</p>
        <p>開始時間：{{ formatDate(item.walkStart) }}</p>
        <p>結束時間：{{ formatDate(item.walkEnd) }}</p>
        <p>數量：{{ item.amount }}</p>
        <p>單價：NT${{ item.servicePrice }}，小計：NT${{ item.totalPrice }}</p>
        <p>備註：{{ item.note }}</p>
      </li>
    </ul>
    
    <ul v-else-if="normalizedType === 'hotel'">
      <li v-for="(item, index) in orderDetail.items" :key="index">
        <img :src="`/Hotel/${item.hotelPhoto}`" alt="飯店照片" class="item-image">
        <p>飯店名稱：{{ item.hotelName }}</p>
        <p>房型：{{item.roomName}}</p>
        <p>入住時間：{{ formatDate(item.checkIn) }}</p>
        <p>退房時間：{{ formatDate(item.checkOut) }}</p>
        <p>入住天數：{{item.nights}}</p>
        <p>房間數量：{{ item.qty }}</p>
        <p>每間房價：NT${{ item.pricePerRoom }}，小計：NT${{ item.totalPrice }}</p>
        <p>備註：{{ item.note }}</p>
      </li>
    </ul>
    <div class="text-center">
    <button @click="router.push('/orders')" class="btn btn-warning " >回到訂單
    </button>  
    </div>
  </div>     
</template>
    
<script setup >
    import { onMounted, ref, computed } from 'vue';
    import axios from 'axios';
    import Swal from 'sweetalert2';
    import { useAuthStore } from '@/stores/authStore';
import router from '@/router';
    
    const imgUrl = import.meta.env.VITE_API_IMAGE_URL;

    const props = defineProps({
        orderId:[Number,String],
        orderType: String,
        orderData: Object
    });

    const authStore = useAuthStore();
    const orderDetail = ref(props.orderData || null);
    const isLoading = ref(!props.orderData);

    const normalizedType = computed(() => {
        const t = (props.orderType||'').toString().toLowerCase()
        return t === 'hotel'|| t==='住宿' ? 'hotel' : 'walk'
    })

    const formatDate = (val) => {
        return new Date(val).toLocaleString();
    }

    function handlePay(){
      router.push({
        path:'/payment-gateway',
        query:{ orderId : props.orderId }
      })
    }

    async function handleCancle(){
      const {isConfirmed} = await Swal.fire({
        title:'確定要取消這筆訂單嗎?',
        text:'取消後將無法恢復',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText:'是，我要取消',
        cancelButtonText:'再想想'
      })
      if(!isConfirmed) return

      try{
        await axios.patch(
          `/api/order/${props.orderId}/cancel`,
          null,
          {headers:
            { Authorization:`Bearer ${authStore.token}`}
          }
        )
        await Swal.fire('已取消','訂單已成功取消','success')
        router.push('/orders')
      }catch(e){
        console.error(e);
        Swal.fire('失敗','取消訂單失敗，請稍後再試','error')
      }
    }

    onMounted(async () =>{
        if(!orderDetail.value && props.orderId){
            try{
                const url = `/api/order/${normalizedType.value}/${props.orderId}`;
                const res = await axios.get(url,{
                    headers:{
                        Authorization: `Bearer ${authStore.token}`
                    }
                });
                orderDetail.value = res.data;
            }catch(error){
                console.error('載入訂單失敗',error);
                Swal.fire({
                    icon: 'error',
                    title: '查無訂單資料',
                    text: '請稍後再試',
                });
            }finally {
                isLoading.value = false;
            } 
         }else{
                isLoading.value = false;
            }
    });

</script>
    
<style scoped>
ul{
        list-style-type: none;
}
.item-image {
  width: 200px;
  height: 200px;
  margin-right: 15px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}

.order-actions {
  margin: 16px 0;
}

.order-actions .btn {
  min-width: 100px;
}
</style>