<template>
        <!-- From Uiverse.io by PriyanshuGupta28 --> 
<div class="rating">
     <div class="rating">
    <input value="5" name="rating" id="star5" type="radio" :checked="modelValue === 5" @change="updateValue(5)">
    <label for="star5"></label>
    <input value="4" name="rating" id="star4" type="radio" :checked="modelValue === 4" @change="updateValue(4)">
    <label for="star4"></label>
    <input value="3" name="rating" id="star3" type="radio" :checked="modelValue === 3" @change="updateValue(3)">
    <label for="star3"></label>
    <input value="2" name="rating" id="star2" type="radio" :checked="modelValue === 2" @change="updateValue(2)">
    <label for="star2"></label>
    <input value="1" name="rating" id="star1" type="radio" :checked="modelValue === 1" @change="updateValue(1)">
    <label for="star1"></label>
  </div>
</div>
</template>
    
<script setup>
    const props = defineProps({
        modelValue: Number,
    });
    const emit = defineEmits(['update:modelValue']);
    
    const updateValue = (value) => {
        emit('update:modelValue', value);
    };
</script>
    
<style scoped>
    /* From Uiverse.io by PriyanshuGupta28 */ 
.rating {
  display: inline-block;
}

.rating input {
  display: none;
}

.rating label {
  float: right;
  cursor: pointer;
  color: #ccc;
  transition: color 0.3s;
}

.rating label:before {
  content: '\2605';
  font-size: 30px;
}

.rating input:checked ~ label,
.rating label:hover,
.rating label:hover ~ label {
  color: rgb(155, 97, 27);
  transition: color 0.3s;
}
</style>