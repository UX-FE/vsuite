<template>
  <div :class="[prefix]">
    <div ref="wrap" :style="styles" @scroll="handleScroll" @mousewheel="handleMouseWheel" :class="classes" 
          @mouseenter="handleEnter"
          @mouseleave="handleLeave"
          >
      <div ref="resize" :class="viewClasses" :style="viewStyles">
        <slot></slot>
      </div>
    </div >
    <template v-if="!native">
        <Bar v-if="showX" ref="xbar"
        :move="moveX" 
        :size="sizeWidth" 
        ></Bar>
      <Bar v-if="showY" ref="ybar"
        vertical
        :move="moveY" 
        :size="sizeHeight" ></Bar>
    </template>
  </div>
</template>
<script>
  import { on, off } from '../../utils/dom';
  // @FIXME 需要一个更优的解决方案
  var ElementResizeDetectorMaker = require("element-resize-detector");
  // import ElementResizeDetectorMaker from 'element-resize-detector'
  import {prefix} from '../var'
  const scrollPrefix = prefix + 'scroll'
  import Bar from './bar';
  function scrollbarWidth(className) {
    let scrollBarWidth;
      if (scrollBarWidth !== undefined) return scrollBarWidth;
    
      const outer = document.createElement('div');
      outer.className = className;
      outer.style.visibility = 'hidden';
      outer.style.width = '100px';
      outer.style.position = 'absolute';
      outer.style.top = '-9999px';
      document.body.appendChild(outer);
    
      const widthNoScroll = outer.offsetWidth;
      outer.style.overflow = 'scroll';
    
      const inner = document.createElement('div');
      inner.style.width = '100%';
      outer.appendChild(inner);
    
      const widthWithScroll = inner.offsetWidth;
      outer.parentNode.removeChild(outer);
      scrollBarWidth = widthNoScroll - widthWithScroll;
      return scrollBarWidth;
    };
  function toObject(arr) {
    var res = {};
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]) {
        extend(res, arr[i]);
      }
    }
    return res;
  };
  export default {
    name: 'Scroll',
    components: { Bar },
    props: {
      native: {
        type:Boolean,
        default:false
      },
      wrapStyle: {},
      wrapClass: {},
      viewClass: {},
      viewStyle: {},
      noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
      showY:{
        type:Boolean,
        default:true
      },
      showX:{
        type:Boolean,
        default:false
      },
      disabledX:{
        type:Boolean,
        default:true
      },
      always:{
        type:Boolean,
        default:false
      },
      autoX:{
        type:Boolean,
        default:false
      },
      maxHeight:Number
    },
    data() {
      return {
        prefix:scrollPrefix,
        sizeWidth: '0',
        sizeHeight: '0',
        moveX: 0,
        moveY: 0,
        gutter:0,
        isAways:this.always
      };
    },
    computed: {
      wrap() {
        return this.$refs.wrap;
      },
      styles(){
        let style = this.wrapStyle;
        //设置高度和overflow属性
        const maxH = `max-height: ${this.maxHeight}px;`;
        const autoX = this.autoX ? `overflow-x:scroll;` : ((this.showX)?`overflow-x:auto;`:((this.disabledX)?`overflow-x:hidden;`:`overflow-x:auto;`))
        if (Array.isArray(this.wrapStyle)) {
          style = toObject(this.wrapStyle);
          if(!!this.maxHeight){
            style.maxHeight = this.maxHeight+'px';
          }
          if(!this.maxHeight){
            style.overflowX = 'auto';
          }
        } else if (typeof this.wrapStyle === 'string') {
          if(!!this.maxHeight){
            style += maxH;
          }
          if(!this.maxHeight){
            style += autoX;
          }
        } else {
          style = ''
          if(!!this.maxHeight){
            style += maxH;
          }
          if(!this.maxHeight){
            style += autoX;
          }
        }
        //当存在gutter时，设置样式，隐藏原生的滚动条
        if (this.gutter&&!this.native) {
          const gutterWith = `-${this.gutter}px`;
          const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`;
          if (Array.isArray(this.wrapStyle)) {
            style = toObject(this.wrapStyle);
            style.marginRight = style.marginBottom = gutterWith;
          } else if (typeof this.wrapStyle === 'string') {
            style += gutterStyle;
          } else {
            style += gutterStyle;
          }
        }
        return style;
      },
      classes () {
        return [
          `${scrollPrefix}-wrap`,
          {

          }
        ]
      },
      viewClasses() {
        return [
          `${scrollPrefix}-view`,
          {

          }
        ]
      },
      viewStyles(){
        return this.viewStyle;
      }

    },
    methods: {
      handleEnter(){
        if(this.$refs.xbar){
          this.$refs.xbar.opacity = 1;
        }
        if(this.$refs.ybar){
          this.$refs.ybar.opacity = 1;
        }
      },
      handleLeave(){
        if(this.$refs.xbar){
          this.$refs.xbar.opacity = 0;
        }
        if(this.$refs.ybar){
          this.$refs.ybar.opacity = 0;
        }
      },
      handleScroll(e) {
        const wrap = this.wrap;
        this.moveY = ((wrap.scrollTop * 100) / wrap.clientHeight);
        this.moveX = ((wrap.scrollLeft * 100) / wrap.clientWidth);
      },
      handleMouseWheel(e) {
        this.$emit("on-scroll",e);   
      },
      update() {
        let heightPercentage, widthPercentage;
        const wrap = this.wrap;
       
        if (!wrap) return;

        heightPercentage = (wrap.clientHeight * 100 / wrap.scrollHeight);
        widthPercentage = (wrap.clientWidth * 100 / wrap.scrollWidth);
        this.sizeHeight = (heightPercentage < 100) ? (heightPercentage + '%') : '';
        this.sizeWidth = (widthPercentage < 100) ? (widthPercentage + '%') : '';
      },
      resizeListener (){
        // 监听slot视图元素resize
        var erd = ElementResizeDetectorMaker();
        var erdUltraFast = ElementResizeDetectorMaker({
          strategy: "scroll" //<- For ultra performance.
        });
        if(this.$slots.default&&this.$slots.default[0]){
          erd.listenTo(this.$slots.default[0]['elm'], (element)=> {
            var width = element.offsetWidth;
            var height = element.offsetHeight;
            this.update();
          });
        }
      }
    },

    mounted() {
      if (this.native) return;
      this.$nextTick(()=>{
        this.update()
      });
      if(!this.noresize){
          on(window, 'resize', this.update);
      }
      // 监听slot视图变化, 方法内部会判断是否设置了开启监听resize
      this.resizeListener()
      // 兼容firefox滚轮事件
      on(this.$refs.wrap, 'DOMMouseScroll', (e)=>{
        this.$emit("on-scroll",e);   
      });
    },

    beforeDestroy() {
      if (this.native) return;
      if(!this.noresize){
          off(window, 'resize', this.update);
      }
    },
    created(){
      if(!this.native){
        this.gutter = scrollbarWidth(scrollPrefix+'-wrap')
      }
    }

  }
</script>