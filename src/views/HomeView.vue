<template>
  <div class="home">
    <!-- 首頁輪播圖 -->
    <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active"
          aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1"
          aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2"
          aria-label="Slide 3"></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="../assets/picture/veterinarian.jpg" class="d-block w-100" alt="寵物散步">
          <div class="carousel-caption d-none d-md-block">
            <h5>給他們一個溫暖的家</h5>
            <p>每一個生命都應該被愛和尊重</p>
          </div>
        </div>
        <div class="carousel-item">
          <img src="../assets/picture/2148765183.jpg" class="d-block w-100" alt="寵物照護">
          <div class="carousel-caption d-none d-md-block">
            <h5>專業的寵物照護</h5>
            <p>我們提供最好的寵物照護服務</p>
          </div>
        </div>
        <div class="carousel-item">
          <img src="../assets/picture/kitten-puppy.jpg" class="d-block w-100" alt="寵物住宿">
          <div class="carousel-caption d-none d-md-block">
            <h5>安心的寵物住宿</h5>
            <p>提供最安全的住宿環境</p>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <!-- 服務區塊 -->
    <section class="services-section py-5 bg-light">
      <div class="container">
        <h2 class="text-center mb-5">我們的服務</h2>
        <div class="row">
          <div class="col-md-6 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <img src="../components/icons/walk.png" alt="" class="logo">
                <p class="card-text">我們提供寵物領養服務，幫助流浪動物找到永久的家。我們確保所有寵物都經過健康檢查和行為評估。</p>
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <img src="../components/icons/hotel.png" alt="" class="logo">
                <p class="card-text">我們提供寵物健康諮詢和基本醫療護理服務，確保寵物的健康和福祉。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 精選寵物區塊 -->
    <section class="featured-hotels-section py-5">
      <div class="container">
        <h2 class="text-center mb-5">精選住宿推薦</h2>
        <div class="row">
          <div v-for="hotel in featuredHotels" :key="hotel.id" class="col-md-4 mb-4">
            <div class="card h-100 hotel-card" @click="goToDetail">
              <img :src="`/Hotel/${hotel.image_1}`" class="card-img-top" :alt="hotel.name"
                style="height: 200px; object-fit: cover;">
              <div class="card-body">
                <h5 class="card-title">{{ hotel.name }}</h5>
                <div class="d-flex  align-items-center mb-2">
                  <div>
                    <img v-for="i in hotel?.rating" :key="'light_' + i" src="/Hotel/star_light.png" class="star">
                    <img v-for="i in 5 - (hotel?.rating || 0)" :key="'gray_' + i" src="/Hotel/star_gray.png"
                      class="star">
                  </div>
                  <div class="ratingbox">{{ getRating(hotel.rating) }}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="text-center mt-4">
          <router-link to="/hotel" class="btn btn-success">查看所有住宿</router-link>
        </div>
      </div>
    </section>

    <!-- 關於我們區塊 -->
    <section class="about-section py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h2 class="mb-4">關於我們的使命</h2>
            <p>毛孩管家是一個專為寵物打造的全方位照護平台，結合「寵物散步」與「寵物住宿」兩大核心服務，讓飼主能安心為毛孩安排專業的陪伴與住宿環境。</p>
            <p>我們致力於提供溫暖、安全且值得信賴的服務體驗，無論是短暫外出或長期旅行，都能輕鬆透過平台找到合適的照護夥伴，讓毛孩擁有快樂每一天。</p>
          </div>
          <div class="col-md-6">
            <img src="../assets/picture/veterinarian.jpg" class="img-fluid rounded" alt="關於我們">
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const featuredHotels = ref([]);

function getRating(rating) {
  if (rating == null) return "無";
  return ['普通', '普通', '好', '很好', '很棒'][rating - 1] || '普通';
}

function goToDetail() {
  router.push('/hotel');
}

onMounted(async () => {
  const API_URL = `${import.meta.env.VITE_API_BaseURL}/Hotel`;
  const response = await fetch(API_URL);
  const data = await response.json();
  featuredHotels.value = data.hotels.slice(0, 3);
  console.log('取得 featuredHotels：', featuredHotels.value);
});
</script>

<style scoped>
.carousel-item img {
  height: 600px;
  object-fit: cover;
}

.carousel-caption {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 5px;
}

.card {
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.services-section i {
  color: #ff6b6b;
}

.bg-light {
  background-color: #f8f9fa !important;
}

.bg-primary {
  background-color: #0d6efd !important;
}

.bg-info {
  background-color: #0dcaf0 !important;
}

.bg-danger {
  background-color: #dc3545 !important;
}

.hotel-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.hotel-card:hover {
  transform: scale(1.02);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.star {
  width: 23px;
  height: 23px;
}
.logo{
    width: 100px;
    height: 100px;
    margin-bottom: 10px;
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
    .btn-success {
        background-color: #8aac3b;
        border-color: #8aac3b;
    }
    .btn-success:hover {
        background-color: #7c9e2d;
        border-color: #7c9e2d;
    }
    .btn-success:active {
        background-color: #6a8a1f;
        border-color: #6a8a1f;
    }
</style>