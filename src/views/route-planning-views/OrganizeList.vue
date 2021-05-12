<template>
  <div class="rp-org-index">
    <div class="rp-organize">
      <div class="rp_org_month">已选择[{{ visitMonth }}]月</div>
      <div class="rp_org_plan">选择一个营业所</div>
      <el-input
        placeholder="搜索营业所"
        v-model="orgNameKey"
        style="width: 300px; height: 32px;"
        suffix-icon="el-icon-search"
        clearable
      ></el-input>
      <span class="rp_org_status">
        <a class="noplan_bg background"></a>
        <a class="noplan">未规划</a>
        <a class="planning_bg background"></a>
        <a class="planning">规划中</a>
        <a class="approval_bg background"></a>
        <a class="approval">审批中</a>
        <a class="approved_bg background"></a>
        <a class="approved">审批通过</a>
        <!-- 	<a class="force_bg background"></a>
				<a class="force">已生效</a> -->
      </span>
      <div v-for="(item, index) in resultData" :key="index">
        <div v-if="item.children.length > 0">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span> {{ item.name }}</span>
              <span
                v-if="item.show"
                class="el-icon-arrow-up"
                style="float: right; padding: 3px 0; cursor: pointer;"
                @click="changeShow(item)"
                >收起</span
              >
              <span
                v-else
                class="el-icon-arrow-down"
                style="float: right; padding: 3px 0; cursor: pointer;"
                @click="changeShow(item)"
                >展开</span
              >
            </div>
            <ul
              v-show="item.show"
              class="rp_dept"
              v-for="(item1, index1) in item.children"
              :key="index1"
            >
              <li>{{ item1.name }}</li>
              <li
                v-for="(item2, index2) in item1.children"
                :key="index2"
                @click="setBusiness(item2)"
                :class="[
                  {
                    planning: item2.planStatus == '1',
                    approval: item2.planStatus == '2',
                    approved: item2.planStatus == '3',
                    force: item2.planStatus == '4'
                  }
                ]"
              >
                {{ item2.name }}
              </li>
            </ul>
          </el-card>
        </div>
        <ul v-else class="rp_dept_business">
          <li
            @click="setBusiness(item)"
            :class="[
              {
                planning: item.planStatus == '1',
                approval: item.planStatus == '2',
                approved: item.planStatus == '3',
                force: item.planStatus == '4'
              }
            ]"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="rp_back" @click="back">上一步</div>
    </div>
  </div>
</template>

