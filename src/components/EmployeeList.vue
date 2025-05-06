<!-- components/EmployeeList.vue -->
<template>
  <div class="container">
    <!-- 篩選區塊 -->
    <div class="row mb-4 filter-background ">
      <div class="col-md-3"></div>
      <div class="col-md-3">
        <select v-model="districtFilter" class="form-select">
          <option value="">全部地區</option>
          <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <select v-model="typeFilter" class="form-select">
          <option value="">全部寵物</option>
          <option v-for="t in petTypes" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <div class="col-md-3"></div>
    </div>

    <!-- 員工清單（使用元件） -->
    <div class="row justify-content-center mb-4" v-for="emp in filteredEmployees" :key="emp.id">
      <div class="col-md-6">
        <EmployeeCard :employee="emp" />
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, computed } from 'vue'
import { employees } from '@/data';
import EmployeeCard from './EmployeeCard.vue'



const districtFilter = ref('')
const typeFilter = ref('')

console.log(employees); //檢查資料

const filteredEmployees = computed(() => {
  return employees.filter(e => {
    const matchDistrict = districtFilter.value === '' || e.district === districtFilter.value
    const matchType = typeFilter.value === '' || e.petType.includes(typeFilter.value)
    return matchDistrict && matchType //可以各別搜尋
  })
})

const districts = ["鼓山區", "三民區", "鹽埕區", "苓雅區", "前鎮區"]
const petTypes = ["狗", "貓", "兔"]
</script>

<style scoped>
.filter-container {
  margin-bottom: 1rem;
}
.filter-background {
  background-image: url('@/assets/walkservicesimages/dog6.jpg'); 
  background-position: center;
  padding:150px 10px;
  background-size: 100% 500px;
  background-repeat: no-repeat;
}

</style>