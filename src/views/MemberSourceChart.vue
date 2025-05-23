<template>
     <div class="p-4 welcome-container ">
    <div class="welcome-card">
        <h2 class="text-xl font-bold mb-4">即時會員來源統計</h2>
        <canvas id="sourceChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import Chart from 'chart.js/auto'

let chart = null
let socket = null

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: '會員來源選擇百分比',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
  ],
})

onMounted(() => {
  const ctx = document.getElementById('sourceChart').getContext('2d')
  console.log('ctx:', ctx)
  chart = new Chart(ctx, {
    type: 'bar',
    data: chartData.value,
    options: {
        responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value + '%';
          },
        },
      },
      }
    },
  })

  socket = new WebSocket(`wss://localhost:7089/ws/membersource`) // ✅ 替換為你的 WebSocket URL

  socket.onmessage = (event) => {
    try{
        const data = JSON.parse(event.data)
        chart.data.labels = data.map(item => item.sourceName)
        chart.data.datasets[0].data = data.map(item => item.percentage)
        chart.update()
    }catch(error){
        console.error('WebSocket 資料解析錯誤:', error)
    }    
  }

  socket.onerror = (err) => {
    console.error('WebSocket 錯誤:', err)
  }

  socket.onclose = () => {
    console.log('WebSocket 已關閉')
  }
})

onBeforeUnmount(() => {
  if (socket) {
    socket.close()
  }
})
</script>

<style scoped>
 .welcome-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
min-height:200px;
  padding: 20px;
  overflow: hidden;
}

  .welcome-card {
      align-items: center;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 600px;
  overflow: hidden;
  text-align: center;
}

</style>