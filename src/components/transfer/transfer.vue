<template>
    <div :class="wrapClasses">
        <div :class="sourceClasses">
            <div :class="[prefix+'-panel-header']">
                <slot name="sourceHeader">
                    <template v-if="checkAll">
                        <Checkbox v-model="checkAllOrigins" name="souce-check-all" @on-change="checkSourceAll" :disabled="(currentTargets.length===data.length)?true:false">{{titles[0]}}</Checkbox>
                    </template>
                    <template v-else>
                        {{titles[0]}}
                    </template>
                    <span v-if="sumable" class="sum">{{sourceChecked.length}}/{{data.length}}</span>
                </slot>
            </div>
            <div :class="[prefix+'-panel-body']">
            <Scroll>
                <CheckboxGroup v-model="sourceChecked" vertical name="source-group"  @on-change="handleCheckSourceAll">
                    <Checkbox v-if="(currentTargetsValues.indexOf(item.value)<0)" :class="[prefix+'-panel-item']" v-for="(item,index) in data" :key="index" :disabled="(disabledOption.indexOf(item.value)>-1)?true:false" :value="item.value" :label="item.label"></Checkbox>
                </CheckboxGroup>
            </Scroll>
            </div>
            <div :class="[prefix+'-panel-footer']"></div>
        </div>
        <div :class="[prefix+'-action']">
            <div :class="backButtonClasses" @click="back"><slot name="back"><Icon :type="actionIcons[0]"></Icon></slot></div>
            <div :class="toButtonClasses" @click="to"><slot name="to"><Icon :type="actionIcons[1]"></Icon></slot></div>
        </div>
        <div :class="destinationClasses">
            <div :class="[prefix+'-panel-header']">
                <slot name="destinationHeader">
                    <template v-if="checkAll">
                        <Checkbox v-model="checkAllTargets" name="target-check-all" @on-change="checkTargetAll" :disabled="!this.currentTargets.length">{{titles[1]}}</Checkbox>
                    </template>
                    <template v-else>
                        {{titles[1]}}
                    </template>
                    <span v-if="sumable" class="sum">{{targetChecked.length}}/{{currentTargets.length}}</span>
                </slot>
            </div>
            <div :class="[prefix+'-panel-body']">
                <CheckboxGroup v-model="targetChecked" vertical name="target-group" @on-change="handleCheckTargetAll">
                    <Checkbox :class="[prefix+'-panel-item']" v-for="(item,index) in currentTargets" :key="index" :value="item.value" :label="item.label"></Checkbox>
                </CheckboxGroup>
            </div>
            <div :class="[prefix+'-panel-footer']"></div>
        </div>
    </div>
</template>
<script>
    import BaseButton from '../button'
    import Scroll from '../scroll'
    import Icon from '../icon'
    import Checkbox from '../checkbox'
    import CheckboxGroup from '../checkboxgroup'
    import { oneOf } from '../../utils/assist'

import { prefix } from '../var'
const transferPrefix = prefix + 'transfer'

