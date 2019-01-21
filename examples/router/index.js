// 引入依赖包和依赖组件
import Vue from 'vue'
import Router from 'vue-router'

import component from '../components/component/component'

// 引用vue-router
Vue.use(Router)

//  定义路由实例
const router = new Router({
  // 定义history方式，可以让单页面拥有后退和前进的浏览器能力
  mode: 'hash',
  // 定义路由规则，具体如下
  routes: [
    // 默认路由：
    {
      path: '/',
      redirect: '/component/icon',
      components: {}
    },
    // 组件
    {
      path: '/component/:type?',
      /*
        type: 组件模块，比如：layout\button\input\...
      */
      name: 'component',
      components: {
        default: component
      },
      beforeEnter (to, from, next) {
        if (to.params.type === undefined) {
          next('/component/icon')
        }
        next()
      },
      meta: {
        module: 'component'
      }
    },
  ]
})

// 这里是处理权限，即所有路由跳转之前都必须先经过这个hook钩子
// 切换路由前
router.beforeEach((to, from, next) => {
  // 显示全局loading，待页面返回
  // store.commit('setAppLoading',true);
  setTimeout(() => {
    next()
  }, 0)
})
// 导出路由实例
export default router
