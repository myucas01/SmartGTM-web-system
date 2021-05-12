<!--
    角色管理
-->
<template>
	<div class="roleManagePage" id="role_manage_page">
		<!--列表查询页-->
		<section class="listPart" v-show='current_model === "index"'>
			<!--操作面板-->
			<div class="optionBoard">
				<!--角色关键词输入框-->
				<el-input
					type="text"
					size="mini"
					class="roleKeyInput"
					v-model="role_key"
					@keyup.enter.native= "searchRoleName"
					placeholder="请输入关键词来查询您想要的用户"
				></el-input>
				<!--提交按钮-->
				<el-button size="small" class="submitButton" @click='searchRoleName' v-auth='"role:list"'>查询</el-button>
				<!--新增-->
				<el-button size="small" class="ctrlButton addButton" @click='addRole' v-auth='"role:add"'><i class="el-icon-plus"></i> 新增</el-button>
				<!--修改-->
				<el-button size="small" class="ctrlButton editButton" @click='editRole' v-auth='"role:update"'><i class="el-icon-edit-outline"></i> 修改</el-button>
				<!--删除-->
				<el-button size="small" class="ctrlButton deleteButton" @click='deleteRole' v-auth='"role:delete"'><i class="el-icon-delete"></i> 删除</el-button
				>
			</div>
			<div class="rolelist">
				<el-table
					border
					ref="multipleTable"
					:data="roles_data.list"
					tooltip-effect="dark"
					style="width: 1180px;margin-left:auto;margin-right:auto"
					@selection-change="handleSelectionChange"
					header-row-class-name='roleHeaderLine'
					cell-class-name='perTd'
					height='60vh'
					>
					<el-table-column type="index" width="50" fixed></el-table-column>
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="id" label="角色ID" width="335"></el-table-column>
					<el-table-column prop="roleName" label="角色名称" width="335"></el-table-column>
					<el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
				</el-table>
			</div>
			<div class='paginationFooter'>
				<el-pagination
					background
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="roles_data.currPage"
					:page-sizes="[10, 20]"
					:page-size="10"
					layout="total, sizes, prev, pager, next, jumper"
					:total="roles_data.totalCount">
				</el-pagination>
			</div>
		</section>

		<!--编辑/新增页-->
		<section class="editPart" v-show='current_model === "edit" || current_model === "add"'>
			<!--头部类型标识-->
			<div class='publicHeader'>{{ current_model === 'add' ? '新增' : '编辑' }}</div>
			<!--角色表单-->
			<div class='publicInputModel roleNameModel'>
				<span class='label'><i class='necessaryStar'>*</i>角色名称</span><el-input v-model="current_role_name" maxlength="120" class="roleNameInput" type="text" size="mini" placeholder="请输入角色名（必填）"></el-input>
			</div>
			<!--备注表单-->
			<div class='publicInputModel remarksModel'>
				<span class='label'>备注</span><el-input class='remarksTextarea' type='textarea' resize='none' v-model="remarks_content" placeholder="请输入备注"></el-input>
			</div>
			<!--权限过滤/checkbox表单-->
			<div class='publicInputModel authorityModel'>
				<span class='label authorityLabel'>功能权限</span>
				<div class='rightInputTreeContainer'>
					<el-input v-model="authority_filter_value" class='filterAuthorityInput' size="mini" placeholder="查找"></el-input>
					<!--
						node-key: 'id' -- 指定元数据中的id为唯一标识，也是传递给后端的值
						show-checkbox： 是否能够勾选
						default-expand-all
					-->
					<div class='treeBox'>
						<el-tree
							:data= "tree_data"
							show-checkbox
							default-expand-all
							node-key="id"
							ref="authorityTree"
							highlight-current
							:props="defaultProps"
							:filter-node-method="filterNode">
						</el-tree>
					</div>
				</div>
			</div>
			<!--底部提交-->
			<div class='submitAuthorityArea'>
				<div class='submitChangeButton' @click='submitForm'>确定</div>
				<div class='goBackButton' @click='goBack'>返回</div>
			</div>
		</section>
	</div>
</template>

