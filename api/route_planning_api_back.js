/**
 * 划区见线页面所有api
 */
import Vue from 'vue';

// 获取baseapi
const base_api = Vue.prototype.$fetch
const prefixUrl = 'api'

const Route_planning_api_back = {
    /**
     /**
     * @description 查询营业所状态
     * @param orgName 组织名称
     * @param yearMonth 年月
     */
    get_business_status: params => {
        return base_api.get('/api/route/index/get-org-plan-status', params);
    },
    /**
     * @description 客户规模-查看行销公司
     * @param
     * @param orgName 搜索关键字
     */
    get_company_info: orgName => {
        return base_api.get('/api/route/scale/company-info', {orgName});
    },
    /**
     * @description 客户规模-获取标签规模数据
     * @param orgId 组织ID
     */
    get_scale_info: orgId => {
        return base_api.get('/api/route/scale/info', {orgId});
    },
    /**
     * @description 客户规模-获取操作记录信息(操作日志)[客户规模、服务标准、岗位作业标准通用]
     * @param endTime
     * @param operatorName
     * @param operatorType
     * @param pageNum
     * @param pageSize
     * @param startTime
     * @param operatorTitle // 类型：客户规模、服务标准、岗位作业标准
     */
    get_record_query: params => {
        return base_api.get('/api/route/operation/record/query', params);
    },
    /**
     * @description 获取操作人下拉框数据
     * @param pageNum
     * @param pageSize
     */
    get_record_operator: params => {
        return base_api.get('/api/route/operation/record/query/user', params);
    },
    /**
     * @description 客户规模-编辑
     * @param scaleTagVo
     * scaleTagVo： {
     *   newScaleTagList： [],
     *   operatorId: '', // 当前登录人ID
     *   operatorName: '', // 当前登录人ID
     * }
     */
    post_save_scale: params => {
        return base_api.post('/api/route/scale/save-scale', params);
    },
    /**
     * @description 岗位作业标准-获取岗位作业信息
     * @param orgId 组织ID
     * @param prePlanNo 预计华编码
     */
    get_work_standards_info: (params) => {
        return base_api.get('/api/route/job/post/query', params);
    },
    /**
     * @description 岗位作业标准-删除岗位作业信息
     * @param jobStandardDelDto
     * jobStandardDelDto {
     *  "id": "",
     *  "operatorId": "",
     *  "operatorName": ""
     * }
     */
    get_work_standards_delete: jobStandardDelDto => {
        return base_api.post('/api/route/job/post/delJobPost', jobStandardDelDto);
    },
    /**
     * @description 岗位作业标准-新增/编辑岗位作业信息
     * @param jobStandardDto
     * jobStandardDelDto {
     *  "orgId": "",
     *  "amountPercentage": "", // 销量占比
     *  "day": "" // 工作日天数
     *  ...
     * }
     */
    post_work_standards_update: jobStandardDto => {
        return base_api.post('/api/route/job/post/update/job', jobStandardDto);
    },
    /**
     * 获取 草稿计划 配置数据
     * @param { object } params
     * @param { string } orgId 组织id
     * @param { string } planId 计划id
     * @param { string } regionGenerationMethod 区域生成方式
     * @param { string } routeGenerationMethod 路线生成方式
     * @param { string } yearMonth 年月
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
     * 划区 算法 接口
     * @param { object }params
     * @param { string } org_id 组织id
     * @param { string } pre_plan_no  预计划(草稿计划）id
     * @returns {Promise<unknown>}
     */
    planZoning: (params) => base_api.get(`/${prefixUrl}/algorithm/area-line/create/build-area`, params),
    /**
     * 建线 算法 接口
     * @param { object } params
     * @param { string } org_id 组织id
     * @param { string } pre_plan_no 预计划(草稿计划）id
     * @param { string } sale_type_code 业代类型code
     * @returns {Promise<unknown>}
     */
    buildingLine: (params) => base_api.get(`/${prefixUrl}/algorithm/area-line/create/build-line`, params),
    /**
     * 获取客户 属性
     * @param { object } params
     * @param { string } planId   预计划(草稿计划）id
     * @returns {Promise<unknown>}
     */
    clientAttribute: (params) => base_api.get(`/${prefixUrl}/algorithm/area-line/create/build-line`, params),
    /**
     * 获取客户数 列表
     * @param { object } params
     * @returns {Promise<unknown>}
     */
    clientDetailList: (params) => base_api.get(`/${prefixUrl}/route/plandata/get-plandata-detail`, params),
    get_service_from_org: orgId => {
        return base_api.get('/api/route/standard/get-standard', {orgId});
    },
    /**
     * @description 服务标准-查询服务关系配置详情【OK】
     * @param template_id 服务标准id
     * @param prePlanNo 预计划编码
     */
    get_service_detail_list: (params) => {
        return base_api.get('/api/route/service/sale-detail/list', params);
    },
    /**
     * @description 服务标准-查询当前配置下组织信息【OK】
     * @param template_id 服务标准id
     */
    get_service_template_org_list: template_id => {
        return base_api.get('/api/route/service/template-org/tree', {template_id});
    },
    /**
     * @description 服务标准-查询服务标准列表[服务标准配置 弹框]【OK】
     * @param page_size
     * @param page_num
     */
    get_service_standards_list: params => {
        return base_api.get('/api/route/service/standard/list', params);
    },
    /**
     * @description 服务标准-新增/编辑 拜访频次与在店时长【OK】
     * @param dto
     * {
     *  "templateId": "",
     *  "templateName": "",
     *  "sales": [] // 客户类型
     *  "tagInfos": [] // 在店时长和拜访频率
     *  ...
     * }
     */
    post_service_standards_update: dto => {
        return base_api.post('/api/route/service/sale-detail/save', dto);
    },
    /**
     * @description 服务关系-删除 拜访频次与在店时长单条数据【】
     * @param templateDetailId 客户类型ID
     */
    delete_service_template_detail: params => {
        return base_api.post('/api/route/service/template-detail', params);
    },
    /**
     * @description 服务关系-查询客户列表【OK】
     * @param
     */
    get_service_position_list: (dic_type) => {
        return base_api.get('/api/route/service/service-position/list', {dic_type});
    },
    /**
     * @description 服务标准-营业所关联服务标准配置【OK】
     * @param org_id
     * @param template_id
     */
    get_service_standard_relevance: params => {
        return base_api.get('/api/route/service/standard/relevance', params);
    },
    /**
     * @description 服务标准-新增服务关系[新增后保存]【X】
     * @param dto
     *  dto: {
     *   positions: [ // 职位数组
     *    {
     *      customers: [ // 客户名称数组
     *        customerName, // 客户名称
     *      ],
     *      empPosition, // 职位组名
     *     },
     *   ],
     *   templateId, // 方案id
     *   templateName, // 方案名称
     *  }
     */
    post_service_position_save: dto => {
        return base_api.post('/api/route/service/service-position/save', dto);
    },
    /**
     * @description 服务标准-获取当前登录用户拥有哪些行销公司【OK】
     * @param
     */
    get_service_own_company_list: () => {
        return base_api.get('/api/route/service/own-company/list', {});
    },
    /**
     * @description 服务关系-获取所有的客户类型[新增或编辑弹框时，客户类型下拉框数据]【OK】
     * @param
     */
    get_service_saletaye_list: () => {
        return base_api.get('/api/route/service/sale-taye/list', {});
    },
    /**
     * @description 服务标准-获取当前行销公司下所有组织【OK】
     * @param org_id 行销公司id
     */
    get_service_organize_list: org_id => {
        return base_api.get('/api/route/service/own-company/organize/list', {
            org_id,
        });
    },
    /**
     * @description 获取岗位作业标准组织架构
     * @param salesOfficeName 营业部名称
     */
    get_job_query_org: salesOfficeName => {
        return base_api.get('/api/route/job/post/query/org', {salesOfficeName});
    },
    /**
     * @description 通用-组织架构树【只有两层】
     * @param
     */
    get_common_query_org: () => {
        return base_api.get('/api/boundary/orgregion/list', {});
    },
    get_work_standards_query_org: () => {
        return base_api.get('/api/route/job/post/query/list', {});
    },
};

export default Route_planning_api_back;
