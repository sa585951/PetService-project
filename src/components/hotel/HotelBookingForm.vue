<template>
  <div>
    <!-- 彈窗 -->
    <div class="modal fade orderBox" id="bookingModal" tabindex="-1" aria-labelledby="bookingModalLabel" ref="modal">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="bookingModalLabel">確認訂房資訊</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉"></button>
          </div>
          <div class="modal-body" >
            
            <div>
                <label>訂購姓名: {{props.userName}}</label>
                <label>旅館名稱 : {{hotel.name}}</label>
                <label>預訂房型 : {{props.roomName}}</label>
                <label>房間單價 : {{props.price}} 元</label>
                <label>日期 : {{checkInDate}} ~ {{checkOutDate}}</label>
                <label>房間數 : {{requiredRooms}} 間</label>
                
                <label>備註 (100字以內) :</label>

                <textarea ref="messageInput" v-model="AdditionalMessage" @input="checkLength()" rows="4"></textarea>
                
                <div :class="{'countHint-gray':!isOver100, 'countHint-red':isOver100 }">字數：{{ AdditionalMessage.length }}/100</div>
                <div class="btn-center">
                  <button class="btn btn-confirm" @click="saveOrderInfo()">確認</button>
                </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 按鈕   @click="orderInfo()" -->
    <GoButton @click="openModal">  
      <slot></slot>
    </GoButton>
  </div>
</template>

<script setup>
import GoButton from '@/components/hotel/HotelBookingButton.vue';
import { ref, computed, defineProps, onMounted  } from 'vue'
import { Modal } from 'bootstrap'
import { useCartStore } from '@/stores/cart';
import Swal from 'sweetalert2';

const cartStore = useCartStore();
const messageInput = ref(null);  // 指向 textarea 元素
const props = defineProps({
  hotel: Object,
  roomName: String,
  memberId : Number,
  userName: String,
  checkInDate: String,
  checkOutDate: String,
  requiredRooms: Number,
  price: Number,
  roomtype_id: Number,
  hotelImage : String
})

const modal = ref(null)
let bsModal = null

onMounted(() => {
  if (modal.value) {
    bsModal = new Modal(modal.value)
  }
  // console.log("hotel", props.hotel);
  // console.log("房價", props.roomtype_id);
  // console.log("會員資料",props.userName,props.memberId);
})

function openModal() {
  const qty = props.hotel?.qtyStatus?.[0]

  let hasRoom = false
  switch (props.roomName) {
    case '小型犬房':
      hasRoom = qty?.smallDogRoom > 0
      break
    case '中型犬房':
      hasRoom = qty?.middleDogRoom > 0
      break
    case '大型犬房':
      hasRoom = qty?.bigDogRoom > 0
      break
    case '貓咪房':
      hasRoom = qty?.catRoom > 0
      break
  }

  if (hasRoom) {
    bsModal?.show()
    
  } else {
    Swal.fire({
      icon: 'warning',
      title: '沒有空房！',
      showConfirmButton: true,
      confirmButtonColor: '#ACC572',
    })
  }
}

const checkInDate = ref(props.checkInDate);
const checkOutDate = ref(props.checkOutDate);
const requiredRooms = ref(props.requiredRooms);
const hotelId = ref(props.hotel.id);
const hotels = ref(props.hotel);
const AdditionalMessage = ref('');
const hotelImage = ref(props.hotelImage);  //旅館第一張照片
function saveOrderInfo() {
    const backenedItem = {
      hotelId : props.hotel?.id,
      roomDetailId : props.roomtype_id,  //房型Id
      checkIn : props.checkInDate,
      checkOut : props.checkOutDate,
      roomQty : props.requiredRooms,  //房間數
      additionalMessage: AdditionalMessage.value,//備註
    }

    const cartItem = {
        backenedItem,
        hotelName:props.hotel?.name,
        roomName: props.roomName,
        pricePerRoom: props.price,
        hotelImage: hotelImage.value    //旅館第一張照片
    }
    cartStore.addItemToHotelCart(cartItem)

    Swal.fire({
      icon: 'success',
      title: '已加入購物車',
      showConfirmButton: true,
      confirmButtonColor: '#ACC572',
    })
    bsModal.hide()
  }

//備註的字數限制
  function checkLength() {
    // 字數超過100的部分截斷
    if (AdditionalMessage.value.length > 100) {
      AdditionalMessage.value = AdditionalMessage.value.slice(0, 100)
    }
  }

  const isOver100 = computed(() => {
    return AdditionalMessage.value.length >= 100
  });
</script>

    
<style scoped>
    .orderBox {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        height: 600px;
    }

    label {
        display: block;
        margin-bottom: 3px;
    }

    .btn {
        background-color: rgb(235, 207, 170);
        display: block; 
        justify-content: center;
    }
    textarea {
        width: 100%;
        resize: none;
    }

    .countHint-gray {
        text-align: right;
        color: rgb(150, 150, 150);
    }
    .countHint-red {
        text-align: right;
        color: rgb(255, 107, 97);
    }
    
    .btn-center {
        display: flex;
        justify-content: center;
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
</style>