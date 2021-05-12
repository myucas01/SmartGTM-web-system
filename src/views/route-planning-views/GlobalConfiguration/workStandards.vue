<template>
  <!-- 岗位作业标准 -->
  <div class="work-standards-wrapper">
    <div class="title-block">
      <span class="title">{{ name }}</span>
      <div class="sub-title" v-show="!noneData">
        <span v-if="date" class="date">
          更新时间：{{ date | dateFormat('YYYY-MM-DD HH:mm:ss') }}
        </span>
        <span v-else class="date">更新时间：-</span>
        <span class="update" @click="handleUpdate" v-auth="'lineplan:config:jobs:in'">不合适？点此去修改</span>
      </div>
    </div>
    <div class="content-block" v-if="noneData">
      <div class="none-data" @click="handleUpdate" v-auth="'lineplan:config:jobs:in'">暂无配置，点此选择配置</div>
    </div>
    <div class="table-block" v-else>
      <el-table
        class="global-configuration-table"
        :data="tableData"
        border
        :max-height="tableHeight"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item, idx) in columns"
          :key="idx"
          :label="item.label"
          :prop="item.prop"
          :align="item.textAlign"
        >
          <template slot="header">
            <p
              class="weight-header"
              :style="{ 'display: inline-block': item.label === '规划权重' }"
            >
              {{ item.label }}
              <el-tooltip
                v-show="item.tooltip"
                effect="dark"
                :content="item.tooltip"
                placement="top-start"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
            </p>
            <p
              v-if="item.subLabel"
              class="normal-header"
              :style="{ 'display: inline-block': item.label === '规划权重' }"
            >
              {{ item.subLabel }}
            </p>
          </template>
          <template slot-scope="scope">
            <div>
              <!-- <span v-if="item.label === '岗位'">{{scope.row[item.prop] | workType}}</span> -->
              <span v-if="item.label === '岗位'">{{
                scope.row.salesTypeName
              }}</span>
              <span v-else-if="item.label === '服务点数'"
                >{{ scope.row.ownPointMin }}-{{ scope.row.ownPointMax }}</span
              >
              <span v-else-if="item.label === '工作日天数'">{{
                scope.row.day
              }}</span>
              <span v-else-if="item.label === '人均拜访参考值'"
                >{{ scope.row.ownVisitMin }}-{{ scope.row.ownVisitMax }}</span
              >
              <span v-else-if="item.label === '人均工作时长参考值'"
                >{{ scope.row.ownJobMin }}-{{ scope.row.ownJobMax }}</span
              >
            </div>
          </template>
          <el-table-column
            v-show="item.children"
            v-for="(cell, i) in item.children"
            :key="i"
            :label="cell.label"
            :prop="cell.prop"
            :align="cell.textAlign"
          >
            <template slot="header">
              <p class="weight-header">{{ cell.label }}</p>
            </template>
            <template slot-scope="scope">
              <div v-if="cell.label === '销量'">
                <!-- {{scope.row.weightsType === '1' ? '销额：' : '销量：'}}{{scope.row[cell.prop] | isEmptyOrNull}}% -->
                {{ scope.row[cell.prop] | isEmptyOrNull }}%
              </div>
              <div v-else>{{ scope.row[cell.prop] | isEmptyOrNull }}%</div>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import ROUTE_PLANNING_API from '@api/route/index'

export default {
  name: 'workStandardsWrapper',
  props: {
    id: {
      default: ''
    },
    name: {
      default: ''
    }
  },
  data() {
    return {
      noneData: false,
      title: '全国',
      date: '',
      columns: [
        {
          label: '岗位',
          subLabel: '',
          prop: 'salesTypeName',
          textAlign: 'center',
          tooltip: ''
        },
        {
          label: '服务点数',
          subLabel: '',
          prop: 'ownPointMin',
          textAlign: 'center',
          tooltip: ''
        },
        {
          label: '工作日天数',
          subLabel: '（天/周期）',
          prop: 'day',
          textAlign: 'center',
          tooltip: ''
        },
        {
          label: '人均拜访参考值',
          subLabel: '(点/天)',
          prop: 'ownVisitMin',
          textAlign: 'center',
          tooltip: ''
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
      tableHeight: 320,
    }
  },
  computed: {
    // orgName() {
    //   return this.$store.state.routerPlanning.visitOrgName;
    // },
    // orgId() {
    //   return this.$store.state.routerPlanning.visitOrgId;
    // },
  },
  mounted() {
    // this.getTableData();
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 320
      window.onresize = () => {
        this.tableHeight = window.innerHeight - 320
      }
    })
  },
  methods: {
    handleUpdate() {
      // 跳转到客户规模编辑tab
      this.$router.push({
        path: 'work-standards-edit',
        query: {
          orgName: this.name,
          orgId: this.id,
          isDisable: false, // 表格是否可编辑，
          isReturn: true, // 从此处跳转到编辑页时，编辑完成需返回
        }
      });
    },
    getTableData() {
      const params = {
        orgId: this.id,
        prePlanNo: ''
      }
      ROUTE_PLANNING_API.get_work_standards_info(params)
        .then(res => {
          const { code, data } = res
          if (code === '200') {
            if (data && data.length) {
              this.date = data[0].modifyTime
              this.tableData = data
              this.noneData = false
            } else {
              this.tableData = []
              this.noneData = true
              this.date = ''
            }
            this.$emit('handleConfig', !this.noneData) // 岗位作业标准有无配置
          } else {
            this.tableData = []
          }
        })
        .catch(err => {
          console.log(err)
          this.tableData = []
        })
    }
  },
  watch: {
    id() {
      this.getTableData()
    }
  },
  filters: {
    workType(val) {
      let typeName = ''
      switch (val) {
        case '1':
          typeName = '士多'
          break
        case '2':
          typeName = 'MA'
          break
        case '3':
          typeName = '特通'
          break
        case '4':
          typeName = '批发'
          break
        default:
          typeName = '-'
          break
      }
      return typeName
    }
  }
}
</script>

<style lang="scss" scoped>
.work-standards-wrapper {
  .title-block {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #ffffff;
    box-shadow: 0px 1px 0px 0px #ced3dd;
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
        color: #a634ef;
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
      color: #bb4cf1;
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
    padding: 30px 30px 26px 30px;
  }
}
</style>
