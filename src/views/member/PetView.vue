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
                                <div class="pet-card card h-100 align-items-center shadow-sm">
                                    <div class="pet-image-wrapper">
                                        <img :src="getPetPhotoUrl(pet.petImagePath)" class="card-img-top pet-photo" :alt="pet.petName">             
                                    </div>
                                    <div class="card-body d-flex justify-content-between align-items-start">
                                        <h5 class="card-title me-4">{{ pet.petName }}</h5>
                                        <p class="card-text">
                                            <i class="bi bi-cake2 me-1"></i>
                                            生日: {{ formatBirthday(pet.petBirthday) }}<br>
                                            <i class="bi bi-record2"></i> 體重: {{ pet.petWeight !== null && pet.petWeight !== undefined ? pet.petWeight + '公斤' : '未知' }}<br>
                                            <i class="bi bi-record2"></i> 結紮: {{ getSpayedStatus(pet.petDe) ?? '未知' }}
                                        </p>
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

    <div v-if="isAddPetModalOpen" class="modal fade show d-block" id="addPetModal" tabindex="-1" aria-labelledby="addPetModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content align-items-center">
                <div class="modal-header">
                    <h5 class="modal-title title mb-0" id="addPetModalLabel">
                        新增寵物資料
                    </h5>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="submitNewPet">
                        <div class="form-row text-center">
                            <div class="photo-upload-container">
                                <img :src="newPetPhotoPreview || defaultPetPhoto" alt="寵物照片" class="pet-photo-preview">
                                <label for="petPhotoUpload" class="photo-upload-button">
                                    <i class="bi bi-camera-fill"></i>
                                </label>
                                <input class="photo-file-input" type="file" id="petPhotoUpload" accept="image/*" @change="handlePhotoChange">
                            </div>
                        </div>

                         <!-- 寵物名字 -->
                        <div class="form-row">
                            <label for="petName" class="form-label">
                                寵物名字
                            </label>
                            <div class="input-icon">                                
                                <input type="text" class="form-control" id="petName" v-model="newPet.petName" placeholder="請輸入寵物名字" >
                            </div>
                        </div>

                        <!-- 生日 -->
                        <div class="form-row">
                            <label for="petBirthday" class="form-label">
                                生日
                            </label>
                            <input type="date" :max="maxDate" class="form-control" id="petBirthday" v-model="newPet.petBirthday">
                        </div>

                        <!-- 體重 -->
                        <div class="form-row">
                            <label for="petWeight" class="form-label">
                                體重 (公斤)
                            </label>
                            <div class="input-icon">                                
                                <input type="number" class="form-control" id="petWeight" v-model="newPet.petWeight" placeholder="0" step="1" >
                            </div>
                        </div>

                        <!-- 結紮狀態 -->
                        <div class="form-row">
                            <label class="form-label">
                                結紮
                            </label>
                            <div class="d-flex flex-wrap gap-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="spayedNeutered" id="spayedTrue" :value="1" v-model="newPet.petDe">
                                    <label class="form-check-label" for="spayedTrue">
                                        已結紮
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="spayedNeutered" id="spayedFalse" :value="0" v-model="newPet.petDe">
                                    <label class="form-check-label" for="spayedFalse">
                                        未結紮
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="spayedNeutered" id="spayedUnknown" :value="2" v-model="newPet.petDe">
                                    <label class="form-check-label" for="spayedUnknown">
                                        不確定
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- 按鈕區域 -->
                        <div class="d-flex justify-content-end mt-4 gap-2">
                            <button type="button" class="btn btn-secondary" @click="closeAddPetModal">
                                <i class="bi bi-x-lg me-1"></i>取消
                            </button>
                            <button type="button" @click="submitNewPet" class="btn btn-primary">
                                <i class="bi bi-check-lg me-1"></i>儲存寵物
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>


    <div v-if="isEditPetModalOpen" class="modal fade show d-block" id="editPetModal" tabindex="-1" aria-labelledby="editPetModalLabel" aria-hidden="true">
       <div class="modal-dialog modal-lg">
            <div class="modal-content align-items-center">
                <div class="modal-header">
                    <h5 class="modal-title title mb-0" id="editPetModalLabel">
                        編輯寵物資料
                    </h5>                    
                </div>
                <div class="modal-body" v-if="editingPet">
                    <form @submit.prevent="submitEditPet">
                        <!-- 照片上傳區域 -->
                        <div class="form-row text-center">
                            <div class="photo-upload-container">
                                <img :src="editingPetPhotoPreview || getPetPhotoUrl(editingPet.petImagePath) || defaultPetPhoto" alt="寵物照片" class="pet-photo-preview">
                                <label for="editPetPhotoUpload" class="photo-upload-button">
                                    <i class="bi bi-camera-fill"></i>
                                </label>
                                <input class="photo-file-input" type="file" id="editPetPhotoUpload" accept="image/*" @change="handleEditPhotoChange">
                            </div>
                        </div>

                        <!-- 寵物名字 -->
                        <div class="form-row">
                            <label for="editPetName" class="form-label">
                                寵物名字
                            </label>
                            <div class="input-icon">                        
                                <input type="text" class="form-control" id="editPetName" v-model="editingPet.petName" placeholder="請輸入寵物的名字" >
                            </div>
                        </div>

                        <!-- 生日 -->
                        <div class="form-row">
                            <label for="editPetBirthday" class="form-label">
                                生日
                            </label>
                            <input type="date" :max="maxDate" class="form-control" id="editPetBirthday" v-model="editingPet.petBirthday">
                        </div>

                        <!-- 體重 -->
                        <div class="form-row">
                            <label for="editPetWeight" class="form-label">
                                體重 (公斤)
                            </label>
                            <div class="input-icon">                               
                                <input type="number" class="form-control" id="editPetWeight" v-model="editingPet.petWeight" placeholder="0" step="1" >
                            </div>
                        </div>

                        <!-- 結紮狀態 -->
                        <div class="form-row">
                            <label class="form-label">
                                結紮
                            </label>
                            <div class="d-flex flex-wrap gap-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="editSpayedNeutered" id="editSpayedTrue" :value="1" v-model="editingPet.petDe">
                                    <label class="form-check-label" for="editSpayedTrue">
                                        已結紮
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="editSpayedNeutered" id="editSpayedFalse" :value="0" v-model="editingPet.petDe">
                                    <label class="form-check-label" for="editSpayedFalse">
                                        未結紮
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="editSpayedNeutered" id="editSpayedUnknown" :value="2" v-model="editingPet.petDe">
                                    <label class="form-check-label" for="editSpayedUnknown">
                                        不確定
                                    </label>
                                </div>
                            </div>
                        </div>
                        <!-- 按鈕區域 -->
                        <div class="d-flex justify-content-between align-items-center mt-4 gap-2">
                            <div>
                                <button type="button" class="btn btn-delete" @click="deletePet(editingPet.id)">
                                <i class="bi bi-trash3"></i>
                            </button>
                            </div>
                            <div>
                                <button type="button" class="btn btn-secondary" @click="closeEditPetModal">
                                    <i class="bi bi-x-lg me-1"></i>取消
                                </button>
                                <button type="button" @click="submitEditPet" class="btn btn-primary">
                                    <i class="bi bi-check-lg me-1"></i>儲存變更
                                </button>
                        </div>


                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div v-if="isAddPetModalOpen || isEditPetModalOpen" class="modal-backdrop fade show"></div>

