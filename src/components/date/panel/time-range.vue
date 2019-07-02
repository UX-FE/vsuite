<template>
    <div :class="classes" @mousedown.prevent>
        <div :class="[timePanelPrefix + '-body']">
            <div :class="[timePanelPrefix + '-content', timePanelPrefix + '-content-left']">
                <div :class="[timePrefix + '-header']">
                    <template v-if="showDate">{{ leftDatePanelLabel }}</template>
                    <template v-else>{{ t('i.datepicker.startTime') }}</template>
                </div>
                <time-spinner
                    ref="timeSpinner"
                    :steps="steps"
                    type="start"
                    :show-seconds="showSeconds"
                    :date="date"
                    :hours="hours"
                    :minutes="minutes"
                    :seconds="seconds"
                    :max-range-day="maxRangeDay"
                    :disabledOutRange="disabledOutRange"
                    :hide-disabled-options="hideDisabledOptions"
                    :firstClick ="firstClick"
                    :disabledHours ="disabledHours"
                    :disabledMinutes ="disabledMinutes"
                    :disabledSeconds ="disabledSeconds"
                    @on-change="handleStartChange"
                    @on-pick-click="handlePickClick"></time-spinner>
            </div>
            <div :class="[timePanelPrefix + '-content', timePanelPrefix + '-content-right']">
                <div :class="[timePrefix + '-header']">
                    <template v-if="showDate">{{ rightDatePanelLabel }}</template>
                    <template v-else>{{ t('i.datepicker.endTime') }}</template>
                </div>
                <time-spinner
                    ref="timeSpinnerEnd"
                    :steps="steps"
                    type="end"
                    :show-seconds="showSeconds"
                    :date="dateEnd"
                    :hours="hoursEnd"
                    :minutes="minutesEnd"
                    :seconds="secondsEnd"
                    :max-range-day="maxRangeDay"
                    :disabledOutRange="disabledOutRange"
                    :hide-disabled-options="hideDisabledOptions"
                    :firstClick ="firstClick"
                    :disabledHours ="disabledHoursEnd"
                    :disabledMinutes ="disabledMinutesEnd"
                    :disabledSeconds ="disabledSecondsEnd"
                    @on-change="handleEndChange"
                    @on-pick-click="handlePickClick"
                    ></time-spinner>
            </div>
            <Confirm
                v-if="confirm"
                @on-pick-clear="handlePickClear"
                @on-pick-success="handlePickSuccess"></Confirm>
        </div>
    </div>
