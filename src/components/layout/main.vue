<template>
    <div :class="classes"><slot></slot></div>
</template>
<script>
    import { prefix } from '../var'
    const mainPrefix = prefix + 'main'
    export default {
        name: 'Content',
        computed: {
            classes () {
                return `${mainPrefix}`;
            }
        }
    };
</script>