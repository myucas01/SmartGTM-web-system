<!--
    售点拓展：画像地图
-->
<template>
  <div class="bn-index" id="business_exp_map_containers">
    <!--地图组件-->
    <Map @sendMapObj="getMapObj" class="mapContainer" ref="mapContainer"> </Map>
    <!--
			change:面板是否显示，changeRadio：问题门店过滤修改后回调，changeSelect：门店属性过滤修改后回调，requestData：画像的请求数据+地图请求数据等核心数据
			左侧过滤面板 映射为两个路由参数 参数名 => panelType：sale(售点盘点，两个选项卡) || problem(问题门店，三个选项卡)
		-->
    <LeftChartBoard
      v-show="leftFilterBoardShow"
      @change="closeLeftFilterBoard"
      @switchShowExportTable="switchShowExportTable"
      @openFullScreen="openFullScreen"
      :region-datas="region_datas"
      :tgi-datas="tgi_datas"
      :label-datas="label_datas"
      :stores-count-datas="stores_count_datas"
    />
    <FullChartBoard
      ref="fullScreenDashboard"
      :region-datas="region_datas"
      :tgi-datas="tgi_datas"
      :label-datas="label_datas"
      :stores-count-datas="stores_count_datas"
    />
    <!--是否显示左上角的过滤面板小按钮-->
    <ShowUpPanel v-show="!leftFilterBoardShow" @change="openLeftFilterBoard" />
    <!--浮动：图例1-门店类型-->
    <LegendIconBoard />
    <!--浮动：图例2-控制面板，所有switch状态都会提升到此组件中-->
    <LegendCtrlBoard
      @isActiveGovBoundary="isActiveGovBoundary"
      @isActiveOrgBoundary="isActiveOrgBoundary"
      @isOpenRangeBoundary="isOpenRangeBoundary"
      @isOpenHeat="isOpenHeat"
      :isActiveGovBoundary="is_active_gov_boundary"
      :isActiveOrgBoundary="is_active_org_boundary"
      :isOpenRangeBoundary="is_open_range_boundary"
      :isShowRangeBoundary="is_show_range_boundary"
      :isOpenHeat="is_open_heat"
      :isShowHeat="is_show_heat"
    />
    <!--浮动：门店导出-->
    <ExportTable
      @switchShowExportTable="switchShowExportTable"
      :is-show-export-table="is_show_export_table"
    />
    <!--浮动：门店详情-->
    <StoreDetailBoard
      :store-id="store_id"
      :is-show-board="is_show_store_detail"
      :other-info="current_store_info"
      @closeStoreDetailBoard="closeStoreDetailBoard"
    />
  </div>
</template>

<script>
/*---------------------导入组件---------------------*/
// 导入商机导航地图组件
import Map from '@/components/Map'
// 导入左侧画像面板
import LeftChartBoard from '@/components/business_expansion_comp/LeftChartBoard'
// 导入全屏画像面板
import FullChartBoard from '@/components/business_expansion_comp/FullChartBoard'
import ShowUpPanel from '@/components/business_expansion_comp/showUp'
// 导入店铺详情
import StoreDetailBoard from '@/components/business_expansion_comp/StoreDetailBoard'
// 导入店铺图例面板
import LegendIconBoard from '@/components/business_expansion_comp/LegendIconBoard'
// 导入地图图例面板
import LegendCtrlBoard from '@/components/business_expansion_comp/LegendCtrlBoard'
// 导入数据表格组件
import ExportTable from '@/components/business_expansion_comp/ExportTable'
/*---------------------导入商机导航接口API---------------------*/
import BUSINESS_NAVIGATION_API from '../../../api/business_navigate_api'
import BUSINESS_EXP_DASHBOARD_API from '../../../api/business_expansion_dashboard_api'
import { AMap } from '@/plugins/AMap'
/*---------------------导入缺省图标和拖拽小旗子---------------------*/
// import mapStar from '@/assets/img/map_star.png'

