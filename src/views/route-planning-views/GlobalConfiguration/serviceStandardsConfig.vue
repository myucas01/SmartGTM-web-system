<template>
  <!-- 服务标准-选择配置页 -->
  <div class="service-standards-config">
    <div class="main-container">
      <div class="title-wrap">
        <span class="label">组织架构</span>
        <el-select v-model="selectValue" placeholder="请选择" @change="selectChanged" size="small" filterable>
          <el-option
            v-for="item in selectOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <!-- <el-form :inline="true" :model="formInline" class="form-wrap">
          <el-form-item label="组织架构">
            <select-tree
              width="200"
              @handleCloseId="treeOptionsClosed" />
          </el-form-item>
        </el-form> -->
      </div>
      <div class="content-wrap">
        <div class="select-btn">
          <el-button
            v-auth="'lineplan:config:serve:select'"
            type="primary"
            size="small"
            :class="{'disabled': disabled}"
            @click="handleSelectConfig">
            选择配置
          </el-button>
        </div>
        <div class="table-content">
          <el-table
            class="global-configuration-table"
            :data="tableData"
            border
            :max-height="tableHeight"
            style="width: 100%"
            :span-method="objectSpanMethod"
            @selection-change="handleSelectionChange">
            <el-table-column
              prop="partName"
              width="300"
              label="营业部">
            </el-table-column>
            <el-table-column
              prop="name"
              label="营业所">
            </el-table-column>
            <el-table-column
              prop="templateName"
              label="服务标准配置">
              <template slot-scope="scope">
                <div v-if="scope.row.templateName" class="btn-edit" @click="handleRowConfig(scope.row)">
                  {{ scope.row.templateName}}
                </div>
                <div v-else>-</div>
              </template>
            </el-table-column>
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="btn-wrap" v-show="isReturn">
      <el-button type="primary" size="small" @click="handleReturn">返回</el-button>
    </div>
    <service-dialog
      :row="multipleSelection"
      :visible="serviceDialogVisible"
      @handleClose="serviceDialogClosed"
      @handleRefresh="serviceDialogRefresh" />
  </div>
</template>

<script>
import ROUTE_PLANNING_API from '@api/route/index';
import ServiceDialog from '../GolbalConfigComponents/serviceStandardsConfigDialog';
// import SelectTree from '../GolbalConfigComponents/selectTree';

