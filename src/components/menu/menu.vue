<template>
    <ul :class="classes" :style="styles"><slot></slot></ul>
</template>
<script>
    import { oneOf, findComponentsDownward } from '../../utils/assist';
    import Emitter from '../../mixins/emitter';

    import { prefix } from '../var'
    const menuPrefix = prefix + 'menu';

    export default {
        name: 'Menu',
        mixins: [ Emitter ],
        props: {
            direction: {
                validator (value) {
                    return oneOf(value, ['horizontal', 'vertical']);
                },
                default: 'vertical'
            },
            current: {
                type: [String, Number]
            },
            openeds: {
                type: Array,
                default () {
                    return [];
                }
            },
            accordion: {
                type: Boolean,
                default: false
            },
            width: {
                type: String,
                default: '200px'
            },
            collapse:{
                type:Boolean,
                default:false
            },
            underline:{
                type:Boolean,
                default:false
            }
        },
        data () {
            return {
                currentMenu: this.current,
                currentOpeneds:this.openeds
            };
        },
        computed: {
            classes () {
                return [
                    `${menuPrefix}`,
                    {
                        [`${menuPrefix}-${this.direction}`]: this.direction,
                        [`${menuPrefix}-underline`]: !!this.underline
                    }
                ];
            },
            styles () {
                let style = {};

                if (this.direction === 'vertical') style.width = this.width;

                return style;
            }
        },
        methods: {
            updateCurrentMenu () {
                if (this.currentMenu === undefined) {
                    this.currentMenu = -1;
                }
                this.broadcast('SubMenu', 'on-change', false);
                this.broadcast('MenuItem', 'on-change', this.currentMenu);
            },
            updateOpenKeys (name) {
                const index = this.currentOpeneds.indexOf(name);
                if (index > -1) {
                    this.currentOpeneds.splice(index, 1);
                } else {
                    this.currentOpeneds.push(name);
                    if (this.accordion) {
                        this.currentOpeneds.splice(0, this.currentOpeneds.length);
                        this.currentOpeneds.push(name);
                    }
                }
            },
            updateOpened () {
                const items = findComponentsDownward(this, 'SubMenu');
                if (items.length) {
                    items.forEach(item => {
                        if (this.currentOpeneds.indexOf(item.name) > -1) item.opened = true;
                    });
                }
            }
        },
        mounted () {
            //update current menu
            this.updateCurrentMenu();
            //update opened menu
            this.updateOpened();
            //check menu-item click event ,get the menu name ,emit events
            this.$on('on-select', (name) => {
                this.currentMenu = name;
                this.$emit('on-change-menu', name);
            });
        },
        watch: {
            openeds (val) {
                this.currentOpeneds = this.openeds;
                this.$nextTick(()=>{   
                    this.updateOpened();
                })
            },
            current (val) {
                this.currentMenu = val;
            },
            currentMenu () {
                this.updateCurrentMenu();
            },
            collapse(val){
                if(val){
                    this.openeds = [];
                    this.broadcast('SubMenu','on-collapse',val);
                }
            }
        }
    };
</script>
