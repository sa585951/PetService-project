<template>
<div>
    <!-- 彈窗 -->
    <div class="modal fade" id="mapModal" tabindex="-1" aria-labelledby="mapModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="mapModalLabel">地址</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉"></button>
          </div>
          <!-- 阻止點擊地圖時關閉 modal -->
          <div class="modal-body" @click.stop>
            <div id="map"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 觸發按鈕 -->
    <GoButton data-bs-toggle="modal" data-bs-target="#mapModal">
      查看地圖
    </GoButton>
  </div>
</template>
    
<script setup>
import GoButton from '@/components/HotelBookingButton.vue';
    import { onMounted } from 'vue'
import L from 'leaflet'

onMounted(() => {
  const modalEl = document.getElementById('mapModal')
  let mapInstance = null

  modalEl.addEventListener('shown.bs.modal', () => {
    if (mapInstance) return

    mapInstance = L.map('map').setView([22.6167880, 120.3061829], 16)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance)
    L.marker([22.6167880, 120.3061829]).addTo(mapInstance)
  })
})
</script>
    
<style scoped>
    #map {
        height: 500px; width: 100%;
    }
</style>