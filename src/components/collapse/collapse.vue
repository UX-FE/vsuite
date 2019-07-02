<template>
    <div :class="classes">
        <slot></slot>
    </div>
</template>
<script>
    import { oneOf } from '../../utils/assist';
    import { prefix } from '../var';
    const collapsePrefix = prefix+'collapse';

    export default {
        name: 'Collapse',
        props: {
            accordion: {
                type: Boolean,
                default: false
            },
            value: {
                type: [Array, String]
            },
            defaultStatus:{
                type:String,
                validator (value) {
                    return oneOf(value, ['allOpen']);
                }
            },
            icon:{
                type:String,
                default:'arrow-right'
            },
            iconPosition:{
                type:String,
                validator (value) {
                    return oneOf(value, ['right']);
                }
            }
        },
        data () {
            return {
                prefix:collapsePrefix,
                currentValue: this.value
            };
        },
        computed: {
            classes () {
                return [
                    `${collapsePrefix}`,
                    {
                       [`${collapsePrefix}-icon-${this.iconPosition}`]:!!this.iconPosition
                    }
                ];
            }
        },
        mounted () {
            this.setAllOpen();
            this.setActive();
        },
        methods: {
            setAllOpen () {
                if(!!this.defaultStatus&&this.defaultStatus==='allOpen'){
                    this.currentValue = [];
                    this.$children.forEach((child, index) => {
                        const name = child.name || index.toString();
                        this.currentValue.push(name);
                    });
                }   
            },
            setActive () {
                const activeKey = this.getActiveKey();
                this.$children.forEach((child, index) => {
                    const name = child.name || index.toString();
                    let isActive = false;

                    if (self.accordion) {
                        isActive = activeKey === name;
                    } else {
                        isActive = activeKey.indexOf(name) > -1;
                    }
                    
                    child.isActive = isActive;
                    child.icon = this.icon;
                    child.index = index;
                });
            },
            getActiveKey () {
                let activeKey = this.currentValue || [];
                const accordion = this.accordion;

                if (!Array.isArray(activeKey)) {
                    activeKey = [activeKey];
                }

                if (accordion && activeKey.length > 1) {
                    activeKey = [activeKey[0]];
                }

                for (let i = 0; i < activeKey.length; i++) {
                    activeKey[i] = activeKey[i].toString();
                }

                return activeKey;
            },
            toggle (data) {
                const name = data.name.toString();
                let newActiveKey = [];

                if (this.accordion) {
                    if (!data.isActive) {
                        newActiveKey.push(name);
                    }
                } else {
                    let activeKey = this.getActiveKey();
                    const nameIndex = activeKey.indexOf(name);

                    if (data.isActive) {
                        if (nameIndex > -1) {
                            activeKey.splice(nameIndex, 1);
                        }
                    } else {
                        if (nameIndex < 0) {
                            activeKey.push(name);
                        }
                    }

                    newActiveKey = activeKey;
                }

                this.currentValue = newActiveKey;

                //增加传参:当前是否打开
                this.$emit('on-change', {name:newActiveKey,index:data.index,open:!data.isActive});
            }
        },
        watch: {
            value (val) {
                this.currentValue = val;
            },
            currentValue () {
                this.setActive();
            },
            defaultStatus(){
                this.setAllOpen();
            }
        }
    };
</script>
