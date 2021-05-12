<!--
    商机导航模块包含三个模块：售点盘点，问题门店，汇总信息表（暂时不做）
	数据流：从路由query中获取，然后流到子组件，子组件通过改变query参数push新参数来刷新数据
-->
<template>
	<div class="bn-index" id="business_navigate_container">
		<!--地图组件-->
		<Map ref='map_container' @sendMapObj="getMapObj" class="mapContainer" />
		<!--
			change:面板是否显示，changeRadio：问题门店过滤修改后回调，changeSelect：门店属性过滤修改后回调，requestData：画像的请求数据+地图请求数据等核心数据
			左侧过滤面板 映射为两个路由参数 参数名 => panelType：sale(售点盘点，两个选项卡) || problem(问题门店，三个选项卡)
		-->
		<LeftFilterBoard
			v-show="leftFilterBoardShow"
			@change="closeLeftFilterBoard"
			@changeRadio="changeRadio"
			@changeSelect="changeSelect"
			@clearAllSelect="clearAllSelect"
			@switchShowExportTable="switchShowExportTable"
			:request-data="filter_obj"
		/>
		<!--是否显示左上角的过滤面板小按钮-->
		<ShowUpPanel v-show="!leftFilterBoardShow" @change="openLeftFilterBoard" />
		<!--浮动：图例1-门店类型-->
		<LegendIconBoard />
		<!--浮动：图例2-控制面板，所有switch状态都会提升到此组件中-->
		<LegendCtrlBoard 
			@isActiveGovBoundary = 'isActiveGovBoundary'
			@isActiveOrgBoundary = 'isActiveOrgBoundary'
			@isOpenRangeBoundary = 'isOpenRangeBoundary'
			@isOpenSingleRangeBoundary = 'isOpenSingleRangeBoundary'
			@isOpenHeat = 'isOpenHeat'
			@switchDataModel = 'switchDataModel'
			:isActiveGovBoundary = 'is_active_gov_boundary'
			:isActiveOrgBoundary = 'is_active_org_boundary'
			:isOpenRangeBoundary = 'is_open_range_boundary'
			:isOpenSingleRangeBoundary = 'is_open_single_range_boundary'
			:isShowRangeBoundary= 'is_show_range_boundary'
			:isOpenHeat= 'is_open_heat'
			:isShowHeat = 'is_show_heat'
			:isShowCoverPercent = 'is_show_cover_percent'/>
		<!--浮动：门店导出-->
		<ExportTable @switchShowExportTable="switchShowExportTable" :is-show-export-table='is_show_export_table'/>
		<!--浮动：门店详情-->
		<StoreDetailBoard ref='store_detail_board_comp' :store-id="store_id" :is-show-board='is_show_store_detail' :other-info='current_store_info' @closeStoreDetailBoard = 'closeStoreDetailBoard' @showChangeLocationFlag='changeLocation'/>
		<!--地图修改门店位置按钮-->
		<!-- <div class="editButton" :style="{'top': top_val, 'left': left_val}" v-show="is_show_edit_button" @click="changeLocation" >修改位置</div> -->
		<!--地图修改门店位置结束按钮-->
		<div class="finishEditButton" :style="{'top': end_top_val, 'left': end_left_val}" v-show="is_show_end_edit_button" >
			<div class="submitButton" @click="submitLocation">确定地址</div>
			<div class="goBackButton" @click="goBack">取消</div>
		</div>
		<!--拖拽后的地址信息提示-->
		<div class='addressTips' v-show='current_address_str'>{{current_address_str}}</div>
		<!--上传修改门店   v-auth='"navigation:sell:uploadlg"'  -->
		<div class='uploadModifiedStoresContainer' v-auth='"navigation:sell:uploadlg"'>上传修改门店
			<input type="file" class='uploadButton' name='upload_button' @change="uploadModifiedStores($event)">
		</div>
	</div>
</template>

