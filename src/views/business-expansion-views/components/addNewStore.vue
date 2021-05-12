<template>
	<div class="item sp1" v-if="storeStep >= 0">
		<div class="edit" v-if="storeStep == 0">
			<span class="t">选择种子门店</span>
			<span class="i">
				<el-input v-model="store.storeName" placeholder="请选择" @focus="inputFocus" @blur="inputBlur" :title="store.storeNameLong" class="smart_input_light" :disabled="searchInputDisabled">
					<i
						:class="inputIcon"
						slot="suffix"
						@click="handleIconClick">
					</i>
				</el-input>
				<span class="num">{{ store.storeNum }}</span>
			</span>
			<div class="list" v-show="showList">
				<div class="h">
					<ul>
						<li v-for="item in valuableList" :key="item.code" @click="getStoreId(item)" :class=" item.code == store.storeId ? 'selected': ''">
							<span>{{ item.name }}</span><span>{{ item.num }}</span>
						</li>
						<li class="t" v-if="valuelessList.length > 0">以下是不可拓展的种子门店</li>
						<li class="x" v-for="itemb in valuelessList" :key="itemb.code">
							<span>{{ itemb.name }}</span><span>不可拓展</span>
						</li>
					</ul>
				</div>
				<div class="n" v-if="valuelessList.length == 0 && valuableList.length == 0">暂无数据</div>
			</div>
			<el-button type="primary" icon="el-icon-plus" @click="addStoreName">创建新种子门店</el-button>
		</div>
		<div class="show" v-if="storeStep > 0">
			<span class="t">选择种子门店</span>&nbsp;&nbsp;
			<el-tooltip placement="top">
				<div slot="content">GAIA会识别种子店群的相同特征（例如：门店基础信息、统计信息或特征），然后从GAIA门店中找到拥有相似（或类似）特征的店群</div>
				<span class="question">
					<svg t="1585551311735" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5000"
					width="16" height="16">
						<path d="M512 113.406976c-219.789312 0-398.601216 178.816-398.601216 398.61248 0 219.773952 178.811904 398.573568 398.601216 398.573568s398.601216-178.799616 398.601216-398.573568C910.601216 292.224 731.789312 113.406976 512 113.406976zM552.2176 803.094528l-80.04608 0 0-80.04608 80.04608 0L552.2176 803.094528zM679.120896 446.205952c-11.713536 21.086208-34.623488 46.728192-68.722688 76.92288-22.908928 20.303872-37.874688 35.275776-44.904448 44.904448-7.027712 9.632768-12.237824 20.694016-15.618048 33.188864-3.386368 12.494848-5.339136 32.799744-5.85728 60.913664L476.4672 662.135808c-0.262144-9.371648-0.390144-16.400384-0.390144-21.086208 0-27.588608 3.904512-51.406848 11.713536-71.455744 5.723136-15.09376 14.96576-30.321664 27.722752-45.683712 9.371648-11.190272 26.222592-27.529216 50.566144-49.00352 24.337408-21.476352 40.15104-38.590464 47.44192-51.347456 7.284736-12.750848 10.933248-26.68032 10.933248-41.780224 0-27.332608-10.677248-51.347456-32.018432-72.042496-21.348352-20.69504-47.509504-31.041536-78.485504-31.041536-29.937664 0-54.928384 9.370624-74.970112 28.11392-20.047872 18.742272-33.188864 48.026624-39.437312 87.855104l-72.237056-8.590336c6.504448-53.359616 25.832448-94.230528 57.985024-122.606592 32.146432-28.36992 74.641408-42.560512 127.488-42.560512 55.964672 0 100.606976 15.227904 133.931008 45.683712 33.317888 30.456832 49.980416 67.295232 49.980416 110.502912C696.691712 402.082816 690.835456 425.120768 679.120896 446.205952z"
						fill="#d4d4d4" p-id="5001"></path>
					</svg>
				</span>
			</el-tooltip>
			<el-button type="primary">{{ store.storeName }}</el-button>
		</div>
	</div>
