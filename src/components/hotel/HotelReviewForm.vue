<template>
<div>
    <!-- 彈窗 -->
    <div class="modal fade orderBox" id="bookingModal" tabindex="-1" aria-labelledby="bookingModalLabel" aria-hidden="true" ref="modal">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body" >
            
            <div>
               <label for="">訂購姓名id: {{props.memberId}}</label>
                <label for="">旅館id : {{props.hotelId}}</label>
                <label for="">星星 :</label>
                <Rating v-model="rating" ></Rating>
                <div v-if="errors.rating" class="text-danger">{{ errors.rating }}</div>
                <label>撰寫評論:</label>

                <textarea v-model="content" rows="4"></textarea>
                 <div v-if="errors.content" class="text-danger">{{ errors.content }}</div>
                <button class="btn"  @click="submitReview">確認</button>
                <button class="btn btn-secondary" @click="closeModal">取消</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 按鈕   @click="orderInfo()" -->
    <button class="btn btn-secondary" @click="openModal">  
      <slot></slot>
    </button>
  </div>
</template>
    
<script setup>
    import GoButton from '@/components/hotel/HotelBookingButton.vue';
    import Rating from './HotelRating.vue';
    import { ref, onMounted,defineProps } from 'vue';
    import { Modal } from 'bootstrap';

    const props = defineProps({
  hotelId: Number,
  memberId : Number
})
//彈窗初始化
    const modal = ref(null);
    let bsModal = null;
    onMounted(() => {
        if (modal.value) {
            bsModal = new Modal(modal.value);
        };
    });
    function openModal() {
        if (bsModal) {
            bsModal.show();
        };
    };

//評論內容
    const content = ref('');
    const rating  = ref(0);
    
    // 驗證錯誤
const errors = ref({
  content: '',
  rating: ''
});

// 評論送出
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
  
        const Comments = {
            HotelId: props.hotelId,
            MemberId: props.memberId,
            Rating: rating.value,
            Content: content.value
        };

    try {
        const API_URL = `${import.meta.env.VITE_API_BaseURL}/Hotel/Create`;
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Comments)
        });

        if (!response.ok) {
            throw new Error('送出失敗');
        }

        const result = await response.json();
        console.log('評論成功送出:', result);
        bsModal.hide(); // 關閉 modal
        content.value = ''; // 清空表單
        Rating.value = 0;
        alert('評論送出成功！');
    }
    catch (error) {
        console.error('送出錯誤:', error);
        alert('送出失敗，請稍後再試');
    };
    };

//取消按鈕
    function closeModal() {
        if (bsModal) {
            bsModal.hide();
        }
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