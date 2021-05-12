<!--
    店铺详情信息面板
-->
<template>
  <div
    class="storeDetailBoard"
    :class="{
      storeDetailBoardShow: isShowBoard,
      storeDetailBoardSmallSize: is_fit_small_size
    }"
    id="main_customers"
  >
    <div class="triangleMark"></div>
    <!--头部-->
    <div class="headerInfo">
      <span class="headerText">门店详情</span>
      <span
        class="el-icon-close closeIcon"
        @click="closeBoard"
        title="关闭门店详情"
      ></span>
    </div>
    <!--属性列表-->
    <div class="paramList">
      <div class="storeName">{{ otherInfo.seedName || '--' }}</div>
      <div class="perParam address">
        <span class="el-icon-location"></span>
        {{ otherInfo.storeAddress || '--' }}
      </div>
      <div class="perParam phoneNum">
        <span class="el-icon-phone"></span> {{ otherInfo.tel || '--' }}
      </div>
      <div class="perParam storeType">
        <span class="el-icon-tickets"></span> {{ otherInfo.storeType || '--' }}
      </div>
      <div class="perParam distanceNum">
        <svg-icon icon-class="location-point" class-name="locationIcon" />
        {{ otherInfo.storeEffect || '--' }}
        <span v-show="otherInfo.storeEffect">m</span>
      </div>
    </div>
    <!--事实标签-->
    <div class="labelsArea factLabels">
      <div class="labelTitle">事实标签</div>
      <template v-if="otherInfo.factLabel&&otherInfo.factLabel.length>0">
        <div class="labelsContainer">
          <span
            v-for="(tag, index) in otherInfo.factLabel"
            :key="index"
            class="perLabel"
            :class="{selftStyle:tag.type === 'SELF'}"
            >{{ tag.name }}</span
          >
        </div>
      </template>
    </div>
    <!--模型标签-->
    <div class="labelsArea modelLabels">
      <div class="labelTitle">模型标签</div>
      <template v-if="otherInfo.modelLabel&&otherInfo.modelLabel.length>0">
        <div class="labelsContainer">
          <span
            v-for="(tag, index) in otherInfo.modelLabel"
            :key="index"
            class="perLabel"
            >{{ tag }}</span
          >
        </div>
      </template>
    </div>
    <!--月成交折线图-->
    <!-- <div class="chartsArea monDealLineChart">
			<div class="lineTitle">月成交次数</div>
			<div class="chartContainer" id="mon_deal_line_chart">
				<chart :options="X_option" :autoResize="true"></chart>
			</div>
		</div> -->
    <!--月销量折线图-->
    <!-- <div class="chartsArea monSaleLineChart">
			<div class="lineTitle">月销量</div>
			<div class="chartContainer" id="mon_sale_line_chart">
				<Chart :options="Y_option" :autoResize="true"></Chart>
			</div>
		</div> -->
  </div>
</template>

