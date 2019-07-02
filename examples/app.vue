<style lang="scss">
  @import "../src/styles/index.scss";
  body {
    overflow: auto;
  }
  ul{
      font-size: 16px;
      overflow: hidden;
      margin-bottom:40px;
      li{
        display: inline-block;
        float: left;
        margin-right:20px;
      }
  }
  .main{
    padding:40px;
  }


</style>
<template>
  <div>
    <ul>
      <li v-for="(item,index) in sider.component"  :key="index">
           <router-link  :to="item.href">
                  <span  :class="{active: item.module === $route.meta.module}" v-text="item.name"></span>
          </router-link>
      </li>
    </ul>
        <router-view></router-view>
  </div>
</template>
<script>
  import Utils from '../assets/js/utils' // 工具类
  module.exports = {
    name: 'app',
    data () {
      return {
        nav: {
          current: 'component',
          data: [
          {
            name: '组件',
            href: '/component',
            module: 'component'
          },
          ]
        },
        sider: {
          current: 'component',
          component: [
            {
              name: 'Icon 图标',
              href: '/component/icon'
            },
            {
              name: 'Button 按钮',
              href: '/component/button'
            },
            {
              name: 'Grid 栅格',
              href: '/component/grid'
            },
            {
              name: 'Layout 布局',
              href: '/component/layout'
            },
            // {
            //   name: 'Header 顶栏',
            //   href: '/component/header'
            // },
            // {
            //   name: 'Sider 侧栏菜单',
            //   href: '/component/sider'
            // },
            // {
            //   name: 'Color 色彩',
            //   href: '/component/color'
            // },
            // {
            //   name: 'Font 字体',
            //   href: '/component/font'
            // },
            {
              name: 'Input 输入框',
              href: '/component/input'
              },
              {
                name: 'Radio 单选按钮',
                href: '/component/radio'
              },
              {
                name: 'Checkbox 复选框',
                href: '/component/checkbox'
              },
              {
                name: 'Select 选择器',
                href: '/component/select'
              },
              {
                name: 'Switch 开关',
                href: '/component/switch'
              },
              {
                name: 'Date 日期选择',
                href: '/component/date'
              },
              {
                name: 'Rate 评分',
                href: '/component/rate'
              },
              {
                name: 'Upload 上传',
                href: '/component/upload'
              },
              {
                name: 'Form 表单',
                href: '/component/form'
              },
              // {
              //   name: 'Action 操作框',
              //   href: '/component/box'
              // },
              {
                name: 'Alert 警告',
                href: '/component/alert'
              },
              {
                name: 'Loading 加载',
                href: '/component/loading'
              },
              // {
              //   name: 'Notification 通知',
              //   href: '/component/notification'
              // },
              // {
              //   name: 'Message 消息',
              //   href: '/component/message'
              // },
              {
                name: 'Tooltip 文字提示',
                href: '/component/tooltip'
              },
              {
                name: 'Bubble 气泡提示',
                href: '/component/bubble'
              },
              {
                name: 'Modal 对话框',
                href: '/component/modal'
              },
              {
                name: 'drawer 抽屉',
                href: '/component/drawer'
              },
              {
                name: 'Step 步骤引导',
                href: '/component/step'
              },
              {
                name: 'Bread 面包屑',
                href: '/component/bread'
              },
              {
                name: 'Tab 标签切换',
                href: '/component/tab'
              },
              {
                name: 'Menu 菜单',
                href: '/component/menu'
              },
              {
                name: 'DropDown 下拉菜单',
                href: '/component/dropdown'
              },
              {
                name: 'Table 表格',
                href: '/component/table'
              },
              {
                name: 'Page 分页',
                href: '/component/page'
              },
              {
                name: 'Tag 标签',
                href: '/component/tag'
              },
              {
                name: 'Tree 树形控件',
                href: '/component/tree'
              },
              {
                name: 'Progress 进度条',
                href: '/component/progress'
              },
              {
                name: 'Badge 徽标数',
                href: '/component/badge'
              },
              {
                name: 'Avatar 头像',
                href: '/component/avatar'
              },
              {
                name: 'Collapse 折叠面板',
                href: '/component/collapse'
              },
              {
                name: 'Card 卡片',
                href: '/component/card'
              },
              // {
              //   name: 'Transfer 传输框',
              //   href: '/component/transfer'
              // },
              {
                name: 'TimeLine 时间轴',
                href: '/component/timeline'
              },
              // {
              //   name: 'Carousel 走马灯',
              //   href: '/component/carousel'
              // },
              {
                name: 'Scroll 滚动条',
                href: '/component/scroll'
              },
              {
                name: 'BackTop 返回顶部',
                href: '/component/backtop'
              },
              // {
              //   name: '绘图(额外)',
              //   class: 'title title1'
              // },
              // {
              //   name: 'chart图',
              //   class: 'title title2'
              // },
              // {
              //   name: 'Bar 条形图',
              //   href: '/component/bar'
              // },
              // {
              //   name: 'Circle 环形进度条',
              //   href: '/component/Circle'
              // },
              // {
              //   name: 'Waterball 水球',
              //   href: '/component/waterBall'
              // },
              // {
              //   name: 'Dial 表盘',
              //   href: '/component/dial'
              // },
              // {
              //   name: 'highcharts 图表',
              //   href: '/component/highcharts'
              // },
              // {
              //   name: 'echarts 图表',
              //   href: '/component/echarts'
              // },
              // {
              //   name: '业务',
              //   class: 'title title2'
              // },
          ],
        },
      }
    },
    components: {},
    watch: {
     
    },
    method:{
    },
    mounted: function () {
      if(window.location.href.indexOf(this.nav.current)<0){
        this.nav.current = window.location.pathname.split("/")[0];
      }
    },
    beforeDestroy: function () {

    }
  }
</script>