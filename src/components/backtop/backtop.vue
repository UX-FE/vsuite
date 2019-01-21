<template>
    <div :class="classes" @click="backTop" :style="styles">
        <slot>
            <div v-if="!!icon" :class="[prefix+'-icon-wrap']">
                <Icon :type="icon"></Icon>
            </div>
        </slot>
    </div>
</template>
<script>
    import Icon from '../icon';
    import { scrollTop } from '../../utils/assist';
    import { on, off } from '../../utils/dom';

    import { prefix } from '../var';
    const backtopPrefix = prefix+'backtop';
    export default {
        name: 'BackTop',
        props: {
            height:{
                type:Number,
                default:500
            },
            bottom: {
                type: Number,
                default: 30
            },
            right: {
                type: Number,
                default: 30
            },
            duration:{
                type:Number,
                default:800
            },
            icon:String
        },
        data () {
            return {
                prefix:backtopPrefix,
                show:false
            };
        },
        computed: {
            classes () {
                return [
                    `${backtopPrefix}`,
                    {
                        [`${backtopPrefix}-show`]: this.show
                    }
                ];
            },
            styles () {
                return {
                    bottom: `${this.bottom}px`,
                    right: `${this.right}px`
                };
            },
        }, 
        methods: {
            handleScroll () {
                this.show = this.$parent.$el.children[0].scrollTop >= this.height;
            },
            backTop () {
                const sTop = this.$parent.$el.children[0].scrollTop;
                scrollTop(this.$parent.$el.children[0], sTop, 0, this.duration);
                this.$emit('on-back',sTop);
            }
        },
        mounted() {
            on(this.$parent.$el.children[0], 'scroll', this.handleScroll);
            on(this.$parent.$el.children[0], 'resize', this.handleScroll);
        },
        beforeDestroy () {
            off(this.$parent.$el.children[0], 'scroll', this.handleScroll);
            off(this.$parent.$el.children[0], 'resize', this.handleScroll);
        },
    };
</script>
