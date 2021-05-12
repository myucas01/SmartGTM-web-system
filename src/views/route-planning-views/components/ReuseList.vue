<!-- 复用 计划列表 -->
<template>
  <div class="reuse-wrap">
    <div class="reuse-header">
      <p>计划月份</p>
      <el-date-picker
          v-model="dateVal"
          type="month"
          placeholder="选择日期"
          format="yyyy-M"
          value-format="yyyy-M"
          @change="handleChange">
      </el-date-picker>
    </div>
    <div class="reuse-content">
      <!-- 业代类型 -->
      <div class="header-type">
        <div class="header-type-fixed"></div>
        <div class="header-type-content">
          <ul ref="headerWrapper">
            <li class="placeholder-195"></li>
            <li v-for="(item, index) of businessType" :key="index+'table'">{{ item.salesTypeName }}</li>
            <li class="placeholder-218"></li>
          </ul>
        </div>
        <div class="header-type-fixed-right"></div>
      </div>
      <!-- 选定拜访计划 -->
      <div class="choose-plan-box">
        <div class="choose-plan-box-left fixed-item">
          <h5>选定拜访计划</h5>
        </div>
        <div class="choose-plan-box-content">
          <ul ref="chooseTypeWrapper" id="choose-uls">
            <li class="placeholder-195"></li>
            <li v-for="(item, index) of bindSalesType" :key="'choose'+index">
              <div v-if="item.bindPlanNo"
                   :class="{'bind-type': item.bindPlanNo, 'repeat-type': item.status} ">
                            <span class="repeat-icon" v-if="item.status"> <svg-icon
                                icon-class="icon_warningsmall"/></span>
                {{ item.bindPlanName }}
              </div>
              <span v-else style="line-height: 59px;" class="no-plan">未计划</span>
            </li>
            <li class="placeholder-218"></li>
          </ul>
        </div>
        <div class="choose-plan-box-right fixed-item">
          <div class="preView-plan" :class="{'disabled': !mainChooseBoolean, 'borderRight': !mainChooseBoolean}"
               @click="viewPlan('', 'main')">预览
          </div>
          <div class="choose-box" :class="{'disabled': !mainChooseBoolean}"
               @click="choosePlan('main', mainPlan.id,'',mainChooseBoolean)">
            <span class="choose-circle"
                  :class="{'choose-circle-active': choosePlanData.prePlanNo === mainPlan.id}"></span>
            <span class="choose-txt" :class="{'choose-txt-active': choosePlanData.prePlanNo === mainPlan.id}">选择</span>
          </div>
        </div>
      </div>
      <!-- 拜访计划 列表-->
      <div class="plan-box">
        <div class="plan-content" ref="bodyWrapper">
          <ul v-if="planData && planData.length > 0">
            <li v-for="(item,index) of planData" :key="'content'+index">
              <div class="lis-item placeholder-195">{{ item.prePlanName }}</div>
              <div v-for="(saleItem, saleIndex) of item.saleList"
                   :key="'saleItem'+ saleIndex"
                   class="lis-item lis-com"
                   :class="{'no_plan': saleItem.isPlan === '0', 'bind_plan': saleItem.isBind === '1'}"
              >
                <span v-if="saleItem.isPlan === '0'">未计划</span>
                <div class="yet-plan" v-else>
                  <el-checkbox v-if="saleItem.isBind === '0'"
                               v-model="saleItem.isBind"
                               :class="{'disabledClass': editDisabled(saleItem), 'canChoose': !editDisabled(saleItem)}"
                               disabled
                  />
                  <div class="yet-bind" v-else>
                    <svg-icon icon-class="icon_gouxuan" class="checkIcon"></svg-icon>
                  </div>
                </div>
              </div>
              <div class="lis-item placeholder-218"></div>
            </li>
          </ul>
          <p v-else style="text-align: center; margin-top: 30px">暂无计划</p>
        </div>
        <div class="plan-table-fixed" ref="leftFixedBodyWrapper" v-mousewheel="handleFixedMousewheel">
          <ul>
            <li v-for="(item,index) of planData" :key="index+ '_' + 'left'"
                :class="{'not-generate': item.areaType === '1' ,'failure':item.areaType === '3', 'not-generated': item.areaType === '0'}"
                @click="navToDetail(item)">{{ item.prePlanName }}
            </li>
          </ul>
        </div>
        <div class="plan-table-fixed-right" ref="rightFixedBodyWrapper" v-mousewheel="handleFixedMousewheel">
          <ul>
            <li v-for="(item,index) of planData" :key="'_' + index">
              <div class="preView-plan" @click="viewPlan(item, 'draft')">预览</div>
              <div class="choose-box" :class="{'disabled': !chooseBoolean(item.saleList)}"
                   @click="choosePlan('draft', item.prePlanNo, item, chooseBoolean(item.saleList))">
                <span class="choose-circle "
                      :class="{'choose-circle-active': choosePlanData.prePlanNo === item.prePlanNo}"></span>
                <span class="choose-txt"
                      :class="{'choose-txt-active': choosePlanData.prePlanNo === item.prePlanNo}">选择</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 阴影效果 -->
      <div class="shadow-left" v-if="scrollPosition !== 'left' && bindSalesType.length > 6"></div>
      <div class="shadow-right" v-if="scrollPosition !== 'right' && bindSalesType.length > 6"></div>
    </div>
    <div class="reuse-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button @click="subData">确认，下一步</el-button>
    </div>
  </div>
