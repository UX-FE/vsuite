<template>
    <div :class="wrapClasses">
        <template v-if="type&&type==='circle'">
            <div :style="circleStyles">
                <svg :viewBox="circleBox">
                    <defs>
                        <linearGradient x1="1" y1="0" x2="0" y2="0" id="gradient1">
                            <stop offset="0%" :stop-color="gradient[0][0]"></stop>
                            <stop offset="100%" :stop-color="gradient[0][1]"></stop>
                        </linearGradient>
                        <linearGradient x1="1" y1="0" x2="0" y2="0" id="gradient2">
                            <stop offset="0%" :stop-color="gradient[1][0]"></stop>
                            <stop offset="100%" :stop-color="gradient[1][1]"></stop>
                        </linearGradient>
                    </defs>
                    <g>
                        <circle :cx="circlec" :cy="circlec" :r="radius" stroke-linecap="round" :stroke-width="currentBackWidth" :stroke="backColor" fill="none"></circle>
                        <circle :cx="circlec" :cy="circlec" :r="radius" :stroke-linecap="(!!strokeLinecap)?strokeLinecap:((percent!==0)?'round':'butt')" :stroke-width="strokeWidth" :stroke="circleColor" fill="none" :transform="'matrix(0,-1,1,0,0,'+size+')'" :stroke-dasharray="dashArray"></circle>


                        <!-- <circle :cx="circlec" :cy="circlec" :r="radius" :stroke-width="currentBackWidth" :stroke="backColor" fill="none" :stroke-dasharray="backDashArray"></circle>
                        <circle :cx="circlec" :cy="circlec" :r="radius" :stroke-width="strokeWidth" stroke="url('#gradient1')" fill="none" :stroke-dasharray="backDashArray"></circle>
                        <circle :cx="circlec" :cy="circlec" :r="radius" :stroke-linecap="(!!strokeLinecap)?strokeLinecap:((percent!==0)?'round':'butt')" :stroke-width="strokeWidth" stroke="url('#gradient2')" fill="none" :stroke-dasharray="dashArray"></circle> -->
                        <!-- <circle :cx="circlec" cy="220" r="170" stroke-width="50" stroke="#f0f1f5" fill="none" stroke-dasharray="1069 1069"></circle>
                        <circle :cx="circlec" cy="220" r="170" stroke-width="50" stroke="url('#gradient1')" fill="none" stroke-dasharray="1069 1069"></circle>
                        <circle :cx="circlec" cy="220" r="170" stroke-width="50" stroke="url('#gradient2')" fill="none" stroke-dasharray="534.5 1069"></circle> -->
                    </g>
                </svg>
                <!-- <svg :viewBox="circleBox">
                    <defs>
                        <linearGradient x1="1" y1="0" x2="0" y2="0" id="gradient1">
                            <stop offset="0%" stop-color="#e52c5c"></stop>
                            <stop offset="100%" stop-color="#ab5aea"></stop>
                        </linearGradient>
                    <linearGradient x1="1" y1="0" x2="0" y2="0" id="gradient2">
                            <stop offset="0%" stop-color="#4352f3"></stop>
                            <stop offset="100%" stop-color="#ab5aea"></stop>
                        </linearGradient>
                    </defs>
                    <circle :cx="circlec" :cy="circlec" :r="radius" stroke-linecap="round" :stroke-width="currentBackWidth" stroke="#D1D3D7" fill="none"></circle>
                    <circle :cx="circlec" :cy="circlec" :r="radius" :stroke-linecap="(!!strokeLinecap)?strokeLinecap:((percent!==0)?'round':'butt')" :stroke-width="strokeWidth" stroke="#00A5E0" fill="none" :transform="'matrix(0,-1,1,0,0,'+size+')'" :stroke-dasharray="dashArray"></circle>
                </svg> -->
            </div>
            <div class="circle-text"><slot>{{ percent }}%</slot></div>
        </template>
        <template v-else>
            <div :class="outerClasses">
                <div :class="barWrapClasses" >
                    <div :class="barClasses" :style="barStyle" ref="bar">
                        <slot>
                            <span ref="innertext" v-if="!hidetext&&!!textinside" :class="innertextClasses" :style="innerTextStyle">{{ percent }}%</span>
                        </slot>
                    </div>
                </div>
            </div>
            <div v-if="!hidetext&&!textinside" :class="textClasses">
                <slot name="text">
                    <template v-if="!!status&&(status!=='normal'&&status!=='active')">
                        <Icon v-if="status==='error'" type="ios-close" class="error-icon"></Icon>
                        <Icon v-if="status==='success'" type="ios-checkmark" class="success-icon"></Icon>
                    </template>
                    <template v-else>
                        {{ percent }}%
                    </template>
                </slot>
            </div>
        </template>
    </div>
