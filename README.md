# PetService 寵物服務平台

## 專案簡介

PetService 是一個現代化的寵物服務平台，提供寵物旅館預訂與寵物散步服務，結合購物車管理與線上支付功能，為飼主與寵物提供一站式便捷體驗。本專案採用 Vue 3 + Vite 架構開發，具備前後端分離、即時訊息與權限管理等完整功能。

## 技術架構

### 前端技術棧

- **核心框架**：Vue 3 + Vite
- **狀態管理**：Pinia
- **路由管理**：Vue Router
- **UI 框架**：Bootstrap 5
- **HTTP 客戶端**：Axios
- **身份驗證**：JWT

### 開發工具

- **構建工具**：Vite
- **包管理器**：npm
- **代碼規範**：ESLint + Prettier

## 主要功能模組

- 使用者註冊與登入（JWT）
- 寵物散步服務預約
- 寵物旅館預訂（含搜尋與時間選擇）
- 購物車整合（支援多類型服務）
- 訂單建立與查詢
- 金流整合（ECPay 串接）
- 員工與服務管理後台（僅限管理者）

## 開發環境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

## 安裝與執行

1. 克隆專案

   ```bash
   git clone https://github.com/sa585951/PetService-project.git
   cd PetService-project
   ```

2. 安裝依賴

   ```bash
   npm install
   ```

3. 啟動開發伺服器

   ```bash
   npm run dev
   ```

4. 構建生產版本

   ```bash
   npm run build
   ```

## 專案結構

```
PetService-project/
├── src/
│   ├── assets/        # 靜態資源
│   ├── components/    # 可重用組件
│   ├── views/         # 頁面視圖
│   ├── router/        # 路由配置
│   ├── stores/        # Pinia 狀態管理
│   ├── plugins/       # 插件配置
│   ├── App.vue        # 根組件
│   └── main.js        # 入口文件
├── public/            # 公共資源
└── vite.config.js     # Vite 配置
```

## 環境變數

請在專案根目錄下建立 `.env` 檔案，並設定以下變數：

```
VITE_API_BASE_URL=你的API基礎URL
VITE_ECPAY_URL=你的ECPay服務URL
```

## 推薦的 IDE 設定

- [VSCode](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（Vue 3 支援）
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## 授權

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 文件。

## 聯繫方式

如有任何問題或建議，請透過以下方式聯繫我們：

- 電子郵件：[您的郵箱]
- 專案 Issues：[GitHub Issues 頁面](https://github.com/sa585951/PetService-project/issues)
