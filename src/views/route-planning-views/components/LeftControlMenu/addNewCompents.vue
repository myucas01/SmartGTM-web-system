<template>
  <!-- 调整区域 -->
  <!-- :render-content="renderContent" -->
  <div class="content">
    <el-tree
      default-expand-all
      :data="tabdata"
      :props="defaultProps"
      :expand-on-click-node="false"
    >
      <div class="custom-tree-node" slot-scope="{ node }">
        <div v-if="node.label.showTab == 0" class="button_edit">
          <span :class="areaChange && ' no-click'">区域调整 </span>
          <span :class="personChange && ' no-click'">区域关联业代</span>
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
            inactive-color="#DCDFE6"
          >
          </el-switch>
        </span>
      </div>
    </el-tree>
    <span class="bottom">
      <el-button
        size="mini"
        class="smart_button_deep"
        @click="getChange(false, 'cancel', dataProps)"
        >取消</el-button
      >
      <el-button
        type="primary"
        size="mini"
        @click="getChange(false, 'save', dataProps, typeData)"
        >添加完成</el-button
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
    'personChange'
  ],
  data() {
    return {
      PolyEditorList: [],
      pointSelectList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      typeData: 'Area',
      labelData: [],
      onCheck: [],
      defultId: null,
      defultlable: null,
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
      newShowArea: new Map(),
      nameObj: new Map(),
      addAreaName: null
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
    this.getNewArea(this.dataProps[0])
  },
  watch: {
    // // 图例 岗位 变更
    treeData: {
      deep: true,
      handler: function(newval) {
        for (let item of newval) {
          if (item.label.id === this.dataProps[0].label.id) {
            this.init(item)
            this.tabdata = JSON.parse(JSON.stringify([item]))
          }
        }
      }
    }
  },
  methods: {
    getNewArea(data) {
      const itemLeng = data.children.length
      const { label } = this.tabdata[0]
      //查询新增片区名称和颜色
      Api.get_pre_NameAndColor({
        precinctCount: itemLeng - 2,
        salesTypeCode: label.id, //业代类型
        orgId: this.orgId
      })
        .then(res => {
          if (res.code == 200) {
            let newData = data.children[itemLeng - 1]
            this.addAreaName = res.data.areaName
            let newName = ''
            if(this.addAreaName) {
              if(this.addAreaName.length>5) {
                newName = this.addAreaName.slice(0,2) + this.addAreaName.substring(this.addAreaName.length-4,this.addAreaName.length)
              } else {
                newName = this.addAreaName
              }
            }
            newData.label = {
              showArea: true,
              showRrightbox: -1,
              switchCheck: true,
              areaList: [],
              geojson: '',
              name: newName,
              color: res.data.areaColor,
              addbox: 1,
              ...res.data
            }
            this.getZoom = this.AMap.getZoom()
            this.getCenter = this.AMap.getCenter()
            this.DarwNew(newData.label, newData.label.id)
            this.DawerText(true)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    init(data) {
      let newIds = []
      data.children.forEach(item => {
        if (item.label.areaId) {
          // 如果第一次打开则默认打开所有区域，并存所有区域
          item.label.showArea = true
          this.newShowArea.set(item.label.areaId, item.label.name)
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
            if (data && data[0]) {
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
      this.newallIds = newIds
      if (this.newallIds.toString() !== this.showIds.toString()) {
        this.$store.dispatch('routerPlanning/setShowIds', this.newallIds)
      }
      // 改变新增区域样式
      this.$nextTick(() => {
        let dom = document.querySelectorAll('.custom-tree-node');
        dom.forEach((item,index) => {
          if(index+1 == dom.length){
            item.parentNode.parentNode.style.border = '#930CEA solid 1px';
            item.parentNode.parentNode.style.background = 'rgba(147, 12, 234, 0.1)';
            item.parentNode.style.background = 'transparent';
          }
        });
        dom = null
       })
    },
    // 显示或隐藏单个区域
    chanAreashow(data) {
      if (!data.showArea) {
        // 如果关闭则删除区域
        this.newShowArea.delete(data.areaId)
      } else {
        // 如果打开则添加区域
        this.newShowArea.set(data.areaId, data.name)
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
    getChange(value, type, data) {
      if (type === 'save') {
        // 保存
        this.addNewArea(value, type, data)
      } else if (type === 'cancel') {
        //移除默认新增区域名称
        if (this.nameObj.get('新增')) {
          this.AMap.remove(this.nameObj.get('新增'))
        }
        this.$store.dispatch('routerPlanning/Stock_pile', false)
        // 取消 完成区域多边形绘制
        this.hideDreaw()
        let newData = data[0].children[data[0].children.length - 1]
        newData.label = {
          showTab: 3 // 是否显示增加区域
        }
        // 开启调整点位状态
        this.$emit('getType', value, type, data, '添加区域')
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
        let data = this.CoverDataArr.get(this.defultId)
        if (data) {
          this.AMap.add(data[0].geojson)
        }
        data = null
      }
      if (this.LineDataArr.size > 0) {
        let data = this.LineDataArr.get(this.defultId)
        if (data) {
          this.AMap.add(data[0].geojson)
        }
        data = null
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

    // 右击操作区域调整移出并入
    getNewDreaw(data, Id) {
      this.getContextMenu(data, Id)
      let that = this
      let drawArr = []
      that.newAMap.event.addListener(that.drawTools, 'draw', function(e) {
        if (drawArr.length < 2 && that.drawTools) {
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
      if (data.geojson) {
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
              if (that.newPolyMark.length > 0) {
                const Polydata = that.newPolyMark[0][0][0]
                Polydata &&
                  Polydata.forEach(item => {
                    const pt = turf.point(item)
                    const poly = turf.multiPolygon(that.newMatkerList)
                    const newValue = turf.booleanPointInPolygon(pt, poly)
                    baleanArr.push(newValue)
                  })
              }
              // 判断绘制锚点边界点是否在区域内
              if (that.PolyEditorList.length > 0) {
                const Markdata = that.PolyEditorList[0].au[0]
                Markdata &&
                  Markdata.forEach(item => {
                    const pt = turf.point([item.lng, item.lat])
                    const poly = turf.multiPolygon(that.newMatkerList)
                    const newValue = turf.booleanPointInPolygon(pt, poly)
                    baleanArr.push(newValue)
                  })
              }
              if (baleanArr.every(item => item)) {
                that.$message.error(
                  '绘制区域存在折叠自相交或者内部镂空，请调整绘制边界'
                )
                return
              }
              try {
                difference = turf.difference(
                  turf.multiPolygon(that.newMatkerList),
                  turf.multiPolygon(that.newPolyMark[0])
                )
              } catch (err) {
                that.$message.error(
                  '绘制区域存在折叠自相交或者内部镂空，请调整绘制边界'
                )
                return
              }
            } else {
              that.$message.error('无当前区域边界数据，无法计算')
              return
            }
            // console.log(JSON.stringify(difference), 'difference1')
            // 绘制新的结果
            that.handleUtils(difference, data)
          },
          0
        )
      }
      contextMenu.addItem(
        '保存',
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
              that.$message.error(
                '绘制区域存在折叠自相交或者内部镂空，请调整绘制边界'
              )
              return
            }
          } else {
            try {
              union = turf.union(
                turf.multiPolygon(that.newPolyMark[0]),
                turf.multiPolygon(that.newPolyMark[0])
              )
            } catch (err) {
              that.$message.error(
                '绘制区域存在折叠自相交或者内部镂空，请调整绘制边界'
              )
              return
            }
          }
          // console.log(JSON.stringify(union), 'union')
          // 绘制新的结果
          that.handleUtils(union, data)
        },
        1
      )
      contextMenu.addItem(
        '取消',
        function() {
          // 清空绘制结果
          that.UndawArea('取消')
          that.DarwNew(data, Id)
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

    // 处理区域调整绘制结果
    handleUtils(Geojson, data) {
      const { id, color } = data
      let geometry
      // 初始化绘制结果
      if (Geojson) {
        geometry = Geojson.geometry
      } else {
        geometry = turf.polygon([]).geometry
      }
      if (geometry) {
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
        var center = turf.centerOfMass(Geojson)
        if (this.nameObj.get('新增')) {
          this.AMap.remove(this.nameObj.get('新增'))
        }
        let newName = ''
        if(this.addAreaName) {
          if(this.addAreaName.length>5) {
            newName = this.addAreaName.slice(0,2) + this.addAreaName.substring(this.addAreaName.length-4,this.addAreaName.length)
          } else {
            newName = this.addAreaName
          }
        }
        const nameAddObj = new this.newAMap.Text({
          text: newName,
          title: newName,
          anchor: 'center',
          position: center.geometry.coordinates,
          draggable: false,
          cursor: 'pointer',
          angle: 0,
          zIndex: 900,
          style: {
            'background-color': 'rgba(0, 0, 0, 0.6)',
            color: '#ffffff',
            border: 'none'
          },
          offset: new this.newAMap.Pixel(-13, -15)
        })
        this.nameObj.set('新增', nameAddObj)
        this.AMap.add(this.nameObj.get('新增'))
      } else {
        this.$message.error('计算结果为空值')
      }
    },

    // 重新绘制方法
    DarwNew(label, Id) {
      if (this.drawTools) {
        this.drawTools.close(true)
      }
      this.$emit('getMapmessage', 'dawArea', label)
      this.defultlable = label
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
      if (listData.geojson) {
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
        const data = this.LineDataArr.get(id)
        if (data) {
          this.AMap.remove(data[0].geojson)
        }
      }
      if (this.OutLineDataArr.size > 0) {
        const data = this.OutLineDataArr.get(id)
        if (data) {
          this.AMap.remove(data.value[0].geojson)
          this.AMap.remove(data.newvalue[0].geojson)
        }
      }
      if (this.CoverDataArr.size > 0) {
        const data = this.CoverDataArr.get(id)
        if (data) {
          this.AMap.remove(data[0].geojson)
        }
      }
      if (this.dawAreaArr.size > 0) {
        const data = this.dawAreaArr.get(id)
        if (data) {
          this.AMap.remove(data.OutlinemapResult[0].geojson)
          this.AMap.remove(data.mapResult[0].geojson)
        }
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
      this.showIds.forEach(item => {
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
      if (this.OutLineDataArr.size > 0 && type !== '取消') {
        this.OutLineDataArr.forEach(item => {
          // 隐藏区域边界
          this.AMap.remove(item.newvalue[0].geojson)
          this.AMap.remove(item.value[0].geojson)
        })
      }
      if (this.dawAreaArr.size > 0 && type !== '取消') {
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

    // 增加新的区域
    addNewArea(value, type, data) {
      const { label, children } = this.tabdata[0]
      // ******区域调整：增加区域
      Api.get_add_Precinct({
        planDataNo: label.planDataNo, //规划数据编号
        prePlanNo: this.$route.query.planId, //预计划编号
        precinctCount: children.length - 2, //区域个数
        precinctGeom: this.resuleGeom, //片区边界
        salesTypeCode: label.id, //业代类型
        salesTypeName: label.name //业代类型名称
      })
        .then(res => {
          if (res.code == 200) {
            this.$parent.getRoutePosition('添加区域')
            //删除默认绘制区域
            this.resuleGeom = null
            //移除默认新增区域名称
            if (this.nameObj.get('新增')) {
              this.AMap.remove(this.nameObj.get('新增'))
            }
            this.$store.dispatch('routerPlanning/Stock_pile', false)
            // 取消 完成区域多边形绘制
            this.hideDreaw()
            let newData = data[0].children[data[0].children.length - 1]
            newData.label = {
              showTab: 3 // 是否显示增加区域
            }
            // 开启调整点位状态
            this.$emit('getType', value, type, data, '添加区域')
          }
          if(res.code === '504') {
            // 线路已被其他账号生成 需重新更新
            location. reload()
          }
        })
        .catch(err => {
          console.log(err)
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
    width: 175px;
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
.newButton {
  margin: 15px auto 0 auto;
  display: block;
  width: 85% !important;
}
span {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  position: relative;
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
  margin-right: 30px;
  text-align: right;
}
</style>
