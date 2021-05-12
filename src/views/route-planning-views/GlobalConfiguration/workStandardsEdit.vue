<template>
  <div class="work-standards-edit-wrapper">
    <div class="main-container">
      <div class="title-wrap">
        <span class="title">{{orgName ? orgName : '全国'}}</span>
        <div class="sub-title">
          <span
            v-if="date"
            class="date">
            时间：{{date | dateFormat('YYYY-MM-DD HH:mm:ss')}}
          </span>
          <span v-else class="date">时间：-</span>
          <span class="update" @click="handleLogDialog">查看操作日志</span>
        </div>
      </div>
      <div class="list-wrap">
        <div class="btn-add" v-if="!isTableDisable">
          <el-button
            v-auth="'lineplan:config:jobs:add'"
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="addNewItem">
            新增
          </el-button>
        </div>
        <el-table
          class="global-configuration-table"
          :data="tableData"
          border
          :max-height="tableHeight"
          style="width: 100%">
          <el-table-column
            v-for="(item, idx) in columns"
            :key="idx"
            :label="item.label"
            :prop="item.prop"
            :align="item.textAlign">
            <template slot="header">
              <p class="weight-header"
                :style="{'display: inline-block' : item.label === '规划权重'}">
                {{item.label}}
                <el-tooltip
                  v-show="item.tooltip"
                  effect="dark"
                  :content="item.tooltip"
                  placement="top-start">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </p>
              <p v-if="item.subLabel"
                class="normal-header"
                :style="{'display: inline-block' : item.label === '规划权重'}">
                {{item.subLabel}}
              </p>
            </template>
            <template slot-scope="scope">
              <div>
                <!-- <span v-if="item.label === '岗位'">{{scope.row[item.prop] | workType}}</span> -->
                <span v-if="item.label === '岗位'">{{scope.row.salesTypeName}}</span>
                <span v-else-if="item.label === '服务点数'">{{scope.row.ownPointMin}}-{{scope.row.ownPointMax}}</span>
                <span v-else-if="item.label === '工作日天数'">{{scope.row.day}}</span>
                <span v-else-if="item.label === '人均拜访参考值'">{{scope.row.ownVisitMin}}-{{scope.row.ownVisitMax}}</span>
                <span v-else-if="item.label === '人均工作时长参考值'">{{scope.row.ownJobMin}}-{{scope.row.ownJobMax}}</span>
              </div>
            </template>
            <el-table-column
              v-show="item.children"
              v-for="(cell, i) in item.children"
              :key="i"
              :label="cell.label"
              :prop="cell.prop"
              :align="cell.textAlign">
              <template slot="header">
                <p class="weight-header">{{cell.label}}</p>
              </template>
              <template slot-scope="scope">
                <div v-if="cell.label === '销量'">
                  <!-- {{scope.row.weightsType === '1' ? '销额：' : '销量：'}}{{scope.row[cell.prop] | isEmptyOrNull}}% -->
                  {{scope.row[cell.prop] | isEmptyOrNull}}%
                </div>
                <div v-else>
                  {{scope.row[cell.prop] | isEmptyOrNull}}%
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column v-if="!isTableDisable" align="center" width="120">
            <template slot="header">
                <p class="weight-header">操作</p>
              </template>
            <template slot-scope="scope">
              <div>
                <span
                  v-auth="'lineplan:config:jobs:update'"
                  class="btn-edit"
                  @click="handleEdit(scope.row)">
                  编辑
                </span>
                <span
                  v-auth="'lineplan:config:jobs:delete'"
                  class="btn-delete"
                  @click="handleDelete(scope.row)">
                  删除
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="btn-wrap" v-show="isReturn">
      <el-button type="primary" size="small" @click="handleReturn">返回</el-button>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="tipDialogVisible"
      width="350px">
      <div style="text-align: center">确认删除吗</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tipDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteTab2Item">确 定</el-button>
      </span>
    </el-dialog>
    <log-dialog
      type="岗位作业标准"
      :visible="logDialogVisible"
      @handleClose="logDialogClosed" />
    <edit-dialog
      :isEdit="isEdit"
      :row="rowInfo"
      :disableOptions="disableOptions"
      :visible="addDialogVisible"
      @handleClose="addDialogClosed" />
  </div>
</template>

<script>
import LogDialog from '../GolbalConfigComponents/logDialog';
import EditDialog from '../GolbalConfigComponents/workStandardsEditDialog';
import ROUTE_PLANNING_API from '@api/route/index';

