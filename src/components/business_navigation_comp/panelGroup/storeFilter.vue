<template>
	<!-- 问题门店筛选（左边选项卡），只在问题门店模块中存在 -->
	<div class="store-filter-panel">
		<div class="scroll-wrapper">
			<!--问题门店-1级-->
			<div class="list-wrapper" v-for="(item, idx) in listData" :key="idx">
				<div class="level1-block">
					<!--1级-展开/收起-->
					<i
						class="el-icon-caret-right"
						@click="handleSpread(item)"
						:class="{ active: item.isSpread }"
					></i>
					<p class="text" @click="handleSpread(item)">{{ item.label }} <span class='countNum'>（{{ item.num | numFormat }}）</span></p>
					<!--switch总开关滑块-->
					<div class="switch">
						<el-switch
							v-model="item.switch"
							@change="handleSwitch(item)"
						></el-switch>
					</div>
				</div>
				<!--业务异常门店/数据异常门店-->
				<div class="level1-list-wrap" :class="{ hideSwitch: !item.isSpread }">
					<div class="level1-list" v-for="(cell, i) in item.children" :key="i">
						<div class="level2-block">
							<i
								class="el-icon-caret-right"
								@click="handleSpread(cell)"
								:class="{ active: cell.isSpread }"
							></i>
							<p class="text" @click="handleSpread(cell)">{{ cell.label }} <span class='countNum'>（{{ cell.num | numFormat }}）</span></p>
							<el-tooltip
								v-show='i === 0'
								effect="dark"
								placement="top-start"
							>
								<div slot="content">
									{{tips_data.wtmd_ywycmd_xlbdb_km}}<br />
									{{tips_data.wtmd_ywycmd_lxlgywcj_km}}<br />
									{{tips_data.wtmd_ywycmd_wcj_km}}<br />
									{{tips_data.wtmd_ywycmd_mdzyysbjw_km}}<br />
									{{tips_data.wtmd_ywycmd_mdzyyscdqy_km}}<br />
								</div>
								<i class="el-icon-question"></i>
							</el-tooltip>

							<el-tooltip
								v-show='i === 1'
								effect="dark"
								placement="top-start"
							>
								<div slot="content">
									{{tips_data.wtmd_sjycmd_mdbmcw_km}}<br />
									{{tips_data.wtmd_sjycmd_mddzwx_km}}<br />
									{{tips_data.wtmd_sjycmd_mdmcwx_km}}<br />
									{{tips_data.wtmd_sjycmd_mdxxwx_km}}<br />
									{{tips_data.wtmd_sjycmd_jwdydxbpp_km}}<br />
									{{tips_data.wtmd_sjycmd_jwdztsdx_km}}<br />
									{{tips_data.wtmd_sjycmd_qskhlx_km}}<br />
									{{tips_data.wtmd_sjycmd_jwdqs_km}}<br />
									{{tips_data.wtmd_sjycmd_mdlxyc_km}}<br />
									{{tips_data.wtmd_sjycmd_khjlqs_km}}<br />
								</div>
								<i class="el-icon-question"></i>
							</el-tooltip>
						</div>
						<!--switch小开关滑块-->
						<div
							class="level2-list-wrap"
							:class="{ hideSwitch: !cell.isSpread }"
						>
							<div
								class="level2-list"
								v-for="(ce, k) in cell.children"
								:key="k"
							>
								<span class="icon-triangle" :class="`icon${i}${k}`">
									<!-- <i class="icon-triangle-inner"></i> -->
								</span>
								<div class="text">{{ ce.label }} <span class='countNum'>（{{ ce.num | numFormat }}）</span></div>
								<!-- <el-tooltip
									v-show="ce.tip"
									effect="dark"
									content="ss"
									placement="top-start"
								>
									<i class="el-icon-question icon-tooltip"></i>
								</el-tooltip> -->
								<div class="switch">
									<el-switch
										v-model="ce.switch"
										@change="handleSwitch(ce)"
									></el-switch>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--点击生成进入画像模块-->
		<div class="result-btn">
			<span @click="getResult">生成</span>
		</div>
	</div>
</template>

