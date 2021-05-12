import Vue from "vue";

/**
 * 审批流程 相关接口
 */
const base_api = Vue.prototype.$fetch
const prefixUrl = 'api'

const approvalApi = {
    /**
     * 创建审批
     * @param { object } params
     * @param { string } orgId 组织ID
     * @param { string } yearMonth 年月
     * @returns {Promise<unknown>}
     */
    createApproval: (params) => base_api.post(`/${prefixUrl}/route/approve/upset`,params),
    /**
     *  同意/拒绝 审批
     * @param { object } params
     * @param { string } orgId 组织ID
     * @param { string } yearMonth 年月
     * @param { string } refuse 拒绝理由
     * @param { string } isResult 同意或拒绝（0-同意，1-拒绝）
     * @returns {Promise<unknown>}
     */
    replyApproval: (params) => base_api.post(`/${prefixUrl}/route/approve/upset`,params),
    /**
     * 审批流程
     * @param { object }  params
     * @param { string } orgId 组织ID
     * @param { string } yearMonth 年月
     * @returns {Promise<unknown>}
     */
    approvalList: (params) => base_api.get(`/${prefixUrl}/route/approve/list`,params),
    /**
     * 获取 当前审核计划
     * @param { object }  params
     * @param { string } orgId 组织ID
     * @param { string } yearMonth 年月
     * @returns {Promise<unknown>}
     */
    approvalPlan: (params) => base_api.get(`/${prefixUrl}/route/approve/getapproveinfo`,params),

}
export default approvalApi
