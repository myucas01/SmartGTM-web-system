import Vue from 'vue';

/**
 * 划区建线 相关接口
 */
const base_api = Vue.prototype.$fetch;
const Api = {
   /**
    * @description 检查计划是否存在
    * @param planId 计划id
    */
   get_check_HavePlan: params => {
      return base_api.get('/api/route/get/checkHavePlan', params);
   },  
   /**
    * @description 获取组织架构
    * @param programId 方案id
    */
   get_route_org: params => {
      return base_api.get('/api/route/all/org', params);
   },
   /**
    * @description 获取职务类型和片区信息
    * @param programId 方案id
    */
   get_route_position: params => {
      return base_api.get('/api/route/all/position', params);
   },
   /**
    * @description 调整路线-清除
    * @param jobId 岗位id  programId 方案id
    */
   get_clear_line: params => {
      return base_api.get('/api/route/all/clear/line', params);
   },
   /**
    * @description 获取路线和门店数据
    * @param areaId 片区id  visitWeek 周期
    */
   get_all_routes: params => {
      return base_api.get('/api/route/all/routes', params);
   },
   /**
    * @description 获取服务日列表
    * @param prePlanNo 当前服务日 prePlanNo 预计划编号 precinctNo 片区编号
    */
   get_select_day: data => {
      return base_api.get('/api/route/serviceday/select/day', data);
   },
   /**
    * @description 调整服务日
    * @param currentServiceDay 当前服务日 prePlanNo 预计划编号 precinctNo 片区编号 targetServiceDay 目标服务日 visitWeek 周期
    */
   get_service_day: data => {
      return base_api.post('/api/route/serviceday/update/day', data);
   },
   /**
    * @description 获取行政区划
    * @param orgId 组织id  type 行政类型
    */
   get_all_zoning: params => {
      return base_api.get('/api/route/all/zoning', params);
   },
   /**
    * @description 查询业代列表
    * @param orgId 组织id  type 行政类型
    */
   get_select_sales: params => {
      return base_api.get('/api/route/region/select/sales', params);
   },
   /**
    * @description 获取经销商分布
    * @param orgId 组织id  programId 方案id
    */
   get_all_agency: params => {
      return base_api.get('/api/route/all/agency', params);
   },
   /**
   /**
    * @description 区域关联业代：完成调整
    * @param empName 业代人员名称  empNo 业代人员code  precinctNo 片区编号
    */
   get_precinctinfo: params => {
      return base_api.post('/api/route/region/update/precinctinfo', params);
   },
   /**
    * @description 区域调整：完成调整
    * @param prePlanNo 预计划编号  precinctGeom 片区边界  precinctNo 片区编号
    */
   get_update_complete: params => {
      return base_api.post('/api/route/region/update/complete', params);
   },
   /**
    * @description 区域调整：查询新增片区名称和颜色
    * @param precinctCount	片区个数
    */
   get_pre_NameAndColor: params => {
      return base_api.get('/api/route/region/get/precinctNameAndColor', params);
   },
   /**
    * @description 区域调整：新增区域
    * @param planDataNo	规划数据编号
    * prePlanNo	预计划编号
    * precinctCount	区域个数
    * precinctGeom	片区边界
    * salesTypeCode	业代类型
    * salesTypeName	业代类型名称
    */
   get_add_Precinct: params => {
      return base_api.post('/api/route/region/add/addPrecinct', params);
   },
   /**
    * @description 基本信息
    * @param storeId 门店id
    */
   get_select_info: params => {
      return base_api.get('/api/route/store/select/info', params);
   },
   /**
    * @description 月成交次数，月销量
    * @param storeId 门店id
    */
   get_store_detail: params => {
      return base_api.get('/api/bn/store/detail', params);
   },
   /**
    * @description 获取验证码
    * @param 无参数
    */
   get_select_code: params => {
      return base_api.get('/api/route/store/select/code', params);
   },
   /**
    * @description 校验验证码是否正确
    * @param verifyCode 验证码
    */
   get_check_code: params => {
      return base_api.get('/api/route/store/check/code', params);
   },

   /**
    * @description 获取拜访信息
    * @param planId 计划id  storeId 门店id   whatWeek 哪一周
    */
   get_visit_information: params => {
      return base_api.get('/api/route/customer-details/get-visit-information', params);
   },

   /**
    * @description 获取拜访计划
    * @param planId 计划id storeId门店id
    */
   get_visit_plan: params => {
      return base_api.get('/api/route/customer-details/get-visit-plan', params);
   },
   /**
    * @description 获取岗位片区
    * @param planId 计划id
    */
   get_sales_precinct: params => {
      return base_api.get('/api/route/customer-details/get-sales-precinct', params);
   },
   /**
    * @description 修改定位
    * @param storeId 门店id gdLat 高德纬度  gdLng 高德经度
    */
   get_update_location: params => {
      return base_api.post('/api/route/store/update/location', params);
   },
   /**
    * @description 修改拜访信息
    * @param empName 人员名称
    * planId 计划id
    * storeId 门店id
    * whatWeek 哪一周
    */
   get_updata_information: params => {
      return base_api.post('/api/route/customer-details/update-visit-information', params);
   },
   /**
    * @description 修改拜访计划
    * @param
    * planId 计划id
    * storeId 门店id
    * storeName 门店名称
    * storeNo 门店编码
    * visitPlanList 要修改的计划
    * weekDay 周几
    * whatWeek 哪一周
    */
   get_updata_plan: params => {
      return base_api.post('/api/route/customer-details/update-visit-plan', params);
   },
   /**
    * @description 获取数据总览-片区
    * @param areaIds 片区ids  visitWeek 周期
    */
   get_all_area: params => {
      return base_api.get('/api/route/all/area', params);
   },
   /**
    * @description 获取数据总览-路线
    * @param areaId 片区id
    */
   get_routes_count: params => {
      return base_api.get('/api/route/all/routes/count', params);
   },
   /**
    * @description 获取数据总览-门店
    * @param routeId 路线id
    */
   get_all_stores: params => {
      return base_api.get('/api/route/all/stores', params);
   },
   /**
    * @description 还原片区
    * @param pre_plan_no  预计划编号    sales_type_code 业代类型id  orgId 营业所id
    */
   get_create_precinct: params => {
      return base_api.get('/api/route/algorithm/area-line/create-script-precinct', params);
   },
   /**
    * @description 修改起始点
    * @param storeId 门店id
    */
   get_start_point: params => {
      return base_api.post('/api/route/algorithm/area-line/create/starting-point', params);
   },
   /**
    * @description 将未规划服务日的点加入到线路中
    * @param { object } params
    * @param { string } prePlanNo 预（草稿）计划 编号
    * @param { string } precinctNo 片区编号
    * @param { string } salesTypeCode 业代类型code
    * @param { string } storeId 门店id
    * @param { string } storeName 门店名称
    * @param { string } storeNo 门店 编号
    * @param { string } visitRate 拜访频次
    * @param { string } visitWeek 拜访频次：周
    * @param { string } visitWeekDay 所属服务日
    * @returns {Promise<unknown>}
    */
   get_insert_noday: params => {
      return base_api.post('/api/route/region/insert/noday', params);
   },
   /* 将门店从路线中移除
    * @param { object } data
    * @param { string } prePlanNo 预（草稿）计划 编号
    * @param { string } storeNo 门店 编号
    * @returns {Promise<unknown>}
    */
   delete_route_store: data => base_api.post('/api/route/revise/delete/store', data),
   /**
    * 将门店 加入到路线中
    * @param { object } params
    * @param { string } prePlanNo 预（草稿）计划 编号
    * @param { string } precinctNo 片区编号
    * @param { string } storeNo 门店 编号
    * @param { string } visitRate 拜访频次
    * @param { string } visitWeek 拜访频次：周
    * @param { string } visitWeekDay 所属服务日
    * @returns {Promise<unknown>}
    */
   add_route_store: params => base_api.post('/api/route/revise/insert/store', params),
   /**
    * 获取未计划 门店
    * @param { object } params
    * @param { string } programId 预（草稿）计划 id
    * @returns {Promise<unknown>}
    */
   get_no_plan_store: params => base_api.get('/api/route/all/no/plan', params),
   /**
    * 查询 是否存在未计划服务日
    * @param params
    * @returns {Promise<unknown>}
    */
   checkNoPlanServiceStore: params => base_api.get('/api/route/region/select/noday', params),
   /**
    * 查询 是否存在未计划服务日
    * @param params
    * @returns {Promise<unknown>}
    */
   createServiceDay: params => base_api.get('/api/route/algorithm/area-line/algorithm/service-day', params),

};
export default Api;