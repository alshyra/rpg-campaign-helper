import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { registerSW } from 'virtual:pwa-register'
import App from './App.vue'
import { routerOptions } from './router'
import './tailwind.css'

const app = createApp(App)
const pinia = createPinia()
const router = createRouter({
  history: createWebHistory(),
  ...routerOptions
})

registerSW({ immediate: true })

app.use(pinia)
app.use(router)
app.mount('#app')