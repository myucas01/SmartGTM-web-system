<!--
    商机拓展-店铺画像全屏charts模块
-->
<template>
	<div class="fullChartBoard" id="full_chart_board" ref='fullChartBoardDom'>
		<header class='fullScreenHeader'>
			<section class='leftheader'>
				<p class='storeName'>{{storesCountDatas.storesName}}</p>
				<p class='storeNumTitle'>门店数量</p>
				<p class='storeNum'>{{ storesCountDatas.storeCount | numFormat }}</p>
				<p class='storePercent'>（{{ storesCountDatas.perCent }}）</p>
			</section>
			<!--还原-->
			<svg class="icon notFullscreenButton" aria-hidden="true" @click='notFullScreen'>
				<use xlink:href="#iconicon_table_fullscreen"></use>
			</svg>
		</header>
		<section class='part1'>
			<!--门店类型*2 柱状+散点-->
			<div class='leftPart storeTypes'>
				<div class='publicHeader storeTypesHeader'>
					门店类型分布
					<i class="el-icon-question icon-tooltip" title='占比：某类门店占该店群全部门店的占比；TGI：Target Group Index(目标群体指数)，目标群体中具有某一特征的群体所占比例/总体中具有相同特征的群体所占比例✖️100，其中TGI指数等于100表示平均水平，高于100，代表该类门店对某类标签的关注程度高于整体水平'></i>
					<span class='goBackLastBar' v-show='current_store_level === 3' @click='getLastStoreType'>返回</span>
				</div>
				<div class='echartsModel'>
					<div class='typeBarContanier'>
						<div class="chart-container" :style="{ height: scrollYBarHeight + 'rem' }" >
							<chart :options="scrollYBarChartOption" ref='store_type_bar_chart_obj'/>
						</div>
					</div>
					<div class='seperateLine'></div>
					<div class='typeScatterBarContanier'>
						<div class='legendHeader'>
							<span class='typeName'>TGI指数</span>
							<!--图例说明-->
							<div class="legend-wrap">
								<span class="circle blue-circle"></span>
								<span class="legend-des">TGI>=100%</span>
								<span class="circle red-circle"></span>
								<span class="legend-des">TGI&lt;100%</span>
							</div>
						</div>
						<div class="chart-container" :style="{ width: scrollXScatterWidth + 'rem' }">
							<chart :options="scatterChartOption" />
						</div>
					</div>
				</div>
			</div>
			<!--门店地区*1 散点折线-->
			<div class='rightPart storeDistribution'>
				<div class='publicHeader storeDistributionHeader'>
					门店所在地区分布
					<i class="el-icon-question icon-tooltip" title='占比：某地区门店占该店群全部门店的占比；TGI：Target Group Index(目标群体指数)，目标群体中具有某一特征的群体所占比例/总体中具有相同特征的群体所占比例✖️100，其中TGI指数等于100表示平均水平，高于100，代表该类门店对某类标签的关注程度高于整体水平'></i>
					<span class='goBackLastBar' v-show='current_org_type && query_obj.storeType==="seed_store" && top_org_type !== (current_org_type - 1)' @click='getLastOrg'>返回</span>
					<span class='goBackLastBar' v-show='current_org_type && query_obj.storeType==="opportunity_store" && current_org_type !== 1' @click='getLastOrg'>返回</span>
				</div>
				<div class='echartsModel2'>
					<div class='storeDistributionBar'>
						<div class='legendHeader'>
							<!--图例说明-->
							<div class="legend-wrap">
								<span class="circle orange-circle"></span>
								<span class="circle blue-circle"></span>
								门店数
								<span class="legend-des legend-tgi-des">--- TGI指数</span>
							</div>
						</div>
						<div class="chart-container" :style="{ width: scrollXBarWidth + 'rem' }">
							<chart :options="scrollXBarChartOption" ref='bar_chart_obj'/>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class='part2'>
			<!--标签分布*4 柱状 -->
			<div class='leftPart tagDistribution'>
				<div class='publicHeader tagDistributionHeader'>标签分布
					<i class="el-icon-question icon-tooltip" title='店群占比：该店群有该标签值的店占整个店群的占比；GAIA大盘占比：GAIA大盘中有该标签值的店占整个GAIA大盘的占比；TGI：Target Group Index(目标群体指数)，目标群体中具有某一特征的群体所占比例/总体中具有相同特征的群体所占比例✖️100，其中TGI指数等于100表示平均水平，高于100，代表该类门店对某类标签的关注程度高于整体水平'></i>
				</div>
				<div class='echartsModel2'>
					<div class='tagDistributionBar'>
						<div class="chart-container pmBar">
							<div class='legendHeader'>
								<span class='typeName'>人流量</span>
								<!--图例说明-->
								<div class="legend-wrap">
									<span class="circle blue-circle"></span>
									<span class="legend-des">TGI>=100%</span>
									<span class="circle red-circle"></span>
									<span class="legend-des">TGI&lt;100%</span>
								</div>
							</div>
							<chart :options="multiBarChartOption1" />
						</div>
						<div class="chart-container pmBar">
							<div class='legendHeader'>
							<span class='typeName'>交通便利</span>
							<!--图例说明-->
							<div class="legend-wrap">
								<span class="circle blue-circle"></span>
								<span class="legend-des">TGI>=100%</span>
								<span class="circle red-circle"></span>
								<span class="legend-des">TGI&lt;100%</span>
							</div>
						</div>
							<chart :options="multiBarChartOption2" />
						</div>
						<div class="chart-container pmBar">
							<div class='legendHeader'>
								<span class='typeName'>消费力指数</span>
								<!--图例说明-->
								<div class="legend-wrap">
									<span class="circle blue-circle"></span>
									<span class="legend-des">TGI>=100%</span>
									<span class="circle red-circle"></span>
									<span class="legend-des">TGI&lt;100%</span>
								</div>
							</div>
							<chart :options="multiBarChartOption3" />
						</div>
						<div class="chart-container pmBar">
							<div class='legendHeader'>
								<span class='typeName'>门店密集程度</span>
								<!--图例说明-->
								<div class="legend-wrap">
									<span class="circle blue-circle"></span>
									<span class="legend-des">TGI>=100%</span>
									<span class="circle red-circle"></span>
									<span class="legend-des">TGI&lt;100%</span>
								</div>
							</div>
							<chart :options="multiBarChartOption4" />
						</div>
						<div class="chart-container pmBar">
							<div class='legendHeader'>
								<span class='typeName'>房价</span>
								<!--图例说明-->
								<div class="legend-wrap">
									<span class="circle blue-circle"></span>
									<span class="legend-des">TGI>=100%</span>
									<span class="circle red-circle"></span>
									<span class="legend-des">TGI&lt;100%</span>
								</div>
							</div>
							<chart :options="multiBarChartOption5" />
						</div>
					</div>
				</div>
			</div>
			<!--POI*2 柱状+散点 -->
			<div class='rightPart poiDistribution'>
				<div class='publicHeader poiDistributionHeader'>POI类型分布
					<i class="el-icon-question icon-tooltip" title='占比：周围有某类POI的门店占该店群全部门店的占比；TGI：Target Group Index(目标群体指数)，目标群体中具有某一特征的群体所占比例/总体中具有相同特征的群体所占比例✖️100，其中TGI指数等于100表示平均水平，高于100，代表该类门店对某类标签的关注程度高于整体水平'></i>
				</div>
				<div class='echartsModel'>
					<div class='poiBarContanier'>
						<div class="chart-container" :style="{ height: poiScrollYBarHeight + 'rem' }" >
							<chart :options="poiScrollYBarChartOption" />
						</div>
					</div>
					<div class='seperateLine'></div>
					<div class='poiScatterBarContanier'>
						<div class='legendHeader'>
							<span class='typeName'>TGI指数</span>
							<!--图例说明-->
							<div class="legend-wrap">
								<span class="circle blue-circle"></span>
								<span class="legend-des">TGI>=100%</span>
								<span class="circle red-circle"></span>
								<span class="legend-des">TGI&lt;100%</span>
							</div>
						</div>
						<div class="chart-container" :style="{ width: poiScrollXScatterWidth + 'rem' }">
							<chart :options="poiScatterChartOption" />
						</div>
					</div>
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
		name: 'full_chart_board',
		components: { chart },
		data() {
			return {
				// 门店类型分类（柱状图）
				scrollYBarChartOption: {},
				scrollYBarHeight:'',
				// 门店类型分类-TGI（散点图）
				scatterChartOption: {},
				scrollXScatterWidth:'',
				// 门店所在地区分布（柱状图+折线图）
				scrollXBarChartOption: {},
				scrollXBarWidth:'',
				// 标签分布（多柱状图）*5
				multiBarChartOption1: {},
				multiBarChartOption2: {},
				multiBarChartOption3: {},
				multiBarChartOption4: {},
				multiBarChartOption5: {},
				// POI类型（柱状图）
				poiScrollYBarChartOption: {},
				poiScrollYBarHeight:'',
				// POI类型（散点图）
				poiScatterChartOption: {},
				poiScrollXScatterWidth:'',
				// 店铺类型：种子seed_store || 商机opportunity_store
				store_type: '',
				// 查询地区分布请求数据
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
					storeType: ''
				},
				// 当下所在地区层级值，如果是3则无法下钻
				current_org_type: '',
				// 某门店所在最高层级，如果当下层级 -1 等于顶级值，则不显示返回
				top_org_type: '',
				// 门店类型分类的上一个orgid
				parent_id: '',
				// 当前的的orgId数组
				org_id_arr: [],
				// 当前门店类型分类的层级
				current_store_level: 2
			}
		},
		// 门店地区分布:regionDatas TGI等:tgiDatas 标签分布:labelDatas 门店总量:storesCountDatas
		props:['regionDatas', 'tgiDatas', 'labelDatas', 'storesCountDatas'],
		watch: {
			regionDatas: {
				handler: function (data) {
					console.log('监听门店地区分布：regionDatas')
					this.renderRegion(data)
				},
				deep: true
			},
			tgiDatas: {
				handler: function (data) {
					console.log('监听TGI等：tgiDatas')
					this.renderTGI(data)
				},
				deep: true
			},
			labelDatas: {
				handler: function (data) {
					console.log('监听标签分布：labelDatas')
					this.renderLabel (data)
				},
				deep: true
			}
		},
		created() {},
		mounted() {
			// 初始化px to rem值
			this.initPixelToRem()
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
					console.log('点击某柱/线状图：', params)
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
			 * @description 返回上一级orgid
			 */
			getLastOrg() {
				console.log('获取上一层级的数据')
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
			 * @description 触发全屏机制
			 */
			fullScreen() {
				this.$refs.fullChartBoardDom.requestFullscreen()
			},
			/**
			 * @description 关闭全屏
			 */
			notFullScreen() {
				document.exitFullscreen()
			},
			/**
			 * @description 动态修改html上的font-size，以转化为rem；因为设计稿为1280px的宽度，在计算时将设计稿宽/高除以10即可得到rem值
			 */
			initPixelToRem() {
				let docEl = document.documentElement;
				let resizeEvt = "orientationchange" in window ? "orientationchange" : "resize";
				let recalc = () => {
					docEl.style.fontSize = 10 * (docEl.clientWidth / 1280) + "px";
					// 同时监听 ESC 按键屏幕大小一旦发生变化则全屏按钮发生变化
					if (document.fullscreen) {
						this.is_full_screen = true;
					} else {
						this.is_full_screen = false;
					}
				};
				recalc();
				// 当窗口大小发生变动时触发
				window.addEventListener(resizeEvt, recalc, false);
				// DOMContentLoaded用于仅仅当document被加载后就会触发，而不会等待所有资源如js，css这点和load不同
				document.addEventListener("DOMContentLoaded", recalc, false);
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
				let series_data = [...data.storeTypeValue]
				// ，然后降序排列
				series_data = series_data.sort((a, b) => {
					return b - a
				})
				if (category_data && category_data.length > 8) {
					this.scrollYBarHeight = 3.4 * series_data.length
				}
				this.scrollYBarChartOption = scrollYBarChart(category_data, series_data)

				// 门店类型-TGI（散点图-横向滚动）
				let scatter_data = data.businessTGI
				if (scatter_data && scatter_data.length > 8) {
					this.scrollXScatterWidth = 3.4 * scatter_data.length
				}
				this.scatterChartOption = scatterChart(scatter_data)

				/*---------------------POI类型-------------------*/
				let poi_category_data = data.poiTypeName
				// 复制数组一份
				let poi_series_data = [...data.poiTypeValue]
				// ，然后降序排列
				poi_series_data = poi_series_data.sort((a, b) => {
					return b - a
				})
				if (scatter_data && poi_category_data.length > 8) {
					this.poiScrollYBarHeight = 3.4 * poi_category_data.length
				}
				this.poiScrollYBarChartOption = scrollYBarChart(poi_category_data, poi_series_data)

				// 门店类型-TGI（散点图-横向滚动）
				let poi_scatter_data = data.poiTGI
				if (poi_scatter_data && poi_scatter_data.length > 8) {
					this.poiScrollXScatterWidth = 3.4 * poi_scatter_data.length
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
				if (category_data_1.length > 8) {
					this.scrollXBarWidth = 3.4 * category_data_1.length
				}
				this.scrollXBarChartOption = scrollXBarChart(category_data_1, bar_data_1, line_data_1)
			},

			/**
			 * @description 渲染标签分布
			 */
			renderLabel(data){
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
			}
		}
	}
</script>

<style scoped lang="scss">
	div, header, section, article, p {
		box-sizing: border-box;
	}
	.fullChartBoard {
		background-color: #0A2757;
		width: 128rem;
		height: 72rem;
		position: fixed;
		z-index: -1;
		left:0;
		top:0;
		right: 0;
		bottom: 0;
		margin: auto;
		border-radius: 0.4rem;
		.icon-tooltip{
			font-size:1.3rem;
			margin-left: 0.8rem;
			margin-top: 0.2rem;
		}
		.fullScreenHeader {
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: #191839;
			padding: 0 2.5rem;
			width:128rem;
			height: 6rem;
			.leftheader{
				display: flex;
				align-items: center;
				.storeName{
					font-size: 2rem;
					font-weight: bold;
					margin-right:4.5rem;
				}
				.storeNumTitle{
					font-size: 1.8rem;
					margin-right:2rem;
				}
				.storeNum{
					font-size: 3rem;
					font-weight: bold;
					margin-right:1rem;
				}
				.storePercent{
					font-size: 2rem;
				}
			}
			.notFullscreenButton {
				display: block;
				font-size: 2rem;
				cursor: pointer;
			}
		}
		.chart-container {
			width: 100%;
			height: 100%;
		}
		.pmBar{
			height:20rem;
			width: 30rem;
			flex-shrink: 0;
			border-right: 1px solid #A634EF;
			padding-right:1rem;
		}
		.pmBar:last-child{
			border-right: 0px;
		}
		.part1, .part2{
			padding-left:2.5rem;
			padding-right:2.5rem;
			margin-top:2rem;
			display: flex;
			.leftPart, .rightPart {
				height:30rem;
				border-radius: 1.4rem;
				background-color: #47059C;
			}
			.publicHeader{
				height:5.4rem;
				border-radius: 1.4rem;
				background-color: #7134EF;
				font-weight: bold;
				font-size:2.4rem;
				padding-left:2rem;
				padding-right:2rem;
				display: flex;
				align-items: center;
				.goBackLastBar{
					font-size:10px;
					cursor:pointer;
					margin-left:4px;
				}
			}
			.storeTypes{
				width:81.5rem;
				margin-right:2rem;
			}
			.storeDistribution, .tagDistribution{
				width:39.5rem;
			}
			.tagDistribution{
				margin-right:2rem;
			}
			.echartsModel{
				padding:1rem;
				display: flex;
				.typeBarContanier, .poiBarContanier{
					width:39rem;
					height:22.4rem;
					overflow-y: auto;
				}
				.typeScatterBarContanier, .poiScatterBarContanier{
					width:40rem;
					height:22.4rem;
					overflow-x: auto;
				}
				.seperateLine{
					width:0.1rem;
					background-color: #A634EF;
					height:22.4rem;
				}
			}
			.echartsModel2{
				padding:10px;
				.storeDistributionBar, .tagDistributionBar{
					width:100%;
					height:22rem;
					overflow-x: auto;
				}
				.tagDistributionBar{
					display: flex;
					align-items: center;
				}
			}
			.legendHeader {
					display: flex;
					padding-left:2rem;
					.typeName{
						font-size:1.4rem;
					}
					.legend-wrap {
						margin-left: auto;
						margin-right: auto;
						display: flex;
						justify-content: right;
						align-items: center;
						.circle {
							width: 0.5rem;
							height: 0.5rem;
							margin-right: 0.8rem;
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
							margin-right: 0.8rem;
							font-size: 1rem;
							line-height: 1rem;
							padding-top: 0.2rem;
						}
						.legend-tgi-des {
							margin-left: 1.4rem;
						}
					}
				}
		}
	}
	.fullChartBoardShow {
		display: block;
	}
</style>
