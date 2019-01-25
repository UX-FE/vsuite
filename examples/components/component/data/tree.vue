<template>
    <div>
                <Tree :tree="tree1.data" @on-click-node="handleClickNode">
                </Tree>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                tree1:{
                    data:[
                        {
                            id:1,
                            title:'一级1',
                            childs:[
                                {
                                    id:1.1,
                                    title:'一级1-1',
                                    childs:[
                                        {
                                            title:'一级1-1-1',
                                            childs:[
                                                
                                            ]
                                        },
                                        {
                                            title:'一级1-1-2',
                                            childs:[

                                            ]
                                        },
                                        
                                    ]
                                },
                                {
                                    id:1.2,
                                    title:'一级1-2',
                                    childs:[

                                    ]
                                },
                            ]
                        },
                        {
                            id:2,
                            title:'一级2',
                            childs:[
                                {
                                    id:2.1,
                                    title:'一级2-1',
                                    childs:[
                                        
                                    ]
                                },
                                {
                                    id:2.2,
                                    title:'一级2-2',
                                    childs:[

                                    ]
                                },

                            ]
                        },
                        {
                            id:3,
                            title:'一级3',
                            childs:[
                                {
                                    id:3.1,
                                    title:'一级3-1',
                                    childs:[
                                        
                                    ]
                                },
                                {
                                    id:3.2,
                                    title:'一级3-2',
                                    childs:[

                                    ]
                                },

                            ]
                        }
                    ]
                },
            }
        },
        methods: {
            handleClickNode() {
                
            }
        },
    }
</script>

<style scoped>

</style>