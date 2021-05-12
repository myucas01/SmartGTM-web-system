<template>
  <div class="work-standards-config-wrapper">
    <div class="main-container">
      <div class="title-wrap">
        <span class="label">组织架构</span>
        <el-select v-model="selectValue" placeholder="请选择" @change="selectChanged" size="small" filterable>
          <el-option
            v-for="item in selectOptions"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </div>
      <div class="content-wrap">
        <el-table
            class="global-configuration-table"
            :data="tableData"
            border
            :max-height="tableHeight"
            style="width: 100%">
            <el-table-column
              prop="name"
              align="center"
              label="营业部">
            </el-table-column>
            <el-table-column
              prop="modifyTime"
              align="center"
              label="修改时间">
              <template slot-scope="scope">
                <div>
                  {{scope.row.modifyTime | isEmptyOrNull}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="岗位作业标准配置"
              align="center">
              <template slot-scope="scope">
                <div class="btn-edit" @click="handleRowConfig(scope.row)">
                  编辑
                </div>
              </template>
            </el-table-column>
          </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import ROUTE_PLANNING_API from '@api/route/index';
// import SelectTree from '../GolbalConfigComponents/selectTree';

export default {
  name: 'workStandardsConfig',
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.commit('addTabs', {
        title: '岗位作业标准',
        link: '/route-planning/work-standards-config',
        on: true,
        needCatch: true,
      });
    });
  },
  components: {
    // SelectTree,
  },
  data() {
    return {
      tableHeight: 350,
      selectValue: '',
      selectOptions: [],
      formInline: {
        orgName: '', // 组织架构名称
        model: '',
      },
      tableData: [],
      rowInfo: {},
      // tree show
      selected: '',
      // 数据默认字段
      // defaultProps: {
      //   parent: 'parentId',   // 父级唯一标识
      //   value: 'id',          // 唯一标识
      //   label: 'label',       // 标签显示
      //   children: 'children', // 子级
      // },
      // 数据列表
      treeOptions: [],
      defaultProps: {
        children: 'children',
        label: 'orgName',
        value: 'orgId',
        parent: 'parentOrgId',
      },
    };
  },
  computed: {},
  created() {
    this.getSelectData();
  },
  mounted() {
    this.$nextTick(() => {
      this.maxHeight = window.innerHeight - 250
      window.onresize = () => {
        this.maxHeight = window.innerHeight - 250
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
      }).catch(() => {
        this.selectOptions = [];
      });
    },
    handleRowConfig(row) {
      // console.log(row);
      // this.$store.commit('routerPlanning/SET_CURRENT_ORG_NAME', row.name);
      // this.$store.commit('routerPlanning/SET_CURRENT_ORG_ID', row.id);
      this.$router.push({
        path: 'work-standards-edit',
        query: {
          orgName: row.name,
          orgId: row.id,
          isDisable: false,
        },
      })
    },
    handleIconClick() {
      this.tableData = [];
      ROUTE_PLANNING_API.get_job_query_org(this.formInline.orgName).then((res) => {
        const { code, data } = res;
        if (code === '200') {
          // if (data && data.length) {
          //   data.forEach((item) => {
          //     if (item.children && item.children.length) {
          //       item.children.forEach((cell, k) => {
          //         this.tableData.push({
          //           partId: item.id,
          //           partName: item.name,
          //           rowSpanLen: k === 0 ? item.children.length : 0, // 行销公司合并行数量
          //           ...cell,
          //         });
          //       });
          //     }
          //   });
          // } else {
          //   this.tableData = [];
          // }
          this.tableData = data;
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
        this.formInline.orgName = val;
        this.handleIconClick();
      }
    },
    selectChanged() {
      this.tableData = [];
      ROUTE_PLANNING_API.get_job_query_org(this.selectValue).then((res) => {
        const { code, data } = res;
        if (code === '200') {
          // if (data && data.length) {
          //   data.forEach((item) => {
          //     if (item.children && item.children.length) {
          //       item.children.forEach((cell, k) => {
          //         this.tableData.push({
          //           partId: item.id,
          //           partName: item.name,
          //           rowSpanLen: k === 0 ? item.children.length : 0, // 行销公司合并行数量
          //           ...cell,
          //         });
          //       });
          //     }
          //   });
          // } else {
          //   this.tableData = [];
          // }
          this.tableData = data;
        } else {
          this.tableData = [];
        }
        this.multipleSelection = [];
      }).catch(() => {
        this.tableData = [];
      });
    },
  },
}
</script>

<style lang="scss">
.work-standards-config-wrapper {
  width: 100%;
  background-color: #F8F8F9;
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
    }
  }
}
</style>
