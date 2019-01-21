<template>
  <div tabindex="0" @click="handleClick" @keydown="handleKeydown" :class="[prefix]">
      <template v-if="drag">
        <upload-dragger :disabled="disabled" @on-file="uploadFiles"><slot></slot></upload-dragger>
      </template>
      <template v-else>
        <slot></slot>
      </template>
        <input type="file" ref="input" :name="name" @change="handleChange" :multiple="multiple" :class="[prefix+'-input']" :accept="accept">
    </div>
</template>

<script>
import ajax from './ajax';
import UploadDragger from './upload-dragger.vue';
import {
prefix
} from '../var'
const uploadPrefix = prefix + 'upload'

export default {
  inject: ['uploader'],
  components: {
    UploadDragger
  },
  props: {
    type: String,
    action: {
      type: String,
    },
    name: {
      type: String,
      default: 'file'
    },
    data: Object,
    headers: Object,
    withCredentials: Boolean,
    multiple: Boolean,
    accept: String,
    format: {
        type: Array,
        default () {
            return [];
        }
    },
    maxSize: {
        type: Number
    },
    minSize: {
        type: Number
    },
    onExceededSize: {
        type: Function,
        default () {
            return {};
        }
    },
    onFormatError: {
        type: Function,
        default () {
            return {};
        }
    },
    onStart:  {
      type: Function,
      default: function() {}
    },
    onProgress:{
      type: Function,
      default: function() {}
    },
    onSuccess: {
      type: Function,
      default: function() {}
    },
    onError: {
      type: Function,
      default: function() {}
    },
    beforeUpload: {
      type: Function,
      default: function() {}
    },
    drag: Boolean,
    onPreview: {
      type: Function,
      default: function() {}
    },
    onRemove: {
      type: Function,
      default: function() {}
    },
    fileList: Array,
    files: Array,
    autoUpload: Boolean,
    listType: String,
    httpRequest: {
      type: Function,
      default: ajax
    },
    reUploadFile:Object,
    disabled: Boolean,
    limit: Number,
    onExceed: {
      type: Function,
      default: function() {}
    },
  },

  data() {
    return {
      prefix:uploadPrefix,
      mouseover: false,
      reqs: {}
    };
  },
  computed:{
      classes(){
          return [
              `${uploadPrefix}`,
              {
                  [`${uploadPrefix}-${this.listType}`]:!!this.listType
              }
          ]
      }
  },
  watch:{
    reUploadFile(reUploadFile){
      if(reUploadFile && reUploadFile.raw){
        this.upload(reUploadFile.raw)
      }
    }
  },
  methods: {
    isImage(str) {
      return str.indexOf('image') !== -1;
    },
    //处理选择文件更改
    handleChange(ev) {
      const files = ev.target.files;
      //如果没有选择文件，返回
      if (!files) return;
      this.uploadFiles(files);
    },
    //更新选择文件
    uploadFiles(files) {
      //获取文件数组
      let postFiles = Array.prototype.slice.call(files);
      //当有选择限制，且选择文件数超过限制，返回超过限制函数&&仅上传总和为limit个数的文件，返回更新的文件及原来文件列表
      if (this.limit && this.files.length + files.length > this.limit) {
        this.onExceed && this.onExceed(files, this.fileList);
        postFiles.splice(this.limit-this.files.length)
        //return;
      }
      //如果不是多选，从数组中获取第一个元素
      if (!this.multiple) { postFiles = postFiles.slice(0, 1); }
      //如果文件数组中无数据，返回
      if (postFiles.length === 0) { return; }
  
      //对文件数组进行循环处理
      postFiles.forEach(rawFile => {
        // 验证文件格式，过大，过小
        let checkError = ""
        // check format
        if (this.format.length) {
          const _file_format = rawFile.name.split('.').pop().toLocaleLowerCase();
          const checked = this.format.some(item => item.toLocaleLowerCase() === _file_format);
          if (!checked) {
              checkError = "format" 
              this.onFormatError(rawFile, this.fileList);
          }
        } 
        // check maxSize
        if (this.maxSize && !checkError) {
          if (rawFile.size > this.maxSize * 1024) {
              checkError = "maxSize" 
              this.onExceededSize(rawFile, this.fileList);
          }
        }
        // check minSize
        if (this.minSize!==undefined && !checkError) {
          if (rawFile.size <= this.minSize * 1024) {
              checkError = "minSize" 
              this.onExceededSize(rawFile, this.fileList);
          }
        }

        //执行上传之前的处理函数，传入当前文件数据
        this.onStart(rawFile,checkError);
        //如果是自动提交，执行提交函数
        if (this.autoUpload&&!checkError) this.upload(rawFile);
      });
    },
    upload(rawFile) {
      this.$refs.input.value = null;
      //当文件提交上传函数之前无处理，执行post提交
      if (!this.beforeUpload) {
        return this.post(rawFile);
      }

      const before = this.beforeUpload(rawFile);
      if (before && before.then) {
        before.then(processedFile => {
          const fileType = Object.prototype.toString.call(processedFile);
          if (fileType === '[object File]' || fileType === '[object Blob]') {
            this.post(processedFile);
          } else {
            this.post(rawFile);
          }
        }, () => {
          this.onRemove(null, rawFile);
        });
      } else if (before !== false) {
        this.post(rawFile);
      } else {
        this.onRemove(null, rawFile);
      }
    },
    abort(file) {//中止
      const { reqs } = this;
      if (file) {
        let uid = file;
        if (file.uid) uid = file.uid;
        if (reqs[uid]) {
          reqs[uid].abort();
        }
      } else {
        Object.keys(reqs).forEach((uid) => {
          if (reqs[uid]) reqs[uid].abort();
          delete reqs[uid];
        });
      }
    },
    post(rawFile) {//post提交
      const { uid } = rawFile;
      const options = {
        headers: this.headers,
        withCredentials: this.withCredentials,
        file: rawFile,
        data: this.data,
        filename: this.name,
        action: this.action,
        onProgress: e => {
          this.onProgress(e, rawFile);
        },
        onSuccess: res => {
          this.onSuccess(res, rawFile);
          delete this.reqs[uid];
        },
        onError: err => {
          this.onError(err, rawFile);
          delete this.reqs[uid];
        }
      };
      const req = this.httpRequest(options);
      this.reqs[uid] = req;
      if (req && req.then) {
        req.then(options.onSuccess, options.onError);
      }
    },
    handleClick() {//处理点击上传区域
      //当不可用时，不响应，可用时，重置value值，点击file input
      if (!this.disabled && (this.limit>this.files.length || this.limit===undefined)) {
        // 可用并且队列中的所有文件（成功、失败、uploading等状态的所有文件）未达到最大限制
        this.$refs.input.value = null;
        this.$refs.input.click();
      }
    },
    handleKeydown(e) {//响应键盘操作
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.handleClick();
      }
    }
  },
};
</script>
