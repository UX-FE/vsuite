<template>
  <div>
    <Date
      type="daterange"
      placeholder="Select date"
      style="width: 224px"
      :placement="'left'"
      :right="''"
      :value="(!date.single)?date.cur:date.singleCur"
      :options="date.options"
      :compare="false"
      :single-date="true"
      :min="date.min"
      :max="date.max"
      confirm
      clearable
      piker-type
      show-time
      show-tip
      :max-range-day="366"
      @on-change="handleDateChange"
    ></Date>
    <!-- <Date
                       type="datetimerange"
                        style="width: 320px" 
                        v-model="datetime.cur"
                        selectedBar
                        clearable
                        placeholder="Select date" 
                        extraTip="起止时间段不能超过24小时"
                        :maxRangeDay="1"
                        :top="'0'"
                        disabledOutRange
                       ></Date>
    {{datetime.cur}}-->
    <!-- <Date 
                        type="daterange" 
                        placeholder="Select date" 
                        style="width: 224px" 
                        :value="date3.cur"
                        :options="date3.options"
                        :min ="date3.min"
                        :max ="date3.max"
                        confirm
                        piker-type
                        show-time
                        show-tip
                        compare
                        :max-range-day=366
                        :max-range-month=12
                        left-icon="arrow-left"
                        right-icon="arrow-right"
                        left-year-icon="arrow-left2"
                        right-year-icon="arrow-right2"
                        @on-change="handleDateChange"
    ></Date>-->
    <!-- {{date.cur}}
    <Date
      type="daterange"
      placeholder="Select date"
      style="width: 224px"
      :placement="'left'"
      :right="''"
      :value="date.cur"
      :options="date.options"
      :compare="true"
      :single-date="date.single"
      :min="date.min"
      :max="date.max"
      confirm
      piker-type
      show-time
      show-tip
      :max-range-day="366"
      :max-range-month="12"
      left-icon="arrow-left"
      right-icon="arrow-right"
      left-year-icon="arrow-left2"
      right-year-icon="arrow-right2"
      @on-change="handleDateChange"
    ></Date>
    <BaseButton @on-click-btn="handleChangeToNoCompare">修改不对比</BaseButton>-->
    <!-- <Date
      type="daterange"
      placeholder="Select date"
      style="width: 224px"
      :placement="'left'"
      :right="''"
      :value="date.cur"
      :min="date.min"
      :max="date.max"
      :max-range-day="366"
      :max-range-month="12"
      left-icon="arrow-left"
      right-icon="arrow-right"
      left-year-icon="arrow-left2"
      right-year-icon="arrow-right2"
      @on-change="handleDateChange"
    ></Date>-->
    <!-- <Date 
                        type="daterange" 
                        placeholder="Select date" 
                        style="width: 224px" 
                        :placement="'left'"
                        :right="''"
                        v-model="date3.cur"
                        :options="date3.options"
                        :single-date="date3.single"
                        :min ="date3.min"
                        :max ="date3.max"
                        :monthRows="3"
                        confirm
                        :emitShortCut ='false'
                        piker-type
                        show-time
                        preIcon="calendar1"
                        @on-change="handleDateChange"
                        show-tip
                        :max-range-day=366
                        :max-range-month=12
                        left-icon="arrow-left"
                        right-icon="arrow-right"
                        left-year-icon="arrow-left2"
                        right-year-icon="arrow-right2"
                        ></Date>
                       {{date3.cur}}
                        <Date 
                        type="date" 
                        v-model="date1"
                        dropForDate
                        :min="min"
                        :max="max"
                        wrapSelection
                        :top="'0px'"
                        dropIcon="alert"
                        placeholder="选择单日" 
                        preIcon="sort-down"
                        style="width: 224px" 
                        ></Date>{{date1}}
                        <Date 
                        type="daterange" 
                        v-model="date2"
                        placement="bottom-start"
                        placeholder="选择日期范围" 
                        style="width: 224px" 
                        confirm
                        :top="'0'"
                        ></Date>{{date2}}
                        <!-- <Date 
                        type="date" 
                        v-model="date1"
                        readonly
                        placeholder="选择单日" 
                        style="width: 224px" 
    ></Date>-->
    <!-- <Date 
                        type="date" 
                        fixTitle="hahhah"
                        v-model="date1"
                        format="yyyy年==MM月==dd"
                        placeholder="选择单日" 
                        style="width: 224px" 
    ></Date>{{date1}}-->

    <!-- <Date
      type="daterange"
      placeholder="Select date"
      style="width: 224px"
      placement="left"
      v-model="date2"
      :compare="false"
      :single-date="false"
      confirm
      piker-type
      show-time
      show-tip
      :max-range-day="366"
      :max-range-month="12"
    ></Date>

    {{date2}}-->
     <Date 
      type="date" 
      v-model="option.value"
      :clearable="true"></Date>

  </div>
</template>

