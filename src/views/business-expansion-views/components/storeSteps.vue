<template>
	<el-steps direction="vertical" :active="storeStep" finish-status="success">
	<el-step title="" ref="addStoreModule" :style="flexBasis1"></el-step>
	<el-step title="" ref="screenStoreModule" :style="flexBasis2"></el-step>
	<el-step title="" ref="storeNameDesModule" :style="flexBasis3"></el-step>
	<el-step title="" ref="storeNameDesModule" :style="flexBasis4"></el-step>
	</el-steps>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		name: "StoreSteps",
		computed: {
			...mapGetters('businessExpansionModule', [
				'storeStep'
			])
		},
		data() {
			return {
				flexBasis1: {flexBasis: '0px'},
				flexBasis2: {flexBasis: '0px'},
				flexBasis3: {flexBasis: '0px'},
				flexBasis4: {flexBasis: '0px'}
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .el-step__icon.is-text {
		border: 1px solid;
	}
	::v-deep .el-step__head.is-success {
		color: #A634EF;
		border-color: #A634EF;
	}
	::v-deep .el-step__head.is-process {
		color: #A634EF;
		border-color: #A634EF;
	}
	::v-deep .el-step__head.is-wait {
		color: #a634ef30;
		border-color: #a634ef30;
	}
	::v-deep .el-step__line {
		width: 1px!important;
		background-color: #A634EFFF;
	}
</style>
