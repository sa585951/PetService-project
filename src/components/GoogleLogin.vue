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
<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
// 定義函式 (原先在 methods 中的方法)
const loadGoogleLogin = () => {
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  script.onload = initGoogle; // 直接引用函式本身
  document.head.appendChild(script);
};

const initGoogle = () => {
  // 增加檢查，確保 Google Identity Services SDK 已經載入
  if (!window.google || !window.google.accounts || !window.google.accounts.id) {
    console.error("Google Identity Services SDK is not available.");
    return;
  }

  window.google.accounts.id.initialize({
    client_id: "102183488459-f1f6gdj7ceoequ9gen96n4qp748ljnr8.apps.googleusercontent.com",
    callback: handleGoogleResponse, // 直接引用函式本身
    ux_mode: "popup", // 或 'redirect'
  });
};

const handleCustomGoogleSignIn = () => {
  if (window.google && window.google.accounts && window.google.accounts.id) {
    // 觸發 Google 登入提示（通常會顯示 One Tap 或彈出視窗）
    window.google.accounts.id.prompt((notification) => {
      // 這個回調函數是可選的，用於監聽提示的狀態
      // console.log('Google prompt notification:', notification);
    });
  } else {
    console.error("Google Identity Services SDK 尚未載入或初始化。");
    alert("Google 登入服務尚未準備好，請稍後再試。");
  }
};

const handleGoogleResponse = async (response) => {
  try {
    // 確保 client_id 是有效的
    if (!response.credential || response.credential.length < 100) { // 一個非常基本的憑證長度檢查
      console.error("收到的憑證（idToken）似乎無效，長度異常或不存在。");
      alert("Google 登入失敗：憑證無效。");
      return;
    }

    const res = await fetch("https://localhost:7150/api/account/GoogleLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken: response.credential }),
    });

    if (!res.ok) {
      const errorData = await res.json(); // 嘗試解析錯誤訊息
      throw new Error(errorData.message || "登入失敗");
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("userName", data.userName);

    if (data.needSupplement) {
      router.push("/googlesignupsupplement"); // 使用 router 實例進行導航
    } else {
      router.push("/sucesslogin"); // 使用 router 實例進行導航
    }
  } catch (err) {
    console.error("登入失敗", err);
    alert(`Google 登入失敗: ${err.message || '未知錯誤'}`);
  }
};

// mounted 生命週期鉤子，在 <script setup> 中使用 onMounted
onMounted(() => {
  loadGoogleLogin(); // 載入 Google 登入 SDK
});
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