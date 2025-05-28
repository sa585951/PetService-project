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
          <!-- 圖片展示區 -->
          <div class="mb-3">
            <div class="row">
              <div
                v-for="(img, i) in displayedImages"
                :key="i"
                class="col-4 mb-2"
              >
                <img
                  :src="img"
                  class="img-fluid"
                  style="width: 100%; height: 200px; object-fit: cover;"
                  @error="onImageError"
                />
              </div>
            </div>
            <!-- 更多圖片按鈕 -->
            <div class="text-center mt-2" v-if="processedCarousel.length > 3">
              <button
                class="btn btn-outline-primary"
                @click="toggleShowAll"
              >
                {{ showAllImages ? '收起圖片' : '更多圖片' }}
              </button>
            </div>
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
      <!-- 🔽 新增評論區塊：放在這裡 -->
<div class="row mt-5">
  <div class="col-12">
    <h4 class="mb-3">使用者評論</h4>

    <!-- 評論列表 -->
    <div v-for="(comment, index) in comments" :key="index" class="mb-3 border-bottom pb-2">
      <p><strong>{{ comment.name }}</strong>：</p>
      <p>{{ comment.text }}</p>
    </div>

    <!-- 新增評論表單 -->
    <form @submit.prevent="submitComment">
      <div class="mb-2">
        <label class="form-label">姓名</label>
        <input v-model="newComment.name" type="text" class="form-control" required />
      </div>
      <div class="mb-2">
        <label class="form-label">評論內容</label>
        <textarea v-model="newComment.text" class="form-control" rows="3" required></textarea>
      </div>
      <button type="submit" class="btn btn-primary">送出評論</button>
    </form>
  </div>
</div>
<!-- 🔼 評論區塊結束 -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'; //導入 useRouter
import { useEmployeeStore } from '@/stores/employeeStore';
import { useCartStore } from '@/stores/cart'

const comments = ref([])//使用者評論
const newComment = ref({ name: '', text: '' })

const submitComment = () => {
  if (newComment.value.name && newComment.value.text) {
    comments.value.push({ ...newComment.value })
    newComment.value = { name: '', text: '' }
  }
}
const employeeStore = useEmployeeStore();
const route = useRoute();
const router = useRouter(); //實例化 router
const cartStore = useCartStore()
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

const showAllImages = ref(false);

const displayedImages = computed(() => {
  // 確保 processedCarousel.value 存在且為陣列
  if (!processedCarousel.value || !Array.isArray(processedCarousel.value)) {
    return [];
  }
  return showAllImages.value ? processedCarousel.value : processedCarousel.value.slice(0, 3);
});

function toggleShowAll() {
  showAllImages.value = !showAllImages.value;
}


//載入員工資料
onMounted(async () => {
  if (employeeId.value !== null) {
    await employeeStore.fetchEmployeeDetail(employeeId.value); //調用 API 獲取單個員工資料
  }
  const savedCart = localStorage.getItem('cart');
  console.log('Initial cart from localStorage on mount:', savedCart ? JSON.parse(savedCart) : null);
  if (savedCart) {
    const parsedCart = JSON.parse(savedCart);
    parsedCart.forEach(item => cartStore.addItemToWalkCart(item));
  }
});



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
  event.target.src = '@/src/assets/walkservicesimages/default-image.jpg'; //圖片載入失敗時顯示預設圖片
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
  if (!employeeStore.employeeDetail) {
    console.warn('employeeDetail is undefined');
    return 0;
  }
  const price = Number(employeeStore.employeeDetail.price) || 0;
  const quantity = Number(form.value.quantity) || 1;
  console.log('price:', price, 'quantity:', quantity, 'subtotal:', price * quantity);
  return price * quantity;
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

  //計算ISO 8601的起始時間
  const walkStart = getWalkTimes.value.start;

  const cartItem = {
    //store 拿來當key的欄位
    employeeServiceId: form.value.employeeId,
    //訂單核心資料
    walkStart,
    quantity:form.value.quantity,
    note: combineNotes,
    //顯示用:遛狗員名子、照片、單價
    name:employeeStore.employeeDetail.name,
    imageUrl:`${baseImageUrl}${employeeStore.employeeDetail.employee_photo}`,
    price:employeeStore.employeeDetail.price
  }  
  
  cartStore.addItemToWalkCart(cartItem);
  alert(`已將 ${employeeStore.employeeDetail.name} 的服務加入購物車！`);
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
.img-fluid {
  border: 1px solid #ddd; 
  border-radius: 5px; 
  transition: transform 0.2s; /* 懸停放大效果 */
}
.img-fluid:hover {
  transform: scale(1.2);
}
</style>
