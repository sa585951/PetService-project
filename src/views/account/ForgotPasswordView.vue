<template>
    <div class="forgotpwd-container">
        <div class="forgotpwd-card">
            <div>
                <h2 class="title">忘記密碼?</h2>
                <p>請輸入註冊時的信箱，我們將發送重設密碼連結至信箱。</p>
                <label for="email">Email</label>
                <input v-model="email" placeholder="請輸入註冊 Email" />
                <button class="btn-submit" @click="sendResetLink">送出</button>
                <p>{{ message }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
      return {
        email: "",
        message: ""
      };
    },
    methods: {
      async sendResetLink() {
        const res = await fetch("https://localhost:7089/api/Account/ForgotPassword", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            frontendUrl: "http://localhost:5173"  // 你的前端 URL，依實際情況修改
          })
        });

        if(res.ok){
            const data = await res.json();
            this.message = data.message;
            setTimeout(() => {
                this.$router.push("/login");
            }, 3000);
        }else{
            const errorData = await res.json();
            this.message = errorData.message || "發生錯誤，請稍後再試";
        }
      }
    }
  };
</script>

<style scoped>
.title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #3d5a80;
    margin-bottom: 30px;
}
.forgotpwd-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  padding: 20px;
  overflow: hidden;
}

.forgotpwd-card {
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

label{
    font-weight: bold;
    display: flex;

}

input{
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;

    margin-bottom: 16px;
    resize: vertical;
}
.btn-submit {
    width: 100%;
    padding: 12px;
    background-color: #ACC572;
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn-submit:hover {
    background-color: #95bf33;
}
</style>