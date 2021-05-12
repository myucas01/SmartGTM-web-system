/**
 * 商机导航页面所有api
 * 注意：因为前端用代理，需要在api地址前边加 /api
 */
import Vue from 'vue';

// 获取baseapi
const base_api = Vue.prototype.$fetch


const DASHBOARD_API = {
    /**
     * @description 获取地域组织层级列表
     */
    getOrgList: (params) => {
        return base_api.get('/api/bn/manager/tree', params).then(res => {
            if (res && res.code === '200' && res.data) {
                return res
            } else {
                console.error('获取地域组织层级列表 Error！')
            }
        })
    },

    /**
     * @description 获取底部四个总览模块数据（门店结构，门店销量，门店成交，门店问题）和饼图
     */
    getOverViewData: (params) => {
        return base_api.get('/api/bn/manager/data/queryOverView', params).then(res => {
            if (res && res.code === '200' && res.data) {
                return res
            } else {
                console.error('获取底部四个总览模块数据 Error！')
            }
        })
    },

    /**
     * @description 获取顶部四个总览模块数据（一阶总点数，折线图，新增点数，终止合作），也可用于详情页总览
     */
    getStatisticsData: (params) => {
        return base_api.get('/api/bn/manager/data/statistics', params).then(res => {
            if (res && res.code === '200' && res.data) {
                return res
            } else {
                console.error('获取顶部四个总览模块数据 Error！')
            }
        })
    },

    /**
     * @description 获取柱图数据（门店结构和销量）
     */
    getRadarContrastOrgData: (params) => {
        return base_api.get('/api/bn/manager/data/contrastDeal', params).then(res => {
            if (res && res.code === '200' && res.data) {
                return res
            } else {
                console.error(' 获取柱图数据（门店结构和销量） Error！')
            }
        })
    },
    /**
     * @description 获取柱图数据（门店成交和问题）
     */
    // getRadarContrastDealData: (params) => {
    //     return base_api.get('/api/navigation/data/contrastDeal', params).then(res => {
    //         if (res && res.code === '200' && res.data) {
    //             return res
    //         } else {
    //             console.error('获取柱图数据（门店成交和问题） Error！')
    //         }
    //     })
    // },
    /**
     * @description 获取table表格——门店结构
     */
    getStructureData: (params) => {
        return base_api.get('/api/bn/manager/structure/view', params).then(res => {
            if (res && res.code === '200' && res.data) {
                return res
            } else {
                console.error('获取table表格——门店结构 Error！')
            }
        })
    },
    /**
     * @description 获取table表格——门店销量
     */
    getSalesVolumeData: (params) => {
        return base_api.get('/api/bn/manager/structure/sales', params).then(res => {
            if (res && res.code === '200' && res.data) {
                return res
            } else {
                console.error('获取table表格——门店销量 Error！')
            }
        })
    },
    /**
     * @description 获取table表格——门店成交 + 问题
     */
    getDealAndProblemData: (params) => {
        return base_api.get('/api/bn/manager/structure/sales', params).then(res => {
            if (res && res.code === '200' && res.data) {
                return res
            } else {
                console.error('获取table表格——门店成交+问题 Error！')
            }
        })
    },

}

export default DASHBOARD_API