# Pinia 狀態管理教學（從0開始）

本教學將帶你從零開始在 Vue 3 專案中安裝與使用 Pinia，並以本專案的 `stores` 資料夾、`App.vue`、`Navbar.vue` 為例，說明如何建立與使用 Pinia 狀態管理。

---

## 1. 安裝 Pinia

在專案根目錄下執行以下指令安裝 Pinia：

```bash
npm install pinia
```

---

## 2. 在 main.js/main.ts 註冊 Pinia

於 `src/main.js` 或 `src/main.ts` 中引入並註冊 Pinia：

```js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const app = createApp(App);
app.use(createPinia());
app.mount('#app');
```

---

## 3. 建立 Store（以 stores/loadingStore.js 為例）

在 `src/stores` 資料夾下建立一個 store，例如 `loadingStore.js`：

```js
import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false
  }),
  actions: {
    show() {
      this.isLoading = true;
    },
    hide() {
      this.isLoading = false;
    }
  }
});
```

---

## 4. 在元件中使用 Store

### 4.1 App.vue 範例

```vue
<script setup>
import { useLoadingStore } from '@/stores/loadingStore';
const loadingStore = useLoadingStore();
</script>

<template>
  <FullScreenLoading :show="loadingStore.isLoading" />
</template>
```

### 4.2 Navbar.vue 範例

```vue
<script setup>
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
</script>

<template>
  <div v-if="userStore.isLogin">歡迎，{{ userStore.username }}</div>
  <button @click="userStore.logout">登出</button>
</template>
```

---

## 5. 其他 Store 範例

本專案還有其他 store，例如：
- `user.js`：管理登入狀態、角色、使用者名稱
- `chatPopup.js`：管理聊天室彈窗開關與訊息

你可以依照需求建立更多 store，並在元件中透過 `useXXXStore()` 使用。

---

## 6. 小結

Pinia 是 Vue 3 官方推薦的狀態管理工具，語法簡潔、型別友善，適合中大型專案。建議將共用狀態集中於 `stores` 資料夾，並於元件中以 `useXXXStore()` 方式取得與操作。

如需更進階用法，請參考[官方文件](https://pinia.vuejs.org/zh/)。 