</template>

<script setup>
import { ref, onMounted, nextTick,watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import MemberSidebar from '@/components/MemberSidebar.vue';
import { useAuthStore } from '@/stores/authStore';
import defaultPetAvatarImage from '@/assets/picture/paws-avatar.png';
import { Modal } from 'bootstrap'; // 確保這裡正確導入 Modal
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const router = useRouter();

const baseAddress = 'https://localhost:7089';
const defaultPetPhoto = defaultPetAvatarImage;

const pets = ref([]);
const maxDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0] // 'YYYY-MM-DD'
})
// 新增寵物 Modal 狀態和數據
const isAddPetModalOpen = ref(false);
const newPet = ref({
    petId:null,
    petName: '',
    petBirthday: '', // YYYY-MM-DD 字串
    petWeight: null,
    petDe: 2, // int 狀態 (0:否, 1:是, 2:未知)
});
const newPetPhotoFile = ref(null);
const newPetPhotoPreview = ref(null);


// 編輯寵物 Modal 狀態和數據
const isEditPetModalOpen = ref(false);
const editingPet = ref(null); // 或 ref({})
const editingPetPhotoFile = ref(null);
const editingPetPhotoPreview = ref(null);

// 載入寵物資料的函式
const fetchPets = async () => {
    console.table(pets.value); // 加上這行看看實際拿到什麼
    const token = localStorage.getItem("token");
    if (!token) {
        alert('您尚未登入，請先登入。');
        router.push('/login');
        return;
    }
    try {
        const response = await axios.get(`${baseAddress}/api/Pet/GetPetData`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        // 假設後端返回的 DTO 屬性名是 camelCase，例如 { id: 1, petName: '...', petAge: 3, petBirthday: 'YYYY-MM-DD', petWeight: 5.5, petDe: 1, petImagePath: '...' }
        pets.value = response.data || [];
        console.log('寵物資料載入成功:', pets.value);
    } catch (error) {
        console.error('載入寵物資料失敗:', error);
        if (error.response && error.response.status === 401) {
            alert('登入狀態已過期，請重新登入。');
            // authStore.logout(); // 如果有 logout action
            router.push('/login');
        } else {
            alert('載入寵物資料失敗，請稍後再試。' + (error.response?.data?.message || error.message));
        }
    }
};

// 處理寵物圖片 URL
const getPetPhotoUrl = (photoPath) => {
    if (photoPath && (photoPath.startsWith('http://') || photoPath.startsWith('https://'))) {
        return photoPath;
    } else if (photoPath && photoPath.startsWith('/')) {
        return `${baseAddress}${photoPath}`;
    } else if (photoPath) {
        return `${baseAddress}/${photoPath}`;
    }
    return defaultPetPhoto; // 否則回傳預設圖片
};

// 格式化生日為本地日期字串
const formatBirthday = (birthday) => {
    if (!birthday) return '未知';
    try {
        const date = new Date(birthday);
        if (!isNaN(date.getTime())) {
            return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
        } else {
            return '格式錯誤';
        }
    } catch {
        return '格式錯誤';
    }
};

// 轉換結紮狀態顯示文本 (接收 int 值 0, 1, 2)
const getSpayedStatus = (statusInt) => {
    switch (statusInt) {
        case 0: return '未結紮';
        case 1: return '已結紮';
        case 2: return '不確定';
        default: return '未知';
    }
};

// --- 新增寵物相關函式 ---

// 開啟新增寵物 Modal
const addNewPet = () => {
    // 重置表單數據
    newPet.value = {
        petName: '',
        petBirthday: '', // YYYY-MM-DD 字串
        petWeight: null,
        petDe: 2, // 預設未知
    };
    newPetPhotoFile.value = null;
    newPetPhotoPreview.value = null;

    isAddPetModalOpen.value = true;

    nextTick(() => {
        // 使用精確的 ID 選擇器來避免選錯 Modal
        const modalElement = document.getElementById('addPetModal');
        if (modalElement) {
            const modal = new Modal(modalElement);
            modal.show();
            // 監聽 Modal 關閉事件，以便在 Modal 實際關閉時重置狀態
            modalElement.addEventListener('hidden.bs.modal', () => {
                isAddPetModalOpen.value = false;
            }, { once: true });
        }
    });
};

// 關閉新增寵物 Modal
const closeAddPetModal = () => {
    // 使用精確的 ID 選擇器
    const modalElement = document.getElementById('addPetModal');
    if (modalElement) {
        const modal = Modal.getInstance(modalElement);
        if (modal) {
            modal.hide(); // 呼叫 Bootstrap 的 hide 方法
        } else {
             // 如果沒有實例，直接改變狀態 (通常不會走到這裡如果打開流程正確)
             isAddPetModalOpen.value = false;
        }
    } else {
         // 如果 Modal DOM 已經被 v-if 移除 (例如快速點擊取消)，直接改變狀態
         isAddPetModalOpen.value = false;
    }
    // 不在這裡清空 newPet.value，留待下次打開時重置
};

// 處理新增 Modal 的檔案選擇
const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        newPetPhotoFile.value = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            newPetPhotoPreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        newPetPhotoFile.value = null;
        newPetPhotoPreview.value = null;
    }
};

