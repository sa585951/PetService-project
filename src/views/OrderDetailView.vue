<template>
        <div class="container">
            <h3>訂單詳細資訊</h3>
            <OrderDetail :order-id="orderId" :order-type="orderType"/>
        </div>
</template>
    
<script setup >
    import OrderDetail from '@/components/OrderDetail.vue';
    import { useRoute } from 'vue-router';

    const route = useRoute();
    const orderId = route.params.id;
    const orderType = route.query.type;
</script>
    
<style scoped>
    
</style>