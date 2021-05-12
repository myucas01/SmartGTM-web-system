/**
 * 商机导航页面所有api
 * 注意：因为前端用代理，需要在api地址前边加 /api
 */
import Vue from 'vue';

// 获取baseapi
const base_api = Vue.prototype.$fetch


const BUSINESS_NAVIGATION_API = {
    /**
     * @description 获取门店详情
     * @param { object } params_obj:{storeId:店铺id,orgId:组织id}
     */
    get_store_detail: (params_obj) => {
        return base_api.get('/api/bn/store/detail', params_obj).then(res => {
            if (res.code === '200' && res.data) {
                return res.data
            } else {
                console.error(' 门店详情-月成交次数折线图 Error！')
                return ''
            }
        })
    },

    /**
     * @description 地图：标签筛选后，得到地图边界数据 {dealStatus,modelTags,poi,storeType,visitStatus}
     * @param { object } params_obj
     */
    get_map_store_by_tags: (params_obj) => {
        return base_api.get('/api/bn/store/query', params_obj).then(res => {
            if (res.code === '200' && res.data) {
                // 这里是为了orgName，因为此值在extData中，所以要返回res，而不是res.data
                return res
            } else {
                console.error(' 地图组织边界数据 Error！')
                return ''
            }
        })
    },

    /**
     * @description 地图：获取当下orgId的行政边界 {dealStatus,modelTags,poi,storeType,visitStatus}
     * @param { string } orgId
     */
    get_map_gov_by_org_id: (orgId) => {
        return base_api.get('/api/bn/store/org/area/data', {orgId: orgId}).then(res => {
            if (res.code === '200' && res.data) {
                return res.data
            } else {
                console.error(' 地图行政边界数据 Error！')
                return ''
            }
        })
    },

    /**
     * @description 导出门店，下载csv文件？？？
     * @param { object } params_obj:{orgId,type}
     */
    export_csv_file: (params_obj) => {
        return base_api.get('/api/bn/store/export', params_obj).then(res => {
            if (res.code === '200' && res.data) {
                return res.data
            } else {
                console.error(' 导出门店，下载csv文件 Error！')
                return ''
            }
        })
    },

    /**
     * @description 导出门店，列表table页
     * @param { object } params_obj:{orgId,pageNum,pageSize,type}
     */
    get_export_store_list: (params_obj) => {
        return base_api.post('/api/bn/store/page', params_obj).then(res => {
            if (res.code === '200' && res.data) {
                return res.data
            } else {
                console.error(' 导出门店，列表table页 Error！')
                return ''
            }
        })
    },

    /**
     * @description 同步门店列表到路线规划
     * @param { object } params_obj:{orgId,type}
     */
    sync_store_list: (params_obj) => {
        return base_api.post('/api/bn/store/sync/data', params_obj).then(res => {
            if (res) {
                return res
            } else {
                // console.error(' 同步门店列表到路线规划 Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取全部行政树
     * @param { object } regionCodes:{}
     */
    sync_region_list: (regionCodes) => {
        return base_api.get('/api/boundary/region/list', regionCodes).then(res => {
            if (res.code === '200' && res.data) {
                return res.data
            } else {
                alert(' 获取行政架构 Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取组织架构树(没有营业所)
     * @param { object } regionCodes:{}
     */
    sync_group_list: (regionCodes) => {
        return base_api.get('/api/route/job/post/query/list', regionCodes).then(res => {
            if (res.code === '200' && res.data) {
                return res.data
            } else {
                alert(' 获取组织架构 Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取组织架构(拿到营业所)
     * @param { object } regionCodes:{orgId}
     */
    sync_group_item_list: (regionCodes) => {
        return base_api.get('/api/boundary/orgregion/list', regionCodes).then(res => {
            if (res.code === '200' && res.data) {
                return res.data
            } else {
                alert(' 获取行政架构 Error！')
                return ''
            }
        })
    },

    /**
     * @description 更新地图上的门店位置 storeInfo_obj包含如下值
     * @param { object } storeInfo_obj
     * @param { string } id 门店ID
     * @param { string } warehouseLngLat 新经纬度
     * 
     */
    update_map_location: (storeInfo_obj) => {
        return base_api.post('/api/bn/store/upd/location', storeInfo_obj).then(res => {
            if (res.code === '200') {
                return {}
            } else {
                console.error(' 更新地图上的门店位置 Error！')
                return ''
            }
        })
    },

    /**
     * @description 用户画像总览
     * @param { object } params_obj
     */
    get_overview_pic_echart: (params_obj) => {
        return base_api.get('/api/bn/portrait/statistic', params_obj).then(res => {
            if (res.code === '200' && res.data) {
                return res.data
            } else {
                console.error('用户画像-门店销量情况 Error！')
                return ''
            }
        })
    },

    /**
     * @description  用户画像-门店结构分布
     * @param { object } params_obj
     */
    get_structure_pic_echart: (params_obj) => {
        return base_api.get('/api/bn/portrait/structure', params_obj).then(res => {
            if (res.code === '200' && res.data) {
                return res.data
            } else {
                console.error('用户画像-门店结构分布 Error！')
                return ''
            }
        })
    },

    /**
     * @description  用户画像-门店问题情况
     * @param { object } params_obj
     */
    get_structure_problem_pic_echart: (params_obj) => {
        return base_api.get('/api/bn/portrait/problem/structure', params_obj).then(res => {
            if (res.code === '200' && res.data) {
                return res.data
            } else {
                console.error('用户画像-门店问题情况 Error！')
                return ''
            }
        })
    },

    /**
     * @description  用户画像-门店销量情况,成交情况（echarts：折线图和柱状图）
     * @param { object } params_obj
     */
    get_sales_deals_pic_echart: (params_obj) => {
        return base_api.get('/api/bn/portrait/sale', params_obj).then(res => {
            if (res.code === '200' && res.data) {
                return res.data
            } else {
                console.error('用户画像-门店销量情况 Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取门店POI过滤菜单（左侧面板过滤器下拉菜单数据）
     */
    get_poi_list: () => {
        return base_api.get('/api/bn/store/poi').then(res => {
            if (res.code === '200' && res.data) {
                return res.data
            } else {
                console.error('获取门店POI过滤菜单 Error！')
            }
        })
    },

    /**
     * @description 康面自有标签 - 获取门店环境标签（左侧面板过滤器下拉菜单数据）&& 获取门店业务标签（左侧面板过滤器下拉菜单数据）
     */
    get_self_tags_list: () => {
        return base_api.get('/api/bn/store/self/tags').then(res => {
            if (res.code === '200' && res.data) {
                return res.data
            } else {
                console.error('获取门店POI过滤菜单 Error！')
            }
        })
    },
    
    /**
     * @description 康面模型标签 - 获取左侧面板的‘高，偏高，中，偏低，低’等五大类  bn/store/query/model/data
     * @param {*} params_obj 
     */
    get_model_tags_list: () => {
        return base_api.get('/api/bn/store/query/model/data').then(res => {
            if (res.code === '200' && res.data) {
                return res.data
            } else {
                console.error('获取门店模型过滤菜单 Error！')
            }
        })
    },

    /**
     * @description 获取门店类型过滤菜单（左侧面板过滤器下拉菜单数据）
     * @param { object } params_obj:{cate:1 || 2} 1: 图例 2:筛选条件下来
     */
    get_store_type_list: (params_obj)=> {
        return base_api.get('/api/bn/store/type', params_obj).then(res => {
            if (res.code === '200' && res.data) {
                return res.data
            } else {
                console.error('获取门店类型过滤菜单 Error！')
            }
        })
    },

    /**
     * @description 上传修改门店文件
     * @param { object } form_data_obj 上传的FormData对象
     */
    post_modified_stores_file: (form_data_obj)=> {
        return base_api.post('/api/bn/store/uploadStoreExcel', form_data_obj, false, true).then(res => {
            if (res) {
                return res
            } else {
                console.error('上传修改门店文件 Error！')
            }
        })
    },

    /**
     * @description 获取店铺辐射范围polygon
     * @param { object } params_obj 筛选条件
     */
    get_stores_range: (params_obj)=> {
        return base_api.get('/api/bn/store/range/combine', params_obj).then(res => {
            if (res) {
                return res.data
            } else {
                console.error('获取店铺辐射范围polygon Error！')
            }
        })
    },

    /**
     * @description 获取店铺热力图数据
     * @param { object } params_obj 筛选条件(只包括orgId一个参数)
     */
    get_stores_heat: (params_obj)=> {
        return base_api.get('/api/bn/store/heatmap', params_obj).then(res => {
            if (res) {
                return res.data
            } else {
                console.error('获取店铺热力图数据 Error！')
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
    }
}

export default BUSINESS_NAVIGATION_API
