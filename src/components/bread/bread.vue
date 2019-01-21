<template>
    <div :class="classes">
        <slot></slot>
    </div>
</template>
<script>
    import { prefix } from '../var';
    const breadPrefix = prefix+'bread';

    export default {
        name: 'Bread',
        props: {
            separator: {
                type: String,
                default: '/'
            }
        },
        computed: {
            classes () {
                return `${breadPrefix}`;
            }
        },
        mounted () {
            this.update();
        },
        updated () {
            this.$nextTick(() => {
                this.update();
            });
        },
        methods: {
            update () {//
                this.$children.forEach((child) => {
                    child.separator = this.separator;
                });
            }
        },
        watch: {
            separator () {//check separator change
                this.update();
            }
        }
    };
</script>
