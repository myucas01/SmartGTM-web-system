<template>
  <div class="customerbox" id="main_customer">
    <div>
      <el-button
        type="primary"
        size="mini"
        class="startPoint"
        v-if="showstartBut && showBox && VisitPlanData && VisitPlanData.length>0"
        @click="getstartPoint()"
        >设置起始点</el-button
      >
      <el-dialog
        class="dialog-box"
        title="设置起始点"
        :before-close="clearChcekData"
        append-to-body
        :visible.sync="dialogVisible"
        width="30%"
      >
        <p>请选择拜访日</p>
        <el-checkbox-group v-model="checkedservicd">
          <el-checkbox v-for="city in checkOpints" :label="city" :key="city">{{
            getService(city)
          }}</el-checkbox>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="text" @click="clearChcekData()"
            >取 消</el-button
          >
          <el-button size="mini" type="primary" @click="surePoint()"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <span
        class="main_customer_button"
        v-if="Modifyposit"
        :style="{ top: end_top_val, left: end_left_val, position: 'fixed' }"
      >
        <span class="text_sure" @click="getDiaLog()">确认位置</span>
        <span @click="goBack()">取消</span>
      </span>
      <div class="main_customer" v-show="showBox">
        <span @click="handlerClick">
          <svg-icon
            icon-class="icon_close_planinfor"
            class-name="closeicon"
          ></svg-icon>
        </span>
        <span class="top_title">客户详情</span>
        <div>
          <span
            class="tab_customer"
            v-for="(item, index) in tabData"
            :key="index"
            :class="{ active: activeindex == index }"
            @click="getTablist(index)"
            >{{ item }}</span
          >
          <span :class="customercontent">
            <InforMation
              v-if="activeindex == 0 && InforMationData"
              :InforMationData="InforMationData"
              :programId="programId"
              ref="information"
              @getModifyposit="getModifyposit"
              :getPosition="getPosition"
              :ServiceButton="ServiceButton"
              :edit="edit"
              :storeAdjChild="storeAdjChild"
              :handlerClick="handlerClick"
            ></InforMation>
            <VisitPlan
              v-if="activeindex == 1 && VisitPlanData"
              :handlerClick="handlerClick"
              :VisitPlanData="VisitPlanData"
              :programId="programId"
              :storeData="storeData"
              :getVisitPlan="getVisitPlan"
              :ServiceButton="ServiceButton"
              :edit="edit"
            ></VisitPlan>
            <VisitInfor
              v-else-if="activeindex == 2 && VisitInforData"
              :handlerClick="handlerClick"
              :VisitInforData="VisitInforData"
              :programId="programId"
              :storeData="storeData"
              :getVisitInformation="getVisitInformation"
              :ServiceButton="ServiceButton"
              :edit="edit"
            ></VisitInfor>
          </span>
        </div>
      </div>
      <!--拖拽后的地址信息提示-->
      <!-- <div class="addressTips" v-show="current_address_str">
      {{ current_address_str }}
    </div> -->
    </div>
  </div>
