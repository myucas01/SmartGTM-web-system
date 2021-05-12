<template>
	<div class="record-main" @click="hideTree">
		<span :class="dayTime" @click="checkedType(dayTime)">昨日</span>
		<span :class="weekTime" @click="checkedType(weekTime)">上周</span>
		<span :class="monthTime" @click="checkedType(monthTime)">上月</span>
		<span :class="yearTime" @click="checkedType(yearTime)">去年</span>
		<el-date-picker v-model="date" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
			start-placeholder="开始日期" end-placeholder="结束日期" @change="checkedDate">
		</el-date-picker>
		<!-- <el-select placeholder="请选择组织" v-model="organizeId"></el-select> -->
		<div style="display: inline;" @click.stop="showTree">
			<el-input :placeholder="organizeId.length == 0 ? '请选择组织' : '已选择组织'" v-model="organizeName">
				<i slot="suffix" :class="icon" @click.stop="changeIcon" style="cursor: pointer;"></i>
			</el-input>
			<el-tree ref="tree" show-checkbox v-show="show" :data="data" :props="defaultProps" @check-change="handleCheckChange"
				:default-expanded-keys="expandId" :filter-node-method="filterNode" node-key="id"></el-tree>
		</div>
		<el-button type="primary" @click="exportRecord" v-loading="downLoading" v-auth="'logsreport:export'">导出报表</el-button>
		<el-table border :data="table">
			<template slot="empty">
				<span>暂无日志</span>
			</template>
			<el-table-column label="时间" prop="createTime" align="center" width="150px" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="事业部" prop="bu" align="center" width="150px" show-overflow-tooltip></el-table-column>
			<el-table-column label="南北区" prop="regionName" align="center" width="150px" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="行销公司" prop="companyName" align="center" width="150px" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="营业部" prop="salesDepartmentName" align="center" width="150px" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="业务所" prop="orgName" align="center" width="150px" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="所属人数" prop="empNum" align="center" width="150px" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="访问人数" prop="visitorNum" align="center" width="150px" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="异常操作数" prop="abnormalOperationNum" width="150px" align="center"
				show-overflow-tooltip></el-table-column>
			<el-table-column label="边界设置" prop="boundarySettingNum" align="center" width="150px" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="上传修改门店" prop="uploadAndModifyStoresNum" width="150px" align="center"
				show-overflow-tooltip></el-table-column>
			<el-table-column label="推送门店" prop="pushStoresNum" align="center" width="150px" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="明细门店下载" prop="detailsStoreDownloadNum" width="150px" align="center"
				show-overflow-tooltip></el-table-column>
			<el-table-column label="计划提交审批" prop="planApprovalNum" width="150px" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="审批通过" prop="approvalSuccessNum" align="center" width="150px" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="审批失败" prop="approvalFailNum" align="center" width="150px" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="下载选定拜访计划" prop="downloadPlanNum" width="150px" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="添加计划" prop="addPlanNum" align="center" width="150px" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="区域调整" prop="regionalAdjustmentNum" align="center" width="150px"
				show-overflow-tooltip></el-table-column>
			<el-table-column label="路线调整" prop="routeAdjustmentNum" align="center" width="150px" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="还原片区" prop="restorationAreaNum" align="center" width="150px" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="服务日对调" prop="serviceDaySwapNum" width="150px" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="生成路线" prop="generationLineNum" align="center" width="150px" show-overflow-tooltip>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
			:current-page.sync="pageNum" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
			:total="total">
		</el-pagination>
		<div class="filedInfoTips">
			<div style="display: inline-block;" @mouseover="tipHidden = true" @mouseout="tipHidden = false">
				<i class="el-icon-info">注释说明</i>
			</div>
		</div>
		<i class="triangle-down" v-show="tipHidden"></i>
		<el-table class="tipTable" border v-show="tipHidden" :data="tipData" height="550px">
			<el-table-column prop="name" label="指标名称" width="130px" align="center"></el-table-column>
			<el-table-column prop="module" label="模块" width="130px"></el-table-column>
			<el-table-column prop="tip" label="注释说明" width="250px"></el-table-column>
		</el-table>
	</div>
</template>

