<template>
  <div class="commonBox">
    <div class="pagetitle" v-show="opentype == 'addnew'">选择分级指标</div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <div class="pagebox">
        <p class="title">
          {{ opentype !== 'addnew' ? businessTitle : '' }}基本信息
        </p>
        <p class="inforbox">
          <el-form-item label="商圈布局名称" prop="name">
            <el-input
              v-model="ruleForm.name"
              maxlength="20"
              size="mini"
              placeholder="请输入商圈布局名称"
              :disabled="!configSave"
            ></el-input>
          </el-form-item>
          <el-form-item label="商圈布局财年" prop="year">
            <el-select
              v-model="ruleForm.year"
              placeholder="请选择商圈布局财年"
              size="mini"
              :disabled="!configSave || opentype !== 'addnew'"
            >
              <el-option
                v-for="(item, index) in yearList"
                :key="index"
                :label="item.key"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商圈布局季度" prop="quarter">
            <el-select
              v-model="ruleForm.quarter"
              placeholder="请选择商圈布局季度"
              size="mini"
              :disabled="!configSave || opentype !== 'addnew'"
            >
              <el-option
                v-for="(item, index) in quarterList"
                :key="index"
                :label="item.key"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="状态"
            prop="status"
            size="mini"
            v-show="opentype !== 'addnew'"
          >
            <el-select
              v-model="ruleForm.status"
              :disabled="!configSave"
              placeholder="请选择状态"
            >
              <el-option
                v-for="(item, statusindex) in statusList"
                :key="statusindex"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </p>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: ['opentype', 'businessTitle', 'CommonForm', 'configSave'],
  data() {
    return {
      ruleForm: {
        name: null,
        year: null,
        quarter: null,
        status: null
      },
      yearList: [],
      quarterList: [
        {
          value: 'Q1',
          key: 'Q1'
        },
        {
          value: 'Q2',
          key: 'Q2'
        },
        {
          value: 'Q3',
          key: 'Q3'
        },
        {
          value: 'Q4',
          key: 'Q4'
        }
      ],
      statusList: [
        {
          value: 1,
          label: '规划中'
        },
        {
          value: 2,
          label: '已生效'
        },
        {
          value: 3,
          label: '未生效'
        }
      ],
      rules: {
        name: [
          {
            required: true,
            message: ' ',
            trigger: 'blur'
          },
          {
            min: 0,
            max: 40,
            message: ' ',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {},
  mounted() {
    this.init()
  },
  watch: {
    ruleForm: {
      deep: true,
      handler: function(newval) {
        this.$emit('changeFromValue', newval)
      }
    }
  },
  methods: {
    init() {
      // 获取布局默认的年，月，以及选择列表，状态
      const data = new Date()
      const nowYear = data.getFullYear()
      const mouth = data.getMonth() + 1
      const quarter = 'Q' + Number(parseInt(mouth / 12) + 1)
      // let defultName = ''
      // if (this.opentype === 'addnew') {
      //   let defultName = nowYear + '年' + quarter
      // }
      if (this.opentype !== 'addnew') {
        this.ruleForm = this.CommonForm
      } else {

        // this.ruleForm.name = defultName + '商圈布局'
        // 删除默认商圈方案名称
        this.ruleForm.name = ''
        this.ruleForm.year = nowYear
        this.ruleForm.quarter = quarter
      }
      //获取最近50年的列表值
      for (var i = -2; i < 48; i++) {
        const item = {
          value: nowYear + i,
          key: nowYear + i + '年'
        }
        this.yearList.push(item)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.commonBox {
  display: block;
}
.pagetitle {
  width: 173px;
  height: 33px;
  font-size: 24px;
  font-weight: 600;
  color: #1e2840;
  line-height: 33px;
  margin: 33px auto 27px auto;
  text-align: center;
  display: block;
}
.el-form-item {
  margin-bottom: 5px !important;
}
.el-form-item_error {
  top: 12px !important;
  left: 220px !important;
}
.pagebox {
  background-color: #ffffff;
  margin: 0 0 15px 0;
  .title {
    padding: 10px 30px;
    text-align: left;
    border-bottom: 1px solid #ced3dd;
    color: #000;
    font-size: 14px;
    font-weight: 600;
  }
  .inforbox {
    padding: 18px 30px 33px 30px;
    .el-input,
    .el-select {
      width: 30% !important;
    }
  }
}
</style>
