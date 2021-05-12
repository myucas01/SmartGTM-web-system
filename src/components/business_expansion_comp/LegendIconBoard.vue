<!--
    店铺图例面板
-->
<template>
	<div class="legendIconComp">
		<!--打开面板按钮-->
		<div class="switchButton switchButtonOpen" @click="switchLegendBoard">
			<span class="el-icon-caret-top switchIcon"></span>
		</div>
		<div
			class="legendIconBoard"
			id="legend_icon_board"
			:class="{'legendIconBoardHide':is_close_board}"
		>
			<!--头部-->
			<div class="headerInfo">
				<span class="headerText">门店类型图例</span>
				<!--关闭面板按钮-->
				<div class="switchButton switchButtonClose" @click="switchLegendBoard">
					<span class="el-icon-caret-top switchIcon"></span>
				</div>
			</div>
			<!--图例列表-->
			<!-- <div class="modelIcon" v-for='(item, index) in icon_array' :key='index'>
				<div class="perIcon" v-for='(per_icon, index) in item.infos' :key='index'>
					<img class="iconImg" :src="per_icon.typeIcon" alt="icon" />{{per_icon.name}}
				</div>
			</div> -->
			<div class='scrollYContainer'>
				<div class='modelIcon' v-for='(item, index) in icon_array' :key= 'index'>
					<div class='typeTitle'>
						<img class="typeImg" :src='item.labelIcon' alt="icon" />{{ item.name }}
					</div>
					<div class='typeList'>
						<div class="perName" v-for='(per, per_index) in item.children' :key= 'per_index'>
							<span class='circlePoint' :style='{"background-color": per.labelIcon}'></span>{{ per.name }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	/*---------------------导入Vuex---------------------*/
	import BUSINESS_EXP_DASHBOARD_API from '../../../api/business_expansion_dashboard_api'

	export default {
		data() {
			return {
				// 是否显示图例面板
				is_close_board: true,
				// icon列表
				icon_array:[]
			};
		},
		props: {
			storeDetailData: {},
		},
		mounted() {
			this.getIconList()
		},
		methods: {
			/**
			 * @description 获取图例列表
			 */
			async getIconList(){
				this.icon_array  = await BUSINESS_EXP_DASHBOARD_API.get_icons()
			},

			/**
			 * @description 打开/关闭面板
			 */
			switchLegendBoard() {
				this.is_close_board = !this.is_close_board;
			}
		},
	};
</script>

<style scoped lang="scss">
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
		top:42px;
		right: 10px;
	}
	.switchButtonClose {
		transform: rotate(180deg);
	}
	.legendIconBoard {
		text-align: left;
		position: absolute;
		z-index: 2;
		right: 8px;
		top: 42px;
		width: 365px;
		background-color: #0a2757;
		border: 1px solid #4b1f98;
		border-radius: 5px;
		transition: all 0.3s;
		.scrollYContainer{
			max-height:550px;
			overflow-y: auto;
		}
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
		// 每一个icon模组
		.modelIcon{
			width: 345px;
			margin-left: auto;
			margin-right: auto;
			border-bottom: 1px solid #7909c1;
			padding-top: 10px;
			padding-bottom: 10px;
			// 图标 + 类型名
			.typeTitle{
				display: flex;
				align-items: center;
				.typeImg{
					display: block;
					width: 15px;
					height: 15px;
					margin-right:5px;
				}
			}
			// 类型下属列表 圆点 + 名
			.typeList{
				margin-top:4px;
				display: flex;
				flex-wrap: wrap;
				.perName{
					display: flex;
					align-items: center;
					margin-right:10px;
					height:24px;
					.circlePoint{
						display: block;
						width: 4px;
						height: 4px;
						margin-right:5px;
						border-radius: 50%;
						background: #5D7092;
						border: 1px solid #FFFFFF;
					}
				}
			}
		}
		
		.modelIcon:last-child {
			border: 0;
		}
	}
	.legendIconBoardHide {
		right: -373px;
	}
</style>
