const LayoutView = () => import ('../views/oauth-views/LayoutView.vue');

export default {
  path: '/oauth',
  component: LayoutView,
  children: [
    {
      path: '/',
      name: 'OauthIndex',
      component: () =>
        import (
          /* webpackChunkName: "OauthIndexView" */ '../views/oauth-views/IndexView.vue'
        ),
    },
    {
      // 用户管理
      path: 'user',
      name: 'user',
      component: () =>
        import (
          /* webpackChunkName: "RoutePlanningIndexView" */
          '../views/oauth-views/User.vue'
        ),
    },
    {
      // 用户管理
      path: 'userUpdate',
      name: 'userUpdate',
      component: () =>
        import (
          /* webpackChunkName: "RoutePlanningIndexView" */
          '../views/oauth-views/UpdateUser.vue'
        ),
    },
    // 角色管理
    {
      path: 'role',
      name: 'OauthRoleIndex',
      component: () =>
        import (
          /* webpackChunkName: "OauthIndexView" */ '../views/oauth-views/roleManage.vue'
        ),
    },
    // 菜单资源
    {
      path: 'menu-resource',
      name: 'menu-resource',
      component: () => import ('../views/oauth-views/menuResource.vue'),
    },
		// 日志报表
		{
		path: 'record',
		name: 'record',
		component: () => import ('../views/oauth-views/record.vue'),
		},
		// KPI报表
		{
		path: 'kpi-report',
		name: 'kpi-report',
		component: () => import ('../views/oauth-views/kpiReportForm.vue'),
		}
  ],
};
