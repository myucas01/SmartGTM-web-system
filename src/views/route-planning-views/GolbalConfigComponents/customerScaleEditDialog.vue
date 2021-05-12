<template>
  <el-dialog
    class="customer-scale-edit-dialog"
    title="编辑"
    :visible.sync="visible"
    width="500px"
    :before-close="handleClose">
    <el-form :model="form" :rules="rules" ref="ruleForm" :label-width="formLabelWidth">
      <el-form-item label="门店标签">
        <p>{{storeLabel}}</p>
      </el-form-item>
      <el-form-item label="高产值" prop="yieldUpperLimit">
        <el-input v-model="form.yieldLowerLimit" size="small" disabled></el-input>
        <span class="bettewen">-</span>
        <el-input
          v-model.number="form.yieldUpperLimit"
          size="small"
          type="number"
          min="0"
          placeholder="请输入"
          @input="yieldUpperLimitChanged">
        </el-input>
        <span class="unit">pc</span>
      </el-form-item>
      <el-form-item label="潜力" prop="powerUpperLimit">
        <el-input v-model="form.powerLowerLimit" size="small" disabled></el-input>
        <span class="bettewen">-</span>
        <el-input
          v-model.number="form.powerUpperLimit"
          size="small"
          type="number"
          min="0"
          placeholder="请输入"
          @input="powerUpperLimitChanged">
        </el-input>
        <span class="unit">pc</span>
      </el-form-item>
      <el-form-item label="基础" prop="baseUpperLimit">
        <el-input v-model="form.baseLowerLimit" size="small" disabled></el-input>
        <span class="bettewen">-</span>
        <el-input
          v-model.number="form.baseUpperLimit"
          size="small"
          type="number"
          min="0"
          placeholder="请输入"
          @input="baseUpperLimitChanged">
        </el-input>
        <span class="unit">pc</span>
      </el-form-item>
      <el-form-item label="低表现" prop="showUpperLimit">
        <el-input v-model="form.showLowerLimit" size="small" disabled></el-input>
        <span class="bettewen">-</span>
        <el-input
          v-model.number="form.showUpperLimit"
          size="small"
          type="number"
          min="0"
          placeholder="请输入"
          @input="showUpperLimitChanged">
        </el-input>
        <span class="unit">pc</span>
      </el-form-item>
    </el-form>
    <!-- <el-form :model="formLabels">
      <el-form-item label="门店标签" :label-width="formLabelWidth">
        <p>{{storeLabel}}</p>
      </el-form-item>
      <el-form-item
        v-for="(item, idx) in formLabels"
        :key="idx" 
        :label="item.label"
        :label-width="formLabelWidth">
        <el-input v-model="item.minVal" size="small" disabled></el-input>
        <span class="bettewen">-</span>
        <el-input v-model="item.maxVal" size="small" placeholder="请输入" @change="limitChanged"></el-input>
        <span class="unit">pc</span>
      </el-form-item>
    </el-form> -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleClose('edit')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: '',
  props: {
    visible: {
      default: false,
    },
    rows: {},
  },
  data() {
    const showUpperLimitValidate = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请输入低表现最大值'));
      } else if ((value < 0 || value > 99999999) || (!Number.isInteger(value))) {
        callback(new Error('数值为0-99999999的整数'));
      // } else if (value - this.form.baseUpperLimit > 0) {
        // callback(new Error('低表现最大值，请重新输入'));
      } else {
        callback();
      }
    };
    const baseUpperLimitValidate = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请输入基础最大值'));
      } else if ((value < 0 || value > 99999999) || (!Number.isInteger(value))) {
        callback(new Error('数值为0-99999999的整数'));
      // } else if (value - this.form.powerUpperLimit > 0) {
        // callback(new Error('基础最大值，请重新输入'));
      // } else if (value - this.form.showUpperLimit < 0) {
        // callback(new Error('基础最大值，请重新输入'));
      }  else {
        callback();
      }
    };
    const powerUpperLimitValidate = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请输入潜力最大值'));
      } else if ((value < 0 || value > 99999999) || (!Number.isInteger(value))) {
        callback(new Error('数值为0-99999999的整数'));
      // } else if (value - this.form.yieldUpperLimit > 0) {
        // callback(new Error('潜力最大值，请重新输入'));
      // } else if (value - this.form.baseUpperLimit < 0) {
        // callback(new Error('潜力最大值，请重新输入'));
      } else {
        callback();
      }
    };
    const yieldUpperLimitValidate = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请输入高产值最大值'));
      } else if ((value < 0 || value > 99999999) || (!Number.isInteger(value))) {
        callback(new Error('数值为0-99999999的整数'));
      // } else if (value - this.form.powerUpperLimit < 0) {
        // callback(new Error('高产值最大值，请重新输入'));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      storeLabel: '',
      form: {
        yieldLowerLimit: '',
        yieldUpperLimit: '',
        powerLowerLimit: '',
        powerUpperLimit: '',
        baseLowerLimit: '',
        baseUpperLimit: '',
        showLowerLimit: 0,
        showUpperLimit: '',
      },
      formLabelWidth: '120px',
      rules: {
        showUpperLimit: [
          // { required: true, message: '请输入低表现最大值', trigger: 'blur' },
          { validator: showUpperLimitValidate, trigger: 'change' },
          { validator: showUpperLimitValidate, trigger: 'blur' },
        ],
        baseUpperLimit: [
          // { required: true, message: '请输入基础最大值', trigger: 'blur' },
          { validator: baseUpperLimitValidate, trigger: 'change' },
          { validator: baseUpperLimitValidate, trigger: 'blur' },
        ],
        powerUpperLimit: [
          // { required: true, message: '请输入潜力最大值', trigger: 'blur' },
          { validator: powerUpperLimitValidate, trigger: 'change' },
          { validator: powerUpperLimitValidate, trigger: 'blur' },
        ],
        yieldUpperLimit: [
          // { required: true, message: '请输入高产值最大值', trigger: 'blur' },
          { validator: yieldUpperLimitValidate, trigger: 'change' },
          { validator: yieldUpperLimitValidate, trigger: 'blur' },
        ],
      },
      formLabels: [
        {
          label: '高产值',
          minVal: '',
          maxVal: '',
        },
        {
          label: '潜力',
          minVal: '',
          maxVal: '',
        },
        {
          label: '基础',
          minVal: '',
          maxVal: '',
        },
        {
          label: '低表现',
          minVal: '',
          maxVal: '',
        },
      ],
    };
  },
  computed: {
    // 比较数据大小验证
    validateLimit() {
      const comp1 = this.form.showUpperLimit - this.form.baseUpperLimit <= 0;
      const comp2 = this.form.baseUpperLimit - this.form.powerUpperLimit <= 0;
      const comp3 = this.form.powerUpperLimit - this.form.yieldUpperLimit <= 0;
      return comp1 && comp2 && comp3;
    },
  },
  methods: {
    handleClose(tag) {
      let rowInfo = {};
      if (tag === 'edit') {
        // validate
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (this.validateLimit) {
              // 确认修改
              rowInfo = JSON.parse(JSON.stringify(this.rows));
              rowInfo.data[0].minVal = this.form.yieldLowerLimit;
              rowInfo.data[0].maxVal = this.form.yieldUpperLimit;
              rowInfo.data[1].minVal = this.form.powerLowerLimit;
              rowInfo.data[1].maxVal = this.form.powerUpperLimit;
              rowInfo.data[2].minVal = this.form.baseLowerLimit;
              rowInfo.data[2].maxVal = this.form.baseUpperLimit;
              rowInfo.data[3].minVal = this.form.showLowerLimit;
              rowInfo.data[3].maxVal = this.form.showUpperLimit;
              this.$emit('handleClose', rowInfo);
              this.resetForm();
            } else {
              this.$message({
                message: '同一行的右边最大值需 大于等于 左边最小值',
                type: 'warning',
                showClose: true,
              });
            }
          }
        });
      } else {
        this.$emit('handleClose', rowInfo);
        this.resetForm();
      }
    },
    yieldUpperLimitChanged() {
      // this.$refs.ruleForm.validate(() => {});
    },
    showUpperLimitChanged(val) {
      this.form.baseLowerLimit = val;
      // this.$refs.ruleForm.validate(() => {});
    },
    baseUpperLimitChanged(val) {
      this.form.powerLowerLimit = val;
      // this.$refs.ruleForm.validate(() => {});
    },
    powerUpperLimitChanged(val) {
      this.form.yieldLowerLimit = val;
      // this.$refs.ruleForm.validate(() => {});
    },
    limitChanged(val) {
      console.log(val);
    },
    resetForm() {
      const keys = Object.keys(this.form);
      keys.forEach(key => {
        this.form[key] = '';
      });
      this.$refs.ruleForm.clearValidate();
    },
  },
  watch: {
    visible(val) {
      if (val) {
        // rows信息填入form表单中
        this.storeLabel = this.rows.label;
        // console.log('rows', this.rows);
        this.form.yieldLowerLimit = this.rows.data[0].minVal;
        this.form.yieldUpperLimit = this.rows.data[0].maxVal;
        this.form.powerLowerLimit = this.rows.data[1].minVal;
        this.form.powerUpperLimit = this.rows.data[1].maxVal;
        this.form.baseLowerLimit = this.rows.data[2].minVal;
        this.form.baseUpperLimit = this.rows.data[2].maxVal;
        this.form.showLowerLimit = this.rows.data[3].minVal || 0;
        this.form.showUpperLimit = this.rows.data[3].maxVal;
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate();
      });
    },
  },
}
</script>

<style lang="scss">
.customer-scale-edit-dialog {
  .el-dialog__body {
    .el-form {
      .el-form-item {
        margin-bottom: 15px;
        .el-form-item__content {
          display: flex;
          .el-input {
            flex-basis: 100px;
          }
          .bettewen {
            flex-basis: 50px;
            text-align: center;
          }
          .unit {
            flex-basis: 50px;
            margin-left: 20px;
            color: #cecece;
          }
        }
      }
    }
  }
}
</style>