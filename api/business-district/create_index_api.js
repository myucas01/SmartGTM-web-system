import Vue from "vue";
/**
 * 商圈  相关接口
 */
const base_api = Vue.prototype.$fetch;

const Api = {
    /**
     * @description 商圈 列表
     */
    businessDistrictsList: params => {
        return base_api.get('/api/project/bcc/list', params);
    },
    /**
     * @description 商圈 指标
     */
    businessTags: params => {
        return base_api.get('/api/project/bcc/target', params);
    },
    /**
     * @description  删除 商圈
     */
    deleteBusinessDistrict: params => {
        return base_api.delete('/api/business/grading/deleteBusinessCircle', params);
    },
    /**
     * @description  获取商圈等级列表
     */
    businessLevelList: params => base_api.get('/api/business/grading/getProStandardList', params),
    /**
     * @description  计算 商圈 等级
     */
    recommendBusinessLevel: data => base_api.post('/api/business/grading/show/calc', data),
    /**
     * @description  获取营业部对应的行政列表
     */
    regionTree: params => base_api.get('/api/business/grading/getRegionList', params),
    /**
     * @description  获取行销公司或者营业部
     */
    getOrgBoundary: params => base_api.get('/api/business/grading/getOrgBoundary', params),
    /**
     * @description  新增商圈
     */
    addBusinessCircle: data => base_api.post('/api/business/grading/saveBusinessCircle', data),
    /**
     * @description  更新商圈
     */
    updateBusinessCircle: data => base_api.post('/api/business/grading/updateBusinessCircle', data),
    /**
     * @description  查询商圈等级 调整原因
     */
    levelAdjustReason: params => base_api.get('/api/business/grading/getLevelAdjustReason', params),
    /**
     * @description  查询商圈等级 调整原因 详情
     */
    adjustReasonDetail: params => base_api.get('/api/business/grading/getBusinessLevelList', params),
    /**
     * @description  查询商圈详情
     */
    businessCircleDetail:  params => base_api.get('/api/business/grading/getBusinessCircleDetail', params),
    /**
     * @description  获取营业部组织列表
     */
    organizeList: params => base_api.get('/api/business/grading/getOrgList', params),
    /**
     * @description  获取 商圈 行政树
     */
    businessRegionTree: params => base_api.get('/api/business/grading/getBusinessRegion', params),
    /**
     * @description  锚点编辑更新行政树
     */
    updateTree: data => base_api.post('/api/business/grading/editBusinessTile', data),
    /**
     * @description  取消 商圈 编辑
     */
    cancelEdit: data => base_api.get('/api/business/grading/cancelEditBusiness', data),
    /**
     * @description  检查 商圈 编辑
     */
    checkEdit: data => base_api.get('/api/business/grading/checkEditBusiness', data),
    /**
     * @description  根据行政名称获取行政
     */
    getRegionBoundaryByRegionName: data => base_api.post('/api/business/grading/getRegionBoundaryByRegionName', data),
    /**
     * @description  取消 商圈 编辑
     */
    getStreetBoundary: data => base_api.post('/api/business/grading/getBoundary', data),
}
export default Api;
