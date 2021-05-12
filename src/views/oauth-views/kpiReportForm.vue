<template>
	<div class="kpi-report">
		<div class="kpi-main" v-show="type == 2">
			<div class="h">
				<el-button plain @click="showForm = true">查询数据报表<i class="el-icon-search"></i></el-button>
				<el-button type="primary" v-loading="downLoading" @click="getExportKey">导出报表</el-button>
			</div>
			<div class="m">
				<el-table :data="pageInfo">
					<el-table-column v-for="(item, index) in tableHeadName" :key="index" :label="item.name" align="center" width="200px" show-overflow-tooltip>
						<template slot-scope="scope">
							<span>{{scope.row[item.code]}}</span>
						</template>
						<el-table-column v-for="(child, childIndex) in item.child" :key="childIndex" :label="child.name" align="center" width="200px" show-overflow-tooltip>
							<template slot-scope="scope">
								<span>{{scope.row[child.code]}}</span>
							</template>
						</el-table-column>
					</el-table-column>
				</el-table>
			</div>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page.sync="pageNum" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
				:total="total">
			</el-pagination>
		</div>
		<div :class="{'f': type == 2}" v-show="showForm">
			<formIndex :type="type" ref="formIndex">
				<el-button @click="showForm = false" v-if="type == 2">关闭</el-button>
				<el-button type="primary" @click="showKpiList">查询数据</el-button>
				<el-button v-if="type == 2" @click="setFormData">重置条件</el-button>
			</formIndex>
		</div>
	</div>
</template>

<script>
	import formIndex from './components/formIndex.vue'
	export default {
		name: 'KPIREPORT',
		components: {
			formIndex
		},
		data() {
			return {
				type: 1,
				orgIds: [],
				targetNos: [],
				times: [],
				pageNum: 1,
				pageSize: 20,
				total: 0,
				tableHeadName: [],
				pageInfo: [],
				showForm: true,
				downLoading: false
			}
		},
		methods: {
			// 查询
			showKpiList() {
				this.returnArray()
				if (!this.times || this.times.length == 0) {
					this.$message.error('请选择月份')
					return
				}
				if (this.orgIds.length == 0) {
					this.$message.error('请选择组织')
					return
				}
				if (this.targetNos.length == 0) {
					this.$message.error('请选择指标')
					return
				}
				this.type = 2
				this.showForm = false
				this.returnList()
			},
			// 重置
			setFormData() {
				this.$refs.formIndex.setFormData()
			},
			// 查询条件：组织集合，指标配置集合，时间集合
			returnArray() {
				this.times = []
				this.orgIds = []
				this.targetNos = []
				// 时间集合
				let date = this.$refs.formIndex.date
				this.times = date
				// 组织id集合
				let orgCheckData = this.$refs.formIndex.orgCheckData
				for (var o = 0; o < orgCheckData.length; o ++) {
					this.orgIds.push(orgCheckData[o].id)
				}
				// 指标编码集合
				let targetCheckData = this.$refs.formIndex.targetCheckData
				let numbers = []
				for (var i = 0; i < targetCheckData.length; i ++) {
					numbers.push(targetCheckData[i].targetNo)
				}
				this.targetNos = numbers
			},
			// 查询kpi数据
			returnList() {
				let url = '/api/kpi/report/kpi/list'
				let params = {
					orgIds: this.orgIds,
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					targetNos: this.targetNos,
					times: this.times
				}
				this.$fetch.post(url, params).then((res) => {
					if (res.code == 200) {
						this.total = res.data.pageInfo.total
						this.tableHeadName = res.data.tableHeadName
						this.pageInfo = res.data.pageInfo.list
					}
				})
			},
			handleSizeChange(val) {
				this.pageSize = val
				this.returnList()
			},
			handleCurrentChange(val) {
				this.pageNum = val
				this.returnList()
			},
			// 获取导出key
			getExportKey() {
				let url = '/api/kpi/report/getExportKey'
				let params = {
					orgIds: this.orgIds,
					targetNos: this.targetNos,
					times: this.times
				}
				this.$fetch.post(url, params).then((res) => {
					if (res.code == 200) {
						this.exportTable(res.data)
					}
				})
			},
			// 导出
			exportTable(data) {
				this.downLoading = true
				let str = data.toString()
				const element = document.createElement('a')
				element.setAttribute('href', `/api/kpi/report/export?keys=${str}`)
				element.setAttribute('download',name)
				element.style.display = 'none'
				document.body.appendChild(element)
				element.click()
				document.body.removeChild(element)
				this.downLoading = false
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				// 通过 `vm` 访问组件实例
				vm.$store.commit('addTabs', {
					title: `KPI报表`,
					link: decodeURIComponent(vm.$route.fullPath),
					on: true,
					needCatch: true,
					isPathNameCheck: true
				})
			})
		}
	}
</script>

<style scoped lang="scss">
	.kpi-report {
		margin: 0 auto;
		width: 1194px;
		height: 100%;
		padding: 15px;
		position: relative;
		.kpi-main {
			padding: 0 15px;
			height: 100%;
			.h {
				margin-bottom: 15px;
				.el-button {
					&:first-child {
						width: 200px;
					}
					&:last-child {
						float: right;
					}
				}
				.el-icon-search {
					margin-left: 60px;
				}
			}
			.m {
				height: 80%;
				width: 100%;
				margin-bottom: 15px;
				.el-table {
					height: 100%
					::v-deep th {
						padding: 5px 0px;
					}
					::v-deep td {
						padding: 5px 0px;
					}
					::v-deep .el-table__body-wrapper {
						height: calc(100% - 70px);
						overflow: auto;
						width: 1188px;
					}
				}
			}
		}
		.f {
			z-index: 5;
			background-color: #FFFFFF;
			position: absolute;
			top: 56px;
			left: 30px;
			border: 1px solid #DCDFE6;
			border-radius: 4px;
		}
	}
</style>
