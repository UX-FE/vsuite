<template>
    <div :class="classes">
        <slot ></slot>
    </div>
</template>
<script>
    import Tag from './tag';
    import { oneOf } from '../../utils/assist';
    import { prefix } from '../var';
    const tagGroupPrefix = prefix+'tag-group';

    export default {
        name: 'TagGroup',
        props: {
            tags:{//tags数据
                type:Array,
                default:[]
            },
            custom:{//是否自定义tag
                type:Boolean,
                default:false
            },
            deraction: {//方向
                type: String,
                default: 'horizontal',
                validator (value) {
                    return oneOf(value, ['horizontal', 'vertical']);
                }
            }
        },
        computed: {
            classes () {
                return [
                    `${tagGroupPrefix}`,
                    {
                        [`${tagGroupPrefix}-${this.deraction}`]: !!this.deraction
                    }
                ];
            }
        },
        methods:{
            closeTag (event,tag) {
                let closeIndex;
                for(var i = 0;i<this.tags.length;i++){
                    if(this.tags[i].name===tag.name){
                        closeIndex = i;
                    }
                }
                if(closeIndex!==undefined){
                    this.tags.splice(closeIndex,1);
                    this.$emit('on-close-tag', event);
                }
            }
        }
    };
</script>
