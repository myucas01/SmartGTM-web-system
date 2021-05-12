<template>
  <div class="main" :class="showTag && 'close'">
    <div v-show="!showTag" class="iconbox">
      <i class="el-icon-s-unfold icon" @click="showUp()"></i>
    </div>
    <div class="leftbox" v-show="showTag">
      <div class="breadcrumb">
        <i class="el-icon-s-fold icon" @click="showUp()"></i>
        <el-tooltip
          class="item"
          effect="dark"
          :content="dataTile"
          :disabled="dataTile.length < 22"
          placement="bottom-start"
        >
          <span class="planname">{{
            dataTile.length > 22 ? dataTile.slice(0, 22) + '...' : dataTile
          }}</span>
        </el-tooltip>
      </div>
      <div class="timebox">
        <el-select
          v-model="selectvalue"
          @visible-change="getChange"
          @change="getWhatWeek"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <span>数据时间：{{ currentTime }}</span>
      </div>
      <div class="tabs-wrap">
        <div
          class="tab-item"
          v-for="(item, idx) in tabsData"
          :key="idx"
          @click="handleChange(item, idx)"
          :class="{ active: activeIndex === idx }"
        >
          <svg-icon :icon-class="item.icon" class-name="icon-item"></svg-icon>
        </div>
      </div>
      <div class="content-wrap">
        <span class="content-top">
          <p class="title">{{ activeTitle }}</p>
          <p class="dataview" v-if="activeIndex == 0" @click="getDataView()">
            <svg-icon
              icon-class="icon_table"
              style="font-size: 13px"
            ></svg-icon>
            <span class="viewicons">数据总览</span>
          </p>
        </span>
        <BusinessLayer
          v-if="activeIndex == 0 && orgId"
          @CreatInforWindow="CreatInforWindow()"
          @getMapOptions="getMapOptions"
          :DawerText="DawerText"
          :AMap="AMap"
          :newAMap="newAMap"
          :programId="programId"
          :orgId="orgId"
          :saleId="saleId"
          :areaId="areaId"
          :drawTools="drawTools"
          :edit="edit"
          :jobId="jobId"
          :isPlan='isPlan'
          :AllControl="AllControl"
          :ControlFunctionMutex="ControlFunctionMutex"
          :VisitDetial='VisitDetial'
          :drawBorders='drawBorders'
          :dawAreaArr='dawAreaArr'
          :CoverDataArr='CoverDataArr'
          :LineDataArr='LineDataArr'
          :NameDataArr='NameDataArr'
          :OutLineDataArr='OutLineDataArr'
          :PathDataArr='PathDataArr'
          :Refreshoverview='Refreshoverview'
          ref="Business"
        ></BusinessLayer>
        <BasicLayer
          :orgId="orgId"
          @getMapOptions="getMapOptions"
          :AMap="AMap"
          v-else-if="activeIndex == 1 && orgId"
          :edit="edit"
          :AllControl="AllControl"
          :ControlFunctionMutex="ControlFunctionMutex"
          :CoverDataArr='CoverDataArr'
          :LineDataArr='LineDataArr'
          :NameDataArr='NameDataArr'
          :PositionDataArr='PositionDataArr'
        ></BasicLayer>
      </div>
    </div>
  </div>
