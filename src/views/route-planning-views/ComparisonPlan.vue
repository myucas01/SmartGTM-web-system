<template>
  <div class="ComparisonPlanbox">
    <!-- 左侧盒子 -->
    <planbox
      class="childbox"
      :PlanId="leftPlanId"
      :PlanName="leftPlanName"
      :showOverview="showOverview"
      :container="leftcontainer"
      :isPlan="leftisPlan"
      :isHistory="lefthistory"
      @getShowOverview="getShowOverview"
    ></planbox>
    <!-- 右侧盒子 -->
    <planbox
      class="childbox"
      :PlanId="rightPlanId"
      :PlanName="rightPlanName"
      :showOverview="showOverview"
      :container="rightcontainer"
      :isPlan="rightisPlan"
      :isHistory="righthistory"
      @getShowOverview="getShowOverview"
    ></planbox>
    <!-- 是否展示数据总览 -->
    <div
      class="showviewButton"
      v-if="!showOverview"
      @click="getShowOverview(true)"
    >
      <i class="el-icon-arrow-up"></i>
    </div>
  </div>
</template>
<script>
import planbox from './components/planbox' // 数据总览
export default {
  name: 'ComparisonPlan',
  data() {
    return {
      leftPlanId: null, //左侧id
      leftPlanName: null, //左侧名称
      rightPlanId: null, //右侧id
      rightPlanName: null, //右侧名称
      leftisPlan: null,
      rightisPlan: false,
      showOverview: false, //是否显示数据总览
      leftcontainer: 'leftcontainer',
      rightcontainer: 'rightcontainer',
      lefthistory: false,
      righthistory: true
    }
  },
  components: {
    planbox
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.$store.commit('addTabs', {
        title: '对比',
        link: decodeURIComponent(vm.$route.fullPath),
        on: true,
        needCatch: true
      })
    })
  },
  mounted() {
    const {
      leftPlanId,
      rightPlanId,
      leftPlanName,
      rightPlanName,
      leftisPlan
    } = this.$route.query
    // 获取左侧和右侧的计划id
    this.leftPlanId = leftPlanId
    this.rightPlanId = rightPlanId
    this.leftPlanName = leftPlanName
    this.rightPlanName = rightPlanName
    this.leftisPlan = leftisPlan
  },
  methods: {
    getShowOverview(value) {
      this.showOverview = value
    }
  }
}
</script>
<style lang="scss" scoped>
.ComparisonPlanbox {
  display: flex;
  flex-wrap: wrap;
  height: 100vh;
  width: 100%;
  .childbox {
    flex: 1;
    border-right: 1px solid #999;
  }
  .showviewButton {
    width: 60px;
    height: 25px;
    display: inline-block;
    background-color: #415982;
    position: fixed;
    bottom: 0px;
    left: calc(50% - 30px);
    border-radius: 5px 5px 0px 0px;
    color: #fff;
    font-size: 18px;
    text-align: center;
    line-height: 25px;
    cursor: pointer;
    z-index: 9999;
  }
}
</style>
