<template>
  <div class="checkbox-group-wrap">
    <!-- 名称、类型、边界、范围、全部 -->
    <div class="title-head">
      <div class="label-item"></div>
      <div class="check-item" v-for="(item, idx) in columns" :key="idx">
        {{ item.name }}
      </div>
      <div class="check-item">全部</div>
    </div>
    <!-- 第一行：多选框全选 -->
    <div class="checkbox-head">
      <div class="label-item">{{ title }}</div>
      <div class="check-item" v-for="(item, i) in columns" :key="i">
        <el-checkbox
          :indeterminate="businessColumCheckAll[item.id + 'IsIndeterminate']"
          v-model="businessColumCheckAll[item.id + 'Check']"
          @change="handleCheckColumnAllChange(item.id)"
          :disabled="
            labels.length === 0 || businessColumCheckAll[item.id + 'Disable']
          "
        ></el-checkbox>
      </div>
      <div class="check-item">
        <!-- <el-checkbox
            v-model="businessColumCheckAll.totalCheck"
            :disabled="businessColumCheckAll.totalDisable"
          ></el-checkbox> -->
      </div>
    </div>
    <!-- 循环展示多选框 -->
    <div class="levels-body">
      <div class="level-row" v-for="(item, idx) in businessList" :key="idx">
        <div class="label-item">
          <span
            v-if="title === '商圈形态'"
            class="color"
            :style="{ background: item.color }"
          ></span>
          <i v-else class="icon el-icon-copy-document"></i>
          <span class="text" :title="item.label">{{ item.label }}</span>
        </div>
        <div class="check-item" v-for="(it, i) in columns" :key="i">
          <el-checkbox
            v-model="item[it.id + 'Check']"
            :disabled="item[it.id + 'Disable']"
            @change="handleItemChange"
          ></el-checkbox>
        </div>
        <div class="check-item">
          <el-checkbox
            :indeterminate="item.totalIsIndeterminate"
            v-model="item.totalCheck"
            :disabled="item.totalDisable"
            @change="handleCheckRowAllChange(idx)"
          ></el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'checkboxGroup',
  props: {
    title: {
      default: '',
      type: String
    },
    labels: {
      type: Array,
      default() {
        return [
          // { name: '核心城市', color: '#FFA300' },
          // { name: '精耕城市-精耕城区', color: '#FFC605' },
          // { name: '精耕城区-外埠区乡镇', color: '#FAE902' },
          // { name: '3级', color: '#00E7C0' },
          // { name: '4级', color: '#318EE9' },
          // { name: '5级', color: '#7ED321' }
        ]
      }
    },
    columns: {
      type: Array,
      default() {
        return [
          // { name: '名称', id: 'name' },
          // { name: '类型', id: 'type' },
          // { name: '边界', id: 'border' },
          // { name: '范围', id: 'range' }s
        ]
      }
    }
  },
  computed: {
    ...mapGetters('businessPreview', ['orgLevel', 'analysisCtrlList'])
  },
  data() {
    return {
      businessList: [],
      businessColumCheckAll: {}
    }
  },
  watch: {
    labels: {
      handler() {
        this.initBusinessControl()
      },
      deep: true
    },
    businessList: {
      handler() {
        // 纵向 列监听
        this.columns.forEach(prop => {
          const propArr = this.businessList.map(it => it[prop.id + 'Check'])
          const filterArr = propArr.filter(ce => ce === true)
          this.businessColumCheckAll[prop.id + 'IsIndeterminate'] =
            filterArr.length > 0 && filterArr.length < propArr.length
          this.businessColumCheckAll[prop.id + 'Check'] =
            propArr.length && propArr.every(ce => ce === true)
        })
        // 横向 行监听
        this.businessList.forEach(item => {
          const propArr = this.columns.map(ce => item[ce.id + 'Check'])
          const filterArr = propArr.filter(ce => ce === true)
          item['totalIsIndeterminate'] =
            filterArr.length > 0 && filterArr.length < propArr.length
          item['totalCheck'] =
            propArr.length && propArr.every(ce => ce === true)
        })
      },
      deep: true
    },
    // 监听商圈统计分析的switch开关变化
    analysisCtrlList: {
      handler(arr) {
        if (
          arr &&
          arr.length &&
          this.title === '商圈形态' &&
          this.businessList.length
        ) {
          // 商圈形态 和标题同一行 全选列checkbox-disable判断
          const isSwitch = arr
            .filter(item => item.showSwitch)
            .every(cell => cell.switch)
          this.columns.forEach(prop => {
            this.businessColumCheckAll[prop.id + 'Disable'] = !isSwitch
          })
          // 商圈形态 商圈级别-单个checkbox判断
          arr.forEach((item, idx) => {
            if (item.showSwitch) {
              if (item.switch) {
                // check
                // this.businessList[idx].nameCheck = true
                // this.businessList[idx].typeCheck = false
                // this.businessList[idx].borderCheck = true
                // this.businessList[idx].rangeCheck = true
                // disable
                // this.businessList[idx].nameDisable = false
                // this.businessList[idx].typeDisable = false
                // this.businessList[idx].borderDisable = false
                // this.businessList[idx].rangeDisable = false
                // this.businessList[idx].totalDisable = false
              } else {
                // check
                // this.businessList[idx].nameCheck = false
                // this.businessList[idx].typeCheck = false
                // this.businessList[idx].borderCheck = false
                // this.businessList[idx].rangeCheck = false
                // disable
                // this.businessList[idx].nameDisable = true
                // this.businessList[idx].typeDisable = true
                // this.businessList[idx].borderDisable = true
                // this.businessList[idx].rangeDisable = true
                // this.businessList[idx].totalDisable = true
              }
              this.columns.forEach(prop => {
                if (prop.id === 'type' || prop.id === 'name') {
                  // 默认 类型不勾选+名称不勾选
                  this.businessList[idx][prop.id + 'Check'] = false
                } else {
                  this.businessList[idx][prop.id + 'Check'] = item.switch ? true : false
                }
                this.businessList[idx][prop.id + 'Disable'] = item.switch ? false : true
              })
              this.businessList[idx].totalDisable = item.switch ? false : true
            }
          })
        }
      },
      deep: true
    }
  },
  created() {
    // this.initBusinessControl()
  },
  methods: {
    // 初始化多选框面板
    initBusinessControl() {
      this.businessList = []
      // 第一行标题-全选复选框(如果是商圈形态，则列是选中状态)
      this.columns.forEach(it => {
        this.$set(
          this.businessColumCheckAll,
          `${it.id}Check`,
          this.title === '商圈形态' ? true : false
        )
        this.$set(
          this.businessColumCheckAll,
          `${it.id}IsIndeterminate`,
          this.title === '商圈形态' ? true : false
        )
        this.$set(this.businessColumCheckAll, `${it.id}Disable`, false)
      })
      if (this.labels.length) {
        // 商圈形态list复选框
        this.labels.forEach(item => {
          const temp = {
            label: item.name,
            color: item.color,
            totalCheck: false,
            totalDisable: false,
            totalIsIndeterminate: false
          }
          this.columns.forEach(it => {
            this.$set(temp, `${it.id}Check`, false)
            this.$set(temp, `${it.id}Disable`, false)
          })
          this.businessList.push(temp)
        })
        if (this.title === '商圈形态') {
          // 商圈形态-勾选名称(全国/南北区不显示name/type/border列)
          if (this.orgLevel > 0) this.handleCheckColumnAllChange('name')
          // 商圈形态-勾选边界(全国/南北区不显示name/type/border列)
          if (this.orgLevel > 0) this.handleCheckColumnAllChange('border')
          // 商圈形态-勾选范围
          this.handleCheckColumnAllChange('range')
        }
        if (this.title === '组织架构') {
          if (this.businessList && this.businessList.length) {
            this.businessList.forEach(item => {
              item['nameCheck'] = true
              item['borderCheck'] = true
            })
          }
        }
      }
      this.$emit('handleCheck', this.businessList)
    },
    // 第一行标题复选框操作： 某一列所有的复选框改变
    handleCheckColumnAllChange(columnId) {
      this.businessList.forEach(item => {
        item[columnId + 'Check'] = this.businessColumCheckAll[
          columnId + 'Check'
        ]
      })
      this.$emit('handleCheck', this.businessList)
    },
    // 最后一列操作：某一行所有的复选框改变
    handleCheckRowAllChange(rowIdx) {
      this.columns.forEach(it => {
        this.businessList[rowIdx][it.id + 'Check'] = this.businessList[rowIdx][
          'totalCheck'
        ]
      })
      this.$emit('handleCheck', this.businessList)
    },
    // 单个操作：某一行某一列的复选框改变
    handleItemChange() {
      this.$emit('handleCheck', this.businessList)
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox-group-wrap {
  margin: 4px 0;
  .title-head,
  .checkbox-head {
    display: flex;
    .label-item {
      flex: 1;
      padding-left: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    .check-item {
      flex-basis: 45px;
      text-align: center;
    }
  }
  .title-head {
    height: 30px;
    line-height: 30px;
  }
  .checkbox-head {
    height: 34px;
    line-height: 34px;
    background: #133773;
    box-shadow: 0px 1px 0px 0px #0a2757;
  }
  .levels-body {
    padding: 5px 0;
    background: #102f63;
    .level-row {
      display: flex;
      height: 30px;
      line-height: 30px;
      .label-item {
        flex: 1;
        // padding-left: 12px;
        .color {
          display: inline-block;
          width: 6px;
          height: 12px;
          margin: 0 5px 10px 12px;
        }
        .icon {
          display: inline-block;
          margin: 0 5px 10px 12px;
          transform: rotate(314deg);
        }
        .text {
          display: inline-block;
          width: 120px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      .check-item {
        flex-basis: 45px;
        text-align: center;
      }
    }
  }
}
</style>
