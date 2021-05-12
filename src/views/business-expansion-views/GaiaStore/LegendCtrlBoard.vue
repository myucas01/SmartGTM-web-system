<!--
    地图图例面板
-->
<template>
	<div class="legendCtrlComp" id="legend_ctrl_comp">
		<!--打开面板按钮-->
		<div class="switchButton switchButtonOpen" @click="switchLegendBoard">
			<span class="el-icon-caret-top switchIcon"></span>
		</div>
		<div
			class="legendCtrlBoard"
			id="legend_icon_board"
			:class="{ legendIconBoardHide: is_close_board }"
		>
			<!--头部-->
			<div class="headerInfo">
				<span class="headerText">图例</span>
				<!--关闭面板按钮-->
				<div class="switchButton switchButtonClose" @click="switchLegendBoard">
					<span class="el-icon-caret-top switchIcon"></span>
				</div>
			</div>
			<!------操作面板------>
			<div class="ctrlList">
				<!--图例选择-->
				<!-- <div class="legendType">
					<span class="ctrlText">图例选择</span>
					<el-radio-group v-model="radio" @change="radioChange">
						<el-radio :label="1">门店状态</el-radio>
						<el-radio :label="2">门店类型</el-radio>
					</el-radio-group>
				</div> -->
				<!--边界切换-->
				<div class="legendType">
					<span class="ctrlText">边界切换</span>
					<div class="areaRadio">
						<!-- <div class="perAreaRadio" :class='{activeRadio:isActiveGovBoundary}' @click='activeGovBoundary'>行政边界</div> -->
						<!-- <div class="perAreaRadio" :class='{activeRadio:isActiveOrgBoundary}' @click='activeOrgBoundary'>组织边界</div> -->
						<!-- <div class="perAreaRadio">商圈边界</div> -->
						<div
							class="perAreaRadio"
							v-for="(item, idx) in boundaryList"
							:key="idx"
							:class="{activeRadio:activeBoundaryIndex === idx}"
							@click="activeBoundaryChanged(idx)">
							{{item}}
						</div>
					</div>
				</div>
				<div class="split-line"></div>
				<!--模式切换-->
				<!-- <div class="legendType">
					<span class="ctrlText">模式切换</span>
					<div class="switchRateButton" @click='switchDataModel'>
						<img
							src="../../assets/img/icon_transfer@2x.png"
							class="transferIcon"
							alt="icon"
						/>
						切换成覆盖率
					</div>
					<el-tooltip
						class="bubbleTip"
						effect="dark"
						content="点击切换数量/覆盖率"
						placement="right"
					>
						<i class="el-icon-question tipsIcon"></i>
					</el-tooltip>
				</div> -->
				<!--人口热力图-->
				<div class="legendType legendHotType" v-show='isShowHeat'>
					<span class="ctrlText ctrlTextHot">人口热力图</span>
					<el-switch
						:value="isOpenHeat"
						active-color="#A634EF"
						inactive-color="#CCD3DE"
						class="pepoleHotRadio"
						:width="30"
						@change='triggerHeat'
					></el-switch>
					<img src="../../../assets/img/color_bar.png" class="colorBar" alt="icon" v-show='isShowHeat'/>
					<!-- <img src="../../../assets/img/icon_grey.png" class="colorBar" alt="icon" v-show='isShowHeat'/> -->
					<!-- <img src="../../../assets/img/icon_blue.png" class="colorBar" alt="icon" v-show='isShowHeat'/> -->
				</div>
				<div class="sText" v-show='isShowHeat'>
					<img src="../../../assets/img/people_range.png" alt="范围" />
				</div>
				<div class="hot-text" v-show='isShowHeat'>
					<span class="text-uni1">(人/1km²)</span>
					<span class="text-uni2">1</span>
					<span class="text-uni3">10万</span>
				</div>
				<div class="split-line"></div>
				<!--自有门店 换成了 门店覆盖-->
				<div class="legendType">
					<!-- <span class="ctrlText ctrlTextScope">自有门店</span> -->
					<span class="ctrlText ctrlTextScope">门店覆盖</span>
					<el-switch
						:value="isOpenSelfStore"
						active-color="#A634EF"
						inactive-color="#CCD3DE"
						class="pepoleHotRadio"
						:width="30"
						@change='selfStoreChanged'
					></el-switch>
					<div class="img-wrap">
						<div class="img-item">
							<span class="label">GAIA</span>
							<img src="../../../assets/img/icon_store_gaia2.png" class="color-bar" alt="icon" />
							<div class="tip-text">
								<span>1</span>
								<span>10万</span>
							</div>
						</div>
						<div class="img-item">
							<span class="label">康面</span>
							<img src="../../../assets/img/icon_store_km2.png" class="color-bar" alt="icon" />
							<div class="tip-text">
								<span>1</span>
								<span>10万</span>
							</div>
						</div>
					</div>
				</div>
				<div class="split-line"></div>
				<!--辐射范围-->
				<div class="legendType legendScopeType" v-show='isShowRangeBoundary'>
					<span class="ctrlText ctrlTextScope">覆盖范围</span>
					<el-switch
						:value="isOpenRangeBoundary"
						active-color="#A634EF"
						inactive-color="#CCD3DE"
						:width="30"
						@change='triggerOpenRangeBoundary'
					></el-switch>
				</div>
				<div class="legendType distanceNum" v-show="isShowSingleRangeBoundary">
					<span class="ctrlText ctrlTextScope">辐射范围</span>
					<el-switch
						:value="isOpenSingleRangeBoundary"
						active-color="#A634EF"
						inactive-color="#CCD3DE"
						:width="30"
						@change='triggerOpenSingleRangeBoundary'
					></el-switch>
					<div class="blockIcon"></div>
					<span class="distanceNumText">250*250米</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	/*---------------------导入Vuex---------------------*/
	export default {
		data() {
			return {
				is_close_board: true,
				radio: 1,
				boundaryList: [
					'行政边界',
					'组织边界'
				],
			}
		},
		props: [
			// 是否勾选组织边界（初始化默认勾选） 
			'isActiveOrgBoundary',
			// 是否勾选行政边界
			'isActiveGovBoundary',
			// 是否显示覆盖率
			'isShowCoverPercent',
			// 是否打开辐射范围按钮
			'isOpenRangeBoundary',
			// 是否打开单独某个店铺的辐射范围
			'isOpenSingleRangeBoundary',
			// 是否显示辐射范围按钮
			'isShowRangeBoundary',
			// 是否显示热力图按钮
			'isShowHeat',
			// 是否打开热力图按钮
			'isOpenHeat',
			// s会否打开自有门店
			'isOpenSelfStore',
			// 行政边界和组织边界互斥，默认展示行政边界-0
			'activeBoundaryIndex',
			// 是否显示单个店铺辐射范围
			'isShowSingleRangeBoundary'
		],
		computed: {},
		mounted() {
		},
		methods: {
			/**
			 * @description 是否切显示图例控制面板
			 */
			switchLegendBoard: function () {
				this.is_close_board = !this.is_close_board
			},
			radioChange(data) {
				console.log('radio:', data)
			},
			/**
			 * @description 是否切换到覆盖率数据
			 */
			switchDataModel(){
				// 这里面要判断是否在所级别，如果在所级别则不能切换
				this.$emit('switchDataModel')
			},
			/**
			 * @description 是否打开行政边界（默认打开）
			 */
			activeGovBoundary(){
				this.$emit('isActiveGovBoundary')
			},
			/**
			 * @description 是否打开组织边界（默认关闭）
			 */
			activeOrgBoundary(){
				this.$emit('isActiveOrgBoundary')
			},
			/**
			 * @description 是否打开门店辐射范围（默认关闭）
			 */
			triggerOpenRangeBoundary() {
				this.$emit('isOpenRangeBoundary')
			},
			/**
			 * @description 是否打开单个门店辐射范围（默认关闭）
			 */
			triggerOpenSingleRangeBoundary() {
				this.$emit('isOpenSingleRangeBoundary')
			},
			/**
			 * @description 是否打开门人口热力图（默认关闭）
			 */
			triggerHeat() {
				this.$emit('isOpenHeat')
			},
			/**
			 * @description 是否打开自有门店（默认关闭）
			 */
			selfStoreChanged() {
				this.$emit('isOpenSelfStore')
			},
			/**
			 * @description 行政边界和组织边界互斥，默认打开行政边界
			 */
			activeBoundaryChanged(idx) {
				this.$emit('activeBoundaryChanged', idx)
			},
		}
	}
