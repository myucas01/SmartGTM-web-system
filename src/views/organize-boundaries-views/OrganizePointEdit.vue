<template>
  <div class="ob-index">
    <div class="mainBox" :class="leftShow ? 'show' : ''">
      <div class="titleBox">
        <svg class="icon" aria-hidden="true" @click="leftShow = !leftShow">
          <use xlink:href="#iconicon_map_leftboard_shouqi" />
        </svg>
        组织边界概况/{{ orgName }}-设置
      </div>
      <div class="borderTitle">
        <span class="font-white">
          <i
            :class="[treeShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right']"
            @click="changeTreeShow"
          ></i
          >行政边界
        </span>
      </div>
      <div class="treeBox">
        <el-tree
          :data="treeData"
          v-show="treeShow"
          node-key="regionCode"
          class="smart_tree_deep"
          ref="tree"
          :props="defaultProps"
        >
          <span class="custom-tree-node" slot-scope="{ data }">
            <el-tooltip
              class="item"
              effect="dark"
              :content="'已属于' + data.osetedOrgName + '组织'"
              placement="top-start"
              v-if="data.oseted && data.regionName != '中华人民共和国'"
            >
              <span>{{ data.regionName }}</span>
            </el-tooltip>
            <span v-else>{{ data.regionName }}</span>
          </span>
        </el-tree>
      </div>
      <div class="infoBox">
        <div
          class="lableBox"
          style="display: flex; justify-content: space-between"
        >
          <span class="font-white f14" style="">{{ lableName }}</span>
          <el-switch v-model="otherOrgBorder" @change="getOtherOrg"></el-switch>
        </div>
        <div class="lableBox">
          <span class="lable font-white">组织名称:</span>
          <el-input
            size="small"
            disabled
            class="smart_input_deep"
            v-model="orgName"
          ></el-input>
        </div>
        <div class="lableBox">
          <span class="lable font-white">城市/区域:</span>
          <el-cascader
            class="smart_cascader_deep"
            size="small"
            clearable
            v-model="area"
            ref="cascaderAddr"
            :options="cascaderData"
            :props="CascaderProps"
            @visible-change="cascaderVis"
            @change="handleChange"
          ></el-cascader>
        </div>
        <div class="lableBox">
          <span class="lable font-white">详细地址:</span>
          <el-input
            size="small"
            class="smart_input_deep"
            v-model="address"
            placeholder="请输入"
          ></el-input>
          <span class="previewBtn" @click="PreviewArea">预览</span>
        </div>
      </div>
      <div class="borderTitle">
        <span class="font-white">
          <i
            :class="[
              colorShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
            ]"
            @click="changecolorShow"
          ></i
          >展示效果
        </span>
      </div>
      <orgstyle
        ref="style"
        :orgId="orgId"
        :orgType="orgType"
        @orgColor="getOrgStyle"
        v-show="colorShow"
        @styleBack="styleBack"
        @colorChange="colorChange"
      ></orgstyle>
      <div class="btnBox">
        <el-button class="backBtn" size="small" @click="goback">取消</el-button>
        <el-button class="setBtn" type="primary" size="small" @click="submit"
          >设置完成</el-button
        >
      </div>
    </div>
    <div class="icon_open" v-show="!leftShow" @click="leftShow = !leftShow">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#iconicon_map_leftboard_zhankai" />
      </svg>
    </div>
    <MapCOMP ref="map" @sendMapObj="setmap" />
  </div>
</template>

<script>
import { AMap } from '@/plugins/AMap'
import MapCOMP from '@/components/Map.vue'
import orgstyle from './components/orgStyleEdit.vue'
import * as turf from '@turf/turf'

