<!--属性-->
<template>
  <div class="attribute-wrap">
    <div class="list-header" :class="{'list-header-active': !openStatus}" @click="openStatus = !openStatus">属性</div>
    <collapse-transition>
      <div class="attribute-content" v-show="openStatus">
        <div class="attribute-content-item">
          <span class="label">系统建议等级：</span>
          <div class="recommend-box">
            <el-tooltip
                        class="item"
                        popper-class="popperClassTip"
                        effect="dark"
                        :content="addData.levelName"
                        :disabled="addData.levelName && addData.levelName.length < 6"
                        placement="top">
            <span :style="{borderLeft: `4px solid ${addData.color}`}">{{ addData.levelName | textEllipsis(7) }}</span>
            </el-tooltip>
          </div>
          <el-button  v-auth="'business:layout:set:add:calculation'" class="add-level" @click="computedLevel">计算</el-button>
        </div>
        <div class="attribute-content-item" v-show="openStatus">
          <span class="label">商圈等级：</span>
          <el-select v-model="businessLevel" placeholder="请选择" @change="handleChange">
            <el-option
                v-for="item in options"
                :key="item.proLevel"
                :label="item.levelName"
                :value="item.proLevel">
              <span style="color: #8492a6; font-size: 12px">{{ item.levelName }}</span>
            </el-option>
          </el-select>
        </div>
      </div>
    </collapse-transition>
  </div>
</template>

<script>
import Business_District_API from "@api/business-district/index";
import collapseTransition from '@/util/collapse'
import {mapGetters} from 'vuex'
// 引入 过滤器
import {textEllipsis} from '@/util/filters'
export default {
  name: "Attribute",
  components: {collapseTransition},
  data() {
    return {
      businessLevel: '',
      openStatus: true,
      options: [],
      addData: {
        levelName: '',
        color: 'transparent'
      },
      businessLevelName: ''
    }
  },
  computed: {
    ...mapGetters('businessPreview',['operationCode' , 'regionCode', 'needUpdateLevelAi'])
  },
  filters: {
    textEllipsis
  },
  watch: {
    operationCode() {
      if(!this.operationCode) {
        // 取消操作 && 创建成功
        this.resettingParams()
      }
    },
    needUpdateLevelAi() {
      if(this.needUpdateLevelAi) {
        this.resettingParams()
      }
    }
  },
  mounted() {
    this.getOptions()
  },
  methods: {
    // 获取 商圈等级 列表
    async getOptions() {
      let result = await Business_District_API.businessLevelList({proNo: this.$route.params.id})
      if (result.code === '200') {
        this.options = result.data
      }
    },
    // 计算商圈等级
    async computedLevel() {
      if(!this.regionCode.selectedRegionCode && !this.regionCode.selectedSpecialCode ) {
        this.$message({
          message: '请选择街道',
          type: 'warning'
        })
        return
      }
      if((this.regionCode.selectedRegionCode && this.regionCode.selectedRegionCode.length ===0 ) && (this.regionCode.selectedSpecialCode && this.regionCode.selectedSpecialCode.length === 0)) {
        this.$message({
          message: '请选择街道',
          type: 'warning'
        })
        return
      }
      let result = await Business_District_API.recommendBusinessLevel({
        proNo: this.$route.params.id,
        quarter: this.$route.query.proQuarter,
        regionCodes: this.regionCode.selectedRegionCode,
        specialStreetCode: this.regionCode.selectedSpecialCode,
        year: this.$route.query.proYear
      })
      if(result.code === '200') {
        this.addData = result.data
        this.$emit('update-business-data',  this.addData)
      }
      console.log('计算商圈等级', result)
    },
    handleChange(val) {
      let result =  this.options.filter(item => item.proLevel === val)
      this.businessLevelName = result[0]['levelName']
    },
    // 重置
    resettingParams() {
      this.businessLevelName = ''
      this.businessLevel = ''
      this.addData =  {
        levelName: '',
        color: 'transparent'
      }
    }
  }
}
</script>

<style scoped lang="less">

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

.attribute-content {
  padding: 10px 0;

  .attribute-content-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .label {
      font-size: 13px;
      font-weight: 400;
      color: #FFFFFF;
      margin-left: 14px;

      &:before {
        content: '*';
        color: #FA6400;
        position: relative;
        top: 2px;
      }
    }

    .recommend-box {
      display: flex;
      width: 130px;
      height: 30px;
      border-radius: 4px;
      border: 1px solid #647F9A;
      align-items: center;

      span {
        display: inline-block;
        height: 18px;
        line-height: 18px;
        font-size: 13px;
        font-weight: 400;
        color: #FFFFFF;
        padding-left: 5px;
        margin-left: 8px;
      }
    }

    /deep/ .el-input {
      width: 230px;
      height: 30px;
    }

    /deep/ .el-input__inner {
      height: 30px;
      background-color: #081F45;
      border: 1px solid #647F9A;
      color: rgba(255, 255, 255, 0.61);
    }

    /deep/ .el-input__icon {
      line-height: 30px;
    }

    .add-level {
      background: #0a2757;
      width: 64px;
      height: 22px;
      border-radius: 3px;
      opacity: 0.58;
      border: 1px solid #D99DFF;
      color: #fff !important;
      padding: 0;
      margin-left: 10px;

      span {
        color: #fff !important;
      }
    }
  }
}
</style>
<style>
.popperClassTip {
  background: rgba(0, 0, 0, .75) !important;
}
</style>
