<template>
    <ul :class="[prefix]"><slot></slot></ul>
</template>
<script>
    import { prefix } from '../var';
    const dropdownlistPrefix = prefix+'dropdown-list';
    export default {
        name: 'DropdownList',
        data(){
            return {
                prefix:dropdownlistPrefix
            }
        }
    };
</script>
