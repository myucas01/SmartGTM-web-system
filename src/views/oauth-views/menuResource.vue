<template>
  <div class="menu-resource-wrapper">
    <!-- 菜单管理 列表 -->
    <section class="menu-list" v-show="isListShow">
      <div class="btn-group">
        <el-button
          v-auth="'menu:add'"
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"
          >新增</el-button
        >
        <el-button
          v-auth="'menu:update'"
          type="primary"
          icon="el-icon-edit-outline"
          size="small"
          @click="handleUpdate"
          >修改</el-button
        >
        <el-button
          v-auth="'menu:delete'"
          type="primary"
          icon="el-icon-delete"
          size="small"
          @click="handleDelete"
          >删除</el-button
        >
      </div>
      <div class="table-group">
        <el-table
          class="smart_table_light"
          ref="multipleTable"
          :data="tableData"
          row-key="id"
          border
          width="100%"
          :max-height="tableHeight"
          cell-class-name="perTd"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column
            prop="menuName"
            label="菜单名称"
            width="180"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="id"
            label="菜单ID"
            width="180"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="parentName"
            label="上级菜单"
            width="100"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column prop="icon" label="图标" width="80">
            <template slot-scope="scope">
              <div>
                <i style="font-size: 16px;" :class="scope.row.icon"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型" width="80">
            <template slot-scope="scope">
              <span
                :class="
                  scope.row.type === 0
                    ? 'type0'
                    : scope.row.type === 1
                    ? 'type1'
                    : 'type2'
                "
              >
                {{
                  scope.row.type === 0
                    ? '目录'
                    : scope.row.type === 1
                    ? '菜单'
                    : '按钮'
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="orderNum"
            label="排序号"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="url"
            label="菜单URL"
            width="100"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="resource"
            label="授权标识"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </div>
    </section>
    <!-- 菜单管理 新增or修改 -->
    <section class="menu-update" v-show="!isListShow">
      <div class="form-title">{{ isCreate ? '新增' : '修改' }}</div>
      <div class="form-content">
        <el-form
          ref="form"
          :model="form"
          label-width="90px"
          label-position="left"
        >
          <el-form-item label="类型">
            <el-radio-group v-model="form.type" @change="typeChanged">
              <el-radio :label="0">目录</el-radio>
              <el-radio :label="1">菜单</el-radio>
              <el-radio :label="2">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="菜单名称">
            <el-input
              v-model="form.menuName"
              size="small"
              placeholder="菜单名称或按钮名称"
              :maxlength="255"
            ></el-input>
          </el-form-item>
          <el-form-item label="上级菜单">
            <el-popover
              ref="upPopover"
              placement="bottom-start"
              popper-class="up-popover-select"
              width="475"
              trigger="click"
              @show="onOpenTree"
              @hide="onCloseTree"
            >
              <el-tree
                ref="upTree"
                class="up_tree_select"
                :data="treeData"
                :props="props"
                node-key="id"
                highlight-current
                check-strictly
                @node-click="onClickNode"
              ></el-tree>
              <el-input
                slot="reference"
                v-model="form.parentName"
                size="small"
                suffix-icon="el-icon-arrow-down"
                :class="{ rotate: showStatus }"
                placeholder="请选择"
                readonly
              ></el-input>
            </el-popover>
          </el-form-item>
          <el-form-item label="菜单URL" v-show="form.type === 1">
            <el-input
              v-model="form.url"
              size="small"
              placeholder="菜单URL"
              :maxlength="500"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="授权标识"
            v-show="form.type === 1 || form.type === 2"
          >
            <el-input
              v-model="form.resource"
              size="small"
              placeholder="多个用逗号分隔，如：user:list,user:create"
              :maxlength="500"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="排序号"
            v-show="form.type === 0 || form.type === 1"
          >
            <el-input-number
              v-model="form.orderNum"
              :min="0"
              size="small"
              :maxlength="32"
            ></el-input-number>
          </el-form-item>
          <el-form-item
            label="图标"
            v-show="form.type === 0 || form.type === 1"
          >
            <el-input
              v-model="form.icon"
              size="small"
              placeholder="菜单图标"
              :maxlength="255"
            ></el-input>
            <!-- <p class="icon-tip">
              获取图标：http://www.fontawesome.com.cn/faicons/
            </p> -->
            <p class="icon-tip">
              获取图标：https://element.eleme.cn/#/zh-CN/component/icon
            </p>
          </el-form-item>
          <el-form-item
            label="类目名称"
            v-show="form.type === 0 || form.type === 1"
          >
            <el-input
              v-model="form.name"
              size="small"
              placeholder="类目名称"
              :maxlength="255"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="跳转地址"
            v-show="form.type === 0 || form.type === 1"
          >
            <el-input
              v-model="form.jumpUrl"
              size="small"
              placeholder="跳转地址"
              :maxlength="500"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="跳转文案"
            v-show="form.type === 0 || form.type === 1"
          >
            <el-input
              v-model="form.copyName"
              size="small"
              placeholder="跳转文案"
              :maxlength="500"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-bottom">
        <el-button class="submit-btn" type="primary" @click="onSubmit"
          >确定</el-button
        >
        <el-button class="cancel-btn" @click="onCancel">取消</el-button>
      </div>
    </section>
  </div>
</template>

<script>
import OAUTH_API from '@api/oauth_api'

export default {
  name: 'menuResource',
  data() {
    return {
      showStatus: false,
      tableHeight: 400,
      isListShow: true,
      isCreate: true,
      tableData: [],
      multipleSelection: [],
      treeData: [],
      props: {
        children: 'children',
        label: 'menuName',
        value: 'id',
        parent: 'parentId'
      },
      form: {
        type: 1,
        menuName: '',
        parentName: '一级菜单',
        parentId: '0',
        url: '',
        resource: '',
        orderNum: '',
        icon: '',
        name: '',
        jumpUrl: '',
        copyName: '',
        id: ''
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.$store.commit('addTabs', {
        title: '菜单资源',
        link: to.fullPath,
        on: true,
        needCatch: true
      })
    })
  },
  created() {
    this.getTableData()
    this.getTreeData()
  },
  mounted() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - 160
      // 监听窗口大小变化
      let self = this
      window.onresize = () => {
        self.tableHeight = window.innerHeight - 160
      }
    })
  },
  methods: {
    getTreeData() {
      OAUTH_API.get_menu_resource_button().then(res => {
        // 树结构增加一个层级
        this.treeData = [
          {
            id: '0',
            menuName: '一级菜单',
            children: res
          }
        ]
      })
    },
    getTableData() {
      OAUTH_API.get_menu_resource_list().then(res => {
        this.tableData = res
        this.isListShow = true
      })
    },
    // 选中一条记录
    handleSelectionChange(val) {
      // 实现单选效果
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection() //清除
        this.$refs.multipleTable.toggleRowSelection(val.pop()) //pop：最后一个
      } else {
        this.multipleSelection = val
      }
    },
    // 新增
    handleAdd() {
      this.initForm()
      this.isListShow = false
      this.isCreate = true
      // 父级菜单值显示在树状结构中
      setTimeout(() => {
        this.$refs.upTree.setCurrentKey(this.form.parentId)
      }, 300)
    },
    // 修改
    handleUpdate() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择一条记录',
          type: 'warning',
          showClose: true
        })
      } else {
        for (let item in this.form) {
          this.form[item] = this.multipleSelection[0][item]
        }
        this.isListShow = false
        this.isCreate = false
        // 父级菜单值显示在树状结构中
        setTimeout(() => {
          this.$refs.upTree.setCurrentKey(this.form.parentId)
        }, 300)
      }
    },
    // 删除
    handleDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择一条记录',
          type: 'warning',
          showClose: true
        })
      } else {
        this.$confirm('确认删除吗？')
          .then(() => {
            OAUTH_API.menu_resource_delete(this.multipleSelection[0].id).then(
              res => {
                if (res) {
                  this.$message({
                    message: '删除成功',
                    type: 'success',
                    showClose: true
                  })
                  this.getTableData()
                }
              }
            )
          })
          .catch(() => {})
      }
    },
    onSubmit() {
      let params = {}
      for (let item in this.form) {
        if (this.form[item]) {
          params[item] = this.form[item]
        }
      }
      if (this.isCreate) {
        // 新增
        OAUTH_API.menu_resource_save(params).then(res => {
          if (res) {
            this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true
            })
            this.getTableData()
          }
        })
      } else {
        // 修改
        OAUTH_API.menu_resource_update(params).then(res => {
          if (res) {
            this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true
            })
            this.getTableData()
          }
        })
      }
    },
    onCancel() {
      this.$refs.multipleTable.clearSelection() //清除
      this.isListShow = true
    },
    typeChanged() {
      // 新建时切换type类型
      if (this.isCreate) {
        for (let item in this.form) {
          if (item === 'parentName') {
            this.form[item] = '一级菜单'
          } else if (item === 'parentId') {
            this.form[item] = '0'
          } else if (item !== 'type') {
            this.form[item] = ''
          }
        }
      }
    },
    // 单击节点
    onClickNode(node) {
      // let arr = [node[this.props.value]]
      // this.$refs.upTree.setCheckedKeys(arr)
      this.form.parentName = node[this.props.label]
      this.form.parentId = node[this.props.value]
      this.onCloseTree()
    },
    // 隐藏树状菜单
    onCloseTree() {
      this.showStatus = false
      this.$refs.upPopover.showPopper = false
    },
    // 打开树状菜单
    onOpenTree() {
      this.showStatus = true
    },
    // 初始化表单
    initForm() {
      for (let item in this.form) {
        if (item === 'type') {
          this.form[item] = 1
        } else if (item === 'parentName') {
          this.form[item] = '一级菜单'
        } else if (item === 'parentId') {
          this.form[item] = '0'
        } else {
          this.form[item] = ''
        }
      }
    }
  },
  watch: {
    isListShow(val) {
      // 新增或编辑时，上级菜单的树形结构数据需刷新
      if (!val) this.getTreeData()
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-resource-wrapper {
  width: 100%;
  background-color: #f5f5f5;
  .menu-list {
    width: 1194px;
    margin: 20px auto;
    background-color: #ffffff;
    .btn-group {
      padding: 10px 20px;
    }
    .table-group {
      height: calc(100vh - 150px);
      padding: 0 10px;
      .el-table {
        .cell {
          .type0 {
            display: inline-block;
            color: #ffffff;
            background-color: #4a90e2;
            padding: 0px 10px;
            border-radius: 4px;
          }
          .type1 {
            display: inline-block;
            color: #ffffff;
            background-color: #19be6b;
            padding: 0px 10px;
            border-radius: 4px;
          }
          .type2 {
            display: inline-block;
            color: #ffffff;
            background-color: #ff9900;
            padding: 0px 10px;
            border-radius: 4px;
          }
        }
      }
    }
  }
  .menu-update {
    width: 1194px;
    margin: 20px auto 0;
    height: calc(100% - 20px);
    background-color: #ffffff;
    position: relative;
    .form-title {
      position: absolute;
      left: 0;
      top: 0;
      width: calc(100% - 36px);
      height: 40px;
      line-height: 40px;
      background-color: #fafafa;
      border-bottom: 1px solid #00000026;
      font-size: 16px;
      font-weight: 500;
      color: #1c2438;
      padding-left: 36px;
    }
    .form-content {
      // width: 600px;
      position: absolute;
      top: 40px;
      left: 0;
      padding: 20px 0 0 20px;
      width: calc(100% - 20px);
      height: calc(100% - 100px);
      overflow-y: auto;
      .el-form {
        width: 600px;
        .icon-tip {
          height: 20px;
          line-height: 20px;
          font-size: 12px;
          color: #999;
        }
      }
    }
    .form-bottom {
      width: calc(100% - 20px);
      height: 50px;
      line-height: 50px;
      background-color: #ffffff;
      // box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.15);
      box-shadow: 0 -3px 4px 0 #d3d3d3;
      padding-left: 20px;
      position: absolute;
      left: 0;
      bottom: 0;
      .submit-btn {
        width: 120px;
      }
      .cancel-btn {
        width: 80px;
      }
    }
  }
}
</style>

<style lang="scss">
.menu-resource-wrapper {
  .el-table {
    .perTd {
      padding: 6px 0;
    }
  }
  .menu-update {
    .el-form {
      .el-form-item {
        margin-bottom: 15px;
        .el-form-item__label {
          font-size: 12px;
          color: #4d4d4d;
        }
        .el-form-item__content {
          .el-radio__label {
            font-size: 12px;
          }
          .el-input--small {
            font-size: 12px;
          }
        }
        .el-input.el-input--suffix {
          outline: none;
          &.rotate .el-input__suffix {
            transform: rotate(180deg);
          }
        }
      }
    }
  }
}
.up-popover-select {
  max-height: 350px;
  overflow-y: scroll;
  .up_tree_select {
    .el-tree-node__content {
      .el-tree-node__label {
        font-size: 12px !important;
      }
    }
  }
}
</style>
