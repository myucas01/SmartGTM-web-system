<template>
  <div class="dashboard" ref="dashboard">
    <!--导航区域bar-->
    <section class="navAreaBar">
      <div class="areaList">
        <div class="areaButton areaButtonBack" @click="routeBackIndex">
          返回
        </div>
        <div class="areaButton areaButtonActive">{{ area_name }}</div>
      </div>
      <div class="detailTabs">
        <div
          class="perDetailTab"
          :class="{ activeTab: type_id === '2' }"
          @click="switchTab('2')"
        >
          门店结构情况
        </div>
        <div
          class="perDetailTab"
          :class="{ activeTab: type_id === '3' }"
          @click="switchTab('3')"
        >
          门店销量情况
        </div>
        <div
          class="perDetailTab"
          :class="{ activeTab: type_id === '4' }"
          @click="switchTab('4')"
        >
          门店成交情况
        </div>
        <div
          class="perDetailTab"
          :class="{ activeTab: type_id === '5' }"
          @click="switchTab('5')"
        >
          门店问题情况
        </div>
      </div>
      <!--全屏按钮-->
      <div
        class="fullScreenButton"
        :class="
          is_full_screen ? 'el-icon-copy-document' : 'el-icon-full-screen'
        "
        @click="fullScreen"
        :title="is_full_screen ? '还原' : '全屏'"
      ></div>
    </section>
    <!--总览模块-->
    <section class="overviewDetailModel">
      <article class="detailModel1">
        <!--折线图图表-->
        <div class="detailChart">
          <!--顶部数据-->
          <div class="topData">
            <div class="leftData">
              <span class="totalPointTitle">
                <span class="totalPointTitleName" v-show="type_id === '2'"
                  >总点数</span
                >
                <span class="totalPointTitleName" v-show="type_id === '3'"
                  >门店销量情况(箱)</span
                >
                <span class="totalPointTitleName" v-show="type_id === '4'"
                  >门店成交情况</span
                >
                <span class="totalPointTitleName" v-show="type_id === '5'"
                  >门店问题情况</span
                >
                <i
                  class="el-icon-question tipsIcon"
                  v-show="type_id === '2'"
                  :title="tipInfo.zdsTips"
                ></i>
                <i
                  class="el-icon-question tipsIcon"
                  v-show="type_id === '3'"
                  :title="tipInfo.mdxlTips"
                ></i>
                <i
                  class="el-icon-question tipsIcon"
                  v-show="type_id === '4'"
                  :title="tipInfo.mdcjTips"
                ></i>
                <i
                  class="el-icon-question tipsIcon"
                  v-show="type_id === '5'"
                  :title="tipInfo.mdwtTips"
                ></i>
              </span>
              <div class="totalPoint">
                {{ overview_data.total | numFormat }}
              </div>
            </div>
            <div class="rightData">
              <div class="totalRatioData totalRatioMonthData">
                <div class="totalRatioDataTitle totalRatioMonthDataTitle">
                  较上月环比
                </div>
                <div
                  class="totalRatioDataNum totalRatioMonthDataNum"
                  v-if="overview_data"
                >
                  {{ overview_data.monthOnMonth.number > 0 ? '+' : ''
                  }}{{ overview_data.monthOnMonth.number | numFormat }}({{
                    overview_data.monthOnMonth.percentage
                  }})
                </div>
              </div>
              <div class="totalRatioData totalRatioYearData">
                <div class="totalRatioDataTitle totalRatioYearDataTitle">
                  较去年同比
                </div>
                <div
                  class="totalRatioDataNum totalRatioYearDataNum"
                  v-if="overview_data"
                >
                  {{ overview_data.yearOnYear.number > 0 ? '+' : ''
                  }}{{ overview_data.yearOnYear.number | numFormat }}({{
                    overview_data.yearOnYear.percentage
                  }})
                </div>
              </div>
            </div>
          </div>
          <!--折线图-->
          <div class="lineChartContainer" ref="lineChartContainerDom">
            <echarts :options="lineEechartsOption" v-if="lineShow"></echarts>
          </div>
        </div>
        <!--表格数据：门店结构情况-->
        <!--表格数据：门店销量情况-->
        <!--表格数据：门店成交情况-->
        <!--表格数据：门店问题情况-->
        <detailTables
          :type-id="type_id"
          :tableData="table_data"
          :areaId="area_id"
        ></detailTables>
      </article>
      <article class="detailModel2">
        <div class="detailRadarChart">
          <div class="radarHeader">
            <div class="titleName">对比选择</div>
            <!-- 门店结构之外的三个页面都有tabs页 -->
            <div class="tabsBox">
              <div class="tabsIner" v-if="type_id !== '2'">
                <p
                  class="tabsBtn"
                  @click="tabBtn('士多')"
                  :class="{ activeTabs: tabSwitch === '士多' }"
                >
                  士多
                </p>
                <p
                  class="tabsBtn"
                  @click="tabBtn('特通')"
                  :class="{ activeTabs: tabSwitch === '特通' }"
                >
                  特通
                </p>
                <p
                  class="tabsBtn"
                  @click="tabBtn('二阶')"
                  :class="{ activeTabs: tabSwitch === '二阶' }"
                >
                  二阶
                </p>
                <p
                  class="tabsBtn"
                  @click="tabBtn('MT')"
                  :class="{ activeTabs: tabSwitch === 'MT' }"
                >
                  MT
                </p>
              </div>
            </div>
            <div class="comparisonDateList" v-if="radar_data[0]">
              <div class="point"></div>
              <div class="perDate">{{ radar_data[0] }}</div>
              <template>
                <div class="point"></div>
                <div class="perDate">{{ radar_data[1] }}</div>
              </template>
            </div>
          </div>
          <div class="radarContent">
            <div class="compareController">
              <div class="typeHeader">
                对比记录
                <i
                  class="el-icon-question tipsIcon"
                  :title="tipInfo.dbjlTips"
                ></i>
              </div>
              <div
                class="controllerList"
                :class="{ controllerListSix: type_id === '3' }"
              >
                <div
                  class="perController"
                  :class="{ perControllerActive: s_type === 2 }"
                  @click="switchSTab(2)"
                >
                  月同比
                </div>
                <div
                  class="perController"
                  :class="{ perControllerActive: s_type === 1 }"
                  @click="switchSTab(1)"
                >
                  月环比
                </div>
                <div
                  class="perController"
                  :class="{ perControllerActive: s_type === 4 }"
                  @click="switchSTab(4)"
                >
                  季同比
                </div>
                <div
                  class="perController"
                  :class="{ perControllerActive: s_type === 3 }"
                  @click="switchSTab(3)"
                >
                  季环比
                </div>
                <div
                  class="perController"
                  :class="{ perControllerActive: s_type === 5 }"
                  @click="switchSTab(5)"
                >
                  年环比
                </div>
                <div
                  class="perController"
                  v-if="type_id === '3'"
                  :class="{ perControllerActive: s_type === 6 }"
                  @click="switchSTab(6)"
                >
                  YTD
                </div>
              </div>
            </div>

            <!--门店结构情况-->
            <div class="radarList radarListFour" v-if="type_id === '2'">
              <!--提示-->
              <!-- <el-tooltip
                class="item"
                effect="dark"
                content="当鼠标移动到雷达图节点时， 显示当前特征数值。"
                placement="bottom"
              >
                <i class="el-icon-warning tipsIcon"></i>
              </el-tooltip> -->
              <div class="perRadar">
                <div class="perRadarTypeName">士多</div>
                <div class="perRadarChart">
                  <div
                    class="radarContainer radarContainer5_1"
                    ref="radarDom5_1"
                    id="radarDom5_1"
                  >
                    <div class="totalBox" v-if="shidouMaxTotal.length !== 0">
                      <p>{{ shidouMaxTotal[0] | numFormat }}</p>
                      <p>{{ shidouMaxTotal[1] | numFormat }}</p>
                    </div>
                    <echarts :options="echartsOption1" v-if="barShow"></echarts>
                  </div>
                </div>
              </div>
              <div class="perRadar">
                <div class="perRadarTypeName">特通</div>
                <div class="perRadarChart">
                  <div class="seperateLine"></div>
                  <div
                    class="radarContainer radarContainer5_2"
                    ref="radarDom5_2"
                    id="radarDom5_2"
                  >
                    <div class="totalBox" v-if="tetongMaxTotal.length !== 0">
                      <p>{{ tetongMaxTotal[0] | numFormat }}</p>
                      <p>{{ tetongMaxTotal[1] | numFormat }}</p>
                    </div>
                    <echarts :options="echartsOption2" v-if="barShow"></echarts>
                  </div>
                </div>
              </div>
              <div class="perRadar">
                <div class="perRadarTypeName">二阶</div>
                <div class="perRadarChart">
                  <div class="seperateLine"></div>
                  <div
                    class="radarContainer radarContainer5_3"
                    ref="radarDom5_3"
                    id="radarDom5_3"
                  >
                    <div class="totalBox" v-if="erjieMaxTotal.length !== 0">
                      <p>{{ erjieMaxTotal[0] | numFormat }}</p>
                      <p>{{ erjieMaxTotal[1] | numFormat }}</p>
                    </div>
                    <echarts :options="echartsOption3" v-if="barShow"></echarts>
                  </div>
                </div>
              </div>
              <div class="perRadar">
                <div class="perRadarTypeName">MT</div>
                <div class="perRadarChart">
                  <div class="seperateLine"></div>
                  <div
                    class="radarContainer radarContainer5_3"
                    ref="radarDom5_3"
                    id="radarDom5_3"
                  >
                    <div class="totalBox" v-if="MTMaxTotal.length !== 0">
                      <p>{{ MTMaxTotal[0] | numFormat }}</p>
                      <p>{{ MTMaxTotal[1] | numFormat }}</p>
                    </div>
                    <echarts :options="echartsOption4" v-if="barShow"></echarts>
                  </div>
                </div>
              </div>
            </div>
            <!-- 门店销量情况 -->
            <div
              class="radarList radarListFour radarListTwo"
              v-if="type_id === '3'"
            >
              <div class="perRadar">
                <div class="perRadarTypeName">销量达标</div>
                <div class="perRadarChart">
                  <div
                    class="radarContainer radarContainer5_1"
                    ref="radarDom5_1"
                    id="radarDom5_1"
                  >
                    <div class="totalBox" v-if="dabiaoMaxTotal.length !== 0">
                      <p>{{ dabiaoMaxTotal[0] | numFormat }}</p>
                      <p>{{ dabiaoMaxTotal[1] | numFormat }}</p>
                    </div>
                    <echarts
                      :options="dabiaoEchartsOption"
                      v-if="barShow"
                    ></echarts>
                  </div>
                </div>
              </div>
              <div class="perRadar">
                <div class="perRadarTypeName">销量不达标</div>
                <div class="perRadarChart">
                  <div class="seperateLine"></div>
                  <div
                    class="radarContainer radarContainer5_2"
                    ref="radarDom5_2"
                    id="radarDom5_2"
                  >
                    <div class="totalBox" v-if="budabiaoMaxTotal.length !== 0">
                      <p>{{ budabiaoMaxTotal[0] | numFormat }}</p>
                      <p>{{ budabiaoMaxTotal[1] | numFormat }}</p>
                    </div>
                    <echarts
                      :options="budabiaoEchartsOption"
                      v-if="barShow"
                    ></echarts>
                  </div>
                </div>
              </div>
            </div>
            <!-- 门店成交情况 -->
            <div class="radarList radarListFour" v-if="type_id === '4'">
              <div class="perRadar">
                <div class="perRadarTypeName">月月活</div>
                <div class="perRadarChart">
                  <div
                    class="radarContainer radarContainer5_1"
                    ref="radarDom5_1"
                    id="radarDom5_1"
                  >
                    <div class="totalBox" v-if="yueyuehuoMaxTotal.length !== 0">
                      <p>{{ yueyuehuoMaxTotal[0] | numFormat }}</p>
                      <p>{{ yueyuehuoMaxTotal[1] | numFormat }}</p>
                    </div>
                    <echarts
                      :options="yueyuehuoEchartsOption"
                      v-if="barShow"
                    ></echarts>
                  </div>
                </div>
              </div>
              <div class="perRadar">
                <div class="perRadarTypeName">双月活</div>
                <div class="perRadarChart">
                  <div class="seperateLine"></div>
                  <div
                    class="radarContainer radarContainer5_2"
                    ref="radarDom5_2"
                    id="radarDom5_2"
                  >
                    <div
                      class="totalBox"
                      v-if="shuangyuehuoMaxTotal.length !== 0"
                    >
                      <p>{{ shuangyuehuoMaxTotal[0] | numFormat }}</p>
                      <p>{{ shuangyuehuoMaxTotal[1] | numFormat }}</p>
                    </div>
                    <echarts
                      :options="shuangyuehuoEchartsOption"
                      v-if="barShow"
                    ></echarts>
                  </div>
                </div>
              </div>
              <div class="perRadar">
                <div class="perRadarTypeName">近期活跃</div>
                <div class="perRadarChart">
                  <div class="seperateLine"></div>
                  <div
                    class="radarContainer radarContainer5_3"
                    ref="radarDom5_3"
                    id="radarDom5_3"
                  >
                    <div class="totalBox" v-if="jinqiMaxTotal.length !== 0">
                      <p>{{ jinqiMaxTotal[0] | numFormat }}</p>
                      <p>{{ jinqiMaxTotal[1] | numFormat }}</p>
                    </div>
                    <echarts
                      :options="jinqiEchartsOption"
                      v-if="barShow"
                    ></echarts>
                  </div>
                </div>
              </div>
              <div class="perRadar">
                <div class="perRadarTypeName">连续两个月未成交</div>
                <div class="perRadarChart">
                  <div class="seperateLine"></div>
                  <div
                    class="radarContainer radarContainer5_1"
                    ref="radarDom5_1"
                    id="radarDom5_1"
                  >
                    <div class="totalBox" v-if="lianxuMaxTotal.length !== 0">
                      <p>{{ lianxuMaxTotal[0] | numFormat }}</p>
                      <p>{{ lianxuMaxTotal[1] | numFormat }}</p>
                    </div>
                    <echarts
                      :options="lianxuEchartsOption"
                      v-if="barShow"
                    ></echarts>
                  </div>
                </div>
              </div>
              <div class="perRadar">
                <div class="perRadarTypeName">未成交</div>
                <div class="perRadarChart">
                  <div class="seperateLine"></div>
                  <div
                    class="radarContainer radarContainer5_2"
                    ref="radarDom5_2"
                    id="radarDom5_2"
                  >
                    <div
                      class="totalBox"
                      v-if="weichengjiaoMaxTotal.length !== 0"
                    >
                      <p>{{ weichengjiaoMaxTotal[0] | numFormat }}</p>
                      <p>{{ weichengjiaoMaxTotal[1] | numFormat }}</p>
                    </div>
                    <echarts
                      :options="weichengjiaoEchartsOption"
                      v-if="barShow"
                    ></echarts>
                  </div>
                </div>
              </div>
            </div>
            <!-- 门店问题情况 -->
            <div class="radarList radarListFour" v-if="type_id === '5'">
              <div class="perRadar">
                <div class="perRadarTypeName">销量不达标</div>
                <div class="perRadarChart">
                  <div
                    class="radarContainer radarContainer5_1"
                    ref="radarDom5_1"
                    id="radarDom5_1"
                  >
                    <div
                      class="totalBox"
                      v-if="xlbudabiaoMaxTotal.length !== 0"
                    >
                      <p>{{ xlbudabiaoMaxTotal[0] | numFormat }}</p>
                      <p>{{ xlbudabiaoMaxTotal[1] | numFormat }}</p>
                    </div>
                    <echarts
                      :options="xlbudabiaoEchartsOption"
                      v-if="barShow"
                    ></echarts>
                  </div>
                </div>
              </div>
              <div class="perRadar">
                <div class="perRadarTypeName">连续两个月未成交</div>
                <div class="perRadarChart">
                  <div class="seperateLine"></div>
                  <div
                    class="radarContainer radarContainer5_2"
                    ref="radarDom5_2"
                    id="radarDom5_2"
                  >
                    <div
                      class="totalBox"
                      v-if="lxweiwanchengMaxTotal.length !== 0"
                    >
                      <p>{{ lxweiwanchengMaxTotal[0] | numFormat }}</p>
                      <p>{{ lxweiwanchengMaxTotal[1] | numFormat }}</p>
                    </div>
                    <echarts
                      :options="lxweiwanchengEchartsOption"
                      v-if="barShow"
                    ></echarts>
                  </div>
                </div>
              </div>
              <div class="perRadar">
                <div class="perRadarTypeName">未成交</div>
                <div class="perRadarChart">
                  <div class="seperateLine"></div>
                  <div
                    class="radarContainer radarContainer5_3"
                    ref="radarDom5_3"
                    id="radarDom5_3"
                  >
                    <div class="totalBox" v-if="wcjMaxTotal.length !== 0">
                      <p>{{ wcjMaxTotal[0] | numFormat }}</p>
                      <p>{{ wcjMaxTotal[1] | numFormat }}</p>
                    </div>
                    <echarts
                      :options="wcjEchartsOption"
                      v-if="barShow"
                    ></echarts>
                  </div>
                </div>
              </div>
              <div class="perRadar">
                <div class="perRadarTypeName">数据异常门店</div>
                <div class="perRadarChart">
                  <div class="seperateLine"></div>
                  <div
                    class="radarContainer radarContainer5_3"
                    ref="radarDom5_3"
                    id="radarDom5_3"
                  >
                    <div class="totalBox" v-if="shujuMaxTotal.length !== 0">
                      <p>{{ shujuMaxTotal[0] | numFormat }}</p>
                      <p>{{ shujuMaxTotal[1] | numFormat }}</p>
                    </div>
                    <echarts
                      :options="shujuEchartsOption"
                      v-if="barShow"
                    ></echarts>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script>
