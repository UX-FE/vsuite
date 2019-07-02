<template>
  <transition-group tag="ul" :class="classes" name="list">
    <li
      v-for="(file, index) in files"
      :class="itemClasses(file)"
      :key="index+1"
      @keydown.delete="!disabled && $emit('remove', file)"
      @focus="focusing = true"
      @blur="focusing = false"
      @click="focusing = false"
    >
      <img
        :class="[prefix+'-item-thumbnail']"
        v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1"
        :src="file.url" alt=""
      >
      <a :class="[prefix+'-item-name']" @click="handleClick(file)">
        <Icon type="document-text" :class="[prefix+'-item-name-icon']"></Icon>{{file.name}}
      </a>
      <label :class="[prefix+'-item-status']">
        <template v-if="file.status==='ready'">
          <template v-if="file.checkError==='format'">
            (格式不支持)
          </template>
          <template v-else-if="file.checkError==='maxSize'">
            (文件过大)
          </template>
          <template v-else-if="file.checkError==='minSize'">
            (文件大小必须大于{{minSize}}KB)
          </template>
        </template>
        <template v-else-if="file.status==='uploading'">
          (上传{{parsePercentage(file.percentage)}}%)
        </template>
        <template v-else-if="file.status==='fail'">
          (上传失败)
        </template>
        <!-- <Icon
        :class="{
          'upload-success': true
        }"
        type="checkmark"
        ></Icon> -->
      </label>
      <Icon type="refresh" :class="[prefix+'-item-refresh']"  v-if="file.status==='fail'" @on-click-icon="$emit('on-reUpload', file)"></Icon>
      <Icon type="close" :class="[prefix+'-item-close']" v-if="!disabled" @on-click-icon="$emit('on-remove', file)"></Icon>
      <Progress 
        v-if="file.status === 'uploading'"
        :type="listType === 'picture-card' ? 'circle' : 'default'"
        :stroke-width="listType === 'picture-card' ? 6 : 2"
        :percent="parsePercentage(file.percentage)"
         radius="55" size="148"
        >
        <!-- 设置不显示进度条的百分比 -->
        <div slot="text"></div>
      </Progress>
      <span :class="[prefix+'-item-actions']" v-if="listType === 'picture-card'">
        <span
           :class="[prefix+'-item-preview']"
          v-if="handlePreview && listType === 'picture-card'"
          @click="handlePreview(file)"
        >
          <Icon type="ios-search-strong"></Icon>
        </span>
        <span
          v-if="!disabled"  :class="[prefix+'-item-delete']"
          @click="$emit('on-remove', file)"
        >
          <Icon type="android-delete"></Icon>
        </span>
      </span>
    </li>
  </transition-group>
</template>
<script>
//   import Locale from 'element-ui/src/mixins/locale';
import Progress from '../progress/progress';
    import Icon from '../icon';
import {
prefix
} from '../var'
const uploadPrefix = prefix + 'upload-list'

  export default {
    // mixins: [Locale],
    components: {Icon, Progress },

    props: {
      files: {
        type: Array,
        default() {
          return [];
        }
      },
      disabled: {
        type: Boolean,
        default: false
      },
      handlePreview: Function,
      listType: String
    },
    data(){
      return {
        prefix:uploadPrefix,
        focusing: false
      }
    },
    computed:{
      classes(){
        return [
          `${uploadPrefix}`,
          {
            [ `${uploadPrefix}-${this.listType}`]:!!this.listType,
            [ `${uploadPrefix}-disabled`]:this.disabled
          }
        ]
      },
    },
    methods: {
      parsePercentage(val) {
        return parseInt(val, 10);
      },
      handleClick(file) {
        this.handlePreview && this.handlePreview(file);
      },
      itemClasses(file){
        return [
          `${uploadPrefix}-item`,
          `${uploadPrefix}-item-${file.status}`,
          {
            [ `${uploadPrefix}-item-${this.focusing}`]:this.focusing
          },
          (file.checkError)?`${uploadPrefix}-item-${file.checkError}`:''
        ]
        
      }
    }
  };
</script>
