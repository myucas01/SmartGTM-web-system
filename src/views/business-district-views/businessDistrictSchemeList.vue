<template>
	<!-- 商圈分级：方案列表页 businessDistrictSchemeList-->
	<div id="business_district_scheme_list_page" v-loading="is_show_loading">
		<el-dialog
			title="模板下载"
			:visible.sync="is_show_dialog"
			width="500px"
			custom-class='downloadDialog'>
			<div class='radioDownload'>
				<label class='downloadLabel'><span class='necessaryStar'>*</span>模板类型</label>
				<a @click='closeDialog' class="ctrlButton downloadFile" :href='"/api/project/export/excel?isCheck=1&proNo=" + current_pro_no'>
					<i class="el-icon-download ctrlIcon"></i> 全部街道
				</a>
				<a @click='closeDialog' class="ctrlButton downloadFile" :href='"/api/project/export/excel?isCheck=0&proNo=" + current_pro_no'>
					<i class="el-icon-download ctrlIcon"></i> 未处理街道
				</a>
			</div>
		</el-dialog>

		<div class="business_district_scheme_list_frame">
			<div class="listTopHead">
				<p class="listTopHeadTitle">商圈布局列表</p>
				<div
					class="listTopHeadButton copySchemeButton"
					@click="routeToCopyListPage"
					v-auth="'business:layout:programmecopy'"
				>
					<i class="el-icon-document-copy copySchemeIcon"></i> 复用方案
				</div>
				<div
					class="listTopHeadButton newSchemeButton"
					@click="routeToNewProPage"
					v-auth="'business:layout:addprogramme'"
				>
					<i class="el-icon-plus newSchemeIcon"></i> 新建方案
				</div>
			</div>
			<div class="yearFilterContainer">
				<label class="label">商圈布局财年</label>
				<el-select
					v-model="year_value"
					placeholder="全部"
					class="baseInput yearInput"
					size="small"
					clearable
					@change="yearChange"
				>
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					>
					</el-option>
				</el-select>
			</div>
			<div class="listContainer"  v-infinite-scroll="load" style="overflow:auto">
				<div class="perScheme" v-for="(item, index) in list_data" :key="index">
					<!--leftPart 将抽象为一个模板文件-->
					<div class="leftPart">
						<div class="part1">
							<span
								class="schemeName"
								@click="routeToProLayoutDetail(item.proId, item.proName)"
								>{{ item.proName }}</span
							>
							<div class="tags doingTag" v-if="item.proStatus === 1">
								规划中
							</div>
							<div class="tags effectiveTag" v-if="item.proStatus === 2">
								已生效
							</div>
							<div class="tags uneffectiveTag" v-if="item.proStatus === 3">
								未生效
							</div>
						</div>
						<div class="part2">
							<div class="perLine yearLine">
								商圈布局财年：<span class="dateStr">{{ item.proYear }}</span>
								创建时间：<span class="dateStr">{{
									item.createTime || '--'
								}}</span>
							</div>
							<div class="perLine seasonLine">
								商圈布局季度：<span class="dateStr">{{ item.proQuarter }}</span>
								修改时间：<span class="dateStr">{{
									item.updateTime || '--'
								}}</span>
							</div>
						</div>
						<div class="part3">
							<span class="tableTitle">商圈数量：</span>
							<div class="numberList" v-if="item.projectSta">
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
						<div
							class="ctrlButton settingButton"
							@click="routeToProSetting(item)"
							v-auth="'business:layout:set'"
						>
							<i class="el-icon-s-tools ctrlIcon"></i> 商圈设置
						</div>
						<div
							class="ctrlButton effectSettingButton"
							@click="routeToProEffectiveSetting(item.proNo)"
							v-auth="'business:layout:show:set'"
						>
							<i class="el-icon-pie-chart ctrlIcon"></i> 展示效果配置
						</div>
						<div
							class="ctrlButton detailButton"
							@click="
								routeToProDetail(
									item.proNo,
									item.proId,
									item.orgId,
									item.orgType,
									item.proYear
								)
							"
							v-auth="'business:layout:detail'"
						>
							<i class="el-icon-tickets ctrlIcon"></i> 商圈明细
						</div>
						<div
							class="ctrlButton delButton"
							:class="{ 'disableButton' : item.proStatus === 2 }"
							@click="deleteSomePro(item.proNo, item.proStatus)"
							v-auth="'business:layout:deleteprogramme'"
						>
							<i class="el-icon-delete ctrlIcon"></i> 删除方案
						</div>
						<div
							class="ctrlButton preViewButton"
							@click="
								routeToProPreview(
									item.proNo,
									item.proId,
									item.orgId,
									item.orgType,
									item.orgName,
									item.proYear,
									item.proQuarter,
									item.proName
								)
							"
							v-auth="'business:layout:preview'"
						>
							<i class="el-icon-view ctrlIcon"></i> 商圈预览
						</div>
						<div class="ctrlButton uploadFile">
							<input type="file" class='uploadButton' name='upload_button' @change="uploadFile($event, item.proNo)">
							<i class="el-icon-upload2 ctrlIcon"></i> 上传商圈
						</div>
						<div class="ctrlButton downloadFile" @click='openDownloadDialog(item.proNo)'>
							<i class="el-icon-download ctrlIcon"></i> 下载模板
						</div>
					</div>
				</div>
				<!-- <div class="notext" v-if="noTextIshow">没有数据了</div> -->
			</div>
		</div>
	</div>
