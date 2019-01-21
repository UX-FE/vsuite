<template>
    <div :class="wrapClasses" :style="inputStyle">
        <template v-if="type !== 'textarea'">
            <div :class="[prefix + '-group-prepend']" v-if="prepend" v-show="slotReady">
                <slot name="prepend"></slot>
            </div>
            <div :class="[prefix+'-body']" :style="inputStyle">
                <input
                    :id="elementId"
                    :autocomplete="autocomplete"
                    :spellcheck="spellcheck"
                    ref="input"
                    :type="type"
                    :class="inputClasses"
                    :disabled="disabled"
                    :maxlength="maxlength"
                    :readonly="readonly"
                    :name="name"
                    :value="currentValue"
                    :number="number"
                    :autofocus="autofocus"
                    @keyup.enter="handleEnter"
                    @keyup.esc="handleEsc"
                    @keyup="handleKeyup"
                    @keypress="handleKeypress"
                    @keydown="handleKeydown"
                    @focus="handleFocus"
                    @blur="handleBlur"
                    @input="handleInput"
                    @change="handleChange"
                    >
                <span :class="[prefix+'-icon-pre']" v-if="!!preIcon||$slots.preIcon" @click="handleIconClick">
                    <slot name="preIcon"><Icon :type="preIcon"></Icon></slot>
                </span>
                <span :class="[prefix+'-icon-aft']" v-if="!!aftIcon||$slots.aftIcon" @click="handleIconClick">
                    <slot name="aftIcon"><Icon :type="aftIcon"></Icon></slot>
                </span>
                <span :class="[prefix+'-icon-clear']" v-if="!!clearable&&currentValue!==''" @click="clearInput">
                    <Icon :type="clearIcon"></Icon>
                </span>
                <template v-if="currentValue===''&&placeholder">
                    <label class="placeholder">{{placeholder}}</label>
                </template>
            </div>
            <transition name="fade">
                <Icon :class="[prefix+'-icon']" :type="loadingIcon" v-if="loadingIcon" @click="handleIconClick"></Icon>
            </transition>
            <div :class="[prefix + '-group-append']" v-if="append" v-show="slotReady">
                <slot name="append"></slot>
            </div>
        </template>
        <div v-else :class="[prefix+'-body']" :style="inputStyle">
            <textarea
                :id="elementId"
                :autocomplete="autocomplete"
                :spellcheck="spellcheck"
                ref="textarea"
                :class="textareaClasses"
                :style="textareaStyles"
                :disabled="disabled"
                :rows="rows"
                :maxlength="maxlength"
                :readonly="readonly"
                :name="name"
                :value="currentValue"
                :autofocus="autofocus"
                @keyup.enter="handleEnter"
                @keyup="handleKeyup"
                @keypress="handleKeypress"
                @keydown="handleKeydown"
                @focus="handleFocus"
                @blur="handleBlur"
                @input="handleInput">
            </textarea>
            <template v-if="currentValue===''&&placeholder">
                <label class="placeholder">{{placeholder}}</label>
            </template>
        </div>
    </div>