<script>
	/*---------------------导入商机导航接口API---------------------*/
	import BUSINESS_NAVIGATION_API from '../../../../api/business_navigate_api'
	// 门店筛选面板
	export default {
		name: 'problemFilterBoard',
		data() {
			return {
				listData: [
					{
						label: '问题门店图层',
						// 是否是子节点
						isLeaf: false,
						// 是否展开子节点
						isSpread: true,
						// switch决定是否打开
						switch: false,
						id: 1,
						num: '',
						children: [
							{
								label: '业务异常门店',
								isLeaf: false,
								isSpread: true,
								switch: false,
								tip: 
								`
									销量不达标：月销量小于5箱，
									连续两个月未成交：最近两个月没有订单，但最近6个月中有订单,未成交：过去6个月没有订单
								`,
								id: 11,
								num: '',
								children: [
									{
										label: '销量不达标',
										isLeaf: true,
										switch: false,
										id: 112,
										key: 'bsSubstandard',
										tip: '月销量（标准箱）小于等于5箱',
										num: ''
									},
									{
										label: '连续两个月未成交',
										isLeaf: true,
										switch: false,
										id: 113,
										key: 'bsTwoMonthNoDeal',
										tip: '最近两个月没有订单，但最近6个月中有订单',
										num: ''
									},
									{
										label: '未成交',
										isLeaf: true,
										switch: false,
										id: 114,
										key: 'bsNoDeal',
										tip: '过去6个月没有订单',
										num: ''
									},
									{
										label: '门店在营业所边界外',
										isLeaf: true,
										switch: false,
										id: 115,
										key: 'outSideBorder',
										tip: '一阶或MT门店的经纬度落在所属营业所边界外',
										num: ''
									},
									{
										label: '门店在营业所重叠区域',
										isLeaf: true,
										switch: false,
										id: 116,
										key: 'overlapStore',
										tip: '一阶或MT门店的经纬度落在所属营业所和其他营业所的重叠区域内',
										num: ''
									}
								]
							},
							{
								label: '数据异常门店',
								isLeaf: false,
								isSpread: true,
								switch: false,
								id: 12,
								num: '',
								children: [
									{
										label: '门店编码错误',
										isLeaf: true,
										switch: false,
										id: 121,
										key: 'codeError',
										tip: '原始数据中门店编码重复、为空或长度<7',
										num: ''
										
									},
									{
										label: '门店地址无效',
										isLeaf: true,
										switch: false,
										id: 122,
										key: 'addressInvalid',
										tip: '原始数据中省、市、区、详细地址字段缺失，或省市区字段与详细地址字段中的省市区不同',
										num: ''
									},
									{
										label: '门店信息无效',
										isLeaf: true,
										switch: false,
										id: 123,
										key: 'infoInvalid',
										tip: '原始数据中门店名称中包含已删除、作废、假、重复',
										num: ''
									},
									{
										label: '门店名称无效',
										isLeaf: true,
										switch: false,
										id: 124,
										key: 'nameInvalid',
										tip: '原始数据中门店名称为空或长度≤1',
										num: ''
									},
									{
										label: '经纬度与地址不匹配',
										isLeaf: true,
										switch: false,
										id: 125,
										key: 'mismatch',
										tip: '原始数据中经纬度与地址编码的经纬度偏差超过300米',
										num: ''
									},
									{
										label: '经纬度在特殊地形',
										isLeaf: true,
										switch: false,
										id: 126,
										key: 'special',
										tip: '原始数据中门店经纬度落在河流、湿地、码头、水库等水域内',
										num: ''
									},
									{
										label: '缺少客户类型',
										isLeaf: true,
										switch: false,
										id: 127,
										key: 'storeTypeError',
										tip: '原始数据中客户类型为空或客户类型ID为空',
										num: ''
									},
									{
										label: '缺少经纬度',
										isLeaf: true,
										switch: false,
										id: 128,
										key: 'lcDefect',
										tip: '原始数据中缺失经纬度字段',
										num: ''
									},
									{
										label: '门店类型异常',
										isLeaf: true,
										switch: false,
										id: 129,
										key: 'storeTypeAnomaly',
										tip: '原始数据中未知的门店类型，或门店类型与客户级别不匹配',
										num: ''
									},
									{
										label: '客户经理缺失',
										isLeaf: true,
										switch: false,
										id: 130,
										key: 'managerAbsence',
										tip: '原始数据中门店没有客户经理或客户经理没有职务',
										num: ''
									},
									{
										label: '与GAIA环境标签不匹配',
										isLeaf: true,
										switch: false,
										id: 131,
										key: 'dataPoiRepetition',
										tip: '',
										num: ''
									}
								]
							}
						]
					}
				],
				keys:[
					// 业务异常
					'wtmd_ywycmd_xlbdb_km',
					'wtmd_ywycmd_lxlgywcj_km',
					'wtmd_ywycmd_wcj_km',
					'wtmd_ywycmd_mdzyysbjw_km',
					'wtmd_ywycmd_mdzyyscdqy_km',
					// 数据异常
					'wtmd_sjycmd_mdbmcw_km',
					'wtmd_sjycmd_mddzwx_km',
					'wtmd_sjycmd_mdmcwx_km',
					'wtmd_sjycmd_mdxxwx_km',
					'wtmd_sjycmd_jwdydxbpp_km',
					'wtmd_sjycmd_jwdztsdx_km',
					'wtmd_sjycmd_qskhlx_km',
					'wtmd_sjycmd_jwdqs_km',
					'wtmd_sjycmd_mdlxyc_km',
					'wtmd_sjycmd_khjlqs_km',	
				],
				tips_data:''
			}
		},
		props: ['requestData'],
		computed: {},
		watch: {
			listData: {
				handler() {
					this.listData.forEach((item) => {
						if (item.children && item.children.length) {
							item.children.forEach((cell) => {
								// 第三层 从下往上查找改变父级状态
								if (cell.children && cell.children.length) {
									const cellArr = cell.children.map((ce) => ce.switch)
									// 所有子节点为都为true 其父节点为true
									cell.switch = cellArr.every((sw) => sw === true)
								}
							})
							const itemArr = item.children.map((it) => it.switch)
							// 所有子节点为都为true 其父节点为true
							item.switch = itemArr.every((ch) => ch === true)
						}
					})
				},
				deep: true
			},
			/**
			 * @description 监听路由变化而映射的过滤条件
			 */
			requestData:{
				handler(data){
					// 初始化所有switch控件
					this.initSwitch(data)
				},
				deep: true
			},
			/**
			 * @description 监听路由变化中的orgId
			 */
			$route(new_route, old_route){
				if(new_route.query.orgId !== old_route.query.orgId){
					this.restructureListData(new_route.query.orgId)
				}
			}
		},
		mounted() {
			if(this.$route.query.orgId) {
				this.restructureListData(this.$route.query.orgId)
			} else if(this.$cookies.get('orgId')){
				this.restructureListData(this.$cookies.get('orgId'))
			}
			BUSINESS_NAVIGATION_API.get_all_tips({tipsKeys: this.keys.join()}).then(res => {
				if(res){
					this.tips_data = res
				}
			})
		},
		methods: {
			/**
			 * @description 初始化所有switch控件
			 * @param {object} data Index.vue传递过来的filter_obj,用来联动switch
			 */
			initSwitch(data){
				// 销量不达标
				this.listData[0].children[0].children[0].switch = data.bsSubstandard === 0 ? true : false
				// 连续两个月未成交
				this.listData[0].children[0].children[1].switch = data.bsTwoMonthNoDeal === 0 ? true : false
				// 未成交
				this.listData[0].children[0].children[2].switch = data.bsNoDeal === 0 ? true : false
				// 门店在营业所边界外
				this.listData[0].children[0].children[3].switch = data.outSideBorder === 0 ? true : false
				// 门店在营业所重叠区域
				this.listData[0].children[0].children[4].switch = data.overlapStore === 0 ? true : false
				// 门店编码错误
				this.listData[0].children[1].children[0].switch = data.codeError === 0 ? true : false
				// 门店地址无效
				this.listData[0].children[1].children[1].switch = data.addressInvalid === 0 ? true : false
				// 门店信息无效
				this.listData[0].children[1].children[2].switch = data.infoInvalid === 0 ? true : false
				// 门店名称无效
				this.listData[0].children[1].children[3].switch = data.nameInvalid === 0 ? true : false
				// 经纬度与地址不匹配
				this.listData[0].children[1].children[4].switch = data.mismatch === 0 ? true : false
				// 经纬度存在特殊地形
				this.listData[0].children[1].children[5].switch = data.special === 0 ? true : false
				// 缺少客户类型
				this.listData[0].children[1].children[6].switch = data.storeTypeError === 0 ? true : false
				// 缺少经纬度
				this.listData[0].children[1].children[7].switch = data.lcDefect === 0 ? true : false
				// 门店类型异常
				this.listData[0].children[1].children[8].switch = data.storeTypeAnomaly === 0 ? true : false
				// 客户经理缺失
				this.listData[0].children[1].children[9].switch = data.managerAbsence === 0 ? true : false
				// 与GAIA环境标签不匹配
				this.listData[0].children[1].children[10].switch = data.dataPoiRepetition === 0 ? true : false
			},

			/**
			 * @description 展开/折叠当下模块
			 * @param {item} 某数据层级
			 */
			handleSpread(item) {
				item.isSpread = !item.isSpread
			},

			/**
			 * @description 打开/关闭某个radio || 打开/关闭所有radios
			 * @param {item} 某数据层级
			 */
			handleSwitch(item) {
				// 更改后的radio数组
				let radios_result_array = []
				function getChildren(data, isOpen) {
					// 如果是子节点
					if (data.isLeaf) {
						data.switch = isOpen
						// 将所有改变的数据装载
						radios_result_array.push(data)
					}
					// 如果是父级节点
					if (data.children && data.children.length > 0) {
						data.children.forEach((cell) => {
							getChildren(cell, isOpen)
						})
					}
				}
				// 节点有switch按钮 旗下子节点状态和父节点switch按钮状态同步
				getChildren(item, item.switch)
				// 将此改变提交到父级组件
				this.$emit('changeRadio', radios_result_array)
			},

			// 请求问题门店的总览数据接口
			/**
			 * @description orgId变化时重新调用各个过滤器对应的店铺数量
			 * @param {orgId} 某层级id
			 */
			async restructureListData(orgId) {
				let data = await BUSINESS_NAVIGATION_API.get_structure_problem_pic_echart({orgId: orgId})
				if(data && data.length > 0){
					// 获取最顶级总数量
					this.listData[0].num = data[0].total
					for(let i = 0, length1 = data.length; i < length1; i++) {
						if(data[i].route === '业务异常'){
							this.listData[0].children[0].num = data[i].routeCount
						}
						if(data[i].route === '数据异常'){
							this.listData[0].children[1].num = data[i].routeCount
						}
						for(let j = 0, length2 = data[i].structureList.length; j < length2; j++){
							switch (data[i].structureList[j].channel) {
								case '销量不达标': {
									this.listData[0].children[0].children[0].num = data[i].structureList[j].channelCount
									break
								}
								case '连续两个月未成交': {
									this.listData[0].children[0].children[1].num = data[i].structureList[j].channelCount
									break
								}
								case '未成交': {
									this.listData[0].children[0].children[2].num = data[i].structureList[j].channelCount
									break
								}
								case '门店在营业所边界外': {
									this.listData[0].children[0].children[3].num = data[i].structureList[j].channelCount
									break
								}
								case '门店在营业所重叠区域': {
									this.listData[0].children[0].children[4].num = data[i].structureList[j].channelCount
									break
								}
								case '门店编码错误': {
									this.listData[0].children[1].children[0].num = data[i].structureList[j].channelCount
									break
								}
								case '门店地址无效': {
									this.listData[0].children[1].children[1].num = data[i].structureList[j].channelCount
									break
								}
								case '门店信息无效': {
									this.listData[0].children[1].children[2].num = data[i].structureList[j].channelCount
									break
								}
								case '门店名称无效': {
									this.listData[0].children[1].children[3].num = data[i].structureList[j].channelCount
									break
								}
								case '经纬度与门店地址不匹配': {
									this.listData[0].children[1].children[4].num = data[i].structureList[j].channelCount
									break
								}
								case '经纬度在特殊地形': {
									this.listData[0].children[1].children[5].num = data[i].structureList[j].channelCount
									break
								}
								case '缺少客户类型': {
									this.listData[0].children[1].children[6].num = data[i].structureList[j].channelCount
									break
								}
								case '经纬度缺失': {
									this.listData[0].children[1].children[7].num = data[i].structureList[j].channelCount
									break
								}
								case '门店类型异常': {
									this.listData[0].children[1].children[8].num = data[i].structureList[j].channelCount
									break
								}
								case '客户经理缺失': {
									this.listData[0].children[1].children[9].num = data[i].structureList[j].channelCount
									break
								}
								case '与GAIA环境标签不匹配': {
									this.listData[0].children[1].children[10].num = data[i].structureList[j].channelCount
									break
								}
							}
						}
					}
				}
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
	.store-filter-panel {
		width: 340px;
		height: 100%;
		position: relative;
		.scroll-wrapper {
			height: calc(100% - 60px);
			overflow-y: auto;
			.list-wrapper {
				.countNum{
					font-weight:normal;
				}
				.level1-block {
					height: 34px;
					background: #133773;
					text-align: left;
					position: relative;
					i.el-icon-caret-right {
						padding: 0 5px;
						transition: transform 0.3s;
						transform: rotate(0deg);
						cursor: pointer;
						&.active {
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
					.switch {
						position: absolute;
						right: 37px;
						bottom: 7px;
					}
				}
				.level1-list-wrap {
					height: 560px;
					overflow: hidden;
					transition: height 0.3s;
					.level1-list {
						.level2-block {
							text-align: left;
							padding-left: 10px;
							i.el-icon-caret-right {
								padding: 0 5px;
								transition: transform 0.3s;
								transform: rotate(0deg);
								cursor: pointer;
								&.active {
									transform: rotate(90deg);
								}
							}
							i.el-icon-question {
								color: #ffffff;
								padding-left: 5px;
							}
							.text {
								display: inline-block;
								height: 30px;
								background: #0a2757;
								line-height: 30px;
								font-size: 12px;
								font-weight: 600;
								color: #ffffff;
								text-align: left;
								cursor: pointer;
							}
						}
						.level2-list-wrap {
							padding-left: 10px;
							background: #102f63;
							// box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.5);
							box-shadow: 0px 12px 8px -12px rgba(0, 0, 0, 0.5);
							transition: height 0.3s;
							.level2-list {
								position: relative;
								padding-left: 32px;
								text-align: left;
								.icon-triangle {
									position: absolute;
									bottom: 8px;
									left: 20px;
									width: 14px;
									height: 14px;
									&.icon00 {
										background: url('../../../assets/img/icon_clmd@2x.png') center
											no-repeat;
										background-size: 14px 14px;
									}
									&.icon01 {
										background: url('../../../assets/img/icon_xbdb@2x.png') center
											no-repeat;
										background-size: 14px 14px;
									}
									&.icon02 {
										background: url('../../../assets/img/icon_lxly@2x.png') center
											no-repeat;
										background-size: 14px 14px;
									}
									&.icon03 {
										background: url('../../../assets/img/icon_wcj@2x.png') center
											no-repeat;
										background-size: 14px 14px;
									}
									&.icon04 {
										background: url('../../../assets/img/icon_clmd@2x.png') center
											no-repeat;
										background-size: 14px 14px;
									}
									&.icon10 {
										background: url('../../../assets/img/icon_mdbm@2x.png') center
											no-repeat;
										background-size: 14px 14px;
									}
									&.icon11 {
										background: url('../../../assets/img/icon_mddwx@2x.png')
											center no-repeat;
										background-size: 14px 14px;
									}
									&.icon12 {
										background: url('../../../assets/img/icon_mdmwx@2x.png')
											center no-repeat;
										background-size: 14px 14px;
									}
									&.icon13 {
										background: url('../../../assets/img/icon_mdxwx@2x.png')
											center no-repeat;
										background-size: 14px 14px;
									}
									&.icon14 {
										background: url('../../../assets/img/icon_jwdyd@2x.png')
											center no-repeat;
										background-size: 14px 14px;
									}
									&.icon15 {
										background: url('../../../assets/img/icon_jwdzd@2x.png')
											center no-repeat;
										background-size: 14px 14px;
									}
									&.icon16 {
										background: url('../../../assets/img/icon_jwdyd@2x.png')
											center no-repeat;
										background-size: 14px 14px;
									}
									&.icon17 {
										background: url('../../../assets/img/icon_xbdb@2x.png')
											center no-repeat;
										background-size: 14px 14px;
									}
									&.icon18 {
										background: url('../../../assets/img/icon_mdxwx@2x.png')
											center no-repeat;
										background-size: 14px 14px;
									}
									&.icon19 {
										background: url('../../../assets/img/icon_mddwx@2x.png')
											center no-repeat;
										background-size: 14px 14px;
									}
									&.icon110 {
										background: url('../../../assets/img/icon_jwdzd@2x.png')
											center no-repeat;
										background-size: 14px 14px;
									}
								}
								.text {
									display: inline-block;
									margin-right:4px;
									padding-left: 10px;
									height: 30px;
									line-height: 30px;
									font-size: 12px;
									font-weight: 600;
									color: #ffffff;
								}
								.switch {
									position: absolute;
									right: 37px;
									bottom: 5px;
								}
							}
						}
					}
					.level1-list:nth-child(1) {
						.level2-list-wrap {
							height: 150px;
							overflow: hidden;
						}
						.hideSwitch {
							height: 0;
						}
					}
					.level1-list:nth-child(2) {
						.level2-list-wrap {
							height: 330px;
							overflow: hidden;
						}
						.hideSwitch {
							height: 0;
						}
					}
				}
				.hideSwitch {
					height: 0;
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