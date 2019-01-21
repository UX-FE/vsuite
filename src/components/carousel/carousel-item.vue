<template>
    <div :class="classes" :style="styles" @click="handleItemClick">
        <div v-if="$parent.type === 'card'" v-show="!active" :class="[prefix+'-mask']"></div>
        <slot></slot>
        
    </div>
</template>
<script>
    import { prefix } from '../var';
    const carouselItemPrefix = prefix+'carousel-item';

    export default {
        componentName: 'carousel-item',
        name: 'CarouselItem',
        data () {
            return {
                prefix: carouselItemPrefix,
                width: 0,
                height: 'auto',
                left: 0,
                translate: 0,
                scale: 1,
                hover: false,
                active: false,
                ready: false,
                inStage: false,
                animating: false,
                cardScale:0.8
            };
        },
        computed: {
            classes(){
                return [
                    `${carouselItemPrefix}`,
                    {
                        [`${carouselItemPrefix}-${this.$parent.type}`]:!!this.$parent.type,
                        [`${carouselItemPrefix}-animating`]:this.animating,
                        [`${carouselItemPrefix}-instage`]:this.inStage,
                        [`${carouselItemPrefix}-active`]:this.active,
                    }

                ]
            },
            styles () {
                return {
                    msTransform: `translateX(${ this.translate }px) scale(${ this.scale })`,
                    webkitTransform: `translateX(${ this.translate }px) scale(${ this.scale })`,
                    transform: `translateX(${ this.translate }px) scale(${ this.scale })`
                };
            }
        },
        mounted () {
            this.$parent.slotChange();
        },
        methods:{
            processIndex(index, activeIndex, length) {
                if (activeIndex === 0 && index === length - 1) {
                return -1;
                } else if (activeIndex === length - 1 && index === 0) {
                return length;
                } else if (index < activeIndex - 1 && activeIndex - index >= length / 2) {
                return length + 1;
                } else if (index > activeIndex + 1 && index - activeIndex >= length / 2) {
                return -2;
                }
                return index;
            },
            calculateTranslate(index, activeIndex, parentWidth) {
                if (this.inStage) {
                return parentWidth * ((2 - this.cardScale) * (index - activeIndex) + 1) / 4;
                } else if (index < activeIndex) {
                return -(1 + this.cardScale) * parentWidth / 4;
                } else {
                return (3 + this.cardScale) * parentWidth / 4;
                }
            },
            translateItem(index,activeIndex,oldIndex){
                //获取父元素的宽度
                const parentWidth = this.$parent.$el.offsetWidth;
                
                //获取幻灯片个数
                const length = this.$parent.slides.length;
                //在当前页
                if (this.$parent.type !== 'card' && oldIndex !== undefined) {
                    this.animating = index === activeIndex || index === oldIndex;
                }
                //切换页
                if (index !== activeIndex && length > 2) {
                    index = this.processIndex(index, activeIndex, length);
                }
                if (this.$parent.type === 'card') {
                    this.inStage = Math.round(Math.abs(index - activeIndex)) <= 1;
                    this.active = index === activeIndex;
                    this.translate = this.calculateTranslate(index, activeIndex, parentWidth);
                    this.scale = this.active ? 1 : this.cardScale;
                } else {
                    this.active = index === activeIndex;
                    this.translate = parentWidth * (index - activeIndex);
                }
                this.ready = true;
            },
            handleItemClick() {
                const parent = this.$parent;
                if (parent && parent.type === 'card') {
                    const index = parent.slides.indexOf(this);
                    parent.setActiveItem(index);
                }
            }
        },
        beforeDestroy () {
            this.$parent.slotChange();
        }
    };
</script>
