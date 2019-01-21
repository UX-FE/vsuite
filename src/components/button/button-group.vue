<template>
    <div :class="classes">
        <slot></slot>
    </div>
</template>
<script>
    import { oneOf } from '../../utils/assist';
    import { prefix } from '../var';
    const btngroupPrefix = prefix+'btn-group';

    export default {
        name: 'ButtonGroup',
        props: {
            size: {
                validator (value) {
                    return oneOf(value, ['small', 'large', 'default']);
                }
            },
            shape: {
                validator (value) {
                    return oneOf(value, ['circle']);
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
                    `${btngroupPrefix}`,
                    {
                        [`${btngroupPrefix}-${this.size}`]: !!this.size,
                        [`${btngroupPrefix}-${this.shape}`]: !!this.shape,
                        [`${btngroupPrefix}-vertical`]: this.vertical
                    }
                ];
            }
        }
    };
</script>
