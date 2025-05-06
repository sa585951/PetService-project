<script setup>
import AppHeader from './components/common/AppHeader.vue'
import AppFooter from './components/common/AppFooter.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@fortawesome/fontawesome-free/css/all.css'
</script>

<template>
<div id="app">
  <AppHeader></AppHeader>
  <main><RouterView></RouterView></main>
  <AppFooter></AppFooter>
</div>
</template>

<style scoped>
</style>
