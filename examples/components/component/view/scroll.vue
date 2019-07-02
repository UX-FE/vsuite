<template>
    <div>
          <div class="demo-scroll-wrap" style="width:300px;">
            <Scroll autoX :max-height="100">
                <p v-for="n in 10" :key="n" style="white-space:nowrap">{{n}}.我是滚动条里面的内容我是滚动条里面的内容我是滚动条里面的内容我是滚动条里面的内容我是滚动条里面的内容我是滚动条里面的内容</p>
            </Scroll>
          </div>
<br>
<br>
<br>
<!-- <div style="height:1000px;">
    
<div style="position:absolute;">
    
          <div style="background:green;width:300px;overflow:hidden;position:relative;">
              <div style="margin-bottom:-20px;margin-right:-20px;height:100%;max-height:200px;overflow:scroll;">
                  <div style="background:red;height:100px;">

                  </div>
                   <div style="background:yellow;height:200px;">
                      
                  </div> 
                  <div style="background:blue;height:300px;">
                      
                  </div>
              </div>
          </div>
</div>
</div> -->
<div style="height:1000px;">

<div style="position:absolute;">
    
          <div style="background:green;width:300px;overflow:hidden;position:relative;">
              <div style="height:100%;max-height:200px;overflow:scroll;" class="scrollbar">
                  <p>哈哈哈啊哈哈啊</p>
                  <p>哈哈哈啊哈哈啊</p>
                  <p>哈哈哈啊哈哈啊</p>
                  <p>哈哈哈啊哈哈啊</p>
                  <p>哈哈哈啊哈哈啊</p>
                  <p>哈哈哈啊哈哈啊</p>
                  <p>哈哈哈啊哈哈啊</p>
                  <p>哈哈哈啊哈哈啊</p>
                  <p>哈哈哈啊哈哈啊</p>
                  <p>哈哈哈啊哈哈啊</p>
                  <p>哈哈哈啊哈哈啊</p>
                  <p>哈哈哈啊哈哈啊</p>
                  <p>哈哈哈啊哈哈啊</p>
                  <p>哈哈哈啊哈哈啊</p>
                  <p>哈哈哈啊哈哈啊</p>
                  <p>哈哈哈啊哈哈啊</p>
                  <p>哈哈哈啊哈哈啊</p>
                  <p>哈哈哈啊哈哈啊</p>
                  <p>哈哈哈啊哈哈啊</p>
                  <p>哈哈哈啊哈哈啊</p>
                  <p>哈哈哈啊哈哈啊</p>
                  <p>哈哈哈啊哈哈啊</p>
              </div>
          </div>
</div>
</div>


    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
.demo-scroll-wrap{
    font-size:14px;
    border:1px solid #ccc;
}
.scrollbar{
    /*定义滚动条高宽及背景
    高宽分别对应横竖滚动条的尺寸*/
    &::-webkit-scrollbar
    {
        width:16px;
        height:16px;
        background-color:#F5F5F5;
    }
    /*定义滚动条轨道
    内阴影+圆角*/
    &::-webkit-scrollbar-track
    {
        -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3);
        border-radius:10px;
        background-color:#F5F5F5;
    }
    /*定义滑块
    内阴影+圆角*/
    &::-webkit-scrollbar-thumb
    {
        border-radius:10px;
        -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);
        background-color:#555;
    }
}
</style>