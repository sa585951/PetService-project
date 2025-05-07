<template>
    <div class="Header_div mb-3">
        <img src="../assets/Hotel/hotelBackground.jpg" class="img_background">
        <div class="search_bar1"> 
            <div class="search_bar2"> 
                <div class="col-4 d-flex justify-content-center align-items-center"> 
                    <!-- <i class="bi bi-calendar4"></i> --> 
                    <input type="date" id="Datepicker_start"> 
                </div> 
                <span><i class="bi bi-arrow-right"></i></span>
                <div class="col-4 d-flex justify-content-center align-items-center"> 
                    <!-- <i class="bi bi-calendar4"></i> -->
                    <input type="date" id="checkout">
                </div>
                <div class="col-2">
                    <label for="guests" class="me-2">毛孩數量:</label> 
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
                    <div class="col-2 p-2 text-center"> 
                        <SearchButton onclick="searchHotels()">搜尋</SearchButton> 
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
                    <p class="card-text fw-bold">環境設施</p> <hr/> 
                    <p class="card-text">泳池</p> 
                    <p class="card-text">戶外場地</p> 
                    <hr/><p class="card-text fw-bold">照護需求</p> <hr/> 
                    <Checkbox :checkboxId="checkboxId1" :labelText="dynamicText1"></Checkbox> 
                    <Checkbox :checkboxId="checkboxId2" :labelText="dynamicText2" ></Checkbox> 
                </div> 
            </div> 
        </div> 

    
        <div class="col-10">
            <HotelCard></HotelCard>
            <HotelCard></HotelCard>
            <HotelCard></HotelCard>
        </div>
    </div>
    
</div>


    
</template>


<script setup>
    // new AirDatepicker('#Datepicker_start');
    import HotelCard from '@/components/HotelCard.vue';
    import SearchButton from '../components/HotelSearchButton.vue';
    import Checkbox from '@/components/HotelCheckbox.vue'; 
    //Checkbox測試 
     const checkboxId1 = 'cbx-1' 
     const checkboxId2 = 'cbx-2'
     const dynamicText1 = '24小時照顧'
     const dynamicText2 = '接送服務' 
    

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
    } 

    hr { 
        margin: 8px -5px; 
    } 
    
    p { 
        margin: 0; 
    } 

    .card_left { 
        background-color: rgb(255, 255, 255); 
    } 

    i { 
        color: rgb(175, 115, 42);
    } 

</style>
