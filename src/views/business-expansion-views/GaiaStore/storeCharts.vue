<template>
  <!-- 右侧 画像 -->
  <div v-if="geneRated" class="store-charts-panel">
    <section class="scroll-wrapper">
      <div class="list-wrapper">
        <!-- 总数 -->
        <div class="total-wrapper">
          <p class="label">
            门店数
            <el-tooltip
              class="item"
              effect="dark"
              :content="tips_data.hxym_tzzds_km"
              placement="top"
            >
              <i class="el-icon-question icon-tooltip"></i>
            </el-tooltip>
          </p>
          <div class="text">
            <span class="count">{{ totalCount | numFormat }}</span>
            <span class="percent">（{{ totalPercent }}）</span>
          </div>
        </div>
        <!-- 结构分布 -->
        <div class="structure-wrapper">
          <div class="title-block" @click="handleSpread('structure')">
            <i
              class="el-icon-caret-right"
              :class="{ active: isSpread.structure }"
            >
            </i>
            <p class="text">结构分布</p>
          </div>
          <div class="content-wrap" v-show="isSpread.structure">
            <div class="content-title">
              门店结构情况（点数）
              <el-tooltip
                class="item"
                effect="dark"
                :content="tips_data.dqhx_mdjgqk_km"
                placement="top"
              >
                <i class="el-icon-question icon-tooltip"></i>
              </el-tooltip>
            </div>
            <div class="scroll-block">
              <div class="content-block">
                <template v-if="structureData.length>0">
                  <div
                    class="list-group"
                    v-for="(item, idx) in structureData"
                    :key="idx"
                  >
                    <div class="list-title">
                      <svg-icon
                        v-show="item.route === '购物类'"
                        icon-class="icon_shopping"
                        class-name="icon el-icon-s-shop"
                      ></svg-icon>
                      <svg-icon
                        v-show="item.route === '特通'"
                        icon-class="icon_tetong"
                        class-name="icon el-icon-s-shop"
                      ></svg-icon>
                      <svg-icon
                        v-show="item.route === '营业点'"
                        icon-class="icon_store"
                        class-name="icon el-icon-s-promotion"
                      ></svg-icon>
                      <span class="name">{{ item.route }}</span>
                      <span class="totalCount">
                        {{ item.routeCount | numFormat }}</span
                      >
                    </div>
                    <!--如果超过4条，则分为多栏-->
                    <div class="bGroup">
                      <div
                        class="sGroup"
                        v-for="(per_arr, index) in restructArray(
                          item.structureList
                        )"
                        :key="index"
                      >
                        <div
                          class="list-data"
                          v-for="(cell, i) in per_arr"
                          :key="i"
                        >
                          <p class="label">{{ cell.channel }}</p>
                          <p class="text">
                            <span class="number">{{
                              cell.channelCount | numFormat
                            }}</span>
                            <span class="percent"
                              >（{{ cell.percentage }}）</span
                            >
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="vertical-line" v-show="idx !== 0"></div>
                  </div>
                </template>
              </div>
              <p class="nodatabox" v-if="structureData.length<1">--</p>
            </div>
          </div>
        </div>
        <!-- 覆盖情况 -->
        <div class="structure-wrapper">
          <div class="title-block" @click="handleSpread('coverage')">
            <i
              class="el-icon-caret-right"
              :class="{ active: isSpread.coverage }"
            >
            </i>
            <p class="text">覆盖情况</p>
          </div>
          <div class="content-wrap" v-show="isSpread.coverage">
            <div class="content-title">
              门店覆盖情况
              <el-tooltip
                class="item"
                effect="dark"
                :content="tips_data.cover_age_km"
                placement="top"
              >
                <i class="el-icon-question icon-tooltip"></i>
              </el-tooltip>
            </div>
            <div class="scroll-block">
              <div class="chart-wrap" v-show="is_show">
                <div class="chart-title">
                  <p class="chart-small-title">
                    总覆盖率
                    <i class="number">{{ percentage ? percentage : '--' }}</i>
                  </p>
                  <p class="chart-small-title">覆盖分布</p>
                  <p class="chart-text">覆盖情况(率)</p>
                </div>
                <div class="chart-line">
                  <!--门店销量情况：折线图-->
                  <chart :options="lineOpt1" />
                </div>
                <p class="chart-BottmBox">时间（月）</p>
              </div>
              <div class="content-block">
                <template v-if="CoverageData.length>0">
                  <div
                    class="list-group"
                    v-for="(item, idx) in CoverageData"
                    :key="idx"
                  >
                    <div class="list-title">
                      <svg-icon
                        v-show="item.route === '购物类'"
                        icon-class="icon_shopping"
                        class-name="icon el-icon-s-shop"
                      ></svg-icon>
                      <svg-icon
                        v-show="item.route === '特通'"
                        icon-class="icon_tetong"
                        class-name="icon el-icon-s-shop"
                      ></svg-icon>
                      <svg-icon
                        v-show="item.route === '营业点'"
                        icon-class="icon_store"
                        class-name="icon el-icon-s-promotion"
                      ></svg-icon>
                      <span class="name">{{ item.route }}</span>
                      <span class="totalCount">
                        {{ item.routeCount | numFormat }}</span
                      >
                    </div>
                    <!--如果超过4条，则分为多栏-->
                    <div class="bGroup">
                      <div
                        class="sGroup"
                        v-for="(per_arr, index) in restructArray(
                          item.structureList
                        )"
                        :key="index"
                      >
                        <div
                          class="list-data"
                          v-for="(cell, i) in per_arr"
                          :key="i"
                        >
                          <p class="label">{{ cell.channel }}</p>
                          <p class="text">
                            <span class="number">{{
                              cell.channelCount | numFormat
                            }}</span>
                            <span class="percent"
                              >（{{ cell.percentage }}）</span
                            >
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="vertical-line" v-show="idx !== 0"></div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="btn-wrapper">
          <span @click="switchShowExportTable">查看门店明细</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import chart from '@/components/Chart'