<script>
	/*---------------------导入商机导航接口API---------------------*/
	import AUTH_ROLE_API from '../../../api/oauth_api'

	export default {
		name: 'role_manage_page',
		components: {},
		data() {
			return {
				role_key: '',
				// 当前模块标识：index：列表，edit：编辑，add：新增
				current_model:'index',
				// 角色列表请求数据
				list_params:{
					// 关键词
					multi:'',
					// 每页最大条数
					limit: 10,
					// 当前页码
					page:1
				},
				// 角色列表元数据
				roles_data: '',
				// 选中的角色数据
				selected_role: [],
				// 某个角色名
				current_role_name: '',
				// 某个备注名
				remarks_content: '',
				// 某个角色id
				current_role_id: '',
				// 权限列表
				authority_filter_value: '',
				// 权限树数据
				tree_data:[],
				// 权限树默认配置
				defaultProps:{
					children: 'children',
					label: 'menuName'
				}
			}
		},
		watch: {
			authority_filter_value(val) {
				this.$refs.authorityTree.filter(val);
			}
		},

		/**
		 * @description 路由钩子函数，初始化在进入之前添加选项卡
		 */
		beforeRouteEnter(to, from, next) {
			next((vm) => {
				// 通过 `vm` 访问组件实例
				vm.$store.commit('addTabs', {
					title: '角色管理',
					link: to.fullPath,
					on: true,
					needCatch: true
				})
			})
		},
		created() {},
		mounted() {
			// 初始化角色列表
			this.initRoleList()
			// 初始化权限树
			this.initFunAuthTree()
		},
		methods: {
			/**
			 * @description 在table中选中角色后回调
			 * @param { Array<object> } selected_data 选中的数据数组
			 */
			handleSelectionChange(selected_data) {
				this.selected_role = selected_data
			},

			/**
			 * @description 搜索角色名
			 */
			searchRoleName() {
				// 过滤左右空格后
				this.list_params.multi = this.role_key.trim()
				this.list_params.page = 1
				this.initRoleList()
			},
			
			/**
			 * @description 点击添加角色按钮，添加某个角色
			 */
			addRole() {
				// 切换到添加角色模块
				this.current_model = 'add'
				// 清空表单角色名
				this.current_role_name = ''
				// 清空表单备注
				this.remarks_content = ''
				// 清空树过滤值
				this.authority_filter_value = ''
				// 清空权限树
				this.$refs.authorityTree.setCheckedKeys([])
			},

			/**
			 * @description 编辑某个角色
			 */
			async editRole() {
				if(this.selected_role.length === 0) {
					this.$alert('请选择一个角色', '提示', {
						confirmButtonText: '确定'
					})
					return
				}
				if(this.selected_role.length > 1) {
					this.$alert('只能选择一个角色', '提示', {
						confirmButtonText: '确定'
					})
					return
				}
				// 显示编辑模块
				this.current_model = 'edit'
				// 清空树过滤值
				this.authority_filter_value = ''
				// 初始化角色名
				this.current_role_name = this.selected_role[0].roleName ? this.selected_role[0].roleName : ''
				// 初始化备注
				this.remarks_content = this.selected_role[0].remark ? this.selected_role[0].remark : ''
				// 初始化权限树树
				this.current_role_id = this.selected_role[0].id
				AUTH_ROLE_API.get_edit_role_data(this.selected_role[0].id).then(data => {
					this.$refs.authorityTree.setCheckedKeys(data)
				})
			},

			/**
			 * @description 删除角色
			 */
			deleteRole() {
				if(this.selected_role.length === 0) {
					this.$alert('请选择一个角色', '提示', {
						confirmButtonText: '确定'
					})
					return
				} else {
					this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						// 确定删除后，遍历勾选的角色获取id，拼接成数组
						let role_id_array = []
						for(let i = 0, length = this.selected_role.length; i < length; i++) {
							role_id_array.push(this.selected_role[i].id)
						}
						// 调用删除接口
						AUTH_ROLE_API.delete_role({roleIds: role_id_array}).then(data => {
							if(data) {
								this.$alert('删除操作成功！', '', {
									confirmButtonText: '确定',
									callback: () => {
										// 再次调用接口
										this.initRoleList()
									}
								})
							}
						})
					})
				}
			},

			/**
			 * @description 后退到角色列表页
			 */
			goBack() {
				this.current_model = 'index'
			},

			/**
			 * @description 每页最大值变化
			 * @param {Number} max_num_per_page 每页最大条数
			 */
			handleSizeChange(max_num_per_page){
				console.log('每页最大值变化：', max_num_per_page)
				this.list_params.limit = max_num_per_page
				this.initRoleList()
			},

			/**
			 * @description 当前页改变
			 */
			handleCurrentChange(data){
				console.log('当前页改变', data)
				this.list_params.page = data
				this.initRoleList()
			},

			filterNode(value, data) {
				if (!value) return true
				return data.menuName.indexOf(value) !== -1;
			},

			/**
			 * @description 提交修改后/新增后的表单
			 */
			async submitForm() {
				// 如果填写了角色名名字
				if(this.current_role_name.trim()){
					// 调用接口
					console.log('角色名：', this.current_role_name.trim())
					console.log('备注：', this.remarks_content.trim())
					console.log('获取权限数组：', this.$refs.authorityTree.getCheckedKeys())
					console.log('获取半选中权限数组：', this.$refs.authorityTree.getCheckedKeys())
					// 如果是新增角色
					if(this.current_model === 'add') {
						AUTH_ROLE_API.add_new_role({
							roleName: this.current_role_name.trim(),
							id: '',
							menuIdList: [...this.$refs.authorityTree.getCheckedKeys(),...this.$refs.authorityTree.getHalfCheckedKeys()],
							remark: this.remarks_content.trim()
						}).then(data => {
							if(data){
								this.$alert('新增角色成功', '提示', {
									confirmButtonText: '确定',
									callback: () => {
										// 再次调用接口
										this.list_params.page = 1
										this.initRoleList()
									}
								})
							}
						})
					} else {
						// 如果是编辑角色
						AUTH_ROLE_API.update_edit_role_data({
							roleName: this.current_role_name.trim(),
							id: this.current_role_id,
							menuIdList: [...this.$refs.authorityTree.getCheckedKeys(),...this.$refs.authorityTree.getHalfCheckedKeys()],
							remark: this.remarks_content.trim()
						}).then(data => {
							if(data){
								this.$alert('编辑角色成功', '提示', {
									confirmButtonText: '确定',
									callback: () => {
										// 再次调用接口
										this.list_params.page = 1
										this.initRoleList()
									}
								})
							}
						})
					}
				} else {
					this.$alert('请填写角色名！', '提示', {
						confirmButtonText: '确定'
					})
				}
			},

			/**
			 * @description 初始化角色列表
			 */
			async initRoleList() {
				// 每次初始化都要回到列表页
				this.current_model = 'index'
				// 初始化……
				this.roles_data = await AUTH_ROLE_API.get_role_list(this.list_params)
			},

			/**
			 * @description 初始权限列表
			 */
			async initFunAuthTree() {
				this.tree_data = await AUTH_ROLE_API.get_menu_resource_list()
			}
		}
	}
