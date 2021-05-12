<template>
  <!-- 业务图层 -->
  <div class="content">
    <div v-if="dialogVisible">
    <VueDragResize
      :w="1"
      :h="1"
      :x="340"
      :y="42"
      :resizing="resize"
      :dragging="resize"
      :isResizable="false"
    >
      <div class="draggeBox" v-if="dialogVisible">
        <span class="topbox">
          <p class="topcircle">{{nowrepeatPoints.length}}</p>
          <p>重合点位</p>
          <span @click="handleClose">
            <svg-icon
              icon-class="icon_close_planinfor"
              class-name="closeicon"
            ></svg-icon>
          </span>
        </span>
        <span class="bottombox">
        <p class="draagetitle">有以下{{nowrepeatPoints.length}}个重合点位，点击可查看详情</p>
        <span :class="newindexPoint==indexPoint?activeshow:''"  v-for="(item,indexPoint) in nowrepeatPoints" :key="indexPoint">
          <el-tooltip class="item" effect="dark" :content="enterDay" placement="top-start">
          <p :style="getnewPoint(item,indexPoint)" @click="clickNewPoint(item,indexPoint)" @mouseenter="EnterNewPoint(item,indexPoint)">
            <b :class="item.rate ==='3'&& pointVal ==1 ?'fanglineStyle':'lineStyle'">{{(item.serviceDay==='-1' && pointVal!==2)?'-':''}}</b>
            <b class="textStyle">{{((item.routeGeom  || item.routLineGeom) && pointVal ==1)?item.storeSort:''}}</b>
          </p>
          </el-tooltip>
        </span>
        </span>
      </div>
    </VueDragResize>
    </div>
    <el-tree
      v-if="!modelProps && !sowAdd"
      :data="treeData"
      :props="defaultProps"
      node-key="id"
      accordion
      :default-expanded-keys="keyArr"
      @node-click="handleNodeClick"
      @node-expand="handleExpand"
      @node-collapse="handlecollapse"
      :expand-on-click-node="false"
      empty-text="暂无数据"
    >
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <div v-if="node.label.showTab == 0" class="button_edit">
          <span
            :class="!areaChange && ' no-click'"
            v-auth="'lineplan:build:mapshow:updatearea'"
            @click="getType(true, 'Area', [node.parent.data])"
            >区域调整</span
          >
          <span
            v-auth="'lineplan:build:mapshow:selectuser'"
            :class="!personChange && ' no-click'"
            @click="getType(true, 'Person', [node.parent.data])"
            >区域关联业代</span
          >
        </div>
        <span
          :class="node.label.showRrightbox != -1 ? 'toptitlebox' : 'textbox'"
        >
          <span
            v-if="
              node.label.showRrightbox == -1 && node.label.showRrightbox != 4
            "
            class="nav_icon"
            :style="getColor(node.label.color, 'border')"
          >
            <p class="nav_icon2" :style="getColor(node.label.color, 'area')"></p>
          </span>
          <el-popover
           :disabled="node.label.areaName?false:true"
            class="newbox"
            popper-class="popverStyle"
            placement="right-end"
            :title="node.label.areaName + (node.label.person ? '（' + node.label.person + '）' : '')"
            trigger="hover"
          >
            <p slot="reference" class="newtitle">
            {{ node.label.name
            }}{{ node.label.person ? '（' + node.label.person + '）' : '' }}
            </p>
          </el-popover>
        </span>
        <span v-if="node.label.showRrightbox == 0 && edit" class="line_no"
          >未生成路线</span
        >
        <span
          v-auth="'lineplan:build:mapshow:createline'"
          v-if="node.label.showRrightbox == 1 && edit"
          @click="!node.label.disable && linButton(node)"
          class="line_button"
          >生成路线</span
        >
        <span v-if="node.label.showRrightbox == 2 && edit" class="line_run"
          >路线生成中…</span
        >
        <span v-if="node.label.showRrightbox == 12 && edit" class="line_run"
          >服务日生成中…</span
        >
        <span v-if="node.label.showRrightbox == 22 && edit" class="line_run"
          >片区还原中…</span
        >
        <div
          class="span-table"
          v-if="
            node.label.showRrightbox == 11 ||
              node.label.showRrightbox == 13 ||
              node.label.showRrightbox == 15 ||
              node.label.showRrightbox == 14 ||
              node.label.showRrightbox == 21 ||
              node.label.showRrightbox == 24 ||
              node.label.showRrightbox == 23 ||
              node.label.showRrightbox == 25
          "
        >
          <span
            class="service-failed"
            v-if="
              node.label.showRrightbox == 11 ||
                node.label.showRrightbox == 13 ||
                node.label.showRrightbox == 15
            "
            >服务日生成失败</span
          >
          <span class="service-success" v-if="node.label.showRrightbox == 14"
            >服务日生成成功</span
          >
          <span
            class="service-failed"
            v-if="
              node.label.showRrightbox == 21 ||
                node.label.showRrightbox == 23 ||
                node.label.showRrightbox == 25
            "
            >片区生成失败</span
          >
          <span class="service-success" v-if="node.label.showRrightbox == 24"
            >片区已生成</span
          >
          <span
            v-auth="'lineplan:build:mapshow:createline'"
            v-if="
              (node.label.showRrightbox == 13 ||
                node.label.showRrightbox == 11 ||
                node.label.showRrightbox == 14 ||
                node.label.showRrightbox == 15 ||
                node.label.showRrightbox == 23 ||
                node.label.showRrightbox == 24 ||
                node.label.showRrightbox == 25 ||
                node.label.showRrightbox == 21) &&
                edit
            "
            @click="!node.label.disable && linButton(node)"
            class="line_button"
            >生成路线</span
          >
        </div>
        <span
          v-if="node.label.showRrightbox == 3 && edit"
          class="line_already"
          >已生成路线</span
        >
        <span
          v-if="node.label.showRrightbox == 4 && edit"
          @click="!node.label.disable && linButton(node)"
          class="line_err"
          >生成失败，请重试</span
        >
        <span
          v-if="node.label.showRrightbox == 5 && edit"
          @click="!node.label.disable && linButton(node)"
          class="line_err"
          >生成错误，请重试</span
        >
        <span v-if="node.label.showRrightbox == -1">
          <el-switch
            v-model="node.label.switchCheck"
            size="min"
            active-color="#930CEA"
            inactive-color="#DCDFE6"
          ></el-switch>
        </span>
        <el-switch
          v-if="
            node.label.areaList &&
              node.label.showRrightbox != -1 &&
              node.level == 1
          "
          @change="areaAllCheck(node.label.allSwitchCheck, node, data)"
          size="min"
          active-color="#930CEA"
          inactive-color="#DCDFE6"
          v-model="node.label.allSwitchCheck"
        ></el-switch>
        <span
        :class="'newButton ' + (!personChange && ' no-click')"
        :disabled='!addNewChange'
          v-if="
            node.label.showTab == 3 &&
              edit && showaddNewArea
          "
           v-auth="'lineplan:buildmapshow:addnewarea'"
          size="mini"
          @click="addNewArea([node.parent.data])"
        >
          增加区域
        </span>
      </div>
    </el-tree>
    <ChangeCompents
      :dataProps="dataProps"
      :typeProps="typeProps"
      :DawerText="DawerText"
      :salesArr="salesArr"
      v-else-if="modelProps && !sowAdd"
      @getType="getType"
      @getMapmessage="getMapmessage"
      @linButton="buildLineCheck"
      @getMapOptions="getMapOptions"
      :programId="programId"
      :orgId="orgId"
      :drawTools="drawTools"
      :AMap="AMap"
      :newAMap="newAMap"
      :jobId="nowPostId"
      :treeData="treeData"
      :getRoutePosition="getRoutePosition"
      :organizationId="organizationId"
      :AllControl="AllControl"
      :ControlFunctionMutex="ControlFunctionMutex"
      :OutLineDataArr="OutLineDataArr"
      :LineDataArr="LineDataArr"
      :CoverDataArr="CoverDataArr"
      :NameDataArr="NameDataArr"
      :dawAreaArr="dawAreaArr"
      :showAreaData="showAreaData"
      :areaChange="areaChange"
      :personChange="personChange"
      :readyHave="readyHave"
      :showaddNewArea = "showaddNewArea"
    ></ChangeCompents>
    <AddNewCompents
      :dataProps="dataProps"
      :DawerText="DawerText"
      :salesArr="salesArr"
      v-if="sowAdd"
      @getType="getType"
      @getMapmessage="getMapmessage"
      @linButton="buildLineCheck"
      @getMapOptions="getMapOptions"
      :programId="programId"
      :orgId="orgId"
      :drawTools="drawTools"
      :AMap="AMap"
      :newAMap="newAMap"
      :jobId="nowPostId"
      :treeData="treeData"
      :getRoutePosition="getRoutePosition"
      :organizationId="organizationId"
      :AllControl="AllControl"
      :ControlFunctionMutex="ControlFunctionMutex"
      :OutLineDataArr="OutLineDataArr"
      :LineDataArr="LineDataArr"
      :CoverDataArr="CoverDataArr"
      :NameDataArr="NameDataArr"
      :dawAreaArr="dawAreaArr"
      :showAreaData="showAreaData"
      :areaChange="areaChange"
      :personChange="personChange"
    ></AddNewCompents>
    <el-dialog
      class="dialog-box"
      title="重要提示"
      append-to-body
      :visible.sync="routeDialogVisible"
      width="390px"
    >
      <svg-icon icon-class="icon_warningsmall" class="svg-icons"></svg-icon>
      <div class="dialog-content">
        有{{
          noPlanServiceDayStoreNum
        }}个点位未规划的服务日,为规划的服务日将不参与建线，是否生成服务日？
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="route-btn" @click="linButton"
          >不规划, 生成路线</el-button
        >
        <el-button type="primary" @click="createServiceDay" class="orange"
          >生成服务日</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { Authorities } from '@/util/authority.js'
