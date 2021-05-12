<template>
  <el-dialog
    class="business-detail-dialog"
    :visible.sync="isShowDetailDialog"
    width="924px"
    title="商圈等级调整详情"
    @close="closePop"
    :before-close="closePop"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <div class="detail-container">
      <div class="table-content">
        <el-table
          class="smart_table_light"
          :data="tableData"
          stripe
          style="width: 100%"
          height="330"
          border
        >
          <el-table-column
            prop="businessLevelName"
            label="商圈等级"
            width="180"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="levelAiName"
            label="系统建议等级"
            width="180"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="typeName"
            label="反馈原因"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column prop="typeContent" label="详情描述" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="updateUser"
            label="操作人员"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="最新操作时间"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
      </div>
      <div class="page-content">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="currentPage"
          @current-change="handleCurrentChange"
          :total="totalNumber"
        >
        </el-pagination>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import Business_District_API from "@api/business-district/index";
import {mapGetters} from "vuex";
export default {
  name: 'businessDetailDialog',
  props: ['isShowDetailDialog'],
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageNumber: 10,
      totalNumber: 1000
    }
  },
  computed: {
    ...mapGetters('businessPreview',['chooseBusiness'])
  },
  watch: {
    isShowDetailDialog(val) {
      if (val) this.getDetailData(this.currentPage)
    }
  },
  methods: {
    closePop() {
      this.$emit('close-dialog', false)
    },
    // 查询商圈等级调整详情
    getDetailData(currentChange) {
      console.info('查询商圈等级调整详情')
      // adjustReasonDetail
      Business_District_API.adjustReasonDetail({
        businessNo: this.chooseBusiness.toString(),
        currentPage: currentChange,
        size: this.pageNumber
      })
      .then(res => {
        console.log('查询商圈等级调整详情', res)
        if(res.code === '200') {
          this.tableData = res.data.list
          this.totalNumber = res.data.total
        }
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getDetailData(this.currentPage)
    }

  }
}
</script>
<style lang="scss" scoped>
.business-detail-dialog {
  .el-dialog__header {
    background: #f2f2f2;
  }
  .detail-container {
    .table-content {
    }
    .page-content {
      padding-top: 10px;
      text-align: right;
    }
  }
}
</style>
<style lang="css">
.el-tooltip__popper{font-size: 14px; max-width:50% } /*设置显示隐藏部分内容，按50%显示*/
</style>
