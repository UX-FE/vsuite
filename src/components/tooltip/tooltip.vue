<template>
    <div :class="wrapClasses" @mouseenter="showTooltip" @mouseleave="hideTooltip">
        <div :class="targetClasses" ref="target"><slot name="target"></slot></div>
        <transition name="fade">
            <div :class="tooltipClasses" ref="tooltip" :style="tooltipStyles" @mouseenter="showTooltip" @mouseleave="hideTooltip" v-show="show">
                <div :class="contentClasses">
                    <div :class="arrowClasses"></div>
                    <div :class="textClasses"><slot>{{ content }}</slot></div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>

    import { oneOf } from '../../utils/assist';

    import { prefix } from '../var';
    const tooltipPrefix = prefix+'tooltip';
    export default {
        name: 'Tooltip',
        props: {
            type:{//类型
                type:String,
                validator (value) {
                    return oneOf(value, ['dark', 'light']);
                }
            },
            size:{
                type:String,
                validator (value) {
                    return oneOf(value, ['large', 'small']);
                }
            },
            direction:{
                type:String,
                validator (value) {
                    return oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
                },
                default: 'top'
            },
            content:{
                type:[String,Number],
                default:''
            },
            start:{
                type:Number,
                default:0
            },
            end:{
                type:Number,
                default:0
            },
            delay:{
                type:Number,
                default:100
            }
        },
        data () {
            return {
                show:false,
                tooltipStyles:{}
            };
        },
        computed: {
            wrapClasses () {
                return [
                    `${tooltipPrefix}`,
                    {
                        [`${tooltipPrefix}-${this.type}`]: !!this.type,
                        [`${tooltipPrefix}-${this.size}`]: !!this.size
                    }
                ];
            },
            targetClasses () {
                return [
                    `${tooltipPrefix}-target`
                ];
            },
            tooltipClasses () {
                return [
                    `${tooltipPrefix}-wrap`,
                    {
                        [`${tooltipPrefix}-${this.direction}`]: !!this.direction
                    }
                ];
            },
            contentClasses(){
                return `${tooltipPrefix}-content`;

            },
            arrowClasses(){
                return `${tooltipPrefix}-arrow`;
            },
            textClasses(){
                return `${tooltipPrefix}-text`;

            }
        },
        methods: {
            getTop(height,width){
                var tooltipHeight = this.$refs.tooltip.offsetHeight;
                switch(this.direction){
                    case 'top-start':
                    return 'initial';
                    break;
                    case 'top':
                    return 'initial';
                    break;
                    case 'top-end':
                    return 'initial';
                    break;
                    case 'bottom-start':
                    return ((height)+'px');
                    break;
                    case 'bottom':
                    return ((height)+'px');
                    break;
                    case 'bottom-end':
                    return ((height)+'px');
                    break;
                    case 'left-start':
                    return this.start+'px';
                    break;
                    case 'left':
                    return ((height/2-tooltipHeight/2)+'px');
                    break;
                    case 'left-end':
                    return 'initial';
                    break;
                    case 'right-start':
                    return this.start+'px';
                    break;
                    case 'right':
                    return ((height/2-tooltipHeight/2)+'px');
                    break;
                    case 'right-end':
                    return 'initial';
                    break;
                    default:
                    break;
                }
            },
            getBotton(height,width){
                var tooltipHeight = this.$refs.tooltip.offsetHeight;
                switch(this.direction){
                    case 'bottom-start':
                    return 'initial';
                    break;
                    case 'bottom':
                    return 'initial';
                    break;
                    case 'bottom-end':
                    return 'initial';
                    break;
                    case 'top-start':
                    return ((height)+'px');
                    break;
                    case 'top':
                    return ((height)+'px');
                    break;
                    case 'top-end':
                    return ((height)+'px');
                    break;
                    case 'left-start':
                    return 'initial';
                    break;
                    case 'left':
                    return 'initial';
                    break;
                    case 'left-end':
                    return this.end+'px';
                    break;
                    case 'right-start':
                    return 'initial';
                    break;
                    case 'right':
                    return 'initial';
                    break;
                    case 'right-end':
                    return this.end+'px';
                    break;
                    default:
                    break;
                }
            },
            getLeft(height,width){
                var tooltipWidth = this.$refs.tooltip.offsetWidth;
                switch(this.direction){
                    case 'top-start':
                    return this.start+'px';
                    break;
                    case 'top':
                    return ((width/2-tooltipWidth/2)+'px');
                    break;
                    case 'top-end':
                    return 'initial';
                    break;
                    case 'bottom-start':
                    return this.start+'px';
                    break;
                    case 'bottom':
                    return ((width/2-tooltipWidth/2)+'px');
                    break;
                    case 'bottom-end':
                    return 'initial';
                    break;
                    case 'left-start':
                    return 'initial';
                    break;
                    case 'left':
                    return 'initial';
                    break;
                    case 'left-end':
                    return 'initial';
                    break;
                    case 'right-start':
                    return ((width)+'px');
                    break;
                    case 'right':
                    return ((width)+'px');
                    break;
                    case 'right-end':
                    return ((width)+'px');
                    break;
                    default:
                    break;
                }
            },
            getRight(height,width){
                var tooltipWidth = this.$refs.tooltip.offsetWidth;
                switch(this.direction){
                    case 'top-start':
                    return 'initial';
                    break;
                    case 'top':
                    return 'initial';
                    break;
                    case 'top-end':
                    return this.end+'px';
                    break;
                    case 'bottom-start':
                    return 'initial';
                    break;
                    case 'bottom':
                    return 'initial';
                    break;
                    case 'bottom-end':
                    return this.end+'px';
                    break;
                    case 'left-start':
                    return ((width)+'px');
                    break;
                    case 'left':
                    return ((width)+'px');
                    break;
                    case 'left-end':
                    return ((width)+'px');
                    break;
                    case 'right-start':
                    return 'initial';
                    break;
                    case 'right':
                    return 'initial';
                    break;
                    case 'right-end':
                    return 'initial';
                    break;
                    default:
                    break;
                }
            },
            getTooltipStyles(){
                if(this.$refs.target){
                    var height = this.$refs.target.offsetHeight;
                    var width = this.$refs.target.offsetWidth;
                    var place = this.direction;
                    return {
                        top:this.getTop(height,width),
                        bottom:this.getBotton(height,width),
                        left:this.getLeft(height,width),
                        right:this.getRight(height,width)
                    };
                }
                return {};
            },
            showTooltip(){
                if (this.timeout) clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.show = true;
                    this.$nextTick(function(){
                        this.tooltipStyles = this.getTooltipStyles();
                    });
                }, this.delay);
            },
            hideTooltip(){
                if (this.timeout) {
                    clearTimeout(this.timeout);
                    if (!this.controlled) {
                        this.timeout = setTimeout(() => {
                            this.show = false;
                        }, 100);
                    }
                }
            }
        },
        mounted () {
        }
    };
</script>