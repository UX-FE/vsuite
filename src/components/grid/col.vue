<template>
    <div :class="classes" :style="styles">
        <slot></slot>
    </div>
</template>
<script>
    import { findComponentUpward } from '../../utils/assist';
    import { prefix } from '../var';
    const colPrefix = prefix+'col';

    export default {
        name: 'Col',
        props: {
            span: [Number, String],
            order: [Number, String],
            offset: [Number, String],
            push: [Number, String],
            pull: [Number, String],
            className: String,
            xs: [Number, Object],
            sm: [Number, Object],
            md: [Number, Object],
            lg: [Number, Object]
        },
        data () {
            return {
                gutter: 0
            };
        },
        computed: {
            classes () {
                let classList = [
                    `${colPrefix}`,
                    {
                        [`${colPrefix}-span-${this.span}`]: this.span,
                        [`${colPrefix}-order-${this.order}`]: this.order,
                        [`${colPrefix}-offset-${this.offset}`]: this.offset,
                        [`${colPrefix}-push-${this.push}`]: this.push,
                        [`${colPrefix}-pull-${this.pull}`]: this.pull,
                        [`${this.className}`]: !!this.className
                    }
                ];

                ['xs', 'sm', 'md', 'lg'].forEach(size => {
                    if (typeof this[size] === 'number') {
                        classList.push(`${colPrefix}-span-${size}-${this[size]}`);
                    } else if (typeof this[size] === 'object') {
                        let props = this[size];
                        Object.keys(props).forEach(prop => {
                            classList.push(
                                prop !== 'span'
                                    ? `${colPrefix}-${size}-${prop}-${props[prop]}`
                                    : `${colPrefix}-span-${size}-${props[prop]}`
                            );
                        });
                    }
                });

                return classList;
            },
            styles () {
                let style = {};
                if (this.gutter !== 0) {
                    style = {
                        paddingLeft: this.gutter / 2 + 'px',
                        paddingRight: this.gutter / 2 + 'px'
                    };
                }

                return style;
            }
        },
        methods: {
            updateGutter () {
                const Row = findComponentUpward(this, 'Row');
                if (Row) {
                    Row.updateGutter(Row.gutter);
                }
            }
        },
        mounted () {
            this.updateGutter();
        },
        beforeDestroy () {
            this.updateGutter();
        }
    };
</script>
