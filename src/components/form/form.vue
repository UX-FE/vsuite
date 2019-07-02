<template>
    <form :class="classes" :autocomplete="autocomplete">
        <slot></slot>
        <input style="display:none" mce_style="display:none">  
    </form>
</template>
<script>
    import { oneOf } from '../../utils/assist';

    import { prefix } from '../var';
    const formPrefix = prefix+'form';

    export default {
        name: 'Form',
        props: {
            value: Object,//表单数据对象
            rules: Object,//表单验证规则对象
            labelWidth: Number,
            labelPosition: {
                validator (value) {
                    return oneOf(value, ['left', 'right', 'top']);
                },
                default: 'right'
            },
            showMessage: {
                type: Boolean,
                default: true
            },
            autocomplete: {
                validator (value) {
                    return oneOf(value, ['on', 'off']);
                },
                default: 'off'
            }
        },
        data () {
            return {
                fields: []//表单项实例数组
            };
        },
        computed: {
            classes () {
                return [
                    `${formPrefix}`,
                    `${formPrefix}-label-${this.labelPosition}`
                ];
            }
        },
        methods: {
            resetFields() {
                this.fields.forEach(field => {
                    field.resetField();
                });
            },
            validate(callback) {
                return new Promise(resolve => {
                    let valid = true;
                    let count = 0;
                    // 未验证通过的field：验证未通过的field全部返回到回调中
                    let unValidFields = []
                    this.fields.forEach(field => {
                        field.validate('', errors => {
                            if (errors) {
                                valid = false;
                                unValidFields.push(field)
                            }
                            if (++count === this.fields.length) {
                                // all finish
                                resolve(valid);
                                if (typeof callback === 'function') {
                                    callback(valid,unValidFields);
                                }
                            }
                        });
                    });
                });
            },
            validateField(name, cb) {
                const field = this.fields.filter(field => field.name === name)[0];
                if (!field) { throw new Error(''); }

                field.validate('', cb);
            }
        },
        watch: {
            rules() {
                // 此处先注释掉：参数传的是空，没有callback,进入validate方法后，永远都出不来。
                // 当rules发生变化时，会出现无回调的bug
                //this.validate();
            }
        },
        created () {
            this.$on('on-add-item', (field) => {
                if (field) this.fields.push(field);
                return false;
            });
            this.$on('on-remove-item', (field) => {
                if (field.name) this.fields.splice(this.fields.indexOf(field), 1);
                return false;
            });
        }
    };
</script>
