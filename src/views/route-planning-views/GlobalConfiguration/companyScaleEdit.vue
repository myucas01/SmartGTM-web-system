<template>
  <!-- 行销公司-客户规模配置 -->
  <div class="company-scale-edit-wrapper">
    <div class="main-container">
      <div class="title-wrap">
        <span class="title">{{orgName}}</span>
        <div class="sub-title">
          <span class="date">时间：{{date}}</span>
          <!-- <span class="update" @click="handleLogDialog">查看操作日志</span> -->
        </div>
      </div>
      <div class="content-wrap">
        <div class="select-btn">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="addNewItem">
            新增
          </el-button>
        </div>
        <div class="table-content">
          <el-table
            class="global-configuration-table"
            :data="tableData"
            border
            style="width: 100%"
            :max-height="tableHeight"
            :span-method="objectSpanMethod">
            <el-table-column
              label="门店类型"
              prop="customerName"
              align="center">
            </el-table-column>
            <el-table-column
              label="门店标签"
              prop="configBig"
              align="center">
            </el-table-column>
            <el-table-column
              label="销量段（pc）"
              prop=""
              align="center">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.configBig === 'A'">
                    {{scope.row.salesMin}}+
                  </span>
                  <span v-else-if="scope.row.configBig === 'B'">
                    {{scope.row.salesMin}}-{{scope.row.salesMax}}
                  </span>
                  <span v-else-if="scope.row.configBig === '其他'">
                    {{scope.row.salesMin}}-{{scope.row.salesMax}}
                  </span>
                  <span v-else>-</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              prop=""
              align="center">
              <template slot-scope="scope">
                <div>
                  <span
                    class="btn-edit"
                    @click="handleEdit(scope.row)">
                    编辑
                  </span>
                  <span
                    v-show="isEdit"
                    class="btn-delete"
                    @click="handleDelete(scope.row.customerId)">
                    删除
                  </span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="btn-wrap" v-show="isReturn">
      <el-button type="primary" size="small" @click="handleReturn">返回</el-button>
    </div>
    <!-- <customer-scale-edit-dialog
      :visible="editDialogVisible"
      :rows="rowInfo"
      @handleClose="editDialogClosed" /> -->
    <sale-level-edit-dialog
      :visible="editDialogVisible"
      :title="dialogTitle"
      :rows="rowInfo"
      @handleClose="editDialogClosed" />
    <log-dialog
      type="售点分级"
      :visible="logDialogVisible"
      @handleClose="logDialogClosed" />
  </div>
</template>

<script>
// import CustomerScaleEditDialog from '../GolbalConfigComponents/customerScaleEditDialog';
import SaleLevelEditDialog from '../GolbalConfigComponents/saleLevelEditDialog';
import LogDialog from '../GolbalConfigComponents/logDialog';
import ROUTE_PLANNING_API from '@api/route/index';

