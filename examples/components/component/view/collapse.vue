<template>
    <div>
        
        <Collapse v-model="collapse1.value" accordion @on-change="handlechange">
            <Collapse-item v-for="(item,index) in collapse1.data" :key="index" :name="item.name">
                <p slot="title">{{item.title}}</p>
                <div slot="content">
                    <p v-for="(itm,i) in item.content" :key="i">{{itm}}</p>
                </div>
            </Collapse-item>
        </Collapse>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                collapse1:{
                    value:[],
                    iconType:'arrow-right-b',
                    data:[
                        {
                            name:'1',
                            title:'title1',
                            content:[
                                '这是一段内容',
                                '这是一段内容'
                            ]
                        },
                        {
                            name:'2',
                            title:'title2',
                            content:[
                                '这是一段内容',
                                '这是一段内容'
                            ]
                        },
                        {
                            name:'3',
                            title:'title3',
                            content:[
                                '这是一段内容',
                                '这是一段内容'
                            ]
                        }
                    ]
                },
            }
        },
        methods: {
            handlechange(item) {
            }
        },
    }
</script>

<style scoped>

</style>