</template>

<script>
	/*-----  导入API ------*/
	import BUSINESS_DISTRICT_API from '../../../api/business_district_api'
	export default {
		name: 'businessDistrictSchemeList',
		components: {},
		title() {
			return '商圈布局-方案列表'
		},
		data() {
			return {
				list_data: [],
				// 年份选择
				options: [],
				// 年份值
				year_value: '',
				// 是否显示局部loading
				is_show_loading: true,
				is_show_dialog: false,
				current_pro_no: '',
				allData: [], // 总数据
				scrollIndex: 0, // 当前定位
				// noTextIshow: false // 是否新增没有数据
			}
		},

		/**
		 * @description 在进入之前添加选项卡
		 */
		beforeRouteEnter(to, from, next) {
			next((vm) => {
				// 通过 `vm` 访问组件实例
				vm.$store.commit('addTabs', {
					title: '商圈布局列表',
					link: to.fullPath,
					on: false,
					needCatch: true,
					isPathNameCheck: true
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
				this.options.push(item)
			}
		},
		methods: {
			/**
			 * @description 过滤年份回调函数
			 */
			yearChange() {
				this.getProList(this.year_value)
			},

			// 触底懒加载数据
			load () {
				if(this.scrollIndex < this.allData.length){
					// this.noTextIshow = false
					//有数据懒加载更多5行
					this.list_data = this.allData.slice(0, this.scrollIndex + 10)
					this.scrollIndex = this.scrollIndex + 10
				} else {
					//没有数据
					return
				}
			},

			/**
			 * @description 获取方案列表数据(0-非复用列表，1-复用列表)
			 * @param { string } year_str 当前财年，如果为空则为全部数据
			 */
			async getProList(year_str) {
				this.is_show_loading = true
				this.allData = await BUSINESS_DISTRICT_API.get_district_list({
					year: year_str,
					isLoading: false
				})
				// 初始5行，设置默认5
				this.list_data = this.allData.slice(0,5)
				this.is_show_loading = false
				this.scrollIndex = 5
			},

			/**
			 * @description 删除某个方案
			 * @param { string } pro_number 方案编号
			 * @param { number } status_num 方案状态码
			 */
			deleteSomePro(pro_number, status_num) {
				if(status_num !== 2) {
					// 弹窗是否确认删除！
					this.$confirm('此操作将永久删除该方案, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						// 调用删除接口
						BUSINESS_DISTRICT_API.delete_some_pro(pro_number).then(() => {
							this.$alert('删除操作成功！', '', {
								confirmButtonText: '确定',
								callback: () => {
									// 再次调用接口
									this.getProList()
								}
							})
						})
					})
				}
			},

			/**
			 * @description 跳转到复用列表
			 */
			routeToCopyListPage() {
				this.$router.push({ name: 'businessDistrictSchemeCopyList' })
			},

			/**
			 * @description 跳转到新建方案页
			 */
			routeToNewProPage() {
				this.$router.push({ path: 'addNewBusiness' })
			},

			/**
			 * @description 跳转到商圈明细
			 * @param { string } pro_number 方案编号
			 * @param { string } pro_id 方案id
			 * @param { string } org_id 组织id
			 * @param { string } org_type 组织层级id
			 * @param { string } pro_year 方案年份
			 */
			routeToProDetail(pro_number, pro_id, org_id, org_type, pro_year) {
				this.$router.push({
					path: 'business-district-detail',
					query: {
						proNumber: pro_number,
						proId: pro_id,
						orgId: org_id,
						orgType: org_type,
						proYear: pro_year
					}
				})
			},

			/**
			 * @description 跳转到商圈布局明细
			 * @param { string } pro_number 方案编号
			 */
			routeToProLayoutDetail(proId, pro_Name) {
				this.$router.push({
					path: 'ConfigDetails',
					query: { proId: proId, proName: pro_Name }
				})
			},

			/**
			 * @description 跳转到商圈设置
			 * @param { string } pro_number 方案编号
			 */
			routeToProSetting(item) {
				this.$store.commit('businessPreview/SET_VIEW_ORGANIZE', {
					proNo: item.proNo,
					orgId: item.orgId,
					orgName: item.orgName
				})
				this.$store.dispatch('map/setOrganizationDisabled', false)
				// this.$store.dispatch('map/setMapOrganization', true)
				this.$store.commit('businessPreview/SET_VIEW_PROJECT', item)
				// 组织id
				this.$store.dispatch('map/setOrganizationId', item.orgId)
				// 组织name
				this.$store.dispatch('map/setOrganizationName',item.orgName)
				this.$router.push({
					path: `create/${item.proNo}`,
					query: {
						orgId: item.orgId,
						proYear: item.proYear,
						proQuarter: item.proQuarter,
						proName: item.proName,
						proId: item.proId
					}
				})
			},

			/**
			 * @description 跳转到展示效果配置
			 * @param { string } pro_number 方案编号
			 */
			routeToProEffectiveSetting(pro_number) {
				this.$router.push({
					path: 'display-config',
					query: { proNo: pro_number }
				})
			},

			/**
			 * @description 跳转到商圈预览
			 * @param { string } pro_number 方案编号
			 * @param { string } pro_id 方案id
			 * @param { string } org_id 组织id
			 * @param { string } org_type 组织级别
			 * @param { string } org_name 组织名
			 * @param { string } pro_year 方案财年
			 * @param { string } pro_quarter 方案季度
			 * @param { string } pro_name 方案名
			 */
			routeToProPreview(
				pro_number,
				pro_id,
				org_id,
				org_type,
				org_name,
				pro_year,
				pro_quarter,
				pro_name
			) {
				this.$router.push({
					path: 'business-preview',
					query: {
						proNumber: pro_number,
						proId: pro_id,
						orgId: org_id,
						orgType: org_type,
						orgName: org_name,
						proYear: pro_year,
						proQuarter: pro_quarter,
						proName: pro_name
					}
				})
			},

			/**
			 * @description 打开下载模板弹窗
			 * @param { string } pro_no 当前方案number
			 */
			openDownloadDialog(pro_no) {
				console.log('打开dialog,pro_no：', pro_no)
				this.current_pro_no = pro_no
				this.is_show_dialog = true
			},

			/**
			 * @description 上传文件
			 * @param { object<File> } event 当前方案number
			 * @param { string } pro_no 当前方案number
			 */
			async uploadFile(event, pro_no) {
				let file = event.target.files[0]
				let ext_name = file.name.substring(file.name.lastIndexOf('.')+1)
				if(ext_name === 'xls' || ext_name === 'xlsx') {
					let form_data = new FormData()
					form_data.append("file", file)
					form_data.append("prono", pro_no)
					let res = await BUSINESS_DISTRICT_API.upload_excel_file(form_data, pro_no)
					console.log('res:', res)
					if(res.code === '200') {
						this.$message.success('文件上传成功，商圈数据正在导入系统中，导入结果会发送至您的消息通知中心中，请您耐心等待')
						this.getProList()
					}
				} else {
					this.$message.error('请上传 .xlsx 或者 .xls文件！')
				}
			},

			/**
			 * @description 关闭下载窗口
			 */
			closeDialog() {
				this.is_show_dialog = false
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

	#business_district_scheme_list_page {
		color: #000000;
		background-color: #f0f2f5;
		width: 100%;
		padding-top: 32px;

		.business_district_scheme_list_frame {
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
				}

				.listTopHeadButton {
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

			.yearFilterContainer {
				background-color: #ffffff;
				height: 50px;
				line-height: 50px;
				margin-top: 30px;
				width: 1200px;
				border-bottom: 1px solid #ced3dd;
				padding-left: 40px;

				.label {
					margin-right: 10px;
					font-size: 12px;
					color: #87888b;
				}

				.baseInput {
					margin-right: 26px;
				}

				.yearInput {
					width: 180px;
					height: 32px;
				}
			}

			.listContainer {
				max-height: calc(100vh - 180px);
				overflow-y: auto;
				overflow-x: hidden;

				.perScheme {
					margin-bottom: 20px;
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
								cursor: pointer;
								font-size: 20px;
								font-weight: bold;
								border-bottom: 1px solid #858585;
								padding-bottom: 2px;
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
								background: #fef4d8;
								color: #f7b500;
								border: 1px solid #f7b500;
							}

							.effectiveTag {
								background: #d1f2e1;
								color: #26cf3f;
								border: 1px solid #26cf3f;
							}

							.uneffectiveTag {
								background: #ffece0;
								color: #fa6400;
								border: 1px solid #fa6400;
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

							.numHeader {
								background-color: #f8f8f9;
								color: #3d3d3d;
							}
						}
					}

					.rightPart {
						width: 400px;
						height: 198px;
						padding: 20px 72px;
						border-left: 1px solid #e0e6ed;
						margin-top: 16px;
						display: flex;
						flex-wrap: wrap;
						justify-content: space-between;
						.ctrlButton {
							width: 90px;
							height: 28px;
							line-height: 28px;
							text-align: center;
							background: #f4e6fc;
							border-radius: 4px;
							border: 1px solid #930cea;
							color: #930cea;
							margin-bottom: 14px;
							cursor: pointer;
							font-weight: bold;
							.ctrlIcon {
								font-weight: bold;
							}
						}

						.effectSettingButton,
						.delButton,
						.uploadFile {
							width: 108px;
							position: relative;
						}
						.uploadButton {
							position: absolute;
							z-index: 1;
							opacity: 0;
							left:0;
							top:0;
							cursor:pointer;
							width: 108px;
							height: 28px;
						}
						.disableButton{
							border: 1px solid #C0C4CC;
							color: #C0C4CC;
							cursor: not-allowed;
						}
					}
				}
			}
		}
		.notext {
			width: 100%;
			text-align: center;
			line-height: 60px;
			font-size: 13px;
			color: #999;
			position: fixed;
			bottom: 0;
			z-index: 999;
			background-color: #f0f2f5;
		}
	}
</style>
<style lang="scss">
	#business_district_scheme_list_page {
		.downloadDialog{
			.radioDownload{
				font-size:14px;
				.downloadLabel{
					display: inline-block;
					margin-right:20px;
					.necessaryStar{
						color:red
					}
				}
				.ctrlButton{
					display: inline-block;
					width:120px;
					height:32px;
					line-height:32px;
					font-size:14px;
					border:1px solid #cccccc;
					transition:all 0.3s;
					border-radius: 16px;
					text-align: center;
					margin-right:42px;
					box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.1);
					&:hover{
						color:#930cea;
						border:1px solid #930cea;
						box-shadow: 0 0 10px 1px rgba(167, 57, 238, 0.2);
					}
				}
			}
		}
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
	}
</style>
