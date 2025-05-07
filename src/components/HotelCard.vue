<template>
<div class="card mb-3" style="max-width: 100%;">
    <div class="row g-0 hotel_card">
        <div class="col-md-4">
            <img src="../assets/Hotel/hotel_1.jpg" class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <div class="p-0">
                    <img class="star" src="../assets/Hotel/star_light.png">
                    <img class="star" src="../assets/Hotel/star_light.png">
                    <img class="star" src="../assets/Hotel/star_light.png">
                    <img class="star" src="../assets/Hotel/star_light.png">
                    <img class="star" src="../assets/Hotel/star_gray.png">
                </div>
                <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
            </div>
        </div>
    </div>
</div>
</template>
    
<script setup>
    
</script>
    
<style scoped>
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
</style>