// 提交新增寵物表單
const submitNewPet = async () => {
 if (!newPet.value.petName || newPet.value.petName.trim() === '') {
        //alert('請輸入寵物名字');
        Swal.fire({
            text:"請輸入寵物名字",
            confirmButtonColor: '#ACC572',
        })
        return;
    }
    if (newPet.value.petWeight === null || newPet.value.petWeight === undefined || newPet.value.petWeight === '') {
        //alert('請輸入寵物體重');
        Swal.fire({
            text:"請輸入寵物體重",
            confirmButtonColor: '#ACC572',
        })
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        alert('您尚未登入，請先登入。');
        router.push('/login');
        return;
    }

    let uploadedPhotoUrl = null;

    // 1. 如果有選擇照片，先上傳照片
    if (newPetPhotoFile.value) {
        const formData = new FormData();
        formData.append('file', newPetPhotoFile.value);

        try {
            const uploadResponse = await axios.post(`${baseAddress}/api/Pet/UploadPetPhoto`, formData, {
                 headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
            });
            uploadedPhotoUrl = uploadResponse.data.petPhotoUrl; // 假設後端回傳 petPhotoUrl
            console.log('照片上傳成功:', uploadedPhotoUrl);
        } catch (uploadError) {
             console.error('照片上傳失敗:', uploadError);
             alert('寵物照片上傳失敗，請稍後再試。');
             return;
        }
    }

    // 2. 準備新增寵物的數據 DTO
    const petDataForAdd = {
        petName: newPet.value.petName,
        petBirthday: newPet.value.petBirthday.trim() === '' ? null : newPet.value.petBirthday,
        petWeight: Number(newPet.value.petWeight),
        petDe: newPet.value.petDe ?? null,
        ...(uploadedPhotoUrl ? { petAvatarUrl: uploadedPhotoUrl } : {})
    };

    console.log("新增寵物資料：", petDataForAdd);

     // 3. 呼叫後端 API 新增寵物
     try {
         const addResponse = await axios.post(`${baseAddress}/api/Pet/AddPet`, petDataForAdd, {
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
         });

         console.log('寵物新增成功:', addResponse.data);
         //alert('寵物新增成功！');
         Swal.fire({
             text:"寵物新增成功",
             confirmButtonColor: '#ACC572',
         })

         closeAddPetModal(); // 關閉 Modal
         fetchPets(); // 重新載入列表

     } catch (addError) {
         console.error('新增寵物失敗:', addError);
         alert('新增寵物失敗，請稍後再試。' + (addError.response?.data?.message || addError.message));
     }
};


