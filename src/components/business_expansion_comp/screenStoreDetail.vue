<template>
	<div class="item sp2">
		<div class="edit">
			<div class="m">
				<ul class="level" ref="storeHeight" :style="{'border-left': status1.borderLeft , 'padding-left': status1.paddingLeft }">
					<span class="status" v-if="storeList.length > 1" :style="'top:' + status1.height" >{{ status1.code | getShip }}</span>
					<li v-for="(item, index) in storeList" :key="index" ref="storeHeight2" class="line">
						<div v-if="item.level == 1 " class="line_in">
							<ul v-if="item.list.length == 0" class="level1">
								<li>
									<span class="ships">{{ item.ship | strFilter }}</span>
									<span>
										<span class="storeName">{{ item.name }}</span>
										<span class="storeValue" v-for="(statusValue, indexValue) in item.values" :key="indexValue">
											{{ statusValue.name }}
										</span>
									</span>
								</li>
							</ul>
							<ul v-else>
								<li v-for="(item2, index2) in item.list" :key="index2+'u'" style="display: inline-block;">
									<div v-if="item2.level == 3">
										<span class="level1" v-if="index2 == 0">
											<span class="ships">{{ item2.ship | strFilter }}</span>
											<span>
												<span class="storeName">{{ item2.name }}</span>
												<span class="storeValue" v-for="(statusValue, indexValue) in item2.values" :key="indexValue">
													{{ statusValue.name }}
												</span>
											</span>
										</span>
										<span class="level3" v-else>
											<span>
												<span class="storeName">{{ item2.name }}</span>
												<span class="storeValue" v-for="(statusValue, indexValue) in item2.values" :key="indexValue">
													{{ statusValue.name }}
												</span>
											</span>
										</span>
									</div>
								</li>
								<li  v-for="(item2, index2) in item.list" :key="index2+'s'">
									<div v-if="item2.level == 2">
										<ul class="level2">
											<li v-if="item2.list.length == 0">
												<span class="statusT" v-if="index2 == 0  && show" :style="'top:' + item.height" >{{ item.list[0].status | getShip }}</span>
												<span class="ships">{{ item2.ship | strFilter }}</span>
												<span>
													<span class="storeName">{{ item2.name }}</span>
													<span class="storeValue" v-for="(statusValue, indexValue) in item2.values" :key="indexValue">
														{{ statusValue.name }}
													</span>
												</span>
											</li>
											<li v-if="item2.list.length > 0">
												<ul class="level4">
													<li v-for="(item3, index3) in item2.list" :key="index3">
														<div v-if="index3 == 0">
															<span class="statusT" v-if="index2 == 0 && index3 == 0 && show" :style="'top:' + item.height" >{{ item.list[0].status | getShip }}</span>
															<span class="ships" v-if="index3 == 0">{{ item3.ship | strFilter }}</span>
															<span>
																<span class="storeName">{{ item3.name }}</span>
																<span class="storeValue" v-for="(statusValue, indexValue) in item3.values" :key="indexValue">
																	{{ statusValue.name }}
																</span>
															</span>
														</div>
														<div v-else>
															<span class="statusT" v-if="index3 == 0" :style="'top:' + item.height">{{ item.list[0].status | getShip }}3</span>
															<span class="ships" v-if="index3 == 0">{{ item3.ship | strFilter }}</span>
															<span>
																<span class="storeName">{{ item3.name }}</span>
																<span class="storeValue" v-for="(statusValue, indexValue) in item3.values" :key="indexValue">
																	{{ statusValue.name }}
																</span>
															</span>
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
	export default {
		name: 'ScreenStore',
		props: ['storeList'],
		data() {
			return {
				show: false,
				cascaderProps: {
					multiple: true,
					value: "labelCode",
					label: "labelName",
					children: "childList"
				},
				storeType: [],
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
			this.getLevel()
		},
		methods: {
			getLevel() {
				this.getAllStatus()
				setTimeout(() => {
					this.getHeight()
				}, 50)
			},
			getHeight() {
				let _this = this
				for (var i = 0; i < _this.storeList.length; i ++) {
					_this.storeList[i].height = _this.getStoreHeight2(i)
				}
				let statusHeight = window.getComputedStyle(_this.$refs.storeHeight).height.substring(0, window.getComputedStyle(_this.$refs.storeHeight).height.indexOf('px'))
				if (statusHeight > 0) {
					_this.status1.height = (statusHeight / 2) - 15 + 'px'
				}
				_this.$nextTick(() => {
					_this.show = true
				})
			},
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
					// _this.storeList[i].height = _this.getStoreHeight2(i)
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
		width: 100%;
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
				
				.storeName {
					padding: 0px 10px;
					margin-right: 10px;
				}
				.storeValue {
					color: #AF3BF1FF;
					border-radius: 4px;
					border: 1px solid #A634EF;
					padding: 0px 10px;
					margin-right: 10px;
				}
				.storeValueLine {
					border: 1px solid #979797FF;
				}
				
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
					// padding-left: 15px;
					border-left: 1px solid #E2BDF8FF;
				}
				.level1 {
					padding-left: 30px;
					position: relative;
					white-space: nowrap;
				}
				.level2 {
					white-space: nowrap;
					margin-left: 25px;
					position: relative;
					// margin-left: 20px;
					padding-left: 30px;
					padding-bottom: 10px;
					border-left: 1px solid #E2BDF8FF;
					// margin-bottom: 10px;
					
				}
				.level3 {
					padding-left: 30px;
					white-space: nowrap;
				}
				.level4 {
					display: flex;
					white-space: nowrap;
					// padding-left: 18px;
				}
				
				
				.line {
					margin-bottom: 10px;
					width: 100%;
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
					// top: 10px;
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