</script>

<style scoped lang="scss">
	.el-radio {
		margin-right: 10px;
	}
	// switch按钮
	.switchButton {
		width: 28px;
		height: 28px;
		line-height: 32px;
		background: #930cea;
		border-radius: 2px;
		text-align: center;
		.switchIcon {
			font-size: 20px;
			cursor: pointer;
		}
	}
	// 展开按钮
	.switchButtonOpen {
		position: absolute;
		z-index: 1;
		bottom: 79px;
		right: 10px;
	}
	.switchButtonClose {
		transform: rotate(180deg);
	}
	.legendCtrlBoard {
		text-align: left;
		position: absolute;
		z-index: 2;
		right: 8px;
		bottom: 46px;
		width: 365px;
		height: 260px;
		overflow: hidden;
		background-color: #0a2757;
		border: 1px solid #4b1f98;
		border-radius: 5px;
		transition: all 0.3s;
		// 头部
		.headerInfo {
			padding-left: 10px;
			padding-right: 4px;
			height: 34px;
			font-size: 14px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-radius: 2px;
			background-color: #08214a;
		}
		.ctrlList {
			padding: 0px 16px;
			.legendType {
				margin-bottom: 10px;
				margin-top:15px;
				.ctrlText {
					margin-right: 10px;
					font-size: 13px;
				}
				.ctrlTextHot {
					padding-right: 6px;
					line-height: 14px;
					display: table-cell;
					vertical-align: middle;
				}
				.ctrlTextScope {
					padding-right: 10px;
				}
				.img-wrap {
					margin-top: 8px;
					display: flex;
					justify-content: space-between;
					.img-item {
						padding-top: 5px;
						.label {
							display: inline-block;
							width: 40px;
						}
						.color-bar {
							width: 109px;
							height: 16px;
							background: #ffffff;
						}
						.tip-text {
							width: 109px;
							height: 16px;
							margin-left: 40px;
							display: flex;
							justify-content: space-between;
							span {
								transform: scale(0.83);
							}
						}
					}
				}
			}
			.legendHotType {
				margin-bottom: 0px;
				margin-top: 10px;
			}
			.legendHotType,
			.legendScopeType {
				display: table;
			}
			.areaRadio {
				cursor:pointer;
				display: inline-block;
				// width: 209px;
				width:140px;
				height: 28px;
				border: 1px solid #dddee1;
				border-radius: 4px;
				.perAreaRadio {
					width: 69px;
					text-align: center;
					line-height: 28px;
					border-right: 1px solid #ffffff;
					display: inline-block;
					cursor: pointer;
					transition: all 0.3s;
				}
				.perAreaRadio:first-child {
					border-top-left-radius: 4px;
					border-bottom-left-radius: 4px;
				}
				.perAreaRadio:last-child {
					border-top-right-radius: 4px;
					border-bottom-right-radius: 4px;
					border: 0;
				}
				.activeRadio {
					background-color: #930cea;
				}
			}
			.switchRateButton {
				cursor:pointer;
				width: 116px;
				height: 28px;
				display: inline-block;
				line-height: 28px;
				text-align: center;
				background: rgba(166, 52, 239, 0.2);
				border-radius: 2px;
				border: 1px solid #a634ef;
				margin-right: 10px;
				.transferIcon {
					width: 14px;
					height: 14px;
				}
			}
			.pepoleHotRadio {
				margin-right: 10px;
			}
			.colorBar {
				width: 218px;
				height: 16px;
				background: #ffffff;
			}
			.sText {
				margin-bottom: 10px;
				display: none;
			}
			.hot-text {
				margin-bottom: 10px;
				display: flex;
				span {
					transform: scale(0.83);
					display: inline-block;
				}
				.text-uni1 {
					flex-basis: 100px;
					margin-left: -8px;
				}
				.text-uni2 {
					flex-basis: 213px;
				}
				.text-uni3 {}
			}
			.split-line {
				width: 100%;
				height: 1px;
				background-color: #979797;
			}
			.tipsIcon {
				font-size: 14px;
			}
			// .lockStoreButton {
			// 	line-height: 26px;
			// 	width:120px;
			// 	cursor: pointer;
			// 	img {
			// 		width: 26px;
			// 		height: 26px;
			// 		margin-right: 5px;
			// 	}
			// }
			.distanceNum {
				display: flex;
				align-items: center;
				.blockIcon {
					margin-left:20px;
					width: 22px;
					height: 22px;
					background: rgba(74, 144, 226, 0.4);
					border: 2px solid rgba(49, 143, 233, 0.7);
				}
				.distanceNumText {
					font-size: 14px;
					padding-left: 10px;
				}
			}
		}
	}
	.legendIconBoardHide {
		right: -373px;
	}
</style>

<style lang="scss">
	// 特别的：重写覆盖element UI样式
	#legend_ctrl_comp {
		.el-radio__label {
			font-size: 12px;
			color: #ffffff;
		}
		.el-switch__core {
			height: 18px;
		}
		.el-switch__core::after {
			width: 14px;
			height: 14px;
		}
		.el-switch.is-checked .el-switch__core::after{
			margin-left:-15px;
		}
	}
</style>
