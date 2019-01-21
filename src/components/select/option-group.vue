<template>
    <div :class="optiongroupClasses" v-show="!hidden">
        <div v-if="!!title" :class="titleClasses">{{ title }}</div>
        <ul :class="optionsClasses">
            <slot name="optionGroup">
                <Option v-for="(item,index) in options" :key="index" :option="item" :selected="findSelected(index)" :disabled="findDisabled(index)" @on-select="clickOption">
                    <slot></slot>
                </Option>
            </slot>
        </ul>
    </div>
</template>
<script>
    import Option from './option';
    import { prefix } from '../var';
    const optionGroupPrefix = prefix+'option-group';

    export default {
        name: 'OptionGroup',
        props: {
            options:{
                type:Array,
                default:[],
                required: true
            },
            title: {
                type: String,
                default: ''
            },
            current:{
                type:[String,Object,Number]
            }
        },
        computed: {
            optiongroupClasses () {
                return [
                    `${optionGroupPrefix}-wrap`
                ];
            },
            titleClasses () {
                return [
                    `${optionGroupPrefix}-title`
                ];
            },
            optionsClasses () {
                return [
                    `${optionGroupPrefix}-options`
                ];
            }
        },
        data () {
            return {
                hidden: false    // for search
            };
        },
        methods: {
            findSelected(index) {
                var type = typeof(this.current);
                switch(type){
                    case Number:
                    if(typeof(this.options[index])===Number&&this.current===this.options[index]){
                        return true;
                    }else if(typeof(this.options[index])===Object&&this.current===this.options[index].value){
                        return true;
                    }else{
                        return false;
                    }
                    break;
                    case String:
                    if(typeof(this.options[index])===String&&this.current===this.options[index]){
                        return true;
                    }else if(typeof(this.options[index])===Object&&this.current===this.options[index].value){
                        return true;
                    }else{
                        return false;
                    }
                    break;
                    default:
                    if(typeof(this.options[index])===Object&&this.current.value===this.options[index].value){
                        return true;
                    }
                    break;
                }
            },
            findDisabled (index) {
                return false
            },
            clickOption(option){
                this.$parent.change(option);
            },
            searchChange () {
                this.$nextTick(() => {
                    // const options = this.$refs.options.querySelectorAll('.ivu-select-item');
                    // let hasVisibleOption = false;
                    // for (let i = 0; i < options.length; i++) {
                    //     if (options[i].style.display !== 'none') {
                    //         hasVisibleOption = true;
                    //         break;
                    //     }
                    // }
                    // this.hidden = !hasVisibleOption;
                });
            }
        },
        mounted () {
            this.$on('on-search-change', () => {
                this.searchChange();
                return true;
            });
        }
    };
</script>
