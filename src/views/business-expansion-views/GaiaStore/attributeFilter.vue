<template>
	<!-- 事实属性筛选（中间选项卡） -->
	<div class="attribute-filter-panel">
		<section class="scroll-wrapper">
			<div class="attribute-wrapper" v-show="isShow.fact">
				<div class="title-block">
					<i
						class="el-icon-caret-right"
						@click="handleSpread('fact')"
						:class="{ active: isSpread.fact }"
					></i>
					<p class="text" @click="handleSpread('fact')">事实标签筛选</p>
					<div class="delete" @click="handleClear('fact')">
						<i class="el-icon-delete"></i>
					</div>
				</div>
				<div class="content-wrap" v-show="isSpread.fact">
					<!--一级遍历 select-->
					<div class="select-item" v-for="(item, idx) in factFilterList" :key="idx">
						<div class="sub-title-block">
							<!--小三角箭头-->
							<i
								class="el-icon-caret-right"
								@click="handleSubSpread(item)"
								:class="{ active: item.isSpread }"
							></i>
							<span class="text" @click="handleSubSpread(item)">
								{{ item.title }}
							</span>
						</div>
						<div class="select-wrap" v-show="item.isSpread">
							<!--级联类型，值，为中文-->
							<el-cascader 
								v-if='item.title === "门店类型"' 
								@change="changeSelect(item)"
								v-model="item.values"
								:options="item.options" 
								:props="{ multiple: true, emitPath: false, label: 'name', value: 'name' }" 
								collapse-tags
								clearable 
								size='small'
								popper-class="orgPopover"
								class="smart_select_deep select-options">
							</el-cascader>
							<!--环境POI的值，为中文，所以要特别处理-->
							<el-select
								v-else-if='item.title === "周围环境POI"'
								class="smart_select_deep select-options"
								popper-class="attribute-select-option"
								v-model="item.values"
								:multiple="item.multiple"
								clearable
								size="small"
								placeholder="请选择"
								@change="changeSelect(item)"
							>
								<!--二级遍历 option-->
								<el-option
									v-for="cell in item.options"
									:key="cell.code"
									:label="cell.name"
									:value="cell.code"
								>
									<span class="text">{{ cell.name }}</span>
									<el-tooltip
										v-show="cell.tip"
										effect="dark"
										:content="cell.tip"
										placement="top-start"
									>
										<i class="el-icon-question icon-tooltip"></i>
									</el-tooltip>
								</el-option>
							</el-select>
						</div>
					</div>
				</div>
			</div>
			<div class="attribute-wrapper" v-show="isShow.model">
				<div class="title-block">
					<i
						class="el-icon-caret-right"
						@click="handleSpread('model')"
						:class="{ active: isSpread.model }"
					></i>
					<p class="text" @click="handleSpread('model')">模型标签筛选</p>
					<div class="delete" @click="handleClear('model')">
						<i class="el-icon-delete"></i>
					</div>
				</div>
				<div class="content-wrap" v-show="isSpread.model">
					<!--一级遍历 select-->
					<div class="select-item" v-for="(item, idx) in modelFilterList" :key="idx">
						<div class="sub-title-block">
							<!--小三角箭头-->
							<i
								class="el-icon-caret-right"
								@click="handleSubSpread(item)"
								:class="{ active: item.isSpread }"
							></i>
							<span class="text" @click="handleSubSpread(item)">
								{{ item.title }}
							</span>
						</div>
						<div class="select-wrap" v-show="item.isSpread">
							<el-select
								class="smart_select_deep select-options"
								popper-class="attribute-select-option"
								v-model="item.values"
								:multiple="item.multiple"
								size="small"
								clearable
								placeholder="请选择"
								@change="changeSelect(item)"
							>
								<!--二级遍历 option-->
								<el-option
									v-for="cell in item.options"
									:key="cell.code"
									:label="cell.name"
									:value="Number(cell.code)"
								>
									<span class="text">{{ cell.name }}</span>
									<el-tooltip
										v-show="cell.tip"
										effect="dark"
										:content="cell.tip"
										placement="top-start"
									>
										<i class="el-icon-question icon-tooltip"></i>
									</el-tooltip>
								</el-option>
							</el-select>
						</div>
					</div>
				</div>
			</div>
			<div class="attribute-wrapper" v-show="isShow.uniStore">
				<div class="title-block">
					<i
						class="el-icon-caret-right"
						@click="handleSpread('uniStore')"
						:class="{ active: isSpread.uniStore }"
					></i>
					<p class="text" @click="handleSpread('uniStore')">unistore筛选</p>
					<div class="delete" @click="handleClear('uniStore')">
						<i class="el-icon-delete"></i>
					</div>
				</div>
				<div class="content-wrap" v-show="isSpread.uniStore">
					<div class="select-item" v-for="(item, idx) in unistoreList" :key="idx">
						<div class="sub-title-block">
							<!--小三角箭头-->
							<i
								class="el-icon-caret-right"
								@click="handleSubSpread(item)"
								:class="{ active: item.isSpread }"
							></i>
							<span class="text" @click="handleSubSpread(item)">
								{{ item.title }}
							</span>
						</div>
						<div class="select-wrap" v-show="item.isSpread">
							<el-select
								class="smart_select_deep select-options"
								popper-class="attribute-select-option"
								v-model="item.values"
								:multiple="item.multiple"
								size="small"
								placeholder="请选择"
								clearable
								@change="changeSelect(item)"
							>
								<!--二级遍历 option-->
								<el-option
									v-for="cell in item.options"
									:key="cell.code"
									:label="cell.name"
									:value="cell.code"
								>
									<span class="text">{{ cell.name }}</span>
									<el-tooltip
										v-show="cell.tip"
										effect="dark"
										:content="cell.tip"
										placement="top-start"
									>
										<i class="el-icon-question icon-tooltip"></i>
									</el-tooltip>
								</el-option>
							</el-select>
						</div>
					</div>
				</div>
			</div>
		</section>
		<div class="result-btn">
			<span @click="getResult">生成</span>
		</div>
	</div>
