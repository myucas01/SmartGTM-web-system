<template>
	<el-dialog title="异动门店筛选" :visible.sync="dialogVisible" width="450px" :append-to-body="true">
		<el-row type="flex">
			<el-col>
				<span class="col-title">区域</span>
			<!-- 	<el-select placeholder="请选择" v-model="formData.precinctNo" class="selectInput smart_select_deep" clearable>
					<el-option v-for="(item, index) in precinctData" :key="index" :value="item" :label="item.name" :disabled="item.disabled"></el-option>
				</el-select> -->
				<el-cascader
					v-model="formData.preDataList"
					:options="precinctData"
					@change="handleChange"></el-cascader>
			</el-col>
			<el-col>
				<span class="col-title">异动门店</span>
				<el-select placeholder="请选择" v-model="formData.changeTypeCode" class="selectInput smart_select_deep" clearable>
					<el-option v-for="(item, index) in changeTypeCodeList" :key="index" :value="item.code" :label="item.name"></el-option>
				</el-select>
			</el-col>
		</el-row>
		<el-row>
			<el-col>
				<span class="col-title">客户编码</span>
				<el-input placeholder="请输入" v-model="formData.storeNo" class="smart_input_deep" clearable></el-input>
			</el-col>
			<el-col>
				<span class="col-title">客户类型</span>
				<el-select placeholder="请选择" v-model="formData.storeTypeCode" class="selectInput smart_select_deep" clearable>
					<el-option v-for="(item, index) in storeTypeNameList" :key="index" :value="item.code" :label="item.codeName"></el-option>
				</el-select>
			</el-col>
		</el-row>
		<el-row>
			<el-col>
				<span class="col-title">客户名称</span>
				<el-input placeholder="请输入" v-model="formData.storeName" class="smart_input_deep" clearable></el-input>
			</el-col>
			<el-col>
				<span class="col-title">售点分级</span>
				<el-select placeholder="请选择" v-model="formData.storeScale" class="selectInput smart_select_deep" clearable>
					<el-option v-for="(item, index) in storeScaleList" :key="index" :value="item.tagId" :label="item.tagName"></el-option>
				</el-select>
			</el-col>
		</el-row>
		<el-row>
			<el-col>
				<span class="col-title">客户地址</span>
				<el-input placeholder="请输入" v-model="formData.storeAddress" class="smart_input_deep" clearable></el-input>
			</el-col>
			<el-col>
				<span class="col-title">拜访频次</span>
				<el-select placeholder="请输入" v-model="formData.visitRate" class="selectInput smart_select_deep" clearable>
					<el-option v-for="(item, index) in visitList" :key="index" :value="item.code" :label="item.name"></el-option>
				</el-select>
			</el-col>
		</el-row>
		<el-row>
			<el-col>
				<span class="col-title">在店时长</span>
				<el-input placeholder="请输入" v-model="formData.shopTime" class="smart_input_deep" clearable></el-input><span class="col-title">分钟/次</span>
			</el-col>
		</el-row>
		<span slot="footer" class="dialog-footer">
			<span @click="dialogVisible = false">取 消</span>
			<span type="primary" @click="searchUnusualStores()">保 存</span>
		</span>
	</el-dialog>
</template>

