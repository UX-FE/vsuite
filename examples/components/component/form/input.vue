<template>
    <div>
                <FormInput v-model="input1" placeholder="请输入"></FormInput>
                {{input1}}
                <br/>
                <br/>
                <FormInput v-model="input1" placeholder="请输入" :width="300"></FormInput>
                {{input1}}
                <br/>
                <br/>
                <FormInput v-model="input1" placeholder="请输入" :width="300" :maxlength=10></FormInput>
                <br/>
                <br/>
                <FormInput v-model="input1" placeholder="请输入" :width="300" readonly></FormInput>
                {{input1}}

    </div>
</template>

<script>
    export default {
        data() {
            return {
        input1:'',
            }
        },
    }
</script>

<style scoped>

</style>