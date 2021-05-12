const LayoutView = () =>
	import('../views/business-expansion-views/LayoutView.vue');

export default {
	path: '/business-expansion',
	component: LayoutView,
	children: [
		{
			// 门店上传，商机 or 种子
			path: 'index',
			name: 'businessExpansionIndex',
			component: () =>
				import(
          /* webpackChunkName: "BExpModelView" */ '../views/business-expansion-views/Index.vue'
				),
			meta: {
				keepAlive: true // 不需要被缓存
			}
		},
		{
			// 门店上传，种子门店
			path: 'seed-store',
			name: 'seedStore',
			component: () =>
				import(
          /* webpackChunkName: "BExpModelView" */ '../views/business-expansion-views/SeedStore.vue'
				),
			meta: {
				keepAlive: false // 不需要被缓存
			}
		},
		{
			// 地图，画像
			path: 'map',
			name: 'businessExpansionMap',
			component: () =>
				import(
          /* webpackChunkName: "BExpModelView" */ '../views/business-expansion-views/MapChart.vue'
				),
		},
		{
			// 店群详情列表
			path: 'store-community-list',
			name: 'businessNavigateIndexProblem',
			component: () =>
				import(
          /* webpackChunkName: "BExpModelView" */ '../views/business-expansion-views/StoreCommunityList.vue'
				),
		},
		{
			// 商机门店
			path: 'business-opportunity-store',
			name: 'BusinessStore',
			component: () =>
				import(
          /* webpackChunkName: "BExpModelView" */ '../views/business-expansion-views/BusinessOpportunityStore.vue'
				),
		},
		{
			// 商机门店-自主拓展
			path: 'store-autonomy-dev',
			name: 'StoreAutonomyDev',
			component: () =>
				import(
				/* webpackChunkName: "BExpModelView" */ '../views/business-expansion-views/StoreAutonomyDev.vue'
				),
		},
		{
			// 商机门店-AI自主拓展
			path: 'store-autonomy-Ai',
			name: 'StoreAutonomyAi',
			component: () =>
				import(
				/* webpackChunkName: "BExpModelView" */ '../views/business-expansion-views/StoreAutonomyAi.vue'
				),
		},
		{
			// gaia门店入口
			path: 'gaia-store',
			name: 'gaiaStore',
			component: () =>
				import(
				/* webpackChunkName: "BExpModelView" */ '../views/business-expansion-views/GaiaStore/GaiaIndex.vue'
				),
		},
	],
};
