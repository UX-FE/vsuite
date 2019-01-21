<template>
    <div>
            <div class="wrap">
                <Form ref="form1" :value="form1" :rules="rules1" :label-width=80>
                    <FormItem name="name" label="姓名">
                        <FormInput v-model="form1.name" placeholder="请输入姓名" :width="300"></FormInput>
                    </FormItem>
                    <FormItem name="radio" label="性别">
                        <RadioGroup v-model="form1.radio">
                            <Radio label="man"><Icon type="man"></Icon>男</Radio>
                            <Radio label="woman"><Icon type="woman"></Icon>女</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem name="check" label="爱好">
                        <CheckboxGroup v-model="form1.check">
                            <Checkbox value="1" label="音乐"></Checkbox>
                            <Checkbox value="2" label="书法"></Checkbox>
                            <Checkbox value="3" label="绘画"></Checkbox>
                            <Checkbox value="4" label="计算机"></Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem name="select" label="学校">
                        <Select v-model="form1.select" placeholder="请选择" style="width:300px;" bubble>
                            <Option :option="{value:'1',label:'学校1'}"></Option>
                            <Option :option="{value:'2',label:'学校2'}"></Option>
                            <Option :option="{value:'3',label:'学校3'}"></Option>
                        </Select>
                    </FormItem>
                    <FormItem name="switch" label="服从调配">
                        <FormSwitch v-model="form1.switch"></FormSwitch>
                    </FormItem>
                    <FormItem name="switch" label="入学时间">
                        <Date 
                        type="date" 
                        v-model="form1.date"
                        placeholder="选择日期" 
                        style="width: 300px" 
                        ></Date>
                    </FormItem>
                    <FormItem name="rate" label="自我评价">
                        <Rate v-model="form1.rate" allow-half></Rate>
                    </FormItem>
                    <FormItem name="rate" label="照片">
                        <Upload
                            class="avatar-uploader"
                            action=""
                            :show-file-list="false"
                            v-model="form1.file"
                            :on-change="handleAvatarChange"
                            :auto-upload="false">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <Icon v-else type="plus" class="avatar-uploader-icon"></Icon>
                        </Upload>
                    </FormItem>
                    <FormItem name="textarea" label="备注">
                        <FormInput v-model="form1.textarea" placeholder="请输入" type="textarea" :width="300"></FormInput>
                    </FormItem>
                    <FormItem>
                        <BaseButton type="primary" @on-click-btn="handleSubmit('form1')">立即提交</BaseButton>
                        <BaseButton type="ghost" style="margin-left: 8px" @on-click-btn="handleReset('form1')">重置</BaseButton>
                    </FormItem>
                </Form>
                {{form1}}
                <div class="q-title">说明：</div>
                <div>
                    form表单包括form元素：Input、Radio、CheckBox、Select、Switch、Rate、Date、Upload等。
                    <p>增加rules属性和ref可以增加表单验证，表单验证基于<a href="https://github.com/yiminghe/async-validator">async-validator</a></p>
                </div>
                <div class="q-title">代码示例：</div>
            </div>

    </div>
</template>

