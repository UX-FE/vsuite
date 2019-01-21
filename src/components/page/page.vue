<template>
    <div :class="wrapClasses" v-if="pages.totalPages>0">
        <div v-if="showOpts&&optsPosition==='left'&&pages.totalCount>10" :class="infoClasses">
            <Select v-model="currentPageSize" @on-change="handleSelect" :direction="optsDirection">
                <span slot="selection-name">{{currentOptsLabel}}</span>
                <Option v-for="(item,index) in pageOpts" :key="index" :option="item">
                </Option>
            </Select>
        </div>
        <ul :class="pagingClasses">
            <li v-if="currentPage!==1" :class="[prefix + '-pre']" @click="pre">
                <slot name="pre"><span><Icon class="arrow-left"></Icon></span></slot>
            </li>
            <li v-if="totalPages>0" :class="pageClasses(1)" @click="page(1)"><span>1</span></li>
            <li v-if="showPrevMore" :class="[prefix + '-prefold']" @click="preFold">
                <span class="fold-body"><slot name="prefold"><Icon class="arrow-double-left"></Icon></slot></span>
            </li>
            <li v-for="pager in pagesArray" :key="pager" :class="pageClasses(pager)"  @click="page(pager)">
                <span>{{ pager }}</span>
            </li>
            <li v-if="showNextMore" :class="[prefix + '-nextfold']" @click="nextFold">
                <span class="fold-body"><slot name="nextfold"><Icon class="arrow-double-right"></Icon></slot></span>
            </li>
            <li v-if="totalPages>1" :class="pageClasses(totalPages)" @click="page(totalPages)"><span>{{totalPages}}</span></li>
            <li v-if="currentPage!==totalPages" :class="[prefix + '-next']" @click="next">
                <slot name="next"><span><Icon class="arrow-right"></Icon></span></slot>
            </li>
        </ul>
        <div v-if="showOpts&&optsPosition==='middle'&&pages.totalCount>10" :class="infoClasses">
            <Select v-model="currentPageSize" @on-change="handleSelect" :direction="optsDirection"> 
                <span slot="selection-name">{{currentPageSize+'条/页'}}</span>
                <Option v-for="(item,index) in pageOpts" :key="index" :option="item">
                </Option>
            </Select>
        </div>
        <div v-if="showJump&&totalPages>1&&totalPages>1" :class="jumpClasses">
            <div :class="[prefix + '-edit']">
                <slot name="pre-jump">跳至</slot><input class="pageEdit" v-model="editPage" autocomplete="off" spellcheck="false" @keyup.enter="jumpPage(editPage)"><slot name="next-jump">页</slot>
            </div>
            <div v-if="jumpBtn" :class="[prefix + '-search']" @click="jumpPage(editPage)">
                {{jumpBtn}}
            </div>
        </div>
        <div v-if="showOpts&&optsPosition==='right'" :class="infoClasses">
            <Select v-model="currentPageSize" @on-change="handleSelect">
                <Option v-for="(item,index) in pageOpts" :key="index" :option="item">
                </Option>
            </Select>
        </div>
    </div>
</template>
<!--
    page:{
		"limit": 10,//一页显示多少条
		"slider": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],//分页数组
		"lastPage": false,//是否是最后一页
		"hasNextPage": true,//是否有下一页
		"nextPage": 2,//下一页
		"hasPrePage": false,//是否有上一页
		"endRow": 10,//当前页结束行标
		"prePage": 1,//上一页
		"totalCount":102,//总数
		"page": 1,//当前页
		"startRow": 1,//当前页开始行标
		"firstPage": true,//是否第一页
		"offset": 0,//与第一页的便宜
		"totalPages": 10//总页数
    }
