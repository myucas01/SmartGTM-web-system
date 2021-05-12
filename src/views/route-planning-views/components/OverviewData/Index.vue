<template>
  <div class="main_top">
    <div class="topbox">
      <span @click="previewData(0)">数据总览</span>
      <span v-show="Secondary" @click="previewData(1)"> > {{ Secondary }}</span>
      <span v-show="threeLevel" @click="previewData(2)">
        > {{ threeLevel }}</span
      >
      <span class="close" @click="changeVIew()">
        <i class="el-icon-close"></i
      ></span>
      <span class="enlarge" @click="showEnlarge()">
        <i class="el-icon-copy-document"></i>
      </span>
    </div>
    <div class="bottom_tab">
      <PreviewAll
        v-if="!Secondary && !threeLevel"
        @tabData="tabData"
        :tableData="tableData"
      ></PreviewAll>
      <SeconDary
        v-else-if="Secondary && !threeLevel"
        @tabData="tabData"
        :tableData="seconDaryData"
      ></SeconDary>
      <ThreeLevel
        v-else-if="Secondary && threeLevel"
        :tableData="threeLevelData"
      ></ThreeLevel>
      <EnlarAreaForm
        ref="enlargeAreaForm"
        :previewData="previewData"
        @tabData="tabData"
        :tableData="tableData"
        :seconDaryData="seconDaryData"
        :threeLevelData="threeLevelData"
        :Secondary="Secondary"
        :threeLevel="threeLevel"
      ></EnlarAreaForm>
    </div>
  </div>
