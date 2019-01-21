<template>
    <div>
                <TagGroup :tags="tag1">
                    <Tag v-for="(item,index) in tag1" :key="index" :tag="item" @on-close="closeTag">
                        {{item.name}}
                    </Tag>
                </TagGroup>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                tag1:[
                    {
                        id:'1',
                        name:'标签一',
                        size:'large'
                    },
                    {
                        id:'2',
                        name:'标签二',
                        size:'default'
                    },
                    {
                        id:'3',
                        name:'标签三',
                        size:'small'
                    },
                    {
                        id:'4',
                        name:'标签四',
                        size:'small'
                    }
                ],
            }
        },
    }
</script>

<style scoped>

</style>