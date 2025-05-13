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