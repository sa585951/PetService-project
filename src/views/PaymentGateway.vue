<template>
<div class="text-center mt-5">
    <h3>正在導向綠界金流，請稍候...</h3>
</div>
</template>
    
<script setup >
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import  axios  from 'axios'
import { useAuthStore } from '@/stores/authStore';
import Swal from 'sweetalert2';

const route = useRoute();
const authStore = useAuthStore();

const orderId = route.query.orderId;

onMounted(async() =>{

    try{
        await axios.get(`/api/order/${orderId}/payment-info`,
        {
            headers: {Authorization: `Bearer ${authStore.token}`}
        });

        const {data:html} = await axios.post(`/api/order/${orderId}/ecpay-checkout`,null,{
            headers:{Authorization:`Bearer ${authStore.token}`}
        });

        document.open();
        document.write(html);
        document.close();
    } catch (err) {
        console.error(err);
        Swal.fire("錯誤", "取得付款資訊失敗", "error");
    }
});
</script>
    
<style scoped>
    
</style>