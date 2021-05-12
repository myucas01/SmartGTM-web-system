<template>
	<div class="item sp2" v-if="storeStep >= 1">
		<div class="edit">
			<div class="t">
				<span>筛选GAIA商机门店</span>
				<span @click="addStore"><img src="../../../assets/img/addPurple.png" />添加</span>
			</div>
			<div class="m">
				<ul class="level" ref="storeHeight" :style="{'border-left': status1.borderLeft , 'padding-left': status1.paddingLeft }">
					<span class="status" v-if="storeList.length > 1" :style="'top:' + status1.height" @click="changeship">{{ status1.code | getShip }}</span>
					<li v-for="(item, index) in storeList" :key="index" ref="storeHeight2" class="line">
						<div v-if="item.level == 1">
							<ul v-if="item.list.length == 0" class="level1">
								<li>
									<span class="ships">{{ item.ship | strFilter }}</span>
									<el-select class="se1" v-model="item.key" @change="storeTypeChange(index)">
										<el-option v-for="type in storeType" :key="type.labelCode" :value="type.labelCode" :label="type.labelType"></el-option>
									</el-select>
									<el-cascader class="se2" v-model="item.valuesList" :options="item.storeTypeValue" :props="cascaderProps" :show-all-levels="false"  @change="storeCascader"></el-cascader>
									<span class="screen el-icon-plus" @click="addChildLinkStore(index)">添加筛选</span>
									<span class="add" @click="addLinkStore(index)"><img src="../../../assets/img/addLine.png" />新增</span>
									<span class="delete el-icon-close" @click="delStore(index)"></span>
								</li>
							</ul>
							<ul v-else>
								<li v-for="(item2, index2) in item.list" :key="index2">
									<div v-if="item2.level == 3">
										<ul class="level1" v-if="index2 == 0">
											<span class="ships">{{ item.ship | strFilter }}</span>
											<el-select class="se1" v-model="item2.key" @change="storeTypeListChange(index, index2)">
												<el-option v-for="type in storeType" :key="type.labelCode" :value="type.labelCode" :label="type.labelType"></el-option>
											</el-select>
											<el-cascader class="se2" v-model="item2.valuesList" :options="item2.storeTypeValue" :props="cascaderProps" :show-all-levels="false" @change="storeCascader"></el-cascader>
											<span class="screen el-icon-plus" @click="addChildLinkStore(index)">添加筛选</span>
											<span class="add" @click="addLinkStore2(index)"><img src="../../../assets/img/addLine.png"/>新增</span>
											<span class="delete el-icon-close" @click="delStore(index)"></span>
										</ul>
										<ul class="level3" v-else>
											<el-select class="se1" v-model="item2.key" @change="storeTypeListChange(index, index2)">
												<el-option v-for="type in storeType" :key="type.labelCode" :value="type.labelCode" :label="type.labelType"></el-option>
											</el-select>
											<el-cascader class="se2" v-model="item2.valuesList" :options="item2.storeTypeValue" :props="cascaderProps" :show-all-levels="false" @change="storeCascader"></el-cascader>
											<span class="delete el-icon-close" @click="delStore2T(index, index2)"></span>
										</ul>
									</div>
									<div v-if="item2.level == 2">
										<ul class="level2">
											<li v-if="item2.list.length == 0">
												<span class="statusT" v-if="index2 == 0" :style="'top:' + item.height" @click="changeship2(index)">{{ item.list[0].status | getShip }}</span>
												<span class="ships">{{ item2.ship | strFilter }}</span>
												<el-select class="se1" v-model="item2.key" @change="storeTypeListChange(index, index2)">
													<el-option v-for="type in storeType" :key="type.labelCode" :value="type.labelCode" :label="type.labelType"></el-option>
												</el-select>
												<el-cascader class="se2" v-model="item2.valuesList" :options="item2.storeTypeValue" :props="cascaderProps" :show-all-levels="false" @change="storeCascader"></el-cascader>
												<span class="screen el-icon-plus" @click="addChildLinkStore2(index, index2)">添加筛选</span>
												<span v-if="item.list.length < 3" class="add" @click="addLinkStore3(index)"><img src="../../../assets/img/addLine.png"/>新增</span>
												<span class="delete el-icon-close" @click="delStore2T(index, index2)"></span>
											</li>
											<li v-if="item2.list.length > 0">
												<ul class="level4">
													<li v-for="(item3, index3) in item2.list" :key="index3">
														<div v-if="index3 == 0">
															<span class="statusT" v-if="index2 == 0 && index3 == 0" :style="'top:' + item.height" @click="changeship2(index, index2)">{{ item.list[0].status | getShip }}</span>
															<span class="ships" v-if="index3 == 0">{{ item3.ship | strFilter }}</span>
															<el-select class="se1" v-model="item3.key" @change="storeTypeChildChange(index, index2, index3)">
																<el-option v-for="type in storeType" :key="type.labelCode" :value="type.labelCode" :label="type.labelType"></el-option>
															</el-select>
															<el-cascader @change="storeCascader" class="se2" v-model="item3.valuesList" :options="item3.storeTypeValue" :props="cascaderProps" :show-all-levels="false"></el-cascader>
															<span class="screen el-icon-plus" @click="addChildLinkStore3(index, index2)">添加筛选</span>
															<span v-if="item.list.length < 3" class="add" @click="addLinkStore3(index)"><img src="../../../assets/img/addLine.png"/>新增</span>
															<span class="delete el-icon-close" @click="delStore2(index, index2)"></span>
														</div>
														<div v-else>
															<span class="statusT" v-if="index3 == 0" :style="'top:' + item.height" @click="changeship2(index)">{{ item.list[0].status | getShip }}3</span>
															<span class="ships" v-if="index3 == 0">{{ item3.ship | strFilter }}</span>
															<el-select class="se1" v-model="item3.key" @change="storeTypeChildChange(index, index2, index3)">
																<el-option v-for="type in storeType" :key="type.labelCode" :value="type.labelCode" :label="type.labelType"></el-option>
															</el-select>
															<el-cascader @change="storeCascader" class="se2" v-model="item3.valuesList" :options="item3.storeTypeValue" :props="cascaderProps" :show-all-levels="false"></el-cascader>
															<span class="delete el-icon-close" @click="delStore3(index, index2, index3)"></span>
														</div>
													</li>
												</ul>
											</li>
										</ul>
									</div>
								</li>
							</ul>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		name: 'ScreenStore',
		computed: {
			...mapGetters('businessExpansionModule', [
				'storeStep'
			])
		},
		data() {
			return {
				cascaderProps: {
					multiple: true,
					value: "labelCode",
					label: "labelName",
					children: "childList"
				},
				storeType: [],
				storeList: [],
				status1: {
					show: 0,
					code: 1,
					height: '0px',
					borderLeft: '0px',
					paddingLeft: '0px',
					marginLeft: '0px'
				}
			}
		},
		filters: {
			strFilter: function(val) {
				let str = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
					'V', 'W', 'X', 'Y', 'Z'
				]
				return str[val]
			},
			getShip: function(val) {
				if (val == 1) {
					return '且'
				} else {
					return '或'
				}
			}
		},
		created() {
			this.getLabelType()
		},
		methods: {
			getLabelType() {
				let _this = this
				let url = '/api/expand/business/getLabelType'
				_this.$fetch.get(url).then(res => {
					_this.$set(_this, 'storeType', res.data)
				})
			},
			storeTypeChange(index) {
				let _this = this
				_this.storeList[index].valuesList = []
				let url = '/api/expand/business/getLabelName'
				_this.$fetch.get(url, { labelCode: _this.storeList[index].key }).then(res => {
					_this.storeList[index].storeTypeValue = res.data
				})
			},
			storeTypeChildChange(index, indexc, indexm) {
				let _this = this
				_this.storeList[index].list[indexc].list[indexm].valuesList = []
				let url = '/api/expand/business/getLabelName'
				_this.$fetch.get(url, { labelCode: _this.storeList[index].list[indexc].list[indexm].key }).then(res => {
					_this.storeList[index].list[indexc].list[indexm].storeTypeValue = res.data
				})
			},
			addStore() {
				let _this = this
				_this.storeList.push({
					key: '',
					list: [],
					status: _this.status1.code,
					valuesList: [],
					storeTypeValue: [],
					level: 1,
					ship: 0
				})
				setTimeout(() => {
					_this.getAllStatus()
				}, 100)
			},
			addChildLinkStore(index) {
				let _this = this
				if (_this.storeList[index].list.length == 0) {
					_this.storeList[index].list = [
						{
							key: _this.storeList[index].key,
							list: _this.storeList[index].list,
							status: 1,
							valuesList: _this.storeList[index].valuesList,
							storeTypeValue: _this.storeList[index].storeTypeValue,
							level: 3,
							ship: 0
						},
						{
							key: '',
							list: [],
							status: 1,
							valuesList: [],
							storeTypeValue: [],
							level: 3,
							ship: 0
						}
					]
					_this.storeList[index].key = ''
					_this.storeList[index].level = 1
					_this.storeList[index].status = _this.status1.code
					_this.storeList[index].valuesList = []
				} else {
					_this.storeList[index].list.push({
						key: '',
						list: [],
						status: 1,
						valuesList: [],
						storeTypeValue: [],
						level: 3,
						ship: 0
					})
				}
				
				setTimeout(() => {
					_this.getAllStatus()
				}, 100)
			},
			addChildLinkStore2(index, index2) {
				let _this = this
				if (_this.storeList[index].list[index2].list.length == 0) {
					_this.storeList[index].list[index2].list = [
						{
							key: _this.storeList[index].list[index2].key,
							list: _this.storeList[index].list[index2].list,
							status: 1,
							valuesList: _this.storeList[index].list[index2].valuesList,
							storeTypeValue: _this.storeList[index].list[index2].storeTypeValue,
							level: 3,
							ship: 0
						},
						{
							key: '',
							list: [],
							status: 1,
							valuesList: [],
							storeTypeValue: [],
							level: 3,
							ship: 0
						}
					]
					_this.storeList[index].list[index2].key = ''
					_this.storeList[index].list[index2].level = 2
					_this.storeList[index].list[index2].valuesList = []
				} else {
					_this.storeList[index].list.push({
						key: '',
						list: [],
						status: _this.storeList[index].list[index2].status,
						valuesList: [],
						storeTypeValue: [],
						level: 3,
						ship: 0
					})
				}
				setTimeout(() => {
					_this.getAllStatus()
				}, 100)
			},
			addChildLinkStore3(index, index2) {
				let _this = this
				_this.storeList[index].list[index2].list.push({
					key: '',
					list: [],
					status: 1,
					valuesList: [],
					storeTypeValue: [],
					level: 3,
					ship: 0
				})
				setTimeout(() => {
					_this.getAllStatus()
				}, 100)
			},
			storeTypeListChange(index, index2) {
				let _this = this
				_this.storeList[index].list[index2].valuesList = []
				let url = '/api/expand/business/getLabelName'
				_this.$fetch.get(url, { labelCode: _this.storeList[index].list[index2].key }).then(res => {
					_this.storeList[index].list[index2].storeTypeValue = res.data
				})
			},
			addLinkStore(index) {
				let _this = this
				if (_this.storeList[index].list.length == 0) {
					_this.storeList[index].list = [
						{
							key: _this.storeList[index].key,
							list: _this.storeList[index].list,
							status: 1,
							valuesList: _this.storeList[index].valuesList,
							storeTypeValue: _this.storeList[index].storeTypeValue,
							level: 2,
							ship: 0
						},
						{
							key: '',
							list: [],
							status: 1,
							valuesList: [],
							storeTypeValue: [],
							level: 2,
							ship: 0
						}
					]
					_this.storeList[index].key = ''
					_this.storeList[index].level = 1
					_this.storeList[index].valuesList = []
				} else {
					_this.storeList[index].list.push({
						key: '',
						list: [],
						status: 1,
						valuesList: [],
						storeTypeValue: [],
						level: 2,
						ship: 0
					})
				}
			
				
				setTimeout(() => {
					_this.getAllStatus()
				}, 100)
				
			},
			addLinkStore2(index) {
				let _this = this
				_this.storeList[index].list = [
					{
						key: '',
						list: _this.storeList[index].list,
						status: 1,
						valuesList: [],
						storeTypeValue: [],
						level: 2,
						ship: 0
					},
					{
						key: '',
						list: [],
						status: 1,
						valuesList: [],
						storeTypeValue: [],
						level: 2,
						ship: 0
					}
				]
				
				setTimeout(() => {
					_this.getAllStatus()
				}, 100)
			},
			addLinkStore3(index) {
				let _this = this
				_this.storeList[index].list.push(
				{
					key: '',
					list: [],
					status: 1,
					valuesList: [],
					storeTypeValue: [],
					level: 2,
					ship: 0
				})
				setTimeout(() => {
					_this.getAllStatus()
				}, 100)
			},
			delStore(index) {
				let _this = this
				_this.storeList.splice(index, 1)
				setTimeout(() => {
					_this.getAllStatus()
				}, 100)
			},
			delStore2(index, indexc) {
				let _this = this
				_this.storeList[index].list.splice(indexc, 1)
				if (_this.storeList[index].list.length == 1) {
					_this.storeList[index].list[0].level = 1
					_this.storeList[index].list[0].status = _this.status1.code
					_this.storeList[index] = _this.storeList[index].list[0]
				}
				setTimeout(() => {
					_this.getAllStatus()
				}, 100)
			},
			delStore2T(index, index2) {
				let _this = this
				_this.storeList[index].list.splice(index2, 1)
				if (_this.storeList[index].list.length == 1) {
					_this.storeList[index].list[0].level = 1
					_this.storeList[index].list[0].status = _this.status1.code
					_this.storeList[index] = _this.storeList[index].list[0]
				}
				setTimeout(() => {
					_this.getAllStatus()
				}, 100)
			},
			delStore3(index, index2, index3) {
				let _this = this
				_this.storeList[index].list[index2].list.splice(index3, 1)
				if (_this.storeList[index].list[index2].list.length == 1) {
					_this.storeList[index].list[index2].list[0].level = 2
					_this.storeList[index].list[index2].list[0].status = _this.storeList[index].list[index2].status
					_this.storeList[index].list[index2] = _this.storeList[index].list[index2].list[0]
				}
				setTimeout(() => {
					_this.getAllStatus()
				}, 100)
			},
			delStore4(index, index2, index3) {
				let _this = this
				_this.storeList[index].list[index2].list.splice(index3, 1)
				if (_this.storeList[index].list[index2].list.length == 0) {
					_this.storeList[index].list[index2].list[0].level = 2
					_this.storeList[index].list[index2] = _this.storeList[index].list[index2].list[0]
				}
				setTimeout(() => {
					_this.getAllStatus()
				}, 100)
			},
			storeCascader() {
				let _this = this
				setTimeout(() => {
					_this.getAllStatus()
				}, 100)
			},
			getAllStatus() {
				let _this = this
				let index = 0
				for (var i = 0; i < _this.storeList.length; i ++) {
					_this.storeList[i].height = _this.getStoreHeight2(i)
					if (_this.storeList[i].list.length == 0) {
						_this.storeList[i].ship = index
						index ++
					} else {
						if (_this.storeList[i].list[0].level == 3) {
							_this.storeList[i].list[0].ship = index
							index ++
						} else {
							for (var s = 0; s < _this.storeList[i].list.length; s ++) {
								if (_this.storeList[i].list[s].list.length == 0) {
									_this.storeList[i].list[s].ship = index
									index ++
								} else {
									_this.storeList[i].list[s].list[0].ship = index
									index ++
								}
							}
						}
					}
				}
				if (_this.storeList.length > 1) {
					_this.status1.borderLeft = '1px solid #E2BDF8FF'
					_this.status1.show = true
				} else {
					_this.status1.borderLeft = '0px'
					_this.status1.show = false
				}
				
				let statusHeight = window.getComputedStyle(_this.$refs.storeHeight).height.substring(0, window.getComputedStyle(_this.$refs.storeHeight).height.indexOf('px'))
				if (statusHeight > 0) {
					_this.status1.height = (statusHeight / 2) - 15 + 'px'
				}
				if (_this.storeList.length < 2) {
					_this.status1.code = 1
				}
				console.log(this.storeList)
			},
			getStoreHeight2(index) {
				let _this = this
				let statusHeight = window.getComputedStyle(_this.$refs.storeHeight2[index]).height.substring(0, window.getComputedStyle(_this.$refs.storeHeight2[index]).height.indexOf('px'))
				if (statusHeight > 0) {
					return (statusHeight / 2) - 15 + 'px'
				}
			},
			changeship() {
				let _this = this
				_this.status1.code = _this.status1.code == 1 ? 2 : 1
				for (var i = 0; i < _this.storeList.length; i ++) {
					_this.storeList[i].status = _this.status1.code
				}
				console.log(_this.storeList)
			},
			changeship2(index) {
				let _this = this
				_this.storeList[index].list[0].status = _this.storeList[index].list[0].status == 1 ? 2 : 1
				for (var i = 0; i < _this.storeList[index].list.length; i ++) {
					_this.storeList[index].list[i].status = _this.storeList[index].list[0].status
				}
				console.log(_this.storeList)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.sp2 {
		max-height: calc(100% - 330px);
		overflow: auto;
		.edit {
			.t {
				padding-bottom: 10px;
				padding-left: 5px;
				padding-right: 5px;
				border-bottom: 1px solid #DDDEE1FF;

				span {
					&:first-child {
						font-size: 12px;
						font-weight: 400;
						color: #3A3A3A;
					}

					&:last-child {
						float: right;
						cursor: pointer;
						
						img {
							margin-right: 5px;
						}
					}
				}
			}

			.m {
				padding: 10px;
				padding-right: 0px;
				.el-select {
					padding-left: 10px;
					margin-bottom: 10px;
					
					::v-deep .el-input__inner {
						height: 40px;
						line-height: 40px;
					}
					
					::v-deep .el-input__icon {
						height: 40px;
						line-height: 40px;
					}
				}
				::v-deep .el-cascader__tags .el-tag {
					display: inline-block;
					margin: 0px;
					margin-bottom: 1px;
					margin-left: 1px;
				}
				
				.se1 {
					width: 140px;
					float: left;
				}
				
				.se2 {
					width: 350px;
					margin-left: 10px;
					margin-bottom: 10px;
				}
				
				.add {
					position: absolute;
					right: 25px;
					height: 40px;
					line-height: 40px;
					color: #6D7278FF;
					cursor: pointer;
				
					img {
						margin-right: 3px;
						margin-bottom: 2px;
					}
				}
				
				.delete {
					cursor: pointer;
					position: absolute;
					color: #6D7278FF;
					right: 0px;
					height: 40px;
					line-height: 40px;
				}
				
				.screen {
					position: absolute;
					right: 75px;
					height: 40px;
					line-height: 40px;
					color: #6D7278FF;
					cursor: pointer;
				}
				.level {
					position: relative;
					border-left: 1px solid #E2BDF8FF;
				}
				.level1 {
					padding-left: 30px;
					position: relative;
				}
				.level2 {
					margin-left: 25px;
					position: relative;
					padding-left: 30px;
					border-left: 1px solid #E2BDF8FF;
					
				}
				.level3 {
					padding-left: 30px;
				}
				.level4 {
					// padding-left: 18px;
				}
				
				
				.line {
					margin-bottom: 10px;
				}
				
				.status {
					position: absolute;
					left: -10px;
					cursor: pointer;
					z-index: 1;
					font-size: 13px;
					width: 20px;
					height: 20px;
					line-height: 20px;
					text-align: center;
					color: #930CEAFF;
					background-color: #E2BDF8FF;
				}
				.statusT {
					position: absolute;
					cursor: pointer;
					z-index: 1;
					font-size: 13px;
					width: 20px;
					height: 20px;
					left: -10px;
					line-height: 20px;
					text-align: center;
					color: #930CEAFF;
					background-color: #E2BDF8FF;
				}
				.ships {
					position: absolute;
					display: inline-block;
					cursor: pointer;
					z-index: 1;
					font-size: 13px;
					width: 18px;
					height: 18px;
					top: 10px;
					left: 15px;
					line-height: 20px;
					text-align: center;
					color: #FFFFFFFF;
					background-color: #930CEAFF;
				}
				.allButNull {
					z-index: 1;
					position: absolute;
					left: -5px;
					font-size: 0px;
					width: 10px;
					height: 15px;
					line-height: 10px;
					text-align: center;
					color: #930CEAFF;
					background-color: #ffffff;
				}
				
				.item {
					font-size: 12px;

					.el-select {
						padding-left: 10px;
						margin-bottom: 10px;
						
						::v-deep .el-input__inner {
							height: 40px;
							line-height: 40px;
						}
						
						::v-deep .el-input__icon {
							height: 40px;
							line-height: 40px;
						}
					}

					.se1 {
						width: 140px;
					}

					.se2 {
						width: 350px;
						margin-left: 10px;
						margin-bottom: 10px;
					}

					.str {
						background-color: #930CEAFF;
						border: 1px solid #930CEAFF;
						color: #FFFFFF;
						display: inline-block;
						height: 18px;
						line-height: 18px;
						text-align: center;
						width: 18px;
						font-size: 12px;
					}

					.add {
						position: absolute;
						right: 30px;
						height: 40px;
						line-height: 40px;
						color: #6D7278FF;
						cursor: pointer;

						img {
							margin-right: 5px;
							margin-bottom: 2px;
						}
					}

					.delete {
						cursor: pointer;
						position: absolute;
						color: #6D7278FF;
						right: 10px;
						height: 40px;
						line-height: 40px;
					}
				}

				.link {
					position: relative;
					padding-left: 20px;
					border-left: 1px solid #E2BDF8FF;

					.screen {
						position: absolute;
						right: 90px;
						height: 40px;
						line-height: 40px;
						color: #6D7278FF;
						cursor: pointer;
					}
					
					.link_child {
						padding-left: 20px;
					}
				}

				.nolink {
					.screen {
						position: absolute;
						right: 120px;
						height: 40px;
						line-height: 40px;
						color: #6D7278FF;
						cursor: pointer;
					}
					
					.link_child {
						padding-left: 20px;
					}
				}
			}
		}
		.show {
			.t {
				font-size: 12px;
				font-weight: 600;
				color: #535A6B;
			}
			.el-button {
				margin-top: 15px;
				width: 80px;
				height: 32px;
				display: block;
				padding: 0;
				font-size: 12px;
			}
		}
	}
</style>
