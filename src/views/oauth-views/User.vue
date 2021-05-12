<template>
	<div class="main">
		<div class="user-main">
			<div class="header">
				<el-input placeholder="请输入关键词来查询您想要的用户" class="smart_input_light" v-model="params.multi">
					<template slot="append"><span class="el-icon-close" @click="changeMulti"></span></template>
				</el-input>
				<el-button @click="getUserList">查询</el-button>
				<el-button type="primary" icon="el-icon-plus" @click="addUser" v-auth= "'user:add'">新增</el-button>
				<el-button type="primary" icon="el-icon-edit-outline" @click="updateUser" v-auth= "'user:update'">修改</el-button>
				<el-button type="primary" icon="el-icon-delete" @click="deleteUser" v-auth= "'user:delete'">删除</el-button>
			</div>
			<el-table ref="userTable" border :data="tableData" @row-click="handleRowClick">
				<el-table-column type="index" width="35px"></el-table-column>
				<el-table-column type="selection" width="45px"></el-table-column>
				<el-table-column prop="userId" label="用户ID" align="center" width="120px" show-overflow-tooltip></el-table-column>
				<el-table-column prop="userName" label="用户名" align="center" width="120px" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nickName" label="昵称" align="center" width="150px" show-overflow-tooltip></el-table-column>
				<el-table-column prop="email" label="邮箱" align="center" width="150px" show-overflow-tooltip></el-table-column>
				<el-table-column prop="mobile" label="手机号" align="center" width="150px" show-overflow-tooltip></el-table-column>
				<el-table-column prop="status" label="状态" align="center" width="100px" show-overflow-tooltip>
					<template slot-scope="scope">
						<el-button type="success" v-if="scope.row.status == 1">正常</el-button>
						<el-button type="danger" v-if="scope.row.status == 0">禁用</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="customerType" label="客户类型" align="center" width="100px" show-overflow-tooltip>
					<template slot-scope="scope">
						<el-button type="success">
							{{ scope.row.customerType | getType }}
						</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip></el-table-column>
			</el-table>
			<el-pagination v-if="tableData.length > 0" background layout="total, sizes, prev, pager, next, jumper" :total="params.total"
			:page-sizes="[10, 20, 30, 40]" :page-size="params.pageSize" :current-page.sync="params.currentPage" @current-change="handleCurrentChange"
			@size-change="handleSizeChange">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'User',
		filters: {			getType(val) {				if (val == 'km') {					return '康面'				}				if (val == 'ky') {					return '康饮'				}				if (val == 'by') {					return '百饮'				}			}		},
		data() {
			return {
				tableData: [],
				params: {
					multi: '',
					total: 0,
					pageSize: 10,
					currentPage: 1
				}
			}
		},
		watch: {
			'params.multi'() {
				this.params.currentPage = 1
				this.getUserList()
			}
		},
		created() {
			this.getUserList()
		},
		methods: {
			changeMulti() {
				this.params.multi = ''
			},
			handleRowClick(row){
				this.$refs.userTable.toggleRowSelection(row);
			},
			addUser() {
				this.$router.push({
					path: '/oauth/userUpdate'
				})
			},
			updateUser() {
				if (this.$refs.userTable.selection.length == 1) {
					this.$router.push({
						path: '/oauth/userUpdate?userId=' + this.$refs.userTable.selection[0].userId
					})
				} else {
					this.$message.error('请选择一条记录')
				}
			},
			deleteUser() {
				let url = '/user-api/sys/user/info/deletes'
				if (this.$refs.userTable.selection.length > 0) {
					this.$confirm('确认要删除选中的记录?', '信息', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let userIds = []
						for (var i = 0; i < this.$refs.userTable.selection.length; i ++) {
							userIds.push(this.$refs.userTable.selection[i].userId)
						}
						this.$fetch.post(url, {userIds: userIds}).then((res) => {
							if (res.code == 200) {
								this.$message.success('操作成功')
								this.getUserList()
							} else {
								this.$message.error(res.message)
							}
						})
					})
				} else {
					this.$message.error('请选择一条记录')
				}
			},
			handleCurrentChange(val) {
				this.params.currentPage = val
				this.getUserList()
			},
			handleSizeChange(val) {
				this.params.pageSize = val
				this.getUserList()
			},
			getUserList() {
				let url = '/user-api/sys/user/info/list'
				let param = {
					limit: this.params.pageSize,
					page: this.params.currentPage,
					multi: this.params.multi
				}
				this.$fetch.get(url, param).then((res) => {
					this.tableData = res.data.list
					this.params.total = res.data.totalCount
					this.params.pageSize = res.data.pageSize
					this.params.currentPage = res.data.currPage
				})
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.$store.commit('addTabs', {
					title: '用户管理',
					link: '/oauth/user',
					on: true,
					needCatch: true
				});
			});
		}
	}
</script>

<style scoped lang="scss">
	.main {
		background: #F5F5F5;
		width: 100%;
		height: 100%;

		.user-main {
			width: 1194px;
			background: #FFFFFF;
			border-radius: 4px;
			margin: 20px auto;
			padding: 10px;
			height: calc(100% - 60px);

			.header {
				margin: 12px 20px;

				.el-input {
					width: 300px;

					::v-deep .el-input__inner {
						height: 28px;
						line-height: 28px;
						font-size: 12px;
					}
					::v-deep .el-input__icon {
						line-height: 28px;
					}
				}

				.el-button {
					height: 28px;
					line-height: 28px;
					padding: 0px 21px;
					font-size: 12px;
					margin-left: 20px;
				}
			}

			::v-deep .el-table th {
				padding: 5px 0px;
				background: #F8F8F9;
				color: #1C2438;
			}

			::v-deep .el-table td {
				padding: 5px 0px;
				color: #1C2438;
			}

			.el-table {
				height: calc(100% - 100px);

				.el-button {
					width: 50px;
					height: 20px;
					padding: 0px;
					line-height: 20px;
					font-size: 12px;
				}

				.el-button--success {
					background: #19BE6B;
				}

				.el-button--danger {
					background: #ED3F14;
				}
			}

			::v-deep .el-table__body-wrapper {
				height: calc(100% - 35px);
				overflow: auto;
			}

			.el-pagination {
				margin-top: 20px;
			}
		}
	}
</style>
