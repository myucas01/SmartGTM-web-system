const LayoutView = () =>
	import('../views/business-district-views/LayoutView.vue');

export default {
	path: '/business-district',
	component: LayoutView,
	children: [{
			path: '/',
			name: 'businessDistrictIndex',
			component: () =>
				import(
					/* webpackChunkName: "BusinessDistrictIndexView" */
					'../views/business-district-views/IndexView.vue'
				),
		},
		{
			// 商圈明细页
			path: 'business-district-detail',
			name: 'businessDistrictDetail',
			component: () =>
				import(
					/* webpackChunkName: "BusinessDistrictIndexView" */
					'../views/business-district-views/BusinessDistrictDetail.vue'
				),
		},
		{
			// 方案列表页
			path: 'business-district-scheme-list',
			name: 'businessDistrictSchemeList',
			component: () =>
				import(
					/* webpackChunkName: "BusinessDistrictIndexView" */
					'../views/business-district-views/businessDistrictSchemeList.vue'
				),
		},
		{
			// 编辑方案
			path: 'ConfigDetails',
			name: 'ConfigDetails',
			component: () =>
				import(
					/* webpackChunkName: "BusinessDistrictIndexView" */
					'../views/business-district-views/businessConfig/Index.vue'
				),
		},
		{
			// 新建方案
			path: 'addNewBusiness',
			name: 'addNewBusiness',
			meta: {keepAlive: true},
			component: () =>
				import(
					/* webpackChunkName: "BusinessDistrictIndexView" */
					'../views/business-district-views/addNewBusiness/Index.vue'
				),
		},
		{
			// 复用方案列表页
			path: 'business-district-scheme-copy-list',
			name: 'businessDistrictSchemeCopyList',
			component: () =>
				import(
					/* webpackChunkName: "BusinessDistrictIndexView" */
					'../views/business-district-views/BusinessDistrictSchemeCopyList.vue'
				),
		},
		// 展示效果配置
		{
			path: 'display-config',
			name: 'display-config',
			component: () => import('../views/business-district-views/displayConfig.vue'),
		},
		// 商圈预览
		{
			path: 'business-preview',
			name: 'business-preview',
			component: () => import('../views/business-district-views/BusinessPreview/previewIndex.vue'),
		},
		{
			path: 'create/:id',
			name: 'create',
			component: () =>
				import(
					/* webpackChunkName: "BusinessDistrictIndexView" */
					'../views/business-district-views/BusinessDistrictIndex.vue'
				),
		},
		{
			path: 'contrast',
			name: 'contrast',
			component: () =>
				import(
					/* webpackChunkName: "BusinessDistrictIndexView" */
					'../views/business-district-views/BusinessContrastIndex.vue'
				),
				meta: {keepAlive: true}
		},
		{
			path: 'adjust',
			name: 'businessAdjust',
			component: () =>
				import(
				/* webpackChunkName: "BusinessDistrictIndexView" */ '../views/business-district-views/businessAdjust.vue'
				),
		},
	]
};
