<template>
  <!-- 全局配置-客户规模配置(km是客户分级) -->
  <div class="customer-scale-edit-wrapper">
    <div class="main-container">
      <div class="search-wrap">
        <span class="label">组织架构</span>
        <el-select v-model="selectValue" placeholder="请选择" @change="selectChanged" size="small" filterable>
          <el-option
            v-for="item in selectOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="list-wrap">
        <el-table
          :data="tableData"
          class="global-configuration-table"
          border
          stripe
          :max-height="maxHeight"
          ref="customerTable"
          style="width: 100%:height:100%">
          <el-table-column
            prop="orgName"
            label="营业部"
            align="center">
          </el-table-column>
          <el-table-column
            prop="modifyTime"
            label="更新时间"
            align="center">
            <template slot-scope="scope">
              <div>
                {{scope.row.modifyTime | isEmptyOrNull}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="操作"
            align="center">
            <template slot-scope="scope">
              <div>
                <!-- <span
                  v-show="scope.row.modifyTime"
                  class="btn-edit"
                  @click="handleDetail(scope.row, false)">
                  查看
                </span>
                <span
                  v-show="isEdit"
                  class="btn-edit"
                  @click="handleDetail(scope.row, true)">
                  编辑
                </span> -->
                <span
                  v-show="isEdit"
                  class="btn-edit"
                  @click="handleDetail(scope.row, true)">
                  查看
                </span>
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

export default {
  name: 'customerScaleEdit',
  data() {
    return {
      editAuthorityList: [
        '总部',
        '南区',
        '北区',
        '行销公司'
      ],
      authority: '行销公司',
      restaurants: [],
      state: '',
      tableData: [],
      maxHeight: 314,
      isConfig: true, // 查看按钮显示 （有权限限制之后再做修改）
      selectValue: '',
      selectOptions: [],
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.commit('addTabs', {
        title: '售点分级',
        link: '/route-planning/customer-scale-edit',
        on: true,
        needCatch: true,
      });
    })
  },
  computed: {
    // 是否可编辑（权限）
    isEdit() {
      return this.editAuthorityList.includes(this.authority);
    },
  },
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
    selectChanged() {
      // 计算表格高度 撑满可视区域
      // this.$nextTick(() => {
      //   const viewH = document.body.scrollHeight - 260;
      //   const rowH = 48;
      //   if (viewH < 314) {
      //     this.maxHeight = 314;
      //   } else {
      //     const num = Math.floor(viewH / rowH);
      //     this.maxHeight = rowH * num;
      //   }
      // });
      ROUTE_PLANNING_API.get_sale_level_company(this.selectValue).then((res) => {
        const { code, data } = res;
        if (code === '200') {
          this.tableData = data;
        } else {
          this.tableData = [];
        }
      }).catch((err) => {
        console.log(err);
        this.tableData = [];
      });
    },
    handleDetail(row, isEdit) {
      // console.log(row);
      this.$router.push({
        path: 'company-scale-edit',
        query: {
          orgName: row.orgName,
          orgId: row.orgId,
          isEdit,
        }
      });
    },
  },
}
</script>
<style lang="scss" scoped>
.customer-scale-edit-wrapper {
  width: 100%;
  background-color: #F8F8F9;
  .main-container {
    width: 1194px;
    margin: 15px auto;
    background-color: #F8F8F9;
    padding: 10px;
    .search-wrap {
      height: 50px;
      line-height: 50px;
      background-color: #ffffff;
      border-radius: 4px;
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
    .list-wrap {
      background-color: #ffffff;
      padding: 40px 30px 10px;
      border-radius: 4px;
      height: calc(100vh - 210px);
      .btn-edit {
        color: #A634EF;
        cursor: pointer;
        padding-right: 10px;
      }
    }
  }
}
</style>
