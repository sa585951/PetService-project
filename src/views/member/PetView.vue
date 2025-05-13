<template>
    <div class="container-fluid">
        <div class="row">
            <MemberSidebar />

            <div class="col-md-10 p-4 content-area">
                <div class="card shadow-sm">
                    <div class="card-header d-flex align-items-center justify-content-between">
                        <span>我的寵物</span>
                        <button class="btn btn-add" @click="addNewPet">
                            <i class="bi bi-plus-lg"></i> 新增寵物
                        </button>
                    </div>
                    <div class="card-body">
                        <div v-if="pets.length === 0" class="text-center p-5 text-muted">
                            目前沒有寵物資料。點擊上方按鈕新增您的第一隻寵物！
                        </div>
                        <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            <div class="col" v-for="pet in pets" :key="pet.id">
                                <div class="pet-card card h-100 position-relative shadow-sm">
                                    <img :src="getPetPhotoUrl(pet.photoUrl)" class="card-img-top pet-photo" :alt="pet.name">
                                    <div class="card-body">
                                        <h5 class="card-title">{{ pet.name }}</h5>
                                        <p class="card-text mb-1"><strong>年齡:</strong> {{ calculateAge(pet.birthday) }} 歲</p>
                                        <p class="card-text"><strong>生日:</strong> {{ formatBirthday(pet.birthday) }}</p>
                                    </div>
                                    <div class="pet-edit-overlay" @click="editPet(pet.id)">
                                        <i class="bi bi-pencil-square edit-icon"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import MemberSidebar from '@/components/MemberSidebar.vue'; // 確保路徑正確
import { useAuthStore } from '@/stores/authStore'; // 假設您有身份驗證的 store

const authStore = useAuthStore();
const router = useRouter();

const baseAddress = 'https://localhost:7150'; // 您的 API 基礎位址
const defaultPetPhoto = '/assets/picture/default-pet.png'; // 預設寵物圖片路徑，請確保存在

const pets = ref([]); // 用於儲存寵物資料的響應式陣列

// 載入寵物資料的函式
const fetchPets = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert('您尚未登入，請先登入。');
        router.push('/login');
        return;
    }

    try {
        // 假設後端 API 路徑為 /api/Member/GetPets
        const response = await axios.get(`${baseAddress}/api/Member/GetPets`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // 假設 API 回傳的資料是一個陣列，每個元素是寵物物件
        // 範例資料結構: [{ id: 1, name: '皮皮', photoUrl: '/uploads/pets/pipi.jpg', birthday: '2020-05-10' }]
        pets.value = response.data || [];
        console.log('寵物資料載入成功:', pets.value);

    } catch (error) {
        console.error('載入寵物資料失敗:', error);
        if (error.response && error.response.status === 401) {
            alert('登入狀態已過期，請重新登入。');
            router.push('/login');
        } else {
            alert('載入寵物資料失敗，請稍後再試。');
        }
    }
};

// 處理寵物圖片 URL
const getPetPhotoUrl = (photoUrl) => {
    if (photoUrl && (photoUrl.startsWith('http://') || photoUrl.startsWith('https://'))) {
        return photoUrl; // 如果是完整 URL
    } else if (photoUrl && photoUrl.startsWith('/')) {
        return `${baseAddress}${photoUrl}`; // 如果是相對路徑，加上 baseAddress
    } else if (photoUrl) {
        return `${baseAddress}/${photoUrl}`; // 如果是相對路徑，且沒有 / 開頭
    }
    return defaultPetPhoto; // 否則回傳預設圖片
};

// 計算寵物年齡
const calculateAge = (birthday) => {
    if (!birthday) return '未知';
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// 格式化生日顯示
const formatBirthday = (birthday) => {
    if (!birthday) return '未知';
    const date = new Date(birthday);
    return date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
};


// 點擊編輯按鈕
const editPet = (petId) => {
    // 假設編輯頁面的路由是 /member/pet/edit/:id
    router.push(`/member/pet/edit/${petId}`);
};

// 點擊新增寵物按鈕
const addNewPet = () => {
    // 假設新增寵物頁面的路由是 /member/pet/add
    router.push('/member/pet/add');
};

// 元件掛載時載入資料
onMounted(() => {
    fetchPets();
});

// 設置側邊欄活躍狀態 (如果 MemberSidebar 需要)
const activeTab = ref('pet');
const setActiveTab = (tabName) => {
    activeTab.value = tabName;
    const routeMap = {
        'memberdashboard': '/memberdashboard',
        'profile': '/profile',
        'orders': '/member/orders',
        'pet': '/pet'
    };
    if (routeMap[tabName]) {
        router.push(routeMap[tabName]);
    }
};
// 在 onMounted 或任何需要的地方呼叫 setActiveTab('pet');
onMounted(() => {
  fetchPets();
  setActiveTab('pet'); // 確保寵物頁面在側邊欄中被選中
});
</script>

<style scoped>
/* 從會員資料頁面複製類似的樣式 */
.content-area {
    min-height: calc(100vh - 56px); /* 假設頂部有 56px 的導航欄 */
}

.card {
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    border: none;
}
.card-header {
    background-color: white;
    border-bottom: 1px solid #eee;
    font-weight: bold;
    padding: 15px 20px;
    border-top-left-radius: 15px !important;
    border-top-right-radius: 15px !important;
    border-radius: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.pet-card {
    border-radius: 0.5rem;
    overflow: hidden; /* 確保圖片圓角 */
}

.pet-photo {
    width: 100%;
    height: 200px; /* 圖片高度固定 */
    object-fit: cover; /* 裁切圖片以填滿空間 */
    border-bottom: 1px solid #eee;
}

.pet-edit-overlay {
    position: absolute;
    top: 0.5rem; /* 距離卡片頂部 */
    right: 0.5rem; /* 距離卡片右側 */
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    opacity: 0.8; /* 預設可見一點 */
    transition: opacity 0.2s ease;
}

.pet-edit-overlay:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.8);
}

.edit-icon {
    color: white;
    font-size: 1.5rem;
}
.btn-add {
    background-color: #ACC572;
    border-color: #ACC572;
}

/* 其他您可以從會員資料頁面複製的通用樣式 */
/* .card-header, .card-body 等 */
</style>