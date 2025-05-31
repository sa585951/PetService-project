<template>
    <Notice ref="noticeModal"></Notice>
    <div class="Header_div mb-3">
        <img src="../assets/Picture/hotelBackground.jpg" class="img_background">
        <div class="search_bar1"> 
            <div class="search_bar2"> 
                <div class="col-5 d-flex justify-content-center align-items-center"> 
                    <!-- <i class="bi bi-calendar4"></i> --> 
                    <div class="datePickerRef d-flex justify-content-center">
                    <input type="text" ref="datePickerRef" placeholder="選擇訂房日期" class="datepicker p-1"></div>
                </div>
                <div class="col-4 d-flex justify-content-center align-items-center"> 
                    <label for="petCount" class="me-2">房間數量:</label>
                    <select class="form-select" name="petCount" id="petCount" v-model.number="petCount">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                <div class="col-2 p-2 d-flex justify-content-center align-items-center">
                    <div class=" p-2 text-center"> 
                        <SearchButton @click="searchHotels()" class="fw-bold">搜尋</SearchButton>
                    </div>
                </div>
                <div class="col-1 p-2 d-flex justify-content-center align-items-center">
                    <div class=" p-2 text-center"> 
                        <i class="bi bi-exclamation-square-fill NoticeIcon" @click="openNotice"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
<!-- 左側:設施與服務 -->
    <div class="container" v-if="showHotelSection">
        <div class="row">
            <div class="col-2">
                <div class="card card_left">
                <div class="card-body">
                    <p class="card-text fw-bold d-flex justify-content-center">設施與服務</p>
                    <hr class="mb-2"/>
                    <Checkbox
                    v-for="item in totalItems"
                    :key="item.id"
                    :value="item.name"
                    :checkboxId="item.id.toString()"
                    :labelText="item.name"
                    class="mb-2 d-flex justify-content-start"
                    @change="handleCheckboxChange"
                    ></Checkbox>
                </div>
                </div>
            </div>
        <!-- 右側:旅館卡片 -->
            <div class="col-10">
                <div v-if="filteredHotels.length > 0">
                    <HotelCard :hotels="filteredHotels" :check-in-date="checkInDate" :check-out-date="checkOutDate" :pet-count="petCount"></HotelCard>
                </div>
                <div v-else class="text-center mt-5">
                    <img src="/Hotel/SearchNomatch.png" alt="請輸入搜尋條件" style="max-width: 400px; width: 100%;">
                </div>
            </div>
        </div>
    </div>
    <!-- 尚未搜尋時顯示的圖片區塊 -->
    <div v-else class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
        <img src="/Hotel/SearchHint.png" alt="請輸入搜尋條件" style="max-width: 500px; width: 100%;">
    </div>
  
</template>

<script setup>
    // new AirDatepicker('#Datepicker_start');
    import HotelCard from '@/components/hotel/HotelCard.vue';
    import SearchButton from '../components/hotel/HotelSearchButton.vue';
    import Checkbox from '@/components/hotel/HotelCheckbox.vue'; 
    import Notice from '../components/hotel/HotelNotice.vue';
    import {onMounted, reactive, ref, computed} from 'vue';  //匯入 onMounted 函式
    import flatpickr from 'flatpickr';
    import { zh_tw } from "flatpickr/dist/l10n/zh-tw.js";
    import Swal from 'sweetalert2';
    import { useSearchHotelStore } from '@/stores/searchHotelStore'   //搜尋結果存進pinia

//使用者須知
    const noticeModal = ref(null)
//日期選擇器
    const datePickerRef = ref(null);
    let fpInstance = null;
    const checkInDate = ref();
    const checkOutDate = ref();
    const petCount = ref();
    let startDate = null;
    let endDate = null;
    const searchHotelStore = useSearchHotelStore()