import ChangeCompents from './ChangeCompents' // 调整模板
import AddNewCompents from './addNewCompents' // 调整模板
import getMapData from '@/util/PreviewProgram/getMapData'
import Api from '@api/route/planpreview_api.js'
import zonApi from '@api/route/zoning_api.js'
import { mapGetters } from 'vuex'
import { eventBus } from '@/util/eventBut.js'
import aphaimg from '@assets/img/aphata.png'
import checkboximg from '@assets/img/checked@2x.png'
import VueDragResize from 'vue-drag-resize' //缩放、拖拽
export default {
  name: 'BusinessLayer',
  components: {
    ChangeCompents,
    AddNewCompents,
    VueDragResize
  },
  props: [
    'DawerText',
    'programId',
    'orgId',
    'areaId',
    'saleId',
    'drawTools',
    'edit',
    'planDataNo',
    'AMap',
    'newAMap',
    'jobId',
    'isPlan',
    'AllControl',
    'ControlFunctionMutex',
    'ViewpointDetails',
    'VisitDetial',
    'drawBorders',
    'dawAreaArr',
    'LineDataArr',
    'CoverDataArr',
    'NameDataArr',
    'OutLineDataArr',
    'PathDataArr',
    'Refreshoverview'
  ],
  data() {
    return {
      // 业务图层tree组件树形结构数据
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      nowPostId: null,
      modelProps: false,
      dataProps: [],
      typeProps: 'Area',
      lineOver: false,
      keyArr: null,
      salesArr: [],
      weekDay: [],
      allOpenweekDay: [],
      testData: [],
      newallData: [],
      customeArrData: [],
      treeData: [], // 业代图层业代架构列表
      routeDialogVisible: false,
      temporaryStorageNode: '', // 暂存 建线 node
      noPlanServiceDayStoreNum: '',
      existingIds: '',
      wholeDay: new Map(),
      changeConstruc: new Map(), // 业代结构
      dealerLineData: new Map(), // 特约批边框
      dealerCoverData: new Map(), // 特约批填充色
      massBox: new Map(), //区域点位
      repeaTBox: new Map(), //重叠点位集合
      scaleBox: new Map(), //客户规模点位
      serviceBox: new Map(), //服务日点位
      Addserviceday: new Map(),
      getNowRouter: true,
      addIds: [],
      deleteIds: [],
      newshowIds: [],
      DotData: null,
      loading: null,
      sowAdd: false,
      routerAllData: null,
      areaChange: true, //是否禁用区域调整
      personChange: true, //是否禁用区域关联业代
      addNewChange: true, //是否禁用添加区域
      dialogVisible: false,
      nowrepeatPoints: [],
      newindexPoint: null,
      activeshow:'commnactive', //选中样式
      vw: 0,
      vh: 0,
      top: 0,
      left: 0,
      enterpoint: false,
      showOnpoint: null,
      enterDay: null,
      noClickId: null, //当前选中的重叠点id
      SetnewPoint:[],
      showaddNewArea:true,
      readyHave: new Map(), // 已勾选业代
      bridgeBox: new Map(), // 存储无服务日的‘-’
      coincidenceFlag: 'n', // 是否显示重合点//默认‘n’不显示
    }
  },
  mounted() {
    eventBus.$on('handle-node-click', Ids => {
      this.Refreshoverview()
      this.UpdateSingleData(Ids)
    })
    eventBus.$on('getRoutePosition', () => {
      this.getRoutePosition('外部调整')
    })
    eventBus.$on('closeAllDot', () => {
      this.closeAllDot()
    })
    this.getRoutePosition()
    this.getSelectSales()
    this.$store.commit('routerPlanning/SET_VIEW_MAP_SALES_TYPE_MAP', new Map())
    // 增加区域权限控制
    this.showaddNewArea = Authorities('lineplan:buildmapshow:addnewarea')
  },
  destroyed() {
    eventBus.$off('handle-node-click')
    eventBus.$off('getRoutePosition')
    eventBus.$off('closeAllDot')
  },
  computed: {
    ...mapGetters(
      'routerPlanning',
      [
        'pointVal',
        'jobLayer',
        'routeVisit',
        'routeStyle',
        'showIds',
        'NowWeek',
        'mapViewId',
        'viewMapSalesTypeMap'
      ],
      'map',
      ['organizationName']
    ),
    ...mapGetters('map', ['organizationId']),
    ...mapGetters('common', ['currentMessage'])
  },
  watch: {
    // 图例 点位 变更
    pointVal(newval) {
      this.Judgerefresh(newval)
    },
    // // 图例 岗位 变更
    jobLayer: {
      deep: true,
      handler: function(newval, oldval) {
        let newItem = []
        newval.forEach(item => {
          if (!oldval.includes(item)) {
            newItem.push(item)
          }
        })
        oldval.forEach(item => {
          if (!newval.includes(item)) {
            newItem.push(item)
          }
        })
        // 判断是否选中已计划
        if (newItem.toString() === '已计划' && !newval.includes('已计划')) {
          this.closeAllDot()
        }
        if (newItem.toString() === '已计划' && newval.includes('已计划')) {
          this.closeAllDot()
          this.getAllRoutes(this.showIds)
        }
        // 判断是否选中未计划
        if (newItem.toString() === '未计划') {
          this.$store.commit(
            'routerPlanning/SET_UPDATE_NO_PLAN_STORE',
            new Date().getTime()
          )
        }
        // 判断是否选中区域
        if (newItem.toString() === '区域') {
          this.showAreaData()
        }
        // 判断是否包含特约批
        if (newItem.toString() === '特约批' && newval.includes('特约批')) {
          this.getAllAgency()
        }
        // 判断是否包含销商分布
        if (newItem.toString() === '特约批' && !newval.includes('特约批')) {
          setTimeout(() => {
            this.AMap.clearMap()
            setTimeout(() => {
              this.showAreaData()
              this.Judgerefresh(this.pointVal)
              if (newval.includes('未计划')) {
                this.$store.commit(
                  'routerPlanning/SET_UPDATE_NO_PLAN_STORE',
                  new Date().getTime()
                )
              }
            }, 0)
          }, 1000)
        }
      }
    },
    // 重合点
    coincidenceFlag() {
      if(this.jobLayer.includes('已计划')){
        this.closeAllDot()
        this.getAllRoutes(this.showIds)
      }
    },
    // 路线拜访日
    routeVisit: {
      deep: true,
      handler: function(newval) {
        this.Judgerefresh(newval)
      }
    },
    // 路线样式变更
    routeStyle(newval) {
      this.Judgerefresh(newval)
    },
    // 消息 监听
    currentMessage() {
      if (this.currentMessage) {
        let currentMessage = JSON.parse(this.currentMessage)
        // 建线 消息
        if (currentMessage.bussinessCode === '103') {
          if (
            currentMessage.areaLineMsg &&
            this.treeData &&
            currentMessage.areaLineMsg.prePlanNo === this.$route.query.planId
          ) {
            for (let item of this.treeData) {
              if (item.label.id === currentMessage.areaLineMsg.salesTypeCode) {
                if (currentMessage.status === 200) {
                  item.label.showRrightbox = '3'
                  setTimeout(()=>{
                    this.closeAllDot()
                    this.getRoutePosition('建线成功')
                  },1500)
                } else {
                  item.label.showRrightbox = '4'
                }
              }
            }
          }
        }
        // 服务日
        if (currentMessage.bussinessCode === '104') {
          if (
            currentMessage.areaLineMsg &&
            this.treeData &&
            currentMessage.areaLineMsg.prePlanNo === this.$route.query.planId
          ) {
            for (let item of this.treeData) {
              if (item.label.id === currentMessage.areaLineMsg.salesTypeCode) {
                if (currentMessage.sendBySelf) {
                  item.label.showRrightbox = '12'
                } else {
                  if (currentMessage.status === 200) {
                    item.label.showRrightbox = '14'
                    setTimeout(()=>{
                      this.closeAllDot()
                      this.getRoutePosition('生成服务日成功')
                    },1500)
                    // 刷新数据总览
                    this.Refreshoverview()
                    this.UpdateSingleData()
                  } else {
                    item.label.showRrightbox = '13'
                  }
                }
              }
            }
          }
        }
        // 还原片区
        if (currentMessage.bussinessCode === '109') {
          if (
            currentMessage.areaLineMsg &&
            this.treeData &&
            currentMessage.areaLineMsg.prePlanNo === this.$route.query.planId
          ) {
            for (let item of this.treeData) {
              if (item.label.id === currentMessage.areaLineMsg.salesTypeCode) {
                if (currentMessage.sendBySelf) {
                  item.label.showRrightbox = '22'
                } else {
                  if (currentMessage.status === 200) {
                    item.label.showRrightbox = '24'
                    setTimeout(()=>{
                      this.closeAllDot()
                      this.getRoutePosition('建线成功')
                    },1500)
                  } else {
                    item.label.showRrightbox = '23'
                  }
                }
              }
            }
          }
        }
      }
    },
    // 第几周变化更新数据
    NowWeek(newval) {
      this.refreshData(newval)
    },
    nowPostId(newval) {
      this.AMap.clearMap()
      setTimeout(()=>{
        if (newval.length>0 && this.jobLayer.includes('未计划')) {
          this.$store.commit(
            'routerPlanning/SET_UPDATE_NO_PLAN_STORE',
            new Date().getTime()
          )
        }
        if(newval.length>0 && this.jobLayer.includes('特约批')){
            this.getAllAgency()
        }
        this.refreshData(newval)
      },0)
    },
    // 变更当前显示点位和区域id
    showIds(newval) {
      this.Judgerefresh(newval)
      setTimeout(() => {
        this.showAreaData()
      }, 0)
      this.addIds = []
      this.deleteIds = []
      newval.forEach(item => {
        if (!this.newshowIds.includes(item)) {
          this.addIds.push(item)
        }
      })
      this.newshowIds.forEach(item => {
        if (!newval.includes(item)) {
          this.deleteIds.push(item)
        }
      })
      this.newshowIds = newval.toString().split(',')
    },
    // 监听业代是否已被选择
    treeData: {
      deep: true,
      handler: function(newval) {
        let newArr = new Map()
        // 过滤所有选中的业代
        newval.forEach(newitem=>{
          newitem.children.forEach(item=>{
            if(item.label.person){
              let newData = this.salesArr.filter(newitem=>newitem.label===item.label.person)
              if(newData.length>0){
                newArr.set(item.label.areaId, {salesNo:newData[0].value,havaIcon:item.label.jobName+'-'+item.label.name})
              } else {
                newArr.set(item.label.areaId, {salesNo:item.label.person,havaIcon:item.label.jobName+'-'+item.label.name})
              }
            }
          })
        })
        this.readyHave = newArr
      }
    }
  },
  methods: {
    // 刷新当前数据
    refreshData() {
      this.closeDotArr()
      setTimeout(() => {
        this.showDotArr()
      }, 0)
    },
    // 刷新当前数据
    UpdateSingleData(Ids) {
      this.showSingleDot(Ids)
    },
    // 点位刷新
    Judgerefresh(){
      let noShowDataid = []
      this.showIds.forEach(item=>{
        if(this.pointVal===0 && !this.massBox.has(item)){
            noShowDataid.push(item)
        } else if(this.pointVal===1 && !this.scaleBox.has(item)){
            noShowDataid.push(item)
        } else if(this.pointVal===2 && !this.serviceBox.has(item)){
            noShowDataid.push(item)
        }
      })
      if(noShowDataid.length>0 && this.jobLayer.includes('已计划')){
        this.closeAllDot()
        this.getAllRoutes(this.showIds)
      } else {
        this.AlldataResh(this.pointVal)
      }
    },
    // 刷新拖住位置
    resize(newRect) {
      this.vw = newRect.width
      this.vh = newRect.height
      this.top = newRect.top
      this.left = newRect.left
    },
    async getRoutePosition(seetType) {
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // ******调用接口返回业代结构
      await Api.get_route_position({
        programId: this.programId,
        isPlan: this.isPlan,
        isOpen: true,
        isLoading: false
      })
        .then(async res => {
          if (res.code === '200') {
            let treeData = []
            let saleTypeMap = new Map()
            const allData = await res.data
            if (allData && allData.length > 0) {
              if (!this.nowPostId) {
                this.nowPostId = allData[0].jobId
                this.$store.commit(
                  'routerPlanning/SET_NOWPOSTID',
                  allData[0].jobId
                )
              }
              allData.forEach((item, index) => {
                const {
                  jobId,
                  jobName,
                  routeStatus,
                  areaList,
                  planDataNo
                } = item
                let childrenlist
                if (areaList && areaList.length > 0) {
                  childrenlist = [
                    {
                      label: {
                        showTab: 0 // 是否显示区域调整
                      }
                    }
                  ]
                  areaList.forEach(areaitem => {
                    const {
                      jobId,
                      jobName,
                      routeStatus,
                      saleId,
                      areaId,
                      areaName,
                      saleName,
                      areaGeom,
                      areaColor,
                      lng,
                      lat
                    } = areaitem
                    let newName = ''
                    if(areaName) {
                      if(areaName.length>5) {
                        newName = areaName.slice(0,2) + areaName.substring(areaName.length-4,areaName.length)
                      } else {
                        newName = areaName
                      }
                    }
                    const newareaitem = {
                      label: {
                        areaList: areaList,
                        name: newName, // 区域名称
                        areaName,
                        showRrightbox: -1,
                        switchCheck: true, //开关值
                        id: areaId,
                        color: areaColor,
                        selectvalue: this.NowWeek,
                        person: saleName, // 业代名称
                        jobId,
                        jobName,
                        routeStatus,
                        saleId,
                        areaId,
                        lng,
                        lat
                      }
                    }
                    childrenlist.push(newareaitem)
                    this.changeConstruc.set(areaId, {
                      areaId,
                      areaName,
                      name: newName, // 区域名称
                      areaColor,
                      lng,
                      lat,
                      areaGeom,
                      routeStatus,
                      saleName
                    })
                  })
                }
                if(routeStatus!=='1' && routeStatus!=='2' && this.showaddNewArea) {
                  childrenlist.push({
                    label: {
                      showTab: 3, // 是否显示增加区域
                      disabled: true
                    }
                  })
                }
                const newitem = {
                  id: index,
                  label: {
                    areaList: areaList,
                    name: jobName,
                    //0:未生成,1:生成按钮,2:生成中…,3:已生成,4:生成失败,5:生成错误,-1:switch开关
                    showRrightbox: this.getStatus(routeStatus),
                    allSwitchCheck: true,
                    id: jobId,
                    planDataNo,
                    disable: false
                  },
                  children: childrenlist
                }
                treeData.push(newitem)
                saleTypeMap.set(jobId, {
                  id: jobId,
                  name: jobName,
                  createServiceDayStatus: false,
                  noDaySize: 0,
                  routeStatus: routeStatus
                })
              })
            }
            this.$store.commit(
              'routerPlanning/SET_VIEW_MAP_SALES_TYPE_MAP',
              saleTypeMap
            )
            this.$store.commit(
              'routerPlanning/SET_SALE_TYPE_KEY',
              new Date().getTime()
            )

            this.treeData = treeData
            setTimeout(() => {
              this.init(seetType)
            }, 0)
          } else {
            this.loading && this.loading.close()
          }
        })
        .catch(err => {
          this.loading && this.loading.close()
          console.log(err)
        })
    },
    //定义路线状态
    getStatus(value) {
      switch (value) {
        case '0':
          return 0
        case '1':
          return 2
        case '2':
          return 3
        case '3':
          return 4
        case '4':
          return 5
        case '11':
          return 11 // 重新计算服务日- 失败
        case '12':
          return 12 // 重新计算服务日- 生成中
        case '13':
          return 13 // 重新计算服务日 - 生成失败
        case '14':
          return 14 // 重新计算服务日 - 生成成功
        case '15':
          return 15 //  重新计算服务日 - 生成异常
        case '22':
          return 22 // 重新计算片区- 生成中
        case '23':
          return 23 // 重新计算片区- 生成失败
        case '24':
          return 24 // 重新计算片区- 成功
        case '25':
          return 25 // 重新计算片区- 异常
        case '21':
          return 21 // 重新计算片区- 计算失败
      }
    },
    // ******查询业代列表
    getSelectSales() {
      Api.get_select_sales({
        orgId: this.orgId,
        prePlanNo: this.programId,
        isLoading: false
      })
        .then(res => {
          if (res.data.length > 0) {
            res.data.forEach(item => {
              const newitem = {
                value: item.empNo,
                label: item.empName
              }
              this.salesArr.push(newitem)
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取区域图标颜色
    getColor(value, type) {
      let obj
      if (type === 'border') {
        obj = {
          border: '1px solid' + value
        }
      } else if (type === 'area') {
        obj = {
          'background-color': value,
          opacity: '0.1'
        }
      }
      return obj
    },
    // 绘制所有地图数据
    drawMpaData(type) {
      if (type !=='外部调整') {
        if (this.LineDataArr.size > 0) {
          this.LineDataArr.forEach(item=>{
            item[0] && this.AMap.remove(item[0].geojson)
          })
        }
        if (this.OutLineDataArr.size > 0) {
          this.OutLineDataArr.forEach(item => {
            item && this.AMap.remove(item.newvalue[0].geojson)
            item && this.AMap.remove(item.value[0].geojson)
          })
        }
        if (this.CoverDataArr.size > 0) {
          this.CoverDataArr.forEach(item=>{
            item[0] && this.AMap.remove(item[0].geojson)
          })
        }
        if (this.NameDataArr.size > 0) {
          this.NameDataArr.forEach(item=>{
            item[0] && item[0].text && this.AMap.remove(item[0].text)
          })
        }
        if (this.showIds.length > 0) {
          this.showIds.forEach(itemId => {
            const newData = this.changeConstruc.get(itemId)
            if (newData) {
              const {
                areaId,
                // areaName,
                name,
                areaColor,
                lng,
                lat,
                areaGeom,
                saleName
              } = newData
              const data = [
                {
                  borderWidth: '1',
                  fillColorOpacity: '1',
                  gdBoundarJson: areaGeom,
                  gdLat: lat,
                  gdLng: lng,
                  iconType: '1',
                  id: areaId,
                  name: name,
                  zIndex: '10',
                  type: 'region'
                }
              ]
              const newName = name + (saleName ? '(' + saleName + ')' : '')
              let listdata = getMapData({
                data,
                type: ['LineData', 'CoverData', 'NameData', 'OutLineData'],
                style: { color: areaColor },
                detail: { id: areaId, name: newName, zIndex: '10' }
              })
              const {
                newLineData,
                newCoverData,
                newNameData,
                newOutLineData
              } = listdata
              // 绘制边界线
              this.$emit('getMapOptions', newLineData[0], newLineData[1])
              // 绘制覆盖层
              this.$emit('getMapOptions', newCoverData[0], newCoverData[1])
              // 绘制区域边框名称
              this.$emit('getMapOptions', newOutLineData[0], newOutLineData[1])
              // 绘制区域名称
              this.$emit('getMapOptions', newNameData[0], newNameData[1])
            }
          })
        }
      }
      setTimeout(()=>{
        if (type !=='全选') {
          this.UpdateSingleData()
        }
        this.loading && this.loading.close()
      },500)
    },
    init(seetType) {
      // 初始化
      if (this.treeData.length > 0) {
        // *****除未生成路线和生成路线按钮状态外
        // 其他node节点不显示区域调整和区域关联业代按钮
        this.treeData.forEach((item, index) => {
          const { showRrightbox } = item.label
          if (item.label.areaList) {
            if (this.nowPostId && this.nowPostId === item.label.id) {
              switch (showRrightbox) {
                case 0:
                  item.label.showRrightbox = 1
                  break;
                case 2:
                  this.$store.dispatch('routerPlanning/setChangelineButton', false)
                  this.$store.dispatch('routerPlanning/setServiceButton', true)
                  break;
                case 3:
                  this.$store.dispatch('routerPlanning/setChangelineButton', true)
                  this.$store.dispatch('routerPlanning/setServiceButton', true)
                  break;
                default:
                  break;
              }
            }
            if (seetType) {
              // 重新绘制边界或点位
              this.getPostIdvalue(this.nowPostId,seetType)
            } else
            if (index == 0 && !seetType) {
              this.getPostIdvalue(item.label.id)
              switch (showRrightbox) {
                case 0:
                  item.label.showRrightbox = 1
                  break;
                case 2:
                  // 路线生成后不可调整服务日
                  this.$store.dispatch('routerPlanning/setChangelineButton', false)
                  this.$store.dispatch('routerPlanning/setServiceButton', true)
                  break;
                case 3:
                  this.$store.dispatch('routerPlanning/setChangelineButton', true)
                  this.$store.dispatch('routerPlanning/setServiceButton', true)
                  break;
                default:
                  this.$store.dispatch('routerPlanning/setServiceButton', false)
                  break;
              }
              this.nowPostId = item.label.id
              this.$store.dispatch(
                'routerPlanning/setnowPostId',
                this.nowPostId
              )
              this.checkStore(item.label.id)
            }
            if (
              (item.label.showRrightbox != 0 &&
                item.label.showRrightbox != 1 &&
                item.label.showRrightbox != 13 &&
                item.label.showRrightbox != 11 &&
                item.label.showRrightbox != 14 &&
                item.label.showRrightbox != 23 &&
                item.label.showRrightbox != 24 &&
                item.label.showRrightbox != 25 &&
                item.label.showRrightbox != 21) ||
              !this.edit //不可编辑
              || (!Authorities('lineplan:build:mapshow:updatearea') && !Authorities('lineplan:build:mapshow:selectuser')) // 没有权限
            ) {
              item.children && item.children.splice(0, 1)
            }
          }
        })
      }
      // 刷新数据总览
      this.Refreshoverview()
      this.addStyelBox()
    },
    // 改变路线状态
    handleNodeClick(data) {
      const {
        label: { showRrightbox, id, switchCheck }
      } = data
      if (showRrightbox == 1) {
        // 点击生成路线
        return
      } else if (showRrightbox == 2 || showRrightbox == 3) {
        // 路线生成中，已生成路线
        return
      } else if (showRrightbox == -1) {
        if (switchCheck) {
          const newData = this.showIds
          newData.push(id)
          this.$store.dispatch('routerPlanning/setShowIds', newData)
        } else {
          const newData = []
          this.showIds.forEach(item => {
            if (item !== id) {
              newData.push(item)
            }
          })
          this.$store.dispatch('routerPlanning/setShowIds', newData)
          this.$store.commit('routerPlanning/SET_POINT_CLEAR_NEEDDATA', {
            id: id
          })
        }
      }
    },
    // 外部刷新点位
    showSingleDot(Ids) {
      let newIds
      if(Ids==='调整点位所属区域') {
        let newData = []
        this.treeData.forEach((item) => {
          if (item.label.id === this.nowPostId) {
            item.children.forEach(newitem => {
              const newid = newitem.label.areaId
              if (newid) {
                newData.push(newid)
              }
            })
          }
        })
        newIds = newData
      } else {
        newIds = Ids ? Ids : this.showIds
      }
      this.closeAllDot()
      if (this.jobLayer.includes('已计划')) {
        //隐藏原有点位
        let newDataArr = []
        this.nowrepeatPoints.forEach(item=>{
          newDataArr.push(item.areaId)
        })
        if (newIds) {
          if(this.coincidenceFlag==='y' && newDataArr.filter(newitem=>newitem === newIds).length>0){
            this.getAllRoutes(newDataArr)
          } else {
            this.getAllRoutes(newIds)
          }
        }
      }
      setTimeout(()=>{
        this.showAreaData()
      },1000)
    },
    // 打开开关渲染
    showDotArr() {
      if (this.showIds.length > 0) {
        this.showAreaData()
        if (this.jobLayer.includes('已计划')) {
          //隐藏原有点位
          this.closeAllDot()
          this.getAllRoutes(this.showIds)
        }
      }
    },
    // 关闭开关渲染
    closeDotArr() {
      this.PathDataArr.forEach(item => {
        if (item) {
          item.forEach(newitem => {
            this.AMap.remove(newitem.geojson)
          })
        }
      })
      if (this.deleteIds.length > 0) {
        this.deleteIds.forEach(itemids => {
          if (this.massBox.size > 0) {
            let data = this.massBox.get(itemids)
            data && data.hide()
            data = null
          }
          if (this.repeaTBox.size > 0) {
            let data = this.repeaTBox.get(itemids)
            if (data) {
              data.forEach(item => {
                this.AMap.remove(item)
              })
            }
            data = null
          }
          if (this.scaleBox.size > 0) {
            let data = this.scaleBox.get(itemids)
            data && data.textArr.forEach(item=>{
              this.AMap.remove(item)
            })
            data = null
          }
          if (this.serviceBox.size > 0) {
            let data = this.serviceBox.get(itemids)
            data && data.hide()
            data = null
          }
          if (this.LineDataArr.size > 0) {
            let data = this.LineDataArr.get(itemids)
            if (data) {
              data[0] && data[0].geojson && this.AMap.remove(data[0].geojson)
            }
            data = null
          }
          if (this.CoverDataArr.size > 0) {
            let data = this.CoverDataArr.get(itemids)
            if (data) {
              data[0] && data[0].geojson && this.AMap.remove(data[0].geojson)
            }
            data = null
          }
          if (this.NameDataArr.size > 0) {
            let data = this.NameDataArr.get(itemids)
            if (data) {
              data[0] && data[0].text && this.AMap.remove(data[0].text)
            }
            data = null
          }
        })
      }
    },
    // 关闭开关渲染
    closeAllDot() {
      //隐藏原有点位
      this.massBox.forEach(item => {
        item && item.hide()
      })
      this.repeaTBox.forEach(item => {
        item.length>0&&item.forEach(newitem=>{
          this.AMap.remove(newitem)
        })
      })
      this.scaleBox.forEach(item => {
        item && item.textArr.forEach(item=>{
          this.AMap.remove(item)
        })
      })
      this.serviceBox.forEach(item => {
        item && item.hide()
      })
      if(this.bridgeBox.size>0) {
        for (let item of this.bridgeBox) {
          item[1] && this.AMap.remove(item[1])
        }
      }
      this.PathDataArr.forEach(item => {
        if (item) {
          item.forEach(newitem => {
            this.AMap.remove(newitem.geojson)
          })
        }
      })
    },
    // 显示当前所有区域
    showAreaData() {
      if (this.LineDataArr.size > 0) {
        this.LineDataArr.forEach(item=>{
          item[0]  && item[0].geojson  && this.AMap.remove(item[0].geojson)
        })
      }
      if (this.OutLineDataArr.size > 0) {
        this.OutLineDataArr.forEach(item => {
          item && this.AMap.remove(item.newvalue[0].geojson)
          item && this.AMap.remove(item.value[0].geojson)
        })
      }
      if (this.CoverDataArr.size > 0) {
        this.CoverDataArr.forEach(item=>{
          item[0]  &&  item[0].geojson  && this.AMap.remove(item[0].geojson)
        })
      }
      if (this.NameDataArr.size > 0) {
        this.NameDataArr.forEach(item=>{
          item[0] && item[0].text && this.AMap.remove(item[0].text)
        })
      }
      if (this.showIds.length > 0) {
        for (let itemid of this.showIds) {
          if (itemid) {
            const areavalue = this.jobLayer.includes('区域')
            if (this.LineDataArr.size > 0) {
              const data = this.LineDataArr.get(itemid)
              if (data && data[0] && areavalue) {
                data[0].geojson && this.AMap.add(data[0].geojson)
              } else if (data && data[0] && !areavalue) {
                data[0].geojson && this.AMap.remove(data[0].geojson)
              }
            }
            if (this.CoverDataArr.size > 0) {
              const data = this.CoverDataArr.get(itemid)
              if (data && data[0] && areavalue) {
                data[0].geojson && this.AMap.add(data[0].geojson)
              } else if (data && data[0] && !areavalue) {
                data[0].geojson && this.AMap.remove(data[0].geojson)
              }
            }
            if (this.NameDataArr.size > 0) {
              const data = this.NameDataArr.get(itemid)
              if (data && data[0]) {
                data[0].text && this.AMap.add(data[0].text)
              } else if (data && data[0] && !areavalue) {
                data[0].text && this.AMap.remove(data[0].text)
              }
            }
          }
        }
      }
      if (this.LineDataArr.size > 0) {
        const data = this.LineDataArr.get(this.organizationId)
        if (data && data[0]) {
          data[0].geojson && this.AMap.add(data[0].geojson)
        }
      }
    },
    // 所有点位切换
    AlldataResh(val) {
      //隐藏原有点位
      this.closeAllDot()
      //渲染新点位
      if (this.showIds.length > 0 && this.jobLayer.includes('已计划')) {
        this.PathDataArr.clear()
        this.getLinedata(this.DotData)
        this.closeAllDot()
        this.showIds.forEach(newitem => {
          if (this.PathDataArr.size > 0) {
            const data = this.PathDataArr.get(newitem)
            if (data) {
              data.forEach((item,index) => {
                const routeVisit = this.getrouteVisitdata()
                if(routeVisit.includes(index.toString())) {
                   item.geojson && this.AMap.add(item.geojson)
                }
              })
            }
          }
          if (this.repeaTBox.size > 0) {
            const data = this.repeaTBox.get(newitem)
            if (data && data.length>0) {
              data.forEach(item => {
                const routeVisit = this.getrouteVisitdata()
                const tag1 = routeVisit.includes(item.w.extData.serviceDay)
                const tag2 = item.w.extData.repeatPointList.filter(item=>routeVisit.includes(item.serviceDay))
                const tag3 = item.w.extData.repeatPointList.filter(item=>item.serviceDay==='-1')
                if(tag1 && tag2.length>0 || tag3){
                  this.AMap.add(item)
                }
              })
            }
          }
          if (val == 0) {
            for (let item of this.massBox) {
              if (item[0] == newitem) {
                item[1] && item[1].setMap(this.AMap)
                item[1] && item[1].show()
              }
              if (this.routeVisit.length < 1) {
                item[1] && item[1].setData(
                  item[1].getData().filter(item => item.serviceDay === '-1')
                )
              }
            }
          }
          if (val == 1) {
            for (let item of this.scaleBox) {
              if (item[0] == newitem) {
                item[1] && item[1].textArr.forEach(item=>{
                  this.AMap.add(item)
                })
              }
            }
          }
          if (val == 2) {
            for (let item of this.serviceBox) {
              if (item[0] == newitem) {
                item[1] && item[1].setMap(this.AMap)
                item[1] && item[1].show()
              }
              if (this.routeVisit.length < 1) {
                item[1] && item[1].setData(
                  item[1].getData().filter(item => item.serviceDay === '-1')
                )
              }
            }
          }
          if(this.bridgeBox.size>0 && this.pointVal !==2 ) {
            for (let item of this.bridgeBox) {
              if (item[0].includes(newitem)) {
                item[1] && this.AMap.add(item[1])
              }
            }
          }
        })
      }
      setTimeout(()=>{
        this.loading && this.loading.close()
      },500)
    },
    async buildLineCheck(node) {
      if (!this.AllControl.get('LineButton')) {
        return
      }
      if (node) {
        if (node.data) {
          this.temporaryStorageNode = node.data
        }
        if (!(await this.checkStore(node.data.label.id))) {
          this.routeDialogVisible = true
        } else {
          this.linButton()
        }
      }
    },
    // 显示生成路线按钮
    linButton(node) {
      this.temporaryStorageNode = node.data
      this.temporaryStorageNode.label.disable = true
      this.routeDialogVisible = false
      // ******调用生成路线接口
      zonApi
        .buildingLine({
          org_id: this.orgId ? this.orgId : '',
          pre_plan_no: this.programId ? this.programId : '',
          sales_type_code: this.temporaryStorageNode.label.id
            ? this.temporaryStorageNode.label.id
            : ''
        })
        .then(res => {
          if (res.code === '200') {
            this.$message({ message: res.data, type: 'success' })
            this.$store.dispatch('routerPlanning/setChangelineButton', false)
            this.getRoutePosition('生成成功')
          } else if (res.code === '404') {
            this.temporaryStorageNode.label.disable = false
            this.temporaryStorageNode.label.showRrightbox = 4
            this.closeDotArr()
            this.getRoutePosition('生成失败')
          }
          if(res.code === '504') {
            // 线路已被其他账号生成 需重新更新
            location. reload()
          }
        })
        .catch(err => {
          console.log(err)
          setTimeout(() => {
            this.temporaryStorageNode.label.disable = false
            this.temporaryStorageNode.label.showRrightbox = 4
          }, 0)
        })
    },
    areaAllCheck(status, data, node) {
      if (this.nowPostId == node.label.id) {
        let newData = []
        if (status) {
          node.label.areaList.forEach(item => {
            newData.push(item.planDataNo)
          })
          this.$store.dispatch('routerPlanning/setShowIds', newData)
          this.getPostIdvalue(node.label.id,'全选')
        } else {
          this.getPostIdvalue('','全选')
          this.$store.dispatch('routerPlanning/setShowIds', newData)
        }
        data.childNodes.forEach(item => {
          if (status != item.data.label.switchCheck) {
            item.data.label.switchCheck = !item.data.label.switchCheck
          }
        })
      }
    },
    // 展开tree当前项
    handleExpand(data, Node) {
      this.handleClose()
      if (!this.AllControl.get('shrinkMeau')) {
        this.$message({
          message: '操作未完成，切换业代无效哦~',
          type: 'warning'
        })
        return
      }
      this.$store.commit(
          'routerPlanning/SET_SALE_TYPE_KEY',
          new Date().getTime()
      )
      this.nowPostId = data.label.id
      this.$store.dispatch('routerPlanning/setnowPostId', data.label.id)
      this.getPostIdvalue(data.label.id)
      // 展开新项，清空之前展开项
      this.treeData.forEach(item => {
        item.label.allSwitchCheck = true
        if (
          item.id !== data.id &&
          (item.label.showRrightbox == 0 || item.label.showRrightbox == 1)
        ) {
          item.label.showRrightbox = 0
        }
      })
      const {
        label: { showRrightbox }
      } = data
      if (
        showRrightbox == 0 &&
        (Node.label.showRrightbox == 0 || Node.label.showRrightbox == 1)
      ) {
        // 显示生成路线
        Node.label.showRrightbox = 1
      }
      if (showRrightbox == 3) {
        // 路线生成后不可调整服务日
        this.$store.dispatch('routerPlanning/setChangelineButton', true)
        this.$store.dispatch('routerPlanning/setServiceButton', true)
      }else if(showRrightbox == 2){
        this.$store.dispatch('routerPlanning/setChangelineButton', false)
        this.$store.dispatch('routerPlanning/setServiceButton', true)
      }else {
        this.$store.dispatch('routerPlanning/setServiceButton', false)
      }
    },

    // 收起tree当前项
    handlecollapse(data, Node) {
      this.handleClose()
      if (!this.AllControl.get('shrinkMeau')) {
        this.$message({
          message: '操作未完成，切换业代无效哦~',
          type: 'warning'
        })
        return
      }
      this.nowPostId = []
      // 清除当前展开项的id
      this.$store.dispatch('routerPlanning/setnowPostId', [])
      this.$store.dispatch('routerPlanning/setShowIds', [])
      const {
        label: { showRrightbox }
      } = data
      if (
        showRrightbox == 1 &&
        (Node.label.showRrightbox == 0 || Node.label.showRrightbox == 1)
      ) {
        // 显示生成路线
        Node.label.showRrightbox = 0
      }
      this.$store.dispatch('routerPlanning/setServiceButton', false)
      // 隐藏所有地图展示项
    },

    // 绘制地图数据
    getMapmessage(label, value) {
      if (label === 'dawArea') {
        this.$emit('getMapOptions', value, 'dawArea')
        return
      } else if (label === 'UndawArea') {
        this.$emit('getMapOptions', {}, 'UndawArea')
        return
      }
    },

    // ******调用接口获取路线和门店数据
    async getAllRoutes(itemidArr) {
      if (itemidArr.length > 0) {
        if (!this.getNowRouter) {
          return
        }
        this.loading && this.loading.close()
        this.getNowRouter = false
        let params
        let idArr = itemidArr.toString()
        params = {
          areaId: idArr,
          visitWeek: this.NowWeek,
          orgId: this.orgId,
          isLoading: true,
          coincidenceFlag: this.coincidenceFlag
        }
        Api.get_all_routes(params)
          .then(res => {
            if(res.code === '200') {
              let routerAllData = res.data
              this.routerAllData = routerAllData
              setTimeout(()=>{
                this.getNowRouter = true
              },1000)
              // 重新调用关闭重合点弹框
              if(this.noClickId) {
                this.dialogVisible = false
              }
              if (routerAllData && routerAllData.length > 0) {
                this.loading = this.$loading({
                  lock: true,
                  text: 'Loading',
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
                })
                routerAllData.forEach(item => {
                  const { areaId, areaRouteDetail } = item
                  this.wholeDay.set(areaId,areaRouteDetail)
                  this.$store.commit('routerPlanning/SET_POINT_NEEDDATA', {
                    id: areaId,
                    value: areaRouteDetail
                  })
                })
                this.DotData = routerAllData
                this.PathDataArr.clear()
              } else {
                this.DotData = []
                this.$message({
                  message: res.extData
                })
              }
              setTimeout(()=>{
                this.AlldataResh(this.pointVal)
              },1000)
              switch(this.pointVal){
                case 0:
                  idArr.split(',').forEach(item=>{
                      const newData = this.DotData.filter(newitem=>newitem.areaId==item)
                      if(newData.length<1){
                        this.massBox.set(item,null)
                      }
                  })
                break;
                case 1:
                  idArr.split(',').forEach(item=>{
                      const newData = this.DotData.filter(newitem=>newitem.areaId==item)
                      if(newData.length<1){
                        this.scaleBox.set(item,null)
                      }
                  })
                break;
                case 2:
                  idArr.split(',').forEach(item=>{
                      const newData = this.DotData.filter(newitem=>newitem.areaId==item)
                      if(newData.length<1){
                        this.serviceBox.set(item,null)
                      }
                  })
                break;
              }
            }
          })
          .catch(err => {
            this.getNowRouter = true
            console.log(err)
          })
      }
    },

    // 处理与图例拜访日联动的路线数据
    getLinedata(data) {
      const routeVisit = this.getrouteVisitdata()
      for(let item of this.wholeDay) {
        const newdata = item[1].filter(item=>routeVisit.includes(item.serviceDay) || item.serviceDay==='-1')
        this.$store.commit('routerPlanning/SET_POINT_NEEDDATA', {
          id: item[0],
          value: newdata
        })
      }
      if (data && data.length > 0) {
        data.forEach(item => {
          const { areaId, areaRouteDetail } = item
          let weeLine = [],
            weekDay = []
          routeVisit.forEach(item => {
            const newData = areaRouteDetail.filter(
              Detail => Detail.serviceDay === item
            )
            if (newData.length > 0) {
              const {
                routeGeom,
                routLineGeom,
                serviceDay,
                routeId,
                storeList
              } = newData[0]
              //  routLineGeom 路线Geom(直线)   routeGeom 曲线
              if (routLineGeom || routeGeom) {
                this.$store.dispatch('routerPlanning/setShowRoute', true)
                weeLine.push({
                  serviceDay: serviceDay,
                  borderWidth: '1',
                  name: name,
                  type: 'region',
                  routeId: routeId,
                  gdBoundarJson:
                    this.routeStyle === '直线' ? routLineGeom : routeGeom
                })
              }
              let newstoreList = storeList.filter(
                item =>
                  item.areaId &&
                  item.storeLat &&
                  item.storeLng &&
                  item.rate &&
                  item.serviceDay &&
                  item.serviceDayStr &&
                  item.storeScaleId &&
                  item.areaColor &&
                  item.storeCode
              )
              if (newstoreList.length > 0) {
                weekDay.push(newstoreList)
              }
              setTimeout(() => {
                const nodata = storeList.filter(
                  item => !item.storeLat || !item.storeLng || !item.areaColor
                )
                if (nodata.length > 0) {
                  console.log('有空值点位', nodata[0])
                }
              }, 0)
            }
          })
          if (weeLine.length > 0) {
            const newdata = getMapData({
              data: weeLine,
              type: ['PathData'],
              detail: { id: areaId, name: 'pathdata' }
            })
            const { newPathData } = newdata
            // 绘制路线信息
            this.$emit('getMapOptions', newPathData[0], newPathData[1])
          }
          const noService = areaRouteDetail.filter(
            Detail => Detail.serviceDay === '-1'
          )
          if (noService.length > 0) {
            const { storeList } = noService[0]
            let noSerList = storeList.filter(item => item.serviceDay)
            if (noSerList.length > 0) {
              weekDay.push(noSerList)
            }
          }
          this.weekDay = weekDay
          this.getWeekDay(this.pointVal, areaId)
        })
      }
    },

    // 获取当前需要展示的拜访日数据
    getrouteVisitdata() {
      let newVisit = []
      this.routeVisit.forEach(item => {
        switch (item) {
          case '周一':
            newVisit.push('1')
            break
          case '周二':
            newVisit.push('2')
            break
          case '周三':
            newVisit.push('3')
            break
          case '周四':
            newVisit.push('4')
            break
          case '周五':
            newVisit.push('5')
            break
          case '周六':
            newVisit.push('6')
            break
          case '周日':
            newVisit.push('7')
            break
        }
      })
      const resArr = newVisit.sort()
      return resArr
    },

    // 监听图例数据
    getWeekDay(value, id) {
      if(this.bridgeBox.size>0 && this.pointVal !==2 ) {
      // 删除当前更新区域无服务日显示'-'
        for (let item of this.bridgeBox) {
          if (item[0].includes(id)) {
            this.bridgeBox.delete(item[0])
          }
        }
      }
      // pointVal 图例点位 // jobLayer 岗位图层 // routeVisit 路线拜访日 // routeStyle) 路线样式
      let newData = []
      if (this.weekDay.length > 0) {
        newData = this.weekDay.reduce((prev, cur) => {
          const moreArr = [].concat(cur).some(Array.isArray) //判断cur是不是一个数组
          return prev.concat(moreArr ? cur.flatten() : cur)
        })
      }
      let newColorList
      let Dotstyle = []
      this.Addserviceday.set(id, newData)
      if(this.coincidenceFlag==='y'){
        this.activeshow = ''
      }
      if(newData.length>0){
        let repeaTdata = []
        newData.forEach(item=>{
          //添加无服务日店的‘-’
          if(item.serviceDay=='-1' && this.pointVal!==2 && !item.repeatPointList){
            var linetext = new this.newAMap.Text({
                text: '-',
                anchor:'center', // 设置文本标记锚点
                draggable:false,
                zIndex: 10000,
                style:{
                    'background-color': 'transparent',
                    'line-height': '12px',
                    'text-align': 'center',
                    'font-size': '22px',
                    'color': '#ffffff',
                    'margin':'0',
                    'border':'none'
                },
                angle:0,
                position: [Number(item.storeLng), Number(item.storeLat)],
                offset: new this.newAMap.Pixel(0,0),
                extData: item
            });
            this.bridgeBox.set(id+','+item.storeId,linetext)
            this.VisitDetial(linetext)
          }
          if(item.repeatPointList){
            // 绘制重合点角标
            var repeaTtext = new this.newAMap.Text({
                text: item.repeatPointList.length,
                anchor:'center', // 设置文本标记锚点
                draggable:false,
                zIndex: 100,
                angle:0,
                style:{
                    'background-color': 'transparent',
                    'width': '23px',
                    'height': '23px',
                    'line-height': '18px',
                    'text-align': 'center',
                    'font-size': '6px',
                    'color': '#FFFFFF',
                    'margin':'0',
                    'padding':'0',
                    'border': 'none',
                    'background-image': `url(` +require('@assets/img/repeatPoint.png') +`)`,
                    'background-position': 'center',
                    'background-size': '100%'
                },
                position: [Number(item.storeLng), Number(item.storeLat)],
                offset: new this.newAMap.Pixel(12,-12),
                topWhenClick: true,
                extData: item
            });
            repeaTdata.push(repeaTtext)
            this.repeatPoints(repeaTtext,item)
            this.SetnewPoint.push(item)
          }
        })
        this.repeaTBox.set(id, repeaTdata)
      }
      switch (Number(value)) {
        case 0:
          {
            // 绘制区域归属
            newColorList = [
              '#FF0126',
              '#0AAD5C',
              '#5FACFC',
              '#B56B04',
              '#A134E9',
              '#4F658A',
              '#B1B105',
              '#FF00ED',
              '#646464',
              '#CA1976',
              '#0A7300',
              '#2458E0',
              '#703E5A',
              '#775F29',
              '#FF9E50',
              '#EC5E46',
              '#A33613',
              '#5F04C1',
              '#DECF11',
              '#8C57A2'
            ]
            newColorList.forEach(item => {
              Dotstyle.push({
                url: require('@assets/img/regionalIdentity/' +
                  item +
                  '_circle.png'),
                anchor: new this.newAMap.Pixel(9, 9),
                size: new this.newAMap.Size(18, 18)
              })
            })
            let mass = null
            if (newData.length > 0) {
              newData.forEach(item => {
                item.lnglat = [Number(item.storeLng), Number(item.storeLat)]
                item.name = item.storeName
                item.style = newColorList.indexOf(item.areaColor)
              })
              mass = new this.newAMap.MassMarks(newData, {
                opacity: 1,
                zIndex: 111,
                style: Dotstyle,
                alwaysRender: false
              })
            }
            this.massBox.set(id, mass)
            this.VisitDetial(mass, 'dot')
          }
          break
        case 1:
          {
            // 绘制客户规模
            let textArr = []
            if (newData.length > 0) {
              newData.forEach(item => {
                  let imgtext = (item.routeGeom  || item.routLineGeom) ? item.storeSort : ' '
                  let imgclor
                  switch (item.configBigName) {
                    case 'A':
                      imgclor = '#FD522E'
                      break
                    case 'B':
                      imgclor = '#FCBE0D'
                      break
                    case '其他':
                      imgclor = '#13B42F'
                      break
                    default:
                      imgclor = '#999999'
                      break
                  }
                  let imgshape, widthvalue, heightvalue, linevalue
                  switch (item.rate) {
                    case '1':
                      imgshape = '_circle'
                      widthvalue = '18px'
                      heightvalue = '18px'
                      linevalue = '18px'
                      break
                    case '2':
                      imgshape = '_fang'
                      widthvalue = '16px'
                      heightvalue = '16px'
                      linevalue = '16px'
                      break
                    case '3':
                      imgshape = '_sanjiao'
                      widthvalue = '24px'
                      heightvalue = '24px'
                      linevalue = '33px'
                      break
                  }
                  // 创建纯文本标记
                  var text = new this.newAMap.Text({
                      text: imgtext,
                      anchor:'center', // 设置文本标记锚点
                      draggable:false,
                      zIndex: '50',
                      angle:0,
                      style:{
                          'background-color': 'transparent',
                          'background-image': `url(` + require( '@assets/img/customerSize/'+ imgclor + imgshape + '.png')+`)`,
                          'background-size': '100% 100%',
                          'width': widthvalue,
                          'height': heightvalue,
                          'line-height': linevalue,
                          'border':'none',
                          'text-align': 'center',
                          'font-size': '8px',
                          'color': '#FFFFFF',
                          'margin':'0',
                          'padding':'0',
                          'border-radius': '0',
                          'box-sizing': 'border-box'
                      },
                      position: [Number(item.storeLng), Number(item.storeLat)],
                      offset: new this.newAMap.Pixel(0,0),
                      topWhenClick: false,
                      extData: item
                  });
                  this.VisitDetial(text, 'client')
                  textArr.push(text)
              })
            }
            this.scaleBox.set(id, {textArr})
          }
          break
        case 2:
          {
            // 绘制服务日点位信息
            newColorList = [
              '#C50404',
              '#2716C4',
              '#4C8C06',
              '#4A90E2',
              '#007D86',
              '#83562E',
              '#D0A052'
            ]
            newColorList.forEach(item => {
              Dotstyle.push({
                url: require('@assets/img/serviceday/' + item + '_circle.png'),
                anchor: new this.newAMap.Pixel(9, 9),
                size: new this.newAMap.Size(18, 18)
              })
              Dotstyle.push({
                url: require('@assets/img/serviceday/' + item + '_fang.png'),
                anchor: new this.newAMap.Pixel(9, 9),
                size: new this.newAMap.Size(18, 18)
              })
              Dotstyle.push({
                url: require('@assets/img/serviceday/' + item + '_sanjiao.png'),
                anchor: new this.newAMap.Pixel(14, 13),
                size: new this.newAMap.Size(28, 26)
              })
            })
            Dotstyle.push({
              url: require('@assets/img/serviceday/#666666_weiguihua.png'),
              anchor: new this.newAMap.Pixel(9, 9),
              size: new this.newAMap.Size(18, 18)
            })
            let mass = null
            if (newData.length > 0) {
              newData.forEach((item) => {
                let imgNum
                switch (item.serviceDay) {
                  case '1':
                    imgNum = 0 + Number(item.rate) - 1
                    break
                  case '2':
                    imgNum = 3 + Number(item.rate) - 1
                    break
                  case '3':
                    imgNum = 6 + Number(item.rate) - 1
                    break
                  case '4':
                    imgNum = 9 + Number(item.rate) - 1
                    break
                  case '5':
                    imgNum = 12 + Number(item.rate) - 1
                    break
                  case '6':
                    imgNum = 15 + Number(item.rate) - 1
                    break
                  case '7':
                    imgNum = 18 + Number(item.rate) - 1
                    break
                  case '-1':
                    imgNum = 21
                    break
                }
                item.lnglat = [Number(item.storeLng), Number(item.storeLat)]
                item.name = item.storeName
                item.style = imgNum
              })
              mass = new this.newAMap.MassMarks(newData, {
                opacity: 1,
                zIndex: 111,
                style: Dotstyle,
                alwaysRender: false
              })
            }
            this.serviceBox.set(id, mass)
            this.VisitDetial(mass, 'service', this.Addserviceday)
          }
          break
        default:
          break
      }
      newData = null
    },
    //弹出重复点位的框
    repeatPoints(item,data){
      const {
        repeatPointList,
        storeCode,
        storeLat,
        storeLng,
        rate
      } = data
      if (this.noClickId == storeCode && item) {
        this.dialogVisible = true
        repeatPointList.forEach(item=>{
          item.oldstoreLat = storeLat
          item.oldstoreLng = storeLng
          item.parentRate = rate
        })
        this.nowrepeatPoints = repeatPointList
        item.setStyle({
          'box-shadow': '-2px -2px 0px rgba(10,39,87,0.6)'
        })
      }
      item && item.on('click', e => {
          if (e) {
            //清除所有点描边
            this.repeaTBox.size>0 && this.repeaTBox.forEach(item=>{
              item && item.forEach(newitem=>{
                  newitem && newitem.setStyle({
                    'box-shadow': 'none'
                  })
              })
            })
            // 关闭门店详情
            this.$parent.$parent.$refs.Customer.handlerClick()
            // 清除点击重复点
            this.newindexPoint = null
            let newextData = e.target.w.extData
            //选中点位描边
            item.setStyle({
              'box-shadow': '-2px -2px 0px rgba(10,39,87,0.6)'
            })
            const {
              storeCode
            } = newextData
            this.noClickId = storeCode
            if (repeatPointList) {
            repeatPointList.forEach(item=>{
              item.oldstoreLat = storeLat
              item.oldstoreLng = storeLng
              item.parentRate = rate
            })
            this.nowrepeatPoints = repeatPointList
            this.dialogVisible = true
            }
          }
      })
    },
    // 获取点位当前样式
    getnewPoint(data){
      let showRrightbox
      if (this.getrouteVisitdata(this.routeVisit).includes(data.serviceDay) || data.serviceDay=='-1') {
        showRrightbox='block'
        data.showvisit = true
      } else {
        showRrightbox='none'
        data.showvisit = false
      }
      switch(this.pointVal){
        case 0:{
          return {
            'height': '13px',
            'width': '13px',
            'border-radius': '13px',
            'line-height': '10px',
            'text-align': 'center',
            'margin': '2px',
            'color': '#ffffff',
            'border':'1px solid #fff',
            'cursor': 'pointer',
            'background-color': data.areaColor,
            'display':showRrightbox,
            'background-repeat': 'no-repeat',
            'position':'relative',
            'font-size': '23px'
          }
        }
        case 1:{
          let imgclor, imgshape, boxsize, fontsize, lineheight,bgsize
          switch (data.configBigName) {
            case 'A':
              imgclor = '#FD522E'
              break
            case 'B':
              imgclor = '#FCBE0D'
              break
            case '其他':
              imgclor = '#13B42F'
              break
            default:
              imgclor = '#999999'
              break
          }
          switch (data.rate) {
            case '1':
              imgshape = '_circle'
              boxsize = '17px'
              fontsize = '12px'
              lineheight='17px'
              bgsize = '100%'
              break
            case '2':
              imgshape = '_fang'
              boxsize = '17px'
              fontsize = '12px'
              lineheight='17px'
              bgsize = '100%'
              break
            case '3':
              imgshape = '_sanjiao'
              boxsize = '23px'
              fontsize = '12px'
              lineheight='30px'
              bgsize = '100% 80%'
              break
          }
          return {
            'height': boxsize,
            'width': boxsize,
            'line-height': lineheight,
            'text-align': 'center',
            'color': '#ffffff',
            'cursor': 'pointer',
            'margin': '1px',
            'background-image': `url(` + require( '@assets/img/customerSize/'+ imgclor + imgshape + '.png')+`)`,
            'background-size': bgsize,
            'background-position': 'center',
            'background-repeat': 'no-repeat',
            'display':showRrightbox,
            'position':'relative',
            'font-size': fontsize
          }
        }
        case 2: {
          let imgservice, servicesize
          let newColorList = [
            '#C50404',
            '#2716C4',
            '#4C8C06',
            '#4A90E2',
            '#007D86',
            '#83562E',
            '#D0A052'
          ]
          if(data.serviceDay=='-1') {
              imgservice = require('@assets/img/serviceday/#666666_weiguihua.png')
              servicesize = '18px'
          } else {
            switch (data.rate) {
              case '1':
                imgservice = require('@assets/img/serviceday/'+ newColorList[Number(data.serviceDay)-1] + '_circle.png')
                servicesize = '17px'
                break
              case '2':
                imgservice = require('@assets/img/serviceday/'+ newColorList[Number(data.serviceDay)-1] + '_fang.png')
                servicesize = '17px'
                break
              case '3':
                imgservice = require('@assets/img/serviceday/'+ newColorList[Number(data.serviceDay)-1] + '_sanjiao.png')
                servicesize = '23px'
                break
            }
          }
          return {
            'height': servicesize,
            'width': servicesize,
            'line-height': servicesize,
            'text-align': 'center',
            'color': '#ffffff',
            'margin': '1px',
            'cursor': 'pointer',
            'background-image': `url(` + imgservice +`)`,
            'background-size': '100%',
            'background-repeat': 'no-repeat',
            'display':showRrightbox,
            'position':'relative'
          }
        }
      }
    },
    // 点击查看重复的点
    clickNewPoint(data,index){
      data.lnglat = [Number(data.oldstoreLng), Number(data.oldstoreLat)]
      this.newindexPoint=index
      if(this.pointVal!==0 && data.serviceDay!=='-1'){
        if(data.rate=='3') {
          this.activeshow = 'sanjiaoshow'
        } else if(data.rate=='2') {
          this.activeshow = 'fangshow'
        } else if(data.rate=='1') {
          this.activeshow = 'commnactive'
        }
      } else {
        this.activeshow = 'commnactive'
      }
      this.VisitDetial(data,'重叠的点',this.Addserviceday)
    },
    EnterNewPoint(data,index){
      this.showOnpoint = index
      let endArr = []
      if(data.serviceDayStr) {
      let newArr = data.serviceDayStr.split(',')
        newArr.length>0 && newArr.forEach((item,index)=>{
          switch (item) {
            case '1':
              endArr[index]='周一'
              break;
            case '2':
              endArr[index]='周二'
              break;
            case '3':
              endArr[index]='周三'
              break;
            case '4':
              endArr[index]='周四'
              break;
            case '5':
              endArr[index]='周五'
              break;
            case '6':
              endArr[index]='周六'
              break;
            case '7':
              endArr[index]='周日'
              break;
          }
        })
      } else {
        endArr = ['暂无']
      }
      this.enterDay = endArr.join(',')
    },
    handleClose() {
      this.dialogVisible = false
      this.newindexPoint = null
      //清除所有点描边
      this.repeaTBox.size>0 && this.repeaTBox.forEach(item=>{
        item && item.forEach(newitem=>{
            newitem && newitem.setStyle({
              'box-shadow': 'none'
            })
        })
      })
    },
    // 获取当前打开的id
    getPostIdvalue(value,type) {
      let newData = []
      this.treeData.forEach((item, index) => {
        if (item.label.id === value) {
          item.children.forEach(newitem => {
            newitem.label.switchCheck = true
            const newid = newitem.label.areaId
            if (newid) {
              newData.push(newid)
            }
          })
          this.keyArr = [index]
        }
      })
      this.existingIds = newData
      this.$store.dispatch('routerPlanning/setShowIds', newData)
      this.drawMpaData(type)
      this.addStyelBox()
    },
    //切换区域调整和业代调整
    getType(value, type, data, text) {
      if (text === '取消') {
        if (this.existingIds.toString() !== this.showIds.toString()) {
          this.$store.dispatch('routerPlanning/setShowIds', this.existingIds)
        }
        this.ControlFunctionMutex('AreaChange', false)
        this.ControlFunctionMutex('SalesChange', false)
      } else if (text === '添加区域') {
        this.sowAdd = value
        this.ControlFunctionMutex('addNewarea', false)
      } else {
        if (
          !this.AllControl.get('AreaChange') ||
          !this.AllControl.get('SalesChange')
        ) {
          return
        }
        //如果是进入区域调整或者业代调整
        this.$store.dispatch('routerPlanning/Stock_pile', true)
        this.ControlFunctionMutex('AreaChange', true)
        this.ControlFunctionMutex('SalesChange', true)
        this.existingIds = this.showIds
      }
      this.areaChange = this.AllControl.get('AreaChange')
      this.personChange = this.AllControl.get('SalesChange')
      this.addNewChange = this.AllControl.get('addNewarea')
      this.modelProps = value
      this.typeProps = type
      const newData = data
      this.dataProps = newData
      this.nowPostId = data[0].label.id
      this.$store.dispatch('routerPlanning/setnowPostId', this.nowPostId)
      this.keyArr = [data[0].id]
      this.addStyelBox()
    },
    addStyelBox(){
      if(this.addNewChange) {
        // 修改增加区域按钮样式
        this.$nextTick(() => {
          let dom = document.querySelectorAll('.newButton');
          dom.forEach(item => {
            let newdata = item.parentNode.parentNode.parentNode.parentNode.querySelectorAll('.el-tree-node')
            newdata.forEach((newitem,newindex)=>{
              if(newindex+1 == newdata.length){
                newitem.childNodes[0].style.height = '60px';
                newitem.childNodes[0].style.background = '#0A2757';
              } else {
                newitem.childNodes[0].style.height = '36px';
                newitem.childNodes[0].style.background = '#133773';
              }
            })
            newdata = null
          });
          dom = null
        })
      }
    },
    getMapOptions(data, type) {
      this.$emit('getMapOptions', data, type)
    },
    // 获取特约批分布
    getAllAgency() {
      Api.get_all_agency({
        orgId: this.orgId,
        programId: this.programId,
        jobId: this.nowPostId,
        isPlan: this.isPlan
      })
        .then(res => {
          if (res.data && res.data.length > 0) {
            const colorArr = [
              '#7234E9',
              '#D834E9',
              '#B56B04',
              '#5FACFC',
              '#0AAD5C',
              '#FF0126'
            ]
            res.data.forEach(item => {
              let result = []
              for (var i = 0, len = item.agencyList.length; i < len; i += 6) {
                result.push(item.agencyList.slice(i, i + 6))
              }
              result.forEach(childitem => {
                childitem.forEach((newitem, index) => {
                  if (
                    newitem.storeAgencyLng &&
                    newitem.storeAgencyLat &&
                    newitem.gdBoundar
                  ) {
                    newitem.color = colorArr[index]
                    const marker = new this.newAMap.Marker({
                      icon: aphaimg,
                      position: [
                        Number(newitem.storeAgencyLng),
                        Number(newitem.storeAgencyLat)
                      ],
                      offset: new this.newAMap.Pixel(0, 0)
                    })
                    this.AMap.add(marker)
                    marker.setLabel({
                      offset: new this.newAMap.Pixel(0, -0),
                      content:
                        `<div class='tagtitle' id='边框` +
                        newitem.agencyCode +
                        `'><img class="inputcheckbox" src='` +
                        checkboximg +
                        `' id='` +
                        newitem.agencyCode +
                        `'/>` +
                        newitem.storeAgencyName +
                        '</div>'
                    })
                    const tagmarker = new this.newAMap.Marker({
                      icon: aphaimg,
                      position: [
                        Number(newitem.storeAgencyLng),
                        Number(newitem.storeAgencyLat)
                      ],
                      offset: new this.newAMap.Pixel(30, 35)
                    })
                    this.AMap.add(tagmarker)
                    const newName = newitem.agencyTypeName
                      ? newitem.agencyTypeName.slice(0, 1)
                      : '无'
                    tagmarker.setLabel({
                      offset: new this.newAMap.Pixel(0, 0),
                      content:
                        `<div class='hovertitle'  id='标识` +
                        newitem.agencyCode +
                        `'> <div class='cricletitle'>` +
                        newName +
                        '</div></div>'
                    })
                    const data = [
                      {
                        borderWidth: '1',
                        fillColorOpacity: '1',
                        gdBoundarJson: newitem.gdBoundar,
                        gdLat: newitem.storeAgencyLat,
                        gdLng: newitem.storeAgencyLng,
                        iconType: '1',
                        zIndex: '1',
                        id: newitem.agencyCode,
                        name: newitem.storeAgencyName,
                        type: 'region'
                      }
                    ]
                    let listdata = getMapData({
                      data,
                      type: ['LineData', 'CoverData'],
                      style: { color: newitem.color },
                      detail: {
                        id: newitem.agencyCode,
                        name: newitem.storeAgencyName,
                        strokeStyle: 'dashed',
                        zIndex: '1',
                        fillOpacity: 0.3
                      }
                    })
                    this.DrawNowData(
                      listdata.newLineData[0],
                      listdata.newCoverData[0]
                    )
                    let outlistdata = getMapData({
                      data,
                      type: ['LineData', 'CoverData'],
                      style: { color: newitem.color },
                      detail: {
                        id: '边框' + newitem.agencyCode,
                        name: newitem.storeAgencyName,
                        strokeStyle: 'solid',
                        zIndex: '1',
                        fillOpacity: 0.4
                      }
                    })
                    this.DrawNowData(
                      outlistdata.newLineData[0],
                      outlistdata.newCoverData[0]
                    )
                    setTimeout(() => {
                      this.showDealer(newitem.agencyCode)
                    }, 0)
                    setTimeout(() => {
                      this.getEventClick(
                        newitem.agencyCode,
                        this.dealerLineData,
                        this.dealerCoverData,
                        this.AMap,
                        checkboximg
                      )
                    }, 1500)
                  } else {
                    console.log('有空数据agencyCode', newitem.agencyCode)
                  }
                })
              })
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    DrawNowData(data, coverdata) {
      const alldata = data.value && data.value
      const newKey = data.key && data.key
      // 绘制移出边界线
      const lineResult = this.drawBorders(alldata)
      const newline = lineResult.borderPolygonArr
      this.AMap.setFitView()
      this.dealerLineData.set(newKey, newline)
      // 绘制移出覆盖层
      const allcoverdata = coverdata.value && coverdata.value
      const newcoverKey = coverdata.key && coverdata.key
      const CoverResult = this.drawBorders(allcoverdata)
      const newCover = CoverResult.borderPolygonArr
      this.dealerCoverData.set(newcoverKey, newCover)
    },
    getEventClick(value, data1, data2, map_obj, checkboximg) {
      const checkbox = document.getElementById(value)
      const outbutton = document.getElementById('边框' + value)
      const bigbutton = document.getElementById('标识' + value)
      if(checkbox){
        const outlinedata = data1.get('边框' + checkbox.id)
        const outcoverdata = data2.get('边框' + checkbox.id)
        const linedata = data1.get(checkbox.id)
        const coverdata = data2.get(checkbox.id)
        outbutton.onmouseover = function() {
          outbutton.className = 'tagouttitle'
          bigbutton.className = 'outhovertitle'
          if (checkbox.src === checkboximg) {
            map_obj.add(outlinedata[0].geojson)
            map_obj.add(outcoverdata[0].geojson)
            map_obj.remove(linedata[0].geojson)
            map_obj.remove(coverdata[0].geojson)
          }
        }
        outbutton.onmouseout = function() {
          outbutton.className = 'tagtitle'
          bigbutton.className = 'hovertitle'
          if (checkbox.src === checkboximg) {
            map_obj.add(linedata[0].geojson)
            map_obj.add(coverdata[0].geojson)
            map_obj.remove(outlinedata[0].geojson)
            map_obj.remove(outcoverdata[0].geojson)
          }
        }
        checkbox.onclick = function() {
          if (checkbox.src === checkboximg) {
            checkbox.src = null
            map_obj.remove(outlinedata[0].geojson)
            map_obj.remove(outcoverdata[0].geojson)
          } else {
            checkbox.src = checkboximg
            map_obj.add(outlinedata[0].geojson)
            map_obj.add(outcoverdata[0].geojson)
          }
        }
      }
    },
    showDealer(code) {
      const linedata = this.dealerLineData.get('边框' + code)
      const coverdata = this.dealerCoverData.get('边框' + code)
      this.AMap.remove(linedata[0].geojson)
      this.AMap.remove(coverdata[0].geojson)
    },
    // 检查 是否存在 未计划的服务日
    async checkStore(id) {
      let nowType
      let result = await Api.checkNoPlanServiceStore({
        prePlanNo: this.programId,
        salesTypeCode: id,
        isLoading: false
      })
      if (result.code === '200') {
        if (this.viewMapSalesTypeMap.has(id)) {
          nowType = {
            ...this.viewMapSalesTypeMap.get(id),
            noDaySize: result.data.noDaySize,
            createServiceDayStatus: result.data.noDaySize ? true : false
          }
        }
        let viewMapSalesTypeMap = this.viewMapSalesTypeMap
        viewMapSalesTypeMap.set(id, nowType)
        this.$store.commit(
          'routerPlanning/SET_VIEW_MAP_SALES_TYPE_MAP',
          viewMapSalesTypeMap
        )
        this.$store.commit(
          'routerPlanning/SET_SALE_TYPE_KEY',
          new Date().getTime()
        )
        if (result.data.noDaySize) {
          this.noPlanServiceDayStoreNum = result.data.noDaySize
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    // 生成服务日
    createServiceDay() {
      Api.createServiceDay({
        org_id: this.organizationId,
        pre_plan_no: this.mapViewId,
        sales_type_code: this.nowPostId
      })
      .then(res => {
        if(res.code === '504') {
          // 线路已被其他账号生成 需重新更新
          location. reload()
        }
      })
      this.checkStore(this.nowPostId)
      this.routeDialogVisible = false
    },
    //点击新增区域
    addNewArea(data) {
      if (!this.AllControl.get('addNewarea')) {
        return
      }
      if(data[0].children.length>21) {
        this.$message({
          message: '超过区域上线，无法继续添加~',
          type: 'warning'
        })
        return
      }
      // 设置禁用状态
      this.$store.dispatch('routerPlanning/Stock_pile', true)
      this.ControlFunctionMutex('addNewarea', true)
      this.sowAdd = true
      const newData = data
      this.dataProps = newData
      this.nowPostId = data[0].label.id
      this.$store.dispatch('routerPlanning/setnowPostId', this.nowPostId)
      this.keyArr = [data[0].id]
    }
  }
}
</script>

<style lang="scss">
.el-popover.popverStyle {
  padding: 8px;
  height: 13px !important;
  background-color: #000;
  border: none;
  .el-popover__title{
    font-size: 12px;
    color: #ffffff;
  }
  .popper__arrow {
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 6px solid #000;
    content: '';
    overflow: hidden;
    & ::after{
      border: none;
    }
  }
}
.content {
  height: calc(100vh - 205px);
  overflow-y: auto;
  overflow-x: hidden;
}
.amap-marker-label {
  position: absolute;
  z-index: 2;
  border: none;
  background-color: rgba(0, 0, 0, 0);
}
.tagtitle {
  padding: 0 10px;
  height: 28px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: #666666;
  line-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tagouttitle {
  padding: 0 10px;
  height: 28px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px #930cea solid;
  color: #930cea;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.inputcheckbox {
  width: 14px;
  height: 14px;
  background-color: #930cea;
  border-radius: 3px;
  display: inline-block;
  margin-right: 2px;
}
input {
  margin-right: 5px;
  vertical-align: middle;
}
.cricletitle {
  width: 18px;
  height: 18px;
  border: 1px solid #ffffff;
  text-align: center;
  line-height: 18px;
  border-radius: 18px;
  color: #ffffff;
  background-color: #3f3c88;
}
.hovertitle {
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 18px;
  border-radius: 18px;
  color: #ffffff;
  background-color: #ffffff;
}
.outhovertitle {
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 18px;
  border-radius: 18px;
  color: #ffffff;
  background-color: #ffffff;
  border: 2px #4a90e2 solid;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  box-sizing: content-box;
}
</style>
<style lang="scss" scoped>
::v-deep .el-tree {
  background-color: #0a2757;
  .el-tree-node__content {
    display: flex;
    height: 36px;
    line-height: 36px;
    background: #133773;
    font-size: 13px;
    color: #ffffff;
    margin-bottom: 2px;
    .custom-tree-node {
      justify-content: space-between;
      display: flex;
      width: 100%;
      align-items: center;
    }
    .el-tree-node__expand-icon {
      font-size: 20px !important;
    }
    .el-switch__core {
      width: 30px !important;
      height: 19px !important;
      margin-right: 10px;
      &::after {
        height: 17px;
        width: 17px;
        top: 0px;
      }
    }
  }
}
::v-deep .el-tree-node__expand-icon {
  font-size: 20px;
}
.toptitlebox {
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  .newbox {
    display: inline-flex;
  }
}
.textbox {
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  .newbox {
    display: inline-flex;
    .newtitle {
      width: 175px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
span {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.draggeBox {
  min-height: 96px;
  width: 320px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 5px;
  position: relative;
  .topbox {
    height: 16px;
    line-height: 16px;
    color: #FFFFFF;
    font-size: 14px;
    padding: 10px 12px;
    background: rgba(0, 0, 0, 0.15);
    width: 296px;
    border-radius: 5px 5px 0 0;
    .topcircle {
      width: 16px;
      height: 16px;
      line-height: 16px;
      font-size: 12px;
      color: #fff;
      background: rgba(0, 0, 0, 0.7);
      border: 1px solid #FFFFFF;
      border-radius: 20px;
      margin-right: 5px;
      text-align: center;
    }
    p {
      display: inline-block;
    }
  }
  .bottombox {
    padding: 5px 10px;
    span {
      float: left;
      text-align: center;
      margin: 2px;
      padding: 2px;
    }
    .commnactive {
      background-image: url('./../../../../assets/img/client_cricle.png');
      background-size: 200%;
      background-position: center;
    }
    .sanjiaoshow {
      background-image: url('./../../../../assets/img/sanjiao.png');
      background-size: 150% 110%;
      background-position: center;
    }
    .fangshow {
      background-image: url('./../../../../assets/img/fang.png');
      background-size: 200%;
      background-position: center;
    }
  }
  .textStyle {
    font-weight: normal;
    display: block;
    font-size: 12px;
  }
  .lineStyle {
    font-size: 23px;
    font-weight: normal;
  }
  .fanglineStyle {
    font-size: 23px;
    font-weight: normal;
    line-height: 25px;
    height: 26px;
  }
  .draagetitle {
    font-size: 13px;
    color:#fff;
    margin-bottom: 8px;
    margin-left: 3px;
  }
  .closeicon {
    position: absolute;
    z-index: 2;
    right: 10px;
    top: 5px;
    cursor: pointer;
    height: 16px;
    width: 16px;
    padding: 7px;
  }
}
.newPoint {
  height: 16px;
  width: 16px;
  border-radius: 10px;
  line-height: 20px;
  text-align: center;
  margin-right: 10px;
  color: #ffffff;
  margin: 6px;
  border:2px solid #fff;
}
.newButton {
  display: block;
  width: 105% !important;
  margin: 0 5% 0 -45%;
  height: 28px;
  line-height: 28px;
  text-align: center;
  font-size: 13px;
  color: #ced3dd;
  border: 1px solid #8199a4;
  background: #102f63;
  border-radius: 5px;
}
.button_edit {
  height: 28px;
  line-height: 28px;
  display: inline-flex;
  width: 500px;
  border: 1px solid #8199a4;
  background: #102f63;
  border-radius: 5px;
  align-content: center;
  margin: 10px 0 10px -15px;
  box-sizing: border-box;
  span {
    flex: 1;
    font-size: 13px;
    color: #ced3dd;
    cursor: pointer;
    text-align: center;
    &:first-child {
      border-right: 1px solid #8199a4;
    }
  }
}
.nav_icon {
  width: 11px;
  height: 11px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  margin: 0 5px;
  display: inline-block;
  vertical-align: middle;
}
.nav_icon2 {
  width: 11px;
  height: 11px;
  transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  margin: -2px;
  display: inline-block;
  vertical-align: middle;
  position: absolute;
  top:2px;
  left: 2px;
}
.red {
  border: 1px solid #ff0126;
  background: rgba(255, 1, 38, 0.1);
}
.green {
  background: rgba(10, 173, 92, 0.1);
  border: 1px solid #0aad5c;
}
.line_no {
  width: 120px;
  height: 36px;

  background: linear-gradient(
    270deg,
    rgba(205, 205, 205, 0.3) 0%,
    rgba(182, 182, 182, 0) 100%
  );
  font-size: 12px;
  color: #ced3dd;
  border-right: 2px solid #c3c3c3;
  text-align: center;
}
.line_button {
  width: 65px;
  height: 24px;
  background: #102f63;
  border-radius: 16px;
  border: 1px solid #bf5cff;
  font-size: 12px;
  color: #c581f1;
  line-height: 24px;
  text-align: center;
  margin-right: -40px;
  transform: scale(0.9);
  -webkit-transform: scale(0.9);
}
.span-table {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 160px;
  height: 36px;
  position: relative;
  .service-failed {
    background: linear-gradient(
      270deg,
      rgba(190, 25, 25, 0.4) 0%,
      rgba(190, 25, 25, 0) 100%
    );
    font-size: 12px;
    color: #ed3f14;
    border-right: 2px solid #ed3f14;
    text-align: center;
    transform: scale(0.8);
    -webkit-transform: scale(0.8);
    display: block;
    width: 100px;
  }
  .service-success {
    background: linear-gradient(
      270deg,
      rgba(25, 190, 107, 0.4) 0%,
      rgba(25, 190, 107, 0) 100%
    );
    font-size: 12px;
    color: #19be6b;
    border-right: 2px solid #19be6b;
    text-align: center;
    transform: scale(0.8);
    -webkit-transform: scale(0.8);
    width: 100px;
  }
  .line_button {
    display: block;
    margin-right: 0px;
  }
}
.no-click {
  color: grey !important;
  cursor: not-allowed !important;
}
.line_run {
  width: 120px;
  height: 36px;
  background: linear-gradient(
    270deg,
    rgba(255, 153, 0, 0.3) 0%,
    rgba(255, 201, 0, 0) 100%
  );
  font-size: 12px;
  color: #ff9900;
  border-right: 2px solid #ff9900;
  text-align: center;
}
.line_already {
  width: 120px;
  height: 36px;
  background: linear-gradient(
    270deg,
    rgba(25, 190, 107, 0.4) 0%,
    rgba(25, 190, 107, 0) 100%
  );
  font-size: 12px;
  color: #19be6b;
  border-right: 2px solid #19be6b;
  text-align: center;
}
.line_err {
  width: 120px;
  height: 36px;
  background: linear-gradient(
    270deg,
    rgba(190, 25, 25, 0.4) 0%,
    rgba(190, 25, 25, 0) 100%
  );
  font-size: 12px;
  color: #ed3f14;
  border-right: 2px solid #ed3f14;
  text-align: center;
}
.dialog-box {
  ::v-deep {
    .el-dialog__header {
      padding: 0;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      height: 40px;
      line-height: 40px;
      position: relative;
      .el-dialog__title {
        font-size: 14px;
        margin-left: 38px;
      }
      .el-dialog__headerbtn {
        top: 2px;
      }
    }
    .el-dialog__body {
      padding: 23px 33px;
      font-size: 16px;
      font-weight: 600;
      color: #1f2d3d;
    }
    .el-dialog__footer {
      height: 50px;
      border-top: 1px solid #d8e4f0;
      padding: 0 10px 0 0;
      .el-button {
        width: 60px;
        height: 32px;
        background: #f4f4f4;
        border-radius: 4px;
        border: 1px solid #ced3dd;
        padding: 0;
        margin-top: 7px;
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