<script>
	import ROUTE_PLANNING_API from '@api/route/index'
	import { mapGetters } from 'vuex'
	const visitList = [
		{ code: '1', name: '一周一访'},
		{ code: '2', name: '一周二访'},
		{ code: '3', name: '一周三访'}
	]
	export default {
		name: 'screenForm',
		computed: {
		...mapGetters('routerPlanning', ['mapViewId', 'visitOrgId'])
		},
		data() {
			return {
				precinctData: [],
				changeTypeCodeList: [],
				storeTypeNameList: [],
				storeScaleList: [],
				visitList,
				dialogVisible: false,
				formData: {
					isPre: '',
					prePlanNo: '',
					precinctNo: '',
					changeTypeCode: '',
					storeNo: '',
					storeTypeCode: '',
					storeName: '',
					storeScale: '',
					storeAddress: '',
					shopTime: '',
					visitRate: ''
				}
			}
		},
		mounted() {
			this.formData.prePlanNo = this.mapViewId ? this.mapViewId : this.$route.query.planId
			this.formData.isPre = this.$route.query.planAhead === 'true' ? 0 : 1
			// 区域
			this.getRoutePosition()
			// 异动门店、客户类型、售点分级
			this.getTypeList()
		},
		methods: {
			handleChange(value) {
				this.formData.precinctNo = value[1]
			},
			searchUnusualStores() {
				this.dialogVisible = false
				this.$parent.getStoreList(this.formData)
			},
			getRoutePosition() {
				let _this = this
				ROUTE_PLANNING_API.get_route_position({
						isOpen: false,
						areaId: '',
						isPlan: this.$route.query.planAhead,
						programId: _this.mapViewId
					})
					.then(res => {
						console.log(res)
						res.data.forEach(item => {
							let precinct = {}
							precinct.value = item.jobId
							precinct.label = item.jobName
							precinct.children = []
							if (item.areaList) {
								if (item.areaList.length > 0) {
									item.areaList.forEach(areaItem => {
										let children = {}
										children.value = areaItem.areaId
										let labelName = areaItem.areaName
										if (areaItem.saleName) {
											labelName + '(' + areaItem.saleName + ')'
										}
										children.label = labelName
										precinct.children.push(children)
									})
								}
							}
							_this.precinctData.push(precinct)
						})
					})
					.catch(err => {
						console.log(err)
					})
			},
			getTypeList() {
				let _this = this
				let url1 = '/api/route/abnormal/getChangeType'
				_this.$fetch.get(url1).then((res) => {
					if (res.code == 200) {
						_this.changeTypeCodeList = res.data
						console.log(_this.changeTypeCodeList)
					}
				})
				let url2 = '/api/route/abnormal/getStoreType'
				_this.$fetch.get(url2, { prePlanNo: _this.mapViewId, isPre: this.formData.isPre }).then((res) => {
					if (res.code == 200) {
						res.data.forEach(item => {
							if (item) {
								_this.storeTypeNameList.push(item)
							}
						})
					}
				})
				let ur3 = '/api/route/abnormal/getScaleTag'
				_this.$fetch.get(ur3, { orgId: _this.visitOrgId }).then((res) => {
					if (res.code == 200) {
						_this.storeScaleList = res.data
						console.log(_this.storeScaleList)
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	::v-deep .el-dialog {
		background-color: #0A2757;

		.el-dialog__header {
			padding: 0;
			height: 34px;
			line-height: 34px;

			.el-dialog__title {
				color: #FFFFFF;
				font-size: 14px;
				padding-left: 10px;
				background-color: #0A2757;
			}

			.el-dialog__headerbtn {
				top: 0;
			}
		}

		.el-dialog__body {
			padding: 4px 0px;
		}

		.el-dialog__footer {
			padding: 10px;

			.dialog-footer {
				width: 100%;

				span {
					font-size: 12px;
					color: #FFFFFF;
					width: 83px;
					height: 24px;
					line-height: 24px;
					display: inline-block;
					text-align: center;
					cursor: pointer;

					&:last-child {
						background-color: #930CEA;
						border-radius: 4px;
					}
				}
			}
		}
	}

	::v-deep .el-row {
		display: flex;
		background-color: #133773;
		padding: 10px 15px;
		.el-col {
			color: #FFFFFF;
			font-size: 13px;
			.col-title {
				padding-right: 5px;
			}
			&:first-child {
				.col-title {
					display: inline-block;
					width: 60px;
					text-align: right;
				}
			}
			.el-input {
				width: 130px;
			}
			.el-input__inner {
				height: 24px;
				color: #FFFFFF;
				border-color: #8199a4;
				background-color: #133773;
			}
			.el-input__icon {
				line-height: 24px;
			}
			.el-cascader {
				line-height: 24px;
			}
		}
	}
</style>
