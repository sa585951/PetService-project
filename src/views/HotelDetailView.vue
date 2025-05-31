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
                                <img :src="selectedImage" class="img-fluid rounded-start mb-2" style="height: 100%; width: 100%; object-fit: cover;"/>
                            </div>
                                <!-- 小圖：垂直排列 -->
                                <div class="d-flex  flex-column justify-content-between ps-2" style="width: 180px;" v-if="hotels.length > 0">
                                    <img :src="`/Hotel/${hotels[0].image_1}`" class="img-thumbnail mb-2" style="height: calc(100% / 3); object-fit: cover; cursor: pointer;" @click="selectedImage = `/Hotel/${hotels[0].image_1}`"/>
                                    <img :src="`/Hotel/${hotels[0].image_2}`" class="img-thumbnail mb-2" style="height: calc(100% / 3); object-fit: cover; cursor: pointer;" @click="selectedImage = `/Hotel/${hotels[0].image_2}`"/>
                                    <img :src="`/Hotel/${hotels[0].image_3}`" class="img-thumbnail mb-2" style="height: calc(100% / 3); object-fit: cover; cursor: pointer;" @click="selectedImage = `/Hotel/${hotels[0].image_3}`"/>
                                </div>
                            </div>
                    </div>
                    <div class="col-md-5">
                            <div class="card-body ps-3">
                                <div class="d-flex mb-1">
                                    <div class="d-flex align-items-center">
                                    <h4 class="card-title fw-bold m-0">{{hotels[0].name}}</h4>
                                    <div class="p-0 ps-2">
                                        <img v-for="i in hotels[0]?.rating" :key="'light_' + i" class="star" src="/Hotel/star_light.png">
                                        <img v-for="i in 5 - (hotels[0]?.rating || 0)" :key="'gray_' + i" class="star" src="/Hotel/star_gray.png">
                                    </div>
                                    <div class="ratingbox">{{getRating(hotels[0].rating)}}</div>
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
                                <!-- 開啟地圖 --><Map :latitude="hotels[0].latitude" :longitude="hotels[0].longitude" :address="hotels[0].address"></Map>
                            </div>
                            
                        </div>
                    </div>
                </div>
                </div>
        <!-- 房間卡片 -->
                <div class="d-flex flex-wrap">
                    <div v-for="(roomDetail, index) in hotels[0].roomDetail" :key="roomDetail.id" class="card me-3 mb-3" style="width: 26rem; height: 100%;">
                        <img :src="`/Hotel/${roomDetail.image}`" class="card-img-top" />
                        <div class="d-flex align-items-center justify-content-between">
                            <h5 class="card-title fw-bold mt-3 ms-3">{{ hotels[0].roomTypes[index].name }}</h5>
                            <h6 class="text-danger card-title fw-bold m-3">{{ roomDetail.price }} 元</h6>
                        </div>
                        <div class="ms-3 d-flex justify-content-between align-items-center">
                            <div class="d-flex">
                                <p class="mb-0">{{ roomDetail.roomsize }} (公分)</p>
                                
                            </div>
                        </div>
                        <div class="mt-2 d-flex justify-content-between">
                            <div class="text-muted mb-2 ms-3">{{ getRoomQty(hotels[0], hotels[0].roomTypes[index].name) }}</div>
                            <div>
                                <p v-if="memberId && userName && hotels[0] && roomDetail.roomtype_id && roomDetail.price"><BookingButton :hotel="hotels[0]" :roomName="hotels[0].roomTypes[index].name"
                                    :userName="userName" :memberId="Number(memberId)" :price="roomDetail.price" :roomtype_id="roomDetail.roomtype_id" :hotelImage="hotels[0].image_1"
                                    :checkInDate="checkInDate" :checkOutDate="checkOutDate" :requiredRooms="requiredRooms">加入購物車</BookingButton></p>
                            </div>
                        </div>
                    </div>
                </div>
            <hr>
<!-- 留言評論區 -->
                <div>
                    <div class="ReviewForm">
                        <h5>會員評語</h5>
                        <HotelReviewForm :memberId="Number(memberId)" :hotelId="hotels[0].id" :unreviewedOrderIds="unreviewedOrderIds" v-if="isVisible" @refresh-data="handleReviewSubmitted" :key="unreviewedOrderIds.join('-')">撰寫評語</HotelReviewForm></div>

                        <Reviews :review="review" :key="review.id"></Reviews> 
                </div>
            </div>
        </div>
    </div>
</template>
    
<script setup>
    import Map from '@/components/hotel/HotelMap.vue';
    import GoButton from '@/components/hotel/HotelBookingButton.vue';
    import BookingButton from '@/components/hotel/HotelBookingForm.vue'
    import Reviews from '@/components/hotel/HotelReview.vue';
    import { useAuthStore } from '@/stores/authStore';
    import 'leaflet/dist/leaflet.css'
    import { ref, computed, onMounted, watch } from 'vue';
    import { useRoute } from 'vue-router'

    import HotelReviewForm from '@/components/hotel/HotelReviewForm.vue';

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
    // console.log(hotelId,checkInDate,checkOutDate,petCount);

    const memberId = ref('')   //要傳子元件的會員資料
    const userName = ref('')
    const authStore = useAuthStore();
    const isVisible = ref(false);  //控制評論按鈕顯示
    const unreviewedOrderIds = ref([]);

    onMounted(async () => {
        await loadHotelDetail();
//會員資料
    if (authStore.isLoggedIn) {
        memberId.value = authStore.memberId;
        userName.value = authStore.userName;
        // console.log('memberId', memberId.value, 'userName', userName.value,"hotelId",hotelId);
        await checkReview();
    }
    })

//GET詳細
    const hotels = ref({});
    const HotelDetailQty = ref({});
    const review = ref({});
    const requiredRooms = ref();
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
        review.value = datas.review;
        requiredRooms.value = datas.hotelDetailQty[0].requiredRooms;
        // console.log("1",hotels.value,"2", HotelDetailQty.value,"3", review.value);
        // 確保資料存再再初始化大圖
    if (hotels.value.length > 0) {
        selectedImage.value = `/Hotel/${hotels.value[0].image_1}`;
    }
    }
    
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

//評分文字
    function getRating(rating) {
        if (rating == null) return "無";
        switch (rating) {
            case 5:
            return "很棒";
            case 4:
            return "很好";
            case 3:
            return "好";
            default:
            return "普通";
        }
    }
    
//評論留言區
    const checkReview = async () => {
        const API_URL = `${import.meta.env.VITE_API_BaseURL}/Hotel/CheckReview`;
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                MemberId: Number(memberId.value),
                HotelId: Number(hotelId),
            })
        })
        const data = await response.json();
        isVisible.value = !data.allReviewed;
        unreviewedOrderIds.value = data.unreviewedOrderIds;
        // console.log(data.allReviewed,unreviewedOrderIds.value);
    }
    
//子元件送出評論後更新畫面
    function handleReviewSubmitted() {
        // console.log('父元件接收到 review-submitted 事件');
        loadHotelDetail();  // 重新載入詳細資料
        checkReview();      // 檢查是否還有未評論的訂單
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
    /* 評分標籤 */
    .ratingbox{
        margin-left: 10px;
        /* background-color: rgb(155, 97, 27); */
        background-color: #96b848;
        width: 45px;
        height: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        border-radius: 10px 10px 10px 0px;
    }

    .ReviewForm {
        display: flex;
        justify-content: space-between; /* 讓左右元素分開 */
        align-items: center;            /* 垂直置中 */
        /* margin-bottom: 5px; */
    }
</style>