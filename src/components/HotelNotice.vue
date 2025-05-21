<template>
  <div class="modal fade" id="userNoticeModal" tabindex="-1" aria-labelledby="userNoticeLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="userNoticeLabel">使用者須知</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉"></button>
        </div>
        <div class="modal-body">
            這裡是使用者須知內容...
          
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">我知道了</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'

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

</style>