<template>
    <transition name="fade">
        <div :class="classes" v-if="fullscreenVisible">
            <div :class="mainClasses">
                <span :class="iconClasses"><slot name="icon"><Icon :type="iconType"></Icon></slot></span>
                <div :class="textClasses"><slot></slot></div>
            </div>
        </div>
    </transition>
</template>
<script>
    import { oneOf } from '../../utils/assist';

    import { prefix } from '../var';
    const loadingPrefix = prefix+'loading';

    export default {
        name: 'Loading',
        props: {
            size: {
                validator (value) {
                    return oneOf(value, ['small', 'large']);
                }
            },
            icon:{
                type:String,
                default:'loading'
            },
            fix: {
                type: Boolean,
                default: false
            },
            fullscreen: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                showText: false,
                // used for $Spin
                visible: false,
                iconType:this.icon
            };
        },
        computed: {
            classes () {
                return [
                    `${loadingPrefix}`,
                    {
                        [`${loadingPrefix}-${this.size}`]: !!this.size,
                        [`${loadingPrefix}-fix`]: this.fix,
                        [`${loadingPrefix}-show-text`]: this.showText,
                        [`${loadingPrefix}-fullscreen`]: this.fullscreen
                    }
                ];
            },
            mainClasses () {
                return `${loadingPrefix}-main`;
            },
            iconClasses () {
                return `${loadingPrefix}-icon`;
            },
            textClasses () {
                return `${loadingPrefix}-text`;
            },
            fullscreenVisible () {
                if (this.fullscreen) {
                    return this.visible;
                } else {
                    return true;
                }
            }
        },
        watch: {
        },
        mounted () {
            this.showText = this.$slots.default !== undefined;
        }
    };
</script>
