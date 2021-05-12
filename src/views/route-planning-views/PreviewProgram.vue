<template>
  <div class="planpreview">
    <div class="mapstyle">
      <div id="newMapbox"></div>
      <MapTopOperate v-if="mapSearchIcon"></MapTopOperate>
      <MapSearch v-if="mapSearch" :AMap="newAMap" :map_obj="AMap"></MapSearch>
      <Organization v-if="mapOrganization"></Organization>
    </div>
    <LeftControlMenu
      v-if="programId && haveThis"
      :programId="programId"
      @handlerChange="handlerChange"
      @getMapOptions="getMapOptions"
      :DawerText="DawerText"
      :hideMapData="hideMapData"
      :AMap="AMap"
      :newAMap="newAMap"
      :drawTools="drawTools"
      :isPlan="isPlan"
      :edit="edit"
      :AllControl="AllControl"
      :ControlFunctionMutex="ControlFunctionMutex"
      :VisitDetial="VisitDetial"
      :drawBorders="drawBorders"
      :CoverDataArr="CoverDataArr"
      :LineDataArr="LineDataArr"
      :NameDataArr="NameDataArr"
      :PositionDataArr="PositionDataArr"
      :dawAreaArr="dawAreaArr"
      :OutLineDataArr="OutLineDataArr"
      :PathDataArr="PathDataArr"
      :Refreshoverview='Refreshoverview'
      ref="LeftControl"
    ></LeftControlMenu>
    <TopMeau
      ref="topMeau"
      v-if="haveThis"
      :ServiceButton="ServiceButton"
      :edit="edit"
      :programId="programId"
      @changePoint="changePoint"
      @changeStores="changeStores"
      @changeDay="changeDay"
      @getstarPoint="getstarPoint"
      :AllControl="AllControl"
      :ControlFunctionMutex="ControlFunctionMutex"
    ></TopMeau>
    <OverviewData
      v-if="showOverview"
      @handlerChange="handlerChange"
      :programId="programId"
      :isPlan="isPlan"
      ref="OverviewData"
    ></OverviewData>
    <PointSelectData
      v-if="showPointSelect"
      :tableData="pointSelectList"
    ></PointSelectData>
    <UnusualStores v-if="showUnusualStores"></UnusualStores>
    <CustomerDetails
      :programId="programId"
      :closeWinow="closeWinow"
      :showCustomer="showCustomer"
      :storeData="storeData"
      :AMap="AMap"
      :newAMap="newAMap"
      :ServiceButton="ServiceButton"
      :edit="edit"
      :colseClick="colseClick"
      :organizationId="organizationId"
      :storeAdjChild ='this.$refs.storeAdjChild'
      ref="Customer"
    ></CustomerDetails>
    <span class="titlebox" v-if="drawerea">在地图上左键点击开始画多边形</span>
    <ServiceDay
      :programId="programId"
      :areaId="areaId"
      :storeDay="storeDay"
      :showDayModel="showDayModel"
      :hidePointStroke="hidePointStroke"
      :getPointStroke="getPointStroke"
      @getNowServerDay="getNowServerDay"
      @setServiceEdit="setServiceEdit"
      @changeDay="changeDay"
      v-show="showDayModel"
    ></ServiceDay>
    <MapLegend />
    <!--门店调整-->
    <StoreAdjustment
      ref="storeAdjChild"
      :AMap="AMap"
      :whetherStoreEdit="whetherStoreEdit"
      :editStoreLng="editStoreLng"
      :programId="programId"
    />
  </div>
</template>
<script>
import Api from '@api/route/planpreview_api.js'
import { AMap } from '@/plugins/AMap' // 引入地图组件
import LeftControlMenu from './components/LeftControlMenu/Index' // 左侧悬浮操作菜单
import CustomerDetails from './components/CustomerDetails' // 门店详情
import TopMeau from './components/TopMeau' // 头部二级导航
import MapLegend from './components/mapLegend' // 图例组件
import OverviewData from './components/OverviewData/Index' // 数据总览
import PointSelectData from './components/PointSelectData/Index' // 批量选点
import UnusualStores from './components/UnusualStores/Index' // 异动门店
import ServiceDay from './components/ServiceDay' // 服务日调整弹框
import StoreAdjustment from './components/StoreAdjustment' //
import fangimg from '@assets/img/fang.png'
import sanjiaoimg from '@assets/img/sanjiao.png'
import clientimg from '@assets/img/client_cricle.png'
import MapTopOperate from '@/components/MapTopOperate'
import MapSearch from '@/components/MapSearch'
import Organization from '@/components/Organization'

