<!--划区-->
<template>
  <div class="zoning-wrap" v-loading="loading">
    <h1 class="title">{{ name }}</h1>
    <ul class="build-uls">
      <template v-for="item of buildOptions">
        <li v-if="Authorities(item.authCode)" :key="item.name" @click="chooseType(item)">
          <svg-icon :icon-class="item.icon" class-name="method-icons"/>
          <h5>{{ item.name }}</h5>
          <p>{{ item.describe }}</p>
        </li>
      </template>
    </ul>
    <!--我想用实际拜访-->
    <el-dialog
        title="我想用实际拜访"
        class="monthDialog"
        :visible.sync="dialogVisible"
        width="30%">
      <div class="calendar-content">
        <p>计划月份</p>
        <el-date-picker
            v-model="planMonth"
            type="month"
            format="yyyy-M"
            value-format="yyyy-M"
            placeholder="选择月"
            :picker-options="pickerOptions">
        </el-date-picker>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getDraftPlan">确 定</el-button>
      </div>
    </el-dialog>
    <!--我想用历史计划-->
    <el-dialog
        title="我想用计划拜访"
        class="planDialog"
        :visible.sync="historyPlanDialogVisible"
        ref="planDialog"
        center
        width="1195px">
      <reuseList ref="reuseListChild" :createPlan="historyCreate"/>
    </el-dialog>
  </div>
</template>

<script>
import ROUTE_PLANNING_API from '@api/route/index'
import {mapGetters} from 'vuex'
import reuseList from './ReuseList'
import {Authorities} from '@/util/authority'

