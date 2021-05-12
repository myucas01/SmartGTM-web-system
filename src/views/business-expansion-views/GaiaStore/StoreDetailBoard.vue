<!--
    店铺详情信息面板
-->
<template>
	<div ref='store_detail_board' class="storeDetailBoard" :class="{ storeDetailBoardShow: isShowBoard}" id="store_detail_board">
		<div class='triangleMark'></div>
		<!--头部-->
		<div class="headerInfo">
			<span class="headerText">门店详情</span>
			<span
				class="el-icon-close closeIcon"
				@click="closeBoard"
				title="关闭门店详情"
			></span>
		</div>
		<!--属性列表-->
		<div class='paramsContainer'>
			<div class="paramList">
				<div class="storeName">{{ otherInfo.storeName || '--' }}</div>
				<div class="perParam address">
					<span class="el-icon-location"></span>
					<span class='typeTitle'>门店地址</span>
					{{ otherInfo.storeAddress || '--' }}
					<!-- v-auth='"navigation:sell:updatestore"' -->
					<!-- <el-tooltip class="item" effect="dark" content="修改位置" placement="top" v-auth='"navigation:sell:updatestore"'>
						<svg class="icon editLocationButton" aria-hidden="true" @click='triggerChangeLocation'><use xlink:href="#icondizhi"></use></svg>
					</el-tooltip> -->
				</div>
				<div class="perParam phoneNum">
					<span class="el-icon-phone"></span>
					<span class='typeTitle'>门店电话</span>
					{{ otherInfo.tel || '--' }}
				</div>
				<div class="perParam storeType">
					<span class="el-icon-tickets"></span>
					<span class='typeTitle'>门店类型</span>
					{{ otherInfo.categoryParent + ' / ' + otherInfo.categoryName}}
				</div>
				<!-- <div class="perParam storeType">
					<span class="el-icon-notebook-2"></span>
					<span class='typeTitle'>客户编码</span>
					{{ otherInfo.storeCode || '--' }}
				</div> -->
				<!-- <div class="perParam storeType">
					<span class="el-icon-user"></span>
					<span class='typeTitle'>客户经理</span>
					{{ otherInfo.empName || '--' }}
				</div> -->
				<!-- <div class="perParam storeType">
					<span class="el-icon-goods"></span>
					<span class='typeTitle'>经销商</span>
					{{ otherInfo.agencyName || '--' }}
				</div> -->
				<!-- <div class="perParam distanceNum">
					<svg-icon icon-class="location-point" class-name="locationIcon" />
					<span class='typeTitle'>影响范围</span>
					{{ otherInfo.coverageDistance || '--' }} <span v-show='otherInfo.coverageDistance'>m</span>
				</div> -->
			</div>
			<!--事实标签-->
			<div class="labelsArea factLabels">
				<div class="labelTitle">事实标签</div>
				<template v-if="otherInfo.factTags">
					<div class="labelsContainer">
						<span v-for="(tag, index) in otherInfo.factTags" :key="index" class="perLabel">{{tag}}</span>
						<!-- <el-tooltip
							effect="dark"
							placement="top-start"
							popper-class='storeDetailTooltip'
						>
							<div slot="content">
								<div class='slotContent'>
									<div class='fatherTag'>我是父级</div>
									<div class='tagTips'>tips:哈哈哈哈哈哈哈哈哈哈</div>
								</div>
							</div>
							<span class="perLabel">Are you OK?</span>
						</el-tooltip> -->
					</div>
				</template>
			</div>
			<!--模型标签-->
			<div class="labelsArea modelLabels">
				<div class="labelTitle">模型标签</div>
				<template v-if="otherInfo.modelTags">
					<div class="labelsContainer">
						<span v-for="(tag, index) in otherInfo.modelTags" :key="index" class="perLabel">{{tag}}</span>
					</div>
				</template>
			</div>
			<!--月成交折线图-->
			<!-- <div class="chartsArea monDealLineChart">
				<div class="lineTitle">月成交次数</div>
				<div class="chartContainer" id="mon_deal_line_chart">
					<chart :options="X_option" :autoResize="true"></chart>
				</div>
			</div> -->
			<!--月销量折线图-->
			<!-- <div class="chartsArea monSaleLineChart">
				<div class="lineTitle">月销量</div>
				<div class="chartContainer" id="mon_sale_line_chart">
					<Chart :options="Y_option" :autoResize="true"></Chart>
				</div>
			</div> -->
		</div>
	</div>
</template>

