<template>
  <div class="gaia-views-wrapper" id="business_exp_gaia_containers"
    v-loading.fullscreen.lock="fullscreenLoading || gaiascreenLoading || heatscreenLoading"
    element-loading-text="地图加载中……"
    element-loading-background="rgba(0, 0, 0, 0.7)"
  >
    <!--地图组件-->
    <Map
      ref="gaiaMapContainer"
      @sendMapObj="getMapObj"
      class="gaiaMapContainer"
    />
    <!--
			change:面板是否显示，changeRadio：问题门店过滤修改后回调，changeSelect：门店属性过滤修改后回调，requestData：画像的请求数据+地图请求数据等核心数据
			左侧过滤面板
		-->
    <LeftFilterBoard
      v-show="leftFilterBoardShow"
      @change="closeLeftFilterBoard"
      @changeSelect="changeSelect"
      @clearAllSelect="clearAllSelect"
      @switchShowExportTable="switchShowExportTable"
      @StoreGrouPortrait="StoreGrouPortrait"
      @getMapStoreData="getMapStoreData"
      :request-data="filter_obj"
    />
    <!--是否显示左上角的过滤面板小按钮-->
    <ShowUpPanel v-show="!leftFilterBoardShow" @change="openLeftFilterBoard" />
    <!--浮动：图例1-门店类型-->
    <LegendIconBoard />
    <!--浮动：图例2-控制面板，所有switch状态都会提升到此组件中-->
    <LegendCtrlBoard
      @isOpenRangeBoundary="isOpenRangeBoundary"
      @isOpenHeat="isOpenHeat"
      @isOpenSelfStore="isOpenSelfStore"
      @isOpenSingleRangeBoundary="isOpenSingleRangeBoundary"
      @activeBoundaryChanged="activeBoundaryChanged"
      :isOpenRangeBoundary="is_open_range_boundary"
      :isShowRangeBoundary="is_show_range_boundary"
      :isOpenHeat="is_open_heat"
      :isShowHeat="is_show_heat"
      :isOpenSelfStore="is_open_self_store"
      :isShowSingleRangeBoundary="is_show_single_range_boundary"
      :isOpenSingleRangeBoundary="is_open_single_range_boundary"
      :activeBoundaryIndex="active_boundary_index"
    />
    <!--浮动：门店导出-->
    <ExportTable
      @switchShowExportTable="switchShowExportTable"
      :active-boundary-index="active_boundary_index"
      :is-show-export-table="is_show_export_table"
    />
    <!--浮动：门店详情-->
    <StoreDetailBoard
      ref="store_detail_board_comp"
      :store-id="store_id"
      :is-show-board="is_show_store_detail"
      :other-info="current_store_info"
      @closeStoreDetailBoard="closeStoreDetailBoard"
      @showChangeLocationFlag="changeLocation"
    />
    <!--地图修改门店位置按钮-->
    <!-- <div class="editButton" :style="{'top': top_val, 'left': left_val}" v-show="is_show_edit_button" @click="changeLocation" >修改位置</div> -->
    <!--地图修改门店位置结束按钮-->
    <!-- <div
      class="finishEditButton"
      :style="{ top: end_top_val, left: end_left_val }"
      v-show="is_show_end_edit_button"
    >
      <div class="submitButton" @click="submitLocation">确定地址</div>
      <div class="goBackButton" @click="goBack">取消</div>
    </div> -->
    <!--拖拽后的地址信息提示-->
    <!-- <div class="addressTips" v-show="current_address_str">
      {{ current_address_str }}
    </div> -->
    <!--上传修改门店   v-auth='"navigation:sell:uploadlg"'  -->
    <!-- <div
      class="uploadModifiedStoresContainer"
      v-auth="'navigation:sell:uploadlg'"
    >
      上传修改门店
      <input
        type="file"
        class="uploadButton"
        name="upload_button"
        @change="uploadModifiedStores($event)"
      />
    </div> -->
  </div>
</template>