<script>
    export default {
        data() {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.form3.passwdCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.form3.validateField('passwdCheck');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请确认密码'));
                } else if (value !== this.form3.passwd) {
                    callback(new Error('两次输入的密码不一样!'));
                } else {
                    callback();
                }
            };
            const validateAge = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入年龄'));
                }
                // 模拟异步验证效果
                setTimeout(() => {
                    if (!Number.isInteger(value)) {
                        callback(new Error('请输入数字'));
                    } else {
                        if (value < 18) {
                            callback(new Error('年龄大于18岁'));
                        } else {
                            callback();
                        }
                    }
                }, 1000);
            };
            return {
                form1:{
                    name:'',
                    radio:'',
                    check:[],
                    select:'',
                    switch:true,
                    date:'',
                    rate:0,
                    file:'',
                    textarea:''
                },
                imageUrl:'',
                imgUrl:'',
                rules1:{
                    name:[
                        {required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    radio: [
                        { required: true, message: '请选择性别', trigger: 'change' }
                    ],
                    check: [
                        { required: true, type: 'array', min: 1, message: '请选择爱好', trigger: 'change' },
                        { type: 'array', max: 2, message: '请选择2个', trigger: 'change' }
                    ],
                    select: [
                        { required: true, message: '请选择学校', trigger: 'change' }
                    ],
                    textarea: [
                        { required: true, message: '请输入备注', trigger: 'blur' },
                        { type: 'string', min: 20, message: '输入不能少于20字', trigger: 'blur' }
                    ]
                },
                labelPosition:'left',
                index: 1,
                form2: {
                    items: [
                        {
                            value: '',
                            index: 1,
                            status: 1
                        }
                    ]
                },
                form3: {
                    passwd: '',
                    passwdCheck: '',
                    age: ''
                },
                rule3: {
                    passwd: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                    age: [
                        { validator: validateAge, trigger: 'blur' }
                    ]
                },
                api:{
                    thead:[
                        {
                            column:'prop',
                            name:'属性',
                        },
                        {
                            column:'description',
                            name:'说明',
                        },
                        {
                            column:'type',
                            name:'属性',
                        },
                        {
                            column:'option',
                            name:'可选值',
                        },
                        {
                            column:'default',
                            name:'默认值',
                        },
                    ],
                    data:[
                        {
                            prop:'value',
                            description:'表单数据对象',
                            type:'Object',
                            option:'-',
                            default:'-'
                        },
                        {
                            prop:'rules',
                            description:'表单验证规则，具体配置查看  async-validator',
                            type:'Object',
                            option:'-',
                            default:'-'
                        },
                        {
                            prop:'label-position',
                            description:'对齐方式',
                            type:'String',
                            option:'left/top/right',
                            default:'-'
                        },
                        {
                            prop:'label-width',
                            description:'标签宽度',
                            type:'Number',
                            option:'-',
                            default:'-'
                        },
                        {
                            prop:'show-message',
                            description:'是否显示提示信息',
                            type:'Boolean',
                            option:'-',
                            default:'true'
                        },
                        {
                            prop:'autocomplete',
                            description:'原生的 autocomplete 属性，可选值为 off 或 on',
                            type:'String',
                            option:'-',
                            default:'off'
                        },
                    ]
                },
                itemapi:{
                    thead:[
                        {
                            column:'prop',
                            name:'属性',
                        },
                        {
                            column:'description',
                            name:'说明',
                        },
                        {
                            column:'type',
                            name:'属性',
                        },
                        {
                            column:'option',
                            name:'可选值',
                        },
                        {
                            column:'default',
                            name:'默认值',
                        },
                    ],
                    data:[
                        {
                            prop:'name',
                            description:'对应表单域 model 里的字段',
                            type:'String',
                            option:'-',
                            default:'-'
                        },
                        {
                            prop:'label',
                            description:'标签文本',
                            type:'String',
                            option:'-',
                            default:'-'
                        },
                        {
                            prop:'label-width',
                            description:'表单域标签的的宽度',
                            type:'Number',
                            option:'-',
                            default:'-'
                        },
                        {
                            prop:'label-for',
                            description:'指定原生的 label 标签的 for 属性，配合控件的 element-id 属性，可以点击 label 时聚焦控件。',
                            type:'String',
                            option:'-',
                            default:'-'
                        },
                        {
                            prop:'required',
                            description:'是否必填，如不设置，则会根据校验规则自动生成',
                            type:'Boolean',
                            option:'-',
                            default:'true'
                        },
                        {
                            prop:'rules',
                            description:'表单验证规则',
                            type:'Object | Array',
                            option:'-',
                            default:'-'
                        },
                        {
                            prop:'error',
                            description:'表单域验证错误信息, 设置该值会使表单验证状态变为error，并显示该错误信息',
                            type:'String',
                            option:'-',
                            default:'-'
                        },
                        {
                            prop:'show-message',
                            description:'是否显示提示信息',
                            type:'Boolean',
                            option:'-',
                            default:'true'
                        },
                    ]
                },
                event:{
                    thead:[
                        {
                            column:'name',
                            name:'事件名称',
                        },
                        {
                            column:'description',
                            name:'说明',
                        },
                        {
                            column:'props',
                            name:'参数',
                        }
                    ],
                    data:[
                        {
                            name:'validate',
                            description:'对整个表单进行校验，参数为检验完的回调，会返回一个 Boolean 表示成功与失败，支持 Promise',
                            props:'callback'
                        },
                        {
                            name:'validateField',
                            description:'对部分表单字段进行校验的方法，参数1为需校验的 prop，参数2为检验完回调，返回错误信息',
                            props:'callback'
                        },
                        {
                            name:'resetFields',
                            description:'对整个表单进行重置，将所有字段值重置为空并移除校验结果',
                            props:'-'
                        }
                    ]
                },
            };
        },
        methods: {
            handleAvatarChange(file,files){
                this.imageUrl = file.url;
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {

                    if (valid) {
                        console.log("success");
                    } else {
                        console.log("fail");
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            handleAdd2 () {
                this.index++;
                this.form2.items.push({
                    value: '',
                    index: this.index,
                    status: 1
                });
            },
            handleRemove2 (index) {
                this.form2.items[index].status = 0;
            },
            handleChangeP(val){console.log("handleChangeP");console.log(val)
                this.labelPosition = val;
            }
        },
        mounted() {}
        
    }
</script>

<style scoped lang="scss">
.dynamic-form{
    .vsu-col-span-4{
        .vsu-ion{
            vertical-align:middle;
        }
    }
    .vsu-ion{
        cursor:pointer;
       &:hover{
           color:#2C41B0;
       }
    }
}

</style>