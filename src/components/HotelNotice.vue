<template>
  <div class="modal fade" id="userNoticeModal" tabindex="-1" aria-labelledby="userNoticeLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
            寵物房型推薦
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