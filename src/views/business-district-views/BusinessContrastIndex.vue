<template>
	<div class="contrast-main" @click="mainClick()">
		<div class="left" :class="{'close': !showTag}">
			<div class="iconbox-close" v-show="!showTag">
				<i class="el-icon-s-unfold icon" @click="showUp()"></i>
			</div>
			<div class="iconbox-show" v-show="showTag">
				<i class="el-icon-s-fold icon" @click="showUp()"></i>
				{{ dataTile }}
			</div>
			<div class="main" v-show="showTag">
				<BusinessInfo></BusinessInfo>
				<IndexContrast></IndexContrast>
			</div>
			<div class="bottom" v-show="showTag">
				<el-button type="primary" @click="back">返回</el-button>
			</div>
		</div>
		<div class="right">
			<MapContrast :business="businessFirst" ref="mapContrastLeft"></MapContrast>
			<MapContrast :business="businessSecond" ref="mapContrastRight"></MapContrast>
		</div>
	</div>
</template>

<script>
	import BusinessInfo from '@/views/business-district-views/components/BusinessInfo'
	import IndexContrast from '@/views/business-district-views/components/IndexContrast'
	import MapContrast from '@/views/business-district-views/components/MapContrast'
	export default {
		name: 'BusinessContrastIndex',
		components: {
			BusinessInfo,
			IndexContrast,
			MapContrast
		},
		data() {
			return {
				dataTile: '商圈对比',
				showTag: true,
				businessFirst: {
					mapCode: 'first_map_obj',
					top_field_1: '方案1',
					top_field_2: '方案1组织',
					top_proNo: this.$route.query.proNo,
					top_orgId: this.$route.query.orgId,
					top_orgNme: this.$route.query.orgName,
					bccNo: this.$route.query.bccNo
				},
				businessSecond: {
					mapCode: 'second_map_obj',
					top_field_1: '方案2',
					top_field_2: '方案2组织',
					top_proNo: '',
					top_orgId: '',
					top_orgNme: ''
				}
			}
		},
		beforeRouteEnter(to, from, next) {			next(vm => {				// 通过 `vm` 访问组件实例				vm.$store.commit('addTabs', {					title: `商圈对比`,					link: decodeURIComponent(vm.$route.fullPath),					on: true,					needCatch: true,					isPathNameCheck: true				})			})		},
		methods: {
			showUp() {
				this.showTag = !this.showTag
			},
			back() {
				this.$router.go(-1)
			},
			mainClick() {
				this.$refs.mapContrastLeft.showOrg = false
				this.$refs.mapContrastRight.showOrg = false
			}
		}
	}
</script>

<style scoped lang="scss">
	.contrast-main {
		width: 100%;
		height: 100%;

		.left {
			float: left;
			background: #081F45;
			position: relative;
			width: 350px;
			height: 100%;
			z-index: 10;

			.iconbox-close {
				height: 40px;
				width: 40px;
				font-size: 15px;
				color: #ffffff;
				display: flex;
				align-items: center;
				background-color: #0a2757;

				.icon {
					margin: 0 13px;
					cursor: pointer;
				}
			}

			.iconbox-show {
				height: 40px;
				line-height: 40px;
				display: flex;
				text-align: left;
				background: #081f45;
				position: relative;
				align-items: center;
				font-size: 15px;
				color: #ffffff;

				.icon {
					margin: 0 13px;
					cursor: pointer;
				}
			}

			.main {
				height: calc(100% - 91px);
				overflow-y: auto;
			}

			.bottom {
				align-items: center;
				justify-content: center;
				height: 51px;
				line-height: 51px;
				background: #0A2757;
				border-radius: 2px 2px 4px 4px;
				text-align: center;
				position: absolute;
				width: 100%;
				bottom: 0;

				.el-button {
					width: 295px;
					height: 28px;
					line-height: 28px;
					padding: 0;
					background: #930CEA;
					border-radius: 4px;
					font-size: 13px;
					font-weight: 500;
					color: #FFFFFF;
					border: none;
				}
			}
		}

		.right {
			background-color: #0A2757;
			display: flex;
			font-size: 12px;
			font-weight: 400;
			height: 100%;
			border: 1px solid #767676;
		}

		.close {
			width: 40px;
		}
	}
</style>
