<template>
    <div>
                <Bread separator="/">
                    <BreadItem v-for="(item,index) in bread1" :key="index" :to="item.to">
                        {{item.title}}
                    </BreadItem>
                </Bread>
                <Bread separator="/">
                    <BreadItem v-for="(item,index) in bread1" :key="index">
                        {{item.title}}
                    </BreadItem>
                </Bread>

    </div>
</template>

<script>
    export default {
        data() {
            return {
        bread1:[
            {
                to:'/index',
                title:'首页',
                icon:'android-home'
            },
            {
                to:'/component/bread',
                title:'组件',
                icon:'android-list'
            },
            {
                to:'/document/code',
                title:'资源',
                icon:'android-globe'
            },
            {
                to:'/util/request',
                title:'文档',
                icon:'android-folder'
            }
        ],
            }
        },
    }
</script>

<style scoped>

</style>