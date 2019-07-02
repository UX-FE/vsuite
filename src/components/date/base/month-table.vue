<template>
  <div :class="classes">
    <div
      v-for="rowIndex in Math.ceil(cells.length/rows)"
      :key="rowIndex"
      :class="[datePrefix + '-row']"
    >
      <template  v-for="(cell, index) in cells">
        <span :class="getCellCls(cell)" :key="rowIndex+index" v-if="((index>=((rowIndex-1)*(cells.length/rows)))&&(index<=(((rowIndex-1)*(cells.length/rows))+(cells.length/rows-1))))">
          <em :index="index" @click="handleClick(cell)">{{ tCell(cell.text) }}</em>
        </span>
      </template>
    </div>
    <!-- <span :class="getCellCls(cell)" v-for="(cell, index) in cells" :key="index"><em :index="index">{{ tCell(cell.text) }}</em></span> -->
  </div>
</template>
<script>
import { getDateRang, getMonthRange, getDateByMonth } from "../util";
import { deepCopy } from "../../../utils/assist";
import Locale from "../../../mixins/locale";
import { prefix } from "../../var";
const datePrefix = prefix + "date-cells";

export default {
  mixins: [Locale],
  props: {
    type: {
      default: "range"
    },
    date: {},
    minDate: {},
    maxDate: {},
    min: {},
    max: {},
    maxRangeDay: "",
    rows: {
      type: [String, Number],
      default: 4
    },
    maxRangeMonth: "",
    handleDate: {},
    month: {
      type: Number
    },
    disabledDate: {},
    selectionMode: {
      default: "month"
    },
    beginStatus: {}
  },
  data() {
    return {
      datePrefix: datePrefix,
      handleDateType: this.handleDate,
      begin: false //默认点击自然月不显示选中，选择之后才选中
    };
  },
  watch: {
    handleDate(val) {
      this.handleDateType = this.handleDate;
    },
    beginStatus(val) {
      this.begin = val;
    }
  },
  computed: {
    classes() {
      return [`${datePrefix}`, `${datePrefix}-month`, `${datePrefix}-month-row-${this.rows}`];
    },
    cells() {
      let cells = [];
      const cell_tmpl = {
        text: "",
        selected: false,
        disabled: false,
        start: false,
        end: false,
        range: false
      };
      const minDate = new Date(this.minDate);
      const maxDate = new Date(this.maxDate);
      const lastDayInMaxDate = this.getLastDaysInMonth(
        maxDate.getFullYear(),
        Number(maxDate.getMonth()) + 1
      );

      const lastMaxDate = new Date(
        maxDate.getFullYear(),
        maxDate.getMonth(),
        lastDayInMaxDate
      );
      for (let i = 0; i < 12; i++) {
        const cell = deepCopy(cell_tmpl);
        cell.text = i + 1;

        const date = new Date(this.date);
        date.setMonth(i);
        let lastTempDate = (cell.disabled =
          typeof this.disabledDate === "function" && this.disabledDate(date));
        // if(this.begin){
        if (this.type === "range") {
          //选择时间段的开始时间
          if (
            date.getFullYear() === minDate.getFullYear() &&
            i === Number(minDate.getMonth()) &&
            1 <= Number(minDate.getDate())
          ) {
            cell.selected = true;
            cell.start = true;
          }
          //选择时间段的结束时间
          if (
            date.getFullYear() === maxDate.getFullYear() &&
            i === Number(maxDate.getMonth()) &&
            lastDayInMaxDate >= Number(maxDate.getDate())
          ) {
            cell.selected = true;
            cell.end = true;
          }
          //选择时间段的开始时间到结束
          if (
            date.getFullYear() >= minDate.getFullYear() &&
            date.getFullYear() <= maxDate.getFullYear()
          ) {
            if (
              minDate.getFullYear() === maxDate.getFullYear() &&
              i >= Number(minDate.getMonth()) &&
              i <= Number(maxDate.getMonth())
            ) {
              cell.range = true;
            } else if (minDate.getFullYear() != maxDate.getFullYear()) {
              cell.range =
                (date.getFullYear() === minDate.getFullYear() &&
                  i >= Number(minDate.getMonth())) ||
                (date.getFullYear() === maxDate.getFullYear() &&
                  i <= Number(maxDate.getMonth()));
            }
          }
        } else {
          cell.selected = Number(this.month) === i;
        }
        // }
        cells.push(cell);
      }

      return cells;
    }
  },
  methods: {
    getCellCls(cell) {
      return [
        `${datePrefix}-cell`,
        {
          [`${datePrefix}-cell-selected`]: cell.selected,
          [`${datePrefix}-cell-selected-start`]: cell.start,
          [`${datePrefix}-cell-selected-end`]: cell.end,
          [`${datePrefix}-cell-disabled`]: cell.disabled,
          [`${datePrefix}-cell-range`]: cell.range && !cell.start && !cell.end
        }
      ];
    },
    //获取这个月的最后一天
    getLastDaysInMonth(year, month) {
      const date = new Date();
      date.setFullYear(Number(year));
      date.setMonth(Number(month));
      const lastDay = new Date(date.setDate(0));
      return lastDay.getDate();
    },
    handleClick(cell) {
      if (cell.disabled) return;
      if (this.$parent.selectionMode === "month") {
        this.$emit("on-pick", cell.text);
      } else {
        this.begin = true;
        const month = Number(cell.text) - 1;
        const newDate = new Date(this.date);
        newDate.setMonth(month);
        if (this.handleDateType === "start") {
          let minDate = new Date(newDate.setDate(1));
          if (this.min && this.min.getTime() > minDate.getTime()) {
            minDate = new Date(
              this.min.getFullYear(),
              this.min.getMonth(),
              this.min.getDate()
            );
          }
          newDate.setMonth(month + 1);
          let maxDate = new Date(newDate.setDate(0));
          if (this.max && this.max.getTime() < maxDate.getTime()) {
            maxDate = new Date(
              this.max.getFullYear(),
              this.max.getMonth(),
              this.max.getDate()
            );
          }

          this.$emit("on-pick", { minDate, maxDate }, false, "end");
        } else {
          if (newDate >= this.minDate) {
            //顺选
            newDate.setMonth(month + 1);
            let minDate = new Date(this.minDate.getTime());
            let maxDate = new Date(newDate.setDate(0));
            let isOutRange = false;
            if (
              !!this.maxRangeMonth &&
              getMonthRange(minDate, maxDate) >= this.maxRangeMonth
            ) {
              maxDate = getDateByMonth(minDate, this.maxRangeMonth - 1);
              isOutRange = true;
            }
            if (this.min && this.min.getTime() > minDate.getTime()) {
              minDate = new Date(
                this.min.getFullYear(),
                this.min.getMonth(),
                this.min.getDate()
              );
            }
            if (this.max && this.max.getTime() < maxDate.getTime()) {
              maxDate = new Date(
                this.max.getFullYear(),
                this.max.getMonth(),
                this.max.getDate()
              );
            }
            this.$emit(
              "on-pick",
              { minDate, maxDate },
              false,
              "start",
              "straight",
              isOutRange
            );
          } else {
            //逆选
            let minDate = new Date(newDate.setDate(1));
            // const lastDate = new Date(this.minDate);
            // lastDate.setMonth(month+1);
            let maxDate = new Date(this.minDate.getTime());
            maxDate.setMonth(Number(this.minDate.getMonth()) + 1);
            maxDate.setDate(0);
            let isOutRange = false;
            if (
              !!this.maxRangeMonth &&
              getMonthRange(minDate, maxDate) >= this.maxRangeMonth
            ) {
              minDate = getDateByMonth(maxDate, -(this.maxRangeMonth - 1));
              isOutRange = true;
            }

            if (this.min && this.min.getTime() > minDate.getTime()) {
              minDate = new Date(
                this.min.getFullYear(),
                this.min.getMonth(),
                this.min.getDate()
              );
            }
            if (this.max && this.max.getTime() < maxDate.getTime()) {
              maxDate = new Date(
                this.max.getFullYear(),
                this.max.getMonth(),
                this.max.getDate()
              );
            }
            this.$emit(
              "on-pick",
              { minDate, maxDate },
              false,
              "start",
              "reverse",
              isOutRange
            );
          }
        }
      }
    },
    // handleClick (event) {

    //     if (cell.disabled) return;
    //     const newDate = cell.date;

    //     const target = event.target;
    //     if (target.tagName === 'EM') {
    //         const index = parseInt(event.target.getAttribute('index'));
    //         const cell = this.cells[index];
    //         if (cell.disabled) return;

    //         this.$emit('on-pick', index);
    //     }
    //     this.$emit('on-pick-click');
    // },
    tCell(cell) {
      return this.t(`i.datepicker.months.m${cell}`);
    }
  }
};
</script>
