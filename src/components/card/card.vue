<template>
    <div @click="handleClick" :class="classes">
        <slot>
            <div :class="[prefix+'-head']">
                <slot name="head">
                </slot>
            </div>
            <div :class="[prefix+'-body']">
                <slot name="body">
                </slot>
            </div>
            <div :class="[prefix+'-footer']">
                <slot name="footer">
                </slot>
            </div>
        </slot>
    </div>
</template>
<script>
import { oneOf } from '../../utils/assist'
import { prefix } from '../var'
const cardPrefix = prefix + 'card'
export default {
  name: 'Card',
  props: {
    type: {// 类型
      type: String,
      validator (value) {
        return oneOf(value, ['default', 'primary', 'ghost', 'text'])
      }
    },
    shape: {// 形状
      type: String,
      validator (value) {
        return oneOf(value, ['square', 'circle', 'circle-outline'])
      }
    }
  },
  data () {
    return {
        prefix:cardPrefix
    }
  },
  computed: {
    classes () {
      return [
        `${cardPrefix}`,
        {
          [`${cardPrefix}-${this.type}`]: !!this.type,
          [`${cardPrefix}-${this.shape}`]: !!this.shape
        }
      ]
    }
  },
  methods: {
    handleClick (event) {
      this.$emit('on-click-card', event)
    }
  },
  mounted () {
  }
}
</script>
