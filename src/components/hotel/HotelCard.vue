<template>
<div v-for="hotel in hotels" :key="hotel.id">

<div class="card mb-3" @click="goToDetail(hotel)" style="max-width: 100%;">
    <div class="row g-0 hotel_card">
        <div class="col-md-4 p-3 pe-0">
            <img :src="`/Hotel/${hotel.image_1}`" class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <div class="d-flex">
                    <h4 class="card-title fw-bold m-0">{{ hotel.name }}</h4>
                    <div class="p-0 ps-2">
                        <img v-for="i in hotel?.rating" :key="'light_' + i" class="star" src="/Hotel/star_light.png">
                        <img v-for="i in 5 - (hotel?.rating || 0)" :key="'gray_' + i" class="star" src="/Hotel/star_gray.png">
                    </div>
                    <div class="ratingbox">{{getRating(hotel.rating)}}</div>
                    <!-- <div class="p-0 ps-2 d-flex align-items-center fw-bold">{{getRating(hotel.rating)}}</div> -->
                </div>
                <div class="price-tag">{{ Math.min(...hotel.roomDetail.map(room => room.price)) }}元起</div>
                <div class="pt-1">
                    <p class="card-text mb-1">
                        <span v-for="item in hotel.items" :key="item.id" class="fw-bold me-2">
                            <i class="bi bi-check2 me-2"></i>{{ item.name }}</span>
                    </p>
                    <p class="card-text"><i class="bi bi-geo-alt-fill me-2"></i>{{ hotel.address }}</p>
                    <p class="card-text"><i class="bi bi-telephone-fill me-2"></i>{{ hotel.phone }}</p>
                    <p class="card-text"><i class="bi bi-envelope-fill me-2"></i>{{ hotel.email }}</p>
                    <div style="width: 90%;">
                        <table class="room-table card-text mt-4">
                            <tbody>
                                <tr v-for="(pair, index) in getRoomPairs(hotel)" :key="index">
                                    <td class="fw-bold">{{ pair[0]?.name }}</td>
                                    <td class="qty">{{ getRoomQty(hotel, pair[0]?.name) }}</td>
                                    <td class="fw-bold" v-if="pair[1]">{{ pair[1].name }}</td>
                                    <td class="qty" v-if="pair[1]">{{ getRoomQty(hotel, pair[1].name) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
</template>
    
<script setup>
    import { computed, ref } from 'vue';
    import { useRouter } from 'vue-router'

const router = useRouter()


// 取得 props
    const props = defineProps({
        hotels: {
            hotels: {
            type: Array,
            default: () => []
            },
        },
        checkInDate: {
            type: String,
            default: ''
        },
        checkOutDate: {
            type: String,
            default: ''
        },
        petCount: {
            type: Number,
            default: ''
        }
    });
    const hotels = computed(() => props.hotels);

    function goToDetail(hotel) {
        router.push({
            path: `/HotelDetail/${hotel.id}`,
            query: {
                checkInDate: props.checkInDate,
                checkOutDate: props.checkOutDate,
                petCount: props.petCount
            }
        })
    }
// 依據單一 hotel 拆分 roomTypes 為兩兩一組
    function getRoomPairs(hotel) {
        const pairs = [];
        for (let i = 0; i < hotel.roomTypes.length; i += 2) {
            pairs.push([
                hotel.roomTypes[i],
                hotel.roomTypes[i + 1] || null
            ]);
        }
        return pairs;
    }

// 傳回房型對應的剩餘房間數
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
    
</script>
    
<style scoped>
    .card {
        position: relative
    }
    .star {
        width: 25px;
        height: 25px;
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

    /* 價錢標籤CSS開始 */
    .price-tag {
        width: 110px;
        height: 40px;
        font-size: 20px;
        text-align: center;
        position: absolute;
        top: 15px;
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