export default {
  name: 'customerScaleEdit',
  components: {
    // CustomerScaleEditDialog,
    LogDialog,
    SaleLevelEditDialog,
  },
  data() {
    return {
      tableHeight: 300,
      title: '江苏行销公司',
      date: '-',
      columns: [
        // {
        //   label: '门店标签',
        //   prop: 'storeLabel',
        //   textAlign: 'center',
        // },
        {
          label: '销量段（pc）',
          prop: '',
          textAlign: 'center',
          children: [
            {
              label: '高产值',
              prop: 'high',
              textAlign: 'center',
            },
            {
              label: '潜力',
              prop: 'potential',
              textAlign: 'center',
            },
            {
              label: '基础',
              prop: 'basic',
              textAlign: 'center',
            },
            {
              label: '低表现',
              prop: 'low',
              textAlign: 'center',
            },
          ],
        }
      ],
      tableData: [],
      nextDisabled: false,
      editDialogVisible: false,
      rowInfo: {},
      editList: [], // 传参数据格式
      logDialogVisible: false,
      dialogTitle: '新增',
    };
  },
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     // const title = vm.$store.state.routerPlanning.currentOrgName ||
  //     // sessionStorage.getItem('currentOrgName');
  //     const {
  //       // orgId,
  //       orgName,
  //       // isEdit,
  //     } = vm.$route.query;
  //     // const query = `orgId=${orgId}&orgName=${orgName}&isEdit=${isEdit}`;
  //     vm.$store.commit('addTabs', {
  //       title: `${orgName}-售点分级`,
  //       // link: `/route-planning/company-scale-edit?${query}`,
  //       link: to.fullPath,
  //       on: true,
  //       needCatch: true,
  //     });
  //   })
  // },
  computed: {
    orgName() {
      return this.$route.query.orgName;
    },
    orgId() {
      return this.$route.query.orgId;
      // return '7293338343793677273';
    },
    isEdit() {
      return this.$route.query.isEdit === 'true';
    },
    isReturn() {
      // return this.$route.query.isReturn === 'true';
      return true;
    },
    getTab() {
      return this.$store.state.tabs;
    }
  },
  mounted() {
    this.getTableData();
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 300
      window.onresize = () => {
        this.tableHeight = window.innerHeight - 300
      }
    })
  },
  methods: {
    handleLogDialog() {
      // 查看操作日志
      this.logDialogVisible = true;
    },
    logDialogClosed() {
      this.logDialogVisible = false;
    },
    handleEdit(row) {
      // console.log(row);
      this.dialogTitle = '编辑';
      this.editDialogVisible = true;
      this.rowInfo = row;
    },
    editDialogClosed(val) {
      this.editDialogVisible = false;
      if (val === 'refresh') {
        this.getTableData();
      }
    },
    getTableData() {
      // const params = {
      //   orgId: this.orgId,
      //   prePlanNo: '',
      // }
      ROUTE_PLANNING_API.get_sale_level_list(this.orgId).then((res) => {
        const { code, data } = res;
        if (code === '200') {
          this.date = data.time || '-';
          if (data && data.salesLevel && data.salesLevel.length) {
            let list = [];
            data.salesLevel.forEach(item => {
              if (item.salesLevel && item.salesLevel.length) {
                item.salesLevel.forEach((cell, k) => {
                  list.push({
                    customerId: item.customerId,
                    customerName: item.customerName,
                    // 第一列合并行数量
                    rowSpanLen: k === 0 ? item.salesLevel.length : 0,
                    // 最后一列编辑时用到 某个门店类型的所有门店标签
                    salesLevel: k === 0 ? item.salesLevel : [],
                    ...cell,
                  });
                })
              }
            });
            this.tableData = list;
          } else {
            this.tableData = [];
          }
        } else {
          this.tableData = [];
        }
      }).catch((err) => {
        console.log(err);
        this.tableData = [];
      });
    },
    // eslint-disable-next-line
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 第一列和第三列合并行
      if (columnIndex === 0 || columnIndex === 3) {
        if (row.rowSpanLen) {
          return {
            rowspan: row.rowSpanLen,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    addNewItem() {
      this.dialogTitle = '新增';
      this.editDialogVisible = true;
    },
    handleDelete(customerId) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          customerId,
          orgId: this.orgId,
        }
        ROUTE_PLANNING_API.delete_sale_level(params).then((res) => {
          const { code } = res;
          if (code === '200') {
            this.$message({
              message: '删除成功',
              type: 'success',
              showClose: true,
            })
          } else {
            this.$message({
              message: '删除失败',
              type: 'error',
              showClose: true,
            })
          }
          this.getTableData();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
          showClose: true,
        });          
      });
    },
    handleReturn() {
      // console.log('this.$route', this.$route)
      // const { path, query } = this.$route;
      // this.$nextTick(() => {
      //   this.$store.commit('closeTabs', {
      //     clc: {
      //       path,
      //       query,
      //       url: { pam: query, path }
      //     },
      //     current: {
      //       path,
      //       query
      //     }
      //   })
      // })
      this.$router.go(-1)
    },
  },
  watch: {
    orgId() {
      this.getTableData();
    },
  },
}
</script>
<style lang="scss" scoped>
.company-scale-edit-wrapper {
  width: 100%;
  background-color: #F8F8F9;
  .main-container {
    width: 1194px;
    margin: 15px auto;
    // background-color: #F8F8F9;
    padding: 10px;
    position: relative;
    .title-wrap {
      width: 100%;
      height: 40px;
      line-height: 40px;
      background: #FFFFFF;
      border-radius: 2px;
      position: relative;
      margin-bottom: 20px;
      .title {
        font-size: 14px;
        padding-left: 32px;
      }
      .sub-title {
        position: absolute;
        top: 0;
        right: 16px;
        height: 40px;
        line-height: 40px;
        .date {
          font-size: 14px;
          color: #999999;
          margin-right: 17px;
        }
        .update {
          font-size: 12px;
          color: #A634EF;
          // text-decoration: underline;
          cursor: pointer;
        }
      }
    }
    .content-wrap {
      background-color: #ffffff;
      padding: 15px 30px;
      border-radius: 4px;
      // height: calc(100vh - 210px);
      .select-btn {
        height: 24px;
        margin-bottom: 10px;
        button {
          width: 80px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          border: 1px solid #930cea;
          background-color: #ffffff;
          color: #930cea;
          border-radius: 4px;
          padding: 0;
        }
      }
      .table-content {

      }
    }
  }
  .btn-wrap {
    width: 100%;
    margin: 10px 0;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
  }
}
</style>
