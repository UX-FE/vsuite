<template>
    <div :class="classes">
        <slot></slot>
        <sup v-show="show" :class="badgeClasses" :style="badgeStyles">{{showCount}}</sup>
    </div>
</template>
<script>
    import { prefix } from '../var';
    const badgePrefix = prefix+'badge';
    export default {
        name: 'Badge',
        props: {
            count:[Number, String],
            max: {
                type: [Number, String],
                default: 99
            },
            scale:{
                type:Number,
                default:1
            },
            dot:{
                type:Boolean,
                default:false
            },
            className: String
        },
        data () {
            return {
            };
        },
        computed: {
            classes () {
                return `${badgePrefix}`;
            },
            badgeClasses () {
                return [
                    `${badgePrefix}-count`,
                    {
                        [`${this.className}`]: !!this.className
                    }
                ];
            },
            badgeStyles(){
                return {
                    'transform': ('translateX(50%) scale('+this.scale+')')
                }
            },
            showCount () {
                return (this.dot)?'':((isNaN(this.count))?this.count:(parseInt(this.count) >= parseInt(this.max) ? `${this.max}+` : this.count));
            },
            show () {
                if(this.count){
                    return !(parseInt(this.count) === 0);
                }
            }
        }, 
        methods: {
        },
        mounted() {
        }
    };
</script>
