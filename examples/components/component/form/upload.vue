<template>
    <div>
                 <Upload action="//jsonplaceholder.typicode.com/posts/">
                    <BaseButton type="primary">上传文件</BaseButton>
                </Upload>

    </div>
</template>

<script>
    export default {
        
    }
</script>

<style scoped lang="sass">
.avatar-uploader .vsu-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .vsu-upload:hover {
    border-color: #409EFF;
  }
  i.vsu-ion.avatar-uploader-icon {
    font-size:30px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .custom-drag-wrap{
      .vsu-upload-dragger{
          line-height:148px;
      }
  }

</style>