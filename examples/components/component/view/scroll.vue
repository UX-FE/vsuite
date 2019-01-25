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
</style>