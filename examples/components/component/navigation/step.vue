<template>
    <div>
                <Step :current="base">
                    <StepItem title="步骤1" content="这里是描述信息"></StepItem>
                    <StepItem title="步骤2" content="这里是描述信息"></StepItem>
                    <StepItem title="步骤3" content="这里是描述信息"></StepItem>
                    <StepItem title="步骤4" content="这里是描述信息"></StepItem>
                </Step>

    </div>
</template>

<script>
    export default {
        data() {
            return {
        base:0,
            }
        },
    }
</script>

<style scoped>

</style>