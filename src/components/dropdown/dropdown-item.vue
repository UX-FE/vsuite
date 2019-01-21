<template>
    <li :class="classes" @click.stop="handleClick"><slot></slot></li>
</template>
<script>
    import { prefix } from '../var';
    const dropdownitemPrefix = prefix+'dropdown-item';

    export default {
        name: 'DropdownItem',
        props: {
            name: {
                type: [String, Number]
            },
            disabled: {
                type: Boolean,
                default: false
            },
            selected: {
                type: Boolean,
                default: false
            },
            divided: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            classes () {
                return [
                    `${dropdownitemPrefix}`,
                    {
                        [`${dropdownitemPrefix}-disabled`]: this.disabled,
                        [`${dropdownitemPrefix}-selected`]: this.selected,
                        [`${dropdownitemPrefix}-divided`]: this.divided
                    }
                ];
            }
        },
        methods: {
            handleClick () {
                const $parent = this.$parent.$parent;
                // const hasChildren = this.$parent && this.$parent.$options.name === 'Dropdown';

                // if (this.disabled) {
                //     this.$nextTick(() => {
                //         $parent.show = true;
                //     });
                // } else if (hasChildren) {
                //     this.$parent.$emit('on-haschild-click');
                // } else {
                //     if ($parent && $parent.$options.name === 'Dropdown') {
                //         $parent.$emit('on-hover-click');
                //     }
                // }
                $parent.$emit('on-click', this.name);
            }
        }
    };
</script>
