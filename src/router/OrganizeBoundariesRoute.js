const LayoutView = () =>
  import ('../views/organize-boundaries-views/LayoutView.vue');

export default {
  path: '/organize-boundaries',
  component: LayoutView,
  children: [
    // {
    //   path: '/',
    //   name: 'organizeBoundariesIndex',
    //   component: () =>
    //     import (
    //       /* webpackChunkName: "OrganizeBoundariesIndexView" */ '../views/organize-boundaries-views/OrganizeList.vue'
    //       ),
    // },
    {
      path: 'organize-list',
      name: 'organizeList',
      component: () =>
        import (
          /* webpackChunkName: "OrganizeBoundariesIndexView" */ '../views/organize-boundaries-views/OrganizeList.vue'
        ),
      meta: {keepAlive: false},
    },
    {
      path: 'organize-edit',
      name: 'OrganizeEdit',

      component: () =>
        import (
          /* webpackChunkName: "OrganizeBoundariesIndexView" */ '../views/organize-boundaries-views/OrganizeEditNew.vue'
        ),
      meta: {keepAlive: false},
    },
    {
      path: 'organize-point-edit',
      name: 'OrganizePointEdit',

      component: () =>
        import (
          /* webpackChunkName: "OrganizeBoundariesIndexView" */ '../views/organize-boundaries-views/OrganizePointEdit.vue'
        ),
      meta: {keepAlive: false},
    },
    {
      path: 'organize-detail',
      name: 'OrganizeDetail',
      component: () =>
        import (
          /* webpackChunkName: "OrganizeBoundariesIndexView" */ '../views/organize-boundaries-views/OrganizeDetail.vue'
        ),
      meta: {keepAlive: false},
    },
    {
      path: 'organize-adjust',
      name: 'OrganizeAdjust',
      component: () =>
        import (
          /* webpackChunkName: "OrganizeBoundariesIndexView" */ '../views/organize-boundaries-views/OrganizeAdjust.vue'
        ),
    },
    {
      path: 'show-deploy',
      name: 'ShowDeploy',
      component: () =>
        import (
          /* webpackChunkName: "OrganizeBoundariesIndexView" */ '../views/organize-boundaries-views/ShowDeploy.vue'
        ),
      meta: {keepAlive: false},
    },
  ],
};
