<style scoped>
    .expand-row{
        text-align:center;
    }
</style>
<template>
    <div class="expand-row">
        我是展开的内容
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        }
    };
</script>