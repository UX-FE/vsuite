<template>
  <i
    :class="classes"
    :style="styles"
    @click="iconClick"
  ></i>
</template>
<script>
import { prefix } from "../var";
const iconPrefix = prefix + "ion";

export default {
  name: "Icon",
  props: {
    type: String,
    size: [Number, String],
    color: String
  },
  computed: {
    classes() {
      return `${iconPrefix} ${iconPrefix}-${this.type}`;
    },
    styles() {
      let style = {};

      if (this.size) {
        style["font-size"] = `${this.size}px`;
      }

      if (this.color) {
        style.color = this.color;
      }

      return style;
    }
  },
  methods: {
    iconClick(event) {
      this.$emit("on-click-icon", event);
    }
  }
};
</script>
