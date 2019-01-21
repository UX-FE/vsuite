<template>
    <label :class="wrapClasses">
        <span :class="checkboxClasses">
            <span :class="innerClasses"></span>
            <input
                v-if="group"
                type="checkbox"
                :class="[prefix+'-origin']"
                :disabled="disabled"
                :value="name"
                v-model="currentValue"
                :name="name"
                @change="change">
            <input
                v-if="!group"
                type="checkbox"
                :class="[prefix+'-origin']"
                :disabled="disabled"
                :checked="currentValue"
                :name="name"
                @change="change">
        </span>
        <span v-if="showSlot" :class="[prefix+'-name']"><slot>{{ label }}</slot></span>
    </label>
</template>
<script>
    import { findComponentUpward, oneOf } from '../../utils/assist';
    import Emitter from '../../mixins/emitter';

    import { prefix } from '../var';
    const checkboxPrefix = prefix+'checkbox';


    export default {
        name: 'Checkbox',
        mixins: [ Emitter ],
        props: {
            type:{
                type:String,
                default:'default',
                validator (value) {
                    return oneOf(value, ['button', 'bordered','default']);
                }
            },
            disabled: {
                type: Boolean,
                default: false
            },
            value: {
                type: [String, Number, Boolean],
                default: false
            },
            trueValue: {
                type: [String, Number, Boolean],
                default: true
            },
            falseValue: {
                type: [String, Number, Boolean],
                default: false
            },
            label: {
                type: [String, Number, Boolean]
            },
            indeterminate: {
                type: Boolean,
                default: false
            },
            size: {
                type:Number,
                default:20
            },
            name: {
                type: String
            }
        },
        data () {
            return {
                prefix:checkboxPrefix,
                model: [],
                currentValue: this.value,
                group: false,
                showSlot: true,
                parent: findComponentUpward(this, 'CheckboxGroup')
            };
        },
        computed: {
            wrapClasses () {
                return [
                    `${checkboxPrefix}-wrapper`,
                    {
                        [`${checkboxPrefix}-${this.type}`]: !!this.type,
                        [`${checkboxPrefix}-group-item`]: this.group,
                        [`${checkboxPrefix}-checked`]: this.currentValue,
                        [`${checkboxPrefix}-disabled`]: this.disabled,
                    }
                ];
            },
            checkboxClasses () {
                return [
                    `${checkboxPrefix}`,
                    {
                        // [`${checkboxPrefix}-checked`]: this.currentValue,
                        // [`${checkboxPrefix}-disabled`]: this.disabled,
                        [`${checkboxPrefix}-indeterminate`]: this.indeterminate
                    }
                ];
            },
            innerClasses () {
                return `${checkboxPrefix}-inner`;
            }
        },
        mounted () {
            this.parent = findComponentUpward(this, 'CheckboxGroup');
            if (this.parent) this.group = true;
            if (!this.group) {
                this.updateModel();
                this.showSlot = this.$slots.default !== undefined;
            } else {
                this.parent.updateModel(true);
            }
        },
        methods: {
            change (event) {
                if (this.disabled) {
                    return false;
                }

                const checked = event.target.checked;

                let value = checked ? this.trueValue : this.falseValue;
                this.$emit('input', value);

                if (this.group) {
                    if(value){
                        if(!!this.parent.min&&(this.model.length-1)<this.parent.min){
                            return false;
                        }
                    }else{
                        if(!!this.parent.max&&(this.model.length+1)>this.parent.max){
                            return false;
                        }
                    }
                    this.currentValue = checked;
                    if(this.model.indexOf(this.value)>-1){
                        this.model.splice(this.model.indexOf(this.value),1);
                    }else{
                        this.model.push(this.value);
                    }
                    this.parent.change(this.model);
                } else {
                    this.currentValue = checked;
                    this.$emit('on-change', value);
                    this.dispatch('FormItem', 'on-form-change', value);
                }
            },
            updateModel () {
                this.currentValue = this.value === this.trueValue;
                if (this.group) {
                    // if(this.currentValue){
                    //     if(!!this.parent.min&&(this.model.length-1)<this.parent.min){
                    //         return false;
                    //     }
                    // }else{
                    //     if(!!this.parent.max&&(this.model.length+1)>this.parent.max){
                    //         return false;
                    //     }
                    // }
                    // if(this.model.indexOf(this.value)>-1){
                    //     this.model.splice(this.model.indexOf(this.value),1);
                    // }else{
                    //     this.model.push(this.value);
                    // }
                    // this.parent.change(this.model);
                } else {
                    this.dispatch('FormItem', 'on-form-change', this.currentValue);
                }
            }
        },
        watch: {
            value (val) {
                this.updateModel();
            }
        }
    };
</script>
