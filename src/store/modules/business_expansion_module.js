const getDefaultState = () => {
	return {
		storeStep: 0,
		isOpenExport: false,
	};
};
let business_expansion_module = {
	namespaced: true,
	state: getDefaultState(),
	mutations: {
		SET_STORE_STEP: (state, data) => {
			state.storeStep = data;
		},
		SET_IS_OPEN_EXPORT: (state, data) => {
			state.isOpenExport = data;
		},
	},
	actions: {
		setStoreStep({
			commit
		}, data) {
			commit('SET_STORE_STEP', data);
		},
		setIsOpenExport({ commit }, data) {
			commit('SET_IS_OPEN_EXPORT', data);
		},
	},
	getters: {
		storeStep: state => state.storeStep,
		isOpenExport: state => state.isOpenExport,
	},
};
export default business_expansion_module;
