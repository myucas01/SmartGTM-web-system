<template>
  <div>
    <p class="pagetitle" v-show="opentype == 'addnew'">选择布局范围</p>
    <div class="pagebox">
      <div class="title">
        {{ opentype !== 'addnew' ? businessTitle : '' }}布局范围
      </div>
      <div class="inforbox">
        <el-input
          placeholder="搜索..."
          v-model="filterText"
          size="small"
          width="200px"
          suffix-icon="el-icon-search"
          maxlength="10"
        >
        </el-input>
        <p class="treebox">
          <el-tree
            :data="data"
            show-checkbox
            size="small"
            node-key="id"
            :default-expanded-keys="openFrom"
            :default-expand-all="true"
            :props="defaultProps"
            @check-change="handleCheckChange"
            :filter-node-method="filterNode"
            ref="tree"
          >
          </el-tree>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import BUSINESS_DISTRICT_API from '@api/business_district_api.js'
export default {
  name: 'ScopeLayout',
  props: ['opentype', 'businessTitle', 'addScopeForm', 'configSave'],
  data() {
    return {
      filterText: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        disable: !this.configSave
      },
      CheckedNodes: [],
      openFrom: []
    }
  },
  created() {},
  mounted() {
    this.getOrgTree()
    if (this.addScopeForm.length > 0) {
      this.$refs.tree.setCheckedKeys(this.addScopeForm)
      this.openFrom = this.addScopeForm
    }
  },
  watch: {
    // 在搜索框输入数据
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    CheckedNodes: {
      deep: true,
      handler: function(newval) {
        this.$emit('changeFromValue', newval)
      }
    }
  },
  methods: {
    async getOrgTree() {
      // ******获取布局范围树
      await BUSINESS_DISTRICT_API.get_org_tree({isLoading: false})
        .then(async res => {
          if (res.code === '200') {
            if (res.data && res.data.length > 0) {
              this.dimenSions(res.data)
              this.data = await res.data
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    dimenSions(obj) {
      for (let a in obj) {
        if (typeof obj[a] == 'object') {
          obj[a].disabled = !this.configSave //如果是最后一层就禁用checkbox
          if (obj[a].children.length > 0) {
            this.dimenSions(obj[a].children) //不是则递归遍历
          }
        }
      }
    },
    // 进行过滤筛选
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleCheckChange() {
      // 获取所有选中的数组
      this.CheckedNodes = this.$refs.tree.getCheckedKeys()
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-tree-node__expand-icon {
  color: #80848f;
  font-size: 15px;
}
::v-deep .el-tree-node__expand-icon.is-leaf {
  color: transparent;
}
::v-deep .el-tree-node__label {
  font-size: 13px;
}
::-webkit-scrollbar-thumb {
  background-color: #dddee1 !important;
}
::-webkit-scrollbar-track {
  background-color: #f8f8f9 !important;
  border: 1px solid #e0e6ed;
  box-shadow: none;
  border-radius: 0;
}
.pagetitle {
  width: 173px;
  height: 33px;
  font-size: 24px;
  font-weight: 600;
  color: #1e2840;
  line-height: 33px;
  margin: 33px auto 27px auto;
  text-align: center;
  display: block;
}
.pagebox {
  background-color: #ffffff;
  margin: 15px 0 0 0;
  .title {
    padding: 10px 30px;
    text-align: left;
    border-bottom: 1px solid #ced3dd;
    color: #000;
    font-size: 14px;
    font-weight: 600;
  }
  .inforbox {
    padding: 20px;
    height: calc(100vh - 390px);
    .el-input {
      width: 300px;
    }
    .treebox {
      width: 602px;
      max-height: calc(100vh - 480px);
      border-radius: 4px;
      border: 1px solid #e0e6ed;
      overflow-y: auto;
      margin-top: 15px;
      padding: 10px;
    }
  }
}
</style>
