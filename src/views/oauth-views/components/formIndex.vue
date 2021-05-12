<template>
	<div class="form-index">
		<div class="form-info">
			<div class="field">
				<p class="t1">KPI数据报表查询设置</p>
				<p class="t2">可通过配置查询条件，对数据进行查询，查询结果可作为报表下载</p>
			</div>
			<div class="form">
				<div class="o">
					<em>*</em><span>时间 :</span>
					<el-date-picker
						v-model="date"
						type="monthrange"
						value-format="yyyy-MM"
						range-separator="和"
						start-placeholder="开始月份"
						end-placeholder="结束月份">
					</el-date-picker>
				</div>
				<div class="o" ref="showTreeDialog">
					<em>*</em><span>组织 :</span>
					<el-button plain icon="el-icon-search" @click="showTree = true">按组织架构查看</el-button>
				</div>
				<div class="i">
					<el-tag v-for="(itemo, indexo) in orgCheckData" :key="indexo" closable @close="handleTagClose(itemo)">{{ itemo.name }}</el-tag>
				</div>
				<div class="o" ref="showNumDialog">
					<em>*</em><span>指标 :</span>
					<el-button plain icon="el-icon-search" @click="showNum = true">报表指标设置</el-button>
				</div>
				<div class="i">
					<el-tag v-for="(itemt, indext) in targetCheckData" :key="indext" closable @close="handleTag2Close(itemt)">{{ itemt.targetName }}</el-tag>
				</div>
			</div>
		</div>
		<div class="button">
			<slot></slot>
		</div>
		<div class="org-tree" v-show="showTree" :style="{'top': orgTreeDialogTop + 'px'}">
			<div class="t">组织选择</div>
			<el-input placeholder="输入关键字进行过滤" v-model="orgName" clearable></el-input>
			<el-tree ref="orgTree" :data="orgData" node-key="id" :props="defaultProps" show-checkbox :filter-node-method="filterNode"></el-tree>
			<div class="b">
				<el-button @click="showTree = false">取消</el-button>
				<el-button type="primary" @click="showOrgData">确认</el-button>
			</div>
		</div>
		<div class="num-tree" v-show="showNum" :style="{'top': targetDialogTop + 'px'}">
			<div class="t1">指标配置</div>
			<div class="t2">
				通过勾选，可对下载报表中的指标字段进行配置组合
			</div>
			<el-input placeholder="输入查询关键字" v-model="targetName" suffix-icon="el-icon-search"></el-input>
			<div class="m">
				<el-checkbox v-if="targetData.length > 0" v-model="targetAllCheck">全选</el-checkbox>
				<el-checkbox v-for="(item, index) in targetData" :key="index" v-model="item.checked">{{ item.targetName }}</el-checkbox>
			</div>
			<div class="b">
				<el-button @click="showNum = false">取消</el-button>
				<el-button type="primary" @click="showNumData">确认</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'formIndex',
		data() {
			return {
				showTree: false,
				showNum: false,
				date: '',
				orgName: '',
				orgData: [],
				orgCheckData: [],
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				orgTreeDialogTop: 0,
				targetAllCheck: false,
				targetName: '',
				allTargetData: [],
				targetData: [],
				targetCheckData: [],
				targetDialogTop: 0
			}
		},
		// type == 1 首页form， type == 2 表头form
		props: ['type'],
		watch: {
			orgName(val) {
				this.$refs.orgTree.filter(val)
			},
			targetName(val) {
				if (val) {
					this.targetData = this.targetData.filter(function(e) {
						return e.targetName.indexOf(val) > -1
					})
				} else {
					this.setAllTarget()
				}
			},
			showTree(val) {
				// 组织树弹窗的定位：type == 1 首页form， type == 2 表头form
				this.orgTreeDialogTop = this.$refs.showTreeDialog.getBoundingClientRect().top
				this.orgTreeDialogTop = this.type == 1 ? this.orgTreeDialogTop - 22 : this.orgTreeDialogTop - 64
				if (val) {
					this.showNum = false
				}
			},
			targetAllCheck(val) {
				this.targetChange(val)
			},
			showNum() {
				// 设置指标配置弹窗的定位： type == 1 首页form， type == 2 表头form
				this.targetDialogTop = this.$refs.showNumDialog.getBoundingClientRect().top
				this.targetDialogTop = this.type == 1 ? this.targetDialogTop - 22 : this.targetDialogTop - 64
			}
		},
		created() {
			this.getOrgData()
			this.getTargetData()
		},
		methods: {
			// 组织树的动态查询
			filterNode(value, data) {
				if (!value) return true;
				return data.name.indexOf(value) !== -1;
			},
			// 获取当前用户权限下组织数据
			getOrgData() {
				let url = '/api/bn/store/position/getOrgListAuthority'
				this.$fetch.get(url).then((res) => {
					this.orgData = res.data
				})
			},
			// 组织-确认方法
			showOrgData() {
				this.orgCheckData = []
				let data = this.$refs.orgTree.getCheckedNodes()
				for (var i = 0; i < data.length; i ++) {
					this.orgCheckData.push(data[i])
				}
				this.showTree = false
			},
			// 组织数据的x事件
			handleTagClose(data) {
				this.$refs.orgTree.setChecked(data, false)
				this.showOrgData()
			},
			// 指标数据的x事件
			handleTag2Close(data) {
				data.checked = false
				this.showNumData()
			},
			// 获取指标数据列表
			async getTargetData() {
				let url = '/api/kpi/report/metrics'
				await this.$fetch.get(url).then((res) => {
					if (res.code == 200) {
						this.allTargetData = res.data
						for (var i = 0; i < this.allTargetData.length; i ++) {
							this.$set(this.allTargetData[i], 'checked', false)
						}
						this.setAllTarget()
					}
				})
			},
			// 设置指标所有数据
			setAllTarget() {
				this.targetData = this.allTargetData
			},
			// 指标配置“全选”事件
			targetChange(data) {
				for (var i = 0; i < this.targetData.length; i ++) {
					this.targetData[i].checked = data
				}
				this.targetAllCheck = data
			},
			// 指标配置“确认”事件
			showNumData() {
				this.targetCheckData = []
				for (var i = 0; i < this.allTargetData.length; i ++) {
					if (this.allTargetData[i].checked) {
						this.targetCheckData.push(this.allTargetData[i])
					}
				}
				if (this.targetCheckData.length == 0) {
					this.targetAllCheck = false
				}
				this.showNum = false
			},
			setFormData() {
				this.date = ''
				this.orgName = ''
				this.orgCheckData = []
				this.targetName = ''
				this.targetCheckData = []
				this.setAllTarget()
				this.targetChange(false)
				this.getOrgData()
			}
		}
	}
