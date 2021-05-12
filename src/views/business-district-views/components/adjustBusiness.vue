<!--商圈调整-->
<template>
  <el-dialog
      class="adjust_wrap"
      :visible.sync="isShowDetailDialog"
      width="466px"
      title="商圈调整"
      @close="closePop"
      :before-close="closePop"
      :append-to-body="true"
      :close-on-click-modal="false"
  >
    <div class="detail-container">
      <div class="adjust-item">
        <div class="adjust-label">商圈调整原因</div>
        <el-select v-model="value" placeholder="请选择" @change="handleChange">
          <el-option
              v-for="item in options"
              :key="item.typeNo"
              :label="item.typeName"
              :value="item.typeNo">
          </el-option>
        </el-select>
      </div>
      <div class="adjust-item">
        <div class="adjust-label">详情描述</div>
        <el-input
            autosize
            type="textarea"
            placeholder="请输入内容"
            maxlength="200"
            show-word-limit
            v-model="textarea">
        </el-input>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="closePop">取 消</el-button>
    <el-button type="primary" @click="confirmHandle">确定生成</el-button>
  </span>
  </el-dialog>
</template>

<script>
import Business_District_API from "@api/business-district/index";
import {mapGetters} from "vuex";

export default {
  name: "adjustBusiness",
  data() {
    return {
      isShowDetailDialog: false,
      options: [],
      optionsMap: new Map(),
      value: '',
      textarea: '',
      chooseName: ''
    }
  },
  computed:{
    ...mapGetters('businessPreview',['operationCode'])
  },
  mounted() {
    this.getAdjustReason()
  },
  methods: {
    closePop() {
     this.isShowDetailDialog = false
      this.resetParams()
    },
    handleChange(val) {
      if(this.optionsMap.size && this.optionsMap.has(val)) {
        this.chooseName = this.optionsMap.get(val)
      }
    },
    getAdjustReason() {
      Business_District_API.levelAdjustReason()
      .then(res => {
        if(res.code === '200') {
          this.options = res.data
          this.optionsMap.clear()
          if(this.options && this.options.length > 0) {
            for(let item of  this.options) {
              this.optionsMap.set(item.typeNo, item.typeName)
            }
          }
        }
      })
    },
    // 确认操作
    confirmHandle() {
      if(!this.value || !this.textarea) {
        if(!this.value){
          this.$message({
            message: '请添加商圈调整原因！',
            type: 'warning'
          })
          return;
        }
        if(!this.textarea){
          this.$message({
            message: '请添加商圈调整备注！',
            type: 'warning'
          })
        }
        return
      }
      if(this.operationCode === 'edit') {
        this.$parent.updateBusinessDistrict({
          typeNo: this.value,
          typeName: this.chooseName,
          typeContent: this.textarea
        })
      } else {
        this.$parent.addBusinessDistrict({
          typeNo: this.value,
          typeName: this.chooseName,
          typeContent: this.textarea
        })
      }

      this.resetParams()
    },
    // 重置
    resetParams() {
      this.value = ''
      this.chooseName = ''
      this.textarea = ''
      this.isShowDetailDialog = false
    }
  }
}
</script>

<style scoped lang="less">
.adjust_wrap {
  /deep/ .el-dialog__footer{
    border-top: 1px solid #CED3DD;
  }
 /deep/ .el-button{
   font-size: 12px;
   font-weight: 500;
 }
 /deep/ .el-dialog__body{
   padding: 15px 10px;
 }
  .adjust-item {
    display: flex;
    margin-bottom: 10px;
    align-items: center;
    .adjust-label {
      width: 80px;
      text-align: right;
      font-size: 12px;
      font-weight: 600;
      color: #333333;
      margin-right: 10px;
      &:before {
        content: '*';
        color: #FA6400;
        position: relative;
        top: 2px;
      }
    }
    /deep/ .el-select{
      width: 340px;
      height: 38px;
    }
    /deep/ .el-textarea{
      width: 340px;
    }
    /deep/ .el-input--suffix{
      height: 38px;
    }
  }

}
</style>