</template>
<script>
import Api from '@api/route/planpreview_api.js'
import InforMation from './inforMation'
import VisitInfor from './visitInfor'
import VisitPlan from './visitPlan'
import { mapGetters } from 'vuex'
import newLocationIcon from '@/assets/img/new_location_icon.png'
import oldLocationIcon from '@/assets/img/old_location_icon.png'
import { AMapUI } from '@/plugins/AMap'
import { eventBus } from '@/util/eventBut.js'
export default {
  name: 'customerDetails',
  props: [
    'closeWinow',
    'showCustomer',
    'programId',
    'storeData',
    'AMap',
    'newAMap',
    'ServiceButton',
    'edit',
    'colseClick',
    'organizationId',
    'storeAdjChild',
    'AllControl'
  ],
  components: {
    InforMation,
    VisitInfor,
    VisitPlan
  },
  data() {
    return {
      tabData: ['基本信息', '拜访计划', '拜访信息'],
      activeindex: 0,
      InforMationData: null,
      VisitInforData: null,
      VisitPlanData: null,
      Modifyposit: false,
      newPosition: [],
      position_picker: null,
      is_show_button: false,
      showstartBut: false,
      getLng: '',
      getLat: '',
      nowstoreId: '',
      areaId: null,
      showBox: null,
      customercontent: 'customercontent',
      end_top_val: '0px',
      end_left_val: '0px',
      dialogVisible: false,
      checkOpints: [],
      checkedservicd: [],
      startPointList: [],
      pointCenter: [],
      originList: new Map(),
      newDrawPoint: []
    }
  },
  computed: {
    ...mapGetters('routerPlanning', ['NowWeek', 'nowPostId'])
  },
  mounted() {
    this.showBox = this.showCustomer
  },
  watch: {
    storeData: {
      deep: true,
      handler: function(newval) {
        if(newval.serviceDayStr) {
          this.checkOpints = newval.serviceDayStr.split(',')
          this.pointCenter = [
            Number(newval.storeLng),
            Number(newval.storeLat)
          ]
        }
        this.nowstoreId = newval.storeId
        this.areaId = newval.areaId
        this.tabData = ['基本信息']
        this.customercontent = 'customercontent'
        if (this.storeData.type === 'Plan') {
          if (
            this.storeData.serviceDay > 0 ||
            this.storeData.serviceDay === '-1'
          ) {
            this.getVisitInformation(newval.storeId, newval.areaId),
              this.getVisitPlan(newval.storeId, newval.areaId)
            this.tabData = ['基本信息', '拜访计划', '拜访信息']
            this.customercontent = 'plancustomer'
          }
        }
        this.getSelectInfo(newval.storeId, newval.areaId)
        this.showBox = this.showCustomer
      }
    }
  },
  methods: {
    // ******获取客户详情
    async getSelectInfo(id, areaId) {
      this.activeindex = 0
      Api.get_select_info({
        storeId: id,
        precinctNo: areaId,
        isLoading: false
      })
        .then(async res => {
          if (res.code === '200') {
            let allData = await res.data
            const {
              storeName,
              storeAddress,
              tel,
              tagsList,
              storeCode,
              agencyName
            } = allData
            this.InforMationData = {
              areaId: this.storeData.areaId,
              serviceDay: this.storeData.serviceDay,
              storeName,
              storeAddress,
              tel: tel || '暂无',
              tagsList: tagsList,
              visitWeek:
                tagsList && tagsList.length > 0
                  ? tagsList[0].visitWeek || '暂无'
                  : '暂无',
              visitRate:
                tagsList && tagsList.length > 0
                  ? tagsList[0].visitRate || '暂无'
                  : '暂无',
              shopTime:
                tagsList && tagsList.length > 0
                  ? tagsList[0].shopTime || '暂无'
                  : '暂无',
              configBigName:
                tagsList && tagsList.length > 0
                  ? tagsList[0].configBigName || '暂无'
                  : '暂无',
              configSmallName:
                tagsList && tagsList.length > 0
                  ? tagsList[0].configSmallName || '暂无'
                  : '暂无',
              storeTypeName:
                tagsList && tagsList.length > 0
                  ? tagsList[0].storeTypeName || '暂无'
                  : '暂无',
              storeCode: storeCode || '暂无',
              agencyName: agencyName || '暂无',
              storeId: id
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // ******获取拜访信息
    async getVisitInformation(id, areaId) {
      Api.get_visit_information({
        whatWeek: this.NowWeek,
        precinctNo: areaId,
        isLoading: false,
        storeId: id
      })
        .then(async res => {
          if (res.code === '200') {
            this.VisitInforData = (await res.data)
              ? res.data
              : {
                  empName: '',
                  precinctName: '',
                  precinctNo: '',
                  salesName: '',
                  shopTime: '',
                  visitRate: '',
                  weekDay: ''
                }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // ******获取拜访计划
    async getVisitPlan(id, areaId) {
      Api.get_visit_plan({
        precinctNo: areaId,
        storeId: id,
        isLoading: false
      })
        .then(async res => {
          if (res.code === '200') {
            this.VisitPlanData = await res.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    //调用验证码弹框
    getDiaLog() {
      // this.$refs.information.CodeInfor()
      this.$refs.information.getPosition()
    },
    //判断设置周几
    getService(value) {
      switch (value) {
        case '1':
          return '周一'
        case '2':
          return '周二'
        case '3':
          return '周三'
        case '4':
          return '周四'
        case '5':
          return '周五'
        case '6':
          return '周六'
        case '7':
          return '周日'
        default:
          ''
      }
    },
    // 传入修改地址
    getPosition() {
      let _this = this
      Api.get_update_location({
        storeId: this.nowstoreId,
        gdLat: this.getLat,
        gdLng: this.getLng,
        prePlanNo: this.programId,
        orgId: this.organizationId
      })
        .then(res => {
          if (res.code === '200') {
            _this.$message({ message: res.data, type: 'success' })
            _this.goBack()
            setTimeout(() => {
              _this.getSelectInfo(this.nowstoreId, this.areaId)
              eventBus.$emit('handle-node-click', this.areaId)
              _this.handlerClick()
              _this.$store.commit(
                'routerPlanning/SET_UPDATE_NO_PLAN_STORE',
                new Date().getTime()
              )
            }, 0)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getModifyposit(value) {
      // 正在移动位置就取消移动
      if (this.Modifyposit === true) {
        return
      }
      this.Modifyposit = value
      this.newPosition = [
        Number(this.storeData.storeLng),
        Number(this.storeData.storeLat)
      ]
      // 如果已经存在拖拽对象则移除
      if (this.position_picker) {
        this.position_picker.stop()
        this.position_picker = ''
      }
      // 移除蓝色小旗子
      if (this.marker_settled_obj) {
        this.map_obj.remove(this.marker_settled_obj)
        this.marker_settled_obj = ''
      }
      // 隐藏 '修改位置' 按钮
      this.is_show_edit_button = false
      // 步骤1：初始化Picker对象,实例化一个固定蓝色小旗子，不可拖拽 this.marker_lnglat 为当下店铺的经纬度对象
      AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
        this.marker_settled_obj = new this.newAMap.Marker({
          position: this.newPosition,
          offset: new this.newAMap.Pixel(11, 5),
          anchor: 'bottom-center',
          icon: new this.newAMap.Icon({
            size: new this.newAMap.Size(39, 40), // 图标尺寸
            image: oldLocationIcon, // Icon的图像
            imageSize: new this.newAMap.Size(39, 40) // 根据所设置的大小拉伸或压缩图片
          }),
          zIndex: 4
        })
        // 将蓝色小旗子绘制在地图上
        this.marker_settled_obj.setMap(this.AMap)

        // 步骤2：初始化一个红色小旗子拖拽对象
        this.position_picker = new PositionPicker({
          mode: 'dragMarker',
          map: this.AMap,
          iconStyle: {
            url: newLocationIcon,
            size: [39, 40],
            ancher: [9, 35]
          }
        })

        // 初始化起始拖拽位置
        this.position_picker.start(this.newPosition)
        // 拖拽完毕后回调
        this.position_picker.on('success', positionResult => {
          // console.log('---拖拽成功---', positionResult)
          this.finishedEdit(positionResult, true)
        })
        // 失败后回调
        this.position_picker.on('fail', function(positionResult) {
          console.log('---拖拽失败---', positionResult)
        })
      })
    },
    /**
     * @description 取消修改的位置
     */
    goBack() {
      // 删除红色小旗子(官网方法)
      if (this.position_picker) {
        this.position_picker.stop()
      }
      this.position_picker = ''
      // 移除蓝色小旗子
      if (this.marker_settled_obj) {
        this.AMap.remove(this.marker_settled_obj)
      }
      this.marker_settled_obj = ''
      // 隐藏确认按钮组
      this.Modifyposit = false
      // 清空地址字符串
      // this.current_address_str = ''
      // 因为需求调整，一下功能暂时不做
      // 回到蓝色小旗子位置
      // this.position_picker.start(this.marker_lnglat)
    },
    // 拖拽成功后调用
    finishedEdit(position_obj, is_show_button) {
      this.end_position_lnglat = position_obj.position
      this.getLng = JSON.stringify(this.end_position_lnglat.getLng())
      this.getLat = this.end_position_lnglat.getLat(
        this.end_position_lnglat.getLng()
      )
      let end_position_pixel = this.AMap.lngLatToContainer(
        this.end_position_lnglat
      )
      this.end_left_val = end_position_pixel.getX() - 60 + 'px'
      this.end_top_val = end_position_pixel.getY() + 55 + 'px'
      this.Modifyposit = is_show_button
      // 定位中心点
      this.AMap.setCenter(this.marker_lnglat)
      this.onMapmove()
      // 显示最近道路
      // this.current_address_str = position_obj.address
    },
    /**
     * @description 监听地图移动，因为拖拽后的按钮是独立于地图的，所以需要动态计算位置
     */
    onMapmove() {
      // 监听地图移动事件
      this.AMap.on('mapmove', () => {
        if (this.position_picker) {
          // 确认按钮位置
          let marker_pixel = this.AMap.lngLatToContainer(
            this.end_position_lnglat
          )
          this.end_left_val = marker_pixel.getX() - 70 + 'px'
          this.end_top_val = marker_pixel.getY() + 55 + 'px'
        }
      })
      // 监听地图容器变化
      this.AMap.on('resize', () => {
        if (this.position_picker) {
          // 确认按钮位置
          let marker_pixel = this.AMap.lngLatToContainer(
            this.end_position_lnglat
          )
          this.end_left_val = marker_pixel.getX() - 70 + 'px'
          this.end_top_val = marker_pixel.getY() + 55 + 'px'
        }
      })
    },
    getTablist(value) {
      this.activeindex = value
      if (value != 0) {
        this.goBack()
      }
    },
    handlerClick() {
      this.showBox = false
      this.closeWinow()
      this.colseClick()
    },
    //起始点按钮显隐
    showPointButton(value){
      this.showstartBut = value
    },
    // 设置起始点
    getstartPoint() {
      // 如果只有一个选项，就选中
      if(this.checkOpints.length<2) {
        this.checkedservicd = this.checkOpints
      }
      this.dialogVisible = true
      this.newDrawPoint.forEach(item=>{
        if(JSON.stringify(item.center)==JSON.stringify(this.pointCenter)){
          this.checkedservicd = item.days
        }
      })
    },
    surePoint() {
      //确认之后，调用接口
      if (this.checkedservicd.length < 1) {
        this.$message({
          message: '请选择需要设置起始点的路线',
          type: 'warning'
        })
        return
      }
      //同时把新的起始点存到到起始点集合中
      let routerAllData = this.$parent.$refs.LeftControl.$refs.Business.routerAllData
      let routerIds = new Map()
      this.checkedservicd.forEach(item => {
      //获取不同路线的routeId
        if(routerAllData) {
          routerAllData.forEach(routeritem=> {
            routeritem.areaRouteDetail.forEach(newitem=>{
              routerIds.set(newitem.serviceDay+','+newitem.areaId,newitem.routeId)
            })
          })
        }
        let routeId = routerIds.get(item+','+this.areaId)
        this.originList.set(item, {center:this.pointCenter,id:routeId})
      })
      //再添加新的标识
      this.drawNewPoint()
      this.dialogVisible = false
      this.checkedservicd = []
    },
    //绘制起始点集合
    drawNewPoint() {
      // 移除原有的起始点对象
      this.newDrawPoint.length > 0 &&
        this.newDrawPoint.forEach(item => {
          this.AMap.remove(item.obj)
        })
      this.newDrawPoint = []
      // new新增的起始点对象
      let newData = []
      for (let item of this.originList) {
        newData.push({ key: JSON.stringify(item[1].center), value: item[0] })
      }
      let sureData = new Map()
      newData.forEach(item => {
        sureData.set(item.key, [])
      })
      newData.forEach(item => {
        const data = sureData.get(item.key)
        if (data) {
          data.push(item.value)
        }
      })
      if (sureData.size > 0) {
        for (let item of sureData) {
          let newDemo = []
          item[1].length > 0 &&
          item[1].forEach(newitem => {
              let newColor
              switch (newitem) {
                case '1':
                  newColor = '#C50404'
                  break
                case '2':
                  newColor = '#4132CB'
                  break
                case '3':
                  newColor = '#4C8C06'
                  break
                case '4':
                  newColor = '#4A90E2'
                  break
                case '5':
                  newColor = '#007D86'
                  break
                case '6':
                  newColor = '#83562E'
                  break
                case '7':
                  newColor = '#D0A052'
                  break
                default:
                  break
              }
              newDemo.push(
                `<span style="min-width: 20px; width: 20px; height: 20px; line-height: 20px; color: #fff; display: block; background-color: ` +
                  newColor + `;` + `text-align:center; border-radius: 10px;"'>起</span>`
              )
            })
            const demobox =
        '<span style="border-radius:3px; padding: 0 3px; display: flex; align-items: center; justify-content: center; min-width: 10px; height: 27px; background: #FFFFFF; box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.04), 0px 2px 4px 0px rgba(0, 0, 0, 0.12); border: 1px solid #D3DCE6;"><span style="position:relative; display: flex; justify-content: space-around; align-items: center;">' +
              newDemo.join('') +
              '<span style=" width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 6px solid white; z-index: 10; position: absolute; top: 23px; "></span></span></span>'
          let nameAddObj = new this.newAMap.Marker({
            anchor: 'center',
            position: JSON.parse(item[0]),
            draggable: false,
            cursor: 'pointer',
            angle: 0,
            zIndex: 900,
            content: demobox,
            offset: new this.newAMap.Pixel(0, -28)
          })
          this.newDrawPoint.push({center:JSON.parse(item[0]),obj:nameAddObj,days:item[1]})
        }
      }
      // 添加新的起始点
      this.newDrawPoint.length > 0 &&
        this.newDrawPoint.forEach(item => {
          this.AMap.add(item.obj)
        })
    },
    getPointList() {
      let dataList = []
      this.originList.forEach(item => {
        dataList.push({
          gdLat: JSON.stringify(item.center[1]),
          gdLng: JSON.stringify(item.center[0]),
          routeNo: item.id
        })
      })
      if (dataList.length > 0) {
        Api.get_start_point({
          orgId: this.organizationId,
          prePlanNo: this.programId,
          routeNoInfoList: dataList,
          salesTypeCode: this.nowPostId
        })
          .then(res => {
            if (res.code == 200) {
              eventBus.$emit('closeAllDot')
              eventBus.$emit('getRoutePosition')
              this.$message({
                message: res.data,
                type: 'success'
              })
              this.dialogVisible = false
              this.originList = new Map()
            }
            if(res.code === '504') {
              // 线路已被其他账号生成 需重新更新
              location. reload()
            }
          })
          .catch(err => {
            console.log(err)
          })
          this.clearPoint()
          this.handlerClick()
      }
    },
    // 清空选项
    clearChcekData() {
      this.dialogVisible = false
      this.checkedservicd = []
    },
    // 清空绘制的起点
    clearPoint() {
      // 移除原有的起始点对象
      this.newDrawPoint.length > 0 &&
        this.newDrawPoint.forEach(item => {
          this.AMap.remove(item.obj)
        })
      this.newDrawPoint = []
      this.originList = new Map()
    }
  }
}
</script>
<style lang="scss" scoped>
.customerbox {
  position: relative;
  height: 120px;
}
.main_customer_button {
  height: 30px;
  min-width: 110px;
  line-height: 30px;
  text-align: center;
  background-color: #ffffff;
  height: auto !important;
  width: auto !important;
  color: #102f63;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  z-index: 10;
  border-radius: 4px;
  display: flex;
  .text_sure {
    width: 80px;
    color: #930cea;
    text-align: center;
  }
  span {
    text-align: center;
    cursor: pointer;
  }
}
.startPoint {
  position: absolute;
  top: -35px;
}
.main_customer {
  min-height: 120px;
  min-width: 305px;
  background-color: #102f63;
  height: auto !important;
  width: auto !important;
  color: #ffffff;
  border-radius: 4px;
  &::before {
    width: 0;
    height: 0;
    border: 10px solid;
    border-color: transparent #102f63 transparent transparent;
    content: '';
    position: absolute;
    left: -20px;
    top: 80px;
  }
  .closeicon {
    position: absolute;
    z-index: 2;
    right: 10px;
    top: 5px;
    cursor: pointer;
    height: 13px;
    width: 13px;
    padding: 7px;
  }
  .addressTips {
    position: absolute;
    z-index: 1;
    line-height: 20px;
    right: 10px;
    bottom: 10px;
    background-color: #133773;
    padding: 2px 4px;
    box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.5);
    border-radius: 4px;
  }
  .top_title {
    height: 35px;
    line-height: 35px;
    background-color: #0a2757;
    color: #ffffff;
    text-indent: 10px;
    display: block;
    font-size: 14px;
    border-radius: 4px 4px 0 0;
  }
  .tab_customer {
    height: 23px;
    line-height: 23px;
    font-size: 13px;
    width: 73px;
    text-align: center;
    display: inline-block;
    background-color: #102f63;
    cursor: pointer;
  }
  .active {
    background-color: #133773;
  }
  .customercontent {
    background-color: #133773;
    display: block;
    margin: 0 1px;
    padding-bottom: 10px;
  }
  .plancustomer {
    background-color: #133773;
    display: block;
    margin: 0 1px;
  }
}

.dialog-box {
  border-radius: 15px;
  ::v-deep {
    .el-dialog__header {
      padding: 0;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      height: 40px;
      line-height: 40px;
      position: relative;
      background-color: #071f48;
      .el-dialog__title {
        font-size: 18px !important;
        margin-left: 16px;
        font-size: 14px;
        color: #fff;
      }
      .el-dialog__headerbtn {
        top: 2px;
      }
    }
    .el-dialog__body {
      padding: 0px 16px;
      font-size: 13px;
      font-weight: 600;
      color: #ffffff;
      background-color: #0a2757;
      height: 106px;
      .el-checkbox {
        color: #ced3dd;
      }
      p {
        color: #ced3dd;
        padding: 20px 0 12px 0;
      }
    }
    .el-dialog__footer {
      height: 50px;
      padding: 0 10px 0 0;
      background-color: #0a2757;
      .el-button {
        width: 60px;
        height: 32px;
        border-radius: 4px;
        border: none;
        padding: 0;
        margin-top: 7px;
        color: #ffffff;
      }
      .orange {
        width: 80px;
        height: 32px;
        background: #ff9900;
        border-radius: 4px;
      }
      .route-btn {
        width: 119px;
      }
    }
  }
  .svg-icons {
    position: absolute;
    top: 12px;
    left: 18px;
  }
}
</style>
