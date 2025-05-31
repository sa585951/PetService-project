<template>
  <div>
    <!-- 彈窗 -->
    <div class="modal fade orderBox" id="bookingModal" tabindex="-1" aria-labelledby="bookingModalLabel" aria-hidden="true" ref="modal">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <div>
              <label>訂購姓名id: {{ props.memberId }}</label>
              <label>旅館id: {{ props.hotelId }}</label>
              <label>星星 :</label>
              <Rating v-model="rating" />
              <div v-if="errors.rating" class="text-danger">{{ errors.rating }}</div>

              <label>撰寫評論:</label>
              <textarea v-model="content" rows="4"></textarea>
              <div v-if="errors.content" class="text-danger">{{ errors.content }}</div>

              <button class="btn" @click="submitReview">確認</button>
              <button class="btn btn-secondary" @click="closeModal">取消</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <GoButton @click="openModal">
      <slot></slot>
    </GoButton>
  </div>
</template>

<script setup>
import GoButton from '@/components/hotel/HotelBookingButton.vue';
import Rating from './HotelRating.vue';
import { ref, onMounted, defineProps } from 'vue';
import { Modal } from 'bootstrap';

const props = defineProps({
  hotelId: Number,
  memberId: Number,
  reviewId: Number // 要編輯的評論 ID
});

// 彈窗初始化
const modal = ref(null);
let bsModal = null;

onMounted(() => {
  if (modal.value) {
    bsModal = new Modal(modal.value);
  }
});

const content = ref('');
const rating = ref(0);

// 錯誤訊息
const errors = ref({
  content: '',
  rating: ''
});

// 開啟 Modal 並載入資料
async function openModal() {
  if (!props.reviewId) return;

  try {
    const API_URL = `${import.meta.env.VITE_API_BaseURL}/Hotel/Edit/${props.reviewId}`;
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('讀取失敗');
    const data = await response.json();

    content.value = data.content || '';
    rating.value = data.rating || 0;

    bsModal?.show();
  } catch (err) {
    alert('無法讀取評論內容');
    console.error(err);
  }
}

// 送出 PUT 更新
async function submitReview() {
  errors.value = {};

  let valid = true;
  if (rating.value < 1 || rating.value > 5) {
    errors.value.rating = '請選擇 1～5 分的星等';
    valid = false;
  }
  if (!content.value || content.value.trim().length < 5) {
    errors.value.content = '請輸入至少 5 個字的評論內容';
    valid = false;
  }

  if (!valid) return;

  const comment = {
    HotelId: props.hotelId,
    MemberId: props.memberId,
    Rating: rating.value,
    Content: content.value
  };

  try {
    const API_URL = `${import.meta.env.VITE_API_BaseURL}/Hotel/Create/${props.reviewId}`;
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comment)
    });

    if (!response.ok) throw new Error('更新失敗');

    alert('評論已更新成功');
    bsModal?.hide();
  } catch (err) {
    alert('更新失敗，請稍後再試');
    console.error(err);
  }
}

// 關閉 modal
function closeModal() {
  bsModal?.hide();
}
</script>

<style scoped>
.orderBox {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 600px;
}
label {
  display: block;
}
textarea {
  width: 100%;
  resize: none;
}
</style>