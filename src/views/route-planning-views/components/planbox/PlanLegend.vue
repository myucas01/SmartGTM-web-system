<!--图例-->
<template>
  <div class="legend-wrap">
    <!-- 收起-->
    <div class="close" v-if="!expandStatus" @click="setexpandStatus()">
      <span></span>
    </div>
    <!-- 展开-->
    <div class="expand" v-show="expandStatus">
      <div class="legend-header">
        <p>
          图例<el-tooltip placement="bottom-start">
            <div slot="content">
              点位：
              <br />
              从区域角度来、客户规模角度、服务日角度区分展示各区域所属点位颜色
              <br />
              线路拜访日：
              <br />
              展示拜访日颜色图例，可以控制已生成路线的点位和线路打开和关闭
              <br />
            </div>
            <svg-icon icon-class="wenhao" class-name="icon-tip" />
          </el-tooltip>
        </p>
        <div class="close-btn" @click="setexpandStatus()"><span></span></div>
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
        <div class="no_plan_store_day" v-if="newpointVal === 1">
          <span>无服务日</span>
        </div>
        <div class="visit-box" v-if="newpointVal === 1">
          <p><i class="y"></i> 一周一访</p>
          <p><i class="f"></i>一周多访</p>
          <p><i class="s"></i>多周一访</p>
        </div>
      </div>
      <!-- 路线拜访日 -->
      <div class="route-wrap">
        <p class="route-header">路线拜访日</p>
        <div class="route-content">
          <span
            class="linelist"
            v-for="(item, index) of weekOption"
            :key="item.name"
            :label="item.name"
          >
            <p
              class="icon-line"
              :style="{ backgroundColor: routLineColor[index] }"
            ></p>
            {{ item.name }}</span
          >
        </div>
      </div>
      <!-- 路线样式 -->
      <div class="route-wrap">
        <p class="route-header">路线样式</p>
        <div class="route-content linestyle">
          <el-radio-group v-model="newrouteStyle" @change="ChangerouteStyle">
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
export default {
  name: 'mapLegend',
  props: ['pointVal'],
  data() {
    return {
      pointOption: [
        // 点位相关
        {
          id: 0,
          name: '区域归属',
          children: []
        },
        {
          id: 1,
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
      ],
      expandStatus: false,
      routLineColor: [
        //   路线颜色
        '#C50404',
        '#2716C4',
        '#4C8C06',
        '#4A90E2',
        '#007D86',
        '#83562E',
        '#D0A052'
      ],
      newpointVal: 0,
      newrouteVisit: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      newrouteStyle: '直线'
    }
  },
  methods: {
    setexpandStatus() {
      this.expandStatus = !this.expandStatus
    },
    /**
     * 点位 change
     */
    pointChange(value) {
      this.$emit('getpointChange', value)
      const { pointOption } = this
      let nowDt = pointOption[value]
      if (nowDt.children && nowDt.children.length > 0) {
        this.pointTypeChild = nowDt.children
      } else {
        this.pointTypeChild = []
      }
    },
    ChangerouteStyle(value) {
      this.$emit('getlinstyleChange', value)
    }
  }
}
</script>

<style scoped lang="scss">
.legend-wrap {
  border-radius: 4px 4px 0px 0px;
  position: absolute;
  bottom: 75px;
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

  .tipscontent {
    width: 100px;
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
          .potential {
            height: 12px;
            width: 12px;
            border-radius: 14px;
            background-color: #13b42f;
            border: 1px solid #ffffff;
            display: inline-block;
            margin-right: 3px;
            vertical-align: middle;
          }
          .else {
            height: 12px;
            width: 12px;
            border-radius: 14px;
            background-color: #126ee5;
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
    .linestyle {
      padding-left: 15px !important;
    }
    .route-content {
      padding-left: 20px;
      padding: 10px 0px;
      background: #102f63;
      box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.5);
      .icon-line {
        display: inline-block;
        width: 25px;
        height: 2px;
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
        display: inline-block;
        margin: 5px 10px 5px 0;
        text-align: center;
        width: 110px;
      }
    }
  }

  .font_color_#fff {
    color: #fff;
  }
}
</style>
