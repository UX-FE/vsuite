<template>
     <div :class="classes"><slot></slot></div>
</template>
<script>
    import { prefix } from '../var'
    const layoutPrefix = prefix + 'layout'

    export default {
        name: 'Layout',
        data () {
            return {
                hasSider: false
            };
        },
        computed: {
            classes () {
                return [
                    `${layoutPrefix}`,
                    {
                        [`${layoutPrefix}-has-sider`]: this.hasSider
                    }
                ];
            }
        },
        methods: {
            findSider () {
                return this.$children.some(child => {
                    return child.$options.name === 'Sider'; 
                });
            }
        },
        mounted () {
            this.hasSider = this.findSider();
        }
    };
</script>