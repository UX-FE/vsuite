<template>
    <label :class="wrapClasses">
        <span :class="radioClasses">
            <span :class="innerClasses"></span>
            <input
                type="radio"
                :class="inputClasses"
                :disabled="disabled"
                :checked="currentValue"
                :name="name"
                @change="change">
        </span><span :class="textClasses"><slot>{{ label }}</slot></span>
    </label>
</template>
<script>
    import { findComponentUpward, oneOf } from '../../utils/assist';
    import Emitter from '../../mixins/emitter';
    import { prefix } from '../var';
    const radioPrefix = prefix+'radio';

    export default {
        name: 'Radio',
        mixins: [ Emitter ],
        props: {
            value: {
                type: [String, Number, Boolean],
                default: false
            },
            label: {
                type: [String, Number]
            },
            disabled: {
                type: Boolean,
                default: false
            },
            size: {//尺寸
                validator (value) {
                    return oneOf(value, ['small', 'large', 'default']);
                }
            },
            name: {
                type: String
            }
        },
        data () {
            return {
                forbidden:this.disabled,
                currentValue: this.value,
                group: false,
                parent: findComponentUpward(this, 'RadioGroup')
            };
        },
        computed: {
            wrapClasses () {
                return [
                    `${radioPrefix}-wrapper`,
                    {
                        [`${radioPrefix}-group-item`]: this.group,
                        [`${radioPrefix}-wrapper-checked`]: this.currentValue,
                        [`${radioPrefix}-wrapper-disabled`]: this.disabled,
                        [`${radioPrefix}-${this.size}`]: !!this.size
                    }
                ];
            },
            radioClasses () {
                return [
                    `${radioPrefix}`,
                    {
                        [`${radioPrefix}-checked`]: this.currentValue,
                        [`${radioPrefix}-disabled`]: this.forbidden
                    }
                ];
            },
            innerClasses () {
                return `${radioPrefix}-inner`;
            },
            inputClasses () {
                return `${radioPrefix}-input`;
            },
            textClasses(){
                return `${radioPrefix}-text`;

            }
        },
        mounted () {
            const RadioGroup = findComponentUpward(this, 'RadioGroup');
            if (RadioGroup){
                this.forbidden = (RadioGroup.disabled)?RadioGroup.disabled:this.disabled;
            }
            if (this.parent) this.group = true;
            if (!this.group) {
                this.updateValue();
            } else {
                this.parent.updateValue();
            }
        },
        methods: {
            change (event) {
                if (this.forbidden) {
                    return false;
                }

                const checked = event.target.checked;
                this.currentValue = checked;

                let value = checked ? this.label : '';
                this.$emit('input', value);

                if (this.group && this.label !== undefined) {
                    this.parent.change({
                        value: this.label,
                        checked: this.value
                    });
                }
                if (!this.group) {
                    this.$emit('on-change', value);
                    this.dispatch('FormItem', 'on-form-change', value);
                }
            },
            updateValue () {
                this.currentValue = this.value === this.label;
            }
        },
        watch: {
            value (val) {
                this.updateValue();
            },
            disabled (val){
                this.forbidden = this.disabled;
            }
        }
    };
</script>
