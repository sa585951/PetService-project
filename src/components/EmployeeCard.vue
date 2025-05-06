<!-- components/EmployeeCard.vue -->
<template>
    <router-link :to="`/employee/${employee.id}`" class="employee-card text-decoration-none text-dark">
        <div class="card-glow">
            <div class="row align-items-center">
                <div class="col-4">
                    <img :src="`src/assets/walkservicesimages/${employee.employee_photo}`" :alt="employee.name"
                        class="img-fluid rounded" />
                </div>
                <div class="col-8">
                    <h5>{{ employee.name }}</h5>
                    <p class="mb-1"><strong>服務地區：</strong>{{ employee.district }}</p>
                    <p><strong>可接寵物類型：</strong>{{ employee.petType.join(', ') }}</p>
                </div>
            </div>
        </div>
    </router-link>
</template>

<script setup>
defineProps({
    employee: Object
})
</script>

<style scoped>
.employee-card {
    position: relative;
    border-radius: 15px;
    padding: 10px;
    /* 讓動畫有空間可見 */
    background: transparent;
    overflow: hidden;
    z-index: 0;
    display: block;
    /* 確保能套到整個 router-link */
}

.employee-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #ff00a6, #3333ff, #00ffcc, goldenrod);
    background-size: 600% 600%;
    z-index: -1;
    border-radius: 20px;
    animation: borderFlow 8s ease infinite;
}

.card-glow {
    background: #fff;
    border-radius: 16px;
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
</style>