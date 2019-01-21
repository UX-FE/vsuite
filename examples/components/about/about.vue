<template>
    <div class="main" id="J_main">
        <anchored-component :type="type">
            <slot></slot>
        </anchored-component>
    </div>
</template>

<script>
import vTeam from './team/team'
export default {
  name: 'v-component',
  data () {
    return {
      type: 'team'
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
            'v-team': vTeam,
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
