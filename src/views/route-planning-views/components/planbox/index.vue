<template>
  <div class="planbox">
    <div class="plantitle">
      {{ PlanName || '暂无计划名称' }}-{{ orgName || '暂无营业所' }}
      <el-select
        class="smart_select_deep"
        size="mini"
        width="100px"
        v-model="weekValue"
        placeholder="请选择"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="areabox">
      <div class="listbox" v-if="treeData.length > 0">
        <span
          v-for="(item, idx) in treeData"
          :key="idx"
          :class="item.id == nowPostId ? 'nameItem' : ''"
          @click="getGeneration(item.id)"
        >
          {{ item.name }}
        </span>
      </div>
      <div class="listbox" v-else-if="treeData.length < 1">
        <span>
          暂无业代数据
        </span>
      </div>
      <div v-for="(item, idx) in treeData" :key="idx">
        <div
          v-if="item.id === nowPostId && item.children.length > 0"
          class="itembox"
        >
          <span v-for="(childitem, childidx) in item.children" :key="childidx">
            <el-checkbox
              class="nav_check"
              v-model="childitem.checked"
              @change="onClickData(childitem)"
            ></el-checkbox>
            <div
              class="nav_icon"
              :style="getColor(childitem.color, 'border')"
              v-show="childitem.color"
            >
              <p
                class="nav_icon"
                :style="getColor(childitem.color, 'area')"
              ></p>
            </div>
            {{ childitem.name
            }}{{ childitem.person ? '(' + childitem.person + ')' : '' }}
          </span>
        </div>
        <div
          v-if="item.id === nowPostId && item.children.length < 1"
          class="itembox"
        >
          <span>此业代暂无区域数据</span>
        </div>
      </div>
    </div>
    <div :id="boxcontainer" class="container"></div>
    <div>
      <PlanLegend
        :pointVal="pointVal"
        @getpointChange="getpointChange"
        @getlinstyleChange="getlinstyleChange"
      />
      <PlanviewData
        v-if="showOverview"
        :PlanId="PlanId"
        :NowWeek="weekValue"
        :nowPostId="nowPostId"
        :isPlan="isPlan"
        :isHistory="isHistory"
        type="comparisonPlan"
        @getShowOverview="getShowOverview"
      ></PlanviewData>
    </div>
  </div>
