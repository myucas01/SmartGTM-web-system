<!--
    店铺图例面板
-->
<template>
	<div class="legendIconComp">
		<!--打开面板按钮-->
		<div class="switchButton switchButtonOpen" @click="switchLegendBoard">
			<span class="el-icon-caret-top switchIcon"></span>
		</div>
		<div class="legendIconBoard" id="legend_icon_board" :class="{'legendIconBoardHide':is_close_board}">
			<!--头部-->
			<div class="headerInfo">
				<span class="headerText">门店类型图例</span>
				<!--关闭面板按钮-->
				<div class="switchButton switchButtonClose" @click="switchLegendBoard">
					<span class="el-icon-caret-top switchIcon"></span>
				</div>
			</div>
			<!--图例列表-->
			<div class='scrollYContainer'>
				<div class="modelIcon" v-for='(item, index) in icon_array' :key='index'>
					<div class="perIcon" v-for='(per_icon, index) in item.infos' :key='index'>
						<img class="iconImg" :src="per_icon.typeIcon" alt="icon" />{{per_icon.name}}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	/*---------------------导入Vuex---------------------*/
	import { mapState, mapMutations } from "vuex";
	import BUSINESS_NAVIGATION_API from '../../../api/business_navigate_api'

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
		computed: {
			...mapState({
				is_open_pop_export_store_table: (state) => {
					return state.businessNavigationModule.is_open_pop_export_store_table;
				},
			}),
		},
		mounted() {
			this.getIconList()
		},
		methods: {
			/**
			 * @description 获取图例列表
			 */
			async getIconList(){
				this.icon_array  = await BUSINESS_NAVIGATION_API.get_store_type_list({cate:1})
			},
			// Vuex-mutations
			...mapMutations(["setIsShowExportStoreTable"]),
			switchLegendBoard() {
				this.is_close_board = !this.is_close_board;
			},
			// 是否显示导出门店pop浮层
			switchShowExoprtTable() {
				console.log("状态值：", this.is_open_pop_export_store_table);
				this.setIsShowExportStoreTable({
					is_open_pop_export_store_table: !this.is_open_pop_export_store_table,
				});
			},
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
		.modelIcon {
			width: 328px;
			margin-left: auto;
			margin-right: auto;
			border-bottom: 1px solid #7909c1;
			padding-top: 5px;
			padding-bottom: 5px;
			display: flex;
			flex-wrap: wrap;
			.perIcon {
				height: 28px;
				line-height: 28px;
				font-size: 12px;
				margin-right: 20px;
				.iconImg {
					width: 14px;
					height: 14px;
					margin-right: 4px;
					vertical-align: sub;
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
