<template>
  <div class="left-filter-board-wrapper">
    <section class="breadcrumb">
      <i class="el-icon-s-fold" style="cursor: pointer" @click="showUp"></i>
      <span class="text" :title="breadName">{{ breadName }}</span>
    </section>
    <!-- 全国 到 营业部层级视图 -->
    <section class="business-chart-wrap" v-show="baseLevel">
      <!--顶部选项卡按钮-->
      <div class="tabs-wrap">
        <div
          class="tab-item"
          v-for="(item, idx) in tabsData"
          :key="idx"
          @click="handleChange(item, idx)"
          :class="{ active: activeIndex === idx }"
        >
          <i class="icon-item" :class="item.icon"></i>
        </div>
      </div>
      <div class="content-wrap">
        <div class="title">{{ activeTitle }}</div>
        <div class="content">
          <!-- 商圈统计分析 -->
          <ChartTab
            v-show="activeIndex === 0"
            :legendData="chartData"
            :total="totalCount"
            :exceptionCount="exceptionCount"
            @handleChange="chartSwitchChanged"
          ></ChartTab>
          <!-- 图层控制 -->
          <div v-show="activeIndex === 1">
            <CheckboxGroup
              title="商圈形态"
              :labels="businessLabels"
              :columns="businessColumns"
              @handleCheck="handleBusinessChange"
            >
            </CheckboxGroup>
            <CheckboxGroup
              title="组织架构"
              :labels="orgLabels"
              :columns="orgColumns"
              @handleCheck="handleOrgChange"
            >
            </CheckboxGroup>
            <CheckboxGroup
              title="行政区划"
              :labels="regionLabels"
              :columns="regionColumns"
              @handleCheck="handleRegionChange"
            >
            </CheckboxGroup>
          </div>
        </div>
      </div>
    </section>
    <!-- 商圈层级视图 -->
    <section class="business-data-wrap" v-show="!baseLevel">
      <BusinessDataPanel></BusinessDataPanel>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { AMap } from '@/plugins/AMap'
import ChartTab from './chartTab'
import BusinessDataPanel from './businessDataPanel'
import CheckboxGroup from './checkGroup'
import BUSINESS_DISTRICT_API from '../../../../api/business_district_api'

