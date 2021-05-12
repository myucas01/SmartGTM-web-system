<template>
  <div class="business-target-wrap">
    <div class="list-header" :class="{'list-header-active': !openStatus}" @click="openStatus = !openStatus">商圈指标</div>
    <collapse-transition>
      <div v-show="openStatus" class="collapse-box">
        <div class="business-target-content" v-if="targetTable && Object.keys(this.targetTable).length > 0">
          <p class="business-name" v-if="operationCode === 'edit' || !operationCode || operationCode === 'delete'">
            商圈名称 ：
            <el-tooltip
                class="item"
                effect="dark"
                popper-class="popperClassTip"
                :content="targetTable.businessName"
                :disabled="targetTable.businessName && targetTable.businessName.length < 11"
                placement="right-start">
            <span>{{ targetTable.businessName | textEllipsis(11) }}</span>
            </el-tooltip>
          </p>
          <!-- 指标 table  -->
          <div class="target-table">
            <div v-if="targetTable.targetList && targetTable.targetList.length > 0">
              <table v-if="operationCode === 'edit' || !operationCode">
                <th width="140">指标名称</th>
                <th width="110">系统值</th>
                <th>反馈数</th>
                <tr v-for="targetItem of targetTable.targetList" :key="targetItem.targetNo+targetItem.valueAi">
                  <td>
                    <span>{{ targetItem.targetName }}({{ targetItem.targetUnit }})</span>
                    <el-tooltip class="item" effect="dark" :content="targetItem.targetTip" placement="top-start">
                      <svg-icon icon-class="wenhao"></svg-icon>
                    </el-tooltip>
                  </td>
                  <td>
                    <svg-icon icon-class="rise" v-if="targetItem.increase > 0"></svg-icon>
                    <svg-icon icon-class="drop" v-if="targetItem.increase < 0"></svg-icon>
                    <span class="drop-color">{{ targetItem.increase }}</span>
                    <span>{{ targetItem.valueAi }}</span>
                  </td>
                  <td>
                  <span v-if="operationCode === 'edit'" class="feedback-color" :key="modeKey" :data-key="modeKey" :data='consumptionPower'>
                    <el-input-number v-if="targetItem.targetNo === 'resident_population'"   v-model="consumptionPower"  :precision="0" class="diy-input" :min="0" :max="100000000" label="请输入内容"></el-input-number>
                    <el-input-number v-if="targetItem.targetNo === 'house_prices'"  v-model="housingPrice" :min="0" :max="100000000" :precision="0" label="请输入内容"></el-input-number>
                    <el-input-number v-if="targetItem.targetNo === 'avg_house_prices'"  v-model="averageHousingPrice" :precision="0" :min="0" :max="100000000" label="请输入内容"></el-input-number>
                  </span>
                  <span v-else class="feedback-color">
                    <label v-if="targetItem.targetNo === 'resident_population'">{{targetItem.valueUser}}</label>
                    <label v-if="targetItem.targetNo === 'house_prices'">{{targetItem.valueUser}}</label>
                    <label v-if="targetItem.targetNo === 'avg_house_prices'">{{targetItem.valueUser}}</label>
                  </span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <!-- 商圈指标kpi  新增 -->
          <div class="kpi_dev" v-if="operationCode==='add'">
            <div class="collapse_row" v-for="(list,i) in targetTable.targetList" :key="i">
              <p>
                <span style="color:#ffffff">{{ list.targetName }}({{ list.targetUnit }})</span>
                <el-tooltip class="item" effect="dark" :content="list.targetTip" placement="top">
                  <svg-icon icon-class="wenhao"></svg-icon>
                </el-tooltip>
              </p>
              <p>
                <span v-if="list.valueAi">{{ list.valueAi }}</span>
                <span v-else>-</span>
              </p>
            </div>
          </div>
          <!-- 售点盘点  -->
          <div class="selling-box" v-if="targetTable && targetTable.inventoryList && targetTable.inventoryList.length > 0">
            <div class="selling-box-header">售点盘点</div>
            <div class="selling-box-content">
              <div class="selling-item" v-for="(item, index) of targetTable.inventoryList" :key="item.categoryName + index">
                <p class="selling-header">
                  <svg-icon :icon-class="iconName(item.categoryName)"></svg-icon>
                  <span>{{ item.categoryName }}</span>
                  <span>{{ item.total| numFormat}}</span>
                </p>
                <ul class="selling-uls">
                  <li class="selling-lis" v-for="childItem of item.childList" :key="childItem.categoryName">
                    <span>{{ childItem.categoryName }}</span>
                    <p>{{ childItem.total|numFormat}}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="business-target-content" v-if="!targetTable">
          <p class="no-txt" v-if="!operationCode || operationCode === 'delete'">选择商圈，即可查看商圈指标</p>
          <p class="no-txt" v-if="operationCode === 'add' || operationCode === 'edit'">点击计算，即查看商圈指标选择商圈</p>
        </div>
      </div>
    </collapse-transition>
  </div>
