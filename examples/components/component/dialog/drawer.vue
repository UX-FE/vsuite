<template>
    <div>
                <BaseButton type="primary" @on-click-btn="value1=true">自定义内容的对话框</BaseButton>
                <BaseButton type="primary" @on-click-btn="value2=true">自定义主体的对话框</BaseButton>
               <Drawer title="Basic Drawer" :closable="false" v-model="value1"  placement="left" >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...1</p>
                </Drawer>
                <Drawer title="筛选" width="600"  :mask-closable="false" v-model="value2" hasFooter>
                    <span slot="header" class="vsu-drawer-header-inner">筛选<span style="color: rgba(0,0,0,0.45)">（账号SDK）</span></span>
                    <Form :value="form2" :rule="rule2">
                        <FormItem><FormInput v-model="form2.name"></FormInput></FormItem>
                        <FormItem><FormInput v-model="form2.phone"></FormInput></FormItem>
                        <FormItem><FormInput v-model="form2.email"></FormInput></FormItem>
                        <FormItem><FormInput v-model="form2.address"></FormInput></FormItem>
                    </Form>
                    <div slot="footer" class="demo-drawer-footer">
                        <BaseButton type="primary" style="margin-right: 8px" @on-click-btn="value2 = false">确定</BaseButton>
                        <BaseButton  @on-click-btn="value2 = false">取消</BaseButton>
                    </div>
                </Drawer>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                value1:false,
                value2:false,
                form2:{
                    name:'',
                    phone:'',
                    email:'',
                    address:''
                },
                rule2:{

                }
            }
        },
    }
</script>

<style scoped>

</style>