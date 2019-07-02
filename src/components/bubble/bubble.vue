<template>
    <div :class="wrapClasses" @mouseenter="showTooltip" @mouseleave="hideTooltip" v-clickoutside="handleClose">
        <div :class="targetClasses" ref="target"
            @click="handleClick"  @mousedown="handleFocus(false)"
            @mouseup="handleBlur(false)"><slot name="target"></slot></div>
        <transition name="fade">
            <div :class="tooltipClasses" ref="tooltip" :style="tooltipStyles" v-show="show">
                <div :class="contentClasses">
                    <div :class="arrowClasses" :style="arrowStyles" ref="arrow" v-if="!hideArrow"></div>
                    <div :class="textClasses">
                        <div :class="titleClasses">
                            <slot name="title">{{ title }}</slot>
                            <span :class="closeClasses" @click="handleClose"><slot name="close"></slot></span>
                        </div>
                        <div :class="bodyClasses">
                            <slot>{{ content }}</slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>

    import clickoutside from '../../directives/clickoutside';
    import TransferDom from '../../directives/transfer-dom';
    import { oneOf } from '../../utils/assist';

    import { prefix } from '../var';
    const bubblePrefix = prefix+'bubble';
    export default {
        name: 'Bubble',
        directives: { clickoutside, TransferDom },
        props: {
            trigger: {
                validator (value) {
                    return oneOf(value, ['click', 'focus', 'hover','default']);
                },
                default: 'click'
            },
            type:{//类型
                type:String,
                validator (value) {
                    return oneOf(value, ['dark', 'light']);
                }
            },
            defaultVisible:{
                type:Boolean,
                default:false
            },
            hideArrow:{
                type:Boolean,
                default:false,
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
            title:{
                type:[String,Number],
                default:''
            },
            width: {
                type: [String, Number]
            },
            start:{
                type:Number,
                default:0
            },
            end:{
                type:Number,
                default:0
            },
            adhere:{//箭头是否始终指向触发器中间对齐
                type:Boolean,
                default:false
            },
            transfer: {
                type: Boolean,
                default: false
            },
            content:{
                type:[String,Number],
                default:''
            },
            delay:{
                type:Number,
                default:100
            },
            // 此参数暂时不要传入，写死为0（否则会有bug）
            delay:{
                type:Number,
                default:0
            },
            isShow:{
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                show:false,
                tooltipStyles:{},
                arrowStyles:{},
            };
        },
        watch:{
            defaultVisible(val){
                if(val){
                    this.handleShow(val)

                }else{
                    this.show = val;
                }
                this.$emit("on-change",val);
            }
        },
        computed: {
            wrapClasses () {
                return [
                    `${bubblePrefix}`,
                    {
                        [`${bubblePrefix}-${this.type}`]: !!this.type,
                        [`${bubblePrefix}-${this.size}`]: !!this.size
                    }
                ];
            },
            targetClasses () {
                return [
                    `${bubblePrefix}-target`
                ];
            },
            tooltipClasses () {
                return [
                    `${bubblePrefix}-wrap`,
                    {
                        [`${bubblePrefix}-${this.direction}`]: !!this.direction,
                        [`${bubblePrefix}-hide-arrow`]: !this.hideArrow
                    }
                ];
            },
            contentClasses(){
                return `${bubblePrefix}-content`;

            },
            titleClasses(){
                return `${bubblePrefix}-title`;

            },
            closeClasses(){
                return `${bubblePrefix}-close-wrap`;

            },
            bodyClasses(){
                return `${bubblePrefix}-body`;

            },
            arrowClasses(){
                return `${bubblePrefix}-arrow`;
            },
            textClasses(){
                return `${bubblePrefix}-text`;

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
            getArrowStyles(){
                if(this.adhere&&this.$refs.target&&this.$refs.arrow){
                    var height = this.$refs.target.offsetHeight;
                    var width = this.$refs.target.offsetWidth;
                    var arrowWidth = this.$refs.arrow.offsetWidth;
                    var arrowHeight = this.$refs.arrow.arrowHeight;
                    const commonstyle = ['auto','initial','inherit','unset'];
                    const left = parseInt((this.$refs.tooltip.style.left&&commonstyle.indexOf(this.$refs.tooltip.style.left)<0)?this.$refs.tooltip.style.left.replace("px",''):0);
                    const right = parseInt((this.$refs.tooltip.style.right&&commonstyle.indexOf(this.$refs.tooltip.style.right)<0)?this.$refs.tooltip.style.right.replace("px",''):0);
                    const top = parseInt((this.$refs.tooltip.style.top&&commonstyle.indexOf(this.$refs.tooltip.style.top)<0)?this.$refs.tooltip.style.top.replace("px",''):0);
                    const bottom = parseInt((this.$refs.tooltip.style.bottom&&commonstyle.indexOf(this.$refs.tooltip.style.bottom)<0)?this.$refs.tooltip.style.bottom.replace("px",''):0);      
                    switch(this.direction){
                        case 'bottom-start':
                        return {
                           left:-(left)+((width-arrowWidth)/2)+'px'
                        }
                        break;
                        case 'top-start':
                        return {
                           left:-(left)+((width-arrowWidth)/2)+'px'
                        }
                        break;
                        case 'bottom-end':
                        return {
                           right:-(right)+((width-arrowWidth)/2)+'px'
                        }
                        break;
                        case 'top-end':
                        return {
                           right:-(right)+((width-arrowWidth)/2)+'px'
                        }
                        break;
                        case 'left-start':
                        return {
                           top:-(top)+((height-arrowHeight)/2)+'px'
                        }
                        break;
                        case 'right-start':
                        return {
                           top:-(top)+((height-arrowHeight)/2)+'px'
                        }
                        break;
                        case 'left-end':
                        return {
                           bottom:-(bottom)+((height-arrowHeight)/2)+'px'
                        }
                        break;
                        case 'right-end':
                        return {
                           bottom:-(bottom)+((height-arrowHeight)/2)+'px'
                        }
                        break;
                        default:
                        return {}
                        break;
                    }
                }
                return {};
            },
            handleClose () {
                if (this.trigger !== 'click' && this.trigger!=='default') {
                    return false;
                }
                this.show = false;
                this.$emit("on-close");
            },
            handleShow(val){
                if(this.isShow===false){
                    this.show = false
                    return
                }
                this.show = (val)?val:!this.show;
                if(this.show){
                    this.$nextTick(()=>{
                        this.tooltipStyles = this.getTooltipStyles();
                        this.$nextTick(()=>{
                            this.arrowStyles = this.getArrowStyles();
                        });
                    });
                }
            },
            handleClick () {
                if (this.trigger !== 'click') {
                    return false;
                }
                this.handleShow();
            },
            showTooltip(){
                if (this.trigger !== 'hover') {
                    return false;
                }
                if (this.timeout) clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.handleShow(true);
                }, this.delay);
            },
            hideTooltip(){
                if (this.trigger !== 'hover') {
                    return false;
                }
                if (this.timeout) {
                    clearTimeout(this.timeout);
                    if (!this.controlled) {
                        this.timeout = setTimeout(() => {
                            this.handleShow(false);
                        }, 0);
                    }
                }
            },
            handleFocus (fromInput = true) {
                if (this.trigger !== 'focus') {
                    return false;
                }
                this.handleShow(true);
            },
            handleBlur (fromInput = true) {
                if (this.trigger !== 'focus') {
                    return false;
                }
                this.handleShow(false);
            },
        },
        mounted () {
            if(this.defaultVisible){
                this.handleShow();
            }
        },
        beforeDestroy () {
        }
    };
</script>