</template>

<script>
	// import BUSINESS_NAVIGATION_API from '../../../../api/business_navigate_api'
	import BUSINESS_EXPANSION_API from '../../../../api/business-expansion_api'
	// 属性筛选面板
	export default {
		name: '',
		data() {
			return {
				isSpread: {
					fact: true,
					model: true,
					uniStore: true,
				},
				isShow: {
					fact: true,
					model: true,
					uniStore: true,
				},
				// 事实属性
				factFilterList: [
					{
						// 接口拿数据!
						title: '门店类型',
						isSpread: true,
						multiple: true,
						options: [],
						values: []
					},
					{
						// 接口拿数据!
						title: '周围环境POI',
						isSpread: true,
						multiple: true,
						options: [],
						values: []
					},
				],
				// 模型属性
				modelFilterList: [
					{
						title: '人流量',
						isSpread: true,
						multiple: true,
						options: [
							// {
							// 	code: 1,
							// 	name: '人流量高',
							// 	tip: ''
							// },
							// {
							// 	code: 2,
							// 	name: '人流量偏高',
							// 	tip: ''
							// },
							// {
							// 	code: 3,
							// 	name: '人流量中',
							// 	tip: ''
							// },
							// {
							// 	code: 4,
							// 	name: '人流量偏低',
							// 	tip: ''
							// },
							// {
							// 	code: 5,
							// 	name: '人流量低',
							// 	tip: ''
							// }
						],
						values: []
					},
					{
						title: '交通便利',
						isSpread: true,
						multiple: true,
						options: [
							// {
							// 	id: 6,
							// 	name: '交通便利程度高',
							// 	tip: ''
							// },
							// {
							// 	id: 7,
							// 	name: '交通便利程度偏高',
							// 	tip: ''
							// },
							// {
							// 	id: 8,
							// 	name: '交通便利程度中',
							// 	tip: ''
							// },
							// {
							// 	id: 9,
							// 	name: '交通便利程度偏低',
							// 	tip: ''
							// },{
							// 	id: 10,
							// 	name: '交通便利程度底',
							// 	tip: ''
							// }
						],
						values: ''
					},
					{
						title: '消费力指数',
						isSpread: true,
						multiple: true,
						options: [
							// {
							// 	id: 11,
							// 	name: '消费力指数高',
							// 	tip: ''
							// },
							// {
							// 	id: 12,
							// 	name: '消费力指数偏高',
							// 	tip: ''
							// },
							// {
							// 	id: 13,
							// 	name: '消费力指数中',
							// 	tip: ''
							// },
							// {
							// 	id: 14,
							// 	name: '消费力指数偏低',
							// 	tip: ''
							// },
							// {
							// 	id: 15,
							// 	name: '消费力指数低',
							// 	tip: ''
							// }
						],
						values: []
					},
					{
						title: '门店密集程度',
						isSpread: true,
						multiple: true,
						options: [
							// {
							// 	id: 21,
							// 	name: '门店密集程度高',
							// 	tip: ''
							// },
							// {
							// 	id: 22,
							// 	name: '门店密集程度偏高',
							// 	tip: ''
							// },
							// {
							// 	id: 23,
							// 	name: '门店密集程度中',
							// 	tip: ''
							// },
							// {
							// 	id: 24,
							// 	name: '门店密集程偏低',
							// 	tip: ''
							// },
							// {
							// 	id: 25,
							// 	name: '门店密集程度低',
							// 	tip: ''
							// }
						],
						values: []
					},
					{
						title: '房价',
						isSpread: true,
						multiple: true,
						options: [
							// {
							// 	id: 16,
							// 	name: '房价高',
							// 	tip: ''
							// },
							// {
							// 	id: 17,
							// 	name: '房价偏高',
							// 	tip: ''
							// },
							// {
							// 	id: 18,
							// 	name: '房价中',
							// 	tip: ''
							// },
							// {
							// 	id: 19,
							// 	name: '房价偏低',
							// 	tip: ''
							// },{
							// 	id: 20,
							// 	name: '房价低',
							// 	tip: ''
							// }
						],
						values: []
					},
				],
				unistoreList: [
					{
						title: 'uniStore',
						isSpread: true,
						multiple: true,
						options: [
							{
								code: 1,
								name: '已UNI',
								tip: ''
							},
							{
								code: 0,
								name: '未UNI',
								tip: ''
							},
						],
						values: []
					}
				]
			}
		},
		props: ['requestData'],
		watch: {
			/**
			 * @description 监听路由变化而映射的过滤条件
			 */
			requestData:{
				handler(data){
					// 初始化所有switch控件
					this.initSelectOption(data)
				},
				deep: true
			}
		},
		mounted() {
			// 初始化门店类型列表
			this.getStoreTypeList()
			// 初始化POI列表
			this.getStorePoiList()
			// 初始化所有switch控件
			this.initSelectOption(this.requestData)
		},
		methods: {
			/**
			 * @description 初始化所有select控件
			 * @param {object} data Index.vue传递过来的filter_obj,用来联动switch,注意，这里的下拉菜单是数值型，路由过来的数据必须转化
			 */
			initSelectOption(data){
				// 门店类型
				this.factFilterList[0].values = data.storeCategory ? data.storeCategory : []
				// POI
				this.factFilterList[1].values = data.storePoiCode ? data.storePoiCode : []

				// 模型属性筛选
				// 人流量 peopleStream
				this.modelFilterList[0].values = data.peopleStream ? data.peopleStream.map(Number) : []
				// 交通便利 transportation
				this.modelFilterList[1].values = data.transportation ? data.transportation.map(Number) : []
				// 消费力指数 consumption
				this.modelFilterList[2].values = data.consumption ? data.consumption.map(Number) : []
				// 门店密集程度 storeDensity
				this.modelFilterList[3].values = data.storeDensity ? data.storeDensity.map(Number) : []
				// 房价 housePrice
				this.modelFilterList[4].values = data.housePrice ? data.housePrice.map(Number) : []
				// uniStore
				this.unistoreList[0].values = data.uniStore ? data.uniStore.map(Number) : []
			},

			/**
			 * @description 获取门店类型下拉列表（cate:2,为店铺类型列表，如果为cate:1,则为地图图例列表）[售点拓展3期用新接口]
			 */
			async getStoreTypeList() {
				// this.factFilterList[0].options = await BUSINESS_NAVIGATION_API.get_store_type_list({cate: 2})
				const tempList = await BUSINESS_EXPANSION_API.store_type_option_list()
				this.factFilterList[0].options = this.dealTreeData(tempList)
			},
			// 递归判断，把最深层级的children=[]设为undefined，防止级联选择器最后一级出现暂无数据的情况
			dealTreeData(data) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].children.length < 1) {
						// children若为空数组，则将children设为undefined
						data[i].children = undefined
					} else {
						// children若不为空数组，则继续 递归调用 本方法
						this.dealTreeData(data[i].children)
					}
				}
				return data
			},

			/**
			 * @description 获取POI下拉列表和模型标签下拉框数据
			 */
			async getStorePoiList() {
				// this.factFilterList[1].options = await BUSINESS_NAVIGATION_API.get_poi_list()
				const res = await BUSINESS_EXPANSION_API.sync_total_labels_list({}) // 售点拓展老接口
				// const res = await BUSINESS_EXPANSION_API.environment_poi_option_list() // 售点拓展3期新接口
				const {
					poiLabels,
					houspriceLabels,
					spendingpowerLabels,
					storedensityLabels,
					transportationLabels,
					visitorsLabels
				} = res
				this.factFilterList[1].options = poiLabels || [] // poi
				this.modelFilterList[0].options = visitorsLabels || [] // 人流量
				this.modelFilterList[1].options = transportationLabels || [] // 交通便利
				this.modelFilterList[2].options = spendingpowerLabels || [] // 消费力指数
				this.modelFilterList[3].options = storedensityLabels || [] // 门店密集程度
				this.modelFilterList[4].options = houspriceLabels || [] // 房价
			},

			/**
			 * @description 事实属性展开和收起
			 * @param {string} item 当下模块的层级字段
			 */
			handleSpread(item) {
				this.isSpread[item] = !this.isSpread[item]
			},

			/**
			 * @description 子模块展开收起
			 * @param {string} item 当下模块的层级字段
			 */
			handleSubSpread(item) {
				item.isSpread = !item.isSpread
			},

			/**
			 * @description 清空所有选择
			 * @param {string} type 当下模块名
			 */
			handleClear(type) {
				if(type === 'fact') {
					this.$emit('clearAllSelect', 'fact')
				} else if(type === 'model') {
					this.$emit('clearAllSelect', 'model')
				} else if (type === 'uniStore') {
					this.$emit('clearAllSelect', 'uniStore')
				}
			},

			/**
			 * @description 每次选项发生变化时回调
			 * @param {object} item 每个子模块数据
			 */
			changeSelect(item) {
				this.$emit('changeSelect', item)
			},

			/**
			 * @description 生成画像,跳转到画像选项卡（只能从此处进入）
			 */
			getResult() {
				this.$emit('generateEcharts')
			}
		}
	}
