<template>
  <!-- 服务标准 -->
  <div class="service-standards-wrapper">
    <div class="title-block">
      <span class="title">{{orgName}}</span>
      <div class="sub-title" v-show="!noneData">
        <span class="date" v-if="date">更新时间：{{date | dateFormat('YYYY-MM-DD HH:mm:ss')}}</span>
        <span class="date" v-else>更新时间：-</span>
        <span class="update" @click="handleUpdate" v-auth="'lineplan:config:serve:in'">不合适？点此去修改</span>
      </div>
    </div>
    <div class="content-block" v-if="noneData">
      <div class="none-data" @click="handleUpdate" v-auth="'lineplan:config:serve:in'">暂无配置，点此选择配置</div>
    </div>
    <div class="table-block" v-else>
      <div class="sub-tabs-wrap" style="display: none;">
        <span
          class="sub-tab-item"
          v-for="(item, idx) in subTabsData"
          :key="idx"
          :class="{'active': activeIndex === idx}"
          @click="tabChanged(idx)">
          {{item.text}}
        </span>
      </div>
      <div class="table-wrap" v-show="activeIndex === 0">
        <el-table
          class="global-configuration-table"
          :data="tableData0"
          border
          fit
          :max-height="tableHeight0"
          style="width: 100%">
          <el-table-column
            v-for="(item, idx) in columns0"
            :key="idx"
            :label="item.label"
            :prop="item.prop"
            :align="item.textAlign"
            :width="item.width">
            <template slot-scope="scope">
              <div v-if="item.label === '职务'">
                <!-- <p>{{scope.row[item.prop].salesTypeName}}</p> -->
                <p>{{scope.row[item.prop]}}</p>
              </div>
              <div v-else>
                <p v-for="(cell, i) in scope.row[item.prop]"
                  :key="i">
                  {{cell.customerName}}
                </p>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-wrap" v-show="activeIndex === 1">
        <el-table
          class="global-configuration-table"
          :data="tableData1"
          border
          :max-height="tableHeight1"
          style="width: 100%;display: none;"
          :span-method="objectSpanMethod">
          <el-table-column align="center" width="80">
            <template slot="header">
              <p class="weight-header">客户分级</p>
            </template>
            <template slot-scope="scope">
              <div>{{scope.row.labelName}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" width="120">
            <template slot="header">
              <p class="weight-header">客户类型</p>
            </template>
            <template slot-scope="scope">
              <div v-if="scope.row.storeTypeName">
                <p v-for="(cell, i) in scope.row.storeTypeName.split(',')"
                  :key="i"
                  class="bg-type">
                  {{cell}}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, idx) in columns1"
            :key="idx"
            :label="item.label"
            :prop="item.prop"
            :align="item.textAlign">
            <template slot="header">
              <p class="weight-header" v-if="item.label === '客户类型'">{{item.label}}</p>
              <p class="weight-header column-header" v-else>{{item.label}}</p>
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
                <p class="normal-header">{{cell.subLabel}}</p>
              </template>
              <template slot-scope="scope">
                <div v-if="i % 2 === 0">
                  {{scope.row.data[idx] ? scope.row.data[idx].visitTimes : '-'}}
                </div>
                <div v-else>
                  {{scope.row.data[idx] ? scope.row.data[idx].visitDuration: '-'}}
                </div>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <el-table
            :data="threeVos"
            border
            :max-height="tableHeight0"
            :header-cell-style="tableHeaderColor"
            :cell-style="cellHeight"
            :span-method="rightMerge">
          <el-table-column
              prop="grandfather"
              label="通路/渠道"
              align="center"
              width="100">
            <div slot="header" class="table-item-header">通路/渠道</div>
          </el-table-column>
          <el-table-column
              prop="parent"
              label="渠道"
              align="center"
              width="100">
            <div slot="header" class="table-item-header">渠道</div>
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.desc" placement="top-start">
                <span>{{scope.row.parent}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
              prop="configBigName"
              label="客户分级"
              align="center"
              width="80">
            <div slot="header" class="table-item-header">客户分级</div>
          </el-table-column>
          <el-table-column>
            <div slot="header" class="diy-header">
              0-3组货架
            </div>
            <el-table-column
                prop="configBigName"
                label="拜访频率" align="center">
              <div slot="header" class="table-item-header">
                拜访频率
                <p>（次/周）</p>
              </div>
              <template slot-scope="OScope">
                {{ OScope.row.data | filterParams(0, 'visitTimes') }}
              </template>
            </el-table-column>
            <el-table-column
                prop="configBigName"
                label="在店时长参考" align="center">
              <div slot="header" class="table-item-header">
                在店时长参考
                <p>（分钟/次）</p>
              </div>
              <template slot-scope="OScope">
                {{ OScope.row.data | filterParams(0, 'visitDuration')}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column>
            <div slot="header" class="diy-header">
              4-6组货架
            </div>
            <el-table-column
                prop="configBigName"
                label="拜访频率" align="center">
              <div slot="header" class="table-item-header">
                拜访频率
                <p>（次/周）</p>
              </div>
              <template slot-scope="OScope">
                {{ OScope.row.data | filterParams(1, 'visitTimes') }}
              </template>
            </el-table-column>
            <el-table-column
                prop="configBigName"
                label="在店时长参考" align="center">
              <div slot="header" class="table-item-header">
                在店时长参考
                <p>（分钟/次）</p>
              </div>
              <template slot-scope="OScope">
                {{ OScope.row.data |filterParams(1, 'visitDuration') }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column>
            <div slot="header" class="diy-header">
              7组及以上货架
            </div>
            <el-table-column
                prop="configBigName"
                label="拜访频率" align="center">
              <div slot="header" class="table-item-header">
                拜访频率
                <p>（次/周）</p>
              </div>
              <template slot-scope="OScope">
                {{ OScope.row.data | filterParams(2, 'visitTimes') }}
              </template>
            </el-table-column>
            <el-table-column
                prop="configBigName"
                label="在店时长参考" align="center">
              <div slot="header" class="table-item-header">
                在店时长参考
                <p>（分钟/次）</p>
              </div>
              <template slot-scope="OScope">
                {{ OScope.row.data | filterParams(2, 'visitDuration') }}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>

  </div>
</template>

<script>
import ROUTE_PLANNING_API from '@api/route/index';

export default {
  name: 'serviceStandardsWrapper',
  filters: {
    filterParams(val, index, key) {
      if (val) {
        if(val[index]) {
          return val[index][key]
        } else {
          return '-'
        }
      } else {
        return '-'
      }
    }
  },
  data() {
    return {
      spanData: [],
      twoVos: [],
      threeVos: [],
      threeSpanData: [],
      mockTable: [],
      noneData: false,
      date: '',
      subTabsData: [
        // {
        //   text: '服务关系',
        //   id: '100',
        // },
        {
          text: '拜访频次与在店时长',
          id: '200',
        },
      ],
      // activeIndex: 0,
      activeIndex: 1,
      // 服务关系 table
      columns0: [
        {
          label: '职务',
          // prop: 'salesType',
          prop: 'salesTypeName',
          textAlign: 'left',
          width: '300',
        },
        {
          label: '客户类型',
          prop: 'customers',
          textAlign: 'left',
          width: '',
        }
      ],
      tableData0: [],
      // 拜访频次与在店时长 table
      columns1: [
        // {
        //   label: '客户类型',
        //   prop: 'type',
        //   textAlign: 'center',
        // },
        {
          label: '0-3组货架',
          prop: '',
          textAlign: 'center',
          children: [
            {
              label: '拜访频率',
              subLabel: '(次/周)',
              prop: 'fridgeHighFreq',
              textAlign: 'center',
            },
            {
              label: '在店时长',
              subLabel: '(分钟/次)',
              prop: 'fridgeHighTime',
              textAlign: 'center',
            },
          ],
        },
        {
          label: '4-6组货架',
          prop: '',
          textAlign: 'center',
          children: [
            {
              label: '拜访频率',
              subLabel: '(次/周)',
              prop: 'fridgePotentialFreq',
              textAlign: 'center',
            },
            {
              label: '在店时长',
              subLabel: '(分钟/次)',
              prop: 'fridgePotentialTime',
              textAlign: 'center',
            },
          ],
        },
        {
          label: '7组及以上货架',
          prop: '',
          textAlign: 'center',
          children: [
            {
              label: '拜访频率',
              subLabel: '(次/周)',
              prop: 'fridgeBaseFreq',
              textAlign: 'center',
            },
            {
              label: '在店时长',
              subLabel: '(分钟/次)',
              prop: 'fridgeBaseTime',
              textAlign: 'center',
            },
          ],
        },
      ],
      tableData1: [],
      tableHeight0: 250,
      tableHeight1: 320,
    };
  },
  computed:{
    orgName() {
      return this.$route.query.organizeName
    },
    orgId() {
      return this.$route.query.organizeId
    },
    serviceName() {
      return this.$store.state.routerPlanning.currentServiceName ||
        sessionStorage.getItem('currentServiceName');
    },
    serviceId() {
      return this.$store.state.routerPlanning.currentServiceId ||
        sessionStorage.getItem('currentServiceId');
    },
    serviceType() {
      return Boolean(this.$store.state.routerPlanning.currentServiceType ||
        sessionStorage.getItem('currentServiceType'));
    },
  },
  mounted() {
    this.getServiceId();
    this.$nextTick(() => {
      this.tableHeight0 = window.innerHeight - 320
      this.tableHeight1 = window.innerHeight - 320
      window.onresize = () => {
        this.tableHeight0 = window.innerHeight - 320
        this.tableHeight1 = window.innerHeight - 320
      }
    })
  },
  methods: {
    tabChanged(idx) {
      this.activeIndex = idx;
    },
    handleUpdate() {
      // query 传营业所对应的行销公司
      this.$router.push({
        path: 'service-standards-config',
        query: {
          // orgName: this.orgName,
          // orgId: this.orgId,
          orgName: this.$store.state.routerPlanning.currentOrgName,
          orgId: this.$store.state.routerPlanning.currentOrgId,
          isReturn: true, // 从此处跳转到编辑页时，编辑完成需返回
        },
      });
    },
    // 通过组织id获取对应的服务id
    getServiceId() {
      ROUTE_PLANNING_API.get_service_from_org(this.orgId).then((res) => {
        const { code, data } = res;
        if (code === '200') {
          if (data) {
            this.getTableData(data);
            this.noneData = false;
          } else {
            this.noneData = true;
          }
          this.$emit('handleConfig', !this.noneData); // 服务标准有无配置
        }
      });
    },
    getTableData(serviceId) {
      this.tableData0 = [];
      this.tableData1 = [];
      const params = {
        template_id: serviceId,
        prePlanNo: this.$route.query.planId,
      }
      ROUTE_PLANNING_API.get_service_detail_list(params).then((res) => {
        if(res.code === '200' && res.data) {
          this.templateId = res.data.id
          this.title = res.data.templateName
          this.date = res.data.modifyTime
          this.mockTable = res.data.oneVos
          this.dataDeal()
        }
        // if (code === '200' && data && data.length) {
        //   this.title = data[0].templateName || '';
        //   this.date =  data[0].modifyTime || '';
        //   // this.tableData1 = data[0].saleTagInfos || [];
        //   this.tableData0 = data[0].serviceDetail || [];
        //
        //   if (data[0].saleTag && data[0].saleTag.length) {
        //     let tempList = [];
        //     data[0].saleTag.forEach(item => {
        //       if (item.dataList) {
        //         item.dataList.forEach((cell, k) => {
        //           tempList.push({
        //             labelId: item.labelId,
        //             labelName: item.labelName,
        //             // 第一列合并行数量
        //             rowSpanLen: k === 0 ? item.dataList.length : 0,
        //             ...cell,
        //           });
        //         });
        //       }
        //     });
        //     this.tableData1 = tempList;
        //   }
        // }
      }).catch((err) => {
        console.log(err);
        this.tableData0 = [];
        this.tableData1 = [];
      });
    },
    // eslint-disable-next-line
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
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
    // 数据处理
    dataDeal() {
      let mockData = this.mockTable, twoVos = []
      console.info(mockData)
      if (mockData && mockData.length > 0) {
        for (let item of mockData) {
          twoVos = twoVos.concat(item.twoVos)
        }
      }
      this.twoVos = twoVos

      let threeData = [], threeSpanData = [], threePos = 0, spanData = [], pos = 0
      for (let twoItem of twoVos) {
        threeData = threeData.concat(twoItem.threeVos)
      }
      for (let j = 0; j < threeData.length; j++) {
        if (j === 0) {
          threeSpanData.push(1)
          spanData.push(1)
          threePos = 0
          pos = 0
        } else {
          if (threeData[j].grandfather === threeData[j - 1].grandfather) {
            spanData[pos] += 1
            spanData.push(0)
          } else {
            spanData.push(1)
            pos = j
          }
          if (threeData[j].parent === threeData[j - 1].parent && threeData[j].desc === threeData[j - 1].desc) {
            threeSpanData[threePos] += 1
            threeSpanData.push(0)
          } else {
            threeSpanData.push(1)
            threePos = j
          }
        }
      }
      this.threeSpanData = threeSpanData
      this.threeVos = threeData
      this.spanData = spanData
    },
    // table 合并
    rightMerge({column, rowIndex}) {
      // 合并 通路/渠道
      if (column.property === 'grandfather') {
        const _row = this.spanData[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return [_row, _col]
      }
      // 合并 渠道
      if (column.property === 'parent') {
        const _row = this.threeSpanData[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return [_row, _col]
      }
    },
    tableHeaderColor() {
      return 'background-color: #F8F8F9'
    },
    cellHeight() {
      return 'padding: 0;height: 30px'
    }
  },
}
</script>

<style lang="scss" scoped>
.service-standards-wrapper {
  .title-block {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #FFFFFF;
    box-shadow: 0px 1px 0px 0px #CED3DD;
    border-radius: 2px;
    position: relative;
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
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
  .content-block {
    width: 100%;
    height: 403px;
    position: relative;
    .none-data {
      font-size: 16px;
      color: #BB4CF1;
      font-weight: 600;
      text-decoration: underline;
      text-align: center;
      cursor: pointer;
      position: absolute;
      width: 50%;
      height: 50%;
      top: 50%;
      transform: translateY(-50%);
      transform: translatex(50%);
    }
  }
  .table-block {
    .sub-tabs-wrap {
      width: 100%;
      height: 36px;
      background-color: #ffffff;
      box-shadow: 0px 1px 0px 0px #CED3DD;
      border-radius: 2px;
      margin-top: 20px;
      .sub-tab-item {
        display: inline-block;
        line-height: 36px;
        font-size: 14px;
        cursor: pointer;
        margin: 0 24px;
        padding: 0 20px;
        &.active {
          color: #930CEA;
          border-bottom: 2px solid #930CEA;
        }
      }
    }
    .table-wrap {
      padding: 30px 30px 26px 30px;
    }
  }
  .diy-header {
    background: #EAEAEA;
    border-radius: 4px;
    border: 1px solid #DDDEE1;
    text-align: center;
    font-weight: 600;
    color: #1C2438;
  }
  .table-item-header{
    font-weight: 600;
    color: #1C2438;
    p{
      font-weight: 400;
      color: #495060;
    }
  }
}
</style>

