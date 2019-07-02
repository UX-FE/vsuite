<template>
    <transition name="fade">
        <ul :class="wrapClasses">
            <li>
                <div :class="titleWrapClasses" @click.stop="clickTitle" :style="titleStyle">
                    <span :class="[prefix+'-arrow']">
                        <Icon v-if="node.childs&&node.childs.length" :type="iconType" :class="{expanded:expanded}"></Icon>
                    </span>
                    <i v-if="checkable" :class="[unCheckIcon?'unCheckIcon vsu-ion vsu-ion-'+unCheckIcon:prefix+'-check-box']" @click.stop="handleCheck"></i>
                    <span :class="[prefix+'-title']" :title="node.title+(node.length!==undefined?('（'+node.length+'）'):'')">
                        {{node.title}}
                        <span :class="[prefix+'-length']" v-if="node.length!==undefined">（{{node.length}}）</span>
                        <!-- <slot>{{node.title}}</slot> -->
                    </span>
                    <!-- <template v-if="checkable">
                        <span :class="[prefix+'-title']">
                            <slot>{{node.title}}</slot>
                        </span>

                        <Checkbox :value="checked" @on-change="handleCheck" :disabled="disabled"><span :class="[prefix+'-title']">
                            <slot>{{node.title}}={{checked}}</slot></span>
                        </Checkbox>
                    </template>
                    <template v-else> -->
                        
                    <!-- </template> -->
                </div>
                <!-- 此处应该用显示隐藏的方式，原因：比如，用v-if的方式，选中父节点，找不到子节点，就不会进行子节点选中遍历 -->
                <!-- <div v-if="expanded" :class="bodyWrapClasses"> -->
                <div :class="bodyWrapClasses" :style="{display: expanded?'block':'none'}" v-if="node.childs">
                    <TreeNode v-for="(itm,i) in node.childs" :key="i" :node="itm" :level="level+1" :disabled="itm.disabled" 
                        :expand="itm.expand" :check="itm.check">
                    </TreeNode>
                </div>
            </li>
        </ul>
    </transition>
</template>
<script>
    import Icon from '../icon';
    import Emitter from '../../mixins/emitter';
    import { findComponentUpward } from '../../utils/assist';
    import { prefix } from '../var';
    const treeNodePrefix = prefix+'tree-node';
    export default {
        name: 'TreeNode',
        componentName: 'TreeNode',
        components:{Icon},
        mixins: [ Emitter ],
        props: {
            level:{
                type:[String,Number]
            },
            node:{
                type:Object,
                default(){
                    return {};
                }
            },
            expand:{//展开
                type:Boolean,
                default:false
            },
            check:{//选中
                type:Boolean,
                default:false
            },
            disabled:{//禁止
                type:Boolean,
                default:false
            }
        },
        data () {
            return {
                prefix:treeNodePrefix,
                expanded:this.expand,
                checkable:false,
                unCheckIcon: false,
                checked:this.check,
                // selected:false,
                // accordion:false,
                data:this.node,
                iconType:'triangle-down'
            };
        },
        computed: {
            wrapClasses () {
                return [
                    `${treeNodePrefix}`,
                    {
                        [`${treeNodePrefix}-disabled`]:this.disabled
                    }
                ];
            },
            titleWrapClasses () {
                return [
                    `${treeNodePrefix}-title-wrap`,
                    {
                        [`${treeNodePrefix}-title-active`]:this.selected,
                        [`${treeNodePrefix}-title-check`]:this.checked
                    }
                ];
            },
            arrowClasses(){
                return `${treeNodePrefix}-title-arrow`;
            },
            titleClasses () {
                return `${treeNodePrefix}-title`;
            },
            bodyWrapClasses () {
                return `${treeNodePrefix}-body`;
            },
            titleStyle(){
                return {
                    'padding-left':(18*this.level)+'px'
                }
            }
        }, 
        watch:{
            'check'(check){
                if(check===false){
                    this.checked = false
                }
            }
        },
        methods: {
            // 寻找当前节点下符合条件的所有节点
            findChild (cb) {
                const find = function (child) {
                    const name = child.$options.componentName;
                    if(name){
                        cb(child);
                    }
                    if(child.$children.length){
                        child.$children.forEach((innerChild) => {
                            find(innerChild, cb);
                        });
                    }
                };
                this.$children.forEach((child) => {
                    find(child);
                });
            },
            // 寻找当前节点上符合条件的所有父节点
            findParent (cb){
                const find = function(parent,cb){
                    let checked = true
                    parent.$children.forEach((child) => {
                        const name = child.$options.componentName;
                        if(name){
                            if(child.checked===false){
                                checked = false
                            }
                        }
                    });
                    cb(parent,checked)

                    if(parent.$parent){
                        find(parent.$parent,cb)
                    }
                }
                find(this.$parent,cb)
            },
            handleCheck(){
                this.checked = !this.checked;
                // 选中/不选中下面的子节点
                this.findChild((child) => {
                    child.checked = this.checked;
                    this.dispatch('Tree', 'on-check', child);
                });
                this.dispatch('Tree', 'on-check', this);
                // 选中/不选中上面的父节点
                this.$nextTick(()=>{
                    this.findParent((parent,checked) => {
                        parent.checked = checked  
                        this.dispatch('Tree', 'on-check', parent);
                    });
                })
            },
            clickTitle(){
                this.expanded = !this.expanded;
                // 以下方法先禁掉，当前业务无需此功能，并且此功能没有写完全
                // this.selected = !this.selected;
                // if(this.expanded&&this.accordion){
                    
                // }
                // this.dispatch('Tree', 'on-click', this);
            }
        },
        mounted() {
            const Tree = findComponentUpward(this, 'Tree');
            if (Tree){
                this.checkable = Tree.checkable&&!this.node.disabled;
                this.unCheckIcon = Tree.unCheckIcon?Tree.unCheckIcon:false
                this.iconType = Tree.iconType;
                // this.accordion = Tree.accordion;
                if(!!Tree.defaultExpanded&&Tree.defaultExpanded.length&&Tree.defaultExpanded.indexOf(this.node.id)>-1){
                    this.expanded = true;
                }
                if(!!Tree.defaultChecked&&Tree.defaultChecked.length&&Tree.defaultChecked.indexOf(this.node.id)>-1){
                    this.checked = true;
                }
            }
            if(this.checkable&&this.$parent.checked){
                this.checked = true;
            }
        }
    };
</script>
