<template>
    <div>
                <RadioGroup v-model="radio1">
                    <Radio label="1">苹果</Radio>
                    <Radio label="2">橘子</Radio>
                </RadioGroup>
                {{radio1}}

    </div>
</template>

<script>
    export default {
        data() {
            return {
        radio1:'1',
            }
        },
    }
</script>

<style scoped>

</style>