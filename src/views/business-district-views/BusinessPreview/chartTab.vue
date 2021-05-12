<template>
  <div class="chart-tab-wrapper">
    <div class="chart-header">
      <div class="left-head">商圈数量</div>
      <div class="right-head" v-show="false">
        <label>全开</label>
        <el-switch
          v-model="switchAll"
          @change="handleSwitchAll"
          size="small"
        ></el-switch>
      </div>
    </div>
    <div class="chart-content">
      <div class="left-content">
        <Chart :options="options"></Chart>
        <div class="total-count">
          <div class="number">{{ total }}</div>
          <p class="label">总数</p>
        </div>
      </div>
      <div class="right-content">
        <div class="legend-group">
          <div class="legend-item" v-for="(item, idx) in switchList" :key="idx">
            <div class="color" :style="{ background: colorList[idx] }"></div>
            <div class="name" :title="item.name">{{ item.name }}</div>
            <div class="value">{{ item.value }}</div>
            <div class="switch" v-show="item.showSwitch">
              <el-switch
                class="preview-switch-size"
                v-model="item.switch"
                @change="itemSwitchChanged(idx, item.switch)"
              ></el-switch>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 异常商圈 -->
    <div class="exception-content" v-show="orgLevel > 0">
      <div class="color-item"></div>
      <div class="label-item">异常商圈</div>
      <div class="count-item">{{ exceptionCount }}</div>
      <div class="swtich-item">
        <el-switch
          v-model="exceptionSwitch"
          @change="exceptionSwitchChanged"
        ></el-switch>
      </div>
    </div>
    <!-- 编辑按钮 -->
    <div class="edit-btn" v-show="orgLevel !== '-2' && orgLevel !== '-1' && orgLevel !== '0'" v-auth="'business:layout:show:modify'">
      <el-button type="primary" size="small" @click="toEdit">编辑</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Chart from '@/components/Chart'