<script>
	// import * as filtersFun from '@/util/filters.js'
	/*---------------------导入商机导航接口API---------------------*/
	// import Chart from '@/components/Chart.vue'
	export default {
		data() {
			return {
				// 店铺名
				name: '--',
				// 地址
				address: '--',
				// 手机号
				tel: '--',
				// 门店类型
				storeType: '',
				// 距离
				distance: '--',
				// 事实标签
				factTags: '',
				// 模型标签
				modelTags: '',
				// 月成交次数配置项
				// X_option: {},
				// 月销量配置项
				// Y_option: {}
			}
		},
		props: ['isShowBoard','otherInfo'],
		watch: {
			otherInfo: function () {
				if(!this.otherInfo.frequency){
					this.otherInfo.frequency={
						axisX:[],
						axisY:[]
					}
				}
				// 初始化月成交次数
				// this.X_option = this.lineChartObjFactory(this.otherInfo.frequency.axisX, this.otherInfo.frequency.axisY, {
				// 	color: '#F5A623'
				// })
				// if(!this.otherInfo.salesAmount){
				// 	this.otherInfo.salesAmount={
				// 		axisX:[],
				// 		axisY:[]
				// 	}
				// }
				// 初始化月销量
				// this.Y_option = this.lineChartObjFactory(this.otherInfo.salesAmount.axisX, this.otherInfo.salesAmount.axisY, {
				// 	color: '#930CEA'
				// })
			}
		},
		computed: {},
		components: {
			// Chart
		},
		mounted() {},
		methods: {
			/**
			 * @description 折线图工厂函数，每次都会返回一个配置项
			 * @param {Array<string>} x_data X轴数据(日期)
			 * @param {Array<number>} y_data X轴数据(数量)
			 * @param {object} configs 需要单独配置的参数，主要以样式为主
			 */
			// lineChartObjFactory(x_data, y_data, configs) {
			// 	return {
			// 		// 决定折线图在容器内的大小，xy为偏移量
			// 		grid: {
			// 			left: '15%', // x 偏移量
			// 			top: '15%', // y 偏移量
			// 			width: '80%', // 宽度
			// 			height: '60%' // 高度
			// 		},
			// 		// x轴的配置
			// 		xAxis: {
			// 			type: 'category',
			// 			nameGap: 100,
			// 			data: x_data,
			// 			// x坐标轴线是否显示
			// 			axisLine: {
			// 				show: true,
			// 				lineStyle: {
			// 					color: '#798cad'
			// 				}
			// 			},
			// 			// x坐标轴刻度是否显示
			// 			axisTick: {
			// 				show: false
			// 			},
			// 			// x轴坐标label文本设置
			// 			axisLabel: {
			// 				// 字体大小10
			// 				fontSize: 10,
			// 				// 距离顶部0
			// 				padding: [0, 0, 0, 0],
			// 				color: '#CED3DD'
			// 			}
			// 		},
			// 		// y轴的配置
			// 		yAxis: {
			// 			// y轴的标题名
			// 			name: '',
			// 			type: 'value',
			// 			// y坐标轴线是否显示
			// 			axisLine: {
			// 				show: false
			// 			},
			// 			// y坐标轴刻度是否显示
			// 			axisTick: {
			// 				show: false
			// 			},
			// 			// y轴坐标label文本设置
			// 			axisLabel: {
			// 				// 字体大小10
			// 				fontSize: 10,
			// 				// 距离顶部0
			// 				padding: [0, 0, 0, 0],
			// 				color: '#CED3DD'
			// 			},
			// 			// 分几段
			// 			splitNumber: 5,
			// 			// 不要显示y轴的分割线
			// 			splitLine: {
			// 				show: true,
			// 				lineStyle: {
			// 					color: '#798cad',
			// 					type: 'dashed'
			// 				}
			// 			}
			// 		},
			// 		// 核心数据轴的配置
			// 		series: [
			// 			{
			// 				data: y_data,
			// 				type: 'line',
			// 				// 是否平滑过渡
			// 				smooth: true,
			// 				// 打点图形：空心圆
			// 				symbol: 'emptyCircle',
			// 				// 打点大小
			// 				symbolSize: 5,
			// 				// 平滑曲线的样式
			// 				lineStyle: {
			// 					// 线宽
			// 					width: 2,
			// 					color: configs.color
			// 				},
			// 				itemStyle: {
			// 					color: '#400093',
			// 					borderColor: '#ffffff',
			// 					borderWidth: 2
			// 				}
			// 			}
			// 		],
			// 		// 鼠标放上后的数据提示框
			// 		tooltip: {
			// 			trigger: 'axis',
			// 			// 十字标尺
			// 			axisPointer: {
			// 				// 不显示十字标尺
			// 				type: 'none',
			// 				// 不显示标尺xy轴的label
			// 				label: {
			// 					show: false
			// 				}
			// 			},
			// 			position: (point) => {
			// 				return [point[0] - 35, point[1] - 60]
			// 			},
			// 			// 提示框内边距 [上 右 下 左]
			// 			padding: [10, 15, 10, 15],
			// 			// 文本样式
			// 			textStyle: {
			// 				color: '#ffffff',
			// 				fontSize: 12
			// 			},
			// 			// 数据格式化，此处为 123456 => 123,456
			// 			formatter: (params) => {
			// 				return filtersFun.numFormat(params[0].data)
			// 			}
			// 		}
			// 	}
			// },

			/**
			 * @description 关闭门店详情面板
			 */
			closeBoard() {
				this.$emit('closeStoreDetailBoard')
			},

			/**
			 * @description 触发父级的修改位置功能
			 */
			// triggerChangeLocation() {
			// 	this.$emit('showChangeLocationFlag')
			// }
		}
	}
