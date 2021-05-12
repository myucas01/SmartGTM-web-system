<!--建线-->
<template>
  <div class="buildLine-wrap" v-loading="loading">
    <h5 class="area-way">
      <svg-icon :icon-class="svgIcon" class-name="method-icons"/>
      已选择 [{{ areaCode|areaTxt(that) }}]
    </h5>
    <h1 class="title">选择生成路线的方式</h1>
    <ul class="build-uls">
      <template v-for="item of filterOption()">
        <!--   纯 AI     -->
        <li v-if="Authorities(item.authCode) && item.id == 'AI'" :key='item.id' @click="chooseType(item)">
          <svg-icon :icon-class="item.icon" :data-icon="item.icon" class-name="method-icons"/>
          <p class="method-name"><span v-if="item.id !== 'AI'" style="color: #5f5f5f9c;">沿用</span>{{ item.name }}</p>
        </li>
        <!--  非 纯 AI     -->
        <li v-if="showAuth(item) && item.id !== 'AI'" :key='item.id' @click="chooseType(item)">
          <svg-icon :icon-class="item.icon" :data-icon="item.icon" class-name="method-icons"/>
          <p class="method-name"><span v-if="item.id !== 'AI'" style="color: #5f5f5f9c;">沿用</span>{{ item.name }}</p>
          <template v-for="child of item.children">
            <button
                v-if="Authorities(child.authCode)"
                :key="child.code"
                @click="chooseCreateWay(item, child.code, child.type)">{{ child.name }}
            </button>
          </template>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import ROUTE_PLANNING_API from '@api/route/index'
import {Authorities} from '@/util/authority'

