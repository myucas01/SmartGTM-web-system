<template>
	<!-- 商圈分级：商圈明细页 -->
	<div id="business_district_detail_page">
		<div class="business_district_scheme_detail_frame">
			<!--商圈等级修改表单-->
			<el-dialog
				title="调整商圈"
				:visible.sync="is_show_dialog"
				width="25%"
				custom-class='downloadDialog'
				@close='closeDialog'>
				<!--表单内容-->
				<div class='changeLevelForm'>
					<div class='perContainer'>
						<label class="inputLabel">商圈名称：</label> <span class='baseInput'>{{changed_scheme_name}}</span>
					</div>
					<div class='perContainer'>
						<label class="inputLabel">总部商圈等级：</label>
						<el-select v-model="changed_level_value" @change='changeLevel' placeholder="请选择" class="baseInput" size="mini">
							<el-option v-for="item in changed_level_options" :key="item.code" :label="item.name" :value="item.code"></el-option>
						</el-select>
					</div>
					<div class='perContainer' v-show='is_changed'>
						<label class="inputLabel"><span class='redStar'>*</span>商圈调整原因：</label>
						<el-select v-model="changed_reason" @change='changeReason' placeholder="请选择" class="baseInput" size="mini">
							<el-option v-for="item in reason_options" :key="item.typeNo" :label="item.typeName" :value="item.typeNo"></el-option>
						</el-select>
					</div>
					<div class='perContainer textareaContainer' v-show='is_changed'>
						<label class="inputLabel"><span class='redStar'>*</span>详情描述：</label>
						<el-input
							class='textareaInput'
							type="textarea"
							:rows="2"
							placeholder="请输入内容"
							v-model="changed_reason_detail">
						</el-input>
					</div>
				</div>
				<!--提交按钮-->
				<span slot="footer" class="dialog-footer">
					<el-button @click="closeDialog">取 消</el-button>
					<el-button type="primary" @click="submitChangedLevelForm">确 定</el-button>
				</span>
			</el-dialog>
			<div class="listTopHead">
				<p class="listTopHeadTitle">{{pro_year}}年商圈布局-商圈明细</p>
				<a class="exportTableButton" v-auth='"business:layout:detail:import"' :href='
				"/api/business/grading/detail/export?programNo=" + list_query.programNo + "&" +
				"businessName=" + list_query.businessName + "&" +
				"businessLevel=" + list_query.businessLevel + "&" +
				"isExport=" + true + "&" +
				"orgId=" + list_query.orgId + "&" +
				"pageNum=" + list_query.pageNum + "&" +
				"pageSize=" + list_query.pageSize + "&" +
				"orgType=" + current_org_type'>
					<i class="el-icon-download exportSchemeIcon"></i> 导出明细
				</a>
			</div>
			<!-- 商圈数量统计模块 -->
			<div class="numStatisticsContainer">
				<!--- 模块头 -->
				<div class="moduleHeader">
					商圈数量统计
				</div>
				<!-- 统计模块/隐藏/显示 -->
				<div class="echartsModule">
					<!--组织架构过滤1-->
					<div class="numStatisticsFilter">
						<label class="label">组织架构</label>
						<el-cascader
							v-model="echarts_cascader_value"
							placeholder="请选择"
							class="baseInput"
							size="small"
							:options="echarts_cascader_data"
							:props="{ checkStrictly: true, value: 'id', label: 'name' }"
							@change="echartsCascaderChange"
							filterable
						>
						</el-cascader>
					</div>
					<!--顶部table-->
					<div class="echartsContainer">
						<!--左table-->
						<div class="leftChartContainer">
							<div class="echartsTitleStr">各商圈数量占比</div>
							<el-table
								:data="left_table_data"
								v-loading="leftloading"
								height="300"
								border
								class='leftTable'
								style="width: 95%"
								header-row-class-name="numHeader">
									<el-table-column
										prop="businessLevelName"
										label="商圈等级"
										width="214"
										align="center">
									</el-table-column>
									<el-table-column
										prop="value"
										label="数量"
										width="100"
										align="center">
										<template slot-scope="scope">
											{{ scope.row.value | numFormat }}
										</template>
									</el-table-column>
									<el-table-column
										prop="businessProportion"
										label="占比"
										align="center">
									</el-table-column>
							</el-table>
							<!-- <div class="legendList">
								<div class="perLegend" v-for="(item, index) in pieData" :key="index">
									<span class="colorBlock" :style="{ background: item.color }">
									</span>{{ item.businessLevelName }}（{{ item.value }}个/{{item.businessProportion}}）
								</div>
							</div>
							<div class="percentPart">
								<div class="totalNum">共 {{ pie_total_num }} 个</div>
								<chart :options="pieOption" />
							</div> -->
						</div>
						<!--右table-->
						<div class="rightChartContainer">
							<div class="echartsTitleStr">下辖各组织的商圈明细</div>
							<el-table
								:data="right_table_data"
								v-loading="rightloading"
								height="300"
								border
								class='leftTable'
								style="width: 95%"
								header-row-class-name="numHeader">
									<el-table-column show-overflow-tooltip v-for='(per_header, index) in right_table_header'
										:prop="per_header.name"
										:label="per_header.name"
										:key='index'
										min-width= '120'
										align="center"
									>
										<template slot-scope="scope">
											<span class="totalNumStyle" v-if="per_header.name !== '组织'">{{ scope.row[scope.column.property] | numFormat }}</span>
											<span v-else>{{
												scope.row[scope.column.property]
											}}</span>
										</template>
									</el-table-column>
							</el-table>
							<!-- <div class="legendList rightLegendList">
								<div
									class="perLegend"
									v-for="(item, index) in overlayBarData"
									:key="index"
								>
									<span class="colorBlock" :style="{ background: item.color }">
									</span
									>{{ item.name }}
								</div>
							</div>
							<div class="numsPart">
								<chart :options="overlayBarOption" />
							</div> -->
						</div>
					</div>
				</div>
			</div>

			<!-- 商圈数量详细列表 -->
			<div class="numStatisticsListContainer">
				<!--过滤器-->
				<div class="numStatisticsListFilter">
					<label class="label">组织架构</label>
					<el-cascader
						v-model="table_cascader_value"
						placeholder="请选择"
						class="baseInput"
						size="small"
						:options="table_cascader_data"
						:props="{ checkStrictly: true, value: 'id', label: 'name' }"
						@change="tableCascaderChange"
						filterable
					>
					</el-cascader>
					<label class="label">商圈等级</label>
					<el-select
						v-model="level_value"
						placeholder="请选择"
						class="baseInput levelInput"
						size="small"
						@change="levelChange"
					>
						<el-option
							v-for="item in level_options"
							:key="item.code"
							:label="item.name"
							:value="item.code"
						>
						</el-option>
					</el-select>
					<label class="label">商圈名称</label
					><el-input
						type="text"
						class="baseInput nameInput"
						size="mini"
						v-model="scheme_name"
						@change="schemeNameChange"
					></el-input>
					<el-button size="small" class="formButtons submitButton" @click='submitForm'>查询</el-button>
					<el-button size="small" class="formButtons resetButton" @click='resetForm'>重置</el-button>
				</div>
				<div class="tableListContainer">
					<el-table
						:data="tableData"
						v-loading="bottomloading"
						border
						style="width: 100%"
						header-row-class-name="numHeader"
						:cell-style= 'formatterCell'
					>
						<el-table-column show-overflow-tooltip v-for='(per_header, index) in tableHeaderData'
							:prop="per_header.headerKey"
							:label="per_header.headerName"
							:key='index'
							min-width= '120'
							align="center"
						>
							<template slot-scope="scope">
								<span :class='{beClicked: per_header.headerKey === "businessLeaderName" && org_type < 0}' @click='openDialog(per_header.headerKey, scope.row)'>{{ scope.row[per_header.headerKey] || '--' }}</span>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="paginationFooter">
					<el-pagination
						background
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page="page_current_page_num"
						:page-sizes="[10, 20]"
						:page-size="page_per_page_num"
						layout="total, sizes, prev, pager, next, jumper"
						:total="page_total_num"
					>
					</el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	/*-----  导入API ------*/
	import BUSINESS_DISTRICT_API from '../../../api/business_district_api'

	export default {
		name: 'businessDistrictDetail',
		title() {
			return '商圈布局-商圈明细'
		},
		data() {
			return {
				/* -------------------------- 顶部table模块（左+右） -------------------------- */
				// 左边元数据
				left_table_data: [],
				// 右边表头
				right_table_header:[],
				// 右边元数据
				right_table_data:[],
				// echarts 组织架构元数据
				echarts_cascader_data: [],
				// echarts 组织架构值
				echarts_cascader_value: '',
				// 修改orgId后获取新的orgType
				current_org_type: '',
				// 获取echarts过滤表单 orgId
				echarts_org_id: '',
				/* -------------------------- 底部table模块 -------------------------- */
				// table 组织架构元数据
				table_cascader_data: [],
				// table 组织架构值
				table_cascader_value: '',
				// 获取table过滤表单 orgId
				table_org_id: '',
				// 底部table请求参数
				list_query: {
					// 方案id
					programId: '',
					// 商圈等级
					businessLevel: '',
					// 商圈名
					businessName: '',
					// 是否导出
					isExport: false,
					// 组织id
					orgId: '',
					// 当前页数
					pageNum: 1,
					// 每页大小
					pageSize: 10
				},
				// 商圈等级
				level_options: [],
				// 当前等级值
				level_value: '',
				// 商圈名
				scheme_name: '',
				// table列表
				tableData: [],
				// table表头
				tableHeaderData: [],
				// 分页：总条数
				page_total_num: 0,
				// 分页：当前页
				page_current_page_num: 1,
				// 分页：每页多少条
				page_per_page_num: 10,
				// 方案年份
				pro_year: '',
				cell_style_obj: {'text-align': 'right'},

				/*---------- 修改商圈等级 --------- */
				// 调整商圈级别弹窗是否显示
				is_show_dialog: false,
				// 是否显示原因和详情
				is_changed: false,
				// 要修改的层级项列表
				changed_level_options:[],
				// 商圈调整原因列表
				reason_options:[],
				// 修改原因code
				changed_reason: '',
				// 修改原因名
				changed_reason_name: '',
				// 详细描述
				changed_reason_detail: '',
				// 修改后的等级值
				changed_level_value: '',
				// 修改后的等级中文名
				changed_level_name: '',
				// 副本
				changed_level_value_copy: '',
				// 要修改的商圈名
				changed_scheme_name: '',
				// 用户权限级别(从cookie取值)
				org_type: '',
				// 当前被点击的行对象
				current_row: '',
				leftloading: true,
				rightloading: true,
				bottomloading: true
			}
		},
		
		/**
		 * @description 在进入之前添加选项卡
		 */
		beforeRouteEnter(to, from, next) {
			console.log('to', to.fullPath)
			next((vm) => {
				// 通过 `vm` 访问组件实例
				vm.$store.commit('addTabs', {
					title: to.query.proYear + '商圈布局-商圈明细',
					link: to.fullPath,
					on: false,
					needCatch: true,
					isPathNameCheck: true
				})
			})
		},
		mounted() {
			// 初始化年份（顶部大标题）
			this.pro_year = this.$route.query.proYear
			// 初始化顶部table组织id
			this.echarts_cascader_value = this.$route.query.orgId

			// 初始化底部table列表组织id
			this.table_cascader_value = this.$route.query.orgId
			// 初始化table列表商圈等级
			this.level_value = this.$route.query.orgType ? parseInt(this.$route.query.orgType) : ''

			// 初始化echarts和table组织架构，两者会复制一份
			this.getEchartsTableOrgs({
				proId: this.$route.query.proId || '',
				isLoading: false
			})

			// 初始化顶部table
			this.getEcharts({
				programNo: this.$route.query.proNumber || '',
				orgId: this.$route.query.orgId || '',
				orgType: this.$route.query.orgType || ''
			})
			this.current_org_type = this.$route.query.orgType || ''

			// 初始化商圈等级下拉列表
			BUSINESS_DISTRICT_API.get_detail_level({
				programNo: this.$route.query.proNumber || '',
				isLoading: false
			}).then(data => {
				this.level_options = data
				// 复制一份给弹窗中的层级选项
				this.changed_level_options = [...data]
				// 增加全部
				this.level_options.unshift(
					{
						name: '全部',
						code: '',
					}
				)
			})

			// 获取table列表传参，并获取列表
			this.list_query.programNo = this.$route.query.proNumber || ''
			this.list_query.businessLevel = this.$route.query.orgType || ''
			this.list_query.orgId = this.$route.query.orgId || ''
			this.getTableList(this.list_query)
			// 获取当前用户的级别
			this.org_type = parseInt(this.getCookie('orgType'))
			// 获取修改商圈等级的原因列表
			BUSINESS_DISTRICT_API.get_reasons({isLoading: false}).then(data => {
				if(data) {
					this.reason_options = data
				}
			})
		},
		methods: {
			/**
			 * @description 获取对应字段的cookie值
			 * @param { string } name cookie的名字
			 */
			getCookie(name){
				// 获取cookie字符串 => 数组
				let cookie_str = document.cookie
				let cookie_arr = cookie_str.split("; ")
				//遍历匹配
				for ( let i = 0; i < cookie_arr.length; i++) {
					let cookie = cookie_arr[i].split("=");
					if (cookie[0] === name){
						return cookie[1];
					}
				}
				return "";
			},

			/**
			 * @description 打开对话框
			 * @param { string } column_key 列的key值，只有权限为最高级且匹配对应字段后才能触发
			 * @param { object } row_obj 当前行的数据，用来获取商圈值、等级值
			 */
			openDialog(column_key, row_obj) {
				this.current_row = row_obj
				/**
				 * 全国：businessLeaderName - businessLeaderLevel
				 * 地方：businessEmployeeName - businessEmployeeLevel
				 * 建议：businessAiName - businessAiLevel
				 */
				if(column_key === 'businessLeaderName' && this.org_type < 0) {
					this.changed_scheme_name = row_obj.businessName
					// 如果地方商圈等级存在，则获取名字
					if(row_obj.businessEmployeeLevel) {
						this.changed_level_value_copy = row_obj.businessEmployeeLevel
					} else {
						// 否则获取系统建议等级
						if(row_obj.businessAiName) {
							this.changed_level_value_copy = row_obj.businessAiLevel
						}
					}
					this.is_show_dialog = true
				}
			},

			/**
			 * @description 修改商圈级别
			 * @param { string } value 修改后的值
			 */
			changeLevel(value) {
				// 获取中文名
				this.changed_level_options.forEach(item => {
					if(item.code === value) {
						this.changed_level_name = item.name
					}
				})
				// 如果和原来一样
				if(value === this.changed_level_value_copy) {
					// 清空原因
					this.changed_reason = ''
					// 清空详情描述
					this.changed_reason_detail = ''
					// 隐藏调整原因和详情描述
					this.is_changed = false
				} else {
					// 不一样则显示原因+详细描述
					this.is_changed = true
				}
			},

			/**
			 * @description 修改原因后的回调
			 * @param { string } value 修改后的值
			 */
			changeReason(value) {
				// 获取中文名
				this.reason_options.forEach(item => {
					if(item.typeNo === value) {
						this.changed_reason_name = item.typeName
					}
				})
				// 如果和原来一样
				if(value === this.changed_level_value_copy) {
					// 清空原因
					this.changed_reason = ''
					this.changed_reason_name = ''
					// 清空详情描述
					this.changed_reason_detail = ''
					// 隐藏调整原因和详情描述
					this.is_changed = false
				} else {
					// 不一样则显示原因+详细描述
					this.is_changed = true
				}
			},

			/**
			 * @description 提价修改后的表单
			 */
			submitChangedLevelForm() {
				// 如果改变了商圈等级
				if(this.is_changed) {
					// 如果没修改原因-禁止提交
					if(this.changed_reason === '') {
						this.$message.error('请选择一个原因')
						return
					}
					// 如果没修改详细原因-禁止提交
					if(this.changed_reason_detail.trim() === '') {
						this.$message.error('必须填写详细说明')
						return
					}
					// 提交表单
					BUSINESS_DISTRICT_API.submit_modification_form({
						// 方案编码
						proNo: this.$route.query.proNumber,
						// 商圈编码
						businessNo: this.current_row.businessNo,
						// 商圈名称
						businessName: this.current_row.businessName,
						// 改变后的层级code
						levelLeader: this.changed_level_value,
						// 改变后的层级名
						levelLeaderName: this.changed_level_name,
						// 系统建议等级名
						levelAiName: this.current_row.businessAiName,
						businessLevelVO:{
							// 商圈编码
							businessNo: this.current_row.businessNo,
							// 原因编码
							typeNo: this.changed_reason,
							// 原因名
							typeName: this.changed_reason_name,
							// 调整详情
							typeContent: this.changed_reason_detail
						},
						isLoading: false
					}).then(data => {
						if(data) {
							this.$message({
								message: data,
								type: 'success'
							})
							// 关闭窗口
							this.closeDialog()
							// 重新调用列表接口
							this.submitForm()
						}
					})

				} else {
					this.$message({
						message: '您需要修改级别！',
						type: 'warning'
					})
				}
			},

			/**
			 * @description 关闭弹窗
			 */
			closeDialog() {
				// 关闭dialog
				this.is_show_dialog = false
				// 清空所选层级
				this.changed_level_value = '',
				this.changed_level_name = ''
				// 隐藏原因+详细原因
				this.is_changed = false
				// 清空修改原因
				this.changed_reason = ''
				// 清空详细描述
				this.changed_reason_detail = ''
			},
			
			/**
			 * @description 获取echarts和table列表的组织架构
			 * @param { Object } params 只包含方案id
			 */
			getEchartsTableOrgs(params) {
				params.isLoading= false
				BUSINESS_DISTRICT_API.get_org_level(params).then((data) => {
					if (data) {
						this.echarts_cascader_data = this.initEmptyArrToStr(data)
						// 复制一份
						this.table_cascader_data = JSON.parse(JSON.stringify(this.echarts_cascader_data))
					}
				})
			},

			/**
			 * @description 将层级data的children: [] => ''，从而解决显示空面板问题
			 * @param { array<object> } data 组织架构层级数据
			 */
			initEmptyArrToStr(data){
				for(let i = 0, length = data.length; i < length; i++){
					if(data[i].children && data[i].children.length > 0){
						this.initEmptyArrToStr(data[i].children)
					} else {
						data[i].children = ''
					}
				}
				return data
			},

			/**
			 * @description 获取顶部两个table列表
			 * @param { Object } params 包含方案编号，组织id，组织层级
			 */
			getEcharts(params) {
				params.isLoading= false
				BUSINESS_DISTRICT_API.get_detail_charts(params).then((data) => {
					this.left_table_data = data.businessCircles
					this.right_table_header = data.tableHeadName
					this.right_table_data = data.tableData
					this.leftloading = false
					this.rightloading = false
					this.bottomloading = false
					/*-- 初始化饼图 --*/
					// 初始化饼图总数据
					// this.pie_total_num = data.pieChart.businessTotal
					// 初始化饼图配置项
					// this.pieData = data.pieChart.proportionInfo
					// this.pieOption = pieOption(data.pieChart.proportionInfo)

					/*-- 初始化柱状图 --*/
					// this.overlayBarData = data.histogram.overlayBarData
					// this.overlayBarOption = overlayBarChart(
					// 	data.histogram.overlayBarCategory,
					// 	data.histogram.overlayBarData
					// )
				})
			},

			/**
			 * @description echarts过滤orgId后回调
			 * @param { Array<string> } org_id_arr 包含一系列的级联orgId数组
			 */
			echartsCascaderChange(org_id_arr) {
				console.log('echarts-cas值变化：', org_id_arr[org_id_arr.length - 1])
				// 如果勾选了
				if (org_id_arr.length > 0) {
					this.getOrgTypeFromOrgId(org_id_arr[org_id_arr.length - 1], this.echarts_cascader_data)
					this.getEcharts({
						programNo: this.$route.query.proNumber,
						orgId: org_id_arr[org_id_arr.length - 1],
						orgType: this.current_org_type
					})
				}
			},

			/**
			 * @description 递归：将orgId映射为orgType
			 * @param { string } org_id 当前选中的orgId
			 * @param { Array<object> } data echarts组织架构对象通过children遍历
			 */
			getOrgTypeFromOrgId(org_id, data) {
				for(let i = 0, length = data.length; i < length; i++){
					if(data[i].id === org_id){
						this.current_org_type = data[i].orgType
						break
					} else {
						this.getOrgTypeFromOrgId(org_id, data[i].children)
					}
				}
			},

			/**
			 * @description 获取底部table列表
			 * @param { Object } params
			 */
			getTableList(params) {
				BUSINESS_DISTRICT_API.get_detail_list(params).then(data => {
					if(data){
						// 获取列表
						this.tableData = data.list || []
						// 获取表头
						this.tableHeaderData = data.headerList
						// 总数
						this.page_total_num = data.total
						// 第几页
						// this.page_current_page_num = data.pageNum
						// 每页多少条
						// this.page_per_page_num = data.pageSize
					}
				})
			},

			/**
			 * @description 格式化某些字段的单元格
			 * @param { object } cell_obj,{row, column, rowIndex, columnIndex} 
			 */
			formatterCell(cell_obj) {
				switch (cell_obj.column.property) {
					case 'capacityPerCapita': {
						if(!cell_obj.row['capacityPerCapita']) {
							return
						}
						return this.cell_style_obj
					}
					case 'capacityIndex': {
						if(!cell_obj.row['capacityIndex']) {
							return
						}
						return this.cell_style_obj
					}
					case 'capacityPopulation': {
						if(!cell_obj.row['capacityPopulation']) {
							return
						}
						return this.cell_style_obj
					}
					case 'capacity': {
						if(!cell_obj.row['capacity']) {
							return
						}
						return this.cell_style_obj
					}
					case 'housePrices': {
						if(!cell_obj.row['housePrices']) {
							return
						}
						return this.cell_style_obj
					}
					case 'housePricesUser': {
						if(!cell_obj.row['housePricesUser']) {
							return
						}
						return this.cell_style_obj
					}
					case 'avgHousePrices': {
						if(!cell_obj.row['avgHousePrices']) {
							return
						}
						return this.cell_style_obj
					}
				}
			},

			/**
			 * @description 商圈等级更改后回调
			 */
			levelChange() {
				this.list_query.businessLevel = this.level_value
			},

			/**
			 * @description table过滤orgId后回调
			 * @param { Array<string> } org_id_arr 包含一系列的级联orgId数组
			 */
			tableCascaderChange(org_id_arr) {
				// 如果勾选了
				if (org_id_arr.length > 0) {
					this.list_query.orgId = org_id_arr[org_id_arr.length - 1]
				} else {
					// 还原为初始化的状态
					this.list_query.orgId = this.$route.query.orgId
				}
			},

			/**
			 * @description 商圈名改变后回调
			 */
			schemeNameChange() {
				this.list_query.businessName = this.scheme_name
			},

			/**
			 * @description 每页最大值变化
			 * @param {Number} max_num_per_page 每页最大条数
			 */
			handleSizeChange(max_num_per_page) {
				console.log('每页最大值：', max_num_per_page)
				this.list_query.isExport = false
				this.list_query.pageSize = max_num_per_page
				this.getTableList(this.list_query)
			},

			/**
			 * @description 当前页改变
			 * @param {Number} current_page 当前页码
			 */
			handleCurrentChange(current_page) {
				console.log('当前页数：', current_page)
				this.list_query.isExport = false
				this.list_query.pageNum = current_page
				this.getTableList(this.list_query)
			},

			/**
			 * @description 提交查询
			 */
			submitForm() {
				this.list_query.isExport = false
				this.getTableList(this.list_query)
			},

			/**
			 * @description 重置表单
			 */
			resetForm() {
				// 组织架构清空
				this.table_cascader_value = ''
				this.list_query.orgId= ''
				// 商圈等级清空
				this.level_value = ''
				this.list_query.businessLevel= ''
				// 商圈名清空
				this.scheme_name = ''
				this.list_query.businessName= ''
				// 分页：当前页
				this.list_query.pageNum = 1
				this.page_current_page_num = 1,
				// 分页：每页多少条
				this.list_query.pageSize = 10
				this.page_per_page_num = 10
				this.getTableList(this.list_query)
			},


			/**
			 * @description 导出文件
			 */
			exprotTable() {
				this.list_query.isExport = true
				this.getTableList(this.list_query)
			}
		}
	}
