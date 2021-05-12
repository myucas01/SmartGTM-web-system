<template>
	<div class="org-body">
		<div class="organization" v-if="!administrationDisabled" @click="showOrganization()">
			<span>{{ administrationName }}</span>
			<span class="el-icon-arrow-down"></span>
		</div>
		<div class="organization-disbaled" v-else>
			<span>{{ administrationName }}</span>
		</div>
		<div class="org-container" v-if="administrationShow">
			<div class="s-title">
				<span>行政选择</span>
				<span class="el-icon-close" @click="closeOrganizationSearch()"></span>
			</div>
			<div class="s-content">
				<div class="s-orglist">
					<el-input placeholder="请输入组织名称" v-model="filterText" class="smart_input_deep" clearable></el-input>
					<el-tree v-show="showSearch" ref="orgSearchTreeData" :default-expand-all="true" :data="searchOrgData" :props="defaultProps" @node-click="orgNodeClick" node-key="regionCode" highlight-current class="smart_tree_deep"></el-tree> 
					<el-tree v-show="!showSearch" ref="orgTreeData" :data="orgData" :props="defaultProps" @node-click="orgNodeClick" node-key="regionCode" highlight-current class="smart_tree_deep" :default-expanded-keys="expandId" @node-expand="expandHandle"></el-tree>
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
				'administrationData',
				'administrationName',
				'administrationType',
				'administrationParentId',
				'administrationId',
				'administrationParentId',
				'mapAdministration',
				'administrationDisabled',
				'admCheckId',
				'searchType',
				'treeData',
				'administrationShow'
			])
		},
		data() {
			return {
				showSearch: false,
				filterText: '',
				orgData: [],
				searchOrgData: [],
				expandId: '',
				defaultProps: {
					label: 'regionName',
					children: 'regions',
					isLeaf: 'leaf'
				}
			}
		},
		destroyed() {
			this.$store.dispatch('map/setMapAdministration', false)
		},
		mounted() {
			this.getOrgList()
			this.$store.dispatch('map/setAdministrationDisabled', false)
			this.$store.dispatch('map/setAdministrationShow', false)
		},
		watch: {
			mapAdministration() {
				this.$refs.orgTreeData.setCurrentKey(this.admCheckId)
			},
			administrationId() {
				if (this.administrationType == 4) {
					this.expandId = [this.administrationParentId]
					this.getRegion(this.orgData, this.administrationParentId)
				} else {
					this.expandId = [this.administrationId]
					this.getRegion(this.orgData, this.administrationId)
				}
			},
			filterText(val) {
				if (val) {
					if (val.length <=2 && (val.indexOf('街') > -1 || val.indexOf('道') > -1)) {
						this.$message.error('请输入相对完成的街道名称')
						return
					}
					this.getRegionStreetByName()
				} else {
					this.showSearch = false
				}
			},
		},
		methods: {
			loadOrgNode(node, resolve) {
				if (node.level == 0) {
					let data = []
					for (var i = 0; i < this.orgData.length; i ++) {
						data.push(this.orgData[i])
					}
					return resolve(data)
				}
				if (node.data.regionLevel < 3) {
					this.getRegion(this.orgData, node.data.regionCode, resolve)
				} else if (node.data.regionLevel == 4) {
					resolve([])
				} else {
					this.getRegionStreet(node.data.regionCode, resolve)
				}
			},
			setRegions(data) {
				for (var i = 0; i < data.length; i ++) {
					if (data[i].regionLevel == 3) {
						data[i].regions = [{regionCode: 'regionCodeRemoveId'}]
					} else {
						let regionsList = data[i].regions ? data[i].regions : []
						if (regionsList.length > 0) {
							this.setRegions(regionsList)
						}
					}
				}
			},
			getRegion(data, code) {
				for (var i = 0; i < data.length; i ++) {
					if (code == data[i].regionCode) {
						this.checkAdministration(data[i], code)
					}
					let regionsList = data[i].regions ? data[i].regions : []
					if (regionsList.length > 0) {
						this.getRegion(regionsList, code)
					}
				}
			},
			async getRegionStreet(code) {
				let url = '/api/expand/business/getStreetRegionTree'
				let params = {
					parentCode: code
				}
				await this.$fetch.get(url, params).then((res) => {
					if (res.code == 200) {
						if (this.$refs.orgTreeData) {
							for (var i = 0; i < res.data.length; i ++) {
								res.data[i].regionParentCode = code
							}
							this.$refs.orgTreeData.updateKeyChildren(code, res.data)
						}
					}
				})
			},
			getRegionStreetByName() {
				let url = '/api/expand/business/getRegionTreeByName'
				let params = {
					name: this.filterText
				}	
				this.$fetch.get(url, params).then((res) => {
					if (res.code == 200) {
						this.searchOrgData = res.data
					}
				})
				this.$nextTick(() => {
					this.showSearch = true
				}, 1000)
			}, 
			filterNode(value, data) {
				if (!value) return true;
				if (data.regionName) {
					return data.regionName.indexOf(value) !== -1;
				}
			},
			getOrgList() {
				let url = '/api/expand/business/getRegionTree'
				this.$fetch.get(url).then((res) => {
					if (res.code == 200) {
						this.orgData = res.data
						this.setRegions(this.orgData)
					}
				})
			},
			checkAdministration(data) {
				this.$nextTick(() => {
					if (this.$refs.orgTreeData) {
						if (data.regionLevel == 3) {
							console.log(data)
							if (data.regions.length == 1) {
								let nodeData = this.$refs.orgTreeData.getNode(data.regionCode)
								this.$refs.orgTreeData.remove(nodeData.childNodes[0])
								this.getRegionStreet(data.regionCode)
							}
						}
						// if (data.regionLevel == 4) {
						// 	this.getRegion(this.orgData, data.regionParentCode)
						// }
					}
				}, 1000)
			},
			expandHandle(data, node) {
				console.log(data.regionLevel)
				if (data.regionLevel == 2) {
					// for (var i = 0; i < data.regions.length; i++) {
					// 	this.$refs.orgTreeData.updateKeyChildren(data.regions[i].regionCode, [{
					// 		regionCode: 'regionCodeRemoveId'
					// 	}])
					// }
				}
				if (data.regionLevel == 3) {
					if (node.childNodes[0].data.regionCode == 'regionCodeRemoveId') {
						this.$refs.orgTreeData.remove(node.childNodes[0])
					}
					this.getRegionStreet(data.regionCode)
				}
			},
			// 组织树点击
			orgNodeClick(data, node) {
				if (this.$refs.orgTreeData) {
					this.$refs.orgTreeData.setCurrentKey(node.id)
				}
				if (this.$refs.orgSearchTreeData) {
					this.$refs.orgSearchTreeData.setCurrentKey(node.id)
				}
				this.$store.dispatch('map/setAdmCheckId', node.data.regionCode)
				// 组织id
				this.$store.dispatch('map/setAdministrationId', data.regionCode)
				// 组织name
				this.$store.dispatch('map/setAdministrationName', data.regionName)
				this.$store.dispatch('map/setAdministrationData', {
					name: data.regionName,
					id: data.regionCode,
					regionLevel: data.regionLevel,
					regionParentCode: data.regionParentCode
				})
			},
			showOrganization() {
				this.$store.dispatch('map/setAdministrationShow', true)
				if (this.administrationType == 4) {
					this.expandId = [this.administrationParentId]
					this.getRegion(this.orgData, this.administrationParentId)
				} else {
					this.expandId = [this.administrationId]
					this.getRegion(this.orgData, this.administrationId)
				}
			},
			closeOrganizationSearch() {
				this.$store.dispatch('map/setAdministrationShow', false)
			}
		}
	}
</script>

<style scoped lang="scss">
	.org-body {
		z-index: 2000;

		.organization,
		.organization-disbaled {
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
