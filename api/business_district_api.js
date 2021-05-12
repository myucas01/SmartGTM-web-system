/**
 * 商圈布局api
 * 注意：因为前端用代理，需要在api地址前边加 /api
 */
import Vue from 'vue';

// 获取baseapi
const base_api = Vue.prototype.$fetch


const BUSINESS_DISTRICT_API = {
    /**
     * @description 获取商圈布局列表
     * @param { object } params_obj {isResue:是否复用，0：不复用,1:复用, year: 财年}
     */
    get_district_list: (params_obj) => {
        return base_api.get('/api/project/list', params_obj).then(res => {
            if (res && res.code === '200' && res.data) {
                return res.data
            } else {
                console.error(' 商圈布局，获取商圈布局/复用列表 Error！')
                return ''
            }
        })
    },
    /**
     * @description 获取配置基本信息
     * @param { object } params_obj:{proId:商圈方案id}
     */
    get_project_info: (params_obj) => {
        return base_api.get('/api/business/grading/bcc/get-project-info', params_obj).then(res => {
            if (res) {
                return res
            } else {
                console.error(' 获取商圈布局配置基本信息 Error！')
                return ''
            }
        })
    },

    /**
     * @description 创建/修改商圈方案
     * @param { object } params_obj:{storeId:店铺id,orgId:组织id}
     */
    get_bcc_upset: (params_obj) => {
        return base_api.post('/api/business/grading/bcc/upset', params_obj).then(res => {
            if (res) {
                return res
            } else {
                console.error('创建/修改商圈方案 Error！')
                return ''
            }
        })
    },
    /**
     * @description 获取指标数据
     * @param { object } params_obj:暂无
     */
    get_bcc_target: (params_obj) => {
        return base_api.get('/api/business/grading/bcc/get-target', params_obj).then(res => {
            if (res) {
                return res
            } else {
                console.error('获取指标数据 Error！')
                return ''
            }
        })
    },
    /**
     * @description 获取布局范围树
     * @param { object } params_obj:暂无
     */
    get_org_tree: (params_obj) => {
        return base_api.get('/api/business/grading/bcc/get-org-tree', params_obj).then(res => {
            if (res) {
                return res
            } else {
                console.error('获取布局范围树 Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取商圈设置明细
     * @param { object } params_obj:{orgId：组织id，proId：商圈方案id}
     */
    get_project_detail: (params_obj) => {
        return base_api.get('/api/business/grading/bcc/bcc-project-detail', params_obj).then(res => {
            if (res) {
                return res
            } else {
                console.error('获取商圈设置明细 Error！')
                return ''
            }
        })
    },
    /**
     * @description 重置商圈
     * @param { object } params_obj:{orgId：组织id，proId：商圈方案id}
     */
    get_bcc_reset: (params_obj) => {
        return base_api.get('/api/business/grading/bcc/reset', params_obj).then(res => {
            if (res) {
                return res
            } else {
                console.error('重置商圈 Error！')
                return ''
            }
        })
    },
    /**
     * @description 复用一个方案
     * @param { object } params_obj {proDate: 商圈布局年份, proId: 复用id,  proName: 商圈布局名称, proQuarter: 商圈布局季度}
     */
    post_copy_project: (params_obj) => {
        return base_api.post('/api/project/reuse', params_obj).then(res => {
            if (res && res.code === '200') {
                return true
            } else {
                console.error(' 商圈布局，复用一个方案 Error！')
                return ''
            }
        })
    },

    /**
     * @description 删除一个方案
     * @param { object } pro_id 方案id 
     */
    delete_some_pro: (pro_id) => {
        return base_api.delete(`/api/project/${pro_id}`).then(res => {
            if (res.code === '200') {
                return res.data
            } else {
                console.error(' 删除一个方案 Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取商圈明细echarts
     * @param { object } params_obj {programId: 方案id, orgId: 组织id,orgType: 组织类型 } 
     */
    get_detail_charts: (params_obj) => {
        return base_api.get('/api/business/grading/detail/chart', params_obj).then(res => {
            if (res && res.code === '200' && res.data) {
                return res.data
            } else {
                console.error(' 商圈明细，获取echarts Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取商圈明细table列表
     * @param { object } params_obj {programId: 方案id, orgId: 组织id, businessLevel: 商圈等级, businessName: 商圈名, isExport: 是否导出, pageNum: 页数, pageSize:每页大小 } 
     */
    get_detail_list: (params_obj) => {
        return base_api.get('/api/business/grading/detail/info', params_obj).then(res => {
            if (res && res.code === '200' && res.data) {
                return res.data
            } else {
                console.error(' 商圈明细，获取列表 Error！')
                return ''
            }
        })
    },

    /**
     * @description 获取商圈明细-等级
     * @param { object } params_obj
     */
    get_detail_level: (params_obj) => {
        return base_api.get('/api/business/grading/detail/level', params_obj).then(res => {
            if (res && res.code === '200' && res.data) {
                return res.data
            } else {
                console.error(' 商圈明细，等级下拉列表 Error！')
                return ''
            }
        })
    },

    /**
     * @description 商圈预览-获取行政架构地图数据
     * @param { object } params_obj
     */
    get_preview_org_map_data: (params_obj) => {
        return base_api.get('/api/business/grading/overview/org/info', params_obj).then(res => {
            if (res && res.code === '200' && res.data) {
                return res.data
            } else {
                console.error(' Error！')
                return ''
            }
        })
    },

    /**
     * @description 商圈预览-获取商圈形态地图数据
     * @param { object } params_obj
     */
    get_preview_business_map_data: (params_obj) => {
        return base_api.get('/api/business/grading/overview/form', params_obj).then(res => {
            if (res && res.code === '200' && res.data) {
                return res.data
            } else {
                console.error(' Error！')
                return ''
            }
        })
    },

    /**
     * @description 商圈预览-获取行政架构地图数据
     * @param { object } params_obj
     */
    get_preview_region_map_data: (params_obj) => {
        return base_api.get('/api/business/grading/overview/administration', params_obj).then(res => {
            if (res && res.code === '200' && res.data) {
                return res.data
            } else {
                console.error(' Error！')
                return ''
            }
        })
    },

    /**
     * @description 商圈预览-获取商圈层级的行政架构
     * @param { object } params_obj
     */
    get_preview_region_tree_data: (params_obj) => {
        return base_api.get('/api/business/grading/getBccRegionTree', params_obj).then(res => {
            if (res && res.code === '200' && res.data) {
                return res
            } else {
                console.error(' Error！')
                return ''
            }
        })
    },

    /**
    * @description 获取商圈明细-org层级树
     * @param { object } params_obj
     */
    get_org_level: (params_obj) => {
        return base_api.get('/api/business/grading/detail/tree', params_obj).then(res => {
            if (res && res.code === '200' && res.data) {
                return res.data
            } else {
                console.error(' 商圈明细，org层级树 Error！')
                return ''
            }
        })
    },

    /**
    * @description 商圈列表-上传excel
    * @param { object } params_obj:文件对象 
    * @param { string } pro_no: 方案number
    */
     upload_excel_file: (params_obj, pro_no) => {
        return base_api.post('/api/project/import/excel/' + pro_no, params_obj, false, true).then(res => {
            if (res && res.code === '200') {
                return res
            } else {
                console.error(' 商圈列表，上传exce文件Error！')
                return ''
            }
        })
    },

    /**
    * @description 商圈明细-获取reason列表
    */
     get_reasons: (params_obj) => {
        return base_api.get('/api/business/grading/getLevelAdjustReason', params_obj).then(res => {
            if (res && res.code === '200') {
                return res.data
            } else {
                console.error(' 商圈明细，获取修改原因Error！')
                return ''
            }
        })
    },

    /**
    * @description 商圈明细-提交修改后的表单
    */
     submit_modification_form: (form_obj) => {
        return base_api.post('/api/business/grading/updateBusinessCircleByLevelAd', form_obj).then(res => {
            if (res && res.code === '200') {
                return res.data
            } else {
                console.error(' 商圈明细，提交修改后的表单成功Error！')
                return ''
            }
        })
    },
}

export default BUSINESS_DISTRICT_API