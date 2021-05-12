<template>
  <div class="business-wrap" id="business-wrap">
    <!-- 左侧操作面板   -->
    <div class="left-operate" :class="{'close': !showTag}">
      <div v-show="!showTag" class="iconbox">
        <i class="el-icon-s-unfold icon" @click="showUp()"></i>
      </div>
      <div class="breadcrumb" v-show="showTag">
        <i class="el-icon-s-fold icon" @click="showUp()"></i>
        <el-tooltip
            class="item"
            effect="dark"
            :content="viewPlan.proName"
            popper-class="popperClassTip"
            :disabled="true"
            placement="bottom-start"
        >
          <span class="planname">{{ viewPlan.proName | textEllipsis(dataTile ? 9 : 13) }} {{ dataTile }} </span>
        </el-tooltip>
      </div>
      <div class="components-box" v-show="showTag">
        <Tools compontent-title="浮层工具栏(对比/截图/网格选取)"
               v-show="operationCode === 'edit' || !operationCode || operationCode === 'delete'"
               :newAMap="AMap"
               ref="toolbarChild"
               :AMap="mapObj"/>
        <NavTools
            v-show="!operationCode || operationCode === 'delete'"
            compontent-title="新增/编辑/删除/调整&商圈"
            :AMap="mapObj"
            @choose-code="chooseCode"
        />
        <div class="left-operation">
          <!--   新增   -->
          <div data-text="新增" v-show="operationCode === 'add'">
            <AdministrativeScope
                ref="administrativeChildAdd"
                compontent-title="行政范围边界"
                :editBusinessDistrict="editBusinessDistrict"
                :AMap="mapObj"
            />
            <AttributeAssembly
                ref="attributeAssemblyChild"
                v-show="operationCode === 'add'"
                compontent-title="商圈属性"
                @update-business-data="updateBusinessData"/>
          </div>
          <!--   编辑  -->
          <BasicInformation
              ref="infoChild"
              v-show="operationCode === 'edit'"
              :chooseBusinessDistrict="chooseBusinessDistrict"
              @update-BusinessDistrict="updateBusinessDistrictInfo"
              compontent-title="商圈基本信息"/>
          <BusinessLevel
              ref="businessLevelChild"
              v-show="operationCode === 'edit'"
              :chooseBusinessDistrict="chooseBusinessDistrict"
              :editBusinessDistrict="editBusinessDistrict"
              @update-business-data="updateBusinessData"
              compontent-title="商圈等级"/>
          <BusinessTag
              ref="businessTagChild"
              compontent-title="商圈指标"
              :operationCode="operationCode"
              :editBusinessDistrict="editBusinessDistrict"
              :chooseBusinessDistrict="chooseBusinessDistrict"
          />
          <AdministrativeScope
              ref="administrativeChildEdit"
              v-show="operationCode === 'edit'"
              compontent-title="行政范围边界"
              :editBusinessDistrict="editBusinessDistrict"
              :AMap="mapObj"
          />
          <BusinessList
              v-show="!operationCode || operationCode === 'delete'"
              compontent-title="商圈列表"
              ref="listChild"
              @change-business="changeBusiness"
              @getlevel="getlevel"
              @choose-code="chooseCode"
              :AMap="mapObj"
          />
        </div>
        <div class="footer">
          <el-button class="btn"
                     v-auth="'business:layout:set:out'"
                     v-show="!operationCode || operationCode === 'delete'"
                     @click="redirectUrl('businessDistrictSchemeList')">退出
          </el-button>
          <el-button class="btn-cancel"
                     v-auth="'business:layout:set:out'"
                     v-show="operationCode === 'add' || operationCode === 'edit'"
                     @click="cancelHandle">取消
          </el-button>
          <el-button class="btn-add"
                     v-auth="'business:layout:set:add:save'"
                     v-show="operationCode === 'add'"
                     @click="checkAbnormal">新增
          </el-button>
          <el-button class="btn-add"
                     v-auth="'business:layout:set:add:save'"
                     v-show="operationCode === 'edit'"
                     @click="checkAbnormal">保存编辑
          </el-button>
        </div>
      </div>
    </div>
    <!-- 地图容器  -->
    <div class="map-box" id="map-box" compontent-title='地图容器'></div>
    <Organization v-if="mapOrganization" class="business-tree"></Organization>
    <!-- 图例  -->
    <BusinessLegend compontent-title='图例' :regionalList="regionalList"
                    v-show="!operationCode || operationCode === 'delete'"/>
    <!-- 商圈调整 弹层  -->
    <adjustBusiness ref="adjustBusinessChild"/>
  </div>
