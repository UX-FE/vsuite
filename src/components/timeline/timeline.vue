<template>
    <ul :class="classes">
        <slot></slot>
    </ul>
</template>
<script>
    import { prefix } from '../var';
    const timelinePrefix = prefix+'timeline';

    export default {
        name: 'Timeline',
        props: {
            more: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
            };
        },
        computed: {
            classes () {
                return [
                    `${timelinePrefix}`,
                    {
                        [`${timelinePrefix}-more`]: this.more
                    }
                ];
            }
        }
    };
</script>
