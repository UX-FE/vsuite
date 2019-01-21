<template>
    <transition name="fade">
        <div :class="classes">
            <div :class="mainClasses">
                <span :class="iconClasses"><slot name="icon"><Icon :type="iconType"></Icon></slot></span>
                <div :class="textClasses"><slot></slot></div>
            </div>
        </div>
    </transition>
</template>
<script>
    import { prefix } from '../var'
    const nodataPrefix = prefix + 'nodata'

    export default {
        name: 'NoData',
        props: {
            size: {
                validator (value) {
                    return ['small', 'large'].indexOf(value)>-1;
                }
            },
            icon:{
                type:String,
                default:'no-data'
            },
            hideIcon:{
                type:Boolean,
                default:false,
            },
            fix: {
                type: Boolean,
                default: false
            },
        },
        data () {
            return {
                showText: false,
                visible: false,
                iconType:this.icon
            };
        },
        computed: {
            classes () {
                return [
                    `${nodataPrefix}-wrap`,
                    {
                        [`${nodataPrefix}-${this.size}`]: !!this.size,
                        [`${nodataPrefix}-fix`]: this.fix,
                        [`${nodataPrefix}-show-text`]: this.showText,
                    }
                ];
            },
            mainClasses () {
                return `${nodataPrefix}-main`;
            },
            iconClasses () {
                return [
                    `${nodataPrefix}-icon`,
                    {
                        [`${nodataPrefix}-icon-hide`]: this.hideIcon,
                    }
                ];
            },
            textClasses () {
                return `${nodataPrefix}-text`;
            },
        },
        watch: {
            visible (val) {
            }
        },
        mounted () {
            this.showText = this.$slots.default !== undefined;
        }
    };
</script>