</script>

<style scoped lang="scss">
	.form-index {
		background-color: #FFFFFF;
		position: relative;
		width: 700px;
		.form-info {
			padding-bottom: 30px;
			max-height: 500px;
			overflow: auto;
			position: relative;
			.field {
				padding: 15px;
				.t1 {
					font-weight: 600;
					font-size: 16px;
				}
				.t2 {
					margin-top: 5px;
					font-size: 15px;
					color: #c1c0c0;
				}
			}
			.form {
				padding: 0px 15px;
				.o {
					position: relative;
					margin-top: 30px;
					em {
						color: red;
						font-size: 15px;
						margin-right: 10px;
						position: absolute;
						top: 14px;
					}
					span {
						display: inline-block;
						width: 50px;
						font-size: 13px;
						font-weight: 600;
						margin-left: 15px;
					}
					.el-button {
						width: 160px;
					}
				}
				.i {
					// margin-bottom: 15px;
					// margin-top: 15px;
					margin-left: 62px;
					font-size: 15px;
					width: 450px;
					// max-height: 100px;
					// overflow: auto;
					.el-tag {
						margin: 3px;
						padding: 0px 5px;
						height: 28px;
						line-height: 28px;
					}
				}
			}
		}
		.button {
			padding: 5px 0px;
			width: 100%;
			margin-top: 50px;
			text-align: center;
			// bottom: 0px;
			// position: absolute;
			background-color: #FFFFFF;
			.el-button {
				margin-right: 50px;
			}
		}
		.org-tree {
			z-index: 10;
			position: absolute;
			width: 400px;
			// top: 216px;
			left: 80px;
			padding: 10px;
			border: 1px solid #DCDFE6;
			background-color: #FFFFFF;
			border-radius: 4px;
			.t {
				font-size: 12px;
				font-weight: 600;
				margin-bottom: 10px;
			}
			.el-input {
				width: 390px;
			}
			.el-tree {
				width: 386px;
				border: 1px solid #cccccc;
				border-radius: 4px;
			}
			::v-deep .el-input__inner {
				height: 32px;
				line-height: 32px;
			}
			::v-deep .el-input__icon {
				line-height: 32px;
			}
			.el-tree {
				height: 200px;
				overflow: auto;
			}
			.b {
				margin-top: 10px;
				padding-right: 10px;
				text-align: right;
				.el-button {
					padding: 8px;
					font-size: 11px;
				}
			}
		}
		.num-tree {
			z-index: 5;
			position: absolute;
			width: 400px;
			left: 80px;
			padding: 10px;
			border: 1px solid #DCDFE6;
			background-color: #FFFFFF;
			border-radius: 4px;
			.t1 {
				font-weight: 600;
				font-size: 13px;
			}
			.t2 {
				font-size: 11px;
				color: #c1c0c0;
				margin-bottom: 10px;
			}
			.el-input {
				width: 390px;
			}
			::v-deep .el-input__inner {
				height: 32px;
				line-height: 32px;
			}
			::v-deep .el-input__icon {
				line-height: 32px;
			}
			.m {
				width: 366px;
				border: 1px solid #cccccc;
				border-radius: 4px;
				padding: 10px;
				height: 100px;
				overflow: auto;
				.el-checkbox {
					display: block;
				}
				::v-deep .el-checkbox__label {
					font-size: 12px;
				}
			}
			.b {
				margin-top: 10px;
				padding-right: 10px;
				text-align: right;
				.el-button {
					padding: 8px;
					font-size: 11px;
				}
			}
		}
	}
</style>