export default {
  name: 'serviceStandardsConfig',
  components: {
    ServiceDialog,
    // SelectTree,
  },
  data() {
    return {
      tableHeight: 350,
      selectValue: '',
      disabled: true,
      selectOptions: [],
      tableData: [],
      multipleSelection: [],
      rowInfo: {},
      serviceDialogVisible: false,
      formInline: {
      },
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const { isReturn } = to.query;
      console.log('from', from.fullPath);
      console.log('to', to.fullPath);
      if (isReturn !== 'true') {
        vm.$store.commit('addTabs', {
          title: '服务标准',
          // link: '/route-planning/service-standards-config',
          link: to.fullPath,
          on: true,
          needCatch: true,
        });
      } else {
        // vm.$store.commit('addTabs', {
        //   title: '服务标准',
        //   // link: '/route-planning/service-standards-config',
        //   link: from.fullPath,
        //   update: to.fullPath,
        //   on: true,
        //   needCatch: true,
        // });
      }
    });
  },
  computed: {
    currentOrgId() {
      // return this.$store.state.routerPlanning.currentOrgId || '';
      return this.$route.query.orgId || '';
    },
    currentOrgName() {
      // return this.$store.state.routerPlanning.currentOrgName || '';
      return this.$route.query.orgName || '';
    },
    isReturn() {
      return this.$route.query.isReturn === 'true';
    },
    route() {
      return this.$route
    }
  },
  watch: {
    route() {
      this.selectChanged();
    }
  },
  mounted() {
    this.getSelectData();
    this.$nextTick(() => {
      this.tableHeight = (window.innerHeight - 300 < 350) ? 350 : (window.innerHeight - 300)
      window.onresize = () => {
        this.tableHeight = (window.innerHeight - 300 < 350) ? 350 : (window.innerHeight - 300)
      }
    })
  },
  methods: {
    getSelectData() {
      ROUTE_PLANNING_API.get_service_own_company_list().then((res) => {
        const { code, data } = res;
        if (code === '200') {
          if (data && data.length) {
            this.selectOptions = data;
          } else {
            this.selectOptions = [];
          }
        } else {
          this.selectOptions = [];
        }
        // “不合适？点此去修改”按钮 跳转到这里
        if (this.currentOrgId) {
          this.selectValue = this.currentOrgId;
          this.selectChanged();
        }
      }).catch(() => {
        this.selectOptions = [];
      });
    },
    handleSelectConfig() {
      if (this.disabled) return;
      this.serviceDialogVisible = true;
    },
    handleRowConfig(row) {
      // console.log(row);
      // sessionStorage.setItem('currentServiceName', row.templateName);
      // sessionStorage.setItem('currentServiceId', row.templateId);
      // sessionStorage.setItem('currentServiceType', 'true');
      this.$store.commit('routerPlanning/SET_CURRENT_SERVICE_NAME', row.templateName); // 服务标准name
      this.$store.commit('routerPlanning/SET_CURRENT_SERVICE_ID', row.templateId); // 服务标准id
      this.$store.commit('routerPlanning/SET_CURRENT_SERVICE_TYPE', 'true'); // 新增or编辑服务标准
      this.$store.commit('routerPlanning/SET_CURRENT_SERVICE_DISABLE', false); // 表格是否限制编辑 true:限制 false:不限制
      this.$router.push({
        path: 'service-standards-edit',
        query: this.isReturn ? { isReturn: this.isReturn } : {}
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    serviceDialogClosed(val) {
      this.serviceDialogVisible = false;
      if (val === 'refresh') this.selectChanged();
    },
    serviceDialogRefresh(val) {
      if (val === 'refresh') this.selectChanged();
    },
    selectChanged() {
      this.tableData = [];
      ROUTE_PLANNING_API.get_service_organize_list(this.selectValue).then((res) => {
        const { code, data } = res;
        if (code === '200') {
          if (data && data.length) {
            data.forEach((item) => {
              if (item.children && item.children.length) {
                item.children.forEach((cell, k) => {
                  this.tableData.push({
                    partId: item.id,
                    partName: item.name,
                    rowSpanLen: k === 0 ? item.children.length : 0, // 营业部合并行数量
                    ...cell,
                  });
                });
              }
            });
          } else {
            this.tableData = [];
          }
        } else {
          this.tableData = [];
        }
        this.multipleSelection = [];
      }).catch(() => {
        this.tableData = [];
      });
      
    },
    // eslint-disable-next-line
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //  console.log(column, rowIndex);
      if (columnIndex === 0) {
        if (row.rowSpanLen) {
          return {
            rowspan: row.rowSpanLen,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    treeOptionsClosed(val) {
      if (val) {
        this.selectValue = val;
        this.selectChanged();
      }
    },
    handleReturn() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="scss">
.service-standards-config {
  width: 100%;
  background-color: #F8F8F9;
  position: relative;
  .main-container {
    width: 1194px;
    margin: 15px auto;
    // background-color: #F8F8F9;
    padding: 10px;
    .title-wrap {
      width: 100%;
      height: 50px;
      line-height: 50px;
      background: #FFFFFF;
      border-radius: 2px;
      position: relative;
      margin-bottom: 20px;
      .label {
        margin-left: 30px;
        font-size: 14px;
        color: #606266;
      }
      .el-select {
        margin-left: 10px;
      }
      .form-wrap {
        .el-form-item {
          margin-left: 30px;
          .el-form-item__content {
            vertical-align: middle;
          }
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
        margin-bottom: 20px;
        text-align: right;
        button {
          &.disabled {
            background-color: #999999;
            border-color: #999999;
          }
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
