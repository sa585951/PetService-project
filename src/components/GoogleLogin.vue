<template>
    <div class="google-login-container">
    <button 
      class="btn-google"
      @click="handleCustomGoogleSignIn"
      type="button"
      :disabled="authStore.isLoggingIn"
    >
      <div class="btn-content">
        <img class="google-icon" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=" alt="Google logo">
        <span v-if="authStore.isLoggingIn">{{authStore.loginStatusText}}</span>
        <span v-else>使用Google繼續</span>
      </div>
    </button>
        <div id="g_id_signin" class="google-rendered-button-container"
        v-if="showRenderedButton && !authStore.isLoggingIn">
      </div>
  </div>
</template>
<script setup>
import { ref,onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import Swal from 'sweetalert2';

const router = useRouter();
const authStore = useAuthStore();
const showRenderedButton = ref(false);
// 定義函式 (原先在 methods 中的方法)
const loadGoogleLogin = () => {
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  script.onload = initGoogle; // 直接引用函式本身
  script.onerror = () => {
      console.error("Google Identity Services SDK failed to load.");
      // 如果 SDK 失敗，顯示 Rendered Button 的容器作為備用提示
      showRenderedButton.value = true;
      // 【新增】: 通知 Store 停止可能的載入狀態 (如果 SDK 失敗)
      authStore.stopLoading(false); // 不清除文字，可以在容器裡顯示 "服務載入失敗" 之類的
      authStore.loginStatusText = '服務載入失敗'; // 直接設定 Store 的文字
  };
  document.head.appendChild(script);
};

const initGoogle = () => {
  // 增加檢查，確保 Google Identity Services SDK 已經載入
  if (!window.google || !window.google.accounts || !window.google.accounts.id) {
    console.error("Google Identity Services SDK is not available.");
    showRenderedButton.value = true;
    authStore.stopLoading(false);
    authStore.loginStatusText = '服務載入失敗';
    return;
  }

  window.google.accounts.id.initialize({
    client_id: "484288879708-9rr8ulohmiv37n7vjsvtcsvrm71abs0e.apps.googleusercontent.com",
    callback: handleGoogleResponse, // 直接引用函式本身
    ux_mode: "popup", // 或 'redirect'
  });

  // ****** 【新增】: 渲染傳統的 Google 登入按鈕 ******
  window.google.accounts.id.renderButton(
    document.getElementById("g_id_signin"), // 指定按鈕要渲染在哪個 DOM 元素裡
    {
      // 按鈕的樣式和文字設定 (這些設定會影響渲染出來的按鈕外觀)
      type: "standard",     // 按鈕類型: standard (標準) 或 icon (圖標)
      theme: "outline",     // 主題: outline (外框), filled_blue (藍色填充), filled_white (白色填充)
      size: "large",        // 尺寸: small, medium, large
      text: "signin_with",  // 按鈕文字: signin_with, signup_with, continue_with, signup_for
      shape: "rectangular", // 形狀: rectangular (矩形), pill (藥丸形)
      logo_alignment: "left", // 圖標位置: left, center
      width: 300            // 可選: 指定按鈕寬度 (像素)
    }
  );

   // 你可以選擇是否依然呼叫 prompt() 來嘗試顯示 One Tap
   // window.google.accounts.id.prompt(); 
   // 如果你只希望使用者看到按鈕，可以移除這裡和 handleCustomGoogleSignIn 裡的 prompt() 呼叫

};

const handleCustomGoogleSignIn = () => {
   // 在觸發 prompt() 前，確保 SDK 已載入並初始化
   if (!window.google || !window.google.accounts || !window.google.accounts.id) {
     console.error("Google Identity Services SDK 尚未載入或初始化，無法觸發登入提示。");
     alert("Google 登入服務尚未準備好，請稍後再試。");
     // 如果 SDK 失敗，顯示渲染按鈕容器作為備用
     showRenderedButton.value = true;
     // 【新增】: 通知 Store 停止可能的載入狀態
     authStore.stopLoading(false);
     authStore.loginStatusText = '服務載入失敗'; // 直接設定 Store 的文字
     return;
   }
   // 觸發 Google 登入提示 (One Tap 或 Popup)
   // 提供回調函式來接收 prompt() 的狀態通知
   window.google.accounts.id.prompt((notification) => {
     console.log('Google prompt notification:', notification);

     // 判斷提示是否因為某種原因而「沒有顯示」
     if (notification.isNotDisplayed()) {
       console.log(`Google prompt was not displayed. Reason: ${notification.getNotDisplayedReason()}. Showing rendered button container.`);
       showRenderedButton.value = true; // 如果提示沒有顯示，讓 Rendered Button 的容器顯示
     }
     // 如果 notification.isDisplayed() 為 true，表示提示正在顯示，不需要顯示 Rendered Button。
     // 如果使用者與提示互動並成功登入，handleGoogleResponse 會被呼叫。
   });
};

const handleGoogleResponse = async (response) => {
  console.log("收到 Google API 的回應 (認證成功):", response);
  console.log("檢查 showRenderedButton 變數:", showRenderedButton);
  console.log("檢查 showRenderedButton 的類型:", typeof showRenderedButton); // 也印出它的類型

  // ****** 【修改】: 在呼叫後端 API 前啟動 Store 的全域載入狀態和打字特效 ******
  authStore.startLoading(); // 呼叫 Store 的 Action

  try {
    // 確保 client_id 是有效的
    if (!response.credential || response.credential.length < 100) { // 一個非常基本的憑證長度檢查
      console.error("收到的憑證（idToken）似乎無效，長度異常或不存在。");
      alert("Google 登入失敗：憑證無效。");
      authStore.stopLoading();
      return;
    }

    const res = await fetch("https://localhost:7089/api/account/GoogleLogin", {
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
    localStorage.setItem("memberId", data.memberId);

    const authStore = useAuthStore();
    authStore.login({
      userName: data.userName,
      token: data.token,
      memberId: data.memberId
    })
    if (data.needSupplement) {
      router.push("/googlesignupsupplement"); // 使用 router 實例進行導航
    } else {
      router.push("/memberdashboard"); // 使用 router 實例進行導航
      console.log('Login successful. Data:', data);
      Swal.fire({
        icon: 'success',
        title: '登入成功',
        text: '歡迎回來，' + data.userName,
        timer: 2000,
        showConfirmButton: false
      })
    }
    
    // 如果 Rendered Button 顯示了，成功登入後把它隱藏起來
    showRenderedButton.value = false; // 隱藏 Rendered Button 的容器

  } catch (err) {
    console.error("登入失敗", err);
    alert(`Google 登入失敗: ${err.message || '未知錯誤'}`);
    authStore.stopLoading();
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

/* 【新增】載入狀態下的禁用樣式 */
.btn-google:disabled {
    cursor: not-allowed;
    opacity: 0.6; /* 使按鈕變暗 */
    /* background-color: #e0e0e0; /* 載入中背景色 */
    /* color: #a0a0a0; /* 載入中文本顏色 */
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
.google-rendered-button-container {
    margin-top: 10px;
    display: flex;
    justify-content: center;
}
  </style>