<script>
// import * as filtersFun from '@/util/filters.js'
/*---------------------导入商机导航接口API---------------------*/
// import BUSINESS_NAVIGATION_API from '../../../api/business_navigate_api'
// import Chart from '@/components/Chart.vue'
export default {
  data() {
    return {
      // 店铺名
      // name: '--',
      // 地址
      // address: '--',
      // 手机号
      // tel: '--',
      // 门店类型
      // storeType: '',
      // 距离
      // distance: '--',
      // 事实标签
      // factTags: '',
      // 模型标签
      // modelTags: '',
      // 月成交次数配置项
      // X_option: {},
      // 月销量配置项
      // Y_option: {},
      // 是否适配小屏
      is_fit_small_size: false
    }
  },
  props: ['isShowBoard', 'otherInfo'],
  computed: {},
  components: {
    // Chart
  },
  mounted() {
    this.fitWindowSize()
  },
  methods: {
    /**
     * @description 初始化 echarts，月成交次数
     */
    // async initMonDealChart(store_id) {
    // 	let res = await BUSINESS_NAVIGATION_API.get_store_month_deal_echart(store_id)
    // 	if(res) {
    // 		this.X_option = this.lineChartObjFactory(res.axisX, res.axisY, {
    // 			color: '#F5A623'
    // 		})
    // 	}
    // },

    /**
     * @description 初始化 echarts，月销量
     */
    // async initMonSaleChart(store_id) {
    // 	let res = await BUSINESS_NAVIGATION_API.get_store_month_sale_echart(store_id)
    // 	if(res) {
    // 		this.Y_option = this.lineChartObjFactory(res.axisX, res.axisY, {
    // 			color: '#930CEA'
    // 		})
    // 	}
    // },

    /**
     * @description 折线图工厂函数，每次都会返回一个配置项
     * @param {Array<string>} x_data X轴数据(日期)
     * @param {Array<number>} y_data X轴数据(数量)
     * @param {object} configs 需要单独配置的参数，主要以样式为主
     */
    // lineChartObjFactory(x_data, y_data, configs) {
    // 	return {
    // 		// 决定折线图在容器内的大小，xy为偏移量
    // 		grid: {
    // 			left: '15%', // x 偏移量
    // 			top: '15%', // y 偏移量
    // 			width: '80%', // 宽度
    // 			height: '60%' // 高度
    // 		},
    // 		// x轴的配置
    // 		xAxis: {
    // 			type: 'category',
    // 			nameGap: 100,
    // 			data: x_data,
    // 			// x坐标轴线是否显示
    // 			axisLine: {
    // 				show: true,
    // 				lineStyle: {
    // 					color: '#798cad'
    // 				}
    // 			},
    // 			// x坐标轴刻度是否显示
    // 			axisTick: {
    // 				show: false
    // 			},
    // 			// x轴坐标label文本设置
    // 			axisLabel: {
    // 				// 字体大小10
    // 				fontSize: 10,
    // 				// 距离顶部0
    // 				padding: [0, 0, 0, 0],
    // 				color: '#CED3DD'
    // 			}
    // 		},
    // 		// y轴的配置
    // 		yAxis: {
    // 			// y轴的标题名
    // 			name: '',
    // 			type: 'value',
    // 			// y坐标轴线是否显示
    // 			axisLine: {
    // 				show: false
    // 			},
    // 			// y坐标轴刻度是否显示
    // 			axisTick: {
    // 				show: false
    // 			},
    // 			// y轴坐标label文本设置
    // 			axisLabel: {
    // 				// 字体大小10
    // 				fontSize: 10,
    // 				// 距离顶部0
    // 				padding: [0, 0, 0, 0],
    // 				color: '#CED3DD'
    // 			},
    // 			// 分几段
    // 			splitNumber: 5,
    // 			// 不要显示y轴的分割线
    // 			splitLine: {
    // 				show: true,
    // 				lineStyle: {
    // 					color: '#798cad',
    // 					type: 'dashed'
    // 				}
    // 			}
    // 		},
    // 		// 核心数据轴的配置
    // 		series: [
    // 			{
    // 				data: y_data,
    // 				type: 'line',
    // 				// 是否平滑过渡
    // 				smooth: true,
    // 				// 打点图形：空心圆
    // 				symbol: 'emptyCircle',
    // 				// 打点大小
    // 				symbolSize: 5,
    // 				// 平滑曲线的样式
    // 				lineStyle: {
    // 					// 线宽
    // 					width: 2,
    // 					color: configs.color
    // 				},
    // 				itemStyle: {
    // 					color: '#400093',
    // 					borderColor: '#ffffff',
    // 					borderWidth: 2
    // 				}
    // 			}
    // 		],
    // 		// 鼠标放上后的数据提示框
    // 		tooltip: {
    // 			trigger: 'axis',
    // 			// 十字标尺
    // 			axisPointer: {
    // 				// 不显示十字标尺
    // 				type: 'none',
    // 				// 不显示标尺xy轴的label
    // 				label: {
    // 					show: false
    // 				}
    // 			},
    // 			position: (point) => {
    // 				return [point[0] - 35, point[1] - 60]
    // 			},
    // 			// 提示框内边距 [上 右 下 左]
    // 			padding: [10, 15, 10, 15],
    // 			// 文本样式
    // 			textStyle: {
    // 				color: '#ffffff',
    // 				fontSize: 12
    // 			},
    // 			// 数据格式化，此处为 123456 => 123,456
    // 			formatter: (params) => {
    // 				return filtersFun.numFormat(params[0].data)
    // 			}
    // 		}
    // 	}
    // },

    /**
     * @description 关闭门店详情面板
     */
    closeBoard() {
      this.$emit('closeStoreDetailBoard')
    },
    /**
     * @description 适配窗口大小，如果大于1080p，则正常，如果不是则缩小窗口高度
     */
    fitWindowSize() {
      if (window.screen.width < 1920) {
        this.is_fit_small_size = true
      }
    }
  }
}
</script>

