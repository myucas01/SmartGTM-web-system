<template>
	<el-table class="smart_table_deep" :data="tableList" size="mini" border fit style="width: 100%" height="200px">
		<el-table-column v-for="(item, index) in colList" :key="`colList_${index}`" 
		:prop="dropColList[index].prop" :label="item.label" :width="item.width" show-overflow-tooltip align="center"></el-table-column>
	</el-table>
</template>

<script>
	import Sortable from 'sortablejs'
	export default {
		props: ['tableList'],
		data() {
			return {
				colList: [{
						label: '区域',
						prop: 'precinctName',
						width: '100px'
					},
					{
						label: '客户编号',
						prop: 'storeNo',
						width: ''
					},
					{
						label: '客户名称',
						prop: 'storeName',
						width: ''
					},
					{
						label: '地址',
						prop: 'storeAddress',
						width: ''
					},
					{
						label: '客户类型',
						prop: 'storeTypeName',
						width: ''
					},
					{
						label: '售点分级',
						prop: 'storeScale',
						width: ''
					},
					{
						label: '异动原因',
						prop: 'changeTypeName',
						width: ''
					},
					{
						label: '拜访频次',
						prop: 'visitRate',
						width: ''
					},
					{
						label: '在店时长(分钟/次)',
						prop: 'shopTime',
						width: ''
					},
					{
						label: '数据来源',
						prop: 'dataSource',
						width: ''
					}
				],
				dropColList: [{
						label: '区域',
						prop: 'precinctName'
					},
					{
						label: '客户编号',
						prop: 'storeNo'
					},
					{
						label: '客户名称',
						prop: 'storeName'
					},
					{
						label: '地址',
						prop: 'storeAddress'
					},
					{
						label: '客户类型',
						prop: 'storeTypeName'
					},
					{
						label: '售点分级',
						prop: 'storeScale'
					},
					{
						label: '异动原因',
						prop: 'changeTypeName'
					},
					{
						label: '拜访频次',
						prop: 'visitRate'
					},
					{
						label: '在店时长(分钟/次)',
						prop: 'shopTime'
					},
					{
						label: '数据来源',
						prop: 'dataSource'
					}
				]
			}
		},
		mounted() {
			this.columnDrop()
		},
		methods: {
			columnDrop() {
				const wrapperTr = document.querySelector('.el-table__header-wrapper tr')
				Sortable.create(wrapperTr, {
					onEnd: evt => {
						const oldItem = this.dropColList[evt.oldIndex]
						this.dropColList.splice(evt.oldIndex, 1)
						this.dropColList.splice(evt.newIndex, 0, oldItem)
					}
				})
			}
		}
	}
</script>

<style>
</style>
