<template>
    <div v-transfer-dom :data-transfer="transfer">
        <transition :name="transitionNames[1]">
            <div :class="maskClasses" v-show="show" @click="handleMaskClick"></div>
        </transition>
        <div :class="wrapClasses" v-show="show"  >
            <transition :name="transitionNames[0]" @after-leave="animationFinish">
                 <div :class="classes" :style="mainStyles" v-show="show"  v-clickoutside="handleWrapClick">
                     <slot>
                        <div :class="[prefix + '-header']" v-if="showHead">
                            <slot name="header">
                                <div :class="[prefix + '-header-inner']">{{ title }}</div>
                                <a :class="[prefix + '-close']" v-if="closable" @click="close">
                                    <slot name="close">
                                        <Icon :type="icon"></Icon>
                                    </slot>
                                </a>
                            </slot>
                        </div>
                        <div :class="[prefix + '-body']">
                            <slot name="body">

                            </slot> 
                        </div>
                        <div :class="[prefix + '-footer']" v-if="!hideFooter">
                            <slot name="footer">
                                <BaseButton type="primary" @on-click-btn="handleSubmit" :class="[prefix + '-footer-btn']">{{submitText}}</BaseButton>
                                <BaseButton @on-click-btn="handleCancel" :class="[prefix + '-footer-btn']">{{cancelText}}</BaseButton>
                            </slot>
                        </div>
                     </slot>
                 </div>
            </transition>
        </div>    
    </div>
</template>
<script>
    import TransferDom from '../../directives/transfer-dom';
    import Emitter from '../../mixins/emitter';
    import clickoutside from '../../directives/clickoutside';

    import { prefix } from '../var';
    const modalPrefix = prefix+'modal';
    export default {
        name: 'Modal',
        mixins: [  Emitter ],
        directives: { TransferDom,clickoutside },
        props: {
            value: {
                type: Boolean,
                default: false
            },
            closable: {
                type: Boolean,
                default: true
            },
            icon:{
                type:String,
                default:'ios-close-empty'
            },
            maskClosable: {
                type: Boolean,
                default: false
            },
            styles:Object,
            title:String,
            top:{
                type:[Number,String],
                default:100
            },
            width: {
                type: [Number, String],
                default: 520
            },
            scrollable: {
                type: Boolean,
                default: false
            },
            className: {
                type: String
            },
            cancelText:{
                type:String,
                default:'取消'
            },
            submitText:{
                type:String,
                default:'确定'
            },
            status:{
                type:String
            },
            transitionNames: {
                type: Array,
                default () {
                    return ['ease', 'fade'];
                }
            },
            transfer: {
                type: Boolean,
                default: true
            },
            hideFooter: {
                type: Boolean,
                default: false
            },
        },
        data () {
            return {
                prefix:modalPrefix,
                wrapShow: false,
                showHead: true,
                show: this.value
            };
        },
        computed: {
            wrapClasses () {
                return [
                    `${modalPrefix}-wrap`,
                    {
                        // [`${modalPrefix}-hidden`]: !this.wrapShow,
                        [`${this.className}`]: !!this.className
                    }
                ];
            },
            maskClasses () {
                return `${modalPrefix}-mask`;
            },
            classes () {
                return `${modalPrefix}`;
            },
            mainStyles () {
                let style = {};

                const width = parseInt(this.width);
                const styleWidth = {
                    width: width <= 100 ? `${width}%` : `${width}px`,
                    top:(typeof this.top == 'string')?this.top:(this.top+'px')
                };


                const customStyle = this.styles ? this.styles : {};

                Object.assign(style, styleWidth, customStyle);
                return style;
            },
        }, 
        methods: {
            close () {
                this.show = false;
                this.$emit('on-close',this.show);
                this.$emit('input', this.show);
            },
            handleMaskClick () {
                if (this.maskClosable) {
                    this.close();
                }
            },
            handleWrapClick () {
                if (this.show&&this.maskClosable) {
                    this.close();
                }
            },
            handleCancel(){
                this.close();
                this.$emit("on-cancel");
            },
            handleSubmit(){
                if(this.status==='loading'){

                }else{
                    this.close();
                    this.$emit("on-submit");
                }
            },
            EscClose (e) {
                if (this.show && this.closable) {
                    if (e.keyCode === 27) {
                        this.close();
                    }
                }
            },
            animationFinish() {
                this.$emit('on-hidden');
            }
        },
        mounted() {
            if (this.show) {
                this.wrapShow = true;
            }

            let showHead = true;

            if (this.$slots.header === undefined && !this.title) {
                showHead = false;
            }
            this.showHead = showHead;
            // ESC close
            document.addEventListener('keydown', this.EscClose);
        },
        beforeDestroy () {
            document.removeEventListener('keydown', this.EscClose);
        },
        watch:{
            value(val){
                this.show = val;
            },
            show(val){
                if(!val){

                }else{
                    this.wrapShow = true;

                }
            },
            title (val) {
                if (this.$slots.header === undefined) {
                    this.showHead = !!val;
                }
            }
        }

    };
</script>