export default {
  name: 'serviceStandardsEdit',
  components: {
    LogDialog,
    EditDialog,
  },
  data() {
    return {
      tableHeight: 250,
      date: '',
      logDialogVisible: false,
      curId: '',
      columns: [
        {
          label: '岗位',
          subLabel: '',
          prop: 'salesTypeName',
          textAlign: 'center',
          tooltip: '',
        },
        {
          label: '服务点数',
          subLabel: '',
          prop: 'ownPointMin',
          textAlign: 'center',
          tooltip: '',
        },
        {
          label: '工作日天数',
          subLabel: '（天/周期）',
          prop: 'day',
          textAlign: 'center',
          tooltip: '',
        },
        {
          label: '人均拜访参考值',
          subLabel: '(点/天)',
          prop: 'ownVisitMin',
          textAlign: 'center',
          tooltip: '',
        },
        {
          label: '人均工作时长参考值',
          subLabel: '(小时/天)',
          prop: 'ownJobMin',
          textAlign: 'center',
          tooltip: '',
        },
        // {
        //   label: '规划权重',
        //   subLabel: '(权重之和为100%)',
        //   prop: 'planWeight',
        //   textAlign: 'center',
        //   tooltip: '',
        //   children: [
        //     {
        //       label: '销量',
        //       subLabel:'',
        //       prop: 'amountPercentage',
        //       textAlign: 'center',
        //       tooltip: '',
        //     },
        //     {
        //       label: '售点数',
        //       subLabel:'',
        //       prop: 'pointsSold',
        //       textAlign: 'center',
        //       tooltip: '',
        //     },
        //     {
        //       label: '在店时长',
        //       subLabel:'',
        //       prop: 'shopTime',
        //       textAlign: 'center',
        //       tooltip: '',
        //     },
        //   ],
        // },
      ],
      tableData: [],
      tipDialogVisible: false, // 删除提示对话框
      addDialogVisible: false, // 编辑/新增对话框
      isEdit: false, // 编辑/新增
      rowInfo: {}, // 编辑时某行的数据传入dialog
    };
  },
  computed: {
    orgName() {
      return this.$route.query.orgName || '';
    },
    orgId() {
      return this.$route.query.orgId || '';
    },
    // 表格是否可编辑
    isTableDisable() {
      return this.$route.query.isDisable === 'true';
    },
    // 列表中已有的岗位
    disableOptions() {
      return this.tableData.map(item => item.salesTypeCode) || [];
    },
    isReturn() {
      // return this.$route.query.isReturn === 'true';
      return true;
    },
  },
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     const {
  //       orgId,
  //       orgName,
  //       // isDisable,
  //       isReturn
  //     } = vm.$route.query;
  //     const name = orgId ? `${orgName}-` : '';
  //     if (isReturn !== 'true') {
  //       vm.$store.commit('addTabs', {
  //         title: `${name}岗位作业标准`,
  //         // link: vm.$route.fullPath,
  //         // link: `/route-planning/work-standards-edit?orgName=${vm.$route.query.orgName}&orgId=${vm.$route.query.orgId}&isDisable=${vm.$route.query.isDisable}`,
  //         link: to.fullPath,
  //         on: true,
  //         needCatch: true,
  //       });
  //     }
  //   });
  // },
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
    removeItem(item, i) {
      item.typeList.splice(i, 1);
    },
    addItem(item) {
      const obj = {
        type: this.typeOptions[0].value,
      };
      item.typeList.push(obj);
    },
    addNewItem() {
      this.rowInfo = {};
      this.isEdit = false;
      this.addDialogVisible = true;
    },
    handleEdit(row) {
      // console.log(row);
      row.jobType= {
        typeCode:row.salesTypeCode,
        typeName:row.salesTypeName,
      }

      this.rowInfo = row;
      this.isEdit = true;
      this.addDialogVisible = true;
    },
    handleDelete(row) {
      // console.log(row);
      this.curId = row.id;
      this.tipDialogVisible = true;
    },
    deleteTab2Item() {
      // 请求delete接口
      const params = {
        id: this.curId,
        operatorId: '',
        operatorName: '',
      };
       ROUTE_PLANNING_API.get_work_standards_delete(params).then((res) => {
        const { code } = res;
        if (code === '200') {
          this.getTableData();
        }
        this.tipDialogVisible = false;
      }).catch((err) => {
        console.log(err);
        this.tipDialogVisible = false;
      });
    },
    addDialogClosed(val) {
      this.addDialogVisible = false;
      if (val === 'refresh') this.getTableData();
    },
    getTableData() {
      const params = {
        orgId: this.orgId,
        prePlanNo: '',
      }
      ROUTE_PLANNING_API.get_work_standards_info(params).then((res) => {
        const { code, data } = res;
        if (code === '200') {
          if (data && data.length) {
            this.tableData = data;
            this.date = data[0].modifyTime;
          } else {
            this.tableData = [];
            this.date = '';
          }
        } else {
          this.tableData = [];
        }
      }).catch((err) => {
        console.log(err);
        this.tableData = [];
      });
    },
    handleReturn() {
      this.$router.go(-1)
    },
  },
  watch: {
    // 不同的orgId 岗位作业标准列表刷新展示
    orgId() {
      this.getTableData();
    },
  },
  filters: {
    workType(val) {
      let typeName = '';
      switch(val) {
        case '1':
          typeName = '士多';
        break;
        case '2':
          typeName = 'MA';
        break;
        case '3':
          typeName = '特通';
        break;
        case '4':
          typeName = '批发';
        break;
        default:
          typeName = '-';
        break;
      }
      return typeName;
    },
  },
}
</script>
<style lang="scss" scoped>
.work-standards-edit-wrapper {
  width: 100%;
  background-color: #F8F8F9;
  .main-container {
    width: 1194px;
    margin: 15px auto;
    // background-color: #F8F8F9;
    padding: 10px;
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
    .list-wrap {
      background-color: #ffffff;
      padding: 15px 30px;
      border-radius: 4px;
      // height: calc(100vh - 210px);
      .btn-add {
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
      .btn-edit {
        color: #A634EF;
        cursor: pointer;
        padding-right: 10px;
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