</template>

<script>
//-------------------地图相关------------------------
import {AMap} from '@/plugins/AMap' // 引入地图组件
import Organization from '@/components/Organization'
//-------------------操作栏------------------------
import BusinessLegend from "@/views/business-district-views/components/MapLegend"; // 图例
import NavTools from "@/views/business-district-views/components/Navtools"; // 导航工具栏
import BusinessTag from "@/views/business-district-views/components/BusinessTag"; // 商圈指标
import BusinessList from "@/views/business-district-views/components/BusinessList"; // 商圈列表
import AdministrativeScope from "@/views/business-district-views/components/AdministrativeScope"; // 行政边界范围
import AttributeAssembly from "@/views/business-district-views/components/Attribute"; // 属性
import BusinessLevel from "@/views/business-district-views/components/BusinessLevel"; // 商圈等级
import Tools from "@/views/business-district-views/components/Tools";  // 工具栏
import BasicInformation from "@/views/business-district-views/components/BasicInformation"; // 商圈基本信息
import adjustBusiness from "@/views/business-district-views/components/adjustBusiness";
//-------------------vuex------------------------
import {mapGetters} from 'vuex'
//-------------------api------------------------
import Business_District_API from "@api/business-district/index";

import {textEllipsis} from '@/util/filters'

export default {
  name: "BusinessDistrictIndex",
  components: {
    Organization,
    BusinessLegend,
    NavTools,
    BusinessTag,
    BusinessList,
    AdministrativeScope,
    AttributeAssembly,
    BusinessLevel,
    Tools,
    BasicInformation,
    adjustBusiness
  },
  data() {
    return {
      AMap,
      dataTile: '', // title
      showTag: true,  // 左侧操作栏 展开收起
      regionalList: [],
      chooseBusinessDistrict: [], // 选中的商圈
      mapObj: '',  // 地图实例对象
      operationCode: '', // 操作的code 对应 Navtools中code
      editBusinessDistrict: '', // 商圈基本信息
      computedBusinessTagData: '', // 计算后的商圈指标数据
      viewPlan: '',
    }
  },
  computed: {
    ...mapGetters('map', [
      'organizationId',
      'mapStyle',
      'mapHidden',
      'mapSearch',
      'mapSearchIcon',
      'mapRanging',
      'mapOrganization'
    ]),
    ...mapGetters('businessPreview', ['regionCode', 'viewProject', 'chooseBusinessMap', 'chooseBusiness', 'viewOrganize'])
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.$store.commit('addTabs', {
        title: `${vm.$route.query.proName}-商圈设置`,
        link: decodeURIComponent(to.fullPath),
        on: false,
        needCatch: true
      })
    })
  },
  filters: {
    textEllipsis
  },
  watch: {
    chooseBusiness(newVal) {
      if (newVal && newVal.length > 0) {
        this.dataTile = '/' + this.chooseBusinessMap.get(newVal[0])['orgName']
      } else {
        this.dataTile = ''
      }
    }
  },
  mounted() {
    this.mapInit()
    this.viewPlan = this.viewProject ? JSON.parse(this.viewProject) : {'proName': ''}
  },
  methods: {
    showUp() {
      this.showTag = !this.showTag
    },
    // 地图 初始化
    mapInit() {
      this.mapObj = new AMap.Map('map-box', {
        resizeEnable: true, //自适应大小
        center: [116.405285, 39.904989],
        zoom: 10 //初始视窗
      })
      this.mapObj.on('complete', function () {
        console.log('地图初始化完毕')
      })
      this.$store.commit('map/SET_ORGANIZATION_SHOW', false)
      this.$store.commit('map/SET_ORGANIZATION_DISABLED', false)
      this.$store.commit('map/SET_MAP_ORGANIZATION', true)
    },
    // 获取图例区域形态列表
    getlevel(list) {
      this.regionalList = list
    },
    // 选择 操作类型
    async chooseCode(code) {
      this.operationCode = code
      if (code === 'add') {
        this.mapObj.clearMap()
        this.$refs.businessTagChild.targetTable = ''
        this.editBusinessDistrict = ''
        this.$store.dispatch('map/setOrganizationShow', false)
        // 通用工具栏禁用
        this.$store.dispatch('map/setOrganizationDisabled', true)
        this.$refs.administrativeChildAdd.getOrgBoundary()
        this.$refs.administrativeChildAdd.getRegionTree(this.viewOrganize.orgId)
      }
      if (code === 'edit') {
        this.$store.commit('businessPreview/setIsPreview', false)
        this.$store.dispatch('map/setOrganizationShow', false)
        // 通用工具栏禁用
        this.$store.dispatch('map/setOrganizationDisabled', true)
        // 清除绘制
        this.mapObj.clearMap()
        this.$refs.listChild.clearDraw().clearAll()
        // 获取商圈 详情
        this.$refs.infoChild.getBasicInfo(this.chooseBusinessDistrict.toString())
        // 获取商圈 等级
        this.$refs.businessLevelChild.getLevel()
        // 确认当前 商圈是否存在 未保存数据
        let result = await Business_District_API.checkEdit({businessNo: this.chooseBusinessDistrict.toString()})
        if (result.data) {
          this.$confirm('当前商圈存在未保存数据，是否继续操作?', '提示', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 获取商圈 组织架构树
            this.$refs.administrativeChildEdit.getEditRegionTree(this.chooseBusinessDistrict.toString())
          }).catch(async () => {
            await Business_District_API.cancelEdit({businessNo: this.chooseBusinessDistrict.toString()})
            // 获取商圈 组织架构树
            this.$refs.administrativeChildEdit.getEditRegionTree(this.chooseBusinessDistrict.toString())
          });
        } else {
          // 获取商圈 组织架构树
          this.$refs.administrativeChildEdit.getEditRegionTree(this.chooseBusinessDistrict.toString())
        }

      }
    },
    // 已选中 商圈
    changeBusiness(val) {
      this.chooseBusinessDistrict = val
    },
    // 跳转指定界面
    redirectUrl(urlName) {
      this.$store.commit('businessPreview/SET_VIEW_ORGANIZE', null)
      this.$router.push({name: urlName})
    },
    // 检测是够存在异常商圈
    checkAbnormal() {
      //  验证 是否存在异常商圈
      if (this.operationCode === 'add' || this.operationCode === 'edit') {
        if (this.operationCode === 'add') {
          if(!this.paramsCheck('add')) {
            return
          }
          if(this.$refs.attributeAssemblyChild.addData.level && this.$refs.attributeAssemblyChild.businessLevel) {
            if(this.$refs.attributeAssemblyChild.addData.level !== this.$refs.attributeAssemblyChild.businessLevel) {
              this.$refs.adjustBusinessChild.isShowDetailDialog = true
            } else  {
              this.addBusinessDistrict()
            }
          }
        }
        // 编辑 校验
        if (this.operationCode === 'edit') {
         if(! this.paramsCheck('edit')) {return;}
          if (this.$cookies.get('businessLevel')) {
            let mustCheckLevel = ''
            if (this.$cookies.get('businessLevel') === 'gz') {
              mustCheckLevel = this.$refs.businessLevelChild.levelLeader
            }
            if (this.$cookies.get('businessLevel') === 'df') {
              mustCheckLevel = this.$refs.businessLevelChild.levelEmployee
            }
            if (!mustCheckLevel) {
              this.$message({
                message: '请选择商圈等级',
                type: 'warning'
              })
            } else {
              if (mustCheckLevel !== this.$refs.businessLevelChild.levelAi) {
                this.$refs.adjustBusinessChild.isShowDetailDialog = true
              } else {
                this.updateBusinessDistrict()
              }
            }
          } else {
            console.error('查询不到当前用户角色 等级')
          }
        }
      }
    },
    // 新增商圈
    async addBusinessDistrict(adjusetObj) {
      let subInfo = {
        businessName: this.$refs.administrativeChildAdd.businessNameText.substring(0, 100),
        businessNo: '',
        businessScope: this.$refs.administrativeChildAdd.businessNameArray.join('+').substring(0, 100),
        levelEmployee: this.$refs.attributeAssemblyChild.businessLevel,
        levelEmployeeName: this.$refs.attributeAssemblyChild.businessLevelName,
        orgName: this.$refs.administrativeChildAdd.subjectionValueName,
        orgId: this.$refs.administrativeChildAdd.subjectionValue,
        proNo: this.$route.params.id,
        regionCode: this.regionCode.selectedRegionCode,
        specialRegionCode: this.regionCode.selectedSpecialCode,
      }
      if (adjusetObj) {
        subInfo = {
          ...subInfo,
          businessLevelVO: adjusetObj
        }
      }
      let result = await Business_District_API.addBusinessCircle(subInfo)
      if (result && result.code === '200') {
        this.cancelHandle()
        // 更新商圈列表
        this.$refs.listChild.getList(this.viewOrganize.orgId)
      }
    },
    // 编辑商圈
    async updateBusinessDistrict(adjusetObj) {
      console.log('%c编辑商圈', 'color: #43bb88;font-size: 24px;font-weight: bold;text-decoration: underline;');
      console.info(this.regionCode)
      let subInfo = {
        businessName: this.editBusinessDistrict.businessName,
        businessNo: this.editBusinessDistrict.businessNo,
        businessScope: this.editBusinessDistrict.businessScope,
        levelEmployee: this.$refs.businessLevelChild.levelEmployee,
        levelEmployeeName: this.$refs.businessLevelChild.levelEmployeeName,
        levelLeader: this.$refs.businessLevelChild.levelLeader,
        levelLeaderName: this.$refs.businessLevelChild.levelLeaderName,
        proNo: this.$route.params.id,
        // 街道
        regionCode: this.regionCode.selectedRegionCode,
        specialRegionCode: this.regionCode.selectedSpecialCode,
        halfSpecialRegionCode: this.regionCode.halfCheckedRegionCode,
        // 反馈数
        housePriceAvgCount: this.$refs.businessTagChild.averageHousingPrice,
        housePriceCount: this.$refs.businessTagChild.housingPrice,
        populationCount: this.$refs.businessTagChild.consumptionPower,
      }
      if (adjusetObj) {
        subInfo = {
          ...subInfo,
          businessLevelVO: adjusetObj
        }
      }
      let result = await Business_District_API.updateBusinessCircle(subInfo)
      if (result && result.code === '200') {
        this.cancelHandle()
        // 更新商圈列表
        this.$refs.listChild.getList(this.viewOrganize.orgId)
      }
    },
    // 参数校验
    paramsCheck(type) {
      if(type === 'add') {
        // 商圈名称
        if(!this.$refs.administrativeChildAdd.businessNameText) {
          this.$message({
            message: '请填写商圈名称',
            type: 'warning'
          })
          return false
        }
        // 所属组织
        if(!this.$refs.administrativeChildAdd.subjectionValue) {
          this.$message({
            message: '请选择所属组织',
            type: 'warning'
          })
          return false
        }
        // 系统建议等级
        if(!this.$refs.attributeAssemblyChild.addData.levelName) {
          this.$message({
            message: '系统建议等级不能为空',
            type: 'warning'
          })
          return false
        }
        // 商圈等级
        if(!this.$refs.attributeAssemblyChild.businessLevel) {
          this.$message({
            message: '请选择商圈等级',
            type: 'warning'
          })
          return false
        }
        return true
      }
      if(type === 'edit') {
        if(!this.editBusinessDistrict.businessName) {
          this.$message({
            message: '请填写商圈名称',
            type: 'warning'
          })
          return false
        }
        if(!this.$refs.businessLevelChild.levelAiName) {
          this.$message({
            message: '请计算系统建议等级',
            type: 'warning'
          })
          return false
        }
        if(this.$cookies.get('businessLevel') === 'gz') {
          if(!this.$refs.businessLevelChild.levelLeader) {
            this.$message({
              message: '请选择总部等级',
              type: 'warning'
            })
            return false
          }
        } else {
          if(!this.$refs.businessLevelChild.levelEmployee) {
            this.$message({
              message: '请选择专员等级',
              type: 'warning'
            })
            return false
          }
        }
        return true
      }
    },
    // 编辑 商圈信息 赋值
    updateBusinessDistrictInfo(data) {
      this.editBusinessDistrict = data
      console.log('%c编辑 商圈信息 赋值', 'color: #43bb88;font-size: 24px;font-weight: bold;text-decoration: underline;');
      console.info(data)
      let consumptionPower, averageHousingPrice, housingPrice
      for(let item of this.editBusinessDistrict.targetVo) {
        if(item.targetNo === 'resident_population') {
          consumptionPower = item.valueUser
        }
        if(item.targetNo === 'house_prices') {
          housingPrice = item.valueUser
        }
        if(item.targetNo === 'avg_house_prices') {
          averageHousingPrice = item.valueUser
        }
      }
      console.info(consumptionPower, housingPrice, averageHousingPrice)
      this.$refs.businessTagChild.targetTable = {
        targetList: this.editBusinessDistrict.targetVo,
        inventoryList: this.editBusinessDistrict.inventoryVo,
        businessName: this.editBusinessDistrict.businessName,
        consumptionPower: +consumptionPower,
        averageHousingPrice: +averageHousingPrice,
        housingPrice: +housingPrice,
      }
    },
    updateBusinessData(data) {
      this.computedBusinessTagData = data
      this.$refs.businessTagChild.targetTable = this.computedBusinessTagData.targetVo
    },
    // 取消
    cancelHandle() {
      if (this.operationCode === 'edit') {
        // this.$refs.administrativeChildEdit.off()
        this.$refs.administrativeChildEdit.resetChecked()
        if(this.editBusinessDistrict.businessNo) {
          Business_District_API.cancelEdit({businessNo: this.editBusinessDistrict.businessNo})
        } else {
          console.error('参数缺失，无法取消，请检查商圈详情数据是否缺失')
        }
      } else {
        this.$refs.administrativeChildAdd.resetChecked()
        // this.$refs.administrativeChildAdd.off()
      }
      if(this.viewOrganize) {
        // 组织id
        this.$store.dispatch('map/setOrganizationId', this.viewOrganize.orgId)
        // 组织name
        this.$store.dispatch('map/setOrganizationName',this.viewOrganize.orgName)
      }
      this.operationCode = ''
      // 更新商圈列表
      this.$refs.listChild.getList(this.viewOrganize.orgId)
      this.$store.dispatch('map/setOrganizationDisabled', false)
      this.$store.commit('businessPreview/SET_OPERATION_CODE', '')
    }
  }
}
</script>

