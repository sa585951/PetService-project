<!-- components/EmployeeList.vue -->
<template>
  <div class="Header_div mb-3">
    <!-- 圖片輪播 -->
    <div id="employeeCarousel" class="carousel slide">
      <div class="carousel-inner">
        <div class="carousel-item active" data-bs-interval="3000">
          <img src="../assets/walkservicesimages/dog10.jpg" class="d-block w-100 img_background" alt="狗狗散步服務" loading="lazy">
        </div>
        <div class="carousel-item" data-bs-interval="3000">
          <img src="../assets/walkservicesimages/cat4.jpg" class="d-block w-100 img_background" alt="寵物與員工互動" loading="lazy">
        </div>
        <div class="carousel-item" data-bs-interval="3000">
          <img src="../assets/walkservicesimages/rabbit1.jpg" class="d-block w-100 img_background" alt="寵物照護場景" loading="lazy">
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
            <select v-model="districtFilter" class="filter-select">
              <option value="">全部地區</option>
              <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
            </select>
            <select v-model="typeFilter" class="filter-select">
              <option value="">全部寵物</option>
              <option v-for="t in petTypes" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <h2 class="text-center mb-1">散步服務員工列表</h2>
  <!-- 員工清單 -->
  <div class="container mt-3 my-5">
    <div class="row justify-content-center" v-for="emp in filteredEmployees" :key="emp.id">
      <div class="col-md-6 mb-4">
        <EmployeeCard :employee="emp" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { employees } from '@/data'
import EmployeeCard from './EmployeeCard.vue'
import * as bootstrap from 'bootstrap'

const districtFilter = ref('')
const typeFilter = ref('')

const filteredEmployees = computed(() => {
  return employees.filter(e => {
    const matchDistrict = districtFilter.value === '' || e.district === districtFilter.value
    const matchType = typeFilter.value === '' || e.petType.includes(typeFilter.value)
    return matchDistrict && matchType
  })
})

const districts = ["鼓山區", "三民區", "鹽埕區", "前金區", "苓雅區"]
const petTypes = ["狗", "貓", "兔"]

// 手動初始化輪播
onMounted(async () => {
  await nextTick() // 確保 DOM 渲染完成
  const carouselElement = document.getElementById('employeeCarousel')
  if (carouselElement && bootstrap) {
    const carousel = new bootstrap.Carousel(carouselElement, {
      ride: 'carousel', // 啟用自動播放
      interval: 3000, // 每3秒切換
      pause: false // 防止滑鼠懸停時暫停
    })
    carousel.cycle() // 明確觸發輪播循環
  } else {
    console.error('Bootstrap Carousel not initialized. Ensure Bootstrap JS is loaded.')
  }
})
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
  z-index: 10; /* 確保搜索欄在輪播圖之上 */
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