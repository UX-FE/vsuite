<template>
    <li :class="[prefix]">
        <div :class="[prefix + '-title']">{{ title }}</div>
        <ul><slot></slot></ul>
    </li>
</template>
<script>
    import { prefix } from '../var'
    const menuGroupPrefix = prefix + 'menu-group';

    export default {
        name: 'MenuGroup',
        props: {
            title: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                prefix: menuGroupPrefix
            };
        }
    };
</script>
