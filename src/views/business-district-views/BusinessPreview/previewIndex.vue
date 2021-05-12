<template>
  <div
    class="business-preview-wrapper"
    id="business-preview-wrapper"
    v-loading.fullscreen.lock="businessLoading || orgLoading || regionLoading"
    element-loading-text="地图加载中......"
    element-loading-background="rgba(0,0,0,0.7)">
    <!-- 地图 -->
    <Map
      ref="map_container"
      @sendMapObj="getMapObj"
      class="mapPreviewContainer"
    >
      <!-- 商圈对比和商圈截图按钮 -->
      <template slot="business-preview-cut">
        <CutScreenPanel />
      </template>
    </Map>
    <!-- 左侧过滤面板 -->
    <LeftFilterBoard
      ref="leftFilterBoard"
      v-show="leftFilterBoardShow"
      @change="closeLeftFilterBoard"
      @handleException="handleExceptionList"
    ></LeftFilterBoard>
    <!--是否显示左上角的过滤面板小按钮-->
    <ShowUpPanel
      v-show="!leftFilterBoardShow"
      @change="openLeftFilterBoard"
    ></ShowUpPanel>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Map from '@/components/Map'
import LeftFilterBoard from './leftFilterBoard'
import ShowUpPanel from './showUpPanel'
import CutScreenPanel from './cutScreenPanel'
import BUSINESS_DISTRICT_API from '../../../../api/business_district_api'
import Business_District_API from '@api/business-district/index'
import { textEllipsis } from '@/util/filters'
// import * as filtersFun from '@/util/filters.js'
import { AMap } from '@/plugins/AMap'
/*---------------------导入缺省图标---------------------*/
import mapStar from '@/assets/img/map_star.png'