</script>

<style scoped lang="scss">
	div,
	section {
		box-sizing: border-box;
	}
	.roleManagePage {
		width: 1200px;
		margin-left: auto;
		margin-right: auto;
		box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		margin-top: 20px;
		// 角色列表页
		.listPart {
			.optionBoard {
				height: 48px;
				margin-left: 20px;
				display: flex;
				align-items: center;
				.roleKeyInput {
					width: 300px;
					border-radius: 4px;
					font-size: 12px;
					height: 28px;
				}
				.submitButton,
				.ctrlButton {
					margin-left: 12px;
					border: 1px solid #bbbec4;
					width: 80px;
					height: 28px;
					border-radius: 4px;
				}
				.ctrlButton {
					margin-left: 8px;
					background-color: #930cea;
					color: #ffffff;
					border: 0px;
				}
				.addButton {
					margin-left: 28px;
				}
			}
			.rolelist{
				.headerLine{
					background-color: #E0E6ED !important;
				}
			}
		}
		// 分页器
		.paginationFooter{
			padding-left:1%;
			margin-top:20px;
			display: flex;
			align-items: center;
			height: 44px;
		}
		// 编辑 || 新增模块
		.editPart{
			position: relative;
			.publicHeader{
				height:40px;
				line-height: 40px;
				padding-left:36px;
				background: #FAFAFA;
				border-bottom:1px solid #D4D4D4;
				font-size:16px;
				color:#1C2438;
			}
			.publicInputModel{
				margin-top:20px;
				.label{
					width:50px;
					display: inline-block;
					margin-right:40px;
					margin-left:36px;
					position: relative;
				}
				.necessaryStar{
					position: absolute;
					color: red;
					z-index: 1;
					left:-8px;
					top:1px;
				}
				.authorityLabel{
					margin-top:14px;
				}
				.roleNameInput{
					width: 526px;
				}
				.remarksTextarea{
					width: 526px;
					height:60px;
				}
			}
			.remarksModel, .authorityModel{
				display: flex;
			}
			.rightInputTreeContainer{
				width:526px;
				padding:8px;
				border-radius: 4px;
				border: 1px solid #DDDEE1;
				overflow: auto;
				.treeBox{
					margin-top:20px;
					height:40vh;
					overflow: auto;
				}
			}
			.submitAuthorityArea{
				position: fixed;
				z-index: 2;
				bottom:0;
				left:0;
				right:0;
				margin: auto;
				width:1200px;
				display: flex;
				height: 50px;
				align-items: center;
				box-shadow: 0px -3px 4px 0px #D3D3D3;
				background-color: #ffffff;
				.submitChangeButton, .goBackButton{
					text-align: center;
					font-size: 14px;
					color: #ffffff;
					width: 120px;
					height: 36px;
					line-height: 36px;
					background: #930CEA;
					border-radius: 4px;
					margin-left:20px;
					cursor:pointer;
				}
				.goBackButton{
					width: 80px;
					color: #000000;
					background: #FFFFFF;
					border: 1px solid #DDDEE1;
					margin-left:26px;
				}
			}
		}
	}
</style>
<!--特别的处理elementUI-->
<style lang="scss">
	#role_manage_page{
		.roleHeaderLine{
			th{
				background-color: #F8F8F9;
				color:#000000;
				width:33.33%
			}
		}
		.perTd{
			padding: 6px 0;
		}
	}
</style>
