<template>
	<div class="dev_m">
		<div class="f"><el-button icon="el-icon-arrow-left" @click="back">返回<br/></el-button></div>
		<div class="r">
			<div class="step">
				<steps ref="steps"></steps>
			</div>
			<div class="form">
				<addStore ref="addStoreModule"></addStore>
				<expandScale ref="expandScaleModule"></expandScale>
				<storeNameDes ref="storeNameDesModule"></storeNameDes>
				<specificWeight ref="specificWeightModule"></specificWeight>
			</div>
		</div>
		<div class="b" v-if="storeStep == 0">
			<el-button @click="next(1)" :disabled="screenDisabled">下一步</el-button>
		</div>
		<div class="b" v-if="storeStep == 1">
			<el-button @click="next(0)">上一步</el-button>
			<el-button type="primary" @click="next(2)" :disabled="limitDisabled">下一步</el-button>
		</div>
		<div class="b" v-if="storeStep == 2">
			<el-button @click="next(1)">上一步</el-button>
			<el-button type="primary" @click="next(3)" :disabled="screenNameDesDisabled">下一步</el-button>
		</div>
		<div class="b" v-if="storeStep == 3">
			<el-button @click="next(2)">上一步</el-button>
			<el-button type="primary" @click="createStore2">创建商机门店</el-button>
		</div>
	</div>
</template>

<script>
	import steps from "./components/storeSteps.vue"
	import addStore from "./components/addNewStore.vue"
	import expandScale from "./components/expandScale.vue"
	import storeNameDes from "./components/storeNameDesAi.vue"
	import specificWeight from "./components/specificWeight.vue"
	import { mapGetters } from 'vuex'
	export default {
		name: 'StoreAutonomyAi',
		computed: {
			...mapGetters('businessExpansionModule', [
				'storeStep'
			])
		},
		components: {
			steps,
			addStore,
			expandScale,
			storeNameDes,
			specificWeight
		},
		data() {
			return {
				limitDisabled: true,
				screenDisabled: true,
				screenNameDesDisabled: true,
				imgSrc: require('../../assets/img/undraw_loading_frh4.png')
			}
		},
		watch: {
			storeStep(val) {
				setTimeout(() => {
					switch(val) {
						case 0:
							this.$refs.steps.flexBasis1.flexBasis = this.$refs.addStoreModule.$el.offsetHeight + 15 + 'px'
							this.$refs.steps.flexBasis2.flexBasis = '0px'
							this.$refs.steps.flexBasis3.flexBasis = '0px'
						break;
						case 1:
							this.$refs.steps.flexBasis1.flexBasis = this.$refs.addStoreModule.$el.offsetHeight + 15 + 'px'
							this.$refs.steps.flexBasis2.flexBasis = this.$refs.expandScaleModule.$el.offsetHeight + 15 + 'px'
							this.$refs.steps.flexBasis3.flexBasis =  '0px'
						break;
						case 2:
							this.$refs.steps.flexBasis1.flexBasis = this.$refs.addStoreModule.$el.offsetHeight + 15 + 'px'
							this.$refs.steps.flexBasis2.flexBasis = this.$refs.expandScaleModule.$el.offsetHeight + 15 + 'px'
							this.$refs.steps.flexBasis3.flexBasis = this.$refs.storeNameDesModule.$el.offsetHeight + 15 + 'px'
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
		methods: {
			back() {
				this.$router.go(-1)
			},
			next(val) {
				if (val == 1) {
					if (this.$refs.addStoreModule.store.storeId) {
						this.getExpandScale()
					} else {
						console.log('种子门店选择有误!无storeId')
					}
				}
				this.$store.dispatch('businessExpansionModule/setStoreStep', val)
			},
			getExpandScale() {
				let url = '/api/expand/business/getMagnitudeList'
				this.$fetch.get(url, {storesId: this.$refs.addStoreModule.store.storeId}).then(res => {
					if (res.code == 200) {
						this.$refs.expandScaleModule.expandlist = res.data
						this.$refs.expandScaleModule.getScale()
					}
				})
			},
			createStore2() {
				this.$confirm('此操作将开始创建商机门店，之后无法修改GAIA商机门店筛选条件，是否继续？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '上一步'
				}).then(() => {
					let limitNum = this.$refs.expandScaleModule.limit ? this.$refs.expandScaleModule.number : null
					let params = {
						seedStoresId: this.$refs.addStoreModule.store.storeId,
						acqDegree: this.$refs.expandScaleModule.scaleNum,
						acqStoreNum: this.$refs.expandScaleModule.scaleData,
						storesName: this.$refs.storeNameDesModule.store.storesName,
						storesDescribe: this.$refs.storeNameDesModule.store.storesDescribe,
						features: this.$refs.specificWeightModule.specific
					}
					if (limitNum) {
						params.businessStoreNum = limitNum
					}
					params.features.forEach(item => {
						item.storesId = params.seedStoresId
					})
					console.log(params)
					let url = '/api/expand/business/createBusinessStores'
					this.$fetch.post(url, params).then(res => {
						if (res.code == 200) {
							this.$alert('<div style="text-align: center;"><div style="color: #19BE6B;font-size: 13px;font-weight: 600; margin-bottom: 13px;">创建成功</div><div><img src="' + this.imgSrc +  '" /></div><div style="margin-top: 20px;">预计还需要一天计算完成...</div></div>', '计算中', {
								dangerouslyUseHTMLString: true,
								confirmButtonText: '店群详情',
								callback: action => {
									if (action == 'confirm') {
										this.$router.push({
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
			width: 850px;
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
				padding: 10px 15px;
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
		}
	}
</style>
