<!--商圈列表-->
<template>
  <div class="list-wrap"
       v-loading.fullscreen.lock="fullscreenLoading"
       element-loading-text="数据加载中..."
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="list-header" :class="{'list-header-active': !openStatus}" @click="openStatus = !openStatus">商圈列表</div>
    <collapse-transition>
      <div class="list-content" v-show="openStatus">
        <el-collapse v-model="activeName">
          <div class="open-switch" v-for="item of table" :key="item.orgId">
            <el-switch
                v-model="item.checked"
                @change="handleChangeOrganize($event, item)"
                active-color="#930CEA"
                inactive-color="#b5afaf54">
            </el-switch>
            <el-collapse-item :name="item.orgId">
              <div slot='title' class="list-title"><span>{{ item.orgName }}({{ item.bccTotal }})</span></div>
              <slot v-if="item.bccList.length > 0">
                <div class="list-item" v-for="childItem of item.bccList" :key="childItem.bussinessId">
                  <el-checkbox v-model="childItem.checked" @change="chooseBusiness($event, childItem)">
                    <el-tooltip
                                class="item"
                                popper-class="popperClassTip"
                                effect="dark"
                                :content="childItem.businessName"
                                :disabled="childItem.businessName && childItem.businessName.length < 11"
                                placement="right">
                      <span >{{
                          childItem.businessName | textEllipsis(11)
                        }}</span>
                    </el-tooltip>
                  </el-checkbox>
                  <p class="business-level">
                    <span class="level-color"
                          :style="{background: childItem.color ? childItem.color : 'transparent', opacity: childItem.diaphaneity ? childItem.diaphaneity : 0 }"></span>
                    <el-tooltip
                                class="item"
                                popper-class="popperClassTip"
                                effect="dark"
                                :content="childItem.levelName ?childItem.levelName : '暂无商圈等级' "
                                :disabled="childItem.levelName && childItem.levelName.length < 7"
                                placement="right">
                      <span> {{ childItem.levelName  | textEllipsis(7) }}</span>
                    </el-tooltip>
                  </p>
                </div>
              </slot>
              <slot v-else>
                <p class="no-business">暂无商圈</p>
              </slot>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </collapse-transition>
  </div>
</template>

<script>
import {AMap} from '@/plugins/AMap';
import Business_District_API from "@api/business-district/index";
import collapseTransition from '@/util/collapse'
// 引入 过滤器
import {textEllipsis} from '@/util/filters'
import MapCtrl from '@/util/map'
import {mapGetters} from 'vuex'

