<template>
    <div>
                <Page :pages="pages11" :current=1 showOpts>
                    <span slot="pre"><Icon type="ios-arrow-left"></Icon></span>
                    <span slot="next"><Icon type="ios-arrow-right"></Icon></span>
                    <span slot="prefold"><<</span>
                    <span slot="nextfold">>></span>
                </Page>
        
             
    </div>
</template>

<script>
    export default {
        data() {
            return {
                pages11:{
                    "limit": 10,//一页显示多少条
                    "slider": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14,15,16,17,18,19,20],//分页数组
                    "lastPage": false,//是否是最后一页
                    "hasNextPage": true,//是否有下一页
                    "nextPage": 2,//下一页
                    "hasPrePage": false,//是否有上一页
                    "endRow": 10,//当前页结束行标
                    "prePage": 1,//上一页
                    "totalCount":102,//总数
                    "page": 1,//当前页
                    "startRow": 1,//当前页开始行标
                    "firstPage": true,//是否第一页
                    "offset": 0,//与第一页的便宜
                    "totalPages": 20//总页数
                },
            }
        },
    }
</script>

<style scoped>

</style>