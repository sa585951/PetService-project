<template>
    <div class="container mt-5 p-0">
        <div class="row">
            <div v-if="hotels[0]">
                <div class="card ps-0 mb-3" style="max-width: 100%;" :key="hotels[0].id">
                <div class="row g-0 hotel_card">
                    <!-- 旅館照片 -->
                    <div class="col-md-7 p-3 pe-0">
                        <!-- 圖片區域：水平排大圖與小圖欄 -->
                        <div class="d-flex">
                            <!-- 大圖 -->
                            <div style="flex: 1;">
                            <img :src="selectedImage" class="img-fluid rounded-start mb-2" alt="主要圖片"
                            style="height: 100%; width: 100%; object-fit: cover;"/>
                            </div>
                            <!-- 小圖：垂直排列 -->
                            <div class="d-flex flex-column justify-content-between ps-2" style="width: 180px;">
                            <img v-for="(img, index) in imageList" :key="index" :src="img" class="img-thumbnail mb-2"
                            style="height: calc(100% / 3);  object-fit: cover; cursor: pointer;"
                            @click="selectedImage = img"/>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-5">
                            <div class="card-body ps-3">
                                <div class="d-flex">
                                    <div class="d-flex align-items-center">
                                    <h4 class="card-title fw-bold m-0">{{hotels[0].name}}</h4>
                                    <div class="p-0 ps-2">
                                        <img v-for="i in hotels[0].review?.[0]?.rating" :key="'light_' + i" class="star" src="/Hotel/star_light.png">
                                        <img v-for="i in 5 - (hotels[0].review?.[0]?.rating || 0)" :key="'gray_' + i" class="star" src="/Hotel/star_gray.png">
                                    </div>
                                    </div></div>
                                <div class="pt-2 mb-3">
                                    <p class="card-text fw-bold">
                                        <span v-for="item in hotels[0].items" :key="item.id" class="fw-bold me-2">
                                            <i class="bi bi-check2 me-2"></i>{{ item.name }}
                                        </span>
                                    </p> 
                                </div>
                                <div class="pt-2">
                                    <p class="card-text"><i class="bi bi-geo-alt-fill me-2"></i>{{hotels[0].address}}</p>
                                    <p class="card-text"><i class="bi bi-telephone-fill me-2"></i>{{hotels[0].phone}}</p>
                                    <p class="card-text"><i class="bi bi-envelope-fill me-2"></i>{{hotels[0].email}}</p>
                                <div>
                                    <div style="width: 95%;">
                                    <table class="room-table card-text">
                                        <tbody>
                                            <tr v-for="(roomDetail, index) in hotels[0].roomDetail" :key="roomDetail.id">
                                                <td class="td-title fw-bold">{{ hotels[0].roomTypes[index].name }}</td>
                                                <td>{{ getRoomQty(hotels[0], hotels[0].roomTypes[index].name) }}</td>
                                                <td>{{ roomDetail.price }} 元</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    </div>
                                </div>
                                
                                </div>
                            <div class="pt-4 d-flex justify-content-end align-items-end pe-3">
                                <!-- 開啟地圖 --><Map></Map>
                            </div>
                            
                        </div>
                    </div>
                </div>
                </div>
        
                <div class="d-flex flex-wrap">
                    <div v-for="(roomDetail, index) in hotels[0].roomDetail" :key="roomDetail.id" class="card me-3 mb-3" style="width: 26rem; height: 100%;">
                        <img :src="`/Hotel/${roomDetail.image}`" class="card-img-top" />
                        <h5 class="card-title fw-bold mt-3 ms-3">{{ hotels[0].roomTypes[index].name }}</h5>
                        <div class="ms-3 d-flex justify-content-between align-items-center px-3">
                            <div>
                                <p class="mb-0">房間大小： {{ roomDetail.roomsize }}</p>
                                <div class="ms-3 text-muted mb-2">{{ getRoomQty(hotels[0], hotels[0].roomTypes[index].name) }}</div>
                            </div>
                            <div>
                                <p><div class="ms-3 text-danger fw-bold mb-3">{{ roomDetail.price }} 元</div></p>
                                <p><GoButton>馬上預定</GoButton></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
    
