/**
 * 售点拓展-店群画像和地图
 * 注意：因为前端用代理，需要在api地址前边加 /api
 */
import Vue from 'vue';

// 获取baseapi
const base_api = Vue.prototype.$fetch;

const BUSINESS_EXP_API = {
  /**
     * @description 店群总量
     * @param { object } params_obj
     */
  get_stores_count: params_obj => {
    return base_api
      .get ('/api/expand/business/store/count', params_obj)
      .then (res => {
        if (res && res.code === '200' && res.data) {
          return res.data;
        } else {
          console.error (' 售点拓展-店群画像-店群总量 Error！');
          return '';
        }
      });
  },

  /**
     * @description 门店类型分类+TGI，POI类型分布+TGI
     * @param { object } params_obj
     */
  get_dash_TGI: params_obj => {
    return base_api
      .get ('/api/expand/business/store/portrait', params_obj)
      .then (res => {
        if (res && res.code === '200' && res.data) {
          return res.data;
        } else {
          console.error (' 售点拓展-店群画像-门店类型分类+TGI，POI类型分布+TGI Error！');
          return '';
        }
      });
  },

  /**
     * @description 门店所在地区分布（包括电机下钻）
     * @param { object } params_obj
     */
  get_dash_region: params_obj => {
    return base_api
      .get ('/api/expand/business/store/region', params_obj)
      .then (res => {
        if (res && res.code === '200' && res.data) {
          return res.data;
        } else {
          console.error (' 售点拓展-店群画像-门店所在地区分布 Error！');
          return '';
        }
      });
  },
  /**
     * @description 门店所在地区分布-返回
     * @param { object } params_obj
     */
  get_previous_dash_region: params_obj => {
    return base_api
      .get ('/api/expand/business/store/region/back', params_obj)
      .then (res => {
        if (res && res.code === '200' && res.data) {
          return res.data;
        } else {
          console.error (' 售点拓展-店群画像-门店所在地区分布返回 Error！');
          return '';
        }
      });
  },

  /**
     * @description 标签分布
     * @param { object } params_obj
     */
  get_dash_label: params_obj => {
    return base_api
      .get ('/api/expand/business/store/label', params_obj)
      .then (res => {
        if (res && res.code === '200' && res.data) {
          return res.data;
        } else {
          console.error (' 售点拓展-店群画像-标签分布 Error！');
          return '';
        }
      });
  },

  /**
     * @description icons图例
     * @param { object } params_obj
     */
  get_icons: () => {
    return base_api.get ('/api/expand/business/store/legend').then (res => {
      if (res && res.code === '200' && res.data) {
        return res.data;
      } else {
        console.error (' 售点拓展-店群画像-icons图例 Error！');
        return '';
      }
    });
  },

  /**
     * @description 店铺详情
     * @param { object } params_obj
     */
  get_store_detail: params_obj => {
    return base_api
      .get ('/api/expand/business/store/detail', params_obj)
      .then (res => {
        if (res && res.code === '200' && res.data) {
          return res.data;
        } else {
          console.error (' 店铺详情 Error！');
          return '';
        }
      });
  },

  /**
     * @description 获取店铺热力图数据
     * @param { object } params_obj 筛选条件(只包括orgId一个参数)
     */
  get_stores_heat: params_obj => {
    return base_api.get ('/api/bn/store/heatmap', params_obj).then (res => {
      if (res) {
        return res.data;
      } else {
        console.error ('获取店铺热力图数据 Error！');
      }
    });
  },

  /**
     * @description 地图：标签筛选后，得到地图边界数据 {dealStatus,modelTags,poi,storeType,visitStatus}
     * @param { object } params_obj
     */
  get_map_store_by_tags: params_obj => {
    return base_api
      .get ('/api/expand/business/getOrgBoundary', params_obj)
      .then (res => {
        if (res.code === '200' && res.data) {
          // 这里是为了orgName，因为此值在extData中，所以要返回res，而不是res.data
          return res;
        } else {
          console.error (' 地图组织边界数据 Error！');
          return '';
        }
      });
  },

  /**
     * @description 地图：获取当下orgId的行政边界 {dealStatus,modelTags,poi,storeType,visitStatus}
     * @param { string } storesId
     */
  get_map_gov_by_org_id: storesId => {
    return base_api
      .get ('/api/expand/business/getRegionBoundary', storesId)
      .then (res => {
        if (res.code === '200' && res.data) {
          return res.data;
        } else {
          console.error (' 地图行政边界数据 Error！');
          return '';
        }
      });
  },

  /**
     * @description 地图：点位聚合
     * @param { object } params_obj
     */
  get_Store_List: params_obj => {
    return base_api
      .get ('/api/expand/business/getStoreList', params_obj)
      .then (res => {
        if (res.code === '200' && res.data) {
          // 这里是为了orgName，因为此值在extData中，所以要返回res，而不是res.data
          return res;
        } else {
          console.error (' 地图点位数据 Error！');
          return '';
        }
      });
  },
};

export default BUSINESS_EXP_API;
