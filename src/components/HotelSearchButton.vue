<template> 
<!-- From Uiverse.io by vikiWayne -->  
<button class="button"><slot></slot></button> 

</template>
    
<script setup>
    
</script>
    
<style scoped>
    /* From Uiverse.io by Praashoo7 */ 
.button {
  outline: none;
  color: rgb(155, 97, 27);
  padding: 3px;
  padding-left: 30px;
  padding-right: 30px;
  border: 2px dashed rgb(192, 129, 53);
  border-radius: 15px;
  background-color: #EADDCA;
  box-shadow: 0 0 0 4px #EADDCA, 2px 2px 4px 2px rgba(0, 0, 0, 0.5);
  transition: .1s ease-in-out, .4s color;
}
.button:hover {
  border: 2px dashed rgb(224, 162, 86);
}

.button:active {
  transform: translateX(0.1em) translateY(0.1em);
  box-shadow: 0 0 0 4px #EADDCA, 1.5px 1.5px 2.5px 1.5px rgba(0, 0, 0, 0.5);
}
</style>