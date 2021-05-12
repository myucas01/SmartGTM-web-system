<template>
	<div class="item sp4" v-if="storeStep >= 3">
		<div class="edit">
			<div class="t">
				<span>确定特定权重</span>&nbsp;&nbsp;
				<el-tooltip placement="top">
					<div slot="content">您可以在创建过程中在GAIA模型权重的基础上进行调整。权重越高，表示这个特征在模型中越重要。0表示使用GAIA系统智能推荐的权重</div>
					<span class="question">
						<svg t="1585551311735" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5000"
						width="16" height="16">
							<path d="M512 113.406976c-219.789312 0-398.601216 178.816-398.601216 398.61248 0 219.773952 178.811904 398.573568 398.601216 398.573568s398.601216-178.799616 398.601216-398.573568C910.601216 292.224 731.789312 113.406976 512 113.406976zM552.2176 803.094528l-80.04608 0 0-80.04608 80.04608 0L552.2176 803.094528zM679.120896 446.205952c-11.713536 21.086208-34.623488 46.728192-68.722688 76.92288-22.908928 20.303872-37.874688 35.275776-44.904448 44.904448-7.027712 9.632768-12.237824 20.694016-15.618048 33.188864-3.386368 12.494848-5.339136 32.799744-5.85728 60.913664L476.4672 662.135808c-0.262144-9.371648-0.390144-16.400384-0.390144-21.086208 0-27.588608 3.904512-51.406848 11.713536-71.455744 5.723136-15.09376 14.96576-30.321664 27.722752-45.683712 9.371648-11.190272 26.222592-27.529216 50.566144-49.00352 24.337408-21.476352 40.15104-38.590464 47.44192-51.347456 7.284736-12.750848 10.933248-26.68032 10.933248-41.780224 0-27.332608-10.677248-51.347456-32.018432-72.042496-21.348352-20.69504-47.509504-31.041536-78.485504-31.041536-29.937664 0-54.928384 9.370624-74.970112 28.11392-20.047872 18.742272-33.188864 48.026624-39.437312 87.855104l-72.237056-8.590336c6.504448-53.359616 25.832448-94.230528 57.985024-122.606592 32.146432-28.36992 74.641408-42.560512 127.488-42.560512 55.964672 0 100.606976 15.227904 133.931008 45.683712 33.317888 30.456832 49.980416 67.295232 49.980416 110.502912C696.691712 402.082816 690.835456 425.120768 679.120896 446.205952z"
							fill="#d4d4d4" p-id="5001"></path>
						</svg>
					</span>
				</el-tooltip>
			</div>
			<div class="m">
				<div class="field fieldLine" v-for="(item, index) in specific" :key="index">
					<div class="tip">{{ item.featureName }}特征<span class="e">{{item.featureValue}}</span></div>
					<div class="num">
						<el-slider v-model="item.featureValue" :max="10" :min="-10"></el-slider>
					</div>
					<div class="t">
						<span>-10</span>
						<span>10</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'SpecificWeight',
		computed: {
			...mapGetters('businessExpansionModule', [
				'storeStep'
			])
		},
		data() {
			return {
				specific: [
					{
						featureCode: 1,
						featureName: '人流量',
						featureValue: 0,
						storesId: ''
					},
					{
						featureCode: 2,
						featureName: '交通便利',
						featureValue: 0,
						storesId: ''
					},
					{
						featureCode: 3,
						featureName: '消费力指数',
						featureValue: 0,
						storesId: ''
					},
					{
						featureCode: 4,
						featureName: '门店密集程度',
						featureValue: 0,
						storesId: ''
					},
					{
						featureCode: 5,
						featureName: '房价',
						featureValue: 0,
						storesId: ''
					}
				]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.sp4 {
		padding-left: 5px;
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
				.fieldLine {
					border-right: 1px solid #E9EAECFF;
				}
				.field {
					display: inline-block;
					width: 215px;
					height: 90px;
					padding: 5px 15px;
					margin-bottom: 30px;
					.tip {				
						color: #80848F;
						font-size: 12px;
						font-weight: 600;
						.e {
							color: red;
							font-weight: 700;
							margin-left: 5px;
							font-size: 13px;
						}
					}
					.num {
						margin-top: 40px;
						display: flex;
						.el-slider {
							width: 220px;
						}
						::v-deep .el-slider__stop {
							display: none;
						}
					}
					.t {
						span {
							&:first-child {
								float: left;
							}
							&:last-child {
								float: right;
							}
						}
					}
				}
			}
		}
	}
</style>
