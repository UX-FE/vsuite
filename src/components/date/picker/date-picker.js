import Vue from 'vue'
import Picker from '../picker.vue'
import DatePanel from '../panel/date.vue'
import DateRangePanel from '../panel/date-range.vue'

// 获取面板
const getPanel = function (type) {
  if (type === 'daterange' || type === 'datetimerange') {
    return DateRangePanel
  }
  return DatePanel
}

import { oneOf } from '../../../utils/assist'

export default {
  mixins: [Picker],
  props: {
    type: {// 日期选择类型
      validator (value) {
        return oneOf(value, ['year', 'month', 'date', 'daterange','datetimerange'])
      },
      default: 'date'
    },
    value: {}// 值
  },
  watch: {
    type (value) { // 检测日期的类型
      const typeMap = {
        year: 'year',
        month: 'month',
        date: 'date',
        daterange: 'daterange',
        datetimerange: 'datetimerange'
      }
      const validType = oneOf(value, Object.keys(typeMap))
      if (validType) this.Panel.selectionMode = typeMap[value]
    }
  },
  created () {
    if (!this.currentValue) { // 初始化currentValue
      if (this.type === 'daterange'||this.type === 'datetimerange') {
        this.currentValue = ['', '']
      } else {
        this.currentValue = ''
      }
    }

    const panel = getPanel(this.type)
    this.Panel = new Vue(panel)
  }
}
