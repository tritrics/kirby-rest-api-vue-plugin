import { createApp } from 'vue'
import App from './App.vue'
import apiPlugin from './kirbyRestApiVuePlugin'

createApp(App).use(apiPlugin, {
  host: 'http://localhost:8081/rest-api',
  // lang: 'de',
}).mount('#app')
