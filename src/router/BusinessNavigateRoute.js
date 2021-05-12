const LayoutView = () =>
	import('../views/business-navigate-views/LayoutView.vue');

export default {
	// panelType：面板类型：一个是售点盘点(sale)的两个选项卡，一个是问题门店(problem)三个选项卡，默认为全国orgId
	path: '/business-navigate',
	component: LayoutView,
	children: [
		{
			path: 'sale',
			name: 'businessNavigateIndexSale',
			component: () =>
				import(
          /* webpackChunkName: "BNavDashboardView" */ '../views/business-navigate-views/Index.vue'
				),
		},
		{
			path: 'problem',
			name: 'businessNavigateIndexProblem',
			component: () =>
				import(
          /* webpackChunkName: "BNavDashboardView" */ '../views/business-navigate-views/Index.vue'
				),
		},
		// {
		// 	path: 'dashboard/:area_id',
		// 	name: 'DashboardList',
		// 	component: () =>
		// 		import(
        //   /* webpackChunkName: "BNavDashboardView" */ '../views/dashboard-views/DashboardView.vue'
		// 		),
		// },
		// {
		// 	path: 'dashboard-detail/:area_id/:area_name/:type_id',
		// 	name: 'DashboardDetail',
		// 	component: () =>
		// 		import(
        //   /* webpackChunkName: "BNavDashboardView" */ '../views/dashboard-views/DashboardViewDetail.vue'
		// 		),
		// },
		{
			path: 'bidata',
			name: 'businessNavigateBidata',
			component: () =>
				import(
          /* webpackChunkName: "BNavDashboardView" */ '../views/business-navigate-views/mesData.vue'
				),
		},
	],
};
