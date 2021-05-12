<template>
  <el-dialog
      class="global-config-log-dialog"
      title="操作日志"
      :visible.sync="visible"
      width="1000px"
      :before-close="handleClose"
      center>
      <div class="title-block">
        <span class="title-item">{{type}}</span>
      </div>
      <div class="search-block">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="操作时间">
            <el-date-picker
              v-model="form.times"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              size="small"
              @change="datePickerChanged">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="操作类型">
            <el-select
              v-model="form.type"
              placeholder="请选择"
              size="small"
              @change="getTableData">
              <el-option
                v-for="(item, idx) in typeList"
                :key="idx"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作人">
            <el-select
              v-model="form.operator"
              placeholder="请选择"
              size="small"
              @change="getTableData">
              <el-option
                v-for="(item, idx) in operaterList"
                :key="idx"
                :label="item.operatorName"
                :value="item.operatorId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-block" v-loading="loading">
        <el-table
          class="global-configuration-table"
          :data="tableData"
          border
          fit
          max-height="300"
          style="100%">
          <el-table-column
            prop="operatorName"
            label="操作人"
            align="center"
            width="100">
            <template slot-scope="scope">
              <div>
                {{scope.row.operatorName | isEmptyOrNull}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="modifyTime"
            label="操作时间"
            align="center"
            width="200">
            <template slot-scope="scope">
              <div>
                {{scope.row.modifyTime | dateFormat('YYYY-MM-DD HH:mm:ss')}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="operatorType"
            label="操作类型"
            align="center"
            width="100">
            <template slot-scope="scope">
              <div>
                {{scope.row.operatorType | typeFilter}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="operatorDesc"
            label="操作描述"
            align="center">
          </el-table-column>
        </el-table>
      </div>
      <div class="page-block">
        <el-pagination
          background
          @size-change="sizeChanged"
          @current-change="currentChanged"
          layout="total, prev, pager, next, sizes"
          :page-sizes="[10, 20, 30, 50, 100]"
          :page-size="pageSize"
          :total="totalNumber">
        </el-pagination>
      </div>
  </el-dialog>
</template>

<script>
import ROUTE_PLANNING_API from '@api/route/index';

export default {
  name: 'custommerScaleEditDialog',
  props: {
    type: {
      default: '客户规模', // 客户规模 服务标准 岗位作业标准
    },
    visible: {
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      form: {
        times: [],
        type: '',
        operator: '',
      },
      typeList: [
        { label: '全部', value: '' },
        { label: '导入', value: '3' },
        { label: '修改', value: '1' },
        { label: '删除', value: '2' },
      ],
      operaterList: [],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      totalNumber: 0,
    };
  },
  created() {
    this.getRecordOperator();
  },
  methods: {
    handleClose() {
      this.$emit('handleClose', false);
      this.resetForm();
    },
    resetForm() {
      this.form = {
        times: [],
        type: '',
        operator: '',
      }
      this.tableData = [];
    },
    sizeChanged(page) {
      this.pageSize = page;
      this.getTableData();
    },
    currentChanged(page) {
      this.currentPage = page;
      this.getTableData();
    },
    getRecordOperator() {
      const params = {
        pageNum: 1,
        pageSize: 10000,
      };
      ROUTE_PLANNING_API.get_record_operator(params).then((res) => {
        const { code, data } = res;
        if (code === '200') {
          this.operaterList = data.list;
        } else {
          this.operaterList = [];
        }
        this.loading = false;
      }).catch((err) => {
        console.log(err);
      });
    },
    getTableData() {
      // mock
      // this.tableData = [];
      // for(let i = 0; i < 20; i += 1) {
      //   this.tableData.push({
      //     operatorName: 'XXX',
      //     modifyTime: '2020-04-07 10:12:12',
      //     operatorType: '编辑',
      //     operatorDesc: '有冰箱低表现的销量区间段',
      //   });
      // }

      this.loading = true;
      const params = {
        startTime: this.form.times.length > 0 ? this.form.times[0] : '',
        endTime: this.form.times.length > 1 ? this.form.times[1] : '',
        operatorId: this.form.operator,
        operatorType: this.form.type,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        operatorTitle: this.type === '客户规模' ? '0' : this.type === '服务标准' ? '1' : '2',
      };
      ROUTE_PLANNING_API.get_record_query(params).then((res) => {
        const { code, data } = res;
        if (code === '200') {
          this.tableData = data.list && data.list.length ? data.list : [];
          this.totalNumber = data.total;
          this.currentPage = data.pageNum;
        } else {
          this.tableData = [];
        }
        this.loading = false;
      }).catch((err) => {
        console.log(err);
        this.tableData = [];
        this.loading = false;
      });
    },
    datePickerChanged(date) {
      console.log(date);
      this.getTableData();
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.getTableData();
      }
    },
  },
  filters: {
    typeFilter(val) {
      let resVal;
      if (val && val === '0') {
        resVal = '新增';
      } else if (val && val === '1') {
        resVal = '修改';
      } else if (val && val === '2') {
        resVal = '删除';
      } else if (val && val === '3') {
        resVal = '导入';
      } else {
        resVal = '-';
      }
      return resVal;
    }
  }
}
</script>

<style lang="scss">
.global-config-log-dialog {
  .el-dialog__body {
    padding: 0;
    .title-block {
      width: 100%;
      height: 36px;
      background-color: #ececec;
      box-shadow: 0px 1px 0px 0px #CED3DD;
      border-radius: 2px;
      margin-bottom: 20px;
      .title-item {
        display: inline-block;
        line-height: 36px;
        font-size: 14px;
        // cursor: pointer;
        margin: 0 24px;
        padding: 0 20px;
        color: #930CEA;
        border-bottom: 2px solid #930CEA;
      }
    }
    .search-block {
      // padding: 0 10px;
      .el-form-item {
        margin-bottom: 0;
      }
      .el-form-item__label {
        margin-left: 20px;
      }
      .el-date-editor--daterange.el-input__inner {
        width: 250px;
      }
    }
    .table-block {
      padding: 15px;
    }
    .page-block {
      border-top: 1px solid #CED3DD;
      padding: 5px;
      text-align: right;
    }
  }
}
</style>
