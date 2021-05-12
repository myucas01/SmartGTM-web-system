<template>
  <div class="build-wrap">
    <div class="step-box">
      <step/>
    </div>
    <div class="build-wrap-content">
      <p class="build-title">{{$route.query.year}}-{{$route.query.month}} {{$route.query.organizeName}}</p>
      <!--划区的方式-->
      <zoning v-if="nowViewStatus == 'zoning'" :historyPlan="historyPlan"/>
      <!--建线的方式-->
      <buildLine v-if="nowViewStatus == 'buildLine'" :draftId="draftId" :areaCode="areaCode" :historyPlan="historyPlan"
                 :actualTime="actualTime"/>
      <div class="footer-btn">
        <button class="previous" @click="nowBack">{{ btnName }}</button>
        <button v-show="nowViewStatus == 'dateCheck'" class="previous" @click="nextStep">确认</button>
      </div>
    </div>
  </div>
</template>

<script>
import step from './components/Step'
import zoning from "./components/Zoning";
import buildLine from './components/BuildLine'

export default {
  name: "BuildRouter",
  title() {
    return '划区建线'
  },
  components: {
    step,
    zoning,
    buildLine,
  },
  data() {
    return {
      nowViewStatus: 'zoning',
      btnName: '上一步',
      requestBoolean: false,
      urlSuffix: '',
      areaCode: '', // 划区的code
      buildLineCode: '', // 建线的code
      draftId: '', // 草稿计划id
      actualTime: '', // 实际拜访计划时间
      historyPlan: '',
    }
  },
  beforeCreate() {
    const windHeigth = document.documentElement.clientHeight || document.body.clientHeight
    if (windHeigth < 800) {
      document.querySelector('.home main').setAttribute('style', 'overflow: auto !important;')
      document.querySelector('#routePlan').setAttribute('style', 'height: 650px !important;')
    }
  },
  beforeDestroy() {
    if (document.querySelector('.home main').getAttribute('style')) {
      document.querySelector('.home main').removeAttribute('style')
      document.querySelector('#routePlan').removeAttribute('style')

    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const {month, year, organizeName, organizeId, planStatus} = vm.$route.query
      vm.urlSuffix = `month=${month}&year=${year}&organizeName=${organizeName}&organizeId=${organizeId}&planStatus=${planStatus}`
      if (month && year && organizeName) {
        if (planStatus && planStatus !== 1) {
          if (!vm.$route.query.create) {
            vm.$router.push(`/route-planning/plan-list?${vm.urlSuffix}`)
          } else {
            vm.$store.commit('addTabs', {
              title: `${year}-${month}-${organizeName}-划区建线`,
              link: decodeURIComponent(to.fullPath),
              on: true,
              needCatch: true
            });
          }
        } else {
          vm.$store.commit('addTabs', {
            title: `${year}-${month}-${organizeName}-划区建线`,
            link: decodeURIComponent(to.fullPath),
            on: true,
            needCatch: true
          });
        }
      } else {
        vm.$router.push('/index')
      }

    });
  },
  mounted() {
    this.$store.commit('routerPlanning/SET_STEP', 'PlanRoute')
  },
  methods: {
    // 上一步
    nowBack() {
      let navEvents = this.ViewMethodBack().get(this.nowViewStatus)
      navEvents.call(this)
    },
    // 下一步
    nextStep() {
      let navEvents = this.ViewMethodNext().get(this.nowViewStatus)
      navEvents.call(this)
    },
    ViewMethodBack() {
      let _this = this
      return new Map([
        ['zoning', () => {
          _this.$router.push(`/route-planning/global-config?${_this.urlSuffix}`)
        }],
        ['buildLine', () => {
          _this.actualTime = ''
          _this.nowViewStatus = 'zoning'
        }],
      ])
    },
    ViewMethodNext() {
      let _this = this
      let urlSuffix = `${this.urlSuffix}&areaCode=${this.areaCode}&buildLineCode=${this.buildLineCode}&draftId=${this.draftId}`
      if (this.areaCode === 'actual') {
        urlSuffix = `${urlSuffix}&planMonth=${this.actualTime}`
      }
      if (this.areaCode === 'plan') {
        urlSuffix = `${urlSuffix}&planMonth=${this.historyPlan.yearMonth}&type=${this.historyPlan.type}&prePlanNo=${this.historyPlan.prePlanNo}`
      }
      return new Map([
        ['zoning', () => _this.nowViewStatus = 'buildLine'],
        ['buildLine', () => {
          _this.nowViewStatus = 'dateCheck'
          _this.$router.push(`/route-planning/data-check?${urlSuffix}`)
        }]
      ])
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
      top: 49px;
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
