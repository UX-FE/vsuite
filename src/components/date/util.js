import dateUtil from '../../utils/date'

export const toDate = function (date) {
  let _date = new Date(date)
    // IE patch start (#1422)
  if (isNaN(_date.getTime()) && typeof date === 'string') {
    _date = date.split('-').map(Number)
    _date[1] += 1
    _date = new Date(..._date)
  }
    // IE patch end

  if (isNaN(_date.getTime())) return null
  return _date
}

export const getDateRange = function (minDate, maxDate) {
  if (minDate && maxDate) {
    return Math.abs((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))
  } else {
    return 0
  }
}

/**
 * 计算两个日期之间相差的月份
 * @param {Date} minDate 最小日期
 * @param {Date} maxDate 最大日期
 */
export const getMonthRange = function(minDate,maxDate){
  if (minDate && maxDate) {
    let minYear = minDate.getFullYear();
    let minMonth = minDate.getMonth()+1;
    let maxYear = maxDate.getFullYear();
    let maxMonth = maxDate.getMonth()+1;
    return (maxYear*12+maxMonth) - (minYear*12+minMonth)
  } else {
    return ''
  }
}
/**
 * 计算特定日期x月（前后）的日期
 * @param {Date} souceDate 特定日期
 * @param {Number} month 月份差，当为正数时计算x月后日期，为负数时计算x月前日期
 */
export const getDateByMonth = function(souceDate,month){
  //计算参照日期的月份总数
  let sourceMonths = souceDate.getFullYear()*12 + souceDate.getMonth()+1;
  //计算目标日期的月份总数
  let targetMonths = sourceMonths + month;
  //计算目标日期年份
  let targetYear = Math.floor(targetMonths/12);
  //计算目标日期月份
  let targetMonth = targetMonths%12;
  //返回计算结果，默认设置为1号
  let time = new Date(targetYear,0,1);
  time.setMonth(targetMonth);
  time.setDate(0)
  return time;
}

export const formatDate = function (date, format) {
  date = toDate(date)
  if (!date) return ''
  return dateUtil.format(date, format || 'yyyy-MM-dd')
}

export const parseDate = function (string, format) {
  return dateUtil.parse(string, format || 'yyyy-MM-dd')
}

export const getDayCountOfMonth = function (year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export const getFirstDayOfMonth = function (date) {
  const temp = new Date(date.getTime())
  temp.setDate(1)
  return temp.getDay()
}

export const siblingMonth = function (src, diff) {
  const temp = new Date(src) // lets copy it so we don't change the original
  const newMonth = temp.getMonth() + diff
  const newMonthDayCount = getDayCountOfMonth(temp.getFullYear(), newMonth)
  if (newMonthDayCount < temp.getDate()) {
    temp.setDate(newMonthDayCount)
  }
  temp.setMonth(newMonth)

  return temp
}

export const prevMonth = function (src) {
  return siblingMonth(src, -1)
}

export const nextMonth = function (src) {
  return siblingMonth(src, 1)
}

export const initTimeDate = function () {
  const date = new Date()
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  return date
}

export const formatDateLabels = (function () {
    /*
      Formats:
      yyyy - 4 digit year
      m - month, numeric, 1 - 12
      mm - month, numeric, 01 - 12
      mmm - month, 3 letters, as in `toLocaleDateString`
      Mmm - month, 3 letters, capitalize the return from `toLocaleDateString`
      mmmm - month, full name, as in `toLocaleDateString`
      Mmmm - month, full name, capitalize the return from `toLocaleDateString`
    */

  const formats = {
    yyyy: date => date.getFullYear(),
    m: date => date.getMonth() + 1,
    mm: date => ('0' + (date.getMonth() + 1)).slice(-2),
    mmm: (date, locale) => {
      const monthName = date.toLocaleDateString(locale, {
        month: 'long'
      })
      return monthName.slice(0, 3)
    },
    Mmm: (date, locale) => {
      const monthName = date.toLocaleDateString(locale, {
        month: 'long'
      })
      return (monthName[0].toUpperCase() + monthName.slice(1).toLowerCase()).slice(0, 3)
    },
    mmmm: (date, locale) =>
            date.toLocaleDateString(locale, {
              month: 'long'
            }),
    Mmmm: (date, locale) => {
      const monthName = date.toLocaleDateString(locale, {
        month: 'long'
      })
      return monthName[0].toUpperCase() + monthName.slice(1).toLowerCase()
    }
  }
  const formatRegex = new RegExp(['yyyy', 'Mmmm', 'mmmm', 'Mmm', 'mmm', 'mm', 'm'].join('|'), 'g')

  return function (locale, format, date) {
    const componetsRegex = /(\[[^\]]+\])([^\[\]]+)(\[[^\]]+\])/
    const components = format.match(componetsRegex).slice(1)
    const separator = components[1]
    const labels = [components[0], components[2]].map(component => {
      const label = component.replace(/\[[^\]]+\]/, str => {
        return str.slice(1, -1).replace(formatRegex, match => formats[match](date, locale))
      })
      return {
        label: label,
        type: component.indexOf('yy') != -1 ? 'year' : 'month'
      }
    })
    return {
      separator: separator,
      labels: labels
    }
  }
})()
