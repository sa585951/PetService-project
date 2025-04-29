<script setup>
import Navbar from './components/Navbar.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
</script>

<template>
<div class="container">
  <Navbar></Navbar>
  <RouterView></RouterView>
</div>

</template>

<style scoped>
</style>
