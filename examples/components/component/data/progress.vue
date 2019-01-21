<template>
    <div>
        
                <Progress></Progress>
                <Progress :percent="0"></Progress>
                <Progress :percent="25"></Progress>
                <Progress :percent="50"></Progress>
                <Progress :percent="100"></Progress>
                <Progress :percent="50" hidetext></Progress>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style scoped>

</style>