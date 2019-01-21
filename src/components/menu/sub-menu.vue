<template>
    <li :class="classes" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">
        <div :class="[prefix + '-title']" ref="reference" @click="handleClick">
            <slot name="title"></slot>
            <Icon v-if="!hideSlide" :type="icon" :class="[prefix + '-title-icon']"></Icon>
        </div>
        <transition v-if="direction === 'vertical'" :name="transitionName">
            <ul :class="[prefix]" v-show="opened"><slot></slot></ul>
        </transition>
        <transition :name="transitionName" v-else>
            <div v-show="opened" :class="[prefix + '-drop']" placement="bottom" ref="drop" :style="dropStyle">
                <ul :class="[prefix + '-drop-list']"><slot></slot></ul>
            </div>
        </transition>
    </li>
</template>
<script>
    import Icon from '../icon/icon.vue';
    import { getStyle, findComponentUpward } from '../../utils/assist';
    import Emitter from '../../mixins/emitter';

    import { prefix } from '../var'
    const subMenuPrefix = prefix + 'menu-submenu';

    export default {
        name: 'SubMenu',
        mixins: [ Emitter ],
        components: { Icon },
        props: {
            name: {
                type: [String, Number],
                required: true
            },
            icon:{
                type:String,
                default:'sort-down'
            },
            hideSlide:{
                type:Boolean,
                default:false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            clickcable:{
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                prefix: subMenuPrefix,
                active: false,
                opened: false,
                dropWidth: parseFloat(getStyle(this.$el, 'width')),
                parent: findComponentUpward(this, 'Menu')
            };
        },
        computed: {
            classes () {
                return [
                    `${subMenuPrefix}`,
                    {
                        [`${subMenuPrefix}-active`]: this.active,
                        [`${subMenuPrefix}-opened`]: this.opened,
                        [`${subMenuPrefix}-disabled`]: this.disabled
                    }
                ];
            },
            direction () {
                return this.parent.direction;
            },
            accordion () {
                return this.parent.accordion;
            },
            dropStyle () {
                let style = {};

                if (this.dropWidth) style.minWidth = `${this.dropWidth}px`;
                return style;
            },
            transitionName () {
                return 'slide-up';
            },
        },
        methods: {
            handleMouseenter () {
                if (this.disabled) return;
                if (this.direction === 'vertical') return;
                this.parent.updateOpenKeys(this.name);
                this.opened = true;

                // clearTimeout(this.timeout);
                // this.timeout = setTimeout(() => {
                //     this.parent.updateOpenKeys(this.name);
                // }, 250);
            },
            handleMouseleave () {
                if (this.disabled) return;
                if (this.direction === 'vertical') return;
                this.parent.updateOpenKeys(this.name);
                this.opened = false;

                // clearTimeout(this.timeout);
                // this.timeout = setTimeout(() => {
                //     this.parent.updateOpenKeys(this.name);
                // }, 150);
            },
            handleClick () {
                if (this.disabled || !this.clickcable) return;
                if (this.direction === 'horizontal') return;
                const opened = this.opened;
                if (this.accordion) {
                    this.parent.$children.forEach(item => {
                        if (item.$options.name === 'SubMenu') item.opened = false;
                    });
                }
                this.opened = !opened;
                this.parent.updateOpenKeys(this.name);
            }
        },
        watch: {
            direction (val) {
                // if (val === 'horizontal') {
                //     this.$refs.drop.update();
                // }
            },
            opened (val) {
                if (this.direction === 'vertical') return;
                if (val) {
                    // set drop a width to fixed when menu has fixed position
                    this.dropWidth = parseFloat(getStyle(this.$el, 'width'));
                    // this.$refs.drop.update();
                } else {
                    // this.$refs.drop.destroy();
                }
            }
        },
        created () {
              this.$on('on-open',(o)=>{
                if(this.name === o){
                    this.opened = true;
                }else{
                    this.opened = false;
                }                    
            });
        },
        mounted () {
            this.$on('on-select', (name) => {
                if (this.direction === 'horizontal') this.opened = false;
                this.dispatch('Menu', 'on-select', name);
                return true;
            });
            this.$on('on-change', (status) => {
                this.active = status;
            });
            this.$on('on-open',(o)=>{
                if(this.name === o){
                    this.opened = true;
                }else{
                    this.opened = false;
                }                    
            });
        }
    };
</script>
