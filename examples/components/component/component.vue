<template>
    <div class="main" id="J_main">
        <anchored-component :type="type">
            <slot></slot>
        </anchored-component>
    </div>
</template>

<script>
import vGrid from './base/grid'
import vLayout from './base/layout'
import vIcon from './base/icon'
import vButton from './base/button'
import vSelect from './form/select'
import vInput from './form/input'
import vRadio from './form/radio'
import vCheckbox from './form/checkbox'
import vSwitch from './form/switch'
import vDate from './form/date'
import vRate from './form/rate'
import vUpload from './form/upload'
import vForm from './form/form'
import vTable from './data/table'
import vPage from './data/page'
import vTree from './data/tree'
import vProgress from './data/progress'
import vModal from './dialog/modal'
import vAlert from './tip/alert'
import vLoading from './tip/loading'
import vMessage from './tip/message'
import vBubble from './tip/bubble'
import vTooltip from './tip/tooltip'
import vTag from './data/tag'
import vBadge from './data/badge'
import vStep from './navigation/step'
import vBread from './navigation/bread'
import vTab from './navigation/tab'
import vMenu from './navigation/menu'
import vDropDown from './navigation/dropdown'
import vCard from './view/card'
import vAvatar from './view/avatar'
import vCollapse from './view/collapse'
// import vTransfer from './view/transfer'
import vTimeline from './view/timeline'
import vBacktop from './view/backtop'
// import vCarousel from './view/carousel'
import vScroll from './view/scroll'
// import vDail from './chart/dial'
// import vHighcharts from './chart/highcharts'
// import vEcharts from './chart/echarts'
export default {
  name: 'v-component',
  data () {
    return {
      type: 'icon'
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
            'v-layout': vLayout,
            'v-grid': vGrid,
            'v-icon': vIcon,
            'v-button': vButton,
            'v-select': vSelect,
            'v-input': vInput,
            'v-radio': vRadio,
            'v-checkbox': vCheckbox,
            'v-switch': vSwitch,
            'v-date': vDate,
            'v-rate': vRate,
            'v-modal': vModal,
            'v-alert': vAlert,
            'v-loading': vLoading,
            'v-message': vMessage,
            'v-upload': vUpload,
            'v-form': vForm,
            'v-table': vTable,
            'v-page': vPage,
            'v-tree': vTree,
            'v-progress': vProgress,
            'v-tooltip': vTooltip,
            'v-bubble': vBubble,
            'v-tag': vTag,
            'v-badge': vBadge,
            'v-step': vStep,
            'v-bread': vBread,
            'v-tab': vTab,
            'v-menu': vMenu,
            'v-dropdown': vDropDown,
            'v-card': vCard,
            'v-avatar': vAvatar,
            'v-collapse': vCollapse,
            // 'v-transfer': vTransfer,
            'v-timeline': vTimeline,
            // 'v-carousel': vCarousel,
            'v-scroll': vScroll,
            'v-backtop': vBacktop,
            // 'v-dial': vDail,
            // 'v-highcharts': vHighcharts,
            // 'v-echarts': vEcharts,
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
