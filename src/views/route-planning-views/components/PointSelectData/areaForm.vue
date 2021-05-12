<template>
	<el-dialog title="批量修改" :visible.sync="dialogVisible" width="438px" :before-close="handleClose" :append-to-body="true">
		<el-row>
			<el-col>*所属岗位、区域：</el-col>
			<el-col>
			<!-- 	<el-select v-model="formData.precinctNo" placeholder="请选择" class="selectInput smart_select_deep">
					<el-option v-for="(item, index) in precinctData" :key="index" :value="item.code" :label="item.name" :disabled="item.disabled"></el-option>
				</el-select> -->
				<el-cascader
					v-model="formData.preDataList"
					:options="precinctData"
					@change="handleChange"></el-cascader>
			</el-col>
		</el-row>
		<el-row>
			<el-col>*拜访频次：</el-col>
			<el-col>
				<el-select v-model="formData.times" class="selectInput smart_select_deep" @change="timeChange">
					<el-option v-for="(item, index) in visitList" :key="index" :value="item.code" :label="item.name"></el-option>
				</el-select>
				<!-- <el-input v-model="formData.visitWeek" placeholder="请输入" style="width: 80px;" class="smart_input_deep"></el-input>
				<span style="display: inline-block; width: 30px; text-align: center;">周</span> -->
				<!-- <el-input v-model="formData.times" placeholder="请输入" style="width: 140px;" class="smart_input_deep"></el-input>
				<span style="display: inline-block; width: 30px; text-align: center;">次</span> -->
			</el-col>
		</el-row>
		<el-row>
			<el-col>*所属服务日：</el-col>
			<el-col>
				<el-select v-model="formData.visitWeekDayList" placeholder="请选择" class="selectInput smart_select_deep" :multiple="multiple"
            :multiple-limit="Number(formData.times)">
					<el-option v-for="(item, index) in serviceDay" :key="index" :value="item.code" :label="item.name"></el-option>
				</el-select>
			</el-col>
		</el-row>
		<el-row>
			<el-col>在店时长：</el-col>
			<el-col>
				<el-input v-model="formData.shopTime" placeholder="请输入" style="width: 140px;" class="smart_input_deep"></el-input>
				<span style="display: inline-block; width: 60px; text-align: center;">分钟/次</span>
			</el-col>
		</el-row>
		<el-row>
			<el-col>*拜访周: </el-col>
			<el-col>
				<el-select v-model="formData.visitWeekList" placeholder="请选择" class="selectInput smart_select_deep" multiple>
					<el-option v-for="(item, index) in visitDay" :key="index" :value="item.code" :label="item.name"></el-option>
				</el-select>
			</el-col>
		</el-row>
		<span slot="footer" class="dialog-footer">
			<span @click="cancleWindow">取 消</span>
			<span type="primary" @click="submitArea()">保 存</span>
		</span>
	</el-dialog>
</template>