<script>
export default {
  data() {
    return {
      option:{
        value:"2019-06-13",
      },
      uxMaxDate:new Date(),
      date: {
        cur: [ "2019-05-15", "2019-06-13"],
        singleCur: "2019-06-13",
        compare: false,
        single: true,
        min: new Date(2014, 0, 1),
        max: new Date(),
        options: {
          shortcuts: [
            {
              text: "今日",
              disabled: true,
              value() {
                const end = new Date();
                const start = new Date();
                return [start, end];
              },
              onClick: picker => {}
            },
            {
              text: "昨日",
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                return [start, end];
              },
              onClick: picker => {}
            },
            {
              text: "最近1周",
              value() {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                return [start, end];
              },
              onClick: picker => {}
            },
            {
              text: "最近1个月",
              value() {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                return [start, end];
              }
            },
            {
              text: "最近3个月",
              value() {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                return [start, end];
              }
            },
            {
              text: "最近半年",
              value() {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 183);
                return [start, end];
              }
            },
            {
              text: "最近1年",
              value() {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 366);
                return [start, end];
              }
            }
          ],
          disabledDate(date) {
            //设置不可操作的日期：
            //最小日期：2014年1月1日
            const minDate = new Date(2014, 1, 1);
            //最大日期，昨天
            const maxDate = new Date();
            const max = new Date();
            max.setTime(max.getTime() - 3600 * 1000 * 24 * 1);
            maxDate.setTime(max);
            return (
              date &&
              (date.getTime() <= minDate.getTime() ||
               (date.getTime()>=(maxDate.getTime())))
            );
          }
        }
      },
      // date: {
      //   cur: [ "2019-05-15", "2019-06-13" ],
      //   singleCur: [],
      //   compare: false,
      //   single: false,
      //   min: new Date(2014, 0, 1),
      //   max: new Date(),
      //   options: {
      //     shortcuts: [
      //       {
      //         text: "今日",
      //         disabled: true,
      //         value() {
      //           const end = new Date();
      //           const start = new Date();
      //           return [start, end];
      //         },
      //         onClick: picker => {}
      //       },
      //       {
      //         text: "昨日",
      //         value() {
      //           const end = new Date();
      //           const start = new Date();
      //           start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
      //           end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
      //           return [start, end];
      //         },
      //         onClick: picker => {}
      //       },
      //       {
      //         text: "最近1周",
      //         value() {
      //           const end = new Date();
      //           const start = new Date();
      //           end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
      //           start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      //           return [start, end];
      //         },
      //         onClick: picker => {}
      //       },
      //       {
      //         text: "最近1个月",
      //         value() {
      //           const end = new Date();
      //           const start = new Date();
      //           end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
      //           start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      //           return [start, end];
      //         }
      //       },
      //       {
      //         text: "最近3个月",
      //         value() {
      //           const end = new Date();
      //           const start = new Date();
      //           end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
      //           start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      //           return [start, end];
      //         }
      //       },
      //       {
      //         text: "最近半年",
      //         value() {
      //           const end = new Date();
      //           const start = new Date();
      //           end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
      //           start.setTime(start.getTime() - 3600 * 1000 * 24 * 183);
      //           return [start, end];
      //         }
      //       },
      //       {
      //         text: "最近1年",
      //         value() {
      //           const end = new Date();
      //           const start = new Date();
      //           end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
      //           start.setTime(start.getTime() - 3600 * 1000 * 24 * 366);
      //           return [start, end];
      //         }
      //       }
      //     ],
      //     disabledDate(date) {
      //       //设置不可操作的日期：
      //       //最小日期：2014年1月1日
      //       const minDate = new Date(2014, 1, 1);
      //       //最大日期，昨天
      //       const maxDate = new Date();
      //       return (
      //         date &&
      //         (date.getTime() <= minDate.getTime() ||
      //           date.getTime() >= maxDate.getTime() - 24 * 60 * 60 * 1000)
      //         // (date.getTime()>=(maxDate.getTime()))
      //       );
      //     }
      //   }
      // },
      datetime: {
        cur: ["2019-05-30 00:00:00", "2019-05-31 00:00:00"]
      },
      date1: "2018-5-17",
      date2: [],
      min: new Date(2014, 7, 1),
      max: new Date(),
      date3: {
        cur: ["2019-03-23", "2019-03-26"],
        singleCur: [],
        compare: false,
        single: false,
        min: new Date(2014, 0, 1),
        max: new Date(),
        options: {
          shortcuts: [
            {
              text: "今日",
              disabled: false,
              value() {
                const end = new Date();
                const start = new Date();
                return [start, end];
              },
              onClick: picker => {}
            },
            {
              text: "昨日",
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                return [start, end];
              },
              onClick: picker => {}
            },
            {
              text: "最近1周",
              value() {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                return [start, end];
              },
              onClick: picker => {}
            },
            {
              text: "最近1个月",
              value() {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                return [start, end];
              }
            },
            {
              text: "最近3个月",
              value() {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                return [start, end];
              }
            },
            {
              text: "最近半年",
              value() {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 183);
                return [start, end];
              }
            },
            {
              text: "按自然月",
              pickType: "month",
              value() {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 366);
                return [start, end];
              }
            }
          ],
          disabledDate(date) {
            //设置不可操作的日期：
            //最小日期：2014年1月1日
            const minDate = new Date(2014, 1, 1);
            //最大日期，昨天
            const maxDate = new Date();
            maxDate.setTime(new Date());
            return (
              date &&
              (date.getTime() <= minDate.getTime() ||
                // (date.getTime()>=(maxDate.getTime()-24*60*60*1000))
                date.getTime() >= maxDate.getTime())
            );
          }
        }
      }
    };
  },
  methods: {
    handleDateChange(item) {
      this.date.cur = item;
    },
    handleChangeToNoCompare() {
      this.date.cur = ["2019-03-01", "2019-03-09", "2019-02-20", "2019-02-28"];
    }
  },
  mounted () {
    this.uxMaxDate.setTime(this.uxMaxDate.getTime() - 3600 * 1000 * 24 * 1);
    this.date.max = this.uxMaxDate;
  },
};
</script>

<style scoped>
</style>