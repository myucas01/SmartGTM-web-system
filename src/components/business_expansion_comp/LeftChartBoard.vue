<!--
    商机拓展-店铺画像左侧charts模块
-->
<template>
	<div class="leftChartBoard" id="left_chart_board">
		<!--顶部面包屑-->
		<section class="breadcrumb">
			<i class="el-icon-s-fold switchLeftBoardButton" @click="showUp"></i>
			<span class="text">{{ store_type === 'seed_store'? '种子门店/种子门店画像' : '商机门店/商机门店画像' }}</span>
			<div class="goBackButton" @click='routeBack'>返回</div>
			<!--全屏-->
			<svg class="icon fullscreenButton" aria-hidden="true" @click='triggerFullScreen'>
				<use xlink:href="#iconicon_screen"></use>
			</svg>
		</section>
		<section class="content-wrap">
			<p class="title">
				店群画像<span class="somewhereName">（{{storesCountDatas.storesName}}）</span>
			</p>
			<div class="content">
				<div class="store-charts-panel">
					<section class="scroll-wrapper">
						<div class="list-wrapper">
							<!-- 总数 -->
							<div class="total-wrapper">
								<p class="label">门店数量</p>
								<div class="text">
									<span class="count">{{ storesCountDatas.storeCount | numFormat }}</span>
									<span class="percent">（{{ storesCountDatas.perCent }}）</span>
									<el-tooltip v-if='store_type === "seed_store"' effect="dark" content="表示GAIA从种子⻔店中成功匹配的⻔店比率" placement="top-start">
										<i class="el-icon-question icon-tooltip"></i>
									</el-tooltip>
									<el-tooltip v-if='store_type === "opportunity_store"' effect="dark" content="表示当前店群占GAIA大盘的比率" placement="top-start">
										<i class="el-icon-question icon-tooltip"></i>
									</el-tooltip>
								</div>
							</div>
							<!-- echarts列表 -->
							<div class="chart-wrapper">
								<div class="title-block" @click="handleSpread">
									<i
										class="el-icon-caret-right"
										:class="{ active: isSpread }"
									></i>
									<p class="text">画像维度</p>
								</div>
								<!--门店类型分布（柱状+散点）-->
								<div class="chart-module-wrap" v-show="isSpread">
									<!--大标题-->
									<div class="content-title">
										门店类型分类
										<el-tooltip
											effect="dark"
											content="占比：某类门店占该店群全部门店的占比"
											placement="top-start"
										>
											<i class="el-icon-question icon-tooltip"></i>
										</el-tooltip>
										<span class='goBackLastBar' v-show='current_store_level === 3' @click='getLastStoreType'>返回</span>
									</div>
									<!--echarts模块-->
									<div class="content-block">
										<!--echart容器-->
										<div class="chart-wrap chart-scroll-y">
											<div class="chart-container" :style="{ height: scrollYBarHeight + 'px' }" >
												<chart :options="scrollYBarChartOption" ref='store_type_bar_chart_obj'/>
											</div>
										</div>
									</div>
									<div class="content-title s-title">
										TGI指数
										<el-tooltip
											effect="dark"
											content="Target Group Index(目标群体指数)，目标群体中具有某一特征的群体所占比例/总体中具有相同特征的群体所占比例✖️100，其中TGI指数等于100表示平均水平，高于100，代表该类门店对某类标签的关注程度高于整体水平"
											placement="top-start"
										>
											<div slot="content">
												Target Group Index(目标群体指数)，目标群体中具有某一特征的群体所占比例/总体中具有相同特征的群体所占比例✖️100，<br/>
												其中TGI指数等于100表示平均水平，高于100，代表该类门店对某类标签的关注程度高于整体水平
											</div>
											<i class="el-icon-question icon-tooltip"></i>
										</el-tooltip>
									</div>
									<div class="content-block">
										<!--图例说明-->
										<div class="legend-wrap">
											<span class="circle blue-circle"></span>
											<span class="legend-des">TGI>=100%</span>
											<span class="circle red-circle"></span>
											<span class="legend-des">TGI&lt;100%</span>
										</div>
										<!--echart容器-->
										<div class="chart-wrap chart-scroll-x">
											<div class="chart-container" :style="{ width: scrollXScatterWidth + 'px' }">
												<chart :options="scatterChartOption"/>
											</div>
										</div>
									</div>
								</div>

								<!--门店所在地区分布-->
								<div class="chart-module-wrap" v-show="isSpread">
									<div class="content-title">
										门店所在地区分布
										<el-tooltip
											effect="dark"
											placement="top-start"
										>
											<div slot="content">
												占比：某地区门店占该店群全部门店的占比；TGI：Target Group Index(目标群体指数)，<br/>
												目标群体中具有某一特征的群体所占比例/总体中具有相同特征的群体所占比例✖️100，<br/>
												其中TGI指数等于100表示平均水平，高于100，代表该类门店对某类标签的关注程度高于整体水平
											</div>
											<i class="el-icon-question icon-tooltip"></i>
										</el-tooltip>
										<span class='goBackLastBar' v-show='current_org_type && query_obj.storeType==="seed_store" && top_org_type !== (current_org_type - 1)' @click='getLastOrg'>返回</span>
										<span class='goBackLastBar' v-show='current_org_type && query_obj.storeType==="opportunity_store" && current_org_type !== 1' @click='getLastOrg'>返回</span>
									</div>
									<div class="content-block">
										<!--图例说明-->
										<div class="legend-wrap">
											<span class="circle orange-circle"></span>
											<span class="circle blue-circle"></span>
											门店数
											<span class="legend-des legend-tgi-des">--- TGI指数</span>
										</div>
										<!--echart容器-->
										<div class="chart-wrap chart-scroll-x">
											<div class="chart-container" :style="{ width: scrollXBarWidth + 'px' }">
												<chart :options="scrollXBarChartOption" ref='bar_chart_obj' />
											</div>
										</div>
									</div>
								</div>

								<!--标签分布，4 tab-->
								<div class="chart-module-wrap" v-show="isSpread">
									<div class="content-title">
										标签分布
										<el-tooltip
											effect="dark"
											placement="top-start"
										>
											<div slot="content">
												店群占比：该店群有该标签值的店占整个店群的占比；GAIA大盘占比：GAIA大盘中有该标签值的店占整个GAIA大盘的占比；<br/>
												TGI：Target Group Index(目标群体指数)，目标群体中具有某一特征的群体所占比例/总体中具有相同特征的群体所占比例✖️100，<br/>
												其中TGI指数等于100表示平均水平，高于100，代表该类门店对某类标签的关注程度高于整体水平
											</div>
											<i class="el-icon-question icon-tooltip"></i>
										</el-tooltip>
									</div>
									<div class="content-block">
										<!--tab切换-->
										<div class='multi-bar-tabs'>
											<div class='perTab' :class='{perTabActive:currentTabNum === 0}' @click='triggerThisTagTab(0)'>人流量</div>
											<div class='perTab' :class='{perTabActive:currentTabNum === 1}' @click='triggerThisTagTab(1)'>交通便利</div>
											<div class='perTab' :class='{perTabActive:currentTabNum === 2}' @click='triggerThisTagTab(2)'>消费力指数</div>
											<div class='perTab' :class='{perTabActive:currentTabNum === 3}' @click='triggerThisTagTab(3)'>门店密集程度</div>
											<div class='perTab' :class='{perTabActive:currentTabNum === 4}' @click='triggerThisTagTab(4)'>房价</div>
										</div>
										<!--图例说明-->
										<div class="legend-wrap">
											<span class="circle blue-circle"></span>
											<span class="legend-des">TGI>=100%</span>
											<span class="circle red-circle"></span>
											<span class="legend-des">TGI&lt;100%</span>
										</div>
										
										<!--echart容器-->
										<div class="chart-wrap chart-multi-bar-container" v-show='currentTabNum === 0'>
											<div class="chart-container">
												<chart :options="multiBarChartOption1" />
											</div>
										</div>
										<div class="chart-wrap chart-multi-bar-container" v-show='currentTabNum === 1'>
											<div class="chart-container">
												<chart :options="multiBarChartOption2" />
											</div>
										</div>
										<div class="chart-wrap chart-multi-bar-container" v-show='currentTabNum === 2'>
											<div class="chart-container">
												<chart :options="multiBarChartOption3" />
											</div>
										</div>
										<div class="chart-wrap chart-multi-bar-container" v-show='currentTabNum === 3'>
											<div class="chart-container">
												<chart :options="multiBarChartOption4" />
											</div>
										</div>
										<div class="chart-wrap chart-multi-bar-container" v-show='currentTabNum === 4'>
											<div class="chart-container">
												<chart :options="multiBarChartOption5" />
											</div>
										</div>
									</div>
								</div>

								<!--POI（柱状+散点）-->
								<div class="chart-module-wrap" v-show="isSpread">
									<div class="content-title">
										POI 类型分布
										<el-tooltip
											effect="dark"
											placement="top-start"
										>
											<div slot="content">
												占比：周围有某类POI的门店占该店群全部门店的占比；
											</div>
											<i class="el-icon-question icon-tooltip"></i>
										</el-tooltip>
									</div>
									<div class="content-block">
										<!--echart容器-->
										<div class="chart-wrap chart-scroll-y">
											<div class="chart-container" :style="{ height: poiScrollYBarHeight + 'px' }" >
												<chart :options="poiScrollYBarChartOption" />
											</div>
										</div>
									</div>
									<div class="content-title s-title">
										TGI 指数
										<el-tooltip
											effect="dark"
											placement="top-start"
										>
											<div slot="content">
												Target Group Index(目标群体指数)，目标群体中具有某一特征的群体所占比例/总体中具有相同特征的群体所占比例✖️100<br/>
												其中TGI指数等于100表示平均水平，高于100，代表该类门店对某类标签的关注程度高于整体水平
											</div>
											<i class="el-icon-question icon-tooltip"></i>
										</el-tooltip>
									</div>
									<div class="content-block">
										<!--图例说明-->
										<div class="legend-wrap">
											<span class="circle blue-circle"></span>
											<span class="legend-des">TGI>=100%</span>
											<span class="circle red-circle"></span>
											<span class="legend-des">TGI&lt;100%</span>
										</div>
										<!--echart容器-->
										<div class="chart-wrap chart-scroll-x">
											<div class="chart-container" :style="{ width: poiScrollXScatterWidth + 'px' }">
												<chart :options="poiScatterChartOption" />
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="btn-wrapper">
								<span @click="switchShowExportTable">导出</span>
							</div>
						</div>
					</section>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
	import chart from '@/components/Chart'
	import scrollYBarChart from '@/util/chartOptions/scrollYBarChart'
	import scatterChart from '@/util/chartOptions/scatterChart'
	import scrollXBarChart from '@/util/chartOptions/scrollXBarChart'
	import multiBarChart from '@/util/chartOptions/multiBarChart'
	import BUSINESS_EXP_DASHBOARD_API from '../../../api/business_expansion_dashboard_api'

	export default {
		name: 'left_chart_board',
		components: { chart },
		data() {
			return {
				// 是否展开/隐藏画像
				isSpread: true,
				// 门店类型分类（柱状图）
				scrollYBarChartOption: {},
				scrollYBarHeight:'',
				// 门店类型分类-TGI（散点图）
				scatterChartOption: {},
				scrollXScatterWidth:'',
				// 门店所在地区分布（柱状图+折线图）
				scrollXBarChartOption: {},
				scrollXBarWidth:'',
				// 标签分布（多柱状图）*4 tab
				// 人流量
				multiBarChartOption1: {},
				// 交通便利
				multiBarChartOption2: {},
				// 消费力指数
				multiBarChartOption3: {},
				// 门店密集程度
				multiBarChartOption4: {},
				// 房价
				multiBarChartOption5: {},
				// POI类型（柱状图）
				poiScrollYBarChartOption: {},
				poiScrollYBarHeight:'',
				// POI类型（散点图）
				poiScatterChartOption: {},
				poiScrollXScatterWidth:'',
				currentTabNum: 0,
				// 店铺类型：种子seed_store || 商机opportunity_store
				store_type: '',
				// 查询地区分布、门店类型分类模块的请求数据
				query_obj:{
					// 组织id
					orgId: '',
					// 仅仅为初始化第一次而用，来获取顶级层级值
					parentOrgId:'',
					// 组织层级：种子门店：1行销公司 2 营业部 3营业所；商机门店： 1-4 代表 省、市、区、镇/街道
					orgType: '',
					// 店群Id
					storesId: '',
					// 店铺类型：种子门店-seed_store，商机门店-opportunity_store
					storeType: '',
					// 门店类型分类专用字段需要提供给后端
					level: ''
				},
				// 当下所在地区层级值，如果是3则无法下钻
				current_org_type: '',
				// 某门店所在最高层级，如果当下层级 -1 等于顶级值，则不显示返回；如果没有数据返回则是null，也不显示返回
				top_org_type: '',
				// 当前的的orgId数组
				org_id_arr: [],
				// 当前门店类型分类的层级
				current_store_level: 2

			}
		},
		computed: {
			isOpenExport() {
				return this.$store.state.businessExpansionModule.isOpenExport;
			},
		},
		// 门店地区分布:regionDatas TGI等:tgiDatas 标签分布:labelDatas 门店总量:storesCountDatas
		props:['regionDatas', 'tgiDatas', 'labelDatas', 'storesCountDatas'],
		watch: {
			regionDatas: {
				handler: function (data) {
					this.renderRegion(data)
				},
				deep: true
			},
			tgiDatas: {
				handler: function (data) {
					this.renderTGI(data)
				},
				deep: true
			},
			labelDatas: {
				handler: function (data) {
					this.renderLabel (data)
				},
				deep: true
			},
			isOpenExport(val) {
				this.$emit('switchShowExportTable', val);
			},
		},
		created() {},
		mounted() {
			// 首先从路由query获取参数，如果没有（没有就说明是第一次进入）从则从session（登陆者信息）取，如果还没有则默认为江苏
			if (this.$route.query.orgId) {
				this.query_obj.orgId = this.$route.query.orgId
				this.query_obj.parentOrgId = this.$route.query.orgId
			} else if (this.$cookies.get('orgId')) {
				this.query_obj.orgId = this.$cookies.get('orgId')
				this.query_obj.parentOrgId = this.$cookies.get('orgId')
			} else {
				this.query_obj.orgId = '5074727057550190748'
				this.query_obj.parentOrgId = '5074727057550190748'
			}
			// 获取店群ID
			this.query_obj.storesId = this.$route.query.storesId
			// 获取店群类型
			this.query_obj.storeType = this.$route.query.storeType
			// 绑定门店所在地区分布柱状图事件
			this.$refs.bar_chart_obj.$refs.thisChart.chart.on('click', params => {
				this.getNewBarLine(params)
			})
			// 绑定门店类型分类事件
			this.$refs.store_type_bar_chart_obj.$refs.thisChart.chart.on('click', params => {
				this.getNewStoreTypeBarLine(params)
			})
			this.store_type = this.$route.query.storeType
		},
		methods: {
			/**
			 * @description 下钻门店所在地区分布
			 */
			getNewBarLine(params) {
				if(this.current_org_type !== 3) {
					// 获取新的orgId
					this.query_obj.orgId = this.org_id_arr[params.dataIndex]
					// 获取门店所在地区分布
					BUSINESS_EXP_DASHBOARD_API.get_dash_region(this.query_obj).then((res) => {
						this.renderRegion(res)
					})
				}
			},

			/**
			 * @description 下钻门店类型分布
			 */
			getNewStoreTypeBarLine() {
				if(this.current_store_level === 2) {
					this.current_store_level = this.current_store_level + 1
					this.query_obj.level = 3
					// 获取门店所在地区分布
					BUSINESS_EXP_DASHBOARD_API.get_dash_TGI(this.query_obj).then((res) => {
						this.renderTGI(res)
					})
				}
			},

			/**
			 * @description 返回上一级门店所在地区orgId
			 */
			getLastOrg() {
				// 获取门店所在地区分布
				BUSINESS_EXP_DASHBOARD_API.get_previous_dash_region(this.query_obj).then((res) => {
					this.renderRegion(res)
				})
			},

			/**
			 * @description 返回上一级门店类型分类
			 */
			getLastStoreType() {
				this.current_store_level = this.current_store_level - 1
				this.query_obj.level = 2
				// 获取门店所在地区分布
				BUSINESS_EXP_DASHBOARD_API.get_dash_TGI(this.query_obj).then((res) => {
					this.renderTGI(res)
				})
			},

			/**
			 * @description 左侧过滤面板隐藏/显示
			 */
			showUp() {
				this.$emit('change', false)
			},

			/**
			 * @description 弹出导出模块
			 */
			switchShowExportTable() {
				// this.$emit('switchShowExportTable', true)
				this.$store.commit('businessExpansionModule/SET_IS_OPEN_EXPORT', true);
			},

			/**
			 * @description 是否展开画像
			 */
			handleSpread() {
				this.isSpread = !this.isSpread
			},

			/**
			 * @description 打开全屏模式
			 */
			triggerFullScreen() {
				this.$emit('openFullScreen')
			},

			/**
			 * @description 渲染门店类型+POI（类型分布+TGI）
			 */
			renderTGI(data){
				// 为门店类型分类下钻准备
				this.current_store_level = data.level
				this.query_obj.level = data.level
				/*---------------------门店类型-------------------*/
				// 门店类型-（柱状图-垂直滚动）
				let category_data = data.storeTypeName
				// 复制数组一份
				let series_data = data.storeTypeValue
				if (category_data && category_data.length > 8) {
					this.scrollYBarHeight = 34 * series_data.length
				}

				this.scrollYBarChartOption = scrollYBarChart(category_data, series_data)

				// 门店类型-TGI（散点图-横向滚动）
				let scatter_data = data.businessTGI
				if (scatter_data && scatter_data.length > 8) {
					this.scrollXScatterWidth = 34 * scatter_data.length
				}
				this.scatterChartOption = scatterChart(scatter_data)

				/*---------------------POI类型-------------------*/
				let poi_category_data = data.poiTypeName
				// 复制数组一份
				let poi_series_data = data.poiTypeValue
				if (category_data && category_data.length > 8) {
					this.scrollYBarHeight = 34 * series_data.length
				}
				if (poi_category_data && poi_category_data.length > 8) {
					this.poiScrollYBarHeight = 34 * poi_category_data.length
				}
				this.poiScrollYBarChartOption = scrollYBarChart(poi_category_data, poi_series_data)

				// 门店类型-TGI（散点图-横向滚动）
				let poi_scatter_data = data.poiTGI
				if (poi_scatter_data && poi_scatter_data.length > 8) {
					this.poiScrollXScatterWidth = 34 * poi_scatter_data.length
				}
				this.poiScatterChartOption = scatterChart(poi_scatter_data)
			},

			/**
			 * @description 渲染门店所在地区分布
			 */
			renderRegion(data){
				// 获取当下层级值
				this.current_org_type = data.orgType
				// 获取最高层级值
				this.top_org_type = data.parentOrgType
				// 初始化当前的orgId的列表，为下钻做准备
				this.org_id_arr = data.orgIds
				// 初始化当前层级，为返回做准备
				this.query_obj.orgType = data.orgType
				// 门店所在地分布（柱状图 + 折线-横向滚动）
				let category_data_1 = data.regionNames
				let bar_data_1 = data.storeNumbers
				let line_data_1 = data.tgiNumbers
				if (category_data_1 && category_data_1.length > 8) {
					this.scrollXBarWidth = 34 * category_data_1.length
				}
				this.scrollXBarChartOption = scrollXBarChart(category_data_1, bar_data_1, line_data_1)
			},

			/**
			 * @description 渲染标签分布（多柱状图-tab）
			 */
			renderLabel(data){
				// 标签分布（多柱状图-tab）
				// 人流量
				let multi_bar_category_data_1 = data.visitors
				let multi_bar_positive_data_1 = data.visitorsLabelMaxValue
				let multi_bar_negative_data_1 = data.visitorsLabelMinValue
				this.multiBarChartOption1 = multiBarChart(multi_bar_category_data_1, multi_bar_negative_data_1, multi_bar_positive_data_1)
				
				// 交通便利
				let multi_bar_category_data_2 = data.transportation
				let multi_bar_positive_data_2 = data.transportationLabelMaxValue
				let multi_bar_negative_data_2 = data.transportationLabelMinValue
				this.multiBarChartOption2 = multiBarChart(multi_bar_category_data_2, multi_bar_negative_data_2, multi_bar_positive_data_2)

				// 消费力指数
				let multi_bar_category_data_3 = data.spendingpower
				let multi_bar_positive_data_3 = data.spendingpowerLabelMaxValue
				let multi_bar_negative_data_3 = data.spendingpowerLabelMinValue
				this.multiBarChartOption3 = multiBarChart(multi_bar_category_data_3, multi_bar_negative_data_3, multi_bar_positive_data_3)

				// 门店密集程度
				let multi_bar_category_data_4 = data.storedensity
				let multi_bar_positive_data_4 = data.storedensityLabelMaxValue
				let multi_bar_negative_data_4 = data.storedensityLabelMinValue
				this.multiBarChartOption4 = multiBarChart(multi_bar_category_data_4, multi_bar_negative_data_4, multi_bar_positive_data_4)

				// 房价
				let multi_bar_category_data_5 = data.housprice
				let multi_bar_positive_data_5 = data.houspriceLabelMaxValue
				let multi_bar_negative_data_5 = data.houspriceLabelMinValue
				this.multiBarChartOption5 = multiBarChart(multi_bar_category_data_5, multi_bar_negative_data_5, multi_bar_positive_data_5)
			},
			
			/**
			 * @description 切换标签类型tab
			 */
			triggerThisTagTab(num) {
				this.currentTabNum = num
			},

			/**
			 * @description 后退按钮
			 */
			routeBack() {
				this.$router.go(-1)
			}
		}
	}