<script>
	import axios from 'axios'
	import { downLoadBlobFile } from '@/util'
	export default {
		name: 'RecordIndex',
		data() {
			return {
				icon: 'el-input__icon el-icon-arrow-down',
				show: false,
				date: '',
				type: 'yesterday',
				startDate: '',
				endDate: '',
				organizeId: '',
				organizeList: [],
				organizeName: '',
				organizeHolder: '请选择组织',
				expandId: [],
				orgType: '',
				pageNum: 1,
				pageSize: 20,
				total: 0,
				dayTime: {
					'code': 'yesterday',
					'time-go': true,
					'checked': true
				},
				weekTime: {
					'code': 'week',
					'time-go': true,
					'checked': false
				},
				monthTime: {
					'code': 'month',
					'time-go': true,
					'checked': false
				},
				yearTime: {
					'code': 'year',
					'time-go': true,
					'checked': false
				},
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				data: [],
				table: [],
				downLoading: false,
				tipData: [],
				tipHidden: false
			}
		},
		watch: {
			organizeName(val) {
				this.$refs.tree.filter(val)
			},
			organizeId() {
				this.searchRecord()
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				// 通过 `vm` 访问组件实例
				vm.$store.commit('addTabs', {
					title: `日志报表`,
					link: decodeURIComponent(vm.$route.fullPath),
					on: true,
					needCatch: true,
					isPathNameCheck: true
				})
			})
		},
		created() {
			this.getOrgTree()
			this.searchRecord()
			this.getTipData()
		},
		methods: {
			hideTree() {
				this.show = false
				this.icon = 'el-input__icon el-icon-arrow-down'
			},
			showTree() {
				this.show = true
				this.icon = 'el-input__icon el-icon-arrow-up'
			},
			filterNode(value, data) {
				if (!value) return true;
				return data.name.indexOf(value) !== -1;
			},
			searchRecord() {
				this.startDate = this.date ? this.date[0] : ''
				this.endDate = this.date ? this.date[1] : ''
				this.type = this.date ? '' : this.type
				let params = {
					type: this.type,
					startDate: this.startDate,
					endDate: this.endDate,
					orgIds: this.organizeList,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}
				let url = '/api/log/statistic'
				this.$fetch.post(url, params).then((res) => {
					this.table = res.data.logList
					this.total = res.data.total
				})
			},
			getOrgTree() {
				let url = '/api/boundary/orgregion/list'
				this.$fetch.get(url).then((res) => {
					if (res.code == 200) {
						this.data = res.data
						this.expandId.push(res.data[0].id)
					}
				})
			},
			exportRecord() {
				let param = {
					type: this.type,
					startDate: this.startDate,
					endDate: this.endDate,
					orgIds: this.organizeList
				}
				axios({
					method:'post',
					url:'/api/log/export',
					responseType:'blob',
					data:param
				})
				.then(function(res) {
					const { startdate, enddate } = res.headers
					const name = escape(startdate + '-' + enddate)
					downLoadBlobFile(res.data, decodeURI(name) + '.xlsx')
				})
			},
			changeIcon() {
				this.icon = this.icon.indexOf('down') > 0 ? 'el-input__icon el-icon-arrow-up' : 'el-input__icon el-icon-arrow-down'
				this.show = !this.show
			},
			checkedType(data) {
				this.dayTime.checked = false
				this.weekTime.checked = false
				this.monthTime.checked = false
				this.yearTime.checked = false
				data.checked = true
				this.type = data.code
				this.date = null
				this.searchRecord()
			},
			checkedDate(data) {
				if (data) {
					this.dayTime.checked = false
					this.weekTime.checked = false
					this.monthTime.checked = false
					this.yearTime.checked = false
				}
				this.searchRecord()
			},
			handleSizeChange(val) {
				this.pageSize = val
				this.searchRecord()
			},
			handleCurrentChange(val) {
				this.pageNum =val
				this.searchRecord()
			},
			handleCheckChange() {
				let data = this.$refs.tree.getCheckedNodes()
				let str = []
				for (var i = 0; i < data.length; i ++) {
					str.push(data[i].id)
				}
				this.organizeId = str.toString()
				this.organizeList = str
			},
			// tip数据
			getTipData() {
				this.tipData = [
					{
						name: '所属人数',
						module: '系统',
						tip: '该业代所下有效的工作人数'
					},
					{
						name: '访问人数',
						module: '系统',
						tip: '每天使用账号访问系统的人数'
					},
					{
						name: '异常操作',
						module: '系统',
						tip: '操作系统时遇到系统报错或者异常操作的次数统计'
					},
					{
						name: '边界设置',
						module: '组织边界',
						tip: '设置过组织边界，且设置完成的操作'
					},
					{
						name: '组织边界调整',
						module: '组织边界',
						tip: '操作过“组织边界调整”的操作'
					},
					{
						name: '上传修改门店',
						module: '售点盘点',
						tip: '上传或者修改门店的操作'
					},
					{
						name: '推送门店',
						module: '售点盘点',
						tip: '操作过推送门店操作'
					},
					{
						name: '明细门店下载',
						module: '售点盘点',
						tip: '门店明细中，点击操作下载'
					},
					{
						name: '计划提交审批',
						module: '划区建线',
						tip: '对选定拜访计划提交审批操作'
					},
					{
						name: '审批通过',
						module: '划区建线',
						tip: '已提交“选定拜访计划”的审批，审批通过的计划，计数'
					},
					{
						name: '审批失败',
						module: '划区建线',
						tip: '已提交“选定拜访计划”的审批，审批失败的计划，计数'
					},
					{
						name: '下载选定拜访计划',
						module: '划区建线',
						tip: '对选定的拜访计划操作下载'
					},
					{
						name: '添加计划',
						module: '划区建线',
						tip: '业代所下操作“添加计划”操作的次数'
					},
					{
						name: '区域调整',
						module: '划区建线',
						tip: '进行区域调整操作，并完成保存'
					},
					{
						name: '路线调整',
						module: '划区建线',
						tip: '启用并完成路线调整功能'
					},
					{
						name: '还原片区',
						module: '划区建线',
						tip: '启用并完成还原片区功能'
					},
					{
						name: '服务日对调',
						module: '划区建线',
						tip: '开启服务日对调操作，并有操作点位服务日的调整'
					},
					{
						name: '生成路线',
						module: '划区建线',
						tip: '点击“生成路线”按钮，并成功生成路线'
					}
				]
			}
		}
	}
