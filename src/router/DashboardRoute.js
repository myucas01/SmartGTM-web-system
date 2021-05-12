const DashboardLayoutView = () => import('../views/dashboard-views/LayoutView.vue');

export default {
	path: '/dashboard',
	component: DashboardLayoutView,
	children: [
		{
			path: 'list',
			name: 'DashboardList',
			component: () =>
				import(
				/* webpackChunkName: "Dashboard" */ '../views/dashboard-views/DashboardView.vue'
				),
		},
		{
			path: 'detail/:area_id/:area_name/:type_id',
			name: 'DashboardDetail',
			component: () =>
				import(
				/* webpackChunkName: "Dashboard" */ '../views/dashboard-views/DashboardViewDetail.vue'
				),
		}
	],
};
