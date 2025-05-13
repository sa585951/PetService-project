<template>
  <div class="container mt-5">
    <h2>編輯寵物 {{ $route.params.id }}</h2>
    <p>這裡是編輯寵物 ID 為 {{ $route.params.id }} 的頁面。</p>
    <router-link to="/pet" class="btn btn-secondary">返回我的寵物</router-link>
    </div>
</template>

<script setup>
// 您可以在這裡定義編輯邏輯，例如根據 ID 載入寵物資料等
import { useRoute } from 'vue-router';
const route = useRoute();
console.log('編輯寵物 ID:', route.params.id);
</script>