export default {
  name: "BusinessList",
  props: ['AMap'],
  components: {collapseTransition},
  data() {
    return {
      openStatus: true,
      activeName: ['1', '2', '3'],
      value: '',
      checked: false,
      proNo: '',// 方案 ID
      table: [],
      listMap: new Map(), // 营业部 map
      nameStyle: {
        'text-align': 'center',
        'font-size': '14px',
        'font-weight': 'bold',
        'color': '#000',
        'background-color': '#f0f8ff00',
        'border': '1px solid #f0f8ff00'
      },
      businessList: [],  // 商圈 数据
      businessArray: [], // 商圈 绘制 地图实例
      organizeArray: [],  // 组织相关 地图实例
      businessNumMapArray: [], // 商圈数量 地图实例
      HighlightBusinessMap: new Map(), // 高亮的商圈
      yetChooseBusiness: [], // 已选中 商圈
      organizeData: [],
      chooseMap: new Map(),
      currentOrganizeName: '', // 当前组织名称
      unusualBusinessData: [], // 异常商圈数据
      unusualBusinessResult: [],  // 异常商圈绘制结果
      fullscreenLoading: false,
      businessNameMap: new Map() // 商圈名字绘制结果
    }
  },
  filters: {
    textEllipsis
  },
  computed: {
    ...mapGetters('businessPreview', ['operationCode', 'regionCode', 'abnormalBusinessStatus', 'deleteBusiness', 'viewOrganize', 'gridSelection']),
    ...mapGetters('map', ['organizationId', 'treeData', 'organizationName'])
  },
  watch: {
    organizationId() {
      let organizeType = this.treeData ? this.treeData['orgType'] : 0
      // 南北区/全国 不予处理
      if (organizeType !== -1 && organizeType !== 0 && this.operationCode !== 'edit') {
        let organizationId = this.organizationId
        let organizationName = this.organizationName
        if(this.treeData.orgType ===  2) {
          // 营业部
          organizationId = this.treeData.parentId
          organizationName = this.treeData.name
        }
        this.$store.commit('businessPreview/SET_VIEW_ORGANIZE', {
          proNo: this.$route.params.id,
          orgId: organizationId,
          orgName: organizationName
        })
        // console.log('%cHello -1', 'color: #43bb88;font-size: 24px;font-weight: bold;text-decoration: underline;');
        this.getList(this.organizationId)

      }
    },
    // 监听异常商圈
    abnormalBusinessStatus() {
      if (this.abnormalBusinessStatus) {
        this.drawUnusualBusiness()
      } else {
        this.clearUnusualBusiness()
      }
    },
    // 发生 删除商圈操作
    deleteBusiness() {
      this.getList(this.viewOrganize.orgId)
    }
  },
  mounted() {
    let _this = this
    _this.proNo = _this.$route.params.id
    if(_this.viewOrganize) {
      // 组织id
      _this.$store.dispatch('map/setOrganizationId', _this.viewOrganize.orgId)
      _this.getList(_this.viewOrganize.orgId)
    } else {
      _this.getList(_this.$route.query.orgId)
    }
  },
  methods: {
    // 获取商圈列表
    async getList(orgId, type = 'default') {
      this.fullscreenLoading = true
      let result = await Business_District_API.businessDistrictsList({
        orgId: orgId,
        proNo: this.$route.params.id,
        isLoading: false
      })
      if (result.code === '200') {
        this.table = result.data.bccOrgVoList
        this.$emit('getlevel', result.data.levelList)
        this.organizeData = [
          {
            gdBoundarJson: result.data.orgBoundar,
            orgId: result.data.orgId,
            orgName: result.data.orgName,
            zoningLat: result.data.zoningLat,
            zoningLng: result.data.zoningLng,
          }
        ]
        // 重置
        this.unusualBusinessData = []
        this.$store.commit('businessPreview/SET_OPERATION_CODE', '')
        this.$store.commit('businessPreview/RESET_CHOOSE_BUSINESS', '')
        // 组织name
        this.$store.dispatch('map/setOrganizationName', result.data.orgName)
        this.resetParams()
        this.currentOrganizeName = result.data.orgName

        this.dataDeal(type)
      }
      this.fullscreenLoading = false
    },
    // 数据处理
    dataDeal(type) {
      for (let item of this.table) {
        let listData = []
        // 默认开启 绘制组织 边界/底色
        this.$set(item, 'checked', true)
        this.$set(item, 'gdBoundarJson', item.orgBoundar)
        this.$set(item, 'gdLng', item.zoningLng)
        this.$set(item, 'gdLat', item.zoningLat)
        this.activeName.push(item.orgId)

        //暂存 商圈
        this.listMap.set(item.orgName, {
          id: item.orgId,
          businessList: []
        })

        for (let childItem of item.bccList) {
          this.$set(childItem, 'checked', false)
          this.$set(childItem, 'gdBoundarJson', childItem.boundar)
          this.$set(childItem, 'gdLng', childItem.zoningLng)
          this.$set(childItem, 'gdLat', childItem.zoningLat)
          this.$set(childItem, 'fillColor', childItem.color ? childItem.color : 'blue')
          this.$set(childItem, 'fillOpacity', childItem.diaphaneity ? childItem.diaphaneity : 0.4)
          this.businessList.push(childItem)
          listData.push(childItem.bussinessId)
          if (this.listMap.has(item.orgName)) {
            let temporaryStorage = this.listMap.get(item.orgName)
            temporaryStorage['businessList'] = listData
            this.listMap.set(item.orgName, temporaryStorage)
          }
          if (childItem.isExcept) {
            this.unusualBusinessData.push(childItem)
          }
        }
      }
      this.clearDraw().clearAll()
      this.drawBusiness(this.businessList, type, 20)
      this.drawOrganizeMap(this.table)
      this.drawOrganizeNumber()

    },
    // 营业部 开关
    handleChangeOrganize(val, item) {
      if (val) {
        //  开启 地图商圈 绘制
        this.drawBusiness(item.bccList, 'enlarge')
      } else {
        // 清除 地图商圈 绘制
        if (this.listMap.has(item.orgName)) {
          let needClearBusiness = this.listMap.get(item.orgName).businessList
          this.clearDraw().clearBusiness(needClearBusiness)
        }
      }
    },
    // 绘制商圈
    async drawBusiness(mapData, type = 'default', zIndex = '10') {
      let _this = this
      // 绘制底色
      // console.log('%cHello绘制底色', 'color: #43bb88;font-size: 24px;font-weight: bold;text-decoration: underline;');
      // console.info(mapData)
      let drawColor =  await MapCtrl.drawColors(this.AMap, {
        data: mapData,
        zIndex: zIndex,
        markCode: 'bussinessId',
        callBack(target, info) {
          _this.mapEvents(target, info, 'businessDistrict')
        }
      })
      // 绘制边界
      let drawBorder = await MapCtrl.drawBorders(this.AMap, {
        data: mapData,
        strokeColor: '#000',
        strokeWeight: 1,
        zIndex: zIndex,
        markCode: 'bussinessId',
        callBack(target, info) {
          _this.mapEvents(target, info, 'businessDistrict')
        }
      })
      _this.businessArray = _this.businessArray.concat([...drawBorder.borderPolygonArr, ...drawColor.backColorPolygonArr])
      if (type === 'enlarge') {
        this.AMap.setFitView(drawBorder.PolygonArr)
      }
    },

    // 绘制 组织相关
    async drawOrganizeMap(scopeBorder) {
      let _this = this
      let drawBorderResult = await MapCtrl.drawBorders(this.AMap, {
        data: scopeBorder,
        strokeColor: '#000',
        zIndex: 20,
        strokeWeight: 1,
        strokeOpacity: 1,
        markCode: 'orgId',
        callBack(target, info) {
          _this.mapEvents(target, info, 'organize')
        }
      })
      let drawOrganizeNameResult = await MapCtrl.drawNames(this.AMap, {
        data: scopeBorder,
        nameKey: 'orgName',
        markCode: 'orgId',
        style: {
          ...this.nameStyle,
          'text-shadow': '#FFF 1px 0 0,#FFF 0 1px 0,#FFF -1px 0 0,#FFF 0 -1px 0',
        },
        callBack(target, info) {
          _this.mapEvents(target, info, 'organize')
        }
      })
      this.AMap.setFitView(drawBorderResult.PolygonArr)
      this.organizeArray = [...drawBorderResult.borderPolygonArr, ...drawOrganizeNameResult]
    },
    // 选中 高亮 商圈
    chooseBusiness(valBoolean, businessData) {
      // console.info(valBoolean,  this.chooseMap)
      if (valBoolean) {
        this.drawHighlightBusiness(businessData)
        this.chooseMap.set(businessData.businessNo, {
          orgId: businessData.orgId,
          orgName: businessData.orgName
        })
      } else {
        this.chooseMap.delete(businessData.businessNo)
        this.clearDraw().clearHighlightBusiness(businessData.bussinessId)
      }
      this.yetChooseBusiness = [...this.chooseMap.keys()]
      this.$emit('change-business', this.yetChooseBusiness)
      this.$store.commit('businessPreview/SET_CHOOSE_BUSINESS_MAP', this.chooseMap)
      this.$store.commit('businessPreview/SET_CHOOSE_BUSINESS', this.yetChooseBusiness)
    },
    // 绘制高亮商圈
    async drawHighlightBusiness(businessMapData) {
      let _this = this
      let result = await MapCtrl.drawBorders(this.AMap, {
        data: [businessMapData],
        strokeColor: '#3F9EFF',
        strokeWeight: 3,
        markCode: 'orgId',
        fillColor: '',
        callBack: (target, info) => {
          _this.mapEvents(target, info, 'businessDistrict')
        }
      })
      // 商圈名称
      let drawBorderNameResult = await MapCtrl.drawNames(this.AMap, {
        data: [businessMapData],
        nameKey: 'businessName',
        markCode: 'bussinessId',
        offsetInfo: new AMap.Pixel(0, -23),
        needTextEllipsis: true,
        TextEllipsisLength: 18,
        style: {
          'border-width': 0,
          'text-align': 'left',
          'font-size': '13px',
          'font-weight': '400',
          'color': '#000000',
          'background-color': '#f0f8ff00',
          'width': '130px',
          'overflow:': 'hidden',
          'text-overflow': 'ellipsis',
          'word-break': 'break-all',
          'text-shadow': '#FFF 1px 0 0,#FFF 0 1px 0,#FFF -1px 0 0,#FFF 0 -1px 0',
          'white-space': 'normal'
        },
        callBack(target, info) {
          _this.mapEvents(target, info, 'businessDistrict')
        }
      })
      this.AMap.setFitView(result.PolygonArr)
      this.HighlightBusinessMap.set(businessMapData.bussinessId, result.borderPolygonArr)
      this.businessNameMap.set(businessMapData.bussinessId, drawBorderNameResult)
    },
    // 地图事件
    mapEvents(target, info, type) {
      let _this = this
      // console.log('%c地图事件', 'color: #43bb88;font-size: 24px;font-weight: bold;text-decoration: underline;');
      // 新增/编辑 此部分操作屏蔽
      if(this.operationCode) {return}
      target.on('click', function () {
        console.info(info)
        if (type === 'organize') {
          // 获取该 营业部 下 商圈列表
          _this.$store.dispatch('map/setOrganizationId',info.orgId)
          // 组织name
          _this.$store.dispatch('map/setOrganizationName',info.orgName)
        } else {
          const reg = /行销/g;
          if (reg.test(_this.currentOrganizeName)) {
            // 获取该 营业部 下 商圈列表
            _this.$store.dispatch('map/setOrganizationId',info.orgId)
            // 组织name
            _this.$store.dispatch('map/setOrganizationName',info.orgName)
          } else {
            _this.AMap.clearMap()
            _this.chooseMap.set(info.businessNo, {
              orgId: info.orgId,
              orgName: info.orgName
            })
            _this.yetChooseBusiness = [..._this.chooseMap.keys()]
            _this.$store.commit('businessPreview/SET_CHOOSE_BUSINESS_MAP', _this.chooseMap)
            _this.$store.commit('businessPreview/SET_CHOOSE_BUSINESS', _this.yetChooseBusiness)
            _this.$emit('change-business', _this.yetChooseBusiness)
            _this.$emit('choose-code', 'edit')
            _this.$store.commit('businessPreview/SET_OPERATION_CODE', 'edit')
          }
        }
      })
    },
    // 绘制 营业部  商圈数量
    async drawOrganizeNumber() {
      let drawOrganizeNumberResult = await MapCtrl.drawNames(this.AMap, {
        data: this.table,
        nameKey: 'bccTotal',
        prefisso: '商圈数:',
        markCode: 'orgId',
        offsetInfo: new AMap.Pixel(0, -23),
        style: {
          ...this.nameStyle,
          'background': 'rgba(191, 92, 255, 0.8)',
          'border-radius': '4px',
          'border': '1px solid #FFFFFF',
          'font-weight': 400,
          'color': '#fff',
        }
      })
      this.businessNumMapArray = drawOrganizeNumberResult
    },
    // 清除绘制
    clearDraw() {
      let _this = this
      return {
        // 清除 指定 商圈
        clearBusiness(data) {
          if (data) {
            for (let mapItem of _this.businessArray) {
              for (let item of data) {
                if (item === mapItem.id) {
                  if (mapItem.geojson) {
                    _this.AMap.remove(mapItem.geojson)
                  }
                  if (mapItem.text) {
                    _this.AMap.remove(mapItem.text)
                  }
                }
              }
            }
          } else {
            for (let mapItem of _this.businessArray) {
              if (mapItem.geojson) {
                _this.AMap.remove(mapItem.geojson)
              }
              if (mapItem.text) {
                _this.AMap.remove(mapItem.text)
              }
            }
          }

        },
        // 清除 高亮
        clearHighlightBusiness(id) {
          if (_this.HighlightBusinessMap.has(id)) {
            _this.AMap.remove(_this.HighlightBusinessMap.get(id)[0].geojson)
            _this.AMap.remove(_this.businessNameMap.get(id)[0].text)
          } else {
            for(let item of _this.HighlightBusinessMap.values()) {
              if(item[0]['geojson']) {
                _this.AMap.remove(item[0]['geojson'])
              }
            }
            for(let nameKey of _this.businessNameMap.values()) {
              if (nameKey.text) {
                _this.AMap.remove(nameKey.text)
              }
            }
          }
        },
        // 清除 商圈数
        clearBusinessNum() {
          if (_this.businessNumMapArray && _this.businessNumMapArray.length > 0) {
            for (let item of _this.businessNumMapArray) {
              _this.AMap.remove(item.text)
            }
          }
        },
        // 清除组织
        clearOrganize() {
          if (_this.organizeArray && _this.organizeArray.length > 0) {
            for (let item of _this.organizeArray) {
              if (item.geojson) {
                _this.AMap.remove(item.geojson)
              }
              if (item.text) {
                _this.AMap.remove(item.text)
              }
            }
            _this.organizeArray = []
          }
        },
        clearAll() {
          this.clearOrganize()
          this.clearBusiness()
          this.clearBusinessNum()
          this.clearHighlightBusiness()
          _this.clearUnusualBusiness()
        }
      }
    },
    // 绘制异常商圈
    async drawUnusualBusiness() {
      this.unusualBusinessResult = []
      // console.info('绘制异常商圈', this.unusualBusinessData)
      if (this.unusualBusinessData && this.unusualBusinessData.length > 0) {
        let _this = this
        let resultColor = await MapCtrl.drawColors(_this.AMap, {
          data: _this.unusualBusinessData,
          fillColor: '#9f08f1',
          markCode: 'orgId',
          zIndex: 21,
          fillOpacity: 1,
          callBack(target, info) {
            _this.mapEvents(target, info, 'businessDistrict')
          }
        })
        let result = await MapCtrl.drawBorders(_this.AMap, {
          data: _this.unusualBusinessData,
          markCode: 'orgId',
          strokeColor: '#000',
          zIndex: 20,
          strokeWeight: 0.3,
          callBack(target, info) {
            _this.mapEvents(target, info, 'businessDistrict')
          }
        })
        _this.AMap.setFitView(result.PolygonArr)
        _this.unusualBusinessResult = _this.unusualBusinessResult.concat([...result.borderPolygonArr, ...resultColor.backColorPolygonArr])
      } else {
        this.$message({
          message: '当前暂无异常商圈',
          type: 'warning'
        })
      }
    },
    // 清除 绘制异常商圈
    clearUnusualBusiness() {
      if (this.unusualBusinessResult && this.unusualBusinessResult.length > 0) {
        for (let item of this.unusualBusinessResult) {
          if (item.geojson) {
            this.AMap.remove(item.geojson)
          }
        }
        //  异常商圈 状态回置
        this.$store.commit('businessPreview/SET_ABNORMAL_BUSINESS_STATUS', false)
      }
    },
    // 重置参数
    resetParams() {
      this.chooseMap.clear()
      this.businessList = []
      this.yetChooseBusiness = []
    }
  }
}
</script>

