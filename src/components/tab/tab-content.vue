<template>
    <div :class="tabcontentClasses" v-show="show">
        <slot></slot>
    </div>
</template>
<script>
    import { prefix } from '../var';
    const tabcontentPrefix = prefix+'tab-content';

    export default {
        name: 'TabContent',
        props: {
            name: {
                type: [String,Number],
                required:true
            },
            label:{
                type:[String,Number],
                required:true
            },
            icon:{
                type:String
            }
        },
        data () {
            return {
                show: true,
                currentName: this.name
            };
        },
        computed: {
            tabcontentClasses(){
                return `${tabcontentPrefix}`;
            },
        },
        methods: {
            updateTab () {
                this.$parent.updateTab();
            }
        },
        watch: {
            name (val) {
                this.currentName = val;
                this.updateTab();
            },
        },
        mounted () {
            this.updateTab();
        },
        destroyed () {
            this.updateTab();
        }
    };
</script>
