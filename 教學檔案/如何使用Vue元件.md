# 如何使用 Vue 元件

## 1. 基本使用方式

假設你有一個元件 `Button.vue`，你可以這樣在其他元件或 view 中引用：

```vue
<template>
  <div>
    <Button />
  </div>
</template>

<script setup>
import Button from '@/components/Button.vue'
</script>
```

## 2. 傳遞 Props 來自訂內容

大多數元件都會設計 props 來讓你自訂內容或行為，例如：

```vue
<Button label="送出" color="primary" />
```

## 3. 覆寫樣式

### 方法一：使用 class 或 style

你可以傳遞自訂 class 或 style 來覆寫元件的部分樣式：

```vue
<Button class="my-custom-btn" />
```

然後在你的樣式檔案中：

```css
.my-custom-btn {
  background-color: #ff6600;
  color: #fff;
}
```

### 方法二：使用深度選擇器

如果元件內部有預設樣式，你可以用深度選擇器覆寫（假設你用的是 SFC）：

```vue
<style scoped>
.my-custom-btn >>> .inner-class {
  font-size: 20px;
}
</style>
```

或在 Vue 3 中：

```vue
<style scoped>
.my-custom-btn :deep(.inner-class) {
  font-size: 20px;
}
</style>
```

### 方法三：元件提供的 slot

有些元件會提供 slot 讓你自訂內容或樣式：

```vue
<Button>
  <span style="color: red;">自訂內容</span> 
</Button>
```

## 4. 在其他 View 或元件中使用

### 在 View 中

1. 匯入元件
2. 註冊（如果是 Options API）
3. 使用

```vue
<script setup>
import Button from '@/components/Button.vue'
</script>

<template>
  <Button label="下一步" >
</template>
```

### 在其他元件中

步驟同上，只要 import 並在 template 中使用即可。

## 5. 注意事項

- 若元件有依賴外部樣式（如 UI 框架），請確認已在專案中引入相關 CSS。
- 若元件有命名衝突，可用 `as` 重新命名：

  ```js
  import Button as CustomButton from '@/components/Button.vue'
  ```

- 若要全域註冊元件，可在 `main.js` 中：

  ```js
  import Button from '@/components/Button.vue'
  app.component('Button', Button)
  ```

---
 