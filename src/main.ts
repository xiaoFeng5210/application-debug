import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from "pinia";
import router from './config/router'
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/notify/style';

import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
