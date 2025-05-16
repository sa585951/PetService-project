<template>
    <div class="container mt-5">
        <div class="row">
            <div class="card ps-0 mb-3" style="max-width: 100%;" id="hotelId">
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
                                    <h4 class="card-title fw-bold m-0">毛茸茸旅館</h4>
                                    <div class="p-0 ps-2">
                                        <img class="star" src="/Hotel/star_light.png" />
                                        <img class="star" src="/Hotel/star_light.png" />
                                        <img class="star" src="/Hotel/star_light.png" />
                                        <img class="star" src="/Hotel/star_light.png" />
                                        <img class="star" src="/Hotel/star_light.png" />
                                    </div>
                                    </div></div>
                                <div class="pt-2 mb-3">
                                    <p class="card-text fw-bold">
                                        <i class="bi bi-check2 me-2"></i>室內放風區
                                        <i class="bi bi-check2 ms-2 me-2"></i>登頂小木屋
                                        <i class="bi bi-check2 ms-2 me-2"></i>24小時陪伴
                                    </p>
                                        
                                </div>
                                <div class="pt-2">
                                    <p class="card-text"><i class="bi bi-geo-alt-fill me-2"></i>高雄市前鎮區民權二路615號</p>
                                    <p class="card-text"><i class="bi bi-telephone-fill me-2"></i>073300313</p>
                                    <p class="card-text"><i class="bi bi-envelope-fill me-2"></i>monono613@gmail.com</p>
                                <div>
                                    <div style="width: 95%;">
                                    <table class="room-table card-text">
                                    <tbody>
                                        <tr>
                                            <td class="td-title fw-bold">小型犬房</td>
                                            <td>剩餘 10 間</td>
                                            <td>600 元</td>
                                        </tr>
                                        <tr>
                                            <td class="td-title fw-bold">中型犬房</td>
                                            <td>剩餘 10 間</td>
                                            <td>900 元</td>
                                        </tr>
                                        <tr>
                                            <td class="td-title fw-bold">大型犬房</td>
                                            <td>剩餘 4 間</td>
                                            <td>1200 元</td>
                                        </tr>
                                        <tr>
                                            <td class="td-title fw-bold">貓咪房</td>
                                            <td>剩餘 5 間</td>
                                            <td>650 元</td>
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
        </div>
        <div class="d-flex">
            <div class="card m-3" style="width: 26rem;">
                <img src="/Hotel/room1-1.png" class="card-img-top" alt="小型犬房">
                <div class="card-body d-flex justify-content-between">
                    <h5 class="card-title">小型犬房</h5>
                    <p><span class="d-flex justify-content-end" ><GoButton>馬上預定</GoButton></span></p>
                </div>
            </div>
            <div class="card m-3" style="width: 26rem;">
                <img src="/Hotel/room1-2.png" class="card-img-top" alt="小型犬房">
                <div class="card-body d-flex justify-content-between">
                    <h5 class="card-title">中型犬房</h5>
                    <p><span class="d-flex justify-content-end" ><GoButton>馬上預定</GoButton></span></p>
                </div>
            </div>
            <div class="card m-3" style="width: 26rem;">
                <img src="/Hotel/room1-3.png" class="card-img-top" alt="小型犬房">
                <div class="card-body d-flex justify-content-between">
                    <h5 class="card-title">大型犬房</h5>
                    <p><span class="d-flex justify-content-end" ><GoButton>馬上預定</GoButton></span></p>
                </div>
            </div>
        </div>
        <div class="d-flex">
            
            <div class="card m-3" style="width: 26rem;">
                <img src="/Hotel/room1-4.png" class="card-img-top" alt="小型犬房">
                <div class="card-body d-flex justify-content-between">
                    <h5 class="card-title">貓咪房</h5>
                    <p><span class="d-flex justify-content-end" ><GoButton>馬上預定</GoButton></span></p>
                </div>
            </div>

        </div>
        


        

</div>
</template>
    
<script setup>
    import Map from '@/components/HotelMap.vue';
    import GoButton from '@/components/HotelBookingButton.vue';
    import 'leaflet/dist/leaflet.css'
    import { ref } from 'vue';
//圖片
    const imageList = [
        new URL('/Hotel/hotel1-1.png', import.meta.url).href,
        new URL('/Hotel/hotel1-2.png', import.meta.url).href,
        new URL('/Hotel/hotel1-3.png', import.meta.url).href
    ];

    const selectedImage = ref(imageList[0]);

   

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