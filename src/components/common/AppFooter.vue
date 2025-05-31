<template>
    <footer class="bg-dark text-white pt-5 pb-4">
      <div class="container">
        <div class="row text-center text-md-left">
          <div class="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 class="text-uppercase mb-4 font-weight-bold text-warning">
              <i class="fas fa-paw"></i> 毛孩管家
            </h5>
            <p>
              解決現代毛孩家庭的困境<br>
              我們提供專業寵物散步服務，也整合優質寵物住宿選擇。
            </p>
          </div>
  
          <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 class="text-uppercase mb-4 font-weight-bold text-warning">快速連結</h5>
            <p>
              <router-link to="/" class="text-white" style="text-decoration: none;">首頁</router-link>
            </p>
            <p>
              <router-link to="/walk" class="text-white" style="text-decoration: none;">寵物散步</router-link>
            </p>
            <p>
              <router-link to="/hotel" class="text-white" style="text-decoration: none;">寵物住宿</router-link>
            </p>
          </div>
  
          <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 class="text-uppercase mb-4 font-weight-bold text-warning">用戶行動</h5>
            <p>
              <router-link to="/login" class="text-white" style="text-decoration: none;">登入</router-link>
            </p>
            <p>
              <router-link to="/register" class="text-white" style="text-decoration: none;">註冊</router-link>
            </p>
            <p>
              <router-link to="/profile" class="text-white" style="text-decoration: none;">個人資料</router-link>
            </p>
            <p>
              <router-link to="/qa" class="text-white" style="text-decoration: none;">幫助</router-link>
            </p>
          </div>
  
          <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 class="text-uppercase mb-4 font-weight-bold text-warning">聯繫方式</h5>
            <p>
              <i class="fas fa-home mr-3"></i> 台北市，中正區，100號
            </p>
            <p>
              <i class="fas fa-envelope mr-3"></i> info@petadoption.com
            </p>
            <p>
              <i class="fas fa-phone mr-3"></i> +886 2 1234 5678
            </p>
            <p>
              <i class="fas fa-print mr-3"></i> +886 2 8765 4321
            </p>
          </div>
        </div>
  
        <hr class="mb-4">
  
        <div class="row align-items-center">
          <div class="col-md-7 col-lg-8">
            <p>
              版權所有 &copy; {{ currentYear }}
              <strong class="text-warning">Pet Adoption & Care</strong>
              - 所有權利保留
            </p>
          </div>
  
          <div class="col-md-5 col-lg-4">
            <div class="text-center text-md-right">
              <ul class="list-unstyled list-inline">
                <li class="list-inline-item">
                  <a href="#" class="btn-floating btn-sm text-white" style="font-size: 23px;">
                    <i class="fab fa-facebook"></i>
                  </a>
                </li>
                <li class="list-inline-item">
                  <a href="#" class="btn-floating btn-sm text-white" style="font-size: 23px;">
                    <i class="fab fa-twitter"></i>
                  </a>
                </li>
                <li class="list-inline-item">
                  <a href="#" class="btn-floating btn-sm text-white" style="font-size: 23px;">
                    <i class="fab fa-instagram"></i>
                  </a>
                </li>
                <li class="list-inline-item">
                  <a href="#" class="btn-floating btn-sm text-white" style="font-size: 23px;">
                    <i class="fab fa-youtube"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'AppFooter',
    data() {
      return {
        currentYear: new Date().getFullYear()
      }
    }
  }
  </script>
  
  <style scoped>
  footer {
    margin-top: 2rem;
  }
  
  i.fas, i.fab {
    margin-right: 0.5rem;
  }
  
  .list-inline-item {
    margin-right: 0.8rem;
  }
  
  .btn-floating:hover {
    color: #ffc107 !important;
  }
  </style>