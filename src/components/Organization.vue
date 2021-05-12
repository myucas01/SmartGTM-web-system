<template>
	<div class="org-body">
		<div class="organization" v-if="!organizationDisabled" @click="showOrganization()">
			<span>{{ organizationName }}</span>
			<span class="el-icon-arrow-down"></span>
		</div>
		<div class="organization-disbaled" v-else>
			<span>{{ organizationName }}</span>
		</div>
		<div class="org-container" v-if="organizationShow">
			<div class="s-title">
				<span>组织选择</span>
				<span class="el-icon-close" @click="closeOrganizationSearch()"></span>
			</div>
			<div class="s-content">
				<div class="s-orglist">
					<el-input placeholder="请输入组织名称" v-model="filterText" class="smart_input_deep" clearable></el-input>
					<el-tree ref="orgTreeData" :data="orgData" :props="defaultProps" node-key="id" highlight-current class="smart_tree_deep" @node-click="orgNodeClick" :filter-node-method="filterNode" :default-expanded-keys="[organizationId]"></el-tree>
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
		name: 'organization',
		computed: {
			...mapGetters('map', [
					'organizationName',
					'organizationId',
					'mapOrganization',
					'organizationDisabled',
					'orgCheckId',
					'searchType',
					'treeData',
					'organizationShow',
			])
		},
		data() {
			return {
				filterText: '',
				orgData: [],
				defaultProps: {
					label: 'name',
					children: 'children'
				}
			}
		},
		mounted() {
			this.getOrgList()
			this.$store.dispatch('map/setOrganizationDisabled', false)
			this.$store.dispatch('map/setOrganizationShow', false)
		},
		watch: {
			mapOrganization() {
				this.$refs.orgTreeData.setCurrentKey(this.orgCheckId)
			},
			filterText(val) {
				this.$refs.orgTreeData.filter(val);
			},
		},
		methods: {
			filterNode(value, data) {
				console.log(value, data)
				if (!value) return true;
				return data.name.indexOf(value) !== -1;
			},
			getOrgList () {
				let _this = this
				let url = '/api/bn/store/position/getOrgListAuthority'
				if(this.searchType.indexOf('business_store') >= 0){ // 商圈分级
					url = '/api/business/grading/detail/tree?proId=' + this.$route.query.proId
				}
				if(this.searchType.indexOf('gaia_store') >= 0){ // 商机拓展三期					url = '/bs-api/bs/org/tree'				}
				_this.$fetch.get(url).then((res) => {
					_this.$set(_this, 'orgData', res.data)
				})
			},
			// 组织树点击
			orgNodeClick(data, node) {
				this.$refs.orgTreeData.setCurrentKey(node.id)
				this.$store.dispatch('map/setOrgCheckId', node.data.id)
				// 组织id
        this.$store.dispatch('map/setOrganizationId', data.id)
        // 组织name
        this.$store.dispatch('map/setOrganizationName', data.name)
        console.info('组织树点击', data)
				this.$store.dispatch('map/setTreeData', {
					name: data.name,
					id: data.id,
					orgType: data.orgType,
          parentId: data.parentId
				})
				this.$store.commit('businessPreview/setOrgLevel', String(data.orgType))
			},
			showOrganization() {
				this.$store.dispatch('map/setOrganizationShow', true)
			},
			closeOrganizationSearch() {
				this.$store.dispatch('map/setOrganizationShow', false)
			}
		}
	}
</script>

<style scoped lang="scss">
	.org-body {
		z-index: 2000;
		.organization, .organization-disbaled {
			position: absolute;
			top: 4px;
			right: 60px;
			padding: 0px 10px;
			height: 32px;
			line-height: 32px;
			text-align: center;
			color: #FFFFFF;
			cursor: pointer;
			background: rgba(19, 55, 115, 0.5);
			border-radius: 4px;
			border: 1px solid rgba(255, 255, 255, 0.4);
			font-size: 14px;

			&:hover {
				background: #102F63;
				border-radius: 4px;
				border: 1px solid rgba(255, 255, 255, 0.2);
				cursor: pointer;
			}

			span {
				&:first-child {
					margin-right: 23px;
				}
			}
		}

		.organization-disbaled {
			span {
				&:first-child {
					margin-right: 0px;
				}
			}
		}

		.org-container {
			position: absolute;
			z-index: 2001;
			right: 0px;
			top: 0px;
			width: 300px;
			height: calc(100% - 4px);
			background-color: #0A2757;

			.s-title {
				color: #FFFFFF;
				height: 32px;
				line-height: 32px;
				padding: 0px 13px;
				background-color: #08214A;
				border: 1px solid #08214A;

				span {
					height: 32px;
					line-height: 32px;

					&:first-child {
						float: left;
					}

					&:last-child {
						font-size: 17px;
						float: right;
					}
				}
			}

			.s-content {
				color: #FFFFFF;
				padding: 14px;
				height: 100%;
				.recently-tip {
					margin-bottom: 15px;
					p {
						margin-bottom: 10px;
						font-size: 12px;

						&:first-child {
							font-size: 13px;
						}

						span {
							cursor: pointer;
							margin-right: 6px;
							display: inline-block;
							height: 24px;
							line-height: 24px;
							padding: 0px 5px;
							box-shadow: -2px 0px 4px 0px rgba(0, 0, 0, 0.5);
							border-radius: 4px;
							border: 1px solid #8199A4;
						}
					}
				}

				.s-orglist {
					height: calc(100% - 150px);
					overflow: auto;
				}
			}

			::v-deep .el-input__inner {
				height: 32px;
			}

			::v-deep .el-input__icon {
				line-height: 32px;
				font-size: 14px;
			}

			::v-deep .el-tree {
				background: #0A2757;
				color: #FFFFFF;
				margin-top: 5px;
				.el-tree-node__content {
					background: #0A2757;
					height: 32px;
					padding-left: 30px;
					&:hover {
						background: #4B1F98;
					}
				}
			}
		}
	}
</style>
