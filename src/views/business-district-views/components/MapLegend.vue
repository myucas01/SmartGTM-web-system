<!--图例-->
<template>
  <div class="legend-wrap">
    <!-- 异常商圈  -->
    <div class="unusual-box">
      <span>异常商圈</span>
      <el-switch
          @change="abnormalHandle"
          v-model="unusualSwitchStatus"
          active-color="#930CEA"
          inactive-color="rgb(228 222 222)">
      </el-switch>
    </div>
    <!-- 区域形态  -->
    <div class="regional-box">
      <p class="regional-box-titles">区域形态</p>
        <ul class="regional-uls">
          <li v-for="(item,index) in regionalList" :key="index">
            <i class="icon-color" :style="{background: item.proColor,opacity: item.proDiaphaneity}"/>
            <el-tooltip
                class="item"
                effect="dark"
                :content="item.levelName"
                placement="top-start">
            <span>{{item.levelName | textEllipsis(7)}}</span>
            </el-tooltip>
          </li>
        </ul>
    </div>
  </div>
</template>

<script>
// 引入 过滤器
import {textEllipsis} from '@/util/filters'
import {mapGetters} from 'vuex'
export default {
  name: "mapLegend",
  props:['regionalList'],
  data() {
    return {
      unusualSwitchStatus: false
    }
  },
  filters: {
    textEllipsis
  },
  computed: {
    ...mapGetters('businessPreview', ['operationCode', 'regionCode', 'abnormalBusinessStatus', 'deleteBusiness']),
  },
  watch: {
    abnormalBusinessStatus() {
      if(!this.abnormalBusinessStatus) {
        this.unusualSwitchStatus = this.abnormalBusinessStatus
      }
    }
  },
  methods: {
    // 开启/关闭 异常商圈
    abnormalHandle(val) {
      console.info('开启/关闭 异常商圈', val)
      this.$store.commit('businessPreview/SET_ABNORMAL_BUSINESS_STATUS', val)
    }
  }
}
</script>

<style scoped lang="less">
.legend-wrap {
  position: fixed;
  bottom: 15px;
  right: 0;
  .unusual-box {
    width: 158px;
    height: 32px;
    line-height: 32px;
    background: #0A2757;
    border-radius: 19px;
    border: 1px solid #930CEA;
    position: absolute;
    top: -40px;
    right: 0;
    span{
      font-size: 14px;
      font-weight: 400;
      color: #FFFFFF;
      position: relative;
      margin-left: 18px;
      &::before{
        display: inline-block;
        content: '';
        width: 15px;
        height: 15px;
        background: rgba(147, 12, 234, 0.6);
        border-radius: 2px;
        border: 1px solid #930CEA;
        position: relative;
        top: 3px;
        margin-right: 10px;
      }
    }
    /deep/ .el-switch{
      width: 30px;
      height: 18px;
      position: relative;
      top: -2px;
      left: 18px;
    }
  }
  .regional-box{
    display: flex;
    height: 30px;
    margin-top: 12px;
    background: #0A2757;
    border-radius: 2px;
    border: 1px solid #4B1F98;
    .regional-box-titles{
      width: 64px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      background: #930CEA;
      border-radius: 2px;
      border: 1px solid rgba(0, 0, 0, 0.05);
      font-size: 12px;
      font-weight: 400;
      color: #FFFFFF;
      position: relative;
      top: 1px;
      left: 1px;
    }
    .regional-uls{
      display: flex;
      align-items: center;
      align-content: center;
      margin-left: 25px;
      line-height: 20px;
      li{
        font-size: 12px;
        font-weight: 400;
        color: #FFFFFF;
        margin-right: 20px;
        .icon-color{
          display: inline-block;
          width: 16px;
          height: 16px;
          border-radius: 2px;
          position: relative;
          top: 3px;
          margin-right: 3px;
        }
      }
    }
  }
}
</style>