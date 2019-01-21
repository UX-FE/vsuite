<template>
    <div>

                <Table :thead="table1.thead" :data="table1.data">
                </Table>
    </div>
</template>

<script>
    export default {
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
            }
        },
    }
</script>

<style scoped>

</style>