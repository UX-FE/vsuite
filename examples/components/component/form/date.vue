<template>
    <div>
                        <Date 
                        type="date" 
                        v-model="date1"
                        placeholder="选择单日" 
                        style="width: 224px" 
                        ></Date>{{date1}}
                        <Date 
                        type="daterange" 
                        v-model="date2"
                        placement="bottom-start"
                        placeholder="选择日期范围" 
                        style="width: 224px" 
                        confirm
                        ></Date>{{date2}}
                        <Date 
                        type="date" 
                        v-model="date1"
                        readonly
                        placeholder="选择单日" 
                        style="width: 224px" 
                        ></Date>
                        <Date 
                        type="date" 
                        fixTitle="hahhah"
                        v-model="date1"
                        format="yyyy年==MM月==dd"
                        placeholder="选择单日" 
                        style="width: 224px" 
                        ></Date>{{date1}}

    </div>
</template>

<script>
    export default {
        data() {
            return {
                date1:'2018-5-17',
            }
        },
    }
</script>

<style scoped>

</style>