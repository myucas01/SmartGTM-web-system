<template>
  <div class="level-wrap">
    <div class="list-header" :class="{'list-header-active': !openStatus}" @click="openStatus = !openStatus">
      <span>商圈等级</span>
      <button v-auth="'business:layout:level:detail'" class="check-btn" @click.stop="openDialog">查看详情</button>
    </div>
    <collapse-transition>
      <div class="level-content" v-show="openStatus">
        <div v-if="editBusinessDistrict">
          <div class="level-item">
            <span class="label-name">系统建议商圈等级：</span>
            <el-tooltip
                class="item"
                popper-class="popperClassTip"
                effect="dark"
                :content="levelAiName"
                :disabled="levelAiName &&levelAiName.length < 7"
                placement="top">
              <span v-if="levelAiName" class="recommend-level"><i :style="{background: editBusinessDistrict.color}"/>{{levelAiName | textEllipsis(7)}}</span>
              <span v-if="!levelAiName" class="recommend-level">请计算</span>
            </el-tooltip>

            <button v-auth="'business:layout:set:add:calculation'" v-show="!isPreview" class="computed-btn" @click="computedLevel">计算</button>
          </div>
          <div class="level-item">
            <span class="label-name">地方商圈等级：</span>
            <el-select v-if="userLevel === 'df' && !isPreview" v-model="levelEmployee" placeholder="请选择" @change="handleChange($event, 'levelEmployee')">
              <el-option
                  v-for="item in options"
                  :key="item.proLevel"
                  :label="item.levelName"
                  :value="item.proLevel">
              </el-option>
            </el-select>
            <div v-else class="view-label"><i :style="{background: editBusinessDistrict.levelEmployeeColor}"/>{{editBusinessDistrict.levelEmployeeName ? editBusinessDistrict.levelEmployeeName : '---'}}</div>
          </div>
          <div class="level-item">
            <span class="label-name">总部商圈等级：</span>
            <el-select v-if="userLevel === 'gz'&& !isPreview" v-model="levelLeader" placeholder="请选择" @change="handleChange($event, 'levelLeader')">
              <el-option
                  v-for="item in options"
                  :key="item.proLevel"
                  :label="item.levelName"
                  :value="item.proLevel">
              </el-option>
            </el-select>
            <div v-else class="view-label"><i :style="{background: editBusinessDistrict.levelLeaderColor}"/>{{editBusinessDistrict.levelLeaderName}}</div>
          </div>
        </div>
        <div v-else style="text-align: center;color: #F2F2F2">
            暂无数据
        </div>
      </div>
    </collapse-transition>
    <business-detail-dialog ref="detailDialog" :isShowDetailDialog="isShowDetailDialog" @close-dialog="closeDialog"/>
  </div>
</template>

