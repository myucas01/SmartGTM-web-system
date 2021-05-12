/**
 * @description 商机导航module
 */
let businessNavigationModule = {
    state: () => ({
        // 商机导航自己的map对象
        business_navigation_map_obj: ''
    }),
    mutations: {
        // 设置map实例
        setBusinessNavigationMapObj: (state, data) => {
            state.business_navigation_map_obj = data.business_navigation_map_obj
        }
    },
    actions: {},
    getters: {}
}

export default businessNavigationModule