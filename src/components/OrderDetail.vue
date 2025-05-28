<template>
    <div v-if="isLoading">載入中...</div>
    <div v-else-if="orderDetail">
    <p><strong>訂單編號：</strong>{{ orderDetail.orderId }}</p>
    <p><strong>建立時間：</strong>{{ formatDate(orderDetail.createdAt) }}</p>
    <p><strong>狀態：</strong>{{ orderDetail.status }}</p>
    <p><strong>總金額：</strong>NT${{ orderDetail.totalAmount }}</p>

    <hr />
    <h5>訂單明細</h5>
    <div v-if="orderType?.toLowerCase() === 'walk'">
    <ul>
      <li v-for="(item, index) in orderDetail.items" :key="index">
        <p>遛狗員：{{ item.employeeName }}</p>
        <p>開始時間：{{ formatDate(item.walkStart) }}</p>
        <p>結束時間：{{ formatDate(item.walkEnd) }}</p>
        <p>數量：{{ item.amount }} 隻</p>
        <p>單價：NT${{ item.servicePrice }}，小計：NT${{ item.totalPrice }}</p>
        <p>備註：{{ item.note }}</p>
      </li>
    </ul>
    </div>
    <div v-if="orderType?.toLowerCase() === 'hotel'">
    <ul>
      <li v-for="(item, index) in orderDetail.items" :key="index">
        <p>飯店名稱：{{ item.hotelName }}</p>
        <p>入住時間：{{ formatDate(item.checkIn) }}</p>
        <p>退房時間：{{ formatDate(item.checkOut) }}</p>
        <p>房間數量：{{ item.qty }}</p>
        <p>每間房價：NT${{ item.pricePerRoom }}，小計：NT${{ item.totalPrice }}</p>
        <p>備註：{{ item.note }}</p>
      </li>
    </ul>
    </div>
  </div>     
</template>
    
<script setup >
    import { computed, onMounted, ref  } from 'vue';
    import axios from 'axios';
    import Swal from 'sweetalert2';
    import { useAuthStore } from '@/stores/authStore';

    const authStore = useAuthStore();

    const props = defineProps({
        orderId:[Number,String],
        orderType: String,
        orderData: Object
    });

    const orderDetail = ref(props.orderData || null);
    const isLoading = ref(!props.orderData);

    function normalizeOrderType(type){
        if (type?.toLowerCase() === 'walk' || type === '散步') return 'walk';
        if (type?.toLowerCase() === 'hotel' || type === '住宿') return 'hotel';
        return '';
    }

    function getApiPath () {
        const type = normalizeOrderType(props.orderType || orderDetail.value?.orderType ||'walk');
        const id = props.orderData?.orderId || props.orderId;
        if(!id)return '';
        switch(type){
            case  'walk':
                return `/api/order/walk/${id}`
            case 'hotel':
                return `/api/order/hotel/${id}`
                default:
                    return''
        }
    };


    const formatDate = (val) => {
        return new Date(val).toLocaleString();
    }

    onMounted(async () =>{
        if(!orderDetail.value && props.orderId){
            try{
                const res = await axios.get(getApiPath(),{
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
</style>