</template>
<script>
    import TimeSpinner from '../base/time-spinner.vue';
    import Confirm from '../base/confirm.vue';

    import Mixin from './mixin';
    import Locale from '../../../mixins/locale';

    import { initTimeDate, toDate, formatDate, formatDateLabels } from '../util';

    import { prefix } from '../../var';
    const timePrefix = prefix+'time';
    const timePanelPrefix = prefix+'time-panel';


    export default {
        name: 'TimePicker',
        mixins: [ Mixin, Locale ],
        components: { TimeSpinner, Confirm },
        props: {
            minDate:'',
            maxDate:"",
            maxRangeDay:'',
            disabledOutRange:false,
            steps: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {
                timePanelPrefix: timePanelPrefix,
                timePrefix: timePrefix,
                format: 'HH:mm:ss',
                showDate: false,
                date: this.minDate,
                dateEnd:  this.maxDate,
                firstClick:'',
                value: '',
                hours: this.minDate.getHours(),
                minutes: this.minDate.getMinutes(),
                seconds: this.minDate.getSeconds(),
                hoursEnd: this.maxDate.getHours(),
                minutesEnd: this.maxDate.getMinutes(),
                secondsEnd: this.maxDate.getSeconds(),
                disabledHours: [],
                disabledMinutes: [],
                disabledSeconds: [],
                disabledHoursEnd: [],
                disabledMinutesEnd: [],
                disabledSecondsEnd: [],
                hideDisabledOptions: false,
                confirm: false
            };
        },
        computed: {
            classes () {
                return [
                    `${timePanelPrefix}-body-wrapper`,
                    `${timePrefix}-with-range`,
                    {
                        [`${timePrefix}-with-seconds`]: this.showSeconds
                    }
                ];
            },
            showSeconds () {
                return (this.format || '').indexOf('ss') !== -1;
            },
            leftDatePanelLabel () {
                return this.panelLabelConfig(this.date);
            },
            rightDatePanelLabel () {
                return this.panelLabelConfig(this.dateEnd);
            }
        },
        watch: {
            value (newVal) {
                if (!newVal) return;
                if (Array.isArray(newVal)) {
                    const valStart = newVal[0] ? toDate(newVal[0]) : false;
                    const valEnd = newVal[1] ? toDate(newVal[1]) : false;

                    if (valStart && valEnd) {
                        this.handleChange(
                            {
                                hours: valStart.getHours(),
                                minutes: valStart.getMinutes(),
                                seconds: valStart.getSeconds()
                            },
                            {
                                hours: valEnd.getHours(),
                                minutes: valEnd.getMinutes(),
                                seconds: valEnd.getSeconds()
                            },
                            false
                        );
                    }
                }
                this.resetDisabled();
            },
            firstClick(val){
                this.resetDisabled();
            }
        },
        methods: {
            resetDisabled(){
                if(this.disabledOutRange){
                    if(this.firstClick){
                        if(this.firstClick=='start'){
                            //鼠标先点击开始时间的时分秒，则根据可选范围重置结束时间的不可选状态
                            //最大可选时间
                            const maxDay = new Date((new Date(this.date)).getTime()+ 3600 * 1000 * 24 * (Number(this.maxRangeDay)));
                            //可看见的最大时间
                            const availableDate = new Date(this.dateEnd);
                            availableDate.setHours(23);
                            availableDate.setMinutes(59);
                            availableDate.setSeconds(59);

                            const maxHour = maxDay.getHours();
                            const maxMinute = maxDay.getMinutes();
                            const maxSecond = maxDay.getSeconds();

                            
                            //首先重置不可选的时分秒数组为空数组
                            this.disabledHoursEnd = []
                            this.disabledMinutesEnd = []
                            this.disabledSecondsEnd = []
                            
                            //最大可选日期小于当前可看见的范围，需要设置不可选状态
                            if(maxDay.getTime()<availableDate.getTime()){
                                //重新设置不可选小时数组，为当前可选的小时的下一个小时到23
                                for(let i = maxHour+1;i<=23;i++){
                                    this.disabledHoursEnd.push(i)
                                }
                                //如果当前选中的小时大于可选的最大小时，把当前选中的小时重置为可选的最大小时
                                if(this.hoursEnd>maxHour){
                                    this.hoursEnd = maxHour;
                                }
                                //如果当前选中的小时等于可选的最大小时，则分钟可能有部分为不可选状态
                                if(maxHour== this.hoursEnd){
                                    //此时重置不可选分钟数组，为当前可选的分钟的下一分钟到59
                                    for(let i = maxMinute+1;i<=59;i++){
                                        this.disabledMinutesEnd.push(i)
                                    }
                                    //这时如果选中的分钟大于可选的最大分钟，重置
                                    if(this.minutesEnd>maxMinute){
                                        this.minutesEnd = maxMinute;
                                    }
                                }
                                //当前的小时和分钟数都是可选的最大小时分钟时，秒可能有不可选状态
                                if(maxHour== this.hoursEnd&&maxMinute==this.minutesEnd){
                                    //重置不可选秒数组
                                    for(let i = maxSecond+1;i<=59;i++){
                                        this.disabledSecondsEnd.push(i)
                                    }
                                    //此时，当前选中秒大于可选的最大秒时，重置
                                    if(this.secondsEnd>maxSecond){
                                        this.secondsEnd = maxSecond;
                                    }
                                }
                                
                            }else if(this.date.getFullYear()==this.dateEnd.getFullYear()&&this.date.getMonth()==this.dateEnd.getMonth()&&this.date.getDay()==this.dateEnd.getDay()){
                                //如果是在同一天内，这里前提是最大选择宽度至少是一天，那么需要设置不可选时间
                                for(let i = 0;i<this.hours;i++){
                                    this.disabledHoursEnd.push(i)
                                }
                                if(this.hoursEnd<this.hours){
                                    this.hoursEnd = this.hours;
                                }
                                //如果当前选中的小时等于可选的最大小时，则分钟可能有部分为不可选状态
                                if(this.hours== this.hoursEnd){
                                    //此时重置不可选分钟数组，为当前可选的分钟的下一分钟到59
                                    for(let i = 0;i<this.minutes;i++){
                                        this.disabledMinutesEnd.push(i)
                                    }
                                    if(this.minutesEnd<this.minutes){
                                        this.minutesEnd = this.minutes;
                                    }
                                }
                                //当前的小时和分钟数都是可选的最大小时分钟时，秒可能有不可选状态
                                if(this.hours== this.hoursEnd&&this.minutes==this.minutesEnd){
                                    //重置不可选秒数组
                                    for(let i = 0;i<this.seconds;i++){
                                        this.disabledSecondsEnd.push(i)
                                    }
                                    if(this.secondsEnd<this.seconds){
                                        this.secondsEnd = this.seconds;
                                    }
                                }
                            }
                        }else{
                            //鼠标先点击结束时间的时分秒，根据可选范围重置开始时间时分秒的不可选范围
                            //最小可选时间
                            const minDay = new Date((new Date(this.dateEnd)).getTime()- 3600 * 1000 * 24 * (Number(this.maxRangeDay)));
                            //可看见的最小可选范围
                            const availableDate = new Date(this.date);
                            availableDate.setHours(0);
                            availableDate.setMinutes(0);
                            availableDate.setSeconds(0);
                            

                            const minHour = minDay.getHours();
                            const minMinute = minDay.getMinutes();
                            const minSecond = minDay.getSeconds();


                            
                            //当最小可选时间小于当前可触及的最小可选时间时
                            this.disabledHours = []
                            this.disabledMinutes = []
                            this.disabledSeconds = []
                            if(minDay.getTime()>availableDate.getTime()){
                                //重置不可选小时数组，从0到最小可选小时的前一小时
                                for(let i = 0;i<minHour;i++){
                                    this.disabledHours.push(i)
                                }
                                //当前小时小于最小可选小时时，重置
                                if(this.hours<minHour){
                                    this.hours = minHour;
                                }
                                //当前小时为最小可选小时时，分钟可能有不可选状态
                                if(minHour== this.hours){
                                    //重置不可选分钟
                                    for(let i = 0;i<minMinute;i++){
                                        this.disabledMinutes.push(i)
                                    }
                                    //此时，当前选中分钟小于最小可选分钟时，重置
                                    if(this.minutes<minMinute){
                                        this.minutes = minMinute;
                                    }
                                }
                                //当前选中小时分钟为最小可选小时分钟，秒可能有不可选状态
                                if(minHour== this.hours&&minMinute==this.minutes){
                                    //重置秒的不可选状态
                                    for(let i = 0;i<minSecond;i++){
                                        this.disabledSeconds.push(i)
                                    }
                                    //此时，当选中秒小于最小可选秒时，重置
                                    if(this.seconds<minSecond){
                                        this.seconds = minSecond;
                                    }
                                }
                            }else if(this.date.getFullYear()==this.dateEnd.getFullYear()&&this.date.getMonth()==this.dateEnd.getMonth()&&this.date.getDay()==this.dateEnd.getDay()){
                                //如果是在同一天内，这里前提是最大选择宽度至少是一天，那么需要设置不可选时间
                                for(let i = this.hoursEnd+1;i<=23;i++){
                                    this.disabledHours.push(i)
                                }
                                if(this.hours>this.hoursEnd){
                                    this.hours = this.hoursEnd;
                                }
                                //如果当前选中的小时等于可选的最大小时，则分钟可能有部分为不可选状态
                                if(this.hours== this.hoursEnd){
                                    //此时重置不可选分钟数组，为当前可选的分钟的下一分钟到59
                                    for(let i = this.minutesEnd+1;i<=59;i++){
                                        this.disabledMinutes.push(i)
                                    }
                                    if(this.minutes>this.minutesEnd){
                                        this.minutes = this.minutesEnd;
                                    }
                                }
                                //当前的小时和分钟数都是可选的最大小时分钟时，秒可能有不可选状态
                                 if(this.hours== this.hoursEnd&&this.minutes==this.minutesEnd){
                                    //重置不可选秒数组
                                    for(let i = this.secondsEnd+1;i<=59;i++){
                                        this.disabledSeconds.push(i)
                                    }
                                    if(this.seconds>this.secondsEnd){
                                        this.seconds = this.secondsEnd;
                                    }
                                }
                            }

                        }
                    }
                }

            },
            panelLabelConfig (date) {
                const locale = this.t('i.locale');
                const datePanelLabel = this.t('i.datepicker.datePanelLabel');
                const { labels, separator } = formatDateLabels(locale, datePanelLabel, date || initTimeDate());
                return [labels[0].label, separator, labels[1].label,date.getDate(),'日'].join('');
            },
            handleClear() {
                this.date = clearHours(new Date(this.minDate));
                this.dateEnd = clearHours(new Date(this.maxDate));
                this.hours = this.date.getHours();
                this.minutes = this.date.getMinutes();
                this.seconds = this.date.getSeconds();
                this.hoursEnd = this.dateEnd.getHours();
                this.minutesEnd = this.dateEnd.getMinutes();
                this.secondsEnd = this.dateEnd.getSeconds();
            },
            handleChange (date, dateEnd, emit = true) {
                const oldDateEnd = new Date(this.dateEnd);

                if (date.hours !== undefined) {
                    this.date.setHours(date.hours);
                    this.hours = this.date.getHours();
                }
                if (date.minutes !== undefined) {
                    this.date.setMinutes(date.minutes);
                    this.minutes = this.date.getMinutes();
                }
                if (date.seconds !== undefined) {
                    this.date.setSeconds(date.seconds);
                    this.seconds = this.date.getSeconds();
                }
                if (dateEnd.hours !== undefined) {
                    this.dateEnd.setHours(dateEnd.hours);
                    this.hoursEnd = this.dateEnd.getHours();
                }
                if (dateEnd.minutes !== undefined) {
                    this.dateEnd.setMinutes(dateEnd.minutes);
                    this.minutesEnd = this.dateEnd.getMinutes();
                }
                if (dateEnd.seconds !== undefined) {
                    this.dateEnd.setSeconds(dateEnd.seconds);
                    this.secondsEnd = this.dateEnd.getSeconds();
                }
                //判断结束时间是否小于开始时间，否则重置结束时间等于开始时间
                if(this.dateEnd.getTime()<this.date.getTime()){
                    this.dateEnd.setTime(this.date.getTime())
                }
                // judge endTime > startTime?
                // if (this.dateEnd < this.date) {
                //     this.$nextTick(() => {
                //         this.dateEnd = new Date(this.date);
                //         this.hoursEnd = this.dateEnd.getHours();
                //         this.minutesEnd = this.dateEnd.getMinutes();
                //         this.secondsEnd = this.dateEnd.getSeconds();

                //         const format = 'yyyy-MM-dd HH:mm:ss';
                //         if (formatDate(oldDateEnd, format) !== formatDate(this.dateEnd, format)) {
                //             if (emit) this.$emit('on-pick', [this.date, this.dateEnd], true);
                //         }
                //     });
                // } else {
                this.resetDisabled()
                    this.date.setHours(this.hours);
                    this.date.setMinutes(this.minutes);
                    this.date.setSeconds(this.seconds);
                    this.dateEnd.setHours(this.hoursEnd);
                    this.dateEnd.setMinutes(this.minutesEnd);
                    this.dateEnd.setSeconds(this.secondsEnd);
                    if (emit) this.$emit('on-pick', [this.date, this.dateEnd], true);
                // }

            },
            handleStartChange (date) {
                this.firstClick = (this.firstClick)?this.firstClick:'start'
                this.handleChange(date, {});
            },
            handleEndChange (date) {
                this.firstClick = (this.firstClick)?this.firstClick:'end'
                this.handleChange({}, date);
            },
            updateScroll () {
                this.$refs.timeSpinner.updateScroll();
                this.$refs.timeSpinnerEnd.updateScroll();
            }
        },
        mounted () {
            if (this.$parent && this.$parent.$options.name === 'DatePicker') this.showDate = true;
            if(this.dateEnd.getTime()<this.date.getTime()){
                this.dateEnd.setTime(this.date.getTime());
                this.hoursEnd=this.date.getHours();
                this.minutesEnd= this.date.getMinutes();
                this.secondsEnd= this.date.getSeconds();
                this.$emit('on-pick', [this.date, this.dateEnd], true);
            }
        }
    };
</script>
