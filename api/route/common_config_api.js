import Vue from "vue";
const base_api = Vue.prototype.$fetch

const commonConfigApi = {
    /**
     * 查询营业所状态
     * @param { object } params
     * @param {string} orgName 组织名称
     * @param {string} yearMonth 年月
     */
    get_business_status: (params) => base_api.get('/api/route/index/get-org-plan-status', params),
    /**
     * 客户规模-查看行销公司
     * @param { string } orgName 关键字
     * @returns {Promise<unknown>}
     */
    get_company_info:(orgName) => base_api.get('/api/route/scale/company-info', orgName),
    /**
     * 客户规模-获取标签规模数据
     * @param { string } orgId 组织ID
     * @param { string } prePlanNo 预计划编码
     * @returns {Promise<unknown>}
     */
    get_scale_info:(params) => base_api.get('/api/route/scale/info', params),
    /**
     * 售点分级-获取行销公司对应的营业部数据
     * @param { string } orgId 组织ID
     */
    get_sale_level_company:(orgId) => base_api.get('/api/route/sales/get-company-depart', {orgId}),
    /**
     * 售点分级-获取售点分级列表数据
     * @param { string } orgId 组织ID
     */
    get_sale_level_list:(orgId) => base_api.get('/api/route/sales/get-sales', {orgId}),
    /**
     * 售点分级-创建或编辑售点分级
     * @param { string } salesLevelDto: 集合组成
     * @param { string } customerIds
     * @param { string } orgId
     * @param { string } salesLevel
     */
    create_sale_level:(salesLevelDto) => base_api.post('/api/route/sales/create', salesLevelDto),
    /**
     * 售点分级-删除售点分级
     * @param { string } salesLevelDto: 集合组成
     * @param { string } customerIds
     * @param { string } orgId
     */
    delete_sale_level:(salesLevelDto) => base_api.delete('/api/route/sales/del', salesLevelDto),
    /**
     * @description 客户规模-获取操作记录信息(操作日志)[客户规模、服务标准、岗位作业标准通用]
     * @param endTime
     * @param operatorId
     * @param operatorType
     * @param pageNum
     * @param pageSize
     * @param startTime
     * @param operatorTitle // 类型：客户规模、服务标准、岗位作业标准
     */
    get_record_query: (params) => base_api.get('/api/route/operation/record/query', params),
    /**
     * @description 获取操作人下拉框数据
     * @param pageNum
     * @param pageSize
     */
    get_record_operator: (params) => base_api.get('/api/route/operation/record/query/user', params),
    /**
     * @description 客户规模-编辑
     * @param scaleTagVo
     * scaleTagVo： {
     *   newScaleTagList： [],
     *   operatorId: '', // 当前登录人ID
     *   operatorName: '', // 当前登录人ID
     * }
     */
    post_save_scale: (params) => base_api.post('/api/route/scale/save-scale', params),

    /**
     * @description 岗位作业标准-获取岗位作业信息
     * @param orgId 组织ID
     * @param prePlanNo 预计华编码
     */
    get_work_standards_info: (params) => base_api.get('/api/route/job/post/query', params),
    /**
     * @description 岗位作业标准-删除岗位作业信息
     * @param jobStandardDelDto
     * jobStandardDelDto {
     *  "id": "",
     *  "operatorId": "",
     *  "operatorName": ""
     * }
     */
    get_work_standards_delete: jobStandardDelDto => base_api.post('/api/route/job/post/delJobPost', jobStandardDelDto),
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
    post_work_standards_update: jobStandardDto => base_api.post('/api/route/job/post/update/job', jobStandardDto),
    get_service_from_org: orgId =>base_api.get('/api/route/standard/get-standard', {orgId}),
    /**
     * @description 服务标准-查询服务关系配置详情【OK】
     * @param template_id 服务标准id
     * @param prePlanNo 预计划编码
     */
    // get_service_detail_list: (params) => base_api.get('/api/route/service/sale-detail/list', params),
    get_service_detail_list: (params) => base_api.get('/api/route/service/sale-detail-km/list', params),
    /**
     * @description 服务标准-查询当前配置下组织信息【OK】
     * @param template_id 服务标准id
     */
    get_service_template_org_list: template_id => base_api.get('/api/route/service/template-org/tree', {template_id}),
    /**
     * @description 服务标准-查询服务标准列表[服务标准配置 弹框]【OK】
     * @param page_size
     * @param page_num
     */
    get_service_standards_list: params =>base_api.get('/api/route/service/standard/list', params),
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
    post_service_standards_update: dto => base_api.post('/api/route/service/sale-detail/save', dto),
    /**
     * 修改拜访评率在店时长km
     * @param data
     * @returns {Promise<unknown>}
     */
    service_standards_edit: data => base_api.post('/api/route/service/sale-detail-km/save', data),
    /**
     * @description 服务关系-删除 拜访频次与在店时长单条数据【】
     * @param templateDetailId 客户类型ID
     */
    // delete_service_template_detail: params => base_api.post('/api/route/service/template-detail', params),
    delete_service_template_detail: params => base_api.get('/api/route/service/sale-detail-km/del', params),
    /**
     * @description 服务关系-查询客户列表【OK】
     * @param
     */
    get_service_position_list: (dic_type, configBig) => base_api.get('/api/route/service/service-position/list', {dic_type, configBig}),
    /**
     * @description 康面-获取客户类型
     * @param configBig （服务关系传参: A/B/其他，售点分级传参为空）
     */
    get_customer_type_list: (configBig) => base_api.get('/api/route/service/customer-type/list', {configBig}),
    /**
     * @description 服务标准-营业所关联服务标准配置【OK】
     * @param org_id
     * @param template_id
     */
    get_service_standard_relevance: params => base_api.get('/api/route/service/standard/relevance', params),
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
    post_service_position_save: dto => base_api.post('/api/route/service/service-position/save', dto),
		/**
		 * @description 导入服务标准
		 * @param
		 */
		post_service_export_file: params => base_api.post('/api/route/service/import-server-standard-data', params, false, true),
    /**
     * @description 服务标准-获取当前登录用户拥有哪些行销公司【OK】
     * @param
     */
    get_service_own_company_list: () => base_api.get('/api/route/service/own-company/list', {}),
    /**
     * @description 服务关系-获取所有的客户类型[新增或编辑弹框时，客户类型下拉框数据]【OK】-弃用
     * @param
     */
    get_service_saletaye_list: () => base_api.get('/api/route/service/sale-taye/list', {}),
    /**
     * @description 服务标准-获取当前行销公司下所有组织【OK】
     * @param org_id 行销公司id
     */
    get_service_organize_list: org_id => base_api.get('/api/route/service/own-company/organize/list', {org_id}),
    /**
     * @description 获取岗位作业标准组织架构
     * @param salesOfficeName 营业部名称
     */
    get_job_query_org: salesOfficeName =>base_api.get('/api/route/job/post/query/org', {salesOfficeName}),
    /**
     * @description 通用-组织架构树【只有两层】
     * @param
     */
    get_common_query_org: () => base_api.get('/api/boundary/orgregion/list', {}),
    get_work_standards_query_org: () => base_api.get('/api/route/job/post/query/list', {}),
    /**
     * @description km-获取岗位作业标准行销公司列表
     * @param salesOfficeName 行销公司名称
     */
    get_km_job_query_org: salesOfficeName =>base_api.get('/api/route/job/post/job/list', {salesOfficeName}),
    /**
     * 服务标准-服务标准配置弹框删除方案功能
     * @param { string } template_id
     */
    post_del_service_config:(template_id) => base_api.delete('/api/route/service/delete/standard', template_id),
    /**
     * 服务标准-修复名称
     * @param { string } template_id
     */
    edit_standard_name:(template_id) => base_api.get('/api/route/service/sale-detail-km/update', template_id),
}

export default commonConfigApi
