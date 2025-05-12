<!-- views/EmployeeDetailView.vue -->
<template>
  <div class="container py-4">
    <div class="row">
      <!-- 左側：圖片 + 詳細介紹 + 服務項目 -->
      <div class="col-md-7">
        <!-- 圖片輪播區 -->
        <div id="carouselExample" class="carousel slide mb-3" data-bs-ride="carousel" data-bs-interval="2000" ref="carouselRef">

  <div class="carousel-inner">
    <div
      class="carousel-item"
      :class="{ active: i === 0 }"
      v-for="(img, i) in processedCarousel"
      :key="i"
    >
      <img :src="img" class="d-block w-100 " style="width: 500px; height: 500px; object-fit: cover;" />
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>

<!-- 小縮圖點選切換 -->
<div class="d-flex flex-wrap gap-2 justify-content-center mb-3">
  <img
    v-for="(img, i) in processedCarousel"
    :key="i"
    :src="img"
    class="img-thumbnail"
    style="width: 100px; height: 100px; object-fit: cover; cursor: pointer;"
    @click="goToSlide(i)"
  />
</div>


        <!-- 詳細介紹 -->
        <h3 class="mb-2">{{ employee.name }}</h3>
        <p class="mb-3">{{ employee.description }}</p>

        <!-- 服務項目 -->
        <div class="border rounded p-3 bg-light">
          <h5 class="mb-2">服務項目</h5>
          <p><strong>可接寵物類型：</strong>{{ employee.petType.join(', ') }}</p>
          <p><strong>可接體型：</strong>{{ employee.size }}</p>
          <p><strong>可載送距離：</strong>{{ employee.distance || '3 公里內' }}</p>
        </div>
      </div>

      <!-- 右側：購物車填寫 + 按鈕 -->
      <div class="col-md-5">
        <div class="border rounded p-3 shadow-sm bg-white">
          <h5 class="mb-3">填寫訂單資訊</h5>

          
          <div class="mb-2">
            <label class="form-label">寵物種類</label>
            <select v-model="form.pet" class="form-select">
              <option value="">請選擇</option>
              <option v-for="t in employee.petType" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="form-label">寵物數量</label>
      <input v-model.number="form.quantity" type="number" class="form-control" min="1" max="5"  @input="checkQuantity"/>
      <div v-if="quantityError" class="text-danger mt-1">最多只能選擇 5 隻寵物</div>
          </div>

          <div class="mb-2">
            <label class="form-label">預約日期</label>
            <input v-model="form.date" type="date" class="form-control" 
            :min="minDate" :max="maxDate"/>
          </div>
          <div class="mb-2">
            <label class="form-label">預約時間</label>
            <select v-model="form.time" class="form-select">
              <option value="">請選擇</option>
              <option v-for="t in employee.availableTime" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>

          <div class="mb-2">
            <label class="form-label">其他備註</label>
            <textarea v-model="form.notes" class="form-control" rows="2"></textarea>
            <div class="text-danger mt-1">請填寫寵物品種</div>

          </div>
             <!-- 小計顯示 -->
          <div class="mt-3">
            <p><strong>單價/1小時：</strong>{{ employee.price }} 元</p>
            <p><strong>價格小計：</strong>{{ subtotal }} 元</p>
          </div>

          <div class="d-flex gap-2 mt-3">
            <button class="btn btn-outline-primary" @click="addToCart">加入購物車</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 地圖區塊 -->
    <div class="row mt-4">
      <div class="col-12">
        <iframe
          :src="employee.map"
          width="100%"
          height="300"
          style="border:0;"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed ,onMounted} from 'vue'
import { useRoute } from 'vue-router'
import { employees } from '@/data';
import { Carousel } from 'bootstrap'

const carouselRef = ref(null)
const bsCarousel = ref(null)

//及時輪播
onMounted(() => {
  if (carouselRef.value) {
    bsCarousel.value = new Carousel(carouselRef.value, {
      interval: 3000,
      ride: 'carousel'
    })
  }
})

function goToSlide(index) {
  if (bsCarousel.value) {
    bsCarousel.value.to(index)
  }
}
const route = useRoute()
const employeeId = Number(route.params.id)
const employee = employees.find(e => e.id === employeeId)

const form = ref({
  pet: '',
  quantity: 1,
  date: '',
  time: '',
  notes: ''
})
// 計算處理後的輪播圖片 URL 陣列
//所以上面的 :src 直接綁定到 'img' 就好
const processedCarousel = computed(() => {
  if (employee && employee.carousel) {
    return employee.carousel.map(img => new URL(`../assets/walkservicesimages/${img}`, import.meta.url).href);
  }
  return []; 
});

//預約限制1個月內
const today = new Date()
const minDate = today.toISOString().split('T')[0]
const max = new Date()
max.setMonth(max.getMonth() + 1)
const maxDate = max.toISOString().split('T')[0]

const quantityError = ref(false)
function checkQuantity() {
  quantityError.value = form.value.quantity > 5
}

// 計算小計
const subtotal = computed(() => {
  return employee.price * form.value.quantity || 0
})

function isFormValid() {
   return (
    form.value.pet &&
    form.value.date &&
    form.value.time &&
    form.value.quantity >= 1 &&
    form.value.quantity <= 5
  )
}

function addToCart() {
  if (!isFormValid()) {
    alert('請完整填寫寵物種類、數量與日期')
    return
  }
  const message = `
    已加入購物車：
    員工：${employee.name}
    寵物種類：${form.value.pet}
    數量：${form.value.quantity}
    預約日期：${form.value.date}
    預約時間：${form.value.time}
    備註：${form.value.notes || '無'}
    小計：${subtotal.value} 元
  `
  alert(message)
  formReset()
}



function formReset() {
  form.value = {
    pet: '',
    quantity: 1,
    date: '',
    time: '',
    notes: ''
  }
  quantityError.value = false
}

</script>


<style scoped>
textarea {
  resize: none;
}
</style>
