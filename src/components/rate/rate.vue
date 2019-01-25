<template>
    <div :class="classes" @mouseleave="handleMouseleave">
        <input type="hidden" :name="name" :value="currentValue">
        <div v-for="i in full" :key="i" :class="starClassed(i)" @mousemove="MousemoveStar(i, $event)" @click="clickStar(i)">
            <Icon :type="iconType[0]" :size="size" :color="getIconColor(i)"></Icon>
            <span :class="[prefix + '-star-content']" ishalf="half">
                <Icon :type="iconType[1]" :size="size" ishalf="half" :color="getIconColor(i)"></Icon>
            </span>
        </div>
        <div :class="[prefix + '-score']" v-if="!!showText" v-show="currentValue > 0">
            <slot>
                <template v-if="typeof(showText)==='boolean'">
                    <span>{{ currentValue }}</span> <span v-if="currentValue <= 1">{{ t('i.rate.star') }}</span><span v-else>{{ t('i.rate.stars') }}</span>
                </template>
                <template v-else>
                    {{rateText()}}
                </template>
            </slot>
        </div>
    </div>
</template>
<script>
    import Icon from '../icon'
    import Locale from '../../mixins/locale';
    import Emitter from '../../mixins/emitter';
    import { prefix } from '../var';
    const ratePrefix = prefix+'rate';

    export default {
        name: 'Rate',
        mixins: [ Locale, Emitter ],
        props: {
            full: {
                type: Number,
                default: 5
            },
            color:{
                type:String
            },
            value: {
                type: Number,
                default: 0
            },
            size:{
                type:[String,Number],
                default:24
            },
            allowHalf: {
                type: Boolean,
                default: false
            },
            rank:{
                type:Array
            },
            colors:{
                type:Array
            },
            iconType:{
                type:[Array],
                default(){
                    return ['android-star','android-star-half']
                }
            },
            disabled: {
                type: Boolean,
                default: false
            },
            showText: {
                type: [Boolean,Array],
                default: false
            },
            name: {
                type: String
            }
        },
        data () {
            return {
                prefix: ratePrefix,
                hoverIndex: -1,
                isHover: false,
                isHalf: this.allowHalf && this.value.toString().indexOf('.') >= 0,
                currentValue: this.value
            };
        },
        computed: {
            classes () {
                return [
                    `${ratePrefix}`,
                    {
                        [`${ratePrefix}-disabled`]: this.disabled
                    }
                ];
            }
        },
        watch: {
            value (val) {
                this.currentValue = val;
            },
            currentValue (val) {
                this.setHalf(val);
            }
        },
        methods: {
            starClassed (value) {
                const hoverIndex = this.hoverIndex;
                const currentIndex = this.isHover ? hoverIndex : this.currentValue;

                let full = false;
                let isLast = false;

                if (currentIndex >= value) full = true;

                if (this.isHover) {
                    isLast = currentIndex === value;
                } else {
                    isLast = Math.ceil(this.currentValue) === value;
                }

                return [
                    `${ratePrefix}-star`,
                    {
                        [`${ratePrefix}-star-full`]: (!isLast && full) || (isLast && !this.isHalf),
                        [`${ratePrefix}-star-half`]: isLast && this.isHalf,
                        [`${ratePrefix}-star-zero`]: !full
                    }
                ];
            },
            getIconColor(value){
                let colors = (!!this.colors)?this.colors:((!!this.color)?[this.color,this.color,this.color]:'')
                if(colors){
                    return this.iconColor(value,colors);
                }
            },
            iconColor(value,colors){
                const hoverIndex = this.hoverIndex;
                const currentIndex = this.isHover ? hoverIndex : this.currentValue;

                let full = false;
                let isLast = false;

                if (currentIndex >= value) full = true;

                if (this.isHover) {
                    isLast = currentIndex === value;
                } else {
                    isLast = Math.ceil(this.currentValue) === value;
                }
                if((!isLast && full) || (isLast && !this.isHalf) || isLast && this.isHalf){
                    if(currentIndex<this.full*((!!this.rank&&!isNaN(this.rank[0]))?this.rank[0]:0.5)){
                        return colors[0];
                    }else if(currentIndex>this.full*((!!this.rank&&!isNaN(this.rank[1]))?this.rank[1]:0.6)){
                        return colors[2];
                    }else{
                        return colors[1];
                    }
                }
            },
            rateText(){
                if(this.currentValue<=this.full*0.2){
                    return this.showText[0];
                }else if(this.currentValue<=this.full*0.4){
                    return this.showText[1];
                }else if(this.currentValue<=this.full*0.6){
                    return this.showText[2];
                }else if(this.currentValue<=this.full*0.8){
                    return this.showText[3];
                }else{
                    return this.showText[4];
                }
            },
            MousemoveStar(value, event) {
                if (this.disabled) return;

                this.isHover = true;
                if (this.allowHalf) {
                    const type = event.target.getAttribute('ishalf') || false;
                    this.isHalf = type === 'half';
                } else {
                    this.isHalf = false;
                }
                this.hoverIndex = value;
            },
            handleMouseleave () {
                if (this.disabled) return;

                this.isHover = false;
                this.setHalf(this.currentValue);
                this.hoverIndex = -1;
            },
            setHalf (val) {
                this.isHalf = this.allowHalf && val.toString().indexOf('.') >= 0;
            },
            clickStar (value) {
                if (this.disabled) return;
                if (this.isHalf) value -= 0.5;
                this.currentValue = value;
                this.$emit('input', value);
                this.$emit('on-change', value);
                this.dispatch('FormItem', 'on-form-change', value);
            }
        }
    };
</script>
