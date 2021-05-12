<!--行政边界范围-->
<template>
  <div class="administrative-wrap">
    <div class="list-header" :class="{'list-header-active': !openStatus}" @click="openStatus = !openStatus">行政边界范围</div>
    <!-- 行政 🌲   -->
    <collapse-transition>
      <div v-show="openStatus">
        <div class="administrative-tree">
          <tree
              :data="treeData"
              ref="orgTree"
              node-key="regionCode"
              default-expand-all
              :props="defaultProps"
              class="smart_tree_deep"
              @check="handleCheckChange"
              show-checkbox>
         <span class="custom-tree-node" slot-scope="{ data }">
            <el-tooltip
                class="item"
                effect="dark"
                :content="'已属于' + data.otherSettingsName + '组织'"
                placement="top-start"
                v-if="data.isOtherSettings && data.regionName != '中华人民共和国'"
            >
              <span style="color: #D99DFF;">{{ data.regionName }}</span>
            </el-tooltip>
            <span v-else>
              <span v-if="data.isOtherSettings" style="color: #D99DFF;">{{ data.regionName }}</span>
              <span v-else>{{ data.regionName }}</span>
            </span>
          </span>
          </tree>
        </div>
        <div class="administrative-from" v-if="operationCode === 'add'">
          <div class="from-item">
            <span>商圈名称：</span>
            <el-input v-model="businessNameText" placeholder="请输入内容"></el-input>
          </div>
          <div class="from-item">
            <span>所属组织：</span>
            <el-select v-model="subjectionValue" placeholder="请选择"  @change="organizeChange">
              <el-option
                  v-for="item in organizeOption"
                  :key="item.orgId"
                  :label="item.orgName"
                  :value="item.orgId">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </collapse-transition>
  </div>
</template>

<script>
import MapCtrl from '@/util/map'
import Business_District_API from "@api/business-district/index";
import collapseTransition from '@/util/collapse'
import {mapGetters} from 'vuex'
import tree from '@/components/tree'
// import * as turf from '@turf/turf'
import {AMap} from "@/plugins/AMap";
import {debounce} from 'throttle-debounce';

