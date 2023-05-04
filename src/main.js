import { createApp } from 'vue'
import App from './App.vue'
import { createApi } from './kirbyRestApiVuePlugin'

createApp(App)
  .use(createApi({
    host: 'http://localhost:8081/rest-api',
  }))
  .mount('#app')
