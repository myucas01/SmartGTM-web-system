<template>
  <div class="config-index-wrapper">
    <section class="step-wrap">
      <step />
    </section>
    <section class="config-wrap">
      <div class="tabs-wrap">
        <span
          class="tab-item"
          v-for="(item, idx) in tabsData"
          :key="idx"
          :class="{ active: activeIndex === item.key }"
          :id="`tabItem${item.key}`"
          v-auth="item.value"
          @click="tabChanged(item.key)"
        >
          {{ item.text }}
        </span>
      </div>
      <div class="content-wrap">
        <custom-scale
          v-auth="'lineplan:config:class:list'"
          v-show="activeIndex === 0"
          :id="parentOrgId"
          :name="parentOrgName"
          @handleConfig="handleConfig1"
        />
        <service-standards
          v-auth="'lineplan:config:serve:list'"
          v-show="activeIndex === 1"
          @handleConfig="handleConfig2"
        />
        <!-- 岗位作业标准：康饮 -->
        <!-- <work-standards
          v-show="activeIndex === 2"
          :id="parentOrgId"
          :name="parentOrgName"
          @handleConfig="handleConfig3" /> -->
        <!-- 岗位作业标准：康面 -->
        <work-standards
          v-auth="'lineplan:config:jobs:list'"
          v-show="activeIndex === 2"
          :id="grandfatherOrgId"
          :name="grandfatherOrgName"
          @handleConfig="handleConfig3"
        />
      </div>
      <div class="btn-wrap" v-if="activeIndex === 0">
        <span :class="{ disable: !nextActivite }" @click="nextStep">
          下一步
        </span>
      </div>
      <div class="btn-wrap" v-if="activeIndex === 1">
        <span :class="{ disable: !nextActivite }" @click="nextStep">
          下一步
        </span>
      </div>
      <div class="btn-wrap" v-if="activeIndex === 2">
        <span :class="{ disable: !nextActivite }" @click="nextStep">
          下一步
        </span>
      </div>
    </section>
  </div>
</template>

<script>
import ROUTE_PLANNING_API from '@api/route/index'
import step from '../components/Step'
import CustomScale from './customerScale'
import ServiceStandards from './serviceStandards'
import WorkStandards from './workStandards'

export default {
  name: 'configIndexWrapper',
  components: {
    step,
    CustomScale,
    ServiceStandards,
    WorkStandards
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const { month, year, organizeName } = to.query
      vm.$store.commit('addTabs', {
        title: `${year}年-${organizeName}-${month}月拜访计划`,
        link: decodeURIComponent(to.fullPath),
        on: true,
        needCatch: true
      })
    })
  },
  computed: {
    orgName() {
      return this.$route.query.organizeName
    },
    orgId() {
      return this.$route.query.organizeId
    },
    nextActivite() {
      // return this.config1 && this.config2 && this.config3; // 康饮
      return this.config2 && this.config3 // 康面
    }
  },
  data() {
    return {
      tabsData: [
        {
          text: '售点分级',
          key: 0,
          value: 'lineplan:config:class:list'
        },
        {
          text: '服务标准',
          key: 1,
          value: 'lineplan:config:serve:list'
        },
        {
          text: '岗位作业标准',
          key: 2,
          value: 'lineplan:config:jobs:list'
        }
      ],
      activeIndex: 1,
      // 营业所对应的行销公司
      grandfatherOrgId: '',
      grandfatherOrgName: '',
      // 营业所对应的营业部
      parentOrgId: '',
      parentOrgName: '',
      config1: false, // 客户规模有无配置
      config2: false, // 服务标准有无配置
      config3: false // 岗位作业有无配置
    }
  },
  created() {
    this.getParentOrg()
  },
  methods: {
    // 获取营业所父级组织
    getParentOrg() {
      const params = {
        orgId: this.orgId,
        prePlanNo: ''
      }
      ROUTE_PLANNING_API.getParentOrg(params).then(res => {
        const { code, data } = res
        if (code === '200') {
          this.grandfatherOrgId = data.grandfatherOrgId
          this.grandfatherOrgName = data.grandfatherOrgName
          this.parentOrgId = data.parentOrgId
          this.parentOrgName = data.parentOrgName
          // 保存该营业所对应的行销公司 用在服务标注配置页
          this.$store.commit(
            'routerPlanning/SET_CURRENT_ORG_NAME',
            this.grandfatherOrgName
          )
          this.$store.commit(
            'routerPlanning/SET_CURRENT_ORG_ID',
            this.grandfatherOrgId
          )
        }
      })
    },
    tabChanged(idx) {
      this.activeIndex = idx
    },
    nextStep() {
      if (this.nextActivite) {
        const {
          month,
          year,
          organizeName,
          organizeId,
          planStatus
        } = this.$route.query
        let urlSuffix = `month=${month}&year=${year}&organizeName=${organizeName}&organizeId=${organizeId}&planStatus=${planStatus}&create=true`

        // 跳到下一步
        this.$store.commit('routerPlanning/SET_STEP', 'PlanRoute')
        this.$router.push({
          path: `build-route?${urlSuffix}`
        })
      }
    },
    handleConfig1(val) {
      this.config1 = val
    },
    handleConfig2(val) {
      this.config2 = val
    },
    handleConfig3(val) {
      this.config3 = val
    }
  }
}
</script>

<style lang="scss" scoped>
.config-index-wrapper {
  width: 100%;
  background-color: #f8f8f9;
  .step-wrap {
    display: flex;
    height: 60px;
    align-items: center;
    background-color: #f8f8f9;
  }
  .config-wrap {
    width: 1194px;
    margin: 0 auto;
    .tabs-wrap {
      width: 100%;
      height: 36px;
      background-color: #ffffff;
      box-shadow: 0px 1px 0px 0px #ced3dd;
      border-radius: 2px;
      margin-bottom: 20px;
      .tab-item {
        display: inline-block;
        line-height: 36px;
        font-size: 14px;
        cursor: pointer;
        margin: 0 24px;
        padding: 0 20px;
        &.active {
          color: #930cea;
          border-bottom: 2px solid #930cea;
        }
      }
    }
    .content-wrap {
      background-color: #ffffff;
      height: 450px;
      height: calc(100vh - 230px);
    }
    .btn-wrap {
      margin-top: 14px;
      text-align: center;
      span {
        display: inline-block;
        width: 80px;
        height: 32px;
        line-height: 32px;
        color: #fff;
        border-radius: 4px;
        background-color: #930cea;
        cursor: pointer;
        &.disable {
          background-color: #c581f1;
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>
