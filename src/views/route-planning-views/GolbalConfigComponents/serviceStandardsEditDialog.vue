<template>
  <el-dialog
    class="service-standards-edit-dialog"
    :title="isEdit ? '编辑':'新增'"
    :visible.sync="visible"
    width="700px"
    :before-close="handleClose">
    <div class="type-wrap">
      <span class="label">客户分级</span>
      <el-radio-group v-model="fridgeTypeName" size="small" :disabled="isEdit">
        <el-radio-button
          v-for="(item, i) in fridgeTypes"
          :key="i"
          :label="item.name">
        </el-radio-button>
      </el-radio-group>
    </div>
    <div class="type-wrap">
      <span class="label">客户类型</span>
      <!-- <el-select
        v-model="typeValues"
        multiple
        filterable
        placeholder="请选择"
        size="small"
        collapse-tags>
        <el-option
          v-for="item in options"
          :key="item.typeCode"
          :label="item.typeName"
          :value="item.typeCode"
          :disabled="disableOptions.includes(item.typeCode)">
        </el-option>
      </el-select> -->
      <el-cascader v-if="!isEdit"
        :key="isResouceShow"
        v-model="typeValues"
        :options="options"
        :props="{
          multiple: true,
          emitPath: false,
          label: 'customerName',
          value: 'customerId'
        }"
        collapse-tags
        placeholder="请选择"
        size="small"
      />
      <span style="color: #b4b4b4; font-size: 14px;">{{row.desc}}</span>
    </div>
    <el-form class="service-form" :model="form" :rules="rules" ref="ruleForm">
      <template  v-for="(item, idx) in form.list" >
      <el-form-item
          v-show="row.grandfather !==  '二阶' || idx === 0"
          :key="idx"
        :label="item.configSmallName"
        :label-width="formLabelWidth">
        <span class="unit">拜访频次</span>
        <el-form-item
          class="input-item-form"
          :prop="'list[' + idx + '].visitTimes'"
          :rules="[
            { validator: visitTimesValidate, trigger: 'blur'},
            { validator: visitTimesValidate, trigger: 'change'},
          ]">
          <el-input
            v-model.number="item.visitTimes"
            size="small"
            placeholder="请输入"
            type="number"
            min="0">
          </el-input>
        </el-form-item>
        <span class="unit">次/周</span>
        <span class="unit">在店时长</span>
        <el-form-item
          class="input-item-form"
          :prop="'list[' + idx + '].visitDuration'"
          :rules="[
            { validator: visitDurationValidate, trigger: 'blur'},
            { validator: visitDurationValidate, trigger: 'change'},
          ]">
          <el-input
            v-model.number="item.visitDuration"
            size="small"
            placeholder="请输入"
            type="number"
            min="0">
          </el-input>
        </el-form-item>
        <span class="unit">分钟/次</span>
      </el-form-item>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button v-if="!isEdit" type="primary" @click="handleClose('refresh')">确 定</el-button>
      <el-button v-if="isEdit" type="primary" @click="handleEdit('refresh')">确 定</el-button>
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
    inputVal: {
      default: '',
    }, // 配置名称
    templateId: {
      default: '',
    }, // 配置ID
    disableVisitOpts: {
      type: Array,
      default: () => {[]},
    },
  },
  data() {
    return {
      totalOptions: [], // A B 其他对应的三组options
      options: [],
      typeValues: [],
      formLabelWidth: '100px',
      form: {
          list: [
          {
            configSmallName: '0-3组货架',
            configSmall: '010',
            visitTimes: '', // 拜访频率
            visitDuration: '', // 在店时长
          },
          {
            configSmallName: '4-6组货架',
            configSmall: '011',
            visitTimes: '',
            visitDuration: '',
          },
          {
            configSmallName: '7组以上货架',
            configSmall: '012',
            visitTimes: '',
            visitDuration: '',
          },
        ],
      },
      rules: {
      },
      // ky-有无冰箱 或 km-客户分级
      fridgeTypes: [
        {
          name: 'A',
          id: '007',
        },
        {
          name: 'B',
          id: '008',
        },
        {
          name: '其他',
          id: '009',
        },
      ],
      fridgeTypeName: 'A',
      isResouceShow: 0, // 级联选择器动态获取options数据时，防止报错的方法
    };
  },
  computed:{
    serviceType() {
      return Boolean(this.$store.state.routerPlanning.currentServiceType ||
        sessionStorage.getItem('currentServiceType'));
    },
    typeLabels() {
      // let arr = [];
      // if (this.typeValues.length) {
      //   const fitlerArr = this.options.filter((it) => this.typeValues.includes(it.typeCode));
      //   arr = fitlerArr.map(item => item.typeName);
      // }
      // return arr;
      let stark = [];
      let temp = [];
      let labels = [];
      stark = stark.concat(this.options);
      if (stark.length) {
        stark.forEach(item => {
          if (item.children) {
            temp = temp.concat(item.children);
          }
        });
      }
      if (temp.length) {
        temp.forEach(it => {
          if (this.typeValues.includes(it.customerId)) {
            labels.push(it.customerName);
          }
        })
      }
      return labels;
    },
    fridgeTypeId() {
      return this.fridgeTypes.filter(it => it.name === this.fridgeTypeName)[0].id;
    },
    disableOptions() {
      const idx = this.fridgeTypes.map(it => it.name).indexOf(this.fridgeTypeName);
      return this.disableVisitOpts[idx] || [];
    },
  },
  created() {
    // this.getCustomerTypes();
    this.getTotalCustomerType();
  },
  methods: {
    visitTimesValidate: (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请输入拜访频次'));
      } else if ((value < 0 || value > 3) || (!Number.isInteger(value))) {
        callback(new Error('请输0-3的整数'));
      } else {
        callback();
      }
    },
    visitDurationValidate: (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请输入在店时长'));
      } else if ((value < 0 || value > 360) || (!Number.isInteger(value))) {
        callback(new Error('请输0-360的整数'));
      }  else {
        callback();
      }
    },
    getCustomerTypes() {
      // ROUTE_PLANNING_API.get_service_saletaye_list().then((res) => {
      // ROUTE_PLANNING_API.get_service_position_list('customer_type', this.fridgeTypeName).then((res) => {
      ROUTE_PLANNING_API.get_customer_type_list(this.fridgeTypeName).then((res) => {
        const { code, data } = res;
        if (code === '200') {
          this.options = data || [];
        } else {
          this.options = [];
        }
      }).catch((err) => {
        console.log(err);
        this.options = [];
      });
    },
    // 获取所有的客户类型 因为编辑弹框时 客户类型的值和options的值要对应起来
    async getTotalCustomerType() {
      this.totalOptions = [];
      const res1 = await this.getItemCustomerType('A');
      const res2 = await this.getItemCustomerType('B');
      const res3 = await this.getItemCustomerType('其他');
      this.totalOptions.push(res1);
      this.totalOptions.push(res2);
      this.totalOptions.push(res3);
      this.options = this.totalOptions[0]; // init options
    },
    getItemCustomerType(type) {
      return ROUTE_PLANNING_API.get_customer_type_list(type).then(res => {
        const { code, data } = res;
        if (code === '200') {
          return data;
        } else {
          return [];
        }
      });
    },
    handleClose(tag) {
      if (tag === 'refresh') {
        // 确认新增/编辑 调接口
        // --------客户类型名称验证---------
        if (this.typeValues.length === 0) {
          this.$message({
            message: '请选择客户类型',
            type: 'warning',
            showClose: true,
          });
          return;
        }
        // --------拜访频次与在店时长验证---------
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            const params = {
              templateId: this.templateId,
              templateName: this.inputVal,
              storeTypeName: this.typeLabels,
              storeTypeCode: this.typeValues,
              tagInfos: this.form.list,
              // 客户类型ID，编辑时有
              templateDetailId: this.isEdit ? this.row.templateDetailId : '',
              configBig: this.fridgeTypeId,
              configBigName: this.fridgeTypeName,
            };
            ROUTE_PLANNING_API.post_service_standards_update(params).then((res) => {
              const { code, data } = res;
              if (code === '200') {
                this.$message({
                  message: '保存成功',
                  type: 'success',
                  showClose: true,
                  duration: 2000,
                });
                this.$emit('handleClose', data);
              }
              this.resetForm();
            }).catch((err) => {
              console.log(err);
              this.tableData0 = [];
              this.$emit('handleClose');
              this.resetForm();
            });
          }
        });
      } else {
        this.$emit('handleClose');
        this.resetForm();
      }
    },
    resetForm() {
      this.typeValues = [];
      this.form.list.forEach(item => {
        item.visitTimes = '';
        item.visitDuration = '';
      });
      setTimeout(() => {
        this.$refs.ruleForm.clearValidate();
      }, 300);
    },
    currentOptions(val) {
      if (val === 'A') {
        this.options = this.totalOptions[0];
      } else if (val === 'B') {
        this.options = this.totalOptions[1]; 
      } else {
        this.options = this.totalOptions[2]; 
      }
    },
    // 保存编辑
    async handleEdit() {
      console.info(this.row)
      const data = {
        "configBigName": this.row.configBigName,
        "detailId": this.row.templateDetailId,
        "tagInfos":  this.form.list,
        'templateId': this.templateId,
      }
     let result = await ROUTE_PLANNING_API.service_standards_edit(data)
      if( result.code === '200') {
        this.$message({
          message: '保存成功',
          type: 'success',
          showClose: true,
          duration: 2000,
        });
        this.$emit('handleClose', result.data);
      } else {
        this.$emit('handleClose');
        this.resetForm();
      }
    }
  },
  watch: {
    visible(val) {
      this.fridgeTypeName = 'A';
      if (val && this.isEdit) {
        // rowInfo数据放入弹框相应位置
        const {
          data,
          configBigName,
        } = this.row;
        // this.typeValues = storeTypeCode ? storeTypeCode.split(',') : [];
        this.resetForm()
        this.fridgeTypeName = configBigName;
        if (data && data.length) {
          data.forEach((item, i) => {
            if (i < 3) { // 康面只有3组数据
              this.form.list[i].visitTimes = item.visitTimes;
              this.form.list[i].visitDuration = item.visitDuration;
            }
          });
        }
      }
    },
		fridgeTypeName(val) {
      // this.getCustomerTypes()
      this.isResouceShow += 1;
      this.currentOptions(val);
    }
  },
}
</script>