</script>

<style scoped lang="scss">
	div,
	section,
	article,
	p {
		box-sizing: border-box;
	}
	#business_district_detail_page {
		color: #000000;
		background-color: #f0f2f5;
		width: 100%;
		overflow-y: auto;
		.business_district_scheme_detail_frame {
			width: 1200px;
			margin-left: auto;
			margin-right: auto;
			.listTopHead {
				text-align: center;
				position: relative;
				.listTopHeadTitle {
					font-size: 24px;
					color: #1e2840;
					font-weight: bold;
					margin-top: 32px;
				}
				.exportTableButton {
					position: absolute;
					z-index: 1;
					right: 104px;
					top: 2px;
					color: #ffffff;
					width: 88px;
					height: 28px;
					line-height: 28px;
					background: #930cea;
					border-radius: 4px;
					cursor: pointer;
				}
				.newSchemeButton {
					right: 0px;
				}
			}
			.moduleHeader {
				width: 1198px;
				height: 40px;
				line-height: 40px;
				background: #ffffff;
				border-bottom: 1px solid #ced3dd;
				border-radius: 2px;
				padding-left: 30px;
				font-size: 16px;
			}
			.numStatisticsContainer {
				height: 470px;
				background-color: #ffffff;
				border: 1px solid #dfe6ed;
				margin-top: 20px;
				.echartsModule {
					.numStatisticsFilter {
						font-size: 14px;
						margin-left: 34px;
						margin-top: 16px;
						.label {
							color: #87888b;
							margin-right: 10px;
						}
					}
					.echartsContainer {
						margin-top: 14px;
						display: flex;
						justify-content: space-between;
						.leftChartContainer,
						.rightChartContainer {
							width: 440px;
							height: 350px;
							border: 1px solid #e2e2e2;
							margin-left: 18px;
							.echartsTitleStr {
								text-align: center;
								font-size: 14px;
								margin-top: 12px;
							}
						}
						.leftTable{
							margin-left:auto;
							margin-right:auto;
							margin-top:10px;
						}
						.rightChartContainer {
							width: 710px;
							margin-right: 14px;
						}
					}
				}
			}
			.numStatisticsListContainer {
				margin-top: 16px;
				background-color: #ffffff;
				border: 1px solid #dfe6ed;
				margin-bottom: 20px;
				.numStatisticsListFilter {
					margin-top: 20px;
					margin-left: 14px;
					margin-bottom: 20px;
					.label {
						margin-right: 10px;
						font-size: 14px;
						color: #87888b;
					}
					.baseInput {
						margin-right: 26px;
					}
					.nameInput {
						width: 180px;
						height: 32px;
					}
					.formButtons {
						background-color: #930cea;
						color: #ffffff;
						font-size: 12px;
						width: 80px;
						border-radius: 4px;
					}
					.resetButton {
						border: 1px solid #dcdfe6;
						background-color: transparent;
						color: #000000;
						margin-left: 20px;
					}
				}
				.tableListContainer {
					width: 1164px;
					margin-left: auto;
					margin-right: auto;
					margin-bottom: 20px;
					.numHeader {
						background-color: #f8f8f9;
						color: #3d3d3d;
					}
					.beClicked{
						cursor:pointer;
						color:#930cea;
					}
				}
				.paginationFooter {
					margin-bottom: 20px;
					margin-left: 20px;
				}
			}
			.changeLevelForm{
				.perContainer{
					display: flex;
					margin-bottom:20px;
				}
				.textareaContainer{
					display: flex;
				}
				.baseInput{
					width:300px;
				}
				.inputLabel{
					display: inline-block;
					width:104px;
					text-align: right;
				}
				.textareaInput{
					width:300px;
					display: inline-block;
				}
				.redStar{
					color: red;
				}
			}
		}
	}
</style>
<style lang="scss">
	#business_district_detail_page {
		.el-input--mini .el-input__inner {
			height: 32px;
		}
		.numHeader {
			th {
				background-color: #f8f8f9;
				color: #3d3d3d;
				font-weight: bold;
				padding-top: 10px;
				padding-bottom: 10px;
			}
		}
	}
</style>