</template>
<script>
	import { mapGetters } from 'vuex'
	export default {
		name: 'AddNewStore',
		computed: {
			...mapGetters('businessExpansionModule', [
				'storeStep'
			])
		},
		watch: {
			'store.storeName'(data) {
				if (data.length > 0) {
					// this.$set(this, 'inputIcon', 'el-icon-close')
					this.searchStore()  // 模糊搜索门店
				} else {
					// this.$set(this, 'inputIcon', 'el-icon-caret-bottom')
					this.store.storeId = ''
					this.store.storeNum = ''
					this.valuableList = this.store.valuableList
					this.valuelessList = this.store.valuelessList
				}
			},
			'store.storeId'(data) {
				if (data.length > 0) {
					this.$parent.screenDisabled = false
				} else {
					this.$parent.screenDisabled = true
				}
			},
			'inputIcon'(data) {
				if (data == 'el-icon-caret-bottom') {
					this.$set(this, 'showList', false)
				}
				if (data == 'el-icon-caret-top' || data == 'el-icon-search' || data == 'el-icon-close') {
					this.$set(this, 'showList', true)
				}
			},
		},
		data() {
			return {
				showList: false,
				searchInputDisabled: false,
				store: {
					storeId: '',
					storeName: '',
					storeNameLong: '',
					storeNum: '',
					valuableList: [],
					valuelessList: []
				},
				valuableList: [],
				valuelessList: [],
				inputIcon: 'el-icon-caret-bottom'
			}
		},
		created() {
			this.clear()  // 数据清空
			this.getStoreList() // 获取店群列表
		},
		methods: {
			back() { // 返回
				this.$router.go(-1)
			},
			getStoreInfo() {
				let _this = this
				if (_this.$route.query.storesId) {
					for (var i = 0; i < _this.valuableList.length; i ++) {
						if (_this.valuableList[i].code == this.$route.query.storesId) {
							let data = _this.valuableList[i]
							_this.store.storeId = data.code
							_this.store.storeName = data.name.toString(0, 25)
							_this.store.storeNameLong = data.name
							_this.searchInputDisabled = true
						}
					}
				}
			},
			clear() {
				let _this = this
				_this.valuableList = []
				_this.valuelessList = []
			},
			async getStoreList() {
				let _this = this
				let url = '/api/expand/business/searchSeededStores'
				await _this.$fetch.get(url).then(res => {
					if (res.data.valuableList && res.data.valuableList.length > 0) { // valuableList: 可拓展; storesName：店群名称； storesNumUse： 可用数量
						let valuableList_res = res.data.valuableList
						for (var i = 0; i < valuableList_res.length; i ++) {
							_this.store.valuableList.push({code: valuableList_res[i].id, name: valuableList_res[i].storesName, num: valuableList_res[i].storesNumUse})
						}
					}
					if (res.data.valuelessList && res.data.valuelessList.length > 0) {  // valuelessList：不可拓展; storesName：店群名称； 默认不可拓展
						let valuelessList_res = res.data.valuelessList
						for (var m = 0; m < valuelessList_res.length; m ++) {
							_this.store.valuelessList.push({code: valuelessList_res[m].id, name: valuelessList_res[m].storesName, type: 'n', num: '不可拓展'})
						}
					}
				})
				_this.valuableList = _this.store.valuableList
				_this.valuelessList = _this.store.valuelessList
				this.getStoreInfo()
			},
			searchStore() {
				let _this = this
				let data = []
				_this.valuableList = []
				_this.valuelessList = []
				
				data = _this.store.valuableList
				for (var i = 0; i < data.length; i ++) {
					if (data[i].name.indexOf(_this.store.storeName) != -1) {
						_this.valuableList.push(data[i])
					}
				}
				data = _this.store.valuelessList
				for (var m = 0; m < data.length; m ++) {
					if (data[m].name.indexOf(_this.store.storeName) != -1) {
						_this.valuelessList.push(data[m])
					}
				}
			},
			getStoreId(data) {
				let _this = this
				_this.$set(_this.store, 'storeId', data.code)
				_this.$set(_this.store, 'storeName', data.name.substring(0, 25))
				_this.$set(_this.store, 'storeNameLong', data.name)
				_this.$set(_this.store, 'storeNum', data.num)
				_this.$set(_this, 'inputIcon', 'el-icon-caret-bottom')
			},
			inputFocus() { // input获取焦点
				let _this = this
				if (_this.store.storeName == '') {
					_this.$set(_this, 'inputIcon', 'el-icon-search')
				} else {
					_this.$set(_this, 'inputIcon', 'el-icon-close')
				}
			},
			inputBlur() {  // input失去焦点
				// let _this = this
				// if (_this.store.storeName == '') {
				// 	_this.$set(_this, 'inputIcon', 'el-icon-caret-bottom')
				// }
			},
			addStoreName() {
				this.$router.push('/business-expansion/seed-store')
			},
			handleIconClick() {  // input Icon点击事件
				let _this = this
				if (_this.inputIcon == 'el-icon-close') {
					_this.$set(_this, 'showList', false)
					_this.store.storeName = ''
					_this.store.storeId = ''
					_this.store.storeNum = ''
				}
				if (_this.inputIcon == 'el-icon-caret-bottom') {
					_this.$set(_this, 'inputIcon', 'el-icon-caret-top')
				} else {
					_this.$set(_this, 'inputIcon', 'el-icon-caret-bottom')
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.sp1 {
		.edit {
			.t {
				font-size: 12px;
				font-weight: 600;
				color: #495060;
			}
			.i {
				position: relative;
				height: 32px;
				display: inline-block;
				.el-input {
					width: 400px;
					margin-left: 10px;
					cursor: pointer;
				}
				.num {
					position: absolute;
					color: #687082;
					right: 25px;
					top: 10px;
				}
			}
			.list {
				color: #687082FF;
				position: absolute;
				width: 380px;
				max-height: 200px;
				overflow: auto;
				left: 92px;
				top: 50px;
				padding: 10px;
				background: #FFFFFF;
				box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.04), 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
				border-radius: 4px 0px 0px 4px;
				.h {
					li {
						cursor: pointer;
						padding: 5px 10px;
						span {
							width: 80%;
							display: inline-block;
							&:last-child {
								float: right;
								width: 15%;
							}
						}
					}
					.t {
						background-color: #F8F8F9FF;
					}
					.selected {
						color: #A708EFFF;
					}
					.x {
						color: #BBBEC4;
					}
				}
			}
			.el-button {
				margin-left: 100px;
				width: 120px;
				height: 32px;
				padding: 0px;
				font-size: 12px;
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
				height: 42px;
				display: block;
				padding: 0px 8px;
				font-size: 12px;
			}
		}
	}
</style>
