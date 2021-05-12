<template>
	<!-- 右侧 画像 -->
	<div class="store-charts-panel">
		<section class="scroll-wrapper">
			<div class="list-wrapper">
				<!-- 总数 -->
				<div class="total-wrapper">
					<p class="label">总点数
						<el-tooltip class="item" effect="dark" :content="tips_data.hxym_zds_km" placement="top">
							<i class="el-icon-question icon-tooltip"></i>
						</el-tooltip>
					</p>
					<div class="text">
						<span class="count">{{ totalCount | numFormat }}</span>
						<span class="percent">（{{ totalPercent }}）</span>
					</div>
				</div>
				<!-- 问题门店 -->
				<div class="problem-wrapper" v-if='!is_sale_route'>
					<div class="title-block"  @click="handleSpread('problem')">
						<i
							class="el-icon-caret-right"
							:class="{ active: isSpread.problem }"
						>
						</i>
						<p class="text">问题门店</p>
					</div>
					<div class="content-wrap" v-show="isSpread.problem">
						<div class="content-title">问题门店情况（点数）
							<el-tooltip class="item" effect="dark" content="" placement="top">
								<div slot="content">
									业务异常门店：<br />
									{{tips_data.wtmd_ywycmd_clmd_km}}<br />
									{{tips_data.wtmd_ywycmd_xlbdb_km}}<br />
									{{tips_data.wtmd_ywycmd_lxlgywcj_km}}<br />
									{{tips_data.wtmd_ywycmd_wcj_km}}<br />
									{{tips_data.wtmd_ywycmd_mdzyysbjw_km}}<br />
									{{tips_data.wtmd_ywycmd_mdzyyscdqy_km}}<br /><br />

									数据异常门店：<br />
									{{tips_data.wtmd_sjycmd_mdbmcw_km}}<br />
									{{tips_data.wtmd_sjycmd_mddzwx_km}}<br />
									{{tips_data.wtmd_sjycmd_mdmcwx_km}}<br />
									{{tips_data.wtmd_sjycmd_mdxxwx_km}}<br />
									{{tips_data.wtmd_sjycmd_jwdydxbpp_km}}<br />
									{{tips_data.wtmd_sjycmd_jwdztsdx_km}}<br />
									{{tips_data.wtmd_sjycmd_qskhlx_km}}<br />
									{{tips_data.wtmd_sjycmd_jwdqs_km}}<br />
									{{tips_data.wtmd_sjycmd_mdlxyc_km}}<br />
									{{tips_data.wtmd_sjycmd_khjlqs_km}}<br />
								</div>
								<i class="el-icon-question icon-tooltip"></i>
							</el-tooltip>
						</div>
						<div class="scroll-block">
							<div class="content-block">
								<template v-if='structureData'>
									<div class="list-group" v-for="(item, idx) in structureProblemData" :key="idx">
										<div class="list-title">
											<svg v-show="item.route === '业务异常'" class="icon el-icon-s-shop" aria-hidden="true">
												<use xlink:href="#iconicon_store"></use>
											</svg>
											<svg v-show="item.route === '数据异常'" class="icon el-icon-s-promotion" aria-hidden="true">
												<use xlink:href="#iconicon_tetong"></use>
											</svg>
											<span class="name">{{ item.route }}</span>
											<span class='totalCount'> {{item.routeCount | numFormat}}</span>
										</div>
										<!--如果超过4条，则分为多栏-->
										<div class='bGroup'>
											<div class='sGroup' v-for='(per_arr, index) in (restructArray(item.structureList))' :key= 'index'>
												<div class="list-data" v-for="(cell, i) in per_arr" :key="i" >
													<p class="label">{{ cell.channel }}</p>
													<p class="text">
														<span class="number">{{ cell.channelCount | numFormat }}</span>
														<i class="percent">（{{ cell.percentage }}）</i>
													</p>
												</div>
											</div>
										</div>
										<div class="vertical-line" v-show="idx !== 0"></div>
									</div>
								</template>
							</div>
						</div>
					</div>
				</div>
				<!-- 结构分布 -->
				<div class="structure-wrapper">
					<div class="title-block"  @click="handleSpread('structure')">
						<i
							class="el-icon-caret-right"
							:class="{ active: isSpread.structure }"
						>
						</i>
						<p class="text">结构分布</p>
					</div>
					<div class="content-wrap" v-show="isSpread.structure">
						<div class="content-title">门店结构情况（点数）
							<el-tooltip class="item" effect="dark" :content="tips_data.dqhx_mdjgqk_km" placement="top">
								<i class="el-icon-question icon-tooltip"></i>
							</el-tooltip>
						</div>
						<div class="scroll-block">
							<div class="content-block">
								<template v-if='structureData'>
									<div class="list-group" v-for="(item, idx) in structureData" :key="idx">
										<div class="list-title">
											<svg v-show="item.route === '士多'" class="icon el-icon-s-shop" aria-hidden="true">
												<use xlink:href="#iconicon_store"></use>
											</svg>
											<svg v-show="item.route === '特通'" class="icon el-icon-s-promotion" aria-hidden="true">
												<use xlink:href="#iconicon_tetong"></use>
											</svg>
											<svg v-show="item.route === '二阶'" class="icon el-icon-s-problem" aria-hidden="true">
												<use xlink:href="#iconicon_erjie"></use>
											</svg>
											<svg v-show="item.route === '餐饮'" class="icon el-icon-s-problem" aria-hidden="true">
												<use xlink:href="#iconicon_erjie"></use>
											</svg>
											<span class="name">{{ item.route }}</span>
											<span class='totalCount'> {{item.routeCount | numFormat}}</span>
										</div>
										<!--如果超过4条，则分为多栏-->
										<div class='bGroup'>
											<div class='sGroup' v-for='(per_arr, index) in (restructArray(item.structureList))' :key= 'index'>
												<div class="list-data" v-for="(cell, i) in per_arr" :key="i" >
													<p class="label">{{ cell.channel }}</p>
													<p class="text">
														<span class="number">{{ cell.channelCount | numFormat }}</span>
														<i class="percent">（{{ cell.percentage }}）</i>
													</p>
												</div>
											</div>
										</div>
										<div class="vertical-line" v-show="idx !== 0"></div>
									</div>
								</template>
							</div>
						</div>
					</div>
				</div>
				<!-- 销量情况 -->
				<div class="sales-wrapper">
					<div class="title-block" @click="handleSpread('sales')">
						<i
							class="el-icon-caret-right"
							:class="{ active: isSpread.sales }"
						>
						</i>
						<p class="text">销量情况</p>
					</div>
					<div class="content-wrap" v-show="isSpread.sales">
						<div class="content-title">门店销量情况（箱）
							<el-tooltip class="item" effect="dark" content="" placement="top">
								<div slot="content">
									{{tips_data.hxym_xlqk_yzxlzb_km}}<br />
									{{tips_data.hxym_xlqk_ydjxlhb_km}}<br />
								</div>
								<i class="el-icon-question icon-tooltip"></i>
							</el-tooltip>
						</div>
						<div class="content-block">
							<div class="top-wrap">
								<div
									class="top-item"
									v-for="(item, idx) in salesData"
									:key="idx"
								>
									<p class="label">{{ item.name }}</p>
									<p class="text">
										<span class="number">{{ item.num | numFormat}}</span>
										<i class="percent">（{{ item.per }}）</i>
									</p>
								</div>
							</div>
							<div class="chart-wrap" v-show='is_show'>
								<div class="chart-title"></div>
								<div class="chart-line">
									<!--门店销量情况：折线图-->
									<chart :options="lineOpt1" />
								</div>
								<div class="chart-bar">
									<!--门店销量情况：柱状图-->
									<chart :options="barOpt1" />
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 成交情况 -->
				<div class="sales-wrapper">
					<div class="title-block" @click="handleSpread('deal')">
						<i
							class="el-icon-caret-right"
							:class="{ active: isSpread.deal }"
						>
						</i>
						<p class="text">成交情况</p>
					</div>
					<div class="content-wrap" v-show="isSpread.deal">
						<div class="content-title">门店成交情况（次数）
							<el-tooltip class="item" effect="dark" content="" placement="top">
								<div slot="content">
									{{tips_data.hxym_cjqk_yzcjszb_km}}<br />
									{{tips_data.hxym_cjqk_ydjcjshb_km}}<br />
								</div>
								<i class="el-icon-question icon-tooltip"></i>
							</el-tooltip>
						</div>
						<div class="content-block">
							<div class="top-wrap">
								<div
									class="top-item"
									v-for="(item, idx) in dealData"
									:key="idx"
								>
									<p class="label">{{ item.name }}</p>
									<p class="text">
										<span class="number">{{ item.num | numFormat }}</span>
										<i class="percent">（{{ item.per }}）</i>
									</p>
								</div>
							</div>
							<div class="chart-wrap" v-show='is_show'>
								<div class="chart-title"></div>
								<!--门店成交情况：折线图-->
								<div class="chart-line">
									<chart :options="lineOpt2" />
								</div>
								<!--门店成交情况：柱状图-->
								<div class="chart-bar">
									<chart :options="barOpt2" />
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 问题门店 -->
				<div class="problem-wrapper" v-if='is_sale_route'>
					<div class="title-block"  @click="handleSpread('problem')">
						<i
							class="el-icon-caret-right"
							:class="{ active: isSpread.problem }"
						>
						</i>
						<p class="text">问题门店</p>
					</div>
					<div class="content-wrap" v-show="isSpread.problem">
						<div class="content-title">问题门店情况（点数）
							<el-tooltip class="item" effect="dark" content="" placement="top">
								<div slot="content">
									业务异常门店：<br />
									{{tips_data.wtmd_ywycmd_clmd_km}}<br />
									{{tips_data.wtmd_ywycmd_xlbdb_km}}<br />
									{{tips_data.wtmd_ywycmd_lxlgywcj_km}}<br />
									{{tips_data.wtmd_ywycmd_wcj_km}}<br />
									{{tips_data.wtmd_ywycmd_mdzyysbjw_km}}<br />
									{{tips_data.wtmd_ywycmd_mdzyyscdqy_km}}<br /><br />

									数据异常门店：<br />
									{{tips_data.wtmd_sjycmd_mdbmcw_km}}<br />
									{{tips_data.wtmd_sjycmd_mddzwx_km}}<br />
									{{tips_data.wtmd_sjycmd_mdmcwx_km}}<br />
									{{tips_data.wtmd_sjycmd_mdxxwx_km}}<br />
									{{tips_data.wtmd_sjycmd_jwdydxbpp_km}}<br />
									{{tips_data.wtmd_sjycmd_jwdztsdx_km}}<br />
									{{tips_data.wtmd_sjycmd_qskhlx_km}}<br />
									{{tips_data.wtmd_sjycmd_jwdqs_km}}<br />
									{{tips_data.wtmd_sjycmd_mdlxyc_km}}<br />
									{{tips_data.wtmd_sjycmd_khjlqs_km}}<br />
								</div>
								<i class="el-icon-question icon-tooltip"></i>
							</el-tooltip>
						</div>
						<div class="scroll-block">
							<div class="content-block">
								<template v-if='structureData'>
									<div class="list-group" v-for="(item, idx) in structureProblemData" :key="idx">
										<div class="list-title">
											<svg v-show="item.route === '业务异常'" class="icon el-icon-s-shop" aria-hidden="true">
												<use xlink:href="#iconicon_store"></use>
											</svg>
											<svg v-show="item.route === '数据异常'" class="icon el-icon-s-promotion" aria-hidden="true">
												<use xlink:href="#iconicon_tetong"></use>
											</svg>
											<span class="name">{{ item.route }}</span>
											<span class='totalCount'> {{item.routeCount | numFormat}}</span>
										</div>
										<!--特别的，如果超过4条，则分为多栏-->
										<div class='bGroup'>
											<div class='sGroup'>
												<div class="list-data" v-for="(cell, i) in item.structureList.slice(0,4)" :key="i" >
													<p class="label">{{ cell.channel }}</p>
													<p class="text">
														<span class="number">{{ cell.channelCount | numFormat }}</span>
														<i class="percent">（{{ cell.percentage }}）</i>
													</p>
												</div>
											</div>
											<div class='sGroup'>
												<div class="list-data" v-for="(cell, i) in item.structureList.slice(4,8)" :key="i" >
													<p class="label">{{ cell.channel }}</p>
													<p class="text">
														<span class="number">{{ cell.channelCount | numFormat }}</span>
														<i class="percent">（{{ cell.percentage }}）</i>
													</p>
												</div>
											</div>
											<div class='sGroup'>
												<div class="list-data" v-for="(cell, i) in item.structureList.slice(8,12)" :key="i" >
													<p class="label">{{ cell.channel }}</p>
													<p class="text">
														<span class="number">{{ cell.channelCount | numFormat }}</span>
														<i class="percent">（{{ cell.percentage }}）</i>
													</p>
												</div>
											</div>
											<div class='sGroup'>
												<div class="list-data" v-for="(cell, i) in item.structureList.slice(12)" :key="i" >
													<p class="label">{{ cell.channel }}</p>
													<p class="text">
														<span class="number">{{ cell.channelCount | numFormat }}</span>
														<i class="percent">（{{ cell.percentage }}）</i>
													</p>
												</div>
											</div>
										</div>
										<div class="vertical-line" v-show="idx !== 0"></div>
									</div>
								</template>
							</div>
						</div>
					</div>
				</div>
				<div class="btn-wrapper">
					<span @click="switchShowExportTable">查看门店明细</span>
				</div>
			</div>
		</section>
		<!-- <div class="result-btn">
      <span @click="getResult">查看门店明细</span>
    </div> -->
	</div>