<style scoped lang="less">
.list-wrap {
  margin-bottom: 60px;
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

.list-content {
  padding: 5px 0;
  will-change: height;
  overflow: hidden;

  /deep/ .el-collapse {
    border: none;
    position: relative;
  }

  /deepp/ .el-collapse-item {
    //background-color: #0A2757;
  }

  /deep/ .el-collapse-item__header {
    height: 30px;
    background-color: transparent;
    border: none;
    position: relative;
  }

  /deep/ .el-collapse-item__arrow {
    width: 11px;
    height: 16px;
    position: absolute;
    top: 7px;
    left: 20px;
    color: #fff;
    transform-origin: 20% 40%;

    &:before {
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 7px 0 7px 10px;
      border-color: transparent transparent transparent #fff;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  /deep/ .el-collapse-item__wrap {
    border: none;
  }

  /deep/ .el-collapse-item__content {
    background-color: #081F45;
    color: #8199A4;
    padding-bottom: 0;
  }

  .list-title {
    font-size: 12px;
    font-weight: 600;
    color: #FFFFFF;
    margin-left: 40px;
    position: relative;
  }

  .no-business {
    text-indent: 40px;
  }

  .open-switch {
    position: relative;

    /deep/ .el-switch {
      width: 30px;
      height: 18px;
      position: absolute;
      top: 5px;
      right: 55px;
      z-index: 10;
    }
  }

  .list-item {
    padding-left: 24px;
    line-height: 30px;
    color: rgba(255, 255, 255, 0.7);
    position: relative;

    /deep/ .el-checkbox {
      color: rgba(255, 255, 255, 0.7);
      font-size: 12px;
    }

    /deep/ .el-checkbox__label {
      color: rgba(255, 255, 255, 0.7);
      font-size: 12px;
    }

    .business-level {
      position: absolute;
      top: 0;
      left: 212px;

      .level-color {
        display: inline-block;
        width: 4px;
        height: 16px;
        position: relative;
        top: 2px;
        margin-right: 5px;
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
