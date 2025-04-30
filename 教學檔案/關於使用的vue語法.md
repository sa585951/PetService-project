# 關於使用的 Vue 語法

> 本文件依據專案實際掃描自動更新，內容涵蓋 GeeYeangSoreVue/src 目錄下所有 Vue 元件實際用到的語法。

本專案主要採用 Vue 3 + `<script setup>` 語法，結合 Pinia 狀態管理、Vue Router 路由、元件化開發等現代前端技術。以下統整專案中常見的 Vue 語法與用法，並附上實際範例。

---

## 1. 單檔元件（Single File Component, SFC）
- 每個元件檔案副檔名為 `.vue`，通常包含三個區塊：
  - `<template>`：HTML 標記
  - `<script setup>`：邏輯與資料
  - `<style scoped>`：元件專屬 CSS

---

## 2. `<script setup>` 語法糖
- 更簡潔的 Vue 3 撰寫方式，所有變數、方法直接暴露給 template 使用。
- 例如：
```vue
<script setup>
import { ref } from 'vue';
const count = ref(0);
function inc() { count.value++; }
</script>
```

---

## 3. 元件引入與使用
- 先 import，再直接在 template 使用。
```vue
<script setup>
import Navbar from '@/components/common/Navbar.vue';
</script>
<template>
  <Navbar />
</template>
```

---

## 4. Props 傳遞
- 使用 `defineProps` 定義父元件傳入的資料。
```vue
<script setup>
const props = defineProps({
  title: String,
  tags: Array
});
</script>
```
- 實例：
```vue
<script setup>
const props = defineProps({
  showSend: { type: Boolean, default: true },
  showEmoji: { type: Boolean, default: true },
});
</script>
```

---

## 5. Emits 事件
- 使用 `defineEmits` 定義子元件可發送的事件。
```vue
<script setup>
const emit = defineEmits(['send']);
function sendMsg() { emit('send', '內容'); }
</script>
```
- 實例：
```vue
<script setup>
const emit = defineEmits(['send']);
function send() {
  if (text.value.trim()) {
    emit('send', text.value);
    text.value = '';
  }
}
</script>
```

---

## 6. v-for 與 v-if
- `v-for` 用於列表渲染，`v-if` 用於條件顯示。
```vue
<div v-for="item in list" :key="item.id">{{ item.name }}</div>
<div v-if="isShow">顯示內容</div>
```
- 實例：
```vue
<div class="col-md-4" v-for="(item, i) in recommendList" :key="'rec' + i">
  <PropertyCard ... />
</div>
```

---

## 7. 雙向綁定 v-model
- 常用於表單輸入。
```vue
<input v-model="keyword" />
```
- 實例：
```vue
<select v-model="city">...</select>
<input v-model="text" type="text" />
```

---

## 8. Pinia 狀態管理
- 以 `defineStore` 建立全域狀態。
```js
import { defineStore } from 'pinia';
export const useUserStore = defineStore('user', {
  state: () => ({ isLogin: false }),
  actions: { login() { this.isLogin = true; } }
});
```
- 在元件中使用：
```js
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
```

---

## 9. 計算屬性 computed
- 用於根據資料自動計算結果。
```js
import { computed } from 'vue';
const double = computed(() => count.value * 2);
```
- 實例：
```js
const filteredContacts = computed(() =>
  props.contacts.filter(c => c.name.includes(search.value))
);
```

---

## 10. 生命週期 onMounted/onUnmounted
- 控制元件掛載與卸載時的行為。
```js
import { onMounted, onUnmounted } from 'vue';
onMounted(() => { /* ... */ });
onUnmounted(() => { /* ... */ });
```
- 實例：
```js
onMounted(() => {
  startAuto();
});
onUnmounted(() => {
  stopAuto();
});
```

---

## 11. 插槽 slot/v-slot
- 讓父元件自訂內容插入子元件。
```vue
<slot name="badge">預設內容</slot>
```
- 父元件用法：
```vue
<PropertyCard ...>
  <template #badge>自訂內容</template>
</PropertyCard>
```
- 也可用於 StepItem、BadgeList 等元件。

---

## 12. 其他常見語法
- `v-bind`（縮寫 :）
- `v-on`（縮寫 @）
- `scoped style` 保證 CSS 只作用於本元件

---

## 13. 本專案未用到的進階語法
- `provide`/`inject`
- `watch`/`watchEffect`
- `expose`
- `<teleport>`、`<suspense>`、`<transition>`、`<TransitionGroup>`
- `useRoute`、`useRouter`

如需這些進階語法教學，請參考[官方文件](https://vuejs.org/)。

---

# 補充：Vue 語法簡易教學

## 1. 資料響應式
- 用 `ref` 或 `reactive` 建立響應式資料。

## 2. 父子元件溝通
- 父傳子：props
- 子傳父：emit

## 3. 狀態管理
- 跨元件共用資料用 Pinia

## 4. 路由切換
- 用 `<router-link>` 切換頁面

---

如需更詳細教學，建議參考[官方文件](https://vuejs.org/)。

---
