<template>
  <el-dialog class="sale-level-edit-dialog"
   :title="title"
   :visible.sync="visible"
   width="500px"
   :before-close="handleClose">
    <el-form :model="form" :rules="rules" ref="ruleForm" :label-width="formLabelWidth">
      <el-form-item label="门店类型" prop="">
        <el-cascader
          v-model="typeValues"
          :options="typeOptions"
          :props="{
            multiple: true,
            emitPath: false,
            label: 'customerName',
            value: 'customerId'
          }"
          collapse-tags
          placeholder="请选择"
          size="small"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="A" prop="">
        <el-input v-model="form.minA" size="small" disabled></el-input>
        <span class="unit">pc</span>
        <span class="unit2">以上</span>
      </el-form-item>
      <el-form-item label="B" prop="maxB">
        <el-input v-model="form.minB" size="small" disabled v-show="!addButtonShow"></el-input>
        <span class="bettewen" v-show="!addButtonShow">-</span>
        <el-input
          v-model.number="form.maxB"
          size="small"
          type="number"
          min="0"
          placeholder="请输入"
          @input="maxBLimitChanged">
        </el-input>
        <span class="unit">pc</span>
        <span class="unit2" v-show="addButtonShow">及以下</span>
      </el-form-item>
      <el-form-item label="" prop="" v-show="addButtonShow">
        <div class="add-type">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="addNewType">
            添加
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="其他" prop="maxOther" v-show="!addButtonShow">
        <el-input
          v-model.number="form.maxOther"
          size="small"
          type="number"
          min="0"
          placeholder="请输入"
           @input="minOtherLimitChanged">
        </el-input>
        <span class="unit">pc</span>
        <span class="unit2">及以下</span>
        <span class="del" @click="delNewType">删除</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleClose('edit')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ROUTE_PLANNING_API from '@api/route/index';

export default {
  name: 'saleLevelEditDialg',
  props: {
    title: {
      default: '新增',
      type: String,
    },
    visible: {
      default: false,
    },
    rows: {},
  },
  data() {
    const showUpperLimitValidate = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请输入B标签最大值'));
      } else if ((value < 0 || value > 99999999) || (!Number.isInteger(value))) {
        callback(new Error('数值为0-99999999的整数'));
      } else {
        callback();
      }
    };
    const showOtherLimitValidate = (rule, value, callback) => {
      if ((value < 0 || value > 99999999)) {
        callback(new Error('数值为0-99999999的整数'));
      } else {
        callback();
      }
    };
    return {
      formLabelWidth: '120px',
      typeValues: [],
      rules: {
        maxB: [
          { validator: showUpperLimitValidate, trigger: 'change' },
          { validator: showUpperLimitValidate, trigger: 'blur' },
        ],
        maxOther: [
          { validator: showOtherLimitValidate, trigger: 'change' },
          { validator: showOtherLimitValidate, trigger: 'blur' },
        ],
      },
      form: {
        minA: '',
        maxB: '',
        minB: '',
        maxOther: '',
      },
      addButtonShow: true,
      typeOptions: [],
    };
  },
  computed: {
    orgId() {
      return this.$route.query.orgId;
      // return '7293338343793677273';
    },
  },
  created() {
    this.getCustomerTypes();
  },
  methods: {
    getCustomerTypes() {
      ROUTE_PLANNING_API.get_customer_type_list('').then((res) => {
        const { code, data } = res;
        if (code === '200') {
          this.typeOptions = data || [];
        } else {
          this.typeOptions = [];
        }
      }).catch((err) => {
        console.log(err);
        this.typeOptions = [];
      });
    },
    handleClose(tag) {
      let rowInfo = {
        customerIds: this.typeValues,
        orgId: this.orgId,
        salesLevel: [
          {
            configBig: 'A',
            salesMax: '',
            salesMin: this.form.minA,
          },
          {
            configBig: 'B',
            salesMax: this.form.maxB,
            salesMin: this.addButtonShow ? 0 : this.form.minB,
          },
        ],
      };
      if (tag === 'edit') {
        // validate
        if (!this.typeValues.length) {
          this.$message({
            message: '请选择门店类型',
            type: 'warning',
            showClose: true,
          });
          return;
        }
        // 如果新增 其他 标签
        if (!this.addButtonShow) {
          if (this.form.maxOther === '') {
            this.$message({
              message: '请输入其他标签值',
              type: 'warning',
              showClose: true,
            });
            return;
          }
          if (this.form.maxOther >= this.form.maxB) {
            this.$message({
              message: '其他标签输入值需小于B标签输入值',
              type: 'warning',
              showClose: true,
            });
            return;
          }
          rowInfo.salesLevel.push({
            configBig: '其他',
            salesMax: this.form.maxOther,
            salesMin: 0,
          });
        }
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            ROUTE_PLANNING_API.create_sale_level(rowInfo).then((res) => {
              const { code } = res;
              if (code === '200') {
                this.$message({
                  message: '保存成功',
                  type: 'success',
                  showClose: true,
                });
              } else {
                this.$message({
                  message: '保存失败',
                  type: 'error',
                  showClose: true,
                });
              }
              this.$emit('handleClose', 'refresh');
              this.resetForm();
            }).catch((err) => {
              console.log(err);
            });
          }
        });
      } else {
        this.$emit('handleClose');
        this.resetForm();
      }
    },
    addNewType() {
      this.addButtonShow = false;
    },
    delNewType() {
      this.form.maxOther = '';
      this.form.minB = '';
      this.addButtonShow = true;
    },
    maxBLimitChanged(val) {
      this.form.minA = Number(val);
    },
    minOtherLimitChanged(val) {
      this.form.minB = Number(val);
    },
    resetForm() {
      const keys = Object.keys(this.form);
      keys.forEach(key => {
        this.form[key] = '';
      });
      this.typeValues = [];
      this.$refs.ruleForm.clearValidate();
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.addButtonShow = true;
        this.typeValues = [];
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate();
        });
        if (this.title === '编辑') {
          const { customerId, salesLevel } = this.rows;
          this.typeValues.push(customerId);
          this.form.minA = salesLevel[0].salesMin;
          this.form.maxB = salesLevel[1].salesMax;
          this.form.minB = salesLevel[1].salesMin;
          if (salesLevel.length > 2) {
            this.addButtonShow = false;
            this.form.maxOther = salesLevel[2].salesMax;
          }
        }
      }
    },
  }
}
</script>

<style lang="scss">
.sale-level-edit-dialog {
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
            flex-basis: 40px;
            margin-left: 20px;
            color: #cecece;
          }
          .unit2 {
            flex-basis: 50px;
            margin-right: 20px;
            color: #cecece;
          }
          .del {
            cursor: pointer;
            color: red;
          }
          .add-type {
            .el-button {
              background-color: #fff;
              width: 210px;
              border: 1px dashed #ccc;
              color: #cecece;
            }
          }
        }
      }
    }
  }
}
</style>