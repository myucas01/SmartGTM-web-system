/**
 * 系统管理API
 */
import Vue from 'vue'

// 获取baseapi
const base_api = Vue.prototype.$fetch

const OAUTH_API = {
  /**
   * @description 获取菜单资源树结构(全部菜单展示)
   */
  get_menu_resource_list: () => {
    return base_api.get('/user-api/sys/menu/info/lists/menu', {}).then(res => {
      if (res.code === 200 && res.data) {
        return res.data
      } else {
        console.error('获取菜单资源失败！')
        return ''
      }
    })
  },
  
  /**
   * @description 获取菜单资源树结构(不展示按钮级别)
   */
  get_menu_resource_button: () => {
    return base_api.get('/user-api/sys/menu/info/lists/button', {}).then(res => {
      if (res && res.code === 200 && res.data) {
        return res.data
      } else {
        console.error('获取菜单资源失败！')
        return ''
      }
    })
  },

  /**
   * @description 获取角色列表
   * @param { object } params_obj 请求参数 {page:当前页,limit:每页最大条数,multi:检索关键词}
   */
  get_role_list: (params_obj) => {
    return base_api.get('/user-api/sys/role/info/search', params_obj).then(res => {
      if (res && res.code === 200 && res.data) {
        return res.data
      } else {
        console.error('获取角色列表失败！')
        return ''
      }
    })
  },

  /**
   * @description 获取想要编辑的某个角色数据（编辑）
   * @param { string } role_id 角色ID
   */
  get_edit_role_data: (role_id) => {
    return base_api.get('/user-api/sys/role/info/query/' + role_id).then(res => {
      if (res && res.code === 200 && res.data) {
        return res.data.menuIdList
      } else {
        console.error('获取某个角色数据失败！')
        return ''
      }
    })
  },

  /**
   * @description 新增一个角色
   * @param { object } prams_obj 新增角色数据
   */
  add_new_role:(prams_obj) => {
    return base_api.post('/user-api/sys/role/info/save', prams_obj).then(res => {
      if (res && res.code === 200 && res.data) {
        return res.data
      } else {
        console.error('新增角色失败！')
        return ''
      }
    })
  },

  /**
   * @description 删除一个角色
   * @param { object } prams_obj 删除角色的 id 
   */
  delete_role: (prams_obj) => {
    return base_api.post('/user-api/sys/role/info/deletes', prams_obj).then(res => {
      if (res && res.code === 200 && res.data) {
        return res.data
      } else {
        console.error('新增角色失败！')
        return ''
      }
    })
  },

  /**
   * @description 更新想要编辑的某个角色数据（编辑）
   * @param { object } prams_obj 更新的数据
   */
  update_edit_role_data: (prams_obj) => {
    return base_api.post('/user-api/sys/role/info/update', prams_obj).then(res => {
      if (res && res.code === 200 && res.data) {
        return res.data
      } else {
        console.error('更新某个角色失败！')
        return ''
      }
    })
  },
   /**
   * @description 菜单资源-新增save
   */
  menu_resource_save: (obj) => {
    return base_api.post('/user-api/sys/menu/info/save', obj).then(res => {
      if (res.code === 200 && res.data) {
        return res.data
      } else {
        console.error('保存失败！')
        return ''
      }
    })
  },
  /**
   * @description 菜单资源-修改update
   */
  menu_resource_update: (obj) => {
    return base_api.post('/user-api/sys/menu/info/update', obj).then(res => {
      if (res.code === 200 && res.data) {
        return res.data
      } else {
        console.error('保存失败！')
        return ''
      }
    })
  },
  /**
   * @description 菜单资源-删除delete
   */
  menu_resource_delete: (id) => {
    return base_api.get('/user-api/sys/menu/info/deletes', {id}).then(res => {
      if (res.code === 200 && res.data) {
        return res.data
      } else {
        console.error('删除失败！')
        return ''
      }
    })
  },
}

export default OAUTH_API
