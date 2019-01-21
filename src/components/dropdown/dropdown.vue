<template>
    <div :class="classes" v-clickoutside="handleClose" @mouseenter="handleMouseenter"  @mouseleave="handleMouseleave">
        <div :class="[prefix+'-header']" ref="refer" @click="handleClick">
            <slot></slot>
        </div>
        <transition name="fade" @before-enter="handleMenuEnter" @after-leave="handleDestroy">
            <div v-show="show" ref="drop" :class="dropClasses" @mouseenter="handleMouseenter"  @mouseleave="handleMouseleave" :style="dropStyle">
                <slot name="list">
                </slot>
                <div v-if="bubble" :class="[prefix+'-drop-arrow']"></div>
            </div>
        </transition>
    </div>
</template>
<script>
    import clickoutside from '../../directives/clickoutside';
    import { oneOf, findComponentUpward } from '../../utils/assist';

    import { prefix } from '../var';
    const dropdownPrefix = prefix+'dropdown';
    export default {
        name: 'DropDown',
        directives: { clickoutside },
        props:{
            trigger:{
                validator (value) {
                    return oneOf(value, ['click', 'hover']);
                },
                default: 'hover'
            },
            align:{
                validator (value) {
                    return oneOf(value, ['left', 'center', 'right']);
                },
                default: 'left'
            },
            bubble:{
                type:Boolean,
                default:false
            },
        },
        data(){
            return {
                prefix:dropdownPrefix,
                show:false,
                dropStyle:{
                    left:0,
                    right:0
                },
                leftP:0
            }
        },
        computed: {
            classes () {
                return [
                    `${dropdownPrefix}`,
                    {
                        [`${dropdownPrefix}-${this.align}`]:!!this.align
                    }
                ];
            },
            dropClasses () {
                return [
                    `${dropdownPrefix}-drop`,
                    {
                        [`${dropdownPrefix}-bubble`]: !!this.bubble,
                        [`${dropdownPrefix}-drop-${this.align}`]: !!this.align,

                    }
                ];
            },
        },
        watch:{
            show(val){
                if(val&&this.$refs.refer&&this.$refs.drop&&this.align==='center'){
                    this.$nextTick(function(){
                        let referWidth = this.$refs.refer.offsetWidth;
                        let dropWidth = this.$refs.drop.offsetWidth;
                        this.leftP = ((dropWidth>referWidth)?'-':'')+Math.abs(dropWidth-referWidth)/2;
                        this.getDropStyle();
                    });
                }
            },
            align(val){
                this.getDropStyle();
            }
        },
        methods:{
            handleMenuEnter(){
                this.$emit("on-enter",this);
            },
            handleDestroy() {
                this.$emit("on-leave",this);
            },
            getDropStyle(){
                let style = {
                    'left':(this.align==='left')?0:((this.align==='center')?(this.leftP+'px'):'auto'),
                    'right':(this.align==='right')?0:'auto',
                }
                this.dropStyle = style;
            },
            handleClick(){
                this.show = !this.show;
            },
            handleMouseenter () {;
                if (this.trigger !== 'hover') {
                    return false;
                }
                if (this.timeout) clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.show = true;
                }, 250);
            },
            handleMouseleave () {
                if (this.trigger !== 'hover') {
                    return false;
                }
                if (this.timeout) {
                    clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => {
                        this.show = false;
                    }, 150);
                }
            },
            handleClose () {
                if (this.trigger !== 'click') {
                    return false;
                }
                this.show = false;
            },
            
        },
        mounted(){
            this.getDropStyle();

        }
    };
</script>