</template>
<script>
import PreviewAll from './previewAll' // 业代类型数据总览
import SeconDary from './seconDary' // 区域数据总览
import ThreeLevel from './threeLevel' // 路线数据总览
import EnlarAreaForm from './enlargeAreaForm' // 数据总览 放大
import ROUTE_PLANNING_API from '@api/route/planpreview_api'
import { mapGetters } from 'vuex'
export default {
  name: 'OverviewData',
  data() {
    return {
      Secondary: null,
      tableData: [],
      seconDaryData: [],
      threeLevelData: [],
      threeLevel: null,
      SecondAreaId: null,
      oneparams: {},
      twoparams: {},
      thereparams: {}
    }
  },
  components: {
    PreviewAll,
    SeconDary,
    ThreeLevel,
    EnlarAreaForm
  },
  computed: {
    ...mapGetters('routerPlanning', ['NowWeek', 'nowPostId'])
  },
  props: ['isPlan'],
  mounted() {
    // ******调用接口获取数据总览首页数据
    this.getTableData()
  },
  watch: {
    nowPostId: {
      handler() {
        this.inRefreshview()
      },
      deep: true
    },
    NowWeek: {
      handler() {
        this.inRefreshview()
      },
      deep: true
    }
  },
  methods: {
    Refreshoverview() {
      this.getTableData(this.oneparams)
      if (this.Secondary) {
        this.getSeconDaryData(null, this.twoparams)
      }
      if (this.threeLevel) {
        this.getStoreData(null, null, this.thereparams)
      }
    },
    inRefreshview() {
      this.previewData(0)
      this.getTableData()
    },
    showEnlarge() {
      this.$refs.enlargeAreaForm.dialogVisible = true
    },
    previewData(value) {
      if (value == 0) {
        this.Secondary = null
        this.threeLevel = null
      } else if (value == 1) {
        this.threeLevel = null
      } else if (value == 2) {
        // this.Secondary = '二级展开'
        // this.threeLevel = '三级展开'
      }
    },
    tabData(value, data, id, otherid) {
      if (value == 'Secondary') {
        this.Secondary = data
        this.SecondAreaId = id
        // ******调用接口获取数据总览二级数据
        this.getSeconDaryData(id)
      } else if (value == 'threeLevel') {
        this.threeLevel = data
        // ******调用接口获取数据总览三级数据
        this.getStoreData(this.SecondAreaId, otherid)
      }
    },
    async getTableData(params) {
      if (this.nowPostId.length == 0) {
        this.tableData = []
        return
      }
      if (params) {
        this.oneparams = params
      } else {
        this.oneparams = {
          jobId: this.nowPostId ? this.nowPostId : '',
          programId: this.$route.query.planId,
          visitWeek: this.NowWeek ? this.NowWeek : '',
          isPlan: this.isPlan ? this.isPlan : false
        }
      }
      let result = await ROUTE_PLANNING_API.get_all_area(this.oneparams)
      if (result.code == 200) {
        this.tableData = result.data.areaList
        this.tableData.push({
          jobName: '合计',
          areaName: result.data.areaCount,
          rountSum: result.data.routeCount,
          avgTotal: result.data.avgStoreTotal,
          performance: result.data.performanceTotal,
          performanceValue: result.data.performanceValueTotal,
          acount: result.data.atotal,
          bcount: result.data.btotal,
          wholeSale: result.data.wholesaleTotal,
          total: result.data.storeTotal,
          avgShopTimes: result.data.shopTimesCount,
          avgRouteTime: result.data.routeTimeCount,
          avgTimeTotal: result.data.timeCount,
          yy: result.data.yyCount,
          yl: result.data.ylCount,
          ys: result.data.ysCount,
          btnShow: true
        })
      }
    },
    async getSeconDaryData(id, params) {
      if (params) {
        this.twoparams = params
      } else {
        this.twoparams = {
          areaId: id,
          visitWeek: this.NowWeek ? this.NowWeek : ''
        }
      }
      let result = await ROUTE_PLANNING_API.get_routes_count(this.twoparams)
      if (result.code == 200) {
        this.seconDaryData = result.data.routeList
        this.seconDaryData.push({
          serviceDay: '合计',
          planVisitCount: result.data.planVisitTotal,
          performance: result.data.performanceTotal,
          avgVisitDuration: result.data.avgVisitDurationTotal,
          avgDistanceDuration: result.data.avgDistanceDurationTotal,
          durationCount: result.data.durationTotal,
          btnShow: true
        })
      }
    },
    async getStoreData(id, otherid, params) {
      if (params) {
        this.thereparams = params
      } else {
        this.thereparams = {
          routeId: otherid,
          areaId: id,
          visitWeek: this.NowWeek ? this.NowWeek : ''
        }
      }
      let result = await ROUTE_PLANNING_API.get_all_stores(this.thereparams)
      if (result.code == 200) {
        this.threeLevelData = result.data
      }
    },
    changeVIew() {
      this.$emit('handlerChange', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.main_top {
  display: flex;
  width: calc(100% - 340px);
  height: auto !important;
  background: #0a2757;
  position: absolute;
  z-index: 161;
  right: 0px;
  bottom: 0px;
  flex-wrap: wrap;
  overflow: hidden;
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
  ::v-deep .el-table__fixed::before, ::v-deep .el-table__fixed-right::before {
    height: 0px !important;
  }
  ::v-deep .el-table::before {
    height: 0px !important;
  }
  ::v-deep .el-table__fixed-right {
    box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.5);
  }
  ::v-deep .el-table__fixed::after, ::v-deep .el-table__fixed-right::after {
    width: 0px !important;
  }
  ::v-deep .el-table__fixed-right::after,::v-deep .el-table::after, ::v-deep .el-table__fixed::after {
    width: 0px !important;
  }
  ::v-deep .el-table--group::after, ::v-deep .el-table--border::after {
    width: 0px !important;
  }
  ::v-deep .el-table__fixed-right-patch {
    background-color: rgb(10, 39, 87);
    border: none !important;
  }
  ::v-deep .el-table thead.is-group th ,::v-deep .el-table--border th.gutter:last-of-type,::v-deep .el-table .is-group th{
    background-color: rgb(10, 39, 87);
    border-bottom: 1px solid rgb(79, 112, 127);
  }
.bottom_tab {
  display: block;
  background-color: #102f63;
  width: 99%;
  height: 255px;
  margin: 8px;
  overflow: auto;
}
</style>