<script>
import collapseTransition from '@/util/collapse'
import Business_District_API from "@api/business-district/index";
import businessDetailDialog from "@/views/business-district-views/BusinessPreview/businessDetailDailog";
import {mapGetters} from 'vuex'
// 引入 过滤器
import {textEllipsis} from '@/util/filters'
export default {
  name: "BusinessLevel",
  filters: {
    textEllipsis
  },
  props: ['editBusinessDistrict', 'chooseBusinessDistrict'],
  components: {
    collapseTransition,
    businessDetailDialog
  },
  data() {
    return {
      openStatus: true,
      levelEmployee: '',
      levelLeader: '',
      levelEmployeeName: '',
      levelLeaderName: '',
      options: [],
      isShowDetailDialog: false,
      userLevel: '',
      levelAi: '',
      levelAiName: ''
    }
  },
  computed: {
    ...mapGetters('businessPreview', ['operationCode', 'regionCode', 'viewProject', 'chooseBusinessMap', 'chooseBusiness', 'isPreview', 'editBusinessScope'])
  },
  watch: {
    editBusinessDistrict() {
      if(this.userLevel && this.editBusinessDistrict) {
        this.levelAi = this.editBusinessDistrict.levelAi
        this.levelAiName = this.editBusinessDistrict.levelAiName
        this.levelLeader = this.editBusinessDistrict.levelLeader
        this.levelLeaderName = this.editBusinessDistrict.levelLeaderName
        this.levelEmployee = this.editBusinessDistrict.levelEmployee
        this.levelEmployeeName = this.editBusinessDistrict.levelEmployeeName
      }
    },
    editBusinessScope() {
      if(this.operationCode === 'edit') {
        this.levelAi = ''
        this.levelAiName = ''
        this.editBusinessDistrict.color = ''
      }
    }
  },
  mounted() {
    this.userLevel = this.$cookies.get('businessLevel')
  },
  methods: {
    async getLevel() {
      let result = await Business_District_API.businessLevelList({proNo: this.$route.params.id})
      this.options = result.data
    },
    // 开启 商圈等级调整详情
    openDialog() {
      this.isShowDetailDialog = !this.isShowDetailDialog
    },
    closeDialog() {
      this.isShowDetailDialog = false
    },
    computedLevel() {
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
      Business_District_API.recommendBusinessLevel({
        proNo: this.$route.params.id,
        quarter: this.$route.query.proQuarter,
        year: this.$route.query.proYear,
        businessNo: this.chooseBusinessDistrict.toString(),
        checkedAllSpecialStreet: this.regionCode.selectedSpecialCode,
        regionCodes: this.regionCode.selectedRegionCode,
        specialStreetCode: this.regionCode.selectedSpecialCode
      })
      .then(res => {
        if(res.code === '200') {
          this.editBusinessDistrict.color = res.data.color
          this.levelAi = res.data.level
          this.levelAiName = res.data.levelName
          res.data.targetVo.businessName = this.editBusinessDistrict.businessName
          this.$emit('update-business-data',  res.data)
        }
      })
    },
    handleChange($event, type) {
      let result = this.options.filter(item => item.proLevel === $event)
      console.info(result)
      if(type === 'levelLeader') {
        this.levelLeaderName = result[0]['levelName']
      } else {
        this.levelEmployeeName = result[0]['levelName']
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
  overflow: hidden;
  //position: relative;
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
  .check-btn{
    width: 64px;
    height: 22px;
    line-height: 22px;
    border-radius: 3px;
    opacity: 0.58;
    border: 1px solid #FFFFFF;
    padding: 0;
    font-size: 12px;
    font-weight: 400;
    color: #FFFFFF;
    float: right;
    position: relative;
    right: 7px;
    top: 6px;
  }
}

.list-header-active {
  &:before {
    transform: rotate(-90deg)
  }
}

.level-content {
  padding: 13px 0;

  .level-item {
    display: flex;
    position: relative;
    line-height: 30px;
    margin-bottom: 10px;

    .label-name {
      font-size: 13px;
      font-weight: 600;
      color: #FFFFFF;
      margin-left: 14px;
    }

    .recommend-level {
      display: inline-block;
      font-size: 13px;
      font-weight: 400;
      color: #C983F6;
      padding-left: 5px;
      i{
        display: inline-block;
        width: 4px;
        height: 16px;
        margin-right: 5px;
        position: relative;
        top: 2px;
      }
    }
    .view-label{
      color: #fff;
      i{
        display: inline-block;
        width: 2px;
        height: 13px;
        position: relative;
        top: 2px;
        margin-right: 5px;
      }
    }

    .computed-btn {
      width: 64px;
      height: 20px;
      border-radius: 3px;
      opacity: 0.58;
      border: 1px solid #D99DFF;
      outline: none;
      text-align: center;
      line-height: 20px;
      font-size: 12px;
      font-weight: 400;
      color: #D99DFF;
      position: absolute;
      top: 5px;
      right: 7px;
    }
  }

  /deep/ .el-input {
    width: 200px;
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
}
</style>
