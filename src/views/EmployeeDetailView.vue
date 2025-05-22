<!-- views/EmployeeDetailView.vue -->
<template>
  <div class="container py-4">
    <!-- 載入與錯誤處理 -->
    <div v-if="employeeStore.isLoading" class="text-center">載入中...</div>
    <div v-else-if="employeeStore.error" class="text-center text-danger">
      {{ employeeStore.error }}
    </div>
    <div v-else-if="!employeeStore.employeeDetail" class="text-center">
      找不到該員工資料
    </div>
    <div v-else>
      <div class="row">
        <!-- 左側：圖片 + 詳細介紹 + 服務項目 -->
        <div class="col-md-7">
          <!-- 圖片輪播區 -->
          <div
            id="carouselExample"
            class="carousel slide mb-3"
            data-bs-ride="carousel"
            data-bs-interval="3000"
            ref="carouselRef"
          >
            <div class="carousel-inner">
              <div
                class="carousel-item"
                :class="{ active: i === 0 }"
                v-for="(img, i) in processedCarousel"
                :key="i"
              >
                <img
                  :src="img"
                  class="d-block w-100"
                  style="width: 500px; height: 500px; object-fit: cover;"
                  @error="onImageError"
                />
              </div>
            </div>
            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="prev"
            >
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button
              class="carousel-control-next"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="next"
            >
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
              @error="onImageError"
            />
          </div>

          <!-- 詳細介紹 -->
          <h3 class="mb-2">{{ employeeStore.employeeDetail.name }}</h3>
          <p class="mb-3">{{ employeeStore.employeeDetail.description }}</p>

          <!-- 服務項目 -->
          <div class="border rounded p-3 bg-light">
            <h5 class="mb-2">服務項目</h5>
            <p>
              <strong>可接寵物類型：</strong>{{ employeeStore.employeeDetail.petTypes.join(', ') }}
            </p>
            <p>
              <strong>可接體型：</strong>{{ employeeStore.employeeDetail.petSizes.join(', ') }}
            </p>
            <p>
              <strong>可載送距離：</strong>{{
                employeeStore.employeeDetail.distance
                  ? `${employeeStore.employeeDetail.distance} 公里`
                  : '3 公里內'
              }}
            </p>
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
              <input v-model="form.date" type="date" class="form-control" :min="minDate" :max="maxDate" />
            </div>
            <div class="mb-2">
              <label class="form-label">預約時間</label>
              <select v-model="form.time" class="form-select">
                <option value="">請選擇</option>
                <option v-for="t in employeeStore.employeeDetail.availableTime" :key="t" :value="t">
                  {{ t }}
                </option>
              </select>
            </div>

          <div class="mb-2">
            <label class="form-label">其他備註</label>
            <textarea v-model="form.notes" class="form-control" rows="2"></textarea>
            <div class="text-danger mt-1">請填寫寵物品種</div>

          </div>
             <!-- 小計顯示 -->
          <div class="mt-3">
            <p><strong>單價：</strong>{{ employee.price }} 元/小時(單次計費)</p>
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
            :src="employeeStore.employeeDetail.map"
            width="100%"
            height="300"
            style="border:0;"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
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
});

function goToSlide(index) {
  if (bsCarousel.value) {
    bsCarousel.value.to(index);
  }
}

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
  if (employeeStore.employeeDetail && employeeStore.employeeDetail.carousel) {
    return employeeStore.employeeDetail.carousel.map(img => `${baseImageUrl}${img}`);
  }
  return [];
});

//預約限制1個月內
const today = new Date()
const minDate = today.toISOString().split('T')[0]
const max = new Date()
max.setMonth(max.getMonth() + 1)
const maxDate = max.toISOString().split('T')[0]

const quantityError = ref(false);
function checkQuantity() {
  quantityError.value = form.value.quantity > 5;
}

const subtotal = computed(() => {
  return (employeeStore.employeeDetail?.price || 0) * form.value.quantity || 0;
});

const getWalkTimes = computed(() => {
  if (!form.value.date || !form.value.time) return { start: null, end: null };
  const startTime = form.value.time.split('-')[0];
  const date = new Date(form.value.date);
  const start = new Date(date.setHours(...startTime.split(':'), 0, 0));
  const end = new Date(start.getTime() + 60 * 60 * 1000); // fWalkEnd 設為 fWalkStart 加上 1 小時
  return { start: start.toISOString(), end: end.toISOString() };
});

function isFormValid() {
  form.value.notesError = !form.value.notes;
  return (
    form.value.pet &&
    form.value.date &&
    form.value.time &&
    form.value.quantity >= 1 &&
    form.value.quantity <= 5 &&
    !form.value.notesError
  );
}

function addToCart() {
  if (!isFormValid()) {
    alert('請完整填寫寵物種類、數量與日期')
    return
  }
  const message = `
    已加入購物車：
    員工：${employeeStore.employeeDetail.name}
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
    notes: '',
    notesError: false,
  };
  quantityError.value = false;
}
</script>

<style scoped>
textarea {
  resize: none;
}
</style>