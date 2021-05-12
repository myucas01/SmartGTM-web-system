import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

import home from './modules/home';
import businessNavigationModule from './modules/business_navigation_module';
import businessExpansionModule from './modules/business_expansion_module';
import routerPlanning from './modules/routePlanning';
import businessPreview from './modules/business_preview';
import map from './modules/map';
import common from './modules/common';

Vue.use (Vuex);

export function createStore () {
  return new Vuex.Store ({
    modules: {
      home: home (),
      businessNavigationModule,
      businessExpansionModule,
      routerPlanning,
      businessPreview,
      map,
      common,
    },
    state: {
      user: {
        userName: '',
        userId: '',
        nickName: '',
        roleIdList: [],
        orgIdList: [],
        menuList: [],
        authorities: [],
      },
      show: 0,
      step: 1,
      channelName: '',
      tabs: JSON.parse (window.sessionStorage.getItem ('pages')) || [
        {
          isPathNameCheck: false,
          link: '/index',
          needCatch: true,
          on: true,
          pam: {},
          path: '/index',
          title: '• 首页',
        },
      ],
      readTotal: 0,
    },
    getters,
    mutations,
    actions,
  });
}
