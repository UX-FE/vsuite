<template>
    <div>
                        <Date 
                        type="date" 
                        v-model="date1"
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