<script>
/*---------------------导入组件---------------------*/
// 导入商机导航地图组件
import Map from '@/components/Map'
// import BusinessNavigationMap from "@/components/business_navigation_comp/BusinessNavigationMap";
// 导入左侧过滤器控制面板
import LeftFilterBoard from '@/components/business_navigation_comp/LeftFilterBoard' // 展开
import ShowUpPanel from '@/components/business_navigation_comp/panelGroup/showUp' // 收起
// 导入店铺详情
import StoreDetailBoard from '@/components/business_navigation_comp/StoreDetailBoard'
// 导入店铺图例面板
import LegendIconBoard from '@/components/business_navigation_comp/LegendIconBoard'
// 导入地图图例面板
import LegendCtrlBoard from '@/components/business_navigation_comp/LegendCtrlBoard'
// 导入数据表格组件
import ExportTable from '@/components/business_navigation_comp/ExportTable'
/*---------------------导入商机导航接口API---------------------*/
import BUSINESS_NAVIGATION_API from '../../../api/business_navigate_api'
/*---------------------导入假数据---------------------*/
// import heatmapData from '@/assets/js/fakeheatmapData'
import { AMap, AMapUI } from '@/plugins/AMap'
/*---------------------导入缺省图标和拖拽小旗子---------------------*/
import mapStar from '@/assets/img/map_star.png'
import newLocationIcon from '@/assets/img/new_location_icon.png'
import oldLocationIcon from '@/assets/img/old_location_icon.png'
	export default {
		title() {
			return '商机导航'
		},
		data() {
			return {
				// 左侧过滤面板是否显示
				leftFilterBoardShow: true,
				// orgId(可能是全局的)
				org_id: '',
				// 查询地图数据参数,问题门店筛选时，0代表过滤，空字符串意味着没有打开过滤*/
				filter_obj: {
					// 组织id
					orgId: '',
					/* ---问题属性--- */
					// 问题门店-销量不达标
					bsSubstandard: '',
					// 问题门店-连续两个月不达标
					bsTwoMonthNoDeal: '',
					// 问题门店-未成交
					bsNoDeal: '',
					// 问题门店-门店在营业所边界外
					outSideBorder: '',
					// 问题门店-门店在营业所重叠区域
					overlapStore: '',
					// 问题门店-门店编码错误
					codeError: '',
					// 问题门店-门店地址无效
					addressInvalid: '',
					// 问题门店-门店信息无效
					infoInvalid: '',
					// 问题门店-门店名称无效
					nameInvalid: '',
					// 问题门店-经纬度与地址不匹配
					mismatch: '',
					// 问题门店-经纬度在特殊地形
					special: '',
					// 问题门店-缺少客户类型
					storeTypeError: '',
					// 问题门店-缺少经纬度
					lcDefect: '',
					// 问题门店-门店类型异常
					storeTypeAnomaly: '',
					// 问题门店-客户经理缺失
					managerAbsence: '',
					// 问题门店-与GAIA环境标签不匹配
					dataPoiRepetition: '',
					/* ---门店属性--- */
					// 门店类型（需要接口支持）默认为全部
					storeType: '',
					// 销量情况：1不达标，0达标, '' 为全部
					substandard: '',
					// 成交情况  1:月月活, 2:双月活, 3:近期活跃, 4:连续两个月未成交, 5:未成交,默认为全部
					dealStatus: '',
					// 周围环境POI（需要接口支持）,默认为全部
					poi: '',
					// 既有门店  0:新店 1:已拜访 2:未拜访(数组)
					visitStatus: '',
					// 标签-康面业务标签
					selfBusiness: [],
					// 标签-康面环境标签
					selfEnvironmental: [],
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
					// 合并以上五个字段
					modelTags: []
				},
				// 路由参数副本，用来改变路由query值
				route_query:'',
				// 地图实例
				map_obj: '',
				// 店铺id，将传递给店铺详情面板 StoreDetailBoard
				store_id: '',
				// 店铺详情面板是否显示，将传递给店铺详情面板 StoreDetailBoard
				is_show_store_detail: false,
				// 是否显示导出table浮层
				is_show_export_table: false,
				// 是否切换到覆盖率
				is_show_cover_percent: false,
				// 非最后所层级对应的点数据
				marker_source_arr:[],
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
				// 是否打开组织边界
				is_active_org_boundary: true,
				// 是否打开行政边界
				is_active_gov_boundary: false,
				// 是否显示辐射范围开关
				is_show_range_boundary: false,
				// 是否打开辐射范围
				is_open_range_boundary: false,
				// 是否打开单个店铺辐射范围
				is_open_single_range_boundary: false,
				// 是否显示热力图
				is_show_heat: false,
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
				store_detail_board_info_window: ''

			}
		},
		computed: {
			// 右上角全局搜索的orgId
			search_org_id() {
				return this.$store.state.map.orgCheckId
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
		watch: {
			// 监听右上角全局搜索后的orgId是否发生变化
			search_org_id(new_org_id) {
				this.filter_obj.orgId = new_org_id
				this.updateRouteQuery()
			}
		},
		mounted() {
			// 初始化路由参数，并初始化左侧面板和地图数据
			this.initFilterObj(this.$route.query)
			this.$store.dispatch('map/setMapSearchIcon', true)
			this.$store.dispatch('map/setMapOrganization', true)
		},

		/**
		 * @description 路由钩子函数，初始化在进入之前添加选项卡
		 */
		beforeRouteEnter(to, from, next) {
			next((vm) => {
				if(to.path === '/business-navigate/problem'){
					// 通过 `vm` 访问组件实例
					vm.$store.commit('addTabs', {
						title: '问题门店',
						link: to.fullPath,
						on: false,
						needCatch: true,
						isPathNameCheck: true
					})
				} else {
					vm.$store.commit('addTabs', {
						title: '售点盘点',
						link: to.fullPath,
						on: false,
						needCatch: true,
						isPathNameCheck: true
					})
				}
			})
		},
		methods: {
			/**
			 * @description 获取路由query参数，初始化左侧过滤面板，注意这里从路由拿数据都是字符串，如果是'1,2,3'结构需要转换为数值数组
			 * @param {object} route_query url上的路由query参数
			 */
			initFilterObj(route_query) {
				// 首先从路由query获取参数，如果没有（没有就说明是第一次进入）从则从session（登陆者信息）取，如果还没有则默认为江苏
				if(route_query.orgId) {
					this.filter_obj.orgId = route_query.orgId
				} else if(this.$cookies.get('orgId')){
					this.filter_obj.orgId = this.$cookies.get('orgId')
					// this.$store.dispatch('map/setOrganizationName')
				} else {
					this.filter_obj.orgId = '5074727057550190748'
				}
				// 问题字段
				this.filter_obj.codeError = route_query.codeError ? parseInt(route_query.codeError) : ''
				this.filter_obj.bsSubstandard = route_query.bsSubstandard ? parseInt(route_query.bsSubstandard) : ''
				this.filter_obj.bsTwoMonthNoDeal = route_query.bsTwoMonthNoDeal ? parseInt(route_query.bsTwoMonthNoDeal) : ''
				this.filter_obj.bsNoDeal = route_query.bsNoDeal ? parseInt(route_query.bsNoDeal) : ''
				this.filter_obj.outSideBorder = route_query.outSideBorder ? parseInt(route_query.outSideBorder) : ''
				this.filter_obj.overlapStore = route_query.overlapStore ? parseInt(route_query.overlapStore) : ''
				this.filter_obj.addressInvalid = route_query.addressInvalid ? parseInt(route_query.addressInvalid) : ''
				this.filter_obj.infoInvalid = route_query.infoInvalid ? parseInt(route_query.infoInvalid) : ''
				this.filter_obj.nameInvalid = route_query.nameInvalid ? parseInt(route_query.nameInvalid) : ''
				this.filter_obj.mismatch = route_query.mismatch ? parseInt(route_query.mismatch) : ''
				this.filter_obj.special = route_query.special ? parseInt(route_query.special) : ''
				this.filter_obj.storeTypeError = route_query.storeTypeError ? parseInt(route_query.storeTypeError) : ''
				this.filter_obj.lcDefect = route_query.lcDefect ? parseInt(route_query.lcDefect) : ''
				this.filter_obj.storeTypeAnomaly = route_query.storeTypeAnomaly ? parseInt(route_query.storeTypeAnomaly) : ''
				this.filter_obj.managerAbsence = route_query.managerAbsence ? parseInt(route_query.managerAbsence) : ''
				this.filter_obj.dataPoiRepetition = route_query.dataPoiRepetition ? parseInt(route_query.dataPoiRepetition) : ''
				// 属性字段
				this.filter_obj.storeType = route_query.storeType ? route_query.storeType.split(',') : []
				this.filter_obj.substandard = route_query.substandard ? parseInt(route_query.substandard) : ''
				this.filter_obj.dealStatus = route_query.dealStatus ? route_query.dealStatus.split(',').map(Number) : []
				this.filter_obj.poi = route_query.poi ? route_query.poi.split(','): []
				this.filter_obj.selfBusiness = route_query.selfBusiness ? route_query.selfBusiness.split(','): []
				this.filter_obj.selfEnvironmental = route_query.selfEnvironmental ? route_query.selfEnvironmental.split(','): []
				this.filter_obj.visitStatus = route_query.visitStatus ? route_query.visitStatus.split(',').map(Number): []
				this.filter_obj.peopleStream = route_query.peopleStream ? route_query.peopleStream.split(',').map(Number): []
				this.filter_obj.transportation = route_query.transportation ? route_query.transportation.split(',').map(Number): []
				this.filter_obj.consumption = route_query.consumption ? route_query.consumption.split(',').map(Number): []
				this.filter_obj.storeDensity = route_query.storeDensity ? route_query.storeDensity.split(',').map(Number): []
				this.filter_obj.housePrice = route_query.housePrice ? route_query.housePrice.split(',').map(Number): []
				this.filter_obj.modelTags = [
					...this.filter_obj.peopleStream,
					...this.filter_obj.transportation,
					...this.filter_obj.consumption,
					...this.filter_obj.storeDensity,
					...this.filter_obj.housePrice
				]
				// 初始化地图所有参数（因为第一次进入页面可能缺少某些参数），复制一个副本
				this.route_query = JSON.parse(JSON.stringify(this.filter_obj))
				this.route_query.dealStatus = this.route_query.dealStatus.join()
				this.route_query.storeType = this.route_query.storeType.join()
				this.route_query.poi = this.route_query.poi.join()
				this.route_query.selfBusiness = this.route_query.selfBusiness.join()
				this.route_query.selfEnvironmental = this.route_query.selfEnvironmental.join()
				this.route_query.visitStatus = this.route_query.visitStatus.join()
				this.route_query.peopleStream = this.route_query.peopleStream.join()
				this.route_query.transportation = this.route_query.transportation.join()
				this.route_query.consumption = this.route_query.consumption.join()
				this.route_query.storeDensity = this.route_query.storeDensity.join()
				this.route_query.housePrice = this.route_query.housePrice.join()
				this.route_query.modelTags = this.route_query.modelTags.join()
				// 初始化地图数据
				this.getMapStoreData(this.route_query)
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
				let res = await BUSINESS_NAVIGATION_API.get_map_store_by_tags(params)
				// 添加当前组织 orgName 到右上角的搜索模块以显示
				if(res.extData.orgName) {
					this.$store.dispatch('map/setOrganizationName', res.extData.orgName)
				}
				this.$store.dispatch('map/setOrganizationId', this.filter_obj.orgId)
				this.$store.dispatch('map/setSearchType', ['map', 'org'])
				if(res.data) {
					// 清空地图所有标记
					this.map_obj.clearMap()
					// 清空原来的聚合点
					if(this.cluster_obj) {
						this.cluster_obj.clearMarkers()
					}
					// 如果有海量massMarker则清空，因为上面的方法无法清空！
					if (this.mass_markers_obj) {
						this.mass_markers_obj.clear()
					}
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
					// 初始化控制面板所有参数(打开组织边界)
					this.is_active_org_boundary = true
					// 如果打开了行政边界，则调用接口，因为前面已经清空地图了
					if (this.is_active_gov_boundary) {
						this.getGovBoundary()
					}
					// 如果是最后一个所层级（leafNode:true）,则对所有点以massMarker处理，否则则认为是所以上层级用GEOJson处理
					if(res.extData.leafNode) {
						console.log('进入最后层级！')
						// 显示辐射范围按钮
						this.is_show_range_boundary = true
						// 如果已经打开了辐射范围按钮
						if(this.is_open_range_boundary){
							// 调用接口
							this.getStoresRangeBoundary(params)
						}
						// 显示热力图按钮
						this.is_show_heat = true
						// 如果已经打开了热力图按钮
						if(this.is_open_heat){
							// 如果已经存在热力图对象了，则清空旧热力图，后面setDataSet只会添加热力图数据
							if(this.heat_map_obj){
								this.heat_map_obj.setMap(null)
							}
							this.getHeatMap(params.orgId)
						}
						// 将原数据字符串转化为对象数组，注意：只有最后一个是polygon其它都为marker
						let data_list = JSON.parse(res.data[0].coverage).features
						// 初始化长度
						let length = data_list.length
						// 初始化所边界polygon
						let polygon_obj = new AMap.Polygon({
							path: data_list[length - 1].geometry.coordinates,
							zIndex: 2,
							strokeColor: res.data[0].borderColor ? res.data[0].borderColor : '#A634EF',
							strokeOpacity: res.data[0].borderColorOpacity ? res.data[0].borderColorOpacity / 100 : 1,
							strokeWeight: res.data[0].borderWidth ? res.data[0].borderWidth : 2,
							fillColor: res.data[0].color ? res.data[0].color : '#5CADFF',
							// fillOpacity: res.data[0].opacity ? res.data[0].opacity / 100 : 0.4,
							fillOpacity: 0.2,
							bubble: true
						})
						// 循环获取marker和marker的样式数组（之所以-1是因为最后一级别是polygon）
						// for(let i = 0; i < length - 1; i++) {
						// 	this.marker_arr.push(new AMap.Marker({
						// 		position: data_list[i].geometry.coordinates,
						// 		zIndex: 199,
						// 		anchor: 'bottom-center',
						// 		offset: new AMap.Pixel(0,0),
						// 		icon: new AMap.Icon({
						// 			image: data_list[i].properties.typeIcon,
						// 			size: new AMap.Size(25,25),
						// 			imageSize: new AMap.Size(25,25)
						// 		}),
						// 		extData: data_list[i]
						// 	}))
						// }
						// this.cluster_obj = new AMap.MarkerClusterer(this.map_obj, this.marker_arr, {gridSize: 280, minClusterSize: 20})
						// 绘制聚合
						// this.cluster_obj.setMap(this.map_obj)
						// 绑定店铺事件
						// for(let k= 0; k < length - 1; k++) {
						// 	this.marker_arr[k].on('click', (marker_info) => {
						// 		// 如果不存在高亮对象
						// 		if(!this.highlight_marker) {
						// 			this.highlight_marker = new AMap.Marker({
						// 				position: marker_info.target.getPosition(),
						// 				zIndex: 198,
						// 				anchor: 'bottom-center',
						// 				offset: new AMap.Pixel(0,0),
						// 				content: '<div style="width:25px;height:25px;border-radius:50%;box-shadow:0px 0px 4px 4px #FF9900"></div>'
						// 			})
						// 			this.highlight_marker.setMap(this.map_obj)
						// 		}
						// 		this.highlight_marker.hide()
						// 		this.highlight_marker.setPosition(marker_info.target.getPosition())
						// 		this.highlight_marker.show()
						// 		// 设置中心点
						// 		this.map_obj.setCenter(marker_info.target.getPosition())
						// 		// 如果是点击同一个店铺则不调用接口，直接显示
						// 		if(marker_info.target.getExtData().properties.storeId === this.store_id) {
						// 			// 显示详情面板
						// 			this.is_show_store_detail = true
						// 		} else {
						// 			// 如果存在已经画好的店铺辐射范围则移除
						// 			if(this.current_store_polygon){
						// 				this.current_store_polygon.clearOverlays()
						// 			}
						// 			// 如果已经存在二阶距离点，清除
						// 			if(this.distance_marker_array.length > 0){
						// 				this.map_obj.remove(this.distance_marker_array)
						// 				this.distance_marker_array = []
						// 			}
						// 			// 如果已经存在二阶辐射范围，线，则清空
						// 			if(this.level_tow_geo_obj){
						// 				this.level_tow_geo_obj.clearOverlays()
						// 			}
						// 			if(this.level_tow_range_obj) {
						// 				this.level_tow_range_obj.clearOverlays()
						// 			}
						// 			// 修改店铺的id传递给详情组件
						// 			this.store_id = marker_info.target.getExtData().properties.storeId
						// 			// 显示详情面板
						// 			this.is_show_store_detail = true
						// 			// 调用详情接口 this.store_id 4881356612405010769
						// 			BUSINESS_NAVIGATION_API.get_store_detail({storeId: this.store_id}).then(res => {
						// 				if(res) {
						// 					this.current_store_info = res
						// 					// 获取当前店铺辐射范围
						// 					this.getCurrentStorePolygon(JSON.parse(res.coverage))
						// 					// 画二阶
						// 					this.renderLevelTwoGEOJson(res.supply, res.concave)
						// 				}
						// 			})
						// 			// 移除之前的红蓝小旗子
						// 			this.goBack()
						// 		}
						// 		// 每次点击店铺都要获取此店铺的经纬度，和店铺id，然后才能触发修改位置功能
						// 		this.marker_lnglat = marker_info.target.getExtData().geometry.coordinates
						// 	})
						// }

						for(let i = 0; i < length - 1; i++) {
							this.marker_arr.push({
								lnglat: data_list[i].geometry.coordinates,
								storeId: data_list[i].properties.storeId,
								style: i
							})
							this.marker_style_arr.push({
								url: data_list[i].properties.typeIcon,
								size: new AMap.Size(25,25),
								// 必须填写：此处有巨坑：千万别用字符串如bottom-center，否则无法绘制；也不要用负值，否则无法绑定事件
								anchor: new AMap.Pixel(12.5,12.5)
							})
						}
						this.mass_markers_obj = new AMap.MassMarks(this.marker_arr, {
							// 此处之所以是111，因为GEOJson绘制的最后的所边界zIndex为110，应该是地图机制，上边设置的zIndex无效了
							zIndex: 111,
							cursor: 'pointer',
							style: this.marker_style_arr
						})
						// 绘制海量点
						this.mass_markers_obj.setMap(this.map_obj)

						// 绘制最后所边界
						polygon_obj.setMap(this.map_obj)
						this.mass_markers_obj.on('click', (marker_info) => {
							// 如果不存在高亮对象
							if(!this.highlight_marker) {
								this.highlight_marker = new AMap.Marker({
									position: marker_info.data.lnglat,
									zIndex: 110,
									anchor: 'center',
									offset: new AMap.Pixel(0,0),
									content: '<div style="width:25px;height:25px;border-radius:50%;box-shadow:0px 0px 4px 4px #FF9900"></div>'
								})
								this.highlight_marker.setMap(this.map_obj)
							}
							this.highlight_marker.hide()
							this.highlight_marker.setPosition(marker_info.data.lnglat)
							this.highlight_marker.setMap(this.map_obj)
							this.highlight_marker.show()
							// 定位到该点
							// this.map_obj.setCenter(marker_info.data.lnglat)
							// 如果是点击同一个店铺则不调用接口，直接显示
							if(marker_info.data.storeId === this.store_id) {
								// 将详情面板定位在某经纬度
								this.store_detail_board_info_window.open(this.map_obj, marker_info.data.lnglat)
								// 显示详情面板
								this.is_show_store_detail = true
							} else {
								// 如果存在已经画好的店铺辐射范围则移除
								if(this.current_store_polygon){
									this.current_store_polygon.clearOverlays()
								}
								// 如果已经存在二阶距离点，清除
								if(this.distance_marker_array.length > 0){
									this.map_obj.remove(this.distance_marker_array)
									this.distance_marker_array = []
								}
								// 如果已经存在二阶辐射范围，线，则清空
								if(this.level_tow_geo_obj){
									this.level_tow_geo_obj.clearOverlays()
								}
								if(this.level_tow_range_obj) {
									this.level_tow_range_obj.clearOverlays()
								}
								// 修改店铺的id传递给详情组件
								this.store_id = marker_info.data.storeId

								/*--- 显示详情面板 ---*/
								// 获取面板dom
								this.store_detail_board_dom = this.$refs.store_detail_board_comp.$refs.store_detail_board
								// 初始化地图的信息窗口
								if(!this.store_detail_board_info_window) {
									this.store_detail_board_info_window = this.$refs.map_container.drawInfoWindow({
										HTMLElement: this.store_detail_board_dom,
										offset: new AMap.Pixel(50, -160),
										anchor: 'top-left'
									})
								}
								this.store_detail_board_info_window.open(this.map_obj, marker_info.data.lnglat)
								this.is_show_store_detail = true
								// 调用详情接口 并绘制当前店铺辐射范围
								BUSINESS_NAVIGATION_API.get_store_detail({storeId: this.store_id}).then(res => {
									if(res) {
										// 初始化店铺详情面板数据
										this.current_store_info = res
										// 渲染当前店铺的辐射范围
										this.getCurrentStorePolygon(JSON.parse(res.coverage))
										// 画二阶
										this.renderLevelTwoGEOJson(res.supply, res.concave)
									}
								})
								// 移除之前的红蓝小旗子
								this.goBack()
							}
							// 每次点击店铺都要获取此店铺的经纬度，和店铺id，然后才能触发修改位置功能
							this.marker_lnglat = marker_info.data.lnglat
						})
					}
					// 如果是"所"以上层级，对每一个polygon进行遍历
					else {
						// 不显示辐射范围按钮
						this.is_show_range_boundary = false
						// 关闭辐射范围按钮
						this.is_open_range_boundary = false
						// 不显示热力图按钮
						this.is_show_heat = false
						// 关闭热力图按钮
						this.is_open_heat = false
						// 如果已经存在热力图对象了，则隐藏
						if(this.heat_map_obj) {
							this.heat_map_obj.hide()
						}
						let html_str = ''
						res.data.forEach((item) => {
							// 实例化每一个polygon对应的marker
							// let num = '1'
							// str = '/img/selectIcon${item.icon}.png' ${mapStar}
							if(item.icon) {
								html_str = `<div class="numContent">服务点数：${this.formatterThousandSeperator(item.storeNum)}</div><div class='areaName'>${item.orgName}</div><img class='markerStar' src='/img/selectIcon${item.icon}.png' />`
							} else {
								html_str = `<div class="numContent">服务点数：${this.formatterThousandSeperator(item.storeNum)}</div><div class='areaName'>${item.orgName}</div><img class='markerStar' src=${mapStar} />`
							}
							let marker_obj = new AMap.Marker({
								position: item.orgLocation.split(','),
								content: html_str,
								offset: new AMap.Pixel(0,0),
								anchor: 'bottom-center',
								zIndex: 3,
								cursor: 'pointer',
							})
							// 绑定marker点击事件，下钻
							marker_obj.on('click', () => {
								// this.filter_obj.orgId = item.orgId
								// 更新url并重新初始化地图数据
								// this.updateRouteQuery()
								// 提交到vuex修改为最新orgId，然后触发监听
								this.$store.dispatch('map/setOrgCheckId', item.orgId)
							})
							// 将marker添加到地图
							marker_obj.setMap(this.map_obj)
							let polygon_geo_obj = new AMap.GeoJSON({
								geoJSON: JSON.parse(item.coverage),
								getPolygon: (geo_json, lng_lat) => {
									let polygon_obj = new AMap.Polygon({
										path: lng_lat,
										zIndex: 2,
										strokeColor: item.borderColor ? item.borderColor : '#2E82CF',
										strokeOpacity: item.borderColorOpacity ? item.borderColorOpacity / 100 : 1,
										strokeWeight: item.borderWidth ? item.borderWidth : 2,
										fillColor: item.color ? item.color : '#318FE9',
										fillOpacity: item.opacity ? item.opacity / 100 : 0.7,
										bubble: true
									})
									this.polygon_org_arr.push(polygon_obj)
									this.polygon_org_source_arr.push(item)
									// 绑定点击事件
									// polygon_obj.on('click', () => {
									// 	this.$store.dispatch('map/setOrgCheckId', item.orgId)
									// })
									// 此处必须返回当下的marker对象才能画出polygon
									return polygon_obj								
								}
							})
							// 将polygon添加到地图
							polygon_geo_obj.setMap(this.map_obj)
						})
					}
					// 自适应覆盖物缩放层级
					if(!is_update_location) {
						setTimeout(()=>{
							this.map_obj.setFitView()
						}, 1000)
					}
				}
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
				if(GEO_json) {
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
								cursor: 'pointer',
							})
							return polygon_obj								
						},
						getPolyline: (geo_json, lng_lat) => {
							// 距离 geo_json.distance
							console.log('线：', geo_json)
							console.log('线起点-终点：', lng_lat)
							let polyline_obj = new AMap.Polyline({
								path: lng_lat,
								zIndex: 113,
								// 是否显示方向
								showDir: true,
								dirColor:'pink',
								// 线颜色
								strokeColor: '#336688',
								// 透明度
								strokeOpacity: 1,
								// 线宽
								strokeWeight: 6
							})
							// 运算某条线中间点，并打点距离
							this.computeDis(new AMap.LngLat(lng_lat[0].lng, lng_lat[0].lat), new AMap.LngLat(lng_lat[1].lng, lng_lat[1].lat), geo_json.properties.distance.toFixed(2))
							return polyline_obj						
						},
						getMarker: () => {
							return ''						
						}
					})
					this.level_tow_geo_obj.setMap(this.map_obj)
				}
				// 辐射范围(绿色)
				if(polygon_json) {
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
								cursor: 'pointer',
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
			computeDis(m1, m2, distance_num){
				// 初始化中间点位置
				let textPos = m1.divideBy(2).add(m2.divideBy(2))
				// let distance = Math.round(m1.distance(m2))
				let text = new AMap.Text({
					text: distance_num + ' km',
					position: textPos,
					style: { 'background-color': '#29b6f6', 'font-size': '10px', 'border-radius': '4px' }
				})
				text.setMap(this.map_obj)
				this.distance_marker_array.push(text)
			},

			/**
			 * @description 获取行政边界
			 * @param {string} org_id
			 */
			async getGovBoundary() {
				let res = await BUSINESS_NAVIGATION_API.get_map_gov_by_org_id(this.route_query.orgId)
				if(res) {
					let polygon_geo_obj = new AMap.GeoJSON({
						geoJSON: res,
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
			 * @description 获取当前店铺的辐射范围
			 * @param {object} geo_json 标准GEOJson格式数据
			 */
			getCurrentStorePolygon(geo_json) {
				if(geo_json) {
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
					if(this.is_open_single_range_boundary){
						this.current_store_polygon.show()
					} else{
						this.current_store_polygon.hide()
					}
				}
			},
			
			/**
			 * @description 触发改变店铺位置回调
			 */
			changeLocation () {
				// 如果已经存在拖拽对象则移除
				if (this.position_picker) {
					this.position_picker.stop()
					this.position_picker = ''
				}
				// 移除蓝色小旗子
				if(this.marker_settled_obj){
					this.map_obj.remove(this.marker_settled_obj)
					this.marker_settled_obj = ''
				}
				// 隐藏 '修改位置' 按钮
				// this.is_show_edit_button = false
				// 步骤1：初始化Picker对象,实例化一个固定蓝色小旗子，不可拖拽 this.marker_lnglat 为当下店铺的经纬度对象
				AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
					this.marker_settled_obj = new AMap.Marker({
								position: this.marker_lnglat,
								offset: new AMap.Pixel(0,0),
								anchor: 'bottom-center',
								icon: new AMap.Icon({
									size: new AMap.Size(39, 40),    // 图标尺寸
									image: oldLocationIcon,  // Icon的图像
									imageSize: new AMap.Size(39, 40)   // 根据所设置的大小拉伸或压缩图片
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
					this.position_picker.on('success', positionResult => {
						console.log('---拖拽成功---',positionResult)
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
			finishedEdit (position_obj, is_show_button) {
				this.end_position_lnglat = position_obj.position
				console.log('---拖拽后的经纬度---', this.end_position_lnglat.getLng(), this.end_position_lnglat.getLat())
				this.onMapmove()
				let end_position_pixel = this.map_obj.lngLatToContainer(this.end_position_lnglat)
				this.end_left_val = end_position_pixel.getX() + this.offset_end_left + 'px'
				this.end_top_val = end_position_pixel.getY() + 'px'
				this.is_show_end_edit_button = is_show_button
				// 右下角显示最近道路
				this.current_address_str = position_obj.address
			},

			/**
			 * @description 提交修改的位置
			 */
			async submitLocation () {
				let res = await BUSINESS_NAVIGATION_API.update_map_location({
					address: this.current_address_str,
					storeLocation: this.end_position_lnglat.getLng() + ',' + this.end_position_lnglat.getLat(),
					id: this.store_id
				})
				if(res){
					// 清空小旗子
					this.goBack()
					// 关闭详情面板
					this.store_detail_board_info_window.close()
					this.is_show_store_detail = false
					// 清空当下store_id
					this.store_id = ''
					// 重新绘制所有点,之所以加上setTimeout，是因为数据库不会更新那么快,所有要等一下
					setTimeout(()=>{
						this.getMapStoreData(this.route_query, true)
					}, 1000)
				}
			},

			/**
			 * @description 取消修改的位置
			 */
			goBack () {
				// 删除红色小旗子(官网方法)
				if(this.position_picker) {
					this.position_picker.stop()
				}
				this.position_picker = ''
				// 移除蓝色小旗子
				this.map_obj.remove(this.marker_settled_obj)
				this.marker_settled_obj = ''
				// 隐藏确认按钮组
				this.is_show_end_edit_button = false
				// 清空地址字符串
				this.current_address_str = ''
				// 回到蓝色小旗子位置
				// this.position_picker.start(this.marker_lnglat)
			},
			
			/**
			 * @description 监听地图移动，因为拖拽后的按钮是独立于地图的，所以需要动态计算位置
			 */
			onMapmove() {
                // 监听地图移动事件
                this.map_obj.on('mapmove', () => {
                    if(this.position_picker){
                        // 确认按钮位置
						let marker_pixel = this.map_obj.lngLatToContainer(this.end_position_lnglat)
						this.end_left_val = marker_pixel.getX() + this.offset_end_left + 'px'
						this.end_top_val = marker_pixel.getY() + 'px'
					}
				})
				// 监听地图容器变化
				this.map_obj.on('resize', () => {
					if(this.position_picker){
                        // 确认按钮位置
						let marker_pixel = this.map_obj.lngLatToContainer(this.end_position_lnglat)
						this.end_left_val = marker_pixel.getX() + this.offset_end_left + 'px'
						this.end_top_val = marker_pixel.getY() + 'px'
					}
				})
			},

			/**
			 * @description 关闭店铺详情回调函数
			 */
			closeStoreDetailBoard(){
				this.store_detail_board_info_window.close()
				this.is_show_store_detail = false
				// 如果已经存在高亮点，则隐藏
				if(this.highlight_marker) {
					this.highlight_marker.hide()
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
			 * @description 打开左侧面板回调函数
			 */
			openLeftFilterBoard(val) {
				this.leftFilterBoardShow = val
				this.offset_left = 306
				this.offset_end_left = 260
			},

			/**
			 * @description 问题门店过滤器发生变化时触发，整合到提交的数据
			 * @param {object} per_radio_data 某个radio数据
			 */
			changeRadio(radios_result_array) {
				let radios_length = radios_result_array.length
				// 复制一份route_query参数
				// let copy_route_query = JSON.parse(JSON.stringify(this.$route.query))
				for (let i = 0; i < radios_length; i++) {
					switch (radios_result_array[i].key) {
						// 销量不达标,0：不达标，1：达标，''：两者都有
						case 'bsSubstandard': {
							this.filter_obj.bsSubstandard = radios_result_array[i].switch ? 0 : ''
							break
						}
						// 连续两个月未成交
						case 'bsTwoMonthNoDeal': {
							this.filter_obj.bsTwoMonthNoDeal = radios_result_array[i].switch ? 0 : ''
							break
						}
						// 未成交
						case 'bsNoDeal': {
							this.filter_obj.bsNoDeal = radios_result_array[i].switch ? 0 : ''
							break
						}
						// 门店在营业所边界外
						case 'outSideBorder': {
							this.filter_obj.outSideBorder = radios_result_array[i].switch ? 0 : ''
							break
						}
						// 门店在营业所重叠区域
						case 'overlapStore': {
							this.filter_obj.overlapStore = radios_result_array[i].switch ? 0 : ''
							break
						}
						// 门店编码错误
						case 'codeError': {
							this.filter_obj.codeError = radios_result_array[i].switch ? 0 : ''
							break
						}
						// 门店地址无效
						case 'addressInvalid': {
							this.filter_obj.addressInvalid = radios_result_array[i].switch ? 0 : ''
							break
						}
						// 门店信息无效
						case 'infoInvalid': {
							this.filter_obj.infoInvalid = radios_result_array[i].switch ? 0 : ''
							break
						}
						// 门店名称无效
						case 'nameInvalid': {
							this.filter_obj.nameInvalid = radios_result_array[i].switch ? 0 : ''
							break
						}
						// 经纬度与地址不匹配
						case 'mismatch': {
							this.filter_obj.mismatch = radios_result_array[i].switch ? 0 : ''
							break
						}
						// 经纬度在特殊地形
						case 'special': {
							this.filter_obj.special = radios_result_array[i].switch ? 0 : ''
							break
						}
						// 缺少客户类型
						case 'storeTypeError': {
							this.filter_obj.storeTypeError = radios_result_array[i].switch ? 0 : ''
							break
						}
						// 缺少经纬度
						case 'lcDefect': {
							this.filter_obj.lcDefect = radios_result_array[i].switch ? 0 : ''
							break
						}
						// 门店类型异常
						case 'storeTypeAnomaly': {
							this.filter_obj.storeTypeAnomaly = radios_result_array[i].switch ? 0 : ''
							break
						}
						// 客户经理缺失
						case 'managerAbsence': {
							this.filter_obj.managerAbsence = radios_result_array[i].switch ? 0 : ''
							break
						}
						// 与GAIA环境标签不匹配
						case 'dataPoiRepetition': {
							this.filter_obj.dataPoiRepetition = radios_result_array[i].switch ? 0 : ''
							break
						}
					}
				}
				// 更新路由route-query
				this.updateRouteQuery()
			},
			
			/**
			 * @description 来自子组件的：属性select-option发生改变
			 * @param {object} select_result_obj 当下改变的子模块数据
			 */
			changeSelect(select_result_obj) {
				// 这里要复制一份是因为modelTags字段要后置触发拼接出来，在此之前不能调用左侧的画像面板接口，否则数量会不准确
				let copy_filter_obj = JSON.parse(JSON.stringify(this.filter_obj))
				switch (select_result_obj.title) {
					// 事实属性
					case '门店类型': {
						copy_filter_obj.storeType = select_result_obj.values
						break
					}
					case '销量情况': {
						copy_filter_obj.substandard = select_result_obj.values
						break
					}
					case '成交情况': {
						copy_filter_obj.dealStatus = select_result_obj.values
						break
					}
					case '周围环境POI': {
						copy_filter_obj.poi = select_result_obj.values
						break
					}
					case '既有门店': {
						copy_filter_obj.visitStatus = select_result_obj.values
						break
					}
					case '标签-康面业务标签': {
						copy_filter_obj.selfBusiness = select_result_obj.values
						break
					}
					case '标签-康面环境标签': {
						copy_filter_obj.selfEnvironmental = select_result_obj.values
						break
					}
					// 模型属性
					case '人流量': {
						copy_filter_obj.peopleStream = select_result_obj.values
						break
					}
					case '交通便利': {
						copy_filter_obj.transportation = select_result_obj.values
						break
					}
					case '消费力指数': {
						copy_filter_obj.consumption = select_result_obj.values
						break
					}
					case '门店密集程度': {
						copy_filter_obj.storeDensity = select_result_obj.values
						break
					}
					case '房价': {
						copy_filter_obj.housePrice = select_result_obj.values
						break
					}
				}
				// 拼接新的modelTags
				copy_filter_obj.modelTags = [
					...copy_filter_obj.peopleStream,
					...copy_filter_obj.transportation,
					...copy_filter_obj.consumption,
					...copy_filter_obj.storeDensity,
					...copy_filter_obj.housePrice
				]
				// 赋给原来的对象，然后触发左侧画像接口
				this.filter_obj = copy_filter_obj
				// 更新路由route-query
				this.updateRouteQuery()
			},

			/**
			 * @description 清空所有select-option选择
			 * @param { string } 模块类型名
			 */
			clearAllSelect(type) {
				if(type === 'fact') {
					this.filter_obj.storeType = []
					this.filter_obj.substandard = ''
					this.filter_obj.dealStatus = []
					this.filter_obj.poi = []
					this.filter_obj.selfBusiness = []
					this.filter_obj.selfEnvironmental = []
					this.filter_obj.visitStatus = []
				} else if(type === 'model') {
					this.filter_obj.peopleStream = []
					this.filter_obj.transportation = []
					this.filter_obj.consumption = []
					this.filter_obj.storeDensity = []
					this.filter_obj.housePrice = []
				}
				// 更新路由route-query
				this.updateRouteQuery()
			},

			/**
			 * @description 是否显示导出table弹窗
			 * @param {boolean} is_show 显示与否flag
			 */
			switchShowExportTable(is_show){
				this.is_show_export_table = is_show
			},
			
			/**
			 * @description 更新路由的query参数 
			 * 上传：v-auth='navigation:sell:uploadlg' 调整位置：v-auth='navigation:sell:updatestore'
			 * 下载：v-auth='navigation:sell:downloadstore' 推送：v-auth='navigation:sell:sendstore'
			 */
			updateRouteQuery(){
				// 复制一个副本，为初始化新路由接口提供参数，数组要转换为'1,2,3'格式
				this.route_query = JSON.parse(JSON.stringify(this.filter_obj))
				// 合并五个模型标签组成新的
				this.route_query.modelTags = [
					...this.route_query.peopleStream,
					...this.route_query.transportation,
					...this.route_query.consumption,
					...this.route_query.storeDensity,
					...this.route_query.housePrice
				].join()
				this.route_query.dealStatus = this.route_query.dealStatus.join()
				this.route_query.storeType = this.route_query.storeType.join()
				this.route_query.poi = this.route_query.poi.join()
				this.route_query.visitStatus = this.route_query.visitStatus.join()
				this.route_query.selfBusiness = this.route_query.selfBusiness.join()
				this.route_query.selfEnvironmental = this.route_query.selfEnvironmental.join()
				this.route_query.peopleStream = this.route_query.peopleStream.join()
				this.route_query.transportation = this.route_query.transportation.join()
				this.route_query.consumption = this.route_query.consumption.join()
				this.route_query.storeDensity = this.route_query.storeDensity.join()
				this.route_query.housePrice = this.route_query.housePrice.join()
				// 保存一个当下的路由url值，然后每次参数改变都要更新路由参数到tab标签
				let before_full_path = this.$route.fullPath
				// 修改路由url参数
				this.$router.replace({'path': this.$route.path, query: this.route_query}).catch(err => {err})
				// 添加到顶部tabs路由标签
				if(this.$route.path === '/business-navigate/problem'){
						// 通过 `vm` 访问组件实例
						this.$store.commit('addTabs', {
							title: '问题门店',
							link: before_full_path,
							on: false,
							needCatch: true,
							update:this.$route.fullPath,
							isPathNameCheck: true
						})
				} else {
					this.$store.commit('addTabs', {
						title: '售点盘点',
						link: before_full_path,
						on: false,
						needCatch: true,
						update:this.$route.fullPath,
						isPathNameCheck: true
					})
				}
				// 初始化地图数据
				this.getMapStoreData(this.route_query)
			},
			
			/**
			 * @description 切换地图 marker为 数值还是覆盖率（此功能暂时没有）
			 */
			switchDataModel(){
				this.is_show_cover_percent = !this.is_show_cover_percent
				let new_content = ''
				// 切换为覆盖率
				if(this.is_show_cover_percent){
					this.marker_source_arr.forEach((item, index) => {
						new_content = `<div class="numContent">覆盖率：${item.percentage}</div><div class='areaName'>${item.orgName}</div><img class='markerStar' src=${mapStar} />`
						this.marker_arr[index].setContent(new_content)
					})
				} else {
					// 切换为数值
					this.marker_source_arr.forEach((item, index) => {
						new_content = `<div class="numContent">服务点数：${this.formatterThousandSeperator(item.storeNum)}</div><div class='areaName'>${item.orgName}</div><img class='markerStar' src=${mapStar} />`
						this.marker_arr[index].setContent(new_content)
					})
				}
			},
			
			/**
			 * @description 是否显示行政边界
			 */
			isActiveGovBoundary(){
				this.is_active_gov_boundary = !this.is_active_gov_boundary
				if(this.is_active_gov_boundary) {
					if(this.polygon_gov_arr.length > 0){
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
			isActiveOrgBoundary(){
				this.is_active_org_boundary = !this.is_active_org_boundary
				if(this.is_active_org_boundary) {
					this.polygon_org_arr.forEach(item => {
						item.show()
					})
				} else {
					this.polygon_org_arr.forEach(item => {
						item.hide()
					})
				}
			},

			/**
			 * @description 是否打开单个店铺辐射范围
			 */
			isOpenSingleRangeBoundary() {
				this.is_open_single_range_boundary = !this.is_open_single_range_boundary
				// 如果已经存在当前店铺polygon
				if(this.current_store_polygon) {
					// 如果打开开关
					if(this.is_open_single_range_boundary) {
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
				if(this.is_open_range_boundary) {
					if(this.polygon_stores_range_arr.length > 0){
						this.polygon_stores_range_arr.forEach(item => {
							item.show()
						})
					} else {
						// 调用接口
						this.getStoresRangeBoundary(this.route_query)
					}
					
				} else {
					if(this.polygon_stores_range_arr.length > 0) {
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
				if(res) {
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
			 * @description 是否打开热力图
			 */
			isOpenHeat() {
				this.is_open_heat = !this.is_open_heat
				if(this.is_open_heat) {
					if(this.heat_map_obj){
						this.map_obj.setZoom(13)
						this.heat_map_obj.show()
					} else {
						// 调用接口
						this.getHeatMap(this.route_query.orgId)
					}
					
				} else {
					if(this.heat_map_obj) {
						this.heat_map_obj.hide()
					}
				}
			},

			/**
			 * @description 获取热力图数据
			 * @param { object } org_id 当前所的orgId
			 */
			async getHeatMap(org_id) {
				let res = await BUSINESS_NAVIGATION_API.get_stores_heat({orgId: org_id})
				if(res) {
					this.map_obj.setZoom(13)
					this.map_obj.plugin(["AMap.Heatmap"], () => {
						//初始化heatmap对象
						this.heat_map_obj = new AMap.Heatmap(this.map_obj, {
							radius: 100, //给定半径
							opacity: [0, 0.6],
							zooms:[13, 14]
						})
						//设置数据集
						this.heat_map_obj.setDataSet({
							data: res
						})
					})
				}
			},

			/**
			 * @description 千分位分割格式化
			 */
			formatterThousandSeperator(num) {
				let res = num.toString().replace(/\d+/, function (n) {
                    // 先提取整数部分
                    return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                        return $1 + ",";
                    });
                });
                return res;
			},

			/**
			 * @description 上传修改的门店
			 * @param {object} 文件对象 
			 */
			async uploadModifiedStores(event) {
				let file = event.target.files[0]
				let form_data = new FormData()
				form_data.append("file", file)
				let res = await BUSINESS_NAVIGATION_API.post_modified_stores_file(form_data)
				if(res.code === '200') {
					this.$message.success(res.data)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	// 对于非地图内部用scoped  amap-pls-marker-tip  amap-lib-infowindow
	.bn-index {
		position: relative;
		display: flex;
		width: 100%;
		color: #ffffff;
		flex-direction: row-reverse;
	}
	

	div{
		box-sizing: border-box;
	}
	.editButton {
		position: absolute;
		z-index: 1;
		width: 68px;
		line-height: 28px;
		height:28px;
		font-size: 12px;
		text-align: center;
		background: rgba(33, 0, 54, 0.7);
		border-radius: 3px;
		color: #fff;
		cursor: pointer;
	}
	.finishEditButton {
		position: absolute;
		z-index: 1;
		overflow: hidden;
		width: 160px;
		line-height: 30px;
		height:30px;	
		background: #FFFFFF;
		box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.5);
		border-radius: 4px;
		font-size: 12px;
		text-align: center;
		color: #fff;
		display: flex;
		cursor: pointer;
	}
	.submitButton{
		width:79px;
		color:#930CEA;
		border-right:1px solid #000000
	}
	.goBackButton{
		width:79px;
		color:#000000;
	}
	.addressTips{
		position: absolute;
		z-index: 1;
		line-height:20px;
		right:10px;
		bottom:10px;
		background-color: #133773;
		padding:2px 4px;
		box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.5);
		border-radius: 4px;
	}
	.uploadModifiedStoresContainer{
		position: absolute;
		background-color: rgba(19, 55, 115, 1);
		top:4px;
		left:360px;
		height:32px;
		text-align: center;
		line-height:32px;
		width:90px;
		border-radius: 4px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		font-size:12px;
		color:#ffffff;
		z-index: 4;
		box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.4);
		cursor:pointer;
		.uploadButton{
			display: block;
			position: absolute;
			z-index: 1;
			left:0;
			top:0;
			width:90px;
			height:32px;
			opacity: 0;
			cursor:pointer;
		}
	}
</style>
<style lang="scss">
	// 对于地图内部的maker样式特别处理，不用scoped
	#business_navigate_container{
		// 对于高德检索弹窗等
		.amap-pls-marker-tip, .amap-lib-infowindow {
			color:#000000;
		}
		// 标尺变成黑色
		.amap-scale-text{
			color:#000000
		}
	}
	.mapContainer {
		.numContent {
			box-sizing: border-box;
			font-size: 12px;
			color: #ffffff;
			padding: 2px 4px;
			background: #7909c1;
			border-radius: 4px;
			border:1px solid #ffffff;
			box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.7);
			white-space: nowrap;
			text-align: center;
			margin-bottom: 2px;
			opacity:0.9;
		}
		.areaName {
			box-sizing: border-box;
			font-size: 14px;
			color: #000000;
			white-space: nowrap;
			text-align: center;
		}
		.markerStar{
			box-sizing: border-box;
			display: block;
			width:25px;
			height:25px;
			margin-left:auto;
			margin-right:auto;
		}
		.markerImg{
			width:25px;
			height:25px;
		}
	}
</style>
