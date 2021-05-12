<template>
	<!-- 商圈分级：复用方案列表页-->
	<div id="business_district_scheme_copy_list">
		<div class="business_district_scheme_list_frame">
			<div class="listTopHead">
				<p class="listTopHeadTitle">方案选择</p>
			</div>
			<!--过滤器-->
			<div class='funModule'>
				<div class='moduleHeader'>
					请录入基本信息
				</div>
				<div class='moduleForm'>
					<div class='perInput'>
						<label class='label'><i class='necessaryStar'>*</i>商圈布局名称</label><el-input type="text"  placeholder="请输入" class="baseInput" v-model='scheme_name' size="mini" clearable></el-input>
					</div>
					<div class='perInput'>
						<label class='label'><i class='necessaryStar'>*</i>商圈布局财年</label>
						<el-select v-model="year_value" placeholder="请选择" class="baseInput" size="small" clearable>
							<el-option
								v-for="item in years"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</div>
					<div class='perInput'>
						<label class='label'><i class='necessaryStar'>*</i>商圈布局季度</label>
						<el-select v-model="season_value" placeholder="请选择" class="baseInput" size="small" clearable>
							<el-option
								v-for="item in seasons"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</div>
				</div>
			</div>
			<div class="listContainer">
				<div class='moduleHeader'>
					请选择复用方案
				</div>
				<div  v-infinite-scroll="load" style="overflow:auto">
				<div class="perScheme" v-for="(item, index) in list_data" :key="index">
					<!--leftPart 将抽象为一个模板文件-->
					<div class="leftPart">
						<div class="part1">
							<span class="schemeName">{{item.proName}}</span>
							<div class="tags doingTag" v-if='item.proStatus === 1'>规划中</div>
							<div class="tags effectiveTag" v-if='item.proStatus === 2'>已生效</div>
							<div class="tags uneffectiveTag" v-if='item.proStatus === 3'>未生效</div>
						</div>
						<div class="part2">
							<div class="perLine yearLine">
								商圈布局财年：<span class="dateStr">{{item.proYear}}</span> 创建时间：<span class="dateStr">{{item.createTime}}</span>
							</div>
							<div class="perLine seasonLine">
								商圈布局季度：<span class="dateStr">{{item.proQuarter}}</span> 修改时间：<span class="dateStr">{{item.updateTime}}</span>
							</div>
						</div>
						<div class="part3">
							<span class="tableTitle">商圈数量：</span>
							<div class="numberList" v-if='item.projectSta'>
								<el-table
									:data="item.projectSta.tableData"
									border
									header-row-class-name="numHeader"
									cell-class-name="numCell"
									style="width: 640px"
								>
									<el-table-column
										:prop="item.name"
										:label="item.name"
										v-for="(item, index) in item.projectSta.tableHeadName"
										:key="index"
										:fixed="item.name === '合计' ? 'right' : false"
									>
										<template slot="header">
											<span
												class="totalNumLabelStyle"
												v-if="item.name === '合计'"
												>{{ item.name }}</span
											>
											<span v-else>{{ item.name }}</span>
										</template>
										<template slot-scope="scope">
											<span class="totalNumStyle" v-if="item.name === '合计'">{{
												scope.row[scope.column.property] | numFormat
											}}</span>
											<span v-else>{{
												scope.row[scope.column.property] | numFormat
											}}</span>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</div>
					</div>
					<div class="rightPart">
						<div class="ctrlButton" :class='{checkedButton: current_scheme_ID === item.proNo}' @click='chooseThis(item.proNo)'>
							<i class="el-icon-check newSchemeIcon"></i> 复用此方案
						</div>
					</div>
				</div>
				</div>
			</div>
			<div class='submitButtons'>
				<div class='perSubmitButton cancelButton' @click='goBackToSchemeList'>取消</div>
				<div class='perSubmitButton confirmButton' v-auth='"business:layout:multiplexing"' @click='confirmCopy()'>确认复用</div>
			</div>
		</div>
	</div>
</template>

