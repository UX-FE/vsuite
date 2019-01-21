<template>
    <span>
        <a v-if="to" :class="linkClasses" @click="linkClick">
            <slot></slot>
        </a>
        <span v-else :class="linkClasses">
            <slot></slot>
        </span>
        <span :class="separatorClasses" v-html="separator" v-if="!customSeparator"></span>
        <span :class="separatorClasses" v-else>
            <slot name="separator"></slot>
        </span>
    </span>
</template>
<script>
    import { prefix } from '../var';
    const breaditemPrefix = prefix+'breaditem';

    export default {
        name: 'BreadItem',
        props: {
            to: {
                type: [Object, String]
            },
            replace: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                separator: '',
                customSeparator: false
            };
        },
        computed: {
            linkClasses () {
                return `${breaditemPrefix}-link`;
            },
            separatorClasses () {
                return `${breaditemPrefix}-separator`;
            }
        },
        mounted () {
            this.customSeparator = this.$slots.separator !== undefined;
        },
        methods: {
            linkClick () {
                const isRoute = this.$router;
                if (isRoute) {
                    this.replace ? this.$router.replace(this.to) : this.$router.push(this.to);
                } else {
                    window.location.href = this.to;
                }
            }
        }
    };
</script>
