<template>
    <span :class="wrapClasses">
        <span v-if="label" v-html="label"></span>
        <span v-if="openlabel" v-html="openlabel"></span>
        <span :class="switchClasses" @click="toggleClick">
            <input type="hidden" :name="name" :value="currentValue">
            <span :class="innerClasses">
                <slot name="open" v-if="currentValue === openValue"></slot>
                <slot name="shut" v-if="currentValue === shutValue"></slot>
            </span>
        </span>
        <span v-if="shutlabel" v-html="shutlabel"></span>
    </span>
</template>
<script>
    import Emitter from '../../mixins/emitter';
    import { oneOf } from '../../utils/assist';

    import { prefix } from '../var';
    const switchPrefix = prefix+'switch';

    export default {
        name: 'FormSwitch',
        mixins: [ Emitter ],
        props: {
            size: {
                validator (value) {
                    return oneOf(value, ['large', 'small']);
                }
            },
            value: {
                type: [String, Number, Boolean],
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            name: {
                type: String
            },
            label:{
                type:String
            },
            openlabel:{
                type:String
            },
            shutlabel:{
                type:String
            }
        },
        data () {
            return {
                currentValue: this.value,
                openValue:true,
                shutValue:false
            };
        },
        computed: {
            wrapClasses (){
                return `${switchPrefix}-wrap`;
            },
            switchClasses () {
                return [
                    `${switchPrefix}`,
                    {
                        [`${switchPrefix}-${this.size}`]: !!this.size,
                        [`${switchPrefix}-checked`]: this.currentValue === this.openValue,
                        [`${switchPrefix}-disabled`]: this.disabled,
                    }
                ];
            },
            innerClasses () {
                return `${switchPrefix}-inner`;
            }
        },
        methods: {
            toggleClick () {
                if (this.disabled) {
                    return false;
                }
                const checked = this.currentValue === this.openValue ? this.shutValue : this.openValue;

                this.currentValue = checked;
                this.$emit('input', checked);
                this.$emit('on-toggle', checked);
                this.dispatch('FormItem', 'on-form-change', checked);
            }
        },
        watch: {
            value (val) {
                this.currentValue = val;
            }
        },
        mounted(){
        }
    };
</script>
