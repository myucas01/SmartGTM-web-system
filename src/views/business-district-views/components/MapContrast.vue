<template>
	<div class="contrast">
		<div class="title" @scroll="titleScroll">
			<div class="m-a" :title="showTip">
				<span>{{ business_form.top_field_1 }}</span>
				<el-select v-model="business_form.top_proNo" @change="getOrgList" :disabled="business_form.mapCode == 'first_map_obj'">
					<el-option v-for="(item, index) in proList" :key="index" :value="item.proNo" :label="item.proName"></el-option>
				</el-select>
			</div>
			<div class="m-a" ref="reforg" @click.stop="showOrgList">
				<span>{{ business_form.top_field_2 }}</span>
				<el-input v-model="business_form.top_orgNme" @input="inputChange">
					<i slot="suffix" class="m-i el-icon-arrow-down"></i>
				</el-input>
			</div>
		</div>
		<div class="el-tree-body" ref="refBody">
			<el-tree ref="tree" :data="orgList" :props="defaultProps" v-show="showOrg" @node-click="onClickNode" :filter-node-method="filterNode"></el-tree>
		</div>
		<div :id="business_form.mapCode" class="map"></div>
	</div>
</template>

<script>
	import {
		AMap
	} from '@/plugins/AMap'
	import {
		eventBus
	} from '@/util/eventBut.js'
	export default {
		name: 'MapContrast',
		props: {
			business: {}
		},
		data() {
			return {
				business_form: {},
				orgPolygon: [],
				businessList: [],
				showOrg: false,
				showTip: '',
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				proList: [],
				orgList: []
			}
		},
		created() {
			/**
			 * 父组件传过来的方案数据
			 * mapCode<first>： 第一个地图
			 * mapCode<second>: 第二个地图
			 * top_proNo： 方案编码
			 * top_orgId： 组织ID
			 * top_orgNme：组织名称
			 */
			this.business_form = this.business
			/**
			 * 1.获取已生效的方案
			 * 2.根据所选方案获取组织列表数据
			 */
			this.getTopData()
			setTimeout(() => {
				// 创建地图实例
				this.setMap()
				// 获取商圈
				this.getBusiness()
				// 查询方案基本详情信息
				eventBus.$emit('getInfo' + this.business_form.mapCode, this.business_form)
			}, 50)
		},
		methods: {
			/**
			 * 方案下拉change事件
			 * 查询最新方案的组织树
			 */
			getOrgList() {
				this.business_form.top_orgId = ''
				this.business_form.top_orgNme = ''
				this.showOrg = false

				this.business_form.mapObj.clearMap()
				this.businessList = []
				// 获取商圈列表
				this.getOrgBusiness()

				this.getOrgByPro()
				this.getProTip()
				// 查询方案基本详情信息
				eventBus.$emit('getInfo' + this.business_form.mapCode, this.business_form)
			},
			getTopData() {
				// 获取方案列表
				let url = '/api/business/grading/comparison/programme/list'
				this.$fetch.get(url).then(res => {
					if (res.code == 200) {
						this.proList = res.data
						// 获取方案tip
						this.getProTip()
					}
				})
				if (this.business_form.top_proNo) {
					this.getOrgByPro()
				}
			},
			getProTip() {
				if (this.proList.length > 0 && this.business_form.top_proNo) {
					let data = this.proList.find(item => item.proNo == this.business_form.top_proNo)
					this.showTip = data.proName
				}
			},
			getOrgByPro() {
				// 根据方案编码获取组织树
				let url = '/api/business/grading/comparison/org/list'
				this.$fetch.get(url, {
					proNo: this.business_form.top_proNo
				}).then(res => {
					if (res.code == 200) {
						this.orgList = res.data
					}
				})
			},
			filterNode(value, data) {
				if (!value) return true;
				return data.name.indexOf(value) !== -1;
			},
			inputChange(data) {
				this.showOrg = true
				this.$refs.tree.filter(data)
			},
			onClickNode(node) {
				this.business_form.top_orgNme = node.name
				this.business_form.top_orgId = node.id
				this.business_form.bccNo = ''
				this.showOrg = false

				this.business_form.mapObj.clearMap()
				this.businessList = []
				this.getBusiness()
				
				this.$refs.tree.filter('')
				
				eventBus.$emit('getInfo' + this.business_form.mapCode, this.business_form)
			},
			showOrgList() {
				let rect = this.$refs.reforg.getBoundingClientRect()
				this.$refs.refBody.style.left = (rect.x + 350) + 'px'
				this.showOrg = !this.showOrg
			},
			titleScroll() {
				let rect = this.$refs.reforg.getBoundingClientRect()
				this.$refs.refBody.style.left = (rect.x + 350) + 'px'
			},
			setMap() {
				var mapObj = new AMap.Map(this.business_form.mapCode, {
					resizeEnable: true
				})
				this.business_form.mapObj = mapObj
			},
			async getBusiness() {
				if (this.business_form.top_orgId && this.business_form.top_proNo) {
					let url = '/api/project/bcc/list'
					let params = {
						orgId: this.business_form.top_orgId,
						proNo: this.business_form.top_proNo,
						businessComparison: true
					}
					await this.$fetch.get(url, params).then(res => {
						if (res.data.headquartersFlag) {
							this.orgPolygon = res.data.bccOrgVoList
							// 地图画出营业部边界、名称
							this.drawOrgMapInfo()
							// 获取商圈列表
							this.getOrgBusiness()
						} else {
							this.business_form.top_orgNme = ''
							this.business_form.top_orgId = ''
						}
					})
				}
			},
			getOrgBusiness() {
				eventBus.$emit('getOrgBusiness' + this.business_form.mapCode, {
					business: this.business_form,
					businessList: Array.prototype.concat.apply([], this.businessList)
				})
			},
			drawOrgMapInfo() {
				for (var i = 0; i < this.orgPolygon.length; i++) {
					let item = this.orgPolygon[i]
					if (item.bccList) {
						this.businessList.push(item.bccList)
					}
					if (item.zoningLng && item.zoningLat && item.orgBoundar) {
						let name = {
							text: item.orgName,
							position: [item.zoningLng, item.zoningLat],
							style: {
								'color': '#000000',
								'font-size': '15px',
								'background-color': 'transparent',
								'border': 'none',
								'font-weight': 'bold',
								'text-shadow': '-1px 0 white,0 1px white,1px 0 white,0 -1px white'
							},
							zIndex: 150
						}
						this.drawText(name)
						let total = {
							text: '商圈数: ' + item.bccTotal,
							position: [item.zoningLng, item.zoningLat],
							offset: new AMap.Pixel(1, -25),
							style: {
								'border-radius': '.25rem',
								'background-color': '#B972FFFF',
								'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
								'font-size': '14px',
								'color': '#ffffff'
							},
							zIndex: 200
						}
						this.drawText(total)
						let polygon = new AMap.GeoJSON({
							geoJSON: JSON.parse(item.orgBoundar),
							getPolygon: (geo_json, lng_lat) => {
								let polygon_obj = new AMap.Polygon({
									path: lng_lat,
									zIndex: 2,
									strokeColor: '#000000',
									strokeOpacity: 1,
									strokeWeight: 1,
									fillColor: '',
									fillOpacity: ''
								})
								return polygon_obj
							},
						})
						this.drawPolygon(polygon)
					}
				}
			},
			drawText(text) {
				let textObj = new AMap.Text(text)
				this.business_form.mapObj.add(textObj);
				this.business_form.mapObj.setFitView()
			},
			drawPolygon(polygon) {
				this.business_form.mapObj.add(polygon);
				this.business_form.mapObj.setFitView()
			}
		}
	}
</script>

<style scoped lang="less">
	.contrast {
		width: 50%;
		height: 100%;
		border-right: 1px solid rgba(255, 255, 255, 0.3);
		white-space: nowrap;
		position: relative;

		.title {
			width: 100%;
			color: #FFFFFF;
			height: 48px;
			line-height: 43px;
			overflow-x: auto;

			.el-select,
			.el-input {
				margin: 0 15px;
			}

			::v-deep .el-input__inner {
				background: #0A2757;
				border-color: rgba(255, 255, 255, 0.3);
				height: 30px;
				color: #ffffff !important;
				font-size: 10px;

				&:hover {
					border: 1px solid #ab5bde;
				}
			}

			::v-deep .el-input__icon {
				line-height: 30px;
			}

			.el-input {
				width: 200px;
				cursor: pointer;
			}

			.m-a {
				padding: 0px 10px;
				&:first-child {
					float: left;
				}
			}
		}

		::v-deep .el-tree-body {
			position: fixed;
			z-index: 5;
			width: 200px;
			max-height: 200px;
			overflow: auto;
		}

		.map {
			height: 100%;
		}
	}
</style>