</template>
<script>
import { AMap } from '@/plugins/AMap'
import PlanLegend from './PlanLegend' // 图例组件
import PlanviewData from './PlanviewData' // 数据总览
import Api from '@api/route/planpreview_api.js'
export default {
  name: 'index',
  props: [
    'PlanId',
    'PlanName',
    'showOverview',
    'container',
    'isPlan',
    'isHistory'
  ],
  components: {
    PlanviewData,
    PlanLegend
  },
  data() {
    return {
      viewShow: null,
      areadata: null,
      boxcontainer: '',
      changeConstruc: new Map(),
      treeData: [],
      nowPostId: null,
      mapObj: null,
      orgName: null,
      orgGeom: {},
      options: [
        {
          value: '1',
          label: '第一周'
        },
        {
          value: '2',
          label: '第二周'
        },
        {
          value: '3',
          label: '第三周'
        },
        {
          value: '4',
          label: '第四周'
        }
      ],
      weekValue: '1',
      newIdArr: [],
      massBox: new Map(), //区域点位
      scaleBox: new Map(), //客户规模点位
      serviceBox: new Map(), //服务日点位
      getNowRouter: true,
      pointVal: 0,
      newrouteStyle: '直线'
    }
  },
  watch: {
    pointVal(newval) {
      this.drawMpaData(newval)
    },
    weekValue(newval) {
      this.drawMpaData(newval)
    },
    nowPostId(newval) {
      this.drawMpaData(newval)
    },
    newrouteStyle(newval) {
      this.drawMpaData(newval)
    }
  },
  mounted() {
    this.viewShow = this.showOverview
    this.boxcontainer = this.container
    setTimeout(() => {
      this.CreatMap()
    }, 1000)
  },
  methods: {
    // 构造地图容器
    CreatMap() {
      let _this = this
      let mapObj = new AMap.Map(this.boxcontainer, {
        resizeEnable: true, //自适应大小
        // zoomEnable: false, //禁止缩放
        // dragEnable: false, //禁止拖拽
        zoom: 15 //初始视窗
      })
      this.mapObj = mapObj
      mapObj.on('complete', function() {
        _this.getRouteOrg()
        _this.getRoutePosition()
      })
    },
    // 获取所有业代及包含的区域
    getRouteOrg() {
      // ******调用接口获取组织架构
      Api.get_route_org({
        programId: this.PlanId,
        isPlan: this.isPlan,
        isHistory: this.isHistory,
        isLoading: false
      })
        .then(res => {
          // let newprogramName, newstoreDate
          if (res.code === '200' && res.data) {
            const { orgId, orgName, gdGeom, color } = res.data
            const newcolor = color || '#000'
            this.orgId = orgId
            this.orgName = orgName
            this.orgGeom = { gdGeom, newcolor }
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

    // ******调用接口返回业代结构
    async getRoutePosition() {
      await Api.get_route_position({
        programId: this.PlanId,
        areaId: '',
        isPlan: this.isPlan,
        isOpen: true,
        isHistory: this.isHistory,
        isLoading: false
      })
        .then(async res => {
          if (res.code === '200') {
            let treeData = []
            const allData = await res.data
            if (allData && allData.length > 0) {
              const newData = allData.filter(item => item.routeStatus === '2')
              newData &&
                newData.length > 0 &&
                newData.forEach((item, index) => {
                  const { jobId, jobName, areaList, routeStatus } = item
                  if (jobId && jobName && routeStatus === '2') {
                    if (index == 0) {
                      this.nowPostId = jobId
                    }
                    let childrenlist = []
                    if (areaList && areaList.length > 0) {
                      childrenlist[0] = {
                        name: '全部业代', // 区域名称
                        id: '全部业代',
                        jobId,
                        checked: true
                      }
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
                        const newareaitem = {
                          name: areaName, // 区域名称
                          id: areaId,
                          color: areaColor,
                          person: saleName, // 业代名称
                          jobId,
                          jobName,
                          routeStatus,
                          saleId,
                          areaId,
                          lng,
                          lat,
                          areaGeom,
                          checked: true
                        }
                        childrenlist.push(newareaitem)
                        this.changeConstruc.set(jobId, { childrenlist })
                      })
                    }
                    const newitem = {
                      id: jobId,
                      name: jobName,
                      children: childrenlist
                    }
                    treeData.push(newitem)
                  }
                })
            }
            this.treeData = treeData
            setTimeout(() => {
              this.drawMpaData()
            }, 0)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // ******调用接口获取路线和门店数据
    async getAllRoutes(itemidArr) {
      if (!this.getNowRouter) {
        return
      }
      if (itemidArr.length > 0) {
        this.getNowRouter = false
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.35)'
        })
        let params
        let idArr = itemidArr.toString()
        params = {
          areaId: idArr,
          visitWeek: this.weekValue,
          isHistory: this.isHistory,
          isLoading: false
        }
        await Api.get_all_routes(params)
          .then(async res => {
            loading.close()
            this.getNowRouter = true
            if (res.code === '200') {
              const allData = await res.data
              if (allData && allData.length > 0) {
                this.getLinedata(allData)
              } else {
                this.$message({
                  message: res.extData
                })
              }
            }
          })
          .catch(err => {
            this.getNowRouter = true
            loading.close()
            console.log(err)
          })
      }
    },

    // 处理与图例拜访日联动的路线数据
    getLinedata(data) {
      const routeVisit = ['1', '2', '3', '4', '5', '6', '7']
      data.forEach(item => {
        const { areaId, areaRouteDetail } = item
        let weekDay = []
        areaRouteDetail &&
          routeVisit.forEach(item => {
            const newData = areaRouteDetail.filter(
              Detail => Detail.serviceDay === item
            )
            if (newData.length > 0) {
              const {
                routeGeom,
                routLineGeom,
                serviceDay,
                storeList
              } = newData[0]
              //  routLineGeom 路线Geom(直线)   routeGeom 曲线
              if ((routLineGeom || routeGeom) && serviceDay) {
                //   路线颜色
                const routLineColor = [
                  '#C50404',
                  '#2716C4',
                  '#4C8C06',
                  '#4A90E2',
                  '#007D86',
                  '#83562E',
                  '#D0A052'
                ]
                let newlineData
                if (this.newrouteStyle === '直线') {
                  newlineData = routLineGeom
                } else if (this.newrouteStyle === '曲线') {
                  newlineData = routeGeom
                }
                this.manageGeojson(
                  newlineData,
                  routLineColor[Number(serviceDay) - 1]
                )
              }
              let newstoreList = storeList.filter(
                item =>
                  item.storeLat &&
                  item.storeLng &&
                  item.rate &&
                  item.serviceDay &&
                  item.serviceDayStr &&
                  item.areaColor
              )
              if (newstoreList.length > 0) {
                weekDay.push(newstoreList)
              }
              setTimeout(() => {
                const nodata = storeList.filter(
                  item =>
                    !item.storeLat ||
                    !item.storeLng ||
                    !item.rate ||
                    !item.serviceDay ||
                    !item.serviceDayStr ||
                    !item.storeScaleId ||
                    !item.areaColor
                )
                if (nodata.length > 0) {
                  console.log('有空值点位', nodata[0])
                }
              }, 0)
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
          })
        if (weekDay.length > 0) {
          this.weekDay = weekDay
          this.getWeekDay(this.pointVal, areaId)
        }
      })
    },

    // 监听图例数据
    getWeekDay(value, id) {
      // pointVal 图例点位 // jobLayer 岗位图层 // routeVisit 路线拜访日 // routeStyle) 路线样式
      if (this.weekDay.length > 0) {
        const newData = this.weekDay.reduce((prev, cur) => {
          const moreArr = [].concat(cur).some(Array.isArray) //判断cur是不是一个数组
          return prev.concat(moreArr ? cur.flatten() : cur)
        })
        let newColorList
        let Dotstyle = []
        if (newData.length > 0) {
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
                    anchor: new AMap.Pixel(9, 9),
                    size: new AMap.Size(18, 18)
                  })
                })
                newData.forEach(item => {
                  item.lnglat = [Number(item.storeLng), Number(item.storeLat)]
                  item.name = item.storeName
                  item.style = newColorList.indexOf(item.areaColor)
                })
                const mass = new AMap.MassMarks(newData, {
                  opacity: 1,
                  zIndex: 111,
                  style: Dotstyle
                })
                mass.setMap(this.mapObj)
                this.massBox.set(id, mass)
              }
              break
            case 1:
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
                    url: require('@assets/img/serviceday/' +
                      item +
                      '_circle.png'),
                    anchor: new AMap.Pixel(9, 9),
                    size: new AMap.Size(18, 18)
                  })
                  Dotstyle.push({
                    url: require('@assets/img/serviceday/' +
                      item +
                      '_fang.png'),
                    anchor: new AMap.Pixel(9, 9),
                    size: new AMap.Size(18, 18)
                  })
                  Dotstyle.push({
                    url: require('@assets/img/serviceday/' +
                      item +
                      '_sanjiao.png'),
                    anchor: new AMap.Pixel(14, 13),
                    size: new AMap.Size(28, 26)
                  })
                })
                Dotstyle.push({
                  url: require('@assets/img/serviceday/#666666_weiguihua.png'),
                  anchor: new AMap.Pixel(9, 9),
                  size: new AMap.Size(18, 18)
                })
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
                const mass = new AMap.MassMarks(newData, {
                  opacity: 1,
                  zIndex: 111,
                  style: Dotstyle
                })
                mass.setMap(this.mapObj)
                this.serviceBox.set(id, mass)
              }
              break
            default:
              break
          }
        }
      }
    },

    // 选择单选框显示区域，点位和线
    onClickData(item) {
      if (item.id === '全部业代') {
        const data = this.treeData.filter(netiem => netiem.id == item.jobId)
        data[0].children.forEach(dataitem => {
          dataitem.checked = item.checked
        })
      } else if (item.id !== '全部业代') {
        if (!item.checked) {
          const data = this.treeData.filter(netiem => netiem.id == item.jobId)
          data[0].children.forEach(dataitem => {
            if (dataitem.id === '全部业代') {
              dataitem.checked = item.checked
            }
          })
        }
      }
      this.drawMpaData()
    },
    // 绘制边界和区域
    drawMpaData() {
      this.mapObj.clearMap()
      this.manageGeojson(this.orgGeom.gdGeom, this.orgGeom.newcolor, 0)
      let _this = this
      const newData = this.changeConstruc.get(this.nowPostId)
      this.newIdArr = []
      if (newData) {
        const allData = newData.childrenlist.filter(
          item => item.id !== '全部业代'
        )
        allData.forEach(item => {
          const {
            name,
            jobId,
            id,
            person,
            lng,
            lat,
            areaGeom,
            color,
            checked
          } = item
          if (checked) {
            this.newIdArr.push(id)
            let itemName = person ? '(' + person + ')' : ''
            if (
              (this.nowPostId === jobId && name) ||
              lng ||
              lat ||
              areaGeom ||
              color
            ) {
              // 创建纯文本标记
              const text = new AMap.Text({
                text: name + itemName,
                anchor: 'center', // 设置文本标记锚点
                cursor: 'pointer',
                angle: 0,
                style: {
                  'border-radius': '0.25rem',
                  'background-color': 'rgba(0, 0, 0, 0.6)',
                  'border-width': '0px',
                  'text-align': 'center',
                  'font-size': '12px',
                  color: 'rgb(255, 255, 255)'
                },
                position: [Number(lng), Number(lat)]
              })
              text.setMap(_this.mapObj)
              this.manageGeojson(areaGeom, color, 0.3)
              _this.mapObj.setFitView()
            }
          }
        })
      }
      this.massBox.size > 0 &&
        this.massBox.forEach(item => {
          item && item.setMap(null)
        })
      this.scaleBox.size > 0 &&
        this.scaleBox.forEach(item => {
          item && item.setMap(null)
        })
      this.serviceBox.size > 0 &&
        this.serviceBox.forEach(item => {
          item && item.setMap(null)
        })
      this.getAllRoutes(this.newIdArr)
    },

    // 处理geojson数据，绘制边界和路线
    manageGeojson(areaGeom, color, transparency) {
      let _this = this
      if (areaGeom && (color || transparency)) {
        // 获取GeoJSON数据并转化为对象
        let gdGeom = JSON.parse(areaGeom)
        // 实例化一个高德GeoJSON对象
        new AMap.GeoJSON({
          geoJSON: gdGeom,
          getPolygon(geojson, lnglats) {
            // console.log('拿到的geo-json数据', geojson_data)
            // 实例化一个区域覆盖物对象
            const polygon = new AMap.Polygon({
              // 经纬度数组
              path: lnglats,
              // 边界透明度
              strokeOpacity: 1,
              // 边界颜色
              strokeColor: color,
              // 边界宽度
              strokeWeight: 2,
              // 边界样式：虚线,实线,dashed || solid
              strokeStyle: 'solid',
              // 区域透明度，范围(0,1)
              fillOpacity: transparency,
              // 区域填充颜色
              fillColor: color,
              // 层级
              zIndex: 0,
              // 是否将操作冒泡到地图上
              bubble: false,
              // 鼠标悬停样式
              cursor: 'pointer'
            })
            _this.mapObj.add(polygon)
          },
          getPolyline(gdGeom, lnglats) {
            // console.log('拿到的geo-json数据', geojson_data)
            // 实例化一个区域覆盖物对象
            const Polyline = new AMap.Polyline({
              // 经纬度数组
              path: lnglats,
              // 边界透明度
              strokeOpacity: 1,
              // 边界颜色
              strokeColor: color,
              // 边界宽度
              strokeWeight: 3,
              // 边界样式：虚线,实线,dashed || solid
              strokeStyle: 'solid',
              // 区域透明度，范围(0,1)
              fillOpacity: 0,
              // 区域填充颜色
              fillColor: color,
              // 层级
              zIndex: 0,
              // 是否将操作冒泡到地图上
              bubble: false,
              // 鼠标悬停样式
              cursor: 'pointer'
            })
            _this.mapObj.add(Polyline)
          }
        })
      }
    },

    // 切换业代重绘地图
    getGeneration(id) {
      this.nowPostId = id
    },

    // 切换图例显示项
    getpointChange(value) {
      this.pointVal = value
    },
    // 切换图例显示项
    getlinstyleChange(value) {
      this.newrouteStyle = value
    },

    // 收起数据总览
    getShowOverview(value) {
      this.$emit('getShowOverview', value)
    }
  }
}
</script>
<style>
.amap-marker-label {
  position: absolute;
  z-index: 2;
  border: none;
  background-color: transparent;
  white-space: nowrap;
  cursor: default;
  padding: 3px;
  font-size: 12px;
  line-height: 14px;
}
</style>
<style lang="scss" scoped>
.planbox {
  display: flex;
  position: relative;
  .plantitle {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #0a2757;
    box-shadow: 0px -1px 0px 0px #7f8ea7;
    border-top: 1px solid #7f8ea7;
    text-align: center;
    font-size: 14px;
    color: #fff;
    position: absolute;
    top: 0;
    z-index: 200;
  }
  .areabox {
    width: calc(100%);
    background: #0a2757;
    text-align: left;
    font-size: 14px;
    color: #fff;
    position: absolute;
    top: 40px;
    z-index: 200;
    .listbox {
      box-shadow: 0px -1px 0px 0px #7f8ea7;
      width: 100%;
      height: 40px;
      line-height: 40px;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;
      .nameItem {
        padding: 0 15px;
        width: 100px;
        background: rgba(147, 12, 234, 0.3);
        border-bottom: 3px solid #930cea;
        height: 37px;
        text-align: center;
        display: inline-block;
      }
      span {
        padding: 0 15px;
        width: 100px;
        height: 37px;
        text-align: center;
        display: inline-block;
        cursor: pointer;
        &:hover {
          padding: 0 15px;
          width: 100px;
          background: rgba(147, 12, 234, 0.3);
          border-bottom: 3px solid #930cea;
        }
      }
    }
    .itembox {
      box-shadow: 0px -1px 0px 0px #7f8ea7;
      width: 100%;
      height: auto !important;
      min-height: 35px;
      line-height: 35px;
      overflow: hidden;
      span {
        font-size: 12px;
        padding: 0 15px;
        height: 37px;
        text-align: left;
        display: inline-flex;
        justify-items: center;
        align-items: center;
        cursor: pointer;
      }
    }
  }
  .nav_check {
    margin-right: 10px;
  }
  .nav_icon {
    width: 11px;
    height: 11px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    margin-right: 8px;
  }
  .smart_select_deep {
    width: 100px;
    vertical-align: middle;
    margin-right: 10px;
    float: right;
  }
  .container {
    width: 100%;
  }
}
</style>
