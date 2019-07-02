<template>
    <div :class="classes" v-clickoutside="handleClose">
        <div ref="reference" :class="refClasses" @click="toggleDrop" @mouseenter="hover = true"  @mouseleave="hover = false">
            <input type="hidden" :name="name" v-model="currentValue"/>
            <slot name="selection">
                <Icon v-if="preIcon" :type="preIcon" class="pre-icon"></Icon>
                <div :class="refNameClasses">
                    <slot name="selection-name">
                        <template v-if="this.fixTitle || this.visualValue">{{(this.fixTitle) ? this.fixTitle : (this.visualValue)}}</template>       
                        <template v-else><span class="placeholder">{{this.placeholder}}</span></template>     
                    </slot>
                </div>
                <Icon v-if="!!clearable&&(this.visualValue)&&hover" :type="closeIcon" class="after-icon" @on-click-icon.stop="clearSelect"></Icon>
                <Icon v-if="!readonly&&(!(clearable&&(this.visualValue)&&hover))" :type="icon" class="after-icon"></Icon>
            </slot>
        </div>
        <transition :name="transition">
            <div v-show="opened" :class="dropClasses" :style="dropStyles">
                <div ref="picker"></div>
            </div>
        </transition>
    </div>
</template>
<script>
    import Icon from '../icon';
    import clickoutside from '../../directives/clickoutside';
    import TransferDom from '../../directives/transfer-dom';
    import { oneOf,findComponentDownward } from '../../utils/assist';
    import { formatDate, parseDate } from './util';
    import Emitter from '../../mixins/emitter';
    import { prefix } from '../var';
    const datePrefix = prefix+'date';

    //默认格式化
    const DEFAULT_FORMATS = {
        date: 'yyyy-MM-dd',
        month: 'yyyy-MM',
        year: 'yyyy',
        datetime: 'yyyy-MM-dd HH:mm:ss',
        time: 'HH:mm:ss',
        timerange: 'HH:mm:ss',
        daterange: 'yyyy-MM-dd',
        datetimerange: 'yyyy-MM-dd HH:mm:ss'
    };

    const DEFAULT_SEPARATOR = ' ~ ';


    //格式化函数
    const DATE_FORMATTER = function(value, format) {
        return formatDate(value, format);
    };
    //
    const DATE_PARSER = function(text, format) {
        return parseDate(text, format);
    };
    const RANGE_FORMATTER = function(value, format,separator=DEFAULT_SEPARATOR) {
        if (Array.isArray(value) && value.length>=2) {
            const start = value[0];
            const end = value[1];

            if (start && end) {
                return formatDate(start, format) + separator + formatDate(end, format);
            }
        }
        return '';
    };
    const RANGE_PARSER = function(text, format,separator=DEFAULT_SEPARATOR) {
        const array = text.split(separator);
        if (array.length>=2) {
            const range1 = array[0];
            const range2 = array[1];
            let range3 = '';
            let range4 = '';
            if(array.length===4){
                range3 = array[2];
                range4 = array[3];

            }

            return [parseDate(range1, format), parseDate(range2, format), parseDate(range3, format), parseDate(range4, format)];
        }
        return [];
    };

    const TYPE_VALUE_RESOLVER_MAP = {
        default: {
            formatter(value) {
                if (!value) return '';
                return '' + value;
            },
            parser(text) {
                if (text === undefined || text === '') return null;
                return text;
            }
        },
        date: {
            formatter: DATE_FORMATTER,
            parser: DATE_PARSER
        },
        datetime: {
            formatter: DATE_FORMATTER,
            parser: DATE_PARSER
        },
        daterange: {
            formatter: RANGE_FORMATTER,
            parser: RANGE_PARSER
        },
        datetimerange: {
            formatter: RANGE_FORMATTER,
            parser: RANGE_PARSER
        },
        timerange: {
            formatter: RANGE_FORMATTER,
            parser: RANGE_PARSER
        },
        time: {
            formatter: DATE_FORMATTER,
            parser: DATE_PARSER
        },
        month: {
            formatter: DATE_FORMATTER,
            parser: DATE_PARSER
        },
        year: {
            formatter: DATE_FORMATTER,
            parser: DATE_PARSER
        },
        number: {
            formatter(value) {
                if (!value) return '';
                return '' + value;
            },
            parser(text) {
                let result = Number(text);

                if (!isNaN(text)) {
                    return result;
                } else {
                    return null;
                }
            }
        }
    };

    export default {
        name: 'Calendar',
        mixins: [ Emitter ],
        directives: { clickoutside, TransferDom },
        props: {
            format: {
                type: String
            },
            readonly: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            singleDate:{
                type: Boolean,
                default: false
            },
            pikerType:{//是否有选择类型（可按自定义时间或者按月份）
                type: Boolean,
                default: false
            },
            showTip:{//是否显示超过范围的提示
                type: Boolean,
                default: false
            },
            min:Date,
            max:Date,
            extraTip:String,
            disabledOutRange:{//默认设置选择范围
                type:Boolean,
                default:false
            },
            maxRangeHour:{},
            maxRangeDay:{},
            maxRangeMonth:{},
            showTime:{//是否显示选择时间
                type: Boolean,
                default: false
            },
            clearable: {//是否可清空
                type: Boolean,
                default: false
            },
            quickCompare:{  // 快速对比
               type: Boolean,
               default: false                
            },
            originValue: {
                type: Array,
                default () {
                    return [];
                }
            },        
            confirm: {//时候有确定区域
                type: Boolean,
                default: false
            },
            compare:{//增加对比时间
                type:Boolean,
                default:false
            },
            open: {//是否默认打开
                type: Boolean,
                default: null
            },
            size: {
                validator (value) {
                    return oneOf(value, ['small', 'large', 'default']);
                }
            },
            fixTitle:{
                // 固定选框标题
                type: String,
                default:''
            },
            placeholder: {//默认提示语
                type: String,
                default: ''
            },
            placement: {//位置
                validator (value) {
                    return oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
                },
                default: 'bottom-start'
            },
            icon:{
                type:String,
                default:'calendar'
            },
            top:{
                type:String,
                default:'32px'
            },
            options: {//快速选项
                type: Object
            },
            transfer: {
                type: Boolean,
                default: false
            },
            name: {
                type: String
            },
            elementId: {
                type: String
            },
            dropForDate:{
                type:Boolean,
                default:false
            },
            leftYearIcon:{
                type:String,
                default:"arrow-left"
            },
            leftIcon:{
                type:String,
                default:"arrow-left"
            },
            rightYearIcon:{
                type:String,
                default:"arrow-right"
            },
            rightIcon:{
                type:String,
                default:"arrow-right"
            },
            preIcon:String,
            closeIcon:{
                type:String,
                default:'close-circled'
            },
            right:{
                type:String
            },
            selectMaxHeight:{
                type:[String,Number],
                default:156
            },
            emitShortCut:{
                type:Boolean,
                default:true
            },
            selectedBar:{
                type:Boolean,
                default:false
            },
            separator:{
                default:String,
                default:' ~ ',
            },
            wrapSelection:{
                type:Boolean,
                default:false
            },
            dropIcon:{
                type:String,
                default:'sort-down'
            },
            monthRows:{
                type:[String,Number],
                default:3
            },
        },
        components:{
            'Icon':Icon
        },
        data () {
            return {
                hover:false,
                datePrefix: datePrefix,
                showClose: false,
                visible: false,
                picker: null,
                isCompare:false,
                compareMinDate:'',
                compareMaxDate:'',
                internalValue: '',
                disableClickOutSide: false,    // fixed when click a date,trigger clickoutside to close picker
                disableCloseUnderTransfer: false,  // transfer 模式下，点击Drop也会触发关闭
                currentValue: this.value
            };
        },
        computed: {
            opened () {
                return this.open === null ? this.visible : this.open;
            },
            iconType () {
                let icon = 'ios-calendar-outline';
                if (this.type === 'time' || this.type === 'timerange') icon = 'ios-clock-outline';
                if (this.showClose) icon = 'ios-close';
                return icon;
            },
            transition () {
                if (this.placement === 'top-start' || this.placement === 'top' || this.placement === 'top-end') {
                    return 'slide-down';
                } else {
                    return 'slide-up';
                }
            },
            refClasses(){
                return [
                    `${datePrefix}-ref`,
                    {
                        ['isFocus']:this.focus,
                        [ `${datePrefix}-ref-name-hasPreIcon`]:this.preIcon,
                    }
                ];

            },
            classes(){
                return [
                    `${datePrefix}`,
                    {
                        [ `${datePrefix}-readonly`]:this.readonly,
                        [ `${datePrefix}-disabled`]:this.disabled,
                        [ `${datePrefix}-wrapSelection`]:this.wrapSelection
                    }
                ]

            },
            refNameClasses(){
                return [
                    `${datePrefix}-ref-name`,
                ]
            },
            dropClasses(){
                return [
                    `${datePrefix}-drop`,
                    // {
                    //     ['isMultiple']:this.selectedMultiple.length
                    // }
                ]

            },
            dropStyles(){
                return {
                    right:(this.right)?this.right:(this.placement==='right' || this.placement==='bottom-end' || this.placement==='top-end')?0:'initial',
                    top:(this.placement==='bottom-start' || this.placement==='bottom' ||this.placement==='bottom-end' || this.top )?this.top:'initial',
                    bottom:(this.placement==='top-start'|| this.placement==='top' ||this.placement==='top-end' )?'32px':'initial',
                }
            },
            selectionMode() {
                if (this.type === 'month') {
                    return 'month';
                } else if (this.type === 'year') {
                    return 'year';
                }

                return 'day';
            },
            visualValue: {
                get () {
                    const value = this.internalValue;
                    if (!value) return;
                    const formatter = (
                        TYPE_VALUE_RESOLVER_MAP[this.type] ||
                        TYPE_VALUE_RESOLVER_MAP['default']
                    ).formatter;
                    const format = DEFAULT_FORMATS[this.type];

                    return formatter(value, this.format || format,this.separator);
                },

                set (value) {
                    if (value) {
                        const type = this.type;
                        const parser = (
                            TYPE_VALUE_RESOLVER_MAP[type] ||
                            TYPE_VALUE_RESOLVER_MAP['default']
                        ).parser;
                        const parsedValue = parser(value, this.format || DEFAULT_FORMATS[type],this.separator);
                        if (parsedValue) {
                            if (this.picker) this.picker.value = parsedValue;
                        }
                        return;
                    }
                    if (this.picker) this.picker.value = value;
                }
            }
        },
        methods: {
            /**
             * @method 清除选中日期
             */
            clearSelect(e){
                e.stopPropagation();
                this.visible = false;
                this.handleClear()
            },
            toggleDrop(){
                if(this.disabled || this.readonly){
                    return false;
                }
                this.visible = !this.visible;
                this.focus = !this.focus;
            },
            // 开启 transfer 时，点击 Drop 即会关闭，这里不让其关闭
            handleTransferClick () {
                if (this.transfer) this.disableCloseUnderTransfer = true;
            },
            handleClose () {
                if (this.disableCloseUnderTransfer) {
                    this.disableCloseUnderTransfer = false;
                    return false;
                }
                if (this.open !== null) return;
                //                if (!this.disableClickOutSide) this.visible = false;
                this.visible = false;
                this.disableClickOutSide = false;
            },
            handleFocus () {
                if (this.readonly) return;
                this.visible = true;
            },
            handleBlur () {
                this.visible = false;
            },
            // handleInputChange (event) {
            //     const oldValue = this.visualValue;
            //     const value = event.target.value;

            //     let correctValue = '';
            //     let correctDate = '';
            //     const type = this.type;
            //     const format = this.format || DEFAULT_FORMATS[type];

            //     if (type === 'daterange' || type === 'timerange' || type === 'datetimerange') {
            //         const parser = (
            //             TYPE_VALUE_RESOLVER_MAP[type] ||
            //             TYPE_VALUE_RESOLVER_MAP['default']
            //         ).parser;

            //         const formatter = (
            //             TYPE_VALUE_RESOLVER_MAP[type] ||
            //             TYPE_VALUE_RESOLVER_MAP['default']
            //         ).formatter;

            //         const parsedValue = parser(value, format,this.separator);

            //         if (parsedValue[0] instanceof Date && parsedValue[1] instanceof Date) {
            //             if (parsedValue[0].getTime() > parsedValue[1].getTime()) {
            //                 correctValue = oldValue;
            //             } else {
            //                 correctValue = formatter(parsedValue, format,this.separator);
            //             }
            //             // todo 判断disabledDate
            //         } else {
            //             correctValue = oldValue;
            //         }

            //         correctDate = parser(correctValue, format,this.separator);
            //     } else if (type === 'time') {
            //         const parsedDate = parseDate(value, format);

            //         if (parsedDate instanceof Date) {
            //             if (this.disabledHours.length || this.disabledMinutes.length || this.disabledSeconds.length) {
            //                 const hours = parsedDate.getHours();
            //                 const minutes = parsedDate.getMinutes();
            //                 const seconds = parsedDate.getSeconds();

            //                 if ((this.disabledHours.length && this.disabledHours.indexOf(hours) > -1) ||
            //                     (this.disabledMinutes.length && this.disabledMinutes.indexOf(minutes) > -1) ||
            //                     (this.disabledSeconds.length && this.disabledSeconds.indexOf(seconds) > -1)) {
            //                     correctValue = oldValue;
            //                 } else {
            //                     correctValue = formatDate(parsedDate, format);
            //                 }
            //             } else {
            //                 correctValue = formatDate(parsedDate, format);
            //             }
            //         } else {
            //             correctValue = oldValue;
            //         }

            //         correctDate = parseDate(correctValue, format);
            //     } else {
            //         const parsedDate = parseDate(value, format);

            //         if (parsedDate instanceof Date) {
            //             const options = this.options || false;
            //             if (options && options.disabledDate && typeof options.disabledDate === 'function' && options.disabledDate(new Date(parsedDate))) {
            //                 correctValue = oldValue;
            //             } else {
            //                 correctValue = formatDate(parsedDate, format);
            //             }
            //         } else if (!parsedDate) {
            //             correctValue = '';
            //         } else {
            //             correctValue = oldValue;
            //         }

            //         correctDate = parseDate(correctValue, format);
            //     }

            //     this.visualValue = correctValue;
            //     event.target.value = correctValue;
            //     this.internalValue = correctDate;
            //     this.currentValue = correctDate;

            //     if (correctValue !== oldValue) this.emitChange(correctDate);
            // },
            handleInputMouseenter () {
                if (this.readonly || this.disabled) return;
                if (this.visualValue && this.clearable) {
                    this.showClose = true;
                }
            },
            handleInputMouseleave () {
                this.showClose = false;
            },
            handleIconClick () {
                if (this.showClose) {
                    this.handleClear();
                } else if (!this.disabled) {
                    this.handleFocus();
                }
            },
            handleCancel(){
                this.visible = false;
                var Confirm = findComponentDownward(this.picker, 'Confirm');
                if(this.value.length===4){
                    const formatter = (
                        TYPE_VALUE_RESOLVER_MAP['date']
                    ).formatter;
                    const format = DEFAULT_FORMATS['date'];
                    this.compareMinDate = formatter(this.value[2], this.format || format,this.separator);
                    this.compareMaxDate = formatter(this.value[3], this.format || format,this.separator);
                    Confirm.isCompare = true;
                }else{
                    Confirm.isCompare = false;
                }
                this.currentValue = this.value;
                this.picker.value = this.value;
                this.picker.disabledFuction = '';
                this.picker.resetView && this.picker.resetView();
                //fix 取消不需要触发变化
                // this.emitChange(this.value);
            },
            handleClear () {
                this.visible = false;
                this.internalValue = '';
                this.currentValue = '';
                if(this.picker&&this.picker.disabledFuction){
                    this.picker.disabledFuction = '';
                }
                this.$emit('on-clear');
                this.dispatch('FormItem', 'on-form-change', '');
                // #2215，当初始设置了 value，直接点 clear，这时 this.picker 还没有加载
                if (!this.picker) {
                    this.emitChange('');
                }
            },
            showPicker () {
                if (!this.picker) {
                    let isConfirm = this.confirm;
                    const type = this.type;


                    this.picker = this.Panel.$mount(this.$refs.picker);

                    this.picker.showTime = this.showTime;
                    this.picker.compare = this.compare;
                    this.picker.leftYearIcon = this.leftYearIcon;
                    this.picker.leftIcon = this.leftIcon;
                    this.picker.rightYearIcon = this.rightYearIcon;
                    this.picker.rightIcon = this.rightIcon;
                    this.picker.showTip = this.showTip;
                    this.picker.dropForDate = this.dropForDate;
                    this.picker.min = this.min;
                    this.picker.max = this.max;
                    this.picker.extraTip = this.extraTip;
                    this.picker.maxRangeHour = this.maxRangeHour;
                    this.picker.maxRangeDay = this.maxRangeDay;
                    this.picker.maxRangeMonth = this.maxRangeMonth;
                    this.picker.disabledOutRange = this.disabledOutRange;
                    this.picker.dropIcon = this.dropIcon;
                    this.picker.monthRows = this.monthRows;
                    if (type === 'datetime' || type === 'datetimerange') {
                        isConfirm = true;
                        this.picker.showTime = true;
                    }
                    this.picker.value = this.internalValue;
                    this.picker.type = this.type;
                    this.picker.separator = this.separator;
                    this.picker.selectedBar = this.selectedBar;
                    this.picker.confirm = isConfirm;
                    this.picker.quickCompare = this.quickCompare;
                    this.picker.emitShortCut = this.emitShortCut;
                    this.picker.originValue = (this.originValue)?this.originValue:[];
                    this.picker.selectionMode = this.selectionMode;
                    this.picker.selectMaxHeight = this.selectMaxHeight;
                    if (this.format) this.picker.format = this.format;

                    // TimePicker
                    if (this.disabledHours) this.picker.disabledHours = this.disabledHours;
                    if (this.disabledMinutes) this.picker.disabledMinutes = this.disabledMinutes;
                    if (this.disabledSeconds) this.picker.disabledSeconds = this.disabledSeconds;
                    if (this.hideDisabledOptions) this.picker.hideDisabledOptions = this.hideDisabledOptions;

                    const options = this.options;
                    for (const option in options) {
                        this.picker[option] = options[option];
                    }

                    this.picker.pikerType = (this.pikerType)?'custom':undefined;
                    this.picker.singleDate = (this.singleDate)?this.singleDate:false;



                    this.picker.$on('on-pick', (date, visible = false) => {
                        if (!isConfirm) this.visible = visible;
                        if(this.isCompare&&date.length===4){
                            const formatter = (
                                TYPE_VALUE_RESOLVER_MAP['date']
                            ).formatter;
                            const format = DEFAULT_FORMATS['date'];
                            this.compareMinDate = formatter(date[2], this.format || format,this.separator);
                            this.compareMaxDate = formatter(date[3], this.format || format,this.separator);
                        }
                        this.currentValue = date;
                        this.picker.value = date;
                        this.picker.resetView && this.picker.resetView();
                        this.emitChange(date);
                    });
                    //监听是否点击了快捷选项，点击之后，马上关闭弹框
                    this.picker.$on('on-pick-short', () => {
                        this.visible = false;
                        this.$emit('on-ok');
                    });

                    this.picker.$on('on-change-picktype',(val)=>{
                        this.picker.pikerType = val;
                        this.picker.handleChangePikerType()
                    })

                    this.picker.$on('on-pick-clear', () => {
                        this.handleClear();
                    });
                    this.picker.$on('on-pick-cancel', () => {
                        this.handleCancel();
                    });
                    this.picker.$on('on-pick-success', () => {
                        this.visible = false;
                        this.$emit('on-ok');
                    });
                    this.picker.$on('on-click-compare', (isCompare) => {
                        this.isCompare = isCompare;
                    });
                    this.picker.$on('on-pick-click', () => this.disableClickOutSide = true);
                }
                if (this.internalValue instanceof Date) {
                    this.picker.date = new Date(this.internalValue.getTime());
                } else {
                    this.picker.value = this.internalValue;
                }
                this.picker.resetView && this.picker.resetView();
            },
            emitChange (date) {
                const newDate = this.formattingDate(date);


                this.$emit('on-change', newDate);
                this.$nextTick(() => {
                    this.dispatch('FormItem', 'on-form-change', newDate);
                });
            },
            formattingDate (date) {
                const type = this.type;
                const format = this.format || DEFAULT_FORMATS[type];
                const formatter = (
                    TYPE_VALUE_RESOLVER_MAP[type] ||
                    TYPE_VALUE_RESOLVER_MAP['default']
                ).formatter;

                let newDate = formatter(date, format,this.separator);
                
                if (type === 'daterange' || type === 'timerange' || type === 'datetimerange') {
                    newDate = (this.isCompare)?[
                        newDate.split(this.separator)[0], 
                        newDate.split(this.separator)[1], 
                        this.compareMinDate, 
                        this.compareMaxDate, 
                    ]:[newDate.split(this.separator)[0], newDate.split(this.separator)[1]];
                }
                return newDate;
            }
        },
        watch: {
            pikerType(val){
                if(this.picker){
                    this.picker.pikerType = val;
                }
            },
            singleDate(val){
                if(this.picker){
                    this.picker.singleDate = val;
                }
            },
            visible (val) {
                if (val) {
                    this.showPicker();
                    // this.$refs.drop.update();
                    if (this.open === null) this.$emit('on-open-change', true);
                } else {
                    if (this.picker) this.picker.resetView && this.picker.resetView(true);
                    // this.$refs.drop.destroy();
                    if (this.open === null) this.$emit('on-open-change', false);
                    // blur the input
                    // const input = this.$el.querySelector('input');
                    // if (input) input.blur();
                }
            },
            internalValue(val) {
                if (!val && this.picker && typeof this.picker.handleClear === 'function') {
                    this.picker.handleClear();
                }
                //                this.$emit('input', val);
            },
            value (val) {
                this.currentValue = val;
                    if(this.picker){
                        
                        var Confirm = findComponentDownward(this.picker, 'Confirm');
                        if(Confirm){
                            
                        if(val.length===4){
                            // const formatter = (
                            //     TYPE_VALUE_RESOLVER_MAP['date']
                            // ).formatter;
                            // const format = DEFAULT_FORMATS['date'];
                            // this.compareMinDate = formatter(val[2], this.format || format,this.separator);
                            // this.compareMaxDate = formatter(val[3], this.format || format,this.separator);
                            Confirm.isCompare = true;
                        }else{
                            Confirm.isCompare = false;
                        }
                        }
                    }
            },
            originValue(val){
                if(this.picker&&this.picker.originValue){
                    this.picker.originValue = (val)?val:this.originValue;
                }
            },
            currentValue: {
                immediate: true,
                handler (val) {
                    const type = this.type;
                    const parser = (
                        TYPE_VALUE_RESOLVER_MAP[type] ||
                        TYPE_VALUE_RESOLVER_MAP['default']
                    ).parser;

                    if (val && type === 'time' && !(val instanceof Date)) {
                        val = parser(val, this.format || DEFAULT_FORMATS[type],this.separator);
                    } else if (val && type.match(/range$/) && Array.isArray(val) && val.filter(Boolean).length && !(val[0] instanceof Date) && !(val[1] instanceof Date)) {
                        val = val.join(this.separator);
                        val = parser(val, this.format || DEFAULT_FORMATS[type],this.separator);
                    } else if (typeof val === 'string' && type.indexOf('time') !== 0 ){
                        val = parser(val, this.format || DEFAULT_FORMATS[type],this.separator) || val;
                    }
                    this.internalValue = val;
                    
                }
            },
            visualValue(val){
                if(this.type=='date'){
                    this.$emit('input', val);

                }else{
                    let date = val.split(this.separator)
                    this.$emit('input', date);
                }            
            },
            open (val) {
                if (val === true) {
                    this.visible = val;
                    this.$emit('on-open-change', true);
                } else if (val === false) {
                    this.$emit('on-open-change', false);
                }
            }
        },
        beforeDestroy () {
            if (this.picker) {
                this.picker.$destroy();
            }
        },
        mounted () {
            if (this.open !== null) this.visible = this.open;
        }
    };
</script>