</template>
<script>
import BusinessLayer from './BusinessLayer'
import BasicLayer from './BasicLayer'
import Api from '@api/route/planpreview_api.js'
import getMapData from '@/util/PreviewProgram/getMapData'
import { mapGetters } from 'vuex'
export default {
  name: 'LeftControlMenu',
  components: {
    BusinessLayer,
    BasicLayer
  },

  props: [
    'DawerText',
    'hideMapData',
    'AMap',
    'newAMap',
    'programId',
    'drawTools',
    'isPlan',
    'edit',
    'AllControl',
    'ControlFunctionMutex',
    'VisitDetial',
    'drawBorders',
    'CoverDataArr',
    'LineDataArr',
    'NameDataArr',
    'PositionDataArr',
    'dawAreaArr',
    'OutLineDataArr',
    'PathDataArr',
    'Refreshoverview'
  ],
  computed: {
    ...mapGetters('routerPlanning', ['nowPostId'])
  },
  data() {
    return {
      dataTile: '',
      activeTitle: '业务图层',
      activeIndex: 0,
      showTag: true,
      tabsData: [
        { id: 100, text: '业务图层', icon: 'icon_layer_base_disable' },
        { id: 111, text: '基础图层', icon: 'icon_layer_base_normal' }
      ],
      options: [
        {
          value: '1',
          label: '第一周'
        }
      ],
      currentTime: null, // 当前时间
      selectvalue: '1', // 当前周
      orgId: '', // 组织id
      saleId: null,
      areaId: null,
      orgData: null,
      jobId: null,
      boundaryClor: null
    }
  },
  mounted() {
    this.dataTile = this.$route.query.planName
    this.getRouteOrg()
  },
  methods: {
    getRouteOrg() {
      // ******调用接口获取组织架构
      Api.get_route_org({
        programId: this.programId,
        isPlan: this.isPlan
      })
        .then(res => {
          let newprogramName, newstoreDate
          if (res.data) {
            const {
              orgId,
              orgName,
              programName,
              storeDate,
              gdLng,
              gdLat,
              gdGeom,
              color, // 填充颜色
              borderColor, // 描边颜色
              borderSize, //描边宽度
              drawingOpacity, // 描边不透明度
              opacity, // 填充不透明度

            } = res.data
            this.orgId = orgId
            newprogramName = programName
            newstoreDate = storeDate
            // 组织id
            this.$store.dispatch('map/setOrganizationId', orgId)
            // 组织name
            this.$store.dispatch('map/setOrganizationName', orgName)
            // 组织不可点击
            this.$store.dispatch('map/setOrganizationDisabled', true)
            const data = [
              {
                borderWidth: '1',
                fillColorOpacity: '1',
                gdBoundarJson: gdGeom,
                gdLat: gdLat,
                gdLng: gdLng,
                iconType: '1',
                id: orgId,
                name: orgName,
                type: 'region'
              }
            ]
            this.orgData = data
            let newColor = borderColor || '#000'
            this.boundaryClor = newColor
            let listdata = getMapData({
              data,
              type: ['LineData', 'CoverData', 'NameData', 'PositionData'],
              style: { color: newColor,  borderSize, drawingOpacity, fillcolor:color, opacity},
              detail: { id: orgId, name: orgName }
            })
            const {
              newLineData,
              newCoverData,
              newNameData,
              newPositionData
            } = listdata
            // 绘制边界线
            this.$emit('getMapOptions', newLineData[0], newLineData[1])
            // 绘制覆盖层
            this.$emit('getMapOptions', newCoverData[0], newCoverData[1])
            // 绘制区域名称
            this.$emit('getMapOptions', newNameData[0], newNameData[1])
            // 绘制区域位置
            this.$emit('getMapOptions', newPositionData[0], newPositionData[1])
          }
          this.dataTile = newprogramName ? newprogramName : '暂无数据'
          this.currentTime = newstoreDate ? newstoreDate : '暂无数据'
        })
        .catch(err => {
          console.log(err)
        })
    },
    getAllZoning() {
      // ******调用接口获取行政区划
      Api.get_all_zoning({
        orgId: this.orgId
      })
        .then(res => {
          if (res.code === '200') {
            this.getZongData(res.data.cityData, 'cityData')
            this.getZongData(res.data.countyData, 'countyData')
            this.getZongData(res.data.streetData, 'streetData')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 遍历行政区划
    getZongData(data, type) {
      if (data.length > 0) {
        data.forEach((item,index) => {
          if (item) {
            const { zoningGeom, zoningLat, zoningLng, zoningName } = item
            const data = [
              {
                borderWidth: '1',
                fillColorOpacity: '1',
                gdBoundarJson: zoningGeom,
                gdLat: zoningLat,
                gdLng: zoningLng,
                iconType: '1',
                id: 'cityData',
                name: zoningName,
                type: 'region'
              }
            ]
            let listdata = getMapData({
              data,
              type: ['LineData', 'NameData'],
              style: { color: this.boundaryClor },
              detail: { id: type+index, name: zoningName }
            })
            const { newLineData, newNameData } = listdata
            // 绘制边界线
            this.$emit('getMapOptions', newLineData[0], newLineData[1])
            // 绘制区划名称
            this.$emit('getMapOptions', newNameData[0], newNameData[1])
          }
        })
      }
    },
    getWhatWeek() {
      this.$store.dispatch('routerPlanning/setNowWeek', this.selectvalue)
    },
    getChange() {
      this.options = []
      if (!this.AllControl.get('serveicWeek')) {
        return
      }
      this.options = [
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
      ]
    },
    showUp() {
      if (
        !this.AllControl.get('DaySerive')
        ||
        !this.AllControl.get('StoreChange')
        ||
        !this.AllControl.get('MoreChange')
        ||
        !this.AllControl.get('DotaChange')
        ||
        !this.AllControl.get('AreaChange')
        ||
        !this.AllControl.get('SalesChange')
        ||
        !this.AllControl.get('CustomerDetail')
        ||
        !this.AllControl.get('Generateday')
        ||
        !this.AllControl.get('SalesChange')
        ||
        !this.AllControl.get('SalesChange')
        ||
        !this.AllControl.get('SalesChange')
        ) {
        return
      }
      this.showTag = !this.showTag
    },
    CreatInforWindow(data) {
      this.$emit('CreatInforWindow', data)
    },
    handleChange(item, idx) {
      if (item.text === '基础图层') {
        // 顶部按钮置灰
        this.$store.dispatch('routerPlanning/Stock_pile', true)
        if (!this.AllControl.get('BasicLayer')) {
          return
        }
        this.ControlFunctionMutex('NewBusiness', true)
        this.AMap.clearMap()
        this.hideMapData()
        this.$refs.Business.closeAllDot()
        this.getAllZoning()
        this.activeIndex = idx
        this.activeTitle = item.text
      } else {
        // 取消顶部按钮置灰
        this.$store.dispatch('routerPlanning/Stock_pile', false)
        if (!this.AllControl.get('NewBusiness')) {
          return
        }
        this.ControlFunctionMutex('NewBusiness', false)
        this.activeIndex = idx
        this.activeTitle = item.text
      }
    },
    getDataView() {
      if (this.nowPostId.length < 1) {
        this.$message({ message: '请先选择业代', type: 'warning' })
        return
      }
      this.$emit('handlerChange', true)
    },
    getMapOptions(data, type) {
      this.$emit('getMapOptions', data, type)
    }
  }
}
</script>

<style lang="scss" scoped>
.close {
  height: calc(100% - 48px);
}
.main {
  z-index: 199;
  background-color: #0a2757;
  position: absolute;
  left: 0px;
  top: 48px;
  .iconbox {
    height: 40px;
    width: 40px;
    font-size: 15px;
    color: #ffffff;
    display: flex;
    align-items: center;
    .icon {
      margin: 0 13px;
    }
  }
  .planname {
    &:hover {
      cursor: pointer;
    }
  }
  .leftbox {
    width: 340px;
    display: block;
    .breadcrumb {
      height: 40px;
      line-height: 40px;
      display: flex;
      text-align: left;
      background: #081f45;
      position: relative;
      align-items: center;
      font-size: 15px;
      color: #ffffff;
      width: 340px;
      .icon {
        margin: 0 13px;
        cursor: pointer;
      }
    }
    .timebox {
      height: 28px;
      color: #ced3dd;
      padding: 10px 0;
      .el-select {
        width: 110px;
        margin: 0 12px;
        height: 28px;
        background: #102f63;
        ::v-deep .el-input__inner {
          width: 110px;
          height: 28px;
          background: #102f63;
          border: none;
          font-size: 13px;
          border-radius: 4px;
          border: 1px solid #8199a4;
          color: #ffffff;
          box-sizing: border-box;
        }
        ::v-deep .el-input__suffix {
          align-items: center !important;
          display: flex;
        }
      }
    }
    .tabs-wrap {
      display: flex;
      height: 26px;
      background: #0a2757;
      box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.5);
      .tab-item {
        flex: 1;
        line-height: 26px;
        background: #0a2757;
        text-align: center;
        cursor: pointer;
        .icon-item {
          font-size: 14px;
          padding-top: 5px;
          opacity: 0.6;
        }
        &.active {
          background: #133773;
          box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.5),
            1px 0px 0px 0px rgba(0, 0, 0, 0.5);
          .icon-item {
            font-size: 16px;
            padding-top: 5px;
            opacity: 1;
          }
        }
        &:last-child {
          &.active {
            box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.5);
          }
        }
      }
    }
    .content-wrap {
      .content-top {
        height: 42px;
        line-height: 42px;
        color: #ffffff;
        display: flex;
        justify-content: space-between;
        .title {
          font-size: 18px;
          margin-left: 8px;
        }
        .dataview {
          font-size: 16px;
          .viewicons {
            font-size: 13px;
            margin: 0 10px 0 5px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