import detailTables from '../../components/business_navigation_comp/detailTables'
import dashboardApi from '../../../api/dashboard_api'
import BUSINESS_NAVIGATION_API from '../../../api/business_navigate_api'
import echarts from '../../components/Chart'

export default {
  name: 'DashboardViewDetail',
  data() {
    return {
      // 是否全屏
      is_full_screen: false,
      // 当下区域id
      area_id: '',
      // 当下区域中文名
      area_name: '',
      // 详情类型：(结构情况)2,(销量情况)3,(成交情况)4,(问题情况)5
      type_id: '',
      // 详情表数据
      table_data: '',
      // 雷达数据
      radar_data: [],
      // 总览数据
      overview_data: '',
      // 小选项卡对应值：1:月环比 2:月同比 3:季环比 4:季同比 5:年环比 6:YTD，初始化默认为2
      s_type: 2,
      // 雷达图的模块id，(结构情况/成交情况)1,(销量情况/问题情况)2
      module_id: '',
      // 7个雷达图容器，前两个为一个样式，后5个为一个样式
      radar_obj_2_1: '',
      radar_obj_2_2: '',
      radar_obj_5_1: '',
      radar_obj_5_2: '',
      radar_obj_5_3: '',
      radar_obj_5_4: '',
      radar_obj_5_5: '',
      lineEechartsOption: {}, //折线图数据
      echartsOption1: {},
      echartsOption2: {},
      echartsOption3: {},
      echartsOption4: {},
      shidouMaxTotal: [], //士多总数
      tetongMaxTotal: [], //特通总数
      erjieMaxTotal: [], //二阶总数
      MTMaxTotal: [], //MT总数
      tabSwitch: '士多', //tabs页
      //门店销量情况
      dabiaoEchartsOption: {}, //门店销量情况--达标echarts
      dabiaoMaxTotal: [], //达标总数
      budabiaoEchartsOption: {}, //门店销量情况--不达标echarts
      budabiaoMaxTotal: [], //不达标总数
      //门店成交情况
      yueyuehuoEchartsOption: {}, //门店成交情况--月月活echarts
      yueyuehuoMaxTotal: [], //月月活总数
      shuangyuehuoEchartsOption: {}, //门店成交情况--双月活echarts
      shuangyuehuoMaxTotal: [], //双月活总数
      jinqiEchartsOption: {}, //门店成交情况--近期活跃echarts
      jinqiMaxTotal: [], //近期活跃总数
      lianxuEchartsOption: {}, //门店成交情况--连续两个月未成交echarts
      lianxuMaxTotal: [], //连续两个月未成交总数
      weichengjiaoEchartsOption: {}, //门店成交情况--未成交echarts
      weichengjiaoMaxTotal: [], //未成交总数
      //门店问题情况
      xlbudabiaoEchartsOption: {}, //门店问题情况--销量不达标echarts
      xlbudabiaoMaxTotal: [], //销量不达标总数
      lxweiwanchengEchartsOption: {}, //门店问题情况--连续两个月未成交echarts
      lxweiwanchengMaxTotal: [], //连续两个月未成交总数
      wcjEchartsOption: {}, //门店问题情况--未成交echarts
      wcjMaxTotal: [], //未成交总数
      shujuEchartsOption: {}, //门店问题情况--数据异常门店echarts
      shujuMaxTotal: [], //数据异常门店总数
      lineShow: true, //折线图展示隐藏
      barShow: true, //柱状图展示隐藏
      keys: [
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
        mdwtTips: '',
        dbjlTips: ''
      }
    }
  },
  components: {
    detailTables,
    echarts
  },
  watch: {
    tabSwitch(val, oldVal) {
      if (oldVal !== val && this.type_id !== '2') {
        this.getRadarDataModule(
          this.type_id,
          this.module_id,
          this.area_id,
          this.s_type
        )
      }
    }
  },
  mounted() {
    console.log('mounted')
    // 初始化px to rem值
    this.initPixelToRem()
    // 初始化area_id,area_name,type_id
    this.area_id = this.$route.params.area_id
    this.area_name = this.$route.params.area_name
    this.type_id = this.$route.params.type_id
    // 如果是 门店结构和门店成交，module_id值设置为1; 如果是 门店销量和门店问题，module_id值设置为1
    if (this.type_id === '2') {
      this.module_id = '1'
    } else if (this.type_id === '3') {
      this.module_id = '2'
    } else if (this.type_id === '4') {
      this.module_id = '3'
    } else if (this.type_id === '5') {
      this.module_id = '4'
    }
    // 初始化总览数据
    this.getOverViewDataModule()
    // 初始化table数据
    this.getTablesDataModule()
    // 初始化雷达数据
    this.getRadarDataModule(
      this.type_id,
      this.module_id,
      this.area_id,
      this.s_type
    )
    // 获取所有tips
    BUSINESS_NAVIGATION_API.get_all_tips({ tipsKeys: this.keys.join() }).then(
      res => {
        if (res) {
          // 初始化tips：销量情况（达标，不达标）
          (this.tipInfo.zdsTips = res.hxym_zds_km),
            (this.tipInfo.xzdsTips = res.dashboard_xzds_km),
            (this.tipInfo.zzhzTips = res.dashboard_zzhz_km),
            (this.tipInfo.mdjgTips = res.dqhx_mdjgqk_km),
            (this.tipInfo.mdxlTips =
              res.hxym_xlqk_yzxlzb_km + '\n' + res.hxym_xlqk_ydjxlhb_km),
            (this.tipInfo.mdcjTips =
              res.hxym_cjqk_yzcjszb_km + '\n' + res.hxym_cjqk_ydjcjshb_km),
            (this.tipInfo.mdwtTips =
              '业务异常门店：\n' +
              res.wtmd_ywycmd_clmd_km +
              '\n' +
              res.wtmd_ywycmd_xlbdb_km +
              '\n' +
              res.wtmd_ywycmd_lxlgywcj_km +
              '\n' +
              res.wtmd_ywycmd_wcj_km +
              '\n' +
              res.wtmd_ywycmd_mdzyysbjw_km +
              '\n' +
              res.wtmd_ywycmd_mdzyyscdqy_km +
              '\n' +
              '数据异常门店：\n' +
              res.wtmd_sjycmd_mdbmcw_km +
              '\n' +
              res.wtmd_sjycmd_mddzwx_km +
              '\n' +
              res.wtmd_sjycmd_mdmcwx_km +
              '\n' +
              res.wtmd_sjycmd_mdxxwx_km +
              '\n' +
              res.wtmd_sjycmd_jwdydxbpp_km +
              '\n' +
              res.wtmd_sjycmd_jwdztsdx_km +
              '\n' +
              res.wtmd_sjycmd_qskhlx_km +
              '\n' +
              res.wtmd_sjycmd_jwdqs_km +
              '\n' +
              res.wtmd_sjycmd_mdlxyc_km.substring(0, 30) +
              '\n' +
              res.wtmd_sjycmd_mdlxyc_km.substring(30) +
              '\n' +
              res.wtmd_sjycmd_khjlqs_km),
            (this.tipInfo.dbjlTips = res.dashboard_dbjl_km)
        }
      }
    )
  },
  methods: {
    /**
     * @descrpiton 点击全屏按钮/还原按钮
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
     * @descrpiton 动态修改html上的font-size，以转化为rem；因为设计稿为1280px的宽度，在计算时将设计稿宽/高除以10即可得到rem值
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
     * @description 后退同区域级别下的主页
     */
    routeBackIndex() {
      this.$router.push({
        name: 'DashboardList',
        params: { area_id: this.area_id }
      })
    },
    /**
     * @description 切换选项卡，同时调用接口
     * @param {Number} type_id 带转换数值/字符串也可以
     */
    switchTab(type_id) {
      // 如果同一个选显卡点击两次则不调用接口
      this.tabSwitch = '士多'
      if (this.type_id !== type_id) {
        this.type_id = type_id
        // 初始化小类到月同比
        this.s_type = 2

        switch (type_id) {
          case '2': {
            this.module_id = '1'
            this.getRadarDataModule(
              '2',
              this.module_id,
              this.area_id,
              this.s_type
            )
            break
          }
          case '3': {
            this.module_id = '2'
            this.getRadarDataModule(
              '3',
              this.module_id,
              this.area_id,
              this.s_type
            )
            break
          }
          case '4': {
            this.module_id = '3'
            this.getRadarDataModule(
              '4',
              this.module_id,
              this.area_id,
              this.s_type
            )
            break
          }
          case '5': {
            this.module_id = '4'
            this.getRadarDataModule(
              '5',
              this.module_id,
              this.area_id,
              this.s_type
            )
            break
          }
        }
        // 获取总览数据
        this.getOverViewDataModule()
        // 获取表格数据
        this.getTablesDataModule()
      }
    },
    /**
     * @description 切换小选项卡，同时调用接口
     * @param {Number} s_type 子类id
     */
    switchSTab(s_type) {
      if (this.s_type !== s_type) {
        this.s_type = s_type
        this.getRadarDataModule(
          this.type_id,
          this.module_id,
          this.area_id,
          s_type
        )
      }
    },
    /**
     * @description 切换士多,特通,餐饮选项卡
     * @param {String} tabsName 选项卡名字
     */
    tabBtn(tabsName) {
      this.tabSwitch = tabsName
    },
    /**
     * @description 获取雷达图数据
     * @param {String} type_id 选项卡id：依次对应2-3-4-5
     * @param {String} module_id 1 :结构情况 2:销量情况 3 :成交情况 4:问题情况
     * @param {String} org_id 地域id
     * @param {Number} s_type 对比记录子类，依次：1:月环比 2:月同比 3:季环比 4:季同比 5:年环比 6:YTD
     */
    getRadarDataModule(type_id, module_id, org_id, s_type) {
      this.shidouMaxTotal = []
      this.tetongMaxTotal = []
      this.erjieMaxTotal = []
      this.radar_data = []
      this.dabiaoMaxTotal = []
      this.budabiaoMaxTotal = []
      this.yueyuehuoMaxTotal = []
      this.shuangyuehuoMaxTotal = []
      this.jinqiMaxTotal = []
      this.lianxuMaxTotal = []
      this.weichengjiaoMaxTotal = []
      this.xlbudabiaoMaxTotal = []
      this.lxweiwanchengMaxTotal = []
      this.wcjMaxTotal = []
      this.shujuMaxTotal = []
      this.barShow = false
      dashboardApi
        .getRadarContrastOrgData({
          module: module_id,
          orgId: org_id,
          compareType: s_type
        })
        .then(res => {
          setTimeout(() => {
            this.barShow = true
          }, 50)
          let shiduoLabelData = ['MA', 'CA', 'CB', 'CC']
          let tetongLabelData = ['厂矿', '铁公机', '大中专院校', '特通其他']
          let erjieLabelData = [
            '特约批',
            '单点士多批',
            '批市士多批',
            '其他二阶'
          ]
          let MTLabelData = ['OT', '直特通']
          if (type_id === '2') {
            let shiduoThisYearData = []
            let shiduoLastYearData = []
            let tetongThisYearData = []
            let tetongLastYearData = []
            let erjieThisYearData = []
            let erjieLastYearData = []
            let MTThisYearData = []
            let MTLastYearData = []
            res.data.forEach(re => {
              this.radar_data.unshift(re.dataVersion)
              if (re.type === '1') {
                re.structureVos.forEach(_re => {
                  if (_re.route === '士多') {
                    shiduoThisYearData.push(_re.channelCount)
                  }
                  if (_re.route === '特通') {
                    tetongThisYearData.push(_re.channelCount)
                  }
                  if (_re.route === '二阶') {
                    erjieThisYearData.push(_re.channelCount)
                  }
                  if (_re.route === 'MT') {
                    MTThisYearData.push(_re.channelCount)
                  }
                })
              }
              if (re.type === '2') {
                re.structureVos.forEach(_re => {
                  if (_re.route === '士多') {
                    shiduoLastYearData.push(_re.channelCount)
                  }
                  if (_re.route === '特通') {
                    tetongLastYearData.push(_re.channelCount)
                  }
                  if (_re.route === '二阶') {
                    erjieLastYearData.push(_re.channelCount)
                  }
                  if (_re.route === 'MT') {
                    MTLastYearData.push(_re.channelCount)
                  }
                })
              }
            })
            this.shidouMaxTotal = [
              this.add(shiduoLastYearData),
              this.add(shiduoThisYearData)
            ]
            this.tetongMaxTotal = [
              this.add(tetongLastYearData),
              this.add(tetongThisYearData)
            ]
            this.erjieMaxTotal = [
              this.add(erjieLastYearData),
              this.add(erjieThisYearData)
            ]
            this.MTMaxTotal = [
              this.add(MTLastYearData),
              this.add(MTThisYearData)
            ]
            this.echartsOption1 = this.radarSettingObjFactory(
              shiduoLabelData,
              shiduoThisYearData,
              shiduoLastYearData
            )
            this.echartsOption2 = this.radarSettingObjFactory(
              tetongLabelData,
              tetongThisYearData,
              tetongLastYearData
            )
            this.echartsOption3 = this.radarSettingObjFactory(
              erjieLabelData,
              erjieThisYearData,
              erjieLastYearData
            )
            this.echartsOption4 = this.radarSettingObjFactory(
              MTLabelData,
              MTThisYearData,
              MTLastYearData
            )
          } else if (type_id === '3') {
            //门店销量情况
            let shiduodabiaoThisYearData = []
            let shiduodabiaoLastYearData = []
            let shiduobudabiaoThisYearData = []
            let shiduobudabiaoLastYearData = []

            res.data.forEach(re => {
              this.radar_data.unshift(re.dataVersion)
              if (re.type === '1') {
                re.details.forEach(_re => {
                  if (_re.route === this.tabSwitch) {
                    this.dabiaoMaxTotal[1] = _re.volumeTotal
                    this.budabiaoMaxTotal[1] = _re.volumeTotal
                    shiduodabiaoThisYearData.push(
                      _re.upToSubstandardNumber ? _re.upToSubstandardNumber : 0
                    )
                    shiduobudabiaoThisYearData.push(
                      _re.substandardNumber ? _re.substandardNumber : 0
                    )
                  }
                })
              }
              if (re.type === '2') {
                re.details.forEach(_re => {
                  if (_re.route === this.tabSwitch) {
                    this.dabiaoMaxTotal[0] = _re.volumeTotal
                    this.budabiaoMaxTotal[0] = _re.volumeTotal
                    shiduodabiaoLastYearData.push(
                      _re.upToSubstandardNumber ? _re.upToSubstandardNumber : 0
                    )
                    shiduobudabiaoLastYearData.push(
                      _re.substandardNumber ? _re.substandardNumber : 0
                    )
                  }
                })
              }
            })
            this.dabiaoMaxTotal = [
              this.add(shiduodabiaoLastYearData),
              this.add(shiduodabiaoThisYearData)
            ]
            this.budabiaoMaxTotal = [
              this.add(shiduobudabiaoLastYearData),
              this.add(shiduobudabiaoThisYearData)
            ]
            let LabelData = []
            if (this.tabSwitch === '士多') {
              LabelData = shiduoLabelData
            } else if (this.tabSwitch === '特通') {
              LabelData = tetongLabelData
            } else if (this.tabSwitch === '二阶') {
              LabelData = erjieLabelData
            } else {
              LabelData = MTLabelData
            }
            this.dabiaoEchartsOption = this.radarSettingObjFactory(
              LabelData,
              shiduodabiaoThisYearData,
              shiduodabiaoLastYearData
            )
            this.budabiaoEchartsOption = this.radarSettingObjFactory(
              LabelData,
              shiduobudabiaoThisYearData,
              shiduobudabiaoLastYearData
            )
          } else if (type_id === '4') {
            //门店成交情况
            let yueyuehuoThisYearData = []
            let shuangyuehuoThisYearData = []
            let jinqiThisYearData = []
            let lianxuThisYearData = []
            let weichengjiaoThisYearData = []
            let yueyuehuoLastYearData = []
            let shuangyuehuoLastYearData = []
            let jinqiLastYearData = []
            let lianxuLastYearData = []
            let weichengjiaoLastYearData = []

            res.data.forEach(re => {
              this.radar_data.unshift(re.dataVersion)
              if (re.type === '1') {
                re.details.forEach(_re => {
                  if (_re.route === this.tabSwitch) {
                    yueyuehuoThisYearData.push(
                      _re.monthlyActive ? _re.monthlyActive : 0
                    )
                    shuangyuehuoThisYearData.push(
                      _re.bimonthlyActive ? _re.bimonthlyActive : 0
                    )
                    jinqiThisYearData.push(
                      _re.recentlyActive ? _re.recentlyActive : 0
                    )
                    lianxuThisYearData.push(
                      _re.bimonthlyNoDeal ? _re.bimonthlyNoDeal : 0
                    )
                    weichengjiaoThisYearData.push(_re.noDeal ? _re.noDeal : 0)
                  }
                })
              }
              if (re.type === '2') {
                re.details.forEach(_re => {
                  if (_re.route === this.tabSwitch) {
                    yueyuehuoLastYearData.push(
                      _re.monthlyActive ? _re.monthlyActive : 0
                    )
                    shuangyuehuoLastYearData.push(
                      _re.bimonthlyActive ? _re.bimonthlyActive : 0
                    )
                    jinqiLastYearData.push(
                      _re.recentlyActive ? _re.recentlyActive : 0
                    )
                    lianxuLastYearData.push(
                      _re.bimonthlyNoDeal ? _re.bimonthlyNoDeal : 0
                    )
                    weichengjiaoLastYearData.push(_re.noDeal ? _re.noDeal : 0)
                  }
                })
              }
            })
            this.yueyuehuoMaxTotal = [
              this.add(yueyuehuoLastYearData),
              this.add(yueyuehuoThisYearData)
            ]
            this.shuangyuehuoMaxTotal = [
              this.add(shuangyuehuoLastYearData),
              this.add(shuangyuehuoThisYearData)
            ]
            this.jinqiMaxTotal = [
              this.add(jinqiLastYearData),
              this.add(jinqiThisYearData)
            ]
            this.lianxuMaxTotal = [
              this.add(lianxuLastYearData),
              this.add(lianxuThisYearData)
            ]
            this.weichengjiaoMaxTotal = [
              this.add(weichengjiaoLastYearData),
              this.add(weichengjiaoThisYearData)
            ]
            let LabelData = []
            if (this.tabSwitch === '士多') {
              LabelData = shiduoLabelData
            } else if (this.tabSwitch === '特通') {
              LabelData = tetongLabelData
            } else if (this.tabSwitch === '二阶') {
              LabelData = erjieLabelData
            } else {
              LabelData = MTLabelData
            }
            this.yueyuehuoEchartsOption = this.radarSettingObjFactory(
              LabelData,
              yueyuehuoThisYearData,
              yueyuehuoLastYearData
            )
            this.shuangyuehuoEchartsOption = this.radarSettingObjFactory(
              LabelData,
              shuangyuehuoThisYearData,
              shuangyuehuoLastYearData
            )
            this.jinqiEchartsOption = this.radarSettingObjFactory(
              LabelData,
              jinqiThisYearData,
              jinqiLastYearData
            )
            this.lianxuEchartsOption = this.radarSettingObjFactory(
              LabelData,
              lianxuThisYearData,
              lianxuLastYearData
            )
            this.weichengjiaoEchartsOption = this.radarSettingObjFactory(
              LabelData,
              weichengjiaoThisYearData,
              weichengjiaoLastYearData
            )
          } else if (type_id === '5') {
            //门店成交情况
            let xlbudabiaoThisYearData = []
            let lxweiwanchengThisYearData = []
            let wcjThisYearData = []
            let shujuThisYearData = []
            let xlbudabiaoLastYearData = []
            let lxweiwanchengLastYearData = []
            let wcjLastYearData = []
            let shujuLastYearData = []

            res.data.forEach(re => {
              this.radar_data.unshift(re.dataVersion)
              if (re.type === '1') {
                re.details.forEach(_re => {
                  if (_re.route === this.tabSwitch) {
                    xlbudabiaoThisYearData.push(
                      _re.substandardNumber ? _re.substandardNumber : 0
                    )
                    lxweiwanchengThisYearData.push(
                      _re.bimonthlyNoDeal ? _re.bimonthlyNoDeal : 0
                    )
                    wcjThisYearData.push(_re.noDeal ? _re.noDeal : 0)
                    shujuThisYearData.push(_re.abnormal ? _re.abnormal : 0)
                  }
                })
              }
              if (re.type === '2') {
                re.details.forEach(_re => {
                  if (_re.route === this.tabSwitch) {
                    xlbudabiaoLastYearData.push(
                      _re.substandardNumber ? _re.substandardNumber : 0
                    )
                    lxweiwanchengLastYearData.push(
                      _re.bimonthlyNoDeal ? _re.bimonthlyNoDeal : 0
                    )
                    wcjLastYearData.push(_re.noDeal ? _re.noDeal : 0)
                    shujuLastYearData.push(_re.abnormal ? _re.abnormal : 0)
                  }
                })
              }
            })
            this.xlbudabiaoMaxTotal = [
              this.add(xlbudabiaoLastYearData),
              this.add(xlbudabiaoThisYearData)
            ]
            this.lxweiwanchengMaxTotal = [
              this.add(lxweiwanchengLastYearData),
              this.add(lxweiwanchengThisYearData)
            ]
            this.wcjMaxTotal = [
              this.add(wcjLastYearData),
              this.add(wcjThisYearData)
            ]
            this.shujuMaxTotal = [
              this.add(shujuLastYearData),
              this.add(shujuThisYearData)
            ]
            let LabelData = []
            if (this.tabSwitch === '士多') {
              LabelData = shiduoLabelData
            } else if (this.tabSwitch === '特通') {
              LabelData = tetongLabelData
            } else if (this.tabSwitch === '二阶') {
              LabelData = erjieLabelData
            } else {
              LabelData = MTLabelData
            }
            this.xlbudabiaoEchartsOption = this.radarSettingObjFactory(
              LabelData,
              xlbudabiaoThisYearData,
              xlbudabiaoLastYearData
            )
            this.lxweiwanchengEchartsOption = this.radarSettingObjFactory(
              LabelData,
              lxweiwanchengThisYearData,
              lxweiwanchengLastYearData
            )
            this.wcjEchartsOption = this.radarSettingObjFactory(
              LabelData,
              wcjThisYearData,
              wcjLastYearData
            )
            this.shujuEchartsOption = this.radarSettingObjFactory(
              LabelData,
              shujuThisYearData,
              shujuLastYearData
            )
          }
        })

      //   }
    },
    /**
     * @description 算出各部分总和
     */
    add(arr) {
      let total = 0
      if (arr.length !== 0) {
        arr.forEach(re => {
          total += Number(re)
        })
      } else {
        total = 0
      }
      return total
    },
    /**
     * @description 获取table表格数据，对应3个接口：（结构）一个，（销量）一个，（成交，问题）共计一个
     */
    getTablesDataModule() {
      switch (this.type_id) {
        case '2': {
          dashboardApi
            .getStructureData({
              orgId: this.area_id
            })
            .then(res => {
              console.log('拿到门店结构数据2：')
              this.table_data = res.data
            })
          break
        }
        case '3': {
          dashboardApi
            .getSalesVolumeData({
              orgId: this.area_id
            })
            .then(res => {
              console.log('拿到门店销量数据3')
              this.table_data = res.data
            })
          break
        }
        case '4': {
          dashboardApi
            .getDealAndProblemData({
              orgId: this.area_id
            })
            .then(res => {
              console.log('拿到table数据4')
              this.table_data = res.data
            })
          break
        }
        case '5': {
          dashboardApi
            .getDealAndProblemData({
              orgId: this.area_id
            })
            .then(res => {
              console.log('拿到table数据5')
              this.table_data = res.data
            })
          break
        }
      }
    },
    /**
     * @description 获取总览数据和折线图
     */
    getOverViewDataModule() {
      this.lineShow = false
      dashboardApi
        .getStatisticsData({
          orgId: this.area_id,
          type: this.type_id
        })
        .then(res => {
          setTimeout(() => {
            this.lineShow = true
          }, 50)
          this.overview_data = res.data
          //   let line_chart_obj = this.$Echarts.init(
          //     this.$refs.lineChartContainerDom
          //   )
          // 获取折线图数据
          let lineDataX = this.overview_data.lineChart.axisX
          let lineDataY = this.overview_data.lineChart.axisY
          // 配置折线图
          this.lineEechartsOption = {
            // 设置折线图在容器里的大小
            grid: {
              left: '7%', //x 偏移量
              top: '7%', // y 偏移量
              right: '7%',
              width: '88%', // 宽度
              height: '70%' // 高度
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
                fontSize: '1rem',
                // 距离顶部20
                padding: [0, 0, 0, 0],
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
                show: false,
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
                  color: '#a4b3ff'
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
                        color: 'rgb(104,65,190)'
                      },
                      {
                        offset: 1,
                        color: 'rgb(71,5,156, 0.1)'
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
              position: point => {
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
              formatter: params => {
                return this.numFormat(params[0].data)
              }
            }
          }
        })
    },
    /**
     * @description 饼图运算转换 123456=>123,456，用于在echarts自定义显示html字符串时过滤数值
     * @param {Number} num 带转换数值/字符串也可以
     */
    numFormat(num) {
      var res = num.toString().replace(/\d+/, function(n) {
        // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, function($1) {
          return $1 + ','
        })
      })
      return res
    },
    /**
     * @description echarts
     * @param
     * @param
     * @param
     */
    radarSettingObjFactory(_LabelData, _thisYearData, _lastYearData) {
      var LabelData = _LabelData
      var lineData = [] //最大值加20,是给label定位用的
      var lastYearData = _lastYearData
      var thisYearData = _thisYearData
      let maxNum = 0
      let thisYearmaxNum = 0
      let xMaxNum = 0 //最大的值
      _lastYearData.forEach(num => {
        if (maxNum < Number(num)) {
          maxNum = num
        }
      })
      _thisYearData.forEach(num => {
        if (thisYearmaxNum < Number(num)) {
          thisYearmaxNum = num
        }
      })
      if (thisYearmaxNum > maxNum) {
        xMaxNum = thisYearmaxNum
      } else {
        xMaxNum = maxNum
      }
      for (let i = 0; i < lastYearData.length; i++) {
        lineData.push(xMaxNum)
      }

      var option = {
        baseOption: {
          backgroundColor: 'rgba(0,0,0,0)',
          timeline: {
            show: false,
            top: 0,
            data: []
          },
          legend: {
            show: false,
            top: '5%',
            left: '31%',
            itemWidth: 22,
            itemHeight: 22,
            itemGap: 343,
            icon: 'horizontal',
            textStyle: {
              color: '#ffffff',
              fontSize: 12
            },
            data: ['2017', '2018']
          },
          grid: [
            {
              show: false,
              left: '30%',
              top: '20%',
              bottom: '18%',
              containLabel: true,
              width: '25%'
            },
            {
              show: false,
              left: '57%',
              top: '20%',
              bottom: '18%',
              width: '30%'
            },
            {
              show: false,
              right: '17%',
              top: '20%',
              bottom: '18%',
              containLabel: true,
              width: '25%'
            }
          ],
          xAxis: [
            {
              type: 'value',
              max: xMaxNum,
              inverse: true,
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              position: 'bottom',
              axisLabel: {
                show: false,
                textStyle: {
                  color: 'white'
                }
              },
              splitLine: {
                show: false
              }
            },
            {
              gridIndex: 1,
              max: xMaxNum,
              show: false
            },
            {
              gridIndex: 2,
              max: xMaxNum,
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              position: 'bottom',
              axisLabel: {
                show: false,
                interval: 0,
                textStyle: {
                  color: 'white'
                }
              },
              splitLine: {
                show: false
              }
            }
          ],
          yAxis: [
            {
              type: 'category',
              inverse: true,
              position: 'right',
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              data: LabelData
            },
            {
              gridIndex: 1,
              type: 'category',
              inverse: true,
              position: 'left',
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false,
                textStyle: {
                  color: '#ffffff',
                  fontSize: 20
                }
              },
              data: LabelData.map(function(value) {
                return {
                  value: value,
                  textStyle: {
                    align: 'center'
                  }
                }
              })
            },
            {
              gridIndex: 2,
              type: 'category',
              inverse: true,
              position: 'left',
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              data: LabelData
            }
          ],
          series: []
        },
        options: []
      }

      option.baseOption.timeline.data.push(0)
      option.options.push({
        series: [
          {
            type: 'pictorialBar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                color: 'rgba(0,0,0,0)'
              }
            },
            barWidth: 10,
            data: lineData,
            barGap: '-100%',
            barCategoryGap: 0,
            label: {
              normal: {
                show: true,
                formatter: series => {
                  return LabelData[series.dataIndex]
                },
                position: 'insideTopLeft',
                textStyle: {
                  color: '#ffffff',
                  fontSize: 12
                },
                offset: [-90, -5]
              }
            },
            z: -100,
            animationEasing: 'elasticOut',
            animationDelay: function(dataIndex, params) {
              return params.index * 30
            }
          },
          {
            name: '',
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            barWidth: 10,
            itemStyle: {
              normal: {
                barBorderRadius: 5,
                color: '#866CED',
                borderColor: 'rgba(255,255,255,0)'
              }
            },
            label: {
              show: true,
              position: 'left',
              textStyle: {
                color: '#fff'
              },
              formatter(p) {
                let strNum = p.value
                if (strNum.length <= 3) {
                  return strNum
                }
                if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
                  return strNum
                }
                var a = RegExp.$1,
                  b = RegExp.$2,
                  c = RegExp.$3
                var re = new RegExp()
                re.compile('(\\d)(\\d{3})(,|$)')
                while (re.test(b)) {
                  b = b.replace(re, '$1,$2$3')
                }
                return a + '' + b + '' + c
              }
            },
            data: lastYearData
          },
          {
            name: '',
            type: 'bar',
            xAxisIndex: 2,
            yAxisIndex: 2,
            barWidth: 11,
            itemStyle: {
              normal: {
                barBorderRadius: 5,
                color: '#74C1F6',
                borderColor: 'rgba(255,255,255,0)'
              }
            },
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: '#fff'
              },
              formatter(p) {
                let strNum = p.value
                if (strNum.length <= 3) {
                  return strNum
                }
                if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
                  return strNum
                }
                var a = RegExp.$1,
                  b = RegExp.$2,
                  c = RegExp.$3
                var re = new RegExp()
                re.compile('(\\d)(\\d{3})(,|$)')
                while (re.test(b)) {
                  b = b.replace(re, '$1,$2$3')
                }
                return a + '' + b + '' + c
              }
            },
            data: thisYearData
          }
        ]
      })
      return option
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
  width: 100%;
  height: 6rem;
  background-color: #191839;
  padding-left: 2rem;
  padding-right: 2rem;
  overflow: hidden;
  .areaList {
    float: left;
    width: 28.5rem;
    .areaButton {
      height: 3.6rem;
      display: inline-block;
      line-height: 3.6rem;
      padding-left: 2.4rem;
      padding-right: 2.4rem;
      margin-top: 1.2rem;
      font-size: 1.6rem;
      border-radius: 1.8rem;
      background-color: #47059c;
      cursor: pointer;
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

  .detailTabs {
    float: left;
    margin-left: 10.2rem;
    .perDetailTab {
      width: 14rem;
      height: 6rem;
      float: left;
      line-height: 6rem;
      border-bottom: 0.5rem solid #191839;
      font-size: 1.6rem;
      text-align: center;
      transition: font-size 0.3s, border-bottom 0.3s;
      cursor: pointer;
    }
    .activeTab {
      border-bottom: 0.5rem solid #7909c1;
      font-size: 1.8rem;
      font-weight: bold;
    }
  }
  .fullScreenButton {
    float: right;
    font-size: 3rem;
    margin-top: 2rem;
    cursor: pointer;
  }
}
// 详情模块
.overviewDetailModel {
  padding: 2rem;
  // 第一行折线图和table
  .detailModel1 {
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .detailChart {
      width: 48.6rem;
      height: 27.3rem;
      //   float: left;
      background-color: #47059c;
      border-radius: 1.4rem;
      .topData {
        width: 48.6rem;
        height: 14.8rem;
        border-radius: 1.4rem;
        background-color: #7134ef;
        .leftData {
          float: left;
          height: 10.5rem;
          border-right: solid 0.4rem #ae95ff;
          width: 24.2rem;
          margin-top: 2rem;
          margin-left: 1.6rem;
          .totalPointTitle {
            font-size: 2.4rem;
            .totalPointTitleName {
              padding-right: 1rem;
            }
          }
          .totalPoint {
            font-size: 4rem;
            font-weight: bold;
            margin-top: 1.2rem;
          }
        }
        .rightData {
          margin-left: 1.4rem;
          margin-top: 1.8rem;
          float: left;
          .totalRatioData {
            .totalRatioDataTitle {
              padding-right: 3.4rem;
              font-size: 1.8rem;
            }
            .totalRatioDataNum {
              font-size: 2.2rem;
              font-weight: bold;
              margin-top: 0.5rem;
            }
          }
        }
      }
      .lineChartContainer {
        width: 48.6rem;
        height: 12.5rem;
      }
    }
  }
  // 第二行雷达图
  .detailModel2 {
    margin-top: 1.4rem;
    overflow: hidden;
    .detailRadarChart {
      border-radius: 1.4rem;
      background-color: #47059c;
      height: 34rem;
      .radarHeader {
        background-color: #7134ef;
        border-top-right-radius: 1.4rem;
        border-top-left-radius: 1.4rem;
        height: 4.6rem;
        overflow: hidden;
        .titleName {
          float: left;
          margin-top: 0.9rem;
          margin-left: 1.8rem;
          font-size: 2rem;
          font-weight: bold;
        }
        .tabsBox {
          float: left;
          width: 42rem;
          margin-left: 26%;
          .tabsIner {
            display: flex;
            flex-direction: row;
            height: 4.6rem;
            line-height: 4.6rem;
            .tabsBtn {
              font-size: 1.6rem;
              width: 14rem;
              height: 4.6rem;
              text-align: center;
              font-weight: 400;
              cursor: pointer;
            }
            .activeTabs {
              border-bottom: 5px solid #7909c1;
              font-weight: 600;
            }
          }
        }
        .comparisonDateList {
          float: right;
          margin-right: 8rem;
          display: flex;
          align-items: center;
          height: 4.6rem;
          .point {
            width: 0.8rem;
            height: 0.8rem;
            background-color: #ad84ff;
            border-radius: 50%;
            margin-right: 0.4rem;
          }
          .point:nth-child(3) {
            background-color: #02c5d7;
          }
          .perDate {
            font-size: 1.2rem;
            margin-right: 1.6rem;
          }
        }
      }
      .radarContent {
        overflow: hidden;
        padding: 1.5rem;
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        // 提示气泡
        // .tipsIcon {
        //   position: absolute;
        //   right: 4rem;
        //   top: 2.5rem;
        //   z-index: 2;
        // }
        // 左侧控制器
        .compareController {
          width: 17.8rem;
          height: 26.5rem;
          // float: left;
          border: 0.1rem solid rgba(166, 52, 239, 1);
          overflow: hidden;
          .typeHeader {
            text-align: center;
            line-height: 3.8rem;
            font-size: 1.8rem;
            background: rgba(166, 52, 239, 0.2);
            border-bottom: 0.1rem solid rgba(166, 52, 239, 1);
            .tipsIcon {
              margin-left: 3px;
              display: inline-block;
              z-index: 2;
            }
          }
          .perController {
            width: 14.8rem;
            line-height: 2.3rem;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
            font-size: 1.4rem;
            background: rgba(121, 9, 193, 0.3);
            border: 0.1rem solid rgba(166, 52, 239, 1);
            margin-top: 1.5rem;
            transition: background-color 0.3s;
            cursor: pointer;
          }
          .perController:hover {
            background: rgba(166, 52, 239, 1);
          }
          .perControllerActive {
            background: rgba(166, 52, 239, 1);
          }
          .perController ~ .perController {
            margin-top: 1.8rem;
          }
          .controllerListSix {
            .perController {
              margin-top: 1rem;
            }
          }
        }
        // 右侧雷达列表
        .radarList {
          // float: left;
          // width: 102.6rem;
          flex: 1;
          height: 26.5rem;
          border-top: 0.1rem solid rgba(166, 52, 239, 1);
          border-right: 0.1rem solid rgba(166, 52, 239, 1);
          border-bottom: 0.1rem solid rgba(166, 52, 239, 1);
          display: flex;
          .perRadar {
            display: flex;
            width: 37.9rem;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: 0 12px;
            .perRadarTypeName {
              line-height: 3.7rem;
              text-align: center;
              font-size: 1.5rem;
              border-bottom: 0.1rem solid rgba(147, 12, 234, 1);
            }
            .perRadarChart {
              height: 22.7rem;
              // overflow: hidden;
              .radarContainer {
                float: left;
              }
              .seperateLine {
                float: left;
                width: 0.15rem;
                height: 16.4rem;
                background-color: #a634ef;
                margin-top: 4.3rem;
                margin-left: -1.5rem;
              }
            }
          }
        }
        .radarListFour {
          overflow-x: auto;
          overflow-y: hidden;
          .perRadarTypeName,
          .perRadarChart {
            width: 31.2rem;
            .radarContainer {
              width: 100%;
              height: 22.4rem;
              position: relative;
              .totalBox {
                width: 100%;
                position: absolute;
                z-index: 2;
                text-align: center;
                top: 3rem;
                // right: 8rem;
                p {
                  display: inline-block;
                  text-align: right;
                  width: 51%;
                  // padding-right: 0.2rem;
                }
                p:nth-of-type(2) {
                  width: 42%;
                  text-align: left;
                  padding-left: 1.7rem;
                  //   margin-left: 2rem;
                }
              }
            }
          }
        }
        .radarListTwo {
          overflow: hidden;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          .perRadar,
          .perRadarTypeName,
          .perRadarChart {
            width: 50rem;
            .radarContainer {
              width: 100%;
              height: 22.4rem;
            }
          }
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
