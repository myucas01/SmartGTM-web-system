<template>
	<div class="dev_m">
		<div class="f">
			<el-button icon="el-icon-arrow-left" @click="back">返回<br /></el-button>
		</div>
		<div class="r">
			<div class="step">
				<steps ref="steps"></steps>
			</div>
			<div class="form">
				<addStore ref="addStoreModule"></addStore>
				<screenStore ref="screenStoreModule"></screenStore>
				<storeLimit ref="storeLimit"></storeLimit>
				<storeNameDes ref="storeNameDesModule"></storeNameDes>
			</div>
		</div>
		<div class="b" v-if="storeStep == 0">
			<el-button @click="nextScreen" :disabled="screenDisabled" type="primary">下一步</el-button>
		</div>
		<div class="b" v-if="storeStep == 1">
			<el-button @click="goStore">上一步</el-button>
			<el-button type="primary" @click="goLimit">下一步</el-button>
		</div>
		<div class="b" v-if="storeStep == 2">
			<el-button @click="goScreen">上一步</el-button>
			<el-button type="primary" @click="goNameDes" :disabled="limitDisabled">下一步</el-button>
		</div>
		<div class="b" v-if="storeStep == 3">
			<el-button @click="backLimit">上一步</el-button>
			<el-button type="primary" @click="createStore2">创建商机门店</el-button>
		</div>
	</div>
</template>