export default {
  name: "administrativeScope",
  props: ['AMap', 'editBusinessDistrict'],
  components: {collapseTransition, tree},
  data() {
    return {
      fullscreenLoading: false,
      openStatus: true,
      defaultProps: {
        children: 'regions',
        label: 'regionName'
      },
      treeData: [], //行政树数据
      organizeDrawResultMap: '', //组织边界绘制结果 行销公司｜营业部
      organizeOption: [], // 所属组织
      subjectionValue: '', // 隶属组织 ID
      subjectionValueName: '', //隶属组织 名称
      businessNameArray: [], // 商圈名称 数组
      businessNameText: '', // 商圈名称
      regionCodeMap: new Map(), // 选中街道code （正常街道/特殊街道）
      streetDrawResultMap: [], // 选中街道绘制结果
      specialRegionCode: [], // 当前 行政树 上 特殊街道 （被占用网格的街道）
      selectedSpecialCode: [], // 全选 已选中的特殊街道
      selectedRegionCode: [], // 全选 选中的正常街道
      halfCheckedRegionCode: [], // 半选 选中的特殊街道
      streetColor: '', // 街道颜色
      loading: '',
      streetNameResultMap: [],
      businessNo: '',
      nowOrganizeID: ''
    }
  },
  computed: {
    ...mapGetters('businessPreview', ['operationCode', 'chooseBusinessMap', 'viewOrganize', 'gridSelection'])
  },
  watch: {
    operationCode() {
      // console.info(this.operationCode)
      if (!this.operationCode) {
        // 取消操作 && 创建成功
        this.resettingParams()
      }
    }
  },
  methods: {
    // 新增 获取组织架构树
    async getRegionTree(orgId) {
      this.nowOrganizeID = orgId
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let result = await Business_District_API.regionTree({
        orgId: orgId,
        proNo: this.$route.params.id,
        isLoading: false
      })
      if (result.code === '200') {
        this.treeData = result.data.regionTree
        this.dataProcessing(this.treeData)
        // 绘制 营业部
        this.drawOrgBorder([result.data.org])
      }
      loading.close()
      // this.AMap.off('click', this.mapEvent)
      // this.AMap.on('click', this.mapEvent)
    },
    // 数据处理
    dataProcessing(data) {
      for (let item of data) {
        this.$set(item, 'disabled', item.isOtherSettings ? item.isOtherSettings : false)
        this.$set(item, 'showCheckbox', true)
        if (item.regions && item.regions.length > 0) {
          this.dataProcessing(item.regions)
        }
      }
    },
    // 编辑 组织架构树
    async getEditRegionTree(businessNo) {
      let _this = this
      _this.fullscreenLoading = true
      _this.businessNo = businessNo
      _this.nowOrganizeID = _this.chooseBusinessMap.has(businessNo) ? _this.chooseBusinessMap.get(businessNo)['orgId'] : ''
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let result = await Business_District_API.businessRegionTree({
        orgId: _this.viewOrganize.orgId,
        proNo: _this.$route.params.id,
        businessNo: businessNo,
      })
      if (result.code === '200') {
        _this.treeData = result.data.regionTree
        // 绘制 营业部
        _this.drawOrgBorder([result.data.org])

        _this.dataProcessing(_this.treeData)
        // 赋值 默认选中节点
        let chooseNodes = []
        if (result.data.regionCodes) {
          chooseNodes = chooseNodes.concat(result.data.regionCodes)
        }
        if (result.data.specialRegionCodes) {
          chooseNodes = chooseNodes.concat(result.data.specialRegionCodes)
        }
        // 绑定行政树
        _this.$refs.orgTree.setCheckedKeys(chooseNodes)
        // 请求节点数据
        _this.requestStreetRegion('edit',{
          filterNormalStreet: result.data.regionCodes,
          filterSpecialStreet: result.data.specialRegionCodes
        })
        _this.selectedRegionCode = result.data.regionCodes
        _this.selectedSpecialCode = result.data.specialRegionCodes
        this.$store.commit('businessPreview/SET_REGION_CODE', {
          selectedSpecialCode: _this.selectedSpecialCode,
          selectedRegionCode: _this.selectedRegionCode,
          halfCheckedRegionCode:[]
        })
        _this.fullscreenLoading = false
      }
      loading.close()
      _this.AMap.off('click', _this.mapEvent)
      _this.AMap.on('click', _this.mapEvent)
    },
    organizeChange(val) {
      let yetChooseOrganize = this.organizeOption.filter(item => item.orgId === val)
      this.subjectionValueName = yetChooseOrganize[0]['orgName']
    },
    // 获取 所属组织 营业部
    async getOrgBoundary() {
      let result = await Business_District_API.getOrgBoundary({
        orgId: this.viewOrganize.orgId,
        proNo: this.$route.params.id
      })
      if (result.code === '200') {
        this.organizeOption = result.data.childListOrg
      }
    },
    // 绘制 组织边界
    async drawOrgBorder(data) {
      let borderResult = await MapCtrl.drawBorders(this.AMap, {
        data: data,
        strokeColor: 'red',
        strokeWeight: 2,
        fillColor: '',
        fillOpacity: 0.8,
        markCode: 'orgId'
      })
      this.organizeDrawResultMap = borderResult.borderPolygonArr
      this.AMap.setFitView(borderResult.PolygonArr)
    },
    // 清除绘制 组织边界
    clearOrgBorder() {
      if (this.organizeDrawResultMap) {
        for (let item of this.organizeDrawResultMap) {
          this.AMap.remove(item.geojson)
        }
      }
    },
    // 拼接 商圈名称
    getBusinessName() {
      let currentNodes = this.$refs.orgTree.getCheckedNodes()
      this.businessNameArray = []
      for (let item of currentNodes) {
        if (item.regionLevel === 4 || item.regionLevel === 5) {
          this.businessNameArray.push(item.regionName)
        }
      }
      this.businessNameText = this.businessNameArray.join('+')
      this.$store.commit('businessPreview/SET_NEED_UPDATE_LEVEL_AI', new Date().getTime())
      this.$store.commit('businessPreview/SET_EDIT_BUSINESS_SCOPE', this.businessNameText)
    },
    // 点击行政树
    async handleCheckChange(data) {
      /**
       * 1: 确认当前操作，选中或删除
       * 2：选中状态需 请求接口 获取当前行政树下 街道数据
       * 3：根据返回结果绘制街道
       */
      let checkedNodeStatus = this.$refs.orgTree.getNode(data.regionCode).checked //当前 节点 选中状态  (未被占用节点）
      let halfCheckedKeysCodes = this.$refs.orgTree.getHalfCheckedKeys()
      await this.getYetCheckStreet()
      if (checkedNodeStatus || halfCheckedKeysCodes.includes(data.regionCode)) {
        // 选中
        await this.requestStreetRegion('add')
      } else {
        // 去除选中
        let drawData = this.getCanDrawStreetData(data, [])
        await this.clearStreetMap(drawData)
      }
      this.getBusinessName()
    },
    // 获取可用于绘制的街道数据
    getCanDrawStreetData(data) {
      /**
       *  选中的节点
       *  1： 省市区级别
       *        筛选出街道和子街道  需剔除已被占用的街道或子街道数据
       *  2： 街道级别
       *        有子街道的 需要过滤掉已被占用子街道
       *        无子街道 可直接绘制
       *  3： 子街道级别
       */
      if(data) {
        if(data.regionLevel < 4) { // 省市区
          return this.getStreetData([data], [])
        }
        if(data.regionLevel  === 4) { // 街道级别
          if(!data.regions) {  // 不存在子街道
            return [data]
          } else {
            return  data.regions.filter(item => !item.isOtherSettings)
          }
        }
        if(data.regionLevel  === 5) {  // 子街道
          return [data]
        }
      } else {
        return null
      }
    },
    // 递归 收集当前组织下所有的街道数据
    getStreetData(data, drawData) {
      for (let item of data) {
        if (item.regions && item.regions.length > 0 && item.regionLevel <= 4) {
          this.getStreetData(item.regions, drawData)
        } else {
          // 标示街道层级
          if (!item.isOtherSettings) {
            drawData.push(item)
          }
        }
      }
      return drawData
    },
    // 清除绘制街道
    clearStreetMap(streetCode) {
      if(streetCode) {
        for (let item of this.streetDrawResultMap) {
          for (let streetItem of streetCode) {
            if (streetItem.regionCode === item.id) {
              this.regionCodeMap.delete(item.id)
              this.AMap.remove(item.geojson)
            }
          }
        }
      } else {
        for (let item of this.streetDrawResultMap) {
          this.AMap.remove(item.geojson)
        }
      }
    },
    // 请求获取街道 边界 数据
    async requestStreetRegion(type, streetCodes=[]) {
      let data
      if(type === 'add') {
        data = this.filterYetDrawStreet()
      } else {
        data = streetCodes
      }
      let result = await Business_District_API.getStreetBoundary({
        regionCode: data.filterNormalStreet,
        childCode: data.filterSpecialStreet
      })
      if(result.code === '200' && result.data && result.data.length > 0) {
        let regionData = result.data
        this.drawStreet(regionData)
      } else {
        this.$message.error('缺失街道边界数据，无法绘制！');
      }
    },
    // 获取当前选中街道/子街道
    getYetCheckStreet() {
      this.selectedSpecialCode = []
      this.selectedRegionCode = []
      this.halfCheckedRegionCode = []
      let checkNodes = this.$refs.orgTree.getCheckedNodes()
      // 筛选出 街道
      let checkNodesRegionCode = checkNodes.filter(item => item.regionLevel === 4)
      // 筛选出 子街道
      let checkNodesSpecialCode = checkNodes.filter(item => item.regionLevel === 5)
      // 清除街道中 的已被选中的子街道的父街道
      let coincideRegionCode = []
      for (let item of checkNodesSpecialCode) {
        coincideRegionCode.push(item.regionParentCode)
      }
      coincideRegionCode = coincideRegionCode.filter((item, index) => coincideRegionCode.indexOf(item, 0) === index)  // 去重
      checkNodesRegionCode = checkNodesRegionCode.filter(item => coincideRegionCode.indexOf(item.regionCode) < 0) // 去重
      for (let item of checkNodesSpecialCode) {
        this.selectedSpecialCode.push(item.regionCode)
      }
      for (let item of checkNodesRegionCode) {
        this.selectedRegionCode.push(item.regionCode)
      }
      this.$store.commit('businessPreview/SET_REGION_CODE', {
        selectedSpecialCode: this.selectedSpecialCode,
        selectedRegionCode: this.selectedRegionCode,
        halfCheckedRegionCode:[]
      })
    },
    // 过滤数据 清除掉已绘制街道
    filterYetDrawStreet() {
      let filterNormalStreet, filterSpecialStreet
      if(this.regionCodeMap.size > 0) {
        filterNormalStreet =  this.selectedRegionCode.filter(code => !this.regionCodeMap.has(code))
      } else {
        filterNormalStreet = this.selectedRegionCode
      }
      if(this.regionCodeMap.size > 0) {
        filterSpecialStreet =  this.selectedSpecialCode.filter(code => !this.regionCodeMap.has(code))
      } else {
        filterSpecialStreet = this.selectedSpecialCode
      }
      return {
        filterNormalStreet: filterNormalStreet,
        filterSpecialStreet: filterSpecialStreet
      }
    },
    // 绘制街道
    async drawStreet(streetMapData) {
      let _this = this
      let streetDrawResult = await MapCtrl.drawBorders(_this.AMap, {
        data: streetMapData,
        strokeColor: '#000',
        strokeWeight: 1,
        bubble: false,
        fillColor: _this.editBusinessDistrict.levelEmployeeColor ? _this.editBusinessDistrict.levelEmployeeColor : _this.editBusinessDistrict.levelLeaderColor ? _this.editBusinessDistrict.levelLeaderColor : 'blue',
        fillOpacity: _this.editBusinessDistrict.diaphaneity ? _this.editBusinessDistrict.diaphaneity : 0.4,
        markCode: 'regionCode',
        callBack: (target, info) => {
          _this.streetMapEvent(target, info)
        }
      })
      _this.streetDrawResultMap = _this.streetDrawResultMap.concat(streetDrawResult.borderPolygonArr)
      if (streetDrawResult.borderPolygonArr) {
        for (let item of streetDrawResult.borderPolygonArr) {
          _this.regionCodeMap.set(item.id, item.id)
        }
      }
    },
    resetChecked() {
      this.$refs.orgTree.setCheckedKeys([]);
      this.specialRegionCode = []
    },
    // 初始化
    resettingParams() {
      this.businessNameText = ''
      this.subjectionValue = ''
      this.treeData = []
      this.regionCodeMap.clear()
      this.clearStreetMap()
      this.clearOrgBorder()
    },
    // 街道 地图事件
    streetMapEvent(target, info) {
      let _this = this
      target.on('click', function () {
        if (_this.gridSelection) {
          return
        }
        _this.updateTree(info, 'delete')
        _this.clearAppointStreet(info.regionCode)
      })
      target.on('mouseover', debounce(5, (e) => {
        _this.clearStreetName()
        _this.drawStreetName([{
          gdLng: e.lnglat.getLng(),
          gdLat: e.lnglat.getLat(),
          streetName: info.regionName,
          id: info.regionCode
        }])
      }))
      target.on('mouseout', () => {
        _this.clearStreetName()
      })
    },
    // 绘制街道名称
    async drawStreetName(data) {
      const result = await MapCtrl.drawNames(this.AMap, {
        data: data,
        strokeColor: 'blue',
        strokeWeight: 5,
        nameKey: 'streetName',
        offsetInfo: new AMap.Pixel(0, -23),
        style: {
          'border-width': 0,
          'text-align': 'center',
          'font-size': '12px',
          padding: '5px 10px',
          'font-weight': '400',
          color: '#ffffff',
          'font-family':
              'MicrosoftYaHei, Microsoft YaHei Normal, Microsoft YaHei',
          'background-color': '#00000080'
        },
      })
      this.streetNameResultMap = result
    },
    // 清除绘制的 街道名称
    clearStreetName() {
      if (this.streetNameResultMap && this.streetNameResultMap.length > 0) {
        for (let item of this.streetNameResultMap) {
          if (item.text) {
            this.AMap.remove(item.text)
          }
        }
      }
    },
  }
}
</script>

<style scoped lang="less">
.administrative-wrap {
  /deep/ .el-tree__empty-text {
    color: #dad4d4;
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

  .administrative-tree {
    max-height: 269px;
    padding: 10px 0;
    overflow: auto;
  }

  .administrative-from {
    width: 340px;
    height: 88px;
    background: #102F63;
    box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.5);
    padding-top: 15px;
    margin-bottom: 10px;

    .from-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      span {
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

      /deep/ .el-input {
        width: 230px;
        height: 30px;
      }

      /deep/ .el-input__inner {
        height: 30px;
        line-height: 30px;
        background-color: #102F63;
        border: 1px solid #647F9A;
        color: rgba(255, 255, 255, 0.61);
      }

      /deep/ .el-input__icon {
        line-height: 30px;
      }
    }
  }

}
</style>