</template>

<script>
import {throttle} from 'throttle-debounce';
import Mousewheel from '@/util/directives/mousewheel.js';
import ROUTE_PLANNING_API from "@api/route/index";

export default {
  name: "ReuseList",
  props: ['createPlan'],
  directives: {
    Mousewheel
  },
  data() {
    return {
      dateVal: '',
      scrollPosition: 'left',
      businessType: [],
      planData: [],
      queryData: '',
      bindSalesType: [],
      choosePlanData: {
        type: '',
        prePlanNo: '',
        planName: ''
      },
      mainPlan: {
        id: '',
        name: ''
      },
      mainChooseBoolean: false
    }
  },
  computed: {
    bodyWrapper() {
      return this.$refs.bodyWrapper;
    }
  },
  mounted() {
    this.queryData = this.$route.query
    this.dateVal = this.$moment().format('yyyy-M')
    this.bindEvents()
  },
  destroyed() {
    this.unbindEvents();
  },
  methods: {
    async defaultOpen() {
      await this.getStoreType()
      await this.getPlanlist()
      await this.getMainInfo()
    },
    bindEvents() {
      this.bodyWrapper.addEventListener('scroll', this.syncPostion, {passive: true});
    },
    unbindEvents() {
      this.bodyWrapper.removeEventListener('scroll', this.syncPostion, {passive: true});
    },
    syncPostion: throttle(20, function () {
      const {scrollTop, scrollLeft, scrollWidth, offsetWidth} = this.bodyWrapper
      const {leftFixedBodyWrapper, rightFixedBodyWrapper, chooseTypeWrapper, headerWrapper} = this.$refs

      if (headerWrapper) headerWrapper.scrollLeft = scrollLeft;
      if (chooseTypeWrapper) chooseTypeWrapper.scrollLeft = scrollLeft;
      if (leftFixedBodyWrapper) leftFixedBodyWrapper.scrollTop = scrollTop;
      if (rightFixedBodyWrapper) rightFixedBodyWrapper.scrollTop = scrollTop;

      const maxScrollLeftPosition = scrollWidth - offsetWidth - 1;
      if (scrollLeft >= maxScrollLeftPosition) {
        this.scrollPosition = 'right';
      } else if (scrollLeft === 0) {
        this.scrollPosition = 'left';
      } else {
        this.scrollPosition = 'middle';
      }
    }),
    handleFixedMousewheel(event, data) {
      const bodyWrapper = this.bodyWrapper;
      if (Math.abs(data.spinY) > 0) {
        const currentScrollTop = bodyWrapper.scrollTop;
        if (data.pixelY < 0 && currentScrollTop !== 0) {
          event.preventDefault();
        }
        if (data.pixelY > 0 && bodyWrapper.scrollHeight - bodyWrapper.clientHeight > currentScrollTop) {
          event.preventDefault();
        }
        bodyWrapper.scrollTop += Math.ceil(data.pixelY / 5);
      } else {
        bodyWrapper.scrollLeft += Math.ceil(data.pixelX / 5);
      }
    },
    async handleChange() {
      await this.getStoreType()
      await this.getPlanlist()
      await this.getMainInfo()
    },
    // 是否可选 判断
    chooseBoolean(data) {
      if (data) {
        let filterData = data.filter(item => item.routeStatus === '2')
        if (filterData && filterData.length > 0) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    // 获取业代类型
    async getStoreType() {
      let result = await ROUTE_PLANNING_API.orgBuspreList({
        orgId: this.queryData ? this.queryData.organizeId : '',
        yearMonth: this.dateVal
      })
      if (result.code === '200') {
        this.bindSalesType = []
        this.businessType = result.data
        for (let item of result.data) {
          this.bindSalesType.push({
            ...item,
            bindPlanNo: '', // 绑定草稿计划 id
            bindPlanName: '', // 绑定草稿计划 名称
            status: '' // 当前数据 是否重复
          })
        }
      }
    },
    // 获取预(草稿)计划
    async getPlanlist() {
      let result = await ROUTE_PLANNING_API.draftPlanList({
        orgId: this.queryData ? this.queryData.organizeId : '',
        yearMonth: this.dateVal,
        isLoading: false,
        areaType: 2
      })
      if (result.code === '200') {
        this.planData = result.data
      }
    },
    // 获取主计划相关
    async getMainInfo() {
      let result = await ROUTE_PLANNING_API.getMainPlan({
        orgId: this.queryData ? this.queryData.organizeId : '',
        yearMonth: this.dateVal
      })
      if (result.code === '200') {
        this.mainPlan = {
          id: result.data.planNo,
          name: result.data.planName
        }
        this.planApproveStatus = result.data.planApproveStatus  // 当前主计划 审批状态
        this.planStatus = result.data.planStatus  // 当前主计划 状态
        this.editBoolean = this.btnEditMethod()
        if (result.data.bind && result.data.bind.length > 0) {
          for (let item of this.bindSalesType) {
            for (let bindItem of result.data.bind) {
              if (item.salesTypeCode === bindItem.salesTypeNo) {
                this.$set(item, 'bindPlanNo', bindItem.prePlanNo)
                this.$set(item, 'bindPlanName', bindItem.prePlanName)
              }
            }
          }
          this.mainChooseBoolean = true
        } else {
          this.mainChooseBoolean = false
        }
      }
    },
    // 是否可操作
    btnEditMethod() {
      if (this.planApproveStatus && this.planStatus) {
        if (this.planStatus === '2') {
          // 审批中
          if (this.planApproveStatus === '3') {
            // 审批中 被驳回
            let yetBind = this.bindSalesType.filter(item => item.bindPlanNo)
            if (yetBind.length === 0) {
              return false
            } else {
              return true
            }
          } else {
            return false
          }
        }
        if (this.planStatus === '3') {
          // 审批通过
          return false
        }
        if (this.planStatus === '1') {
          // 未提交
          let yetBind = this.bindSalesType.filter(item => item.bindPlanNo)
          if (yetBind.length === 0) {
            return false
          } else {
            return true
          }
        }

      } else {
        return false
      }
    },
    editDisabled(saleItem) {
      if (saleItem.routeStatus !== '2') {
        // 路线 未生成/失败/错误
        return true
      } else {
        return false
      }
    },
    closeDialog() {
      this.$parent.hide()
    },
    choosePlan(type, prePlanNo, item, disabled) {
      if (!disabled) {
        return
      }

      if (this.choosePlanData.prePlanNo === prePlanNo) {
        this.choosePlanData = {
          type: '',
          prePlanNo: '',
          yearMonth: ''
        }
      } else {
        this.choosePlanData = {
          type: type,
          prePlanNo: prePlanNo,
          yearMonth: this.dateVal
        }
      }
      if (type === 'draft') {
        this.choosePlanData.planName = item.prePlanName
      } else {
        this.choosePlanData.planName = this.mainPlan.name
      }
    },
    subData() {
      if (!this.choosePlanData.prePlanNo) {
        this.$message({
          message: '请选择一个计划',
          type: 'warning'
        })
        return
      }
      this.createPlan(this.choosePlanData)
      this.$parent.hide()
    },
    viewPlan(item, type) {
      if (type === 'draft') {
        this.$router.push({path: `/route-planning/plan-preview?planName=${item.prePlanName}&planId=${item.prePlanNo}&edit=false&planAhead=false&precinctsCode=${item.precinctTypeCode}&routeCode=${item.routeTypeCode}`})
      } else {
        this.$router.push({path: `/route-planning/plan-preview?planName=${this.mainPlan.name}&planId=${this.mainPlan.id}&edit=false&planAhead=true&precinctsCode=&routeCode=`})
      }
    }
  }
}
</script>

<style scoped lang="scss">
.reuse-wrap {
  width: 1155px;
  margin: 0 auto;
  padding-top: 5px;
}

.reuse-header {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 400;
  color: #495060;

  p {
    margin-right: 10px;
  }
}

.reuse-footer {
  display: flex;
  height: 60px;
  border-top: 1px solid #EDEDED;
  align-items: center;
  justify-content: center;

  > button {
    font-size: 12px;
    font-weight: 400;
    color: #495060;

    &:last-child {
      color: #FFFFFF;
      background: #930CEA;
    }
  }
}
</style>

<style scoped lang="scss">
$boxHeight: 300px;
$boxWidth: 1127px;
.placeholder-195 {
  width: 195px !important;
  height: 60px;
  visibility: hidden;
}

.placeholder-218 {
  width: 204px !important;
  height: 60px;
  visibility: hidden;
}

.reuse-content {
  width: 1155px;
  margin: 20px auto 0;
  position: relative;
  background-color: #fff;

  .header-type {
    width: 1127px;
    padding: 0 14px;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    font-weight: 600;
    color: #666666;
    overflow: hidden;
    position: relative;
    margin-bottom: 10px;

    .header-type-content {
      width: 1127px;

      ul {
        display: flex;
        width: 1127px;
        overflow: hidden;
      }

      li {
        height: 30px;
        flex-shrink: 0;
        width: 110px;
        margin-right: 10px;
        text-align: center;
      }
    }

    &-fixed {
      width: 200px;
      height: 30px;
      position: absolute;
      top: 0;
      left: 11px;
      background-color: #fff;
    }

    &-fixed-right {
      width: 218px;
      height: 30px;
      position: absolute;
      top: 0;
      right: 0;
      background-color: #fff;
    }
  }

  .fixed-item {
    width: 213px;
    height: 80px;
    background: #ffffff;
    border: 1px solid #ededed;
    position: absolute;
    top: 0;
  }

  .choose-plan-box {
    width: 1127px;
    height: 80px;
    position: relative;
    padding: 0 14px;

    &-left {
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
      border-radius: 40px 0px 0px 40px;
      left: 0;

      h5 {
        font-size: 14px;
        font-weight: 600;
        color: #000000;
        text-align: center;
        line-height: 80px;
      }
    }

    &-right {
      width: 216px;
      display: flex;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
      border-radius: 0px 40px 40px 0px;
      right: 0;
      align-items: center;

    }

    .preView-plan {
      width: 104px;
      height: 100%;
      line-height: 80px;
      text-align: center;
      border-right: 1px solid #EDEDED;
      font-size: 14px;
      font-weight: 500;
      color: #666666;
      cursor: pointer;
    }

    .choose-box {
      display: flex;
      width: 111px;
      height: 100%;
      align-items: center;
      cursor: pointer;
      border-radius: 0px 40px 40px 0px;

      .choose-circle {
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 16px;
        background: #FFFFFF;
        border: 2px solid #D9D9D9;
        margin-left: 20px;
      }

      .choose-circle-active {
        position: relative;
        border: 1px solid #930CEA;

        &:before {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 8px;
          content: '';
          background: #930CEA;
          position: absolute;
          top: 4px;
          left: 4px;
        }
      }
    }

    .disabled {
      cursor: not-allowed;
      color: grey;
      background-color: #EDEDED;
    }

    .borderRight {
      border-right: 1px solid #c1c1c1;
    }

    .choose-txt {
      font-size: 14px;
      font-weight: 600;
      color: #495060;
      margin-left: 10px;
    }

    .choose-txt-active {
      color: #930CEA;
    }

    &-content {
      display: flex;
      width: $boxWidth;
      height: 82px;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
      align-items: center;
      border-radius: 40px;

      ul {
        display: flex;
        overflow: hidden;
      }

      li {
        flex-shrink: 0;
        width: 110px;
        height: 59px;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #EDEDED;
        margin-right: 10px;
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color: #495060;

        .no-plan {
          display: inline-block;
          width: 110px;
          background-color: #EDEDED;
          font-size: 14px;
          line-height: 59px;
        }

        .bind-type {
          height: 48px;
          padding: 5px;
          color: #087E42;
          background: #D1F2E1;
          border-radius: 4px;
          border: 1px solid #19BE6B;
          text-align: left;
        }

        .repeat-type {
          padding: 5px;
          background: #FFE7C0;
          border-radius: 4px;
          border: 1px solid #F5A623;
          font-weight: 400;
          color: #946312;
          text-align: left;
          position: relative;
        }

        .repeat-icon {
          position: absolute;
          top: -6px;
          right: -4px;
          cursor: pointer;
        }

      }

      .placeholder-218 {
        @extend .placeholder-218;
      }

      .placeholder-195 {
        @extend .placeholder-195;
      }
    }
  }

  .plan-box {
    height: 350px;
    width: 1155px;
    position: relative;
    margin-top: 15px;
    padding: 0 14px;

    .plan-content {
      width: $boxWidth;
      height: $boxHeight;
      overflow: auto;

      ul {
        li {
          display: flex;
          margin-bottom: 15px;

          &:last-child {
            margin-bottom: 0;
          }

          .lis-item {
            flex-shrink: 0;
            width: 110px;
            height: 59px;
            background: #FFFFFF;
            border: 1px solid #EDEDED;
            margin-right: 10px;

            ::v-deep .is-disabled {
              .el-checkbox__inner {
                width: 25px;
                height: 25px;
                background-color: #EDEDED;
              }
            }

            ::v-deep .el-checkbox__inner {
              width: 25px;
              height: 25px;
            }

            .checkIcon {
              width: 25px;
              height: 25px;
              position: relative;
              top: 6px;
            }

            .disabledClass {
            }

            .canChoose {
              ::v-deep .el-checkbox__inner {
                background-color: #fff;
              }
            }
          }

          .lis-com {
            text-align: center;
            line-height: 58px;
          }

          .no_plan {
            background: #F4F4F4;
            border: 1px solid #EDEDED;
            font-size: 14px;
            font-weight: 400;
            color: #999999;

          }

          .bind_plan {
            background: #D1F2E1;
            border: 1px solid #19BE6B;
          }

          .placeholder-218 {
            @extend .placeholder-218;
          }

          .placeholder-195 {
            @extend .placeholder-195;
          }
        }
      }
    }

    .plan-table-fixed {
      width: 205px;
      height: $boxHeight;
      position: absolute;
      top: 0;
      left: 11px;
      z-index: 10;
      overflow-x: hidden;
      overflow-y: hidden;
      background-color: #fff;

      ul {
        li {
          width: 168px;
          height: 43px;
          background: #FFFFFF;
          border: 1px solid #EDEDED;
          padding: 8px 17px;
          font-size: 14px;
          font-weight: 400;
          color: #000000;
          margin-bottom: 15px;
          cursor: pointer;

          &:last-child {
            margin-bottom: 0;
          }

          &:hover {
            color: #930CEA;
          }
        }

        /*未生成*/
        .not-generate {
          position: relative;
          padding-left: 30px;
          background: #F4F4F4;
          color: #999999;

          &:before {
            width: 24px;
            height: 59px;
            line-height: 27px;
            text-align: center;
            content: '生成中';
            background: #BFBFBF;
            border: 1px solid #EDEDED;
            position: absolute;
            top: 0;
            left: 0;
            -webkit-writing-mode: vertical-rl;
            writing-mode: vertical-rl;
            font-size: 12px;
            font-weight: 400;
            color: #FFFFFF;
          }
        }
      }
    }

    .plan-table-fixed-right {
      width: 218px;
      height: $boxHeight;
      position: absolute;
      top: 0;
      right: 30px;
      z-index: 10;
      overflow-x: hidden;
      overflow-y: hidden;
      background-color: #fff;

      ul {
        li {
          display: flex;
          width: 216px;
          height: 59px;
          background: #FFFFFF;
          border-radius: 4px;
          border: 1px solid #EDEDED;
          margin-bottom: 15px;
          cursor: pointer;

          &:last-child {
            margin-bottom: 0;
          }

          &:hover {
            color: #930CEA;
          }

          .preView-plan {
            width: 104px;
            height: 100%;
            line-height: 60px;
            text-align: center;
            border-right: 1px solid #EDEDED;
            font-size: 14px;
            font-weight: 500;
            color: #666666;
            cursor: pointer;
          }

          .choose-box {
            display: flex;
            width: 111px;
            height: 100%;
            align-items: center;
            cursor: pointer;

            .choose-circle {
              display: inline-block;
              width: 16px;
              height: 16px;
              border-radius: 16px;
              background: #FFFFFF;
              border: 2px solid #D9D9D9;
              margin-left: 20px;
            }

            .choose-circle-active {
              position: relative;
              border: 1px solid #930CEA;

              &:before {
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 8px;
                content: '';
                background: #930CEA;
                position: absolute;
                top: 4px;
                left: 4px;
              }
            }
          }

          .disabled {
            cursor: not-allowed;
            color: grey;
            background-color: #EDEDED;
          }

          .choose-txt {
            font-size: 14px;
            font-weight: 600;
            color: #495060;
            margin-left: 10px;
          }

          .choose-txt-active {
            color: #930CEA;
          }
        }
      }
    }


  }
}

.shadow-left {
  width: 80px;
  height: 90%;
  position: absolute;
  top: 0;
  left: 210px;
  background: linear-gradient(90deg, #F8F8F9 0%, rgba(248, 248, 249, 0) 100%);
}

.shadow-right {
  width: 80px;
  height: 90%;
  position: absolute;
  top: 0;
  right: 217px;
  background: linear-gradient(270deg, #F8F8F9 0%, rgba(248, 248, 249, 0) 100%);
}

.dialog-content {
  h5 {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    text-align: left;
    margin-bottom: 10px;
  }
}
</style>
<style scoped>
/*滚动条样式*/
::-webkit-scrollbar {
  width: 0;
  height: 1px;
  position: relative;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

::-webkit-scrollbar-thumb {
  border-radius: 1px;
  background-color: #930cea;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #ededed;
  border-radius: 1px;
}
</style>
