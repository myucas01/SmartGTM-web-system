<template>
  <!-- 全局配置-客户规模配置 -->
  <div class="work-standards-config2-wrapper">
    <div class="main-container">
      <div class="search-wrap">
        <el-input v-model="searchValue" size="small" placeholder="搜索行销公司">
          <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            style="cursor: pointer"
            @click="getTableData">
          </i>
        </el-input>
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
            prop="name"
            label="行销公司"
            width="180">
          </el-table-column>
          <el-table-column
            prop="modifyTime"
            label="更新时间"
            width="180">
            <template slot-scope="scope">
              <div>
                {{scope.row.modifyTime | isEmptyOrNull}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="操作">
            <template slot-scope="scope">
              <div>
                <span
                  class="btn-edit"
                  @click="handleDetail(scope.row, false)">
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
  name: 'workStandardsConfig2',
  data() {
    return {
      state: '',
      tableData: [],
      maxHeight: 300,
      searchValue: '',
      isConfig: true, // 查看按钮显示 （有权限限制之后再做修改）
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.commit('addTabs', {
        title: '岗位作业标准',
        link: '/route-planning/work-standards-config',
        on: true,
        needCatch: true,
      });
    })
  },
  created() {
    this.getTableData();
  },
  mounted() {
    this.$nextTick(() => {
      this.maxHeight = (window.innerHeight - 250 < 300 ) ? 300 : (window.innerHeight - 250)
      window.onresize = () => {
        this.maxHeight = (window.innerHeight - 250 < 300 ) ? 300 : (window.innerHeight - 250)
      }
    })
  },
  methods: {
    handleSelect(item) {
      console.log(item);
    },
    handleIconClick(ev) {
      console.log(ev);
      this.getTableData();
    },
    getTableData() {
      this.$nextTick(() => {
        // ---计算表格高度 撑满可视区域---
        // const viewH = document.body.scrollHeight - 260;
        // const rowH = 48;
        // if (viewH < 314) {
        //   this.maxHeight = 314;
        // } else {
        //   const num = Math.floor(viewH / rowH);
        //   this.maxHeight = rowH * num;
        // }
        ROUTE_PLANNING_API.get_km_job_query_org(this.searchValue).then((res) => {
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
      });
    },
    handleDetail(row, isDisable) {
      // console.log(row);
      this.$router.push({
        path: 'work-standards-edit',
        query: {
          orgName: row.name,
          orgId: row.id,
          isDisable,
        }
      });
    },
  },
}
</script>
<style lang="scss" scoped>
.work-standards-config2-wrapper {
  width: 100%;
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
      margin-bottom: 10px;
      padding-left: 30px;
      .el-input {
        width: 300px;
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
