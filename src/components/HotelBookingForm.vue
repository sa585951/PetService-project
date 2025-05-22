<template>
  <div>
    <!-- 彈窗 -->
    <div class="modal fade orderBox" id="bookingModal" tabindex="-1" aria-labelledby="bookingModalLabel" aria-hidden="true" ref="modal">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="bookingModalLabel">確認訂房資訊</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉"></button>
          </div>
          <div class="modal-body" >
            
            <div>
                <label for="">姓名: {{props.userName}}</label>
                <label for="">旅館名稱 : {{hotel.name}}</label>
                <label for="">房型 : {{props.roomName}}</label>
                <label for="">單價 : {{props.price}}</label>
                <label for="">入住日期 : {{checkInDate}}</label>
                <label for="">退房日期 : {{checkOutDate}}</label>
                <label for="">房間數 : {{requiredRooms}}</label>
                
                <label>備註:</label>
                <textarea v-model="AdditionlMessage" rows="4"></textarea>
                <button @click="saveOrderInfo()">確認</button>
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
  import GoButton from '@/components/HotelBookingButton.vue';
import { defineProps, onMounted, ref } from 'vue'
import { Modal } from 'bootstrap'

const props = defineProps({
  hotel: Object,
  roomName: String,
  memberId : String,
  userName: String,
  checkInDate: String,
  checkOutDate: String,
  requiredRooms: Number,
  price: Number,
  roomtype_id: Number
})

const modal = ref(null)
let bsModal = null

onMounted(() => {
  if (modal.value) {
    bsModal = new Modal(modal.value)
  }
  console.log("hotel", props.hotel);
  console.log("房價", props.roomtype_id);
  console.log("會員資料",props.userName,props.memberId);
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
    alert('沒有空房！')
  }
}

const checkInDate = ref(props.checkInDate);
const checkOutDate = ref(props.checkOutDate);
const requiredRooms = ref(props.requiredRooms);
const hotelId = ref(props.hotel.id);
const hotels = ref(props.hotel);
const AdditionlMessage = ref('');

function saveOrderInfo() {
        const orderInfo = {
            "HotelId" : hotelId.value,
            "RoomDetailId" : props.roomtype_id,  //房型Id
            "CheckIn" : checkInDate.value,
            "CheckOut" : checkOutDate.value,
            "RoomQty" : requiredRooms.value,  //房間數
            "AdditionlMessage" : AdditionlMessage.value,//備註
        }
        // 讀出目前的資料（如果沒有就預設是空陣列）
        const NewOrders = JSON.parse(localStorage.getItem('orderInfos') || '[]');

        // 加入新的 orderInfo
        NewOrders.push(orderInfo);

        // 存回 localStorage
        localStorage.setItem('orderInfos', JSON.stringify(NewOrders));

        console.log(orderInfo);
    }
</script>

    
<style scoped>
    .orderBox {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        height: 500px;
    }
</style>