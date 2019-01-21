<template>
    <div :class="classes">
        <slot></slot>
    </div>
</template>
<script>
    import { oneOf, findComponentsDownward } from '../../utils/assist';
    import Emitter from '../../mixins/emitter';
    import { prefix } from '../var';
    const radioGroupPrefix = prefix+'radio-group';

    export default {
        name: 'RadioGroup',
        mixins: [ Emitter ],
        props: {
            value: {
                type: [String, Number],
                default: ''
            },
            size: {
                validator (value) {
                    return oneOf(value, ['small', 'large', 'default']);
                }
            },
            type: {
                validator (value) {
                    return oneOf(value, ['button']);
                }
            },
            vertical: {
                type: Boolean,
                default: false
            },
            disabled:{
                type:Boolean,
                default:false
            },
            padding:{
                type:Number
            },
            name:{
                type: String

            }
        },
        data () {
            return {
                currentValue: this.value,
                childrens: []
            };
        },
        computed: {
            classes () {
                return [
                    `${radioGroupPrefix}`,
                    {
                        [`${radioGroupPrefix}-${this.size}`]: !!this.size,
                        [`ivu-radio-${this.size}`]: !!this.size,
                        [`${radioGroupPrefix}-${this.type}`]: !!this.type,
                        [`${radioGroupPrefix}-vertical`]: this.vertical
                    }
                ];
            }
        },
        mounted () {
            this.updateValue();
        },
        methods: {
            updateValue () {
                const value = this.value;
                this.childrens = findComponentsDownward(this, 'Radio');

                if (this.childrens) {
                    this.childrens.forEach(child => {
                        child.currentValue = value == child.label;
                        child.group = true;
                    });
                }
            },
            change (data) {
                this.currentValue = data.value;
                this.updateValue();
                this.$emit('input', data.value);
                this.$emit('on-change', data.value);
                this.dispatch('FormItem', 'on-form-change', data.value);
            }
        },
        watch: {
            value () {
                this.updateValue();
            }
        }
    };
</script>