<script setup>
    import Map from '@/components/HotelMap.vue';
    import GoButton from '@/components/HotelBookingButton.vue';
    import 'leaflet/dist/leaflet.css'
    import { ref, computed, onMounted, watch } from 'vue';
    import { useRoute } from 'vue-router'

    const today = ref(new Date()); // 預設為今天
    const tomorrow = ref(new Date());
    tomorrow.value.setDate(today.value.getDate() + 1); // 設定為明天
    
    const toDateString = (d) =>
        d.toLocaleDateString('sv-SE'); // 方法:格式為 yyyy-mm-dd，瑞典地區語系

    const formattedCheckIn = ref(toDateString(today.value));
    const formattedCheckOut = ref(toDateString(tomorrow.value));
    // console.log(formattedCheckIn,formattedCheckOut);
//接收資料
    const route = useRoute()
    const hotelId = route.params.id
    let checkInDate = formattedCheckIn.value;
    let checkOutDate = formattedCheckOut.value;
    if (route.query.checkInDate) { 
        checkInDate = route.query.checkInDate}
    if (route.query.checkOutDate) { 
        checkOutDate = route.query.checkOutDate}
    // let checkInDate = route.query.checkInDate
    // let checkOutDate = route.query.checkOutDate
    const petCount = route.query.petCount
    console.log(hotelId,checkInDate,checkOutDate,petCount);

    onMounted(async () => {
        await loadHotelDetail();
        
    })

//GET詳細
    const hotels = ref({});
    const HotelDetailQty = ref({});
    const imageList = ref([]);
    const selectedImage = ref(null); // 保持為響應式引用，預設為null
    const loadHotelDetail = async () => {
        const API_URL = `${import.meta.env.VITE_API_BaseURL}/Hotel/Hoteldetail`;
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                "HotelId" : Number(hotelId),
                "CheckInDate" : checkInDate,
                "CheckOutDate" : checkOutDate,
                "PetCount" : Number(petCount)
            })
        });
        const datas = await response.json();
        hotels.value = datas.hotels;
        HotelDetailQty.value = datas.hotelDetailQty;
        console.log("1",hotels.value,"2", HotelDetailQty.value);
        // 圖片初始化移到這裡，確保 hotels.value 有資料
        if (hotels.value && hotels.value[0]) {
            imageList.value = [
                new URL(`/Hotel/${hotels.value[0].image_1}`, import.meta.url).href,
                // 假設後面的圖片命名規則是 hotelId-2.png, hotelId-3.png
                // 你可能需要根據實際的圖片命名規則來調整
                new URL(`/Hotel/${hotels.value[0].image_2}`, import.meta.url).href, 
                new URL(`/Hotel/hotel1-1.png`, import.meta.url).href
            ];
            selectedImage.value = imageList.value[0];
        }
    }
    
//圖片
    
function getRoomQty(hotel, roomName) {
  const qty = hotel.qtyStatus?.[0];
  if (!qty || !roomName) return null;

  let count = 0;
  switch (roomName) {
    case "小型犬房":
      count = qty.smallDogRoom;
      break;
    case "中型犬房":
      count = qty.middleDogRoom;
      break;
    case "大型犬房":
      count = qty.bigDogRoom;
      break;
    case "貓咪房":
      count = qty.catRoom;
      break;
    default:
      count = null;
      break;
  }

  return count === 0 ? "今日尚無空房" : `剩餘 ${count} 間`;
}

    
</script>
    
<style scoped>
    .star {
        width: 20px;
        height: 20px;
    }

    .room-table {
        border: 1px dashed rgb(228, 187, 134);
        width: 100%;
        text-align: center;
        border-collapse: collapse;
    }
    .td-title {
        background-color: rgb(250, 235, 215);
    }

    .room-table tr {
        height: 40px;
        border-bottom: 1px dashed rgb(228, 187, 134);
    }
    .room-table td {
        padding: 5px;
        border-right: 1px dashed rgb(228, 187, 134);
    }
    i {
        color: rgb(155, 97, 27);
    }
</style>