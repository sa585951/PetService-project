<template>
        <div class="home">
          <!-- 首頁輪播圖 -->
          <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
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
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
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
                      <i class="fas fa-dog fa-3x mb-3 text-primary"></i>
                      <h5 class="card-title">寵物散步</h5>
                      <p class="card-text">我們提供寵物領養服務，幫助流浪動物找到永久的家。我們確保所有寵物都經過健康檢查和行為評估。</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 mb-4">
                  <div class="card h-100">
                    <div class="card-body text-center">
                      <i class="fas fa-home fa-3x mb-3 text-primary"></i>
                      <h5 class="card-title">寵物住宿</h5>
                      <p class="card-text">我們提供寵物健康諮詢和基本醫療護理服務，確保寵物的健康和福祉。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>  
      
          <!-- 精選寵物區塊 -->
          <section class="featured-pets-section py-5">
            <div class="container">
              <h2 class="text-center mb-5">尋找家的寵物</h2>
              <div class="row">
                <div v-for="pet in featuredPets" :key="pet.id" class="col-md-4 mb-4">
                  <div class="card h-100">
                    <img :src="pet.image" class="card-img-top" :alt="pet.name">
                    <div class="card-body">
                      <h5 class="card-title">{{ pet.name }}</h5>
                      <p class="card-text">{{ pet.description }}</p>
                      <div class="d-flex justify-content-between align-items-center">
                        <span class="badge bg-primary">{{ pet.age }} 歲</span>
                        <span class="badge" :class="pet.gender === 'male' ? 'bg-info' : 'bg-danger'">
                          {{ pet.gender === 'male' ? '公' : '母' }}
                        </span>
                      </div>
                    </div>
                    <div class="card-footer">
                      <router-link :to="`/pets/${pet.id}`" class="btn btn-outline-primary w-100">了解更多</router-link>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-center mt-4">
                <router-link to="/pets" class="btn btn-primary">查看所有寵物</router-link>
              </div>
            </div>
          </section>
      
            <!-- 關於我們區塊 -->
            <section class="about-section py-5 bg-light">
            <div class="container">
              <div class="row">
                <div class="col-md-6">
                  <h2 class="mb-4">關於我們的使命</h2>
                  <p>Pet Adoption & Care是一個致力於幫助流浪動物找到永久住所的非營利組織。我們的使命是透過教育和社區參與，促進寵物領養文化，減少流浪動物數量。</p>
                  <p>我們相信每一個生命都有價值，每一隻寵物都應該得到愛和尊重。通過我們的努力，我們希望能夠創造一個沒有流浪動物的世界。</p>
                  <router-link to="/about" class="btn btn-primary mt-2">了解更多</router-link>
                </div>
                <div class="col-md-6">
                  <img src="../assets/picture/veterinarian.jpg" class="img-fluid rounded" alt="關於我們">
                </div>
              </div>
            </div>
          </section>
    
      
          <!-- 聯繫我們區塊 -->
          <section class="contact-section py-5">
            <div class="container">
              <h2 class="text-center mb-5">聯繫我們</h2>
              <div class="row">
                <div class="col-md-6 mb-4">
                  <div class="card h-100">
                    <div class="card-body">
                      <h5 class="card-title">聯繫信息</h5>
                      <p class="card-text">
                        <strong>地址：</strong> 台北市中正區100號<br>
                        <strong>電話：</strong> +886 2 1234 5678<br>
                        <strong>郵箱：</strong> info@petadoption.com<br>
                        <strong>營業時間：</strong> 週一至週五 9:00 - 18:00
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 mb-4">
                  <div class="card h-100">
                    <div class="card-body">
                      <h5 class="card-title">發送訊息</h5>
                      <form @submit.prevent="submitContactForm">
                        <div class="mb-3">
                          <input type="text" class="form-control" v-model="contactForm.name" placeholder="您的姓名" required>
                        </div>
                        <div class="mb-3">
                          <input type="email" class="form-control" v-model="contactForm.email" placeholder="您的郵箱" required>
                        </div>
                        <div class="mb-3">
                          <textarea class="form-control" v-model="contactForm.message" rows="3" placeholder="您的訊息" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">發送</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </template>
      
      <script>
      
      export default {
        name: 'HomeView',
        data() {
          return {
            featuredPets: [
              {
                id: 1,
                name: '小黑',
                description: '小黑是一隻活潑可愛的拉布拉多，非常喜歡和人互動。',
                age: 2,
                gender: 'male',
                image: 'https://i.imgur.com/2aKQXV7.jpg'
              },
              {
                id: 2,
                name: '小花',
                description: '小花是一隻溫順的貓咪，喜歡安靜的環境。',
                age: 3,
                gender: 'female',
                image: 'https://i.imgur.com/RtdFkJu.jpg'
              },
              {
                id: 3,
                name: '大壯',
                description: '大壯是一隻忠誠的德國牧羊犬，非常聰明。',
                age: 4,
                gender: 'male',
                image: 'https://i.imgur.com/LKNlcUw.jpg'
              }
            ],
            contactForm: {
              name: '',
              email: '',
              message: ''
            }
          }
        },
        methods: {
          submitContactForm() {
            // 實際應用中應該發送API請求
            alert('感謝您的訊息，我們會盡快回覆您！');
            this.contactForm.name = '';
            this.contactForm.email = '';
            this.contactForm.message = '';
          }
        },
        // 在實際應用中，應該從API獲取資料
        mounted() {
          // 在此處獲取資料，例如：
          // this.fetchFeaturedPets();
        }
      }
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
      </style>