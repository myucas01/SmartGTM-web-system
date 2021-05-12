<template>
  <el-dialog
    class="work-standards-edit-dialog"
    :title="isEdit ? '编辑':'新增'"
    :visible.sync="visible"
    width="700px"
    :before-close="handleClose">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-form-item label="岗位" prop="jobType" :label-width="formLabelWidth">
        <el-select
          class="long-input"
          v-model="form.jobType"
          placeholder="请选择"
          value-key="typeCode"
          filterable
          size="small">
          <el-option
            v-for="item in stationOptions"
            :key="item.typeCode"
            :label="item.typeName"
            :value="item"
            :disabled="disableOptions.includes(item.typeCode)">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务点数" :label-width="formLabelWidth">
        <el-col :span="7">
          <el-form-item prop="ownPointMin">
            <el-input
              class="short-input"
              v-model.number="form.ownPointMin"
              size="small"
              placeholder="请输入"
              type="number"
              min="0">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <span class="bettewen">-</span>
        </el-col>
        <el-col :span="7">
          <el-form-item prop="ownPointMax">
            <el-input
              class="short-input"
              v-model.number="form.ownPointMax"
              size="small"
              placeholder="请输入"
              type="number"
              min="0">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <span class="unit">点/人</span>
        </el-col>
      </el-form-item>
      <el-form-item label="工作日天数" prop="day" :label-width="formLabelWidth">
        <el-input
          class="long-input"
          v-model.number="form.day"
          size="small"
          placeholder="请输入"
          type="number"
          min="0">
        </el-input>
        <span style="margin-left: 20px;" class="unit">天/周期</span>
      </el-form-item>
      <el-form-item label="人均拜访日参考值" :label-width="formLabelWidth">
        <el-col :span="7">
          <el-form-item prop="ownVisitMin">
            <el-input
              class="short-input"
              v-model.number="form.ownVisitMin"
              size="small"
              placeholder="请输入"
              type="number"
              min="0">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <span class="bettewen">-</span>
        </el-col>
        <el-col :span="7">
          <el-form-item prop="ownVisitMax">
            <el-input
              class="short-input"
              v-model.number="form.ownVisitMax"
              size="small"
              placeholder="请输入"
              type="number"
              min="0">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <span class="unit">点/天</span>
        </el-col>
      </el-form-item>
      <el-form-item label="人均工作时长参考值" :label-width="formLabelWidth">
        <el-col :span="7">
          <el-form-item prop="ownJobMin">
            <el-input
              class="short-input"
              v-model.number="form.ownJobMin"
              size="small"
              placeholder="请输入"
              type="number"
              min="0">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <span class="bettewen">-</span>
        </el-col>
        <el-col :span="7">
          <el-form-item prop="ownJobMax">
            <el-input
              class="short-input"
              v-model.number="form.ownJobMax"
              size="small"
              placeholder="请输入"
              type="number"
              min="0">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <span class="unit">小时/天</span>
        </el-col>
      </el-form-item>
      <div class="type-wrap">
        <div class="type-left">
          <div class="label">规划权重</div>
          <div class="sub-label">(权重之和为100%)</div>
          <span class="weight-btn" @click="getDefaultWeight">获取权重值</span>
        </div>
        <div class="type-right">
          <!-- <div class="type-item">
            <div class="item-label switch-btn">
              <span class="item-switch">
                销量
              </span>
              <span
                class="item-switch"
                :class="{'active': form.weightsType === '1'}"
                @click="switchChanged('1')">
                销额
              </span>
              <span
                class="item-switch"
                :class="{'active': form.weightsType === '2'}"
                @click="switchChanged('2')">
                销量
              </span>
            </div>
            <el-form-item prop="amountPercentage">
              <el-input
                class="short-input"
                v-model.number="form.amountPercentage"
                size="small"
                placeholder="请输入"
                type="number"
                min="0">
              </el-input>
            </el-form-item>
            <span class="unit">%</span>
          </div>
          <div class="type-item">
            <div class="item-label">售点数</div>
            <el-form-item prop="pointsSold">
              <el-input
                class="short-input"
                v-model.number="form.pointsSold"
                size="small"
                placeholder="请输入"
                type="number"
                min="0">
              </el-input>
            </el-form-item>
            <span class="unit">%</span>
          </div>
          <div class="type-item">
            <div class="item-label">店内时长</div>
            <el-form-item prop="shopTime">
              <el-input
                class="short-input"
                v-model.number="form.shopTime"
                size="small"
                placeholder="请输入"
                type="number"
                min="0">
              </el-input>
            </el-form-item>
            <span class="unit">%</span>
          </div> -->
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleClose('refresh')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ROUTE_PLANNING_API from '@api/route/index';

