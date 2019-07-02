<template>
    <div :class="classes">
        <label :class="[prefix + '-label']" :for="labelFor" :style="labelStyles" v-if="label || $slots.label">
            <slot name="label">{{ label }}</slot>
        </label>
        <div :class="[prefix + '-content']" :style="contentStyles">
            <slot></slot>
            <transition name="fade">
                <div :class="[prefix + '-error-tip']" v-if="validateState === 'error' && showMessage && form.showMessage" v-html="validateMessage">
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
    import AsyncValidator from 'async-validator';
    import Emitter from '../../mixins/emitter';

    import { prefix } from '../var';
    const formItemPrefix = prefix+'form-item';

    function getPropByPath(obj, path) {
        let tempObj = obj;
        path = path.replace(/\[(\w+)\]/g, '.$1');
        path = path.replace(/^\./, '');

        let keyArr = path.split('.');
        let i = 0;
        for (let len = keyArr.length; i < len - 1; ++i) {
            let key = keyArr[i];
            if (key in tempObj) {
                tempObj = tempObj[key];
            } else {
                throw new Error('[warn]: please transfer a valid name path to form item!');
            }
        }
        return {
            o: tempObj,
            k: keyArr[i],
            v: tempObj[keyArr[i]]
        };
    }

    export default {
        name: 'FormItem',
        mixins: [ Emitter ],
        props: {
            label: {
                type: String,
                default: ''
            },
            labelWidth: Number,
            name: String,
            required: {
                type: Boolean,
                default: false
            },
            rules:[Object, Array],
            error:String,
            validateStatus:String,
            showMessage: {
                type: Boolean,
                default: true
            },
            labelFor:  String
        },
        data () {
            return {
                prefix: formItemPrefix,
                isRequired: false,//是否必须
                validateState: '',
                validateMessage: '',
                validateDisabled: false,
                validator: {}
            };
        },
        watch: {
            error (val) {
                this.validateMessage = val;
                this.validateState = val === '' ? '' : 'error';
            },
            validateStatus (val) {
                this.validateState = val;
            }
        },
        computed: {
            classes () {
                return [
                    `${formItemPrefix}`,
                    {
                        [`${formItemPrefix}-required`]: this.required || this.isRequired,
                        [`${formItemPrefix}-error`]: this.validateState === 'error',
                        [`${formItemPrefix}-validating`]: this.validateState === 'validating'
                    }
                ];
            },
            form() {//获取表单项的父级表单
                let parent = this.$parent;
                while (parent.$options.name !== 'Form') {
                    parent = parent.$parent;
                }
                return parent;
            },
            fieldValue: {//获取item值
                cache: false,
                get() {
                    const formValue = this.form.value;
                    if (!formValue || !this.name) { return; }

                    let path = this.name;
                    if (path.indexOf(':') !== -1) {
                        path = path.replace(/:/, '.');
                    }

                    return getPropByPath(formValue, path).v;
                }
            },
            labelStyles () {
                let style = {};
                const labelWidth = this.labelWidth || this.form.labelWidth;
                if (labelWidth) {
                    style.width = `${labelWidth}px`;
                }
                return style;
            },
            contentStyles () {
                let style = {};
                const labelWidth = this.labelWidth || this.form.labelWidth;
                if (labelWidth&&this.form.labelPosition!=='top') {
                    style.marginLeft = `${labelWidth}px`;
                }
                return style;
            }
        },
        methods: {
            getRules () {
                let formRules = this.form.rules;
                const selfRules = this.rules;

                formRules = formRules ? formRules[this.name] : [];

                return [].concat(selfRules || formRules || []);
            },
            getFilteredRule (trigger) {
                const rules = this.getRules();
                return rules.filter(rule => !rule.trigger || rule.trigger.indexOf(trigger) !== -1);
            },
            validate(trigger, callback = function () {}) {
                this.$nextTick(()=>{
                    const rules = this.getFilteredRule(trigger);
                    if (!rules || rules.length === 0) {
                        callback();
                        return true;
                    }

                    // form-item.vue 移除此语句。因为如果是异步接口验证，每次验证，都会闪烁一次，再显示错误信息。因为验证过程中(validating)隐藏了errorMsg
                    //this.validateState = 'validating';

                    let descriptor = {};
                    descriptor[this.name] = rules;

                    const validator = new AsyncValidator(descriptor);
                    let model = {};

                    model[this.name] = this.fieldValue;


                    validator.validate(model, { firstFields: true }, errors => {
                        this.validateState = !errors ? 'success' : 'error';
                        this.validateMessage = errors ? errors[0].message : '';

                        callback(this.validateMessage);
                    });
                    this.validateDisabled = false;
                })
            },
            resetField () {
                this.validateState = '';
                this.validateMessage = '';

                let formValue = this.form.value;
                let value = this.fieldValue;
                let path = this.name;
                if (path.indexOf(':') !== -1) {
                    path = path.replace(/:/, '.');
                }

                let name = getPropByPath(formValue, path);

//                if (Array.isArray(value) && value.length > 0) {
//                    this.validateDisabled = true;
//                    name.o[name.k] = [];
//                } else if (value !== this.initialValue) {
//                    this.validateDisabled = true;
//                    name.o[name.k] = this.initialValue;
//                }
                if (Array.isArray(value)) {
                    this.validateDisabled = true;
                    name.o[name.k] = [].concat(this.initialValue);
                } else {
                    this.validateDisabled = true;
                    name.o[name.k] = this.initialValue;
                }
            },
            onFieldBlur() {
                this.validate('blur');
            },
            onFieldChange(val) {
                if (this.validateDisabled) {
                    this.validateDisabled = false;
                    return;
                }
                this.validate('change');
            }
        },
        mounted () {
            if (this.name) {//当item项存在对应参数名
                this.dispatch('Form', 'on-add-item', this);

                //给对象定义一个initialValue属性，默认带有一个值
                Object.defineProperty(this, 'initialValue', {
                    value: this.fieldValue
                });

                let rules = this.getRules();
                //初始化可能为[]，某个操作后有rules，移除rules.length判断
                //if (rules.length) {
                    rules.every(rule => {
                        if (rule.required) {
                            this.isRequired = true;
                            return false;
                        }
                    });
                    this.$on('on-form-blur', this.onFieldBlur);
                    this.$on('on-form-change', this.onFieldChange);
                //}
            }
        },
        created(){
        },
        beforeDestroy () {
            //触发父级表单的on-remove-item事件
            this.dispatch('Form', 'on-remove-item', this);
        }
    };
</script>