<script>
import ROUTE_PLANNING_API from '@api/route/index'
import { Authorities } from '@/util/authority'
export default {
  name: 'OrganizeList',
  data() {
    return {
      resultData: [],
      orgNameKey: '',
      visitMonth: '',
      visitYear: ''
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const { month, year } = to.query
      if (month && year) {
        vm.$store.commit('addTabs', {
          title: `${year}-${month}-选择营业所`,
          link: to.fullPath,
          on: true,
          needCatch: true
        })
        vm.visitYear = year
        vm.visitMonth = month
      } else {
        /**
         * 修改地址 导致无法准确定位 强制回退
         */
        vm.$router.push('/index')
      }
    })
  },
  created() {
    const { query, fullPath } = this.$route
    this.$store.commit('addTabs', {
      title: `${query['year']}-${query['month']}-选择营业所`,
      link: fullPath,
      on: false,
      needCatch: true
    })
  },
  mounted() {
    this.visitYear = this.$route.query.year
    this.visitMonth = this.$route.query.month
    this.getBusinessList()
  },
  watch: {
    orgNameKey() {
      this.getBusinessList()
    }
  },
  methods: {
    back() {
      this.$router.push(`/route-planning`)
    },
    // 接口测试 获取行销公司
    getBusinessList() {
      let _this = this
      _this.resultData = []
      const params = {
        orgName: _this.orgNameKey,
        yearMonth: this.visitYear + '-' + _this.visitMonth
      }
      ROUTE_PLANNING_API.get_business_status(params).then(res => {
        res.data.forEach(item => {
          _this.getBusinessData(item)
        })
        _this.$nextTick(() => {
          // console.log(_this.resultData)
        })
      })
    },
    getBusinessData(data) {
      let _this = this
      if (data.children && data.children.length > 0) {
        if (data.orgType && data.orgType == 1) {
          _this.$set(data, 'show', true)
          _this.resultData.push(data)
        } else {
          data.children.forEach(item => {
            _this.getBusinessData(item)
          })
        }
      } else {
        _this.resultData.push(data)
      }
    },
    setBusiness(data) {
      // 后台接口还没有做，先注释
      let url = '/api/route/get/checkHaveStore'
      this.$fetch.get(url, { orgId: data.id }).then(res => {
        if (res.code == 200) {
          if (res.data) {
            this.returnApprove(data)
          } else {
            this.$message.error('当前所下无门店，请先推送门店!')
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    returnApprove(data) {
      const { month, year } = this.$route.query
      let urlSuffix = `month=${month}&year=${year}&organizeName=${data.name}&organizeId=${data.id}&planStatus=${data.planStatus}`

      /**
       * 根据 不同的状态 跳转不同的界面
       */
      console.info(data)
      switch (data.planStatus) {
        case '1': // 有计划 计划列表
          if (Authorities('lineplan:build:check:approve')) {
            // 审批者角色 直接跳转至 审批界面
            this.$router.push({
              path: `/route-planning/approve?${urlSuffix}`
            })
            this.$store.commit('routerPlanning/SET_STEP', 'Approve')
          } else {
            this.$router.push({
              path: `/route-planning/plan-list?${urlSuffix}`
            })
            this.$store.commit('routerPlanning/SET_STEP', 'PlanRoute')
          }

          break
        case '2': // 待审批
          this.$router.push({
            path: `/route-planning/approve?${urlSuffix}`
          })
          this.$store.commit('routerPlanning/SET_STEP', 'Approve')
          break
        case '3': // 审批 通过/拒绝
          this.$router.push({
            path: `/route-planning/approve?${urlSuffix}`
          })
          this.$store.commit('routerPlanning/SET_STEP', 'Approve')
          break
        case '4': // 已导出
          this.$router.push({
            path: `/route-planning/global-config?${urlSuffix}`
          })
          break
        default:
          if (Authorities('lineplan:build:check:approve')) {
            // 审批者角色 直接跳转至 审批界面
            this.$router.push({
              path: `/route-planning/approve?${urlSuffix}`
            })
            this.$store.commit('routerPlanning/SET_STEP', 'Approve')
          } else {
            this.$store.commit('routerPlanning/SET_STEP', 'CommonConfig')
            this.$router.push({
              path: `/route-planning/global-config?${urlSuffix}`
            })
          }
      }
    },
    changeShow(data) {
      let _this = this
      _this.$set(data, 'show', !data.show)
    }
  }
}
</script>

<style scoped lang="scss">
.rp-org-index {
  width: 100%;
  overflow: auto;
  background-color: #f8f8f9;

  // &::-webkit-scrollbar {
  // 	display: none;
  // }
}
.rp-organize {
  width: 1194px;
  margin: 0 auto;

  .rp_org_month {
    color: #930cea;
    font-size: 16px;
    font-weight: 400;
    text-align: center;
    margin: 20px 0px;
  }

  .rp_org_plan {
    text-align: center;
    font-weight: 600;
    font-size: 32px;
    color: #000000;
  }

  > .el-input {
    margin-left: 30px;
    margin-top: 20px;

    ::v-deep .el-input__inner {
      height: 32px;
    }

    ::v-deep .el-input__icon {
      line-height: 32px;

      &::before {
        color: #a4a4a4;
        font-weight: 600;
      }
    }
  }

  .rp_org_status {
    float: right;
    font-size: 13px;
    .background {
      padding: 0px 8px;
      margin-right: 3px;
    }
    // a {
    // 	margin-right: 10px;
    // }
    .noplan {
      color: #999999;
      font-weight: 600;
      margin-right: 10px;
    }
    .noplan_bg {
      border: 1px solid #999999;
      background-color: #999999;
    }

    .planning {
      color: #d58a0c;
      font-weight: 600;
      margin-right: 10px;
    }
    .planning_bg {
      border: 1px solid #d58a0c;
      background-color: #d58a0c;
    }

    .approval {
      color: #d0021b;
      font-weight: 600;
      margin-right: 10px;
    }
    .approval_bg {
      border: 1px solid #d0021b;
      background-color: #d0021b;
    }

    .approved {
      color: #2855c7;
      font-weight: 600;
      margin-right: 10px;
    }
    .approved_bg {
      border: 1px solid #2855c7;
      background-color: #2855c7;
    }

    .force {
      color: #0bae5c;
      font-weight: 600;
      margin-right: 10px;
    }
    .force_bg {
      border: 1px solid #0bae5c;
      background-color: #0bae5c;
    }
  }

  .el-card {
    width: 1194px;
    margin-top: 23px !important;
    margin: auto;

    ::v-deep .el-card__header {
      span {
        font-weight: 400;
        font-size: 16px;
        color: #666666;

        &::before {
          color: #666666;
          margin-right: 16px;
        }

        &:first-child {
          font-size: 16px;
          color: #333333;
          font-size: 16px;
          font-weight: 600;
        }
      }
    }

    .rp_dept {
      overflow: hidden;
      margin-left: 100px;
      margin-bottom: 40px;

      > li {
        margin-right: 72px;
        float: left;
        font-size: 16px;
        color: #9b9b9b;
        font-weight: 400;
        cursor: pointer;
        margin-top: 25px;

        &:first-child {
          font-weight: 600;
          color: #333333;
        }
      }

      ::v-deep .el-card__body {
        padding: 0;
        padding-top: 40px;
      }

      .planning {
        color: #d58a0c;
        font-weight: 600;
      }
      .approval {
        color: #d0021b;
        font-weight: 600;
      }
      .approved {
        color: #2855c7;
        font-weight: 600;
      }
      .force {
        color: #0bae5c;
        font-weight: 600;
      }
    }
  }

  .rp_dept_business {
    margin-top: 20px;
    padding: 5px 30px;
    background-color: #ffffff;
    font-size: 16px;
    cursor: pointer;

    .planning {
      color: #d58a0c;
      font-weight: 600;
    }
    .approval {
      color: #d0021b;
      font-weight: 600;
    }
    .approved {
      color: #2855c7;
      font-weight: 600;
    }
    .force {
      color: #0bae5c;
      font-weight: 600;
    }
  }
  .rp_back {
    text-align: center;
    width: 120px;
    height: 32px;
    cursor: pointer;
    line-height: 32px;
    font-size: 12px;
    border: 1px solid #dddee1;
    border-radius: 4px;
    background: #ffffff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
    color: #495060;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 42px;
    margin: auto;
  }
}
</style>
