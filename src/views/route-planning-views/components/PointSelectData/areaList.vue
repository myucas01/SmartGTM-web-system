<template>
	<!-- <div>表格</div> -->
	<el-table ref="areaPointList" class="smart_table_deep" :data="tableData" :default-sort ="{prop:'storeName',order:'descending'}" size="mini" border fit style="width: 100%" height="200px">
		<el-table-column type="selection" width="50px"></el-table-column>
		<el-table-column prop="areaName" label="区域" width="80px" show-overflow-tooltip align="center"></el-table-column>
		<el-table-column prop="storeCode" label="客户编号" width="120px" show-overflow-tooltip></el-table-column>
		<el-table-column prop="storeName" label="客户名称" width="270px" show-overflow-tooltip></el-table-column>
		<el-table-column prop="storeAddress" label="地址" show-overflow-tooltip></el-table-column>
		<el-table-column prop="storeType" label="客户类型" width="120px" show-overflow-tooltip align="center"></el-table-column>
		<el-table-column prop="storeScale" label="客户规模" width="180px" show-overflow-tooltip align="center"></el-table-column>
		<el-table-column prop="serviceDay" label="服务日" width="100px" show-overflow-tooltip align="center">
			<template slot-scope="scope">
				{{ scope.row.serviceDayStr |  getDate }}
			</template>
		</el-table-column>
		<el-table-column prop="visitRate" label="拜访频次" width="150px" show-overflow-tooltip align="center">
			<template slot-scope="scope">
				{{ scope.row.visitRate | getVisitDate }}
			</template>
		</el-table-column>
		<el-table-column prop="shopTime" label="在店时长(分钟/次)" width="200px" show-overflow-tooltip align="center"></el-table-column>
		<!-- 	<el-table-column align="center">
			<template slot="header">
				<span class="el-icon-setting"></span>
			</template>
			<template>
				<span class="el-icon-rank"></span>
			</template>
		</el-table-column> -->
	</el-table>
</template>

<script>
	// import Sortable from 'sortablejs'
	export default {
		props: ['tableData'],
		filters: {
			getDate(val) {
				if(val) {
				let serviceDay = val.split(',')
				let dateTime = [];
				serviceDay.forEach(item => {
					switch (item) {
						case '1':
							dateTime.push('周一');
							break;
						case '2':
							dateTime.push('周二');
							break;
						case '3':
							dateTime.push('周三');
							break;
						case '4':
							dateTime.push('周四');
							break;
						case '5':
							dateTime.push('周五');
							break;
						case '6':
							dateTime.push('周六');
							break;
						case '7':
							dateTime.push('周日');
							break;
						default:
							dateTime.push('-');
							break;
					}
				})
				return dateTime.toString();
				}
			},
			getVisitDate(val) {
				if(val){
				let visity = ''
				switch (val) {
					case '1':
						visity = '一周一访';
						break;
					case '2':
						visity = '一周两访';
						break;
					case '3':
						visity = '一周三访';
						break;
					default:
						visity = '-';
						break;
				}
				return visity;
				}
			},
		},
		data() {
			return {
				tableList: []
			}
		},
		methods: {
			// 需求还不明确，但是后面会用到，所以先注释了
			// 需求还不明确，但是后面会用到，所以先注释了
			// rowDrop() {
			// 	const tbody = document.querySelector('.el-table__body-wrapper tbody')
			// 	// Sortable.create(tbody)
			// 	// const _this = this
			// 	Sortable.create(tbody, {
			// 		onEnd({ newIndex, oldIndex }) {
			// 			console.log(newIndex, oldIndex)
			// 			// const currRow = _this.tableList.splice(oldIndex, 1)[0]
			// 			// _this.tableList.splice(newIndex, 0, currRow)
			// 		}
			// 	})
			// },
			// rowDropDialog() {
			// 	if (document.querySelector('.el-dialog__body')) {
			// 		const tbody = document.querySelector('.el-dialog__body .el-table__body-wrapper tbody')
			// 		Sortable.create(tbody, {
			// 			onEnd({ newIndex, oldIndex }) {
			// 				console.log(newIndex, oldIndex)
			// 			}
			// 		})
			// 	}
			// }
			// 需求还不明确，但是后面会用到，所以先注释了
			// 需求还不明确，但是后面会用到，所以先注释了
		},
		mounted() {
			// 需求还不明确，但是后面会用到，所以先注释了
			// 需求还不明确，但是后面会用到，所以先注释了
			// this.rowDrop()
			// this.rowDropDialog()
			// 需求还不明确，但是后面会用到，所以先注释了
			// 需求还不明确，但是后面会用到，所以先注释了
		}
	}
</script>

<style>
	.el-table th.gutter {
		display: table-cell !important;
	}

	.el-table colgroup.gutter {
		display: table-cell !important;
	}
</style>
