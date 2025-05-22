<template>
  <div class="modal fade" id="userNoticeModal" tabindex="-1" aria-labelledby="userNoticeLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
<div class="pet-room-modal">
  <div class="pet-card">
    <h4 class="pet-title">
      <i class="bi bi-house-heart me-2"></i>寵物房型推薦
    </h4>

    <div class="pet-section pet-body-size">
      <h6 class="section-title">🐾 體型對照表</h6>
      <ul  class="custom-bullet">
        <li>小型犬：<strong>9 公斤以下</strong></li>
        <li>中型犬：<strong>9 ～ 25 公斤</strong></li>
        <li>大型犬：<strong>25 公斤以上</strong></li>
      </ul>
    </div>

    <div class="pet-section">
      <h6 class="section-title">🏠 房型建議</h6>

      <div class="room-block room-small">
        <h6>小型犬房</h6>
        <ul>
          <li>1 隻中型犬</li>
          <li>最多 2 隻小於 5 公斤的小型犬</li>
        </ul>
      </div>

      <div class="room-block room-medium">
        <h6>中型犬房</h6>
        <ul>
          <li>2 隻小型犬</li>
          <li>1 隻中型犬 + 1 隻小型犬</li>
        </ul>
        <div class="warning">
          <i class="bi bi-exclamation-triangle me-1"></i>
          2 隻中型犬會偏擠，僅適合短時間入住
          <i class="bi bi-exclamation-triangle me-1"></i>
        </div>
      </div>

      <div class="room-block room-large">
        <h6>大型犬房</h6>
        <ul>
          <li>2 隻中型犬</li>
          <li>1 隻大型犬 + 1 隻小型或中型犬</li>
        </ul>
      </div>
    </div>

    <div class="text-end mt-4">
      <button type="button" class="btn" data-bs-dismiss="modal">我知道了</button>
    </div>
  </div>
</div>



      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import IKnowButton from './HotelBookingButton.vue'

const modal = ref(null)
let bsModal = null

function show() {
  if (bsModal) {
    bsModal.show()
  }
}

onMounted(() => {
  if (modal.value) {
    bsModal = new Modal(modal.value)
  }
})

defineExpose({ show })
</script>

<style scoped>
.pet-room-modal {
  padding: 1rem;
}

.pet-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
}

.pet-title {
  color: rgb(175, 115, 42);
  font-weight: 700;
  margin-bottom: 1.2rem;
}

.pet-section {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

.section-title {
  color: #6c757d;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.pet-body-size ul,
.room-block ul {
  list-style: none;
  padding-left: 1rem;
  margin-bottom: 0.5rem;
}

.pet-body-size li::before {
  content: '•';
  color: #6c757d;
  display: inline-block;
  width: 1rem;
  margin-left: -1rem;
}

.room-block {
  border-left: 4px solid #dee2e6;
  padding-left: 1rem;
  margin-bottom: 1.2rem;
}

.room-small {
  border-color: #aec970;
}

.room-medium {
  border-color: #d8be6a;
}

.room-large {
  border-color: rgb(218, 177, 123);
}

.room-block h6 {
  font-weight: bold;
  margin-bottom: 0.4rem;
}

.warning {
  color: rgb(156, 96, 21);
  font-size: 1rem;
  margin-top: 0.25rem;
}

.btn-primary {
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
}

.custom-bullet {
  list-style: none;
  padding-left: 1rem;
  margin-bottom: 0.5rem;
}

.custom-bullet li {
  position: relative;
  padding-left: 0.5rem;
  margin-bottom: 0.3rem;
  
}

.custom-bullet li::before {
  content: '';
  position: absolute;
  left: 0.8rem;
  top: 0.5em;
  width: 0.4em;
  height: 0.4em;
  background-color: rgb(175, 115, 42);
  transform: rotate(45deg); /* 正方形變菱形 */
  border-radius: 1px;
}
.btn {
  background-color: rgb(235, 207, 170);
}

</style>