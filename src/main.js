import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/authStore'
import router from './router'
import './assets/main.css'
import 'sweetalert2/dist/sweetalert2.min.css'




const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

const authStore = useAuthStore();
authStore.initialize();

app.use(router);
app.mount('#app');