<template>
        <button class="cta">
                <span class="hover-underline-animation"><slot></slot> </span>
                <svg
                    id="arrow-horizontal"
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="10"
                    viewBox="0 0 46 16"
                >
                <path
                    id="Path_10"
                    data-name="Path 10"
                    d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
                    transform="translate(30)"
                    fill="#8B4513" 
                ></path>
                </svg>
            </button>
</template>
    
<script setup>
    
</script>
    
<style scoped>
    /* <!-- 旅館預定按鈕 --> */ 
.cta {
  border: none;
  background: none;
  cursor: pointer;
}

.cta span {
  padding-bottom: 7px;
  letter-spacing: 4px;
  font-size: 18px;
  padding-right: 15px;
}

.cta svg {
  transform: translateX(-8px);
  transition: all 0.3s ease;
}

.cta:hover svg {
  transform: translateX(0);
}

.cta:active svg {
  transform: scale(0.9);
}

.hover-underline-animation {
  position: relative;
  color: #8B4513;
  padding-bottom: 20px;
}

.hover-underline-animation:after {
  content: "";
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #8B4513;
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}

.cta:hover .hover-underline-animation:after {
  transform: scaleX(1);
  transform-origin: bottom left;
}
</style>