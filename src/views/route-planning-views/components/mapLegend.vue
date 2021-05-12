<!--图例-->
<template>
  <div class="legend-wrap">
    <!-- 收起-->
    <div class="close" v-if="!expandStatus" @click="expandStatus = true">
      <span></span>
    </div>
    <!-- 展开-->
    <div class="expand" v-show="expandStatus">
      <div class="legend-header">
        <p>图例<el-tooltip placement="top">
          <div slot="content">
            <span>点位：从区域角度来、售点分级角度、服务日角度区分展示各区域所属点位颜色</span><br/>
            <span>岗位图层：展示已计划、未计划（未进入计划的门店或者手动移出线路的门店）、经销商的分布情况</span><br/>
            <span>线路拜访日：展示拜访日颜色图例，可以控制已生成路线的点位和线路打开和关闭</span><br/>
            <span>线路样式：切换线路的展示方式，直线或者曲线</span>
          </div>
          <svg-icon icon-class="wenhao" class-name="icon-tip"/>
        </el-tooltip></p>
        <div class="close-btn" @click="expandStatus = false"><span></span></div>
      </div>
      <!-- 点位 -->
      <div class="point-wrap">
        <div class="point-header">点位</div>
        <div class="point-content">
          <el-radio-group v-model="newpointVal" @change="pointChange">
            <el-radio
              v-for="(item, index) of pointOption"
              :key="item.name"
              :label="index"
              class="smart_radio_deep font_color_#fff"
              >{{ item.name }}
            </el-radio>
          </el-radio-group>
        </div>
        <ul class="store-type" v-if="pointTypeChild.length > 0">
          <li v-for="item of pointTypeChild" :key="item.icon">
            <span
              ><p :class="item.icon"></p>
              {{ item.name }}</span
            >
          </li>
        </ul>
        <!-- 未规划的服务日 -->
        <div class="no_plan_store_day" v-if="newpointVal === 2">
          <span>无服务日</span>
        </div>
        <div class="visit-box" v-if="newpointVal === 1 || newpointVal === 2">
          <p><i class="y"></i> 一周一访</p>
          <p><i class="f"></i>一周多访</p>
          <p><i class="s"></i>多周一访</p>
        </div>
        <!-- 重合点 -->
        <div class="no_plan_store_day" v-auth="'lineplan:buildmapshow:coincidentpoint'">
          <el-checkbox v-model="repeatChecked">重合点</el-checkbox>
        </div>
      </div>
      <!-- 岗位图层 -->
      <div class="job-wrap">
        <p class="job-header">岗位图层</p>
        <div class="job-content">
          <el-checkbox-group
            v-model="newjobLayer"
            @change="handleCheckedJobChange"
          >
            <el-checkbox
              v-for="item of jobOption"
              :key="item.name"
              :label="item.name"
              class="font_color_#fff"
              >{{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <!-- 路线拜访日 -->
      <div class="route-wrap">
        <p class="route-header">路线拜访日</p>
        <div class="route-content">
          <el-checkbox-group
            v-model="newrouteVisit"
            @change="handleCheckedRouteChange"
          >
            <el-checkbox
              v-for="(item, index) of weekOption"
              :key="item.name"
              :label="item.name"
            >
              <i
                class="icon-line"
                :style="{ backgroundColor: routLineColor[index] }"
              ></i>
              <span>{{ item.name }}</span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <!-- 路线样式 -->
      <div class="point-wrap route-style-wrap" v-if="showRouteType">
        <p class="job-title">路线样式</p>
        <div class="route-style-content">
          <el-radio-group
            v-model="newrouteStyle"
            @change="handleRouteTypeChange"
          >
            <el-radio
              label="直线"
              id="直线"
              class="smart_radio_deep font_color_#fff"
              >直线
            </el-radio>
            <el-radio
              label="曲线"
              id="曲线"
              class="smart_radio_deep font_color_#fff"
              >曲线
            </el-radio>
          </el-radio-group>
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'mapLegend',
  computed: {
    ...mapGetters('routerPlanning', [
      'routLineColor',
      'pointVal',
      'jobLayer',
      'routeVisit',
      'routeStyle',
      'showRouteType'
    ])
  },
  data() {
    return {
      pointOption: [
        // 点位相关
        {
          id: 1,
          name: '区域归属',
          children: []
        },
        {
          id: 2,
          name: '售点分级',
          children: [
            {
              icon: 'hightValue',
              name: 'A'
            },
            {
              icon: 'basis',
              name: 'B'
            },
            {
              icon: 'else',
              name: '其他'
            }
          ]
        },
        {
          id: 3,
          name: '服务日'
        }
      ], // 点位
      pointTypeChild: [], // 点位 父类型 归属 子类型
      weekOption: [
        {
          name: '周一',
          status: false
        },
        {
          name: '周二',
          status: false
        },
        {
          name: '周三',
          status: false
        },
        {
          name: '周四',
          status: false
        },
        {
          name: '周五',
          status: false
        },
        {
          name: '周六',
          status: false
        },
        {
          name: '周日',
          status: false
        }
      ], // 路线拜访日
      jobOption: [
        {
          id: 'plan',
          name: '已计划'
        },
        {
          id: 'noPlan',
          name: '未计划'
        },
        {
          id: 'area',
          name: '区域'
        },
        {
          id: 'dealer',
          name: '特约批'
        }
      ],
      expandStatus: false,
      newpointVal: 0,
      newjobLayer: ['区域'],
      newrouteVisit: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      newrouteStyle: '直线',
      repeatChecked: false
    }
  },
  watch: {
    pointVal(newval) {
      this.newpointVal = newval
    },
    jobLayer(newval) {
      this.newjobLayer = newval
    },
    routeVisit(newval) {
      this.newrouteVisit = newval
    },
    routeStyle(newval) {
      this.newrouteStyle = newval
    },
    repeatChecked(newval) {
      this.$parent.$refs.LeftControl.$refs.Business.coincidenceFlag=newval?'y':'n'
    }
  },
  methods: {
    pointChange(value) {
      const { pointOption } = this
      let nowDt = pointOption[value]
      if (nowDt.children && nowDt.children.length > 0) {
        this.pointTypeChild = nowDt.children
      } else {
        this.pointTypeChild = []
      }
      // 存储 当前 点位查看类型
      this.$store.dispatch('routerPlanning/setLegendPoint', value)
    },
    // 岗位 change
    handleCheckedJobChange(value) {
      // console.log(value)
      // 存储 当前 岗位 查看类型
      this.$store.dispatch('routerPlanning/setLegendJobLayer', value)
    },
    // 路线
    handleCheckedRouteChange(value) {
      // console.info(value)
      // 存储 当前 路线 查看类型
      this.$store.dispatch('routerPlanning/setLegendRouteVisit', value)
    },
    // 路线样式
    handleRouteTypeChange(value) {
      // 存储 当前 路线  样式 查看类型
      this.$store.dispatch('routerPlanning/setLegendRouteStyle', value)
    }
  }
}
</script>

<style scoped lang="scss">
.legend-wrap {
  background: #102f63;
  border-radius: 4px 4px 0px 0px;
  position: fixed;
  bottom: 0;
  right: 0;

  ::v-deep.el-radio__inner::after {
    width: 6px;
    height: 6px;
  }

  ::v-deep .el-checkbox {
    color: #fff;
    margin-right: 15px;
    font-size: 12px;
  }

  ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #fff;
    font-size: 12px;
  }
  ::v-deep .el-checkbox__label {
    font-size: 12px;
  }

  .close {
    width: 28px;
    height: 28px;
    background: rgba(147, 12, 234, 1);
    border-radius: 2px;
    position: relative;
    cursor: pointer;

    span {
      display: inline-block;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0px 9px 12px 9px;
      border-color: transparent transparent #fff transparent;
      position: absolute;
      bottom: 8px;
      left: 5px;
    }
  }

  .expand {
    width: 365px;
    padding-bottom: 15px;
    background-color: #08214a;
    border-radius: 3px;

    .legend-header {
      height: 35px;
      background: #08214a;
      border-radius: 4px 4px 0px 0px;

      p {
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
        line-height: 35px;
        text-indent: 10px;
      }

      .close-btn {
        width: 28px;
        height: 28px;
        background: rgba(147, 12, 234, 1);
        border-radius: 2px;
        position: absolute;
        top: 4px;
        right: 4px;
        cursor: pointer;

        span {
          display: inline-block;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 12px 9px 0 9px;
          border-color: #fff transparent transparent transparent;
          position: absolute;
          top: 8px;
          left: 5px;
        }
      }
    }
  }

  .point-wrap {
    background-color: #0a2757;
    position: relative;
    box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.5);

    .point-header {
      height: 35px;
      line-height: 35px;
      font-size: 13px;
      font-weight: 500;
      color: #fff;
      text-indent: 10px;
      background-color: #0a2757;
    }

    .point-content {
      display: flex;
      width: 365px;
      padding-left: 15px;
      position: absolute;
      top: 12px;
      left: 48px;

      .font_color_#fff {
        color: #fff;
      }

      ::v-deep .el-radio__label {
        font-size: 12px;
      }
    }
    .store-type {
      display: flex;
      font-size: 12px;
      font-weight: 400;
      color: #ffffff;
      padding: 10px 0 10px 20px;
      background-color: #102f63;
      li {
        margin-right: 30px;
        span {
          .hightValue {
            height: 12px;
            width: 12px;
            border-radius: 14px;
            background-color: #fd522e;
            border: 1px solid #ffffff;
            display: inline-block;
            margin-right: 3px;
            vertical-align: middle;
          }
          .basis {
            height: 12px;
            width: 12px;
            border-radius: 14px;
            background-color: #fcbe0d;
            border: 1px solid #ffffff;
            display: inline-block;
            margin-right: 3px;
            vertical-align: middle;
          }
          .else {
            height: 12px;
            width: 12px;
            border-radius: 14px;
            background-color: #13b42f;
            border: 1px solid #ffffff;
            display: inline-block;
            margin-right: 3px;
            vertical-align: middle;
          }
        }
      }
    }
    .visit-box {
      display: flex;
      align-items: center;
      padding: 3px 0 12px 20px;
      background-color: #102f63;
      p {
        font-size: 12px;
        font-weight: 400;
        color: #ffffff;
        margin-right: 40px;
      }
      i {
        position: relative;
        top: 2px;
        margin-right: 5px;
      }
      .y {
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 1px solid #ffffff;
        border-radius: 12px;
      }
      .f {
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 1px solid #ffffff;
      }
      .s {
        display: inline-block;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 7px 12.1px 7px;
        border-color: transparent transparent #ffffff transparent;
      }
    }
  }
  .job-wrap {
    height: 78px;
    .job-header {
      height: 35px;
      line-height: 35px;
      font-size: 13px;
      font-weight: 500;
      color: #fff;
      text-indent: 10px;
      background-color: #0a2757;
    }
    .job-content {
      overflow: hidden;
      top: 35px;
      padding-left: 20px;
      line-height: 42px;
      left: 0;
      height: 42px;
      background: #102f63;
      box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.5);
      ::v-deep .el-checkbox-group {
        display: flex;
        flex-wrap: wrap;
        height: 40px;
      }
      ::v-deep .el-checkbox {
        color: #fff;
        margin-right: 20px;
        font-size: 12px;
      }
    }
  }
  .route-wrap {
    margin-bottom: 1px;

    .route-header {
      height: 35px;
      line-height: 35px;
      background: #0a2757;
      font-size: 13px;
      font-weight: 600;
      color: #ffffff;
      text-indent: 15px;
    }

    .route-content {
      padding-left: 20px;
      padding-top: 15px;
      background: #102f63;
      box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.5);

      ::v-deep .el-checkbox-group {
        display: flex;
        flex-wrap: wrap;

        .el-checkbox {
          width: 33%;
          flex-shrink: 0;
          margin-right: 0;
          margin-bottom: 10px;
        }

        .icon-line {
          display: inline-block;
          width: 25px;
          height: 1px;
          background-color: #c50404;
          border: 1px solid #ffffff94;
          border-radius: 20px;
          position: relative;
          top: -3px;
          margin-right: 3px;
        }
        span {
          font-size: 12px;
          font-weight: 400;
          color: #ffffff;
        }
      }
    }
  }

  .route-style-wrap {
    @extend .point-wrap;

    background: #0a2757;
    .job-title {
      height: 35px;
      line-height: 35px;
      color: #fff;
      text-indent: 15px;
      font-weight: 600;
    }
    .route-style-content {
      margin-left: 15px;
      position: absolute;
      top: 10px;
      left: 58px;
    }
    ::v-deep .el-radio {
      font-size: 12px;
    }
    ::v-deep .el-radio__label {
      font-size: 12px;
    }
  }

  .font_color_#fff {
    color: #fff;
  }
  .no_plan_store_day {
    display: flex;
    font-size: 12px;
    font-weight: 400;
    color: #ffffff;
    padding: 10px 0 10px 20px;
    background-color: #102f63;
    position: relative;
    span {
      display: inline-block;
      font-size: 12px;
      font-weight: 600;
      color: #ffffff;
      text-indent: 23px;
      &:before {
        display: inline-block;
        content: '';
        width: 12px;
        height: 12px;
        border-radius: 12px;
        background: #666666;
        border: 1px solid #ffffff;
        position: absolute;
        top: 12px;
        left: 20px;
      }
      &:after {
        content: '';
        width: 6px;
        height: 1px;
        background-color: #fff;
        position: absolute;
        top: 18px;
        left: 24px;
      }
    }
  }
}
</style>