-->
<script>
    import Icon from '../icon';
    import Select from '../select';
    import { findComponentUpward, oneOf } from '../../utils/assist';
    import { prefix } from '../var';
    const pagePrefix = prefix+'page';

    export default {
        name: 'Page',
        props: {
            current:{
                type:[Number,String],
                default:1
            },
            pageSize:{
                type:Number,
                default:10
            },
            pageOpts:{
                type:Array,
                default(){
                    return [10,20,30,40]
                }
            },
            optsDirection:{
                type:String,
                default:'bottom',
            },
            optsPosition:{
                type:String,
                default:'middle',
                validator (value) {
                    return oneOf(value, ['left', 'middle','right']);
                }
            },
            noborder:{
                type:Boolean,
                default:false
            },
            type:{
                type:String,
                default:'',
                validator (value) {
                    return oneOf(value, ['', '']);
                }
            },
            size:{
                type:String,
                validator (value) {
                    return oneOf(value, ['small', 'large']);
                }
            },
            pages:{
                type:Object,
                required:true,
                default(){
                    return {};
                }
            },
            showOpts:{
                type:Boolean,
                default:false
            },
            showJump:{
                type:Boolean,
                default:false
            },
            jumpBtn:String
        },
        data () {
            return {
                prefix:pagePrefix,
                currentPage:parseInt(this.current),
                currentPageSize:this.pageSize,
                editPage:'',
                currentOptsLabel:'',
                showPrevMore:false,
                showNextMore:false,
            };
        },
        computed: {
            pagesArray(){
                //默认最多显示7个页
                const pagerCount = 7;

                const currentPage = Number(this.currentPage);
                const totalPages = Number((this.pages.totalPages!==undefined)?this.pages.totalPages:0);

                let showPrevMore = false;
                let showNextMore = false;

                if(totalPages>pagerCount){//总页数大于7
                    if(currentPage>pagerCount-3){//当前页大于4，前省略显示
                        showPrevMore = true;
                    }
                    if(currentPage<totalPages-3){//当前页小于倒数第4页，后省略显示
                        showNextMore = true;
                    }
                }
                const pageArray = [];

                if(showPrevMore && !showNextMore){//页数大于7，且当前页大于4,且当前页在倒数的4页之中，因此显示第一页和后6页
                    const startPage = totalPages - (pagerCount-2);//除开第一页和最后一页，总共显示5页，因此开始页是倒数第6页，
                    for(let i = startPage;i<totalPages;i++){
                        pageArray.push(i);
                    }

                }else if(!showPrevMore && showNextMore){//当页数大于7，且当前页在前4页，因此显示前6页和最后一页
                    for(let i = 2;i< pagerCount;i++){//第一页为2
                        pageArray.push(i);
                    }
                }else if(showPrevMore && showNextMore){//当处于中间，前后都需要省略时，
                    const offset = Math.floor(pagerCount/2)-1;//开始页是显示总页数的第一页，计算偏移
                    for(let i = currentPage-offset;i<=currentPage+offset;i++){
                        pageArray.push(i);
                    }
                }else{//当省略都不能显示时，表示当前页数小于8个
                    for(let i = 2;i<totalPages;i++){
                        pageArray.push(i);
                    }
                }

                this.showPrevMore = showPrevMore;
                this.showNextMore = showNextMore;

                return pageArray;

            },
            totalPages () {
                return (this.pages.totalPages!==undefined)?this.pages.totalPages:0
            },
            wrapClasses () {
                return [
                    `${pagePrefix}`,
                    {
                        [`${pagePrefix}-noborder`]: !!this.noborder,
                        [`${pagePrefix}-${this.size}`]: !!this.size,
                        [`${pagePrefix}-${this.type}`]: !!this.type
                    }
                ];
            },
            infoClasses () {
                return `${pagePrefix}-info`;
            },
            pagingClasses () {
                return `${pagePrefix}-paging`;
            },
            jumpClasses(){
                return `${pagePrefix}-jump`;

            }
        },
        mounted () {
            this.currentOptsLabel = this.currentPageSize+'条/页';

        },
        methods: {
            pageClasses (page) {
                return [
                    `${pagePrefix}-item`,
                    {
                        [`${pagePrefix}-item-active`]:(parseInt(page)===parseInt(this.currentPage))
                    }
                ];
            },
            handleSelect(val){
                this.currentOptsLabel = val+'条/页';
                this.$emit("on-change-size", val);
            },
            page (page) {
                if(this.currentPage!=page){
                    this.currentPage = parseInt(page);
                    this.$emit('on-change',page);
                }
            },
            jumpPage(page){
                if(isNaN(page)||!page||(page>this.totalPages)||(page<1)){
                    this.editPage = ''
                    return false
                }
                this.page(page);
                this.editPage = ''
            },
            pre () {
                if(this.currentPage<=1){
                    return false;
                }
                this.page(this.currentPage - 1);
            },
            next () {
                if(this.currentPage>=this.totalPages){
                    return false;
                }
                this.page(this.currentPage + 1);
            },
            preFold (){
                if(this.currentPage-5>0){
                    this.page(this.currentPage-5);
                }else{
                    this.page(1);
                }
            },
            nextFold (){
                if(this.currentPage+5>this.totalPages){
                    this.page(this.totalPages);
                }else{
                    this.page(this.currentPage+5);
                }
                
            }
        },
        watch:{
            current (val) {
                this.currentPage = val;
            },
            pageSize (val) {
                this.currentPageSize = val;
            }
        }
    };
</script>