<style scoped lang="scss">
.storeDetailBoard {
  display: none;
  text-align: left;
  position: relative;
  z-index: 3;
//   left: 77.5rem;
//   top: 33.4%;
  width: 305px;
  background-color: #0a2757;
  border: 1px solid #4b1f98;
  border-radius: 5px;
  .triangleMark {
    position: absolute;
    z-index: 1;
    top: 142px;
    left: -20px;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-right: 10px solid #133773;
    border-bottom: 10px solid transparent;
    border-left: 10px solid transparent;
  }
  // 头部
  .headerInfo {
    padding-left: 10px;
    padding-right: 15px;
    height: 34px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 2px;
    // 关闭按钮
    .closeIcon {
      font-size: 24px;
      cursor: pointer;
    }
  }
  // 属性列表
  .paramList {
    box-sizing: border-box;
    width: 304px;
    height: 140px;
    overflow-y: auto;
    padding-left: 10px;
    padding-top: 12px;
    font-size: 12px;
    background-color: #133773;
    border-radius: 2px;
    .storeName {
      font-size: 14px;
    }
    .perParam {
      margin-bottom: 6px;
      span {
        margin-right: 6px;
      }
      .locationIcon {
        font-size: 14px;
        margin-right: 4px;
      }
    }
    .address {
      margin-top: 14px;
    }
  }
  // 组标签
  .labelsArea {
    padding: 10px;
    background-color: #102f63;
    font-size: 12px;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 2px;
    .labelTitle {
      font-size: 13px;
      margin-bottom: 9px;
      color: #ced3dd;
    }
    .labelsContainer {
      height: 68px;
      overflow-y: auto;
      .perLabel {
        display: inline-block;
        border-radius: 2px;
        margin-right: 6px;
        margin-bottom: 5px;
        line-height: 24px;
        padding: 0px 9px;
        background-color: #7909c1;
        border: 1px solid #930cea;
      }
    }
  }
  .factLabels {
    .labelsContainer {
      .selftStyle {
        background-color: #ed3f14;
        border: 1px solid #ed3f14;
      }
    }
  }
  // 走势图
  .chartsArea {
    width: 303px;
    height: 162px;
    background-color: #133773;
    margin-top: 5px;
    margin-bottom: 5px;
    border-radius: 2px;
    .lineTitle {
      font-size: 13px;
      color: #ced3dd;
      width: 285px;
      margin-right: auto;
      margin-left: auto;
      line-height: 38px;
      border-bottom: 0.5px solid #5d759d;
    }
    .chartContainer {
      width: 285px;
      height: 123px;
      margin-left: auto;
      margin-right: auto;
    }
  }
}
.storeDetailBoardSmallSize {
  height: 500px;
  overflow-y: auto;
}
.storeDetailBoardShow {
  display: block;
}
</style>
