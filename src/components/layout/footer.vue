<template>
    <div :class="classes"><slot></slot></div>
</template>
<script>
    import { prefix } from '../var'
    const footerPrefix = prefix + 'footer'
    export default {
        name: 'Footer',
        computed: {
            classes () {
                return `${footerPrefix}`;
            }
        }
    };
</script>