<template>
    <div :class="wrapClasses">
        <TreeNode v-for="(item,index) in tree" :key="index" :node="item" :level=0 
            :disabled="item.disabled" :expand="item.expand" :check="item.check">
        </TreeNode>
    </div>
</template>
<script>
    import { prefix } from '../var';
    const treePrefix = prefix+'tree';
    export default {
        name: 'Tree',
        props: {
            tree:{
                type:Array,
                default(){
                    return [];
                }
            },
            checkable:{
                type:Boolean,
                default:false
            },
            // accordion:{
            //     type:Boolean,
            //     default:false
            // },
            // minChecked:{
            //     type:Number
            // },
            // maxChecked:{
            //     type:Number
            // },
            iconType:{
                type:String,
                default:'triangle-down'
            },
            unCheckIcon:{
                type:String | Boolean,
                default:false
            }
        },
        data () {
            return {
                //data:this.tree,
                //checkArray:[]
            };
        },
        computed: {
            wrapClasses () {
                return `${treePrefix}`;
            }
        }, 
        methods: {
            // 以下方法先禁掉，当前业务无需此功能，并且此功能没有写完全
            // 寻找当前节点下符合条件的所有节点
            /*findChild (cb) {
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
            handleClickNode(node){//点击节点时，选中当前节点
                this.findChild((child) => {
                    child.selected = false;
                });
                node.selected = true;
                this.$emit("on-click-node",node.data);
            },*/
            handleCheckNode(node){
                // 应该把node传出去，checkArray暂时未被使用,应该传node出去设置check
                this.$emit("on-check-node",node);
                //this.$emit("on-check-node",this.checkArray);
            }
        },
        mounted() {
            // 以下方法先禁掉，当前业务无需此功能，并且此功能没有写完全
            //this.$on('on-click', this.handleClickNode);
            this.$on('on-check', this.handleCheckNode);
        }
    };
</script>
