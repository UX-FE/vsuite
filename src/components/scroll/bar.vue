
<template>
  <div :class="classes" @mousedown="clickTrackHandler" :style="styles">
      <div
        ref="thumb"
        :class="[prefix+'-thumb']"
        @mousedown="clickThumbHandler"
        :style="renderThumbStyle()">
      </div>
  </div>
</template>
<script>
import { on, off } from '../../utils/dom';
import { prefix } from '../var';
const scrollBarPrefix = prefix+'scroll-bar';
const BAR_MAP = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top'
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left'
  }
};
export default {
  name: 'Bar',

  props: {
    vertical: {
      type:Boolean,
      default:false
    },
    size: String,
    move: Number
  },
  data(){
    return {
      prefix:scrollBarPrefix,
      opacity:(this.$parent.isAways)?1:0,
      styles:{

      }
    }
  },

  computed: {
    bar() {
      return BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
    },
    classes(){
      return [
          `${scrollBarPrefix}`,
          {
            [`${scrollBarPrefix}-vertical`]:this.vertical,
            [`${scrollBarPrefix}-horizontal`]:!this.vertical
          }

      ]
    },
    wrap() {
      return this.$parent.wrap;
    }
  },
  watch:{
    opacity(){
      this.getStyles();
    }
  },
  methods: {
    getStyles(){
      this.styles = {
        opacity:(this.$parent.isAways)?1:this.opacity
      }
    },
    renderThumbStyle() {
      const style = {};
      const translate = `translate${this.bar.axis}(${ this.move }%)`;

      style[this.bar.size] = this.size;
      style.transform = translate;
      style.msTransform = translate;
      style.webkitTransform = translate;

      return style;
    },
    clickThumbHandler(e) {
      this.startDrag(e);
      this[this.bar.axis] = (e.currentTarget[this.bar.offset] - (e[this.bar.client] - e.currentTarget.getBoundingClientRect()[this.bar.direction]));
    },

    clickTrackHandler(e) {
      const offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);
      const thumbHalf = (this.$refs.thumb[this.bar.offset] / 2);
      const thumbPositionPercentage = ((offset - thumbHalf) * 100 / this.$el[this.bar.offset]);

      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
    },

    startDrag(e) {
      e.stopImmediatePropagation();
      this.cursorDown = true;

      on(document, 'mousemove', this.mouseMoveDocumentHandler);
      on(document, 'mouseup', this.mouseUpDocumentHandler);
      document.onselectstart = () => false;
    },

    mouseMoveDocumentHandler(e) {
      if (this.cursorDown === false) return;
      const prevPage = this[this.bar.axis];

      if (!prevPage) return;

      const offset = ((this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]) * -1);
      const thumbClickPosition = (this.$refs.thumb[this.bar.offset] - prevPage);
      const thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / this.$el[this.bar.offset]);

      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
    },

    mouseUpDocumentHandler(e) {
      this.cursorDown = false;
      this[this.bar.axis] = 0;
      off(document, 'mousemove', this.mouseMoveDocumentHandler);
      document.onselectstart = null;
    }
  },
  created(){
    this.getStyles();
  },

  destroyed() {
    off(document, 'mouseup', this.mouseUpDocumentHandler);
  }
};
</script>
