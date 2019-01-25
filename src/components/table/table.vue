<template>
    <div :class="wrapClasses">
        <div v-if="!!title" :class="[prefix + '-title']" ref="title"><slot name="title">{{title}}</slot></div>
        <div  :class="tableClasses">
            <div v-if="!hiddenThead" :class="[prefix + '-header']" ref="header" :style="headerStyle">
                <slot name="header">
                    <table v-if="!!headerShow" :border="border" :cellpadding="cellpadding" :cellspacing="cellspacing">                        
                        <thead>
                            <tr>
                                <th v-for="(item,index) in thead" :key="index" :style="cellStyles(index,true)" :class="cellClasses(item)" @click="sorting(index)">
                                    <div class="cell">
                                        <template v-if="!!multiSelect&&!!item.type&&item.type==='selection'">
                                            <span class="checkbox-wrap" :class="{active:(selectedAll)}" @click="checkAll">
                                                <span class="checkbox"></span>
                                            </span>
                                        </template>
                                        <template v-else-if="!!expand&&!!item.type&&item.type==='expand'">
                                            
                                        </template>
                                        <template v-else>                                          
                                            <span class="" v-html="item.name"></span>
                                            
                                            <Tooltip v-if="item.tips" :content="item.tips" class="tips-wrap">
                                                <Icon type="ios-information-outline" slot="target"></Icon>    
                                            </Tooltip>
                                        </template>
                                        <span v-if="item.sort" class="sort-wrap">
                                            <Icon type="sort-up" :class="{up:true,active: currentSort === 'asc'&& currentSortType===item.column}"></Icon>
                                            <Icon type="sort-down" :class="{down:true,active: currentSort === 'desc'&& currentSortType===item.column}"></Icon>
                                        </span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                    </table>
                </slot>
            </div>
            <div :class="[prefix + '-body']" ref="body" :style="bodyStyles">
                <slot name="body">
                    <table :border="border" :cellpadding="cellpadding" :cellspacing="cellspacing">
                        <tbody>
                            <slot name="tr">
                                <template v-if="data.length > 0">         
                                    <template v-for="(item,index) in data">                                                                                                            
                                        <tr @click="clickTr(index)" :key="index" :class="{active:(currentRow===index)}">
                                            <td v-for="(itm,i) in thead" :key="i" :style="cellStyles(i,false,item)">
                                                
                                                <div class="cell">    
                                                    
                                                    <template v-if="!!order&&i===0">
                                                        <span>{{index+1}}</span>
                                                    </template>
                                                    <template v-else-if="!!multiSelect&&i===0">
                                                        <span class="checkbox-wrap" :class="{active:(currentMultiSelected.indexOf(index)>-1)}" @click="checkTr(index)">
                                                            <span class="checkbox"></span>
                                                        </span>
                                                    </template>
                                                    <template v-else-if="!!expand&&i===0">
                                                        <span class="expand-warp" :class="{expanded:currentExpandShow.indexOf(index)>-1}">
                                                            <Icon type="arrow-right"></Icon>
                                                        </span>
                                                    </template>
                                                    <template v-if="itm.render">
                                                        <Cell                                                       
                                                            :row="item"
                                                            :column="itm"
                                                            :index="index"
                                                            :render="itm.render">
                                                        </Cell>
                                                    </template>
                                                    <template v-else>
                                                        <span v-if="tableFormatter"> {{tableFormatter(item[itm.column], item, itm.column)}}</span>
                                                        <span v-else v-html="item[itm.column]"></span>
                                                    </template>
                                                </div>  
                                            </td>
                                        </tr>
                                        <tr v-if="!!expand&&(currentExpandShow.indexOf(index)>-1)" :key="index+'_expand'" :class="[prefix + '-expand']">
                                            <td :colspan="thead.length">
                                                <Expand :key="index" :row="item" :render="getExpandRender" :expandedIndexs="currentExpandShow" :index="index"></Expand>
                                            </td>
                                        </tr>
                                    </template>                                    
                                </template>  
                                <template v-else>
                                    <tr>
                                        <td :span="thead.length" :class="[prefix + '-td-nodata']">
                                            <slot name="nodata">
                                                <NoData fix  :class="[prefix + '-td-nodata-body']">暂无数据</NoData>
                                            </slot>  
                                        </td>  
                                    </tr>                                
                                </template>                               
                                <template v-if="showSum">
                                    <slot name="sum">
                                    </slot>
                                </template>
                            </slot>
                        </tbody>
                    </table>
                </slot>
                <slot name="loading"><Loading fix v-if="loading" :icon="loadIcon"></Loading></slot>
            </div>
            <div :class="[prefix + '-footer']" ref="footer">
                <slot name="footer">
                </slot>
            </div>
        </div>
    </div>
    
