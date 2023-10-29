// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import request from "./util/request";
import store from './vuex/store'
// import VueSession from 'vue-session';
import VueCookies from "vue-cookies";

// Vue.use(VueSession);
Vue.use(VueCookies)
Vue.config.productionTip = false
Vue.use(request)
Vue.use(ElementUI,{ size: 'small', zIndex: 3000 })
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
