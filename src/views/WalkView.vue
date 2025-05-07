<!-- src/views/Walk.vue -->
<template>
    <section>
      <h1>遛狗服務員工列表</h1>
      <EmployeeList />
    </section>
  </template>
  
  <script setup>
  import EmployeeList from '@/components/EmployeeList.vue'
  </script>
  
  <style scoped>
  h1 {
    font-size: 1.8rem;
    margin: 1rem 0;
  }
  </style>
  