import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate';

import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersist);

app.use(pinia)
app.use(router) 
app.mount('#app')

// Importé pinia en el archivo main.js y lo usé en la app con app.use(createPinia()). Pinia es un store para Vue 3.
// Importé vue-router en el archivo main.js y lo usé en la app con app.use(router). Vue Router es el enrutador oficial de Vue.js.