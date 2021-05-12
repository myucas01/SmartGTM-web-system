<template>
  <div class="inforMationbox">
    <span class="title">{{ InforMationData.storeName }}
      <el-button class="addline"  :disabled="ServiceButton || !edit" v-if='!InforMationData.areaId && !InforMationData.serviceDay ||  InforMationData.serviceDay ==="-1"' @click="addLineclick">加入路线</el-button>
      <el-button class="outline" :disabled="ServiceButton || !edit" v-else-if='InforMationData.areaId && Number(InforMationData.serviceDay)>0' @click="outLineclick">移出路线</el-button>
    </span>
    <div>
      <div class="inforlist"
           v-for="(item, index) in infor"
           :key="index">
        <div class="textstyle"><span class="texttitle">
            <svg-icon :icon-class="item.icon"
                      class-name="icon"></svg-icon>{{item.title}}
          </span>{{ item.value }}
          <el-tooltip v-auth="'lineplan:build:mapshow:exchangesite'"
                      v-if="!ServiceButton && edit"
                      class="item"
                      effect="dark"
                      content="修改定位"
                      placement="top">
            <p class="editbox"
               v-if="index == 0"
               @click="getEditdot">
              <svg class="editLocation">
                <use xlink:href="#icondizhi"></use>
              </svg>
            </p>
          </el-tooltip>
        </div>
        <el-dialog title="请完成验证码"
                   :visible.sync="dialogVisible"
                   width="30%"
                   :show-close="false"
                   :append-to-body="true"
                   :close-on-click-modal="false">
          <el-input style="width:50%"
                    v-model="inputCode"
                    maxlength="8"
                    placeholder="请输入右侧验证码"></el-input>
          <img :src="imgSrc"
               @click="getThumb()"
               class="imgbox" />
          <span slot="footer"
                class="dialog-footer">
            <el-button size="mini"
                       @click="dialogVisible = false">取 消</el-button>
            <el-button size="mini"
                       type="primary"
                       @click="getSelectCode">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="bottom"
           v-if="labelList && labelList.length > 0">
        <p class="bo_title">标签信息</p>
        <span class="bo_tag">
          <p class="tag"
             v-for="(item, odex) in taglist"
             :key="odex">
            {{ item }}
          </p>
        </span>
      </div>
      <!--月成交折线图-->
      <div class="chartsArea">
        <div class="lineTitle">月成交次数</div>
        <div class="chartContainer"
             id="mon_deal_line_chart">
          <chart :options="frequency_option"
                 :autoResize="true"
                 v-if="frequency"></chart>
          <span class="chartbox"
                v-else-if="!frequency">暂无月成交次数数据</span>
        </div>
      </div>
      <!--月销量折线图-->
      <div class="chartsArea">
        <div class="lineTitle">月销量</div>
        <div class="chartContainer"
             id="mon_sale_line_chart">
          <chart v-if="salesAmount"
                 class="chartbox"
                 :options="salesAmount_option"
                 :autoResize="true"></chart>
          <span class="chartbox"
                v-else-if="!salesAmount">暂无月销量数据</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import chart from '@/components/Chart'
