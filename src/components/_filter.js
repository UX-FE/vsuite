import Vue from 'vue'
import moment from 'moment/moment'

/**
 * 日期格式化
 * @param {string} date - 传入格式化日期：YYYY/MM/DD 或者 YYYY/M/D 或者 YYYY/MM 或者 YYYY/M
 * @param {string} type - 格式化类型.
 *        'YYYY/MM/DD' : '2017/01/11'
 *        'YYYY~MM~DD' : '2017~01~11'
 *        'YYYY-MM-DD' : '2017-01-11'
 *        'YYYY年MM月DD日' : '2017年01月11日'
 *        'YYYY/M/D' : '2017/1/11'
 *        'YYYY~M~D' : '2017~1~11'
 *        'YYYY-M-D' : '2017-1-11'
 *        'YYYY年M月D日' : '2017年1月11日'
 * 备注：
 */
Vue.filter('formatDate', (date, type) => {
  if (date === '') {
    return ''
  }
  // 将date转化为年月日
  let isYMD = date.split('/').length === 3
  let year = moment(date, 'YYYY/MM/DD').year()
  let month = moment(date, 'YYYY/MM/DD').month() + 1
  let month0 = month < 10 ? '0' + month : month
  let day = isYMD ? (moment(date, 'YYYY/MM/DD').date()) : ''
  let day0 = isYMD ? (day < 10 ? '0' + day : day) : ''
  switch (type) {
    case 'YYYY/MM/DD':
      return year + '/' + month0 + ((day0 === '') ? '' : ('/' + day0))
    case 'YYYY~MM~DD':
      return year + '~' + month0 + ((day0 === '') ? '' : ('~' + day0))
    case 'YYYY-MM-DD':
      return year + '-' + month0 + ((day0 === '') ? '' : ('-' + day0))
    case 'YYYY年MM月DD日':
      return year + '年' + month0 + '月' + ((day0 === '') ? '' : (day0 + '日'))
    case 'YYYY/M/D':
      return year + '/' + month + ((day === '') ? '' : ('/' + day))
    case 'YYYY~M~D':
      return year + '~' + month + ((day === '') ? '' : ('~' + day))
    case 'YYYY-M-D':
      return year + '-' + month + ((day === '') ? '' : ('-' + day))
    case 'YYYY年M月D日':
      return year + '年' + month + '月' + ((day === '') ? '' : (day + '日'))
    default:
      return date
  }
})

/* 流量单位自动转换，传入B单位数值
    type(String):返回类型：value(只返回数值)/unit(只返回单位)/all(二者都返回)
*/
Vue.filter('formatBinary', (val, type, digits, formatter) => {
  if (val === '-') {
    return val
  }
  // 默认单位为T/G/M/K，需要改写可传参覆盖
  formatter = formatter || ['TB', 'GB', 'MB', 'KB', 'B']
  // 处理后保留位数，默认两位小数
  // digits = digits ? digits:2;
  digits = (digits || digits === 0) ? digits : 2
  var result
  var returnType = function (type, value, unit, all) {
    return (type === 'value') ? value : ((type === 'unit') ? unit : all)
  }
  if (val > 1099511627776) {
    result = returnType(type, parseFloat((val / 1099511627776).toFixed(digits)), formatter[0], (parseFloat((val / 1099511627776).toFixed(digits)) + formatter[0]))
      // 大于1TB
  } else if (val > 1073741824) {
    result = returnType(type, parseFloat((val / 1073741824).toFixed(digits)), formatter[1], (parseFloat((val / 1073741824).toFixed(digits)) + formatter[1]))
      // 大于1GB
  } else if (val > 1048576) {
    result = returnType(type, parseFloat((val / 1048576).toFixed(digits)), formatter[2], ((val / 1048576).toFixed(digits) + formatter[2]))
      // 大于1MB
  } else if (val > 1024) {
    result = returnType(type, parseFloat((val / 1024).toFixed(digits)), formatter[3], ((val / 1024).toFixed(digits) + formatter[3]))
      // 大于1KB
  } else {
    result = returnType(type, parseFloat(val.toFixed(digits)), formatter[4], (parseFloat(val.toFixed(digits)) + formatter[4]))
  }
  return result
})

export default {
  formatDate: Vue.filter('formatDate')
}
