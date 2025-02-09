import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // Importa el router
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';



const app = createApp(App)

app.use(createPinia())
app.use(router) // Usa el router en la app
app.mount('#app')

// Importé pinia en el archivo main.js y lo usé en la app con app.use(createPinia()). Pinia es un store para Vue 3.
// Importé vue-router en el archivo main.js y lo usé en la app con app.use(router). Vue Router es el enrutador oficial de Vue.js.