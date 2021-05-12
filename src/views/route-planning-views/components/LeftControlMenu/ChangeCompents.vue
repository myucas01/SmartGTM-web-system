<template>
  <!-- 调整区域 -->
  <div class="content">
    <el-tree
      default-expand-all
      :data="tabdata"
      :props="defaultProps"
      :expand-on-click-node="false"
    >
      <div class="custom-tree-node" slot-scope="{ node }">
        <div v-if="node.label.showTab == 0" class="button_edit">
          <span
            v-auth= "'lineplan:build:mapshow:updatearea'"
            @click="getChange(true, 'Area', tabdata)"
            :class="typeData === 'Area' && 'active'"
            >区域调整
            <el-tooltip placement="top">
                <div slot="content">
                    <span>
                      1. 不支持绘制折叠自相交的区域。
                      <br/>
                      2. 不支持绘制内部镂空的区域。
                    </span>
                </div>
                <svg-icon icon-class="wenhao" class-name="icon-tip"/>
            </el-tooltip>
          </span>
          <span
            v-auth= "'lineplan:build:mapshow:selectuser'"
            @click="getChange(true, 'Person', tabdata)"
            :class="typeData === 'Person' && 'active'"
            >区域关联业代</span
          >
        </div>
        <span>
          <span
            v-if="
              node.label.showRrightbox == -1 && node.label.showRrightbox != 4
            "
            class="nav_icon"
            :style="getColor(node.label.color, 'border')"
            ><p
              class="nav_icon2"
              :style="getColor(node.label.color, 'area')"
            ></p>
            {{ node.label.color }}</span
          >
          <el-popover
           :disabled="node.label.areaName?false:true"
            class="newbox"
            popper-class="popverStyle"
            placement="right-end"
            :title="node.label.areaName + (node.label.person ? '（' + node.label.person + '）' : '')"
            trigger="hover"
          >
            <p slot="reference" :class="node.label.areaName?'newtitle':''">
              {{ node.label.name }}
              {{
                typeData === 'Area'
                  ? node.label.person
                    ? '（' + node.label.person + '）'
                    : ''
                  : ''
              }}
            </p>
          </el-popover>
        </span>
        <span v-if="node.label.showRrightbox == 0" class="line_no"
          >未生成路线</span
        >
        <span
          v-auth="'lineplan:build:mapshow:createline'"
          v-if="node.label.showRrightbox == 1"
          class="line_button"
          @click="getChange(false, 'line', dataProps)"
          >生成路线</span
        >
        <span v-if="node.label.showRrightbox == 2" class="line_run"
          >路线生成中…</span
        >
        <span v-if="node.label.showRrightbox == 12" class="line_run"
          >服务日生成中…</span
        >
        <span v-if="node.label.showRrightbox == 22" class="line_run"
          >片区还原中…</span
        >
        <div
          class="span-table"
          v-if="
            node.label.showRrightbox == 11 ||
              node.label.showRrightbox == 13 ||
              node.label.showRrightbox == 15 ||
              node.label.showRrightbox == 14 ||
              node.label.showRrightbox == 23 ||
              node.label.showRrightbox == 24 ||
              node.label.showRrightbox == 25 ||
              node.label.showRrightbox == 21
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
              node.label.showRrightbox == 23 ||
                node.label.showRrightbox == 21 ||
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
              node.label.showRrightbox == 11 ||
                node.label.showRrightbox == 13 ||
                node.label.showRrightbox == 14 ||
                node.label.showRrightbox == 15 ||
              node.label.showRrightbox == 21 ||
              node.label.showRrightbox == 23 ||
              node.label.showRrightbox == 24 ||
              node.label.showRrightbox == 25
            "
            @click="getChange(false, 'line', dataProps)"
            class="line_button"
            >生成路线</span
          >
        </div>
        <span v-if="node.label.showRrightbox == 3" class="line_already"
          >已生成路线</span
        >
        <span v-if="node.label.showRrightbox == 4" class="line_err"
          >生成失败，请重试</span
        >
        <span v-if="node.label.showRrightbox == 5" class="line_err"
          >生成错误，请重试</span
        >
        <span v-if="node.label.showRrightbox == -1" class="rightbox">
          <el-switch
            v-if="typeData === 'Area'"
            size="min"
            v-model="node.label.showArea"
            @change="chanAreashow(node.label)"
            active-color="#930cea"
            inactive-color="#DCDFE6">
          </el-switch>
          <el-checkbox
            v-if="typeData === 'Area'"
            :value="defultId == node.label.id ? true : false"
            size="min"
            active-color="#930CEA"
            inactive-color="#DCDFE6"
            class="smart_checkbox_deep"
            @change="getCheckbox($event, node)"
          ></el-checkbox>
          <el-select
            v-if="typeData === 'Person'"
            v-model="node.label.person"
            @change="getSelectValue($event, node.label)"
            placeholder="请选择"
            size="mini"
            class="smart_select_deep"
          >
            <el-option
              v-for="option in salesArr"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </span>
      </div>
    </el-tree>
    <span class="bottom">
      <el-button
        :disabled="overChange"
        size="mini"
        class="smart_button_deep"
        @click="getChange(false, 'cancel', dataProps)"
        >退出</el-button
      >
      <el-button
        :disabled="overChange"
        type="primary"
        size="mini"
        @click="getChange(false, 'save', dataProps, typeData)"
        >保存</el-button
      >
    </span>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Api from '@api/route/planpreview_api.js'
