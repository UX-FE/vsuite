let Utils = {
  resizeWindow () {
    // 手动触发resize(页面加载后，重载Scroll，同jq的方法$(window).resize())
    if (document.createEvent) {
      var event = document.createEvent('HTMLEvents')
      event.initEvent('resize', true, true)
      window.dispatchEvent(event)
    } else if (document.createEventObject) {
      window.fireEvent('onresize')
    }
  }
}
export default Utils
