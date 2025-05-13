<template>
<router-link :to="`/HotelDetail/${{ hotelId }}`" class="text-decoration-none" >
<div class="card mb-3" style="max-width: 100%;" id="hotelId">
    <div class="row g-0 hotel_card">
        <div class="col-md-4 p-3 pe-0">
            <img src="../assets/Hotel/hotel_1.jpg" class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <h4 class="card-title fw-bold">Card title</h4>
                <div class="price-tag">600元起</div>
                <div class="p-0">
                    <img class="star" src="../assets/Hotel/star_light.png">
                    <img class="star" src="../assets/Hotel/star_light.png">
                    <img class="star" src="../assets/Hotel/star_light.png">
                    <img class="star" src="../assets/Hotel/star_light.png">
                    <img class="star" src="../assets/Hotel/star_gray.png">
                </div>
                <div class="pt-2">
                    <p class="card-text">地址</p>
                    <p class="card-text">電話</p>
                    <p class="card-text">Email</p>
                    <div style="width: 90%;">
                        <table class="room-table card-text">
                            <tbody>
                                <tr>
                                    <td class="fw-bold">小型犬房</td>
                                    <td class="qty">剩餘 10 間</td>
                                    <td class="fw-bold">中型犬房</td>
                                    <td>剩餘 10 間</td> 
                                </tr>
                                <tr>
                                    <td class="fw-bold">大型犬房</td>
                                    <td class="qty">剩餘 10 間</td>
                                    <td class="fw-bold">貓咪房</td>
                                    <td>剩餘 10 間</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</router-link>
</template>
    
<script setup>
    
</script>
    
<style scoped>
    .card {
        position: relative
    }
    .star {
        width: 30px;
        height: 30px;
    }
    .hotel_card
    {
        border:1px solid rgb(228, 187, 134);
        border-radius: 5px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .hotel_card:hover {
        transform: scale(1.01);
        box-shadow: 0px 0px 10px 2px rgb(231, 203, 167);
        /* background-color: rgb(214, 230, 188); */
        background-color: #fcfcfc;
    }
    .room-table {
        border: 1px dashed rgb(228, 187, 134);
        width: 100%;
        text-align: center;
        border-collapse: collapse;
    }
    .qty {
        border-right: 1px dashed rgb(228, 187, 134);
    }
    .room-table tr {
        border-bottom: 1px dashed rgb(228, 187, 134);
    }
    .room-table td {
        padding: 5px;
        }
    .card-text {
        margin: 7px;
        font-size: 14px;
        font-size: 1rem;
    }

    /* 價錢標籤CSS開始 */
    .price-tag {
        width: 110px;
        height: 40px;
        font-size: 20px;
        text-align: center;
        position: absolute;
        top: 20px;
        right: 20px;
        background-color: rgb(235, 207, 170);
        color: #5a3e00;
        padding: 6px 12px;
        border-radius: 20px;
        font-weight: bold;
        animation: floatAndGlow 2.5s ease-in-out infinite;
        z-index: 2;
        will-change: transform;
    }
    @keyframes floatAndGlow {
        0% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-5px);
        }
        100% {
            transform: translateY(0px);
        }
    }   /* 價錢標籤CSS結束 */
</style>