import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap"
import router from './Router'

createApp(App).use(router).mount('#app');
