// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router'
import store from './vuex/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
//page global
import 'common/style/index.scss';

// jsplumb
import 'jsplumb/dist/js/jsplumb.min.js';
import 'jsplumb/css/jsplumbtoolkit-defaults.css';

//jquery ui
import 'jquery-ui-dist/jquery-ui'

//demo
import 'style/index.scss';

Vue.prototype.$axios = axios;
Vue.use(ElementUI)


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
