<template>
  <div class="inforbox">
    <el-table
      :data="tableData"
      v-loading="tabloading"
      height="100%"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :header-cell-style="headerStyle"
      :cell-style="cellStyle"
      :tree-props="{ children: 'children' }"
    >
      <el-table-column label="组织架构" width="180">
        <template slot-scope="scope">
          <p class="onebox">
            {{ scope.row.name ? scope.row.name : '0' }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="营业部完成情况" width="180">
        <template slot-scope="scope">
          <p class="Countbox">
            {{ scope.row.deptFinshCount ? scope.row.deptFinshCount : '0' }}
          </p>
          /{{ scope.row.deptCount ? scope.row.deptCount : '0' }}
        </template>
      </el-table-column>
      <el-table-column prop="busCount" label="商圈数量"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.orgType != '0'"
            @click.native.prevent="SeetingDetail(scope.row.id)"
            type="text"
            size="small"
            class="textbutton"
            v-auth="'business:layout:setinfo:set'"
          >
            商圈设置
          </el-button>
          <el-button
            @click.native.prevent="DetailDelete(scope.row.id)"
            type="text"
            size="small"
            class="textbutton"
            v-auth="'business:layout:setinfo:reset'"
          >
            商圈重置
          </el-button>
          <el-button
            @click.native.prevent="PreviewDetail(scope.row)"
            type="text"
            size="small"
            class="textbutton"
            v-auth="'business:layout:setinfo:preview'"
          >
            商圈预览
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import BUSINESS_DISTRICT_API from '@api/business_district_api.js'
export default {
  name: 'SeetingDetails',
  props: ['proId', 'proNumber', 'proYear', 'proQuarter', 'proName'],
  data() {
    return {
      tableData: [],
      tabloading: true
    }
  },
  created() {},
  mounted() {
    this.getProjectDetail()
  },
  methods: {
    headerStyle() {
      let style
      style = {
        height: '38px',
        background: '#F8F8F9',
        padding: '3px'
      }
      return style
    },
    cellStyle(row) {
      let style
      if (row.rowIndex % 2 > 0) {
        style = {
          height: '38px',
          background: '#FCF7FF',
          padding: '5px'
        }
      } else {
        style = {
          height: '38px',
          background: '#FFFFFF',
          padding: '5px'
        }
      }
      return style
    },
    async getProjectDetail() {
      // ******获取商圈设置明细
      await BUSINESS_DISTRICT_API.get_project_detail({
        proId: this.proId,
        isLoading: false
      })
        .then(async res => {
          if (res.code === '200') {
            this.tableData = await res.data
            this.tabloading = false
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    async DetailDelete(id) {
      // ******商圈重置
      await BUSINESS_DISTRICT_API.get_bcc_reset({
        orgId: id,
        proId: this.proId
      })
        .then(async res => {
          this.$message({ message: res.message, type: 'success' })
          this.getProjectDetail()
        })
        .catch(err => {
          console.log(err)
        })
    },
    SeetingDetail(id) {
      // 跳转到商圈设置 proId：方案id orgId:组织id
      this.$router.push({
        path: `create/${this.proNumber}`,
        query: {
          proId: this.proId,
          orgId: id,
          proYear: this.proYear,
          proQuarter: this.proQuarter,
          proName: this.proName
        }
      })
    },
    PreviewDetail(data) {
      // 跳转到商圈预览 proId：方案id orgId:组织id orgRank:当前组织所在层级
      this.$router.push({
        path: '/business-district/business-preview',
        query: {
          proNumber: this.proNumber,
          proId: this.proId,
          orgId: data.id,
          orgType: data.orgType,
          orgName: data.name,
          proYear: this.proYear,
          proQuarter: this.proQuarter,
          proName: this.proName
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-table__expand-icon {
  background-color: #930cea !important;
  border-radius: 3px;
  margin-right: 8px !important;
  color: #ffffff;
  .el-icon-arrow-right:before {
    content: '\e791';
  }
}
.inforbox {
  padding: 30px;
  height: calc(100vh - 350px);
  display: block;
  background-color: #ffffff;
  margin-bottom: 15px;
  ::-webkit-scrollbar-thumb {
    background-color: #dddee1 !important;
  }
  ::-webkit-scrollbar-track {
    background-color: #f8f8f9 !important;
    border: 1px solid #e0e6ed;
    box-shadow: none;
    border-radius: 0;
  }
  .onebox {
    text-decoration: underline;
    display: inline-block;
  }
  .Countbox {
    color: #fa6400;
    display: inline-block;
  }
  .cellbox {
    display: flex;
    align-items: center;
    .iconbox {
      height: 14px;
      width: 14px;
      border-radius: 3px;
      background-color: #930cea;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin: 5px;
    }
  }
  .textbutton {
    margin: 0 15px;
  }
}
</style>