</script>

<style scoped lang="scss">
	.storeDetailBoard {
		display: none;
		position: relative;
		text-align: left;
		width: 324px;
		background-color: #0a2757;
		border: 1px solid #4b1f98;
		border-radius: 5px;
		color:#ffffff;
		bottom: 20px;
		.triangleMark{
			position: absolute;
			z-index: 1;
			top:160px;
			left:-18px;
			width: 0;
			height: 0;
			border-top: 10px solid transparent;
			border-right: 10px solid #133773;
			border-bottom: 10px solid transparent;
			border-left: 10px solid transparent;
		}
		// 头部
		.headerInfo {
			width:304px;
			height:34px;
			position: absolute;
			z-index: 1;
			top:0;
			left:0;
			padding-left: 10px;
			padding-right: 15px;
			font-size: 14px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-radius: 2px;
			// 关闭按钮
			.closeIcon {
				font-size: 24px;
				cursor: pointer;
			}
		}
		.editLocationButton{
			font-size:16px;
			cursor:pointer;
			margin-left: 4px;
			color:#fff;
		}
		.paramsContainer{
			margin-top:34px;
			height:35vh;
			overflow-y: auto;
		}
		// 属性列表
		.paramList {
			box-sizing: border-box;
			padding:10px 18px 10px 10px;
			font-size: 12px;
			background-color: #133773;
			border-radius: 2px;
			.storeName {
				font-size: 14px;
			}
			.perParam {
				margin-bottom: 6px;
				.typeTitle{
					color: #D7DDE7;
				}
				span {
					margin-right: 6px;
				}
				.locationIcon {
					font-size: 14px;
					margin-right: 4px;
				}
			}
			.address {
				margin-top: 14px;
			}
		}
		// 组标签
		.labelsArea {
			padding: 10px;
			background-color: #102f63;
			font-size: 12px;
			margin-top: 5px;
			margin-bottom: 5px;
			border-radius: 2px;
			.labelTitle {
				font-size: 13px;
				margin-bottom: 9px;
				color: #ced3dd;
			}
			.labelsContainer{
				.perLabel {
					display: inline-block;
					border-radius: 2px;
					margin-right: 6px;
					margin-bottom: 5px;
					line-height: 24px;
					padding: 0px 9px;
					background-color: #7909c1;
					border: 1px solid #930cea;
				}
				// 自有标签高亮显示
				.selfTag{
					background-color: #ed3f14;
					border: 1px solid #ed3f14;
				}
			}
		}
		// 走势图
		// .chartsArea {
		// 	height: 162px;
		// 	background-color: #133773;
		// 	margin-top: 5px;
		// 	margin-bottom: 5px;
		// 	border-radius: 2px;
		// 	.lineTitle {
		// 		font-size: 13px;
		// 		color: #ced3dd;
		// 		width: 285px;
		// 		margin-right: auto;
		// 		margin-left: auto;
		// 		line-height: 38px;
		// 		border-bottom: 0.5px solid #5d759d;
		// 	}
		// 	.chartContainer {
		// 		width: 285px;
		// 		height: 123px;
		// 		margin-left: auto;
		// 		margin-right: auto;
		// 	}
		// }
	}
	.storeDetailBoardShow {
		display: block;
	}
	
	.slotContent{
		padding:10px;
		background: rgba(0, 0, 0, 0.8);
		border-radius: 4px;
		font-size: 10px;
		.fatherTag{
			padding:2px 8px;
			background: rgba(166, 52, 239, 0.3);
			border: 1px solid #A634EF;
			display: inline-block;
			border-radius: 2px;
		}
		.tagTips{
			margin-top:4px;
		}
	}
</style>
<style lang="scss">
	.el-tooltip__popper.storeDetailTooltip{
		background-color: transparent;
	}
	.storeDetailTooltip{
		padding:0;
	}
</style>
