<template>
    <transition name="fade">
        <div :class="wrapClasses" v-if="visible" :style="wrapStyle">
            <div :class="contentClasses">
                <span :class="iconClasses" v-if="showIcon">
                    <slot name="icon">
                        <Icon :type="iconType" :color="iconColor"></Icon>
                    </slot>
                </span>
                <span :class="mainClasses"><slot></slot></span>
                <a :class="closeClasses" v-if="closable" @click.stop="close">
                    <slot name="close">
                        <Icon :type="closeIcon"></Icon>
                    </slot>
                </a>
            </div>
        </div>
    </transition>
</template>
<script>
    import { oneOf } from '../../utils/assist';
    import Icon from '../icon';

    import { prefix } from '../var';
    const alertPrefix = prefix+'alert';
    export default {
        name: 'Alert',
        props: {
            mode:{
                type:String,
                default:'normal',
                validator (value) {
                    return oneOf(value, ['normal','fix']);
                },
            },
            autoHidden:{
                type:Boolean,
                default:true
            },
            duration:{
                type:Number,
                default:1.5
            },
            value:{
                type:Boolean,
                default:true
            },
            type: {
                validator (value) {
                    return oneOf(value, ['success', 'info', 'warn', 'error']);
                },
            },
            closable: {
                type: Boolean,
                default: false
            },
            showIcon: {
                type: Boolean,
                default: false
            },
            icon:String,
            iconTypes:Array,
            iconColor:String,
            closeIcon:{
                type:String,
                default:'close'
            },
            top:{
                type:[Number,String],
                default:60
            },
            
        },
        data(){
            return {
                visible:this.value
            }
        },
        computed: {
            wrapClasses () {
                return [
                    `${alertPrefix}`,
                    {
                        [`${alertPrefix}-${this.type}`]: !!this.type,
                        [`${alertPrefix}-${this.mode}`]: !!this.mode,
                        [`${alertPrefix}-with-icon`]: this.showIcon
                    }
                ];
            },
            wrapStyle(){
                return {
                    top:(!!top)?(this.top+'px'):'null'
                }
            },
            contentClasses () {
                return `${alertPrefix}-content`;
            },
            mainClasses () {
                return `${alertPrefix}-message`;
            },
            closeClasses () {
                return `${alertPrefix}-close`;
            },
            iconClasses () {
                return `${alertPrefix}-icon`;
            },
            iconType () {
                let type = '';
                let iconTypes = ['checkmark-circled','information-circled','android-alert','close-circled'];
                if(!!this.icon){
                    return this.icon;
                }
                if(!!this.iconTypes){
                    iconTypes = this.iconTypes;
                }
                switch (this.type) {
                    case 'success':
                        type = iconTypes[0];
                        break;
                    case 'info':
                        type = iconTypes[1];
                        break;
                    case 'warn':
                        type = iconTypes[2];
                        break;
                    case 'error':
                        type = iconTypes[3];
                        break;
                }


                return type;
            }
        },
        watch:{
            value(val){
                this.visible = val;
            },
            visible(val){
                if(val){
                    this.clearCloseTimer();

                    if (this.autoHidden&&this.duration !== 0) {
                        this.closeTimer = setTimeout(() => {
                            this.close();
                        }, this.duration * 1000);
                    }
                }
                this.$emit('input',this.visible);
            }
        },
        methods:{
            close (e) {
                this.clearCloseTimer();
                this.visible = false;
                this.$emit('on-close', this.visible,e);
            },
            clearCloseTimer () {
                if (this.closeTimer) {
                    clearTimeout(this.closeTimer);
                    this.closeTimer = null;
                }
            },
        },
        mounted(){
            this.clearCloseTimer();

            // if (this.autoHidden&&this.duration !== 0) {
            //     this.closeTimer = setTimeout(() => {
            //         this.close();
            //     }, this.duration * 1000);
            // }

        },
        beforeDestroy () {
            this.clearCloseTimer();
        },
        created(){
            if(this.mode==='fix'){
                this.visible = false;
            }
        }
    };
</script>