export default {
  name: "BuildLine",
  props: ['draftId', 'areaCode', 'actualTime', 'historyPlan'],
  title() {
    return '建线的方式'
  },
  data() {
    return {
      that: this,
      loading: false,
      options: [],
      queryData: ''
    }
  },
  computed: {
    svgIcon() {
      if (this.areaCode === 'ai') {
        return 'AI'
      }
      if (this.areaCode === 'current') {
        return 'current'
      }
      if (this.areaCode === 'plan') {
        return 'planVisit'
      }
      if (this.actualTime) {
        return 'actualVisit'
      }
      return ''
    }
  },
  filters: {
    areaTxt(val, that) {
      if (val) {
        let maps = {
          'current': '用现状创建业务区域',
          'plan': '用计划拜访创建业务区域'
        }
        if (that.actualTime && that.areaCode === 'actual') {
          return `用"${that.actualTime}实际拜访"创建业务区域`
        }
        if (that.areaCode === 'plan') {
          return `用"${that.historyPlan.yearMonth}计划拜访>${that.historyPlan.planName}"创建业务区域`
        }
        return maps[val]
      } else {
        return ''
      }
    }
  },
  mounted() {
    this.queryData = this.$route.query
  },
  methods: {
    Authorities,
    showAuth(item) {
      if (item && item.children && item.children.length > 0) {
        let filterData = item.children.filter(childItem => Authorities(childItem.authCode))
        if (filterData && filterData.length === 0) {
          return false
        } else {
          return true
        }
      } else {
        return false
      }
    },
    filterOption() {
      if (this.areaCode === 'current') {
        return [
          {
            id: 'currentVisit',
            icon: 'icon_addplan_addline_actual',
            name: '现状路线',
            planName: '现状路线',
            code: 'current',
            type: '',
            children: [
              {
                code: 'current_ai',
                describe: '沿用上月实际AI分配',
                name: 'AI就近分配新店',
                type: 'AI',
                authCode: 'lineplan:build:buildline:actualai'
              },
              {
                code: 'current_manual',
                describe: '沿用上月实际AI分配',
                name: '手动分配新店',
                type: 'Manual',
                authCode: 'lineplan:build:buildline:actualmanual'
              }
            ]
          },
          {
            id: 'AI',
            icon: 'icon_addplan_addline_ai',
            name: 'AI自动规划',
            planName: 'AI建线',
            code: 'ai',
            type: 'ai',
            children: [],
            authCode: 'lineplan:build:buildline:ai'
          }
        ]
      }
      if (this.areaCode === 'actual') {
        return [
          {
            id: 'actualVisit',
            icon: 'icon_addplan_addline_actual',
            name: '历史实际路线',
            planName: '实际路线',
            code: 'actual',
            type: '',
            children: [
              {
                code: 'actual_ai',
                describe: '沿用上月实际AI分配',
                name: 'AI就近分配新店',
                type: 'AI',
                authCode: 'lineplan:build:buildline:actualai'
              },
              {
                code: 'actual_manual',
                describe: '沿用上月实际AI分配',
                name: '手动分配新店',
                type: 'Manual',
                authCode: 'lineplan:build:buildline:actualmanual'
              }
            ]
          },
          {
            id: 'AI',
            icon: 'icon_addplan_addline_ai',
            name: 'AI自动规划',
            planName: 'AI建线',
            code: 'ai',
            type: 'ai',
            children: [],
            authCode: 'lineplan:build:buildline:ai'
          }
        ]
      }
      if (this.areaCode === 'plan') {
        return [
          {
            id: 'planVisit',
            icon: 'icon_addplan_addline_planed',
            name: '复用路线',
            planName: '计划路线',
            code: 'plan',
            type: '',
            children: [
              {
                code: 'plan_ai',
                describe: '沿用上月计划AI分配',
                name: 'AI就近分配新店',
                type: 'AI',
                authCode: 'lineplan:build:buildline:planai'
              },
              {
                code: 'plan_manual',
                describe: '沿用上月计划AI分配',
                name: '手动分配新店',
                type: 'Manual',
                authCode: 'lineplan:build:buildline:planmanual'
              }
            ]
          },
          {
            id: 'AI',
            icon: 'icon_addplan_addline_ai',
            name: 'AI自动规划',
            planName: 'AI建线',
            code: 'ai',
            type: 'ai',
            children: [],
            authCode: 'lineplan:build:buildline:ai'
          }
        ]
      }
      return []
    },
    chooseType(item) {
      if (item.id !== 'AI') {
        return
      }
      this.createDraftPlan('ai')
    },
    /**
     * 选择建线的方式
     * @param item
     * @param code  建线的方式 code
     * @param type  基于那种方式做的建线（辅助页面显示使用）
     */
    chooseCreateWay(item, code) {
      this.$parent.buildLineCode = code
      this.createDraftPlan(code)
    },
    // 创建草稿计划
    createDraftPlan(code) {
      if (!this.queryData) {
        this.$message.error('建线 - 创建草稿计划 - 当前参数异常');
        return
      }
      this.loading = true
      ROUTE_PLANNING_API.createPlan({
        orgId: this.queryData.organizeId,
        planId: this.draftId,
        regionGenerationMethod: this.areaCode,
        routeGenerationMethod: code,
        yearMonth: this.queryData.year + '-' + this.queryData.month,
        planMonth: this.historyPlan.prePlanNo ? this.historyPlan.yearMonth : this.actualTime,
        historyPlanId: this.historyPlan.prePlanNo,
        isMainPlan: this.historyPlan.type
      })
          .then(res => {
            if (res.code === '200') {
              this.$parent.buildLineCode = code
              this.$parent.nextStep()
            }
            this.loading = false
          })
          .catch(err => {
            console.error(err)
            this.$message.error('计划创建出错');
          })
    }
  }
}
</script>

<style scoped lang="scss">
.buildLine-wrap {
  padding-top: 36px;

  .title {
    font-size: 32px;
    font-weight: 600;
    color: #000000;
    text-align: center;
  }

  .area-way {
    font-size: 20px;
    font-weight: 600;
    color: #930CEA;
    text-align: center;
    margin-bottom: 15px;
  }

  .build-uls {
    display: flex;
    margin-top: 60px;

    li {
      flex: 1;
      height: 300px;
      background: #FFFFFF;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      border: 1px solid #E6E6E6;
      margin-right: 25px;
      padding-top: 46px;
      align-items: center;
      text-align: center;

      &:last-child {
        margin-right: 0;
        cursor: pointer;
      }

      .method-icons {
        width: 50px;
        height: 50px;
        margin-right: 5px;
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

      .method-name {
        font-size: 20px;
        font-weight: 600;
        color: #333333;
        margin-top: 40px;
        margin-bottom: 45px;
      }

      button {
        display: block;
        margin: 0 auto 10px;
        width: 194px;
        height: 28px;
        border-radius: 14px;
        border: 1px solid #AB5BDE;
        font-size: 14px;
        font-weight: 400;
        color: #AB5BDE;
        margin-bottom: 15px;
        cursor: pointer;
        outline: none;

        &:hover {
          background-color: rgba(171, 91, 222, 0.45);
          font-weight: 400;
          color: #682493;
        }
      }
    }
  }
}
</style>
