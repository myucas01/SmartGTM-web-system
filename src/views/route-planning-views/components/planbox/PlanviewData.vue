<template>
  <div class="main_top">
    <div class="topbox">
      <span>数据总览</span>
      <span class="close" @click="changeVIew(false)">
        <i
          :class="
            heightNum === 'height:255px'
              ? 'el-icon-arrow-down'
              : 'el-icon-arrow-up'
          "
        ></i
      ></span>
      <span class="enlarge" @click="showEnlarge()">
        <i class="el-icon-copy-document"></i>
      </span>
    </div>
    <div class="bottom_tab" :style="heightNum">
      <!-- 数据总览 -->
      <AllData :tableData="tableData" :heightNum="heightNum"></AllData>
      <AreaForm ref="enlargeAreaForm" :tableData="tableData"></AreaForm>
    </div>
  </div>
</template>
<script>
import AllData from './AllData' // 数据总览
import AreaForm from './AreaForm' // 数据总览 放大
import ROUTE_PLANNING_API from '@api/route/planpreview_api'
export default {
  name: 'OverviewData',
  data() {
    return {
      tableData: [],
      heightNum: 'height:255px'
    }
  },
  components: {
    AllData,
    AreaForm
  },
  props: ['isPlan', 'NowWeek', 'nowPostId', 'PlanId', 'isHistory'],
  mounted() {
    // ******调用接口获取数据总览首页数据
    this.getTableData()
  },
  watch: {
    nowPostId: {
      handler() {
        this.getTableData()
      },
      deep: true
    },
    NowWeek: {
      handler() {
        this.getTableData()
      },
      deep: true
    }
  },
  methods: {
    showEnlarge() {
      this.$refs.enlargeAreaForm.dialogVisible = true
    },
    async getTableData() {
      if (this.nowPostId) {
        if (this.nowPostId.length < 1) {
          this.tableData = []
          return
        }
        let result = await ROUTE_PLANNING_API.get_all_area({
          jobId: this.nowPostId ? this.nowPostId : '',
          programId: this.PlanId,
          visitWeek: this.NowWeek ? this.NowWeek : '',
          isHistory: this.isHistory,
          isPlan: this.isPlan
        })
        if (result.code == 200) {
          this.tableData = result.data.areaList
          this.tableData.push({
            jobName: '合计',
            areaName: result.data.areaCount,
            highOutputValue: result.data.higValueCount,
            potential: result.data.potentialCount,
            basis: result.data.basisCount,
            lowPerformance: result.data.lowPerformanceCount,
            noHighOutputValue: result.data.noHigValueCount,
            noPotential: result.data.noPotentialCount,
            noBasis: result.data.noBasisCount,
            noLowPerformance: result.data.noLowPerformanceCount,
            rountSum: result.data.routeCount,
            total: result.data.storeTotal,
            avgTotal: result.data.avgStoreTotal,
            performance: result.data.performanceTotal,
            performanceValue: result.data.performanceValueTotal,
            yy: result.data.yyCount,
            yl: result.data.ylCount,
            ys: result.data.ysCount,
            btnshow: true
          })
        }
      }
    },
    changeVIew(value) {
      this.$emit('getShowOverview', value)
    }
  }
}
</script>
<style lang="scss" scoped>
.main_top {
  display: flex;
  width: 100%;
  height: auto !important;
  background: #0a2757;
  position: absolute;
  z-index: 161;
  right: 0px;
  bottom: 0px;
  flex-wrap: wrap;
  overflow: auto;
}

.topbox {
  height: 32px;
  display: block;
  width: 100%;
  line-height: 32px;
  background: #133773;
  color: #ffffff;
  font-size: 14px;
  padding: 0px 12px;
  text-align: left;
  width: 100%;

  span {
    cursor: pointer;
  }

  .enlarge {
    float: right;
    margin-right: 10px;
  }

  .close {
    float: right;
  }
}

.bottom_tab {
  display: block;
  background-color: #102f63;
  width: 99%;
  margin: 8px;
  height: 255px;
  overflow: auto;
}
.newbottom_tab {
  display: block;
  background-color: #102f63;
  width: 99%;
  margin: 8px;
  height: 155px;
  overflow: auto;
}
</style>
