import Vue from "vue";

/**
 * 划区建线 相关接口
 */
const base_api = Vue.prototype.$fetch
const prefixUrl = 'api'

const zoningApi = {
    /**
     * 获取预(草稿)计划
     * @param { object }  params
     * @param { string }  orgId 组织id
     * @param { string }  yearMonth 年月
     * @returns {Promise<unknown>}
     */
    getPlanId: (params) => base_api.get(`/${prefixUrl}/route/plandata/get-plan-id`, params),
    /**
     * 创建预(草稿)计划
     * @param { object }  data
     * @param { string }  orgId 组织id
     * @param { string }  planId 计划id
     * @param { string }  regionGenerationMethod 区域生成方式
     * @param { string }  routeGenerationMethod 路线生成方式
     * @param { string }  yearMonth 年月
     * @returns {Promise<unknown>}
     */
    createPlan: (data) => base_api.post(`/${prefixUrl}/route/plandata/create-preplan`, data),
    /**
     * 获取 草稿计划 配置数据
     * @param { object } params
     * @param { string } orgId 组织id
     * @param { string } planId 计划id
     * @returns {Promise<unknown>}
     */
    getDraftPlanParameter: (params) => base_api.get(`/${prefixUrl}/route/plandata/get-plandata`, params),
    /**
     * 修改/更新 草稿计划 配置
     * @param { object } data
     * @param { string } planId 计划id
     * @param { string } plannedPopulation 规划人数
     * @param { string } salesVolume 销量
     * @param { string } sellingPoints 售点数
     * @param { string } serviceDays 服务日天数
     * @param { string } visitDuration 在店时长
     * @param { string } workingHours    工作时长
     * @returns {Promise<unknown>}
     */
    upDraftPlanParameter: (data) => base_api.post(`/${prefixUrl}/route/plandata/update-plandata`, data),
    /**
     * 获取客户相关 属性
     * @param { object } params
     * @param { string } planId   预计划(草稿计划）id
     * @returns {Promise<unknown>}
     */
    clientAttribute: (params) => base_api.get(`/${prefixUrl}/route/plandata/get-query-properties`, params),
    /**
     * 获取客户数 列表
     * @param { object } params
     * @returns {Promise<unknown>}
     */
    clientDetailList: (params) => base_api.get(`/${prefixUrl}/route/plandata/get-plandata-detail`, params),
    /**
     * 获取组织下 业代类型 （常量/字典数据类）
     * @param orgNo
     * @returns {Promise<unknown>}
     */
    orgBuspreList: (params) => base_api.get(`/${prefixUrl}/route/plan/busprelist`, params),
    /**
     * 预(草稿) 计划 列表
     * @param { object } params
     * @param { string } orgId  组织id
     * @param { string } yearMoth 年月
     * @returns {Promise<unknown>}
     */
    draftPlanList: (params) => base_api.get(`/${prefixUrl}/route/plan/list`, params),
    /**
     * 删除 预(草稿）计划
     * @param prePlanNo 预计划编号
     * @returns {Promise<unknown>}
     */
    deleteDraftPlan: (prePlanNo) => base_api.delete(`/${prefixUrl}/route/plan/del`, {prePlanNo:prePlanNo}),
    /**
     * 确认/取消绑定 主计划
     * @param { object } params
     * @param { string } checkType 勾选或取消（0-勾选，1-取消）
     * @param { string } orgNo 组织编号
     * @param { string } planName 计划名称
     * @param { string } prePlanNo 预计划no
     * @param { string } salesType 业代key值
     * @param { string } yearMonth 年月
     * @returns {Promise<unknown>}
     */
    bindMainPlan: (params) => base_api.post(`/${prefixUrl}/route/plan/check`, params),
    /**
     * 划区 算法 接口
     * @param { object }params
     * @param { string } orgId 组织id
     * @param { string } prePlanNo  预计划(草稿计划）id
     * @returns {Promise<unknown>}
     */
    planZoning: (params) => base_api.get(`/${prefixUrl}/route/create/build-area`, params),
    /**
     * 建线 算法 接口
     * @param { object } params
     * @param { string } org_id 组织id
     * @param { string } pre_plan_no 预计划(草稿计划）id
     * @param { string } sale_type_code 业代类型code
     * @returns {Promise<unknown>}
     */
    buildingLine: (params) => base_api.get(`/${prefixUrl}/route/algorithm/area-line/create/build-line`, params),
    /**
     * 修改门店规划状态
     * @param { object } data
     * @param { string } generationMode 规划状态
     * @param { string } planId   计划id
     * @param { string } storeId  门店id
     * @returns {Promise<unknown>}
     */
    updateStoreStatus: (data) => base_api.post(`/${prefixUrl}/route/plandata/update-plandata-detail`, data),
    /**
     * 导出客户数详情
     * @returns {string}
     */
    downPlanStore: (params) => {
        let url = `/${prefixUrl}/route/plandata/downLoadPlanDataDetail?`
        for(let key in params) {
            url += `${key}=${params[key]}&`
        }
        return url
    },
    /**
     * 获取主计划 相关
     * @param { object }  params
     * @param { string }  orgId   组织id
     * @param { string }  yearMonth 年月
     * @returns {Promise<unknown>}
     */
    getMainPlan: (params) => base_api.get(`/${prefixUrl}/route/plan/getplaninfo`, params),
    /**
     * 导出拜访计划
     * @param params
     * @param { object }  params
     * @param { string }  endTime
     * @param { string }  startTime
     * @param { string }  orgId
     */
    downMainVisitPlan:  (params) => {
        let url = `/${prefixUrl}/route/plan/download-visit-data?`
        for(let key in params) {
            url += `${key}=${params[key]}&`
        }
        return url
    },
    /**
     * 导出拜访计划
     * @param params
     * @param { object }  params
     * @param { string }  endTime
     * @param { string }  startTime
     * @param { string }  orgId
     */
    downPlanData:  (params) => {
        let url = `/${prefixUrl}/route/plan/download-data?`
        for(let key in params) {
            url += `${key}=${params[key]}&`
        }
        return url
    },
    /**
     * @description 获取历史方案id
     * @param orgId 组织id  planMonth  日期-年月
     */
    get_all_history: params => {
        return base_api.get('/api/route/all/history', params);
    },
    /**
     * 历史 实际 可选时间
     * @param params
     * @returns {Promise<unknown>}
     */
    historyActualTime: (params) => base_api.get(`/${prefixUrl}/route/get/getActualPlanMonth`, params),
    /**
     *  修改计划名称
     * @param params
     * @returns {Promise<unknown>}
     */
    updatePlanName: (data) => base_api.post(`/${prefixUrl}/route/plandata/update_preplan_name`, data),
    /**
     *  获取门店调整日志
     * @param params
     * @returns {Promise<unknown>}
     */
    getStoreLog: (params) => base_api.get(`/${prefixUrl}/route/all/modify/store`, params),
    /**
     * 下载  门店调整 日志
     * @param params
     * @returns {string}
     */
    downStoreLog: (params) => {
        let url = `/${prefixUrl}/route/all/modify/store?`
        for(let key in params) {
            url += `${key}=${params[key]}&`
        }
        return url
    },
    /**
     *  获取门店操作类型
     * @param params
     * @returns {Promise<unknown>}
     */
    getStoreOperationType: (params) => base_api.get(`/${prefixUrl}/route/all/modify/enum`, params),
}
export default zoningApi