export default {
  title() {
    return '售点拓展-店铺画像'
  },
  data() {
    return {
      // 左侧过滤面板是否显示
      leftFilterBoardShow: true,
      // orgId(可能是全局的)
      org_id: '',
      // 初始化地图以及画像数据
      filter_obj: {
        // 组织id
        orgId: '',
        // 仅仅为左侧面板的门店所在地区分布初始化第一次而用，来获取顶级层级值
        parentOrgId: '',
        // 店群Id
        storesId: '',
        // 店铺类型：种子门店-seed_store，商机门店-opportunity_store
        storeType: '',
        // 为门店类型分类下钻而配置字段
        level: ''
      },
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
      // 当前被触发的店铺辐射范围
      current_store_polygon: '',
      // 当前被触发的店铺的详情数据（不包括echarts折线图）
      current_store_info: '',
      // 是否打开组织边界
      is_active_org_boundary: true,
      // 是否打开行政边界
      is_active_gov_boundary: false,
      // 是否显示辐射范围开关
      is_show_range_boundary: false,
      // 是否打开辐射范围
      is_open_range_boundary: false,
      // 是否显示热力图
      is_show_heat: true,
      // 是否打开热力
      is_open_heat: false,
      // 热力对象
      heat_map_obj: '',
      // --------左侧画像面板 || 全屏画像面板-----------
      // 门店地区分布
      region_datas: {},
      // TGI等
      tgi_datas: {},
      // 标签分布
      label_datas: {},
      // 门店总量
      stores_count_datas: {},
      cluster_obj: '',
      highlight_marker: '', //maker高亮
      inforWindow: '',
      zoom: 0, //地图层级
      level: 0, //层级
      store_org: '', //点击marker,赋值origid
      administrationName: '', //点击marker.赋值城市名称
      markerData: [], //marker数据存储
      upMarkerList: [], //上层点位聚合
      lowMarkerLisr: [] //底层点位集合
    }
  },
  computed: {
    // 右上角全局搜索的orgId
    search_org_id() {
      return this.$store.state.map.orgCheckId
    },
    zooms() {
      return this.map_obj.getZoom()
    }
  },
  components: {
    Map,
    LeftChartBoard,
    FullChartBoard,
    StoreDetailBoard,
    LegendIconBoard,
    LegendCtrlBoard,
    ShowUpPanel,
    ExportTable
  },
  watch: {
    // 监听右上角全局搜索后的orgId是否发生变化
    search_org_id(new_org_id) {
      this.filter_obj.orgId = new_org_id
      this.updateRouteQuery()
    },
    zoom(val, oldVal) {
      let _this = this
      if (val !== oldVal) {
        if (_this.highlight_marker) {
          _this.highlight_marker.setMap(null)
        }
        _this.is_show_store_detail = false
      }
    }
  },
  mounted() {
    // 初始化路由参数，并初始化左侧面板和地图数据

    this.initFilterObj(this.$route.query)
    this.$store.dispatch('map/setMapSearchIcon', true)
    this.$store.dispatch('map/setMapOrganization', true)
    this.$store.dispatch('map/setOrganizationDisabled', true)
  },
  methods: {
    openFullScreen() {
      this.$refs.fullScreenDashboard.fullScreen()
    },
    /**
     * @description 获取路由query参数，初始化左侧过滤面板，注意这里从路由拿数据都是字符串，如果是'1,2,3'结构需要转换为数值数组
     * @param {object} route_query url上的路由query参数
     */
    initFilterObj(route_query) {
      // 首先从路由query获取参数，如果没有（没有就说明是第一次进入）从则从session（登陆者信息）取，如果还没有则默认为江苏
      if (route_query.orgId) {
        this.filter_obj.orgId = route_query.orgId
        this.filter_obj.parentOrgId = route_query.orgId
      } else if (this.$cookies.get('orgId')) {
        this.filter_obj.orgId = this.$cookies.get('orgId')
        this.filter_obj.parentOrgId = this.$cookies.get('orgId')
      } else {
        this.filter_obj.orgId = '5074727057550190748'
        this.filter_obj.parentOrgId = '5074727057550190748'
      }
      // 获取店群ID
      this.filter_obj.storesId = route_query.storesId
      // 获取店群类型
      this.filter_obj.storeType = route_query.storeType
      // 初始化地图数据
      this.getMapStoreData(this.filter_obj.storesId)
      // 初始化左侧面板数据
      this.getChartsData(this.filter_obj)
      // //初始化组织边界
      this.getOrBoundary()

      //初始化level值
      this.level = 1
    },

    /**
     * @description 从Map组件获取地图对象
     * @param { object } map_obj
     */
    getMapObj(map_obj) {
      this.map_obj = map_obj
      this.map_obj.on('zoomend', () => {
        this.zoom = this.map_obj.getZoom()
      })
    },

    /**
     * @description 获取店群画像所有数据 => 全屏和左侧面板
     * @param { object } query_obj:{orgId,storesId,storeType}
     */
    getChartsData(query_obj) {
      // 获取门店总量
      BUSINESS_EXP_DASHBOARD_API.get_stores_count(query_obj).then(res => {
        this.stores_count_datas = res
      })
      // 获取TGI
      BUSINESS_EXP_DASHBOARD_API.get_dash_TGI(query_obj).then(res => {
        this.tgi_datas = res
      })
      // 获取门店所在地区分布
      BUSINESS_EXP_DASHBOARD_API.get_dash_region(query_obj).then(res => {
        this.region_datas = res
      })
      // 获取标签分布
      BUSINESS_EXP_DASHBOARD_API.get_dash_label(query_obj).then(res => {
        this.label_datas = res
      })
    },

    /**
     * @description API获取地图数据（区域 || 店铺）
     * @param { object } params 只需要orgId即可
     */
    async getMapStoreData(params, obj) {
      if (this.cluster_obj) {
        this.cluster_obj.clearMarkers()
      }
      if (this.upMarkerList.length > 0) {
        this.upMarkerList.forEach(res => {
          res.setMap(null)
        })
      }
      if (this.lowMarkerLisr) {
        this.lowMarkerLisr = []
      }
      if (this.markerData) {
        this.markerData = []
      }

      let qList = {}
      if (this.level === 0) {
        qList = {
          storesId: params
        }
      } else if (this.level === 3 || this.level === 4) {
        if (this.filter_obj.storeType === 'seed_store') {
          qList = {
            storesId: params,
            orgId: this.store_org
          }
        } else {
          qList = {
            storesId: params,
            administrationName: obj.orgName
          }
        }
      }
      let res = await BUSINESS_EXP_DASHBOARD_API.get_Store_List(qList)
      this.$store.dispatch('map/setSearchType', [
        'map',
        'org',
        this.$route.query.storeType
      ])
      if (res.data) {
        // 添加当前组织 orgName 到右上角的搜索模块以显示
        if (res.data.orgName) {
          this.$store.dispatch('map/setOrganizationName', res.data.orgName)
        }
        this.$store.dispatch('map/setOrganizationId', res.data.orgId)
        // 清空地图所有标记
        this.map_obj.clearMap()
        // 如果有海量massMarker则清空，因为上面的方法无法清空！
        if (this.mass_markers_obj) {
          this.mass_markers_obj.clear()
          this.mass_markers_obj = null
        }
        // 每次都要初始化清空所有数据
        this.marker_arr = null
        this.marker_arr = []
        if (this.marker_arr.length > 0) {
          this.map_obj.remove(this.markerList)
        }
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
        // 初始化控制面板所有参数(打开组织边界)
        this.is_active_org_boundary = true
        // 如果打开了行政边界，则调用接口，因为前面已经清空地图了
        if (this.is_active_gov_boundary) {
          this.getGovBoundary()
        }
        // 如果是最后一个所层级（leafNode:true）,则对所有点以massMarker处理，否则则认为是所以上层级用GEOJson处理
        // if (res.extData.leafNode) {
        // 显示辐射范围按钮
        this.is_show_range_boundary = true
        // 如果已经打开了辐射范围按钮
        if (this.is_open_range_boundary) {
          // 调用接口
          let params = JSON.parse(JSON.stringify(params))
          // 因为售点拓展的辐射范围不需要storeType，所以设置为''
          params.storeType = ''
          this.getStoresRangeBoundary(params)
        }
        // 将原数据字符串转化为对象数组，注意：只有最后一个是polygon其它都为marker
        let data_list = res.data.storesStoreVOList
        console.log(data_list)
        // 初始化长度
        let length = data_list.length
        //给markerdata赋值
        this.markerData = data_list.slice(1, length)
        console.log(this.level)
        // 循环获取marker和marker的样式数组
        if (this.filter_obj.storeType === 'seed_store') {
          console.log(this.level)
          if (this.level !== 3) {
            for (let i = 0; i < length; i++) {
              if (this.level == data_list[i].level) {
                this.setUpMarker(data_list[i])
              }
            }
          } else {
            for (let i = 0; i < length; i++) {
              this.setLowMarker(data_list[i])
            }
          }
        } else {
          console.log(this.level)
          if (this.level !== 4) {
            for (let i = 0; i < length; i++) {
              if (this.level == data_list[i].level) {
                this.setUpMarker(data_list[i])
              }
            }
          } else {
            for (let i = 0; i < length; i++) {
              this.setLowMarker(data_list[i])
            }
          }
        }

        // 自适应覆盖物缩放层级
        setTimeout(() => {
          this.map_obj.setFitView()
        }, 1000)
      }
    },

    /**
     * @description 最底层点位
     * @param {string}
     */
    setLowMarker(data) {
      console.log(data)
      let markerDom = new AMap.Marker({
        position: [data.lng, data.lat],
        offset: new AMap.Pixel(-10, -10),
        zIndex: 199,
        icon: new AMap.Icon({
          image: data.icon,
          size: new AMap.Size(25, 25),
          imageSize: new AMap.Size(25, 25)
        }),
        extData: data.storeId
      })
      markerDom.on('click', async e => {
        let HTMLElement = document.getElementById('main_customers')
        this.is_show_store_detail = false
        // 如果不存在高亮对象
        if (!this.highlight_marker) {
          this.highlight_marker = new AMap.Marker({
            position: e.target.getPosition(),
            offset: new AMap.Pixel(-10, -10),
            zIndex: 198,
            content:
              '<div style="width:25px;height:25px;border-radius:50%;box-shadow:0px 0px 4px 4px #FF9900"></div>'
          })
        }

        this.highlight_marker.setPosition(e.target.getPosition())
        this.highlight_marker.setMap(this.map_obj)
        //设置中心点
        this.map_obj.setCenter(e.target.getPosition())
        console.log(this.store_id, e.target.getExtData())
        if (this.store_id === e.target.getExtData()) {
          this.inforWindow.open(this.map_obj, e.target.getPosition())
          this.is_show_store_detail = true
        } else {
          let re = await BUSINESS_EXP_DASHBOARD_API.get_store_detail({
            storeId: e.target.getExtData(),
            storesId: this.filter_obj.storesId
          })
          if (re) {
            this.current_store_info = re
            this.store_id = e.target.getExtData()
            // 显示详情面板
            this.inforWindow = this.$refs.mapContainer.drawInfoWindow({
              HTMLElement: HTMLElement,
              offset: new AMap.Pixel(30, -160),
              anchor: 'top-left'
            })
            // 弹出客户详情
            console.log(e.target.getPosition())
            this.inforWindow.open(this.map_obj, e.target.getPosition())
            this.is_show_store_detail = true
          }
        }
      })
      // markerDom.setPosition(e.target.getPosition())
      markerDom.setMap(this.map_obj)
    },

    /**
     * @description 上层点位
     * @param {string}
     */
    setUpMarker(data) {
      // 创建纯文本标记

      if (this.filter_obj.storeType === 'seed_store') {
        this.store_org = data.orgId
      } else {
        this.administrationName = data.orgName
      }
      let size = data.num.toString().length * 15 + 'px'
      let text = new AMap.Text({
        text: data.num,
        anchor: 'center', // 设置文本标记锚点
        draggable: true,
        cursor: 'pointer',
        style: {
          width: size,
          padding: '8px',
          height: size,
          'border-radius': '50%',
          'background-color': 'hsla(12,86%,50%,0.8)',
          'border-width': 0,
          'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
          'text-align': 'center',
          'line-height': size,
          'font-size': '20px',
          color: '#fff'
        },
        position: [data.lng, data.lat],
        extData: data
      })
      text.on('click', async e => {
        //设置中心点

        if (this.upMarkerList.length > 0) {
          this.upMarkerList.forEach(res => {
            res.setMap(null)
          })
        }
        let textData = e.target.getExtData()
        console.log(textData)
        this.level++
        console.log(this.level)

        if (this.filter_obj.storeType === 'seed_store') {
          if (textData.level === 1) {
            if (this.markerData.length > 0) {
              for (let i = 0; i < this.markerData.length; i++) {
                console.log(
                  this.markerData[i].level === this.level,
                  this.markerData[i].level,
                  this.level
                )
                if (this.markerData[i].level === this.level) {
                  console.log(this.markerData[i])
                  this.setUpMarker(this.markerData[i])
                }
              }

              this.map_obj.setZoom(9)
            } else {
              this.getMapStoreData(this.filter_obj.storesId)
            }
          } else {
            console.log(this.level)
            this.getMapStoreData(this.filter_obj.storesId, textData)
          }
        } else {
          if (textData.level === 1 || textData.level === 2) {
            if (this.markerData.length > 0) {
              for (let i = 0; i < this.markerData.length; i++) {
                console.log(
                  this.markerData[i].level === this.level,
                  this.markerData[i].level,
                  this.level
                )
                if (this.markerData[i].level === this.level) {
                  console.log(this.markerData[i])
                  this.setUpMarker(this.markerData[i])
                }
              }

              this.map_obj.setZoom(9)
            } else {
              this.getMapStoreData(this.filter_obj.storesId)
            }
          } else {
            console.log(this.level)
            this.getMapStoreData(this.filter_obj.storesId, textData)
          }
        }
      })

      text.setMap(this.map_obj)
      this.upMarkerList.push(text)
      console.log(this.upMarkerList)
    },

    /**
     * @description 聚合背景颜色
     * @param {string} storesId
     */
    renderClusterMarker(MarkerNum) {
      let _this = this
      console.log(MarkerNum.toString())
      let bgColorJson = {
        bgColor: 'hsla(12,86%,50%,0.7)',
        borderColor: 'hsla(12,86%,50%,0.7)'
      }
      let _renderClusterMarker = function(context) {
        var div = document.createElement('div')
        var bgColor = bgColorJson.bgColor
        var fontColor = 'hsla(0,0%,0%,1)'
        var borderColor = bgColorJson.borderColor
        div.style.width = div.style.height = div.style.lineHeight =
          MarkerNum.toString().length * 7 * 2 + 'px'
        div.style.backgroundColor = bgColor
        div.style.border = 'solid 1px ' + borderColor
        div.style.borderRadius = MarkerNum.toString().length * 7 + 'px'
        div.style.boxShadow = '0 0 1px ' + bgColorJson.borderColor
        div.innerHTML += _this.formatterThousandSeperator(context.count)
        div.style.color = fontColor
        div.style.fontFamily = 'AvenirNext-Bold,AvenirNext'
        div.style.fontSize = '14px'
        div.style.textAlign = 'center'
        context.marker.setContent(div)
      }
      return _renderClusterMarker
    },

    /**
     * @description 获取行政边界
     * @param {string} storesId
     */
    async getGovBoundary() {
      let res = await BUSINESS_EXP_DASHBOARD_API.get_map_gov_by_org_id({
        storesId: this.filter_obj.storesId
      })
      if (res) {
        let polygon_geo_obj = new AMap.GeoJSON({
          geoJSON: JSON.parse(res),
          getPolygon: (geo_json, lng_lat) => {
            let polygon_obj = new AMap.Polygon({
              path: lng_lat,
              zIndex: 1,
              strokeColor: '#FF9900',
              strokeOpacity: 1,
              strokeWeight: 2,
              fillColor: '#FF9900',
              fillOpacity: 0.2
            })
            this.polygon_gov_arr.push(polygon_obj)
            return polygon_obj
          }
        })
        polygon_geo_obj.setMap(this.map_obj)
      }
    },
    /**
     * @description 获取组织边界
     * @param {string} storesId
     */
    async getOrBoundary() {
      let res = await BUSINESS_EXP_DASHBOARD_API.get_map_store_by_tags({
        storesId: this.filter_obj.storesId
      })
      if (res.data) {
        const orgStyle = res.data.gtmOrgStyle
        let polygon_geo_obj = new AMap.GeoJSON({
          geoJSON: JSON.parse(res.data.orgBoundary),
          getPolygon: (geo_json, lng_lat) => {
            let polygon_obj = new AMap.Polygon({
              path: lng_lat,
              zIndex: 1,
              strokeColor: orgStyle.borderColor
                ? orgStyle.borderColor
                : '#A634EF',
              strokeOpacity: orgStyle.drawingOpacity
                ? orgStyle.drawingOpacity / 100
                : 1,
              strokeWeight: orgStyle.borderSize ? orgStyle.borderSize : 2,
              fillColor: orgStyle.color ? orgStyle.color : '#5CADFF',
              fillOpacity: 0.2
            })
            this.polygon_org_arr.push(polygon_obj)
            return polygon_obj
          }
        })
        polygon_geo_obj.setMap(this.map_obj)
      }
    },

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
              fillOpacity: 0.2
            })
            return polygon_obj
          }
        })
        this.current_store_polygon.setMap(this.map_obj)
      }
    },

    /**
     * @description 是否打开热力图
     */
    isOpenHeat() {
      this.is_open_heat = !this.is_open_heat
      if (this.is_open_heat) {
        this.map_obj.setZoom(13)
        if (this.heat_map_obj) {
          this.heat_map_obj.show()
        } else {
          // 调用接口
          this.getHeatMap(this.filter_obj.orgId)
        }
      } else {
        if (this.heat_map_obj) {
          this.heat_map_obj.hide()
        }
      }
    },

    /**
     * @description 获取热力图数据
     * @param { object } org_id 当前所的orgId
     */
    async getHeatMap(org_id) {
      let res = await BUSINESS_NAVIGATION_API.get_stores_heat({ orgId: org_id })
      if (res) {
        this.map_obj.plugin(['AMap.Heatmap'], () => {
          //初始化heatmap对象
          this.heat_map_obj = new AMap.Heatmap(this.map_obj, {
            radius: 100, //给定半径
            opacity: [0, 0.6],
            // gradient: {
            //   0.5: '#2c7bb6',
            //   0.65: '#abd9e9',
            //   0.7: '#ffffbf',
            //   0.85: '#fde468',
            //   1.0: '#d7191c'
            // },
            zooms: [13, 14]
          })
          //设置数据集
          this.heat_map_obj.setDataSet({
            data: res
            // max: 500
          })
        })
      }
    },

    /**
     * @description 关闭店铺详情回调函数
     */
    closeStoreDetailBoard() {
      this.is_show_store_detail = false
      this.inforWindow.close()
    },

    /**
     * @description 关闭左侧面板回调函数
     */
    closeLeftFilterBoard(val) {
      this.leftFilterBoardShow = val
    },

    /**
     * @description 打开左侧面板回调函数
     */
    openLeftFilterBoard(val) {
      this.leftFilterBoardShow = val
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
     */
    updateRouteQuery() {
      // 修改路由url参数
      this.$router.replace({ path: this.$route.path, query: this.filter_obj })
      // 初始化地图数据
      this.getMapStoreData(this.filter_obj.storesId)
      // 初始化画像数据
      this.getChartsData(this.filter_obj)
    },

    /**
     * @description 是否显示行政边界
     */
    isActiveGovBoundary() {
      this.is_active_gov_boundary = !this.is_active_gov_boundary
      if (this.is_active_gov_boundary) {
        if (this.polygon_gov_arr.length > 0) {
          this.polygon_gov_arr.forEach(item => {
            item.show()
          })
        } else {
          this.getGovBoundary()
        }
      } else {
        this.polygon_gov_arr.forEach(item => {
          item.hide()
        })
      }
    },

    /**
     * @description 是否显示组织边界
     */
    isActiveOrgBoundary() {
      this.is_active_org_boundary = !this.is_active_org_boundary
      if (this.is_active_org_boundary) {
        if (this.polygon_org_arr.length > 0) {
          this.polygon_org_arr.forEach(item => {
            item.show()
          })
        } else {
          this.getOrBoundary()
        }
      } else {
        this.polygon_org_arr.forEach(item => {
          item.hide()
        })
      }
    },

    /**
     * @description 是否打开店铺辐射范围
     */
    isOpenRangeBoundary() {
      this.is_open_range_boundary = !this.is_open_range_boundary
      if (this.is_open_range_boundary) {
        if (this.polygon_stores_range_arr.length > 0) {
          this.polygon_stores_range_arr.forEach(item => {
            item.show()
          })
        } else {
          // 调用接口
          let params = JSON.parse(JSON.stringify(this.filter_obj))
          // 因为售点拓展的辐射范围不需要storeType，所以设置为''
          params.storeType = ''
          this.getStoresRangeBoundary(params)
        }
      } else {
        if (this.polygon_stores_range_arr.length > 0) {
          this.polygon_stores_range_arr.forEach(item => {
            item.hide()
          })
        }
      }
    },

    /**
     * @description 获取辐射范围并渲染
     * @param { object } params 查询参数包含所有过滤字段
     */
    async getStoresRangeBoundary(params) {
      let res = await BUSINESS_NAVIGATION_API.get_stores_range(params)
      if (res) {
        let polygon_stores_range_geo_obj = new AMap.GeoJSON({
          geoJSON: JSON.parse(res),
          getPolygon: (geo_json, lng_lat) => {
            let polygon_obj = new AMap.Polygon({
              path: lng_lat,
              zIndex: 4,
              strokeColor: '#FF9900',
              strokeOpacity: 1,
              strokeWeight: 2,
              fillColor: '#FF9900',
              fillOpacity: 0.2
            })
            this.polygon_stores_range_arr.push(polygon_obj)
            return polygon_obj
          }
        })
        polygon_stores_range_geo_obj.setMap(this.map_obj)
      }
    },

    /**
     * @description 千分位分割格式化
     */
    formatterThousandSeperator(num) {
      let res = num.toString().replace(/\d+/, function(n) {
        // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, function($1) {
          return $1 + ','
        })
      })
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
// 对于非地图内部用scoped
.bn-index {
  position: relative;
  display: flex;
  width: 100%;
  color: #ffffff;
  flex-direction: row-reverse;
}
div {
  box-sizing: border-box;
}
</style>
<style lang="scss">
#business_exp_map_containers {
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
// 对于地图内部的maker样式特别处理，不用scoped
.mapContainer {
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