</script>

<style scoped lang="scss">
	.attribute-filter-panel {
		width: 340px;
		height: 100%;
		position: relative;
		.scroll-wrapper {
			height: calc(100% - 60px);
			overflow-y: auto;
			background: #102f63;
			.attribute-wrapper {
				.title-block {
					height: 34px;
					background: #133773;
					text-align: left;
					position: relative;
					i.el-icon-caret-right {
						padding: 0 5px;
						transform: rotate(0deg);
						cursor: pointer;
						&.active {
							transition: transform 0.3s;
							transform: rotate(90deg);
						}
					}
					.text {
						display: inline-block;
						line-height: 34px;
						font-size: 13px;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #ffffff;
						cursor: pointer;
					}
					.delete {
						position: absolute;
						right: 37px;
						bottom: 9px;
						cursor: pointer;
					}
				}
				.content-wrap {
					padding: 5px 0;
					.select-item {
						.sub-title-block {
							text-align: left;
							height: 30px;
							line-height: 30px;
							margin: 3px 0;
							padding-left: 15px;
							i.el-icon-caret-right {
								padding: 0 5px;
								transform: rotate(0deg);
								cursor: pointer;
								&.active {
									transition: transform 0.3s;
									transform: rotate(90deg);
								}
							}
							.text {
								display: inline-block;
								font-size: 12px;
								color: #ffffff;
								cursor: pointer;
							}
						}
						.select-wrap {
							min-height: 45px;
							text-align: center;
						}
					}
					// 级联菜单：下拉模块
					.orgPopover {
						li {
							color: #ffffff;
							transition:all 0.3s;
							font-size:12px;
						}
						li:hover{
							background-color: #4b1f98;
							font-size:12px;
						}
						.in-active-path {
							background-color: #4b1f98;
							color: #ffffff;
							font-weight:normal;
							font-size:12px;
						}
						.el-cascader-node:not(.is-disabled):hover, .el-cascader-node:not(.is-disabled):focus{
							background-color: #4E19A0;
							font-weight:normal;
							font-size:12px;
						}
						.el-cascader-menu{
							border-right:1px solid #1B3961;
							font-size:12px;
						}
					}
				}
				.content-model {
					padding: 9px 0 15px 0;
					text-align: center;
				}
			}
		}
		.result-btn {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 59px;
			line-height: 59px;
			background-color: #0a2757;
			text-align: center;
			span {
				display: inline-block;
				width: 310px;
				height: 32px;
				line-height: 32px;
				background-color: #a634ef;
				border-radius: 2px;
				cursor: pointer;
			}
		}
	}
