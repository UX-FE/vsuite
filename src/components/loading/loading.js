import Vue from 'vue'
import Loading from './loading.vue'

import { prefix } from '../var'
const loadingPrefix = prefix + 'loading'

Loading.newInstance = properties => {
  const _props = properties || {}

  const Instance = new Vue({
    data: Object.assign({}, _props, {

    }),
    render (h) {
      let vnode = ''
      if (this.render) {
        vnode = h(Loading, {
          props: {
            fix: true,
            fullscreen: true
          }
        }, [this.render(h)])
      } else {
        vnode = h(Loading, {
          props: {
            size: 'large',
            fix: true,
            fullscreen: true
          }
        })
      }
      return h('div', {
        'class': (loadingPrefix + '-fullscreen ' + loadingPrefix + '-fullscreen-wrapper')
      }, [vnode])
    }
  })

  const component = Instance.$mount()
  document.body.appendChild(component.$el)
  const spin = Instance.$children[0]

  return {
    show () {
      spin.visible = true
    },
    remove (cb) {
      spin.visible = false
      setTimeout(function () {
        spin.$parent.$destroy()
        if (document.getElementsByClassName(loadingPrefix + '-fullscreen') && document.getElementsByClassName(loadingPrefix + '-fullscreen')[0]) {
          document.body.removeChild(document.getElementsByClassName(loadingPrefix + '-fullscreen')[0])
        }
        cb()
      }, 500)
    },
    component: spin
  }
}

export default Loading
