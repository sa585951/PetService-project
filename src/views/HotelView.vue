<template>
    <div class="Header_div mb-3">
        <img src="../assets/Picture/hotelBackground.jpg" class="img_background">
        <div class="search_bar1"> 
            <div class="search_bar2"> 
                <div class="col-6 d-flex justify-content-center align-items-center"> 
                    <!-- <i class="bi bi-calendar4"></i> --> 
                     <div class="w-75 d-flex justify-content-center">
                    <input type="text" ref="datePickerRef" placeholder="選擇訂房日期" class="datepicker p-1"></div>
                </div>
                <div class="col-3"> 
                    <span for="guests" class="me-2">毛孩數量:</span> 
                    <select name="guests" id="guests">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                <div class="col-3 p-2">
                    <div class="col-2 p-2 text-center"> 
                        <SearchButton @click="searchHotels" class="mt-2">搜尋</SearchButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
 <div class="container">
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
      <div class="col-10">
        <HotelCard :hotels="filteredHotels"></HotelCard>
      </div>
    </div>
  </div>
  
</template>

<script setup>
    // new AirDatepicker('#Datepicker_start');
    import HotelCard from '@/components/HotelCard.vue';
    import SearchButton from '../components/HotelSearchButton.vue';
    import Checkbox from '@/components/HotelCheckbox.vue'; 
    import {onMounted, reactive, ref, computed} from 'vue';  //匯入 onMounted 函式
    import flatpickr from 'flatpickr';
   import { zh_tw } from "flatpickr/dist/l10n/zh-tw.js";
//日期選擇器
    const datePickerRef = ref(null);
    let fpInstance = null;
    onMounted(async () => {
            fpInstance = flatpickr(datePickerRef.value, {
                mode: "range",
                minDate: "today",
                enableTime: false,
                dateFormat: "Y-m-d",
                defaultDate: new Date(),
                locale: zh_tw || "zh_tw" ,
                defaultDate: null,
                onChange: (selectedDates, dateStr, instance) => {
                    console.log(flatpickr.l10n);

                    console.log('選取的日期物件:', selectedDates);
                    if (selectedDates.length === 2) {
                        const startDate = selectedDates[0]; // 開始日期的 Date 物件
                        const endDate = selectedDates[1];   // 結束日期的 Date 物件
                        console.log('開始日期:', startDate);
                        console.log('結束日期:', endDate);
                    } else if (selectedDates.length === 1) {
                        console.log('選取退房日期');
                    }
                }
            });
    });

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
    console.log(hotels.value);
    console.log("totalItems:", totalItems.value);
    };
    
    onMounted(() => {
        loadHotels();
    })

//勾選服務項目
    const selectedItemNames = ref(new Set()); // 使用 Set 來儲存選中的項目名稱

    const handleCheckboxChange = (item) => {
        if (item.checked) {
            selectedItemNames.value.add(item.name);}
        else {
            selectedItemNames.value.delete(item.name);}
        console.log("Selected item names:", Array.from(selectedItemNames.value));
    };

    // 計算篩選後的旅館列表
    const filteredHotels = computed(() => {
        if (selectedItemNames.value.size === 0) {
            return hotels.value;
        }
        return hotels.value.filter(hotel => {
            const hotelItemNames = new Set(hotel.items.map(item => item.name));
            for (const selectedName of selectedItemNames.value) {
                if (!hotelItemNames.has(selectedName)) {
                    return false;
                }
            }
            return true;
        });
    });

    onMounted(() => {
        loadHotels();
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
/* datepicker */
    .datepicker{
        border-bottom: 1px solid rgb(243, 221, 195);
        border-radius: 0px;
    }
    
</style>