</template>

<script>
	/*---------------------导入echarts组件，以及折线图和柱状图配置构造器---------------------*/
	import LineOption from '@/util/chartOptions/line'
	import BarOption from '@/util/chartOptions/customBar'
	import chart from '@/components/Chart'
	/*---------------------导入商机导航接口API---------------------*/
	import BUSINESS_NAVIGATION_API from '../../../../api/business_navigate_api'

	export default {
		name: '',
		components: {
			chart
		},
		data() {
			return {
				totalCount: '--',
				totalPercent: '--',
				isSpread: {
					structure: true, // 结构分布
					sales: true, // 销量情况
					deal: true ,// 成交情况
					problem: true // 问题门店情况
				},
				// 结构分布数据
				structureData: '',
				// 门店问题数据
				structureProblemData: '',
				// 销量情况（总览）
				salesData: [
					{
						name: '月总销量',
						num: '',
						per: ''
					},
					{
						name: '月店均销量',
						num: '',
						per: ''
					}
				],
				// 成交情况（总览）
				dealData: [
					{
						name: '月总成交数',
						num: '',
						per: ''
					},
					{
						name: '月店均成交数',
						num: '',
						per: ''
					}
				],
				// 销量折线图配置
				lineOpt1: {},
				// 销量柱状图配置
				barOpt1: {},
				// 成交折线图配置
				lineOpt2: {},
				// 成交柱状图配置
				barOpt2: {},
				route_query: '',
				// 判断是否是售点盘点，还是问题门店路由，如果是后者，则画像中的问题门店在顶部，否则在底部
				is_sale_route: true,
				// 暂时隐藏echarts
				is_show: false,
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
				],
				tips_data:''
			}
		},
		props: ['requestData'],
		watch: {
			requestData: {
				handler: function () {
					this.getAllData()
				},
				deep: true
			}
		},
		mounted() {
			if(this.$route.path === '/business-navigate/sale') {
				this.is_sale_route = true
			} else {
				this.is_sale_route = false
			}
			this.getAllData()
			// 获取tips
			BUSINESS_NAVIGATION_API.get_all_tips({tipsKeys: this.keys.join()}).then(res => {
				if(res){
					this.tips_data = res
				}
			})
		},
		methods: {
			// 初始化所有图表和数据
			getAllData() {
				// 格式化query对象为字符串
				this.formatQueryObjToString()
				// 请求画像总览等模块数据
				this.getOverviewData(this.route_query)
				this.getStructureData(this.route_query)
				this.getStructureProblemData(this.route_query)
				this.getSalesDealsData(this.route_query)
			},
			/**
			 * @description 获取画像总览数据
			 */
			async getOverviewData(route_query) {
				if(route_query.orgId) {
					let res = await BUSINESS_NAVIGATION_API.get_overview_pic_echart(route_query)
					if(res){
						this.totalCount = res.number
						this.totalPercent = res.percentage
					}
				}
			},
			/**
			 * @description 门店结构分布数据
			 */
			async getStructureData(route_query) {
				if(route_query.orgId) {
					this.structureData = await BUSINESS_NAVIGATION_API.get_structure_pic_echart(route_query)
				}
			},
			/**
			 * @description 门店问题情况数据
			 */
			async getStructureProblemData(route_query) {
				if(route_query.orgId) {
					this.structureProblemData = await BUSINESS_NAVIGATION_API.get_structure_problem_pic_echart(route_query)
				}
			},
			/**
			 * @description 获取销量情况、成交情况（折线图和柱状图）
			 */
			async getSalesDealsData(route_query) {
				if(route_query.orgId) {
					let res = await BUSINESS_NAVIGATION_API.get_sales_deals_pic_echart(route_query)
					if(res) {
						for(let i = 0; i < res.length; i++) {
							switch (res[i].moduleName) {
								case '销量情况': {
									// 月总销量
									this.salesData[0].num = res[i].salesVolume
									// 月总销量百分比
									this.salesData[0].per = res[i].percentage
									// 月均销量
									this.salesData[1].num = res[i].avgMonthSalesVolume
									// 月均销量百分比
									this.salesData[1].per = res[i].avgMonthPercentage
									// 折线图数据配置
									const params = {
										startColor: 'rgba(131, 144, 255, 0.55)',
										endColor: 'rgba(255, 255, 255, 0)',
										xData: res[i].lineChart.axisX,
										seriesData: res[i].lineChart.axisY
									}
									// 初始化折线图
									this.lineOpt1 = new LineOption(params)

									// 柱状图数据配置
									const params2 = {
										color: ['#5B8FF9'],
										seriesData: res[i].histogram.lists,
										xaxisMax:res[i].histogram.xaxisMax,
										xaxisMin:res[i].histogram.xaxisMin,
										// x轴名字
										xName: '销量',
										// y轴名字
										yName: '门店数'
									}
									// 初始化柱状图
									this.barOpt1 = new BarOption(params2)
									break
								}
								case '成交情况':  {
									// 月总销量
									this.dealData[0].num = res[i].salesVolume
									// 月总销量百分比
									this.dealData[0].per = res[i].percentage
									// 月均销量
									this.dealData[1].num = res[i].avgMonthSalesVolume
									// 月均销量百分比
									this.dealData[1].per = res[i].avgMonthPercentage
									// 折线图数据配置
									const params = {
										startColor: 'rgba(131, 144, 255, 0.55)',
										endColor: 'rgba(255, 255, 255, 0)',
										xData: res[i].lineChart.axisX,
										seriesData: res[i].lineChart.axisY
									}
									// 初始化折线图
									this.lineOpt2 = new LineOption(params)

									// 柱状图数据配置
									const params2 = {
										color: ['#A634EF'],
										seriesData: res[i].histogram.lists,
										xaxisMax:res[i].histogram.xaxisMax,
										xaxisMin:res[i].histogram.xaxisMin,
										// x轴名字
										xName: '成交次数',
										// y轴名字
										yName: '门店数'
									}
									// 初始化柱状图
									this.barOpt2 = new BarOption(params2)
									break
								}
							}
						}
					}	
				}
			},
			handleSpread(item) {
				this.isSpread[item] = !this.isSpread[item]
			},
			switchShowExportTable() {
				this.$emit('switchShowExportTable', true)
			},
			/**
			 * @description 格式化query对象为字符串
			 */
			formatQueryObjToString() {
				let copy_route_query_obj = JSON.parse(JSON.stringify(this.requestData))
				/* 如下事实属性因为是数组需要转换为 1,2,3…… */
				// 门店类型
				copy_route_query_obj.storeType = copy_route_query_obj.storeType ? copy_route_query_obj.storeType.join() : ''
				// 成交情况
				copy_route_query_obj.dealStatus = copy_route_query_obj.dealStatus ? copy_route_query_obj.dealStatus.join() : ''
				// POI
				copy_route_query_obj.poi = copy_route_query_obj.poi ? copy_route_query_obj.poi.join() : ''
				// 既有门店
				copy_route_query_obj.visitStatus = copy_route_query_obj.visitStatus ? copy_route_query_obj.visitStatus.join() : ''
				// 业务标签
				copy_route_query_obj.selfBusiness = copy_route_query_obj.selfBusiness ? copy_route_query_obj.selfBusiness.join() : ''
				// 环境标签
				copy_route_query_obj.selfEnvironmental = copy_route_query_obj.selfEnvironmental ? copy_route_query_obj.selfEnvironmental.join() : ''

				/* 如下模型属性因为是数组需要转换为 1,2,3……*/
				// 人流量
				copy_route_query_obj.peopleStream = copy_route_query_obj.peopleStream ? copy_route_query_obj.peopleStream.join() : ''
				// 交通便利
				copy_route_query_obj.transportation = copy_route_query_obj.transportation ? copy_route_query_obj.transportation.join() : ''
				// 消费力指数
				copy_route_query_obj.consumption = copy_route_query_obj.consumption ? copy_route_query_obj.consumption.join() : ''
				// 门店密集程度
				copy_route_query_obj.storeDensity = copy_route_query_obj.storeDensity ? copy_route_query_obj.storeDensity.join() : ''
				// 房价
				copy_route_query_obj.housePrice = copy_route_query_obj.housePrice ? copy_route_query_obj.housePrice.join() : ''
				// 以上五个模型标签之和
				copy_route_query_obj.modelTags = copy_route_query_obj.modelTags ? copy_route_query_obj.modelTags.join() : ''
				this.route_query = copy_route_query_obj
			},
			/**
			 * @description 格式化数组为二维数组（4个一组）
			 * @param {Array} data_array 一维数组
			 */
			restructArray(data_array) {
				let result_arr= []
				for(var i= 0; i< data_array.length; i+= 4){
					result_arr.push(data_array.slice(i, i+4));
				}
				return result_arr
			}
		}
	}
