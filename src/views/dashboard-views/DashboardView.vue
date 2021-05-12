<template>
  <div class="dashboard" ref="dashboard">
    <!--导航区域bar-->
    <section class="navAreaBar">
      <div class="areaList">
        <!--返回按钮，当不是全国时，才会存在，根据节点的parentId获取父级-->
        <div
          class="areaButton areaButtonBack"
          v-show="is_show_back_button"
          @click="routeBack"
        >
          返回
        </div>
        <!--父级路由，默认高亮显示-->
        <div class="areaButton areaButtonActive">{{ area_list.name }}</div>
        <!--子集区域，遍历，hover高亮显示-->
        <div
          class="areaButton"
          @click="routeToArea(item.id)"
          v-for="item in area_list.children"
          :key="item.id"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="areaFullScreen">
        <div class="versionTips">当前数据版本为：{{ version_date }}</div>
        <!--全屏按钮-->
        <div
          class="fullScreenButton"
          :class="
            is_full_screen ? 'el-icon-copy-document' : 'el-icon-full-screen'
          "
          @click="fullScreen"
          :title="is_full_screen ? '还原' : '全屏'"
        ></div>
      </div>
    </section>
    <!--总览模块-->
    <section class="overviewModel">
      <!--总览模块1-->
      <article class="overviewModel1">
        <!--折线图模块-->
        <div class="lineChartModel">
          <!--折线图顶部数据-->
          <div class="topData">
            <!--一阶总点数-->
            <div class="leftData">
              <span class="totalPointTitle">
                总点数
                <i
                  class="el-icon-question tipsIcon"
                  :title="tipInfo.zdsTips"
                ></i>
              </span>
              <div class="totalPoint">
                {{ statistics_data.total | numFormat }}
              </div>
            </div>
            <div class="rightData">
              <div class="totalRatioData totalRatioMonthData">
                <span class="totalRatioDataTitle totalRatioMonthDataTitle"
                  >较上月环比</span
                >
                <span
                  class="totalRatioDataNum totalRatioMonthDataNum"
                  v-if="statistics_data"
                  >{{ statistics_data.monthOnMonth.number > 0 ? '+' : ''
                  }}{{ statistics_data.monthOnMonth.number | numFormat }}（
                  {{ statistics_data.monthOnMonth.percentage }}）</span
                >
              </div>
              <div class="totalRatioData totalRatioYearData">
                <span class="totalRatioDataTitle totalRatioYearDataTitle"
                  >较去年同比</span
                >
                <span
                  class="totalRatioDataNum totalRatioYearDataNum"
                  v-if="statistics_data"
                  >{{ statistics_data.yearOnYear.number > 0 ? '+' : ''
                  }}{{ statistics_data.yearOnYear.number | numFormat }}（
                  {{ statistics_data.yearOnYear.percentage }}）</span
                >
              </div>
            </div>
          </div>
          <!--折线图-->
          <div class="lineChartContainer" ref="lineChartContainerDom">
            <echarts :options="lineEechartsOption" v-if="pieShow"></echarts>
          </div>
        </div>
        <!--右侧新增点数，终止合作-->
        <div class="dataModel">
          <!--新增点数-->
          <div class="perDataModel dataModel1">
            <div class="leftDataModel">
              <span class="leftDataTitle increaseTitle">
                新增点数
                <i class="el-icon-question tipsIcon" :title="tipInfo.xzdsTips"></i>
              </span>
              <div class="leftDataNum increaseNum" v-if="statistics_data">
                {{ statistics_data.newStore.total | numFormat }}
              </div>
            </div>
            <div class="rightDataModel">
              <div class="perRightDataModel increaseRatioMonthData">
                <div class="perRightDataTitle increaseRatioMonthDataTitle">
                  较上月环比
                </div>
                <div
                  class="perRightDataNum increaseRatioMonthDataNum"
                  v-if="statistics_data"
                >
                  {{
                    statistics_data.newStore.monthOnMonth.number > 0 ? '+' : ''
                  }}{{
                    statistics_data.newStore.monthOnMonth.number | numFormat
                  }}（ {{ statistics_data.newStore.monthOnMonth.percentage }}）
                </div>
              </div>
              <div class="perRightDataModel increaseRatioYearData">
                <div class="perRightDataTitle increaseRatioYearDataTitle">
                  较去年同比
                </div>
                <div
                  class="perRightDataNum increaseRatioYearDataNum"
                  v-if="statistics_data"
                >
                  {{ statistics_data.newStore.yearOnYear.number > 0 ? '+' : ''
                  }}{{
                    statistics_data.newStore.yearOnYear.number | numFormat
                  }}（ {{ statistics_data.newStore.yearOnYear.percentage }}）
                </div>
              </div>
            </div>
          </div>
          <!--终止合作-->
          <div class="perDataModel dataModel2">
            <div class="leftDataModel leftDataModel2">
              <span class="leftDataTitle increaseTitle"
                >终止合作
                <i
                  class="el-icon-question tipsIcon"
                  :title="tipInfo.zzhzTips"
                ></i>
              </span>
              <div class="leftDataNum increaseNum" v-if="statistics_data">
                {{ statistics_data.terminateCooperation.total | numFormat }}
              </div>
            </div>
            <div class="rightDataModel">
              <div class="perRightDataModel increaseRatioMonthData">
                <div class="perRightDataTitle increaseRatioMonthDataTitle">
                  较上月环比
                </div>
                <div
                  class="perRightDataNum increaseRatioMonthDataNum"
                  v-if="statistics_data"
                >
                  {{
                    statistics_data.terminateCooperation.monthOnMonth.number > 0
                      ? '+'
                      : ''
                  }}{{
                    statistics_data.terminateCooperation.monthOnMonth.number
                      | numFormat
                  }}（{{
                    statistics_data.terminateCooperation.monthOnMonth
                      .percentage
                  }}）
                </div>
              </div>
              <div class="perRightDataModel increaseRatioYearData">
                <div class="perRightDataTitle increaseRatioYearDataTitle">
                  较去年同比
                </div>
                <div
                  class="perRightDataNum increaseRatioYearDataNum"
                  v-if="statistics_data"
                >
                  {{
                    statistics_data.terminateCooperation.monthOnMonth.number > 0
                      ? '+'
                      : ''
                  }}{{
                    statistics_data.terminateCooperation.monthOnMonth.number
                      | numFormat
                  }}（{{
                    statistics_data.terminateCooperation.monthOnMonth
                      .percentage
                  }}）
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
      <!--总览模块2-->
      <article class="overviewMode2">
        <!--门店结构情况-->
        <div class="overviewDetail overviewDetail1" @click="routeToDetail('2')">
          <div class="topModel topModel1">
            门店结构情况（点数）
            <i class="el-icon-question tipsIcon" :title="tipInfo.mdjgTips"></i>
          </div>
          <div class="dataList dataList1">
            <div class="perDataList leftDataList">
              <div class="typeName">
                <i class="el-icon-s-shop shiDuoIcon"></i>
                {{ this.structure_data && this.structure_data[2].route }}
              </div>
              <div
                class="perData"
                v-for="(item, index) in this.structure_data.slice(2, 4)"
                :key="index"
              >
                <div class="propName">{{ item.channel }}</div>
                <div class="propNum">
                  {{ item.channelCount | numFormat }} ({{
                    item.stageProportion
                  }})
                </div>
              </div>
            </div>
            <div class="perDataList rightDataList">
              <div class="typeName">
                <svg class="icon svg-icon planeIcon" aria-hidden="true">
                  <use xlink:href="#iconicon_tetong"></use>
                </svg>
                {{ this.structure_data && this.structure_data[0].route }}
              </div>
              <div
                class="perData"
                v-for="(item, index) in this.structure_data.slice(0, 2)"
                :key="index"
              >
                <div class="propName">{{ item.channel }}</div>
                <div class="propNum">
                  {{ item.channelCount | numFormat }} ({{
                    item.stageProportion
                  }})
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--门店销量情况-->
        <div class="overviewDetail overviewDetail2" @click="routeToDetail('3')">
          <div class="topModel topModel2">
            门店销量情况（箱）
            <i
              class="el-icon-question tipsIcon"
              :title='tipInfo.mdxlTips '
            ></i>
            <div class="totalNum">
              {{ store_detail_data.volumeTotal | numFormat }}
            </div>
          </div>
          <div class="dataList saleDataList">
            <div class="perDataList leftDataList perSaleDataList">
              <div class="typeLine">
                <div class="point green"></div>
                <div class="typeName">销量达标</div>
                <div class="icon iconYes iconfont">
                  <img
                    src="../../assets/img/thumbs-up.png"
                    class="imgBox"
                    alt=""
                  />
                </div>
              </div>
              <div class="perData">
                <div class="propName">达标门店数</div>
                <div class="propNum">
                  {{ store_detail_data.upToSubstandardNumber | numFormat }}
                </div>
              </div>
              <div class="perData">
                <div class="propName">总销量</div>
                <div class="propNum">
                  {{ store_detail_data.upToSubstandardVolume | numFormat }}
                </div>
              </div>
            </div>
            <div class="perDataList rightDataList perSaleDataList">
              <div class="typeLine">
                <div class="point red"></div>
                <div class="typeName">销量不达标</div>
                <div class="icon iconNo iconfont">
                  <img
                    src="../../assets/img/thumbs-down.png"
                    class="imgBox"
                    alt=""
                  />
                </div>
              </div>
              <div class="perData">
                <div class="propName">不达标门店数</div>
                <div class="propNum">
                  {{ store_detail_data.substandardNumber | numFormat }}
                </div>
              </div>
              <div class="perData">
                <div class="propName">总销量</div>
                <div class="propNum">
                  {{ store_detail_data.substandardVolume | numFormat }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--门店成交情况-->
        <div class="overviewDetail overviewDetail3" @click="routeToDetail('4')">
          <div class="topModel topModel3">
            门店成交情况（点数）
            <i class="el-icon-question tipsIcon" :title='tipInfo.mdcjTips'></i>
            <div class="totalNum">
              {{ store_detail_data.dealTotal | numFormat }}
              <span class="percentNum"
                >({{ store_detail_data.dealProportion }})</span
              >
            </div>
          </div>
          <div class="pieChartContainer" ref="pieChartContainerDom">
            <echarts
              :options="pieEechartsOption"
              ref="pieEecharts"
              v-if="pieShow"
            ></echarts>
          </div>
        </div>
        <!--门店问题情况-->
        <div class="overviewDetail overviewDetail4" @click="routeToDetail('5')">
          <div class="topModel topModel4">
            门店问题情况（点数）
            <i class="el-icon-question tipsIcon" :title='tipInfo.mdwtTips'></i>
            <div class="totalNum">
              {{ store_detail_data.problemTotal | numFormat }}
            </div>
          </div>
          <div class="dataList problemDataList">
            <div class="problemBlock problemBlock1">
              <div class="propName">销量不达标</div>
              <div class="propNum">
                {{ store_detail_data.substandardNumber | numFormat }}
              </div>
            </div>
            <div class="problemBlock problemBlock1">
              <div class="propName">数据异常门店</div>
              <div class="propNum">
                {{ store_detail_data.abnormal | numFormat }}
              </div>
            </div>
            <div class="problemBlock problemBlock1">
              <div class="propName">C类门店</div>
              <div class="propNum">
                {{ store_detail_data.storeTypeC | numFormat }}
              </div>
            </div>
            <div class="problemBlock problemBlock2">
              <div class="propName">连续两个月未成交</div>
              <div class="propNum">
                {{ store_detail_data.bimonthlyNoDeal | numFormat }}
              </div>
            </div>
            <div class="problemBlock problemBlock2">
              <div class="propName">未成交</div>
              <div class="propNum">
                {{ store_detail_data.noDeal | numFormat }}
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script>
import dashboardApi from '../../../api/dashboard_api'
import BUSINESS_NAVIGATION_API from '../../../api/business_navigate_api'
import echarts from '../../components/Chart'
export default {
  name: 'DashboardView',
  data() {
    return {
      // 是否全屏
      is_full_screen: false,
      // 区域id
      area_id: '',
      // 区域中文名,
      area_name: '',
      // 区域列表
      area_list: '',
      // 是否显示返回按钮
      is_show_back_button: false,
      // 父级区域id
      area_parent_id: '',
      // 门店结构情况
      structure_data: '',
      // 门店销量、问题情况
      store_detail_data: '',
      // 版本日期
      version_date: '',
      // 一阶总点数,新增点数，终止合作
      statistics_data: '',
      // 循环id
      loop_id: '',
      lineEechartsOption: {}, //折线图
      pieEechartsOption: {}, //环形图
      pieShow: true, //pie
      keys:[
				// 总点数
					'hxym_zds_km',
					// 销量情况
					'hxym_xlqk_yzxlzb_km',
					'hxym_xlqk_ydjxlhb_km',
					// 成交情况
					'hxym_cjqk_yzcjszb_km',
					'hxym_cjqk_ydjcjshb_km',
					// 结构情况
					'dqhx_mdjgqk_km',
					// 问题门店
					// 业务异常
					'wtmd_ywycmd_clmd_km',
					'wtmd_ywycmd_xlbdb_km',
					'wtmd_ywycmd_lxlgywcj_km',
					'wtmd_ywycmd_wcj_km',
					'wtmd_ywycmd_mdzyysbjw_km',
					'wtmd_ywycmd_mdzyyscdqy_km',
					// 数据异常
					'wtmd_sjycmd_mdbmcw_km',
					'wtmd_sjycmd_mddzwx_km',
					'wtmd_sjycmd_mdmcwx_km',
					'wtmd_sjycmd_mdxxwx_km',
					'wtmd_sjycmd_jwdydxbpp_km',
					'wtmd_sjycmd_jwdztsdx_km',
					'wtmd_sjycmd_qskhlx_km',
					'wtmd_sjycmd_jwdqs_km',
					'wtmd_sjycmd_mdlxyc_km',
          'wtmd_sjycmd_khjlqs_km',
          //dashboard独有
          'dashboard_zzhz_km',
          'dashboard_xzds_km',
          'dashboard_dbjl_km'
        ],
        tipInfo: {
          zdsTips: '',
          xzdsTips: '',
          zzhzTips: '',
          mdjgTips: '',
          mdxlTips: '',
          mdcjTips: '',
          mdwtTips: ''
        },
    }
  },
  components: {
    echarts
  },
  created() {
    this.$store.commit('addTabs', {
      title: 'Dashboard',
      link: '/dashboard/list',
      on: false
    })
  },
  mounted() {
    // 初始化px to rem值
    this.initPixelToRem()
    // 初始化组织层级列表，从路由获取参数
    // this.area_id = this.$route.params.area_id
    if (this.$cookies.get('orgId')) {
      this.area_id = this.$cookies.get('orgId')
      this.$store.dispatch('map/setOrganizationName')
    }
    this.initAreaList(this.area_id)
    // 初始化首页元数据，门店结构、销量、成交、问题情况
    this.initOverViewDataSource(this.area_id)
    // 初始化首页元数据：一阶总点数，新增点数，终止合作
    this.initStatisticsDataSource(this.area_id, 1)
    // 获取所有tips
    BUSINESS_NAVIGATION_API.get_all_tips({tipsKeys: this.keys.join()}).then(res => {
      if(res){
        // 初始化tips：销量情况（达标，不达标）
          this.tipInfo.zdsTips = res.hxym_zds_km,
          this.tipInfo.xzdsTips = res.dashboard_xzds_km,
          this.tipInfo.zzhzTips = res.dashboard_zzhz_km,
          this.tipInfo.mdjgTips = res.dqhx_mdjgqk_km,
          this.tipInfo.mdxlTips = res.hxym_xlqk_yzxlzb_km + '\n' + res.hxym_xlqk_ydjxlhb_km,
          this.tipInfo.mdcjTips = res.hxym_cjqk_yzcjszb_km + '\n' + res.hxym_cjqk_ydjcjshb_km,
          this.tipInfo.mdwtTips ='业务异常门店：\n'
									+ res.wtmd_ywycmd_clmd_km + '\n'
									+ res.wtmd_ywycmd_xlbdb_km + '\n'
									+ res.wtmd_ywycmd_lxlgywcj_km + '\n'
									+ res.wtmd_ywycmd_wcj_km + '\n'
									+ res.wtmd_ywycmd_mdzyysbjw_km + '\n'
									+ res.wtmd_ywycmd_mdzyyscdqy_km + '\n'

									+'数据异常门店：\n'
									+ res.wtmd_sjycmd_mdbmcw_km + '\n'
									+ res.wtmd_sjycmd_mddzwx_km + '\n'
									+ res.wtmd_sjycmd_mdmcwx_km + '\n'
									+ res.wtmd_sjycmd_mdxxwx_km + '\n'
									+ res.wtmd_sjycmd_jwdydxbpp_km + '\n'
									+ res.wtmd_sjycmd_jwdztsdx_km + '\n'
									+ res.wtmd_sjycmd_qskhlx_km + '\n'
									+ res.wtmd_sjycmd_jwdqs_km + '\n'
                  + res.wtmd_sjycmd_mdlxyc_km.substring(0,30) + '\n'
                  + res.wtmd_sjycmd_mdlxyc_km.substring(30) + '\n'
                  + res.wtmd_sjycmd_khjlqs_km 
      }
    })
  },
  /**
   * @description 路由钩子函数，跳转路由刷新页面
   */
  destroyed() {
    // location.reload()
  },
  methods: {
    /**
     * @description 触发全屏/还原（ESC按键在initPixelToRem()函数中处理）
     */
    fullScreen() {
      // 如果处于非全屏模式
      if (!document.fullscreen) {
        if (this.$refs.dashboard.requestFullscreen) {
          this.$refs.dashboard.requestFullscreen()
        }
      } else {
        document.exitFullscreen()
      }
    },

    /**
     * @description 动态修改html上的font-size，以转化为rem；因为设计稿为1280px的宽度，在计算时将设计稿宽/高除以10即可得到rem值
     */
    initPixelToRem() {
      let docEl = document.documentElement
      let resizeEvt =
        'orientationchange' in window ? 'orientationchange' : 'resize'
      let recalc = () => {
        docEl.style.fontSize = 10 * (docEl.clientWidth / 1280) + 'px'
        // 同时监听 ESC 按键屏幕大小一旦发生变化则全屏按钮发生变化
        if (document.fullscreen) {
          this.is_full_screen = true
        } else {
          this.is_full_screen = false
        }
      }
      recalc()
      // 当窗口大小发生变动时触发
      window.addEventListener(resizeEvt, recalc, false)
      // DOMContentLoaded用于仅仅当document被加载后就会触发，而不会等待所有资源如js，css这点和load不同
      document.addEventListener('DOMContentLoaded', recalc, false)
    },

    /**
     * @description 饼图运算转换 123456=>123,456
     * @param {Number} num 带转换数值/字符串也可以
     */
    numFormat(num) {
      var res = num.toString().replace(/\d+/, function (n) {
        // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
          return $1 + ','
        })
      })
      return res
    },

    /**
     * @description 获取组织层级列表函数
     * @param {String} area_id 地域id号
     */
    initAreaList(area_id) {
      this.area_id = area_id
      dashboardApi.getOrgList({ orgId: area_id }).then((res) => {
        // 获取父级id
        this.area_parent_id = res.data.parentId
        // 获取地域列表
        this.area_list = res.data
        // 获取当前地域中文名
        this.area_name = res.data.name
        // 获取版本号
        this.version_date = res.extData
        // 如果地域层级是全国，则无返回按钮
        if (this.area_parent_id !== '10') {
          this.is_show_back_button = true
        } else {
          this.is_show_back_button = false
        }
      })
    },

    /**
     * @description 初始化首页元数据：门店结构、销量、成交（饼图）、问题情况
     * @param {String} area_id 地域id号
     */
    initOverViewDataSource(area_id) {
      this.pieShow = false
      setTimeout(() => {
        this.pieShow = true
      }, 50)
      dashboardApi.getOverViewData({ orgId: area_id }).then((res) => {
        // 获取门店结构情况数据
        this.structure_data = res.data.structure
        // 获取门店销量、成交，问题情况数据
        this.store_detail_data = res.data.storeDetail
        // 获取饼图数据
        let pieData = res.data.pieCharts
        // 初始化饼图容器实例

        // let pie_chart_obj = this.$Echarts.init(this.$refs.pieChartContainerDom)
        // 配置饼图
        this.pieEechartsOption = {
          tooltip: {
            trigger: 'item',
            // 是否要一直显示tooltip
            alwaysShowContent: true
          },
          color: ['#19BE6B', '#ED3F14', '#A634EF', '#F8E71C', '#F5A623'],
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['60%', '75%'],
              // 设置各个子饼图之间的border，然后将其颜色设置为和背景一样，就像有间距一样
              itemStyle: {
                //边框的宽度
                borderWidth: 4,
                //边框的颜色
                borderColor: '#47059c'
              },
              avoidLabelOverlap: false,
              // 鼠标hover时激活大小
              hoverOffset: 3,
              // 类型标签样式
              label: {
                // 不显示label
                show: false,
                position: 'outside',
                fontSize: 10,
                color: '#ffffff'
              },
              // 标签和饼图线样式,首先让其不显示，其次让其第一段第二段引导线变短即可调整label与饼图距离
              labelLine: {
                show: false,
                length: 10,
                length2: 1
              },
              // 高亮后饼图，和标签样式
              emphasis: {
                label: {
                  show: true,
                  fontSize: 12
                }
              },
              tooltip: {
                // 背景色
                backgroundColor: 'transparent',
                // 数据位置(注意，这个值和底部轮循保持一致)
                position: ['37%', '37%'],
                padding: 0,
                // 文本样式
                textStyle: {
                  color: '#ffffff',
                  fontWeight: 'bold'
                },
                formatter: (params) => {
                  return (
                    '<div style="text-align:center;width:8.8rem;font-size:2.1rem;margin-bottom:1rem">' +
                    this.numFormat(params.value) +
                    '</div><div style="font-size:1.4rem;font-style:italic;line-height:1.4rem;text-align:center;width:8.8rem">(' +
                    params.percent +
                    '%)</div>'
                  )
                }
              },
              data: pieData
            }
          ]
        }
        let i = 0
        // 每次跳转路由要清空一次循环id
        if (this.loop_id) {
          console.log('清空原来循环')
          clearInterval(this.loop_id)
        }
        let echart = this.$refs.pieEecharts.$refs.thisChart
        this.loop_id = setInterval(() => {
          if (i > 0) {
            echart.dispatchAction({
              type: 'downplay',
              dataIndex: i - 1
            })
            if (i === 5) {
              i = 0
            }
          }
          echart.dispatchAction({
            type: 'highlight',
            dataIndex: i
          })
          echart.dispatchAction({
            type: 'showTip',
            dataIndex: i,
            seriesIndex: 0,
            position: ['37%', '37%']
          })
          i++
        }, 3000)
      })
    },

    /**
     * @description 初始化首页元数据：一阶总点数（折线图），新增点数，终止合作
     * @param {String} area_id 地域id号
     * @param {Number} type 首页:1，子页详情为2/3/4/5
     */
    initStatisticsDataSource(area_id, type) {
      dashboardApi
        .getStatisticsData({ orgId: area_id, type: type })
        .then((res) => {
          // 门店结构情况
          this.statistics_data = res.data
          // 获取折线图数据
          let lineDataX = this.statistics_data.lineChart.axisX
          let lineDataY = this.statistics_data.lineChart.axisY
          // 配置折线图
          this.lineEechartsOption = {
            // 设置折线图在容器里的大小
            grid: {
              left: '12%', //x 偏移量
              top: '25%', // y 偏移量
              width: '82%', // 宽度
              height: '50%' // 高度
            },
            // 设置全局字体
            textStyle: {
              fontFamily: 'Arial'
            },
            // x轴的配置
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: lineDataX,
              // x坐标轴线是否显示
              axisLine: {
                show: false
              },
              // x坐标轴刻度是否显示
              axisTick: {
                show: false
              },
              // x轴坐标label文本设置
              axisLabel: {
                // 字体大小10
                fontSize: 10,
                // 距离顶部20
                padding: [20, 0, 0, 0],
                color: '#ffffff'
              }
            },
            // y轴的配置
            yAxis: {
              // y轴的标题名
              name: '点数',
              // y轴的标题名样式，因为要让名字在量度顶部，调整padding-left:-80
              nameTextStyle: {
                color: '#ffffff',
                padding: [0, 0, 0, -80]
              },
              type: 'value',
              // y坐标轴线是否显示
              axisLine: {
                show: false
              },
              // y坐标轴刻度是否显示
              axisTick: {
                show: false
              },
              // y轴坐标label文本设置
              axisLabel: {
                // 字体大小10
                fontSize: 10,
                // 距离顶部20
                padding: [0, 20, 0, 0],
                color: '#ffffff'
              },
              // 不要显示y轴的分割线
              splitLine: {
                show: false
              }
            },
            // 核心数据轴的配置
            series: [
              {
                data: lineDataY,
                type: 'line',
                // 是否平滑过渡
                smooth: true,
                // 打点图形：空心圆
                symbol: 'emptyCircle',
                // 打点大小
                symbolSize: 8,
                // 平滑曲线的样式
                lineStyle: {
                  // 线宽
                  width: 3,
                  color: '#A634EF'
                },
                // 数据显示区域填充颜色
                areaStyle: {
                  // 颜色线性渐变
                  color: {
                    // 渐变方式
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: 'rgb(224,109,255)'
                      },
                      {
                        offset: 1,
                        color: 'rgba(71,5,156,1)'
                      }
                    ],
                    global: false // 缺省为 false
                  }
                }
              }
            ],
            // 鼠标放上后的数据提示框
            tooltip: {
              trigger: 'axis',
              // 十字标尺
              axisPointer: {
                // 不显示十字标尺
                type: 'none',
                // 不显示标尺xy轴的label
                label: {
                  show: false
                }
              },
              position: (point) => {
                return [point[0] - 35, point[1] - 60]
              },
              // 提示框内边距 [上 右 下 左]
              padding: [0, 5, 0, 5],
              // 背景色
              backgroundColor: '#A634EF',
              // 文本样式
              textStyle: {
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: 23
              },
              // 数据格式化，此处为 123456 => 123,456
              formatter: (params) => {
                return this.numFormat(params[0].data)
              }
            }
          }
        })
    },
    /**
     * @description 跳转区域
     * @param {String} area_id 地域id号
     */
    routeToArea(area_id) {
      // 变更路由id值
      this.area_id = area_id
      this.initAreaList(this.area_id)
      // 初始化首页元数据，门店结构、销量、成交、问题情况
      this.initOverViewDataSource(this.area_id)
      // 初始化首页元数据：一阶总点数，新增点数，终止合作
      this.initStatisticsDataSource(this.area_id, 1)
    },
    /**
     * @description 跳转到详情页
     * @param {Number} type_id 地域id号
     */
    routeToDetail(type_id) {
      // 跳转到详情则终止循环
      if (this.loop_id) {
        clearInterval(this.loop_id)
      }
      // 变更路由id值
      this.$router.push({
        name: 'DashboardDetail',
        params: {
          area_id: this.area_id,
          area_name: this.area_name,
          type_id: type_id
        }
      })
    },
    /**
     * @description 刷新
     */
    reload() {
      location.reload()
    },
    /**
     * @description 跳转到上一层级
     * @param {Number} type_id 地域id号
     */
    routeBack() {
      if (this.area_parent_id !== '10') this.routeToArea(this.area_parent_id)
    }
  }
}
</script>

