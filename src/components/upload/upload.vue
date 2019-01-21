<template>
   <div>
        <template v-if="typeof FormData !== 'undefined'">
            <NormalUpload 
            :type="type" 
            :drag="drag" 
            :action="action" 
            :multiple="multiple" 
            :headers="headers" 
            :name="name" 
            :data="data" 
            :accept="accept" 
            :fileList="fileList" 
            :files="uploadFiles"
            :autoUpload="autoUpload" 
            :listType="listType" 
            :disabled="disabled" 
            :limit="limit" 
            :format="format" 
            :max-size="maxSize" 
            :min-size="minSize"
            :before-upload="beforeUpload"
            :with-credentials="withCredentials"
            :on-exceed="onExceed"
            :on-exceeded-size="onExceededSize"
            :on-format-error="onFormatError"
            :on-start="handleStart"
            :on-progress="handleProgress"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-preview="onPreview"
            :on-remove="handleRemove"
            :http-request="httpRequest"
            :reUploadFile="reUploadFile"
            ref="upload-inner"
            ><slot v-if="$slots.trigger" name="trigger"></slot><slot v-else></slot></NormalUpload>
        </template>
        <template v-else>
            <IframeUpload 
            :type="type" 
            :drag="drag" 
            :action="action" 
            :multiple="multiple" 
            :headers="headers" 
            :name="name" 
            :data="data" 
            :accept="accept" 
            :fileList="fileList" 
            :autoUpload="autoUpload" 
            :listType="listType" 
            :disabled="disabled" 
            :limit="limit" 
            :format="format" 
            :max-size="maxSize" 
            :before-upload="beforeUpload"
            :with-credentials="withCredentials"
            :on-exceed="onExceed"
            :on-exceeded-size="onExceededSize"
            :on-format-error="onFormatError"
            :on-start="handleStart"
            :on-progress="handleProgress"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-preview="onPreview"
            :on-remove="handleRemove"
            :http-request="httpRequest"
            ref="upload-inner"
            ><slot v-if="$slots.trigger" name="trigger"></slot><slot v-else></slot></IframeUpload>
        </template>
        <slot name="action"></slot>
        <slot name="tip"></slot>
       <UploadList v-if="showFileList"
          :disabled="uploadDisabled"
          :listType="listType"
          :files="uploadFiles"
          @on-remove="handleRemove"
          :handlePreview="onPreview">
        </UploadList>
    </div>
</template>

<script>
import Emitter from '../../mixins/emitter';
//上传文件列表
import UploadList from './upload-list';
//正常上传
import NormalUpload from './normal-upload';
//iframe上传，用于兼容
import IframeUpload from './iframe-upload';
//进度条
import Progress from '../progress/progress';
// import Migrating from 'element-ui/src/mixins/migrating';
import {prefix} from '../var'
const uploadPrefix = prefix + 'upload'

//传入函数初始化
function noop() {}