<style lang="scss">
.service-standards-edit-dialog {
  .el-dialog__body {
    .type-wrap {
      height: 50px;
      padding-left: 50px;
      .label {
        font-size: 12px;
        color: #b4b4b4;
        margin-right: 20px;
      }
      .el-input {
        width: 400px;
      }
    }
    .el-form.service-form {
      .el-form-item {
        margin-bottom: 12px;
        padding: 0 100px 0 20px;
        // &:nth-child(1), &:nth-child(5) {
        //   border-top: 1px solid #E0E6ED;
        // }
        .el-form-item__label {
          background-color: #DDDEE1;
          border-radius: 4px;
          height: 30px;
          line-height: 30px;
          margin-top: 6px;
          padding: 0;
          font-size: 12px;
          text-align: center;
        }
        .el-form-item__content {
          display: flex;
          // .el-input {
          //   flex-basis: 100px;
          //   .el-input__inner {
          //     font-size: 12px;
          //   }
          // }
          .unit {
            flex-basis: 60px;
            margin: 0 5px;
            color: #b4b4b4;
            font-size: 12px;
          }
          .input-item-form {
            margin-bottom: 0;
            padding: 0;
            flex-basis: 100px;
            .el-input {
              width: 100px;
              .el-input__inner {
                font-size: 12px;
              }
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
