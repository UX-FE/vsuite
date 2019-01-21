<template>
    <div :class="classes">
        <slot></slot>
    </div>
</template>
<script>
    import { oneOf } from '../../utils/assist';
    import { prefix } from '../var';
    const cardgroupPrefix = prefix+'card-group';

    export default {
        name: 'CardGroup',
        props: {
            shape: {
                validator (value) {
                    return oneOf(value, ['circle', 'circle-outline']);
                }
            },
            vertical: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            classes () {
                return [
                    `${cardgroupPrefix}`,
                    {
                        [`${cardgroupPrefix}-${this.shape}`]: !!this.shape,
                        [`${cardgroupPrefix}-vertical`]: this.vertical
                    }
                ];
            }
        }
    };
</script>
