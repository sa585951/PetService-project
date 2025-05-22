<!-- components/EmployeeCard.vue -->
<template>
    <router-link :to="`/employee/${employee.id}`" class="employee-card text-decoration-none text-dark">
    <div class="card-glow position-relative">
    <div style="position: absolute; top: 10px; right: 10px; font-weight: bold; ">
     <span style="color: gold;font-size: 2rem;">${{ employee.price }}</span><span style="color: black;">/小時計費</span>
        </div>
            <div class="row align-items-center">
                <div class="col-4">
                    <img :src="`${baseImageUrl}${employee.employee_photo}`" :alt="employee.name"
                        class="img-fluid rounded" />
                </div>
                <div class="col-8">
                    <h5 class="fs-3 fw-bold">{{ employee.name }}</h5>
                    <p class="mb-1"><strong>服務地區：</strong>{{ employee.district }}</p>
                    <p><strong>可接寵物類型：</strong>{{ employee.petTypes.join(', ') }}</p>
                </div>
            </div>
        </div>
    </router-link>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
    employee: Object
})

const baseImageUrl = import.meta.env.VITE_API_IMAGE_URL || 'https://localhost:7089/images/';
</script>

<style scoped>
.employee-card {
    position: relative;
    border-radius: 15px;
    padding: 10px;
    background: transparent;
    overflow: hidden;
    z-index: 0;
    display: block;
}

.employee-card::before {
    content: "";
    position: absolute;
    top: 4px; /* 調整線條起始位置 */
    left: 4px; 
    right: 4px; 
    bottom: 4px; 
    background: linear-gradient(135deg, #ff00a6, #3333ff, #00ffcc, goldenrod);
    background-size: 400% auto;
    z-index: -1;
    border-radius: 16px;
    animation: borderFlow 4s ease infinite;
}

.card-glow {
    background: #fff;
    border-radius: 15px;
    padding: 10px;
    height: 100%;
}

@keyframes borderFlow {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}
.employee-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.employee-card:hover {
  transform: translateY(-10px) scale(1.1);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
</style>