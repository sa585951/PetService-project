<template>
<div v-for="hotel in hotels" :key="hotel.id">
<router-link :to="`/HotelDetail/${hotel.id}`" class="text-decoration-none" >
<div class="card mb-3" style="max-width: 100%;">
    <div class="row g-0 hotel_card">
        <div class="col-md-4 p-3 pe-0">
            <img :src="`/Hotel/${hotel.image_1}`" class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <h4 class="card-title fw-bold">{{ hotel.name }}</h4>
                <div class="price-tag">600元起</div>
                <div class="p-0">
                    <img class="star" src="/Hotel/star_light.png">
                    <img class="star" src="/Hotel/star_light.png">
                    <img class="star" src="/Hotel/star_light.png">
                    <img class="star" src="/Hotel/star_light.png">
                    <img class="star" src="/Hotel/star_light.png">
                </div>  
                <div class="pt-2">
                    <p class="card-text mb-4">
                                        <i class="bi bi-check2 me-2"></i>24小時陪伴
                                        <i class="bi bi-check2 ms-2 me-2"></i>24小時陪伴
                                        <i class="bi bi-check2 ms-2 me-2"></i>24小時陪伴
                                    </p>
                    <p class="card-text"><i class="bi bi-geo-alt-fill me-2"></i>{{ hotel.address }}</p>
                    <p class="card-text"><i class="bi bi-telephone-fill me-2"></i>{{ hotel.phone }}</p>
                    <p class="card-text"><i class="bi bi-envelope-fill me-2"></i>{{ hotel.email }}</p>
                    <div style="width: 90%;">
                        <!-- <table class="room-table card-text">
                            <tbody>
                                <tr v-for="(roomPair, pairIndex) in hotel.roomTypes.filter((_, i) => i % 2 === 0)" :key="pairIndex">
                                    <td class="fw-bold">{{ hotel.roomTypes[pairIndex * 2]?.name }}</td>
                                    <td class="qty">剩餘 10 間</td>
                                    <td class="fw-bold" v-if="pairIndex * 2 + 1 < hotel.roomTypes.length"> 
                                         hotel.roomTypes.length=3時 最後一筆pairIndex=2*2+1=5 >不會顯示 
                                        {{ hotel.roomTypes[pairIndex * 2 + 1]?.name }}</td>
                                    <td class="qty" v-if="pairIndex * 2 + 1 < hotel.roomTypes.length">剩餘 10 間</td>
                                </tr>
                            </tbody>
                        </table> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</router-link>
</div>
</template>
    
<script setup>
    const props = defineProps({
        hotels: {
            type: Array,
            default: () => [],
        }
    });
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
        width: 25%;
        padding: 5px;
        }
    .card-text {
        margin: 7px;
        font-size: 14px;
        font-size: 1rem;
    }
    i {
        color: rgb(155, 97, 27);
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