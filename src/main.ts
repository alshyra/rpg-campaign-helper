import { createPinia } from "pinia";
import { registerSW } from "virtual:pwa-register";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import { routerOptions } from "./router";

import "./tailwind.css";
import "./systems/generic";
import "./systems/warhammer";

const app = createApp(App);
const pinia = createPinia();
const router = createRouter({
  history: createWebHistory(),
  ...routerOptions,
});

registerSW({ immediate: true });

app.use(pinia);
app.use(router);
app.mount("#app");
