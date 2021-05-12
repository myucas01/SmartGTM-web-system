<template>
  <div class="ob-index">
    <div class="mainBox">
      <div class="title">
        <span>组织边界概况</span>
      </div>
      <el-table
        class="smart_table_deep"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        :data="tableData"
        height="100%"
        border
        lazy
        tooltip-effect="dark"
        :load="load"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        >
        <el-table-column prop="name" label="组织架构" width="250px">
          <template slot-scope="scope">
            <span class="name" :class="{ red: scope.row.isSpecific == 1 }"
              >{{ scope.row.name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="行销公司完成情况" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.orgType < 2">
              <span style="color: #f7b500"
                >{{ scope.row.companySededTotal }}
              </span>
              <span> / {{ scope.row.companyTotal }}</span>
            </div>
            <div v-else>
              <span style="color: #f7b500">- </span>
              <span> -</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="139" label="营业部完成情况">
          <template slot-scope="scope">
            <div v-if="scope.row.orgType < 3">
              <span style="color: #f7b500"
                >{{ scope.row.departmentSededTotal }}
              </span>
              <span> / {{ scope.row.departmentTotal }}</span>
            </div>
            <div v-else>
              <span style="color: #f7b500">- </span>
              <span> -</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="130" label="营业所完成情况">
          <template slot-scope="scope">
            <span style="color: #f7b500">{{ scope.row.placeSededTotal }} </span>
            <span> / {{ scope.row.placeTotal }}</span>
          </template>
        </el-table-column>
        <el-table-column width="130" label="是否有空白区域">
          <template slot-scope="scope">
            <span v-if="scope.row.orgType == '3'">/</span>
            <span v-else>{{ scope.row.isHaveBlank ? '是' : '否' }} </span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="营业所重叠情况"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="scope.row.orgType == '3'"
              >{{ scope.row.overlappingName ? scope.row.overlappingName : '/' }}
            </span>
            <span v-else
              >{{
                scope.row.overlappingCount ? scope.row.overlappingCount : '/'
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="270">
          <template slot-scope="scope">
            <div v-show="scope.row.name != '全国'">
              <span class="btn" @click="goDetail(scope.row.id, scope.row.name)" v-auth="'orgBorder:detail:show'"
                >查看</span
              >
              <span class="btn set" @click="goEdit(scope.row)" v-auth="'orgBorder:detail:set'">边界设置</span>
              <span
                class="btn set"
                v-if="scope.row.orgType == '3'"
                @click="goPointEdit(scope.row)"
                v-auth="'orgBorder:detail:anchorset'"
                >锚点设置</span
              >
              <span class="btn set" @click="openDelDialog(scope.row.id)" v-auth="'orgBorder:detail:delete'"
                >清除边界</span
              >
              <span
                class="btn set"
                v-if="scope.row.orgType == '2' && scope.row.isSpecific == 0"
                @click="setSpecial(scope.row, 'set')" 
                >设置特殊营业部</span
              >
              <span
                class="btn set"
                v-if="scope.row.orgType == '2' && scope.row.isSpecific == 1"
                @click="setSpecial(scope.row, 'cancle')"
                >取消特殊营业部</span
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="警告"
      :visible.sync="delDialogVisible"
      width="30%"
      class="eldialog"
    >
      <span>确认要清除此组织边界吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" size="small" @click="delBorder"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'organizeList',
  title() {
    return '组织树维护'
  },
  data() {
    return {
      tableData: [],
      delDialogVisible: false,
      listId: '',
      level: '',
      // tableHeight: 0,
      gdBoundarJson: '', //边界数据
      fillColor: '', //填充色
      fillColorOpacity: '', //填充透明度
      borderColor: '', //边界颜色
      borderColorOpacity: '', //边界颜色透明度
      borderWidth: '', //边界粗细
      organizeName: '', //组织名称
      id: '', //每条数据的唯一表标识
      gdLat: '', //纬度
      gdLng: '', //经度
      parentOrgId: '',
      backBtnShow: false
    }
  },
  created() {
    // this.tableHeight = window.innerHeight - 50
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      if (vm.$route.fullPath == '/organize-boundaries/organize-list') {
        vm.$store.commit('addTabs', {
          title: `组织边界概况`,
          link: `/organize-boundaries/organize-list`,
          on: false,
          needCatch: true,
        })
      }
    })
  },
  mounted() {
    this.getList()
  },
  watch: {
    // 利用watch方法检测路由变化：
    // $route: function (to, from) {
    //   if (to.name == 'organizeList' && to.fullPath !== from.fullPath) {
    //     let id = this.$route.query.orgId
    //     console.log(id)
    //     // if (id) {
    //     //   this.backBtnShow = true
    //     // } else {
    //     //   this.backBtnShow = false
    //     // }
    //     this.getList(id)
    //   }
    // }
  },
  methods: {
    load(tree, treeNode, resolve) {
      let url = '/api/boundary/orgregion/list'
      this.$fetch
        .get(url, {
          orgId: tree.id
        })
        .then(res => {
          if (res.code == 200) {
            console.log(res.data[0].children)
            if (res.data[0].children) {
              for (let i in res.data[0].children) {
                if (res.data[0].children[i].orgType != '3') {
                  res.data[0].children[i].hasChildren = true
                } else {
                  res.data[0].children[i].hasChildren = false
                }
              }
            }
            resolve(res.data[0].children)
          }
        })
        .catch(error => {
          console.log(error.message)
          resolve(error.data)
        })
    },
    getList(id) {
      this.listId = id ? id : ''
      let url = '/api/boundary/orgregion/list'
      this.$fetch
        .get(url, {
          orgId: this.listId
        })
        .then(res => {
          if (res.code == 200) {
            console.log(res)
            this.$set(this, 'tableData', res.data)
            for (let i in this.tableData) {
              this.tableData[i].hasChildren = true
              delete this.tableData[i].children
            }
          }
        })
        .catch(error => {
          console.log(error.message)
        })
    },
    openDelDialog(id) {
      this.delId = id
      this.delDialogVisible = true
    },
    //设置特殊营业部
    setSpecial(row, type) {
      let url
      let name
      if (type == 'set') {
        name =
          '您正在将“' +
          row.name +
          '”设置为特殊营业部，设置后该营业部边界将允许与其他营业部边界重叠，是否需要继续？ '
        url = '/api/boundary/region/editSpecificOrg'
      } else {
        name =
          '您正在将“' +
          row.name +
          '”取消设置为特殊营业部，设置后该营业部边界数据将被全部清除，是否需要继续？'
        url = '/api/boundary/region/cancelSpecificOrg'
      }
      this.$confirm(name, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$fetch
            .get(url, {
              orgId: row.id
            })
            .then(res => {
              if (res.code == 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.tableData = []
                this.getList()
              }
            })
            .catch(error => {
              console.log(error.message)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    delBorder() {
      this.delDialogVisible = false
      let url = '/api/boundary/orgregion/delete'
      this.$fetch
        .delete(url, {
          orgId: this.delId
        })
        .then(res => {
          if (res.code == 200) {
            console.log(res)
            this.delDialogVisible = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.tableData = []
            this.getList()
          } else {
            this.$message.error(res.message)
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    goDetail(id, name) {
      // this.$store.commit('addTabs', {
      //   title: `组织查看-${name}`,
      //   link:`/organize-boundaries/organize-list`,
      //   update: '/organize-boundaries/organize-detail?orgId=' + id + '&orgName=' + name,
      //   on: false,
      //   needCatch: true
      // })
      this.$router.push(
        '/organize-boundaries/organize-detail?orgId=' + id + '&orgName=' + name
      )

    },
    goEdit(obj) {
      // this.$store.commit('addTabs', {
      //   title: `组织编辑-${obj.name}`,
      //   link:`/organize-boundaries/organize-list`,
      //   update: '/organize-boundaries/organize-edit?orgId=' +
      //     obj.id +
      //     '&orgName=' +
      //     obj.name +
      //     '&orgType=' +
      //     obj.orgType +
      //     '&type=list' +
      //     '&backId=&backName=',
      //   on: false,
      //   needCatch: true
      // })
      this.$router.push(
        '/organize-boundaries/organize-edit?orgId=' +
          obj.id +
          '&orgName=' +
          obj.name +
          '&orgType=' +
          obj.orgType +
          '&type=list' +
          '&backId=&backName='
      )
    },
    goPointEdit(obj) {
      // this.$store.commit('addTabs', {
      //   title: `组织锚点编辑-${obj.name}`,
      //   link:`/organize-boundaries/organize-list`,
      //   update: '/organize-boundaries/organize-point-edit?orgId=' +
      //     obj.id +
      //     '&orgName=' +
      //     obj.name +
      //     '&orgType=' +
      //     obj.orgType +
      //     '&type=list' +
      //     '&backId=&backName=',
      //   on: false,
      //   needCatch: true
      // })
      this.$router.push(
        '/organize-boundaries/organize-point-edit?orgId=' +
          obj.id +
          '&orgName=' +
          obj.name +
          '&orgType=' +
          obj.orgType +
          '&type=list' +
          '&backId=&backName='
      )
    }
  }
}
</script>

<style scoped lang="scss">
.ob-index {
  width: 100%;
  height: 100%;
  padding: 20px 0 20px;
  box-sizing: border-box;
  background-color: #0a2757;
}

.mainBox {
  width: 1200px;
  height: 100%;
  padding: 0 10px 10px;
  background-color: #113877;
  margin: 0 auto;
  border: 1px solid #930cea;
  border-radius: 2px;
  display: flex;
  flex-direction: column;

  .title {
    color: #ffffff;
    padding: 20px;
    font-size: 16px;
    text-align: center;
    position: relative;

    .btnBox {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(0, -50%);
    }
  }
}

.smart_table_deep {
  flex: 1;

  .name {
    &.red {
      color: #930cea;
    }
    //cursor: pointer;
    //
    //&:hover {
    //  border-bottom: 1px solid #ffffff;
    //}
  }

  .btn {
    color: #dca7ff;
    padding: 0 5px;
    cursor: pointer;

    &.set {
      border-left: 1px solid #dca7ff;
    }
  }
}
</style>
