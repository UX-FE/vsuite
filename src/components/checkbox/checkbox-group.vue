<template>
    <div :class="classes">
        <input type="hidden" v-model="currentValue"/>
        <slot></slot>
    </div>
</template>
<script>
    import { findComponentsDownward, oneOf } from '../../utils/assist';
    import Emitter from '../../mixins/emitter';
    import { prefix } from '../var';
    const checkboxGroupPrefix = prefix+'checkbox-group';

    export default {
        name: 'CheckboxGroup',
        mixins: [ Emitter ],
        props: {
            value: {
                type: Array,
                default () {
                    return [];
                }
            },
            min:{
                type:[String,Number]
            },
            max:{
                type:[String,Number]
            },
            size: {
                validator (value) {
                    return oneOf(value, ['small', 'large']);
                }
            },
            vertical:{
                type:Boolean,
                default:false
            },
            name: {
                type: [String, Number]
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
                    `${checkboxGroupPrefix}`,
                    {
                        [`${checkboxGroupPrefix}-${this.size}`]: !!this.size,
                        [`${checkboxGroupPrefix}-vertical`]: !!this.vertical
                    }
                ];
            }
        },
        mounted () {
            this.updateModel(true);
        },
        methods: {
            updateModel (update) {
                const value = this.value;
                this.childrens = findComponentsDownward(this, 'Checkbox');

                if (this.childrens) {
                    this.childrens.forEach(child => {
                        child.model = value;
                        if (update) {
                            child.currentValue = value.indexOf(child.value) >= 0;
                            child.group = true;
                        }
                    });
                }
            },
            change (data) {
                this.currentValue = data;
                this.$emit('on-change', data);
                this.dispatch('FormItem', 'on-form-change', data);
            }
        },
        watch: {
            value () {
                this.updateModel(true);
            }
        }
    };
</script>
