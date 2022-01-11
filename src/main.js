import Vue from 'vue'
import api from './api/index'
import App from './App.vue'
import './assets/css/main.css'

Vue.config.productionTip = false
Vue.prototype.$api = api

new Vue({
  render: h => h(App),
}).$mount('#app')