</script>

<style scoped lang="scss">
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
							font-size: 32px;
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
				}
				.structure-wrapper,
				.problem-wrapper,
				.sales-wrapper {
					.title-block {
						height: 34px;
						background: #133773;
						text-align: left;
						position: relative;
						cursor:pointer;
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
					.content-wrap {
						width: 310px;
						background: #47059c;
						border-radius: 8px;
						margin: 10px auto;
						.content-title {
							height: 40px;
							line-height: 40px;
							background: #7134ef;
							border-radius: 8px;
							font-size: 16px;
							font-family: PingFangSC-Semibold, PingFang SC;
							font-weight: 600;
							color: #ffffff;
							padding-left: 20px;
						}
					}
				}
				.structure-wrapper,
				.problem-wrapper {
					.content-wrap {
						height: 242px;
						.scroll-block {
							height: 200px;
							// width: 310px;
							overflow: auto;
							.content-block {
								display: flex;
								.list-group {
									position: relative;
									padding-left: 10px;
									padding-right:10px;
									// 保证在空间冗余时平分,
									flex-grow:1;
									// 不够时撑开
									flex-shrink:0;
									// border-left: 2px solid #AE95FF;
									.list-title {
										height: 30px;
										line-height: 30px;
										font-size: 12px;
										font-family: PingFangSC-Semibold, PingFang SC;
										font-weight: 600;
										color: #ffffff;
										.el-icon-s-shop {
											font-size: 16px;
											color: #a634ef;
											vertical-align: text-bottom;
										}
										.el-icon-s-promotion {
											font-size: 16px;
											color: #5cadff;
											vertical-align: text-bottom;
										}
										.el-icon-s-problem {
											font-size: 16px;
											color: #FF9900;
											vertical-align: text-bottom;
										}
										.el-icon-shopping-cart-1 {
											font-size: 16px;
											color: #ff9900;
										}
										.name {
											display: inline-block;
											padding-left: 5px;
										}
									}
									.list-data {
										margin-top: 4px;
										.label {
											font-size: 12px;
											font-family: PingFangSC-Medium, PingFang SC;
											font-weight: 500;
											color: #ffffff;
											line-height: 14px;
										}
										.text {
											.number {
												font-size: 14px;
												font-family: AvenirNext-Bold, AvenirNext;
												font-weight: bold;
												color: #ffffff;
											}
											.percent {
												font-size: 14px;
												font-family: AvenirNext-Bold, AvenirNext;
												font-weight: bold;
												color: #ffffff;
											}
										}
									}
									.vertical-line {
										position: absolute;
										top: 15px;
										left: 0;
										width: 2px;
										height: 165px;
										background-color: #ae95ff;
									}
									.bGroup{
										display: flex;
									}
									.sGroup{
										margin-right:10px;
									}
								}
							}
						}
					}
				}
				.sales-wrapper {
					.content-wrap {
						.content-block {
							.top-wrap {
								display: flex;
								.top-item {
									flex: 1;
									padding: 10px;
									.label {
										font-size: 12px;
										font-family: PingFangSC-Medium, PingFang SC;
										font-weight: 500;
										color: #ffffff;
										line-height: 14px;
									}
									.text {
										.number {
											font-size: 14px;
											font-family: AvenirNext-Bold, AvenirNext;
											font-weight: bold;
											color: #ffffff;
										}
										.percent {
											font-size: 14px;
											font-family: AvenirNext-Bold, AvenirNext;
											font-weight: bold;
											color: #ffffff;
										}
									}
								}
							}
							.chart-wrap {
								.chart-title {
								}
								.chart-line {
									width: 98%;
									margin-left:auto;
									margin-right:auto;
									height: 100px;
								}
								.chart-bar {
									margin-top: 15px;
									width: 100%;
									height: 170px;
								}
							}
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
		.result-btn {
			position: absolute;
			bottom: 0;
			left: 0;
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
</style>