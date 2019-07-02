<template>
  <div>
    <!-- <Table :thead="table1.thead" :data="table1.data" :scrollHeight="100" scrollPull>
                </Table>
    <br/>-->
    <Table
      :thead="table4.thead"
      :data="table4.data"
      multi-select
      :select-all="table4.selectAll"
      @on-check-all="handleCheckAll"
      type="bordered"
    >
      <tr slot="tr" v-for="(item,index) in table4.data" :key="index">
        <template v-for="(itm,i) in table4.thead">
          <td :key="index+i" v-if="i===0" class="td-check">
            <Checkbox v-model="table4.checks[index]"></Checkbox>
          </td>
          <td :key="index+i" v-else v-html="item[itm.column]"></td>
        </template>
      </tr>
    </Table>
    <!-- <Table :thead="table5.thead" :data="table5.data" clickable :expanded-indexs="currentExpandShow" :expand="table5.expandRender" type="zebra" @on-click-row="handleClick">
    </Table>-->
  </div>
</template>

<script>
import expandRow from "./table-expand.vue";
export default {
  components: { expandRow },
  data() {
    return {
      table1: {
        loading: false,
        thead: [
          {
            column: "date",
            name: "日期"
          },
          {
            column: "name",
            name: "姓名"
          },
          {
            column: "address",
            name: "地址"
          }
        ],
        data: [
          {
            date: "2018-01-02",
            name: "微笑",
            address: "广州市"
          },
          {
            date: "2018-01-02",
            name: "微笑",
            address: "广州市"
          },
          {
            date: "2018-01-02",
            name: "微笑",
            address: "广州市"
          },
          {
            date: "2018-01-02",
            name: "微笑",
            address: "广州市"
          }
        ]
      },
      table4: {
        checks: [],
        checkedArr: [],
        selectAll: false,
        thead: [
          {
            type: "selection",
            width: 80
          },
          {
            column: "date",
            name: "日期",
            sort: true
          },
          {
            column: "name",
            name: "姓名",
            sort: true
          },
          {
            column: "address",
            name: "地址",
            sort: true
          }
        ],
        data: [
          {
            date: "2018-01-02",
            name: "微笑",
            address: "广州市"
          },
          {
            date: "2018-01-03",
            name: "微笑",
            address: "广州市"
          },
          {
            date: "2018-01-04",
            name: "微笑",
            address: "广州市"
          },
          {
            date: "2018-01-05",
            name: "微笑",
            address: "广州市"
          }
        ]
      },
      table5: {
        expandRender: (h, params) => {
          return h(expandRow, {
            props: {
              row: params.row
            }
          });
        },
        thead: [
          {
            type: "expand",
            width: 60
          },
          {
            column: "date",
            name: "日期"
          },
          {
            column: "name",
            name: "姓名"
          },
          {
            column: "address",
            name: "地址"
          }
        ],
        data: [
          {
            date: "2018-01-02",
            name: "微笑",
            address: "广州市"
          },
          {
            date: "2018-01-02",
            name: "微笑",
            address: "广州市"
          },
          {
            date: "2018-01-02",
            name: "微笑",
            address: "广州市"
          },
          {
            date: "2018-01-02",
            name: "微笑",
            address: "广州市"
          }
        ]
      },
      currentExpandShow: []
    };
  },
  watch: {
    "table4.checks"(val) {
      if (val.indexOf(0) < 0 && val.indexOf(false) < 0) {
        this.table4.selectAll = true;
      } else {
        this.table4.selectAll = false;
      }
      this.table4.checkedArr = [];
      this.table4.data.forEach((item, index) => {
        if (val[index]) {
          this.table4.checkedArr.push(item.date);
        }
      });
    }
  },
  methods: {
    handleClick(index) {
      if (this.currentExpandShow.indexOf(index) > -1) {
        this.currentExpandShow.splice(index, 1);
      } else {
        this.currentExpandShow.push(index);
      }
    },
    handleCheckAll(isSelectAll, currentSelectIndexs) {
      this.table4.checkedArr = [];
      if (isSelectAll) {
        this.table4.data.forEach((item, index) => {
          this.table4.checks.splice(index, 1, true);
          this.table4.checkedArr.push(item.date);
        });
      } else {
        this.table4.data.forEach((item, index) => {
          this.table4.checks.splice(index, 1, false);
        });
      }
    }
  }
};
</script>

<style scoped>
</style>