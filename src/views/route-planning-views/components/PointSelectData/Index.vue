<template>
	<div class="main_top">
		<div class="topbox">
			<span>批量选点({{tableData.length}})</span>
			<span class="close" @click="changeVIew()">
				<i class="el-icon-close"></i>
			</span>
			<span class="enlarge" @click="showEnlarge()">
				<i class="el-icon-copy-document"></i>
			</span>
		</div>
		<div class="middlebox">
			<el-button @click="updateArea">修改</el-button>
			<span class="sotreName">
				<el-checkbox-group v-model="checkedStore" @change="handleCheckedtabChange">
					<el-checkbox v-for="store in plandeStores" :label="store.value" :key="store.value">{{store.value}}({{store.childlen}})</el-checkbox>
				</el-checkbox-group>
			</span>
		</div>
		<div class="bottom_tab">
			<AreaList :tableData="newtableData" ref="area"></AreaList>
			<AreaForm :pointData="pointData" ref="areaForm"></AreaForm>
			<enlargeAreaForm ref="enlargeAreaForm" :tableData="newtableData"></enlargeAreaForm>
		</div>
	</div>
</template>

<script>
	import AreaList from "./areaList"
	import AreaForm from "./areaForm"
	import enlargeAreaForm from "./enlargeAreaForm"
	export default {
		props: ['tableData'],
		components: {
			AreaList,
			AreaForm,
			enlargeAreaForm
		},
		data() {
			return {
				pointData: [],
				plandeStores: [{
					value:'未计划的店',
					childlen:0
				}, {
					value:'已计划的店',
					childlen:0
				}],
				checkedStore:['未计划的店', '已计划的店'],
				newtableData:[]
			}
		},
		mounted(){
			// 初始化点位
			this.newtableData = this.tableData
			this.handleCheckedtabChange()
		},
		watch:{
			// 监听点位变化
			tableData:{
				deep: true,
				handler: function() {
				this.handleCheckedtabChange()
				}
			}
		},
		methods: {
			changeVIew() {
				this.$parent.$refs.topMeau.changeDot()
			},
			showEnlarge() {
				this.$refs.enlargeAreaForm.dialogVisible = true
			},
			updateArea() {
				this.pointData = this.$refs.area.$refs.areaPointList.store.states.selection
				if (this.pointData.length > 0) {
					this.$refs.areaForm.dialogVisible = true
				} else {
					this.$message.error('请选择批量选点的数据')
				}
			},
			handleCheckedtabChange(){
				// 根据点位变化，处理列表数据显示
				let newData = []
				const storeNo = this.checkedStore.indexOf('未计划的店')>-1
				const storeHave= this.checkedStore.indexOf('已计划的店')>-1
				const noPlaned = this.tableData.filter(item=>!item.areaId)
				const havePlaned = this.tableData.filter(item=>item.areaId)
				if (storeNo && storeHave) {
					// 都有
					newData= this.tableData
				} else if(!storeNo && storeHave) {
					// 已计划的店
					newData= havePlaned
				} else if(storeNo && !storeHave){
					// 未计划的店
					newData= noPlaned
				} else if (!storeNo && !storeHave) {
					// 为空
					newData = []
				}
				this.newtableData = newData
				// 获取未计划已计划门店数量
				this.plandeStores.forEach(item=>{
					if(item.value == '未计划的店'){
						item.childlen = noPlaned.length
					} else if(item.value == '已计划的店'){
						item.childlen = havePlaned.length
					} 
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .el-checkbox{
		color: #ffffff;
	}
	.main_top {
		display: flex;
		width: calc(100% - 340px);
		height: auto !important;
		background: #0a2757;
		position: absolute;
		z-index: 161;
		right: 0px;
		bottom: 0px;
		flex-wrap: wrap;
		min-height: 170px;
		overflow: hidden;
	}
	.sotreName {
		color: #ffffff;
		margin-left: 50px;
		display: inline-block;
	}
	.topbox {
		height: 32px;
		display: block;
		width: 100%;
		line-height: 32px;
		background: #133773;
		color: #ffffff;
		font-size: 14px;
		padding: 0px 12px;
		text-align: left;
		width: 100%;

		span {
			cursor: pointer;
		}

		.close {
			float: right;
		}
		
		.enlarge {
			float: right;
			margin-right: 10px;
		}
	}

	.middlebox {
		width: 100%;
		height: 43px;
		line-height: 43px;
		background-color: #0A2757;
		padding-left: 20px;

		.el-button {
			width: 74px;
			height: 24px;
			line-height: 24px;
			padding: 0;
			color: #FFFFFF;
			font-size: 12px;
			background: #930CEA;
			border: #930CEA;
			border-radius: 4px;
		}
	}

	.bottom_tab {
		display: block;
		background-color: #102f63;
		width: 99%;
		margin: 0px 8px;
	}
</style>
