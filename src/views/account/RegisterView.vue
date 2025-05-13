<template>
    <div class="welcome-container">
      <div class="welcome-card scrollable">
      <h1 class="title">會員註冊</h1>
      <RegisterForm />
    </div>
    </div>
  </template>
  
  <script>
  import RegisterForm from '../../components/RegisterForm.vue'

  
  export default {
    components: {
      RegisterForm
    }
  }
  </script>

  <style scoped>
    .welcome-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    }

    .welcome-card {
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    padding: 40px;
    width: 100%;
    max-width: 480px;
    position: relative;
    overflow: hidden;
    text-align: center;
    }

    .title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #3d5a80;
    margin-bottom: 30px;
    }

    .scrollable {
    overflow-y: auto;
    flex:1;
    }
</style>