<template>
    <div :class="optionClasses" @click.stop.prevent="select" @mouseout.stop="blur"  v-show="!hidden"
        :title="getOptionLabel()">
        <slot>
            <template v-if="multiple">
                <template v-if="multiType==='check-box'">
                    <Checkbox v-model="selected">{{ getOptionLabel() }}</Checkbox>
                </template>
                <template v-else>
                    {{ getOptionLabel() }}
                    <Icon type="checkmark-round" class="check-icon"></Icon>
                </template>
            </template>
            <template v-else>
                {{ getOptionLabel() }}
            </template>
        </slot>
    </div>
</template>
<!--
    option:{
        label:'',
        value:'',
        filter:'',
        disabled:false
    }
-->
<script>
    import Emitter from '../../mixins/emitter';
    import { findComponentUpward } from '../../utils/assist';
    import Icon from '../icon';
    import { prefix } from '../var';
    const optionPrefix = prefix+'option';

    export default {
        name: 'FormOption',
        componentName: 'FormOption',
        mixins: [ Emitter ],
        props: {
            option:{
                type:[Object,Number],
                required:true
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        components:{
            'Icon':Icon
        },
        data () {
            return {
                selected:false,
                multiple:false,
                multiType:'',
                labelKey:'label',
                valueKey:'value',
                forbiden:this.disabled,
                label:'',
                value:'',
                index:-1,
                isFocus:false,
                hidden: false,    // for search
                searchLabel: '',    // the value is slot,only for search
            };
        },
        computed: {
            optionClasses () {
                return [
                    `${optionPrefix}`,
                    {
                        [`${optionPrefix}-disabled`]: this.forbiden,
                        [`${optionPrefix}-selected`]: this.selected
                    }
                ];
            }
        },
        methods: {
            select () {
                if (this.forbiden) {
                    return false;
                }
                // this.selected = !this.selected;
                this.dispatch('FormSelect', 'on-select', this);
            },
            blur () {
                this.isFocus = false;
            },
            getOptionLabel(){
                return (typeof(this.option)==='string'||typeof(this.option)==='number') ? this.option : ((this.option[this.labelKey])?this.option[this.labelKey]:this.option[this.valueKey]);
            },
            getOptionValue(){
                return (typeof(this.option)==='string'||typeof(this.option)==='number') ? this.option : ((this.option[this.valueKey])?this.option[this.valueKey]:this.option[this.valueKey]);
            },
            searchChange (val) {
                const parsedQuery = val.replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1');
                this.hidden = !new RegExp(parsedQuery, 'i').test(this.searchLabel);
            },
            // // 在使用函数防抖后，设置 key 后，不更新组件了，导致SearchLabel 不更新 #1865
            updateSearchLabel () {
                this.searchLabel = (typeof(this.option)==='string'||typeof(this.option)==='number') ? this.option : ((this.option.filter)?this.option.filter:this.option[this.valueKey]);;
            }
        },
        mounted () {
            this.updateSearchLabel();
            this.label = this.getOptionLabel();
            this.value = this.getOptionValue();
            this.dispatch('FormSelect','append');
            // this.updateLabel();
            // this.updateOptions();
            // this.dispatch('FormSelect', 'append');
            // this.$on('on-select-close', () => {
            //     this.isFocus = false;
            // });
            // this.updateSearchLabel();
            // this.dispatch('FormSelect', 'append');
            
            this.$on('on-search-change', (val) => {
                this.searchChange(val);
            });
        },
        watch:{
            option(val){
                this.updateSearchLabel();
                this.label = this.getOptionLabel();
                this.value = this.getOptionValue();
            },
            disabled(val){
                this.forbiden  = val;
            }

        },
        created(){
            const Select = findComponentUpward(this, 'FormSelect');
            if (Select){
                this.multiple = Select.type==='multiple';
                this.multiType = Select.multiType;
                this.labelKey = Select.labelKey;
                this.valueKey = Select.valueKey;
                
            }
            // this.parentS.options.push(this);
            // this.parentS.optionInstances.push(this);
        },
        beforeDestroy () {
            this.dispatch('FormSelect', 'remove');
        }
    };
</script>
