<template>
	<div class="business-info">
		<div class="header" :class="{'list-header-active': !openStatus}" @click="openStatus = !openStatus">商圈基本信息对比</div>
		<collapse-transition>
			<div class="main" v-show="openStatus">
				<el-table :data="title" border class="table-title">
					<el-table-column prop="level1" :render-header="renderHeader" align="center" width="160px" show-overflow-tooltip></el-table-column>
					<el-table-column prop="level2" :render-header="renderHeader" align="center" show-overflow-tooltip></el-table-column>
					<template slot="empty">
						<span>请至少选择两个方案组织</span>
					</template>
				</el-table>
				<el-table :data="tableData" border :show-header="false" class="table-data" v-if="tableData.length > 0">
					<el-table-column prop="name1" align="center" width="100px" show-overflow-tooltip></el-table-column>
					<el-table-column prop="code1" align="center" width="60px" show-overflow-tooltip></el-table-column>
					<el-table-column prop="name2" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="code2" align="center" show-overflow-tooltip></el-table-column>
				</el-table>
			</div>
		</collapse-transition>
	</div>
</template>

<script>
	import {
		eventBus
	} from '@/util/eventBut.js'
	export default {
		name: 'BusinessInfo',
		data() {
			return {
				openStatus: true,
				business_form1: {
					top_orgNme: '',
					top_proNo: '',
					top_orgId: ''
				},
				business_form2: {
					top_orgNme: '',
					top_proNo: '',
					top_orgId: ''
				},
				title: [],
				tableData: []
			}
		},
		mounted() {
			eventBus.$on('getInfofirst_map_obj', business => {
				this.business_form1.top_orgNme = business.top_orgNme
				this.business_form1.top_proNo = business.top_proNo
				this.business_form1.top_orgId = business.top_orgId
				this.getInfo()
			})
			eventBus.$on('getInfosecond_map_obj', business => {
				this.business_form2.top_orgNme = business.top_orgNme
				this.business_form2.top_proNo = business.top_proNo
				this.business_form2.top_orgId = business.top_orgId
				this.getInfo()
			})
		},
		methods: {
			getInfo() {
				this.tableData = []
				this.title = []

				if (this.business_form1.top_orgNme && this.business_form1.top_proNo && this.business_form1.top_orgId &&
					this.business_form2.top_orgNme && this.business_form2.top_proNo && this.business_form2.top_orgId) {
					this.title = [{
						level1: this.business_form1.top_orgNme,
						level2: this.business_form2.top_orgNme
					}]

					let url = '/api/business/grading/comparison/comparison/count'
					let params = {
						firstProNo: this.business_form1.top_proNo,
						secondProNo: this.business_form2.top_proNo,
						firstOrgId: this.business_form1.top_orgId,
						secondOrgId: this.business_form2.top_orgId
					}
					this.$fetch.get(url, params).then(res => {
						if (res.code == 200) {
							for (var i = 0; i <= 10; i++) {
								if (res.data.firstBusinessVO[i] || res.data.secondBusinessVO[i]) {
									this.tableData.push({
										name1: res.data.firstBusinessVO[i] ? res.data.firstBusinessVO[i].levelName : '-',
										code1: res.data.firstBusinessVO[i] ? res.data.firstBusinessVO[i].levelCount : '-',
										name2: res.data.secondBusinessVO[i] ? res.data.secondBusinessVO[i].levelName : '-',
										code2: res.data.secondBusinessVO[i] ? res.data.secondBusinessVO[i].levelCount : '-',
									})
								}
							}
						}
					})
				}
			},
			renderHeader(h, {
				$index
			}) {
				let str = '方案' + ($index + 1)
				return h('span', str)
			}
		}
	}
</script>

<style scoped lang="less">
	.business-info {
		.header {
			height: 34px;
			line-height: 34px;
			background: #133773;
			box-shadow: 0px -1px 0px 0px #0A2757;
			font-size: 13px;
			font-weight: 600;
			color: #FFFFFF;
			padding-left: 15px;
			cursor: pointer;

			&:before {
				display: inline-block;
				content: '';
				width: 0;
				height: 0;
				border-style: solid;
				border-width: 10px 7px 0 7px;
				border-color: #CED3DD transparent transparent transparent;
				position: relative;
				top: 2px;
				margin-right: 5px;
				transform-origin: 50% 30%;
				transition: transform .3s;
			}
		}

		.list-header-active {
			&:before {
				transform: rotate(-90deg)
			}
		}

		.main {
			padding: 10px;

			::v-deep .el-table {
				border-radius: 4px 4px 0px 0px;
				border-top: 1px solid #4D21B5FF;
				border-left: 1px solid #4D21B5FF;
				border-right: 1px solid #4D21B5FF;
				background-color: #4D21B5FF;

				.el-table__header {
					thead {
						th {
							background-color: #4D21B5FF;
							color: #fff;
							font-size: 12px;
							padding: 5px 0;
							border-right: 1px solid rgba(255, 255, 255, 0.3);

							&.is-leaf {
								border-bottom: 1px solid rgba(255, 255, 255, 0.3);
							}
						}
					}
				}

				.el-table__empty-text {
					color: #e8e5e5;
					font-size: 13px;
				}

				.el-table__body-wrapper {
					.el-table__body {
						tr {
							background: #4D21B5FF;
							color: #ffffff;

							td {
								border-right: 1px solid rgba(255, 255, 255, 0.3);
								border-bottom: 1px solid rgba(255, 255, 255, 0.3);
								padding: 5px 0;
							}
						}

						&:hover {
							td {
								background: #4D21B5FF;
							}
						}
					}
				}

				&::before {
					background-color: rgba(255, 255, 255, 0.3);
					height: 0px;
				}

				&::after {
					background-color: rgba(255, 255, 255, 0.3);
					height: 0px;
				}
			}

			::v-deep .table-data {
				border-radius: 0px 0px 4px 4px;

				.el-table__body-wrapper {
					.el-table__body {
						tr {
							td:nth-of-type(odd) {
								background-color: #2E127DFF;
							}

							td:nth-of-type(even) {
								background-color: #0A2757FF;
							}
						}
					}
				}
			}
		}
	}
</style>
