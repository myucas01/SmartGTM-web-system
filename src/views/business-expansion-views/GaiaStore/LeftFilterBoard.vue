<!--
    左侧售点盘点控制面板/问题门店控制面板：包括三个选项卡-radio筛选器，selection筛选器，店群画像echarts列表
-->
<template>
  <div class="leftFilerBoard" id="left_filter_board">
    <!--顶部面包屑-->
    <section class="breadcrumb">
      <i class="el-icon-s-fold" style="cursor: pointer" @click="showUp"></i>
      <span class="text">{{ '售点拓展 / GAIA门店' }}</span>
    </section>
    <!--顶部选项卡按钮-->
    <section class="tabs-wrap">
      <div
        class="tab-item"
        v-for="(item, idx) in tabsData"
        :key="idx"
        @click="handleChange(item, idx)"
        :class="{ active: activeIndex === idx }"
      >
        <svg-icon
          v-if="item.text === '门店筛选'"
          icon-class="address-line"
          class-name="icon-item"
        ></svg-icon>
        <svg-icon
          v-else-if="item.text === '属性筛选'"
          icon-class="document-bag"
          class-name="icon-item"
        ></svg-icon>
        <i v-else class="icon-item" :class="item.icon"></i>
      </div>
    </section>
    <section class="content-wrap">
      <p class="title">{{ activeTitle }}</p>
      <div class="content">
        <!--门店属性过滤器-->
        <attribute-filter
          v-show="activeTitle === '属性筛选'"
          @generateEcharts="generateEcharts"
          v-bind="$attrs"
          v-on="$listeners"
        />
        <!--店群画像Echarts-->
        <store-charts
          v-show="activeTitle === '店群画像'"
          v-bind="$attrs"
          v-on="$listeners"
        />
      </div>
    </section>
  </div>
</template>

<script>
import AttributeFilter from './attributeFilter'
import StoreCharts from './storeCharts'

export default {
  name: 'left_filter_board',
  components: {
    AttributeFilter,
    StoreCharts
  },
  data() {
    return {
      // 选项卡根据路由得到不同配置
      tabsData: [
        { id: 111, text: '属性筛选', icon: 'el-icon-goods' },
        { id: 222, text: '店群画像', icon: 'el-icon-s-data' }
      ],
      // 当下选中的选项卡
      activeIndex: 1,
      // 当前选项卡标题
      activeTitle: '店群画像',
      // 修改后的radio过滤数据，将传递给select-option中 (3个选项卡才会出现)
      change_radio_data: ''
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 左侧过滤面板隐藏/显示
    showUp() {
      this.$emit('change', false)
    },
    handleChange(item, idx) {
      if (item.text === '店群画像') {
        this.$message({
          message: '请先筛选标签，并点击⽣成按钮进⾏店群画像',
          type: 'warning'
        })
        return
      } else {
        this.$emit('StoreGrouPortrait',false)
      }
      this.activeIndex = idx
      this.activeTitle = item.text
    },
    /**
     * @description 生成画像
     */
    generateEcharts() {
      const idx = this.tabsData.length - 1
      this.activeIndex = idx
      this.activeTitle = this.tabsData[idx].text
      this.$emit('StoreGrouPortrait',true)
    }
  }
}
</script>

<style scoped lang="scss">
// 左侧控制面板
.leftFilerBoard {
  width: 340px;
  background-color: #0a2757;
  transition: all 0.2s;
  .breadcrumb {
    height: 40px;
    line-height: 40px;
    text-align: left;
    background: #081f45;
    position: relative;
    i.el-icon-s-fold {
      font-size: 15px;
      margin: 0 14px;
    }
    .text {
      font-size: 15px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
    }
    i.el-icon-share {
      font-size: 20px;
      position: absolute;
      bottom: 10px;
      right: 10px;
      cursor: pointer;
    }
    .export-icon {
      font-size: 20px;
      position: absolute;
      bottom: 10px;
      right: 10px;
      cursor: pointer;
    }
  }
  .tabs-wrap {
    display: flex;
    height: 26px;
    box-shadow: 0px 12px 8px -12px rgba(0, 0, 0, 0.5);
    .tab-item {
      flex: 1;
      line-height: 26px;
      background: #0a2757;
      text-align: center;
      cursor: pointer;
      .icon-item {
        font-size: 18px;
        color: #ffffff;
        color: #415982;
        padding-top: 5px;
      }
      &.active {
        background: #133773;
        box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.5),
          1px 0px 0px 0px rgba(0, 0, 0, 0.5);
        .icon-item {
          color: #ffffff;
        }
      }
    }
  }
  .content-wrap {
    .title {
      height: 40px;
      line-height: 40px;
      text-align: left;
      font-size: 18px;
      font-weight: 600;
      color: #ffffff;
      padding-left: 15px;
    }
    .content {
      width: 100%;
      height: calc(100vh - 155px);
    }
  }
}
</style>