<script>
	import steps from "./components/storeSteps.vue"
	import addStore from "./components/addNewStore.vue"
	import screenStore from "./components/screenStore.vue"
	import storeLimit from "./components/storeLimit.vue"
	import storeNameDes from "./components/storeNameDesDev.vue"
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'StoreAutonomyDev',
		computed: {
			...mapGetters('businessExpansionModule', [
				'storeStep'
			])
		},
		components: {
			steps,
			addStore,
			screenStore,
			storeLimit,
			storeNameDes
		},
		data() {
			return {
				screenDisabled: true,
				limitDisabled: true,
				imgSrc: require('../../assets/img/undraw_loading_frh4.png'),
			}
		},
		watch: {
			storeStep(val) {
				setTimeout(() => {
					switch (val) {
						case 0:
							this.$refs.steps.flexBasis1.flexBasis = this.$refs.addStoreModule.$el.offsetHeight + 15 + 'px'
							this.$refs.steps.flexBasis2.flexBasis = '0px'
							this.$refs.steps.flexBasis3.flexBasis = '0px'
							break;
						case 1:
							this.$refs.steps.flexBasis1.flexBasis = this.$refs.addStoreModule.$el.offsetHeight + 15 + 'px'
							this.$refs.steps.flexBasis2.flexBasis = this.$refs.screenStoreModule.$el.offsetHeight + 15 + 'px'
							this.$refs.steps.flexBasis3.flexBasis = '0px'
							break;
						case 2:
							this.$refs.steps.flexBasis1.flexBasis = this.$refs.addStoreModule.$el.offsetHeight + 15 + 'px'
							this.$refs.steps.flexBasis2.flexBasis = this.$refs.screenStoreModule.$el.offsetHeight + 15 + 'px'
							this.$refs.steps.flexBasis3.flexBasis = this.$refs.storeLimit.$el.offsetHeight + 15 + 'px'
							this.$refs.steps.flexBasis4.flexBasis = this.$refs.storeNameDesModule.$el.offsetHeight + 15 + 'px'
							break;
					}
				}, 300)
			}
		},
		created() {
			this.$store.dispatch('businessExpansionModule/setStoreStep', 0)
		},
		mounted() {
			this.$refs.steps.flexBasis1.flexBasis = this.$refs.addStoreModule.$el.offsetHeight + 15 + 'px'
		},
		// beforeRouteEnter(to,from,next) {
		// next(vm => {
		// vm.$store.commit('addTabs', {
		// title: '门店-自主拓展',
		// link: '/business-expansion/store-autonomy-dev',
		// on: true,
		// needCatch: true
		// })
		// })
		// },
		methods: {
			back() {
				this.$router.go(-1)
			},
			nextScreen() {
				this.$refs.screenStoreModule.storeList = []
				this.$refs.screenStoreModule.status1 = {
					show: 0,
					code: 1,
					height: '0px',
					borderLeft: '0px',
					paddingLeft: '0px',
					marginLeft: '0px'
				}
				this.$store.dispatch('businessExpansionModule/setStoreStep', 1)
			},
			goStore() {
				this.$store.dispatch('businessExpansionModule/setStoreStep', 0)
			},
			goLimit() {
				if (this.$refs.screenStoreModule.storeList.length == 0) {
					this.$message.error('请选择筛选条件')
					return
				}
				for (var i = 0; i < this.$refs.screenStoreModule.storeList.length; i++) {
					let item = this.$refs.screenStoreModule.storeList[i]
					if (item.list.length == 0) {
						if (item.key == '' || item.valuesList.length == 0) {
							this.$message.error('请补充完成筛选条件')
							return
						}
					} else {
						for (var s = 0; s < item.list.length; s++) {
							let items = item.list[s]
							if (items.list.length == 0) {
								if (items.key == '' || items.valuesList.length == 0) {
									this.$message.error('请补充完成筛选条件')
									return
								}
							} else {
								for (var t = 0; t < items.list.length; t++) {
									let itemt = items.list[t]
									if (itemt.list.length == 0) {
										if (itemt.key == '' || itemt.valuesList.length == 0) {
											this.$message.error('请补充完成筛选条件')
											return
										}
									}
								}
							}
						}
					}
				}
				this.$store.dispatch('businessExpansionModule/setStoreStep', 2)
				this.$refs.storeLimit.limit = true
				this.$refs.storeLimit.number = '5000'
			},
			goScreen() {
				this.$store.dispatch('businessExpansionModule/setStoreStep', 1)
			},
			backLimit() {
				this.$store.dispatch('businessExpansionModule/setStoreStep', 2)
			},
			goNameDes() {
				this.$store.dispatch('businessExpansionModule/setStoreStep', 3)
			},
			getNewValues2(storeList) {
				let _this = this
				for (var i = 0; i < storeList.list.length; i++) {
					_this.getNewValues1(storeList.list[i])
				}
			},
			getNewValues1(storeList) {
				let params = []
				for (var i = 0; i < storeList.valuesList.length; i++) {
					let values = {
						code: storeList.valuesList[i].length == 1 ? storeList.valuesList[i][0] : storeList.valuesList[i][1]
					}
					params.push(values)
				}
				storeList.values = params
			},
			createStore2() {
				let _this = this
				if (_this.$refs.storeNameDesModule.store.storesName == '') {
					_this.$message.error('请输入商机门店名称')
					return
				}
				_this.$confirm('此操作将开始创建商机门店，之后无法修改GAIA商机门店筛选条件，是否继续？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '上一步'
				}).then(() => {
					let storeData1 = _this.$refs.addStoreModule.store
					let storeCondition = _this.$refs.screenStoreModule.storeList
					let store = _this.$refs.storeNameDesModule.store
					let limitNum = _this.$refs.storeLimit.limit ? _this.$refs.storeLimit.number : null

					for (var d = 0; d < storeCondition.length; d++) {
						_this.getNewValues1(storeCondition[d])
						for (var t = 0; t < storeCondition[d].list.length; t++) {
							_this.getNewValues1(storeCondition[d].list[t])
							_this.getNewValues2(storeCondition[d].list[t])
						}
					}
					let params = {
						seedStoresId: storeData1.storeId,
						storeCondition: storeCondition,
						storesName: store.storesName,
						storesDescribe: store.storesDescribe
					}
					if (limitNum) {
						params.businessStoreNum = limitNum
					}
					console.log(params)
					let url = '/api/expand/business/createBusinessStores'
					_this.$fetch.post(url, params).then(res => {
						if (res.code == 200) {
							_this.$alert(
								'<div style="text-align: center;"><div style="color: #19BE6B;font-size: 13px;font-weight: 600; margin-bottom: 13px;">创建成功</div><div><img src="' +
								_this.imgSrc + '" /></div><div style="margin-top: 20px;">预计还需要一天计算完成...</div></div>', '计算中', {
									dangerouslyUseHTMLString: true,
									confirmButtonText: '店群详情',
									callback: action => {
										if (action == 'confirm') {
											_this.$router.push({
												path: '/business-expansion/store-community-list'
											})
										}
									}
								});
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dev_m {
		width: 100%;
		padding: 20px 15px;
		background-color: #F8F8F9FF;
		height: 100%;

		.f {
			position: absolute;
			left: 10px;

			.el-button {
				width: 80px;
				height: 32px;
				line-height: 32px;
				padding: 0;
				font-size: 12px;
			}
		}

		.r {
			display: flex;
			margin: auto;
			width: 900px;
			overflow: auto;
			height: calc(100% - 100px);
		}

		.b {
			text-align: center;
			padding: 10px;

			.el-button {
				width: 120px;
				height: 32px;
				line-height: 32px;
				padding: 0;
				font-size: 12px;
			}
		}

		.step {
			width: 35px;
		}

		.form {
			height: 100%;
			position: relative;

			.item {
				margin-bottom: 15px;
				padding: 10px;
				width: 750px;
				background: #FFFFFF;
				box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.1);
				border-radius: 2px;
			}

			/**el-input**/
			::v-deep .el-input__inner {
				height: 32px;
				line-height: 32px;
			}

			::v-deep .el-input__suffix {
				height: 32px;
				line-height: 32px;
			}

			/**el-input**/
		}
	}
</style>
