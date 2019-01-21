<template>
    <div>
          <div class="demo-scroll-wrap">
            <Scroll>
                <p v-for="n in 10" :key="n">{{n}}.我是滚动条里面的内容</p>
            </Scroll>
          </div>

    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
.demo-scroll-wrap{
    height: 100px;
    font-size:14px;
    border:1px solid #ccc;
}
</style>