export default {
  name: 'Upload',
  mixins: [ Emitter ],

//   mixins: [Migrating],

  components: {
    Progress,
    UploadList,
    NormalUpload,
    IframeUpload
  },

  provide: {
    uploader: this
  },

  inject: {
    Form: {
      default: ''
    }
  },

  props: {
    action: {//上传文件接口路径
      type: String,
    },
    headers: {//上传接口header
      type: Object,
      default() {
        return {};
      }
    },
    data: Object,//上传接口数据
    multiple: Boolean,//是否可选择多个文件上传
    name: {//在表单中的字段名
      type: String,
      default: 'file'
    },
    drag: Boolean,//是否可以拖拽上传
    withCredentials: Boolean,//跨域请求设置
    showFileList: {//是否显示文件列表
      type: Boolean,
      default: true
    },
    accept: String,//接受上传的文件类型
    type: {//未使用
      type: String,
      default: 'select'
    },
    beforeUpload: Function,//在上传文件提交接口之前触发
    beforeRemove: Function,//在删除文件操作执行之前触发
    onRemove: {//移除选择的文件时触发
      type: Function,
      default: noop
    },
    onChange: {//当改变文件选择时触发的函数
      type: Function,
      default: noop
    },
    onPreview: {//未使用
      type: Function
    },
    onSuccess: {//当上传文件成功时触发的函数
      type: Function,
      default: noop
    },
    onProgress: {//文件上传时触发
      type: Function,
      default: noop
    },
    onError: {//当上传文件失败时触发的函数
      type: Function,
      default: noop
    },
    fileList: {//文件列表
      type: Array,
      default() {
        return [];
      }
    },
    autoUpload: {//是否自动更新并提交上传文件
      type: Boolean,
      default: true
    },
    listType: {//文件列表类型，文字，图片或者图片卡
      type: String,
      default: 'text' // text,picture,picture-card
    },
    httpRequest: Function,//上传文件的方式，这里默认使用ajax
    disabled: Boolean,//是否禁用上传组件
    limit: Number,//上传文件限制
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
        default: noop
    },
    onFormatError: {
        type: Function,
        default: noop
    },
    onExceed: {//当上传文件有限制数量时，选择文件超过限制触发的函数
      type: Function,
      default: noop
    }
  },

  data() {
    return {
      prefix:uploadPrefix,
      uploadFiles: [],
      dragOver: false,
      draging: false,
      tempIndex: 1,
      FormData:FormData,
      reUploadFile:{}
    };
  },

  computed: {
    uploadDisabled() {
      return this.disabled || (this.Form || {}).disabled;
    }
  },

  watch: {
    fileList: {
      immediate: true,
      handler(fileList) {
        this.uploadFiles = fileList.map(item => {
          item.uid = item.uid || (Date.now() + this.tempIndex++);
          item.status = 'success';
          return item;
        });
      }
    }
  },

  methods: {
    handleStart(rawFile,checkError) {//处理改变文件的值时
      rawFile.uid = Date.now() + this.tempIndex++;
      let file = {
        status: 'ready',
        name: rawFile.name,
        size: rawFile.size,
        percentage: 0,
        uid: rawFile.uid,
        raw: rawFile,
        checkError: checkError
      };

      try {
        file.url = URL.createObjectURL(rawFile);
      } catch (err) {
        console.error(err);
        return;
      }
      //增加uploadFiles
      this.uploadFiles.push(file);
      //触发文件改变时的处理函数，传入当前文件和修改后的文件列表
      this.$emit('input',rawFile);
      this.onChange(file, this.uploadFiles);
      this.dispatch('FormItem', 'on-form-change', rawFile);
    },
    handleProgress(ev, rawFile) {
      const file = this.getFile(rawFile);
      this.onProgress(ev, file, this.uploadFiles);
      file.status = 'uploading';
      file.percentage = ev.percent || 0;
    },
    handleSuccess(res, rawFile) {
      const file = this.getFile(rawFile);

      if (file) {
        file.status = 'success';
        file.response = res;

        this.onSuccess(res, file, this.uploadFiles);
        this.onChange(file, this.uploadFiles);

        this.dispatch('FormItem', 'on-form-change', rawFile);
      }
    },
    handleError(err, rawFile) {
      const file = this.getFile(rawFile);
      const fileList = this.uploadFiles;

      file.status = 'fail';

      fileList.splice(fileList.indexOf(file), 1);

      this.onError(err, file, this.uploadFiles);
      this.onChange(file, this.uploadFiles);
    },
    handleRemove(file, raw) {
      if (raw) {
        file = this.getFile(raw);
      }
      let doRemove = () => {
        this.abort(file);
        let fileList = this.uploadFiles;
        fileList.splice(fileList.indexOf(file), 1);
        this.onRemove(file, fileList);
      };

      if (!this.beforeRemove) {
        doRemove();
      } else if (typeof this.beforeRemove === 'function') {
        const before = this.beforeRemove(file, this.uploadFiles);
        if (before && before.then) {
          before.then(() => {
            doRemove();
          }, noop);
        } else if (before !== false) {
          doRemove();
        }
      }
    },
    handleReUpload(file){
      this.reUploadFile = file
      this.$nextTick(()=>{
        this.reUploadFile = {}
      })
    },
    getFile(rawFile) {
      let fileList = this.uploadFiles;
      let target;
      fileList.every(item => {
        target = rawFile.uid === item.uid ? item : null;
        return !target;
      });
      return target;
    },
    abort(file) {
      this.$refs['upload-inner'].abort(file);
    },
    clearFiles() {
      this.uploadFiles = [];
    },
    submit() {
      this.uploadFiles
        .filter(file => file.status === 'ready')
        .forEach(file => {
          this.$refs['upload-inner'].upload(file.raw);
        });
    },
    getMigratingConfig() {
      return {
        props: {
          'default-file-list': 'default-file-list is renamed to file-list.',
          'show-upload-list': 'show-upload-list is renamed to show-file-list.',
          'thumbnail-mode': 'thumbnail-mode has been deprecated, you can implement the same effect according to this case: http://element.eleme.io/#/zh-CN/component/upload#yong-hu-tou-xiang-shang-chuan'
        }
      };
    }
  },
  created(){
      return FormData;
  }
};
</script>
