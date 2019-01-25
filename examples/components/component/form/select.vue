<template>
    <div>
        {{baseSelect.value}}
        <br/>
        <Select v-model="baseSelect.value" placeholder="请选择" style="width:200px;">
            <Option v-for="(item,index) in baseSelect.options" :key="index" :option="item">
            </Option>
        </Select>
        <Select v-model="baseSelect.value" placeholder="请选择" style="width:200px;" :max-height=100>
            <Option v-for="(item,index) in baseSelect.options" :key="index" :option="item">
            </Option>
        </Select>
        <Select v-model="simple.value" placeholder="请选择" style="width:200px;">
            <Option v-for="(item,index) in simple.options" :key="index" :option="item">
            </Option>
        </Select>
        <br/>
{{baseSelect}}
                <Select v-model="baseSelect.value" placeholder="请选择" style="width:200px;" clearable>
                    <Option v-for="(item,index) in baseSelect.options" :key="index" :option="item">
                    </Option>
                </Select>
                <br/>
                
                <Select 
                    :value="version.cur.code" 
                    placeholder="不限" 
                    class="select-col-2" 
                    style="width:224px;" 
                    filterable 
                    label-in-value
                    check-all
                    judge
                    multi-type="check-box" 
                    @on-submit="handleVersionChange" 
                    :type="version.type" 
                    :max-height=312 
                    label-key="text" 
                    value-key="code">
                    <div class="select-content-col-2">
                        <template v-for="n in 2">
                            <div :class="{'select-col-2':true,'col-left':(n==1)}" :key="n">
                                <Option v-for="(item,index) in version.data" v-if="(n==1)?(index<Math.ceil(version.data.length/2)):(index>=Math.ceil(version.data.length/2))" :key="index" :option="item">
                                </Option>
                            </div>
                        </template>
                    </div>
                </Select>{{version.cur.code}}
                <br/>
                
                <Select v-model="baseSelect.value" placeholder="请选择" style="width:200px;" bubble direction="top">
                    <Option v-for="(item,index) in baseSelect.options" :key="index" :option="item">
                    </Option>
                </Select>
                <Select v-model="baseSelect.value" placeholder="请选择" style="width:200px;" bubble direction="bottom">
                    <Option v-for="(item,index) in baseSelect.options" :key="index" :option="item">
                    </Option>
                </Select>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                simple:{
                    value:10,
                    options:[10,20,30,40]
                },
                baseSelect:{
                    value:'',
                    options:[
                        {
                            value:'apple',
                            label:'苹果'
                        },
                        {
                            value:'pear',
                            label:'梨'
                        },
                        {
                            value:'banana',
                            label:'香蕉'
                        },
                        {
                            value:'pineapple',
                            label:'菠萝'
                        }
                    ]
                },
                disabledOpt:{
                    value:'apple',
                    options:[
                        {
                            value:'apple',
                            label:'苹果'
                        },
                        {
                            value:'pear',
                            label:'梨'
                        },
                        {
                            value:'banana',
                            label:'香蕉',
                            disabled:true
                        },
                        {
                            value:'pineapple',
                            label:'菠萝'
                        }
                    ]
                },
                multiselect:{
                    value:['apple','pear'],
                    options:[
                        {
                            value:'apple',
                            label:'苹果'
                        },
                        {
                            value:'pear',
                            label:'梨'
                        },
                        {
                            value:'banana',
                            label:'香蕉'
                        },
                        {
                            value:'pineapple',
                            label:'菠萝'
                        }
                    ]
                },
                version:{
                    type:'multiple',
                    status:'hasData',
                    data:[{
                        "text": "3.1.0",
                        "code": "3.1.0",
                        "filter": "3.1.03.1.0"
                        },
                        {
                            "text": "3.0.0",
                            "code": "3.0.0",
                            "filter": "3.0.03.0.0"
                        }, 
                        {
                            "text": "2.1.2",
                            "code": "2.1.2",
                            "filter": "2.1.22.1.2"
                        }, {
                            "text": "2.1.1",
                            "code": "2.1.1",
                            "filter": "2.1.12.1.1"
                        }, {
                            "text": "2.1.0",
                            "code": "2.1.0",
                            "filter": "2.1.02.1.0"
                        }, {
                            "text": "2.0.0",
                            "code": "2.0.0",
                            "filter": "2.0.02.0.0"
                        }, {
                            "text": "1.0.1",
                            "code": "1.0.1",
                            "filter": "1.0.11.0.1"
                        }, {
                            "text": "0.0.0",
                            "code": "0.0.0",
                            "filter": "0.0.00.0.0"
                        }
                        ],
                    cur:{
                        code:["3.1.0","3.0.0"],
                        text:'不限'
                    }

                },
            }
        },
    }
</script>

<style scoped>

</style>