export default {
  name: "zoning",
  props: ['historyPlan'],
  title() {
    return '划区的方式'
  },
  components: {
    reuseList
  },
  computed: {
    ...mapGetters('routerPlanning', [
      'visitMonth',
      'visitOrgId',
      'visitYear',
      'organizePlanStatus'
    ])
  },
  data() {
    return {
      name: '当前暂无计划，你要如何创建业务区域',
      loading: false,
      buildOptions: [
        {
          id: 'current',
          icon: 'current',  // icon中svg中的图标名称
          name: '现状可视化',
          describe: '基于师傅通业务现状，可视化展示计划拜访路线',
          tip: '用现状创建业务区域',
          planName: '现状',
          code: 'current',
          authCode: 'lineplan:build:buildarea:current'
        },
        {
          id: 'planVisit',
          icon: 'planVisit',
          // name: '沿用历史计划拜访划区',
          name: '系统计划复用',
          // describe: '以上个月的计划拜访为基础还原业务区域',
          // describe: '以历史月计划拜访为基础，还原业务区域',
          // describe: '以本系统的历史拜访计划为基础还原方案',
          describe: '以路线规划系统的计划拜访方案，复用至最新月份',
          tip: '用计划拜访创建业务区域',
          planName: '计划区域',
          code: 'plan',
          authCode: 'lineplan:build:buildarea:plan'
        },
        {
          id: 'AI',
          icon: 'AI',
          name: 'AI自动规划',
          describe: '通过AI智能算法规划的业务区域与路线',
          tip: '',
          planName: 'AI划区建线',
          code: 'ai',
          authCode: 'lineplan:build:buildarea:ai'
        },
        {
          id: 'actualVisit',
          icon: 'actualVisit',
          name: '沿用历史实际拜访划区',
          // describe: '以上个月的实际拜访为基础还原业务区域',
          describe: '以历史月实际拜访为基础，还原业务区域',
          tip: '用实际拜访创建业务区域',
          planName: '实际区域',
          code: 'actual',
          authCode: 'lineplan:build:buildarea:actual'
        },
        // {
        //     icon: 'exportPlan',
        //     name: '我要导入计划备份',
        //     describe: '以导入师傅通的标准配置导入拜访计划EXCEL生成业务区域与路线',
        //     code: 'import'
        // },
      ],
      queryData: '',
      dialogVisible: false,
      historyPlanDialogVisible: false,
      planMonth: '',
      historyPlanId: '',
      isMainPlan: '',
      histroyPlan: {
        id: '',
        type: ''
      },
      pickerOptions: {},
      canChooseTime: [],
      areaCode: ''
    }
  },
  created() {
    let _this = this
    _this.getCanChooseTime()
    _this.pickerOptions = {
      disabledDate(time) {
        return !_this.canChooseTime.includes(_this.$moment(time).format('YYYY-M'))
      }
    }
  },
  mounted() {
    this.queryData = this.$route.query
    if (this.queryData && this.queryData.planStatus) {
      this.name = '创建计划'
    } else {
      this.name = '当前暂无计划，请创建计划'
    }
  },
  methods: {
    Authorities,
    async getCanChooseTime() {
      let result = await ROUTE_PLANNING_API.historyActualTime({orgId: this.$route.query.organizeId})
      if (result.code === '200') {
        this.canChooseTime = result.data
      }
    },
    //  选择划区 方式
    chooseType(item) {
      let _this = this
      _this.$parent.areaCode = item.code
      _this.areaCode = item.code
      if (item.code === 'plan') {
        _this.historyPlanDialogVisible = true
        _this.$nextTick(function () {
          _this.$refs.reuseListChild.defaultOpen()
        })
      } else if (item.code === 'actual') {
        _this.dialogVisible = true
      } else {
        _this.getDraftPlan(item.id)
      }

    },
    //  获取草稿计划id
    getDraftPlan(type) {
      if (!this.queryData) {
        this.$message.error('划区- 获取草稿计划id - 当前参数异常');
        return
      }
      if (this.areaCode === 'actual' && !this.planMonth) {
        this.$message.error('请选择复用月份');
        return
      }
      this.$parent.actualTime = this.planMonth
      ROUTE_PLANNING_API.getPlanId({
        orgId: this.queryData.organizeId,
        yearMonth: this.queryData.year + '-' + this.queryData.month,
        planMonth: this.histroyPlan.prePlanNo ? this.histroyPlan.yearMonth : this.planMonth,
        historyPlanId: this.histroyPlan.prePlanNo,
        isMainPlan: this.histroyPlan.type
      })
          .then(res => {
            if (res.code === '200') {
              this.$parent.draftId = res.data
              if (type === 'AI' || type === 'current' || type === 'plan') {
                if(type === 'AI') { this.$parent.buildLineCode = 'ai' }
                if(type === 'current') { this.$parent.buildLineCode = 'current_manual' }
                if(type === 'plan') { this.$parent.buildLineCode = 'plan_manual ' }
                this.createDraftPlan(res.data, type)
              } else {
                this.$parent.nextStep()
              }
            }
          })
          .catch(err => console.log(err))
    },
    getWays() {
      const returnObj = new Map()
      returnObj.set('AI', { regionGenerationMethod: 'ai',  routeGenerationMethod: 'ai'})
      returnObj.set('current', { regionGenerationMethod: 'current',  routeGenerationMethod: 'current_manual'})
      returnObj.set('plan', { regionGenerationMethod: 'plan',  routeGenerationMethod: 'plan_manual'})
      return returnObj
    },
    // 创建草稿计划
    createDraftPlan(draftId, type) {
      if (!this.queryData) {
        this.$message.error('划区- 创建草稿计划 - 当前参数异常');
        return
      }
      this.loading = true
      ROUTE_PLANNING_API.createPlan({
        orgId: this.queryData.organizeId,
        planId: draftId,
        regionGenerationMethod: this.getWays().has(type) && this.getWays().get(type) ? this.getWays().get(type)['regionGenerationMethod'] : '',
        routeGenerationMethod: this.getWays().has(type) && this.getWays().get(type) ? this.getWays().get(type)['routeGenerationMethod'] : '',
        yearMonth: this.queryData.year + '-' + this.queryData.month,
        planMonth: this.historyPlan.prePlanNo ? this.historyPlan.yearMonth : this.actualTime,
        historyPlanId: this.historyPlan.prePlanNo,
        isMainPlan: this.historyPlan.type
      })
          .then(res => {
            this.loading = false
            if (res.code === '200') {
              // 更新计划状态
              this.$parent.nowViewStatus = 'buildLine'
              this.$parent.nextStep()
            } else {
              this.$message.error('计划创建出错，请重新创建');
            }
          })
          .catch(err => {
            console.error(err)
            this.$message.error('计划创建出错');
          })
    },
    historyCreate(data) {
      this.histroyPlan = Object.assign(data)
      if (this.histroyPlan.prePlanNo && this.histroyPlan.type) {
        this.histroyPlan.type = this.histroyPlan.type === 'draft' ? false : true
      }
      this.$parent.historyPlan = Object.assign(data)
      this.$parent.areaCode = 'plan'
      this.getDraftPlan('plan')
    }

  }
}
</script>

<style scoped lang="scss">
.zoning-wrap {
  padding-top: 36px;

  .title {
    font-size: 32px;
    font-weight: 600;
    color: #000000;
    text-align: center;
  }

  .build-uls {
    display: flex;
    margin-top: 60px;

    li {
      flex: 1;
      height: 224px;
      background: #FFFFFF;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      border: 1px solid #E6E6E6;
      margin-right: 25px;
      padding-top: 46px;
      align-items: center;
      text-align: center;
      cursor: pointer;

      &:last-child {
        margin-right: 0;
      }

      .method-icons {
        width: 50px;
        height: 50px;
      }

      h5 {
        margin-top: 30px;
        font-size: 20px;
        font-weight: 600;
        color: #5F5F5F;
      }

      p {
        width: 170px;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        margin: 15px auto;
      }
    }
  }
}

.monthDialog {
  .calendar-content {
    display: flex;
    align-items: center;
    justify-items: center;

    p {
      margin-right: 10px;
    }
  }
}

.planDialog {
  ::v-deep {
    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>
