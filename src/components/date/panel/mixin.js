// const datePanelPrefix = 'ivu-picker-panel';
// const datePrefix = 'ivu-date-picker';

import { prefix } from '../../var';
import { getDateRange } from '../util';
const datePrefix = prefix+'date';
const datePanelPrefix = prefix+'date-panel';

export default {
    methods: {
        iconBtnCls (direction, type = '') {
            return [
                `${datePanelPrefix}-icon-btn`,
                `${datePrefix}-${direction}-btn`,
                `${datePrefix}-${direction}-btn-arrow${type}`,
            ];
        },
        handleShortcutClick (shortcut,isDisabled,isCompare) {
            if(isDisabled)return;
            if (shortcut.value) {
                var shortDate = shortcut.value();
                //fix bug: 快捷选择日期时，如果选择了对比，对比日期没有更新
                if(isCompare){
                    const compareMinDate = new Date(shortDate[0]);
                    compareMinDate.setTime(compareMinDate.getTime() - 3600 * 1000 * 24 * (1+getDateRange(shortDate[0],shortDate[1]))); 
                    const compareMaxDate = new Date(shortDate[0]);
                    compareMaxDate.setTime(compareMaxDate.getTime() - 3600 * 1000 * 24 * 1);
                    shortDate.push(compareMinDate)
                    shortDate.push(compareMaxDate)
                }
                this.$emit('on-pick', shortDate);
                this.$emit('on-pick-short');
            }
            if (shortcut.onClick) shortcut.onClick(this);
        },
        handlePickClear () {
            this.$emit('on-pick-clear');
        },
        handlePickCancel () {
            this.$emit('on-pick-cancel');
        },
        handlePickSuccess () {
            this.$emit('on-pick-success');
        },
        handlePickClick () {
            this.$emit('on-pick-click');
        }
    }
};
