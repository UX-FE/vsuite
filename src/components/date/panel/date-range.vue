<template>
    <div :class="classes" @mousedown.prevent>
        <div :class="[datePanelPrefix + '-pikerbar']" v-if="pikerType">
             <RadioGroup v-model="pikerType" type="button" @on-change="handleChangePikerType">
                <Radio label="custom">自定义时间段</Radio>
                <Radio label="month" :disabled="singleDate || quickCompare">按自然月选择</Radio>
            </RadioGroup>
        </div>
        <!-- <div> -->
            <div :class="[datePanelPrefix + '-sidebar']" v-if="shortcuts.length">
                <div
                    v-for="(shortcut,i) in shortcuts" :key="i"
                    :class="[
                    (datePanelPrefix + '-shortcut'),
                    {
                        'active':(curShortIndex===i),
                        'disabled':shortcut.disabled||(pikerType==='month')||(singleDate&&i>1) ||quickCompare
                    }
                    ]"
                    @click="handleShortcutClick(shortcut,(shortcut.disabled||(pikerType==='month')||(singleDate&&i>1) ||quickCompare),isCompare)" >{{ shortcut.text }}</div>
            </div>
            <div :class="[datePanelPrefix + '-body']">
                <div :class="[datePanelPrefix + '-content-wrapper']" >
                    <div :class="[datePanelPrefix + '-content', datePanelPrefix + '-content-left']" v-show="!isTime">
                        <div :class="[datePrefix + '-header']" v-show="leftCurrentView !== 'time'">
                            <span
                                :class="iconBtnCls('prev', '-double')"
                                @click="prevYear('left')"><Icon :type="leftYearIcon"></Icon></span>
                            <span
                                :class="iconBtnCls('prev')"
                                @click="prevMonth"
                                v-show="leftCurrentView === 'date'"><Icon :type="leftIcon"></Icon></span>
                            <date-panel-label
                                :date-panel-label="leftDatePanelLabel"
                                :current-view="leftCurrentView"
                                :date-prefix-cls="datePrefix"/>
                            <!-- <span
                                :class="iconBtnCls('next', '-double')"
                                @click="nextYear('left')"
                                v-show="leftCurrentView === 'year' || leftCurrentView === 'month'"><Icon type="arrow-right"></Icon></span> -->
                        </div>
                        <date-table
                            v-show="leftCurrentView === 'date'"
                            :year="leftYear"
                            :month="leftMonth"
                            :date="date"
                            :min-date="minDate"
                            :max-date="maxDate"
                            :handle-date="handleDate"
                            :quick-compare="quickCompare"
                            :origin-value="originValue"
                            :range-state="rangeState"
                            :single-date="singleDate"
                            selection-mode="range"
                            :max-range-day="maxRangeDay"
                            :disabled-date="disabledDate"
                            @on-changerange="handleChangeRange"
                            @on-pick="handleRangePick"
                            @on-pick-click="handlePickClick"></date-table>
                        <year-table
                            ref="leftYearTable"
                            v-show="leftCurrentView === 'year'"
                            :year="leftTableYear"
                            :date="leftTableDate"
                            selection-mode="range"
                            :disabled-date="disabledDate"
                            @on-pick="handleLeftYearPick"
                            @on-pick-click="handlePickClick"></year-table>
                        <month-table
                            ref="leftMonthTable"
                            v-show="leftCurrentView === 'month'"
                            :date="leftTableDate"
                            :min-date="minDate"
                            :max-date="maxDate"
                            :min="min"
                            :max="max"
                            :handle-date="handleDate"
                            selection-mode="range"
                            :max-range-day="maxRangeDay"
                            :begin-status ="monthBegin"
                            :disabled-date="disabledDate"
                            @on-pick="handleRangePick"
                            @on-pick-click="handlePickClick"></month-table>
                    </div>
                    <div :class="[datePanelPrefix + '-content', datePanelPrefix + '-content-right']" v-show="!isTime">
                        <div :class="[datePrefix + '-header']" v-show="rightCurrentView !== 'time'">
                            <!-- <span
                                :class="iconBtnCls('prev', '-double')"
                                @click="prevYear('right')"
                                v-show="rightCurrentView === 'year' || rightCurrentView === 'month'"><Icon type="arrow-left"></Icon></span> -->
                            <date-panel-label
                                :date-panel-label="rightDatePanelLabel"
                                :current-view="rightCurrentView"
                                :date-prefix-cls="datePrefix"/>
                            <span
                                :class="iconBtnCls('next', '-double')"
                                @click="nextYear('right')"><Icon :type="rightYearIcon"></Icon></span>
                            <span
                                :class="iconBtnCls('next')"
                                @click="nextMonth"
                                v-show="rightCurrentView === 'date'"><Icon :type="rightIcon"></Icon></span>
                        </div>
                        <date-table
                            v-show="rightCurrentView === 'date'"
                            :year="rightYear"
                            :month="rightMonth"
                            :date="rightDate"
                            :min-date="minDate"
                            :max-date="maxDate"
                            :handle-date="handleDate"
                            :range-state="rangeState"
                            :single-date="singleDate"
                            :max-range-day="maxRangeDay"
                            selection-mode="range"
                            :quick-compare="quickCompare"
                            :origin-value="originValue"
                            :disabled-date="disabledDate"
                            @on-changerange="handleChangeRange"
                            @on-pick="handleRangePick"
                            @on-pick-click="handlePickClick"></date-table>
                        <year-table
                            ref="rightYearTable"
                            v-show="rightCurrentView === 'year'"
                            :year="rightTableYear"
                            :date="rightTableDate"
                            selection-mode="range"
                            :disabled-date="disabledDate"
                            @on-pick="handleRightYearPick"
                            @on-pick-click="handlePickClick"></year-table>
                        <month-table
                            ref="rightMonthTable"
                            v-show="rightCurrentView === 'month'"
                            :date="rightTableDate"
                            :min-date="minDate"
                            :max-date="maxDate"
                            :min="min"
                            :max="max"
                            :handle-date="handleDate"
                            selection-mode="range"
                            :max-range-day="maxRangeDay"
                            :begin-status ="monthBegin"
                            :disabled-date="disabledDate"
                            @on-pick="handleRangePick"
                            @on-pick-click="handlePickClick"></month-table>
                    </div>
                    <div :class="[datePanelPrefix + '-content']" v-show="isTime">
                        <!-- <time-picker
                            ref="timePicker"
                            v-show="isTime"
                            @on-pick="handleTimePick"
                            @on-pick-click="handlePickClick"></time-picker> -->
                    </div>
                </div>
            </div>
            <Confirm
                v-if="confirm"
                :show-date="showDate"
                :show-time="showTime"
                :is-time="isTime"
                :min-date="minDate"
                :max-date="maxDate"
                :compare="compare"
                :show-tip="showTip"
                :max-range-month="maxRangeMonth"
                :max-range-day="maxRangeDay"
                :time-disabled="timeDisabled"
                :piker-type="pikerType"
                :order="selectOrder"
                :out-range="isOutRange"
                :quick-compare="quickCompare"
                :origin-value="originValue"
                @on-pick-compare="handlePickCompare"
                @on-pick-toggle-time="handleToggleTime"
                @on-pick-clear="handlePickClear"
                @on-pick-cancel="handlePickCancel"
                @on-pick-success="handleConfirmClick"></Confirm>
        <!-- </div> -->
    </div>