export default {
  name: 'serviceStandardsEditDialog',
  props: {
    visible: {
      default: false,
    },
    isEdit: {
      default: false, // 编辑/新增
    },
    row: {},
    disableOptions: {
      default: [], // 岗位不可选的项-列表中已有的
    },
  },
  data() {
    const jobTypeValidate = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请选择岗位'));
      } else {
        callback();
      }
    };
    const dayValidate = (rule, value, callback) => {
      // console.log(999, !Number.isInteger(value), (value | 0) === value);
      if (value === '' || value === null) {
        callback(new Error('请输入工作日天数'));
      } else if ((value < 0 || value > 7) || (!Number.isInteger(value))) {
        callback(new Error('请输0-7的整数'));
      } else {
        callback();
      }
    };
    const ownPointMinValidate = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请输入人员点数'));
      } else if ((value < 0 || value > 999) || (!Number.isInteger(value))) {
        callback(new Error('请输0-999的整数'));
      } else {
        callback();
      }
    };
    const ownVisitMinValidate = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请输入参考值'));
      } else if ((value < 0 || value > 99) || (!Number.isInteger(value))) {
        callback(new Error('请输0-99的整数'));
      } else {
        callback();
      }
    };
    const ownJobMinValidate = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请输入参考值'));
      } else if ((value < 0 || value > 24) || (!Number.isInteger(value))) {
        callback(new Error('请输0-24的整数'));
      } else {
        callback();
      }
    };
    // const amountPercentageValidate = (rule, value, callback) => {
    //   if (value === '' || value === null) {
    //     callback(new Error('请输入参考值'));
    //   } else if ((value < 0 || value > 100) || (!Number.isInteger(value))) {
    //     callback(new Error('请输0-100的整数'));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      stationOptions: [],
      formLabelWidth: '140px',
      form: {
        jobType: '',
        ownPointMin: '',
        ownPointMax: '',
        day: '',
        ownVisitMin: '',
        ownVisitMax: '',
        ownJobMin: '',
        ownJobMax: '',
        weightsType: '2', // 规划权重类型 '1'-销额  '2'-销量
        // amountPercentage: '',
        // pointsSold: '',
        // shopTime: '',
      },
      rules: {
        jobType: [
          // { required: true, message: '请选择岗位', trigger: 'change' },
          { validator: jobTypeValidate, trigger: 'change' },
        ],
        ownPointMin: [
          // { required: true, message: '请输入人员点数', trigger: 'change' },
          { validator: ownPointMinValidate, trigger: 'change' },
        ],
        ownPointMax: [
          // { required: true, message: '请输入人员点数', trigger: 'change' },
          { validator:ownPointMinValidate, trigger: 'change' },
        ],
        day: [
          // { required: true, message: '请输入工作日天数', trigger: 'change' },
          { validator: dayValidate, trigger: 'change' },
        ],
        ownVisitMin: [
          // { required: true, message: '请输入参考值', trigger: 'change' },
          { validator: ownVisitMinValidate, trigger: 'change' },
        ],
        ownVisitMax: [
          // { required: true, message: '请输入参考值', trigger: 'change' },
          { validator: ownVisitMinValidate, trigger: 'change' },
        ],
        ownJobMin: [
          // { required: true, message: '请输入参考值', trigger: 'change' },
          { validator: ownJobMinValidate, trigger: 'change' },
        ],
        ownJobMax: [
          // { required: true, message: '请输入参考值', trigger: 'change' },
          { validator: ownJobMinValidate, trigger: 'change' },
        ],
        // amountPercentage: [
        //   // { required: true, message: '请输入销额/销量', trigger: 'change' },
        //   { validator: amountPercentageValidate, trigger: 'change' },
        // ],
        // pointsSold: [
        //   // { required: true, message: '请输入售点数', trigger: 'change' },
        //   { validator: amountPercentageValidate, trigger: 'change' },
        // ],
        // shopTime: [
        //   // { required: true, message: '请输入店内时长', trigger: 'change' },
        //   { validator: amountPercentageValidate, trigger: 'change' },
        // ],
      },
    };
  },
  computed: {
    orgId() {
      return this.$route.query.orgId;
    },
  },
  mounted() {
    this.getStationOptions()
  },
  methods: {
    getStationOptions(){
      ROUTE_PLANNING_API.get_service_position_list('sales_base').then((res) => {
        const { code, data } = res;
        if (code === '200') {
          this.stationOptions=data
        } else {
          this.stationOptions = [];
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    handleClose(tag) {
      if (tag === 'refresh') {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            // 权重之和判断
            // const weightVal = this.form.amountPercentage +
            //                   this.form.pointsSold +
            //                   this.form.shopTime;
            // 人员点数数值比较
            // 人均拜访日参考值比较
            // 人均工作时长参考值比较
            if (this.form.ownPointMin - this.form.ownPointMax > 0) {
              this.$message({
                message: '服务点数 右边最大值 大于等于 左边最小值',
                type: 'warning',
                showClose: true,
              });
            } else if (this.form.ownVisitMin - this.form.ownVisitMax > 0) {
              this.$message({
                message: '人均拜访日参考值 右边最大值 大于等于 左边最小值',
                type: 'warning',
                showClose: true,
              });
            } else if (this.form.ownJobMin - this.form.ownJobMax > 0) {
              this.$message({
                message: '人均工作时长参考值 右边最大值 大于等于 左边最小值',
                type: 'warning',
                showClose: true,
              });
            } else {
              // 确认新增/编辑 调接口
              const params = {
                orgId: this.row.orgId || this.orgId,
                operatorName: this.row.operatorName || '',
                operatorId: this.row.operatorId || '',
                id: this.row.id || '',
                salesTypeCode:this.form.jobType.typeCode,
                salesTypeName:this.form.jobType.typeName,
                ...this.form,
              };
              ROUTE_PLANNING_API.post_work_standards_update(params).then((res) => {
                const { code } = res;
                if (code === '200') {
                  this.$emit('handleClose', 'refresh');
                  this.resetForm();
                }
              }).catch((err) => {
                console.log(err);
              });
            }
          }
        });
      } else {
        this.$emit('handleClose');
        this.resetForm();
      }
    },
    resetForm() {
      const keys = Object.keys(this.form);
      keys.forEach(key => {
        this.form[key] = '';
      });
      setTimeout(() => {
        this.$refs.ruleForm.clearValidate();  
      }, 300);
    },
    switchChanged(val) {
      this.form.weightsType = val;
    },
    getDefaultWeight() {
      this.form.amountPercentage = 20;
      this.form.pointsSold = 50;
      this.form.shopTime = 30;
    },
  },
  watch: {
    visible(val) {
      if (val && this.isEdit) {
        // rowInfo数据放入弹框相应位置
        const rows = JSON.parse(JSON.stringify(this.row));
        const keys = Object.keys(this.form);
        keys.forEach(key => {
          this.form[key] = rows[key];
        });
      }
      if (val && (!this.isEdit)) {
        this.form.weightsType = '2'; // 新增
      }
    },
  },
}
</script>

