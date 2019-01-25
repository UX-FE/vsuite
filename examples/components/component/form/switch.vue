<template>
    <div>
                <FormSwitch v-model="switch1"></FormSwitch>{{switch1}}
                <FormSwitch :value="switch1"></FormSwitch>

                <FormSwitch v-model="switch1" openlabel="按年付费" shutlabel="按月付费">
                </FormSwitch>
    </div>
</template>

<script>
    export default {
        data() {
            return {
        switch1:true,
            }
        },
    }
</script>

<style scoped>

</style>