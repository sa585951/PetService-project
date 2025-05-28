<template>
  <div class="container-fluid">
    <div class="row">
      <MemberSidebar />
      <div class="col-md-10 p-r content-area">
          <div class="p-4 welcome-container">
            <div class="charts-row">
              <div class="chart-col">
                <div class="welcome-card">
                  <h2 class="text-xl font-bold mb-4">即時會員來源統計</h2>
                  <canvas id="sourceChart"></canvas>
                </div>
              </div>
              <div class="chart-col">
                <div class="welcome-card">
                  <h2 class="text-xl font-bold mb-4">每日註冊會員統計</h2>
                  <canvas id="signupChart"></canvas>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import Chart from 'chart.js/auto'
import MemberSidebar from '@/components/MemberSidebar.vue'

let sourceChart = null
let signupChart = null
let socket = null

const sourceData = ref({
  labels: [],
  datasets: [
    {
      label: '會員來源選擇百分比',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
  ],
})

const signupData = ref({
  labels: [],
  datasets: [
    {
      label: '每日註冊人數',
      data: [],
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
    },
  ],
})

const drawLineChart = (data) => {
  if (signupChart) {
    signupChart.destroy(); // 銷毀舊的圖表
  }

  const labels = Object.keys(data); // 取得日期作為標籤
  const values = Object.values(data); // 取得對應的註冊人數

  signupData.value = {
    labels: labels,
    datasets: [
      {
        label: '每日註冊人數',
        data: values,
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  const signupCtx = document.getElementById('signupChart').getContext('2d');
  signupChart = new Chart(signupCtx, {
    type: 'line', // 使用折線圖
    data: signupData.value,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '註冊人數',
          },
           ticks: {
            precision: 0 // 設成0表示不顯示小數點（整數）
          }
        },
        x: {
          title: {
            display: true,
            text: '日期',
          },
        },
      },
    },
  });
};

const drawBarChart = (data) => {
  const sourceCtx = document.getElementById('sourceChart').getContext('2d');
  console.log('sourceData.value:', sourceData.value)
  if (!sourceCtx) {
    console.error('找不到 sourceChart 的 canvas context');
    return;
  }

  if(sourceChart){
    sourceChart.destroy();
  }

  const labels = data.map(item=>item.sourceName);
  const values = data.map(item=>item.percentage);
  const backgroundColors = labels.map((_, index) => `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`);

  sourceData.value = {
    labels: labels,
    datasets: [
      {
        label: '會員來源選擇百分比',
        data: values,
        backgroundColor: backgroundColors,
      },
    ],
  };

  sourceChart = new Chart(sourceCtx, {
    type: 'bar', 
    data: sourceData.value,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return value + '%'; // 顯示百分比符號
            },
          },
          title: {
            display: true,
            text: '百分比', // Y 軸標題
          },
        },
        x: {
          title: {
            display: true,
            text: '會員來源', // X 軸標題
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.formattedValue || '';
              return `${label}: ${value}%`;
            }
          }
        }
      }
    },
  });
};

onMounted(() => {
  const sourceCtx = document.getElementById('sourceChart')
  const signupCtx = document.getElementById('signupChart').getContext('2d')
  console.log('sourcectx:', sourceCtx)


   // 初始化空的折線圖
  signupChart = new Chart(signupCtx, {
    type: 'line',
    data: signupData.value,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '註冊人數',
          },
        },
        x: {
          title: {
            display: true,
            text: '日期',
          },
        },
      },
    },
  });

  sourceChart = new Chart(sourceCtx, {
    type: 'bar',
    data: sourceData.value,
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

  const token = localStorage.getItem('token')
  socket = new WebSocket(`wss://localhost:7089/ws/membersource?token=${token}`) // ✅ 替換為你的 WebSocket URL

  socket.onmessage = (event) => {
    try{
        const message = JSON.parse(event.data);
    switch (message.type) {
      case "daily_registrations":
        drawLineChart(message.data); // 將日期對應數量畫折線圖
        break;
      case "member_source_percentages":
        drawBarChart(message.data); // 將來源百分比畫圓餅圖
        break;
  }
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
  min-height: 200px;
  padding: 20px;
  overflow: hidden;
}

.charts-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  justify-content: center;
}

.chart-col {
  flex: 1;
  min-width: 0; /* 防止 flex item 超出容器 */
  max-width: 600px;
}

.welcome-card {
  min-height: 200px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  overflow: hidden;
  text-align: center;
}

.content-area {
  /* 確保內容區域不會被Sidebar覆蓋 */
  margin-left: auto; /* 配合Sidebar的寬度調整 */
}

/* 當螢幕寬度小於等於 50% 的常見桌面大小時（約768px），改為上下排列 */
@media (max-width: 768px) {
  .charts-row {
    flex-direction: column;
    align-items: center;
  }
  
  .chart-col {
    flex: none;
    width: 100%;
    max-width: none;
    margin-bottom: 20px;
  }
  
  .chart-col:last-child {
    margin-bottom: 0;
  }
  
  .welcome-card {
    padding: 30px 20px; /* 在小螢幕上減少內邊距 */
  }
}

/* 額外的小屏幕優化 */
@media (max-width: 480px) {
  .welcome-container {
    padding: 10px;
  }
  
  .welcome-card {
    padding: 20px 15px;
  }
}
</style>