export default {
  name: 'leftFilterBoard',
  components: {
    ChartTab,
    BusinessDataPanel,
    CheckboxGroup
  },
  computed: {
    ...mapGetters('businessPreview', [
      'orgLevel',
      'businessCtrlList',
      'businessPanelShow'
    ]),
    // 商圈编号
    proNumber() {
      return this.$route.query.proNumber || ''
    },
    organizationId() {
      return this.$store.state.map.organizationId
    }
  },
  watch: {
    // 监听组织层级变化
    orgLevel(val) {
      if (val) {
        // this.getPieChartData()
      }
    },
    businessPanelShow(val) {
      this.baseLevel = val
      if (val) {
        // 组织面板显示，商圈编码置空
        this.$store.commit('businessPreview/setBusinessNo', '')
      }
    }
  },
  data() {
    return {
      breadName: '',
      baseLevel: true,
      tabsData: [
        { id: 0, text: '商圈统计分析', icon: 'el-icon-notebook-2' },
        { id: 1, text: '图层控制', icon: 'el-icon-copy-document' }
      ],
      activeIndex: 0,
      activeTitle: '商圈统计分析',
      // 商圈形态list
      businessColumns: [
        { name: '名称', id: 'name' },
        { name: '类型', id: 'type' },
        { name: '边界', id: 'border' },
        { name: '范围', id: 'range' }
      ],
      businessLabels: [],
      // 组织架构list
      orgColumns: [
        { name: '名称', id: 'name' },
        { name: '位置', id: 'position' },
        { name: '边界', id: 'border' }
        // { name: '范围', id: 'range' }
      ],
      orgLabels: [],
      // 行政区划list
      regionColumns: [
        { name: '名称', id: 'name' },
        { name: '边界', id: 'border' }
      ],
      regionLabels: [],
      chartData: [],
      totalCount: 0,
      exceptionCount: 0
    }
  },
  created() {
    if (this.$route.query.orgId) {
      this.breadName = this.$route.query.proName
    }
  },
  methods: {
    handleChange(item, idx) {
      this.activeIndex = idx
      this.activeTitle = item.text
    },
    // 左侧过滤面板隐藏/显示
    showUp() {
      this.$emit('change', false)
    },
    // 获取商圈统计分析tab-饼图数据
    async getPieChartData(tempOrgId) {
      this.getOrgLevelCheckbox()
      this.chartData = []
      this.totalCount = 0
      this.$store.commit('businessPreview/setExceptionCtrlSwitch', false)
      // const params = {
      //   programNo: '001',
      //   orgId: '8079490488123437071',
      //   orgType: '2'
      // }
      // const params = {
      //   programNo: '2020Q11365135796856041472',
      //   orgId: '8875720570869309603',
      //   orgType: '1'
      // }
      const params = {
        programNo: this.$route.query.proNumber,
        orgId: tempOrgId,
        orgType: this.orgLevel
      }
      let res = await BUSINESS_DISTRICT_API.get_detail_charts(params)
      if (res && res.pieChart) {
        const { businessTotal, proportionInfo } = res.pieChart
        this.totalCount = businessTotal
        this.chartData = proportionInfo || []
        if (proportionInfo && proportionInfo.length) {
          this.businessLabels = []
          proportionInfo.forEach((item, index) => {
            if (this.orgLevel !== '-2' && this.orgLevel !== '-1' && this.orgLevel !== '0') {
              this.businessLabels.push({
                name: item.businessLevelName,
                color: item.color
              })
            } else if (index < 2) {
              this.businessLabels.push({
                name: item.businessLevelName,
                color: item.color
              })
            }
          })
        }
        // 拿到异常商圈数量和异常商圈的边界信息
        this.exceptionCount = res.abnormalBusinessCount || 0
        let tempPolygonArr = []
        if (res.abnormalBusinessList && res.abnormalBusinessList.length) {
          res.abnormalBusinessList.forEach(item => {
            // 异常商圈名称marker
            // const name_html_str = `<div class='businessName' title="${item.businessName}">${item.businessName}</div>`
            // let name_marker_obj = new AMap.Marker({
            //   position: [item.businessLng, item.businessLat],
            //   content: name_html_str,
            //   offset: new AMap.Pixel(0, 0),
            //   anchor: 'bottom-center',
            //   zIndex: this.orgLevel === '2' ? 9 : 5,
            //   cursor: 'pointer'
            // })
            // tempPolygonArr.push(name_marker_obj)

            // 异常商圈边界polygon
            let border_geo_obj = new AMap.GeoJSON({
              geoJSON: JSON.parse(item.businessBounder),
              getPolygon: (geo_json, lng_lat) => {
                let polygon_obj = new AMap.Polygon({
                  path: lng_lat,
                  zIndex: this.orgLevel === '2' ? 8 : 5,
                  strokeColor: '#000',
                  strokeOpacity: 1,
                  strokeWeight: 0.6,
                  fillColor: '#930cea',
                  fillOpacity: 0.9,
                  bubble: true
                })
                // 绑定点击事件 营业部级别可以点击商圈下钻到商圈级别
                if (this.orgLevel === '2') {
                  polygon_obj.on('click', () => {
                    this.$store.commit(
                      'businessPreview/setBusinessNo',
                      item.businessNo
                    )
                    this.$store.commit('businessPreview/setOrgLevel', '')
                  })
                }
                return polygon_obj
              }
            })
            tempPolygonArr.push(border_geo_obj)
          })
        }
        this.$emit('handleException', tempPolygonArr)
      }
    },
    // 根据组织级别 展示不同的多选框列表(商圈形态/组织架构/行政区划)
    getOrgLevelCheckbox() {
      if (this.orgLevel === '-2' || this.orgLevel === '-1') {
        // 组织级别是全国
        this.businessColumns = [{ name: '范围', id: 'range' }]
        this.orgLabels = [{ name: '南北区', color: '' }]
        this.regionLabels = [{ name: '省、自治区、直辖市', color: '' }]
      } else if (this.orgLevel === '0') {
        // 组织级别是南/北区
        this.businessColumns = [{ name: '范围', id: 'range' }]
        this.orgLabels = [{ name: '行销公司', color: '' }]
        this.regionLabels = [{ name: '省、自治区、直辖市', color: '' }]
      } else if (this.orgLevel === '1') {
        // 组织级别是行销公司
        this.businessColumns = [
          { name: '名称', id: 'name' },
          { name: '类型', id: 'type' },
          { name: '边界', id: 'border' },
          { name: '范围', id: 'range' }
        ]
        this.orgLabels = [
          { name: '行销公司', color: '' },
          { name: '营业部', color: '' }
        ]
        // this.regionLabels = [{ name: '自治州、地级市', color: '' }]
        this.regionLabels = [
          { name: '自治州、地级市', color: '' },
          { name: '市辖区', color: '' },
          { name: '县级市', color: '' },
        ]
      } else if (this.orgLevel === '2') {
        // 组织级别是营业部
        this.businessColumns = [
          { name: '名称', id: 'name' },
          { name: '类型', id: 'type' },
          { name: '边界', id: 'border' },
          { name: '范围', id: 'range' }
        ]
        this.orgLabels = [
          { name: '营业部', color: '' }
          // { name: '营业所', color: '' }
        ]
        // this.regionLabels = [{ name: '县级市', color: '' }]
        this.regionLabels = [
          { name: '市辖区', color: '' },
          { name: '县级市', color: '' },
        ]
      } else {
        // 组织级别是商圈
        this.businessColumns = [
          { name: '名称', id: 'name' },
          { name: '类型', id: 'type' },
          { name: '边界', id: 'border' },
          { name: '范围', id: 'range' }
        ]
        this.orgLabels = [{ name: '营业所', color: '' }]
        this.regionLabels = []
      }
    },
    // 商圈统计分析-switch开关变化
    chartSwitchChanged(val) {
      this.$store.commit('businessPreview/setAnalysisCtrlList', val)
    },
    // 多选框-商圈形态
    handleBusinessChange(val) {
      this.$store.commit('businessPreview/setBusinessCtrlList', val)
    },
    // 多选框-组织架构
    handleOrgChange(val) {
      this.$store.commit('businessPreview/setOrgCtrlList', val)
    },
    // 多选框-行政区划
    handleRegionChange(val) {
      this.$store.commit('businessPreview/setRegionCtrlList', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.left-filter-board-wrapper {
  // width: 400px;
  background-color: #0a2757;
  transition: all 0.2s;
  position: relative;
  .breadcrumb {
    height: 40px;
    line-height: 40px;
    text-align: left;
    background: #081f45;
    position: relative;
    i.el-icon-s-fold {
      font-size: 15px;
      margin: 0 14px;
      line-height: 40px;
      vertical-align: top;
    }
    .text {
      display: inline-block;
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      width: 300px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .export-icon {
      font-size: 20px;
      position: absolute;
      bottom: 10px;
      right: 10px;
      cursor: pointer;
    }
  }
  .business-chart-wrap {
    width: 400px;
    .tabs-wrap {
      display: flex;
      height: 26px;
      box-shadow: 0px 12px 8px -12px rgba(0, 0, 0, 0.5);
      .tab-item {
        flex: 1;
        line-height: 26px;
        background: #0a2757;
        text-align: center;
        cursor: pointer;
        .icon-item {
          font-size: 16px;
          color: #ffffff;
          color: #415982;
          padding-top: 5px;
        }
        &.active {
          background: #133773;
          box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.5),
            1px 0px 0px 0px rgba(0, 0, 0, 0.5);
          .icon-item {
            color: #ffffff;
          }
        }
        &:last-child {
          .icon-item {
            transform: rotate(314deg);
          }
        }
      }
    }
    .content-wrap {
      .title {
        height: 40px;
        line-height: 40px;
        text-align: left;
        font-size: 18px;
        font-weight: 600;
        color: #ffffff;
        padding-left: 15px;
      }
      .content {
        width: 100%;
        height: calc(100vh - 155px);
        overflow-y: auto;
      }
    }
  }
  .business-data-wrap {
    width: 340px;
  }
}
</style>
