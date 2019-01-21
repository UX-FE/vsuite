<template>
    <div :type="type" :class="classes" :disabled="disabled" @click="handleClick" >
        <Icon v-if="!!icon" :type="icon"></Icon>
        <span v-if="!!loading" class="status-icon">
            <Icon v-if="typeof loading == 'string'" :type="loading"></Icon>
        </span>
        <span>
            <slot></slot>
        </span>
    </div>
</template>
<script>
import { oneOf } from '../../utils/assist'
import { prefix } from '../var'
const btnPrefix = prefix + 'btn'
export default {
  name: 'BaseButton',
  props: {
    type: {// 按钮类型
      type: String,
      validator (value) {
        return oneOf(value, ['default', 'primary', 'ghost', 'text'])
      }

    },
    shape: {// 按钮形状
      type: String,
      validator (value) {
        return oneOf(value, ['square', 'circle'])
      }
    },
    size: {// 按钮大小
      type: String,
      validator (value) {
        return oneOf(value, ['small', 'large'])
      }
    },
    icon: {
      type: String
    },
    loading: String, // 按钮状态（是否加载中）
    disabled: Boolean // 按钮是否不可用
  },
  data () {
    return {
    }
  },
  computed: {
    classes () {
      return [
        `${btnPrefix}`,
        {
          [`${btnPrefix}-${this.type}`]: !!this.type,
          [`${btnPrefix}-${this.shape}`]: !!this.shape,
          [`${btnPrefix}-${this.size}`]: !!this.size,
          [`${btnPrefix}-loading`]: !!this.loading
        }
      ]
    },
  },
  methods: {
    handleClick (event) {
      this.$emit('on-click-btn', event)
    }
  },
  mounted () {
  }
}
</script>
