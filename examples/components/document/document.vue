<template>
    <div class="main" id="J_main">
        <anchored-component :type="type">
            <slot></slot>
        </anchored-component>
    </div>
</template>

<script>
import vDesign from './design/design'
import vTech from './tech/tech'
export default {
  name: 'v-component',
  data () {
    return {
      type: 'design'
    }
  },
  components: {
    'anchored-component':{
        render: function (createElement) {
            return createElement(
                'v-' + this.type,   // tag name 标签名称
                this.$slots.default // 子组件中的阵列
            )
        },
        components: {
            'v-design': vDesign,
            'v-tech': vTech,
        },
        props: {
            type: {
                type: String,
                required: true
            }
        }
    },
  },
  watch: {
    '$route.path': 'getData'
  },
  methods: {
    init () {
      this.getData()
    },
    getData () {
      this.type = this.$route.params.type
    }
  },
  mounted () {
    this.init()
  }
}
</script>
