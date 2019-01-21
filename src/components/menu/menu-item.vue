<template>
    <li :class="classes" @click="handleClick"><slot></slot></li>
</template>
<script>
    import Emitter from '../../mixins/emitter';
    import { prefix } from '../var'
    const menuItemPrefix = prefix + 'menu-item';

    export default {
        name: 'MenuItem',
        mixins: [ Emitter ],
        props: {
            name: {
                type: [String, Number],
                required: true
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                active: false
            };
        },
        computed: {
            classes () {
                return [
                    `${menuItemPrefix}`,
                    {
                        [`${menuItemPrefix}-active`]: this.active,
                        [`${menuItemPrefix}-selected`]: this.active,
                        [`${menuItemPrefix}-disabled`]: this.disabled
                    }
                ];
            }
        },
        methods: {
            handleClick () {
                if (this.disabled) return;

                let parent = this.$parent;
                let name = parent.$options.name;
                while (parent && (!name || name !== 'SubMenu')) {
                    parent = parent.$parent;
                    if (parent) name = parent.$options.name;
                }

                if (parent) {
                    this.dispatch('SubMenu', 'on-select', this.name);
                } else {
                    this.dispatch('Menu', 'on-select', this.name);
                }
            }
        },
        mounted () {
            this.$on('on-change', (name) => {
               this.$nextTick(()=>{
                   if (this.name === name) {
                    this.active = true;
                    this.dispatch('SubMenu', 'on-change', true);
                   } else {
                        this.active = false;
                    }
               })
            });
        }
    };
</script>
