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
                </Select>{{simple.value}}

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
            }
        },
    }
</script>

<style scoped>

</style>