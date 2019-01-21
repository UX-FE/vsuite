<template>
    <div :class="classes" :style="styles">
        <Icon :type="icon" v-if="icon"></Icon>
        <span ref="name" :class="[prefix + '-name']" v-else>
            <slot></slot>
        </span>
    </div>
</template>
<script>
    import { oneOf } from '../../utils/assist'
    import { prefix } from '../var';
    const avatarPrefix = prefix+'avatar';
    export default {
        name: 'Avatar',
        props: {
            type:{
                type:String,
                default:'circle',
                validator (value) {
                    return oneOf(value, ['circle', 'square', 'noback'])
                }
            },
            icon:String,
            scale:{
                type:[Number,String],
                defa:1
            }
        },
        data(){
            return  {
                prefix:avatarPrefix
            }
        },
        computed: {
            classes () {
                return [
                    `${avatarPrefix}`,
                    `${avatarPrefix}-${this.type}`,
                    {
                        [`${avatarPrefix}-icon`]: !!this.icon
                    }
                ];
            },
            styles(){
                return {
                    'transform': ('scale('+this.scale+')')
                }
            },
        }
    };
</script>