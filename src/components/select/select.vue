<template>
    <div :class="wrapClasses" v-clickoutside="handleClose">
        <div :class="selectionClasses" @click="toggleDrop" @mouseenter="hover = true"  @mouseleave="hover = false">
            <!-- select中的input改成text类型并设置id。用于表单验证时的标记定位 -->
            <input type="text" :name="name" v-model="currentValue" :id="elementId"/>
            <slot name="selection">
                <div :class="selectionNameClasses">
                    <slot name="selection-name">
                        <template v-if="type==='multiple'&&selectedMultiple.length"> 
                            <template v-if="selectedMultiple.length>2">
                                <Tooltip :content="tooltipContent" :direction="tooltipDirection">
                                    <TagGroup slot="target" :tags="selectedMultiple">
                                        <Tag v-for="(item,index) in selectedMultiple" v-if="index<2" :key="index" :tag="item" :closable="tagClosable" @on-close="closeTag($event,item)"  :icon="multiTagIcon">
                                            {{item.label}}
                                        </Tag>
                                        ...
                                    </TagGroup>
                                </Tooltip>
                            </template>
                            <template v-else>
                                <TagGroup slot="target" :tags="selectedMultiple">
                                    <Tag v-for="(item,index) in selectedMultiple" v-if="index<2" :key="index" :tag="item"  :closable="tagClosable" @on-close="closeTag($event,item)"  :icon="multiTagIcon">
                                        {{item.label}}
                                    </Tag>
                                </TagGroup>
                            </template>
                        </template>
                        <template v-else>
                            <span :title="currentLabel">{{currentLabel}}</span>
                        </template>
                        <template v-if="(type==='multiple'&&!selectedMultiple.length)||(type==='single'&&!currentLabel)">
                            <span :class="placeholderClasses">{{currentPlaceHolder}}</span>
                        </template>
                    </slot>
                </div>
                <Icon v-if="!!clearable&&(currentValue!=='')&&hover" type="close-circled" class="close-icon" @on-click-icon.stop="clearSelect"></Icon>
                <Icon v-if="!clearable||(!!clearable&&(!hover||(hover&&currentValue==='')))" :type="icon" :class="{'is-reverse':(show)}"></Icon>
            </slot>
        </div>
        <transition :name="transitionName" @before-enter="handleMenuEnter" @after-leave="handleDestroy">
            <div v-show="showDrop" :class="dropClasses" ref="popper">
                <slot name="pre"></slot>
                <div v-if="filterable||searchable" :class="[prefix+'-search-wrap']">
                    <FormInput ref="search"
                    v-model="searchword" 
                    :placeholder="searchPlaceholder" 
                    style="width:100%;" 
                    aft-icon="ios-search-strong"></FormInput>
                </div>
                <div v-if="checkAll&&!(filterable&&notFound)" :class="checkAllClasses">
                    <Checkbox v-model="checkedAll" @on-change="handleCheckAll" :disabled="!!checkRange">全选</Checkbox>
                </div>
                <div :class="[prefix+'-drop-body']">
                    <div v-if="noScroll"  :class="{'scroll-search-nodata':filterable&&notFound}">
                        <div v-if="curStatus&&curStatus==='noData'" :class="nodataClasses"><slot name="nodata"></slot></div>
                        <div v-if="!curStatus || (curStatus&&curStatus==='hasData')" :class="listClasses">
                            <slot></slot>
                        </div>
                        <div v-if="curStatus&&curStatus==='loading'" :class="loadingClasses"><slot name="loading"></slot></div>
                    </div>
                    <Scroll v-else :max-height="maxHeight" ref="scrollbar" @on-scroll="handleScroll" always :class="{'scroll-search-nodata':filterable&&notFound}">
                        <div v-if="curStatus&&curStatus==='noData'" :class="nodataClasses"><slot name="nodata"></slot></div>
                        <div v-if="!curStatus || (curStatus&&curStatus==='hasData')" :class="listClasses">
                            <slot></slot>
                        </div>
                        <div v-if="curStatus&&curStatus==='loading'" :class="loadingClasses"><slot name="loading"></slot></div>
                    </Scroll>
                    <div :class="[prefix+'-search-nodata']" v-if="filterable&&notFound">
                        {{searchTip}}
                    </div>
                </div>
                <div v-if="judge&&type==='multiple'" :class="[prefix+'-judge']">
                    <div :class="[prefix+'-judge-sum-wrap']">
                        <slot name="sum-tip">
                            <template v-if="!!checkRange&&checkRange[1]">最多选择{{checkRange[1]}}项，</template>已选{{currentValue.length}}项
                        </slot>
                    </div>
                    <div :class="[prefix+'-judge-action-wrap']">
                        <BaseButton type="primary"  @on-click-btn="handleSubmit" :disabled="!!checkRange&&this.currentValue.length<checkRange[0]">确定</BaseButton>
                        <BaseButton @on-click-btn="handleCancel">取消</BaseButton>
                    </div>
                </div>
                <slot name="after"></slot>
                <div v-if="bubble" :class="[prefix+'-drop-arrow']"></div>
            </div>
        </transition>
    </div>
