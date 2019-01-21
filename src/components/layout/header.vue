<template>
    <div :class="wrapClasses"><slot></slot></div>
</template>
<script>
    import { prefix } from '../var'
    const headerPrefix = prefix + 'header'
    export default {
        name: 'Header',
        computed: {
            wrapClasses () {
                return `${headerPrefix}`;
            }
        }
    };
</script>