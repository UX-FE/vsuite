<template>
    <li :class="itemClasses">
        <div :class="lineClasses"></div>
        <div :class="headClasses" :style="customColor" ref="custom"><slot name="custom"></slot></div>
        <div :class="contentClasses">
            <slot></slot>
        </div>
    </li>
</template>
<script>
    import { prefix } from '../var';
    const timelineitemPrefix = prefix+'timeline-item';

    export default {
        name: 'TimelineItem',
        props: {
            color: {
                type: String,
                default: 'blue'
            },
            active:{
                type:Boolean
            }
        },
        data () {
            return {//是否自定义时间点
                custom: false
            };
        },
        mounted () {
            this.custom = this.$refs.custom.innerHTML.length ? true : false;
        },
        computed: {
            itemClasses () {
                return [
                    `${timelineitemPrefix}`,
                    {
                        [`${timelineitemPrefix}-active`]: this.active
                    }
                ];
            },
            lineClasses () {
                return `${timelineitemPrefix}-line`;
            },
            headClasses () {
                return [
                    `${timelineitemPrefix}-head`,
                    {
                        [`${timelineitemPrefix}-head-custom`]: this.custom,
                        [`${timelineitemPrefix}-head-${this.color}`]: this.headColorShow
                    }
                ];
            },
            headColorShow () {
                return this.color == 'blue' || this.color == 'red' || this.color == 'green';
            },
            customColor () {
                let style = {};
                if (this.color) {
                    if (!this.headColorShow) {
                        style = {
                            'color': this.color,
                            'border-color': this.color
                        };
                    }
                }

                return style;
            },
            contentClasses () {
                return `${timelineitemPrefix}-content`;
            }
        }
    };
</script>
