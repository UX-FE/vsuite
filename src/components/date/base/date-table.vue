<template>
    <div
        :class="classes"
        >
        <div :class="[datePrefix + '-header']">
            <span v-for="day in headerDays" :key="day">
                {{day}}
            </span>
        </div>
        <div v-for="rowIndex in Math.ceil(readCells.length/7)" :key="rowIndex" :class="[datePrefix + '-row']">
            <template  v-for="(cell, index) in readCells" >
                <span :class="getCellCls(cell)" :key="rowIndex+index" v-if="((index>=(rowIndex-1)*7)&&(index<=((rowIndex-1)*7+6)))">
                    <span>
                        <em :index="index" @click="handleClick(cell)">{{ cell.text }}</em>
                    </span>
                </span>
            </template>
        </div>
    </div>
</template>
<script>
    import { getFirstDayOfMonth, getDayCountOfMonth,getDateRange } from '../util';
    import { deepCopy } from '../../../utils/assist';
    import Locale from '../../../mixins/locale';
    import { prefix } from '../../var';
    const datePrefix = prefix+'date-cells';

    const clearHours = function (time) {
        const cloneDate = new Date(time);
        cloneDate.setHours(0, 0, 0, 0);
        return cloneDate.getTime();
    };

    export default {
        mixins: [ Locale ],
        props: {
            date: {},
            year: {},
            month: {},
            selectionMode: {
                default: 'day'
            },
            disabledDate: {},
            minDate: {},
            maxDate: {},
            singleDate:false,
            quickCompare: false,
            originValue: {
                type: Array,
                default () {
                    return [];
                }
            },  
            type:false,
            confirm:false,
            disabledFuction:'',
            curClickDate:'',
            disabledOutRange:false,
            maxRangeHour:'',
            maxRangeDay:'',
            handleDate:{},
            rangeState: {
                default () {
                    return {
                        endDate: null,
                        selecting: false
                    };
                }
            },
            value: ''
        },
        data () {
            return {
                datePrefix: datePrefix,
                handleDateType:this.handleDate,
                readCells: [],
                hours: (this.handleDateType==='end')?((this.minDate)?this.minDate.getHours():0):0,
                minutes: (this.handleDateType==='end')?((this.minDate)?this.minDate.getMinutes():0):0,
                seconds: (this.handleDateType==='end')?((this.minDate)?this.minDate.getSeconds():0):0,
                hoursEnd: (this.handleDateType==='end')?((this.maxDate)?this.maxDate.getHours():23):23,
                minutesEnd: (this.handleDateType==='end')?((this.maxDate)?this.maxDate.getMinutes():59):59,
                secondsEnd: (this.handleDateType==='end')?((this.maxDate)?this.maxDate.getSeconds():59):59,
                isSingle:this.singleDate,
                rangeDisabledDate:this.disabledFuction,
                curDate:this.curClickDate
            };
        },
        watch: {
            singleDate(val){
                this.isSingle = val;
            },
            handleDate(val){
                this.handleDateType = this.handleDate;
            },
            'rangeState.endDate' (newVal) {
                this.markRange(newVal);
            },
            minDate(newVal, oldVal) {
                if (newVal && !oldVal) {
                    this.rangeState.selecting = true;
                    this.markRange(newVal);
                } else if (!newVal) {
                    this.rangeState.selecting = false;
                    this.markRange(newVal);
                } else {
                    this.markRange();
                }
                this.hours= (this.handleDateType==='end')?((newVal)?newVal.getHours():0):0;
                this.minutes= (this.handleDateType==='end')?((newVal)?newVal.getMinutes():0):0;
                this.seconds=(this.handleDateType==='end')?((newVal)?newVal.getSeconds():0):0;
            },
            maxDate(newVal, oldVal) {
                if (newVal && !oldVal) {
                    this.rangeState.selecting = false;
                    this.markRange(newVal);
//                    this.$emit('on-pick', {
//                        minDate: this.minDate,
//                        maxDate: this.maxDate
//                    });
                }
                this.hoursEnd= (this.handleDateType==='end')?((newVal)?newVal.getHours():23):23;
                this.minutesEnd= (this.handleDateType==='end')?((newVal)?newVal.getMinutes():59):59;
                this.secondsEnd=(this.handleDateType==='end')?((newVal)?newVal.getSeconds():59):59;
            },
            cells: {
                handler (cells) {
                    this.readCells = cells;
                },
                immediate: true
            },
            disabledFuction:{
                handler(val){
                    this.rangeDisabledDate= val;

                },
                deep:true
            },
            curClickDate:{
                handler(val){
                    this.curDate = val
                },
                deep:true
            }
        },
        computed: {
            classes () {
                return [
                    `${datePrefix}`
                ];
            },
            headerDays () {
                const weekStartDay = Number(this.t('i.datepicker.weekStartDay'));
                const translatedDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map(item => {
                    return this.t('i.datepicker.weeks.' + item);
                });
                const weekDays = translatedDays.splice(weekStartDay, 7 - weekStartDay).concat(translatedDays.splice(0, weekStartDay));
                return weekDays;
            },
            cells () {
                const date = new Date(this.year, this.month, 1);
                const weekStartDay = Number(this.t('i.datepicker.weekStartDay'));
                const day = (getFirstDayOfMonth(date) || 7) - weekStartDay; // day of first day
                const today = clearHours(new Date());    // timestamp of today
                const selectDay = clearHours(new Date(this.value));    // timestamp of selected day
                const minDay = clearHours(new Date(this.minDate));
                const maxDay = clearHours(new Date(this.maxDate));

                const dateCountOfMonth = getDayCountOfMonth(date.getFullYear(), date.getMonth());
                const dateCountOfLastMonth = getDayCountOfMonth(date.getFullYear(), (date.getMonth() === 0 ? 11 : date.getMonth() - 1));

                const disabledDate = this.disabledDate;

                let cells = [];
                const cell_tmpl = {
                    text: '',
                    type: '',
                    date: null,
                    selected: false,
                    disabled: false,
                    range: false,
                    start: false,
                    end: false
                };
                if (day !== 7) {
                    for (let i = 0; i < day; i++) {
                        const cell = deepCopy(cell_tmpl);
                        cell.type = 'prev-month';
                        cell.text = dateCountOfLastMonth - (day - 1) + i;
                        cell.date = new Date(this.year, this.month - 1, cell.text);
                        const time = clearHours(cell.date);
                        // cell.disabled = (typeof disabledDate === 'function' && disabledDate(new Date(time)));
                        cell.disabled = true;
                        cells.push(cell);
                    }
                }
                for (let i = 1; i <= dateCountOfMonth; i++) {
                    const cell = deepCopy(cell_tmpl);
                    cell.text = (i<10)?("0"+i):i;
                    cell.date = new Date(this.year, this.month, cell.text);
                    const time = clearHours(cell.date);
                    cell.type = time === today ? 'today' : 'normal';
                    cell.selected = time === selectDay;
                    cell.disabled = (typeof disabledDate === 'function' && disabledDate(new Date(time)))||(typeof this.rangeDisabledDate === 'function' && this.rangeDisabledDate(new Date(time))) ;
                    cell.range = time >= minDay && time <= maxDay;
                    cell.start = this.minDate && time === minDay;
                    cell.end = this.maxDate && time === maxDay;

                    cells.push(cell);
                }

                const nextMonthCount = 42 - cells.length;
                for (let i = 1; i <= nextMonthCount; i++) {
                    const cell = deepCopy(cell_tmpl);
                    cell.type = 'next-month';
                    cell.text =  (i<10)?("0"+i):i;
                    cell.date = new Date(this.year, this.month + 1, cell.text);
                    const time = clearHours(cell.date);
                    // cell.disabled = typeof disabledDate === 'function' && disabledDate(new Date(time));
                    cell.disabled = true;
                    cells.push(cell);
                }

                return cells;
            }
        },
        methods: {
            handleClick (cell) {
                
                if (cell.disabled) return;
                const newDate = cell.date;
                this.curDate= cell.date;
                //如果是快速对比
                if(this.quickCompare) {
                    const minDate = new Date(newDate.getTime());
                    const maxDate = new Date(newDate.getTime());
                    const originMinDate = new Date(this.originValue[0]);
                    const originMaxDate = new Date(this.originValue[1]);
                    minDate.setTime(minDate.getTime() - 3600 * 1000 * 24 * ( getDateRange(originMinDate,originMaxDate)));                
                    this.$emit('on-pick', {minDate, maxDate}, false,'start','straight',false);
                    return;
                }
                //正常选择
                if (this.selectionMode === 'range') {
                    if(this.isSingle){
                        const minDate = new Date(newDate.getTime());
                        const maxDate = new Date(newDate.getTime());
                        this.$emit('on-pick', {minDate, maxDate}, false,'start','straight',false);
                    }else{
                        if(this.handleDateType==='start'){
                            const minDate = new Date(newDate.getTime());
                            const maxDate = new Date(newDate.getTime());
                            this.rangeState.selecting = true;
                            this.markRange(this.minDate);
                            if(this.disabledOutRange&&this.maxRangeDay){
                                this.markDisabled(newDate);
                                this.$emit('on-change-diaFuc',this.rangeDisabledDate,this.curDate)
                            }
                            if(this.type=='datetimerange'){
                                minDate.setHours(this.hours);
                                minDate.setMinutes(this.minutes);
                                minDate.setSeconds(this.seconds);
                                maxDate.setHours(this.hoursEnd);
                                maxDate.setMinutes(this.minutesEnd);
                                maxDate.setSeconds(this.secondsEnd);
                            }
                            this.$emit('on-pick', {minDate, maxDate}, false,'end');
                        }else{
                            if (newDate >= this.minDate) {//从前往后选
                                const minDate = new Date(this.minDate.getTime());
                                const maxDate = new Date(newDate.getTime());
                                this.rangeState.selecting = false;
                                let isOutRange = false;
                                
                                if(this.type=='datetimerange'){
                                    minDate.setHours(this.hours);
                                    minDate.setMinutes(this.minutes);
                                    minDate.setSeconds(this.seconds);
                                    maxDate.setHours(this.hoursEnd);
                                    maxDate.setMinutes(this.minutesEnd);
                                    maxDate.setSeconds(this.secondsEnd);
                                }
                                if(!!this.maxRangeDay&&(getDateRange(minDate,maxDate)>this.maxRangeDay)){
                                    isOutRange = true;
                                    maxDate.setTime(minDate.getTime() + 3600 * 1000 * 24 * (Number(this.maxRangeDay)));
                                }
                                this.$emit('on-pick', {minDate, maxDate},this.confirm?false:true,'start','straight',isOutRange);
                            } else {//从后往前选
                                const minDate = new Date(newDate.getTime());
                                const maxDate = new Date(this.maxDate.getTime());
                                this.rangeState.selecting = false;
                                let isOutRange = false;   
                                if(this.type=='datetimerange'){
                                    minDate.setHours(this.hours);
                                    minDate.setMinutes(this.minutes);
                                    minDate.setSeconds(this.seconds);
                                    maxDate.setHours(this.hoursEnd);
                                    maxDate.setMinutes(this.minutesEnd);
                                    maxDate.setSeconds(this.secondsEnd);
                                }
                                if(!!this.maxRangeDay&&(getDateRange(minDate,maxDate)>this.maxRangeDay)){
                                    isOutRange = true;
                                    minDate.setTime(maxDate.getTime() - 3600 * 1000 * 24 * (Number(this.maxRangeDay)));
                                }
                                this.$emit('on-pick', {minDate, maxDate}, this.confirm?false:true,'start','reverse',isOutRange);
                            }

                            this.rangeDisabledDate = '';
                            this.$emit('on-change-diaFuc',this.rangeDisabledDate,'')

                        }
                    }
                } else {
                    this.$emit('on-pick', newDate);
                }
                this.$emit('on-pick-click');
            },
//             handleMouseMove (event) {
//                 if (!this.rangeState.selecting) return;

//                 this.$emit('on-changerange', {
//                     minDate: this.minDate,
//                     maxDate: this.maxDate,
//                     rangeState: this.rangeState
//                 });

//                 const target = event.target;
//                 if (target.tagName === 'EM') {
//                     const cell = this.cells[parseInt(event.target.getAttribute('index'))];
// //                    if (cell.disabled) return;    // todo 待确定
//                     this.rangeState.endDate = cell.date;
//                 }
//             },
            markRange (maxDate) {
                const minDate = this.minDate;
                if (!maxDate) maxDate = this.maxDate;

                const minDay = clearHours(new Date(minDate));
                const maxDay = clearHours(new Date(maxDate));

                this.cells.forEach(cell => {
                    if (cell.type === 'today' || cell.type === 'normal') {
                        const time = clearHours(new Date(this.year, this.month, cell.text));
                        cell.range = time >= minDay && time <= maxDay;
                        cell.start = minDate && time === minDay;
                        cell.end = maxDate && time === maxDay;
                    }
                });
            },
            markDisabled(){
                this.rangeDisabledDate = function(date){
                    const minDay = clearHours(new Date(this.curDate))- 3600 * 1000 * 24 * (Number(this.maxRangeDay));
                    const maxDay = clearHours(new Date(this.curDate))+ 3600 * 1000 * 24 * (Number(this.maxRangeDay));
                     const time = clearHours(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
                     return  time < minDay || time > maxDay
                };
            },
            getCellCls (cell) {
                return [
                    `${datePrefix}-cell`,
                    {
                        [`${datePrefix}-cell-selected`]: cell.selected || cell.start || cell.end,
                        [`${datePrefix}-cell-selected-start`]: cell.start,
                        [`${datePrefix}-cell-selected-end`]: cell.end,
                        [`${datePrefix}-cell-disabled`]: cell.disabled,
                        [`${datePrefix}-cell-today`]: cell.type === 'today',
                        [`${datePrefix}-cell-prev-month`]: cell.type === 'prev-month',
                        [`${datePrefix}-cell-next-month`]: cell.type === 'next-month',
                        [`${datePrefix}-cell-range`]: cell.range && !cell.start && !cell.end
                    }
                ];
            },

        },
        mounted(){
        }

    };
</script>