// --- 編輯寵物相關函式 ---

// 開啟編輯寵物 Modal
const editPet = (petId) => {
console.table(pets.value);


    const petToEdit = pets.value.find(p => p.id === Number(petId));
 // 假設 pet 對象有 id 屬性

     if (!petToEdit) {
         alert('找不到寵物資料！');
         return;
     }

     // 複製寵物資料到 editingPet，避免直接修改列表中的數據
     // 使用深複製，確保嵌套對象或陣列也被複製
     editingPet.value = JSON.parse(JSON.stringify(petToEdit));

     // 設置編輯 Modal 的照片預覽 (使用現有照片)
     editingPetPhotoFile.value = null; // 重置檔案選擇
     editingPetPhotoPreview.value = getPetPhotoUrl(editingPet.value.petImagePath); // 使用現有圖片路徑

     // **確保 petBirthday 是 YYYY-MM-DD 格式字串給 input type="date"**
     if (editingPet.value.petBirthday) {
         let date;
         if (editingPet.value.petBirthday instanceof Date) {
             date = editingPet.value.petBirthday;
         } else if (typeof editingPet.value.petBirthday === 'string') {
              try {
                  date = new Date(editingPet.value.petBirthday);
                  if (isNaN(date.getTime())) {
                      date = null;
                  }
              } catch {
                  date = null;
              }
         } else {
             date = null;
         }

         if (date) {
              const year = date.getFullYear();
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              const day = date.getDate().toString().padStart(2, '0');
              editingPet.value.petBirthday = `${year}-${month}-${day}`;
         } else {
              editingPet.value.petBirthday = ''; // 無效日期清空
         }
     } else {
         editingPet.value.petBirthday = ''; // null/undefined 日期清空
     }


     isEditPetModalOpen.value = true; // 打開編輯 Modal

     nextTick(() => {
         // 使用精確的 ID 選擇器
         const modalElement = document.getElementById('editPetModal');
         if (modalElement) {
             const modal = new Modal(modalElement);
             modal.show();
             // 監聽 Modal 關閉事件
             modalElement.addEventListener('hidden.bs.modal', () => {
                 closeEditPetModalStateOnly(); // 只清理狀態，不呼叫 Bootstrap hide()
             }, { once: true });
         }
     });
};

