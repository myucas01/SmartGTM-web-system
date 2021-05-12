<template>
	<div class="sp2" v-if="storeStep >= 1">
		<div class="show">
			<div class="t">
				拓展量级
				<el-tooltip placement="top">
					<div slot="content">您可以在创建过程中选择相似（或类似）的阈值。阈值越大，与种子门店的匹配度越高。虽然选择较小的阈值会增加潜在覆盖门店，但会降低商机门店与种子门店之间的相似度</div>
					<span class="question">
						<svg t="1585551311735" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5000"
						width="16" height="16">
							<path d="M512 113.406976c-219.789312 0-398.601216 178.816-398.601216 398.61248 0 219.773952 178.811904 398.573568 398.601216 398.573568s398.601216-178.799616 398.601216-398.573568C910.601216 292.224 731.789312 113.406976 512 113.406976zM552.2176 803.094528l-80.04608 0 0-80.04608 80.04608 0L552.2176 803.094528zM679.120896 446.205952c-11.713536 21.086208-34.623488 46.728192-68.722688 76.92288-22.908928 20.303872-37.874688 35.275776-44.904448 44.904448-7.027712 9.632768-12.237824 20.694016-15.618048 33.188864-3.386368 12.494848-5.339136 32.799744-5.85728 60.913664L476.4672 662.135808c-0.262144-9.371648-0.390144-16.400384-0.390144-21.086208 0-27.588608 3.904512-51.406848 11.713536-71.455744 5.723136-15.09376 14.96576-30.321664 27.722752-45.683712 9.371648-11.190272 26.222592-27.529216 50.566144-49.00352 24.337408-21.476352 40.15104-38.590464 47.44192-51.347456 7.284736-12.750848 10.933248-26.68032 10.933248-41.780224 0-27.332608-10.677248-51.347456-32.018432-72.042496-21.348352-20.69504-47.509504-31.041536-78.485504-31.041536-29.937664 0-54.928384 9.370624-74.970112 28.11392-20.047872 18.742272-33.188864 48.026624-39.437312 87.855104l-72.237056-8.590336c6.504448-53.359616 25.832448-94.230528 57.985024-122.606592 32.146432-28.36992 74.641408-42.560512 127.488-42.560512 55.964672 0 100.606976 15.227904 133.931008 45.683712 33.317888 30.456832 49.980416 67.295232 49.980416 110.502912C696.691712 402.082816 690.835456 425.120768 679.120896 446.205952z"
							fill="#d4d4d4" p-id="5001"></path>
						</svg>
					</span>
				</el-tooltip>
			</div>
			<div class="i">
				<div class="tip">相似度阈值</div>
				<div class="num">
					<el-slider v-model="scaleNum" :marks="marks" :max="100" :min="50" :step="5" :format-tooltip="formatTooltip"></el-slider>
					<span class="store">预计能达到<span class="streoNum">{{ scaleData }}</span>门店数</span>
				</div>
			</div>
			<div class="l">
				<div class="edit">
					<div class="t">
						<span>店群数量限制</span>
					</div>
					<div class="m">
						<el-checkbox v-model="limit"></el-checkbox>
						限制店群返回数量 相似度最高的前
						<el-input v-model="number" type="number" :title="number"></el-input>
						家
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		name: 'ExpandScale',
		computed: {
			...mapGetters('businessExpansionModule', [
				'storeStep'
			])
		},
		data() {
			return {
				scaleNum: 50,
				scaleData: 0,
				expandlist: [],
				marks: {
					50: '50%',
					100: '100%'
				},
				limit: true,
				number: '5000'
			}
		},
		watch: {
			scaleNum() {
				this.getScale()
			},
			'number'(data) {
				if (data.length > 0) {
					this.limit = true
					this.$parent.limitDisabled = false
				} else {
					this.limit = false
				}
			},
			'limit'(data) {
				if (data) {
					if (this.number.length > 0) {
						this.$parent.limitDisabled = false
					} else {
						this.$parent.limitDisabled = true
					}
				} else {
					this.number = ''
					this.$parent.limitDisabled = false
				}
			}
		},
		created() {
			if (this.number.length > 0 && this.limit) {
				this.$parent.limitDisabled = false
			}
		},
		methods: {
			formatTooltip(val) {
				return val + '%'
			},
			getScale() {
				let data = this.expandlist.find(e => e.similarity == this.scaleNum)
				if (data) {
					this.scaleData = data.storeNum
				} else {
					this.scaleData = ''
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.sp2 {
		margin-bottom: 15px;
		padding: 10px 0px;
		background: #FFFFFF;
		box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.1);
		border-radius: 2px;
		.show {
			.t {
				padding-left: 15px;
				font-size: 12px;
				font-weight: 600;
				color: #535A6B;
			}
			.i {
				padding: 10px 0px;
				overflow: hidden;
				.tip {
					padding-left: 15px;
					font-size: 12px;
					color: #7F8797;
					font-weight: 600;
				}
				.num {
					padding-left: 15px;
					display: flex;
					height: 40px;
					.el-slider {
						width: 300px;
					}
					::v-deep .el-slider__stop {
						display: none;
					}
					::v-deep .el-slider__marks-text {
						&:first-child {
							padding-left: 25px;
						}
						&:last-child {
							padding-right: 20px;
						}
					}
					.store {
						font-size: 12px;
						font-weight: 500;
						color: #495060;
						padding-left: 35px;
						line-height: 40px;
						.streoNum {
							color: #930CEA;
							padding: 0px 5px;
							font-weight: 600;
							font-size: 13px;
						}
					}
				}
			}
			.l {
				padding: 10px 0px 0px 0px;
				.edit {
					.t {
						padding-bottom: 10px;
						span {
							font-size: 12px;
							font-weight: 600;
							color: #687082FF;
						}
					}
					.m {
						font-size: 12px;
						font-weight: 400;
						color: #495060;
						.el-input {
							width: 57px;
							// margin: 0 3px;
						}
						.el-checkbox {
							margin: 0 3px 0 15px;
						}
						::v-deep .el-input__inner {
							height: 24px;
							line-height: 24px;
							padding: 0px;
							text-align: center;
						}
					}
				}
			}
		}
	}
</style>
