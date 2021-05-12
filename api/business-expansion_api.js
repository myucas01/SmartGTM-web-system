/**
 * 商机拓展种子门店页面所有api
 */
import Vue from 'vue';
const base_api = Vue.prototype.$fetch;

const BUSINESS_EXPANSION_API = {
  /**
     * @description  获取行销公司
     * @param {object} params_obj:{}
     */
  get_company: params_obj => {
    return base_api
      .get ('/api/expand/seed/get-company', params_obj)
      .then (res => {
        if (res.code === '200' && res.data) {
          return res.data;
        } else {
          console.log ('获取行销公司列表  Error!');
          return '';
        }
      });
  },
  /**
     * @description  获取拆分规则
     * @param {object} params_obj:{}
     */
  get_split_rules: params_obj => {
    return base_api
      .get ('/api/expand/seed/get-split-rules', params_obj)
      .then (res => {
        if (res.code === '200' && res.data) {
          return res.data;
        } else {
          console.log ('获取行销公司列表  Error!');
          return '';
        }
      });
  },
  /**
     * @description  生成种子门店
     * @param {object} params_obj:{orgId:组织id,splitRatio:拆分规则比例,storesDescribe:门店描述	,storesName:店群名称}
     */
  post_create: params_obj => {
    return base_api.post ('/api/expand/seed/create', params_obj).then (res => {
      return res;
    });
  },
  /**
     * @description 导出门店，列表table页
     * @param { object } params_obj:{orgId,pageNum,pageSize,type}
     */
  post_export_store_list: params_obj => {
    return base_api
      .post ('/api/expand/business/store/list', params_obj)
      .then (res => {
        if (res.code === '200' && res.data) {
          return res.data;
        } else {
          console.error (' 导出门店，列表table页 Error！');
          return '';
        }
      });
  },
  /**
     * @description 导出门店，移除已有门店
     * @param { object } delStoreInfoDto:{id}
     */
  post_del_export_store: delStoreInfoDto => {
    return base_api
      .post ('/api/expand/business/del/store', delStoreInfoDto)
      .then (res => {
        if (res.code === '200' && res.data) {
          return res.data;
        } else {
          console.error (' 导出门店，列表table页 Error！');
          return '';
        }
      });
  },
  /**
     * @description  下载模板
     * @param 
     */
  getDownload: () => {
    return base_api
      .get ('/api/expand/business/store/template/download')
      .then (res => {
        if (res) {
          return res;
        }
      });
  },
  /**
     * @description  excel导入数据
     * @param file
     */
    upload_file: params =>  base_api.post ('/api/expand/business/upload',params, false, true),
    //     .then (res => {
    //       if (res.code === '200' && res) {
    //         return res;
    //       } else {
    //         console.error (' 导入Excel文件 Error！');
    //         return '';
    //       }
    //     });
    // },
  /**
     * @description 获取门店类型
     */
  get_store_type_select: () => {
    return base_api
      .get ('/api/expand/business/store/type/list', {})
      .then (res => {
        if (res.code === '200' && res.data) {
          return res.data;
        } else {
          console.error (' 导出门店，列表table页 Error！');
          return '';
        }
      });
  },
  /**
     * @description 获取行政架构树
     * @param { object } regionCodes:{}
     */
    sync_admin_tree_list: (regionCodes) => {
      return base_api.get('/api/expand/business/query/region', regionCodes).then(res => {
          if (res.code === '200' && res.data) {
              return res.data
          } else {
              alert(' 获取行政架构 Error！')
              return ''
          }
      })
  },
  /**
     * @description 获取不同类型的标签 下拉框数据
     * @param { object } regionCodes:{}
     */
    sync_total_labels_list: (regionCodes) => {
      return base_api.get('/api/expand/business/query/labels', regionCodes).then(res => {
          if (res.code === '200' && res.data) {
              return res.data
          } else {
              alert(' 获取标签数据 Error！')
              return ''
          }
      })
  },
  /**
   * @description GAIA门店左侧面板-门店类型下拉框数据
   * @param { object } regionCodes:{}
   */
  store_type_option_list: (regionCodes) => {
    return base_api.get('/bs-api/gaia_tag/expand/business/query/store-type', regionCodes).then(res => {
        if (res.code === '200' && res.data) {
            return res.data
        } else {
            alert(' 获取门店类型数据 Error！')
            return ''
        }
    })
  },
  /**
   * @description GAIA门店左侧面板-周围环境POI下拉框数据[商机拓展3期]
   * @param { object } regionCodes:{}
   */
  environment_poi_option_list: (regionCodes) => {
    return base_api.get('/bs-api/gaia_tag/expand/business/query/labels', regionCodes).then(res => {
        if (res.code === '200' && res.data) {
            return res.data
        } else {
            alert(' 获取周围环境POI数据 Error！')
            return ''
        }
    })
  },
  /**
   * @description GAIA门店-推送弹框行政架构树[省市区]
   * @param { object } regionCodes:{}
   */
  get_gaia_region_tree_list: () => {
    return base_api.get('/api/expand/business/getRegionTree', {}).then(res => {
        if (res.code === '200' && res.data) {
            return res.data
        } else {
            alert(' 获取行政数据 Error！')
            return ''
        }
    })
  },
  /**
   * @description GAIA门店-推送弹框行政架构树[街道]
   * @param { object } code:{}
   */
   get_gaia_region_street_list: (code) => {
    return base_api.get('/api/expand/business/getStreetRegionTree', {parentCode: code}).then(res => {
        if (res.code === '200' && res.data) {
            return res.data
        } else {
            alert(' 获取行政数据 Error！')
            return ''
        }
    })
  },
  /**
   * @description GAIA门店-推送弹框list[商机拓展3期]
   * @param { object } regionCodes:{}
   */
  gaia_pop_detail_list: (regionCodes) => {
    return base_api.post('/bs-api/gaia_tag/expand/business/page', regionCodes).then(res => {
        if (res.code === '200') {
            return res
        } else {
            alert(' 获取数据 Error！')
            return ''
          }
      })
    },
  /**
   * @description GAIA门店：获取地图接口
   * @param { object } params:{
   * modelTag<Array>,模型标签放在一起 [1,……20] 
   * storeCategory, 店铺类型
   * storePoiCode, 周围环境POI
   * uniStore 是否uni 1:已uni 0:未uni
   * 
   * latitude(1:行政边界 2:组织边界), 
   * orgArray, 组织id
   * ownStore, 是否为自有门店 1:自有门店 0:非自有门店 
   * regionCodes, 行政编码
   * }
   */
   post_map_data: (params) => {
    return base_api.post('/bs-api/bs/port/map', params).then(res => {
        if (res && res.code === '200' && res.data) {
            return res
        } else {
            console.error(' 获取GAIA地图数据 Error！')
            return ''
        }
    })
  },
  /**
   * @description GAIA门店-切换行政和组织的相互映射
   * @param { object } params:{current:当前类型编码, type: 1:组织转行政 2:行政转组织 }
   */
  get_switch_org_gov_data: (params) => {
    return base_api.get('/bs-api/bs/port/region2org', params).then(res => {
        if (res && res.code === '200' && res.data) {
            return res.data
        } else {
            console.error(' 获取GAIA 行政 <= = => 组织转换 Error！')
            return ''
        }
    })
  },

  /**
   * @description GAIA门店-获取门店详情
   * @param { object } params 只有店铺id
   */
   get_store_detail: (params) => {
    return base_api.get('/bs-api/bs/port/store/detail', params).then(res => {
        if (res && res.code === '200' && res.data) {
            return res.data
        } else {
            console.error(' 获取GAIA 店铺详情 Error！')
            return ''
        }
    })
  },

      /**
     * @description 画像-总数和结构情况
     * @param { object } params_obj
     */
    get_structure_pic_echart: (params_obj) => {
      return base_api.post('/bs-api/bs/port/struct', params_obj).then(res => {
          if (res.code === '200' && res.data) {
              return res.data
          } else {
              console.error('用户画像-门店销量情况 Error！')
              return ''
          }
      })
  },

  /**
   * @description  画像-覆盖
   * @param { object } params_obj
   */
  get_overview_pic_echart: (params_obj) => {
    return base_api.post('/bs-api/bs/port/coverage', params_obj).then(res => {
        if (res.code === '200' && res.data) {
            return res.data
        } else {
            console.error('用户画像-门店覆盖情况 Error！')
            return ''
        }
    })
  },

   /**
   * @description 获取左侧面板所有tips
   * @param { object } params_obj 筛选条件(key拼接的参数)
   */
  get_all_tips: (params_obj)=> {
    return base_api.get('/api/route/get/tips', params_obj).then(res => {
        if (res) {
            return res.data
        } else {
            console.error('获取提示数据 Error！')
        }
    })
  },
   /**
   * @description 商机拓展3期-获取门店类型图例数据
   */
  get_store_type_legend: ()=> {
    return base_api.get('/bs-api/bs/port/store/legend').then(res => {
        if (res) {
            return res.data
        } else {
            console.error('获取数据 Error！')
        }
    })
  },
  /**
   * @description 商机拓展3期-人口热力图
   * @param { object } params_obj 左上角和右下角经纬度信息
   */
   get_gaia_heat_map_data: (params_obj)=> {
    return base_api.get('/bs-api/gaia_tag/expand/business/population-heat-map', params_obj).then(res => {
        if (res) {
            return res.data
        } else {
            console.error('获取数据 Error！')
        }
    })
  },
  /**
   * @description 商机拓展3期-自有门店
   * @param { object } params_obj (左上角和右下角经纬度信息、组织ids、行政ids、latitude)
   */
   get_gaia_self_store_data: (params_obj)=> {
    return base_api.get('/bs-api/gaia_tag/expand/business/own-store/info', params_obj).then(res => {
        if (res) {
            return res
        } else {
            console.error('获取数据 Error！')
        }
    })
  },
};

export default BUSINESS_EXPANSION_API;