export default {
  name: 'chartTab',
  components: {
    Chart
  },
  props: {
    legendData: {
      default() {
        return [
          // { value: 335, name: '核心城市' },
          // { value: 310, name: '精耕城市-精耕城区' },
          // { value: 234, name: '精耕城区-外埠区乡镇' },
          // { value: 135, name: '3级' },
          // { value: 1548, name: '4级' },
          // { value: 1548, name: '5级' }
        ]
      },
      type: Array
    },
    total: {
      default: 0
    },
    exceptionCount: {
      default: 0
    }
  },
  computed: {
    ...mapGetters('businessPreview', ['orgLevel'])
  },
  data() {
    return {
      switchAll: false,
      options: {},
      // totalCount: 2584,
      // exceptionCount: 3,
      exceptionSwitch: false,
      switchList: [],
      colorList: [],
    }
  },
  methods: {
    handleSwitchList(boo = true) {
      this.switchList = []
      this.colorList = []
      if (this.legendData && this.legendData.length) {
        this.legendData.forEach((item, index) => {
          this.colorList.push(item.color)
          // 当前组织层级是-康面事业部/全国/南北区 只开启前两层商圈（只显示前两层开关）
          if (this.orgLevel === '-2' || this.orgLevel === '-1' || this.orgLevel === '0') {
            this.switchList.push({
              switch: index < 2 ? boo : false,
              showSwitch: index < 2 ? true : false,
              value: item.value,
              name: item.businessLevelName,
              color: item.color
            })
          } else { // 如果是行销公司/营业部 只开启前两层商圈（其他开关也显示，但不打开）
            this.switchList.push({
              // switch: boo,
              switch: index < 2 ? boo : false,
              showSwitch: true,
              value: item.value,
              name: item.businessLevelName,
              color: item.color
            })
          }
        })
      }
      this.initChartOption(this.switchList)
    },
    initChartOption(data) {
      this.options = {
        color: this.colorList,
        tooltip: {
          show: false
        },
        series: [
          {
            type: 'pie',
            radius: ['55%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false
              }
            },
            labelLine: {
              show: false
            },
            data
          }
        ]
      }
    },
    handleSwitchAll(val) {
      this.handleSwitchList(val)
    },
    exceptionSwitchChanged() {
      this.$store.commit(
        'businessPreview/setExceptionCtrlSwitch',
        this.exceptionSwitch
      )
    },
    toEdit() {
      // 组织id
      this.$store.dispatch('map/setOrganizationId', this.$store.state.map.organizationId)
      // 组织name
      this.$store.dispatch('map/setOrganizationName',this.$store.state.map.organizationName)
      this.$router.push({
        path: `create/${this.$route.query.proNumber}`,
        query: {
          orgId: this.$store.state.map.organizationId,
          proYear: this.$route.query.proYear,
          proQuarter: this.$route.query.proQuarter,
          proName: this.$route.query.proName,
          proId: this.$route.query.proId
        }
      })
    },
    // 判断第几个开关打开或关闭
    itemSwitchChanged(idx, item) {
      this.$store.commit('businessPreview/setCurrentSwitchIndex', idx)
      this.$store.commit('businessPreview/setCurrentSwitchOpen', item)
    },
  },
  watch: {
    // 监听饼图数据变化
    legendData: {
      handler() {
        this.handleSwitchList()
        this.exceptionSwitch = false
      },
      deep: true
    },
    // 监听开关变化
    switchList: {
      handler() {
        if (this.switchList.length) {
          const showSwitchs = this.switchList.filter(it => it.showSwitch)
          this.switchAll = showSwitchs.every(ce => ce.switch === true)
        }
        this.$emit('handleChange', this.switchList)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-tab-wrapper {
  width: 100%;
  .chart-header {
    height: 34px;
    line-height: 34px;
    background: #133773;
    box-shadow: 0px -1px 0px 0px #0a2757;
    display: flex;
    .left-head {
      flex: 1;
      padding-left: 16px;
      font-weight: 600;
    }
    .right-head {
      flex-basis: 100px;
      label {
        padding-right: 15px;
      }
    }
  }
  .chart-content {
    height: 200px;
    display: flex;
    background: #102f63;
    box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.5);
    .left-content {
      flex-basis: 160px;
      height: 100%;
      position: relative;
      .total-count {
        width: 60px;
        height: 60px;
        position: absolute;
        left: 50px;
        top: 70px;
        z-index: 1;
        text-align: center;
        .number {
          height: 35px;
          line-height: 35px;
          font-size: 24px;
          font-weight: bold;
          color: #ffffff;
        }
        .label {
          height: 16px;
          font-size: 13px;
          color: #ffffff;
          line-height: 16px;
        }
      }
    }
    .right-content {
      flex: 1;
      overflow-y: auto;
      .legend-group {
        padding-top: 20px;
        .legend-item {
          display: flex;
          height: 25px;
          line-height: 25px;
          .color {
            flex-basis: 8px;
            height: 8px;
            margin: 8px;
          }
          .name {
            flex-basis: 105px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            margin-right: 10px;
          }
          .value {
            flex-basis: 40px;
            font-size: 16px;
            font-weight: bold;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          .switch {
            flex-basis: 50px;
          }
        }
      }
    }
  }
  .exception-content {
    display: flex;
    height: 40px;
    line-height: 40px;
    padding-left: 15px;
    margin-top: 12px;
    background: #102f63;
    box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.5);
    .color-item {
      flex-basis: 20px;
      height: 20px;
      background-color: #930cea;
      margin-top: 10px;
    }
    .label-item {
      font-size: 12px;
      font-weight: 600;
      flex-basis: 60px;
      margin: 0 10px;
    }
    .count-item {
      flex-basis: 225px;
      font-size: 16px;
      font-weight: bold;
    }
    .swtich-item {
      flex-basis: 50px;
    }
  }
  .edit-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 50px;
    line-height: 50px;
    width: 400px;
    background: #0a2757;
    border-top: 1px solid #4b1f98;
    text-align: center;
    .el-button {
      width: 350px;
    }
  }
}
</style>

<style lang="scss">
.chart-tab-wrapper {
  .preview-switch-size {
    .el-switch__core {
      width: 30px !important;
      height: 16px;
      &::after {
        width: 12px;
        height: 12px;
        margin-left: 0px;
      }
    }
    &.el-switch.is-checked .el-switch__core::after {
      margin-left: -14px;
    }
  }
}
</style>
