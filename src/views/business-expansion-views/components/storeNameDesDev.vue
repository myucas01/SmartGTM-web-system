<template>
	<div class="item sp3" v-if="storeStep >= 3">
		<div class="edit" v-if="storeStep == 3">
			<div class="t">
				<span>填写店群名称和描述</span>
			</div>
			<div class="m">
				<div class="field">
					<span>商机门店</span>
					<el-input v-model="store.storesName" placeholder="请输入商机门店名称"></el-input>
				</div>
				<div class="field">
					<span>店群描述</span>
					<el-input v-model="store.storesDescribe" placeholder="请输入店群描述" type="textarea"></el-input>
				</div>
			</div>
		</div>
		<div class="show" v-if="storeStep == 4">
			<div class="t">
				<span>填写店群名称和描述</span>
			</div>
			<div class="m">
				<div class="field" v-if="store.storesName">
					<span>商机门店</span>
					<el-button type="primary" :title="store.storesName" v-if="store.storesDescribe.length > 30">{{ store.storesName.substring(0, 30) }}......</el-button>
					<el-button type="primary" v-else>{{ store.storesName }}</el-button>
				</div>
				<div class="field" v-if="store.storesDescribe">
					<span>店群描述</span>
					<el-button type="primary" :title="store.storesDescribe" v-if="store.storesDescribe.length > 30">{{ store.storesDescribe.substring(0, 30) }}......</el-button>
					<el-button type="primary" v-else>{{ store.storesDescribe }}</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'StoreNameDes',
		computed: {
			...mapGetters('businessExpansionModule', [
				'storeStep'
			])
		},
		filters: {
			getContrl: function(val) {
				return val == 1 ? '展开' : '收起'
			}
		},
		watch: {
			'store.storesName'(data) {
				if (data.length > 0) {
					this.$parent.screenNameDesDisabled = false
				} else {
					this.$parent.screenNameDesDisabled = true
				}
			}
		},
		data() {
			return {
				store: {
					storesName: '',
					storesDescribe: ''
				},
				contrlData: 1
			}
		},
		methods: {
			contrl() {
				this.contrlData = this.contrlData == 1 ? 2 : 1
			}
		}
	}
</script>

<style lang="scss" scoped>
	.sp3 {
		padding-left: 5px;
		.edit {
			.t {
				padding-bottom: 10px;
				span {
					font-size: 12px;
					font-weight: 600;
					color: #687082FF;
				}
			}
			.m {
				.field {
					margin: 15px 0px;
					span {
						width: 75px;
						margin-top: 5px;
						font-size: 12px;
						font-weight: 600;
						color: #7F8797;
						float: left;
					}
					.el-input,.el-textarea {
						width: 85%;
						margin-left: 15px;
					}
				}
			}
		}
		.show {
			.t {
				padding-bottom: 10px;
				span {
					font-size: 12px;
					font-weight: 600;
					color: #687082FF;
				}
			}
			.m {
				.field {
					margin: 15px 0px;
					span {
						width: 75px;
						margin-top: 5px;
						font-size: 12px;
						font-weight: 600;
						color: #7F8797;
						float: left;
					}
					.el-button {
						margin-left: 90px;
						margin-top: 15px;
						height: 32px;
						display: block;
						padding: 0px 8px;
						font-size: 12px;
						max-width: 450px;
					}
				}
			}
		}
	}
</style>
