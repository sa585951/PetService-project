<!-- components/EmployeeList.vue -->
<template>
  <div class="Header_div mb-3">
    <!-- 圖片輪播 -->
    <div id="employeeCarousel" class="carousel slide">
      <div class="carousel-inner">
        <div class="carousel-item active" data-bs-interval="3000">
          <img src="@/assets/walkservicesimages/dog10.jpg" class="d-block w-100 img_background" alt="狗狗散步服務" loading="lazy">
        </div>
        <div class="carousel-item" data-bs-interval="3000">
          <img src="@/assets/walkservicesimages/cat4.jpg" class="d-block w-100 img_background" alt="寵物與員工互動" loading="lazy">
        </div>
        <div class="carousel-item" data-bs-interval="3000">
          <img src="@/assets/walkservicesimages/rabbit1.jpg" class="d-block w-100 img_background" alt="寵物照護場景" loading="lazy">
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#employeeCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">上一張</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#employeeCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">下一張</span>
      </button>
    </div>

    <!-- 搜索欄 -->
    <div class="search_bar1">
      <div class="search_bar2">
        <div class="row p-2 d-flex justify-content-center align-items-center">
          <div class="filter-box">
            <select v-model="districtFilter" class="filter-select" @change="applyFilters">
              <option value="">全部地區</option>
              <option v-for="d in employeeStore.districts" :key="d" :value="d">{{ d }}</option>
            </select>
            <select v-model="typeFilter" class="filter-select" @change="applyFilters">
              <option value="">全部寵物</option>
              <option v-for="t in employeeStore.petTypes" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>

  <h2 class="text-center mb-1">散步服務員工列表</h2>
  <div class="row">
    <!-- 左側留白區 -->
    <div class="col-md-2"></div>

    <!-- 員工清單區 -->
    <div class="col-md-6">
      <div class="row w-100 justify-content-center">
        <div v-if="employeeStore.isLoading" class="text-center">載入中...</div>
        <div v-else-if="employeeStore.error" class="text-center text-danger">{{ employeeStore.error }}</div>
        <div v-else-if="filteredEmployees.length === 0" class="text-center">查無符合條件的員工</div>
        <div v-else v-for="emp in filteredEmployees" :key="emp.id" class="col-12 mb-2">
          <EmployeeCard :employee="emp" />
        </div>
      </div>
    </div>

    <!-- 描述區塊 -->
    <div class="col-md-4">
      <div class="description-box p-3">
        <h3>選擇我們的散步服務</h3>
        <p><i class="fas fa-dog text-primary me-3 fs-2"></i><strong class="fs-3">專業團隊</strong><br>我們的散步服務由經驗豐富的專業團隊提供，確保您的寵物得到最佳照顧。</p>
        <p><i class="fas fa-shield-alt text-success me-3 fs-2"></i><strong class="fs-3">安全第一</strong><br>我們注重寵物的安全，散步過程中使用安全繩具，並隨時關注寵物的狀況。</p>
        <p><i class="fas fa-clock text-warning me-3 fs-2"></i><strong class="fs-3">靈活安排</strong><br>提供靈活的散步時間安排，滿足您和寵物的需求。</p>
        <p><i class="fas fa-comment-dots text-info me-3 fs-2"></i><strong class="fs-3">即時更新</strong><br>散步過程中，我們會提供即時更新，讓您隨時了解寵物的狀況。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import EmployeeCard from './EmployeeCard.vue'
import * as bootstrap from 'bootstrap'

//呼叫API
import { useEmployeeStore } from '@/stores/employeeStore'
import { storeToRefs } from 'pinia'

//1.pinia store
const employeeStore = useEmployeeStore()
const { employees } = storeToRefs(employeeStore)

//2.前端篩選
const districtFilter = ref('')
const typeFilter = ref('')

//3.前端篩選
const filteredEmployees = computed(() => {
  return employeeStore.employees.filter(e => {
    const matchDistrict = districtFilter.value === '' || e.district === districtFilter.value;
    const matchType = typeFilter.value === '' || e.petTypes.includes(typeFilter.value);
    return matchDistrict && matchType;
  });
});
//4.地區與寵物類型選項
const applyFilters = async () => {
  const filters = {
    district: districtFilter.value,
    petTypes: typeFilter.value ? [typeFilter.value] : [],
  };
  await employeeStore.filterEmployees(filters);
};

//5.onMounted：載入資料與初始化輪播
onMounted(async () => {
  //抓取所有員工資料
  await employeeStore.fetchEmployees()
  console.log('Employees:', employeeStore.employees)

  await nextTick() // 確保 DOM 渲染完成
  const carouselElement = document.getElementById('employeeCarousel')
  if (carouselElement && bootstrap) {
    const carousel = new bootstrap.Carousel(carouselElement, {
      ride: 'carousel',
      interval: 3000, 
      pause: false 
    })
    carousel.cycle() 
  } else {
    console.error('Bootstrap Carousel not initialized. Ensure Bootstrap JS is loaded.')
  }
})

 console.log(employees.value)
</script>

<style scoped>
.Header_div {
  position: relative;
}

.carousel-inner {
  min-height: 600px; /* 防止載入時跳動 */
}

.img_background {
  width: 100%;
  height: 600px;
  object-fit: cover;
  object-position: center;
}

.search_bar1 {
  position: absolute;
  width: 70%;
  height: 100px;
  top: 80%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgb(249, 245, 202);
  border-radius: 10px;
  z-index: 10;
}

.search_bar2 {
  position: absolute;
  width: 80%;
  height: 60%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
}

.filter-select {
  width: 180px;
  padding: 10px;
  font-size: 20px;
  border-radius: 5px;
}

/* 響應式調整 */
@media (max-width: 768px) {
  .img_background {
    height: 400px;
  }
  .carousel-inner {
    min-height: 400px;
  }
  .search_bar1 {
    width: 90%;
    height: 80px;
    top: 85%;
  }
  .search_bar2 {
    width: 85%;
  }
  .filter-select {
    width: 150px;
    font-size: 16px;
  }
}

@media (max-width: 576px) {
  .img_background {
    height: 300px;
  }
  .carousel-inner {
    min-height: 300px;
  }
  .search_bar1 {
    width: 95%;
    height: 70px;
  }
  .filter-select {
    width: 130px;
    font-size: 14px;
  }
}

</style>