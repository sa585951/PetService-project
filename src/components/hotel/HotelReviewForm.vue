<template>
<div>
    <!-- 彈窗 -->
    <div class="modal fade orderBox" id="bookingModal" tabindex="-1" aria-labelledby="bookingModalLabel" aria-hidden="true" ref="modal">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body" >
            
                    <div>
                        <Rating v-model="rating" ></Rating>
                        <div v-if="errors.rating" class="text-danger">{{ errors.rating }}</div>
                        <!-- <label>撰寫評語:</label> -->

                        <textarea v-model="content" rows="6" placeholder="請輸入評語"></textarea>
                        <div v-if="errors.content" class="text-danger">{{ errors.content }}</div>
                        <div class="button-group">
                            <button class="btn btn-cancel" @click="closeModal">取消</button>
                            <button class="btn btn-confirm" @click="submitReview">確認</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 按鈕   @click="orderInfo()" -->
    <GoButton class="reviewBtn" @click="openModal"><slot></slot></GoButton>
</div>
</template>
    
<script setup>
    import GoButton from '@/components/hotel/HotelBookingButton.vue';
    import Rating from './HotelRating.vue';
    import { ref, onMounted, defineProps, defineEmits } from 'vue';
    import { Modal } from 'bootstrap';
    import Swal from 'sweetalert2';

    const props = defineProps({
        hotelId: Number,
        memberId : Number,
        unreviewedOrderIds: Array
    })
    const emit = defineEmits(['refresh-data']);
    
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
    if (!content.value || content.value.trim().length < 1) {
        errors.value.content = '請輸入評論內容';
        valid = false;
    }

    if (!valid) return;
  
        const Comments = {
            HotelId: props.hotelId,
            MemberId: props.memberId,
            Rating: rating.value,
            Content: content.value,
            OrderId : props.unreviewedOrderIds[0]
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
        // console.log('評論成功送出:', result);
        bsModal.hide(); // 關閉 modal
        content.value = ''; // 清空表單
        Rating.value = 0;
        emit('refresh-data');    // 通知父元件重新抓資料
        // console.log('emit review-submitted 已觸發');
        Swal.fire({
      icon: 'success',
      title: '已送出評語',
      showConfirmButton: true,
      confirmButtonColor: '#ACC572',
    })
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
    .reviewBtn {
        /* background-color: rgb(245, 221, 189); */
        margin-bottom: 15px;
    }

/* 確定 取消按鈕 */
    .button-group {
        display: flex;
        justify-content: center; /* 讓按鈕靠右 */
        gap: 1rem;                 /* 按鈕之間的間距 */
        margin-top: 1.5rem;        /* 與表單其他區塊的間距 */
    }

    .btn {
        font-size: 1rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.3s ease, box-shadow 0.2s ease;
    }
    .btn-confirm {
        background-color: rgb(228, 187, 134);
        color: rgb(88, 50, 3);
        border: none;
    }

    .btn-confirm:hover {
        background-color: rgb(200, 160, 110); /* 深一點 */
    }

    .btn-confirm:active {
        background-color: rgb(180, 140, 100);
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .btn-cancel {
        background-color: rgb(228, 228, 228);
        color: #333;
        border: none;
    }

    .btn-cancel:hover {
        background-color: rgb(200, 200, 200); /* 深一點 */
    }

    .btn-cancel:active {
        background-color: rgb(180, 180, 180);
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
    }
</style>