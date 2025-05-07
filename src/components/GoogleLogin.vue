<template>
    <div class="google-login-container">
    <button 
      class="btn-google"
      @click="handleCustomGoogleSignIn"
      type="button"
    >
      <div class="btn-content">
        <img class="google-icon" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=" alt="Google logo">
        <span>使用Google繼續</span>
      </div>
    </button>
  </div>
</template>
<script>
 export default {
    name: "GoogleLogin",
    mounted() {
      this.loadGoogleLogin();
    },
     methods: {
      loadGoogleLogin() {
      // 加載 GIS SDK
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = this.initGoogle;
      document.head.appendChild(script);
    },
    initGoogle() {
      window.google.accounts.id.initialize({
        client_id: "102183488459-f1f6gdj7ceoequ9gen96n4qp748ljnr8.apps.googleusercontent.com", 
        callback: this.handleGoogleResponse,
        ux_mode: "popup",
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        {
          theme: "outline",
          size: "large",
          text: "continue_with",
          width: 250,
        }
      );
    },
    async handleGoogleResponse(response) {
      try {
        const res = await fetch("https://localhost:7150/api/account/GoogleLogin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken: response.credential }),
        });

        if (!res.ok) throw new Error("登入失敗");

        const data = await res.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.userName);

        if (data.needSupplement) {
          this.$router.push("/googlesignupsupplement");
        } else {
          this.$router.push("/sucesslogin");
        }
      } catch (err) {
        console.error("登入失敗", err);
        alert("Google 登入失敗");
      }
    },
}
 }
</script>

<style scoped>
   .google-login-container {
  display: block;
  width: 100%;
  margin-bottom: 20px;
}

/* 匹配主按鈕風格的Google按鈕 */
.btn-google {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: white;
  color: #757575;
  border: 1px solid #dadce0;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.btn-google:hover {
  background-color: #f1f1f1;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.google-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}
  </style>