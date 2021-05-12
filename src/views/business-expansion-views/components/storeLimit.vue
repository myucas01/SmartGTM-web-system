<template>
	<div class="item sp4" v-if="storeStep >= 2">
		<div class="edit">
			<div class="t">
				<span>店群数量限制</span>
			</div>
			<div class="m">
				<el-checkbox v-model="limit"></el-checkbox>
				限制店群返回数量 随机返回
				<el-input v-model="number" type="number" :title="number"></el-input>
				家
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'StoreLimit',
		computed: {
			...mapGetters('businessExpansionModule', [
				'storeStep'
			])
		},
		data() {
			return {
				limit: true,
				number: ''
			}
		},
		watch: {
			'number'(data) {
				if (data.length > 0) {
					this.limit = true
					this.$parent.limitDisabled = false
				} else {
					this.limit = false
				}
			},
			'limit'(data) {
				if (data) {
					if (this.number.length > 0) {
						this.$parent.limitDisabled = false
					} else {
						this.$parent.limitDisabled = true
					}
				} else {
					this.number = ''
					this.$parent.limitDisabled = false
				}
			}
		},
		created() {
			if (this.number.length > 0 && this.limit) {
				this.$parent.limitDisabled = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.sp4 {
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
				font-size: 12px;
				font-weight: 400;
				color: #495060;
				.el-input {
					width: 57px;
					margin: 0 3px;
				}
				.el-checkbox {
					margin: 0 3px;
				}
				::v-deep .el-input__inner {
					height: 24px;
					line-height: 24px;
					padding: 0px;
					text-align: center;
				}
			}
		}
	}
</style>