//預設顯示請搜尋圖片+不顯示hotelCard和服務區塊
    const showHotelSection = ref(false);
    onMounted(async () => {
        fpInstance = flatpickr(datePickerRef.value, {
            mode: "range",
            minDate: "today",
            enableTime: false,
            dateFormat: "Y / m / d",
            defaultDate: new Date(),
            locale: zh_tw || "zh_tw" ,
            defaultDate: null,
            onChange: (selectedDates, dateStr, instance) => {
                
                if (selectedDates.length === 2) {
                    startDate = selectedDates[0];
                    endDate = selectedDates[1];
                    // console.log("1.Date", startDate, endDate);
                    const formatDateToYMD = (date) => {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        return `${year}-${month}-${day}`;
                    };
                    const formattedStartDate = formatDateToYMD(startDate);
                    const formattedEndDate = formatDateToYMD(endDate);
                    // 儲存起訖日期給 searchHotels 用（你可以放到 ref 或 reactive）
                    checkInDate.value = formattedStartDate;
                    checkOutDate.value = formattedEndDate;
//pinia區 開始                    
                    //存進搜尋條件(日期)
                    searchHotelStore.checkInDate = formattedStartDate;
                    searchHotelStore.checkOutDate = formattedEndDate;
                };
            }
        });

        // 從 Pinia 讀值
        if (searchHotelStore.checkInDate && searchHotelStore.checkOutDate && searchHotelStore.petCount) {
            checkInDate.value = searchHotelStore.checkInDate;
            checkOutDate.value = searchHotelStore.checkOutDate;
            petCount.value = searchHotelStore.petCount;
            // console.log("2.Date", checkInDate.value, checkOutDate.value, petCount.value);

        // 將日期設定到 flatpickr UI（顯示出來）
            fpInstance.setDate([
                new Date(checkInDate.value),
                new Date(checkOutDate.value)
            ]);

        // 自動執行搜尋
            await loadHotels();
            await searchHotels();
        } else {
            await loadHotels(); // 先載入所有旅館資料
            noticeModal.value?.show();
        }
//pinia區 結束

        //建議提醒的彈窗
        if (!checkInDate.value || !checkOutDate.value || !petCount.value) 
        noticeModal.value?.show()
    });
    //開啟使用者須知
    function openNotice() {
        noticeModal.value?.show()
    }
    

 //GET全部
    const hotels = ref([]);
    const totalItems = ref([]);
    const loadHotels = async () => {
        const API_URL = `${import.meta.env.VITE_API_BaseURL}/Hotel`;
        const response = await fetch(API_URL, {
            headers: {'Content-Type': 'application/json'}
        });
        const datas = await response.json();
        hotels.value = datas.hotels;   //只存陣列
        totalItems.value = datas.totalItems;
        // console.log(hotels.value);
        // console.log("totalItems:", totalItems.value);
    };
    
//勾選服務項目
    const selectedItemNames = ref(new Set()); // 使用 Set 來儲存選中的項目名稱

    const handleCheckboxChange = (item) => {
        if (item.checked) {
            selectedItemNames.value.add(item.name);}
        else {
            selectedItemNames.value.delete(item.name);}
        // console.log("Selected item names:", Array.from(selectedItemNames.value));
    };

    const matchedHotelIds = ref([]);  // 儲存搜尋結果的 hotelId