</template>
<script>
    import Emitter from '../../mixins/emitter';
    import { oneOf ,findComponentDownward} from '../../utils/assist';
    import clickoutside from '../../directives/clickoutside';
    import { debounce } from './utils';

    import Icon from '../icon';
    import Scroll from '../scroll';
    import Checkbox from '../checkbox';
    import TagGroup from '../tag/tag-group';
    import Tag from '../tag';
    import Tooltip from '../tooltip';
    import BaseButton from '../button';
    import FormInput from '../input';
    import { prefix } from '../var';
    const selectPrefix = prefix+'select';

    export default {
        name: 'FormSelect',
        mixins: [ Emitter ],
        components: { Icon, Scroll, Checkbox,TagGroup,Tag,Tooltip,BaseButton,FormInput},
        directives: { clickoutside },
        props: {
            type:{
                type:String,
                default:'single',
                validator (value) {
                    return oneOf(value, ['single', 'multiple']);
                }
            },
            noScroll:{
                type:Boolean,
                default:false,
            },
            defaultTitle:String,
            size:{
                type:String,
                validator (value) {
                    return oneOf(value, ['large', 'small']);
                }
            },
            tooltipDirection:{
                type:String,
                default:'top'
            },
            searchTip:{
                type:String,
                default:'未搜索到数据'
            },
            status:String,
            icon:{
                type:String,
                default:'sort-down'
            },
            multiTagIcon:{
                type:String,
                default:'ios-close-empty'
            },
            tagClosable:{
                type:Boolean,
                default:true
            },
            closeToReset:{
                type:Boolean,
                default:false
            },
            judge:{
                type:Boolean,
                default:false
            },
            labelInValue: {
                type: Boolean,
                default: false
            },
            multiType:{
                type:String,
                default:'',
                validator (value) {
                    return oneOf(value, ['check-box','']);
                }
            },
            checkAll:{
                type:Boolean,
                default:false
            },
            checkRange:Array,
            title:{
                type:String,
                default:''
            },
            fixTitle:{
                type:Boolean,
                default:false,
            },
            maxHeight:{
                type:Number,
                default:200
            },
            clearable:{
                type:Boolean,
                default:false
            },
            filterable:{
                type:Boolean,
                default:false
            },
            searchable:{
                type:Boolean,
                default:false
            },
            value:{
                type:[String,Number,Array],
                default:''
            },
            label:{
                type:[String,Number,Array],
                default:''
            },
            disabled:{
                type:Boolean,
                default:false
            },
            placeholder:{
                type:String
            },
            searchPlaceholder:{
                type:String
            },
            align:{
                type:String,
                default:'left',
                validator (value) {
                    return oneOf(value, ['left', 'center','right']);
                },
            },
            direction:{
                type:String,
                default:'bottom',
                validator (value) {
                    return oneOf(value, ['top', 'bottom']);
                },
            },
            bubble:{
                type:Boolean,
                default:false
            },
            remote:{
                type:Boolean,
                default:false
            },
            labelKey:{
                type:String,
                default:'label'
            },
            valueKey:{
                type:String,
                default:'value'
            },
            optionsKey:{
                type:String,
                default:'value'
            },
            name:String,
            elementId: {
                type: String
            }
        },
        data () {
            return {
                prefix:selectPrefix,
                options: [],
                optionInstances: [],
                show:false,
                focus:false,
                hover:false,
                checkedAll:false,
                currentPlaceHolder:this.placeholder,
                curStatus:this.status,
                current:this.type==='multiple'?[]:{},//这里存储选中的option
                currentLabel:'',//当前的label
                currentValue:'',//当前的value
                selectedSingle: '', //单选确定的值
                selectedMultiple: [],//多选确定的值
                selectedMultiLabel:'',//用于存储d确定的多选的label字符串
                searchword:'',
                lastSearchword:'',
                notFound:false,
                tooltipContent:'',
                // scrollStyles:{}
            };
        },
        watch: {
            value(val){
                if(this.type==='multiple'){
                    this.currentValue = [];
                    val.forEach((item)=>{
                        this.currentValue.push(item)
                    })
                }else{
                    this.currentValue = val;
                }
                this.resetCurrentValue(true)
            },
            placeholder(val){
                this.currentPlaceHolder = val;
            },
            currentValue(val){
                this.currentText();
                this.checkedAll = (this.type==='multiple'&&(this.currentValue.length===this.options.length))?true:false;
            },
            // currentLabel(val){
            //     this.currentText();
            // },
            selectedMultiLabel(val){
                if(val.length){
                    this.tooltipContent = val.join('、');
                }
            },
            status(val){
                this.curStatus = val;
            },
            type(val){
                this.currentText();
            },
            show(val){
                this.$emit('on-toggle',val);
                if(val){
                    this.$emit('on-show');
                }
            },
            searchword(val){
                if(!this.remote){//不是遠程
                    // 在组件外进行搜索
                    if(this.searchable){
                        this.$emit("on-search",val)
                        return
                    }
                    this.getSearchResult(val);//獲取搜索結果

                    //判斷是否有結果
                    let hidden = true;

                    this.$nextTick(() => {
                        this.findChild((child) => {
                            if (!child.hidden) {
                                hidden = false;
                            }
                        });
                        this.notFound = hidden;
                    });

                }

            }
            // height(val){
            //     if(!!val){
            //         this.getScrollStyles()
            //     }
            // }
        },
        computed: {
            wrapClasses () {
                return [
                    `${selectPrefix}`,
                    {
                        [`${selectPrefix}-${this.type}`]: !!this.type,
                        [`${selectPrefix}-${this.size}`]: !!this.size,
                        [`${selectPrefix}-disabled`]: this.disabled,

                    }
                ];
            },
            selectionClasses(){
                return [
                    `${selectPrefix}-selection`,
                    {
                        ['isFocus']:this.focus
                    }
                ];

            },
            selectionNameClasses(){
                return [
                    `${selectPrefix}-selection-name`,
                    {
                        ['isMultiple']:this.selectedMultiple.length
                    }
                ]
            },
            placeholderClasses(){
                return [
                    `${selectPrefix}-selection-placeholder`,
                ]
            },
            dropClasses () {
                return [
                    `${selectPrefix}-drop`,
                    {
                        [`${selectPrefix}-bubble`]: !!this.bubble,
                        [`${selectPrefix}-drop-${this.align}`]: !!this.align,
                        [`${selectPrefix}-drop-${this.direction}`]: !!this.direction,

                    }
                ];
            },
            checkAllClasses(){
                return [
                    `${selectPrefix}-check-wrap`,
                    {
                        [`${selectPrefix}-check-wrap-disabled`]: !!this.checkRange,

                    }
                ];

            },
            nodataClasses(){
                return [
                    `${selectPrefix}-nodata`
                ];

            },
            listClasses(){
                return [
                    `${selectPrefix}-list`
                ];

            },
            loadingClasses(){
                return [
                    `${selectPrefix}-loading`
                ];

            },
            showDrop(){
                if(this.disabled){
                    return false;
                }
                if(this.show){
                    return true;
                }else{
                    return false;

                }
            },
            transitionName () {
                return this.direction === 'top' ? 'slide-down' : 'slide-up';
            },
        },
        methods: {
            initCurrentValue(){
                if(this.type==='multiple'){
                    this.currentValue = [];
                    this.selectedSingle = [];
                    this.value.forEach((item,index)=>{
                        this.currentValue.push(item)
                        this.selectedSingle.push(item)
                    })
                }else{
                    this.currentValue = this.value;
                    this.selectedSingle = this.value;
                }
            },
            // getScrollStyles(){
            //     if(!!this.height){
            //         this.scrollStyles = {
            //             height:this.height+'px'
            //         }
            //     }else{
            //         this.scrollStyles = {}
            //     }
            // },
            /**
             * 多选中，关闭选择的标签
             * @param 
             */
            closeTag (event,tag) {
                //如果下标存在，更新数据
                if(this.currentValue.indexOf(tag.value)>-1){
                    this.currentValue.splice(this.currentValue.indexOf(tag.value),1);
                    //更新选项状态
                    this.updateMultipleSelected();
                }
                this.$nextTick(()=>{
                    this.handleSubmit();
                })
            },
            handleMenuEnter(){
                this.$nextTick(() => this.updateScroll());
            },
            handleDestroy() {
                // this.$refs.popper && this.$refs.popper.doDestroy();
            },
            updateScroll(){
                if(this.$refs.scrollbar && this.$refs.scrollbar.update && ((typeof this.$refs.scrollbar.update)=='function')){
                    this.$refs.scrollbar && this.$refs.scrollbar.update();
                }
            },
            currentText(){
                if(this.fixTitle){
                    this.currentLabel =  this.title;
                    return;
                }
                if(this.defaultTitle){
                    this.currentLabel = this.defaultTitle;
                }else{
                    this.currentLabel = '';
                }
                //fix bug 当㓟全部选项时，code为空字符串，label需要渲染
                // if(this.currentValue===''){
                //      this.currentLabel = '';
                // }else{
                    if(this.labelInValue&&this.type==='single'){
                        this.findChild((child) => {
                            if (this.currentValue==child.value) {
                                this.currentLabel = child.label;
                            }
                        });
                    }else{
                        // this.currentLabel = this.currentValue;
                        // currentLabel 应该循环选中的并赋值label
                        if(this.type==='single'){
                            this.currentLabel = this.currentValue;
                        }else{
                            this.currentLabel = [];
                            this.findChild((child) => {
                                if (this.currentValue.includes(child.value)) {
                                    this.currentLabel.push(child.label)
                                }
                            });
                        }
                    }
                // }
                if(this.type==='multiple'&&!this.currentValue.length){
                    this.currentLabel = '';
                }
            },
            handleSubmit(){
                if(this.judge){
                    if(this.type==='multiple'&&!!this.checkRange && this.currentValue.length<this.checkRange[0]){
                        return false;
                    }
                    if (this.hybrid) {
                        this.$emit('input', this.currentValue);
                        this.dispatch('FormItem', 'on-form-change', this.selectedMultiple);
                        this.$emit('on-submit', this.selectedMultiple);
                    } else if(this.labelInValue){
                        var emitItem = {};
                        emitItem[this.valueKey] =(this.currentValue)?this.currentValue:[];
                        // 设置currentLabel
                        emitItem[this.labelKey] = (this.currentLabel)?this.currentLabel:[];
                        //emitItem[this.labelKey] = this.currentPlaceHolder;
                        this.$emit('input', this.currentValue);
                        this.dispatch('FormItem', 'on-form-change', emitItem);
                        this.$emit('on-submit', emitItem);
                    }else{
                        this.$emit('input', this.currentValue);
                        this.dispatch('FormItem', 'on-form-change', this.currentValue);
                        this.$emit('on-submit', this.currentValue);
                    }
                    this.toggleDrop();
                }
            },
            resetCurrentValue(isInit){
                if(this.type==='multiple'){
                    this.currentValue = [];
                    this.value.forEach((item)=>{
                        this.currentValue.push(item)
                    })
                    this.updateMultipleSelected(isInit);
                }else{
                    this.updateSingleSelected(isInit);
                }
            },
            handleCancel(){
                this.resetCurrentValue()
                this.toggleDrop();
                this.$emit('on-cancel');
            },
            handleCheckAll(){
                if (this.type==='multiple' && Array.isArray(this.currentValue)) {
                    if(!this.checkedAll){
                        this.currentValue = [];
                    }else{
                        let tempValue = [];
                        for (let i = 0; i < this.options.length; i++) {
                            const option = this.options[i];
                            tempValue.push(option.value);
                        }
                        this.currentValue = tempValue;
                    }
                    this.updateMultipleSelected();
                }
            },
            handleScroll(e){
                e = e || window.event;
                let distance = e.wheelDelta || -e.deltaY || -e.detail;
                let direction = distance && (distance>0 ? "mouseup" : "mousedown") ;
                if(direction === "mousedown") {
                    this.$emit("on-scrollDown",e)
                }
                if(direction === "mouseup") {
                    this.$emit("on-scrollUp",e)
                }
            },
            slotChange(){
                this.options = [];
                this.optionInstances = [];
            },
            toggleDrop(){
                if(this.disabled){
                    return false;
                }
                this.show = !this.show;
                this.focus = !this.focus;
            },
            hideDrop(){
                this.show = false;
                this.focus = false;
            },
            handleClose(){
                
                if(this.type==='multiple'&&this.closeToReset){
                    this.resetCurrentValue()
                }
                this.hideDrop();
            },
            clearSelect(){
                this.currentValue = '';
                this.currentLabel = '';
                if (this.filterable) {
                    this.searchword = '';
                    this.lastSearchword = '';
                }
                if(this.type === 'multiple'){
                    //更新选项状态
                    this.updateMultipleSelected();
                }else{
                    //更新选项状态
                    this.updateSingleSelected();
                }
            },
            getSearchResult(val){
                if (findComponentDownward(this, 'OptionGroup')) {
                    this.broadcast('OptionGroup', 'on-search-change', val);
                    this.broadcast('FormOption', 'on-search-change', val);
                } else {
                    this.broadcast('FormOption', 'on-search-change', val);
                }
                
                this.$nextTick(() => this.updateScroll());
            },
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

                if (this.optionInstances.length) {
                    this.optionInstances.forEach((child) => {
                        find(child);
                    });
                } else {
                    this.$children.forEach((child) => {
                        find(child);
                    });
                }
            },
            updateLabel(){

            },
            updateOptions(slot = false){
                let options = [];
                let index = 1;
                
                this.findChild((child) => {
                    var newItem ={};
                    newItem.value = child.value;
                    newItem.label = (child.label === undefined) ? child.$el.textContent : child.label;
                    options.push(newItem);
                    child.index = index++;

                    this.optionInstances.push(child);
                });

                this.options = options;
                if (!this.remote) {
                    this.updateSingleSelected(true, slot);
                    this.updateMultipleSelected(true, slot);
                }
                this.$nextTick(()=>{
                    if(this.$refs["scrollbar"] && this.$refs["scrollbar"].update && ((typeof this.$refs["scrollbar"].update)=='function')){
                        this.$refs["scrollbar"] && this.$refs["scrollbar"].update();
                    }
                })
            },
            updateSingleSelected (init = false, slot = false) {
                const type = typeof this.value;

                if (type === 'string' || type === 'number') {
                    let findModel = false;
                    for (let i = 0; i < this.options.length; i++) {
                        if (this.currentValue === this.options[i].value) {
                            this.selectedSingle = this.options[i].label;
                            this.currentLabel = this.options[i].label;
                            findModel = true;
                            break;
                        }
                    }

                    if (slot && !findModel) {
                        this.currentValue = '';
                        this.currentLabel = '';
                        this.searchword = this.searchable?this.searchword:'';
                    }
                }
                if(this.currentValue===''){
                    this.currentLabel = (this.defaultTitle)?this.defaultTitle:'';
                    this.searchword = this.searchable?this.searchword:'';
                }

                this.toggleSingleSelected(this.currentValue, init);
            },
            toggleSingleSelected(value, init = false){
                if(this.type!=='multiple'){
                    let label = '';
                    let selectedOptions;
                    
                    this.findChild((child) => {
                        if (child.value === value) {
                            child.selected = true;
                            selectedOptions = child.$options.propsData.option;
                            label = (child.label === undefined) ? child.$el.innerHTML : child.label;
                        } else {
                            child.selected = false;
                        }
                    });
                    
                    // 重复执行了hideDrop
                    //this.searchable?"":this.hideDrop();

                    if (!init) {
                        // if (typeof(this.value)!=='string'&&typeof(this.value)!=='number') {
                        if (this.labelInValue) {
                            var emitItem = {};
                            emitItem[this.valueKey] = value;
                            emitItem[this.labelKey] = label;
                            emitItem[this.optionsKey] = selectedOptions;
                            this.$emit('input', this.currentValue);
                            this.dispatch('FormItem', 'on-form-change', emitItem,true);
                            this.$emit('on-change', emitItem);
                        } else {
                            this.$emit('input', this.currentValue);
                            this.dispatch('FormItem', 'on-form-change', value);
                            this.$emit('on-change', value);
                        }
                    }

                }
            }, 
            /**
             * 更新多选选项数据
             * @param 
             */
            updateMultipleSelected (init = false, slot = false) {
                if (this.type==='multiple' && Array.isArray(this.currentValue)) {
                    let selected = this.remote ? this.selectedMultiple : [];
                     //检查是否有超过选择数目范围，到达范围其余不可选
                    if(!!this.checkRange && this.currentValue.length>=this.checkRange[1]){
                        this.findChild((child) => {
                            if(this.currentValue.indexOf(child.value)>-1){
                                child.forbiden = false;
                            }else{
                                child.forbiden = true;
                            }
                        });
                    }else{
                        this.findChild((child) => {
                            child.forbiden = false;
                        });
                    }
                    for (let i = 0; i < this.currentValue.length; i++) {
                        const model = this.currentValue[i];

                        for (let j = 0; j < this.options.length; j++) {
                            const option = this.options[j];

                            if (model === option.value) {
                                var editItem = {};
                                editItem.value =  option.value
                                editItem.label =  option.label
                                selected.push(editItem);
                            }
                        }
                    }

                    const selectedArray = [];
                    const selectedObject = {};
                    this.selectedMultiLabel = [];//已选中的label数组，用于渲染tooltip显示

                    selected.forEach(item => {
                        if (!selectedObject[item.value]) {
                            selectedArray.push(item);
                            this.selectedMultiLabel.push(item.label);
                            selectedObject[item.value] = 1;
                        }
                    });
                    
                    // this.selectedMultiLabel = this.selectedMultiLabel.join("、");
                    if(!this.judge){
                        this.currentLabel = this.selectedMultiLabel.join(",");

                    }

                    // #2066
                    //设置显示的标签渲染数据，
                    this.selectedMultiple = this.remote ? this.currentValue.length ? selectedArray : [] : selected;

                    if (slot) {
                        let selectedModel = [];

                        for (let i = 0; i < selected.length; i++) {
                            selectedModel.push(selected[i].value);
                        }

                        // if slot change and remove a selected option, emit user
                        if (this.currentValue.length === selectedModel.length) {
                            // this.slotChangeDuration = true;
                        }

                        this.currentValue = selectedModel;
                    }
                    this.toggleMultipleSelected(this.currentValue, init);
                }
            },
            // to select option for multiple
            toggleMultipleSelected (value, init = false) {
                if (this.type==='multiple') {
                    let hybridValue = [];
                    let hyitem = {};
                    var vm = this;
                    for (let i = 0; i < value.length; i++) {
                        hyitem = {};
                        hyitem[vm.valueKey] = value[i]
                        hybridValue.push(hyitem);
                    }

                    this.findChild((child) => {
                        const index = value.indexOf(child.value);

                        if (index >= 0) {
                            child.selected = true;
                            hybridValue[index].label = (child.label === undefined) ? child.$el.innerHTML : child.label;
                        } else {
                            child.selected = false;
                        }
                    });

                    if (!init&&!this.judge) {
                        if (this.hybrid) {
                            this.$emit('input', this.currentValue);
                            this.dispatch('FormItem', 'on-form-change', hybridValue);
                            this.$emit('on-change', hybridValue);
                        } else if(this.labelInValue){
                            var emitItem = {};
                            emitItem[this.valueKey] =(value)?value:[];
                            emitItem[this.labelKey] = this.currentPlaceHolder;
                            this.$emit('input', this.currentValue);
                            this.dispatch('FormItem', 'on-form-change', emitItem);
                            this.$emit('on-change', emitItem);
                        }else{
                            this.$emit('input', this.currentValue);
                            this.dispatch('FormItem', 'on-form-change', value);
                            this.$emit('on-change', value);
                        }
                    }
                }
            },
            appendChange(){
                return debounce(function(){
                    /**
                     * 2018/11/27 huangl add
                     * 当选择内容改变，但是watch value 没有触发时（value不变时），重置当前currentValue
                     */
                    this.currentValue = this.value;

                    if(!this.remote){//非远程调用

                    }else{//远程调用
                        this.findChild((child) => {
                            // child.updateSearchLabel();  
                            child.selected = this.type==='multiple' ? this.currentValue.indexOf(child.value) > -1 : this.currentValue === child.value;
                        });
                    }
                    this.slotChange();
                    this.updateOptions(true);
                });
            },
            /**
             * handle select option 
             * @param  option
             * 操作currentValue变量
             */
            handleSelect(option){
                //当选中当前已经选中的，关闭下拉选框，不响应其他操作
                if(this.currentValue===option.value){
                    this.hideDrop();
                }else{
                    //当多选时
                    if(this.type==='multiple'){
                        //获取当前选中数组
                        const index = this.currentValue.indexOf(option.value);
                        if (index >= 0) {
                            this.currentValue.splice(this.currentValue.indexOf(option.value),1);
                        } else {
                            this.currentValue.push(option.value);
                        }
                        //检查是否有超过选择数目范围，到达范围其余不可选
                        if(!!this.checkRange && this.currentValue.length>=this.checkRange[1]){
                            this.findChild((child) => {
                                if(this.currentValue.indexOf(child.value)>-1){
                                    child.forbiden = false;
                                }else{
                                    child.forbiden = true;
                                }
                            });
                        }else{
                            this.findChild((child) => {
                                child.forbiden = false;
                            });
                        }
                        //设置全选标志，判断是否全选
                        this.checkedAll = (this.currentValue.length===this.options.length)?true:false;
                        //更新选项状态
                        this.updateMultipleSelected();
                    }else{
                        //单选时，设置当前选中
                        this.currentValue = option.value;
                        //更新选项状态
                        this.updateSingleSelected();
                        //关闭选框
                        this.hideDrop();
                    }
                }
            },
            intiDisabled() {
                if(!!this.checkRange && this.currentValue.length>=this.checkRange[1]){
                    this.findChild((child) => {
                        if(this.currentValue.indexOf(child.value)>-1){
                            child.forbiden = false;
                        }else{
                            child.forbiden = true;
                        }
                    });
                }else{
                    this.findChild((child) => {
                        child.forbiden = false;
                    });
                }
            }
        },
        mounted(){
            this.initCurrentValue();
            this.$nextTick(()=>{
                this.updateOptions();
                this.currentText();
                this.$on('on-select', this.handleSelect);
                this.$on('append', this.appendChange());
                this.$on('remove', this.appendChange());
                this.intiDisabled();
            })
        },
        created(){
            // this.getScrollStyles();
        }
    };
</script>
