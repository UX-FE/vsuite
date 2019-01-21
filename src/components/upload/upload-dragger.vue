<template>
  <div
    :class="classes"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragover"
    @dragleave.prevent="dragover = false"
  >
    <slot></slot>
  </div>
</template>
<script>
import {prefix} from '../var'
const uploadPrefix = prefix + 'upload'
  export default {
    name: 'UploadDrag',
    props: {
      disabled: Boolean
    },
    data() {
      return {
        dragover: false,
        uploadPrefix:uploadPrefix
      };
    },
    computed:{
      classes () {
          return [
              `${uploadPrefix}-dragger`,
              {
                  [`is-dragover`]: this.dragover,
              }
          ];
      },
    },
    methods: {
      onDragover() {
        if (!this.disabled) {
          this.dragover = true;
        }
      },
      onDrop(e) {
        if (!this.disabled) {
          this.dragover = false;
          this.$emit('on-file', e.dataTransfer.files);
        }
      }
    }
  };
</script>

