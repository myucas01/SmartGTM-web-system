<template>
	<div class="business-constrast">
		<div class="header" :class="{'list-header-active': !openStatus}" @click="openStatus = !openStatus">商圈指标对比</div>
		<collapse-transition>
			<div class="main" v-show="openStatus">
				<el-table :data="tableData">
					<el-table-column label="">
						<el-table-column label="商圈名称" prop="targetName" width="70px" show-overflow-tooltip></el-table-column>
					</el-table-column>
					<el-table-column label="方案1" align="center" show-overflow-tooltip>
						<el-table-column prop="value1" align="center" show-overflow-tooltip :render-header="renderHeaderfirst"></el-table-column>
					</el-table-column>
					<el-table-column label="方案2" align="center" show-overflow-tooltip>
						<el-table-column prop="value2" align="center" show-overflow-tooltip :render-header="renderHeadersecond"></el-table-column>
					</el-table-column>
					<template slot="empty">
						<span>请选择方案1及方案2中的商圈进行对比</span>
					</template>
				</el-table>
			</div>
		</collapse-transition>
	</div>
</template>

<script>
	import {
		AMap
	} from '@/plugins/AMap'
	import {
		eventBus
	} from '@/util/eventBut.js'
	// import { AMap } from '@/plugins/AMap'
	export default {
		name: 'IndexContrast',
		watch: {
			'businessObj.orgFirstBusList': {
				handler: function(data) {
					this.clearChooseBorder(this.polygon.first_map_obj)
					this.clearStreetName(this.street.first_map_obj, this.businessMap.first_map_obj.mapObj)
					// 获取商圈指标
					this.getBusinessTarget(this.businessObj.orgFirstBusList, this.businessObj.orgSecondBusList, this.businessMap.first_map_obj,
						this.businessMap.second_map_obj)
					if (data.length > 0) {
						// 获取商圈中文名称
						this.getBusinessNameFirst(data)
						// 获取街道边界
						this.getBusinessStreet(data, this.businessMap.first_map_obj)
					}
				},
				deep: true
			},
			'businessObj.orgSecondBusList': {
				handler: function(data) {
					this.clearChooseBorder(this.polygon.second_map_obj)
					this.clearStreetName(this.street.second_map_obj, this.businessMap.second_map_obj.mapObj)
					// 获取商圈指标
					this.getBusinessTarget(this.businessObj.orgFirstBusList, this.businessObj.orgSecondBusList, this.businessMap.first_map_obj,
						this.businessMap.second_map_obj)
					if (data.length > 0) {
						// 获取商圈中文名称
						this.getBusinessNameSecond(data)
						// 获取街道边界
						this.getBusinessStreet(data, this.businessMap.second_map_obj)
					}
				},
				deep: true
			},
		},
		data() {
			return {
				openStatus: true,
				polygonDefaultOption: {
					strokeColor: '#4c4646',
					strokeWeight: 1,
					fillOpacity: 0.5,
					zIndex: 2
				},
				textDefaultOption: {
					maxWidth: '100px',
					maxHeight: '200px',
					color: '#222222',
					fontSize: '12px',
					backgroundColor: 'transparent',
					border: 'none',
					zIndex: 10
				},
				streetDefaultOption: {
					strokeColor: '#4c4646',
					strokeWeight: 1,
					fillOpacity: 0.5,
					zIndex: 2
				},
				dataMap: {
					first_map_obj: [],
					second_map_obj: []
				},
				businessMap: {
					first_map_obj: {},
					second_map_obj: {}
				},
				businessObj: {
					orgFirstBusList: '',
					orgSecondBusList: '',
					orgFirstBusName: '',
					orgSecondBusName: ''
				},
				polygon: {
					first_map_obj: [],
					second_map_obj: []
				},
				text: {
					first_map_obj: {},
					second_map_obj: {}
				},
				street: {
					first_map_obj: {},
					second_map_obj: {}
				},
				map_text_list: {},
				tableData: []
			}
		},
		mounted() {
			eventBus.$on('getOrgBusinessfirst_map_obj', ({
				business,
				businessList
			}) => {
				console.log(business)
				this.dataMap[business.mapCode] = businessList
				this.businessMap[business.mapCode] = business
				this.text[business.mapCode] = {}
				this.polygon[business.mapCode] = {}
				this.businessObj.orgFirstBusList = business.bccNo ? [business.bccNo] : ''
				this.businessObj.orgFirstBusName = ''
				this.drawBusiness(business)
			})
			eventBus.$on('getOrgBusinesssecond_map_obj', ({
				business,
				businessList
			}) => {
				this.dataMap[business.mapCode] = businessList
				this.businessMap[business.mapCode] = business
				this.text[business.mapCode] = {}
				this.polygon[business.mapCode] = {}
				this.businessObj.orgSecondBusList = business.bccNo ? [business.bccNo] : ''
				this.businessObj.orgSecondBusName = ''
				this.drawBusiness(business)
			})
		},
		methods: {
			drawBusiness(business) {
				if (this.businessMap[business.mapCode] && this.dataMap[business.mapCode]) {
					this.polygon[business.mapCode] = []
					for (var i = 0; i < this.dataMap[business.mapCode].length; i++) {
						let item = this.dataMap[business.mapCode][i]
						if (item.zoningLng && item.zoningLat && item.boundar) {
							let name = {
								text: item.businessName.substring(0, 4) + '...',
								title: item.businessName,
								position: [item.zoningLng, item.zoningLat],
								style: this.textDefaultOption
							}
							this.text[business.mapCode][item.businessNo] = name
							this.drawText(business, name, item)
							let polygon = new AMap.GeoJSON({
								geoJSON: JSON.parse(item.boundar),
								getPolygon: (geo_json, lng_lat) => {
									let polygon_obj = new AMap.Polygon({
										path: lng_lat,
										zIndex: this.polygonDefaultOption.zIndex,
										strokeColor: this.polygonDefaultOption.strokeColor,
										strokeOpacity: item.diaphaneity,
										strokeWeight: this.polygonDefaultOption.strokeWeight,
										fillColor: item.color,
										fillOpacity: this.polygonDefaultOption.fillOpacity
									})
									this.polygon[business.mapCode].push({ businessNo: item.businessNo, obj: polygon_obj })
									return polygon_obj
								},
							})
							this.drawPolygon(business, polygon, item)
						}
					}
				}
			},
			drawText(business, text) {
				let textObj = new AMap.Text(text)
				this.businessMap[business.mapCode].mapObj.add(textObj);
				this.businessMap[business.mapCode].mapObj.setFitView()
			},
			drawPolygon(business, polygon) {
				this.businessMap[business.mapCode].mapObj.add(polygon);
				this.businessMap[business.mapCode].mapObj.setFitView()
			},
			async getBusinessTarget(orgFirstBusList, orgSecondBusList, first_map_obj, second_map_obj) {
				if (first_map_obj.top_proNo && second_map_obj.top_proNo) {
					let url = '/api/project/bcc/compare'
					let params = {
						firstBccNo: orgFirstBusList.toString(),
						firstProNo: first_map_obj.top_proNo,
						secondBccNo: orgSecondBusList.toString(),
						secondProNo: second_map_obj.top_proNo
					}
					await this.$fetch.get(url, params).then(res => {
						if (res.code == 200) {
							this.tableData = res.data
						}
					})
				}
			},
			getBusinessStreet(data, business) {
				let url = '/api/project/bcc/street'
				let params = {
					bccNos: data.toString(),
					proNo: business.top_proNo
				}
				this.$fetch.get(url, params).then(res => {
					let data = res.data
					for (var i = 0; i < data.length; i++) {
						let item = data[i]
						let polygon = new AMap.GeoJSON({
							geoJSON: JSON.parse(item.gdBoundar),
							getPolygon: (geo_json, lng_lat) => {
								let polygon_obj = new AMap.Polygon({
									path: lng_lat,
									extData: item,
									zIndex: this.streetDefaultOption.zIndex,
									strokeColor: this.streetDefaultOption.strokeColor,
									strokeOpacity: 0,
									strokeWeight: 0,
									fillColor: '#000000',
									fillOpacity: 0
								})
								var infoWindow = null
								polygon_obj.on('mouseover', (e) => {
									infoWindow = new AMap.InfoWindow({
										position: [e.lnglat.R, e.lnglat.Q],
										content: e.target.getExtData().regionName
									});
									infoWindow.open(this.businessMap[business.mapCode].mapObj)
								})
								polygon_obj.on('mouseout', () => {
									infoWindow.close()
								})
								this.street[business.mapCode][item.regionCode] = polygon_obj
								return polygon_obj
							},
						})
						this.drawStreet(business, polygon)
					}
				})
			},
			drawStreet(business, polygon) {
				this.businessMap[business.mapCode].mapObj.add(polygon);
				this.businessMap[business.mapCode].mapObj.setFitView()
			},
			drawLightBorder(list, data) {
				for (var i = 0; i < list.length; i ++) {
					if (list[i].businessNo == data) {
						let polygon = list[i].obj
						let options = polygon ? polygon.getOptions() : null
						if (options) {
							options.strokeColor = '#3F9EFFFF'
							options.strokeWeight = 3
							list[i].strokeOpacityOld = options.strokeOpacity
							options.strokeOpacity = 1
							polygon.setOptions(options)
						}
					}
				}
			},
			clearChooseBorder(data) {
				for (var i = 0; i < data.length; i ++) {
					let polygon = data[i].obj
					let options = polygon.getOptions()
					if (data[i].strokeOpacityOld) {
						options.strokeOpacity = data[i].strokeOpacityOld
						options.strokeColor = this.polygonDefaultOption.strokeColor
						options.strokeWeight = this.polygonDefaultOption.strokeWeight
						polygon.setOptions(options)
					}
				}
			},
			clearStreetName(data, mapobj) {
				Object.keys(data).map(key => {
					mapobj.remove(data[key])
				})
			},
			getBusinessNameFirst(data) {
				let objList = []
				for (var i = 0; i < data.length; i++) {
					this.drawLightBorder(this.polygon.first_map_obj, data[i])

					let obj = this.dataMap.first_map_obj.find(e => e.businessNo == data[i])
					objList.push((i + 1) + '.' + obj.businessName)
				}
				this.businessObj.orgFirstBusName = objList.toString()
			},
			getBusinessNameSecond(data) {
				let objList = []
				for (var i = 0; i < data.length; i++) {
					this.drawLightBorder(this.polygon.second_map_obj, data[i])

					let obj = this.dataMap.second_map_obj.find(e => e.businessNo == data[i])
					objList.push((i + 1) + '.' + obj.businessName)
				}
				this.businessObj.orgSecondBusName = objList.toString()
			},
			renderHeaderfirst(h) {
				if (this.dataMap.first_map_obj) {
					let filters = this.dataMap.first_map_obj
					return h('el-popover', {
						props: {
							placement: 'right',
							width: '200',
							trigger: 'hover',
							content: this.businessObj.orgFirstBusList.length > 0 ? this.businessObj.orgFirstBusName : '请选择数据'
						}
					}, [
						h('div', {
							slot: 'reference'
						}, [
							h('el-select', {
								on: {
									input: (value) => {
										this.businessObj.orgFirstBusList = value;
									}
								},
								props: {
									value: this.businessObj.orgFirstBusList,
									multiple: true
								},
							}, [
								filters.map(item => {
									return h("el-option", {
										props: {
											value: item.businessNo,
											label: item.businessName.length > 3 ? item.businessName.substring(0, 3) + '..' : item.businessName
										}
									})
								})
							])
						])
					])
				}
			},
			renderHeadersecond(h) {
				if (this.dataMap.second_map_obj) {
					let filters = this.dataMap.second_map_obj
					return h('el-popover', {
						props: {
							placement: 'right',
							width: '200',
							trigger: 'hover',
							content: this.businessObj.orgSecondBusList.length > 0 ? this.businessObj.orgSecondBusName : '请选择数据'
						}
					}, [
						h('div', {
							slot: 'reference'
						}, [
							h('el-select', {
								on: {
									input: (value) => {
										this.businessObj.orgSecondBusList = value;
									}
								},
								props: {
									value: this.businessObj.orgSecondBusList,
									multiple: true
								},
							}, [
								filters.map(item => {
									return h("el-option", {
										props: {
											value: item.businessNo,
											label: item.businessName ? item.businessName.substring(0, 3) + '..' : ''
										}
									})
								})
							])
						])
					])
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.business-constrast {
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
				border-radius: 4px;
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
							border-bottom: 1px solid rgba(255, 255, 255, 0.3);

							&.is-leaf {
								border-bottom: 1px solid rgba(255, 255, 255, 0.3);
							}
						}
					}
				}
				
				.el-table__empty-text {
					color: #e8e5e5;
					font-size: 13px;
					width: 100%;
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

				.el-input__inner {
					background: #3B198BFF;
					border-color: rgba(255, 255, 255, 0.3);
					height: 27px;
					font-size: 10px;
					color: #FFFFFF;

					&:hover {
						border: 1px solid #ab5bde;
					}
				}

				.el-input__icon {
					line-height: 27px;
				}
				
				.el-select {
					width: 110px;
					.el-tag {
						margin: 0;
						margin-left: 2px;
						margin-bottom: 1px;
					}
				}
			}
		}
	}
</style>
