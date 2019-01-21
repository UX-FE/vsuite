<template>
    <div>
                <Rate v-model="rate1"></Rate>{{rate1}}
                <br/>
                <Rate v-model="rate1" color="green"></Rate>{{rate1}}
                <br/>
                <Rate v-model="rate1" size="14"></Rate>{{rate1}}
                <br/>

    </div>
</template>

<script>
    export default {
        data() {
            return {
        rate1:2,
            }
        },
    }
</script>

<style scoped>

</style>