<script>
/*---------------------导入组件---------------------*/
import Vue from 'vue';
const Loca = window.Loca;
Vue.use(Loca)
// 导入商机导航地图组件
import Map from '@/components/Map'
// 导入左侧过滤器控制面板
import LeftFilterBoard from './LeftFilterBoard' // 展开
import ShowUpPanel from './showUp' // 收起
// 导入店铺详情
import StoreDetailBoard from './StoreDetailBoard'
// 导入店铺图例面板
import LegendIconBoard from './LegendIconBoard'
// 导入地图图例面板
import LegendCtrlBoard from './LegendCtrlBoard'
// 导入数据表格组件
import ExportTable from './ExportTable'
/*---------------------导入商机导航接口API---------------------*/
// import BUSINESS_NAVIGATION_API from '../../../../api/business_navigate_api'
import BUSINESS_EXP_API from '../../../../api/business-expansion_api'
/*---------------------导入假数据---------------------*/
// import heatmapData from '@/assets/js/fakeheatmapData'
import { AMap, AMapUI } from '@/plugins/AMap'
/*---------------------导入缺省图标和拖拽小旗子---------------------*/
import mapStar from '@/assets/img/map_star.png'
import newLocationIcon from '@/assets/img/new_location_icon.png'
import oldLocationIcon from '@/assets/img/old_location_icon.png'
export default {
  data() {
    return {
      fullscreenLoading: false,
      gaiascreenLoading: false,
      heatscreenLoading: false,
      // 左侧过滤面板是否显示
      leftFilterBoardShow: true,
      // orgId(可能是全局的)
      org_id: '',
      // 查询地图数据参数,问题门店筛选时，0代表过滤，空字符串意味着没有打开过滤*/
      filter_obj: {
        // 组织ids
        orgArray: [],
        // 行政codes
        regionCodes: [],
        // 行政/组织(1:行政边界 2:组织边界)
        latitude: 1,
        // 是否是自有门店(1:自有门店 0:非自有门店 )
        ownStore: 0,
        // orgId: '',
        /* ---门店属性--- */
        // 门店类型（需要接口支持）默认为全部
        storeCategory: '',
        // 周围环境POI（需要接口支持）,默认为全部
        storePoiCode: '',
        // 人流量
        peopleStream: [],
        // 交通便利
        transportation: [],
        // 消费力指数
        consumption: [],
        // 门店密集程度
        storeDensity: [],
        // 房价
        housePrice: [],
        // 售点拓展三期，接口专用：合并以上五个字段
        modelTags: [],
        // uniStore
        uniStore: [],
        //是展示店群画像
        geneRated: true
      },
      // 当前的组织/行政id，通过这个变量来防止下钻后再次触发地图接口
      current_org_reg_id: '',
      // 路由参数副本，用来改变路由query值
      route_query: '',
      // 地图实例
      map_obj: '',
      // 店铺id，将传递给店铺详情面板 StoreDetailBoard
      store_id: '',
      // 店铺详情面板是否显示，将传递给店铺详情面板 StoreDetailBoard
      is_show_store_detail: false,
      // 是否显示导出table浮层
      is_show_export_table: false,
      // 非最后所层级对应的点数据
      marker_source_arr: [],
      // 海量点markers(暂时只对最后所级别有用)？
      marker_arr: [],
      // 海量点marker样式，和点一一对应(只对最后所级别有用)
      marker_style_arr: [],
      // massMarker对象(只对最后所级别有用)
      mass_markers_obj: '',
      // 自有门店 最底层级对应的massMarker对象
      self_mass_markers_obj: '',
      // 地图组织边界polygon对象数组
      polygon_org_arr: [],
      // 地图组织边界polygon对象元数据数组
      polygon_org_source_arr: [],
      // 地图行政边界polygon对象数组
      polygon_gov_arr: [],
      // 地图行政边界polygon对象元数据数组
      polygon_gov_source_arr: [],
      // 店铺的辐射范围polygon对象数据
      polygon_stores_range_arr: [],
      // 是否显示拖拽结束后确定按钮
      is_show_end_edit_button: false,
      // 拖拽按钮相对偏移量，因为按钮不在map内部，所以定位相对值为整个页面，所以要加上这个偏移值，306值为左侧过滤面板宽（340）减去拖拽按钮一半宽度（34）
      offset_left: 306,
      // 拖拽后按钮相对偏移量，原因如上，306值为左侧过滤面板宽（340）减去拖拽按钮一半宽度（80）
      offset_end_left: 260,
      // 拖拽按钮距离顶部地图容器px值
      top_val: '',
      // 拖拽按钮距离左侧地图容器px值
      left_val: '',
      // 拖拽结束确认按钮距离顶部地图容器px值
      end_top_val: '',
      // 拖拽结束确认按钮距离左侧地图容器px值
      end_left_val: '',
      // 可拖拽的小红旗子对象
      position_picker: '',
      // 要拖拽的店铺的经纬度对象
      marker_lnglat: '',
      // 拖拽后的经纬度对象
      end_position_lnglat: '',
      // 蓝色小旗子marker
      marker_settled_obj: '',
      // 当前拖拽后当前地理位置字符串
      current_address_str: '',
      // 当前被拖拽的店铺id
      current_store_id: '',
      // 当前被触发的店铺辐射范围
      current_store_polygon: '',
      // 当前被触发的店铺的详情数据（不包括echarts折线图）
      current_store_info: '',
      // 是否显示辐射范围开关[暂时保留此功能，先隐藏]
      is_show_range_boundary: false,
      // 是否打开辐射范围
      is_open_range_boundary: false,
      // 是否显示单个店铺辐射范围
      is_show_single_range_boundary: false,
      // 是否打开单个店铺辐射范围
      is_open_single_range_boundary: false,
      // 是否显示热力图
      is_show_heat: true,
      // 是否清除了热力图地图数据
      isClearHeatMap: true,
      // 是否打开热力
      is_open_heat: false,
      // 热力对象
      heat_map_obj: '',
      // 二阶数据GEOJson
      level_tow_geo_obj: '',
      // 二阶辐射范围
      level_tow_range_obj: '',
      // 二阶辐射范围距离打点
      distance_marker_array: [],
      // 聚合对象
      cluster_obj: '',
      // 高亮对象
      highlight_marker: '',
      // 店铺详情board面板dom
      store_detail_board_dom: '',
      // 店铺详情board面板窗口
      store_detail_board_info_window: '',
      // 自有门店地图对象[网格热力/普通热力]
      self_store_map_obj: '',
      self_store_map_arr: [],
      // 是否清除了自由门店地图数据
      isClearSelfStoreMap: true,
      is_open_self_store: false,
      active_boundary_index: 0, // 默认展示行政边界
      repeatPopout:null,
      heatTimer: '', // 人口热力图-防止地图move事件频繁触发接口
      storeTimer: '', // 自由门店-防止地图move事件频繁触发接口
      isLastLevel: false, //是否最底层级
      repeatArr: [],
      // 声明flag：假定最后的层级不存在边界（最后到所，是可能出现无边界情况，防止店铺计数不准）
      last_area_has_boundary: false,
      // 最后层级的渲染模式：海量点/聚合点
      render_model: 'clusterer',
      // 最后层级的gaia门店数
      marker_arr_length_gaia: '',
      preZoom: '', // 地图缩放之前的zoom值
      preCenter: '', // 地图移动之前center值
    }
  },
  computed: {
    // 右上角全局搜索的orgId
    search_org_id() {
      return this.$store.state.map.organizationId
    },
    // 右上角全局搜索的orgId
    administration_id() {
      return this.$store.state.map.administrationId
    },
    // 当前地图zoom值
    currentZoom() {
      return this.map_obj ? this.map_obj.getZoom() : ''
    },
    currentCenter() {
      return this.map_obj ? this.map_obj.getCenter() : ''
    }
  },
  components: {
    Map,
    LeftFilterBoard,
    StoreDetailBoard,
    LegendIconBoard,
    LegendCtrlBoard,
    ShowUpPanel,
    ExportTable
  },
  beforeDestroy() {
    // 离开页面session清空
    sessionStorage.setItem('organizationName', '')
    sessionStorage.setItem('administrationName', '')
  },
  watch: {
    // 监听右上角全局搜索后的orgId是否发生变化 
    search_org_id(new_org_id) {
      if(this.current_org_reg_id !== new_org_id) {
        this.filter_obj.orgArray = []
        this.filter_obj.orgArray.push(new_org_id)
        this.updateRouteQuery()
      }
    },
    administration_id(new_region_id) {
      if(this.current_org_reg_id !== new_region_id) {
        this.filter_obj.regionCodes = []
        this.filter_obj.regionCodes.push(new_region_id)
        this.updateRouteQuery()
      }
    },
    currentZoom(val, oldVal) {
      this.preZoom = oldVal
    },
  },
  created() {
    // 当前是gaia门店的标记
    this.$store.dispatch('map/setSearchType', ['map', 'org', 'gaia_store'])
  },
  mounted() {
    // 初始化路由参数，并初始化左侧面板和地图数据
    this.initFilterObj(this.$route.query)
    // 隐藏搜索和测距
    this.$store.dispatch('map/setMapOperation', 'mapType')
    this.$store.dispatch('map/setMapSearchIcon', true)
  },
  methods: {
    /**
     * @description 获取路由query参数，初始化左侧过滤面板，注意这里从路由拿数据都是字符串，如果是'1,2,3'结构需要转换为数值数组
     * @param {object} route_query url上的路由query参数
     */
    initFilterObj(route_query) {
      // 第一次进来。行政/组织都没有
      if(!route_query.regionCodes && !route_query.orgArray) {
        // 初始化"中华人民共和国"
        this.filter_obj.regionCodes = ['010000']
        this.filter_obj.latitude = 1
        this.active_boundary_index = 0
        // 显示行政树
        this.$store.dispatch('map/setMapAdministration', true)
        // 隐藏组织树
        this.$store.dispatch('map/setMapOrganization', false)
      }

      // 获取行政：首先从路由query获取参数，如果没有（没有就说明是第一次进入）从则从session（登陆者信息）取
      if (route_query.regionCodes && !route_query.orgArray) {
        this.filter_obj.regionCodes = route_query.regionCodes.split(',')
        this.filter_obj.latitude = 1
        this.active_boundary_index = 0
        // 显示行政树
        this.$store.dispatch('map/setMapAdministration', true)
        // 隐藏组织树
        this.$store.dispatch('map/setMapOrganization', false)
      }


      // 获取组织： 首先从路由query获取参数，如果没有（没有就说明是第一次进入）从则从session（登陆者信息）取
      if (route_query.orgArray && !route_query.regionCodes) {
        this.filter_obj.orgArray = route_query.orgArray.split(',')
        this.filter_obj.latitude = 2
        this.active_boundary_index = 1
        // 隐藏行政树
        this.$store.dispatch('map/setMapAdministration', false)
        // 显示组织树
        this.$store.dispatch('map/setMapOrganization', true)
      }

      // 如果刷新进来，行政regionCodes和组织orgArray都存在，则判断latitude的值，让右上角展示组织或行政
      if (route_query.orgArray && route_query.regionCodes) {
        this.filter_obj.orgArray = route_query.orgArray.split(',')
        this.filter_obj.latitude = Number(route_query.latitude)
        if (this.filter_obj.latitude === 1) { // 行政
          this.active_boundary_index = 0
          this.$store.dispatch('map/setMapAdministration', true)
          this.$store.dispatch('map/setMapOrganization', false)
        } else { // 组织
          this.active_boundary_index = 1
          this.$store.dispatch('map/setMapAdministration', false)
          this.$store.dispatch('map/setMapOrganization', true)
        }
      }

      // 属性字段
      this.filter_obj.storeCategory = route_query.storeCategory
        ? route_query.storeCategory.split(',')
        : []
      this.filter_obj.storePoiCode = route_query.storePoiCode ? route_query.storePoiCode.split(',') : []
      this.filter_obj.peopleStream = route_query.peopleStream
        ? route_query.peopleStream.split(',').map(Number)
        : []
      this.filter_obj.transportation = route_query.transportation
        ? route_query.transportation.split(',').map(Number)
        : []
      this.filter_obj.consumption = route_query.consumption
        ? route_query.consumption.split(',').map(Number)
        : []
      this.filter_obj.storeDensity = route_query.storeDensity
        ? route_query.storeDensity.split(',').map(Number)
        : []
      this.filter_obj.housePrice = route_query.housePrice
        ? route_query.housePrice.split(',').map(Number)
        : []
      this.filter_obj.uniStore = route_query.uniStore
        ? route_query.uniStore.split(',').map(Number)
        : []
      this.filter_obj.modelTags = [
        ...this.filter_obj.peopleStream,
        ...this.filter_obj.transportation,
        ...this.filter_obj.consumption,
        ...this.filter_obj.storeDensity,
        ...this.filter_obj.housePrice
      ]
      // 初始化地图所有参数（因为第一次进入页面可能缺少某些参数），复制一个副本
      // this.route_query = JSON.parse(JSON.stringify(this.filter_obj))
      // this.route_query.storeCategory = this.route_query.storeCategory.join()
      // this.route_query.storePoiCode = this.route_query.storePoiCode.join()
      // this.route_query.peopleStream = this.route_query.peopleStream.join()
      // this.route_query.transportation = this.route_query.transportation.join()
      // this.route_query.consumption = this.route_query.consumption.join()
      // this.route_query.storeDensity = this.route_query.storeDensity.join()
      // this.route_query.housePrice = this.route_query.housePrice.join()
      // this.route_query.modelTags = this.route_query.modelTags.join()
      // this.route_query.uniStore = this.route_query.uniStore.join()
    },

    /**
     * @description 从Map组件获取地图对象
     * @params { object } map_obj
     */
    getMapObj(map_obj) {
      this.map_obj = map_obj
    },
    /**
     * @description API获取地图数据（区域 || 店铺）
     * @param { object } params 左侧面板的过滤参数，其中包括orgId，所有数组参数要转化为 '1,2,3' 结构
     * @param { boolean } is_update_location 是否来源于更新店铺地址，如果是则不要自动缩放地图适配
     */
    async getMapStoreData(params, is_update_location) {
      this.fullscreenLoading = true
      let res = await BUSINESS_EXP_API.post_map_data(params)
      
      // 需要添加默认的行政边界tag标记-用于地图右上角的树形切换
      // 添加当前组织 orgName 到右上角的搜索模块以显示
      // 如果是获取行政
      if(params.latitude === 1) {
        this.current_org_reg_id = this.filter_obj.regionCodes[0]
        this.$store.dispatch('map/setAdministrationId', this.filter_obj.regionCodes[0])
        if(res.extData && res.extData.orgName) {
          this.$store.dispatch('map/setAdministrationName', res.extData.orgName)
					this.$store.dispatch('map/setAdministrationType', res.extData.type)
					this.$store.dispatch('map/setAdministrationParentId', res.extData.parentId)
        }
      } else {
        this.current_org_reg_id = this.filter_obj.orgArray[0]
        // 如果是获取组织
        this.$store.dispatch('map/setOrganizationId', this.filter_obj.orgArray[0])
        if(res.extData && res.extData.orgName) {
          this.$store.dispatch('map/setOrganizationName', res.extData.orgName)
        }
        
      }
      // this.$store.dispatch('map/setSearchType', ['map', 'org'])
      if (res.data) {
        // 清空地图所有标记
        this.map_obj.clearMap()
        // 清空原来的聚合点
        if (this.cluster_obj) {
          this.cluster_obj.clearMarkers()
        }
        // 如果有海量massMarker则清空，因为上面的方法无法清空！
        if (this.mass_markers_obj) {
          this.mass_markers_obj.clear()
        }
        // 自有门店最底层级的massMarker清空
        // if (this.self_mass_markers_obj) {
        //   this.self_mass_markers_obj.clear()
        // }
        // 自有门店开关对应的网格热力数据清空
        // if (this.is_open_self_store) {
        //   // if (this.self_store_map_obj) {
        //   //   this.self_store_map_obj.setMap(null)
        //   // }
        //   if (this.self_store_map_arr.length) {
        //     this.self_store_map_arr.forEach(item => {
        //       item.setMap(null)
        //     })
        //   }
        //   if (this.self_mass_markers_obj) {
        //     this.self_mass_markers_obj.clear()
        //   }
        //   this.getSelfStoreMap()
        // } else {
        //   this.isClearSelfStoreMap = true
        // }
        // 每次都要初始化清空所有数据
        this.marker_arr = null
        this.marker_arr = []
        this.marker_style_arr = null
        this.marker_style_arr = []
        // 非最后层级元数据（可能后期增加数量和覆盖率切换功能）
        this.marker_source_arr = null
        this.marker_source_arr = []
        // 非最后所层级的"组织边界"polygon
        this.polygon_org_arr = null
        this.polygon_org_arr = []
        // 非最后所层级的"组织边界"polygon元数据（可能后期增加数量和覆盖率切换功能）
        this.polygon_org_source_arr = null
        this.polygon_org_source_arr = []
        // "行政边界"polygon
        this.polygon_gov_arr = null
        this.polygon_gov_arr = []
        // '店铺辐射范围'polygon
        this.polygon_stores_range_arr = null
        this.polygon_stores_range_arr = []
        // 初始化控制面板所有参数(打开行政边界)
        // this.active_boundary_index = 0
        // 如果打开了行政边界，则调用接口，因为前面已经清空地图了
        // if (this.active_boundary_index === 0) {
        //   this.getGovBoundary()
        // }
        // 如果是最后一个所层级（leafNode:true）,则对所有点以massMarker处理，否则则认为是所以上层级用GEOJson处理
        if (res.extData.leafNode) {
          console.log('进入最后层级！')
          // 显示辐射范围按钮
          // this.is_show_range_boundary = true
          // 如果已经打开了辐射范围按钮
          // if (this.is_open_range_boundary) {
          //   // 调用接口
          //   this.getStoresRangeBoundary(params)
          // }
          // 显示热力图按钮
          // this.is_show_heat = true
          // // 如果已经打开了热力图按钮
          // if (this.is_open_heat) {
          //   // 如果已经存在热力图对象了，则清空旧热力图，后面setDataSet只会添加热力图数据
          //   if (this.heat_map_obj) {
          //     this.heat_map_obj.setMap(null)
          //   }
          //   this.getHeatMap()
          // }
          // 将原数据字符串转化为对象数组，注意：只有最后一个是polygon其它都为marker
          let data_list
          if(res.data && res.data[0]) {
            data_list = res.data[0].bounder.features
            // // ************************模拟重合点假数据************************
            // data_list[0].properties.repeatPoint = [data_list[1],data_list[2],data_list[3]]
            // 初始化长度
            let length = data_list.length
            // 初始化所边界polygon(一般情况下最后一个就是边界，但是可能出现没有边界的情况所以需要判断)
            if(data_list[length - 1].geometry.type !== 'Point') {
              // 修改flag
              this.last_area_has_boundary = true
              let polygon_obj = new AMap.Polygon({
                path: data_list[length - 1].geometry.coordinates,
                zIndex: 2,
                strokeColor: res.data[0].borderColor ? res.data[0].borderColor : '#A634EF',
                strokeOpacity: res.data[0].borderColorOpacity ? res.data[0].borderColorOpacity / 100
                  : 1,
                strokeWeight: res.data[0].borderWidth ? res.data[0].borderWidth : 2,
                fillColor: res.data[0].color ? res.data[0].color : '#5CADFF',
                // fillOpacity: res.data[0].opacity ? res.data[0].opacity / 100 : 0.4,
                fillOpacity: 0.2,
                bubble: true
              })
              // 绘制最后所边界
              polygon_obj.setMap(this.map_obj)
            }
            this.getlastLayerPoint(data_list)
          }
        }
        // 如果是"所"以上层级，对每一个polygon进行遍历
        else {
          console.log('非最后层级')
          // 不显示辐射范围按钮
          this.is_show_range_boundary = false
          // 关闭辐射范围按钮
          this.is_open_range_boundary = false
          // 不显示热力图按钮
          // this.is_show_heat = false
          // 关闭热力图按钮
          // this.is_open_heat = falses
          // 如果已经存在热力图对象了，则隐藏
          // if (this.heat_map_obj) {
          //   this.heat_map_obj.hide()
          // }
          let html_str = ''
          res.data.forEach((item) => {
            // 实例化每一个polygon对应的marker
            // let num = '1'
            // str = '/img/selectIcon${item.icon}.png' ${mapStar}
            if (item.icon) {
              html_str = `<div class="numContent">客户数：${this.formatterThousandSeperator(
                item.storeNum
              )}</div><div class='areaName'>${
                item.orgName
              }</div><img class='markerStar' src='/img/selectIcon${
                item.icon
              }.png' />`
            } else {
              html_str = `<div class="numContent">客户数：${this.formatterThousandSeperator(
                item.storeNum
              )}</div><div class='areaName'>${
                item.orgName
              }</div><img class='markerStar' src=${mapStar} />`
            }
            let marker_obj = new AMap.Marker({
              position: item.orgLocation.split(','),
              content: html_str,
              offset: new AMap.Pixel(0, 0),
              anchor: 'bottom-center',
              zIndex: 3,
              cursor: 'pointer'
            })
            // 绑定marker点击事件，下钻
            marker_obj.on('click', () => {
              // 提交到vuex修改为行政id，然后触发监听
              if(params.latitude === 1) {
                this.$store.dispatch('map/setAdministrationId', item.orgId)
              } else {
              // 提交到vuex修改为组织id，然后触发监听
                this.$store.dispatch('map/setOrganizationId', item.orgId)
              }
            })
            // 将marker添加到地图
            marker_obj.setMap(this.map_obj)
            let polygon_geo_obj = new AMap.GeoJSON({
              geoJSON: item.bounder,
              getPolygon: (geo_json, lng_lat) => {
                let polygon_obj = new AMap.Polygon({
                  path: lng_lat,
                  zIndex: 2,
                  strokeColor: item.borderColor ? item.borderColor : '#2E82CF',
                  strokeOpacity: item.borderColorOpacity
                    ? item.borderColorOpacity / 100
                    : 1,
                  strokeWeight: item.borderWidth ? item.borderWidth : 2,
                  fillColor: item.color ? item.color : '#318FE9',
                  // fillOpacity: item.opacity ? item.opacity / 100 : 0.7,
                  fillOpacity: 0.2,
                  bubble: true
                })
                this.polygon_org_arr.push(polygon_obj)
                this.polygon_org_source_arr.push(item)
                return polygon_obj
              }
            })
            // 将polygon添加到地图
            polygon_geo_obj.setMap(this.map_obj)
            // ---默认隐藏组织边界polygon 只显示行政边界---
            // polygon_geo_obj.hide()
          })
        }
        // 自适应覆盖物缩放层级
        if (!is_update_location) {
          this.map_obj.setFitView()
          setTimeout(() => {
            // this.fullscreenLoading = false
            // 门店覆盖处理放在此处 防止重复请求
            if (this.is_open_self_store) {
              this.isClearSelfStoreMap = false
              this.getSelfStoreMap()
            } else {
              this.isClearSelfStoreMap = true
              if (this.self_store_map_arr.length) {
                this.self_store_map_arr.forEach(item => {
                  item.setMap(null)
                })
              }
              if (this.self_mass_markers_obj) {
                this.self_mass_markers_obj.clear()
              }
            }
          }, 1000)
        } else {
          // this.fullscreenLoading = false
          // 门店覆盖处理放在此处 防止重复请求
          if (this.is_open_self_store) {
            this.isClearSelfStoreMap = false
            this.getSelfStoreMap()
          } else {
            this.isClearSelfStoreMap = true
            if (this.self_store_map_arr.length) {
              this.self_store_map_arr.forEach(item => {
                item.setMap(null)
              })
            }
            if (this.self_mass_markers_obj) {
              this.self_mass_markers_obj.clear()
            }
          }
        }
      }
      this.fullscreenLoading = false
    },
    // 
    // type: 默认gaia，自由门店开关打开后 传 self
    /**
     * @description 渲染最后层级，聚合处理 or 海量点处理
     * @param { Array } markers_array 所有点的数据
     * @param { string } type 门店类型：自有-self or GAIA门店-gaia
     * @param { string } render_model 渲染模式 聚合处理(clusterer) or 海量点处理(mass)
     */
    getlastLayerPoint(data_list, type= 'gaia', render_model= 'clusterer'){
      // // ************************模拟重合点假数据************************
      // data_list[0].properties.repeatPoint = [data_list[1],data_list[2],data_list[3]]
      // 初始化长度
      let length = data_list.length
      // 如果有边界，所有点的个数为-1（在data_list中最后一个默认为边界，但也可能没有）
      if(this.last_area_has_boundary && type === 'gaia') {
        length -= 1
        this.marker_arr_length_gaia = length
      }
      // 所有点元数据
      let markerArr = []
      // 所有点的样式（massmarker才会用）
      let markerStyleArr = []

      if (type === 'self') {
        for (let i = 0; i < length; i++) {
          // this.marker_arr.push({
          // 判断properties为null的情况
          if (data_list[i] && data_list[i].properties && data_list[i].properties.storeId && data_list[i].properties.typeIcon) {
            markerArr.push({
              lnglat: data_list[i].geometry.coordinates,
              storeId: data_list[i].properties.storeId,
              style: i
            })
            markerStyleArr.push({
              url: data_list[i].properties.typeIcon,
              size: new AMap.Size(25, 25),
              // 必须填写：此处有巨坑：千万别用字符串如bottom-center，否则无法绘制；也不要用负值，否则无法绑定事件
              anchor: new AMap.Pixel(12.5, 12.5)
            })
          }
        }
        this.self_mass_markers_obj = new AMap.MassMarks(markerArr, {
          // 此处之所以是111，因为GEOJson绘制的最后的所边界zIndex为110，应该是地图机制，上边设置的zIndex无效了
          zIndex: 111,
          cursor: 'pointer',
          style: markerStyleArr
        })
        // 绘制海量点
        this.self_mass_markers_obj.setMap(this.map_obj)
        // 如果自有门店开关是打开状态
        if (this.is_open_self_store) {
          this.self_mass_markers_obj.show()
        } else { // 如果自有门店开关是关闭状态
          this.self_mass_markers_obj.hide()
        }
      } else {
        if(render_model === 'mass') {
          for (let i = 0; i < length; i++) {
            // this.marker_arr.push({
            markerArr.push({
              lnglat: data_list[i].geometry.coordinates,
              storeId: data_list[i].properties.storeId,
              style: i
            })
            markerStyleArr.push({
              url: data_list[i].properties.typeIcon,
              size: new AMap.Size(25, 25),
              // 必须填写：此处有巨坑：千万别用字符串如bottom-center，否则无法绘制；也不要用负值，否则无法绑定事件
              anchor: new AMap.Pixel(12.5, 12.5)
            })
          }
          // this.mass_markers_obj = new AMap.MassMarks(this.marker_arr, {
          this.mass_markers_obj = new AMap.MassMarks(markerArr, {
            // 此处之所以是111，因为GEOJson绘制的最后的所边界zIndex为110，应该是地图机制，上边设置的zIndex无效了
            zIndex: 111,
            cursor: 'pointer',
            style: markerStyleArr
          })
          // 绘制海量点
          this.mass_markers_obj.setMap(this.map_obj)
        } else {
          for (let i = 0; i < length; i++) {
            markerArr.push(new AMap.Marker({
              position: data_list[i].geometry.coordinates,
              zIndex: 199,
              anchor: 'center',
              offset: new AMap.Pixel(0,0),
              icon: new AMap.Icon({
                image: data_list[i].properties.typeIcon,
                size: new AMap.Size(25,25),
                imageSize: new AMap.Size(25,25)
              }),
              extData: data_list[i]
            }))
          }
          this.cluster_obj = new AMap.MarkerClusterer(this.map_obj, markerArr, {maxZoom: 16, gridSize: 280, minClusterSize: 1, renderClusterMarker: this.clustererStyle})
          // 绘制聚合
          this.cluster_obj.setMap(this.map_obj)
        }
      }

      // 绘制重合点
      let repeatArr = []
      let repeatPointList = data_list.filter(item=> item.properties && item.properties.repeatPoint)
      if(repeatPointList.length>0) {
        repeatPointList.forEach(repeatiem=>{
          // 创建重合点纯文本标记
          var repeaTtext = new AMap.Text({
              text: repeatiem.properties.repeatPoint.length,
              anchor:'center', // 设置文本标记锚点
              draggable:false,
              zIndex: 100,
              angle:0,
              style:{
                  'background-color': 'rgba(0,0,0,0.7)',
                  'width': '18px',
                  'height': '18px',
                  'line-height': '18px',
                  'text-align': 'center',
                  'font-size': '6px',
                  'color': '#FFFFFF',
                  'margin':'0',
                  'padding':'0',
                  'border-radius': '18px',
                  'border': '1px solid #FFFFFF',
              },
              position: repeatiem.geometry.coordinates,
              offset: new AMap.Pixel(10,-10),
              topWhenClick: true,
              extData: repeatiem.properties
          });
          repeatArr.push({repeaTtext,lanlet:repeatiem.geometry.coordinates})
        })
      }
      this.repeatArr = repeatArr
      // 点击点位
      this.clickRepeat(repeatArr)
      if (type === 'self') {
        // 如果gaia门店 重合点数据 和 自有门店 重合点数据 ***待联调
        // this.repeatArr = this.repeatArr.concat(repeatArr)
        this.self_mass_markers_obj.on('click', (marker_info) => {
          this.getDetail(marker_info)
        })
      } else {
        if(render_model === 'mass') {
          this.mass_markers_obj.on('click', (marker_info) => {
            this.getDetail(marker_info)
          })
        } else {
          markerArr.forEach(item => {
            item.on('click', (marker_info) => {
              this.getDetail(marker_info)
            })
          })
        }
      }
    },

    clustererStyle(context) {
        let factor = Math.pow(context.count / this.marker_arr_length_gaia, 1 / 18);
        let div = document.createElement('div');
        let Hue = 180 - factor * 180;
        let bgColor = 'hsla(' + Hue + ',100%,50%,0.7)';
        // let fontColor = 'hsla(' + Hue + ',100%,20%,1)';
        let borderColor = 'hsla(' + Hue + ',100%,40%,1)';
        let shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
        div.style.backgroundColor = bgColor;
        let size = Math.round(30 + Math.pow(context.count / this.marker_arr_length_gaia, 1 / 5) * 20);
        div.style.width = div.style.height = size + 'px';
        div.style.border = 'solid 1px ' + borderColor;
        div.style.borderRadius = size / 2 + 'px';
        div.style.boxShadow = '0 0 1px ' + shadowColor;
        div.innerHTML = context.count;
        div.style.lineHeight = size + 'px';
        div.style.color = '#ffffff';
        div.style.fontSize = '14px';
        div.style.textAlign = 'center';
        context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
        context.marker.setContent(div)
    },

    // 弹出门店详情
    getDetail(marker_info){
      // 不是重合点隐藏重合点弹框
      if(marker_info.type) {
        if(this.repeatPopout) {
          this.map_obj.remove(this.repeatPopout)
          this.hideRepeatBorder()
        }
      }
      // 如果渲染方式是聚合，获取其核心字段：经纬度，storeId
      let this_lng_lat = ''
      let this_store_id = ''
      if(this.render_model === 'clusterer') {
        this_lng_lat = marker_info.target.getPosition()
        this_store_id = marker_info.target.getExtData().properties.storeId
      } else {
        this_lng_lat = marker_info.data.lnglat
        this_store_id = marker_info.data.storeId
      }
      // 绘制高亮点，如果点击新店
      if (this_store_id !==this.storeId) {
        // 如果已经存在高亮对象，隐藏
        if(this.highlight_marker){
          this.highlight_marker.hide()
        }
        this.highlight_marker = new AMap.Marker({
          position: this_lng_lat,
          zIndex: 1,
          anchor: 'center',
          offset: new AMap.Pixel(0, 0),
          content:
            '<div style="width:25px;height:25px;border-radius:50%;box-shadow:0px 0px 4px 4px #FF9900"></div>'
        })
        this.highlight_marker.setMap(this.map_obj)
        this.highlight_marker.setPosition(this_lng_lat)
        this.highlight_marker.show()
      }
      // 如果是点击同一个店铺则不调用接口，直接显示
      if (this_store_id === this.store_id) {
        // 将详情面板定位在某经纬度
        this.store_detail_board_info_window.open(
          this.map_obj,
          this_lng_lat
        )
        // 显示详情面板
        this.is_show_store_detail = true
      } else {
        // 如果存在已经画好的店铺辐射范围则移除
        if (this.current_store_polygon) {
          this.current_store_polygon.clearOverlays()
        }
        // 修改店铺的id传递给详情组件
        this.store_id = this_store_id
        /*--- 显示详情面板 ---*/
        // 获取面板dom
        this.store_detail_board_dom = this.$refs.store_detail_board_comp.$refs.store_detail_board
        // 初始化地图的信息窗口
        if (!this.store_detail_board_info_window) {
          this.store_detail_board_info_window = this.$refs.gaiaMapContainer.drawInfoWindow(
            {
              HTMLElement: this.store_detail_board_dom,
              offset: new AMap.Pixel(50, -160),
              anchor: 'top-left'
            }
          )
        }
        this.store_detail_board_info_window.open(
          this.map_obj,
          this_lng_lat
        )
        this.is_show_store_detail = true
        // 调用详情接口 并绘制当前店铺辐射范围
        BUSINESS_EXP_API.get_store_detail({
          storeId: this.store_id
        }).then((res) => {
          if (res) {
            // 初始化店铺详情面板数据
            this.current_store_info = res
          }
        })
        // 移除之前的红蓝小旗子
        // this.goBack()
        }
        // 每次点击店铺都要获取此店铺的经纬度，和店铺id，然后才能触发修改位置功能
        // this.marker_lnglat = marker_info.data.lnglat
    },

    // 点击重合点位弹框以及样式
    clickRepeat(repeatArr) {
      let _this = this
      repeatArr.forEach(item=>{
        _this.map_obj.add(item.repeaTtext)
        item.repeaTtext && item.repeaTtext.on('click', e => {
          if (e) {
              this.hideRepeatBorder()
              item.repeaTtext.setStyle({
                'box-shadow' :'0px 0px 4px 4px #ff9900',
                'border-radius':'20px'
              })
              if(_this.repeatPopout) {
                _this.map_obj.remove(_this.repeatPopout)
              }
              let newData = e.target.w.extData.repeatPoint
              let newDemo = []
              newData.forEach(newitem=>{
                newDemo.push('<span id="'+newitem.properties.storeId+'" style="height:26px; margin:0 3px; width:26px; display: inline-block; background-size: 100%; background-position: center; background-image:url('+newitem.properties.typeIcon+');"></span>')
              })
              let newText = ''
              newDemo.forEach(item=>{
                newText=newText+item
              })
              // 创建重合点纯文本标记
              var repeaTtext = new AMap.Marker({
                  anchor:'bottom-center', // 设置文本标记锚点
                  draggable:false,
                  zIndex: 10,
                  angle:0,
                  content:`<div
                  id="repeatData"
                  style='
                  position: absolute;
                  min-height: 26px;
                  max-width:200px;
                  background: rgba(0, 0, 0, 0.7);
                  border-radius: 2px; width:`
                  + JSON.stringify(newDemo.length*32+1) +
                  `px; display:block;
                  padding: 8px;'>`+ newText +`</div>`,
                  position: e.lnglat,
                  offset: new AMap.Pixel(0,-10),
                  topWhenClick: true,
                  bubble: true,
                  setTop: true
              });
              _this.repeatPopout = repeaTtext
              _this.map_obj.add(_this.repeatPopout)
              setTimeout(() => {
                document.getElementById('repeatData').children.forEach(repeatitem=>{
                  repeatitem.addEventListener("click", function(repeatElment) {
                    if(repeatElment.path[1].children) {
                      repeatElment.path[1].children.forEach(demitem=>{
                        demitem.style.boxShadow = 'none';
                      })
                    }
                    repeatElment.path[0].style.boxShadow = '0px 0px 4px 4px #ff9900';
                    repeatElment.path[0].style.borderRadius = '20px';
                    _this.getDetail({data:{
                      lnglat: item.lanlet,
                      storeId: repeatElment.target.id
                    }})
                  })
                })
              }, 500);
          }
        })
      })
    },

    //隐藏点位描边
    hideRepeatBorder(){
      this.repeatArr.forEach(item=>{
        item.repeaTtext.setStyle({
          'box-shadow' :'none',
        })
      })
      setTimeout(() => {
        if(document.getElementById('repeatData')) {
          document.getElementById('repeatData').children.forEach(repeatitem=>{
            repeatitem.style.boxShadow = 'none';
          })
        }
      }, 500);
    },

    /**
     * @description 聚合处理
     * @param { object } markers_array
     */
    // renderMarkerClusterer(markers_array) {
    // 	console.log(markers_array)
    // },

    /**
     * @description 绘制二阶线面GEOJson
     * @param { object } GEO_json 二阶数据， polygon 辐射范围
     * @param { object } polygon_json 辐射范围(橙红色区域)
     */
    renderLevelTwoGEOJson(GEO_json, polygon_json) {
      // 绘制线和每个店铺的覆盖范围
      if (GEO_json) {
        this.level_tow_geo_obj = null
        this.level_tow_geo_obj = new AMap.GeoJSON({
          geoJSON: GEO_json,
          getPolygon: (geo_json, lng_lat) => {
            let polygon_obj = new AMap.Polygon({
              path: lng_lat,
              zIndex: 112,
              strokeColor: '#2E82CF',
              strokeOpacity: 1,
              strokeWeight: 2,
              fillColor: '#318FE9',
              fillOpacity: 0.7,
              cursor: 'pointer'
            })
            return polygon_obj
          },
          getPolyline: (geo_json, lng_lat) => {
            // 距离 geo_json.distance
            let polyline_obj = new AMap.Polyline({
              path: lng_lat,
              zIndex: 113,
              // 是否显示方向
              showDir: true,
              dirColor: 'pink',
              // 线颜色
              strokeColor: '#336688',
              // 透明度
              strokeOpacity: 1,
              // 线宽
              strokeWeight: 6
            })
            // 运算某条线中间点，并打点距离
            this.computeDis(
              new AMap.LngLat(lng_lat[0].lng, lng_lat[0].lat),
              new AMap.LngLat(lng_lat[1].lng, lng_lat[1].lat),
              geo_json.properties.distance.toFixed(2)
            )
            return polyline_obj
          },
          getMarker: () => {
            return ''
          }
        })
        this.level_tow_geo_obj.setMap(this.map_obj)
      }
      // 辐射范围(绿色)
      if (polygon_json) {
        this.level_tow_range_obj = new AMap.GeoJSON({
          geoJSON: polygon_json,
          getPolygon: (geo_json, lng_lat) => {
            let polygon_obj = new AMap.Polygon({
              path: lng_lat,
              zIndex: 111,
              strokeColor: '#206040',
              strokeOpacity: 1,
              strokeWeight: 2,
              fillColor: '#339966',
              fillOpacity: 0.7,
              cursor: 'pointer'
            })
            return polygon_obj
          }
        })
        this.level_tow_range_obj.setMap(this.map_obj)
      }
    },

    /**
     * @description 绘制距离marker
     * @param {} m1 起始点
     * @param {} m2 终止点
     * @param {} distance_num 距离值
     */
    computeDis(m1, m2, distance_num) {
      // 初始化中间点位置
      let textPos = m1.divideBy(2).add(m2.divideBy(2))
      // let distance = Math.round(m1.distance(m2))
      let text = new AMap.Text({
        text: distance_num + ' km',
        position: textPos,
        style: {
          'background-color': '#29b6f6',
          'font-size': '10px',
          'border-radius': '4px'
        }
      })
      text.setMap(this.map_obj)
      this.distance_marker_array.push(text)
    },

    /**
     * @description 获取行政边界
     * @param {string} org_id
     */
    // async getGovBoundary() {
    //   let res = await BUSINESS_NAVIGATION_API.get_map_gov_by_org_id(
    //     this.route_query.orgId
    //   )
    //   if (res) {
    //     let polygon_geo_obj = new AMap.GeoJSON({
    //       geoJSON: res,
    //       getPolygon: (geo_json, lng_lat) => {
    //         let polygon_obj = new AMap.Polygon({
    //           path: lng_lat,
    //           zIndex: 1,
    //           strokeColor: '#FF9900',
    //           strokeOpacity: 1,
    //           strokeWeight: 2,
    //           fillColor: '#FF9900',
    //           fillOpacity: 0.2
    //         })
    //         this.polygon_gov_arr.push(polygon_obj)
    //         return polygon_obj
    //       }
    //     })
    //     polygon_geo_obj.setMap(this.map_obj)
    //   }
    // },

    /**
     * @description 获取当前店铺的辐射范围
     * @param {object} geo_json 标准GEOJson格式数据
     */
    getCurrentStorePolygon(geo_json) {
      if (geo_json) {
        this.current_store_polygon = new AMap.GeoJSON({
          geoJSON: geo_json,
          getPolygon: (geo_json, lng_lat) => {
            // 实例化每一个区域
            let polygon_obj = new AMap.Polygon({
              path: lng_lat,
              zIndex: 2,
              strokeColor: '#2E82CF',
              strokeOpacity: 1,
              strokeWeight: 2,
              fillColor: '#318FE9',
              fillOpacity: 0.7
            })
            return polygon_obj
          }
        })
        this.current_store_polygon.setMap(this.map_obj)
        // 如果右下角控制面板中辐射范围未开，则不显示，否则显示
        if (this.is_open_single_range_boundary) {
          this.current_store_polygon.show()
        } else {
          this.current_store_polygon.hide()
        }
      }
    },

    /**
     * @description 触发改变店铺位置回调
     */
    changeLocation() {
      // 如果已经存在拖拽对象则移除
      if (this.position_picker) {
        this.position_picker.stop()
        this.position_picker = ''
      }
      // 移除蓝色小旗子
      if (this.marker_settled_obj) {
        this.map_obj.remove(this.marker_settled_obj)
        this.marker_settled_obj = ''
      }
      // 隐藏 '修改位置' 按钮
      // this.is_show_edit_button = false
      // 步骤1：初始化Picker对象,实例化一个固定蓝色小旗子，不可拖拽 this.marker_lnglat 为当下店铺的经纬度对象
      AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
        this.marker_settled_obj = new AMap.Marker({
          position: this.marker_lnglat,
          offset: new AMap.Pixel(0, 0),
          anchor: 'bottom-center',
          icon: new AMap.Icon({
            size: new AMap.Size(39, 40), // 图标尺寸
            image: oldLocationIcon, // Icon的图像
            imageSize: new AMap.Size(39, 40) // 根据所设置的大小拉伸或压缩图片
          }),
          // 原来是4
          zIndex: 200
        })
        // 将蓝色小旗子绘制在地图上
        this.marker_settled_obj.setMap(this.map_obj)

        // 步骤2：初始化一个红色小旗子拖拽对象
        this.position_picker = new PositionPicker({
          mode: 'dragMarker',
          map: this.map_obj,
          iconStyle: {
            url: newLocationIcon,
            size: [39, 40],
            ancher: [19, 40]
          }
        })
        // 初始化起始拖拽位置
        this.position_picker.start(this.marker_lnglat)

        // 拖拽完毕后回调
        this.position_picker.on('success', (positionResult) => {
          console.log('---拖拽成功---', positionResult)
          this.finishedEdit(positionResult, true)
        })
        // 失败后回调
        this.position_picker.on('fail', function (positionResult) {
          console.log('---拖拽失败---', positionResult)
        })
      })
    },

    /**
     * @description 拖拽成功后触发，将当下地址显示在右下角位置
     */
    finishedEdit(position_obj, is_show_button) {
      this.end_position_lnglat = position_obj.position
      console.log(
        '---拖拽后的经纬度---',
        this.end_position_lnglat.getLng(),
        this.end_position_lnglat.getLat()
      )
      this.onMapmove()
      let end_position_pixel = this.map_obj.lngLatToContainer(
        this.end_position_lnglat
      )
      this.end_left_val =
        end_position_pixel.getX() + this.offset_end_left + 'px'
      this.end_top_val = end_position_pixel.getY() + 'px'
      this.is_show_end_edit_button = is_show_button
      // 右下角显示最近道路
      this.current_address_str = position_obj.address
    },

    /**
     * @description 提交修改的位置
     */
    // async submitLocation() {
    //   let res = await BUSINESS_NAVIGATION_API.update_map_location({
    //     address: this.current_address_str,
    //     storeLocation:
    //       this.end_position_lnglat.getLng() +
    //       ',' +
    //       this.end_position_lnglat.getLat(),
    //     id: this.store_id
    //   })
    //   if (res) {
    //     // 清空小旗子
    //     this.goBack()
    //     // 关闭详情面板
    //     this.store_detail_board_info_window.close()
    //     this.is_show_store_detail = false
    //     // 清空当下store_id
    //     this.store_id = ''
    //     // 重新绘制所有点,之所以加上setTimeout，是因为数据库不会更新那么快,所有要等一下
    //     setTimeout(() => {
    //       this.getMapStoreData(this.route_query, true)
    //     }, 1000)
    //   }
    // },

    /**
     * @description 取消修改的位置
     */
    // goBack() {
    //   // 删除红色小旗子(官网方法)
    //   if (this.position_picker) {
    //     this.position_picker.stop()
    //   }
    //   this.position_picker = ''
    //   // 移除蓝色小旗子
    //   this.map_obj.remove(this.marker_settled_obj)
    //   this.marker_settled_obj = ''
    //   // 隐藏确认按钮组
    //   this.is_show_end_edit_button = false
    //   // 清空地址字符串
    //   this.current_address_str = ''
    //   // 回到蓝色小旗子位置
    //   // this.position_picker.start(this.marker_lnglat)
    // },

    /**
     * @description 监听地图移动，因为拖拽后的按钮是独立于地图的，所以需要动态计算位置
     */
    onMapmove() {
      // 监听地图移动事件
      this.map_obj.on('mapmove', () => {
        if (this.position_picker) {
          // 确认按钮位置
          let marker_pixel = this.map_obj.lngLatToContainer(
            this.end_position_lnglat
          )
          this.end_left_val = marker_pixel.getX() + this.offset_end_left + 'px'
          this.end_top_val = marker_pixel.getY() + 'px'
        }
      })
      // 监听地图容器变化
      this.map_obj.on('resize', () => {
        if (this.position_picker) {
          // 确认按钮位置
          let marker_pixel = this.map_obj.lngLatToContainer(
            this.end_position_lnglat
          )
          this.end_left_val = marker_pixel.getX() + this.offset_end_left + 'px'
          this.end_top_val = marker_pixel.getY() + 'px'
        }
      })
    },

    /**
     * @description 关闭店铺详情回调函数
     */
    closeStoreDetailBoard() {
      this.store_detail_board_info_window.close()
      this.is_show_store_detail = false
      // 如果已经存在高亮点，则隐藏
      if (this.highlight_marker) {
        this.highlight_marker.hide()
        // 隐藏重合点描边
        this.hideRepeatBorder()
      }
    },

    /**
     * @description 关闭左侧面板回调函数
     */
    closeLeftFilterBoard(val) {
      this.leftFilterBoardShow = val
      this.offset_left = -34
      this.offset_end_left = -80
    },

    /**
     * @description 改变店群画像显示状态
     */
    StoreGrouPortrait(val) {
      this.filter_obj.geneRated = val
    },

    /**
     * @description 打开左侧面板回调函数
     */
    openLeftFilterBoard(val) {
      this.leftFilterBoardShow = val
      this.offset_left = 306
      this.offset_end_left = 260
    },

    /**
     * @description 来自子组件的：属性select-option发生改变
     * @param {object} select_result_obj 当下改变的子模块数据
     */
    changeSelect(select_result_obj) {
      switch (select_result_obj.title) {
        // 事实属性
        case '门店类型': {
          this.filter_obj.storeCategory = select_result_obj.values
          break
        }
        case '周围环境POI': {
          this.filter_obj.storePoiCode = select_result_obj.values
          break
        }
        // 模型属性
        case '人流量': {
          this.filter_obj.peopleStream = select_result_obj.values
          break
        }
        case '交通便利': {
          this.filter_obj.transportation = select_result_obj.values
          break
        }
        case '消费力指数': {
          this.filter_obj.consumption = select_result_obj.values
          break
        }
        case '门店密集程度': {
          this.filter_obj.storeDensity = select_result_obj.values
          break
        }
        case '房价': {
          this.filter_obj.housePrice = select_result_obj.values
          break
        }
        // uniStore
        case 'uniStore' : {
          this.filter_obj.uniStore = select_result_obj.values
        }
      }
      // 更新路由route-query
      this.updateRouteQuery()
    },

    /**
     * @description 清空所有select-option选择
     * @param { string } 模块类型名
     */
    clearAllSelect(type) {
      if (type === 'fact') {
        this.filter_obj.storeCategory = []
        this.filter_obj.storePoiCode = []
      } else if (type === 'model') {
        this.filter_obj.peopleStream = []
        this.filter_obj.transportation = []
        this.filter_obj.consumption = []
        this.filter_obj.storeDensity = []
        this.filter_obj.housePrice = []
      } else if (type == 'uniStore') {
        this.filter_obj.uniStore = []
      }
      // 更新路由route-query
      this.updateRouteQuery()
    },

    /**
     * @description 是否显示导出table弹窗
     * @param {boolean} is_show 显示与否flag
     */
    switchShowExportTable(is_show) {
      this.is_show_export_table = is_show
    },

    /**
     * @description 更新路由的query参数
     * 上传：v-auth='navigation:sell:uploadlg' 调整位置：v-auth='navigation:sell:updatestore'
     * 下载：v-auth='navigation:sell:downloadstore' 推送：v-auth='navigation:sell:sendstore'
     */
    updateRouteQuery() {
      // 合并五个模型标签组成新的
      this.filter_obj.modelTags = [
        ...this.filter_obj.peopleStream,
        ...this.filter_obj.transportation,
        ...this.filter_obj.consumption,
        ...this.filter_obj.storeDensity,
        ...this.filter_obj.housePrice
      ]
      // 复制一个副本，为初始化新路由query提供参数，数组要转换为'1,2,3'格式
      this.route_query = JSON.parse(JSON.stringify(this.filter_obj))
      // 行政codes
      this.route_query.regionCodes = this.route_query.regionCodes.join()
      // 组织ids
      this.route_query.orgArray = this.route_query.orgArray.join()
      // 合并五个模型标签组成新的
      this.route_query.modelTags = this.route_query.modelTags.join()
      // 事实标签
      this.route_query.storeCategory = this.route_query.storeCategory.join()
      this.route_query.storePoiCode = this.route_query.storePoiCode.join()
      // 模型标签
      this.route_query.peopleStream = this.route_query.peopleStream.join()
      this.route_query.transportation = this.route_query.transportation.join()
      this.route_query.consumption = this.route_query.consumption.join()
      this.route_query.storeDensity = this.route_query.storeDensity.join()
      this.route_query.housePrice = this.route_query.housePrice.join()
      // unistore
      this.route_query.uniStore = this.route_query.uniStore.join()
      // 修改路由url参数
      this.$router
        .replace({ path: this.$route.path, query: this.route_query })
        .catch((err) => {
          err
        })
    },

    /**
     * @description 是否打开单个店铺辐射范围
     */
    isOpenSingleRangeBoundary() {
      this.is_open_single_range_boundary = !this.is_open_single_range_boundary
      // 如果已经存在当前店铺polygon
      if (this.current_store_polygon) {
        // 如果打开开关
        if (this.is_open_single_range_boundary) {
          this.current_store_polygon.show()
        } else {
          this.current_store_polygon.hide()
        }
      }
    },

    /**
     * @description 是否打开店铺辐射范围
     */
    isOpenRangeBoundary() {
      this.is_open_range_boundary = !this.is_open_range_boundary
      if (this.is_open_range_boundary) {
        if (this.polygon_stores_range_arr.length > 0) {
          this.polygon_stores_range_arr.forEach((item) => {
            item.show()
          })
        } else {
          // 调用接口
          // this.getStoresRangeBoundary(this.route_query)
        }
      } else {
        if (this.polygon_stores_range_arr.length > 0) {
          this.polygon_stores_range_arr.forEach((item) => {
            item.hide()
          })
        }
      }
    },

    /**
     * @description 图例中行政边界和组织边界互换,0-行政边界，1-组织边界
     */
    activeBoundaryChanged(idx) {
      if(idx !== this.active_boundary_index) {
        // 切换到行政    
        if (idx === 0) {
          // 调取获取行政数据接口
          BUSINESS_EXP_API.get_switch_org_gov_data({
            // 当前组织编码，只能有一个
            current: this.filter_obj.orgArray[0],
            // 1：得到行政
            type: 1
          }).then(data => {
            if(data){
              // 显示行政树
              this.$store.dispatch('map/setMapAdministration', true)
              // 隐藏组织树
              this.$store.dispatch('map/setMapOrganization', false)
              this.active_boundary_index = idx
              this.filter_obj.orgArray = []
              data.forEach(item => {
                this.filter_obj.regionCodes.push(item.regionCode)
              })
              this.filter_obj.latitude = 1
              // 如果热力图开关是打开状态 则关闭
              if (this.is_open_heat) this.isOpenHeat()
              // 如果自由门店状态是打开的 则关闭；isOpenSelfStore方法里面有路由刷新方法
              if (this.is_open_self_store) {
                this.isOpenSelfStore()
              } else {
                this.updateRouteQuery()
              }
            }
          })
        }
        // 切换到组织
        else {
          // 调取获取组织数据接口
          BUSINESS_EXP_API.get_switch_org_gov_data({
            // 当前行政编码，只能有一个
            current: this.filter_obj.regionCodes[0],
            // 2：得到组织
            type: 2
          }).then(data => {
            if(data) {
              // 隐藏行政树
              this.$store.dispatch('map/setMapAdministration', false)
              // 显示组织树
              this.$store.dispatch('map/setMapOrganization', true)
              this.active_boundary_index = idx
              data.forEach(item => {
                this.filter_obj.orgArray.push(item.orgId)
              })
              this.filter_obj.regionCodes = []
              this.filter_obj.latitude = 2
              // 如果热力图开关是打开状态 则关闭
              if (this.is_open_heat) this.isOpenHeat()
              // 如果自由门店状态是打开的 则关闭；isOpenSelfStore方法里面有路由刷新方法
              if (this.is_open_self_store) {
                this.isOpenSelfStore()
              } else {
                this.updateRouteQuery()
              }
            }
          })
        }
      }
    },

    /**
     * @description 获取辐射范围并渲染
     * @param { object } params 查询参数包含所有过滤字段
     */
    async getStoresRangeBoundary() {
      // let res = await BUSINESS_NAVIGATION_API.get_stores_range(params)
      // if (res) {
      //   let polygon_stores_range_geo_obj = new AMap.GeoJSON({
      //     geoJSON: JSON.parse(res),
      //     getPolygon: (geo_json, lng_lat) => {
      //       let polygon_obj = new AMap.Polygon({
      //         path: lng_lat,
      //         zIndex: 4,
      //         strokeColor: '#FF9900',
      //         strokeOpacity: 1,
      //         strokeWeight: 2,
      //         fillColor: '#FF9900',
      //         fillOpacity: 0.2
      //       })
      //       this.polygon_stores_range_arr.push(polygon_obj)
      //       return polygon_obj
      //     }
      //   })
      //   polygon_stores_range_geo_obj.setMap(this.map_obj)
      // }
    },

    /**
     * @description 是否打开热力图
     */
    isOpenHeat() {
      this.is_open_heat = !this.is_open_heat
      if (this.is_open_heat) {
        // if (this.heat_map_obj) {
        //   // this.map_obj.setZoom(13)
        //   this.heat_map_obj.show()
        // } else {
        //   this.getHeatMap()
        // }
        // 如果之前清楚了热力图地图数据 则重新请求接口
        if (this.isClearHeatMap) {
          this.getHeatMap()
        } else {
          this.heat_map_obj.show()
        }
      } else {
        if (this.heat_map_obj) {
          this.heat_map_obj.hide()
        }
      }
    },

    /**
     * @description 获取热力图数据
     */
    async getHeatMap() {
      // console.log('zoom-lng', this.map_obj.getCenter().lng)
      // console.log('zoom-lat', this.map_obj.getCenter().lat)
      this.heatscreenLoading = true
      if (this.heat_map_obj) this.heat_map_obj.setMap(null) // 清空热力图
      const params = {
        zoom: this.map_obj.getZoom(),
        latitude: this.filter_obj.latitude,
        region_codes: this.filter_obj.regionCodes.join(','),
        org_array: this.filter_obj.orgArray.join(','),
        ...this.handleContainerToLngLat()
      }
      let res = await BUSINESS_EXP_API.get_gaia_heat_map_data(params)
      if (res && res.length) {
        this.map_obj.plugin(['AMap.Heatmap'], () => {
          //初始化heatmap对象
          this.heat_map_obj = new AMap.Heatmap(this.map_obj, {
            radius: 100, //给定半径
            opacity: [0, 0.6],
            // zooms: [13, 14],
            // gradient: {
              // 0: '#B7C5EE', // 灰色
              // 1.0: '#B7C5EE',
              // 0: '#004389', // 蓝色
              // 1.0: '#004389',
            // },
          })
          // 先设置层级
          this.heat_map_obj.setzIndex(999)
          //再设置数据集
          this.heat_map_obj.setDataSet({
            data: res
          })
        })
        this.isClearHeatMap = false
        this.map_obj.on('moveend', () => {
          if (this.is_open_heat) {
            this.heatscreenLoading = true
            if (this.heatTimer) clearTimeout(this.heatTimer)
            this.heatTimer = setTimeout(() => {
              if (this.heatMapScaleRules()) {
                this.heatscreenLoading = false
              } else {
                this.getHeatMap()
              }
            }, 1000);
          } else {
            this.isClearHeatMap = true
          }
        })
      }
      this.heatscreenLoading = false
    },

    /**
     * @description 是否打开自有门店开关
     */
    isOpenSelfStore() {
      this.is_open_self_store = !this.is_open_self_store
      // ownStore的数据状态改变 更新路由
      this.filter_obj.ownStore = this.is_open_self_store ? 1 : 0
      this.updateRouteQuery()
      if (this.is_open_self_store) {
        // this.map_obj.setZoom(12)
        // 如果之前清除了自有门店地图数据 则重新请求接口
        // if (this.isClearSelfStoreMap) {
        //   this.getSelfStoreMap()
        // } else {
        //   if (this.isLastLevel) {
        //     this.self_mass_markers_obj.show()
        //   } else {
        //     if (this.self_store_map_arr.length) {
        //       this.self_store_map_arr.forEach(item =>{
        //         item.show()
        //       })
        //     }
        //   }
        // }
      } else {
        // if (this.isLastLevel) {
        //     this.self_mass_markers_obj.hide()
        // } else {
        //   if (this.self_store_map_arr.length) {
        //     this.self_store_map_arr.forEach(item =>{
        //       item.hide()
        //     })
        //   }
        // }
        this.isClearSelfStoreMap = true
        if (this.self_store_map_arr.length) {
          this.self_store_map_arr.forEach(item => {
            item.setMap(null)
          })
        }
        if (this.self_mass_markers_obj) {
          this.self_mass_markers_obj.clear()
        }
      }
    },

    /**
     * @description 获取自有门店map数据[网格热力图/普通热力图]
     */
    async getSelfStoreMap() {
      this.gaiascreenLoading = true
      const para = {
        zoom: this.map_obj.getZoom(),
        latitude: this.filter_obj.latitude,
        region_codes: this.filter_obj.regionCodes.join(','),
        org_array: this.filter_obj.orgArray.join(','),
        ...this.handleContainerToLngLat()
      }
      // 鉴于最底层级只需要请求自由门店的数据接口，不用请求gaia数据接口，优化为：
      // 1.首先请求自由门店数据接口
      // 2.根据接口返回是否最底层级标记，判断是否需要请求gaia数据接口
      // 3.如果是最底层级，则不需要请求gaia数据接口
      // 4.如果不是最底层级，则请求gaia数据接口，gaia网格数据层级zIndex < 自由门店网格数据层级zIndex
      // gaia数据
      // let res = await BUSINESS_EXP_API.get_gaia_self_store_data({
      //   isLoading: false,
      //   store_bu: 'gaia',
      //   ...para
      // })
      // 自有门店数据
      let res2 = await BUSINESS_EXP_API.get_gaia_self_store_data({
        isLoading: false,
        store_bu: 'km',
        ...para
      })
      // 清空 非最底层 和 最底层的数据
      if (this.self_store_map_arr.length) {
        this.self_store_map_arr.forEach(item => {
          item.setMap(null)
        })
      }
      if (this.self_mass_markers_obj) {
        this.self_mass_markers_obj.clear()
      }
      // this.isLastLevel = res && res.extData ? res.extData.leafNode : false
      this.isLastLevel = res2 && res2.extData ? res2.extData.leafNode : false
      if (this.isLastLevel) {
        // 如果是最底层级 只需要处理自有门店数据
        const data_list = res2.data && res2.data.length ? res2.data[0].bounder.features : []
        this.getlastLayerPoint(data_list, 'self')
      } else {
        let res = await BUSINESS_EXP_API.get_gaia_self_store_data({
          isLoading: false,
          store_bu: 'gaia',
          ...para
        })
        // 如果非最底层级 自有门店和gaia门店的数据-网格热力展示
        this.handleSelfStoreListData2(res.data, 'gaia')
        this.handleSelfStoreListData2(res2.data, 'self')
        // 只有非最底层级地图移动或缩放后，触发数据重新请求
        this.map_obj.on('moveend', () => {
          if (this.is_open_self_store) {
            this.gaiascreenLoading = true
            if (this.storeTimer) clearTimeout(this.storeTimer)
            this.storeTimer = setTimeout(() => {
              // 和后端规则保持一致：缩放层级数字 在一定级别之间不用触发接口，超过当前级别触发接口
              if (this.selfStoreScaleRules() || !this.isClearSelfStoreMap) {
                this.gaiascreenLoading = false
              } else {
                this.getSelfStoreMap()
              }
            }, 1100)
          } else {
            this.isClearSelfStoreMap = true
          }
        })
      }
      this.isClearSelfStoreMap = true
      this.gaiascreenLoading = false
    },

    /**
     * @description 处理gaia门店或自由门店的数据[非最低层级 普通样式]
     * @param {object} data 元数据
     * @param {object} type：gaia/self
     */
    handleSelfStoreListData(data, type) {
      const color = type === 'gaia' ? '#7068F3' : '#FF9900'
      let res = []
      if (data && data.length) {
        // 处理数据-为热力图需要的数据格式
        data.forEach((item) => {
          res.push({
            count: item.storeNum,
            lng: item.orgLocation ? item.orgLocation.split(',')[0] : '',
            lat: item.orgLocation ? item.orgLocation.split(',')[1] : '',
          })
        })
        this.map_obj.plugin(['AMap.Heatmap'], () => {
          if (type === 'gaia') {
            //初始化heatmap对象
            this.self_store_map_arr[0] = new AMap.Heatmap(this.map_obj, {
              radius: 15, //给定半径
              gradient: {
                0: color,
                1.0: color,
              },
            })
            this.self_store_map_arr[0].setzIndex(1000)
            //设置数据集
            this.self_store_map_arr[0].setDataSet({
              data: res
            })
          } else {
            //初始化heatmap对象
            this.self_store_map_arr[1] = new AMap.Heatmap(this.map_obj, {
              radius: 10, //给定半径
              gradient: {
                0: color,
                1.0: color,
              },
            })
             this.self_store_map_arr[1].setzIndex(1001)
            //设置数据集
            this.self_store_map_arr[1].setDataSet({
              data: res
            })
          }
        })
      }
    },
    /**
     * @description 处理gaia门店或自由门店的数据[非最低层级 网格热力样式]
     * @param {object} data 元数据
     * @param {object} type：gaia/self
     */
    handleSelfStoreListData2(data, type) {
      if (data && data.length) {
        if (type === 'gaia') {
          this.self_store_map_arr[0] = new Loca.GridLayer({
            map: this.map_obj,
            fitView: false,
            zIndex: 1000,
          })
          this.self_store_map_arr[0].setData(data, {
            lnglat: function (obj) {
              var val = obj.value
              return [val['lng'], val['lat']]
            },
            value: 'count',
            type: 'js',
          })
          this.self_store_map_arr[0].setOptions({
            unit: 'px',
            mode: 'sum',
            style: {
              color: [
                // ---GAIA（紫）---
                // '#7068F3',
                // 'rgba(112,104,243,0.1)',
                // 'rgba(112,104,243,0.2)',
                // 'rgba(112,104,243,0.3)',
                // 'rgba(112,104,243,0.4)',
                // 'rgba(112,104,243,0.5)',
                // 'rgba(112,104,243,0.6)',
                // 'rgba(112,104,243,0.7)',
                // 'rgba(112,104,243,0.8)',
                // 'rgba(112,104,243,0.9)',
                // 'rgba(112,104,243,1.0)',
                // test
                // '#5A8EF8'
                'rgba(45,140,240,0.1)',
                'rgba(45,140,240,0.2)',
                'rgba(45,140,240,0.3)',
                'rgba(45,140,240,0.4)',
                'rgba(45,140,240,0.5)',
                'rgba(45,140,240,0.6)',
                // 'rgba(45,140,240,0.7)',
                // 'rgba(45,140,240,0.8)',
                // 'rgba(45,140,240,0.9)',
                // 'rgba(45,140,240,1.0)',
              ],
              radius: 18,
              // opacity: 0.8,
              gap: 1,
              height: [0, 0],
              borderWidth: 1,
              borderColor: '#ffffff'
            },
          })
          this.self_store_map_arr[0].render()
        } else {
          this.self_store_map_arr[1] = new Loca.GridLayer({
            map: this.map_obj,
            fitView: false,
            zIndex: 1001,
          })
          this.self_store_map_arr[1].setData(data, {
            lnglat: function (obj) {
              var val = obj.value
              return [val['lng'], val['lat']]
            },
            value: 'count',
            type: 'js',
          })
          this.self_store_map_arr[1].setOptions({
            unit: 'px',
            mode: 'sum',
            style: {
              color: [
                // ---自有门店（黄）---
                // '#FF9900',
                // 'rgba(255,153,0,0.1)',
                // 'rgba(255,153,0,0.2)',
                // 'rgba(255,153,0,0.3)',
                // 'rgba(255,153,0,0.4)',
                // 'rgba(255,153,0,0.5)',
                // 'rgba(255,153,0,0.6)',
                // 'rgba(255,153,0,0.7)',
                // 'rgba(255,153,0,0.8)',
                // 'rgba(255,153,0,0.9)',
                // 'rgba(255,153,0,1.0)',
                // 红色test
                // '#ED4214'
                'rgba(237,66,20,0.1)',
                'rgba(237,66,20,0.2)',
                'rgba(237,66,20,0.3)',
                'rgba(237,66,20,0.4)',
                'rgba(237,66,20,0.5)',
                'rgba(237,66,20,0.6)',
                // 'rgba(237,66,20,0.7)',
                // 'rgba(237,66,20,0.8)',
                // 'rgba(237,66,20,0.9)',
                // 'rgba(237,66,20,1.0)',
              ],
              radius: 18,
              // opacity: 0.8,
              gap: 1,
              height: [0, 0],
              borderWidth: 1,
              borderColor: '#ffffff'
            },
          })
          this.self_store_map_arr[1].render()
        }
      }
    },

    /**
     * @description 千分位分割格式化
     */
    formatterThousandSeperator(num) {
      if(num){
        let res = num.toString().replace(/\d+/, function (n) {
          // 先提取整数部分
          return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
            return $1 + ','
          })
        })
        return res
      } else {
        // 如果数据不正常比如为0，'',等则返回0
        return 0
      }
    },

    /**
     * @description 容器像素坐标转成经纬度坐标
     * return {左上角经度，左上角维度，右下角经度，右下角维度}
     */
    handleContainerToLngLat() {
      // 获取地图容器的宽高 作为右下角的坐标值
      const mapDom = document.querySelector('.gaiaMapContainer')
      const W = mapDom.clientWidth
      const H = mapDom.clientHeight
      const pixelTopLeft = new AMap.Pixel(0, 0);
      const lnglatTopLeft = this.map_obj.containerToLngLat(pixelTopLeft)
      const pixelBottomRight = new AMap.Pixel(W, H);
      const lnglatBottomRgiht = this.map_obj.containerToLngLat(pixelBottomRight)
      return {
        left_ax: lnglatTopLeft.lng, // 左上角经度
        top_ay: lnglatTopLeft.lat,  // 左上角维度
        right_bx: lnglatBottomRgiht.lng, // 右下角经度
        bottom_by: lnglatBottomRgiht.lat // 右下角维度
      }
    },

    /**
     * @description 门店覆盖的缩放规则（依据后端）
     */
    selfStoreScaleRules() {
      function rules(precision) {
        let res = ''
        if (precision === '') {
          res = 0
        } else if (precision <= 3){
          res = 2
        } else if (3 < precision && precision <= 5) {
          res = 3
        } else if (5 < precision && precision <= 7) {
          res = 4
        } else if (7 < precision && precision <= 9) {
          res = 5
        } else if (9 < precision && precision <= 11) {
          res = 8
        } else if (11 < precision && precision <= 13) {
          res = 10
        } else {
          res = 12
        }
        return res
      }
      const res1 = rules(this.preZoom)
      const res2 = rules(this.currentZoom)
      // 判断preZoom和currentZoom是否在同一个区间值里
      return res1 === res2
    },
    /**
     * @description 人口热力图的缩放规则（依据后端）
     */
    heatMapScaleRules() {
      function rules(precision) {
        let res = ''
        if (precision === '') {
          res = 0
        } else  if (3 >= precision){
          res = 2;
        } else if (3 < precision && precision <= 5) {
          res = 3;
        } else if (5 < precision && precision <= 7) {
          res = 4;
        } else if (7 < precision && precision <= 9) {
          res = 5;
        } else if (9 < precision && precision <= 10) {
          res = 6;
        } else if (10 < precision && precision <= 11) {
          res = 7;
        } else if (11 < precision && precision <= 12) {
          res = 8;
        } else if (12 < precision && precision <= 13) {
          res = 9;
        } else if (13 < precision && precision <= 14) {
          res = 10;
        } else if (14 < precision && precision <= 15) {
          res = 11;
        } else {
          precision = 12;
        }
        return res
      }
      const res1 = rules(this.preZoom)
      const res2 = rules(this.currentZoom)
      // 判断preZoom和currentZoom是否在同一个区间值里
      return res1 === res2
    },
    /**
     * @description 地图中心点移动后的距离是否超过一定阈值(未精准测试先不用)
     */
    centerMoveRules() {
      let res = ''
      if (this.preCenter) {
        const lng = Math.abs(this.preCenter.lng - this.currentCenter.lng)
        const lat = Math.abs(this.preCenter.lat - this.currentCenter.lat)
        res = (lng > 0.01) || (lat > 0.01)
      } else {
        res = true
      }
      return res
    },

    /**
     * @description 上传修改的门店
     * @param {object} 文件对象
     */
    // async uploadModifiedStores(event) {
    //   let file = event.target.files[0]
    //   let form_data = new FormData()
    //   form_data.append('file', file)
    //   let res = await BUSINESS_NAVIGATION_API.post_modified_stores_file(
    //     form_data
    //   )
    //   if (res.code === '200') {
    //     this.$message.success(res.data)
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
// 对于非地图内部用scoped  amap-pls-marker-tip  amap-lib-infowindow
.gaia-views-wrapper {
  position: relative;
  display: flex;
  width: 100%;
  color: #ffffff;
  flex-direction: row-reverse;
  div {
    box-sizing: border-box;
  }
  // .editButton {
  //   position: absolute;
  //   z-index: 1;
  //   width: 68px;
  //   line-height: 28px;
  //   height: 28px;
  //   font-size: 12px;
  //   text-align: center;
  //   background: rgba(33, 0, 54, 0.7);
  //   border-radius: 3px;
  //   color: #fff;
  //   cursor: pointer;
  // }
  // .finishEditButton {
  //   position: absolute;
  //   z-index: 1;
  //   overflow: hidden;
  //   width: 160px;
  //   line-height: 30px;
  //   height: 30px;
  //   background: #ffffff;
  //   box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.5);
  //   border-radius: 4px;
  //   font-size: 12px;
  //   text-align: center;
  //   color: #fff;
  //   display: flex;
  //   cursor: pointer;
  // }
  // .submitButton {
  //   width: 79px;
  //   color: #930cea;
  //   border-right: 1px solid #000000;
  // }
  // .goBackButton {
  //   width: 79px;
  //   color: #000000;
  // }
  // .addressTips {
  //   position: absolute;
  //   z-index: 1;
  //   line-height: 20px;
  //   right: 10px;
  //   bottom: 10px;
  //   background-color: #133773;
  //   padding: 2px 4px;
  //   box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.5);
  //   border-radius: 4px;
  // }
  // .uploadModifiedStoresContainer {
  //   position: absolute;
  //   background-color: rgba(19, 55, 115, 1);
  //   top: 4px;
  //   left: 360px;
  //   height: 32px;
  //   text-align: center;
  //   line-height: 32px;
  //   width: 90px;
  //   border-radius: 4px;
  //   border: 1px solid rgba(255, 255, 255, 0.2);
  //   font-size: 12px;
  //   color: #ffffff;
  //   z-index: 4;
  //   box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.4);
  //   cursor: pointer;
  //   .uploadButton {
  //     display: block;
  //     position: absolute;
  //     z-index: 1;
  //     left: 0;
  //     top: 0;
  //     width: 90px;
  //     height: 32px;
  //     opacity: 0;
  //     cursor: pointer;
  //   }
  // }
}
</style>
<style lang="scss">
// 对于地图内部的maker样式特别处理，不用scoped
#business_exp_gaia_containers {
  // 对于高德检索弹窗等
  .amap-pls-marker-tip,
  .amap-lib-infowindow {
    color: #000000;
  }
  // 标尺变成黑色
  .amap-scale-text {
    color: #000000;
  }
}
.gaiaMapContainer {
  .numContent {
    box-sizing: border-box;
    font-size: 12px;
    color: #ffffff;
    padding: 2px 4px;
    background: #7909c1;
    border-radius: 4px;
    border: 1px solid #ffffff;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.7);
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
