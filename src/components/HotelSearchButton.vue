<template>
<!-- From Uiverse.io by vikiWayne --> 
<button class="button">搜尋</button>
</template>
    
<script setup>
    
</script>
    
<style scoped>
    /* From Uiverse.io by vikiWayne */ 
.button {
   width: 80px;
  /* height: 80%; */
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  letter-spacing: 5px;
  text-transform: uppercase;
  cursor: pointer;
  color: rgb(175, 115, 42);
  transition: all 500ms;
  font-size: 15px;
  position: relative;
  overflow: hidden;
  outline: 2px solid rgb(175, 115, 42);
  background-color: rgb(249, 245, 202);
}

button:hover {
  color: #ffffff;
  transform: scale(1.1);
  outline: 2px solid rgb(175, 115, 42);
  box-shadow: 4px 5px 10px -3px rgb(175, 115, 42);
}

button::before {
  content: "";
  position: absolute;
  left: -50px;
  top: 0;
  width: 0;
  height: 100%;
  background-color: rgb(175, 115, 42);
  transform: skewX(45deg);
  z-index: -1;
  transition: width 500ms;
}

button:hover::before {
  width: 250%;
}
</style>