export default {
      name: 'Transfer',
      props: {
        id: {
          type: String,
          required: true
        },
        value:{
          type:Array
        },
        data: {
          type: Array,
          default () {
            return []
          }
        },
        actionIcons: {
          type: Array,
          default () {
            return ['android-arrow-back', 'android-arrow-forward']
          }
        },
        disabledOption:{
          type:Array,
          default () {
            return []
          }
        },
        titles: {
          type: Array,
          default () {
            return ['源列表', '目的列表']
          }
        },
        checkAll: {
          type: Boolean,
          default: true
        },
        checkType: {
          type: String,
          default: 'default',
          validator (value) {
            return oneOf(value, ['button', 'bordered', 'default'])
          }
        },
        height: {
          type: [Number, String],
          default: 240
        },
        sumable: {
          type: Boolean,
          default: false
        },
        filterable: {
          type: Boolean,
          default: false
        }
      },
      data () {
        return {
          prefix: transferPrefix,
          checkAllOrigins: false,//源列表选中全部
          checkAllTargets: false,//目标列表选中全部
          sourceChecked: [],//源列表中选中的值
          targetChecked: [],//目标列表中选中的值
          currentTargetChecks: [],//当前右侧选中的列表
          currentTargets: [],//当前右侧的列表
          currentTargetsValues: (this.value)?this.value:[],//当前右侧的列表key值，用于初始化
        }
      },
      computed: {
        wrapClasses () {
          return [
            `${transferPrefix}`
          ]
        },
        sourceClasses () {
          return [
            `${transferPrefix}-panel`,
            `${transferPrefix}-panel-source`
    
          ]
        },
        destinationClasses () {
          return [
            `${transferPrefix}-panel`,
            `${transferPrefix}-panel-destination`
    
          ]
        },
        backButtonClasses () {
          return [
            `${transferPrefix}-button`,
            {
              'disabled': !this.currentTargets.length
            }
    
          ]
        },
        toButtonClasses () {
          return [
            `${transferPrefix}-button`,
            {
              'disabled': !this.data.length || (this.data.length && this.data.length === this.currentTargets.length)
            }
          ]
        }
      },
      methods: {
        back () {//从目标移到源
          //当目标列表无数据 或者有数据但是没有选中
          if (!this.currentTargets.length || (this.currentTargets.length&&!this.targetChecked.length)) {
            return false
          }
          for (var i = 0; i < this.targetChecked.length; i++) {
            this.currentTargetsValues.splice(this.currentTargetsValues.indexOf(this.targetChecked[i]), 1)
          }
          this.currentTargetChecks = []
          for (var j = 0; j < this.currentTargetsValues.length; j++) {
            for (var z = 0; z < this.data.length; z++) {
              if (this.currentTargetsValues[j] === this.data[z].value) {
                this.currentTargets.push(this.data[z])
              }
            }
          }
          this.checkAllTargets = false
          this.targetChecked = []
        },
        to () {//从源移到目标
          // 没有源数据或者左侧的源列表全部选中到了右边时，不响应
          if (!this.data.length || (this.data.length && this.data.length === this.currentTargets.length)) {
            return false
          }

          // 右侧的数据value集合，代表左侧选中且移动的value集合，用于判断左侧复选框状态
          for (var i = 0; i < this.sourceChecked.length; i++) {
            if(this.currentTargetsValues.indexOf(this.sourceChecked[i])<0){
              this.currentTargetsValues.push(this.sourceChecked[i])
            }
          }
          // this.currentTargets = []
          // for (var j = 0; j < this.currentTargetsValues.length; j++) {
          //   for (var z = 0; z < this.data.length; z++) {
          //     if (this.currentTargetsValues[j] === this.data[z].value) {
          //       this.currentTargets.push(this.data[z])
          //     }
          //   }
          // }
          this.checkAllOrigins = false
          this.sourceChecked = [];
          this.$emit('on-change',this.currentTargetsValues);
        },
        checkSourceAll () {
          //this.checkAllOrigins = !this.checkAllOrigins
          this.sourceChecked = []
          if (this.checkAllOrigins) {
            for (var i = 0; i < this.data.length; i++) {
              this.sourceChecked.push(this.data[i].value)
            }
          }
        },
        handleCheckSourceAll () {
          if (this.sourceChecked.length === this.data.length) {
            this.checkAllOrigins = true
          } else {
            this.checkAllOrigins = false
          }
        },
        checkTargetAll () {
          //this.checkAllTargets = !this.checkAllTargets
          this.targetChecked = []
          if (this.checkAllTargets) {
            for (var i = 0; i < this.currentTargets.length; i++) {
              this.targetChecked.push(this.currentTargets[i].value)
            }
          }
        },
        handleCheckTargetAll () {
          if (this.targetChecked.length === this.currentTargets.length) {
            this.checkAllTargets = true
          } else {
            this.checkAllTargets = false
          }
        },
        resetTarget(){//重置目标列表的状态，当初始化时目标列表中有默认值使用
          if(!this.data.length){
            return false;
          }
          this.currentTargets = [];
          this.data.forEach((item,index) => {
            if(this.currentTargetsValues.indexOf(item.value)>-1){
              this.currentTargets.push(item)
            }
          });
        }
      },
      watch: {
        'value'(val){//检测value的变化，即目标列表中的数组key变化
            this.currentTargetsValues = val;
        },
        'currentTargetsValues'(val){//当目标列表中的数组key变化，目标列表的渲染数组同步变化
          this.resetTarget()
        }
      },
      mounted () {
       if(this.currentTargetsValues&&this.currentTargetsValues.length){
         this.resetTarget()
       }
      }
    }
</script>
