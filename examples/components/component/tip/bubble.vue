<template>
    <div>
                <Bubble trigger="hover" title="这是标题" content="我是气泡，你看到我了" hide-arrow defaultVisible>
                    <BaseButton slot="target" type="primary">hover</BaseButton>
                </Bubble>
                <Bubble trigger="click" title="这是标题" content="我是气泡，你看到我了">
                    <BaseButton slot="target" type="primary">click</BaseButton>
                </Bubble>
                <Bubble trigger="focus" title="这是标题" content="我是气泡，你看到我了">
                    <BaseButton slot="target" type="primary">focus</BaseButton>
                </Bubble>

    </div>
</template>

<script>
    export default {
        
    }
</script>

<style scoped>

</style>