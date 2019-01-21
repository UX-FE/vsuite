<template>
    <div :class="[datePrefix + '-confirm']">
        <span :class="timeClasses" v-if="showTime" @click="handleToggleTime">
            <template v-if="showDate">
                {{this.quickCompare ? this.originValue[0] + " - " + this.originValue[1] : this.selectValue}}
            </template>
            <!-- <template v-if="isTime">{{ t('i.datepicker.selectDate') }}</template>
            <template v-else>{{ t('i.datepicker.selectTime') }}</template> -->
        </span>
        <span :class="[datePrefix + '-confirm-compare-btn']" v-if="compare">
            <Checkbox v-model="isCompare" :disabled="quickCompare" @on-change="handleCompareDate">时间对比</Checkbox>
        </span>
        <span :class="compareTimeClasses" v-if="showTime&&isCompare" @click="handleToggleTime">
            <template v-if="showDate">
                {{!this.quickCompare ? this.compareSelectValue : this.selectValue}}
            </template>
        </span>
        <span :class="[datePrefix + '-confirm-tip']" v-if="showTip&&outRange">
            <template v-if="pikerType==='month'">
                最多可选择{{maxRangeMonth}}个自然月！已自动选择起始月份之{{selectOrderText}}的{{maxRangeMonth}}个自然月
            </template>
            <template v-else>
                最多可选择{{maxRangeDay}}天！已自动选择起始日期之{{selectOrderText}}的{{maxRangeDay}}天
            </template>
        </span>
        <span :class="[datePrefix + '-confirm-btn']">
        <BaseButton type="primary" @click.native="handleSuccess">{{ t('i.datepicker.ok') }}</BaseButton>
        <BaseButton @click.native="handleCancel">{{ t('i.datepicker.cancel') }}</BaseButton>
        </span>
    </div>
</template>
<script>
    import BaseButton from '../../button/button.vue';
    import Locale from '../../../mixins/locale';
    import { formatDate, parseDate,getDateRange } from '../util';
    import { prefix } from '../../var';
    const datePrefix = prefix+'date';

    //范围分隔符
    const RANGE_SEPARATOR = ' - ';
    const RANGE_FORMATTER = function(value, format) {
        if (Array.isArray(value) && value.length === 2) {
            const start = value[0];
            const end = value[1];

            if (start && end) {
                return formatDate(start, format) + RANGE_SEPARATOR + formatDate(end, format);
            }
        }
        return '';
    };

    export default {
        name:'Confirm',
        mixins: [ Locale ],
        components: { BaseButton },
        props: {
            minDate:'',
            maxDate:'',
            showTime: false,
            showDate: false,
            compare:false,
            quickCompare: false,
            originValue: {
                type: Array,
                default () {
                    return [];
                }
            },     
            pikerType:'',
            showTip:false,
            maxRangeDay:'',
            maxRangeMonth:'',
            order:'',
            maxRange:'',
            isTime: false,
            timeDisabled: false,
            outRange:false
        },
        data () {
            return {
                datePrefix: datePrefix,
                selectValue:'',
                compareSelectValue:'',
                isCompare:false,
            };
        },
        computed: {
            compareMinDate(){                
                const compareMinDate = new Date(this.minDate);
                compareMinDate.setTime(compareMinDate.getTime() - 3600 * 1000 * 24 * (1+getDateRange(this.minDate,this.maxDate)));                
                return compareMinDate;
            },
            compareMaxDate(){
                const compareMaxDate = new Date(this.minDate);
                compareMaxDate.setTime(compareMaxDate.getTime() - 3600 * 1000 * 24 * 1);
                return compareMaxDate;
            },
            selectOrderText(){
                //获取选择顺序的文字，从前往后选，返回后，从后往前选，返回前
                return (this.order==='straight')?'后':'前'
            },
            timeClasses () {
                return {
                    [`${datePrefix}-confirm-date`]: true,
                    [`${datePrefix}-confirm-time-disabled`]: this.timeDisabled
                };
            },
            compareTimeClasses(){
                return {
                    [`${datePrefix}-confirm-date`]: true,
                    [`${datePrefix}-confirm-time-disabled`]: this.timeDisabled,
                    [`${datePrefix}-confirm-date-compare`]: this.compare
                };
            }
        },
        watch:{
            minDate(val){
                this.getSelectValue();
            },
            maxDate(val){
                this.getSelectValue();
            },
            compareSelectValue(val){
                this.handleCompareDate();
            }
        },
        methods: {
            getSelectValue() {
                this.selectValue =  RANGE_FORMATTER([this.minDate,this.maxDate],'yyyy/MM/dd');
                if(this.compare){
                    this.getCompareSelectValue();
                }
            },
            getCompareSelectValue() {
                this.compareSelectValue =  RANGE_FORMATTER([this.compareMinDate,this.compareMaxDate],'yyyy/MM/dd');
            },
            handleClear () {
                this.$emit('on-pick-clear');
            },
            handleCancel(){
                this.$emit('on-pick-cancel');
            },
            handleSuccess () {
                this.$emit('on-pick-success');                
            },
            handleToggleTime () {
                // if (this.timeDisabled) return;
                // this.$emit('on-pick-toggle-time');
            },
            handleCompareDate(){
                this.$emit('on-pick-compare',this.isCompare,{
                    compareMinDate:this.compareMinDate,
                    compareMaxDate:this.compareMaxDate
                });
            }
        },
        mounted(){
            this.getSelectValue();
            // 如果是快速对比
            this.isCompare = this.quickCompare;            
        }
    };
</script>
