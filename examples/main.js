/**
 * Created by huangl on 18/1/9.
 */
import Vue from 'vue'
import router from './router'
import App from './app.vue'
import vsuite from '../src/index'

import locale from '../src/locale/lang/zh-CN'
Vue.use(vsuite, {
  locale
})

// 开启debug模式
Vue.config.debug = true

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