export default {
  name: 'businessPreview',
  components: {
    Map,
    LeftFilterBoard,
    ShowUpPanel,
    CutScreenPanel
  },
  computed: {
    ...mapGetters('businessPreview', [
      'orgLevel',
      'businessCtrlList',
      'orgCtrlList',
      'regionCtrlList',
      'exceptionCtrlSwitch',
      'analysisCtrlList',
      'currentSwitchOpen',
      'currentSwitchIndex'
    ]),
    ...mapGetters('map', ['organizationId', 'treeData', 'organizationName']),
    organizationIdAndProNumberAndOrgLevel() {
      return (
        `${this.$store.state.map.organizationId}${this.$route.query.proNumber}${this.orgLevel}` ||
        ''
      )
    },
    // 商圈编码
    proNumber() {
      return this.$route.query.proNumber || ''
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.commit('addTabs', {
        title: '商圈预览',
        link: to.fullPath,
        // link: to.path,
        on: false,
        needCatch: true,
        isPathNameCheck: true
      })
    })
  },
  beforeDestroy() {
    this.$store.commit('businessPreview/setOrgLevel', '')
  },
  watch: {
    organizationId() {
      let organizeType = this.treeData ? this.treeData['orgType'] : '0'
      // 南北区/全国 不予处理
      if (organizeType !== '-2' && organizeType !== '-1' && organizeType !== '0' && this.operationCode !== 'edit') {
        this.$store.commit('businessPreview/SET_VIEW_ORGANIZE', {
          proNo: this.$route.params.id,
          orgId: this.organizationId,
          orgName: this.organizationName
        })
      }
    },
    // 监听右上角展示后的orgId+proNumber+orgLevel
    organizationIdAndProNumberAndOrgLevel() {
      this.tempOrgId = this.$store.state.map.organizationId
      if (this.orgLevel) {
        // 下钻到全国/南北区/行销公司/营业部
        this.getAllMapData()
      } else {
        // 下钻到商圈
        this.getBusinessLevelData()
      }
    },
    // 监听商圈形态checkbox
    businessCtrlList: {
      handler(arr) {
        if (arr && arr.length) {
          arr.forEach((item, idx) => {
            // 名称显示/隐藏(过滤掉没有数据的情况，防止show()/hide()方法报错)
            if (this.name_business_arr[idx]) {
              item.nameCheck
                ? this.name_business_arr[idx].show()
                : this.name_business_arr[idx].hide()
            }
            // 类型显示/隐藏(过滤掉没有数据的情况，防止show()/hide()方法报错)
            if (this.type_business_arr[idx]) {
              item.typeCheck
                ? this.type_business_arr[idx].show()
                : this.type_business_arr[idx].hide()
            }
            // 边界显示/隐藏(过滤掉没有数据的情况，防止show()/hide()方法报错)
            if (this.border_business_arr[idx]) {
              item.borderCheck
                ? this.border_business_arr[idx].show()
                : this.border_business_arr[idx].hide()
            }
            // 范围显示/隐藏(过滤掉没有数据的情况，防止show()/hide()方法报错)
            if (this.polygon_business_arr[idx]) {
              item.rangeCheck
                ? this.polygon_business_arr[idx].show()
                : this.polygon_business_arr[idx].hide()
            }
          })
        }
      },
      deep: true
    },
    // 监听组织架构checkbox
    orgCtrlList: {
      handler(arr) {
        if (arr && arr.length) {
          arr.forEach((item, idx) => {
            // 名称显示/隐藏
            if (this.name_org_arr[idx]) {
              item.nameCheck
                ? this.name_org_arr[idx].show()
                : this.name_org_arr[idx].hide()
            }
            // 位置显示/隐藏
            if (this.icon_org_arr[idx]) {
              item.positionCheck
                ? this.icon_org_arr[idx].show()
                : this.icon_org_arr[idx].hide()
            }
            // 边界显示/隐藏
            if (this.polygon_org_arr[idx]) {
              item.borderCheck
                ? this.polygon_org_arr[idx].show()
                : this.polygon_org_arr[idx].hide()
            }
          })
        }
      },
      deep: true
    },
    // 监听行政架构checkbox
    regionCtrlList: {
      handler(arr) {
        if (arr && arr.length) {
          arr.forEach((item, idx) => {
            // 名称显示/隐藏
            if (this.name_gov_arr[idx]) {
              item.nameCheck
                ? this.name_gov_arr[idx].show()
                : this.name_gov_arr[idx].hide()
            }
            // 边界显示/隐藏
            if (this.polygon_gov_arr[idx]) {
              item.borderCheck
                ? this.polygon_gov_arr[idx].show()
                : this.polygon_gov_arr[idx].hide()
            }
          })
        }
      },
      deep: true
    },
    // 监听异常商圈switch开关变化
    exceptionCtrlSwitch(val) {
      if (this.exception_polygon_arr.length) {
        val
          ? this.exception_polygon_arr[0].show()
          : this.exception_polygon_arr[0].hide()
      }
    },
    // 监听商圈统计分析的switch开关变化
    analysisCtrlList: {
      handler(arr) {
        if (
          arr &&
          arr.length &&
          this.currentSwitchIndex > 1 && // switch开关index位置
          this.currentSwitchOpen && // switch开关状态
          this.polygon_business_arr.length && // 商圈边界polygon数组有数据
          this.polygon_business_arr[this.currentSwitchIndex] === '') { // 商圈边界polygon数组index位置的值为空 则请求数据
            if (arr[this.currentSwitchIndex].value) { // 如果该层级的商圈数量不为0 才去请求数据（防止每次打开都请求）
              if (this.orgLevel === '2') { // 组织层级到达营业部级别，zIndex层级提升
                this.getsingleMapBuinsessData(this.currentSwitchIndex, 7, 6)
              } else {
                this.getsingleMapBuinsessData(this.currentSwitchIndex)
              }
            }
        }
      },
      deep: true
    }
  },
  data() {
    return {
      businessLoading: false,
      orgLoading: false,
      regionLoading: false,
      map_obj: {}, // 地图实例
      leftFilterBoardShow: true,
      tempOrgId: '',
      businessBaseInfo: {
        orgId: '',
        orgName: ''
      },
      // ******************************
      // 地图商圈形态polygon对象数组
      polygon_business_arr: [],
      // 地图商圈形态边界对象数组
      border_business_arr: [],
      // 地图商圈形态名称marker对象数组
      name_business_arr: [],
      // 地图商圈形态类型marker对象数组
      type_business_arr: [],
      // ******************************
      // 地图组织边界polygon对象数组
      polygon_org_arr: [],
      // 地图组织边界-名称marker对象数组
      name_org_arr: [],
      // 地图组织边界-图标icon对象数组
      icon_org_arr: [],
      // ******************************
      // 地图行政边界name对象数组
      name_gov_arr: [],
      // 地图行政边界polygon对象数组
      polygon_gov_arr: [],
      // ******************************
      // 异常商圈polygon和marker对象数组
      exception_polygon_arr: []
    }
  },
  created() {
    // 当前是商圈分级模块的标记(目前不用这个，组织架构树跟权限走)
    // this.$store.dispatch('map/setSearchType', ['map', 'org', 'business_store'])
    // 隐藏地图搜索功能
    this.$store.dispatch('map/setMapSearchIcon', false)
    // console.log('organizationId', this.organizationId)
    // console.log('organizationName', this.organizationName)
    // console.log('cookies', this.$cookies.get('orgId'))
    if (this.$cookies.get('orgId')) {
      // this.$store.dispatch('map/setOrganizationId', this.$route.query.orgId)
      // this.$store.dispatch('map/setOrganizationName', this.$route.query.orgName)
      // this.tempOrgId = this.$route.query.orgId
      // this.$store.commit(
      //   'businessPreview/setOrgLevel',
      //   this.$route.query.orgType
      // )
      this.$store.dispatch('map/setOrganizationId', this.$cookies.get('orgId'))
      // this.$store.dispatch('map/setOrganizationName', this.$route.query.orgName)
      this.tempOrgId = this.$cookies.get('orgId')
      if ( this.$cookies.get('orgType') === '-2') {
        this.$store.commit('businessPreview/setOrgLevel', '-1')
      } else {
        this.$store.commit(
          'businessPreview/setOrgLevel',
          this.$cookies.get('orgType')
        )
      }
    }
  },
  methods: {
    /**
     * @description 从Map组件获取地图对象
     * @params { object } map_obj
     */
    getMapObj(map_obj) {
      this.map_obj = map_obj
    },
    /**
     * @description 打开左侧面板回调函数
     */
    openLeftFilterBoard(val) {
      this.leftFilterBoardShow = val
    },
    /**
     * @description 关闭左侧面板回调函数
     */
    closeLeftFilterBoard(val) {
      this.leftFilterBoardShow = val
    },
    /**
     * @description API获取地图数据-商圈形态数据
     * @param { object } params
     */
    getAllMapData() {
      // 左侧面板-商圈统计分析展示
      this.$store.commit('businessPreview/setBusinessPanelShow', true)
      this.map_obj.clearMap()
      this.$refs.leftFilterBoard.getPieChartData(this.tempOrgId)
      // 组织是营业部级别 调换组织和商圈的层级（营业部层级点击商圈下钻，其他层级点击组织下钻）
      if (this.orgLevel === '2') {
        this.getMapBuinsessData(7, 6)
        this.getMapGroupData(5, 4)
        this.getGovBoundary()
      } else {
        this.getMapBuinsessData()
        this.getMapGroupData()
        this.getGovBoundary()
      }
    },
    /**
     * @description API获取地图数据-商圈形态数据
     * @param { object } params
     */
    async getMapBuinsessData(markerZIndex = 5, polygonZIndex = 4) {
      this.businessLoading = true
      this.polygon_business_arr = []
      this.border_business_arr = []
      this.name_business_arr = []
      this.type_business_arr = []
      // 初始化赋值
      this.$store.commit('businessPreview/setCurrentSwitchIndex', 0)
      this.$store.commit('businessPreview/setCurrentSwitchOpen', false)
      const params = {
        // orgId: '8875720570869309603',
        // programNo: '2021Q11364386856439263232'
        orgId: this.tempOrgId,
        programNo: this.proNumber,
        codes: '1,2'
      }
      let res = await BUSINESS_DISTRICT_API.get_preview_business_map_data(params)
      this.businessLoading = false
      // standardVo-商圈地图数据；count-商圈有多少个层级
      const { standardVo, count, orgName } = res
      this.$store.dispatch('map/setOrganizationName', orgName)
      if ((!standardVo) || standardVo.length === 0) return
      standardVo.forEach((itemLevel, index) => {
        let tempNameArr = []
        let tempTypeArr = []
        let tempBorderArr = []
        let tempPolygonArr = []
        if (itemLevel.businessList && itemLevel.businessList.length) {
          itemLevel.businessList.forEach(item => {
            if (this.orgLevel !== '-2' && this.orgLevel !== '-1' && this.orgLevel !== '0') {
              // 非全国/南北区层级 有名称/类型/边界/范围
              // 商圈名称marker
              const name_html_str = `<div class="businessName" title="${
                item.businessName
              }">${textEllipsis(item.businessName, 20)}</div>`
              if (item.businessLng && item.businessLat) { // 如果经纬度信息是null-会引发Marker报错
                let name_marker_obj = new AMap.Marker({
                  position: [item.businessLng, item.businessLat],
                  content: name_html_str,
                  offset: new AMap.Pixel(-75, -15),
                  // anchor: 'bottom-center',
                  zIndex: markerZIndex,
                  cursor: 'pointer'
                })
                tempNameArr.push(name_marker_obj)

                // 商圈类型marker
                const type_html_str = `<div class='businessName'>${item.businessType}</div>`
                let type_marker_obj = new AMap.Marker({
                  position: [item.businessLng, item.businessLat],
                  content: type_html_str,
                  offset: new AMap.Pixel(-75, -30),
                  // anchor: 'top-center',
                  zIndex: markerZIndex,
                  cursor: 'pointer'
                })
                tempTypeArr.push(type_marker_obj)
              }
              // 商圈边界polygon
              let border_geo_obj = new AMap.GeoJSON({
                geoJSON: JSON.parse(item.businessBounder),
                getPolygon: (geo_json, lng_lat) => {
                  let polygon_obj = new AMap.Polygon({
                    path: lng_lat,
                    zIndex: polygonZIndex,
                    strokeColor: '#000',
                    strokeOpacity: 1,
                    strokeWeight: 0.5,
                    fillColor: '#318FE9',
                    fillOpacity: 0,
                    bubble: true
                  })
                  return polygon_obj
                }
              })
              tempBorderArr.push(border_geo_obj)

              // 商圈范围polygon
              let polygon_geo_obj = new AMap.GeoJSON({
                geoJSON: JSON.parse(item.businessBounder),
                getPolygon: (geo_json, lng_lat) => {
                  let polygon_obj = new AMap.Polygon({
                    path: lng_lat,
                    zIndex: polygonZIndex,
                    strokeColor: '#318FE9',
                    strokeOpacity: 0,
                    strokeWeight: 0,
                    fillColor: item.businessColor
                      ? item.businessColor
                      : '#2E82CF',
                    // fillOpacity: 0.5,
                    fillOpacity: item.diaphaneity
                      ? Number(item.diaphaneity)
                      : 0.5,
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
              tempPolygonArr.push(polygon_geo_obj)
            } else if (index < 2) {
              // 如果是全国/南北区层级 只展示前两组数据（只有商圈范围）
              // 商圈范围polygon
              let polygon_geo_obj = new AMap.GeoJSON({
                geoJSON: JSON.parse(item.businessBounder),
                getPolygon: (geo_json, lng_lat) => {
                  let polygon_obj = new AMap.Polygon({
                    path: lng_lat,
                    zIndex: polygonZIndex,
                    strokeColor: '#318FE9',
                    strokeOpacity: 0,
                    strokeWeight: 0,
                    fillColor: item.businessColor
                      ? item.businessColor
                      : '#2E82CF',
                    // fillOpacity: 0.5,
                    fillOpacity: item.diaphaneity
                      ? Number(item.diaphaneity)
                      : 0.5,
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
              tempPolygonArr.push(polygon_geo_obj)
            }
          })
        }
        if (this.orgLevel !== '-2' && this.orgLevel !== '-1' && this.orgLevel !== '0') {
          // 名称marker处理
          const nameGroup = new AMap.OverlayGroup(tempNameArr)
          this.name_business_arr.push(tempNameArr.length ? nameGroup : '')
          this.map_obj.add(nameGroup)
          nameGroup.hide()
          // 类型marker处理
          const typeGroup = new AMap.OverlayGroup(tempTypeArr)
          this.type_business_arr.push(tempTypeArr.length ? typeGroup : '')
          this.map_obj.add(typeGroup)
          typeGroup.hide()
          // 边界polygon处理
          const borderGroup = new AMap.OverlayGroup(tempBorderArr)
          this.border_business_arr.push(tempBorderArr.length ? borderGroup : '')
          this.map_obj.add(borderGroup)
          // 范围polygon处理
          const polygonGroup = new AMap.OverlayGroup(tempPolygonArr)
          this.polygon_business_arr.push(tempPolygonArr.length ? polygonGroup : '')
          this.map_obj.add(polygonGroup)
        } else if (index < 2) {
          // 范围polygon处理
          const polygonGroup = new AMap.OverlayGroup(tempPolygonArr)
          this.polygon_business_arr.push(tempPolygonArr.length ? polygonGroup : '')
          this.map_obj.add(polygonGroup)
        }
      })
      // 如果商圈层级的数量 > 2 && 组织所在层级：非全国/南北区
      // （目的是做占位处理，后期switch开关打开后，通过接口拿数据）
      if (count && count > 2 && this.orgLevel !== '-2' && this.orgLevel !== '-1' && this.orgLevel !== '0') {
        for (let i = 2; i < count; i += 1) {
          this.name_business_arr.push('')
          this.type_business_arr.push('')
          this.border_business_arr.push('')
          this.polygon_business_arr.push('')
        }
      }
      setTimeout(() => {
        this.map_obj.setFitView()
      }, 1000)
    },
    /**
     * @description API获取地图数据-获取单一层级商圈的地图数据
     * @param { object } params
     * @param { object } tempIndex 默认为2 请求第三级商圈数据(0,1已经请求过数据)
     */
    async getsingleMapBuinsessData(tempIndex = 2, markerZIndex = 5, polygonZIndex = 4) {
      const params = {
        orgId: this.tempOrgId,
        programNo: this.proNumber,
        codes: String(tempIndex + 1)
      }
      let res = await BUSINESS_DISTRICT_API.get_preview_business_map_data(params)
      const { standardVo } = res
      if ((!standardVo) || standardVo.length === 0) return
      standardVo.forEach((itemLevel) => {
        let tempNameArr = []
        let tempTypeArr = []
        let tempBorderArr = []
        let tempPolygonArr = []
        if (itemLevel.businessList && itemLevel.businessList.length) {
          itemLevel.businessList.forEach(item => {
            if (this.orgLevel !== '-2' && this.orgLevel !== '-1' && this.orgLevel !== '0') {
              // 非全国/南北区层级 有名称/类型/边界/范围
              // 商圈名称marker
              const name_html_str = `<div class="businessName" title="${
                item.businessName
              }">${textEllipsis(item.businessName, 20)}</div>`
              if (item.businessLng && item.businessLat) { // 如果经纬度信息是null-会引发Marker报错
                let name_marker_obj = new AMap.Marker({
                  position: [item.businessLng, item.businessLat],
                  content: name_html_str,
                  offset: new AMap.Pixel(-75, -15),
                  // anchor: 'bottom-center',
                  zIndex: markerZIndex,
                  cursor: 'pointer'
                })
                tempNameArr.push(name_marker_obj)

                // 商圈类型marker
                const type_html_str = `<div class='businessName'>${item.businessType}</div>`
                let type_marker_obj = new AMap.Marker({
                  position: [item.businessLng, item.businessLat],
                  content: type_html_str,
                  offset: new AMap.Pixel(-75, -30),
                  // anchor: 'top-center',
                  zIndex: markerZIndex,
                  cursor: 'pointer'
                })
                tempTypeArr.push(type_marker_obj)
              }
              // 商圈边界polygon
              let border_geo_obj = new AMap.GeoJSON({
                geoJSON: JSON.parse(item.businessBounder),
                getPolygon: (geo_json, lng_lat) => {
                  let polygon_obj = new AMap.Polygon({
                    path: lng_lat,
                    zIndex: polygonZIndex,
                    strokeColor: '#000',
                    strokeOpacity: 1,
                    strokeWeight: 0.5,
                    fillColor: '#318FE9',
                    fillOpacity: 0,
                    bubble: true
                  })
                  return polygon_obj
                }
              })
              tempBorderArr.push(border_geo_obj)

              // 商圈范围polygon
              let polygon_geo_obj = new AMap.GeoJSON({
                geoJSON: JSON.parse(item.businessBounder),
                getPolygon: (geo_json, lng_lat) => {
                  let polygon_obj = new AMap.Polygon({
                    path: lng_lat,
                    zIndex: polygonZIndex,
                    strokeColor: '#318FE9',
                    strokeOpacity: 0,
                    strokeWeight: 0,
                    fillColor: item.businessColor
                      ? item.businessColor
                      : '#2E82CF',
                    // fillOpacity: 0.5,
                    fillOpacity: item.diaphaneity
                      ? Number(item.diaphaneity)
                      : 0.5,
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
              tempPolygonArr.push(polygon_geo_obj)
            }
          })
        }
        if (this.orgLevel !== '-2' && this.orgLevel !== '-1' && this.orgLevel !== '0') {
          // 名称marker处理
          const nameGroup = new AMap.OverlayGroup(tempNameArr)
          this.name_business_arr[tempIndex] = (tempNameArr.length ? nameGroup : '')
          this.map_obj.add(nameGroup)
          nameGroup.hide()
          // 类型marker处理
          const typeGroup = new AMap.OverlayGroup(tempTypeArr)
          this.type_business_arr[tempIndex] = (tempTypeArr.length ? typeGroup : '')
          this.map_obj.add(typeGroup)
          typeGroup.hide()
          // 边界polygon处理
          const borderGroup = new AMap.OverlayGroup(tempBorderArr)
          this.border_business_arr[tempIndex] = (tempBorderArr.length ? borderGroup : '')
          this.map_obj.add(borderGroup)
          // 范围polygon处理
          const polygonGroup = new AMap.OverlayGroup(tempPolygonArr)
          this.polygon_business_arr[tempIndex] = (tempPolygonArr.length ? polygonGroup : '')
          this.map_obj.add(polygonGroup)
        }
      })
    },
    /**
     * @description API获取地图数据-组织边界数据
     * @param { object } params
     */
    async getMapGroupData(markerZIndex = 7, polygonZIndex = 6) {
      this.orgLoading = true
      this.name_org_arr = []
      this.icon_org_arr = []
      this.polygon_org_arr = []
      const params = {
        // orgId: '7643457515882135184',
        // programNo: '2020Q11366994347283066880',
        // orgType: '-1'
        orgId: this.tempOrgId,
        programNo: this.proNumber,
        orgType: this.orgLevel
      }
      let res = await BUSINESS_DISTRICT_API.get_preview_org_map_data(params)
      this.orgLoading = false
      if (res.length === 0) return
      res.forEach(itemLevel => {
        let tempNameArr = []
        let tempIconArr = []
        let tempPolygonArr = []
        if (itemLevel.orgList && itemLevel.orgList.length) {
          itemLevel.orgList.forEach(item => {
            // 判断经纬度信息是否存在
            if (item && item.orgLng && item.orgLat) {
              // 名称marker
              const name_html_str = `<div class="numContent">商圈数：${this.formatterThousandSeperator(
                item.businessCount
              )}</div><div class='areaName'>${item.orgName}</div>`
              let name_marker_obj = new AMap.Marker({
                position: [item.orgLng, item.orgLat],
                content: name_html_str,
                offset: new AMap.Pixel(0, 0),
                anchor: 'bottom-center',
                zIndex: markerZIndex,
                cursor: 'pointer'
              })
              tempNameArr.push(name_marker_obj)

              // 图标marker
              let icon_html_str = ''
              if (item.icon) {
                icon_html_str = `<img class='markerStar' src='/img/selectIcon${item.icon}.png' />`
              } else {
                icon_html_str = `<img class='markerStar' src=${mapStar} />`
              }
              let icon_marker_obj = new AMap.Marker({
                position: [item.orgLng, item.orgLat],
                content: icon_html_str,
                offset: new AMap.Pixel(0, 0),
                anchor: 'bottom-center',
                zIndex: markerZIndex,
                cursor: 'pointer'
              })
              tempIconArr.push(icon_marker_obj)
            }

            // 判断边界信息是否存在
            if (item && item.orgBounder) {
              // polygon
              let polygon_geo_obj = new AMap.GeoJSON({
                geoJSON: JSON.parse(item.orgBounder),
                getPolygon: (geo_json, lng_lat) => {
                  let polygon_obj = new AMap.Polygon({
                    path: lng_lat,
                    zIndex: polygonZIndex,
                    strokeColor: item.orgColor ? item.orgColor : '#2E82CF',
                    strokeOpacity: 1,
                    strokeWeight: item.borderWidth ? item.borderWidth : 2,
                    fillColor: '#318FE9',
                    fillOpacity: 0,
                    bubble: true
                  })
                  // 绑定点击事件
                  polygon_obj.on('click', () => {
                    this.$store.dispatch('map/setOrganizationId', item.orgId)
                    this.$store.dispatch(
                      'map/setOrganizationName',
                      item.orgName
                    )
                    this.$store.commit(
                      'businessPreview/setOrgLevel',
                      item.orgType
                    )
                  })
                  // 此处必须返回当下的marker对象才能画出polygon
                  return polygon_obj
                }
              })
              tempPolygonArr.push(polygon_geo_obj)
            }
          })
        }
        // 默认只显示组织架构的名称和边界
        // 名称marker处理
        const nameGroup = new AMap.OverlayGroup(tempNameArr)
        this.name_org_arr.push(tempNameArr.length ? nameGroup : '')
        this.map_obj.add(nameGroup)
        // if (index > 0) nameGroup.hide()
        // 类型-图标icon处理
        const iconGroup = new AMap.OverlayGroup(tempIconArr)
        this.icon_org_arr.push(tempIconArr.length ? iconGroup : '')
        this.map_obj.add(iconGroup)
        iconGroup.hide()
        // 边界polygon处理
        const polygonGroup = new AMap.OverlayGroup(tempPolygonArr)
        this.polygon_org_arr.push(tempPolygonArr.length ? polygonGroup : '')
        this.map_obj.add(polygonGroup)
        // if (index > 0) polygonGroup.hide()
      })
      setTimeout(() => {
        this.map_obj.setFitView()
      }, 1000)
    },
    /**
     * @description API获取地图数据-行政边界
     * @param {string} org_id
     */
    async getGovBoundary() {
      this.regionLoading = true
      this.name_gov_arr = []
      this.polygon_gov_arr = []
      const params = {
        // 全国/南北区
        // orgId: '7643457515882135184',
        // programNo: '2021Q11364386856439263232',
        // orgType: '-1'
        // 行销公司
        // orgId: '8875720570869309603',
        // programNo: '2021Q11364386856439263232',
        // orgType: '1'
        // 营业部
        // orgId: '9150100912884398370',
        // programNo: '2021Q11364386856439263232',
        // orgType: '2'
        // params
        orgId: this.tempOrgId,
        programNo: this.proNumber,
        orgType: this.orgLevel
      }
      let res = await BUSINESS_DISTRICT_API.get_preview_region_map_data(params)
      this.regionLoading = false
      if (res.length === 0) return
      res.forEach((itemLevel) => {
        let tempNameArr = []
        let tempPolygonArr = []
        if (itemLevel && itemLevel.length) {
          itemLevel.forEach(item => {
            if (item && item.bounderLng && item.bounderLat) {
              // 名称name
              const name_html_str = `<div class='businessName' title="${item.bounderName}">${item.bounderName}</div>`
              let name_marker_obj = new AMap.Marker({
                position: [item.bounderLng, item.bounderLat],
                content: name_html_str,
                offset: new AMap.Pixel(0, 0),
                anchor: 'bottom-center',
                zIndex: 3,
                cursor: 'pointer'
              })
              tempNameArr.push(name_marker_obj)
            }
    
            if (item && item.bounder) {
              // 边界polygon
              let border_geo_obj = new AMap.GeoJSON({
                geoJSON: JSON.parse(item.bounder),
                getPolygon: (geo_json, lng_lat) => {
                  let polygon_obj = new AMap.Polygon({
                    path: lng_lat,
                    zIndex: 2,
                    strokeColor: '#000',
                    strokeOpacity: 1,
                    strokeWeight: 0.8,
                    fillColor: '#318FE9',
                    fillOpacity: 0,
                    bubble: true
                  })
                  return polygon_obj
                }
              })
              tempPolygonArr.push(border_geo_obj)
            }
          })
          // 名称marker处理
          const nameGroup = new AMap.OverlayGroup(tempNameArr)
          this.name_gov_arr.push(tempNameArr.length ? nameGroup : '')
          this.map_obj.add(nameGroup)
          nameGroup.hide()
    
          // 边界polygon处理
          const borderGroup = new AMap.OverlayGroup(tempPolygonArr)
          this.polygon_gov_arr.push(tempPolygonArr.length ? borderGroup : '')
          this.map_obj.add(borderGroup)
          borderGroup.hide()
        } else {
          this.name_gov_arr.push('')
          this.polygon_gov_arr.push('')
        }
      })
      setTimeout(() => {
        this.map_obj.setFitView()
      }, 1000)
    },
    /**
     * @description API获取地图数据-到达商圈层级的地图数据
     * @param {string} businessNo
     */
    async getBusinessLevelData() {
      this.$store.commit('businessPreview/setOrgLevel', '')
      this.$store.commit('businessPreview/setBusinessPanelShow', false)
      // 获取商圈基本信息 商圈地图数据
      let res = await Business_District_API.businessCircleDetail({
        businessNo: this.$store.state.businessPreview.businessNo
      })
      if (res.data) {
        const {
          gdBoundaryJson,
          orgId,
          orgName,
          lng,
          lat,
          businessName,
          levelEmployeeColor,
          levelLeaderColor,
          businessNo,
          diaphaneity
        } = res.data
        this.businessBaseInfo.orgId = orgId
        this.businessBaseInfo.orgName = orgName
        // businessNo放入chooseBusiness中，用作详情展示
        this.$store.commit('businessPreview/SET_CHOOSE_BUSINESS', businessNo)
        this.map_obj.clearMap()
        // 商圈名称marker
        const name_html_str = `<div class='businessName' title="${businessName}">${textEllipsis(
          businessName,
          20
        )}</div>`
        let name_marker_obj = new AMap.Marker({
          position: [lng, lat],
          content: name_html_str,
          offset: new AMap.Pixel(0, 0),
          anchor: 'bottom-center',
          zIndex: 3,
          cursor: 'pointer'
        })
        this.map_obj.add(name_marker_obj)

        let border_geo_obj = new AMap.GeoJSON({
          geoJSON: JSON.parse(gdBoundaryJson),
          getPolygon: (geo_json, lng_lat) => {
            let polygon_obj = new AMap.Polygon({
              path: lng_lat,
              zIndex: 2,
              strokeColor: '#000',
              strokeOpacity: 1,
              strokeWeight: 1,
              fillColor: levelEmployeeColor
                ? levelEmployeeColor
                : levelLeaderColor
                ? levelLeaderColor
                : 'blue',
              fillOpacity: diaphaneity ? Number(diaphaneity) : 0.5,
              bubble: true
            })
            return polygon_obj
          }
        })
        this.map_obj.add(border_geo_obj)
      }
    },
    /**
     * @description 异常商圈地图数据
     * @param {string} list
     */
    handleExceptionList(arr) {
      if (arr && arr.length) {
        const polygonGroup = new AMap.OverlayGroup(arr)
        this.exception_polygon_arr[0] = polygonGroup
        this.map_obj.add(polygonGroup)
        this.exception_polygon_arr[0].hide()
      } else {
        this.exception_polygon_arr = []
      }
    },
    /**
     * @description 千分位分割格式化
     */
    formatterThousandSeperator(num) {
      let res = ''
      if (num && num !== null) {
        res = num.toString().replace(/\d+/, function(n) {
          // 先提取整数部分
          return n.replace(/(\d)(?=(\d{3})+$)/g, function($1) {
            return $1 + ','
          })
        })
      } else {
        res = '-'
      }
      return res
    },
  }
}
</script>

<style lang="scss" scoped>
.business-preview-wrapper {
  position: relative;
  display: flex;
  width: 100%;
  color: #fff;
  flex-direction: row-reverse;
  div {
    box-sizing: border-box;
  }
}
</style>

<style lang="scss">
.mapPreviewContainer {
  .numContent {
    box-sizing: border-box;
    font-size: 12px;
    color: #ffffff;
    padding: 2px 4px;
    // background: #BF5CFF;
    background: rgba(191, 92, 255, 0.8);
    border-radius: 4px;
    // border: 1px solid #ffffff;
    // box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.7);
    white-space: nowrap;
    text-align: center;
    margin-bottom: 2px;
    opacity: 0.9;
  }
  .areaName {
    box-sizing: border-box;
    font-size: 14px;
    color: #000000;
    white-space: nowrap;
    text-align: center;
  }
  .businessName {
    box-sizing: border-box;
    font-size: 12px;
    color: #000000;
    text-align: center;
    width: 150px;
    // display: -webkit-box;
    // -webkit-box-orient: vertical;
    // -webkit-line-clamp: 2;
    // text-overflow: ellipsis;
    // overflow: hidden;
    // white-space: nowrap;
    // -webkit-text-stroke: 0.5px #000;
    // text-shadow: -1px 0px 0px #ffffff, 1px 0px 0px #ffffff, 0px -1px 0px #ffffff,
    // 0px 0px 0px #ffffff;
  }
  .show {
    opacity: 1;
  }
  .hide {
    opacity: 0;
  }
  .markerStar {
    box-sizing: border-box;
    display: block;
    width: 25px;
    height: 25px;
    margin-left: auto;
    margin-right: auto;
  }
  .markerImg {
    width: 25px;
    height: 25px;
  }
}
</style>