import * as filtersFun from '@/util/filters.js'
import Api from '@api/route/planpreview_api.js'
export default {
  name: 'InforMation',
  props: [
    'InforMationData',
    'programId',
    'ServiceButton',
    'edit',
    'getPosition',
    'storeAdjChild',
    'handlerClick'
  ],
  data() {
    return {
      title: null,
      infor: [],
      taglist: [],
      labelList: '',
      frequency_option: null,
      frequency: null,
      salesAmount: null,
      salesAmount_option: null,
      dialogVisible: false,
      imgSrc: '../api/route/store/select/code',
      inputCode: null
    }
  },
  components: {
    chart
  },
  watch: {
    InforMationData: {
      deep: true,
      handler: function (newval) {
        this.init(newval)
      }
    }
  },
  mounted() {
    this.init(this.InforMationData)
  },
  methods: {
    init(data) {
      this.getThumb()
      const {
        storeAddress,
        tel,
        visitWeek,
        visitRate,
        shopTime,
        configBigName,
        configSmallName,
        storeTypeName,
        tagsList,
        storeCode,
        agencyName,
        storeId
      } = data
      this.getStoreDetail(storeId)
      this.taglist = [
        configBigName + configSmallName,
        shopTime + '分钟/次',
        visitWeek + '周' + visitRate + '访'
      ]
      this.labelList = tagsList
      const infor = [
        {
          icon: 'icon-adress',
          value: storeAddress,
          title: '门店地址'
        },
        {
          icon: 'icon-phone',
          value: tel,
          title: '门店电话'
        },
        {
          icon: 'icon-custome',
          value: storeTypeName,
          title: '门店类型'
        },
        {
          icon: 'storeCode_icon',
          value: storeCode,
          title: '门店编码'
        },
        {
          icon: 'agencyName_icon',
          value: agencyName,
          title: '特约批'
        }
      ]
      this.infor = infor
    },
    // 刷新验证码
    getThumb() {
      this.imgSrc = this.imgSrc + '?t=' + Math.random()
    },
    //*****获取月成交数月销量
    async getStoreDetail(storeId) {
      Api.get_store_detail({
        storeId: storeId,
        isLoading: false
      })
        .then(async res => {
          if (res.code === '200') {
            let allData = await res.data
            if (allData) {
              this.frequency = allData.frequency
              this.salesAmount = allData.salesAmount
              this.frequency &&
                (this.frequency_option = this.lineChartObjFactory(
                  this.frequency.axisX,
                  this.frequency.axisY,
                  {
                    color: '#F5A623'
                  }
                ))
              this.salesAmount &&
                (this.salesAmount_option = this.lineChartObjFactory(
                  this.salesAmount.axisX,
                  this.salesAmount.axisY,
                  {
                    color: '#930CEA'
                  }
                ))
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    /**
     * @description 折线图工厂函数，每次都会返回一个配置项
     * @param {Array<string>} x_data X轴数据(日期)
     * @param {Array<number>} y_data X轴数据(数量)
     * @param {object} configs 需要单独配置的参数，主要以样式为主
     */
    lineChartObjFactory(x_data, y_data, configs) {
      return {
        // 决定折线图在容器内的大小，xy为偏移量
        grid: {
          left: '15%', // x 偏移量
          top: '15%', // y 偏移量
          width: '80%', // 宽度
          height: '60%' // 高度
        },
        // x轴的配置
        xAxis: {
          type: 'category',
          nameGap: 100,
          data: x_data,
          // x坐标轴线是否显示
          axisLine: {
            show: true,
            lineStyle: {
              color: '#798cad'
            }
          },
          // x坐标轴刻度是否显示
          axisTick: {
            show: false
          },
          // x轴坐标label文本设置
          axisLabel: {
            // 字体大小10
            fontSize: 10,
            // 距离顶部0
            padding: [0, 0, 0, 0],
            color: '#CED3DD'
          }
        },
        // y轴的配置
        yAxis: {
          // y轴的标题名
          name: '',
          type: 'value',
          // y坐标轴线是否显示
          axisLine: {
            show: false
          },
          // y坐标轴刻度是否显示
          axisTick: {
            show: false
          },
          // y轴坐标label文本设置
          axisLabel: {
            // 字体大小10
            fontSize: 10,
            // 距离顶部0
            padding: [0, 0, 0, 0],
            color: '#CED3DD'
          },
          // 分几段
          splitNumber: 5,
          // 不要显示y轴的分割线
          splitLine: {
            show: true,
            lineStyle: {
              color: '#798cad',
              type: 'dashed'
            }
          }
        },
        // 核心数据轴的配置
        series: [
          {
            data: y_data,
            type: 'line',
            // 是否平滑过渡
            smooth: true,
            // 打点图形：空心圆
            symbol: 'emptyCircle',
            // 打点大小
            symbolSize: 5,
            // 平滑曲线的样式
            lineStyle: {
              // 线宽
              width: 2,
              color: configs.color
            },
            itemStyle: {
              color: '#400093',
              borderColor: '#ffffff',
              borderWidth: 2
            }
          }
        ],
        // 鼠标放上后的数据提示框
        tooltip: {
          trigger: 'axis',
          // 十字标尺
          axisPointer: {
            // 不显示十字标尺
            type: 'none',
            // 不显示标尺xy轴的label
            label: {
              show: false
            }
          },
          position: point => {
            return [point[0] - 35, point[1] - 60]
          },
          // 提示框内边距 [上 右 下 左]
          padding: [10, 15, 10, 15],
          // 文本样式
          textStyle: {
            color: '#ffffff',
            fontSize: 12
          },
          // 数据格式化，此处为 123456 => 123,456
          formatter: params => {
            return filtersFun.numFormat(params[0].data)
          }
        }
      }
    },
    getEditdot() {
      this.$emit('getModifyposit', true)
    },
    CodeInfor() {
      this.dialogVisible = true
    },
    addLineclick(){
      this.storeAdjChild.getStoreArea()
      const {storeId,storeCode,storeName} = this.InforMationData
      this.storeAdjChild.openDialogVisible(storeId,storeCode,storeName)
      this.handlerClick()
    },
    outLineclick(){
      this.$confirm('请确认是否移出路线？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //调用
        this.storeAdjChild.deleteStore(this.InforMationData.storeId)
        this.handlerClick()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    getSelectCode() {
      if (this.inputCode) {
        Api.get_check_code({
          verifyCode: this.inputCode
        })
          .then(res => {
            if (res.code === '200') {
              this.dialogVisible = false
              this.getPosition()
            } else {
              this.getThumb()
            }
          })
          .catch(err => {
            this.getThumb()
            console.log(err)
          })
        this.inputCode = null
      } else {
        this.$message({ message: '请输入验证码', type: 'warning' })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.inforMationbox {
  height: 380px;
  overflow-y: auto;
}
.title {
  font-size: 14px;
  display: flex;
  padding: 5px 10px 3px 10px;
  justify-content: space-between;
  align-items: center;
  white-space: normal;
  .addline {
    width: 74px;
    height: 21px;
    border-radius: 4px;
    display: inline-flex;
    margin: 2px 0 2px 8px;
    background: #19BE6B;
    color: #fff;
    align-items: center;
    justify-content: center;
    border: none;
  }
  .outline{
    width: 74px;
    height: 21px;
    border-radius: 4px;
    display: inline-flex;
    margin: 3px 0 3px 8px;
    background: #930cea;
    color: #fff;
    align-items: center;
    justify-content: center;
    border: none;
  }
}
.inforlist {
  display: flex;
  margin: 0px 10px 3px 10px;
  align-items: center;
  .editbox {
    width: 20px;
    height: 20px;
    display: inline-block;
    vertical-align: bottom;
    border: none;
    cursor: pointer;
    &:focus {
      border: none;
    }
  }
  .icon {
    font-size: 12px;
    margin-right: 3px;
  }
  .editLocation{
    height: 16px;
    width: 16px;
    cursor:pointer;
    margin: 2px;
    color:#fff;
  }
}
// 走势图
.chartsArea {
  background-color: #133773;
  margin-bottom: 5px;
  .lineTitle {
    font-size: 13px;
    color: #ced3dd;
    width: 300px;
    margin-right: auto;
    margin-left: auto;
    line-height: 30px;
    border-bottom: 0.5px solid #5d759d;
  }
  .chartContainer {
    width: 320px;
    height: 130px;
    color: #ced3dd;
    margin: 0px auto -20px auto;
  }
}
.chartbox {
  display: block;
  text-align: center;
  line-height: 100px;
}
.bottom {
  width: 305px;
  height: 60px;
  background: #102f63;
  padding: 0 10px;
  box-shadow: 0px -1px 0px 0px #0a2757;
  border-radius: 0px 0px 4px 4px;
  .bo_title {
    margin-top: 10px;
    display: block;
    padding: 5px 0;
    font-size: 13px;
    color: #ffffff;
  }
  .bo_tag {
    display: block;
    .tag {
      width: 85px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      background: #4b1f98;
      border-radius: 2px;
      border: 1px solid #930cea;
      display: inline-block;
      margin-right: 5px;
    }
  }
}
.textstyle {
  width: 100%;
  display: block;
  .texttitle {
    width: 70px;
    display: inline-block;
  }
}
.code {
  width: 114px;
  height: 40px;
  border: 1px solid red;
}
::v-deep .el-dialog__header {
  text-align: center;
}
::v-deep .el-dialog__title {
  color: #1f2d3d;
  font-weight: 600;
}
::v-deep .el-dialog__body {
  padding: 20px;
  margin-bottom: 10px;
  border-bottom: #ced3dd 1px solid;
}
.imgbox {
  display: inline-block;
  background: rgb(243, 243, 243);
  border: none;
  outline: none;
}
</style>
