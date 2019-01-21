let Utils = {
  // vue get 公共函数
  vueGet: function (vm, url, params, callback, name, sendPara, failCallback) {
    vm.$axios.get(vm.$axios.defaults.baseURL + url, {
      params: params,
      before (request) {
        if (name) {
          if (vm['previousRequest_' + name]) {
            vm['previousRequest_' + name].abort()
          }
          vm['previousRequest_' + name] = request
        }
      }
    }).then(d => {
      callback(d.data, (sendPara) || '')
    }).catch(d => {
      if (failCallback) {
        failCallback()
      }
    })
  },
  // vue post 公共函数
  vuePost: function (vm, url, params, callback, name, sendPara, failCallback) {
    vm.$axios.post(vm.$axios.defaults.baseURL + url, params, {
      before (request) {
        if (vm['previousRequest_' + name]) {
          vm['previousRequest_' + name].abort()
        }
        vm['previousRequest_' + name] = request
      }
    }).then(d => {
      callback(d.data, (sendPara) || '')
    }).catch(d => {
      if (failCallback) {
        failCallback()
      }
    })
  },
  // 主动触发窗口resize
  resizeWindow () {
    // 手动触发resize(页面加载后，重载Scroll，同jq的方法$(window).resize())
    if (document.createEvent) {
      var event = document.createEvent('HTMLEvents')
      event.initEvent('resize', true, true)
      window.dispatchEvent(event)
    } else if (document.createEventObject) {
      window.fireEvent('onresize')
    }
  },
  // 深拷贝对象（继承）
  copyObj (obj) {
    var object = {}
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        object[prop] = obj[prop]
      }
    }
    return object
  },
  /* 判断元素是否在对象数组中
    obj:{
      word: ['doc', 'docx', 'doc'], // 文档
      ppt: ['ppt', 'pptx'], // 演示文档
      excel: ['xls', 'xlsx'], // 表格文档
    },
    val:"xls",
    备注：xls存在于obj中，则返回excel，否则返回false
  */
  judgeInObj (obj, val) {
    for (let key of Object.keys(obj)) {
      if (obj[key].indexOf(val) > -1) {
        return key
      }
    }
    return false
  },
  // 获取请求参数串，比如：?a=1&b=2
  parseQueryUrl: function (obj) {
    var params = '?'
    for (var name in obj) {
      if (obj.hasOwnProperty(name)) {
        params += name + '=' + obj[name] + '&'
      }
    }
    return params.substring(0, params.length - 1)
  },
  /* 方法：safari等浏览器，不兼容click()触发解决
         id：要触发click的元素id
        备注：判断浏览器是否支持click
    */
  clickEvent: function (id) {
    var dom = document.getElementById(id)
    if (dom.click) {
      dom.click()
    } else {
      try {
        var evt = document.createEvent('Event')
        evt.initEvent('click', true, true)
        dom.dispatchEvent(evt)
      } catch (e) {};
    }
  }
}
export default Utils
