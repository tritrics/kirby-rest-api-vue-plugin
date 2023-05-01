import { createApp } from 'vue'
import App from './App.vue'
import apiPlugin from './kirbyRestApiVuePlugin'

createApp(App).use(apiPlugin, {
  host: 'http://localhost:8081',
  lang: 'de',
}).mount('#app')
