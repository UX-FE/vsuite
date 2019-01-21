<template>
    <div>
                <BaseButton type="primary" @on-click-btn="modal1=true">自定义内容的对话框</BaseButton>
                <BaseButton type="primary" @on-click-btn="modal2=true">自定义主体的对话框</BaseButton>
                <Modal v-model="modal1">
                    <div class="demo-1">自定义的内容</div>
                </Modal>
                <Modal v-model="modal2" title="标题">
                    <div slot="body">
                        <P>主体的内容1</P>
                        <P>主体的内容2</P>
                    </div>
                </Modal>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                modal1:false,
                modal2:false,
            }
        },
    }
</script>

<style scoped>

</style>