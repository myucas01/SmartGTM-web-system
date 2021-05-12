<template>
  <!-- 客户规模 -->
  <div class="customer-scale-wrapper">
    <div class="title-block">
      <span class="title">{{ name }}</span>
      <div class="sub-title" v-show="!noneData">
        <span class="date">更新时间：{{ date }}</span>
        <span
          class="update"
          @click="handleUpdate"
          >不合适？点此去修改</span
        >
      </div>
    </div>
    <div class="content-block" v-if="noneData">
      <div
        class="none-data"
        @click="handleUpdate"
      >
        暂无配置，点此选择配置
      </div>
    </div>
    <div class="table-block" v-else>
      <el-table
        class="global-configuration-table"
        :data="tableData"
        border
        :max-height="tableHeight"
        style="width: 100%"
        :span-method="objectSpanMethod"
      >
        <el-table-column label="门店类型" prop="customerName" align="center">
        </el-table-column>
        <el-table-column label="门店标签" prop="configBig" align="center">
        </el-table-column>
        <el-table-column label="销量段（pc）" prop="" align="center">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.configBig === 'A'">
                {{ scope.row.salesMin }}+
              </span>
              <span v-else-if="scope.row.configBig === 'B'">
                {{ scope.row.salesMin }}-{{ scope.row.salesMax }}
              </span>
              <span v-else-if="scope.row.configBig === '其他'">
                {{ scope.row.salesMin }}-{{ scope.row.salesMax }}
              </span>
              <span v-else>-</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import ROUTE_PLANNING_API from '@api/route/index'

export default {
  name: 'customerScaleWrapper',
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
      date: '-',
      tableData: [],
      tableHeight: 300,
    }
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
        path: 'company-scale-edit',
        query: {
          orgName: this.name,
          orgId: this.id,
          isEdit: true,
          isReturn: true, // 从此处跳转到编辑页时，编辑完成需返回
        }
      })
    },
    getTableData() {
      // const params = {
      //   orgId: this.id,
      //   prePlanNo: '',
      // }
      ROUTE_PLANNING_API.get_sale_level_list(this.id)
        .then(res => {
          const { code, data } = res
          if (code === '200') {
            this.date = data.time || '-'
            if (data && data.salesLevel && data.salesLevel.length) {
              let list = []
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
                      ...cell
                    })
                  })
                }
              })
              this.tableData = list
              this.noneData = false
            } else {
              this.tableData = []
              this.noneData = true
            }
          } else {
            this.tableData = []
            this.noneData = true
          }
          this.$emit('handleConfig', !this.noneData)
        })
        .catch(err => {
          console.log(err)
          this.tableData = []
          this.noneData = true
        })
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
    }
  },
  watch: {
    id() {
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.customer-scale-wrapper {
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