</template>
<script>
    import { oneOf, getStyle, deepCopy, getScrollBarSize } from '../../utils/assist';
    import Expand from './expand.js';
    import Cell from './table-cell';
    import Icon from '../icon';
    import ColorGrads from '../../utils/colorGrad';
    import { prefix } from '../var';
    const tablePrefix = prefix+'table';
    export default {
        name: 'Table',
        components: { Expand, Cell, Icon},
        props: {
            type:{
                type:String,
                validator (value) {
                    return oneOf(value, ['strip','zebra', 'bordered']);
                }
            },
            size: {
                validator (value) {
                    return oneOf(value, ['small', 'large']);
                }
            },
            colorGrads:{
                type:[String, Array, Boolean],
                default:false
            },
            gradsRef:{
                type:Number,
                default:1
            },
            tableFormatter:{
                type:Function,
                default:null
            },
            loading:{
                type:Boolean,
                default:false
            },
            loadIcon:{
                type:String,
                default:'loading'
            },
            headerShow:{
                type:Boolean,
                default:true
            },
            order:{
                type:Boolean,
                default:false
            },
            clickable:{
                type:Boolean,
                default:false
            },
            multiSelect:{
                type:Boolean,
                default:false
            },
            showSum:{
                type:Boolean,
                default:false,
            },
            expand:{
                type:Function
            },
            expandedIndexs:{
                type:Array,
                default(){
                    return []
                }
            },
            autoExpand:{
                type:Boolean,
                default:false
            },
            multiSelectedIndexs:{
                type:Array,
                default(){
                    return []
                }
            },
            title:{
                type:String
            },
            hiddenThead:{
                type:Boolean,
                default:false
            },
            thead:{
                type:Array,
                default(){
                    return [];
                }
            },
            data:{
                type:Array,
                default(){
                    return [];
                }
            },
            width: {
                type: [Number, String]
            },
            height: {
                type: [Number, String]
            },
            sortType:{
                type:String
            },
            sort:{
                type:String,
                default:'desc' 
            },
            border:{
                type:Number,
                default:0
            },
            cellpadding:{
                type:Number,
                default:0
            },
            cellspacing:{
                type:Number,
                default:0
            }
        },
        data () {
            return {
                prefix : tablePrefix,
                currentSortType:this.sortType,
                currentSort:this.sort,
                currentRow:-1,
                currentMultiSelected:this.multiSelectedIndexs ? this.multiSelectedIndexs : [],
                selectedAll:false,
                currentExpandShow:(this.expandedIndexs&&this.expandedIndexs.length)?this.expandedIndexs:[],
                scrollBarWidth: getScrollBarSize(),
                headerStyle:{},
            };
        },
        computed: {
            getExpandRender () {
                let render = function () {
                    return '';
                };
                if(this.expand){
                    render = this.expand;
                }
                return render;
            },
            wrapClasses () {
                return [
                    `${tablePrefix}-wrap`
                ];
            },
            tableClasses(){
                return [
                    `${tablePrefix}`,
                    {
                        [`${tablePrefix}-${this.type}`]: !!this.type,
                        [`${tablePrefix}-clickable`]: !!this.clickable||!!this.expand,
                        [`${tablePrefix}-fixed-title`]: !!this.height,
                    }
                ];
            },
            bodyStyles(){
                let style ={};
                if(!!this.height){
                    const headerHeight = (this.$refs.header)?this.$refs.header.offsetHeight:0;
                    style.height = `${this.height-headerHeight}px`;
                    style.overflow = 'auto';
                }
                return style;
            },
        }, 
        watch:{
            loading(val){
                this.selectedAll = false;
                if(!val&&this.data.length > 0){
                    this.resetExpands();  
                }
            },
            height(){
                this.getHeaderStyles();
            },
            expandedIndexs(val) {
                this.currentExpandShow = val;
                if(this.autoExpand){
                    this.resetExpands()
                }
            },
            multiSelectedIndexs(val) {
                this.currentMultiSelected = val;
            },
            sortType(val){
                this.currentSortType = val;
                this.currentSort = 'desc';
            }
        },
        methods: {
            resetExpands(){
                if(!this.currentExpandShow.length){
                    return false;
                }
                for(let i = 0;i<this.currentExpandShow.length;i++){
                    this.$emit('on-expand-open',this.currentExpandShow[i]);
                }
            },
            getHeaderStyles(){
                let style = {};
                if(!!this.height){
                    style.paddingRight = `${this.scrollBarWidth}px`;
                }
                this.headerStyle = style;
            },
            cellStyles(index,isTh,item){
                if(this.colorGrads !== false && item){
                    var options = null;
                    if(typeof this.colorGrads === 'object'){
                       options = {
                           'StartColor': this.colorGrads.length > 1 ? this.colorGrads[0] :'#fff',
                            'EndColor': this.colorGrads.length > 1 ? this.colorGrads[1] : this.colorGrads[0]
                       }
                    }else if(typeof this.colorGrads === 'string'){
                        options = {
                            'StartColor': '#fff',
                            'EndColor': this.colorGrads
                       }
                    }else{
                        options = {};
                    }                                        
                    if(this.thead[index] && item){
                        var colors_g = new ColorGrads(options).Create();    
                        var percent = isNaN(Math.round(item[this.thead[index].column] / this.gradsRef *100))? 0 : Math.round(item[this.thead[index].column] / this.gradsRef *100);                        
                            percent = percent > 100 ? 100 : percent;
                   }   
                };
                return {
                    background:(this.colorGrads!==false && item && this.thead[index].colorGrads) ? "rgb(" + colors_g[percent].join(",") + ")":"rgba()",                    
                    width:(!!this.thead[index].width)?(this.thead[index].width+'px'):'initial',
                    cursor:(isTh&&this.thead[index].sort)?'pointer':'default',
                    textAlign:(this.thead[index].align)?this.thead[index].align:'left',
                };
            },
            cellClasses(item){
                return item.class?item.class:[]
            },
            sorting(index){
                if(!this.thead[index].sort){
                    return false;
                }
                if(this.currentSortType === this.thead[index].column){
                    this.currentSort = (this.currentSort==='desc')?'asc':'desc';
                }else{
                    this.currentSortType = this.thead[index].column;
                    this.currentSort = 'desc';
                }
                this.currentExpandShow = [];
                this.$emit('on-sorting',this.currentSortType,this.currentSort);
            },
            clickTr(index){
                if(!this.clickable){
                    return false;
                }
                this.currentRow = index;
               
                this.$emit('on-click-row',index);
            },
            checkAll(){
                if(!this.multiSelect){
                    return false;
                }
                this.selectedAll = !this.selectedAll;
                this.currentMultiSelected = [];
                if(this.selectedAll){
                    for(var i = 0;i<this.data.length;i++){
                        this.currentMultiSelected.push(i);
                    }

                }
                this.$emit('on-check-all',this.selectedAll,this.currentMultiSelected);
            },
            checkTr(index){
                if(!this.multiSelect){
                    return false;
                }
                if(this.currentMultiSelected.indexOf(index)>-1){
                    this.currentMultiSelected.splice(this.currentMultiSelected.indexOf(index),1);
                }else{
                    this.currentMultiSelected.push(index);
                }
                this.selectedAll = ((this.currentMultiSelected.length===this.data.length))?true:false;
                this.$emit('on-check-row',this.currentMultiSelected);
            }
        },
        mounted() {
            this.getHeaderStyles();   
                   
        }
    };
</script>
