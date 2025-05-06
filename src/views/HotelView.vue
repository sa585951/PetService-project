<template>
    <div class="Header_div mb-3">
        <img src="../assets/Hotel/hotelBackground.jpg" class="img_background">
        <div class="search_bar1">
            <div class="search_bar2">
                <div class="row p-2 d-flex justify-content-center align-items-center">
                    <div class="col-4">
                        <!-- <i class="bi bi-calendar4"></i> -->
                        <label for="Datepicker_start">入住日期：</label>
                        <input type="date" id="Datepicker_start" class="me-3">
                    </div>
                    <div class="col-4">
                        <!-- <i class="bi bi-calendar4"></i> -->
                        <label for="checkout">退房日期：</label>
                        <input type="date" id="checkout"class="me-5">
                    </div>
                    <div class="col-2">
                        <label for="guests">毛孩數量:</label>
                        <select name="guests" id="guests">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                    </div>
                    <div class="col-2 p-2">
                        <SearchButton onclick="searchHotels()"></SearchButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-2">

        </div>
        <div class="col-10">
            <HotelCard></HotelCard>
            <HotelCard></HotelCard>
            <HotelCard></HotelCard>
        </div>

    </div>


    
</template>


<script setup>
    // new AirDatepicker('#Datepicker_start');
    import HotelCard from '@/components/HotelCard.vue';
    import SearchButton from '../components/HotelSearchButton.vue';

    
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
        background-color: rgb(249, 245, 202);
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
        width: 100%;
        border: none;
        outline: none;
        background: transparent;
    }
    
    @import url('https://cdn.jsdelivr.net/npm/air-datepicker@3.3.5/air-datepicker.min.css');
</style>
