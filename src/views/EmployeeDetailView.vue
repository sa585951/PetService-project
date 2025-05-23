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

        <!-- 右側：購物車填寫-->
        <div class="col-md-5">
          <div class="border rounded p-3 shadow-sm bg-white">
            <h5 class="mb-3">填寫訂單資訊</h5>

            <div class="mb-2">
              <label class="form-label">寵物種類</label>
              <select v-model="form.pet" class="form-select">
                <option value="">請選擇</option>
                <option v-for="t in employeeStore.employeeDetail.petTypes" :key="t" :value="t">
                  {{ t }}
                </option>
              </select>
            </div>
            <div class="mb-2">
              <label class="form-label">寵物數量</label>
              <input
                v-model.number="form.quantity"
                type="number"
                class="form-control"
                min="1"
                max="5"
                @input="checkQuantity"
              />
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
              <div v-if="form.notesError" class="text-danger mt-1">請填寫寵物品種</div>             </div>

            <!-- 小計顯示 -->
            <div class="mt-3">
              <p>
                <strong>單價：</strong>{{ employeeStore.employeeDetail.price }} 元/小時(單次計費)
              </p>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'; //導入 useRouter
import { Carousel } from 'bootstrap';
import { useEmployeeStore } from '@/stores/employeeStore';

const employeeStore = useEmployeeStore();
const route = useRoute();
const router = useRouter(); //實例化 router
const employeeId = ref(null);

// 錯誤處理 employeeId
try {
  const id = Number(route.params.id);
  if (isNaN(id)) throw new Error('Invalid employee ID');
  employeeId.value = id;
} catch (error) {
  console.error('Error parsing employeeId:', error);
  employeeId.value = null;
}

//定義 carouselRef 和 bsCarousel 用於輪播初始化
const carouselRef = ref(null);
const bsCarousel = ref(null);

//使用 async onMounted 確保 fetchEmployeeDetail 完成後初始化輪播
onMounted(async () => {
  if (employeeId.value !== null) {
    await employeeStore.fetchEmployeeDetail(employeeId.value); //調用 API 獲取單個員工資料
    if (carouselRef.value) {
      bsCarousel.value = new Carousel(carouselRef.value, {
        interval: 3000,
        ride: 'carousel',
      });
    }
  }
});

function goToSlide(index) {
  if (bsCarousel.value) {
    bsCarousel.value.to(index);
  }
}

const form = ref({
  employeeId: employeeId.value,
  pet: '',
  quantity: 1,
  date: '',
  time: '',
  notes: '',
  notesError: false,
});

//監聽 route.params.id 變化時更新 employeeId 並重新調用 API
watch(() => route.params.id, (newId) => {
  try {
    const id = Number(newId);
    if (isNaN(id)) throw new Error('Invalid new employee ID');
    employeeId.value = id;
    form.value.employeeId = id;
    employeeStore.fetchEmployeeDetail(employeeId.value);
  } catch (error) {
    console.error('Error parsing new employeeId:', error);
    employeeId.value = null;
  }
});

const baseImageUrl = import.meta.env.VITE_API_IMAGE_URL || 'https://localhost:7089/images/';
//計算 processedCarousel，使用後端提供的 carousel 資料並拼接圖片路徑
const processedCarousel = computed(() => {
  if (employeeStore.employeeDetail && employeeStore.employeeDetail.carousel) {
    return employeeStore.employeeDetail.carousel.map(img => `${baseImageUrl}${img}`);
  }
  return [];
});

const onImageError = (event) => {
  event.target.src = '/path/to/default-image.jpg'; //圖片載入失敗時顯示預設圖片
};

const today = new Date();
const minDate = today.toISOString().split('T')[0];
const max = new Date();
max.setMonth(max.getMonth() + 1);
const maxDate = max.toISOString().split('T')[0];

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
    alert('請完整填寫寵物種類、數量、預約日期、預約時間和備註');
    return;
  }

  const combineNotes = `寵物種類:${form.value.pet}，${form.value.notes || '無'}`;

  const walkStartTime = `${form.value.date}T${form.value.time}`;

  const cartItem = {
    employeeId: form.value.employeeId,
    employeeName: employeeStore.employeeDetail.name, // 包含員工姓名
    pet: form.value.pet,
    quantity: form.value.quantity,
    walkStart: getWalkTimes.value.start,
    walkEnd: getWalkTimes.value.end,
    servicePrice: employeeStore.employeeDetail.price,
    totalPrice: subtotal.value,
    note: combineNotes,
    name: employee.name,
    imageUrl:employee.employee_photo,
    price: employee.price
  };

  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.push(cartItem);
  localStorage.setItem('cart', JSON.stringify(cart));
  const message = `
    已加入購物車：
    員工：${employeeStore.employeeDetail.name}
    寵物種類：${form.value.pet}
    數量：${form.value.quantity}
    預約日期：${form.value.date}
    預約時間：${form.value.time}
    備註：${form.value.notes || '無'}
    小計：${subtotal.value} 元
  `;
  
  const confirmed = confirm(message); // 使用 confirm 提供選擇
  if (confirmed) {
    router.push('/order'); // 導航到訂單頁面
  }
  
  const isValidDate = !isNaN(new Date(walkStartTime).getTime());
  console.log('格式正確嗎?', isValidDate);
  
  cartStore.addItemToWalkCart(cartItem);
  alert('已加入購物車');
  formReset();
}

function formReset() {
  form.value = {
    employeeId: employeeId.value,
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