</style>

<!--覆盖element UI样式，注意最外层需要增加当前组件的类名，以防止污染全局，特别的如果是下拉区域因为是独立加类名，会在页面最外层，所以放在外边-->
<style lang="scss">
	.attribute-filter-panel {
		.select-options {
			width: 280px;
			.el-select__tags {
				.el-tag.el-tag--info {
					background: #102f63;
					border-radius: 4px;
					border: 1px solid #8199a4;
					color: #ffffff;
				}
			}
		}
		// 级联菜单
		.el-cascader__tags{
			.el-tag{
				background-color: #102f63;
				border:1px solid #8199a4;
				color:#ffffff;
			}
		}
	}
	// 自定义类：select-option（下拉区域）
	.attribute-select-option {
		border: 1px solid rgb(75, 31, 152) !important;
		background-color: rgb(34, 60, 103);
		.el-scrollbar {
			background: #071e44;
			border-radius: 2px;
			border: 1px solid #12469f;
			.el-scrollbar__wrap {
				ul {
					li {
						height: 28px;
						line-height: 28px;
						padding: 0 15px 0 9px;
						&.selected {
							background: #7909c1;
						}

						.text {
							float: left;
							color: #dddee1;
							font-size: 12px;
						}
						.icon-tooltip {
							float: right;
							color: #fff;
							margin-top: 7px;
						}
					}
					.el-select-dropdown__item.hover,
					.el-select-dropdown__item:hover {
						background: #a634ef;
					}
					.el-select-dropdown__item.selected::after {
						display: none;
					}
				}
			}
		}
		.popper__arrow {
			display: none;
		}
	}
</style>