<style scoped lang="less">
.business-wrap {
  width: 100%;
  position: relative;

  .iconbox {
    height: 40px;
    width: 40px;
    font-size: 15px;
    color: #ffffff;
    display: flex;
    align-items: center;
    background-color: #0a2757;

    .icon {
      margin: 0 13px;
    }
  }

  .breadcrumb {
    height: 40px;
    line-height: 40px;
    display: flex;
    text-align: left;
    background: #081f45;
    position: relative;
    align-items: center;
    font-size: 15px;
    color: #ffffff;
    width: 340px;

    .icon {
      margin: 0 13px;
      cursor: pointer;
    }
  }

  .left-operate {
    width: 340px;
    height: 100%;
    background: #081F45;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }

  .components-box {
    height: 100%;
  }

  .left-operation {
    height: calc(100% - 110px);
    overflow-y: auto;
  }

  .close {
    height: 40px;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 340px;
    height: 51px;
    background: #0A2757;
    border-radius: 2px 2px 4px 4px;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;

    .btn {
      width: 295px;
      height: 28px;
      line-height: 28px;
      padding: 0;
      background: #930CEA;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 500;
      color: #FFFFFF;
      border: none;
    }

    .btn-cancel {
      width: 110px;
      height: 28px;
      background: #415982;
      border-radius: 2px;
      font-size: 12px;
      font-weight: 600;
      color: #FFFFFF;
      padding: 0;
      border: none;
    }

    .btn-add {
      width: 170px;
      height: 28px;
      background: #930CEA;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      color: #FFFFFF;
      padding: 0;
      border: none;
    }
  }

  .map-box {
    width: 100%;
    height: 100%;
  }
}
</style>
<style>
.popperClassTip {
  background: rgba(0, 0, 0, .75) !important;
}
.business-tree .organization{
  right: 10px !important;
}
</style>
