<template>
  <div class="ob-index">
    <div class="mainBox" :class="leftShow ? 'show' : ''">
      <div class="titleBox">
        <svg class="icon" aria-hidden="true" @click="leftShow = !leftShow">
          <use xlink:href="#iconicon_map_leftboard_shouqi" />
        </svg>
        商圈设置/商圈调整
      </div>
      <div style="padding: 0 15px">
        <div class="selectBox">
          <div style="width: 210px">
            <el-input
              class="smart_input_deep"
              v-model="orgName1"
              size="small"
              disabled
            ></el-input>
          </div>
          <div style="width: 210px">
            <el-input
              class="smart_input_deep"
              v-model="orgName2"
              size="small"
              disabled
            ></el-input>
            <!-- <el-select class="smart_select_deep" v-model="orgObj2" placeholder="请选择" size="small" style="width:100%" value-key="orgId" @change="selectChange">
            <el-option
              v-for="item in options"
              :key="item.orgId"
              :label="item.orgName"
              :value="item">
            </el-option>
          </el-select> -->
          </div>
        </div>
        <div class="tree_transfer_deep">
          <tree-transfer
            :from_data="fromData"
            :to_data="toData"
            :defaultProps="defaultProps"
            @add-btn="add"
            @remove-btn="remove"
            :mode="mode"
            :pid="pid"
            :node_key="node_key"
            height="540px"
            filter
          ></tree-transfer>
        </div>
        <div class="btnBox">
          <el-button class="backBtn" size="small" @click="goBack"
            >取消</el-button
          >
          <el-button class="setBtn" type="primary" size="small" @click="submit" v-auth="'business:layout:adjust:save'"
            >调整完成</el-button
          >
        </div>
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
import treeTransfer from 'el-tree-transfer' // 引入
import MapCOMP from '@/components/Map.vue'
export default {
  name: 'organizeAdjust',
  title() {
    return ''
  },
  components: {
    MapCOMP,
    treeTransfer
  },
  data() {
    return {
      leftShow: true,
      orgName1: '',
      orgName2: '',
      id1: '',
      id2: '',
      firstRegionCodes: [],
      secondRegionCodes: [],
      searchName: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      AMap: '',
      MapColor: new Map(),
      MapBorder: new Map(),
      MapIcon: new Map(),
      MapName: new Map(),
      mode: 'transfer', // transfer addressList
      pid: 'parentId',
      node_key: 'id',
      fromData: [],
      toData: [],
      fromIds: [],
      toDataIds: [],
      backRoute: ''
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   console.log(to)
  //   console.log(from)
  //   next((vm) => {
  //     vm.backRoute = from.fullPath
  //     // 通过 `vm` 访问组件实例  设置tab标签
  //     vm.$store.commit('addTabs', {
  //       title: `商圈调整`,
  //       link: `/business-district/adjust?id1=${vm.$route.query.id1}&id2=${vm.$route.query.id2}`,
  //       on: false,
  //       needCatch: true
  //     })
  //   })
  // },
  created() {},
  mounted() {
    this.id1 = this.$route.query.id1
    this.id2 = this.$route.query.id2
    this.getFromData()
    // this.getArea(this.orgId1,this.orgName1)
    // this.$store.dispatch('map/setSearchType', ['map'])
    this.$store.dispatch('map/setMapOrganization', false)
    this.$store.dispatch('map/setMapSearchIcon', false)
  },
  watch: {
    //路由不发生变化，只是路由的参数发生变化，导致页面不会请求数据，通过监听出发请求
    // $route: function (to, from) {
    //   console.log(this.$route)
    //   if (to.name == 'OrganizeAdjust' && to.fullPath !== from.fullPath) {
    //     this.drawIds = []
    //     this.orgId = this.$route.query.orgId
    //     this.orgName = this.$route.query.orgName
    //     this.AMap.clearMap()
    //     this.getFromData()
    //     // this.getArea(this.orgId1,this.orgName1)
    //   }
    // }
  },
  methods: {
    setmap(map) {
      this.AMap = map
    },
    getFromData() {
      let url = '/api/business/grading/comparison/region/list'
      this.$fetch
        .get(url, { firstBusinessNo: this.id1, secondBusinessNo: this.id2 })
        .then((res) => {
          if (res.code == 200) {
            console.log(res)
            // this.fromData=res.data
            this.$set(
              this,
              'fromData',
              res.data.firstOrgRegionVO.orgRegionVO
                ? res.data.firstOrgRegionVO.orgRegionVO
                : []
            )
            this.$set(this, 'orgName1', res.data.firstOrgRegionVO.bussinessName)
            this.$set(
              this,
              'toData',
              res.data.secondOrgRegionVO.orgRegionVO
                ? res.data.secondOrgRegionVO.orgRegionVO
                : []
            )
            this.$set(
              this,
              'orgName2',
              res.data.secondOrgRegionVO.bussinessName
            )
            this.getTreeChild(this.fromData, 'firstRegionCodes')
            this.getTreeChild(this.toData, 'secondRegionCodes')
            this.clearMapColor(this.orgId1)
            this.clearMapName(this.orgId1)
            this.clearMapIcon(this.orgId1)
            // this.getArea(this.orgId1,this.orgName1)
            this.getOrgGeo()
            this.drawOrganizeName({
              name: this.orgName1,
              gdLat: res.data.firstOrgRegionVO.gdLat,
              gdLng: res.data.firstOrgRegionVO.gdLng
            })
            this.drawOrganizeName({
              name: this.orgName2,
              gdLat: res.data.secondOrgRegionVO.gdLat,
              gdLng: res.data.secondOrgRegionVO.gdLng
            })
          }
        })
    },
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log('fromData:', fromData)
      console.log('toData:', toData)
      console.log('obj左:', obj)
      this.firstRegionCodes = []
      this.secondRegionCodes = []
      this.getTreeChild(fromData, 'firstRegionCodes')
      this.getTreeChild(toData, 'secondRegionCodes')
      this.clearMapColor(this.id1)
      this.clearMapColor(this.id2)
      this.getOrgGeo()
    },
    // 监听穿梭框组件移除
    remove(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log('fromData:', fromData)
      console.log('toData:', toData)
      console.log('obj右:', obj)
      this.firstRegionCodes = []
      this.secondRegionCodes = []
      this.getTreeChild(fromData, 'firstRegionCodes')
      this.getTreeChild(toData, 'secondRegionCodes')
      this.clearMapColor(this.id1)
      this.clearMapColor(this.id2)
      this.getOrgGeo()
    },
    //获取tree末节点数据
    getTreeChild(data, name) {
      for (let x in data) {
        if (data[x].children && data[x].children.length > 0) {
          //有子集
          this.getTreeChild(data[x].children, name)
        } else {
          this[name].push(data[x].id)
        }
      }
    },
    getOrgGeo() {
      console.log(this.firstRegionCodes)
      console.log(this.secondRegionCodes)
      let url = '/api/business/grading/comparison/merge/region'
      this.$fetch
        .post(url, {
          firstBusinessNo: this.id1,
          firstRegionCodes: this.firstRegionCodes,
          secondBusinessNo: this.id2,
          secondRegionCodes: this.secondRegionCodes
        })
        .then((res) => {
          if (res.code == 200) {
            let obj1 = {
              id: this.id1,
              gdBoundarJson: res.data.firstBoundarVO.gdBoundarJson,
              color: res.data.firstBoundarVO.proColor,
              fillColorOpacity:res.data.firstBoundarVO.proDiaphaneity?res.data.firstBoundarVO.proDiaphaneity:0.8,
            }
            let obj2 = {
              id: this.id2,
              gdBoundarJson: res.data.secondBoundarVO.gdBoundarJson,
              color:  res.data.secondBoundarVO.proColor,
              fillColorOpacity:res.data.secondBoundarVO.proDiaphaneity?res.data.secondBoundarVO.proDiaphaneity:0.8,
            }
            this.drawOrganizeColor(obj1)
            this.drawOrganizeColor(obj2)
          }
        })
    },
    //获取组织位置详细信息
    getArea(orgId, orgName) {
      // let _this=this
      let url = '/api/boundary/org/getGtmOrgDetailByOrgId'
      // let
      this.$fetch
        .get(url, {
          isLoading: false,
          orgId: orgId
        })
        .then((res) => {
          if (res.code == 200) {
            this.orgType = res.data.orgType
            let obj = {
              id: orgId,
              gdLng: res.data.gdLng,
              gdLat: res.data.gdLat,
              iconType: this.iconType,
              orgName: orgName
            }
            if (res.data.gdLng && res.data.gdLat) {
              console.log(obj)
              this.drawOrganizeIcon(obj)
              this.drawOrganizeName(obj)
            }
          }
        })
        .catch((error) => {
          console.log(error.message)
        })
    },
    drawOrganizeColor(option) {
      console.log(option)
      let obj = {
        data: [option]
      }
      let mapOgj = this.$refs.map.drawColors(obj)
      this.MapColor.set(option.id, mapOgj)
      this.AMap.setFitView(mapOgj.PolygonArr)
    },
    drawOrganizeIcon(option) {
      console.log(option)
      let obj = {
        data: [option]
      }
      let data = this.$refs.map.drawIcons(obj)
      this.MapIcon.set(option.id, data)
    },
    drawOrganizeName(option, style) {
      option.name = option.name ? option.name : option.orgName
      let sty = style
        ? style
        : {
            'border-width': 0,
            'text-align': 'center',
            'font-size': '13px',
            'font-weight': '400',
            color: '#000000',
            'text-shadow': '#FFF 1px 0 0,#FFF 0 1px 0,#FFF -1px 0 0,#FFF 0 -1px 0',
            'font-family':
              'MicrosoftYaHei, Microsoft YaHei Normal, Microsoft YaHei',
            'background-color': '#f0f8ff00',
            width: '200px',
            'overflow:': 'hidden',
            'text-overflow': 'ellipsis',
            'word-break': 'break-all',
            display: '-webkit-box',
            '-webkit-line-clamp': '2',
            /*! autoprefixer: off */
            '-webkit-box-orient': 'vertical',
            
            'white-space': 'normal'
          }
      let obj = {
        data: [option],
        style: sty
      }
      let data = this.$refs.map.drawNames(obj)
      this.MapName.set(option.id, data)
    },
    clearMapColor(id) {
      let _this = this

      let obj = this.MapColor.get(id)
      if (obj) {
        if (obj.backColorPolygonArr) {
          obj.backColorPolygonArr.forEach((item) => {
            _this.AMap.remove(item.geojson)
          })
        }
        this.MapColor.delete(id)
      }
    },
    clearMapIcon(id) {
      let _this = this
      let obj = this.MapIcon.get(id)
      if (obj) {
        obj.forEach((item) => {
          _this.AMap.remove(item.marker)
        })
        this.MapIcon.delete(id)
      }
    },
    clearMapName(id) {
      let _this = this
      let obj = this.MapName.get(id)
      if (obj) {
        obj.forEach((item) => {
          _this.AMap.remove(item.text)
        })
        this.MapName.delete(id)
      }
    },
    submit() {
      let url = '/api/business/grading/comparison/update/region'
      // let
      this.$fetch
        .post(url, {
          regionFirstDto: {
            businessNo: this.id1,
            regionCodes: this.firstRegionCodes
          },
          regionSecondDto: {
            businessNo: this.id2,
            regionCodes: this.secondRegionCodes
          }
        })
        .then((res) => {
          if (res.code == 200) {
            console.log(res)
            this.AMap.clearMap()
            this.goBack()
          }
        })
        .catch((error) => {
          console.log(error.message)
        })
    },
    goBack() {
      this.$store.dispatch('map/setSearchType', ['map', 'org', 'business_store'])
      this.$store.dispatch('map/setMapOrganization', true)
      this.$store.commit('businessPreview/SET_OPERATION_CODE', '')
      window.history.go(-1)
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
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
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
  font-size: 15px;
  padding: 0 15px;
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
    width: 510px;
    display: flex;
  }
  .selectBox {
    display: flex;
    justify-content: space-between;
    padding: 18px 0;
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
  padding: 0 12px;
  flex: 1;
  overflow: auto;
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
    width: 189px;
    &:hover {
      background-color: #41598280;
    }
  }
  .setBtn {
    width: 189px;
    margin-left: 20px;
  }
}
</style>
