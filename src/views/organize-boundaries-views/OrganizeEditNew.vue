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
        <!--        <span class="font-white f12" style="line-height: 20px">-->
        <!--          <el-switch :width="Switchwidth" v-model="borderSwitch"></el-switch-->
        <!--          >显示边界-->
        <!--        </span>-->
        <span
          class="font-white f12 rightBtn"
          @click="goAdjust"
          v-auth="'orgBorder:detail:set:update'"
          v-if="isSpecific == 0"
          >组织边界调整</span
        >
      </div>
      <div class="treeBox">
        <!--        <el-input-->
        <!--            v-show="treeShow"-->
        <!--            class="smart_input_deep"-->
        <!--            v-model="searchName"-->
        <!--            size="small"-->
        <!--            placeholder="请输入内容"-->
        <!--            clearable-->
        <!--        >-->
        <!--          <i slot="prefix" class="el-input__icon el-icon-search"></i>-->
        <!--        </el-input>-->
        <el-tree
          :data="treeData"
          v-show="treeShow"
          show-checkbox
          node-key="regionCode"
          class="smart_tree_deep"
          ref="tree"
          :props="defaultProps"
          @check="handleCheckChange"
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
            @change="handleChange"
            @visible-change="cascaderVis"
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
        @iconChange="iconChange"
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
      leftShow: true,
      backId: '',
      // searchName:'',
      orgId: '',
      orgName: '',
      orgType: '',
      isSpecific: 0, //是否是特殊营业部  0  不是   1是
      orgColor: '',
      orgOpacity: '',
      otherOrgBorder: false,
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
      gdLat: '',
      gdLng: '',
      successNum: 0,
      parentOrgId: '',
      clickType: '1',
      OtherOrgIds: [],
    }
  },
  created() {
    this.orgId = this.$route.query.orgId
    this.orgName = this.$route.query.orgName
    this.orgType = this.$route.query.orgType
    this.backId = this.$route.query.backId
    this.setBackRoute() //设置页面返回路径
    // this.$store.dispatch('map/setMapSearchIcon', true)
    this.$store.dispatch('map/setSearchType', ['map'])
    this.$store.dispatch('map/setMapOrganization', false)
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // 通过 `vm` 访问组件实例  设置tab标签
      vm.$store.commit('addTabs', {
        title: `组织边界编辑-${vm.$route.query.orgName}`,
        link: `/organize-boundaries/organize-edit?orgId=${vm.$route.query.orgId}&orgName=${vm.$route.query.orgName}&orgType=${vm.$route.query.orgType}&type=${vm.$route.query.type}&backId=${vm.$route.query.backId}&backName=${vm.$route.query.backName}`,
        on: false,
        needCatch: true
      })
    })
  },
  watch: {
    // searchName(val) {
    //   this.$refs.tree.filter(val)
    // },
    // 监听 保存时 成功接口数量，全部成功，可以返回到进来的页面
    // successNum(val) {
    //   let _this = this
    //   if (val == 3) {
    //     _this.$router.replace(_this.backRoute)
    //   }
    // },
    //路由不发生变化，只是路由的参数发生变化，导致页面不会请求数据，通过监听出发请求
    $route: function (to, from) {
      console.log(to)
      if (to.name == 'OrganizeEdit' && to.fullPath !== from.fullPath) {
        this.$store.commit('addTabs', {
          title: `组织边界编辑-${this.$route.query.orgName}`,
          link: `/organize-boundaries/organize-edit?orgId=${this.$route.query.orgId}&orgName=${this.$route.query.orgName}&orgType=${this.$route.query.orgType}&type=${this.$route.query.type}&backId=${this.$route.query.backId}&backName=${this.$route.query.backName}`,
          on: false,
          needCatch: true
        })
        this.drawIds = []
        this.orgId = this.$route.query.orgId
        this.orgName = this.$route.query.orgName
        this.backId = this.$route.query.backId
        this.AMap.clearMap()
        this.$refs.style.getStyle(this.orgId, this.orgType)
      }
    }
  },
  computed: {
    lableName() {
      switch (this.orgType) {
        case 0:
          return '其他区域边界'
        case 1:
          return '其他行销公司边界'
        case 2:
          return '其他营业部边界'
        case 3:
          return '其他营业所边界'
        default:
          return ''
      }
    }
  },
  methods: {
    // filterNode(value, data) {
    //   if (!value) return true
    //   return data.regionName.indexOf(value) !== -1
    // },
    setmap(map) {
      this.AMap = map
      this.AMap.on('click', (e) => {
        console.log(e)
        let lnglat = [e.lnglat.lng, e.lnglat.lat]
        this.getRegionName(lnglat)
      })
    },
    getOrgParentBorder() {
      let url = '/api/boundary/orgstyle/getCurrentOrg'
      this.$fetch
        .get(url, { orgId: this.parentOrgId, isLoading: false })
        .then((res) => {
          if (res.code == 200) {
            if (res.data && res.data[0].gdBoundarJson) {
              res.data[0].id = res.data[0].orgId
              this.drawOrganizeBorder(res.data[0], true, false)
            } else {
              //绘制父级边界数据进行定位时，父级没有边界数据，就通过自身边界数据进行地图定位
              this.getOrgBorder()
            }
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            })
          }
        })
    },
    getOrgBorder() {
      let url = '/api/boundary/orgstyle/getCurrentOrg'
      this.$fetch
        .get(url, { orgId: this.orgId, isLoading: false })
        .then((res) => {
          if (res.code == 200) {
            if (res.data[0].gdBoundarJson) {
              res.data[0].id = res.data[0].orgId
              res.data[0].borderColor = '#00000000'
              this.drawOrganizeBorder(res.data[0], true, false)
            }
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            })
          }
        })
    },
    //点击位置通过高德获取位置信息再通过接口获取行政信息 进行地图的绘制，
    getRegionName(lnglat) {
      let geocoder = new AMap.Geocoder({
        city: '010', //城市设为北京，默认：“全国”
        radius: 1000 //范围，默认：500
      })
      geocoder.getAddress(lnglat, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          this.getRegioninfo(result.regeocode.addressComponent, lnglat)
        } else {
          console.log('根据经纬度查询地址失败')
        }
      })
    },
    // 根据行政名称查询行政数据
    getRegioninfo(info, lnglat) {
      console.log(info)
      let regionLevel = ''
      let regionName = ''
      let parentRegionName = ''
      console.log(lnglat)
      let lngLat = {
        type: 'Point',
        coordinates: lnglat
      }
      // 1、公司 2、部门 3、所
      switch (this.orgType) {
        case 1:
          regionLevel = 3 //市
          regionName = info.district ? info.district : info.city
          parentRegionName = info.city
          if (info.province == '上海市') {
            parentRegionName = '上海市'
          }
          break
        case 2:
          regionLevel = 4 //街道
          regionName = info.township
          parentRegionName = info.district //区的名字
          break
        case 3:
          regionLevel = 4 //街道
          regionName = info.township
          parentRegionName = info.district //区的名字
          break
        default:
          regionLevel = 1 //省
          regionName = info.province
      }
      console.log(JSON.stringify(lngLat))
      let url = '/api/boundary/orgregion/regionBoundarByName'
      this.$fetch
        .post(url, {
          regionName: regionName,
          regionLevel: regionLevel,
          parentRegionName: parentRegionName,
          orgType: this.orgType ? this.orgType : 0,
          orgId: this.orgId,
          lngLat: JSON.stringify(lngLat)
        })
        .then((res) => {
          if (res.code == 200) {
            if (res.data.hasOrg == 1 && res.data.orgName != this.orgName) {
              this.$message({
                message: `${regionName}已属于${res.data.orgName}`,
                type: 'warning'
              })
              return
            }
            for (let i in this.treeChild) {
              if (this.treeChild[i].regionCode == res.data.regionCode) {
                this.treeChild[i].color = this.orgColor
                this.treeChild[i].opacity = this.orgOpacity
                this.drawIds.push(this.treeChild[i].regionCode)
                this.$refs.tree.setCheckedKeys(this.drawIds)
                this.drawOrganizeColor(this.treeChild[i])
              }
            }
          }
        })
    },
    //点击取消按钮，从哪个页面进来就回哪个页面
    setBackRoute() {
      if (this.$route.query.type == 'list') {
        this.backRoute = `/organize-boundaries/organize-list`
      } else if (this.$route.query.type == 'detail') {
        this.backRoute = `/organize-boundaries/organize-detail?orgId=${this.backId}&orgName=${this.$route.query.backName}`
      }
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
                this.drawOrganizeColor(data[i], false, false, 8)
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
    //获取城市区域级联数据
    getCascader(isLoading) {
      let regionIds = this.$refs.tree.getCheckedKeys()
      if (regionIds.length == 0) {
        this.cascaderData = []
        return
      }
      let url = '/api/boundary/region/list'
      this.$fetch
        .post(url, {
          isLoading: isLoading,
          regionCodes: regionIds.toString()
        })
        .then((res) => {
          if (res.code == 200) {
            this.cascaderData = res.data
          }
        })
    },
    //获取行政树
    getTree() {
      let url = '/api/boundary/region/getRegionByOrgId'
      // if (this.orgType == 3) {
      //   url = '/api/boundary/region/getRegionByPlaceOrgId'
      // } else {

      // }
      this.$fetch
        .get(url, {
          orgId: this.orgId,
          orgLevel: this.orgType
        })
        .then((res) => {
          if (res.code == 200 && res.data) {
            console.log(res.data)
            this.treeChild = []
            this.$set(this, 'treeData', res.data.treeList)
            this.$refs.tree.setCheckedKeys(res.data.seteds)
            this.getTreeChild(this.treeData, 'treeChild')
            console.log(this.treeChild)
            //绘制出所有末节点的边界 方便反选
            for (let i in this.treeChild) {
              if (this.treeChild[i].seted) {
                this.treeChild[i].color = this.orgColor
                this.treeChild[i].opacity = this.orgOpacity
                this.drawIds.push(this.treeChild[i].regionCode)
                this.drawOrganizeColor(this.treeChild[i], false)
              }
            }
            setTimeout(() => {
              this.getCascader(true)
            }, 100)
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
    //获取展示样式
    getOrgStyle(data) {
      console.log(data)
      this.orgColor = data.color
      this.iconType = data.icon
      this.orgOpacity = data.opacity / 100
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
            this.area = [
              '010000',
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
            this.isSpecific = res.data.isSpecific
            this.address = res.data.address
            this.parentOrgId = res.data.parentOrgId
            this.orgType = res.data.orgType
            let obj = {
              id: this.orgId,
              gdLng: res.data.gdLng,
              gdLat: res.data.gdLat,
              iconType: this.iconType,
              orgName: this.orgName
            }
            this.getTree()
            this.getOrgParentBorder()
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
    cascaderVis(val) {
      if (val) {
        this.getCascader(true)
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
    //复选框被点击的时候
    handleCheckChange(data) {
      let index = this.$refs.tree.getHalfCheckedKeys().indexOf(data.regionCode)
      this.checkChild = []
      let checkedNode = this.$refs.tree.getNode(data.regionCode).checked //当前点击节点的node对像
      if (checkedNode || index > -1) {
        //选中
        if (data.regions && data.regions.length > 0) {
          //选择的节点存在子节点，只处理子节点
          // 返回选中自己中没有绘制过的数组
          this.getTreeChild(data.regions, 'checkChild')
          let newArr = this.checkChild.filter((item) => {
            return !this.drawIds.includes(item.regionCode)
          })
          for (let i in newArr) {
            newArr[i].color = this.orgColor
             newArr[i].opacity = this.orgOpacity
            this.drawIds.push(newArr[i].regionCode)
            this.drawOrganizeColor(newArr[i])
          }
        } else {
          //否则只绘制选中节点本身
          data.color = this.orgColor
          data.opacity = this.orgOpacity
          this.drawIds.push(data.regionCode)
          this.drawOrganizeColor(data)
        }
      } else {
        //取消选中
        if (data.regions && data.regions.length > 0) {
          //如果取消节点存在子节点，只取消选中的子节点
          this.clearTreeChild(data.regions)
        } else {
          //清除地图
          //将取消绘制的节点 从之前储存的ids中去除
          let index = this.drawIds.indexOf(data.regionCode)
          if (index > -1) {
            this.drawIds.splice(index, 1)
          }
          this.clearMapColor(data.regionCode)
        }
      }
    },
    clearTreeChild(data) {
      for (let x in data) {
        if (data[x].regions && data[x].regions.length > 0) {
          //有子集
          this.clearTreeChild(data[x].regions)
        } else {
          let index = this.drawIds.indexOf(data[x].regionCode)
          if (index > -1) {
            this.drawIds.splice(index, 1)
          }
          this.clearMapColor(data[x].regionCode)
        }
      }
    },
    //获取tree末节点数据
    getTreeChild(data, name) {
      for (let x in data) {
        if (data[x].regions && data[x].regions.length > 0) {
          //有子集
          this.getTreeChild(data[x].regions, name)
        } else {
          if (!data[x].oseted) {
            this[name].push(data[x])
          }
        }
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
    drawOrganizeColor(
      option,
      isSetFitView = true,
      isCallBack = true,
      zIndex = 10
    ) {
      option.id = option.id ? option.id : option.regionCode
      option.color = option.color ? option.color : '#FF9D9D'
      option.fillColorOpacity = option.opacity ? option.opacity : 50
      let obj = {
        data: [option],
        zIndex: zIndex,
        bubble: false,
        callBack: (target, info) => {
          if (isCallBack) {
            this.ColorCallBack(target, info)
          }
        }
      }
      let mapOgj = this.$refs.map.drawColors(obj)
      this.MapColor.set(option.id, mapOgj)
      if (this.orgType != 3 && isSetFitView) {
        this.AMap.setFitView(mapOgj.PolygonArr)
      }
    },
    ColorCallBack(target, info) {
      let style = {
        'border-width': 0,
        'text-align': 'center',
        'font-size': '12px',
        padding: '5px 10px',
        'font-weight': '400',
        color: '#ffffff',
        // 'text-shadow': '#FFF 1px 0 0,#FFF 0 1px 0,#FFF -1px 0 0,#FFF 0 -1px 0',
        'font-family':
          'MicrosoftYaHei, Microsoft YaHei Normal, Microsoft YaHei',
        'background-color': '#00000080'
      }
      //点击地图，清除绘制
      target.on('click', () => {
        this.clearMapName(info.regionCode)
        let index = this.drawIds.indexOf(info.regionCode)
        if (index > -1) {
          this.drawIds.splice(index, 1)
        }
        this.clearMapColor(info.regionCode)
        this.$refs.tree.setCheckedKeys(this.drawIds)
      })
      //鼠标经过
      target.on('mouseover', (e) => {
        this.clearMapName(info.id)
        this.drawOrganizeName(
          {
            gdLng: e.lnglat.getLng(),
            gdLat: e.lnglat.getLat(),
            name: info.regionName,
            id: info.regionCode
          },
          style
        )
      })
      target.on('mouseout', () => {
        this.clearMapName(info.id)
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
    drawOrganizeBorder(option, isSetFitView = false, iscallback = true) {
      option.id = option.id ? option.id : option.regionCode
      option.borderColor = option.borderColor ? option.borderColor : '#000000'
      option.borderWidth = '1'
      option.borderColorOpacity = 1
      let _this = this
      let obj = {
        data: [option],
        zIndex: 9,
        bubble: true,
        callBack: function (target, info) {
          if (iscallback) {
            _this.borderCallBack(target, info)
          }
        }
      }
      let mapOgj = this.$refs.map.drawBorders(obj)
      if (isSetFitView) {
        this.AMap.setFitView(mapOgj.PolygonArr)
      }
      this.MapBorder.set(option.id, mapOgj)
    },
    borderCallBack(target, info) {
      let _this = this
      let style = {
        'border-width': 0,
        'text-align': 'center',
        'font-size': '12px',
        padding: '5px 10px',
        'font-weight': '400',
        color: '#ffffff',
        // 'text-shadow': '#FFF 1px 0 0,#FFF 0 1px 0,#FFF -1px 0 0,#FFF 0 -1px 0',
        'font-family':
          'MicrosoftYaHei, Microsoft YaHei Normal, Microsoft YaHei',
        'background-color': '#00000080'
      }
      //点击地图，清除绘制
      target.on('click', function () {
        info.color = _this.orgColor
        _this.drawIds.push(info.regionCode)
        _this.$refs.tree.setCheckedKeys(_this.drawIds)
        _this.drawOrganizeColor(info)
        // _this.getCascader()
      })
      //鼠标经过
      target.on('mouseover', function (e) {
        _this.clearMapName(info.id)
        _this.drawOrganizeName(
          {
            gdLng: e.lnglat.getLng(),
            gdLat: e.lnglat.getLat(),
            name: info.regionName,
            id: info.regionCode
          },
          style
        )
      })
      target.on('mouseout', function () {
        _this.clearMapName(info.id)
      })
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
    setBorder() {
      let regionIds = this.$refs.tree.getCheckedKeys(true)
      let url = '/api/boundary/region/editOrgRegion'
      console.log(regionIds)
      // let
      this.$fetch
        .post(url, {
          orgId: this.orgId,
          orgName: this.orgName,
          regionCodes: regionIds,
          orgType: this.orgType
        })
        .then((res) => {
          if (res.code == 200) {
            // this.successNum += 1
            this.AMap.clearMap()
            this.$refs.style.getStyle(this.orgId, this.orgType)
          }
        })
        .catch((error) => {
          console.log(error.message)
        })
    },
    setArea() {
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
            // this.$router.replace(this.backRoute)
          }
        })
        .catch((error) => {
          console.log(error.message)
        })
    },
    submit() {
      this.setBorder()
      this.setArea()
      this.$refs.style.submitStyle()
    },
    iconChange(iconType) {
      console.log(iconType)
      this.iconType = iconType
      let obj = {
        id: this.orgId,
        gdLng: this.gdLng,
        gdLat: this.gdLat,
        iconType: this.iconType
      }
      this.clearMapIcon(this.orgId)
      this.drawOrganizeIcon(obj)
    },
    
    colorChange(color, opacityVal) {
      let data = this.$refs.tree.getCheckedNodes()
      this.orgOpacity = opacityVal / 100
      let list=[]
      if (this.orgType == '0') {
        list = data.filter((item) => item.regionLevel == '1')
      } else if (this.orgType == '1') {
        list = data.filter((item) => item.regionLevel == '3')
      } else if (this.orgType == '2') {
        list = data.filter((item) => item.regionLevel == '4')
      } else if (this.orgType == '3') {
        list = data.filter((item) => (item.regionLevel == '4'&&!item.regions)||item.regionLevel == '5')
      }
      this.orgColor = color
      for (let i in list) {
        list[i].color = this.orgColor
        list[i].opacity = this.orgOpacity
        // list[i].fillColorOpacity=opacityVal/100

        this.clearMapColor(list[i].regionCode)
        this.drawOrganizeColor(list[i], false)
      }
    },
    styleBack() {
      // this.successNum += 1
    },
    goback() {
      this.$router.replace(this.backRoute)
    },
    //组织边界调整
    goAdjust() {
      this.$router.push(
        `/organize-boundaries/organize-adjust?orgId=${this.orgId}&orgName=${this.orgName}`
      )
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
