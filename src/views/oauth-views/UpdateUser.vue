<template>
	<div class="main">
		<div class="user-main">
			<div class="header">{{ type == 'add' ? '新增' : '编辑' }}</div>
			<div class="container">
				<div class="form">
					<div class="filed">
						<span class="title"><em style="color: #d0021bff">*</em>用户名</span>
						<el-input placeholder="请输入用户名，1-12位数字或字母" v-model="formData.userName" maxlength="50"></el-input>
					</div>
					<div class="filed">
						<span class="title"><em style="color: #ffffff">*</em>昵称</span>
						<el-input placeholder="请输入" v-model="formData.nickName" maxlength="50"></el-input>
					</div>
					<div class="filed">
						<span class="title"><em style="color: #d0021bff" v-if="type == 'add'">*</em><em style="color: #ffffff" v-else>*</em>密码</span>
						<el-input placeholder="请输入密码，6-12位数字或字母" v-model="formData.password" maxlength="50"></el-input>
					</div>
					<div class="filed">
						<span class="title"><em style="color: #ffffff">*</em>邮箱</span>
						<el-input placeholder="请输入" v-model="formData.email" maxlength="50"></el-input>
					</div>
					<div class="filed">
						<span class="title"><em style="color: #ffffff">*</em>手机号</span>
						<el-input placeholder="请输入" v-model="formData.mobile" maxlength="50"></el-input>
					</div>
					<div class="filed root">
						<span class="title"><em style="color: #ffffff">*</em>角色</span>
						<div class="check">
							<el-checkbox-group v-model="formData.roleIds">
								<el-checkbox v-for="(item, index) in checkData" :key="index" v-model="item.index" :label="item.id">{{ item.roleName }}</el-checkbox>
							</el-checkbox-group>
						</div>
					</div>
					<div class="filed status">
						<span class="title"><em style="color: #ffffff">*</em>状态</span>
						<div class="check">
							<el-radio v-for="(item, index) in status" :key="index" v-model="formData.status" :label="item.key">{{ item.name }}</el-radio>
						</div>
					</div>
				</div>
				<div class="tree">
					<div class="t-header">组织选择</div>
					<div class="t-tree">
						<el-input placeholder="输入关键字进行过滤" clearable v-model="filterText">
						</el-input>
						<el-tree ref="userTree" class="filter-tree" :filter-node-method="filterNode" :data="treeData" show-checkbox node-key="id" :props="defaultProps" :default-checked-keys="formData.orgIdList" @check="currentChecked">
						</el-tree>
					</div>
				</div>
			</div>
			<div class="bottom">
				<el-button type="primary" @click="updateUser" v-if="type == 'edit'">确定</el-button>
				<el-button type="primary" @click="saveUser" v-else>确定</el-button>
				<el-button @click="back">返回</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	const status = [{
			key: 0,
			name: '禁用'
		},
		{
			key: 1,
			name: '启用'
		}
	]
	export default {
		name: 'UpdateUser',
		data() {
			return {
				status,
				formData: {
					userId: '',
					userName: '',
					nickName: '',
					password: '',
					email: '',
					mobile: '',
					status: 1,
					roleIds: [],
					orgIdList: []
				},
				type: 'add',
				filterText: '',
				checkData: [],
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'name'
				}
			}
		},
		watch: {
			filterText(val) {
				this.$refs.userTree.filter(val)
			}
		},
		created() {
			this.formData.userId = this.$route.query.userId
			if (this.formData.userId) {
				this.getUserDetail()
				this.type = 'edit'
			}
			this.getCheckData()
			this.getTree()
		},
		methods: {
			currentChecked(nodeObj, SelectedObj) {
				this.formData.orgIdList = SelectedObj.checkedKeys
			},
			filterNode(value, data) {
				if (!value) return true
				return data.name.indexOf(value) !== -1
			},
			getCheckData() {
				let url = '/user-api/sys/role/info/list'
				this.$fetch.get(url).then((res) => {
					this.checkData = res.data
				})
			},
			getTree() {
				let url = '/user-api/sys/org/info/lists'
				this.$fetch.get(url).then((res) => {
					this.treeData = res.data
					const other = {
						id: '001',
						name: 'other',
						orgId: '001',
						orgName: 'other',
						parentId: this.treeData[0].id
					}
					for (var i = 0; i < this.treeData.length; i ++) {						this.treeData[i].children.push(other)					}
					console.log(this.treeData)
				})
			},
			getUserDetail() {
				let url = '/user-api/sys/user/info/' + this.formData.userId
				this.$fetch.get(url).then((res) => {
					if (res.code == 200) {
						this.formData = res.data
					}
				})
			},
			//新增
			saveUser() {
				if (!this.formData.userName) {
					this.$message({
						message: '请输入用户名',
						type: 'warning'
					})
					return
				}
				var reg = /^[0-9a-zA-z]{0,12}$/
				if (!this.formData.userName.match(reg)) {
					this.$message({
						message: '请输入正确的用户名',
						type: 'warning'
					})
					return
				}
				if (!this.formData.password) {
					this.$message({
						message: '请输入密码',
						type: 'warning'
					})
					return
				}
				if (!this.formData.password.match(reg)) {
					this.$message({
						message: '请输入正确的密码',
						type: 'warning'
					})
					return
				}
				let url = '/user-api/sys/user/info/add'
				this.$fetch.post(url, this.formData).then((res) => {
					if (res.code == 200) {
						this.$router.push({
							path: '/oauth/user'
						})
					}
				})
			},
			//编辑
			updateUser() {
				if (!this.formData.userName) {
					this.$message({
						message: '请输入用户名',
						type: 'warning'
					})
					return
				}
				var reg = /^[0-9a-zA-z]{0,12}$/
				if (!this.formData.userName.match(reg)) {
					this.$message({
						message: '请输入正确的用户名',
						type: 'warning'
					})
					return
				}
				if (this.formData.password) {
					if (!this.formData.password.match(reg)) {
						this.$message({
							message: '请输入正确的密码',
							type: 'warning'
						})
						return
					}
				}
				let url = '/user-api/sys/user/info/update'
				this.$fetch.post(url, this.formData).then((res) => {
					if (res.code == 200) {
						this.$router.push({
							path: '/oauth/user'
						})
					}
				})
			},
			back() {
				this.$router.push({
					path: '/oauth/user'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	::v-deep .el-tree > .el-tree-node > .el-tree-node__children > .el-tree-node{		&:last-child {			display: none;		}	}
	.main {
		background: #f5f5f5;
		width: 100%;
		height: 100%;

		.user-main {
			width: 1194px;
			background: #ffffff;
			border-radius: 4px;
			margin: 20px auto;
			height: calc(100% - 35px);
			position: relative;

			.header {
				font-size: 16px;
				font-weight: 500;
				color: #1c2438;
				height: 40px;
				line-height: 40px;
				background: #fafafa;
				padding-left: 40px;
				border-bottom: 1px solid #00000026;
			}

			.container {
				padding: 20px 40px;
				display: flex;
				height: calc(100% - 90px);
				overflow: auto;

				.form {
					height: calc(100% - 65px);
					width: 60%;

					.filed {
						margin-bottom: 25px;
						font-size: 12px;
						font-weight: 500;
						color: #4d4d4d;

						.title {
							display: inline-block;
							width: 90px;

							em {
								margin-right: 5px;
							}
						}
					}

					.el-input {
						width: 520px;
					}

					.root {
						display: flex;

						.check {
							width: 500px;

							.el-checkbox {
								margin-bottom: 10px;
							}
						}
					}

					.status {
						height: 200px;
						display: flex;
					}
				}

				.tree {
					width: 40%;
					height: calc(100% - 65px);
					overflow: auto;
					font-weight: 500;
					font-size: 12px;
					color: #4d4d4d;

					.t-header {
						height: 25px;
					}

					.t-tree {
						padding: 8px;
						border-radius: 4px;
						border: 1px solid #dddee1;

						.el-input {
							margin-bottom: 10px;

							.el-input__inner {
								height: 32px;
							}
						}
					}
				}
			}

			.bottom {
				padding: 8px 0px;
				background: #ffffff;
				box-shadow: 0px -3px 4px 0px #d3d3d3;
				position: absolute;
				bottom: 0px;
				width: 100%;
				z-index: 1;

				::v-deep .el-button {
					height: 36px;
					font-size: 14px;
					line-height: 36px;
					padding: 0px;

					&:first-child {
						margin-left: 20px;
						width: 120px;
						background: #930cea;
					}

					&:last-child {
						width: 80px;
					}
				}
			}
		}
	}
</style>