export default {
  name: 'organizeEdit',
  title() {
    return '组织树维护'
  },
  components: {
    MapCOMP,
    orgstyle
  },
  data() {
    return {
      otherOrgBorder: false,
      leftShow: true,
      backId: '',
      // searchName:'',
      orgId: '',
      orgName: '',
      orgColor: '',
      orgDrawColor: '',
      colorOpacityVal: 0.5,
      Switchwidth: 30,
      treeShow: true, //行政树 展开收起
      colorShow: true, //展示效果 展开收起
      borderSwitch: false,
      treeData: [], //行政树数据
      defaultProps: {
        children: 'regions',
        label: 'regionName',
        disabled: 'oseted'
      },
      cascaderData: [], // 城市区域选择  级联数据
      CascaderProps: {
        children: 'list',
        label: 'regionName',
        value: 'regionCode'
      },
      area: [], //选择城市区域
      areaNames: [], //选择城市区域 名称
      address: '', //位置详细地址
      drawIds: [], //地图绘制出来的区域id
      MapBorder: new Map(),
      MapColor: new Map(),
      MapIcon: new Map(),
      MapName: new Map(),
      otherDrgColor: new Map(),
      treeChild: [], //行政树 最底级数据集合
      checkChild: [], //被点击节点的所有末节点
      backRoute: '',
      AMap: '',
      newAMap: '',
      gdLat: '',
      gdLng: '',
      successNum: 0,
      parentOrgId: '',
      clickType: '1',
      mouseTool: null,
      polyObj1: [],
      polyObj2: [],
      newMarkerList: [],
      newPolyMark: [],
      contextMenuObj: null,
      selectgenerationColorArr: [],
      OtherOrgIds: [],
      lableName: '',
      gdBoundarJson: '',
      parentGdBoundarJson: ''
    }
  },
  created() {
    this.orgId = this.$route.query.orgId
    this.orgName = this.$route.query.orgName
    this.orgType = this.$route.query.orgType
    this.backId = this.$route.query.backId
    this.getOrgInfo()
    this.getchangeIDs()
    this.$store.dispatch('map/setSearchType', ['map'])
    this.$store.dispatch('map/setMapOrganization', false)
  },
  watch: {
    //路由不发生变化，只是路由的参数发生变化，导致页面不会请求数据，通过监听出发请求
    $route: function (to, from) {
      if (to.name == 'OrganizePointEdit' && to.fullPath !== from.fullPath) {
        this.drawIds = []
        this.orgId = this.$route.query.orgId
        this.orgName = this.$route.query.orgName
        this.backId = this.$route.query.backId
        this.AMap.clearMap()
        this.$refs.style.getStyle(this.orgId, this.orgType)
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // 通过 `vm` 访问组件实例  设置tab标签
      vm.$store.commit('addTabs', {
        title: `组织边界锚点编辑-${vm.$route.query.orgName}`,
        link: `/organize-boundaries/organize-point-edit?orgId=${vm.$route.query.orgId}&orgName=${vm.$route.query.orgName}&orgType=${vm.$route.query.orgType}&type=${vm.$route.query.type}&backId=${vm.$route.query.backId}&backName=${vm.$route.query.backName}`,
        on: false,
        needCatch: true
      })
    })
  },
  computed: {},
  methods: {
    setmap(map, Gmap) {
      this.AMap = map
      this.newAMap = Gmap
    },
    //获取同级别其他组织数据，进行绘制
    getOtherOrg(event) {
      if (event) {
        let url = '/api/boundary/orgstyle/getList'
        this.$fetch.get(url, { orgId: this.parentOrgId }).then((res) => {
          if (res.code == 200) {
            let data = res.data.filter((item) => item.orgId != this.orgId)
            for (let i in data) {
              data[i].style = {
                'border-width': 0,
                'text-align': 'center',
                'font-size': '16px',
                'font-weight': '600',
                color: '#000000',
                // 'text-shadow': '#FFF 1px 0 0,#FFF 0 1px 0,#FFF -1px 0 0,#FFF 0 -1px 0',
                'font-family':
                  'MicrosoftYaHei, Microsoft YaHei Normal, Microsoft YaHei',
                'background-color': '#f0f8ff00'
              }
              data[i].id = data[i].orgId
              data[i].name = data[i].orgName
              data[i].iconType = data[i].icon
              if (data[i].gdBoundarJson) {
                this.drawOrganizeColor(data[i], false, false)
                this.drawOrganizeBorder(data[i], false, false)
                if (data[i].gdLat && data[i].gdLng) {
                  this.drawOrganizeName(data[i])
                }
                this.OtherOrgIds.push(data[i].orgId)
              }
            }
          }
        })
      } else {
        for (let i in this.OtherOrgIds) {
          this.clearMapColor(this.OtherOrgIds[i])
          this.clearMapBorder(this.OtherOrgIds[i])
          this.clearMapName(this.OtherOrgIds[i])
        }
      }
    },
    cascaderVis(val) {
      if (val) {
        this.getCascader(true)
      }
    },
    //获取城市区域级联数据
    getCascader(isLoading) {
      console.log(this.ids)
      if (this.ids.length == 0) {
        this.cascaderData = []
        return
      }
      let url = '/api/boundary/region/list'
      this.$fetch
        .post(url, {
          isLoading: isLoading,
          regionCodes: this.ids.toString()
        })
        .then((res) => {
          if (res.code == 200) {
            this.cascaderData = res.data
          }
        })
    },
    getchangeIDs() {
      let url = '/api/boundary/region/getRegionByOrgId'
      this.$fetch
        .get(url, {
          orgId: this.orgId,
          orgLevel: '3'
        })
        .then((res) => {
          if (res.code == 200 && res.data) {
            console.log(res)
            this.ids = res.data.seteds
            this.getCascader(false)
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            })
          }
        })
        .catch((error) => {
          console.log(error.message)
        })
    },
    //获取行政树
    getTree() {
      let url = '/api/boundary/region/seted'
      this.$fetch
        .get(url, {
          orgId: this.orgId
        })
        .then((res) => {
          if (res.code == 200 && res.data) {
            console.log(res)
            this.$set(this, 'treeData', res.data)
          } else {
            // this.$message({
            //   message: res.message?res.message:'暂无行政数据',
            //   type: 'warning'
            // })
          }
        })
        .catch((error) => {
          console.log(error.message)
        })
    },
    getparentOrg() {
      let url = '/api/boundary/orgstyle/getCurrentOrg'
      this.$fetch
        .get(url, { orgId: this.parentOrgId, isLoading: false })
        .then((res) => {
          if (res.code == 200) {
            this.parentGdBoundarJson = res.data[0].gdBoundarJson
            this.drawOrganizeBorder(res.data[0], true)
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            })
          }
        })
    },
    getOrgInfo() {
      let url = '/api/boundary/orgstyle/getCurrentOrg'
      this.$fetch
        .get(url, { orgId: this.orgId, isLoading: false })
        .then((res) => {
          if (res.code == 200) {
            console.log(res.data[0])
            if (res.data) {
              res.data[0].opacity=res.data[0].opacity/100
              this.gdBoundarJson = res.data[0].gdBoundarJson
              this.drawOrganizeColor(
                res.data[0],
                this.parentGdBoundarJson ? false : true
              )
            }
            this.getContextMenu()
            this.drawMouseTool()
            console.log(this.orgDrawColor)
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            })
          }
        })
    },
    //获取展示样式
    getOrgStyle(data) {
      this.orgDrawColor = data.color
      this.iconType = data.icon
      this.getArea() //获取公司位置信息
    },
    //获取组织位置详细信息
    getArea() {
      // let _this=this
      let url = '/api/boundary/org/getGtmOrgDetailByOrgId'
      // let
      this.$fetch
        .get(url, {
          isLoading: false,
          orgId: this.orgId
        })
        .then((res) => {
          if (res.code == 200) {
            if (res.data.areaCode) {
              this.area = [
                '010000000000',
                res.data.provinceCode,
                res.data.cityCode,
                res.data.areaCode
              ]
              this.areaNames = [
                '中华人民共和国',
                res.data.province,
                res.data.city,
                res.data.area
              ]
            }

            this.address = res.data.address
            this.parentOrgId = res.data.parentOrgId
            this.orgType = res.data.orgType

            switch (this.orgType) {
              case 0:
                this.lableName = '其他区域边界'
                break
              case 1:
                this.lableName = '其他行销公司边界'
                break
              case 2:
                this.lableName = '其他营业部边界'
                break
              case 3:
                this.lableName = '其他营业所边界'
                break
              default:
                this.lableName = ''
            }
            let obj = {
              id: this.orgId,
              gdLng: res.data.gdLng,
              gdLat: res.data.gdLat,
              iconType: this.iconType,
              orgName: this.orgName
            }
            this.getTree()
            this.getparentOrg()
            this.getOrgInfo()
            if (res.data.gdLng && res.data.gdLat) {
              this.drawOrganizeIcon(obj)
              this.drawOrganizeName(obj)
            }
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    changeTreeShow() {
      this.treeShow = !this.treeShow
    },
    changecolorShow() {
      this.colorShow = !this.colorShow
    },
    //选择城市/区域
    handleChange() {
      let lables = this.$refs.cascaderAddr.getCheckedNodes()
      if (lables.length > 0) {
        this.areaNames = lables[0].pathLabels
      } else {
        this.areaNames = []
        this.area = []
      }
    },
    //城市区域预览
    PreviewArea() {
      if (this.area.length == 0) {
        this.$message({
          message: '请选择城市/区域',
          type: 'warning'
        })
        return
      }
      let areaName = this.areaNames.join('')
      let addressName = areaName + this.address
      var geocoder = new AMap.Geocoder()
      //使用地址名称查询是否存在
      geocoder.getLocation(addressName, (status, result) => {
        if (status === 'complete' && result.geocodes.length) {
          this.gdLat = result.geocodes[0].location.lat
          this.gdLng = result.geocodes[0].location.lng
          let obj = {
            name: this.orgName,
            id: this.orgId,
            gdLng: result.geocodes[0].location.lng,
            gdLat: result.geocodes[0].location.lat,
            iconType: this.iconType
          }
          this.clearMapIcon(this.orgId)
          this.clearMapName(this.orgId)
          this.drawOrganizeIcon(obj)
          this.drawOrganizeName(obj)
        } else {
          this.$message({
            message: '根据地址查询位置失败',
            type: 'warning'
          })
        }
      })
    },
    getContextMenu() {
      let that = this

      that.newMarkerList = []
      that.newPolyMark = []

      var contextMenu = new AMap.ContextMenu()

      contextMenu.addItem(
        '移出',
        function () {
          let difference = null

          if (that.newPolyMark.length < 1) {
            that.$message.error('没有绘制区域')
            return
          }

          try {
            difference = turf.difference(
              turf.multiPolygon(that.newMatkerList),
              turf.multiPolygon(that.newPolyMark[0])
            )
            that.drawMouseTool()
          } catch (e) {
            console.log(e)
            that.$message.error('绘制区域存在折叠自相交，请调整绘制边界')
            return
          }
          that.gdBoundarJson = JSON.stringify(difference)
          that.handleUtils(difference)
          console.log(JSON.stringify(difference), 'difference')
        },
        0
      )

      contextMenu.addItem(
        '并入',
        function () {
          let union = null
          if (that.newPolyMark.length < 1) {
            that.$message.error('没有绘制区域')
            return
          }
          console.log(that.newPolyMark)
          console.log(that.newMatkerList)
          try {
            union = turf.union(
              turf.multiPolygon(that.newMatkerList),
              turf.multiPolygon(that.newPolyMark[0])
            )
            that.drawMouseTool()
          } catch (e) {
            console.log(e)
            that.$message.error('绘制区域存在折叠自相交，请调整绘制边界')
            return
          }
          that.gdBoundarJson = JSON.stringify(union)
          that.handleUtils(union)
          console.log(JSON.stringify(union), 'union')
        },
        0
      )

      contextMenu.addItem(
        '取消',
        function () {
          if (that.newPolyMark.length < 1) {
            that.$message.error('没有绘制区域')
            return
          }
          console.log(that.newPolyMark)
          that.clearPoly()
          that.drawMouseTool()
          setTimeout(() => {
            that.handleTz(that.selectgenerationColorArr)
          }, 200)
        },
        0
      )

      that.contextMenuObj = contextMenu
    },
    handleUtils(data) {
      let that = this
      // that.debounce(data)
      that.drawOrganizeColor({
        gdBoundarJson: JSON.stringify(data),
        orgId: this.orgId,
        color: this.orgDrawColor,
        opacity: this.colorOpacityVal
      })
      that.clearPoly()

      setTimeout(() => {
        that.handleTz(that.selectgenerationColorArr)
      }, 200)
    },
    colorChange(color, opacityVal) {
      this.clearMapColor(this.orgId)
      this.orgDrawColor = color
      this.colorOpacityVal = opacityVal / 100
      this.drawOrganizeColor({
        gdBoundarJson: this.gdBoundarJson,
        orgId: this.orgId,
        color: color,
        opacity: this.colorOpacityVal
      })
    },
    clearPoly() {
      let that = this
      that.newMarkerList = []
      that.newPolyMark = []
      that.newMatkerList = []
      if (that.polyObj1 && that.polyObj1.length > 0) {
        that.AMap.remove(that.polyObj1)
        that.polyObj1 = []
      }
      // this.clearMapColor(this.orgId)
      if (that.polyObj2 && that.polyObj2.length > 0) {
        that.polyObj2.forEach((item) => {
          item.close()
        })
        that.polyObj2 = []
      }
      if (that.contextMenuObj) {
        that.contextMenuObj.close()
      }
    },
    // 切图，锚点，右击工具
    drawMouseTool() {
      let that = this
      console.log(that.mouseTool)
      if (that.mouseTool) {
        that.mouseTool.close()
      }
      // 绘制区域调整图层
      that.mouseTool = this.$refs.map.dawMouseTool({
        fillColor: 'red',
        strokeColor: 'red',
        fillOpacity: 0.5,
        strokeWeight: 1,
        zIndex: 999
      })
      console.log(that.mouseTool)

      that.newAMap.event.addListener(that.mouseTool, 'draw', function (e) {
        that.polyObj1.push(e.obj)
        that.newMarkerList.push(e.obj.getPath())
        console.log('aaaaa')
        that.saveMarker()

        e.obj.on('rightclick', function (e) {
          that.contextMenuObj.open(that.AMap, e.lnglat)
        })

        that.newAMap.plugin(['AMap.PolyEditor'], function () {
          let polylineEditor = new AMap.PolyEditor(that.AMap, e.obj)
          that.polyObj2.push(polylineEditor)
          polylineEditor.open()
          console.log('aaaaa')
          polylineEditor.on('addnode', function () {
            that.saveMarker()
          })
          polylineEditor.on('adjust', function () {
            that.saveMarker()
          })
        })
      })
    },
    saveMarker() {
      let arr = []
      this.newMarkerList.forEach((item) => {
        let arr1 = []
        item.forEach((op) => {
          arr1.push([op.lng, op.lat])
        })
        arr1.push([item[0].lng, item[0].lat])
        arr.push([[arr1]])
      })
      this.newPolyMark = arr
      if (this.mouseTool) {
        this.mouseTool.close()
      }
    },
    drawOrganizeIcon(option) {
      let obj = {
        data: [option]
      }
      let data = this.$refs.map.drawIcons(obj)
      this.MapIcon.set(option.id, data)
    },
    clearMapIcon(id) {
      let obj = this.MapIcon.get(id)
      if (obj) {
        obj.forEach((item) => {
          this.AMap.remove(item.marker)
        })
        this.MapIcon.delete(id)
      }
    },
    drawOrganizeName(option, style) {
      option.name = option.name ? option.name : option.orgName
      style = style
        ? style
        : {
            'border-width': 0,
            'text-align': 'center',
            'font-size': '16px',
            'font-weight': '600',
            color: '#000000',
            // 'text-shadow': '#FFF 1px 0 0,#FFF 0 1px 0,#FFF -1px 0 0,#FFF 0 -1px 0',
            'font-family':
              'MicrosoftYaHei, Microsoft YaHei Normal, Microsoft YaHei',
            'background-color': '#f0f8ff00'
          }
      let obj = {
        data: [option],
        style: style
      }
      let data = this.$refs.map.drawNames(obj)
      this.MapName.set(option.id, data)
    },
    clearMapName(id) {
      let obj = this.MapName.get(id)
      if (obj) {
        obj.forEach((item) => {
          this.AMap.remove(item.text)
        })
        this.MapName.delete(id)
      }
    },
    drawOrganizeColor(option, isSetFitView = true, isdrawPoint = true) {
      console.log(option.opacity)
      if (isdrawPoint) {
        if (
          this.selectgenerationColorArr &&
          this.selectgenerationColorArr.length > 0
        ) {
          this.AMap.remove(this.selectgenerationColorArr)
          this.selectgenerationColorArr = []
        }
      }
      option.id = option.orgId
      option.color = option.color ? option.color : '#FF9D9D'
      option.fillColorOpacity = option.opacity ? option.opacity : 50
      
      let obj = {
        data: [option]
      }
      let mapOgj = this.$refs.map.drawColors(obj)
      if (isdrawPoint) {
        mapOgj.PolygonArr.forEach((item) => {
          this.selectgenerationColorArr.push(item)
        })
        this.handleTz(this.selectgenerationColorArr)
      }

      this.MapColor.set(option.id, mapOgj)
      if (isSetFitView) {
        this.AMap.setFitView(mapOgj.PolygonArr)
      }
    },
    handleTz(data) {
      let that = this
      that.newMatkerList = []
      data.forEach((item) => {
        let newMarkList = item.getPath()
        let zarr = []
        newMarkList.forEach((op) => {
          let arr1 = []
          if (Array.isArray(op)) {
            op.forEach((it) => {
              arr1.push([it.lng, it.lat])
            })
          } else {
            arr1.push([op.lng, op.lat])
          }
          zarr.push(arr1)
        })
        that.newMatkerList.push(zarr)
      })
    },
    clearMapColor(id) {
      let obj = this.MapColor.get(id)
      if (obj) {
        if (obj.backColorPolygonArr) {
          obj.backColorPolygonArr.forEach((item) => {
            this.AMap.remove(item.geojson)
          })
        }
        this.MapColor.delete(id)
      }
    },
    drawOrganizeBorder(option, isSetFitView = false) {
      // option.id = option.id ? option.id : option.regionCode
      // option.borderColor = option.borderColor?option.borderColor:'#000000'
      // option.borderColorOpacity = option.borderColorOpacity?option.borderColorOpacity:'0.5'
      // option.borderWidth = option.borderWidth?option.borderWidth:1
      const defaultOption = {
        id: option.orgId,
        borderColor: '#000000',
        borderColorOpacity: '0.5',
        borderWidth: 1
      }
      const data = {
        ...option,
        borderColor: option.borderColor,
        borderColorOpacity: option.borderColorOpacity,
        borderWidth: option.borderWidth,
        ...defaultOption
      }
      let obj = {
        data: [data],
        zIndex: 9
      }
      let mapOgj = this.$refs.map.drawBorders(obj)
      if (isSetFitView) {
        this.AMap.setFitView(mapOgj.PolygonArr)
      }
      this.MapBorder.set(option.id, mapOgj)
    },
    clearMapBorder(id) {
      let _this = this
      let obj = this.MapBorder.get(id)
      if (obj) {
        if (obj.borderPolygonArr) {
          obj.borderPolygonArr.forEach((item) => {
            _this.AMap.remove(item.geojson)
          })
        }
        this.MapBorder.delete(id)
      }
    },
    // 锚点调整
    async submitDraw() {
      let str = {}
      if (this.newPolyMark.length > 0) {
        console.log(this.newPolyMark[0])
        console.log(this.newMatkerList)
        let narr1 = JSON.parse(JSON.stringify(this.newPolyMark))[0]
        let narr2 = JSON.parse(JSON.stringify(this.newMatkerList))

        narr2.forEach((item) => {
          narr1.push(item)
        })

        str = {
          type: 'MultiPolygon',
          coordinates: narr1
        }
      } else {
        str = {
          type: 'MultiPolygon',
          coordinates: this.newMatkerList
        }
      }

      let newstr = JSON.parse(JSON.stringify(str))

      if (str.coordinates && str.coordinates.length > 0) {
        newstr.coordinates.forEach((item) => {
          item.forEach((op) => {
            let oplength = op.length - 1
            if (op[0][0] != op[oplength][0] || op[0][1] != op[oplength][1]) {
              op.push([op[0][0], op[0][1]])
            }
          })
        })
        newstr = JSON.stringify(newstr)
      } else {
        newstr = null
      }

      console.log(newstr)
      this.setBorder(newstr)
    },
    setBorder(boundary) {
      let url = '/api/boundary/region/editOrgAnchor'
      // let
      this.$fetch
        .post(url, {
          orgId: this.orgId,
          orgName: this.orgName,
          orgRegionBoundary: boundary,
          orgType: this.orgType
        })
        .then((res) => {
          if (res.code == 200) {
            // this.successNum += 1
            // this.$router.replace(this.backRoute)
            // this.getOrgStyle()
            this.AMap.clearMap()
            this.getArea()
          }
        })
        .catch((error) => {
          console.log(error.message)
        })
    },
    setArea() {
      console.log(this.area)
      // if (this.area.length == 0) {
      //   this.$message({
      //     message: '请选择城市/区域',
      //     type: 'warning'
      //   })
      //   return
      // }
      let areaName = this.areaNames.join('')
      let addressName = areaName + this.address
      var geocoder = new AMap.Geocoder()
      let _this = this
      console.log(addressName)
      //使用地址名称查询是否存在
      geocoder.getLocation(addressName, function (status, result) {
        if (status === 'complete' && result.geocodes.length) {
          _this.gdLat = result.geocodes[0].location.lat
          _this.gdLng = result.geocodes[0].location.lng
          _this.submitArea()
        } else {
          // _this.MESSAGE_W('根据地址查询位置失败');
        }
      })
    },
    submitArea() {
      let url = '/api/boundary/org/modifyGtmOrgDetail'
      // let
      this.$fetch
        .post(url, {
          orgId: this.orgId,
          address: this.address,
          province: this.areaNames[1],
          provinceCode: this.area[1],
          city: this.areaNames[2],
          cityCode: this.area[2],
          area: this.areaNames[3],
          areaCode: this.area[3],
          street: this.areaNames[4],
          streetCode: this.area[4],
          gdLat: this.gdLat,
          gdLng: this.gdLng,
          isLoading: false
        })
        .then((res) => {
          if (res.code == 200) {
            // this.successNum += 1
            // this.$message({
            //   message: '操作成功',
            //   type: 'success'
            // })
            // this.$router.replace(this.backRoute)
          }
        })
        .catch((error) => {
          console.log(error.message)
        })
    },
    submit() {
      console.log(this.newPolyMark)
      if (this.newPolyMark.length) {
        console.log('')
        this.$message.error('暂无绘制数据，请重试！')
        return
      }
      this.setArea()
      this.submitDraw()
      this.$refs.style.submitStyle()
    },
    styleBack() {
      // this.successNum += 1
    },
    getPath() {
      let path = ''
      let index = 0
      for (let i in this.$route.query) {
        index++
        console.log(index)
        console.log(i + ':' + this.$route.query[i])
        if (index == 1) {
          path = path + '?' + i + '=' + this.$route.query[i]
        } else {
          path = path + '&' + i + '=' + this.$route.query[i]
        }
        console.log(path)
      }
      return path
    },
    goback() {
      // let title = ''
      if (this.$route.query.type == 'list') {
        // title = '组织边界概况'
        this.backRoute = `/organize-boundaries/organize-list`
      } else if (this.$route.query.type == 'detail') {
        // title = '组织查看-' + this.$route.query.orgName
        this.backRoute = `/organize-boundaries/organize-detail?orgId=${this.backId}&orgName=${this.$route.query.backName}`
      }
      console.log(this.$route)
      let path = this.getPath()
      console.log(this.$route.path + path)
      // this.$store.commit('addTabs', {
      //   title: title,
      //   link: this.$route.path + path,
      //   update: this.backRoute,
      //   on: false,
      //   needCatch: true
      // })
      this.$router.push(this.backRoute)
    }
  }
}
</script>

<style scoped lang="scss">
.icon_open {
  width: 40px;
  height: 40px;
  background-color: #8798b2;
  position: absolute;
  z-index: 1;
  font-size: 16px;
  line-height: 40px;
  text-align: center;
}
.ob-index {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
}
.borderTitle {
  height: 34px;
  display: flex;
  align-items: center;
  background-color: #133773;
  padding: 0 15px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  i {
    margin-right: 5px;
    cursor: pointer;
  }
  .rightBtn {
    width: 86px;
    line-height: 22px;
    border-radius: 3px;
    text-align: center;
    opacity: 0.58;
    border: 1px solid #ffffff;
    cursor: pointer;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  span {
    width: 100%;
  }
  .btn {
    display: none;
  }
  &:hover {
    .btn {
      display: block;
    }
  }
}
.titleBox {
  background-color: #081f45;
  line-height: 40px;
  color: #ffffff;
  font-size: 14px;
  box-sizing: border-box;
  padding-left: 12px;
}
.mainBox {
  width: 0px;
  height: 100%;
  overflow: hidden;
  background-color: #0a2757;
  position: absolute;
  z-index: 1;
  flex-direction: column;
  transition: width 0.3s;
  -moz-transition: width 0.3s; /* Firefox 4 */
  -webkit-transition: width 0.3s; /* Safari and Chrome */
  -o-transition: width 0.3s;
  display: none;
  &.show {
    width: 330px;
    display: flex;
  }
}
.switchBox {
  height: 50px;
  display: flex;
  align-items: center;
  span {
    margin-right: 10px;
  }
}
.treeBox {
  padding: 5px 12px 0;
  flex: 1;
  overflow: auto;
}
.infoBox {
  background-color: #162d68;
  padding: 10px 15px 0;
  .lableBox {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .lable {
      margin-right: 10px;
      width: 64px;
    }
    .el-input {
      flex: 1;
    }
    .previewBtn {
      color: #f19316;
      margin-left: 5px;
      cursor: pointer;
    }
  }
}
.btnBox {
  margin-top: 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  .backBtn {
    background-color: #415982;
    border-color: #415982;
    color: #ffffff;
    width: 105px;
    &:hover {
      background-color: #41598280;
    }
  }
  .setBtn {
    width: 189px;
  }
}
</style>
