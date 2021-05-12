const getDefaultState = () => {
	return {
		// 营业组织
		mapStyle: 'amap://styles/normal',  // 地图默认风格
		mapHidden: false,    // 地图常规元素
		mapSearch: false,    // 地图搜索
		mapSearchIcon: true,    // 控制地图搜索的功能是否展示
		mapRanging: 'close',    // 地图测距功能
		mapScale: true,         // 地图比例尺
		mapOperation: 'search, mapType, ranging',
		mapOrganization: true,   // 控制地图组织是否展示
		organizationDisabled: false,    // 地图组织是否可以操作
		organizationShow: false, // 地图组织弹窗显示
		organizationId: '7643457515882135184',     // 地图组织ID
		organizationName: window.sessionStorage.getItem('organizationName') || '全国',  // 地图组织名称
		orgCheckId: '',  // 地图组织勾选组织
		searchType: ['map', 'org'], // map: 地图搜索  org: 门店搜索
		treeData: {},
		// 行政组织
		mapAdministration: false,   // 控制行政是否展示
		administrationName: window.sessionStorage.getItem('administrationName') || '中华人民共和国',  // 行政名称
		administrationId: '010000',    // 行政编号
		administrationType: '', // 行政类型
		administrationParentId: '',  // 行政父级编号
		administrationDisabled: false,    // 地图行政是否可以操作
		administrationShow: false,  // 地图行政弹窗显示
		admCheckId: '',  // 地图行政勾选
		administrationData: {}    // 行政数据
	};
};
let map = {
	namespaced: true,
	state: getDefaultState(),
	mutations: {
		SET_MAP_STYLE: (state, data) => {
			state.mapStyle = data;
		},
		SET_MAP_HIDDEN: (state, data) => {
			state.mapHidden = data;
		},
		SET_MAP_SEARCH: (state, data) => {
			state.mapSearch = data;
		},
		SET_MAP_SEARCH_ICON: (state, data) => {
			state.mapSearchIcon = data;
		},
		SET_MAP_RANGING: (state, data) => {
			state.mapRanging = data;
		},
		SET_MAP_SCALE: (state, data) => {
			state.mapScale = data;
		},
		SET_MAP_OPERATION: (state, data) => {
			state.mapOperation = data;
		},
		SET_MAP_ORGANIZATION: (state, data) => {
			state.mapOrganization = data;
		},
		SET_MAP_ADMINISTRATION: (state, data) => {
			state.mapAdministration = data;
		},
		SET_ORGANIZATION_DISABLED: (state, data) => {
			state.organizationDisabled = data;
		},
		SET_ADMINISTRATION_DISABLED: (state, data) => {
			state.administrationDisabled = data;
		},
		SET_ORGANIZATION_SHOW: (state, data) => {
			state.organizationShow = data;
		},
		SET_ADMINISTRATION_SHOW: (state, data) => {
			state.administrationShow = data;
		},
		SET_ORGANIZATION_ID: (state, data) => {
			state.organizationId = data;
		},
		SET_ADMINISTRATION_ID: (state, data) => {
			state.administrationId = data;
		},
		SET_ADMINISTRATION_PARENT_ID: (state, data) => {
			state.administrationParentId = data;
		},
		SET_ADMINISTRATION_TYPE: (state, data) => {
			state.administrationType = data;
		},
		SET_ORGANIZATION_NAME: (state, data) => {
			window.sessionStorage.setItem('organizationName', data)
			state.organizationName = data;
		},
		SET_ADMINISTRATION_NAME: (state, data) => {
			window.sessionStorage.setItem('administrationName', data)
			state.administrationName = data;
		},
		SET_ORG_CHECK_ID: (state, data) => {
			state.orgCheckId = data;
		},
		SET_ADM_CHECK_ID: (state, data) => {
			state.admCheckId = data;
		},
		SET_SEARCH_TYPE: (state, data) => {
			state.searchType = data;
		},
		SET_TREE_DATA: (state, data) => {
			state.treeData = data;
		},
		SET_ADMINISTRATION_DATA: (state, data) => {
			state.administrationData = data;
		}
	},
	actions: {
		setMapStyle({
			commit
		}, data) {
			commit('SET_MAP_STYLE', data);
		},
		setMapHidden({
			commit
		}, data) {
			commit('SET_MAP_HIDDEN', data);
		},
		setMapSearch({
			commit
		}, data) {
			commit('SET_MAP_SEARCH', data);
		},
		setMapSearchIcon({
			commit
		}, data) {
			commit('SET_MAP_SEARCH_ICON', data);
		},
		setMapRanging({
			commit
		}, data) {
			commit('SET_MAP_RANGING', data);
		},
		setMapScale({
			commit
		}, data) {
			commit('SET_MAP_SCALE', data);
		},
		setMapOperation({
			commit
		}, data) {
			commit('SET_MAP_OPERATION', data);
		},
		setMapOrganization({
			commit
		}, data) {
			commit('SET_MAP_ORGANIZATION', data);
		},
		setMapAdministration({
			commit
		}, data) {
			commit('SET_MAP_ADMINISTRATION', data);
		},
		setOrganizationDisabled({
			commit
		}, data) {
			commit('SET_ORGANIZATION_DISABLED', data);
		},
		setAdministrationDisabled({
			commit
		}, data) {
			commit('SET_ADMINISTRATION_DISABLED', data);
		},
		setOrganizationShow({
			commit
		}, data) {
			commit('SET_ORGANIZATION_SHOW', data);
		},
		setAdministrationShow({
			commit
		}, data) {
			commit('SET_ADMINISTRATION_SHOW', data);
		},
		setOrganizationId({
			commit
		}, data) {
			commit('SET_ORGANIZATION_ID', data);
		},
		setAdministrationId({
			commit
		}, data) {
			commit('SET_ADMINISTRATION_ID', data);
		},
		setAdministrationParentId({
			commit
		}, data) {
			commit('SET_ADMINISTRATION_PARENT_ID', data);
		},
		setAdministrationType({
			commit
		}, data) {
			commit('SET_ADMINISTRATION_TYPE', data);
		},
		setOrganizationName({
			commit
		}, data) {
			commit('SET_ORGANIZATION_NAME', data);
		},
		setAdministrationName({
			commit
		}, data) {
			commit('SET_ADMINISTRATION_NAME', data);
		},
		setOrgCheckId({
			commit
		}, data) {
			commit('SET_ORG_CHECK_ID', data);
		},
		setAdmCheckId({
			commit
		}, data) {
			commit('SET_ADM_CHECK_ID', data);
		},
		setSearchType({
			commit
		}, data) {
			commit('SET_SEARCH_TYPE', data);
		},
		setTreeData({
			commit
		}, data) {
			commit('SET_TREE_DATA', data);
		},
		setAdministrationData({
			commit
		}, data) {
			commit('SET_ADMINISTRATION_DATA', data);
		}
	},
	getters: {
		mapStyle: state => state.mapStyle,
		mapHidden: state => state.mapHidden,
		mapSearch: state => state.mapSearch,
		mapSearchIcon: state => state.mapSearchIcon,
		mapRanging: state => state.mapRanging,
		mapOperation: state => state.mapOperation,
		mapOrganization: state => state.mapOrganization,
		mapAdministration: state => state.mapAdministration,
		organizationDisabled: state => state.organizationDisabled,
		administrationDisabled: state => state.administrationDisabled,
		organizationId: state => state.organizationId,
		administrationId: state => state.administrationId,
		administrationParentId: state => state.administrationParentId,
		organizationShow: state => state.organizationShow,
		administrationShow: state => state.administrationShow,
		organizationName: state => state.organizationName,
		administrationName: state => state.administrationName,
		orgCheckId: state => state.orgCheckId,
		admCheckId: state => state.admCheckId,
		searchType: state => state.searchType,
		treeData: state => state.treeData,
		administrationData: state => state.administrationData,
		administrationType:  state => state.administrationType,
	},
};

export default map;
