<template>
    <div 
        :class="wrapClasses" 
        >
        <span v-show="showZeroTrigger" @click="toggleCollapse" :class="zeroWidthTriggerClasses">
            <i class="ivu-icon ivu-icon-navicon-round"></i>
        </span>
        <div :class="childClasses">
            <slot></slot>
        </div>
        <slot name="trigger">
            <div v-show="showBottomTrigger" :class="triggerClasses" @click="toggleCollapse">
                <i :class="triggerIconClasses"></i>
            </div>
        </slot>
    </div>
</template>
<script>
    import { on, off } from '../../utils/dom';
    import { oneOf, dimensionMap, setMatchMedia } from '../../utils/assist';
    import { prefix } from '../var'
    const siderPrefix = prefix + 'sider'
    setMatchMedia();
    export default {
        name: 'Sider',
        props: {
            value: {  // if it's collpased now
                type: Boolean,
                default: false
            },
            collapsedWidth: {
                type: [Number, String],
                default: 64
            },
            hideTrigger: {
                type: Boolean,
                default: false
            },
            breakpoint: {
                type: String,
                validator (val) {
                    return oneOf(val, ['xs', 'sm', 'md', 'lg', 'xl']);
                }
            },
            collapsible: {
                type: Boolean,
                default: false
            },
            defaultCollapsed: {
                type: Boolean,
                default: false
            },
            reverseArrow: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                prefix: siderPrefix,
                mediaMatched: false,
                isCollapsed: false
            };
        },
        computed: {
            wrapClasses () {
                return [
                    `${siderPrefix}`,
                    // this.siderWidth ? '' : `${siderPrefix}-zero-width`,
                    this.isCollapsed ? `${siderPrefix}-collapsed` : ''
                ];
            },           
            triggerClasses () {
                return [
                    `${siderPrefix}-trigger`,
                    this.isCollapsed ? `${siderPrefix}-trigger-collapsed` : '',
                ];
            },
            childClasses () {
                return `${siderPrefix}-children`;
            },
            zeroWidthTriggerClasses () {
                return [
                    `${siderPrefix}-zero-width-trigger`,
                    this.reverseArrow ? `${siderPrefix}-zero-width-trigger-left` : ''
                ];
            },
            triggerIconClasses () {
                return [
                    'ivu-icon',
                    `ivu-icon-chevron-${this.reverseArrow ? 'right' : 'left'}`,
                    `${siderPrefix}-trigger-icon`,
                ];
            },          
            showZeroTrigger () {
                return this.collapsible ? (this.mediaMatched && !this.hideTrigger || (parseInt(this.collapsedWidth) === 0) && this.isCollapsed && !this.hideTrigger) : false;
            },
            showBottomTrigger () {
                return this.collapsible ? !this.mediaMatched && !this.hideTrigger : false;
            }
        },
        methods: {
            toggleCollapse () {
                this.isCollapsed = this.collapsible ? !this.isCollapsed : false;
                this.$emit('input', this.isCollapsed);
                this.$emit('on-collapse', this.isCollapsed);
            },
            matchMedia () {
                let matchMedia;
                if (window.matchMedia) {
                    matchMedia = window.matchMedia;
                }
                let mediaMatched = this.mediaMatched;
                this.mediaMatched = matchMedia(`(max-width: ${dimensionMap[this.breakpoint]})`).matches;
                
                if (this.mediaMatched !== mediaMatched) {
                    this.isCollapsed = this.collapsible ? this.mediaMatched : false;
                    this.$emit('input', this.mediaMatched);
                    this.$emit('on-collapse', this.mediaMatched);
                }
            },
            onWindowResize () {
                this.matchMedia();
            }
        },
        mounted () {
            if (this.defaultCollapsed) {
                this.isCollapsed = true;
                this.$emit('input', this.defaultCollapsed);
            } else {
                if (this.value !== undefined) {
                    this.isCollapsed = this.value;
                }
            }
            if (this.breakpoint !== undefined) {
                on(window, 'resize', this.onWindowResize);
                this.matchMedia();
            }
        },
        beforeDestroy () {
            if (this.breakpoint !== undefined) {
                off(window, 'resize', this.onWindowResize);
            }
        }
    };
</script>