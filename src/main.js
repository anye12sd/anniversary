import Vue from 'vue'
import api from './http/index'
import App from './App.vue'
import './assets/css/main.css'
import {message} from "ant-design-vue";
import 'ant-design-vue/dist/antd.css';
import 'swiper/dist/css/swiper.min.css'

Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.prototype.$message = message

new Vue({
  render: h => h(App),
}).$mount('#app')
