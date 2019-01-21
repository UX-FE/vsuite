<template>
    <div>
                <Tooltip content="你看到我了">
                    <BaseButton slot="target" type="primary">鼠标移到我身上</BaseButton>
                </Tooltip>
                <Tooltip content="你看到我了" :delay=1000>
                    <BaseButton slot="target" type="primary">延迟显示</BaseButton>
                </Tooltip>

    </div>
</template>

<script>
    export default {
        
    }
</script>

<style scoped>

</style>