// 查詢按鈕，取得符合條件的旅館 ID 清單
    const searchHotels = async () => {
        const searchDate = {
            CheckInDate: checkInDate.value,
            CheckOutDate: checkOutDate.value,
            petCount: petCount.value
        };
//pinia區  存進搜尋條件(房數))
        searchHotelStore.petCount = petCount.value;
        
        if (!checkInDate.value || !checkOutDate.value || !petCount.value) {
            Swal.fire({
                icon: 'warning',
                html: '請先選擇入住、退房日期<br>與入住寵物數量！',
                showConfirmButton: true,
                confirmButtonColor: '#ACC572',
            })
            return;  // 停止函式執行
            }
        const API_URL = `${import.meta.env.VITE_API_BaseURL}/Hotel/Search`;
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(searchDate)
        });

        const result = await response.json();

    // 更新 matchedHotelIds
        matchedHotelIds.value = result.map(r => r.hotelId);
        // console.log("搜尋結果 hotelIds:", matchedHotelIds.value);

    // 將房型數量加入對應的 hotel 中
        result.forEach(searchResult => {
            const hotel = hotels.value.find(h => h.id === searchResult.hotelId);
            if (hotel) {
                hotel.qtyStatus[0].smallDogRoom = searchResult.smallDogRoom ?? hotel.qtyStatus[0].smallDogRoom;
                hotel.qtyStatus[0].middleDogRoom = searchResult.middleDogRoom ?? hotel.qtyStatus[0].middleDogRoom;
                hotel.qtyStatus[0].bigDogRoom = searchResult.bigDogRoom ?? hotel.qtyStatus[0].bigDogRoom;
                hotel.qtyStatus[0].catRoom = searchResult.catRoom ?? hotel.qtyStatus[0].catRoom;
            }
        });
        // console.log("更新後的 hotels:", hotels.value);
    // 顯示旅館卡片 + 服務欄
        showHotelSection.value = true;
        // console.log(showHotelSection.value);
    };

// 根據搜尋結果與勾選項目篩選旅館
    const filteredHotels = computed(() => {
        let filtered = hotels.value;

    // 依照搜尋結果 hotelId 過濾
        if (matchedHotelIds.value.length > 0) {
            filtered = filtered.filter(h => matchedHotelIds.value.includes(h.id));
        }

    // 依照勾選設施項目再過濾一次
        if (selectedItemNames.value.size > 0) {
            filtered = filtered.filter(hotel => {
                const hotelItemNames = new Set(hotel.items.map(item => item.name));
                for (const selectedName of selectedItemNames.value) {
                    if (!hotelItemNames.has(selectedName)) {
                        return false;
                    }
                }
                return true;
            });
        }
        return filtered;
    });

</script>
    
<style scoped>
    .Header_div {
        position:relative;
    }
    .img_background {
        width: 100%;
        height: 600px;
        object-fit: cover; /* 保持原始比例，不壓縮 */
        object-position: center; /* 以中心點顯示 */
    }
    .search_bar1 { 
        position: absolute; 
        width: 70%; 
        height: 100px; 
        top: 80%; 
        left: 50%; 
        transform: translateX(-50%); 
        background-color: rgb(250, 235, 215); 
        border-radius: 10px; 
    } 

    .search_bar2 { 
        position: absolute; 
        width: 80%; 
        height: 60%; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%); 
        background-color: rgb(255, 255, 255); 
        border-radius: 5px; 
        /* text-align: center; */ 
        display: flex; 
        justify-content: center; /* 水平置中 */ 
        align-items: center; /* 垂直置中 */ 
    } 

    .form-select {
        width: 80px;
    }
    .form-select:hover {
        cursor: pointer;
    }

    .datePickerRef {
        width: 90%;
    }

    input { 
        width: 80%; 
        border: none; 
        outline: none; 
        background: transparent; 
        margin: 0px;
    } 

    hr { 
        margin: 8px -5px; 
    } 
    
    i { 
        color: rgb(175, 115, 42);
    } 
    
/* 側邊攔-左 */
    p { 
        margin: 0; 
    } 

    .card_left { 
        background-color: rgb(255, 255, 255); 
    } 
/* 通知icon */
    .NoticeIcon{
        font-size: 26px;
        display: inline-block;
        transition: transform 0.1s ease;
    }
    .NoticeIcon:hover{
        color: rgb(221, 176, 117);
        cursor: pointer; /*鼠標指標*/
        /* transform: translateY(-1px); */
    }

/* datepicker */
    .datepicker{
        border-bottom: 1px solid rgb(243, 221, 195);
        border-radius: 0px;
    }
    
</style>