<style lang="scss">
.work-standards-edit-dialog {
  .el-dialog__body {
    padding: 20px 10px 30px;
    .el-form {
      .el-form-item {
        margin-bottom: 15px;
        padding: 0 70px;
        .el-form-item__label {
          // background-color: #DDDEE1;
          // border-radius: 4px;
          // height: 30px;
          // line-height: 30px;
          // margin-top: 6px;
          // padding: 0;
          // font-size: 12px;
          // text-align: center;
        }
        .el-form-item__content {
          // display: flex;
          .el-input.short-input {
            // flex-basis: 100px;
            width: 100px;
            .el-input__inner {
              font-size: 12px;
            }
          }
          .el-input.long-input, .el-select.long-input {
            // flex-basis: 250px;
            width: 250px;
            .el-input__inner {
              font-size: 12px;
            }
          }
          .bettewen {
            // flex-basis: 50px;
            // text-align: center;
            display: inline-block;
            padding-left: 5px;
          }
          .unit {
            // flex-basis: 50px;
            width: 50px;
            // margin-left: 20px;
            // color: #cecece;
          }
          .el-col {
            .el-form-item {
              padding: 0;
              margin-bottom: 0;
            }
          }
        }
      }
      .type-wrap {
        display: flex;
        height: 150px;
        padding: 0 70px;
        display: none;
        .type-left {
          flex-basis: 128px;
          padding-right: 12px;
          text-align: right;
          .sub-label {
            font-size: 12px;
            height: 30px;
            line-height: 30px;
          }
          .weight-btn {
            display: inline-block;
            width: 80px;
            height: 24px;
            line-height: 24px;
            border: 1px solid #930cea;
            color: #930cea;
            font-size: 12px;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
          }
        }
        .type-right {
          flex-basis: 320px;
          .type-item {
            display: flex;
            height: 40px;
            line-height: 40px;
            margin-bottom: 15px;
            .item-label {
              flex-basis: 140px;
              text-align: right;
              padding-right: 12px;
            }
            .switch-btn {
              .item-switch {
                display: inline-block;
                width: 40px;
                height: 24px;
                line-height: 24px;
                // font-size: 12px;
                // cursor: pointer;
                // text-align: center;
                // border: 1px solid #DCDFE6;
                &:first-child {
                  border-top-left-radius: 4px;
                  border-bottom-left-radius: 4px;
                }
                &:last-child {
                  border-top-right-radius: 4px;
                  border-bottom-right-radius: 4px;
                }
                &.active {
                  border: 1px solid #930cea;
                  color: #930cea;
                }
              }
            }
            .el-form-item {
              flex-basis: 100px;
              margin-bottom: 0;
              padding: 0;
              .el-input.short-input {
                width: 100px;
                .el-input__inner {
                  font-size: 12px;
                }
              }
            }
            // .el-input.short-input {
            //   flex-basis: 100px;
            //   .el-input__inner {
            //     font-size: 12px;
            //   }
            // }
            .unit {
              flex-basis: 30px;
              margin-left: 20px;
            }
          }
        }
      }
    }
  }
  .el-dialog__footer {
    border-top: 1px solid #E0E6ED;
  }
}
</style>