// 關閉編輯寵物 Modal (呼叫 Bootstrap 方法)
const closeEditPetModal = () => {
     // 使用精確的 ID 選擇器
     const modalElement = document.getElementById('editPetModal');
     if (modalElement) {
         const modal = Modal.getInstance(modalElement);
         if (modal) {
            modal.hide(); // 呼叫 Bootstrap 的 hide 方法，會觸發 hidden.bs.modal 事件
         } else {
            closeEditPetModalStateOnly(); // 如果沒有實例，直接清理狀態
         }
     } else {
         closeEditPetModalStateOnly(); // 如果 Modal DOM 已經被移除，直接清理狀態
     }
};

// 關閉編輯寵物 Modal (僅清理狀態)
const closeEditPetModalStateOnly = () => {
    // 延遲清空數據，讓 Modal 退場動畫更順暢
    setTimeout(() => {
        isEditPetModalOpen.value = false;
        editingPet.value = null; // 清空正在編輯的寵物資料
        editingPetPhotoFile.value = null;
        editingPetPhotoPreview.value = null;
    }, 200); // 延遲時間可以根據你的 Modal 過渡動畫調整
};


// 處理編輯 Modal 的檔案選擇
const handleEditPhotoChange = (event) => {
     const file = event.target.files[0];
     if (file) {
         editingPetPhotoFile.value = file;
         const reader = new FileReader();
         reader.onload = (e) => {
             editingPetPhotoPreview.value = e.target.result;
         };
         reader.readAsDataURL(file);
     } else {
         editingPetPhotoFile.value = null;
         // 如果取消選擇檔案，預覽應回到原來的圖片（如果有的話），或預設圖片
         // 使用 editingPet.value?.petImagePath 來安全訪問屬性，以防 editingPet 意外為 null
         editingPetPhotoPreview.value = getPetPhotoUrl(editingPet.value?.petImagePath);
     }
};
watch(() => editingPet.value?.petBirthday, (newValue, oldValue) => {
    console.log('petBirthday 數據變動:', '從', oldValue, '變成', newValue);
    // 在這裡觀察當您選擇日期時，newValue 會變成什麼
});

 const deletePet = async (petIdToDelete) => {
       // 確保 petIdToDelete 是有效的數字
        if (petIdToDelete === undefined || petIdToDelete === null || typeof petIdToDelete !== 'number') {
            console.error('Delete Pet Error: 無效的寵物 ID', petIdToDelete);
            Swal.fire({
                text: "發生錯誤，請稍後嘗試。",
                confirmButtonColor: '#ACC572',
            });
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                text: '您尚未登入，請先登入。',
                confirmButtonColor: '#ACC572',
            }).then(() => {
                router.push('/login');
            });
            return;
        }
        // 1. 顯示確認刪除的 SweetAlert
            const result = await Swal.fire({
                title: "確定刪除嗎？", // Are you sure?
                text: "刪除後將無法復原！", // You won't be able to revert this!
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#ACC572",
                confirmButtonText: "是的，刪除！", // Yes, delete it!
                cancelButtonText: "取消", // Cancel
            });

            // 2. 如果使用者確認刪除
            if (result.isConfirmed) {
                try {
                    // 3. 呼叫後端 API 執行軟刪除
                    // 使用 DELETE 方法，將 ID 放在 URL 中
                    const deleteResponse = await axios.delete(`${baseAddress}/api/Pet/DeletePet/${petIdToDelete}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                        // DELETE 請求通常不需要 Content-Type: application/json header 如果沒有請求體
                    });

                    console.log('寵物刪除成功:', deleteResponse.data);

                    // 4. 顯示刪除成功的 SweetAlert
                    Swal.fire({
                        title: "已刪除！", // Deleted!
                        text: "寵物資料已成功刪除。", // Your pet data has been deleted.
                        icon: "success",
                        confirmButtonColor: '#ACC572',
                    });

                    // 5. 關閉可能的編輯 Modal (如果刪除按鈕在編輯 Modal 中)
                    // 如果刪除按鈕在列表項上，則不需要關閉編輯 Modal
                     closeEditPetModal(); // 根據你的 UI 結構決定是否需要這行

                    // 6. 重新載入寵物列表以反映變更 (後端會過濾掉軟刪除的記錄)
                    fetchPets();

                } catch (error) {
                    // 處理刪除失敗的情況
                    console.error('刪除寵物失敗:', error);
                    Swal.fire({
                        title: "刪除失敗！", // Delete failed!
                        text: '刪除寵物失敗，請稍後再試。' + (error.response?.data?.message || error.message),
                        icon: "error",
                        confirmButtonColor: '#ACC572',
                    });
                }
            } else {
                // 如果使用者取消刪除，可以選擇顯示一個提示或不做任何事
                console.log('使用者取消刪除');
                // Swal.fire("已取消", "您的寵物資料是安全的 :)", "info"); // 可選：顯示取消提示
            }
};

// 提交編輯寵物表單
const submitEditPet = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert('您尚未登入，請先登入。');
        router.push('/login');
        return;
    }

    // 確保有正在編輯的寵物資料
    // 這個檢查應該在錯誤之前，所以理論上錯誤不應該在這裡發生
    if (!editingPet.value || editingPet.value.id === undefined || editingPet.value.id === null) {
         console.error('Submit Edit Error: editingPet.value is null or missing id', editingPet.value);
         alert('無效的編輯資料，請重新嘗試。');
         // 清理並關閉 Modal 以防萬一
         closeEditPetModal();
         return;
    }

    const petIdToUpdate = editingPet.value.id; // 獲取寵物 ID

    let photoUrlForUpdate = null;

    // 1. 如果有選擇新的照片，先上傳
    if (editingPetPhotoFile.value) {
        const formData = new FormData();
        formData.append('file', editingPetPhotoFile.value);

        try {
            // 呼叫 UploadPetAvatar API，需要寵物 ID
            const uploadResponse = await axios.post(`${baseAddress}/api/Pet/UploadPetAvatar/${petIdToUpdate}`, formData, {
                 headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
            });
            photoUrlForUpdate = uploadResponse.data.petAvatarUrl; // 假設後端回傳 petAvatarUrl
            console.log('新照片上傳成功:', photoUrlForUpdate);
        } catch (uploadError) {
             console.error('新照片上傳失敗:', uploadError);
             alert('寵物照片上傳失敗，請稍後再試。');
             return; // 上傳失敗則停止提交
        }
    }

    const formatDateForApi = (dateValue) => {

        if (!dateValue){
            console.log('路徑: Input 是 falsy，返回 null');
        console.log('--- formatDateForApi 結束 ---');
        return null;
        };
        
        try{
            const data = new Date(dateValue);

        if(!isNaN(data.getTime())){
             const formatted = data.toISOString().split('T')[0];
             return formatted;
        }

            if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
            return dateValue;
        }
            return null;
        }catch{
            return null;
        }
    };

    console.log('從 v-model 讀取到的原始 petBirthday 值:', editingPet.value.petBirthday);
    console.log('-> submitEditPet 執行時，editingPet.value.petBirthday 的值是:', editingPet.value.petBirthday);
    // 2. 準備更新寵物的數據 DTO
    // 確保屬性名稱與後端 PetUpdateRequestDTO 匹配 (假設是 camelCase)
    const petDataForUpdate = {
        petName: editingPet.value.petName,
        petBirthday: formatDateForApi(editingPet.value.petBirthday), // YYYY-MM-DD 字串
        petWeight: editingPet.value.petWeight,
        petDe: editingPet.value.petDe, // int 值
        // 只有在 photoUrlForUpdate 非 null 時才包含 petAvatarUrl 屬性
        ...(photoUrlForUpdate !== null && { petAvatarUrl: photoUrlForUpdate })
    };
    
    console.log('發送到服務器的數據 (經過格式化):', JSON.stringify(petDataForUpdate, null, 2));
    const petName = editingPet.value.petName;
    const petWeight = editingPet.value.petWeight;
     if (!petName || petName.trim() === '') {
        //alert('請輸入寵物名字');
        Swal.fire({
            text:"請輸入寵物名字",
            confirmButtonColor: '#ACC572',
        })
        return;
    }
    if (petWeight === null || petWeight === undefined || petWeight === '') {
        //alert('請輸入寵物體重');
        Swal.fire({
            text:"請輸入寵物體重",
            confirmButtonColor: '#ACC572',
        })
        return;
    }
     // 3. 呼叫後端 API 更新寵物
     try {
         const updateResponse = await axios.put(`${baseAddress}/api/Pet/UpdatePetProfile/${petIdToUpdate}`, petDataForUpdate, {
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
         });

         console.log('寵物更新成功:', updateResponse.data);
         Swal.fire({
            icon: 'success',
            text: '寵物資料更新成功！',
            confirmButtonColor: '#ACC572',
        });

         closeEditPetModal(); // 關閉 Modal (會觸發狀態清理和重新載入)
         // fetchPets() 會在 closeEditPetModal 觸發 hidden.bs.modal -> closeEditPetModalStateOnly 的 setTimeout 後執行
         // 或者你可以在這裡直接呼叫 fetchPets(); 取消 setTimeout 中的 fetchPets()
         // 為了確保 Modal 關閉動畫完成再更新列表，延遲呼叫 fetchPets 也是一種選擇
         fetchPets(); // 這裡直接呼叫通常也可以
     } catch (updateError) {
         console.error('更新寵物失敗:', updateError);
         alert('更新寵物失敗，請稍後再試。' + (updateError.response?.data?.message || updateError.message));
     }
};


// --- 初始化 ---
onMounted(() => {
    fetchPets();
});
</script>

<style scoped>
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
/* 加入一些樣式讓 Modal 看起來正常 */
.modal.show {
    display: block;
}

.modal-backdrop.show {
    opacity: 0.5; /* Bootstrap 預設透明度 */
}

.pet-photo {
    width:200px;
    object-fit: cover; /* 確保圖片不變形 */
}

/* 針對寵物卡片和編輯浮層的樣式 */
.pet-card {
    overflow: hidden; /* 確保浮層不會超出 */
}

.card-title{
    background-color: goldenrod;
    border-radius: 30ch;
    padding: 5px 10px;
}
.pet-edit-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0; /* 預設隱藏 */
    transition: opacity 0.3s ease; /* 過渡效果 */
    cursor: pointer;
}

.pet-card:hover .pet-edit-overlay {
    opacity: 1; /* 滑鼠懸停時顯示 */
}

.pet-image-wrapper{
    width: 100%;
    height: 220px;
    overflow: hidden;

}
.pet-image-wrapper img{
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.edit-icon {
    font-size: 2rem; /* 圖標大小 */
    color: white; /* 圖標顏色 */
}

.btn-add {
  padding: 8px 20px;
  background-color: #ACC572;
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-add:hover {
  background-color: #95bf33;
}

/* 其他自定義樣式 */
.content-area {
    /* 確保內容區域不會被Sidebar覆蓋 */
    margin-left: auto; /* 配合Sidebar的寬度調整 */
}
/* Modal樣式 */
.modal-dialog {
    max-width: 600px;
}

.modal-content {
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border: none;
    overflow: hidden;
}

.modal-header {
    color: white;
    padding: 20px 25px;
    border-bottom: none;
    justify-self: center;
}

.title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #3d5a80;
    text-align: center;
    justify-content: center;
}

/* 自定義關閉按鈕 */
.btn-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    opacity: 0.8;
    transition: all 0.3s ease;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-close:hover {
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
}

.modal-body {
    padding: 30px 25px;
    background-color: #fafafa;
    margin-bottom:20px;
    border-radius: 3ch;
    width: 70%
}

.form-label {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 8px;
}

.form-control {
    border-radius: 12px;
    border: 2px solid #e5e9f2;
    padding: 12px 15px;
    transition: all 0.3s ease;
    background-color: white;
}

.form-control:focus {
    border-color: #ACC572;
    box-shadow: 0 0 0 0.25rem rgba(172, 197, 114, 0.25);
}

/* 照片上傳區域樣式 */
.photo-upload-container {
    position: relative;
    display: inline-block;
}


.pet-photo-preview {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid white;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.photo-upload-button {
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 40px;
    height: 40px;
    background:  #ACC572 ;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.photo-upload-button:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.photo-file-input {
    display: none;
}

/* 表單行樣式 */
.form-row {
    margin-bottom: 20px;
}

/* 選項按鈕樣式 */
.form-check {
    margin-bottom: 10px;
}

.form-check-input:checked {
    background-color: #ACC572;
    border-color: #ACC572;
}

.form-check-label {
    font-weight: 500;
    color: #2c3e50;
}

/* 按鈕樣式 */
.btn-secondary {
    background-color: #95a5a6;
    border-color: #95a5a6;
    border-radius: 25px;
    padding: 10px 25px;
    font-weight: 600;
    margin-right: 3px;
}

.btn-secondary:hover {
    background-color: #7f8c8d;
    border-color: #7f8c8d;
}

.btn-delete {
    background-color: #c42059;
    border-color: #a12752;
    border-radius: 25px;
    padding: 10px 25px;
    font-weight: 600;
}

.btn-delete:hover {
    background-color: #d94579;
    border-color: #a12752;
}

.btn-primary {
    background-color: #ACC572;
    border-color: #ACC572;
    border-radius: 25px;
    padding: 10px 25px;
    font-weight: 600;
}

.btn-primary:hover {
    background-color: #95bf33;
    border-color: #95bf33;
}


/* 響應式設計 */
@media (max-width: 576px) {
    .modal-dialog {
        margin: 10px;
    }
    
    .modal-body {
        padding: 20px;
    }
}
</style>