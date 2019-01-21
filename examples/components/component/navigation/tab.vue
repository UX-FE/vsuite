<template>
    <div>
                <Tab v-model="tab1" @on-click-tab="handleTabs1">
                    <TabContent label="待办事项" name="1">
                        待办事项
                    </TabContent>
                    <TabContent label="在办事项" name="2">
                        在办事项
                    </TabContent>
                    <TabContent label="办结事项" name="3">
                        办结事项
                    </TabContent>
                </Tab>

    </div>
</template>

<script>
    export default {
        data() {
            return {
        tab1:'1',
            }
        },
    }
</script>

<style scoped>

</style>