</template>
<script>
    import { oneOf } from '../../utils/assist';
    import { on, off } from '../../utils/dom';
    import Icon from '../icon';

    import { prefix } from '../var';
    const progressPrefix = prefix+'progress';

    export default {
        name: 'Progress',
        props: {
            type:{
                type:String,
                validator (value) {
                    return oneOf(value, ['default','strip', 'circle']);
                },
                default:'default'
            },
            status:{
                type:String,
                validator (value) {
                    return oneOf(value, ['normal', 'active','error', 'success']);
                }
            },
            color:String,
            strokeWidth:{
                type:[Number,String],
                default:22
            },
            strokeLinecap:{
                type:String,
                validator (value) {
                    return oneOf(value, ['butt','round']);
                },
                default:'butt'
            },
            backWidth:{
                type:[Number,String],
                default:22
            },
            gradient:{
                type:Array,
                default(){
                    return [
                        ['#4b61d9','#4b61d9'],['#4b61d9','#4b61d9']
                    ];
                }
            },
            size:{
                type:[Number,String],
                default:200
            },
            vertical:{
                type:Boolean,
                default:false
            },
            percent: {
                type: Number,
                default: 0
            },
            textinside:{
                type:Boolean,
                default:false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            hidetext:Boolean,
            radius:{
                type:[Number,String],
                default:80
            },
            backColor:{
                type:String,
                default:'#EBEFF1'
            }
        },
        components:{
            'Icon':Icon
        },
        data () {
            return {
                circleColor:(!!this.color)?this.color:'#1864FF',
                innerTextStyle:{
                    'margin-left':'6px',
                    'color':'#fff'
                }
            };
        },
        computed: {
            wrapClasses () {
                return [
                    `${progressPrefix}`,
                    {
                        [`${progressPrefix}-${this.type}`]: !!this.type,
                        [`${progressPrefix}-${this.status}`]: !!this.status,
                        [`${progressPrefix}-vertical`]: !!this.vertical,
                        [`${progressPrefix}-disabled`]: this.disabled,
                        [`${progressPrefix}-hidetext`]: !!this.hidetext

                    }
                ];
            },
            outerClasses () {
                return `${progressPrefix}-outer`;
            },
            barWrapClasses(){
                return `${progressPrefix}-bar-wrap`;
            },
            barClasses(){
                return `${progressPrefix}-bar`;
            },
            barStyle () {
                return (this.vertical)?{
                    height: `${this.percent}%`,
                    width: `${this.strokeWidth}px`,
                    backgroundColor: (!!this.color)?`${this.color}`:'null',
                }:{
                    width: `${this.percent}%`,
                    height: `${this.strokeWidth}px`,
                    backgroundColor: (!!this.color)?`${this.color}`:'null',
                }
            },
            innertextClasses(){
                return `${progressPrefix}-inner-text`;
            },
            textClasses(){
                return `${progressPrefix}-text`;
            },
            circleStyles(){
                return {
                    width:this.size+'px',
                    height:this.size+'px'
                }
            },
            circleBox(){
                return "0 0 "+this.size+" "+this.size;
            },
            dashArray(){
                const line = 2*Math.PI*this.radius;
                return this.percent/100*line+" "+line;
            },
            backDashArray(){
                const line = 2*Math.PI*this.radius;
                return line+" "+line;
            },
            circlec(){
                
                return this.size/2;
            },
            // circleTrans(){
            //     return matrix(0,-1,1,0,0,"+this.size+");
            // },
            currentBackWidth(){
                return (!!this.backWidth)?this.backWidth:this.strokeWidth;
            }
        },
        methods: {
            getInnerTextStyle(){
                if(this.vertical){
                    return;
                }
                if(this.textinside&&this.$refs.bar&&this.$refs.innertext){
                    var barWidth = this.$refs.bar.offsetWidth;
                    var innerTextWidth = this.$refs.innertext.offsetWidth;
                    if((innerTextWidth+12)>barWidth){
                        this.innerTextStyle = {
                            'margin-left':((barWidth+6)+'px'),
                            'color':'initial'
                        }
                    }else{
                        this.innerTextStyle = {
                            'margin-left':'6px',
                            'color':'#fff'
                        }

                    }
                }
            }
        },
        watch: {
            color(val){
                this.circleColor = this.color;
            }
        },
        mounted(){
            this.getInnerTextStyle();
            on(window, 'resize', this.getInnerTextStyle);
        },
        beforeDestroy () {
            off(window, 'resize', this.handleScroll);
        },
    };
</script>