<script>
	import ROUTE_PLANNING_API from '@api/route/index'
	import {eventBus} from '@/util/eventBut.js'
	import {
		mapGetters
	} from 'vuex'
	const visitList = [{
			code: '1',
			name: '一周一访'
		},
		{
			code: '2',
			name: '一周二访'
		},
		{
			code: '3',
			name: '一周三访'
		}
	]
	const serviceDay = [{
		code: '1',
		name: '周一'
	}, {
		code: '2',
		name: '周二'
	}, {
		code: '3',
		name: '周三'
	}, {
		code: '4',
		name: '周四'
	}, {
		code: '5',
		name: '周五'
	}, {
		code: '6',
		name: '周六'
	}, {
		code: '7',
		name: '周日'
	}]
	const visitDay = [{
		code: '1',
		name: '第一周'
	}, {
		code: '2',
		name: '第二周'
	}, {
		code: '3',
		name: '第三周'
	}, {
		code: '4',
		name: '第四周'
	}]
	export default {
		props: ['pointData'],
		computed: {
			...mapGetters('routerPlanning', ['draftId', 'mapViewId'])
		},
		data() {
			return {
				visitList,
				serviceDay,
				visitDay,
				multiple: false,
				precinctData: [],
				dialogVisible: false,
				treeData: [],
				formData: {
					preDataList: [],
					prePlanNo: '',
					routeNo: '',
					precinctNo: '',
					visitWeekList: ['1', '2', '3', '4'],
					visitWeekDayList: '',
					times: '',
					storeList: [],
					shopTime: ''
				}
			}
		},
		watch: {
			pointData(pointData) {
				pointData.forEach(item => {
					this.formData.routeNo = item.routeId
					this.formData.storeList.push(item.storeId)
				})
			}
		},
		mounted() {
			this.getRoutePosition()
		},
		methods: {
			handleChange(value) {
				this.formData.precinctNo = value[1]
			},
			cancleWindow(){
				// 取消初始化所有值
				this.dialogVisible = false
				this.formData = {
					preDataList: [],
					prePlanNo: '',
					routeNo: '',
					precinctNo: '',
					visitWeekList: ['1', '2', '3', '4'],
					visitWeekDayList: '',
					times: '',
					storeList: [],
					shopTime: ''
				}
			},
			timeChange(val) {
				let _this = this
				if (val == '1') {
					_this.formData.visitWeekDayList = ''
					_this.$set(_this, 'multiple', false)
				} else {
					_this.formData.visitWeekDayList = []
					_this.$set(_this, 'multiple', true)
				}
			},
			submitArea() {
				if (Number(this.formData.times) !== this.formData.visitWeekDayList.length) {
				this.$message({ message: '请选择完整的所属服务日', type: 'warning' })
				return
				}
				let _this = this
				let url = '/api/route/batch/update/point'
				this.formData.prePlanNo = _this.mapViewId ? _this.mapViewId : _this.$route.query.planId
				this.formData.visitWeek = this.formData.visitWeekList.toString()
				this.formData.visitWeekDay = this.formData.visitWeekDayList.toString()
				_this.$fetch.post(url, this.formData).then(res => {
					if (res.code == 200) {
						_this.$message({
							message: res.message,
							type: 'success'
						})
						this.dialogVisible = false
						this.$parent.changeVIew()
						eventBus.$emit('handle-node-click','调整点位所属区域')
					}
					if(res.code == 504) {
            // 线路已被其他账号生成 需重新更新
            location. reload()
          }
				})
			},
			handleClose(done) {
				done()
			},
			getRoutePosition() {
				let _this = this
				ROUTE_PLANNING_API.get_route_position({
						isOpen: false,
						isPlan: false,
						areaId: '',
						programId:  _this.mapViewId ? _this.mapViewId : _this.$route.query.planId
					})
					.then(res => {
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
											labelName = labelName + '(' + areaItem.saleName + ')'
										}
										children.label = labelName
										precinct.children.push(children)
									})
								}
							}
							_this.precinctData.push(precinct)
						})
						// console.log(res)
					})
					.catch(err => {
						console.log(err)
					})
			}
		}
	}
</script>

<style scoped lang="scss">
	::v-deep .el-dialog {
		background-color: #0a2757;

		.el-dialog__header {
			padding: 0;
			height: 34px;
			line-height: 34px;

			.el-dialog__title {
				color: #ffffff;
				font-size: 14px;
				padding-left: 10px;
				background-color: #0a2757;
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
					color: #ffffff;
					width: 83px;
					height: 24px;
					line-height: 24px;
					display: inline-block;
					text-align: center;
					cursor: pointer;

					&:last-child {
						background-color: #930cea;
						border-radius: 4px;
					}
				}
			}
		}
	}

	::v-deep .el-row {
		display: flex;
		background-color: #133773;

		&:first-child {
			padding-top: 18px;
		}

		&:last-child {
			padding-bottom: 18px;
		}

		.el-col {
			color: #ffffff;
			font-size: 13px;
			padding: 5px 0px;

			&:first-child {
				width: 200px;
				text-align: right;
				margin-right: 5px;
			}

			.el-input__inner {
				height: 24px;
				border-color: #8199a4;
				color: #FFFFFF;
				background: #102f63;
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
