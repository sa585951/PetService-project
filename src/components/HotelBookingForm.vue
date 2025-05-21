<template>
  <div>
    <!-- 彈窗 -->
    <div class="modal fade" id="bookingModal" tabindex="-1" aria-labelledby="bookingModalLabel" aria-hidden="true" ref="modal">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="bookingModalLabel">預定 : {{ roomName }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉"></button>
          </div>
          <div class="modal-body" @click.stop>
            <div>
                <label></label>
                <input/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 按鈕 -->
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
})

const modal = ref(null)
let bsModal = null

onMounted(() => {
  if (modal.value) {
    bsModal = new Modal(modal.value)
  }
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
</script>

    
<style scoped>
    
</style>