import getMapData from '@/util/PreviewProgram/getMapData'
import * as turf from '@turf/turf'
export default {
  name: 'ChangeCompents',
  props: [
    'modelProps',
    'dataProps',
    'typeProps',
    'DawerText',
    'salesArr',
    'programId',
    'drawTools',
    'orgId',
    'AMap',
    'newAMap',
    'jobId',
    'getRoutePosition',
    'organizationId',
    'treeData',
    'AllControl',
    'ControlFunctionMutex',
    'OutLineDataArr',
    'LineDataArr',
    'CoverDataArr',
    'NameDataArr',
    'dawAreaArr',
    'showAreaData',
    'areaChange',
    'personChange',
    'readyHave',
    'showaddNewArea'
  ],
  data() {
    return {
      PolyEditorList: [],
      pointSelectList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      typeData: this.typeProps,
      labelData: new Map(),
      onCheck: [],
      defultId: null,
      contextMenuObj: null,
      newPolyMark: [],
      newPolyPoint: [],
      newMatkerList: [],
      resuleGeom: null,
      newallIds: [],
      tabdata: null,
      precinctsCode: '', // 划区方式
      getZoom: null,
      newgetZoom: null,
      getCenter: null,
      newCenter: null,
      overChange:false,
      newShowArea: new Map(),
    }
  },
  computed: {
    ...mapGetters('routerPlanning', [
      'jobLayer',
      'showIds',
      'viewMapSalesTypeMap',
      'pointVal' // 图例 点位
    ])
  },
  mounted() {
    this.init(this.dataProps[0])
    const { precinctsCode } = this.$route.query
    this.precinctsCode = precinctsCode ? precinctsCode : ''
    this.tabdata = JSON.parse(JSON.stringify(this.dataProps))
  },
  watch: {
    // // 图例 岗位 变更
    treeData: {
      deep: true,
      handler: function(newval) {
        for (let item of newval) {
          if (item.label.id === this.dataProps[0].label.id) {
            item.children.forEach(newitem => {
              if (newitem.label.areaId) {
                // 如果第一次打开则默认打开所有区域，并存所有区域
                newitem.label.showArea = true
              }
            })
            this.tabdata = JSON.parse(JSON.stringify([item]))
          }
        }
        this.hideLastChild()
      }
    },
    tabdata: {
      deep: true,
      handler: function() {
        // 过滤所有选中的业代
        if(this.readyHave.size>0) {
          this.getNewHave()
        }
      }
    }
  },
  methods: {
    init(data) {
      let newIds = []
      data.children.forEach(item => {
        if (item.label.areaId) {
          // 如果第一次打开则默认打开所有区域，并存所有区域
          item.label.showArea = true
          this.newShowArea.set(item.label.areaId,item.label.name)
          if (this.LineDataArr.size > 0) {
            let data = this.LineDataArr.get(item.label.areaId)
            if (data) {
              this.AMap.add(data[0].geojson)
            }
            data = null
          }
          if (this.CoverDataArr.size > 0) {
            let data = this.CoverDataArr.get(item.label.areaId)
            if (data) {
              this.AMap.add(data[0].geojson)
            }
            data = null
          }
          if (this.NameDataArr.size > 0) {
            let data = this.NameDataArr.get(item.label.areaId)
            if (data[0]) {
              this.AMap.add(data[0].text)
            }
            data = null
          }
          if (this.LineDataArr.size > 0) {
            let data = this.LineDataArr.get(this.organizationId)
            if (data && data[0]) {
              this.AMap.add(data[0].geojson)
            }
            data = null
          }
          newIds.push(item.label.areaId)
        }
      })
      this.hideLastChild()
      this.newallIds = newIds
      if(this.newallIds.toString()!==this.showIds.toString()) {
        this.$store.dispatch('routerPlanning/setShowIds', this.newallIds)
      }
      if (!this.jobLayer.includes('已计划')) {
        const newdata = [...this.jobLayer]
        newdata.push('已计划')
        this.$store.dispatch('routerPlanning/setLegendJobLayer', newdata)
      }
      this.getZoom = this.AMap.getZoom()
      this.getCenter = this.AMap.getCenter()
    },
    // 显示或隐藏单个区域
    chanAreashow(data){
      if(!data.showArea){
        // 如果关闭则删除区域
        this.newShowArea.delete(data.areaId)
      } else {
        // 如果打开则添加区域
        this.newShowArea.set(data.areaId,data.name)
      }
      if (this.LineDataArr.size > 0) {
        let geoData = this.LineDataArr.get(data.areaId)
        if (geoData && data.showArea) {
          this.AMap.add(geoData[0].geojson)
        } else if (geoData && !data.showArea) {
          this.AMap.remove(geoData[0].geojson)
        }
        geoData = null
      }
      if (this.CoverDataArr.size > 0) {
        let geoData = this.CoverDataArr.get(data.areaId)
        if (geoData && data.showArea) {
          this.AMap.add(geoData[0].geojson)
        } else if (geoData && !data.showArea) {
          this.AMap.remove(geoData[0].geojson)
        }
        geoData = null
      }
    },
    getChange(value, type, data, typeData) {
      if (type === 'save') {
        // 保存
        if (typeData === 'Person') {
          // ******调用接口保存业代调整结果
          this.getPrecinctinfo(data)
        } else {
          // ******调用接口保存区域调整结果
          this.getUpdateComplete()
        }
      } else if (type === 'cancel') {
        this.$store.dispatch('routerPlanning/Stock_pile', false)
        // 取消 完成区域多边形绘制
        this.hideDreaw()
        // 开启调整点位状态
        this.tabdata[0].children.forEach(item=>{
          if(item.label.areaId) {
            if (this.LineDataArr.size > 0) {
              const data = this.LineDataArr.get(item.label.areaId)
              if (data && data[0]) {
                this.AMap.add(data[0].geojson)
              }
            }
            if (this.CoverDataArr.size > 0) {
              const geoData = this.CoverDataArr.get(item.label.areaId)
              if (geoData) {
                this.AMap.add(geoData[0].geojson)
              }
            }
          }
        })
        this.$emit('getType', value, type, data, '取消')
      } else if (type === 'Area') {
        // 切换区域调整
        this.typeData = type
        if (!this.AllControl.get('AreaChange')) {
          return
        }
        this.ControlFunctionMutex('AreaChange', true)
        this.DawerText(true)
      } else if (type === 'Person') {
        this.typeData = type
        if (!this.AllControl.get('SalesChange')) {
          return
        }
        this.ControlFunctionMutex('SalesChange', true)
        this.hideDreaw()
        // 切换区域关联业代
      } else if (type === 'line') {
        if (!this.AllControl.get('LineButton')) {
          return
        }
        const Node = data[0]
        this.hideDreaw()
        // 生成路线
        setTimeout(() => {
          Node.childNodes.splice(0, 1)
          this.$emit('getType', value, type, data)
          this.$emit('linButton', Node)
        }, 100)
      }
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
    // 退出
    hideDreaw() {
      this.AMap.setZoom(this.getZoom)
      this.AMap.setCenter(this.getCenter)
      this.DawerText(false)
      if (this.drawTools) {
        this.overDreaw()
        this.UndawArea()
      }
      if (this.CoverDataArr.size > 0) {
        const data = this.CoverDataArr.get(this.defultId)
        if (data) {
          this.AMap.add(data[0].geojson)
        }
      }
      if (this.LineDataArr.size > 0) {
        const data = this.LineDataArr.get(this.defultId)
        if (data) {
          this.AMap.add(data[0].geojson)
        }
      }
      if (this.PolyEditorList && this.PolyEditorList.length > 0) {
        this.PolyEditorList.forEach(item => {
          item.close()
        })
        this.PolyEditorList = []
      }
      if (this.contextMenuObj) {
        this.contextMenuObj.close()
      }
    },

    //切换绘制区域
    getCheckbox(value, data) {
      this.AMap.setZoom(this.getZoom)
      this.AMap.setCenter(this.getCenter)
      let label = data.data.label
      const Id = label.id
      this.defultId = Id
      this.showIds.forEach(item=>{
      if (this.CoverDataArr.size > 0) {
        const data = this.CoverDataArr.get(item)
        const newdata = this.newShowArea.get(item)
        if (data && (newdata || this.defultId == item)) {
          this.AMap.add(data[0].geojson)
        }
      }
      if (this.LineDataArr.size > 0) {
        const data = this.LineDataArr.get(item)
        const newdata = this.newShowArea.get(item)
        if (data && (newdata || this.defultId == item)) {
          this.AMap.add(data[0].geojson)
        }
      }
      })
      if (value) {
        label.showArea = value
        // 显示当前区域描边
        this.UndawArea()
        let nowGeojson
        if (this.OutLineDataArr.size>0) {
          const data = this.OutLineDataArr.get(Id)
          nowGeojson = data.newvalue[0].geojson.w.geoJSON
          this.AMap.add(data.value[0].geojson)
        }
        label.geojson = nowGeojson
        this.DarwNew(label, Id)
        this.DawerText(true)
      } else {
        this.UndawArea()
        this.defultId = ''
        //关闭，并清除多边形覆盖物
        this.overDreaw()
        this.DawerText(false)
      }
    },
    // 右击操作区域调整移出并入
    getNewDreaw(data, Id) {
      this.getContextMenu(data, Id)
      let that = this
      let drawArr = []
      that.newAMap.event.addListener(that.drawTools, 'draw', function(e) {
        if(drawArr.length<2 && that.drawTools) {
          that.drawTools.close(false)
        }
        e.obj.on('rightclick', function(e) {
          that.contextMenuObj.open(that.AMap, e.lnglat)
        })
        that.markeNewArea(e)
        that.newAMap.plugin(['AMap.PolyEditor'], function() {
          let polylineEditor = new that.newAMap.PolyEditor(that.AMap, e.obj)
          that.PolyEditorList.push(polylineEditor)
          polylineEditor.open()
          polylineEditor.on('addnode', function() {
            that.markeNewArea(e)
          })
          polylineEditor.on('adjust', function() {
            that.markeNewArea(e)
          })
        })
      })
    },

    // 区域调整面 右击操作工具
    getContextMenu(data, Id) {
      let that = this
      let contextMenu = new that.newAMap.ContextMenu()
      contextMenu.addItem(
        '移出',
        function() {
          let difference = null
          if (that.newPolyMark.length < 1) {
            that.$message.error('没有绘制区域，无法计算')
            return
          }
          if (that.newMatkerList.length > 0) {
            let baleanArr = []
            // 判断绘制区域点是否在区域内
            if(that.newPolyMark.length>0){
              const Polydata = that.newPolyMark[0][0][0]
              Polydata && Polydata.forEach(item=>{
                const pt = turf.point(item);
                const poly = turf.multiPolygon(that.newMatkerList)
                const newValue = turf.booleanPointInPolygon(pt, poly);
                baleanArr.push(newValue)
              })
            }
            // 判断绘制锚点边界点是否在区域内
            if(that.PolyEditorList.length>0){
            const Markdata = that.PolyEditorList[0].au[0]
              Markdata && Markdata.forEach(item=>{
                const pt = turf.point([item.lng,item.lat]);
                const poly = turf.multiPolygon(that.newMatkerList)
                const newValue = turf.booleanPointInPolygon(pt, poly);
                baleanArr.push(newValue)
              })
            }
            if(baleanArr.every(item=>item)) {
              that.$message.error('绘制区域存在折叠自相交或者内部镂空，请调整绘制边界')
              return
            }
            try {
              difference = turf.difference(
                turf.multiPolygon(that.newMatkerList),
                turf.multiPolygon(that.newPolyMark[0])
              )
            } catch (err) {
              that.$message.error('绘制区域存在折叠自相交或者内部镂空，请调整绘制边界')
              return
            }
          } else{
            that.$message.error('无当前区域边界数据，无法计算')
            return
          }
          // console.log(JSON.stringify(difference), 'difference1')
          // 绘制新的结果
          that.handleUtils(difference, data)
          // 获取点位
          that.getAreaPoint(Id, '移出')
        },
        0
      )
      contextMenu.addItem(
        '并入',
        function() {
          let union = null
          if (that.newPolyMark.length < 1) {
            that.$message.error('没有绘制区域，无法计算')
            return
          }
          if (that.newMatkerList.length > 0) {
            try {
              union = turf.union(
                turf.multiPolygon(that.newMatkerList),
                turf.multiPolygon(that.newPolyMark[0])
              )
            } catch (err) {
              that.$message.error('绘制区域存在折叠自相交或者内部镂空，请调整绘制边界')
              return
            }
          } else {
            try {
              union = turf.union(
                turf.multiPolygon(that.newPolyMark[0]),
                turf.multiPolygon(that.newPolyMark[0])
              )
            } catch (err) {
              that.$message.error('绘制区域存在折叠自相交或者内部镂空，请调整绘制边界')
              return
            }
          }
          // console.log(JSON.stringify(union), 'union')
          // 绘制新的结果
          that.handleUtils(union, data)
          // 获取点位
          that.getAreaPoint(Id, '并入')
        },
        1
      )
      contextMenu.addItem(
        '取消',
        function() {
          // 清空绘制结果
          that.UndawArea('取消')
          that.DarwNew(data, Id)
          if(that.dawAreaArr.size>0) {
            if (that.LineDataArr.size > 0) {
              const data = that.LineDataArr.get(that.defultId)
              if (data) {
                that.AMap.remove(data[0].geojson)
              }
            }
            if (that.CoverDataArr.size > 0) {
              const data = that.CoverDataArr.get(that.defultId)
              if (data) {
                that.AMap.remove(data[0].geojson)
              }
            }
          }
        },
        2
      )
      that.contextMenuObj = contextMenu
    },

    // 处理绘制数据
    markeNewArea(e) {
      let that = this
      that.newPolyMark = []
      this.newPolyPoint = []
      that.newPolyMark.push(e.obj.getPath())
      that.newPolyPoint.push(e.obj.getPath())
      // 格式化绘制数据
      let arr = []
      this.newPolyMark.forEach(item => {
        let arr1 = []
        item.forEach(op => {
          arr1.push([op.lng, op.lat])
        })
        arr1.push([item[0].lng, item[0].lat])
        arr.push([[arr1]])
      })
      this.newPolyMark = arr
    },

    // 获取截取片区中的点位
    getAreaPoint(nowareaId, operationType) {
      let _this = this
      let arr = []
      let pointMarke = []
      let armMarker = []

      _this.newPolyPoint.forEach(item => {
        let arr1 = []
        item.forEach(op => {
          arr1.push([parseFloat(op.lng), parseFloat(op.lat)])
        })
        arr1.push([parseFloat(item[0].lng), parseFloat(item[0].lat)])
        arr.push([arr1])
      })

      let pointData = turf.multiPolygon(arr)

      let nowDotData = this.$store.state.routerPlanning.pointNeedData

      for (let item of nowDotData) {
        for (let store of item[1]) {
          for (let area of store.storeList) {
        if(area.repeatPointList) {
          area.repeatPointList.length>0 && area.repeatPointList.forEach(repeat=>{
            if (repeat.storeLng && repeat.storeLat) {
              armMarker.push([
                parseFloat(repeat.storeLng),
                parseFloat(repeat.storeLat)
              ])
              pointMarke.push(repeat)
            }
          })
        } else {
            if (area.storeLng && area.storeLat) {
              armMarker.push([
                parseFloat(area.storeLng),
                parseFloat(area.storeLat)
              ])
              pointMarke.push(area)
            }
        }
          }
        }
      }
      nowDotData = null
      armMarker = turf.points(armMarker)
      var ptsWithin = turf.pointsWithinPolygon(armMarker, pointData)
      let point = new Map()
      ptsWithin.features && ptsWithin.features.forEach(item => {
        point.set(
          item.geometry.coordinates[0].toString() +
            item.geometry.coordinates[1].toString(),
          item.geometry.coordinates
        )
      })

      _this.pointSelectList = []
      if (operationType === '并入') {
        point.forEach(item => {
          pointMarke.forEach(op => {
            if (
              item[0] == op.storeLng &&
              item[1] == op.storeLat &&
              this.showIds.indexOf(op.areaId) >= 0 &&
              nowareaId !== op.areaId
            ) {
              _this.pointSelectList.push(op.storeId)
            }
          })
        })
      } else if (operationType === '移出') {
        point.forEach(item => {
          pointMarke.forEach(op => {
            if (
              item[0] == op.storeLng &&
              item[1] == op.storeLat &&
              this.showIds.indexOf(op.areaId) >= 0 &&
              nowareaId === op.areaId
            ) {
              _this.pointSelectList.push(op.storeId)
            }
          })
        })
      }
    },

    // 处理区域调整绘制结果
    handleUtils(Geojson, data) {
        const { id, color } = data
        let geometry
        if (Geojson) {
          geometry = Geojson.geometry
        } else {
          geometry = turf.polygon([]).geometry
        }
        if(geometry){
          const newGeojson = {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry
              }
            ]
          }
          const newGeometry = JSON.stringify(geometry)
          const newFeature = JSON.stringify(newGeojson)
          // 储存绘制结果
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          setTimeout(() => {
            loading.close()
          }, 1500)
          this.resuleGeom = newGeometry
          // 重新绘制
          this.HideOldDraw(id, color, newFeature)
          data.geojson = newGeojson
          this.DarwNew(data, id)
          this.overDreaw()
        } else {
          this.$message.error('计算结果为空值')
        }
    },

    // 重新绘制方法
    DarwNew(label, Id) {
      if(this.drawTools) {
        this.drawTools.close(true)
      }
      this.$emit('getMapmessage', 'dawArea', label)
      this.defultId = Id
      this.overDreaw()
      this.newMatkerList = []
      //开启绘制多边形覆盖物
      const listData = label
      setTimeout(() => {
        this.getNewDreaw(listData, Id)
      }, 1000)
      let newdata
      let newArrata = []
      if(listData.geojson && listData.geojson.features[0]) {
        if (listData.geojson.features[0].geometry.coordinates) {
          newdata = listData.geojson.features[0].geometry.coordinates
          if (newdata && newdata.length > 0) {
            const type = listData.geojson.features[0].geometry.type
            if (type === 'Polygon') {
              newdata.forEach(item => {
                newArrata.push([item])
              })
            } else if (type === 'MultiPolygon') {
              newdata.forEach(item => {
                newArrata.push(item)
              })
            }
          }
        } else {
          newdata = listData.geojson.features[0].geometry.geometries
          newdata.forEach(item => {
            const data = item.coordinates
            const type = item.type
            if (type === 'Polygon') {
              data.forEach(item => {
                newArrata.push([item])
              })
            } else if (type === 'MultiPolygon') {
              data.forEach(item => {
                newArrata.push(item)
              })
            }
          })
        }
      }
      this.newMatkerList = newArrata
    },

    // 隐藏业代区域原始数据
    HideOldDraw(id, color, newFeature) {
      if (this.LineDataArr.size > 0) {
        let data = this.LineDataArr.get(id)
        if (data) {
          this.AMap.remove(data[0].geojson)
        }
        data = null
      }
      if (this.OutLineDataArr.size > 0) {
        let data = this.OutLineDataArr.get(id)
        if (data) {
          this.AMap.remove(data.value[0].geojson)
          this.AMap.remove(data.newvalue[0].geojson)
        }
        data = null
      }
      if (this.CoverDataArr.size > 0) {
        let data = this.CoverDataArr.get(id)
        if (data) {
          this.AMap.remove(data[0].geojson)
        }
        data = null
      }
      if (this.dawAreaArr.size > 0) {
        let data = this.dawAreaArr.get(id)
        if (data) {
          this.AMap.remove(data.OutlinemapResult[0].geojson)
          this.AMap.remove(data.mapResult[0].geojson)
        }
        data = null
      }
      //绘制新区域
      this.dreawNewdata(id, color, newFeature)
    },

    //绘制新画的区域
    dreawNewdata(id, color, darJson) {
      const data = [
        {
          borderWidth: '1',
          fillColorOpacity: '1',
          gdBoundarJson: darJson,
          iconType: '1',
          id: id,
          name: 'dreawNewdata',
          type: 'region'
        }
      ]
      let listdata = getMapData({
        data,
        type: ['nowDreawData'],
        style: { color: color },
        detail: { id, name: 'dreawNewdata' }
      })
      const { nowDreawData } = listdata
      // 绘制合并后的区域
      this.$emit('getMapOptions', nowDreawData[0], nowDreawData[1])
    },

    // 完成区域绘制
    overDreaw() {
      if (this.PolyEditorList && this.PolyEditorList.length > 0) {
        this.PolyEditorList.forEach(item => {
          item.close()
        })
        this.PolyEditorList = []
      }
      if (this.contextMenuObj) {
        this.contextMenuObj.close()
      }
    },

    // 关闭多边形绘制
    UndawArea(type) {
      this.showIds.forEach(item=>{
      if (this.CoverDataArr.size > 0) {
        const data = this.CoverDataArr.get(item)
        const newdata = this.newShowArea.get(item)
        if (data && (newdata || this.defultId == item)) {
          this.AMap.add(data[0].geojson)
        }
      }
      if (this.LineDataArr.size > 0) {
        const data = this.LineDataArr.get(item)
        const newdata = this.newShowArea.get(item)
        if (data && (newdata || this.defultId == item)) {
          this.AMap.add(data[0].geojson)
        }
      }
      })
      this.newMatkerList = []
      if (this.OutLineDataArr.size > 0 && type !=='取消') {
        this.OutLineDataArr.forEach(item => {
          // 隐藏区域边界
          this.AMap.remove(item.newvalue[0].geojson)
          this.AMap.remove(item.value[0].geojson)
        })
      }
      if (this.dawAreaArr.size > 0 && type !=='取消') {
        this.dawAreaArr.forEach(item => {
          this.AMap.remove(item.OutlinemapResult[0].geojson)
          this.AMap.remove(item.mapResult[0].geojson)
        })
        this.dawAreaArr.clear()
      }
      if (this.drawTools) {
        this.drawTools.close(true)
        this.newPolyMark = []
        this.newPolyPoint = []
      }
    },

    // 完成区域调整
    getUpdateComplete() {
     this.newgetZoom = this.AMap.getZoom()
     this.newCenter = this.AMap.getCenter()
      if (!this.drawTools || this.drawTools.length < 1) {
        this.$message({ message: '请绘制需要调整的区域', type: 'warning' })
        return
      }
      if (!this.resuleGeom || this.PolyEditorList.length >0) {
        this.$message({ message: '暂无绘制数据，请重试！', type: 'warning' })
        return
      }
      this.overChange=true
      // ******区域调整：完成调整
      Api.get_update_complete({
        orgId: this.orgId,
        prePlanNo: this.programId,
        precinctGeom: this.resuleGeom,
        precinctNo: this.defultId, // 片区id
        salesTypeCode: this.jobId,
        storeList: this.pointSelectList,
        isAi: this.precinctsCode === 'ai' ? 'Y' : 'N'
      })
        .then(res => {
          if (res.code === '200') {
            this.getRoutePosition('区域调整')
            setTimeout(() => {
              this.dawAreaArr.clear()
              this.AMap.setZoom(this.newgetZoom)
              this.AMap.setCenter(this.newCenter)
                setTimeout(() => {
                // 选中新生成的描边
                let nowGeojson
                if (this.OutLineDataArr.size>0) {
                  const data = this.OutLineDataArr.get(this.defultId)
                  if(data) {
                    nowGeojson = data.newvalue[0].geojson.w.geoJSON
                    this.AMap.add(data.value[0].geojson)
                  }
                }
                const newGeodata = this.tabdata[0].children.filter(item=>item.label.id==this.defultId)
                newGeodata[0].label.geojson = nowGeojson
                this.DarwNew(newGeodata[0].label, this.defultId)
                this.$message({
                  message: res.data,
                  type: 'success'
                })
                }, 2000)
            }, 2000)
          }
          if(res.code === '504') {
            // 线路已被其他账号生成 需重新更新
            location. reload()
          }
          this.overChange=false
        })
        .catch(err => {
          console.log(err)
          this.overChange=false
        })
    },
    // 完成区域业代调整
    getPrecinctinfo(data) {
      if (this.labelData.length < 1) {
        this.$message({ message: '请选择需要调整的业代', type: 'warning' })
        return
      }
      data[0].children.forEach(item => {
        if (this.labelData.get(item.label.areaId)) {
         item.person = this.labelData.get(item.label.areaId).empName
        }
      })
        let newArr = []
        for(let labelitem of this.labelData) {
          if(labelitem[1].empNo && labelitem[1].empName) {
            newArr.push ({
              empName: labelitem[1].empName,
              empNo: labelitem[1].empNo,
              precinctNo: labelitem[0]
            })
          }
        }
      let salesinfoList = newArr
      if(salesinfoList.length>0) {
        this.overChange=true
        // ******区域关联业代：完成调整
        Api.get_precinctinfo({
          salesinfoList
        })
          .then(res => {
            if (res.code === '200') {
              this.$message({
                message: res.data,
                type: 'success'
              })
              setTimeout(() => {
                this.getRoutePosition('区域调整')
              }, 0)
            }
            if(res.code === '504') {
              // 线路已被其他账号生成 需重新更新
              location. reload()
            }
          })
          .catch(err => {
            console.log(err)
          })
          setTimeout(()=>{
            this.overChange=false
          },3000)
      }
    },
    //隐藏最后一个节点
    hideLastChild(){
      if(this.showaddNewArea){
        // 删除增加区域默认空节点
        this.$nextTick(() => {
          let dom = document.querySelectorAll('.custom-tree-node');
          dom.forEach((item,index) => {
            if(index+1 == dom.length){
              item.parentNode.parentNode.style.display = 'none';
            }
          });
          dom = null
        })
      }
    },
    //获取业代list数据
    getSelectValue(value, data) {
      if(this.readyHave){
        this.getNewHave()
      }
      let haveNo = false // 默认无重复业代
      // 如果选中的业代包含新选择的业代，则提示业代已被关联
      if(this.readyHave.size>0){
      for(let item of this.readyHave) {
        if(item) {
          if(item[1].salesNo == value){
            if(item[0]!= data.areaId) {
              this.tabdata[0].children.forEach(tabitem=>{
                if(tabitem.label.areaId == data.areaId) {
                  //有重复业代，则清空选项，并且把重复项清空
                  tabitem.label.person = ''
                  this.readyHave.set(data.areaId,{})
                }
              })
              let newData = this.salesArr.filter(newitem=>newitem.value=== value)
              this.$message({ message: '业代'+newData[0].label+'已被'+item[1].havaIcon+'关联', type: 'warning' })
              haveNo = true // 确认有重复业代
            }
          }
        }
      }
      }
      const { id } = data
      let empName, empNo, newDta
      if(!haveNo) {
        this.salesArr.forEach(item => {
          if (item.value === value) {
            empName = item.label
            empNo = item.value
          }
        })
        newDta = {
          empName,
          empNo
        }
      } else {
        newDta = {
          empName:'',
          empNo:''
        }
      }
      this.labelData.set(id, newDta)
    },
    getNewHave(){
        //判断初始业代是不是空
        let newreadHave = this.readyHave
        this.tabdata[0].children.forEach(item=>{
            if(item.label.person){
              let newData = this.salesArr.filter(newitem=>newitem.label===item.label.person)
              if(newData.length>0){
                newreadHave.set(item.label.areaId, {salesNo:newData[0].value,havaIcon:item.label.jobName+'-'+item.label.name})
              } else {
                newreadHave.set(item.label.areaId, {salesNo:item.label.person,havaIcon:item.label.jobName+'-'+item.label.name})
              }
            }
        })
      }
    }
}
</script>
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
      margin-right: 30px;
      &::after {
        height: 17px;
        width: 17px;
        top: 0px;
      }
    }
  }
}
::v-deep .el-tree-node__expand-icon {
  font-size: 16px;
}
.newbox {
  display: inline-flex;
  .newtitle {
    width: 120px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.smart_button_deep {
  background-color: #102f63 !important;
  border-radius: 4px !important;
  border: 1px solid #4f707f !important;
  color: #ffffff;
}
span {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  // text-overflow: ellipsis;
}
.active {
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  position: relative;
  width: 112px;
  background: #930cea;
  color: #ffffff;
}
.button_edit {
  height: 28px;
  line-height: 28px;
  display: inline-flex;
  width: 280px;
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
  border-right: 2px solid #0a2757;
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
  margin-right: 12px;
  transform: scale(0.9);
  -webkit-transform: scale(0.9);
}
.span-table {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 200px;
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
    margin-right: 20px;
  }
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
.bottom {
  margin: 30px 22px 30px 22px;
  display: flex;
  justify-content: space-around;
}
::v-deep .el-button--mini {
  width: 45%;
}
::v-deep .el-select {
  width: 100%;
}
::v-deep .el-checkbox__inner {
  border-radius: 20px;
}
.rightbox {
  width: 40%;
  margin-right: 30px;
  text-align: right;
}
</style>