<script>
	/*-----  导入API ------*/
	import BUSINESS_DISTRICT_API from '../../../api/business_district_api'
	export default {
		name: 'businessDistrictSchemeCopyList',
		components: {},
		title() {
			return '商圈布局-复用方案列表页'
		},
		data() {
			return {
				// 数据列表
				list_data: [],
				// 商圈名字
				scheme_name:'',
				// 商圈财年
				years: [],
				year_value: '',
				// 商圈季度
				seasons: [{
					value: 'Q1',
					label: 'Q1'
					}, {
					value: 'Q2',
					label: 'Q2'
					}, {
					value: 'Q3',
					label: 'Q3'
					}, {
					value: 'Q4',
					label: 'Q4'
					}],
				season_value: '',
				// 商圈
				tableHeaderName: [],
				tableData: [],
				// 当前选中的方案id
				current_scheme_ID: '',
				allData: [], // 总数据
				scrollIndex: 0, // 当前定位
			}
		},
		/**
		 * @description 在进入之前添加选项卡
		 */
		beforeRouteEnter(to, from, next) {
			next((vm) => {
				// 通过 `vm` 访问组件实例
				vm.$store.commit('addTabs', {
					title: '复用方案',
					link: to.fullPath,
					on: false,
					needCatch: true
				})
			})
		},
		mounted() {
			// 初始化获取方案列表数据
			this.getProList()
			// 初始化财年
			let current_year = new Date().getFullYear()
			for (let i = -2; i < 48; i++) {
				let item = {
					value: current_year + i,
					label: current_year + i
				}
				this.years.push(item)
			}
		},
		methods: {
			// 触底懒加载数据
			load () {
				if(this.scrollIndex < this.allData.length){
					//有数据懒加载更多5行
					this.list_data = this.allData.slice(0, this.scrollIndex + 20)
					this.scrollIndex = this.scrollIndex + 20
				} else {
					//没有数据
					return
				}
			},

			/**
			 * @description 获取方案列表数据
			 * @param { string } year_str 当前财年，如果为空则为全部数据
			 */
			async getProList() {
				this.allData = await BUSINESS_DISTRICT_API.get_district_list()
				// 初始5行，设置默认5
				this.list_data = this.allData.slice(0,5)
				this.scrollIndex = 5
			},

			/**
			 * @description 勾选某个方案
			 * @param { number } scheme_id 当前方案id
			 */
			chooseThis(scheme_id) {
				// 高亮勾选
				this.current_scheme_ID = scheme_id
			},

			/**
			 * @description 返回方案列表
			 */
			goBackToSchemeList() {
				this.$router.go(-1)
			},

			/**
			 * @description 提交某个方案
			 */
			confirmCopy() {
				if(this.scheme_name.trim().length === 0) {
					this.$alert('请填写一个方案名！', '提示', {
						confirmButtonText: '确定'
					})
					return
				}
				if(!this.year_value) {
					this.$alert('请选择一个财年！', '提示', {
						confirmButtonText: '确定'
					})
					return
				}
				if(!this.season_value) {
					this.$alert('请选择一个季度！', '提示', {
						confirmButtonText: '确定'
					})
					return
				}
				if(!this.current_scheme_ID) {
					this.$alert('请选择一个复用方案！', '提示', {
						confirmButtonText: '确定'
					})
					return
				}
				BUSINESS_DISTRICT_API.post_copy_project({
						"proDate": this.year_value,
						"proNo": this.current_scheme_ID,
						"proName": this.scheme_name,
						"proQuarter": this.season_value
					}
				).then((data) => {
					if(data){
            this.$message({
              message: '复用数据提交成功！',
              type: 'success'
            })
            this.$router.go(-1)
						// this.$alert('复用成功！', '', {
						// 	confirmButtonText: '确定',
						// 	callback: () => {
						// 		this.$router.go(-1)
						// 	}
						// })
					}
				})
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
	#business_district_scheme_copy_list {
		color: #000000;
		background-color: #f0f2f5;
		width: 100%;
		.business_district_scheme_list_frame {
			width: 1200px;
			margin-left: auto;
			margin-right: auto;
			.moduleHeader{
				width:1200px;
				height:40px;
				line-height: 40px;
				background: #FFFFFF;
				border-bottom:1px solid #CED3DD;
				border-radius: 2px;
				padding-left:32px;
				font-size: 16px;
				font-weight: bold;
			}
			.moduleForm{
				padding-top:20px;
				padding-bottom:20px;
				padding-left:32px;
				background-color: #ffffff;
				.perInput{
					height:34px;
					line-height: 34px;
					font-size:12px;
					color:#1C2438;
					margin-bottom:10px;
					label{
						margin-right:26px;
						position: relative;
						.necessaryStar{
							margin-right:4px;
							color: red;
						}
					}
					.baseInput{
						width:180px;
						height:34px;
					}
				}
			}
			.listTopHead {
				text-align: center;
				position: relative;
				margin-bottom:27px;
				.listTopHeadTitle {
					font-size: 24px;
					color: #1e2840;
					font-weight: bold;
					margin-top: 32px;
				}
			}
			.listContainer {
				// height: 52vh;
				max-height: calc(100vh - 448px);
				overflow-y: auto;
				overflow-x: hidden;
				margin-top: 30px;
				.perScheme {
					margin-bottom: 5px;
					background-color: #ffffff;
					width: 1200px;
					border-radius: 4px;
					display: flex;
					.leftPart {
						width: 800px;
						margin-bottom: 20px;
						.part1 {
							margin-top: 20px;
							margin-left: 36px;
							.schemeName {
								font-size: 20px;
								font-weight: bold;
							}
							.tags {
								text-align: center;
								display: inline-block;
								font-size: 14px;
								width: 75px;
								height: 32px;
								line-height: 32px;
								border-radius: 4px;
								margin-left: 20px;
							}
							.doingTag {
								background: #FEF4D8;
								color: #F7B500;
								border: 1px solid #F7B500;
							}
							.effectiveTag {
								background: #d1f2e1;
								color: #26cf3f;
								border: 1px solid #26cf3f;
							}
							.uneffectiveTag {
								background: #FFECE0;
								color: #FA6400;
								border: 1px solid #FA6400;
							}
						}
						.part2 {
							margin-top: 14px;
							margin-left: 36px;
							.perLine {
								font-size: 12px;
								.dateStr {
									color: #3d3d3d;
									display: inline-block;
									width: 200px;
									font-weight: normal;
								}
							}
							.yearLine {
								margin-bottom: 14px;
							}
						}
						.part3 {
							display: flex;
							margin-top: 30px;
							.tableTitle {
								font-size: 12px;
								margin-left: 36px;
								margin-right: 10px;
							}
						}
					}
					.rightPart {
						width: 400px;
						height: 218px;
						padding: 40px 72px;
						border-left: 1px solid #e0e6ed;
						margin-top: 16px;
						display: flex;
						justify-content: center;
						align-items: center;
						.ctrlButton {
							width: 100px;
							height: 28px;
							line-height: 28px;
							font-weight: bold;
							text-align: center;
							background-color: #ffffff;
							border-radius: 4px;
							border: 1px solid #868686;
							color: #868686;
							margin-bottom: 28px;
							cursor: pointer;
							transition:all 0.3s;
						}
						.checkedButton{
							background-color: #FBEBFE;
							border: 1px solid #930CEA;
							color: #930CEA;
						}
					}
				}
			}
			.submitButtons{
				position:fixed;
				margin:auto;
				bottom:20px;
				left:0;
				right:0;
				z-index: 1;
				width:270px;
				margin-left:auto;
				margin-right:auto;
				margin-top:40px;
				display: flex;
				justify-content: space-between;
				.perSubmitButton{
					width: 120px;
					height: 32px;
					line-height:32px;
					background: #FFFFFF;
					border-radius: 4px;
					border: 1px solid #DDDEE1;
					text-align: center;
					color:#495060;
					cursor:pointer;
				}
				.confirmButton{
					background-color: #930CEA;
					border: 1px solid #930CEA;
					color:#ffffff;
				}
			}
		}
	}
</style>
<style lang="scss">
	#business_district_scheme_copy_list {
		.numHeader {
			th {
				background-color: #f8f8f9;
				text-align: center;
				color: #3d3d3d;
				font-weight: normal;
				padding: 4px 0;
			}
		}
		.numCell {
			text-align: center;
			color: #000000;
			padding: 4px;
		}
		.totalNumStyle,
		.totalNumLabelStyle {
			color: #930cea;
		}
		.el-input.is-disabled .el-input__inner{
			background-color: #ffffff;
		}
	}
</style>
