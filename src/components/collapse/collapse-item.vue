<template>
    <div :class="itemClasses">
        <div :class="headerClasses" @click="toggle">
            <Icon :type="icon"></Icon>
            <span :class="[prefix+'-header-title']"><slot name="title"></slot></span>
        </div>
        <collapse-transition>
            <div :class="contentClasses" v-show="isActive">
                <div :class="boxClasses"><slot name="content"></slot></div>
            </div>
        </collapse-transition>
    </div>
</template>
<script>
    import { prefix } from '../var';
    import Icon from '../icon/icon.vue';
    import CollapseTransition from '../base/collapse-transition';
    const collapseItemPrefix = prefix+'collapse-item';

    export default {
        name: 'CollapseItem',
        components: { Icon, CollapseTransition },
        props: {
            name: {
                type: String
            }
        },
        data () {
            return {
                prefix:collapseItemPrefix,
                index: 0, // use index for default when name is null
                isActive: false,
                icon:'arrow-right'
            };
        },
        computed: {
            itemClasses () {
                return [
                    `${collapseItemPrefix}`,
                    {
                        [`${collapseItemPrefix}-active`]: this.isActive
                    }
                ];
            },
            headerClasses () {
                return `${collapseItemPrefix}-header`;
            },
            contentClasses () {
                return `${collapseItemPrefix}-content`;
            },
            boxClasses () {
                return `${collapseItemPrefix}-content-box`;
            },
            transitionName () {
                return 'slide-down';
            },
        },
        methods: {
            toggle () {
                this.$parent.toggle({
                    name: this.name || this.index,
                    isActive: this.isActive
                });
            }
        }
    };
</script>