</template>
<script>
    import Icon from '../../icon/icon.vue';
    import DateTable from '../base/date-table.vue';
    import YearTable from '../base/year-table.vue';
    import MonthTable from '../base/month-table.vue';
    import Confirm from '../base/confirm.vue';
    import { toDate,formatDate, prevMonth, nextMonth, initTimeDate, formatDateLabels,getDateRange } from '../util';
    import datePanelLabel from './date-panel-label.vue';

    import Mixin from './mixin';
    import Locale from '../../../mixins/locale';


    import { prefix } from '../../var';
    const datePrefix = prefix+'date';
    const datePanelPrefix = prefix+'date-panel';

    export default {
        name: 'DatePicker',
        mixins: [ Mixin, Locale ],
        components: { Icon, DateTable, YearTable, MonthTable, Confirm, datePanelLabel },
        data () {
            return {
                datePanelPrefix: datePanelPrefix,
                datePrefix: datePrefix,
                shortcuts: [],//快速选择
                pikerType:undefined,//自定义选择类型
                singleDate:false,
                date: initTimeDate(),
                value: '',
                minDate: '',
                maxDate: '',
                min:'',
                max:'',
                compareMinDate:'',
                compareMaxDate:'',
                compare:false,//是否有对比时间功能
                quickCompare:false,//是否有快速对比时间功能
                originValue: [],     
                isCompare:false,//是否当前是时间对比
                showTip:false,
                maxRangeMonth:'',
                maxRangeDay:'',
                handleDate:'start',
                monthBegin:false,
                confirm: false,
                rangeState: {
                    endDate: null,
                    selecting: false
                },
                showTime: false,
                showDate: true,
                disabledDate: '',
                leftIcon:'',
                leftYearIcon:'',
                rightIcon:'',
                rightYearIcon:'',
                leftCurrentView: 'date',
                rightCurrentView: 'date',
                selectionMode: 'range',
                leftTableYear: null,
                rightTableYear: null,
                leftTableDate:null,
                rightTableDate:null,
                selectOrder:'straight',
                isTime: false,
                format: 'yyyy-MM-dd',
                curShortIndex:-1,//当前激活的快捷下标
                isOutRange:false,//是否超过范围
            };
        },
        computed: {
            isShortActive(shortcut){
                if(shortcut){
                    return true;
                }
            },
            // getDayString(date){
            //     if(date){
            //         var year = date.getFullYear();
            //         var month = date.getMonth() + 1;
            //         var day = date.getDate();
            //         if (month < 10) {
            //             month = "0" + month;
            //         }
            //         if (day < 10) {
            //             day = "0" + day;
            //         }
            //         return  year + "-" + month + "-" + day;

            //     }

            // },
            // handleShortCutActive(shortcut){
            //     const today = new Date();
            //     const yesterday = new Date();
            //     yesterday.setTime(yesterday.getTime() - 3600 * 1000 * 24 * 1);
            //     if(this.dateRangeTime===0){
            //         if(today==this.maxDate){
            //             return true;

            //         }else if(yesterday==this.maxDate){
            //             return true;

            //         }else{
            //             return false;

            //         }
            //     }else if(dateRangeTime==getTimeRange((shortcut.value())[0],(shortcut.value())[1])){
            //         if(today==this.maxDate){
            //             return true;
            //         }else{
            //             return false;
            //         }
            //     }else{
            //         return false;
            //     }
            // },
            dateRangeTime(){
                if(this.minDate&&this.maxDate){
                    return Math.abs(this.maxDate.getTime()-this.minDate.getTime())/(1000*60*60*24);
                }else{
                    return '';
                }
            },
            classes () {
                return [
                    `${datePanelPrefix}-body-wrapper`,
                    `${datePrefix}-with-range`,
                    {
                        [`${datePanelPrefix}-compare`]: this.compare,
                        [`${datePanelPrefix}-with-sidebar`]: this.shortcuts.length
                    }
                ];
            },
            leftYear () {
                return this.date.getFullYear();
            },
            // leftTableDate () {

            // },
            leftMonth () {
                return this.date.getMonth();
            },
            rightYear () {
                if(this.pikerType==='month'){
                    return this.getRightMonthDate().getFullYear();
                }else{
                    return this.rightDate.getFullYear();
                }
            },
            // rightTableDate () {
            // },
            rightMonth () {
                return this.rightDate.getMonth();
            },
            rightDate () {
                const newDate = new Date(this.date);
                const month = newDate.getMonth();
                // if(this.rightCurrentView==='month'){
                //     newDate.setDate(1);
                //     newDate.setFullYear(newDate.getFullYear() + 1);
                //     newDate.setMonth(0);

                // }else{
                    newDate.setDate(1);

                    if (month === 11) {
                        newDate.setFullYear(newDate.getFullYear() + 1);
                        newDate.setMonth(0);
                    } else {
                        newDate.setMonth(month + 1);
                    }

                // }
                return newDate;
            },
            leftDatePanelLabel () {
                if (!this.leftYear) return null; // not ready yet
                return this.panelLabelConfig('left');
            },
            rightDatePanelLabel () {
                if (!this.leftYear) return null; // not ready yet
                return this.panelLabelConfig('right');
            },
            timeDisabled () {
                return !(this.minDate && this.maxDate);
            }
        },
        watch: {
            value(newVal) {
                if (!newVal) {
                    this.minDate = null;
                    this.maxDate = null;
                } else if (Array.isArray(newVal)) {
                    this.minDate = newVal[0] ? toDate(newVal[0]) : null;
                    this.maxDate = newVal[1] ? toDate(newVal[1]) : null;
                    if (this.minDate) this.date = new Date(this.minDate);
                }
                // if (this.showTime) this.$refs.timePicker.value = newVal;
            },
            minDate (val) {
                // if (this.showTime) this.$refs.timePicker.date = val;
                this.resetCurShort();
            },
            maxDate (val) {
                // if (this.showTime) this.$refs.timePicker.dateEnd = val;
                this.resetCurShort();
            },
            format (val) {
                // if (this.showTime) this.$refs.timePicker.format = val;
            },
            isTime (val) {
                // if (val) this.$refs.timePicker.updateScroll();
            },
            leftTableYear(val){
                this.getLeftTableDate();
            },
            rightTableYear(val){
                this.getRightTableDate();
            }
        },
        methods: {
            getRightMonthDate(){
                const newDate = new Date(this.date);
                newDate.setDate(1);
                newDate.setFullYear(newDate.getFullYear() + 1);
                newDate.setMonth(0);
                return newDate;
            },
            getLeftTableDate(){
                // if (this.leftCurrentView === 'year' || this.leftCurrentView === 'month') {
                //     this.leftTableDate =  new Date(this.leftTableYear,1,1);
                // } else {
                //     this.leftTableDate = this.date;
                // }
                this.leftTableDate =  new Date(this.leftTableYear,1,1);
            },
            getRightTableDate(){
                // if (this.rightCurrentView === 'year' || this.rightCurrentView === 'month') {
                //     this.rightTableDate =  new Date(this.rightTableYear,1,1);
                // } else {
                //     this.rightTableDate =  this.date;
                // }
                this.rightTableDate =  new Date(this.rightTableYear,1,1);
            },
            getTimeRange(min,max){
                return Math.abs(new Date(max).getTime()-new Date(min).getTime())/(1000*60*60*24);
            },
            handleChangePikerType(){
                //根据类型重置选择日期时间段
                if(this.pikerType==='month'&&this.minDate&&this.maxDate){
                    //切换按月份时，日期重置为开始月份第一天到结束月份最后一天
                    let minDate = new Date((this.minDate).setDate(1));
                    let lastDayInMaxDate = this.getLastDaysInMonth(this.maxDate.getFullYear(),(Number(this.maxDate.getMonth())+1));
                    let maxDate = new Date(this.maxDate.setDate(lastDayInMaxDate));

                    if(this.min&&this.min.getTime()>minDate.getTime()){
                        minDate = new Date(this.min.getFullYear(),this.min.getMonth(),this.min.getDate());
                    }
                    if(this.max&&this.max.getTime()<maxDate.getTime()){
                        maxDate = new Date(this.max.getFullYear(),this.max.getMonth(),this.max.getDate());
                    }
                    this.handleRangePick({minDate, maxDate}, false,'end')
                }else if(this.minDate&&this.maxDate){
                    //切换为按日期时，判断日期是否再可允许的范围之内，不在则重置
                    let minDate = new Date((this.minDate).setDate(1));
                    if(this.min&&this.min.getTime()>minDate.getTime()){
                        minDate = new Date(this.min.getFullYear(),this.min.getMonth(),this.min.getDate());
                    }
                    let lastDayInMaxDate = this.getLastDaysInMonth(this.maxDate.getFullYear(),(Number(this.maxDate.getMonth())+1));
                    let maxDate = new Date(this.maxDate.setDate(lastDayInMaxDate));
                    if(this.max&&this.max.getTime()<maxDate.getTime()){
                        maxDate = new Date(this.max.getFullYear(),this.max.getMonth(),this.max.getDate());
                    }
                    this.handleRangePick({minDate, maxDate}, false,'end')
                }
                this.handleDate = 'start';
                this.resetView();
            },
            panelLabelConfig (direction) {
                const locale = this.t('i.locale');
                const datePanelLabel = this.t('i.datepicker.datePanelLabel');
                const handler = type => {
                    const fn = type == 'month' ? this.showMonthPicker : this.showYearPicker;
                    return () => fn(direction);
                };

                const date = new Date(this[`${direction}Year`], this[`${direction}Month`]);
                const { labels, separator } = formatDateLabels(locale, datePanelLabel, date);

                return {
                    separator: separator,
                    labels: labels.map(obj => ((obj.handler = handler(obj.type)), obj))
                };
            },
            resetDate () {
                this.date = new Date(this.date);
                this.leftTableYear = this.date.getFullYear();
                this.rightTableYear = (this.getRightMonthDate()).getFullYear();
            },
            handleClear() {
                this.minDate = null;
                this.maxDate = null;
                this.date = new Date();
                this.handleConfirm();
                // if (this.showTime) this.$refs.timePicker.handleClear();
            },
            //获取这个月的最后一天
            getLastDaysInMonth(year,month){
                const date = new Date();
                date.setFullYear(Number(year));
                date.setMonth(Number(month));
                const lastDay = new Date(date.setDate(0));
                return lastDay.getDate();
            },
            resetView(reset = false) {
                if(this.pikerType==='month'){
                    this.monthBegin = false;
                    this.leftCurrentView = 'month';
                    this.rightCurrentView = 'month';

                }else{
                    this.leftCurrentView = 'date';
                    this.rightCurrentView = 'date';
                }
                this.leftTableYear = this.leftYear;
                this.rightTableYear = this.rightYear;

                if (reset) this.isTime = false;
            },
            prevYear (direction) {
                if (this[`${direction}CurrentView`] === 'year') {
                    this.$refs[`${direction}YearTable`].prevTenYear();
                } else if (this[`${direction}CurrentView`] === 'month') {
                    // this[`${direction}TableYear`]--;
                    const date = this.date;
                    date.setFullYear(date.getFullYear() - 1);
                    this.resetDate();
                } else {
                    const date = this.date;
                    date.setFullYear(date.getFullYear() - 1);
                    this.resetDate();
                }
            },
            nextYear (direction) {
                if (this[`${direction}CurrentView`] === 'year') {
                    this.$refs[`${direction}YearTable`].nextTenYear();
                } else if (this[`${direction}CurrentView`] === 'month') {
                    // this[`${direction}TableYear`]++;

                    const date = this.date;
                    date.setFullYear(date.getFullYear() + 1);
                    this.resetDate();
                } else {
                    const date = this.date;
                    date.setFullYear(date.getFullYear() + 1);
                    this.resetDate();
                }
            },
            prevMonth () {
                this.date = prevMonth(this.date);
            },
            nextMonth () {
                this.date = nextMonth(this.date);
            },
            handleLeftYearPick (year, close = true) {
                this.handleYearPick(year, close, 'left');
            },
            handleRightYearPick (year, close = true) {
                this.handleYearPick(year, close, 'right');
            },
            handleYearPick (year, close, direction) {
                this[`${direction}TableYear`] = year;
                if (!close) return;

                this[`${direction}CurrentView`] = 'month';
            },
            handleLeftMonthPick (month) {
                this.handleMonthPick(month, 'left');
            },
            handleRightMonthPick (month) {
                this.handleMonthPick(month, 'right');
            },
            handleMonthPick (month, direction) {
                let year = this[`${direction}TableYear`];
                this.date.setYear(year);
                this.date.setMonth(month--);
                if (direction === 'right') {
                    // if (month === 0) {
                    //     month = 11;
                    //     year--;
                    // } else {
                    //     month--;
                    // }
                    this.date.setDate(1);

                }else{

                }

                
                if(this.pikerType==='month'){
                    this[`${direction}CurrentView`] = 'month';
                }else{
                    this[`${direction}CurrentView`] = 'date';
                }
                this.resetDate();
            },
            showYearPicker (direction) {
                // this[`${direction}CurrentView`] = 'year';
                // this[`${direction}TableYear`] = this[`${direction}Year`];
            },
            showMonthPicker (direction) {
                // this[`${direction}CurrentView`] = 'month';
            },
            handleConfirmClick(){
                this.handleConfirm();
                this.$emit('on-pick-success');
            },
            handleConfirm(visible) {
                this.$emit('on-pick', ((this.isCompare || this.quickCompare)?[this.minDate, this.maxDate,this.compareMinDate,this.compareMaxDate]:[this.minDate, this.maxDate]), visible);
            },
            handleRangePick (val, close = true,handleDate,selectOrder,isOutRange) {
                if (this.maxDate === val.maxDate && this.minDate === val.minDate) return;
                this.handleDate = handleDate;
                this.selectOrder = selectOrder;
                this.isOutRange = isOutRange;
                this.minDate = val.minDate;
                this.maxDate = val.maxDate;

                // todo Remove when Chromium has fixed bug
                // https://github.com/iview/iview/issues/2122
                this.$nextTick(() => {
                    this.minDate = val.minDate;
                    this.maxDate = val.maxDate;
                });
                /* end of #2122 patch */


                if (!close) return;
//                if (!this.showTime) {
//                    this.handleConfirm(false);
//                }
                this.handleConfirm(false);
            },
            resetCurShort(){
                this.curShortIndex = -1;
                this.shortcuts.forEach((item,i) => {
                    if(formatDate(this.maxDate)===formatDate(item.value()[1])&&getDateRange(this.minDate,this.maxDate)===getDateRange(item.value()[0],item.value()[1])){
                        this.curShortIndex = i;
                    }
                });
            },
            handleChangeRange (val) {
                this.minDate = val.minDate;
                this.maxDate = val.maxDate;
                this.rangeState = val.rangeState;
            },
            handleToggleTime () {
                this.isTime = !this.isTime;
            },
            handlePickCompare(isCompare,compareDate){
                this.isCompare = isCompare;
                this.$emit("on-click-compare",isCompare);
                this.compareMinDate = compareDate.compareMinDate;
                this.compareMaxDate = compareDate.compareMaxDate;
            },
            handleTimePick (date) {
                this.minDate = date[0];
                this.maxDate = date[1];
                this.handleConfirm(false);
            }
        },
        mounted () {
            if (this.showTime) {
            }
        }
    };
</script>
