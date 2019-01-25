<template>
    <div>

                <Table :thead="table1.thead" :data="table1.data">
                </Table>
                <Table :thead="table4.thead" :data="table4.data" multi-select type="bordered">
                </Table>
                <Table :thead="table5.thead" :data="table5.data" clickable :expanded-indexs="currentExpandShow" :expand="table5.expandRender" type="zebra" @on-click-row="handleClick">
                </Table>
    </div>
</template>

<script>
import expandRow from './table-expand.vue';
    export default {
  components: { expandRow },
        data() {
            return {
                table1:{
                    loading:false,
                    thead:[
                        {
                            column:'date',
                            name:'日期'
                        },
                        {
                            column:'name',
                            name:'姓名'
                        },
                        {
                            column:'address',
                            name:'地址'
                        },
                    ],
                    data:[
                        {
                            date: '2018-01-02',
                            name: '微笑',
                            address: '广州市'
                        },
                        {
                            date: '2018-01-02',
                            name: '微笑',
                            address: '广州市'
                        },
                        {
                            date: '2018-01-02',
                            name: '微笑',
                            address: '广州市'
                        },
                        {
                            date: '2018-01-02',
                            name: '微笑',
                            address: '广州市'
                        }
                    ]
                },
                table4:{
                    thead:[
                        {
                            type:'selection',
                            width:80
                        },
                        {
                            column:'date',
                            name:'日期',
                            sort:true
                        },
                        {
                            column:'name',
                            name:'姓名',
                            sort:true
                        },
                        {
                            column:'address',
                            name:'地址',
                            sort:true
                        },
                    ],
                    data:[
                        {
                            date: '2018-01-02',
                            name: '微笑',
                            address: '广州市'
                        },
                        {
                            date: '2018-01-02',
                            name: '微笑',
                            address: '广州市'
                        },
                        {
                            date: '2018-01-02',
                            name: '微笑',
                            address: '广州市'
                        },
                        {
                            date: '2018-01-02',
                            name: '微笑',
                            address: '广州市'
                        }
                    ]
                },
                table5:{
                    expandRender: (h, params) => {
                        return h(expandRow, {
                            props: {
                                row: params.row
                            }
                        })
                    },
                    thead:[
                        {
                            type:'expand',
                            width:60
                        },
                        {
                            column:'date',
                            name:'日期'
                        },
                        {
                            column:'name',
                            name:'姓名'
                        },
                        {
                            column:'address',
                            name:'地址'
                        },
                    ],
                    data:[
                        {
                            date: '2018-01-02',
                            name: '微笑',
                            address: '广州市'
                        },
                        {
                            date: '2018-01-02',
                            name: '微笑',
                            address: '广州市'
                        },
                        {
                            date: '2018-01-02',
                            name: '微笑',
                            address: '广州市'
                        },
                        {
                            date: '2018-01-02',
                            name: '微笑',
                            address: '广州市'
                        }
                    ]
                },
                currentExpandShow:[]
            }
        },
        methods: {
            handleClick(index) {
                if(this.currentExpandShow.indexOf(index)>-1){
                    this.currentExpandShow.splice(index,1)
                }else{
                    this.currentExpandShow.push(index)
                }
            }
        },
    }
</script>

<style scoped>

</style>