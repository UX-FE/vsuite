<template>
    <div>
                <Checkbox v-model="checkbox1">单独的选框</Checkbox>
                <br/>
                {{checkbox1}}

    </div>
</template>

<script>
    export default {
        data() {
            return {
                checkbox1:true,
            }
        },
    }
</script>

<style scoped>

</style>