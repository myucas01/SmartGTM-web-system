<template>
  <div class="build-wrap">
    <div class="step-box">
      <step/>
    </div>
    <div class="build-wrap-content">
      <p class="build-title">{{$route.query.year}}-{{$route.query.month}} {{$route.query.organizeName}}</p>
      <!--数据检查-->
      <dataCheck ref="dataCheckChild"/>
      <div class="footer-btn">
        <button class="previous" @click="nowBack">{{ btnName }}</button>
        <button class="previous" @click="nextStep">确认</button>
      </div>
    </div>
  </div>
</template>

<script>
import step from './components/Step'
import dataCheck from "./components/DataCheck";
import ROUTE_PLANNING_API from '@api/route/index'

export default {
  name: "DataCheckIndex",
  title() {
    return '划区建线'
  },
  components: {
    step,
    dataCheck
  },
  data() {
    return {
      btnName: '上一步',
      requestBoolean: false,
      urlSuffix: '',
      warningText: []
    }
  },
  beforeDestroy() {
    if(document.querySelector('.home main').getAttribute('style')) {
      document.querySelector('.home main').removeAttribute('style')
      document.querySelector('#routePlan').removeAttribute('style')

    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const {month, year, organizeName} = vm.$route.query
      vm.$store.commit('addTabs', {
        title: `${year}-${month}-${organizeName}-数据检查`,
        link: decodeURIComponent(to.fullPath),
        on: true,
        needCatch: true
      });
    });
  },
  mounted() {
    const windHeigth = document.documentElement.clientHeight || document.body.clientHeight
    if (windHeigth < 800) {
      document.querySelector('.home main').setAttribute('style', 'overflow: auto !important;')
      document.querySelector('#routePlan').setAttribute('style', 'height: 700px !important;')
    }
    const {month, year, organizeName, organizeId, planStatus} = this.$route.query
    this.urlSuffix = `month=${month}&year=${year}&organizeName=${organizeName}&organizeId=${organizeId}&planStatus=${planStatus}`
    this.$store.commit('routerPlanning/SET_STEP', 'PlanRoute')
  },
  methods: {
    // 上一步
    nowBack() {
      this.$router.push(`/route-planning/build-route?${this.urlSuffix}`)
    },
    // 下一步
    async nextStep() {
      // const {buildLineCode} = this.$route.query
      this.checkParams()
      // if (buildLineCode === 'ai') {
      //   this.checkParams()
      // } else {
      //   await this.zoningArea()
      //   // this.$router.push(`/route-planning/plan-list?${this.urlSuffix}`)
      // }
    },
    /**
     * 调用划区接口 算法计算 划区数据
     */
    async zoningArea() {
      if (this.requestBoolean) {
        return
      }
      this.requestBoolean = true
      await ROUTE_PLANNING_API.planZoning({
        orgId: this.$route.query.organizeId,
        prePlanNo: this.$route.query.draftId,
        yearMonth: this.$route.query.year + '-' + this.$route.query.month,
        planMonth: this.$route.query.planMonth,
        historyPlanId: this.$route.query.prePlanNo,
        isMainPlan: this.$route.query.type,
      })
      this.requestBoolean = false
      this.$router.push(`/route-planning/plan-list?${this.urlSuffix}`)
    },
    // 数据校验
    async checkParams() {
      let data = this.$refs.dataCheckChild.needCheckData
      this.warningText = []
      /**
       * 过滤规则：
       * 1：工作时长不能为空
       * 2：服务日天数 不能小于等于 0
       * 3：规划人数 不能小于等于 0
       */
      if (data && data.length > 0) {
        for (let item of data) {
          if (!item.workingHours || item.workingHours === '0-0' || Number(item.serviceDays) <= 0 || Number(item.plannedPeopleNumber) <= 0) {
            this.warningText.push({
              typecode: item.representativePostCode,
              type: item.representativePost,
              txt: (function () {
                if (item.plannedPeopleNumber <= 0) {
                  return `${item.representativePost} 规划人数为0`
                }
                if (Number(item.serviceDays) <= 0 || Number(item.plannedPeopleNumber) <= 0 || item.workingHours === '0-0') {
                  return `${item.representativePost} 岗位作业标准未配置`
                }
              }())
            })
          }
        }
        if (this.warningText && this.warningText.length > 0) {
          // 存在未配置参数 业代类型
          let htmlData = ''
          for (let item of this.warningText) {
            htmlData += `<p>${item.txt}</p>`
          }
          /**
           * 如果当前规划的业代类型 均存在配置异常的问题
           * 则提示 --》  此方案将会创建失败
           * 否则 --》 以上业代类型将不参与规划
           */
          if(this.warningText && this.warningText.length === data.length) {
            htmlData = `<div>${htmlData} <p style="color: red;font-weight:500;">此方案将会创建失败</p></div>`
          } else {
            htmlData = `<div>${htmlData} <p style="color: red;font-weight:500;">以上业代类型将不参与该规划</p></div>`
          }

          this.$alert(htmlData, '提示', {
            dangerouslyUseHTMLString: true,
            showClose: false,
            showCancelButton: this.warningText && this.warningText.length === data.length ? false : true,
            confirmButtonText: '确认',
            cancelButtonText: '取消'
          })
              .then(async () => {
                if(this.warningText && this.warningText.length === data.length) {
                  // 全局数据异常
                  this.$router.push(`/route-planning/plan-list?${this.urlSuffix}`)
                } else {
                  await this.zoningArea()
                }
              })
        } else {
          // 数据正常
          await this.zoningArea()
          // this.$router.push(`/route-planning/plan-list?${this.urlSuffix}`)
        }
      } else {
        let _this = this
        _this.$alert('<p style="color: red;font-weight: 500;">当前计划没有规划数据，将会创建失败</p>', '提示', {
          dangerouslyUseHTMLString: true,
          showClose: false,
          showCancelButton: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
            .then(async () => {
              await _this.zoningArea()
            })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.build-wrap {
  width: 100%;
  background-color: #F8F8F9;

  .step-box {
    display: flex;
    height: 60px;
    align-items: center;
    background-color: #F8F8F9;
    box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.5);
  }

  &-content {
    width: 1194px;
    margin: 0 auto;
    position: relative;
    .build-title{
      font-size: 16px;
      font-weight: 600;
      position: absolute;
      top: 34px;
      left: 0;
    }
  }

  .footer-btn {
    display: flex;
    width: 100%;
    height: 40px;
    position: fixed;
    bottom: 42px;
    left: 0;
    justify-content: center;

    button {
      height: 32px;
      background: #FFFFFF;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      border: 1px solid #DDDEE1;
      padding: 0 33px;
      margin-right: 10px;

      &:focus {
        border: none;
      }

      &:last-child {
        margin-right: 0;
        background-color: #930CEA;
        color: #fff;
      }
    }
  }
}
</style>
