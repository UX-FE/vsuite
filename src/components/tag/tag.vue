<template>
    <transition name="fade">
        <div :class="wrapclasses" @click.stop="check" :style="wrapStyles">
            <span :class="textClasses" ><slot></slot></span>
            <span v-if="closable" :class="closeClasses" @click.stop="close">
                <Icon :color="borderColor" :type="icon"></Icon>
            </span>
        </div>
    </transition>
</template>
<script>
    import Icon from '../icon';
    import { oneOf } from '../../utils/assist';
    import { prefix } from '../var';
    const tagPrefix = prefix+'tag';
    export default {
        name: 'Tag',
        components: { Icon },
        props: {
            type:{//类型
                type:String,
                validator (value) {
                    return oneOf(value, ['default', 'info']);
                }
            },
            icon:{
                type:String,
                default:'ios-close-empty'
            },
            size:{
                type:String,
                validator (value) {
                    return oneOf(value, ['default', 'large', 'small']);
                },
                default:'default'
            },
            closable: {//is closable
                type: Boolean,
                default: false
            },
            checkable: {//is checkable
                type: Boolean,
                default: false
            },
            color:{
                type:String
            },
            checked: {
                type: Boolean,
                default: false
            },
            tag: {//tag data
                type: [String, Number, Object]
            }
        },
        data () {
            return {
                isChecked: this.checked
            };
        },
        computed: {
            wrapclasses () {
                return [
                    `${tagPrefix}`,
                    {
                        [`${tagPrefix}-${this.type}`]: !!this.type,
                        [`${tagPrefix}-${this.size}`]: !!this.size,
                        [`${tagPrefix}-closable`]: this.closable,
                        [`${tagPrefix}-checked`]: this.isChecked,
                    }
                ];
            },
            wrapStyles(){
                if(!this.color){
                    return;
                }
                return {
                    background:this.color,
                    color:'#fff',
                }
            },
            textClasses () {
                return [
                    `${tagPrefix}-text`,
                    this.isChecked ? `${tagPrefix}-color-white` : ''
                ];
            },
            closeClasses () {
                return [
                    `${tagPrefix}-close`,
                    this.isChecked ? `${tagPrefix}-color-white` : ''
                ];
            },
            borderColor () {//边框，字体，图标颜色
                return this.color !== undefined ? (this.color === 'default' ? '' : 'rgb(255, 255, 255)') : '';
            }
        },
        methods: {
            close (event) {
                if (this.tag === undefined) {
                    this.$emit('on-close', event);
                } else {
                    this.$emit('on-close', event, this.tag);
                }
            },
            check () {
                if (!this.checkable) return;
                const checked = !this.isChecked;
                this.isChecked = checked;
                if (this.tag === undefined) {
                    this.$emit('on-change', checked);
                } else {
                    this.$emit('on-change', checked, this.tag);
                }
            }
        }
    };
</script>