import { mapGetters } from 'vuex'
import * as turf from '@turf/turf'
export default {
  name: 'PlanPreview',
  title() {
    return ''
  },
  data() {
    return {
      editStoreLng: '', // 编辑门店经纬度
      newAMap: '',
      AMap: '',
      showOverview: false,
      showPointSelect: false,
      showUnusualStores: false,
      drawerea: false,
      showDayModel: false,
      showCustomer: false,
      showAction: false,
      dawAreaArr: new Map(), //地图绘制区域
      PositionDataArr: new Map(), //地图位置数组
      LineDataArr: new Map(), // 地图边界线数组
      CoverDataArr: new Map(), // 地图面数组
      NameDataArr: new Map(), // 地图图标名称数组
      OutLineDataArr: new Map(), // 地图边框数组
      PathDataArr: new Map(), //路线数组
      AllControl: new Map(),
      PointStroke: new Map(), // 点位描边
      pathDataList: [],
      pointMouseTool: null,
      PolyEditorList: [],
      programId: null,
      storeData: null,
      areaId: null,
      drawTools: null,
      edit: null,
      isPlan: null,
      whetherStoreEdit: false, // 是否可门店调整操作
      planDataArr: null,
      storeDay: null,
      serverDataList: [],
      serviceEdit: true,
      map_ranging: {},
      haveThis:false,
      starPoint:false
    }
  },
  components: {
    LeftControlMenu,
    CustomerDetails,
    TopMeau,
    MapLegend,
    OverviewData,
    PointSelectData,
    UnusualStores,
    ServiceDay,
    StoreAdjustment,
    MapTopOperate,
    MapSearch,
    Organization
  },
  computed: {
    ...mapGetters('routerPlanning', [
      'ServiceButton',
      'operationalService',
      'jobLayer', // 图例 岗位
      'mapViewId',
      'showIds',
      'pointVal',
    ]),
    ...mapGetters('map', [
      'organizationId',
      'mapStyle',
      'mapHidden',
      'mapSearch',
      'mapSearchIcon',
      'mapRanging',
			'mapScale',
      'mapOrganization'
      ])
  },
  created() {
    //判断是否为首次打开计划预览
    const OpenStatus = sessionStorage.getItem("nowOpenStatus");
    if(OpenStatus === '1') {
      //不是首次，自动重刷，并清空记录
      window.location.reload()
      sessionStorage.setItem("nowOpenStatus", null)
    } else {
      //首次打开，记录一下
      sessionStorage.setItem("nowOpenStatus", 1)
    }
    this.init()
  },
  mounted() {
    this.newAMap = AMap
    this.CreatMap()
		this.mapScaleTool()  // 比例尺
    const { planId, planName, edit, planAhead } = this.$route.query
    this.programId = planId
    this.planName = planName
    this.isPlan = planAhead
    if (edit === 'true') {
      this.edit = true
    } else {
      this.edit = false
    }
    this.getControlStatus(true)
    this.$store.dispatch('map/setSearchType', ['map', 'org'])
  },
  watch: {
    mapStyle(val) {
      this.AMap.setMapStyle(val)
    },
    mapRanging(val) {
      if (val == 'open') {
        this.mapRangingTool()
      } else {
        if (this.map_ranging) {
          this.map_ranging.turnOff()
        }
      }
    },
    mapHidden(val) {
      if (val) {
        this.AMap.setFeatures([])
      } else {
        this.AMap.setFeatures(['bg', 'road', 'point'])
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      const { planId, planName } = vm.$route.query
      vm.$store.commit('addTabs', {
        title: planName,
        link: decodeURIComponent(vm.$route.fullPath),
        on: true,
        needCatch: true
      })
      vm.$store.commit('routerPlanning/SET_MAP_VIEW_ID', planId)
    })
  },
  methods: {
        init() {
      Api.get_check_HavePlan({
        planId: this.$route.query.planId,
        isMainPlan: this.$route.query.planAhead ==='true'
      })
      .then(res => {
        if (JSON.stringify(res.data)==='false' && res.code == 200) {
          this.$message({ message: '计划不存在', type: 'warning' })
          setTimeout(()=>{
            this.haveThis = false
            const newPages = JSON.parse(sessionStorage.getItem('pages'))
            const newitem = newPages.filter(item=>item.pam.planId == this.$route.query.planId)
            if (newitem.length > 0) {
              let obj = newitem[0]
              let clc = {
                path: obj.path,
                pam: obj.pam
              }
              let current = {
                path: this.$route.path,
                pam: this.$route.query
              }
              this.$nextTick(() => {
                this.$store.commit('closeTabs', {
                  clc,
                  current
                })
              })
              return
            }
          },2000)
        } else {
          this.haveThis = true
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    // 构造地图容器
    CreatMap() {
      let mapObj = new this.newAMap.Map('newMapbox', {
        resizeEnable: true, //自适应大小
        center: [102.488269, 37.046516],
        zoom: 10 //初始视窗
      })
      this.AMap = mapObj
      mapObj.on('complete', function() {
        console.log('地图加载成功')
      })
    },
    // 显示数据总览
    handlerChange(value) {
      this.showOverview = value
    },
    // 调用数据总览
    Refreshoverview(){
      if(this.$refs.OverviewData){
        this.$refs.OverviewData.Refreshoverview()
      }
    },
    // 绘制地图数据
    async getMapOptions(listData, type) {
      let data = listData.value && listData.value
      let newKey = listData.key && listData.key
      let mapResult // 储存绘制结果
      if (JSON.stringify(listData) !== '{}' && JSON.stringify(data) !== '{}') {
        switch (type) {
          case 'LineData':
            // 绘制边界
            mapResult = await this.drawBorders(data)
            mapResult = mapResult.borderPolygonArr
            // this.AMap.setFitView()
            this.LineDataArr.set(newKey, mapResult)
            this.hideMapData()
            mapResult = null
            break
          case 'OutLineData':
            {
              // 绘制边界描边
              mapResult = await this.drawBorders(data[0])
              let outlinmapResult = await this.drawBorders(data[1])
              mapResult = mapResult.borderPolygonArr
              outlinmapResult = outlinmapResult.borderPolygonArr
              this.OutLineDataArr.set(newKey, {
                value: mapResult,
                newvalue: outlinmapResult,
                type: 'OutLineData'
              })
              this.hideMapData()
              mapResult = null
              outlinmapResult = null
            }
            break
          case 'CoverData':
            // 绘制区域底色
            mapResult = await this.drawBorders(data)
            mapResult = mapResult.borderPolygonArr
            this.CoverDataArr.set(newKey, mapResult)
            mapResult = null
            break
          case 'NameData':
            // 绘制区域名称
            data.offset = new this.newAMap.Pixel(0, 0)
            mapResult = await this.drawNames(data)
            this.AMap.setFitView()
            this.NameDataArr.set(newKey, mapResult)
            this.hideMapData()
            mapResult = null
            break
          case 'PathData': {
            // 绘制路线
            let newDataValue = []
            data.forEach(item => {
              mapResult = this.drawBorders(item)
              mapResult = mapResult.borderPolygonArr
              if(mapResult[0]){
                newDataValue[item.serviceDay] = mapResult[0]
              }
            })
            this.PathDataArr.set(newKey, newDataValue)
            mapResult = null
            }
            break
          case 'PositionData':
            {
              const { gdLat, gdLng } = data
              const newposition = [Number(gdLng), Number(gdLat)]
              // 绘制位置
              let marker = new this.newAMap.Marker({
                icon:
                  '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
                position: newposition,
                offset: new this.newAMap.Pixel(-13, -30)
              })
              marker.setMap(this.AMap)
              this.PositionDataArr.set(newKey, marker)
            }
            break
          case 'dawArea':
            {
              // 绘制区域调整图层
              mapResult = await this.dawMouseTool(listData)
              this.drawTools = mapResult
            }
            break
          case 'nowDreawData':
            {
              // 绘制边界描边
              let OutlinemapResult = await this.drawBorders(data[0])
              OutlinemapResult = OutlinemapResult.borderPolygonArr
              let mapResult = await this.drawBorders(data[1])
              mapResult = mapResult.borderPolygonArr
              this.dawAreaArr.set(newKey, { mapResult, OutlinemapResult })
              mapResult = null
              OutlinemapResult = null
            }
            break
          default:
            break
        }
      }
    },
    drawBorders(options) {
      let _this = this
      // 如果没有数据则终止运行
      if (!options.data) {
        console.warn('/** 没有拿到--绘制边界数据-- **/')
        return
      }
      // 初始化绘制边界元数据，最后返回
      const source_data = {
        // GeoJson数据和区域id构成的数据
        borderPolygonArr: [],
        // 边界区域数组
        PolygonArr: []
      }
      // 默认配置
      const defaultOption = {
        // 覆盖物层级，后面的覆盖前面的，默认10
        zIndex: 10,
        // 边界的透明度，范围(0,1)
        strokeOpacity: 1,
        // 边界颜色
        strokeColor: '#fff',
        // 边界宽度，单位像素
        strokeWeight: 1,
        // 边界样式：虚线,实线,dashed || solid
        strokeStyle: 'solid',
        // 区域透明度，范围(0,1)
        fillOpacity: '',
        // 区域填充颜色
        fillColor: '',
        // 鼠标悬停样式
        cursor: 'pointer',
        // 是否将操作冒泡到地图上
        bubble: true,
        // 区域是否可拖拽
        draggable: false
      }
      let length = options.data.length

      for (let i = 0; i < length; i++) {
        (function(t) {
          let polygon = '',
            polyline = '',
            gdGeom = ''
          // 获取某一个数据
          const info = options.data[t]
          // 合并配置项(对象字面量会自动将下面的同字段覆盖)
          const option = {
            ...defaultOption,
            strokeColor: info.borderColor,
            strokeOpacity: info.borderColorOpacity,
            strokeWeight: info.borderWidth,
            ...options
          }
          // 获取GeoJSON数据并转化为对象
          gdGeom = JSON.parse(info.gdBoundarJson)
          // 实例化一个高德GeoJSON对象
          const geojson = new _this.newAMap.GeoJSON({
            geoJSON: gdGeom,
            getPolygon(geojson_data, lnglats) {
              // console.log('拿到的geo-json数据', geojson_data)
              // 实例化一个区域覆盖物对象
              polygon = new _this.newAMap.Polygon({
                // 经纬度数组
                path: lnglats,
                // 边界透明度
                strokeOpacity: option.strokeOpacity,
                // 边界颜色
                strokeColor: option.strokeColor,
                // 边界宽度
                strokeWeight: option.strokeWeight,
                // 边界样式：虚线,实线,dashed || solid
                strokeStyle: option.strokeStyle,
                // 区域透明度，范围(0,1)
                fillOpacity: option.fillOpacity,
                // 区域填充颜色
                fillColor: option.fillColor,
                // 层级
                zIndex: option.zIndex,
                // 是否将操作冒泡到地图上
                bubble: option.bubble,
                // 鼠标悬停样式
                cursor: option.cursor
              })
              // 如果有回调函数，注入当下的区域覆盖物对象
              if (options.callBack) {
                options.callBack(polygon, info)
              }
              //
              // source_data.PolygonArr.push(polygon)
              source_data.PolygonArr.push(polygon)
              return polygon
            },
            getPolyline(geojson_data, lnglats) {
              // console.log('拿到的geo-json数据', geojson_data)
              // 实例化一个区域覆盖物对象
              polyline = new _this.newAMap.Polyline({
                // 经纬度数组
                path: lnglats,
                // 边界透明度
                strokeOpacity: option.strokeOpacity,
                // 边界颜色
                strokeColor: option.strokeColor,
                // 边界宽度
                strokeWeight: option.strokeWeight,
                // 边界样式：虚线,实线,dashed || solid
                strokeStyle: option.strokeStyle,
                // 区域透明度，范围(0,1)
                fillOpacity: option.fillOpacity,
                // 区域填充颜色
                fillColor: option.fillColor,
                // 层级
                zIndex: option.zIndex,
                // 是否将操作冒泡到地图上
                bubble: option.bubble,
                // 鼠标悬停样式
                cursor: option.cursor
              })
              // 如果有回调函数，注入当下的区域覆盖物对象
              if (options.callBack) {
                options.callBack(polyline, info)
              }
              //
              // source_data.PolygonArr.push(polygon)
              source_data.PolygonArr.push(polyline)
              return polyline
            }
          })
          const eventMap = {
            geojson,
            id: info.id
          }
          source_data.borderPolygonArr.push(eventMap)
          // 将Geo-json对象画到地图上
          geojson.setMap(_this.AMap)
        })(i)
      }
      return source_data
    },
    
    /**
     * @description 地图搜索
     * @param {Object} options
     */
    placeSearch(options) {
      const defaultOptions = {
        pageSize: 10, // 单页显示结果条数
        pageIndex: 1, // 页码
        children: 1, // 是否按照层级展示子POI数据,默认0 children=1，展示子节点POI数据，children=0，不展示子节点数据
        city: '全国', // 兴趣点城市
        citylimit: true, // 是否强制限制在设置的城市内搜索
        map: this.AMap, // 展现结果的地图实例
        autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        type:
          '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施' // 兴趣点类别，多个类别用“|”分割，如“餐饮|酒店|电影院”
      }
      const setOptions = {
        ...defaultOptions,
        ...options
      }
      // 构造地点查询类
      const placeSearch = new this.newAMap.PlaceSearch(setOptions)

      return new Promise((resolve, reject) => {
        placeSearch.search(setOptions.keywords, (status, result) => {
          const returnResult = {
            resultData: result,
            placeSearchObj: placeSearch
          }
          if (status === 'complete') {
            resolve(returnResult)
          } else {
            reject(returnResult)
          }
        })
      })
      // 清除查询结果 -- 绘制在地图上的点
      // placeSearch.render.markerList.clear()
    },
		// 比例尺
		mapScaleTool() {
			let that = this
			that.AMap.plugin(["AMap.Scale"], function() {
				var scale = new that.newAMap.Scale({
					offset: new that.newAMap.Pixel(1000, 25),
					zIndex: 2
				});
				that.AMap.addControl(scale);
			});
		},
		// 测距
    mapRangingTool() {
      var startMarkerOptions = {
        icon: new this.newAMap.Icon({
          size: new this.newAMap.Size(19, 31), //图标大小
          imageSize: new this.newAMap.Size(19, 31),
          image: 'https://webapi.amap.com/theme/v1.3/markers/b/start.png'
        })
      }
      var endMarkerOptions = {
        icon: new this.newAMap.Icon({
          size: new this.newAMap.Size(19, 31), //图标大小
          imageSize: new this.newAMap.Size(19, 31),
          image: 'https://webapi.amap.com/theme/v1.3/markers/b/end.png'
        }),
        offset: new this.newAMap.Pixel(-9, -31)
      }
      var midMarkerOptions = {
        icon: new this.newAMap.Icon({
          size: new this.newAMap.Size(19, 31), //图标大小
          imageSize: new this.newAMap.Size(19, 31),
          image: 'https://webapi.amap.com/theme/v1.3/markers/b/mid.png'
        }),
        offset: new this.newAMap.Pixel(-9, -31)
      }
      var lineOptions = {
        strokeStyle: 'solid',
        strokeColor: '#FF33FF',
        strokeOpacity: 1,
        strokeWeight: 2
      }
      var rulerOptions = {
        startMarkerOptions: startMarkerOptions,
        midMarkerOptions: midMarkerOptions,
        endMarkerOptions: endMarkerOptions,
        lineOptions: lineOptions
      }
      this.AMap.plugin(['AMap.RangingTool'], () => {
        this.map_ranging = new this.newAMap.RangingTool(this.AMap, rulerOptions)
        this.map_ranging.turnOn()
      })
    },
    drawNames(options) {
      let _this = this
      if (!options.data) {
        console.warn('/** 没有拿到--绘制名称--数据 **/')
        return
      }
      // 地图Text类数组
      const nameArr = []
      const defaultOption = {
        draggable: false,
        cursor: 'pointer',
        angle: 0,
        zIndex: 900,
        title: '',
        clickable: true,
        nameKey: 'name',
        prefisso: '',
        bubble: true,
        offset: new _this.newAMap.Pixel(-13, -15)
      }
      const option = {
        ...defaultOption,
        ...options
      }
      let length = options.data.length
      for (let i = 0; i < length; i++) {
        if (
          options.data[i].gdLng ||
          options.data[i].storeLng ||
          options.data[i].storeAgencyLng
        ) {
          (function(t) {
            const eventMap = {}
            const info = options.data[t]
            let name = `${option.prefisso}${info[option.nameKey]}`
            if (!name) {
              name = info.tradeareaName
            }
            let textCenter
            if (info.storeLng && !info.gdLng) {
              textCenter = [info.storeLng, info.storeLat]
              info.id = info.storeId
              option.style = info.style
            } else if (info.storeAgencyLng && !info.gdLng) {
              textCenter = [info.storeAgencyLng, info.storeAgencyLat]
              info.id = info.agencyCode
              option.style = options.style
            } else if (info.gdLng) {
              textCenter = [info.gdLng, info.gdLat]
            }
            const map_text_obj = new _this.newAMap.Text({
              text: name,
              title: name,
              anchor: 'center',
              position: textCenter,
              draggable: option.draggable,
              cursor: option.cursor,
              angle: option.angle,
              style: option.style,
              zIndex: option.zIndex,
              offset: option.offset,
              extData: info
            })
            if (option.callBack) {
              option.callBack(map_text_obj, info)
            }
            info.DrawType = 'name'
            eventMap.id = info.id
            eventMap.text = map_text_obj
            nameArr.push(eventMap)
            map_text_obj.setMap(_this.AMap)
          })(i)
        }
      }
      return nameArr
    },
    /**
     * @description 绘制信息弹层
     * @param {Object} options
     */
    drawInfoWindow(options) {
      const defaultOptions = {
        autoMove: true,
        isCustom: true,
        offset: new this.newAMap.Pixel(1000, -95)
      }
      const setOptions = {
        ...defaultOptions,
        ...options
      }
      const infoWindow = new this.newAMap.InfoWindow({
        autoMove: setOptions.autoMove,
        isCustom: setOptions.isCustom,
        content: setOptions.HTMLElement,
        anchor: setOptions.anchor,
        offset: setOptions.offset,
        position: setOptions.position
      })
      infoWindow.setMap(this.map_obj)
      return infoWindow
    },
    /**
     * @description 绘制多边形覆盖物
     * @param {Object} options
     */
    dawMouseTool(options) {
      // 绘制多边形覆盖物
      const mouseTool = new this.newAMap.MouseTool(this.AMap)
      //监听draw事件可获取画好的覆盖物
      mouseTool.polygon({
        fillColor: options.color,
        fillOpacity: 0.1,
        strokeColor: options.color,
        strokeWeight: 2,
        strokeOpacity: 1,
        bubble: true,
        zIndex: 30
      })
      return mouseTool
    },
    // 关闭门店调整
    closeStoreEdit() {
      this.$refs.storeAdjChild.hide()
    },
    //操作门店详情，服务日调整，门店调整
    VisitDetial(data, type, list) {
      if(type!=='重叠的点'){
          this.getserviceData(data)
          this.getCustomeInfor(data, type)
          this.getSerVice(data, list)
      } else {
        this.openStoreDetail(data, type, '重叠的点')
        if(!this.serviceEdit) {
          this.$message({
            message: '请先完成操作中的服务日对调~',
            type: 'warning'
          })
        } else if (
          data &&
          this.serviceEdit &&
          !this.operationalService &&
          data.lnglat
        ) {
          this.openServiceDialog(data, list)
        }
      }
    },
    setServiceEdit(value) {
      this.serviceEdit = value
    },
    // // 移入移出显示点位标签
    getserviceData(item) {
      let onMark
      item &&
        item.on('mouseover', e => {
          let newLng, newserviceDayStr, newrepeatList
          if(e.data) {
            newLng = e.data.lnglat
            newserviceDayStr = e.data.serviceDayStr
            newrepeatList = e.data.repeatPointList
          } else {
            newLng = e.lnglat
            newserviceDayStr = e.target.w.extData.serviceDayStr
            newrepeatList = e.target.w.extData.repeatPointList
          }
          if (newserviceDayStr && !this.whetherStoreEdit && !newrepeatList){
            let newstyle = {
              padding: '3px 5px',
              display: 'block',
              position: 'absolute',
              top: '-22px',
              color: '#ffffff',
              'background-color': 'rgba(0, 0, 0, 0.8)',
              'border-radius': '6px'
            }
            onMark = new this.newAMap.Text({
              position: newLng,
              style: newstyle,
              offset: new this.newAMap.Pixel(0, 0),
              text: newserviceDayStr
            })
            this.AMap.add(onMark)
            if (onMark) {
              item &&
                item.on('mouseout', () => {
                  this.AMap.remove(onMark)
                })
            }
          }
        })
    },
    // 弹出门店详情弹框
    getCustomeInfor(item, type) {
      item &&
        item.on('click', e => {
          if (!this.AllControl.get('CustomerDetail') && !this.AllControl.get('startPoint')) {
            // 门店详情以及设置起始点都退出
            return
          }
          if (e) {
            if(!e.data) {
              // 兼容新售点分级添加数字的点位样式
              e.data = e.target.w.extData
              e.data.lnglat = e.lnglat
            }
          let newextData = e.data
          if (newextData.repeatPointList) {
            // 有重叠的点不能点，只能点击角标
            return
          } else {
            this.openStoreDetail(newextData, type)
          }
          }
        })
    },
    // 弹出门店详情框
    openStoreDetail(newextData, type, point){
      if (!this.AllControl.get('CustomerDetail') && !this.AllControl.get('startPoint')) {
        // 门店详情以及设置起始点都退出
        return
      }
      this.colseClick()
      const {
        storeCode,
        storeId,
        storeName,
        oldstoreLat,
        oldstoreLng,
        storeLat,
        storeLng,
        lnglat,
        precinctNo,
        areaId,
        serviceDay,
        rate,
        parentRate,
        routeId,
        serviceDayStr
      } = newextData
      let newrate
      // 设置地图上的点描边形状的参考值
      if(point==='重叠的点') {
        newrate = parentRate
      } else {
        newrate = rate
      }
      this.AMap.setCenter([storeLng, storeLat])
      let imgdata
      if (type !== 'dot' ) {
        if (serviceDay !== '-1' && this.pointVal!==0) {
          switch (newrate) {
            case '1':
              imgdata = clientimg
              break
            case '2':
              imgdata = fangimg
              break
            case '3':
              imgdata = sanjiaoimg
              break
          }
        } else {
          imgdata = clientimg
        }
      } else {
        imgdata = clientimg
      }
      let newOption = []
      if(type==='重叠的点') {
        newOption = [oldstoreLng, oldstoreLat]
      } else {
        newOption = [storeLng, storeLat]
      }
      const clickmarker = new this.newAMap.Marker({
        icon: imgdata,
        position: newOption,
        offset: new this.newAMap.Pixel(-21, -21),
        zIndex: 10
      })
      clickmarker.setMap(this.AMap)
      this.PointStroke.set('点位描边', clickmarker)
      this.storeData = {
        startPoint: this.starPoint, //可以设置起始点
        storeCode,
        storeId,
        storeName,
        storeLat,
        storeLng,
        precinctNo,
        areaId,
        serviceDay,
        routeId,
        serviceDayStr,
        type: 'Plan'
      }
      let infoWindow = this.drawInfoWindow({
        HTMLElement: document.getElementById('main_customer'),
        offset: new this.newAMap.Pixel(30, -100),
        anchor: 'top-left'
      })
      this.showCustomer = true
      // 弹出客户详情
      if(lnglat){
        infoWindow.open(this.AMap, lnglat)
      }
    },
    // 清空点描边
    colseClick() {
      this.PointStroke.forEach(item => {
        this.AMap.remove(item)
        this.PointStroke.delete(item)
      })
    },
    // 进行服务日调整
    getSerVice(item, list) {
      item &&
        item.on('click', e => {
          if(!e.data) {
            // 兼容新售点分级添加数字的点位样式
            e.data = e.target.w.extData
            e.data.lnglat = e.lnglat
          }
          let newextData = e.data
          if (
            e &&
            this.serviceEdit &&
            !this.operationalService &&
            e.data.serviceDay !== '-1' &&
            e.data.lnglat
          ) {
            if (newextData.repeatPointList) {
              // 有重叠的点不能点，只能点击角标
              return
            } else {
              this.openServiceDialog(newextData, list)
            }
          }
        })
    },
    //弹出服务日对调详情
    openServiceDialog(newextData, list){
      if(this.pointVal==2){
      this.serviceEdit = false
        let infoWindow = this.drawInfoWindow({
          HTMLElement: document.getElementById('main_service'),
          offset: new this.newAMap.Pixel(0, 0)
        })
        this.areaId = newextData.areaId
        const newdata = list.get(newextData.areaId)
        this.Addserviceday(newextData.areaId, newdata)
        this.storeDay = newextData.serviceDay
        this.AMap.setCenter([newextData.storeLng, newextData.storeLat])
        // 点击服务日高亮所有相同服务日
        this.getPointStroke([this.storeDay])
        this.showDayModel = true
        // 禁用鼠标右键点击事件
        document.oncontextmenu = function() {
          return false
        }
        // 弹出服务日调整
        infoWindow.open(this.AMap, newextData.lnglat)
      }
    },
    // 获取当前进行服务对调的两个日期数组
    getNowServerDay(value) {
      this.serverDataList = value
    },

    // // 门店 操作 移入移除
    // getComeOut(item) {
    //   let _this = this
    //   // 移入
    //   item &&
    //     item.on('mouseover', e => {
    //       if (e) {
    //         if(!e.data) {
    //           // 兼容新售点分级添加数字的点位样式
    //           e.data = e.target.w.extData
    //           e.data.lnglat = e.lnglat
    //         }
    //         // console.info('移入', e, item, _this.whetherStoreEdit)
    //         _this.editStoreLng = e.data.lnglat
    //         if (!_this.whetherStoreEdit) {
    //           return
    //         }
    //         // _this.editStoreKey = new Date().getTime()
    //         let newextData = e.data
    //         let nowPosition = _this.AMap.lngLatToContainer([
    //           _this.editStoreLng.lng,
    //           _this.editStoreLng.lat
    //         ])
    //         if (newextData.serviceDay === '-1') {
    //           _this.$refs.storeAdjChild.windowCtr(
    //             newextData.storeId,
    //             nowPosition,
    //             'add',
    //             newextData,
    //             'noService'
    //           )
    //         } else {
    //           _this.$refs.storeAdjChild.windowCtr(
    //             newextData.storeId,
    //             nowPosition,
    //             'delete'
    //           )
    //         }
    //       }
    //     })
    // },

    // 添加服务日描边
    Addserviceday(newKey, data) {
      let onedata = [], // 服务日为1
        twodata = [], // 服务日为2
        treedata = [], // 服务日为3
        fourdata = [], // 服务日为4
        fivedata = [], // 服务日为5
        sixdata = [], // 服务日为6
        sevendata = [], // 服务日为7
        noservedata = [] // 服务日为7
      for (let newitem of data) {
        // 增加服务日点击描边事件
        switch (newitem.serviceDay) {
          case '-1':
            noservedata.push(this.serviceArray(newitem))
            break
          case '1':
            onedata.push(this.serviceArray(newitem))
            break
          case '2':
            twodata.push(this.serviceArray(newitem))
            break
          case '3':
            treedata.push(this.serviceArray(newitem))
            break
          case '4':
            fourdata.push(this.serviceArray(newitem))
            break
          case '5':
            fivedata.push(this.serviceArray(newitem))
            break
          case '6':
            sixdata.push(this.serviceArray(newitem))
            break
          case '7':
            sevendata.push(this.serviceArray(newitem))
            break
        }
        this.PointStroke.set(newKey, {
          onedata,
          twodata,
          treedata,
          fourdata,
          fivedata,
          sixdata,
          sevendata,
          noservedata
        })
      }
      onedata = null,
      twodata = null,
      treedata = null,
      fourdata = null,
      fivedata = null,
      sixdata = null,
      sevendata = null,
      noservedata = null
    },
    // 添加单个服务日描边数组
    serviceArray(newitem) {
      if (newitem.rate) {
        let newimg
        switch (newitem.rate) {
          case '1':
            newimg = clientimg
            break
          case '2':
            newimg = fangimg
            break
          case '3':
            newimg = sanjiaoimg
            break
        }
        const clickmarker = new this.newAMap.Marker({
          icon: newimg,
          position: [newitem.storeLng, newitem.storeLat],
          offset: new this.newAMap.Pixel(-21, -21),
          zIndex: 1
        })
        clickmarker.setMap(this.AMap)
        // 隐藏服务日描边
        this.AMap.remove(clickmarker)
        return clickmarker
      }
    },
    // 隐藏或展示相关服务日描边
    getPointStroke(data) {
      this.hidePointStroke()
      if (this.areaId) {
        const dataStroke = this.PointStroke.get(this.areaId)
        if (dataStroke) {
          const {
            onedata,
            twodata,
            treedata,
            fourdata,
            fivedata,
            sixdata,
            sevendata,
            noservedata
          } = dataStroke
          // 隐藏之前显示的服务日边框
          for (let item of onedata) {
            this.AMap.remove(item)
          }
          for (let item of twodata) {
            this.AMap.remove(item)
          }
          for (let item of treedata) {
            this.AMap.remove(item)
          }
          for (let item of fourdata) {
            this.AMap.remove(item)
          }
          for (let item of fivedata) {
            this.AMap.remove(item)
          }
          for (let item of sixdata) {
            this.AMap.remove(item)
          }
          for (let item of sevendata) {
            this.AMap.remove(item)
          }
          for (let item of noservedata) {
            this.AMap.remove(item)
          }
          // 展示需要显示的服务日边框
          for (let datavalue of data) {
            switch (datavalue) {
              case '-1':
                for (let item of noservedata) {
                  this.AMap.add(item)
                }
                break
              case '1':
                for (let item of onedata) {
                  this.AMap.add(item)
                }
                break
              case '2':
                for (let item of twodata) {
                  this.AMap.add(item)
                }
                break
              case '3':
                for (let item of treedata) {
                  this.AMap.add(item)
                }
                break
              case '4':
                for (let item of fourdata) {
                  this.AMap.add(item)
                }
                break
              case '5':
                for (let item of fivedata) {
                  this.AMap.add(item)
                }
                break
              case '6':
                for (let item of sixdata) {
                  this.AMap.add(item)
                }
                break
              case '7':
                for (let item of sevendata) {
                  this.AMap.add(item)
                }
                break
            }
          }
        }
      }
    },
    // 隐藏所有服务日
    hidePointStroke() {
      for (let newId of this.showIds) {
        const dataStroke = this.PointStroke.get(newId)
        if (dataStroke) {
          const {
            onedata,
            twodata,
            treedata,
            fourdata,
            fivedata,
            sixdata,
            sevendata,
            noservedata
          } = dataStroke
          // 隐藏之前显示的服务日边框
          for (let item of noservedata) {
            this.AMap.remove(item)
          }
          for (let item of onedata) {
            this.AMap.remove(item)
          }
          for (let item of twodata) {
            this.AMap.remove(item)
          }
          for (let item of treedata) {
            this.AMap.remove(item)
          }
          for (let item of fourdata) {
            this.AMap.remove(item)
          }
          for (let item of fivedata) {
            this.AMap.remove(item)
          }
          for (let item of sixdata) {
            this.AMap.remove(item)
          }
          for (let item of sevendata) {
            this.AMap.remove(item)
          }
        }
      }
    },
    // 隐藏地图上所有的绘制数据
    hideMapData() {
      this.LineDataArr.forEach(item => {
        if (item.length > 0) {
          this.AMap.remove(item[0].geojson)
        }
      })
      this.OutLineDataArr.forEach(item => {
        // 隐藏区域边界
        if (item.value.length > 0) {
          this.AMap.remove(item.value[0].geojson)
        }
        if (item.newvalue.length > 0) {
          this.AMap.remove(item.newvalue[0].geojson)
        }
      })
      this.CoverDataArr.forEach(item => {
        // 隐藏区域块状底色
        if (item.length > 0) {
          this.AMap.remove(item[0].geojson)
        }
      })
      this.NameDataArr.forEach(item => {
        // 隐藏区域名称
        if (item.length > 0) {
          this.AMap.remove(item[0].text)
        }
      })
      this.PositionDataArr.forEach(item => {
        // 隐藏位置
        if (item) {
          this.AMap.remove(item)
        }
      })
      if (this.dawAreaArr.size > 0) {
        this.dawAreaArr.forEach(item => {
          this.AMap.remove(item.OutlinemapResult[0].geojson)
          this.AMap.remove(item.mapResult[0].geojson)
        })
      }
    },

    // 关闭客户详情
    closeWinow() {
      this.showCustomer = false
    },

    // 控制功能互斥
    ControlFunctionMutex(type, value) {
      this.getControlStatus(true)
      if (value) {
        this.getControlStatus(false)
        this.AllControl.set(type, value)
      }
    },

    // 获取总控制器的结构
    getControlStatus(value) {
      const dataArr = [
        'serveicWeek', // 服务周
        'DaySerive', // 服务日调整
        'StoreChange', // 门店调整
        'MoreChange', // 批量选点
        'DotaChange', // 异动门店
        'AreaChange', // 区域调整
        'SalesChange', // 区域关联业代
        'CustomerDetail', // 客户详情
        'LineButton', // 生成路线按钮
        'adjustMent', // 线路调整按钮
        'NewBusiness', // 业务图层
        'BasicLayer', // 基础图层
        'shrinkMeau', // 展开收起菜单
        'Generateday', // 生成服务日
        'areaReduction', // 还原片区
        'addNewarea', // 添加片区
        'startPoint' // 设置起始点
      ]
      for (let item of dataArr) {
        this.AllControl.set(item, value)
      }
    },

    // 显示是否绘制区域
    DawerText(value) {
      this.drawerea = value
    },

    changePoint(value) {
      if (value) {
        this.drawPointSelect()
      } else {
        this.clearPointSelect()
      }
    },
    clearPointSelect() {
      // 清空
      this.showPointSelect = false
      this.pathDataList = []
      if (this.pointMouseTool) {
        this.pointMouseTool.close(true)
      }
      if (this.PolyEditorList && this.PolyEditorList.length > 0) {
        this.PolyEditorList.forEach(item => {
          item.close()
        })
        this.PolyEditorList = []
      }
    },
    drawPointSelect() {
      let _this = this
      _this.pointMouseTool = _this.dawMouseTool({
        fillColor: 'red',
        strokeColor: 'red',
        fillOpacity: 0.5,
        strokeWeight: 1,
        zIndex: 999
      })
      this.newAMap.event.addListener(_this.pointMouseTool, 'draw', function(e) {
        _this.pathDataList.push(e.obj.getPath())
        _this.pointCheckData()
        _this.newAMap.plugin(['AMap.PolyEditor'], function() {
          let polylineEditor = new _this.newAMap.PolyEditor(_this.AMap, e.obj)
          _this.PolyEditorList.push(polylineEditor)
          polylineEditor.open()
          polylineEditor.on('addnode', function() {
            _this.pointCheckData()
          })
          polylineEditor.on('adjust', function() {
            _this.pointCheckData()
          })
        })
      })
    },
    pointCheckData() {
      let _this = this
      let arr = []
      _this.showPointSelect = false
      _this.pathDataList.forEach(item => {
        let arr1 = []
        item.forEach(op => {
          arr1.push([parseFloat(op.lng), parseFloat(op.lat)])
        })
        arr1.push([parseFloat(item[0].lng), parseFloat(item[0].lat)])
        arr.push([arr1])
      })

      let armObj = turf.multiPolygon(arr)

      let armMarker = []
      let pointMarke = []

      let nowDotData = this.$store.state.routerPlanning.pointNeedData

      for (let item of nowDotData) {
        for (let store of item[1] ) {
          if(store.storeList && this.showIds.indexOf(item[0])>-1 && this.jobLayer.includes('已计划')){
            // 已计划的店存入
            for (let area of store.storeList) {
              if (area.storeLng && area.storeLat) {
                armMarker.push([
                  parseFloat(area.storeLng),
                  parseFloat(area.storeLat)
                ])
                pointMarke.push(area)
              }
            }
          } else {
            // 未计划的店存入
              if (store.storeLng && store.storeLat && this.jobLayer.includes('未计划')) {
                armMarker.push([
                  parseFloat(store.storeLng),
                  parseFloat(store.storeLat)
                ])
                pointMarke.push(store)
            }
          }
        }
      }
      nowDotData = null
      armMarker = turf.points(armMarker)
      var ptsWithin = turf.pointsWithinPolygon(armMarker, armObj)

      let point = new Map()
      ptsWithin.features.forEach(item => {
        point.set(
          item.geometry.coordinates[0] + item.geometry.coordinates[1],
          item.geometry.coordinates
        )
      })
      _this.pointSelectList = []
      point.forEach(item => {
        pointMarke.forEach(op => {
          if (
            item[0] == op.storeLng &&
            item[1] == op.storeLat &&
            this.showIds.indexOf(op.areaId) >= 0
          ) {
            if (
              _this.pointSelectList.find(item => item.storeId == op.storeId)
            ) {
              return
            } else {
              if(op.repeatPointList && op.repeatPointList.length>0) {
                //包含重合点则显示重合点详情
                op.repeatPointList.forEach(item=>{
                  _this.pointSelectList.push(item)
                })
              } else {
                _this.pointSelectList.push(op)
              }
            }
          } else if (
            // 如果是未计划的点
            item[0] == op.storeLng &&
            item[1] == op.storeLat &&
            !op.areaId) {
            if (
              _this.pointSelectList.find(item => item.storeId == op.storeId)
            ) {
              return
            } else{
              _this.pointSelectList.push(op)
            }
          }
        })
      })

      if (_this.pointSelectList.length > 0) {
        _this.showPointSelect = true
        // console.log('pointSelectList', _this.pointSelectList)
      }
    },

    changeStores(value) {
      this.showUnusualStores = value
    },

    // 服务日调整
    changeDay(value) {
      this.showDayModel = value
    },
    // 生成起始点
    getstarPoint(value){
      this.starPoint = value
    },
    // 绘制未计划点位
    async drawNoPlanStore(data) {
      return await this.dawCircleMarker(data)
    },
    /**
     * @description 绘制圆形覆盖物
     * @param {Object} options
     */
    dawCircleMarker(options) {
      // 如果没有数据则终止运行
      if (!options) {
        console.warn('/** 没有拿到-绘制圆形数据-- **/')
        return
      }
      let CircleMarkerArr = []
      const defaultOption = {
        fillOpacity: '#999',
        bubble: true,
        fillColor: 1
      }
      for (var i = 0; i < options.length; i += 1) {
        var circleMarker = new this.newAMap.CircleMarker({
          center: options[i].center,
          radius: 10 + Math.random() * 10, //3D视图下，CircleMarker半径不要超过64px
          strokeColor: 'white',
          strokeWeight: 1,
          strokeOpacity: 1,
          fillColor: options[i].fillColor
            ? options[i].fillColor
            : defaultOption.fillColor,
          fillOpacity: options[i].fillOpacity
            ? options[i].fillOpacity
            : defaultOption.fillOpacity,
          zIndex: 99,
          bubble: true,
          cursor: 'pointer',
          clickable: true,
          extData: options[i]
        })
        circleMarker.setRadius(options[i].Radius)
        circleMarker.setMap(this.AMap)
        CircleMarkerArr.push(circleMarker)
      }
      return CircleMarkerArr
    },
    openNoPlanStoreDetail(storeData, lnglat) {
      let {
        storeCode,
        storeId,
        storeName,
        storeLat,
        storeLng,
        precinctNo,
        serviceDay,
        areaId
      } = storeData
      this.storeData = {
        storeCode,
        storeId,
        storeName,
        storeLat,
        storeLng,
        precinctNo,
        areaId,
        serviceDay,
        type: 'noPlan'
      }
      let infoWindow = this.drawInfoWindow({
        HTMLElement: document.getElementById('main_customer'),
        offset: new this.newAMap.Pixel(30, -100),
        anchor: 'top-left',
        zIndex: 1
      })
      this.showCustomer = true
      // 弹出客户详情
      infoWindow.open(this.AMap, lnglat)
    }
  }
}
</script>
<style>
.amap-marker-label {
  position: absolute;
  z-index: 2;
  border: none;
  background-color: transparent;
  white-space: nowrap;
  cursor: default;
  padding: 3px;
  font-size: 12px;
  line-height: 14px;
}
</style>
<style scoped lang="scss">
.planpreview {
  flex: 1;
  display: flex;
  width: 100%;
  height: 100vh;
  .mapstyle {
    flex: 1;
    width: 100%;
    display: flex;
    position: relative;
    #newMapbox {
      flex: 1;
      width: 100%;
    }
  }
  .titlebox {
    position: absolute;
    top: 40%;
    font-size: 14px;
    padding: 8px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 4px;
    z-index: 3;
    left: 30%;
    color: #ffffff;
  }
}
.amap-icon img {
  width: 30px;
  height: 30px;
}
</style>