</template>
<script>
    import { oneOf, findComponentUpward } from '../../utils/assist';
    import calcTextareaHeight from '../../utils/calcTextareaHeight';
    import Emitter from '../../mixins/emitter';
    import { prefix } from '../var';
    const inputPrefix = prefix+'input';

    export default {
        name: 'FormInput',
        mixins: [ Emitter ],
        props: {
            type: {//类型
                validator (value) {
                    return oneOf(value, ['text', 'textarea', 'password', 'url', 'email', 'date','file']);
                },
                default: 'text'
            },
            value: {//值
                type: [String, Number],
                default: ''
            },
            width:{
                type:[String,Number]
            },
            size: {//尺寸
                validator (value) {
                    return oneOf(value, ['small', 'large', 'default']);
                }
            },
            placeholder: {//提示
                type: String,
                default: ''
            },
            maxlength: {//最大长度
                type: Number
            },
            disabled: {//
                type: Boolean,
                default: false
            },
            clearable:{
                type:Boolean
            },
            preIcon: String,
            aftIcon: String,
            clearIcon:{
                type:String,
                default:'ios-close'
            },
            loadingIcon:String,
            autosize: {
                type: [Boolean, Object],
                default: false
            },
            rows: {
                type: Number,
                default: 2
            },
            readonly: {//是否只读
                type: Boolean,
                default: false
            },
            name: {
                type: String
            },
            number: {
                type: Boolean,
                default: false
            },
            autofocus: {
                type: Boolean,
                default: false
            },
            spellcheck: {
                type: Boolean,
                default: false
            },
            autocomplete: {
                validator (value) {
                    return oneOf(value, ['on', 'off']);
                },
                default: 'off'
            },
            elementId: {
                type: String
            }
        },
        data () {
            return {
                currentValue: this.value,
                prefix: inputPrefix,
                prepend: true,
                append: true,
                slotReady: false,
                textareaStyles: {}
            };
        },
        computed: {
            wrapClasses () {
                return [
                    `${inputPrefix}-wrapper`,
                    {
                        [`${inputPrefix}-wrapper-${this.size}`]: !!this.size,
                        [`${inputPrefix}-${this.type}`]: this.type,
                        [`${inputPrefix}-group`]: this.prepend || this.append,
                        [`${inputPrefix}-group-${this.size}`]: (this.prepend || this.append) && !!this.size,
                        [`${inputPrefix}-group-with-prepend`]: this.prepend,
                        [`${inputPrefix}-group-with-append`]: this.append,
                        [`${inputPrefix}-hide-icon`]: this.append  // #554
                    }
                ];
            },
            inputClasses () {
                return [
                    `${inputPrefix}`,
                    {
                        [`${inputPrefix}-${this.size}`]: !!this.size,
                        [`${inputPrefix}-hasPre`]: !!this.preIcon||this.$slots.preIcon,
                        [`${inputPrefix}-hasAft`]: !!this.aftIcon||this.$slots.aftIcon,
                        [`${inputPrefix}-clearable`]: !!this.clearable,
                        [`${inputPrefix}-disabled`]: this.disabled
                    }
                ];
            },
            inputStyle(){
                return {
                    width:(!!this.width)?(this.width+'px'):'initial',
                }
            },
            textareaClasses () {
                return [
                    `${inputPrefix}`,
                    {
                        [`${inputPrefix}-disabled`]: this.disabled
                    }
                ];
            }
        },
        methods: {
            handleEnter (event) {
                this.$emit('on-enter', event);
            },
            handleEsc (event) {
                this.$emit('on-esc', event);
            },
            handleKeydown (event) {
                this.$emit('on-keydown', event);
            },
            handleKeypress(event) {
                this.$emit('on-keypress', event);
            },
            handleKeyup (event) {
                this.$emit('on-keyup', event);
            },
            handleIconClick (event) {
                this.$emit('on-click', event);
            },
            handleFocus (event) {
                this.$emit('on-focus', event);
            },
            handleBlur (event) {
                this.$emit('on-blur', event);
                if (!findComponentUpward(this, ['DatePicker', 'TimePicker', 'Cascader', 'Search'])) {
                    this.dispatch('FormItem', 'on-form-blur', this.currentValue);
                }
            },
            handleInput (event) {
                let value = event.target.value;
                if (this.number) value = Number.isNaN(Number(value)) ? value : Number(value);
                this.$emit('input', value);
                this.setCurrentValue(value);
                this.$emit('on-change', event);
            },
            handleChange (event) {
                this.$emit('on-input-change', event);
            },
            setCurrentValue (value) {
                if (value === this.currentValue) return;
                this.$nextTick(() => {
                    this.resizeTextarea();
                });
                this.currentValue = value;
                if (!findComponentUpward(this, ['DatePicker', 'TimePicker', 'Cascader', 'Search'])) {
                    this.dispatch('FormItem', 'on-form-change', value);
                }
            },
            resizeTextarea () {
                const autosize = this.autosize;
                if (!autosize || this.type !== 'textarea') {
                    return false;
                }

                const minRows = autosize.minRows;
                const maxRows = autosize.maxRows;

                this.textareaStyles = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
            },
            focus () {
                if (this.type === 'textarea') {
                    this.$refs.textarea.focus();
                } else {
                    this.$refs.input.focus();
                }
            },
            blur () {
                if (this.type === 'textarea') {
                    this.$refs.textarea.blur();
                } else {
                    this.$refs.input.blur();
                }
            },
            clearInput(){
                this.currentValue = ''
            }
        },
        watch: {
            value (val) {
                this.setCurrentValue(val);
            }
        },
        mounted () {
            if (this.type !== 'textarea') {
                this.prepend = this.$slots.prepend !== undefined;
                this.append = this.$slots.append !== undefined;
            } else {
                this.prepend = false;
                this.append = false;
            }
            this.slotReady = true;
            this.resizeTextarea();
        }
    };
</script>