</template>

<script>
import Business_District_API from "@api/business-district/index";
import collapseTransition from '@/util/collapse'
import {textEllipsis, numFormat} from '@/util/filters'
import {mapGetters} from 'vuex'
export default {
  name: "BusinessTag",
  props: ['chooseBusinessDistrict', 'editBusinessDistrict'],
  components: {collapseTransition},
  data() {
    return {
      targetTable: '',
      openStatus: true,
      modeKey: +new Date(),
      housingPrice: '', // 房价
      averageHousingPrice: '', // 均房价
      consumptionPower: '' // 消费力
    }
  },
  filters: {
    textEllipsis,
    numFormat
  },
  computed: {
    ...mapGetters('businessPreview',['operationCode', 'needUpdateLevelAi', 'deleteBusiness']),
    ...mapGetters('map', ['organizationId', 'treeData'])
  },
  watch: {
    chooseBusinessDistrict() {
      if(this.chooseBusinessDistrict && this.chooseBusinessDistrict.length > 0)  {
        this.getTagData()
      } else {
        this.targetTable = ''
      }
    },
    organizationId() {
      if(this.operationCode !== 'edit') {
        this.targetTable = ''
      }
    },
    operationCode(newVal) {
      if(!newVal) {
        this.targetTable = ''
      }
    },
    needUpdateLevelAi() {
      this.targetTable = ''
    },
    deleteBusiness() {
      this.targetTable = ''
    }
  },
  methods: {
    iconName(name) {
      const iconMap = {
        '零售点': 'retailOutlets',
        '特通售点': 'teshu',
        '特通场所': 'Tetong',
        '通路/渠道': 'address'
      }
      if(iconMap[name]) {
        return iconMap[name]
      } else {
        return 'retailOutles'
      }
    },
    // 获取 商圈指标数据
    async getTagData() {
      // console.log('%c获取 商圈指标数据', 'color: #43bb88;font-size: 24px;font-weight: bold;text-decoration: underline;');
      let result = await Business_District_API.businessTags({
        bccNos: this.chooseBusinessDistrict + '' ,
        proNo: this.$route.params.id,
        isLoading: false
      })
      if(result.code === '200') {
        // // mock data
        // result.data = {
        //   ...result.data,
        //   inventoryList: result.data.inventoryList.concat(result.data.inventoryList[0])
        // }
        this.targetTable = result.data
        for(let item of this.targetTable.targetList) {
          if(item.targetNo === 'resident_population') {
            this.consumptionPower = item.valueUser ? Number(item.valueUser.replace(/,/g, '')) : 0
          }
          if(item.targetNo === 'house_prices') {
            this.housingPrice =item.valueUser ? Number(item.valueUser.replace(/,/g, '')) : 0
          }
          if(item.targetNo === 'avg_house_prices') {
            this.averageHousingPrice = item.valueUser ? Number(item.valueUser.replace(/,/g, '')) : 0
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.business-target-wrap{
  max-width: 340px;
  /deep/ .el-input-number__decrease{
    display: none;
  }
  /deep/ .el-input-number__increase{
    display: none;
  }
}
.list-header {
  height: 34px;
  line-height: 34px;
  background: #133773;
  box-shadow: 0px -1px 0px 0px #0A2757;
  font-size: 13px;
  font-weight: 600;
  color: #FFFFFF;
  padding-left: 15px;
  cursor: pointer;

  &:before {
    display: inline-block;
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 10px 7px 0 7px;
    border-color: #CED3DD transparent transparent transparent;
    position: relative;
    top: 2px;
    margin-right: 5px;
    transform-origin: 50% 30%;
    transition: transform .3s;
  }
}

.list-header-active {
  &:before {
    transform: rotate(-90deg)
  }
}

.business-target-content {
  padding-left: 12px;

  .no-txt {
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 13px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.8);
  }

  .business-name {
    line-height: 30px;
    font-size: 12px;
    font-weight: 600;
    color: #FFFFFF;
  }

  .target-table {
    color: #fff;

    th {
      font-size: 14px;
    }

    tr {
      margin-bottom: 10px;
    }

    td {
      padding: 3px 0;

      .drop-color {
        font-size: 12px;
        font-weight: 400;
        color: #19BE6B;
        margin-right: 5px;
      }

      .rise-color {
        color: #ED3F14;
        margin-right: 5px;
      }

      .feedback-color {
        font-size: 13px;
        font-weight: 400;
        color: #E9C8FF;
        cursor: pointer;
        /deep/ .el-input-number{
          width: 70px;
          line-height: 20px;
        }
        /deep/ .el-input{
          width: 70px;
        }
        /deep/ .el-input-number .el-input__inner{
          width: 70px;
          height: 20px;
          background-color: #081F45;
          padding: 0;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #fff;
          font-size: 12px;
        }
      }
    }
  }

  .selling-box {
    padding-top: 10px;

    &-header {
      width: 312px;
      height: 42px;
      background: #7C41F9;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      color: #FFFFFF;
      line-height: 42px;
      text-indent: 10px;
      position: relative;
      z-index: 10;
    }
  }

  .selling-box-content {
    display: flex;
    width: 312px;
    max-height: 225px;
    overflow-y: auto;
    background: #540BB1;
    position: relative;
    top: -5px;
    padding-top: 15px;
    padding-bottom: 15px;
    border-radius: 10px;

    .selling-item {
      flex-shrink: 0;
      flex-grow: 1;
      padding: 10px;
      border-right: 1px solid #B095FF;

      &:last-child {
        border-right: none;
      }
    }

    .selling-header {
      font-size: 12px;
      font-weight: bold;
      color: #FFFFFF;

      svg {
        margin-right: 3px;
        margin-left: 6px;
      }
    }

    .selling-uls {
      padding-left: 13px;

      .selling-lis {
        padding: 3px 0;
        span {
          font-size: 12px;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 25px;
        }

        p {
          font-size: 15px;
          font-weight: 600;
          color: #FFFFFF;
        }
      }
    }
  }
}
.collapse-box{
  padding: 10px 0;max-height: 300px;overflow-y: auto;
}
.kpi_dev{
  padding-right: 15px;
  padding-top: 10px;
  .collapse_row {
    height: 28px;
    line-height: 28px;
    margin-bottom: 5px;
    p:nth-child(1) {
      float: left;
      font-family: 'MicrosoftYaHei', '微软雅黑';
      font-weight: 400;
      font-style: normal;
      color: #d9d9d9;
    }
    p:nth-child(2) {
      float: right;
      font-weight: 700;
      font-style: normal;
      font-size: 14px;
      color: #FFFFFF;
      text-align: right;
    }
  }
}
</style>
<style>
.popperClassTip {
  background: rgba(0, 0, 0, .75) !important;
}
</style>