</script>

<style scoped lang="scss">
	.record-main {
		width: 1194px;
		height: 90%;
		margin: 0 auto;
		margin-top: 25px;
		border: 1px solid #f1eaea;
		background-color: #f3f1f136;
		padding: 15px;
		position: relative;

		.time-go {
			border: 1px solid #a93dee61;
			border-radius: 4px;
			padding: 11px 20px;
			cursor: pointer;

			&:not(:last-child) {
				margin-right: 12px;
			}
		}

		.checked {
			background-color: #a93dee3b;
		}

		.el-date-editor {
			margin: 0 30px;
		}

		.el-input {
			width: 250px;
		}

		.el-tree {
			width: 248px;
			max-height: 300px;
			overflow: auto;
			border: 1px solid #EBEEF5;
			position: absolute;
			z-index: 1;
			right: 237px;
		}

		.el-button {
			float: right;
		}

		.el-table {
			height: calc(100% - 150px);
			margin-top: 15px;
			::v-deep .el-table__body-wrapper {
				overflow: auto;
			}
		}
		
		::v-deep .el-table__body-wrapper {
			height: calc(100% - 75px);
			overflow-y: auto;
			width: 1188px;
		}
		::v-deep .el-table__header-wrapper {
			width: 1180px;
		}

		::v-deep thead {
			color: #00050ebf;
		}

		::v-deep .el-table__header-wrapper {
			th {
				padding: 5px 0;
			}
		}

		::v-deep .el-table__body-wrapper {
			height: calc(100% - 55px);
		}

		::v-deep .el-table__empty-block {
			width: 100% !important;
		}

		.el-pagination {
			margin-top: 20px;
		}
		
		.filedInfoTips {
			text-align: right;
			i {
				cursor: pointer;
				padding: 3px;
				border: 1px solid #9e9e9e;
			}
			.el-icon-info:before {
				display: inline-block;
				height: 20px;
				line-height: 20px;
			}
		}
		
		.triangle-down {
			z-index: 10;
			position: absolute;
			width: 0;
			height: 0;
			bottom: 60px;
			right: 55px;
			border-left: 25px solid transparent;
			border-right: 25px solid transparent;
			border-top: 50px solid #303133;
		}
		
		.tipTable {
			z-index: 10;
			bottom: 75px;
			right: 45px;
			position: absolute;
			width: 515px;
			background-color: #303133;
			::v-deep th {
				background-color: #303133;
				color: #FFFFFF;
				padding: 0;
			}
			::v-deep tr {
				background-color: #303133;
				color: #FFFFFF;
				&:hover {
					td {
						background-color: #303133;
						color: #FFFFFF;
					}
				}
			}
			::v-deep td {
				padding: 0;
			}
		}
	}
</style>