/*---------------------导入商机导航接口API---------------------*/
import BUSINESS_EXPANSION_API from '../../../../api/business-expansion_api.js'

export default {
  name: '',
  components: {
    chart
  },
  data() {
    return {
      totalCount: '--',
      totalPercent: '--',
      isSpread: {
        structure: true, // 结构分布
        coverage: true // 销量情况
      },
      // 结构分布数据
      structureData: [],
      // 覆盖情况数据
      CoverageData: [],
      // 覆盖情况折线图配置
      lineOpt1: {},
      route_query: '',
      percentage: '', //总覆盖率
      // 暂时隐藏echarts
      is_show: true,
      keys: [
        // 总点数
        'hxym_tzzds_km',
        // 结构情况
        'dqhx_mdjgqk_km',
        // 覆盖情况
        'cover_age_km'
      ],
      tips_data: '',
      geneRated: true,
      oldRegionCodes:null,
    }
  },
  props: ['requestData'],
  watch: {
    requestData: {
      handler: function (newval) {
        this.getWatchData(newval)
      },
      deep: true
    }
  },
  mounted() {
    this.oldRegionCodes = this.requestData.regionCodes
    this.tips_data = {
      hxym_tzzds_km: '门店数tips',
      dqhx_mdjgqk_km: '门店解构情况tips',
      cover_age_km: '门店覆盖情况tips'
    }
    // 获取tips
    BUSINESS_EXPANSION_API.get_all_tips({ tipsKeys: this.keys.join() }).then(
      (res) => {
        if (res) {
          // console.log('画像tips:', res)
          this.tips_data = res
        }
      }
    )
  },
  methods: {
    // 初始化所有图表和数据
    getAllData() {
      // 格式化query对象为字符串
      this.formatQueryObjToString()
      // 请求画像总览等模块数据
      this.getOverviewData()
      this.getCoverageData()
    },

    async getWatchData(data){
      this.geneRated = data.geneRated
      // 如果---已生成---、或者、---切换组织架构---则调用接口
      if(data.geneRated || this.oldRegionCodes!= data.regionCodes){
        await this.getAllData()
        await this.$emit('getMapStoreData',data)
      }
      this.oldRegionCodes= data.regionCodes
    },
    /**
     * @description 获取画像总览数据,门店结构情况
     */
    async getOverviewData() {
      const {
        latitude,
        modelTags,
        orgArray,
        ownStore,
        regionCodes,
        storeCategory,
        storePoiCode,
        uniStore
      } = this.requestData
      let postJson = {
        latitude,
        modelTags,
        orgArray,
        ownStore,
        regionCodes,
        storeCategory,
        storePoiCode,
        uniStore
      }
      if (latitude==1 && regionCodes.length>0 || latitude==2 && orgArray.length>0) {
        let res = await BUSINESS_EXPANSION_API.get_structure_pic_echart(
          postJson
        )
        if (res) {
          this.totalCount = res.number
          this.totalPercent = res.percentage
          this.structureData = res.structures // 结构分布
        }
      }
    },
    /**
     * @description 覆盖情况数据
     */
    async getCoverageData() {
      const {
        latitude,
        modelTags,
        orgArray,
        ownStore,
        regionCodes,
        storeCategory,
        storePoiCode,
        uniStore
      } = this.requestData
      let postJson = {
        latitude,
        modelTags,
        orgArray,
        ownStore,
        regionCodes,
        storeCategory,
        storePoiCode,
        uniStore
      }
      let xData = []
      let seriesData = []
      // 折线图数据配置
      const params = {
        startColor: 'rgba(131, 144, 255, 0.55)',
        endColor: 'rgba(255, 255, 255, 0)',
        xData,
        seriesData,
        typeShow: 'CoverageData' //如果是覆盖情况显示%
      }
      if (latitude==1 && regionCodes.length>0 || latitude==2 && orgArray.length>0) {
        let res = await BUSINESS_EXPANSION_API.get_overview_pic_echart(postJson)
        if (res) {
          params.xData = res.lineChart.axisX
          params.seriesData = res.lineChart.axisY
          this.percentage = res.percentage //总覆盖率
          this.CoverageData = res.structureList
          // 覆盖情况
          // let newArr = []
          // this.CoverageData.forEach(newitem=>{
          //   const coverData = res.structureList.filter(item=>item.route==newitem.route)
          //   if(coverData.length>0){
          //     newitem = coverData[0]
          //   }
          //   newArr.push(newitem)
          // })
          // this.CoverageData = newArr
        }
      } else {
        this.percentage = '— —'
      }
      // 初始化折线图
      this.lineOpt1 = this.constructor(params)
    },
    handleSpread(item) {
      this.isSpread[item] = !this.isSpread[item]
    },
    switchShowExportTable() {
      this.$emit('switchShowExportTable', true)
    },
    /**
     * @description 格式化query对象为字符串
     */
    formatQueryObjToString() {
      if (this.requestData) {
        let copy_route_query_obj = JSON.parse(JSON.stringify(this.requestData))
        /* 如下事实属性因为是数组需要转换为 1,2,3…… */
        // 门店类型
        // copy_route_query_obj.storeType = copy_route_query_obj.storeType
        //   ? copy_route_query_obj.storeType.join()
        //   : ''
        this.route_query = copy_route_query_obj
      }
    },
    /**
     * @description 格式化数组为二维数组（4个一组）
     * @param {Array} data_array 一维数组
     */
    restructArray(data_array) {
      if (data_array) {
        let result_arr = []
        for (var i = 0; i < data_array.length; i += 4) {
          result_arr.push(data_array.slice(i, i + 4))
        }
        return result_arr
      }
    },
    // 格式化echarts图显示格式
    constructor(params = {}) {
      const { startColor, endColor, xData, seriesData } = params
      const grid = {
        show: true,
        top: 0,
        left: 22,
        right: 22,
        bottom: 0,
        borderWidth: 0,
        containLabel: true
      }
      const tooltip = {
        trigger: 'axis',
        backgroundColor: '#A634EF',
        axisPointer: {
          type: 'none'
        },
        formatter: (params) => {
          return params[0].data + '%'
        }
      }
      const xAxis = {
        type: 'category',
        boundaryGap: false,
        splitLine: { show: false },
        axisLabel: {
          fontSize: 10,
          color: '#fff',
          fontStyle: 'oblique'
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        data: xData || []
      }
      const yAxis = {
        type: 'value',
        show: false,
        splitLine: { show: false },
        axisLabel: { show: false }
      }
      const series = [
        {
          data: seriesData || [],
          type: 'line',
          showSymbol: false,
          lineStyle: {
            width: 0
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: startColor // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: endColor // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        }
      ]
      return {
        grid,
        tooltip,
        xAxis,
        yAxis,
        series
      }
    }
  }
}
</script>

<style scoped lang="scss">
.store-charts-panel {
  width: 340px;
  height: 100%;
  position: relative;
  .scroll-wrapper {
    // height: calc(100% - 60px);
    height: 100%;
    overflow-y: auto;
    .list-wrapper {
      .total-wrapper {
        width: 310px;
        height: 107px;
        background: #7134ef;
        border-radius: 8px;
        margin: 0 auto 15px;
        padding: 16px 11px;
        box-sizing: border-box;
        .label {
          height: 22px;
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
          line-height: 22px;
          margin-bottom: 10px;
        }
        .text {
          display: flex;
          flex-direction: row;
          align-items: center;
          flex-wrap: nowrap;
          .count {
            display: inline-block;
            font-size: 32px;
            font-family: AvenirNext-Bold, AvenirNext;
            font-weight: bold;
            color: #ffffff;
          }
          .percent {
            display: inline-block;
            height: 32px;
            font-size: 23px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #ffffff;
            line-height: 32px;
          }
        }
      }
      .structure-wrapper,
      .problem-wrapper,
      .sales-wrapper {
        .title-block {
          height: 34px;
          background: #133773;
          text-align: left;
          position: relative;
          cursor: pointer;
          i.el-icon-caret-right {
            padding: 0 5px;
            transform: rotate(0deg);
            cursor: pointer;
            &.active {
              transition: transform 0.3s;
              transform: rotate(90deg);
            }
          }
          .text {
            display: inline-block;
            line-height: 34px;
            font-size: 13px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #ffffff;
            cursor: pointer;
          }
        }
        .content-wrap {
          width: 310px;
          background: #47059c;
          border-radius: 8px;
          margin: 10px auto;
          .content-title {
            height: 40px;
            line-height: 40px;
            background: #7134ef;
            border-radius: 8px;
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #ffffff;
            padding-left: 20px;
          }
        }
      }
      .structure-wrapper,
      .problem-wrapper {
        .content-wrap {
          min-height: 242px;
          .scroll-block {
            min-height: 180px;
            width: 310px;
            /* overflow: auto; */
            .chart-wrap {
              .chart-title {
                padding: 10px 10px 0 10px;
              }
              .chart-line {
                width: 98%;
                margin-left: auto;
                margin-right: auto;
                height: 100px;
              }
              .chart-small-title {
                font-size: 14px;
                line-height: 25px;
                .number {
                  margin-left: 5px;
                  font-weight: bold;
                }
              }
              .chart-text {
                font-size: 10px;
                color: #ddd3ff;
                line-height: 25px;
              }
              .chart-BottmBox {
                color: #ddd3ff;
                width: 100%;
                text-align: center;
                height: 30px;
                line-height: 35px;
                border-bottom: 1px solid #ae95ff;
                margin-bottom: 10px;
                font-size: 12px;
              }
            }
            .content-block {
              display: flex;
              width: 310px;
              overflow-x: auto;
              height: 200px;
              .list-group {
                position: relative;
                padding-left: 10px;
                padding-right: 10px;
                // 保证在空间冗余时平分,
                flex-grow: 1;
                // 不够时撑开
                flex-shrink: 0;
                // border-left: 2px solid #AE95FF;
                .list-title {
                  height: 30px;
                  line-height: 30px;
                  font-size: 12px;
                  font-family: PingFangSC-Semibold, PingFang SC;
                  font-weight: 600;
                  color: #ffffff;
                  .el-icon-s-shop {
                    font-size: 16px;
                    color: #a634ef;
                    vertical-align: text-bottom;
                  }
                  .el-icon-s-promotion {
                    font-size: 16px;
                    color: #5cadff;
                    vertical-align: text-bottom;
                  }
                  .el-icon-s-problem {
                    font-size: 16px;
                    color: #ff9900;
                    vertical-align: text-bottom;
                  }
                  .el-icon-shopping-cart-1 {
                    font-size: 16px;
                    color: #ff9900;
                  }
                  .name {
                    display: inline-block;
                    padding-left: 5px;
                  }
                }
                .list-data {
                  margin: 4px 0 6px 0;
                  .label {
                    font-size: 12px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #ffffff;
                    line-height: 14px;
                    margin-bottom: 2px;
                  }
                  .text {
                    .number {
                      font-size: 14px;
                      font-family: AvenirNext-Bold, AvenirNext;
                      font-weight: bold;
                      color: #ffffff;
                    }
                    .percent {
                      font-size: 14px;
                      font-family: AvenirNext-Bold, AvenirNext;
                      font-weight: bold;
                      color: #ffffff;
                    }
                  }
                }
                .vertical-line {
                  position: absolute;
                  top: 15px;
                  left: 0;
                  width: 2px;
                  height: 165px;
                  background-color: #ae95ff;
                }
                .bGroup {
                  display: flex;
                }
                .sGroup {
                  margin-right: 10px;
                }
              }
            }
            .nodatabox {
              text-align: center;
              line-height: 200px;
              font-size: 36px;
            }
          }
        }
      }
      .btn-wrapper {
        width: 100%;
        height: 59px;
        line-height: 59px;
        background-color: #0a2757;
        text-align: center;
        span {
          display: inline-block;
          width: 310px;
          height: 32px;
          line-height: 32px;
          background-color: #a634ef;
          border-radius: 2px;
          cursor: pointer;
        }
      }
    }
  }
  .result-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 59px;
    line-height: 59px;
    background-color: #0a2757;
    text-align: center;
    span {
      display: inline-block;
      width: 310px;
      height: 32px;
      line-height: 32px;
      background-color: #a634ef;
      border-radius: 2px;
      cursor: pointer;
    }
  }
}
::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
