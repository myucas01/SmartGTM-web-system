const LayoutView = () =>
  import ('../views/route-planning-views/LayoutView.vue');

// const WorkStandardsConfig = () =>
//   import ('../views/route-planning-views/GlobalConfiguration/workStandardsConfig.vue');
const WorkStandardsEdit = () =>
  import (
    '../views/route-planning-views/GlobalConfiguration/workStandardsEdit.vue'
  );
const WorkStandardsonfig2 = () =>
  import (
    '../views/route-planning-views/GlobalConfiguration/workStandardsConfig2.vue'
  );
// const accountType = 'km'; // 康饮：ky 康面：km

export default {
  path: '/route-planning',
  component: LayoutView,
  children: [
    {
      path: '/',
      name: 'routePlanIndex',
      // meta: {keepAlive: true},
      component: () =>
        import (
          /* webpackChunkName: "RoutePlanningIndexView" */ '../views/route-planning-views/Index.vue'
        ),
    },
    {
      // 组织列表
      path: 'organize-list',
      name: 'organize-list',
      component: () =>
          import (
              /* webpackChunkName: "RoutePlanningIndexView" */ '../views/route-planning-views/OrganizeList.vue'
              ),
    },
    {
      // 全局配置
      path: 'global-config',
      name: 'global-config',
      component: () =>
        import (
          /* webpackChunkName: "RoutePlanningIndexView" */ '../views/route-planning-views/GlobalConfiguration/configIndex.vue'
        ),
    },
    { // 全局配置-客户规模配置(km是售点分级)
      path: 'customer-scale-edit',
      name: 'customer-scale-edit',
      meta: {keepAlive: true},
      component: () =>
        import (
          /* webpackChunkName: "RoutePlanningIndexView" */ '../views/route-planning-views/GlobalConfiguration/customerScaleEdit.vue'
        ),
    },
    { // 行销公司-客户规模配置(km是售点分级)
      path: 'company-scale-edit',
      name: 'company-scale-edit',
      component: () =>
        import (
          /* webpackChunkName: "RoutePlanningIndexView" */ '../views/route-planning-views/GlobalConfiguration/companyScaleEdit.vue'
        ),
    },
    {
      // 服务标准配置-编辑
      path: 'service-standards-edit',
      name: 'service-standards-edit',
      // meta: {keepAlive: true},
      component: () =>
        import (
          /* webpackChunkName: "RoutePlanningIndexView" */ '../views/route-planning-views/GlobalConfiguration/serviceStandardsEdit.vue'
        ),
    },
    {
      // 服务标准-选择配置页
      path: 'service-standards-config',
      name: 'service-standards-config',
      meta: {keepAlive: true},
      component: () =>
        import (
          /* webpackChunkName: "RoutePlanningIndexView" */ '../views/route-planning-views/GlobalConfiguration/serviceStandardsConfig.vue'
        ),
    },
    {
      // 岗位作业标准编辑
      path: 'work-standards-edit',
      name: 'work-standards-edit',
      component: WorkStandardsEdit,
      // meta: {keepAlive: true},
    },
    {
      // 岗位作业标准-选择配置页
      // 根据康饮和康面 跳转到不同的页面
      name: 'work-standards-config',
      path: 'work-standards-config',
      meta: {keepAlive: true},
      // component: accountType === 'km' ? WorkStandardsConfig : WorkStandardsEdit,
      component: WorkStandardsonfig2,
    },
    {
      path: 'build-route', // 划区建线
      name: 'BuildRoute',
      meta: {keepAlive: false},
      component: () =>
        import (
          /* webpackChunkName: "RoutePlanningIndexView" */ '../views/route-planning-views/BuildRoute.vue'
        ),
    },
    {
      path: 'data-check', // 数据检查
      name: 'DateCheck',
      meta: {keepAlive: false},
      component: () =>
          import (
              /* webpackChunkName: "RoutePlanningIndexView" */ '../views/route-planning-views/DataCheckIndex.vue'
              ),
    },
    {
      path: 'plan-list', // 计划列表
      name: 'PlanList',
      meta: {keepAlive: false},
      component: () =>
          import (
              /* webpackChunkName: "RoutePlanningIndexView" */ '../views/route-planning-views/PlanList.vue'
              ),
    },
    {
      path: 'plan-preview', //计划预览
      name: 'planPreview',
      meta: {keepAlive: false},
      component: () =>
        import ('../views/route-planning-views/PreviewProgram.vue'),
    },
    {
      path: 'comparison-plan', //对比计划
      name: 'ComparisonPlan',
      meta: {keepAlive: false},
      component: () =>
        import ('../views/route-planning-views/ComparisonPlan.vue'),
    },
    {
      path: 'approve', // 审批
      name: 'approve',
      component: () =>
        import (
          /* webpackChunkName: "RoutePlanningIndexView" */ '../views/route-planning-views/Approve.vue'
        ),
    },
    {
      path: 'plan-detail/:id', // 计划详情
      name: 'planDetail',
      component: () =>
        import (
          /* webpackChunkName: "RoutePlanningIndexView" */ '../views/route-planning-views/PlanDetail.vue'
        ),
    },
    {
      path: 'organize-list',
      name: 'organize-list',
      component: () =>
        import ('../views/route-planning-views/OrganizeList.vue'),
    },
  ],
};
