const {
    sessionStorage
} = window;
let businessPreview = {
    namespaced: true,
    state: () => ({
        analysisCtrlList: [], // 商圈统计分析
        exceptionCtrlSwitch: false, // 异常商圈switch开关
        businessPanelShow: true, // 组织面板(true)和商圈面板(false)展示
        businessCtrlList: [], // 商圈形态
        orgCtrlList: [], // 组织架构
        regionCtrlList: [], // 行政区划
        orgLevel: '', // 当前组织层级 -1:全国 0:南北区 1:行销公司...
        businessNo: '', // 地图下钻到商圈时-商圈编码
        isPreview: false, // 商圈详情信息-是否为预览状态
        regionCode: '', // 选中 行政code
        viewProject: sessionStorage.getItem('viewProject') || '',
        chooseBusinessMap: new Map(),
        chooseBusiness: '',
        editBusinessScope: '',
        deleteBusiness: '', // 删除商圈
        needUpdateLevelAi: false,
        viewOrganize: sessionStorage.getItem('viewOrganize') || '', // 当前视图区组织 信息
        operationCode: '', // 操作code 对应Navtools
        gridSelection: false, // 批量网格是否开启
        abnormalBusinessStatus: false, // 异常商圈 开启状态
        currentSwitchOpen: false, // 当前switch开关状态
        currentSwitchIndex: 0, // 当前switch开关索引
    }),
    getters: {
        analysisCtrlList: state => state.analysisCtrlList,
        exceptionCtrlSwitch: state => state.exceptionCtrlSwitch,
        businessPanelShow: state => state.businessPanelShow,
        businessCtrlList: state => state.businessCtrlList,
        orgCtrlList: state => state.orgCtrlList,
        regionCtrlList: state => state.regionCtrlList,
        orgLevel: state => state.orgLevel,
        businessNo: state => state.businessNo,
        isPreview: state => state.isPreview,
        regionCode: state => state.regionCode,
        viewProject: state => state.viewProject,
        chooseBusinessMap: state => state.chooseBusinessMap,
        chooseBusiness: state => state.chooseBusiness,
        operationCode: state => state.operationCode,
        editBusinessScope: state => state.editBusinessScope,
        abnormalBusinessStatus: state => state.abnormalBusinessStatus,
        viewOrganize: state => state.viewOrganize ?  typeof state.viewOrganize === 'string' ? JSON.parse(state.viewOrganize) : state.viewOrganize : '',
        needUpdateLevelAi: state => state.needUpdateLevelAi,
        deleteBusiness: state => state.deleteBusiness,
        gridSelection: state => state.gridSelection,
        currentSwitchOpen: state => state.currentSwitchOpen,
        currentSwitchIndex: state => state.currentSwitchIndex
    },
    mutations: {
        setAnalysisCtrlList: (state, data) => {
            state.analysisCtrlList = data
        },
        setExceptionCtrlSwitch: (state, data) => {
            state.exceptionCtrlSwitch = data
        },
        setBusinessPanelShow: (state, data) => {
            state.businessPanelShow = data
        },
        setBusinessCtrlList: (state, data) => {
            state.businessCtrlList = data
        },
        setOrgCtrlList: (state, data) => {
            state.orgCtrlList = data
        },
        setRegionCtrlList: (state, data) => {
            state.regionCtrlList = data
        },
        setOrgLevel: (state, data) => {
            state.orgLevel = data
        },
        setBusinessNo: (state, data) => {
            state.businessNo = data
        },
        setIsPreview: (state, data) => {
            state.isPreview = data
        },
        SET_REGION_CODE: (state, data) => {
            state.regionCode = data
        },
        SET_VIEW_PROJECT: (state, data) => {
            sessionStorage.setItem('viewProject', JSON.stringify(data))
            state.viewProject = JSON.stringify(data)
        },
        SET_CHOOSE_BUSINESS_MAP: (state, data) => {
            state.chooseBusinessMap = data
        },
        SET_CHOOSE_BUSINESS: (state, data) => {
            state.chooseBusiness = data
        },
        SET_OPERATION_CODE: (state, data) => {
            state.operationCode = data
        },
        SET_EDIT_BUSINESS_SCOPE: (state, data) => {
            state.editBusinessScope = data
        },
        SET_ABNORMAL_BUSINESS_STATUS: (state, data) => {
            state.abnormalBusinessStatus = data
        },
        RESET_CHOOSE_BUSINESS: (state) => {
            state.chooseBusinessMap = new Map()
            state.chooseBusiness = ''
        },
        SET_VIEW_ORGANIZE:  (state, data) => {
            sessionStorage.setItem('viewOrganize', JSON.stringify(data))
            state.viewOrganize = data
        },
        SET_NEED_UPDATE_LEVEL_AI :  (state, data) => {
            state.needUpdateLevelAi = data
        },
        SET_DELETE_BUSINESS :  (state, data) => {
            state.deleteBusiness = data
        },
        SET_GRID_SELECTION:  (state, data) => {
            state.gridSelection = data
        },
        setCurrentSwitchOpen: (state, data) => {
            state.currentSwitchOpen = data
        },
        setCurrentSwitchIndex: (state, data) => {
            state.currentSwitchIndex = data
        },
    },
    actions: {
        set_region_code: ({commit}, data) => {
            commit('SET_REGION_CODE', data)
        },
        set_view_project:  ({commit}, data) => {
            commit('SET_VIEW_PROJECT', data)
        },
        set_choose_business_map:  ({commit}, data) => {
            commit('SET_CHOOSE_BUSINESS', data)
        },
        set_choose_business:  ({commit}, data) => {
            commit('SET_CHOOSE_BUSINESS', data)
        },
        set_operation_code:  ({commit}, data) => {
            commit('SET_OPERATION_CODE', data)
        },
        set_edit_business_scope:  ({commit}, data) => {
            commit('SET_EDIT_BUSINESS_SCOPE', data)
        },
        set_abnormal_business_status: ({commit}, data) => {
            commit('SET_ABNORMAL_BUSINESS_STATUS', data)
        },
        set_view_organize: ({commit}, data) => {
            commit('SET_VIEW_ORGANIZE', data)
        },
        set_need_update_level_ai:  ({commit}, data) => {
            commit('SET_NEED_UPDATE_LEVEL_AI', data)
        },
        set_delete_business:  ({commit}, data) => {
            commit('SET_DELETE_BUSINESS', data)
        },
        set_grid_selection:  ({commit}, data) => {
            commit('SET_GRID_SELECTION', data)
        },
    }
}

export default businessPreview