</script>

<style scoped lang="scss">
	// 左侧控制面板
	.leftChartBoard {
		width: 340px;
		background-color: #0a2757;
		transition: all 0.2s;
		.breadcrumb {
			height: 40px;
			line-height: 40px;
			text-align: left;
			background: #081f45;
			position: relative;
			i.el-icon-s-fold {
				font-size: 15px;
				margin: 0 14px;
			}
			.text {
				font-size: 15px;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #ffffff;
			}
			i.el-icon-share {
				font-size: 20px;
				position: absolute;
				bottom: 10px;
				right: 10px;
				cursor: pointer;
			}
			.export-icon {
				font-size: 20px;
				position: absolute;
				bottom: 10px;
				right: 10px;
				cursor: pointer;
			}
			.switchLeftBoardButton {
				cursor: pointer;
			}
			.goBackButton {
				display: inline-block;
				cursor: pointer;
				width: 40px;
				height: 18px;
				line-height: 20px;
				background: rgba(255, 255, 255, 0);
				border-radius: 4px;
				border: 1px solid #7134ef;
				font-size: 10px;
				text-align: center;
				margin-left: 12px;
			}
			.fullscreenButton {
				position: absolute;
				cursor: pointer;
				right: 14px;
				top: 14px;
				z-index: 1;
				font-size: 16px;
			}
		}
		.content-wrap {
			.title {
				height: 40px;
				line-height: 40px;
				text-align: left;
				font-size: 18px;
				font-weight: bold;
				color: #ffffff;
				padding-left: 15px;
				.somewhereName {
					font-weight: normal;
					font-size: 12px;
				}
			}
			.content {
				width: 100%;
				height: calc(100vh - 155px);
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
									.count {
										display: inline-block;
										font-size: 34px;
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
								.icon-tooltip {
									font-size: 16px;
								}
							}
							.chart-wrapper {
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
								.chart-module-wrap {
									width: 310px;
									background: #47059c;
									border-radius: 8px;
									margin: 15px auto;
									.content-title,
									.s-title {
										height: 40px;
										line-height: 40px;
										background: #7134ef;
										border-radius: 8px;
										font-size: 16px;
										font-weight: 600;
										color: #ffffff;
										padding-left: 16px;
									}
									.s-title {
										height: 30px;
										line-height: 30px;
										font-size: 14px;
										font-weight: 600;
										border-radius: 0px;
									}
									.goBackLastBar{
										font-size:10px;
										cursor:pointer;
										margin-left:4px;
									}
									.legend-wrap {
										margin-top: 8px;
										width: 290px;
										height: 20px;
										margin-left: auto;
										margin-right: auto;
										display: flex;
										justify-content: right;
										align-items: center;
										.circle {
											width: 5px;
											height: 5px;
											margin-right: 8px;
											border-radius: 50%;
											border: 1px solid #ffffff;
										}
										.red-circle {
											background: #ed3f14;
										}
										.blue-circle {
											background: #5cadff;
										}
										.orange-circle {
											background: #ff9900;
										}
										.legend-des,
										.legend-tgi-des {
											margin-right: 8px;
											font-size: 10px;
											line-height: 10px;
											padding-top: 2px;
										}
										.legend-tgi-des {
											margin-left: 14px;
										}
									}
									.chart-wrap {
										width: 310px;
										height: 276px;
										margin-left: auto;
										margin-right: auto;
									}
									.chart-scroll-x {
										overflow-x: auto;
									}
									.chart-scroll-y {
										overflow-y: auto;
									}
									.chart-container {
										width: 100%;
										height: 100%;
									}
									.multi-bar-tabs{
										margin-top:15px;
										height:26px;
										padding-left:6px;
										padding-right:6px;
										display:flex;
										justify-content: space-between;
										.perTab{
											display: block;
											border-bottom:4px solid #47059C;
											color:#DDDEE1;
											transition:all 0.3s;
											cursor:pointer;
										}
										.perTabActive{
											border-bottom-color:#A634EF;
											color:#ffffff;
										}
										.perTab:hover{
											border-bottom-color:#A634EF;
											color:#ffffff;
										}
									}
									// 特别的对于多个柱状图容器
									.chart-multi-bar-container{
										height:215px;
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
				}
			}
		}
	}
</style>
