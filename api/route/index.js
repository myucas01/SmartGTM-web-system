// 获取baseapi
import zoningApi from "./zoning_api";
import commonConfigApi from "./common_config_api";
import approvalApi from './approval_api'
import planPreviewApi from './planpreview_api'
import Vue from "vue";

const base_api = Vue.prototype.$fetch
const prefixUrl = 'api'
const ROUTE_PLANNING_API = {
    ...zoningApi,
    ...commonConfigApi,
    ...approvalApi,
    ...planPreviewApi,
    /**
     * 获取 当前组织结构的父级结构
     * @param { object } params
     * @param { string } orgId 组织id
     * @param { string } prePlanNo 预计划no
     * @returns {Promise<unknown>}
     */
    getParentOrg:(params) => base_api.get(`/${prefixUrl}/route/plan/getparentorg`,params),
    /**
     * webSocket 地址
     * @param userId
     * @returns {string}
     */
    wsUrl: (userId) =>{
        return `/ws-api/socket/${userId}`
    }
};

export default ROUTE_PLANNING_API;
