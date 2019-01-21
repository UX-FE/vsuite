<template>
    <div :class="classes">
        <button :class="arrowClasses" class="left" @click="handleArrowClick(currentIndex-1)">
            <Icon type="chevron-left"></Icon>
        </button>
        <div :class="[prefix + '-list']">
            <div :class="[prefix + '-track', showCopyTrack ? '' : 'higher']" :style="trackStyles" ref="originTrack">
                <slot></slot>
            </div>
        </div>
        <button :class="arrowClasses" class="right" @click="handleArrowClick(currentIndex+1)">
            <Icon type="chevron-right"></Icon>
        </button>
        <ul :class="dotsClasses">
            <template v-for="n in slides.length">
                <li :class="[n - 1 === currentIndex ? prefix + '-active' : '']" :key="n"
                    @click="dotsEvent('click', n - 1)"
                    @mouseover="dotsEvent('hover', n - 1)">
                    <button :class="[radiusDot ? 'radius' : '']"></button>
                </li>
            </template>
        </ul>
    </div>
</template>
<script>
    import Icon from '../icon/icon.vue';
    import { getStyle, oneOf } from '../../utils/assist';
    import { on, off } from '../../utils/dom';

    import { prefix } from '../var';
    const carouselPrefix = prefix+'carousel';

    export default {
        name: 'Carousel',
        components: { Icon },
        props: {
            type:{
                type:String,
            },
            arrow: {
                type: String,
                default: 'hover',
                validator (value) {
                    return oneOf(value, ['hover', 'always', 'never']);
                }
            },
            autoplay: {
                type: Boolean,
                default: false
            },
            autoplaySpeed: {
                type: Number,
                default: 2000
            },
            // loop: {
            //     type: Boolean,
            //     default: false
            // },
            // easing: {
            //     type: String,
            //     default: 'ease'
            // },
            dots: {
                type: String,
                default: 'inside',
                validator (value) {
                    return oneOf(value, ['inside', 'outside', 'none']);
                }
            },
            radiusDot: {
                type: Boolean,
                default: false
            },
            trigger: {
                type: String,
                default: 'click',
                validator (value) {
                    return oneOf(value, ['click', 'hover']);
                }
            },
            value: {
                type: Number,
                default: 0
            },
            height: {
                type: [String, Number],
                default: 300,
                validator (value) {
                    return value === 'auto' || Object.prototype.toString.call(value) === '[object Number]';
                }
            },
        },
        data () {
            return {
                prefix: carouselPrefix,
                listWidth: 0,
                trackWidth: 0,
                trackOffset: 0,
                trackCopyOffset: 0,
                showCopyTrack: false,
                slides: [],
                slideInstances: [],
                timer: null,
                ready: false,
                currentIndex: this.value,
                hideTrackPos: -1, // 默认左滑
            };
        },
        computed: {
            classes () {
                return [
                    `${carouselPrefix}`,
                    {
                        [`${carouselPrefix}-${this.type}`]:!!this.type
                    }
                ];
            },
            trackStyles () {
                return {
                    height:`${this.height}px`,
                };
            },
            arrowClasses () {
                return [
                    `${carouselPrefix}-arrow`,
                    `${carouselPrefix}-arrow-${this.arrow}`
                ];
            },
            dotsClasses () {
                return [
                    `${carouselPrefix}-dots`,
                    `${carouselPrefix}-dots-${this.dots}`
                ];
            }
        },
        methods: {
            // find option component
            findChild (cb) {
                const find = function (child) {
                    const name = child.$options.componentName;

                    if (name) {
                        cb(child);
                    } else if (child.$children.length) {
                        child.$children.forEach((innerChild) => {
                            find(innerChild, cb);
                        });
                    }
                };

                if (this.slideInstances.length || !this.$children) {
                    this.slideInstances.forEach((child) => {
                        find(child);
                    });
                } else {
                    this.$children.forEach((child) => {
                        find(child);
                    });
                }
            },
            updateSlides (init) {
                this.slides = this.$children.filter(child => child.$options.name === 'CarouselItem');
            },
            resetItemPosition(oldIndex) {
                this.slides.forEach((item, index) => {
                    item.translateItem(index, this.currentIndex, oldIndex);
                });
            },
            updatePos () {
                this.findChild((child) => {
                    child.width = this.listWidth;
                    child.height = typeof this.height === 'number' ? `${this.height}px` : this.height;
                });
                this.trackWidth = (this.slides.length || 0) * this.listWidth;
            },
            // use when slot changed
            slotChange () {
                this.$nextTick(() => {
                    this.slides = [];
                    this.slideInstances = [];

                    this.updateSlides(true, true);
                    this.updatePos();
                });
            },
            handleResize () {
                this.listWidth = parseInt(getStyle(this.$el, 'width'));
                this.updatePos();
                this.resetItemPosition();
            },
            setActiveItem (index) {
                // 获取页数
                let slidesLen = this.slides.length;
                const oldIndex = this.currentIndex;
                if (index < 0) {
                    this.currentIndex = slidesLen - 1;
                } else if (index >= slidesLen) {
                    this.currentIndex = 0;
                } else {
                    this.currentIndex = index;
                }
                if (oldIndex !== this.currentIndex) {
                    this.resetItemPosition(oldIndex);
                }
                this.$emit('input', this.currentIndex);
            },
            handleArrowClick (index) {
                this.setAutoplay();
                this.setActiveItem(index);
            },
            dotsEvent (event, n) {
                let curIndex = this.currentIndex;
                if (event === this.trigger && curIndex !== n) {
                    this.$emit('input', n);
                    this.setAutoplay();
                }
            },
            playSlides(){
                if (this.currentIndex < this.slides.length - 1) {
                    this.currentIndex++;
                } else {
                    this.currentIndex = 0;
                }
            },
            setAutoplay () {
                window.clearInterval(this.timer);
                if(this.autoplaySpeed<=0||!this.autoplay){
                    return;
                }
                this.timer = window.setInterval(() => {
                    this.playSlides();
                }, this.autoplaySpeed);
            },
        },
        watch: {
            autoplay () {
                this.setAutoplay();
            },
            autoplaySpeed () {
                this.setAutoplay();
            },
            currentIndex (val, oldVal) {
                this.resetItemPosition(oldVal);
                this.$emit('on-change', oldVal, val);
            },
            height () {
                this.updatePos();
            },
            value (val) {
                this.currentIndex = val;
            }
        },
        mounted () {
            this.updateSlides(true);
            this.handleResize();
            this.setAutoplay();
            on(window, 'resize', this.handleResize);
        },
        beforeDestroy () {
            off(window, 'resize', this.handleResize);
        }
    };
</script>
