<template>
    <div :class="wrapClasses" :style="styles">
        <div :class="[prefix + '-tail']"><i></i></div>
        <div :class="[prefix + '-head']">
            <div :class="[prefix + '-head-inner']">
                <span v-if="!icon && currentStatus != 'finish' && currentStatus != 'error'">{{ stepNumber }}</span>
                <slot v-else name="finish"><Icon :type="iconType" :class="iconClasses"></Icon></slot>
            </div>
        </div>
        <div :class="[prefix + '-main']">
            <div :class="[prefix + '-title']">{{ title }}</div>
            <slot>
                <div v-if="content" :class="[prefix + '-content']">{{ content }}</div>
            </slot>
        </div>
    </div>
</template>
<script>
    import Emitter from '../../mixins/emitter';
    import { oneOf } from '../../utils/assist';
    import Icon from '../icon';

    import { prefix } from '../var';
    const stepItemPrefix = prefix+'step-item';
    const iconstepItemPrefix = 'ivu-icon';

    export default {
        name: 'StepItem',
        mixins: [ Emitter ],
        props: {
            status: {
                validator (value) {
                    return oneOf(value, ['wait', 'process', 'finish', 'error']);
                }
            },
            title: {
                type: String,
                default: ''
            },
            content: {
                type: String
            },
            icon: {
                type: String
            }
        },
        components:{
            'Icon':Icon
        },
        data () {
            return {
                prefix: stepItemPrefix,
                stepNumber: '',
                nextError: false,
                total: 1,
                currentStatus: ''
            };
        },
        computed: {
            wrapClasses () {
                return [
                    `${stepItemPrefix}`,
                    `${stepItemPrefix}-status-${this.currentStatus}`,
                    {
                        [`${stepItemPrefix}-custom`]: !!this.icon,
                        [`${stepItemPrefix}-next-error`]: this.nextError
                    }
                ];
            },
            iconType(){
                let icon = '';

                if (this.icon) {
                    icon = this.icon;
                } else {
                    if (this.currentStatus == 'finish') {
                        icon = 'checkmark-round';
                    } else if (this.currentStatus == 'error') {
                        icon = 'close-round';
                    }
                }
                return icon;
            },
            iconClasses () {
                // let icon = '';

                // if (this.icon) {
                //     icon = this.icon;
                // } else {
                //     if (this.currentStatus == 'finish') {
                //         icon = 'ios-checkmark-empty';
                //     } else if (this.currentStatus == 'error') {
                //         icon = 'ios-close-empty';
                //     }
                // }

                return [
                    `${stepItemPrefix}-icon`,
                    // `${iconstepItemPrefix}`,
                    // {
                    //     [`${iconstepItemPrefix}-${icon}`]: icon != ''
                    // }
                ];
            },
            styles () {
                return {
                    width: `${1/this.total*100}%`
                };
            }
        },
        watch: {
            status (val) {
                this.currentStatus = val;
                if (this.currentStatus == 'error') {
                    this.$parent.setNextError();
                }
            }
        },
        created () {
            this.currentStatus = this.status;
        },
        mounted () {
            this.dispatch('Steps', 'append');
        },
        beforeDestroy () {
            this.dispatch('Steps', 'remove');
        }
    };
</script>
