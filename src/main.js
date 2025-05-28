import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/authStore'
import router from './router'
import './assets/main.css'
import 'sweetalert2/dist/sweetalert2.min.css'
// 在 main.js 或你的全域樣式檔案
import 'flatpickr/dist/flatpickr.min.css';
import  piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);

const authStore = useAuthStore();
authStore.initialize();

app.use(router);
app.mount('#app');