<style scoped lang="scss">
div,
p,
section,
article {
  color: #ffffff;
  box-sizing: border-box;
}
// 导航模块
.navAreaBar {
  clear: both;
  width: 100%;
  height: 6rem;
  background-color: #191839;
  padding-left: 2.6rem;
  padding-right: 1.3rem;
  overflow: hidden;
  .areaList {
    font-size: 1.8rem;
    width: 98rem;
    overflow-x: auto;
    white-space: nowrap;
    display: flex;
    padding-top: 1.2rem;
    padding-right: 1.2rem;
    float: left;
    .areaButton {
      flex-shrink: 0;
      height: 3.6rem;
      line-height: 3.6rem;
      padding-left: 2.4rem;
      padding-right: 2.4rem;
      font-size: 1.6rem;
      border-radius: 1.8rem;
      background-color: #47059c;
      transition: all 0.3s;
      cursor: pointer;
    }
    .areaButton:hover {
      font-size: 1.8rem;
      background-color: #a634ef;
    }
    .areaButton ~ .areaButton {
      margin-left: 1.6rem;
    }
    .areaButtonActive {
      font-size: 1.8rem;
      background-color: #a634ef;
    }
    .areaButtonBack {
      border: 0.1rem solid #ffffff;
    }
  }
  .areaFullScreen {
    display: flex;
    justify-content: space-between;
    align-items: center;
    float: left;
    width: 25rem;
    height: 4.35rem;
    font-size: 1.2rem;
    border-left: 1px solid #a634ef;
    margin-left: 0.6rem;
    margin-top: 0.8rem;
    .versionTips {
      margin-left: 1.8rem;
    }
    .fullScreenButton {
      font-size: 3rem;
      cursor: pointer;
    }
  }
}
// 总览模块
.overviewModel {
  background-color: #0a2757;
  padding: 2rem 2.5rem 2rem 2.5rem;
  margin-bottom: 2rem;
  .overviewModel1 {
    overflow: hidden;
    display: flex;
    flex-direction: row;
    // 折线图
    .lineChartModel {
      float: left;
      width: 76.6rem;
      height: 33.4rem;
      background: rgba(71, 5, 156, 1);
      border-radius: 1.4rem;
      // 折线图顶部数据
      .topData {
        height: 12rem;
        border-radius: 1.3rem;
        overflow: hidden;
        background-color: #7134ef;
        padding-left: 2rem;
        padding-top: 1.4rem;
        .leftData {
          float: left;
          height: 9.1rem;
          border-right: solid 0.4rem #ae95ff;
          width: 28.2rem;
          .totalPointTitle {
            font-size: 2.8rem;
          }
          .totalPoint {
            font-size: 4rem;
            font-weight: bold;
          }
        }
        .rightData {
          margin-left: 2rem;
          margin-top: 0.5rem;
          float: left;
          .totalRatioData {
            display: flex;
            align-items: center;
            .totalRatioDataTitle {
              padding-right: 3.4rem;
              font-size: 2.2rem;
            }
            .totalRatioDataNum {
              font-size: 2.8rem;
              font-weight: bold;
            }
          }
          .totalRatioYearData {
            margin-top: 1.5rem;
          }
        }
      }
      .lineChartContainer {
        width: 76.6rem;
        height: 21.4rem;
      }
    }
    .dataModel {
      margin-left: 2.5rem;
      float: left;
      .perDataModel {
        width: 43.8rem;
        height: 15.7rem;
        background-color: #a634ef;
        border-radius: 1.4rem;
        padding: 2.1rem;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
      }
      .dataModel2 {
        background-color: #47059c;
        margin-top: 2rem;
      }
      .leftDataModel {
        width: 20.0rem;
        height: 10.9rem;
        border-right: solid 0.2rem #fbebfe;
        margin-top: 0.2rem;
        .leftDataTitle {
          font-size: 2.6rem;
        }
        .leftDataNum {
          font-size: 4.8rem;
          font-weight: bold;
          margin-top: 2.3rem;
        }
      }
      .leftDataModel2 {
        border-right: solid 0.2rem #ae95ff;
      }
      .rightDataModel {
        margin-left: 1.8rem;
        .perRightDataModel {
          .perRightDataTitle {
            font-size: 1.4rem;
          }
          .perRightDataNum {
            font-size: 1.6rem;
            margin-top: 0.8rem;
            font-weight: bold;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
          }
        }
        .increaseRatioYearData {
          margin-top: 1.6rem;
        }
      }
    }
  }
  .overviewMode2 {
    overflow-x: auto;
    overflow-y: hidden;
    margin-top: 2.2rem;
    width: 100%;
    height: 29rem;
    padding-bottom: 2rem;
    display: flex;
    .overviewDetail {
      width: 34rem;
      height: 26.9rem;
      flex-shrink: 0;
      background-color: #47059c;
      border-radius: 1.4rem;
    }
    .overviewDetail ~ .overviewDetail {
      margin-left: 3.2rem;
    }
    .overviewDetail {
      .topModel {
        background-color: #7134ef;
        border-radius: 1.4rem;
        padding: 0rem 2rem;
      }
      .totalNum {
        font-size: 4.3rem;
        font-weight: bold;
        margin-top: 0.6rem;
      }
      .percentNum {
        font-size: 2.4rem;
        font-style: italic;
      }
      .dataList {
        padding: 0rem 1.2rem;
        margin-top: 1.2rem;
        overflow: hidden;
        .perDataList {
          float: left;
          .typeName {
            font-size: 1.4rem;
            .shiDuoIcon {
              color: #a634ef;
              font-size: 1.8rem;
            }
            .planeIcon {
              color: #5cadff;
              font-size: 1.8rem;
            }
          }
          .perData {
            margin-top: 0.2rem;
            .propName {
              font-size: 1.2rem;
            }
            .propNum {
              margin-top: 0.2rem;
              font-size: 1.5rem;
              font-weight: bold;
            }
          }
          .perData:nth-of-type(3) {
            margin-top: 0.8rem;
          }
        }
        .leftDataList {
          width: 17rem;
          border-right: solid #ae95ff;
          height: 18.9rem;
        }
        .rightDataList {
          margin-left: 1.2rem;
        }
        .perSaleDataList {
          height: 12.3rem;
          .typeLine {
            overflow: hidden;
            .point {
              width: 1rem;
              height: 1rem;
              border-radius: 50%;
              float: left;
              margin-top: 0.5rem;
              margin-right: 0.7rem;
            }
            .typeName {
              float: left;
              font-size: 1.4rem;
            }
            .icon {
              float: right;
              margin-right: 1.3rem;
              width: 2rem;
              height: 2rem;
              .imgBox {
                width: 100%;
                height: 100%;
              }
            }
            .iconNo {
              //   transform: rotate(180deg);
              margin-left: 2.5rem;
              color: #ff314a;
            }
            .iconYes {
              color: #19be6b;
            }
            .green {
              background-color: #19be6b;
            }
            .red {
              background-color: #ff314a;
            }
          }
          .perData {
            margin-top: 0.7rem;
            .propNum {
              font-size: 1.8rem;
            }
          }
        }
      }
      .pieChartContainer {
        width: 34rem;
        height: 15.7rem;
      }
      .topModel1 {
        height: 6rem;
        font-size: 2.4rem;
        padding-top: 1.4rem;
      }
      .topModel2,
      .topModel3,
      .topModel4 {
        height: 11.2rem;
        font-size: 2.4rem;
        padding: 1.4rem 0rem 1.4rem 1.4rem;
      }
      .saleDataList {
        margin-top: 1.7rem;
        padding-right: 0;
      }
      .problemDataList {
        padding-left: 1.5rem;
        .problemBlock {
          border: 0.1rem solid #a634ef;
          border-radius: 0.4rem;
          padding: 0.8rem;
          width: 9.6rem;
          height: 6rem;
          float: left;
          .propName {
            font-size: 1.2rem;
          }
          .propNum {
            font-size: 1.8rem;
            font-weight: bold;
            margin-top: 0.8rem;
          }
        }
        .problemBlock1 ~ .problemBlock1 {
          margin-left: 1.1rem;
        }
        .problemBlock2 ~ .problemBlock2 {
          margin-left: 1.3rem;
        }
        .problemBlock2 {
          width: 14.8rem;
          margin-top: 1rem;
        }
      }
    }
  }
  .overviewMode2 {
    .overviewDetail1 {
      width: 34rem;
      .dataList1 {
        display: flex;
        flex-direction: row;
        overflow: hidden;

        .leftDataList {
          display: block;
          width: 16.9rem;
          .propName {
            font-size: 1.2rem;
            margin-top: 1.2rem;
          }
          .propNum {
            width: 14rem;
            margin-top: 0.3rem;
            font-size: 1.8rem;
            font-weight: bold;
          }
        }
        .rightDataList {
          display: block;
          width: 14rem;
          .propName {
            font-size: 1.2rem;
            margin-top: 1.2rem;
          }
          .propNum {
            width: 12rem;
            margin-top: 0.3rem;
            font-size: 1.8rem;
            font-weight: bold;
          }
        }
        .borderRight {
          border-right: solid #ae95ff;
        }
      }
    }
  }
  // 通用提示气泡样式
  .tipsIcon {
    font-size: 1.8rem;
    color: #dddee1;
  }
}
</style>
