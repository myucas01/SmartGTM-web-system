<template>
  <div class="main_top">
    <div class="button">
      <span
        v-auth="'lineplan:build:mapshow:exchangeday'"
        v-show="!ServiceButton && showbutton"
        :class="(!dayText && 'active ') + (oneshowdisable && ' no-click')"
        @click="changeDay()"
        >{{ dayText ? '服务日对调' : '关闭服务日对调'
        }}<el-tooltip placement="top">
          <div slot="content">
            <span>对服务日顺序进行对调</span>
          </div>
          <svg-icon icon-class="wenhao" class-name="icon-tip" /> </el-tooltip
      ></span>
      <!-- <span
        v-auth= "'lineplan:build:mapshow:exchangestore'"
        v-show="!ServiceButton && showbutton"
        :class="(!Store && 'active ') + (twoshowdisable&&' no-click')"
        @click="getStore()">
        {{Store ? '门店调整' : '关闭门店调整'}} <el-tooltip placement="top">
                        <div slot="content">
                            <span>将门店加入或移出线路</span>
                        </div>
                        <svg-icon icon-class="wenhao" class-name="icon-tip"/>
                    </el-tooltip>
      </span> -->
      <span
        v-auth="'lineplan:buildmapshow:exchangeline'"
        v-show="ServiceButton && showbutton && changeLineButton"
        :class="(!exchangeline && 'active ') + (clickStore && ' no-click')"
        @click="OpenTip()"
        >路线调整
        <el-tooltip placement="top">
          <div slot="content">
            <span>对已生成的路线进行再次调整</span>
          </div>
          <svg-icon icon-class="wenhao" class-name="icon-tip" /> </el-tooltip
      ></span>
      <span
        v-auth="'lineplan:build:mapshow:updatestores'"
        v-show="!ServiceButton && showbutton"
        :class="(!Dot && 'active ') + (thereshowdisable && ' no-click')"
        @click="changeDot()"
        >{{ Dot ? '批量选点' : '关闭批量选点'
        }}<el-tooltip placement="top">
          <div slot="content">
            <span>通过圈选方式批量调整多个门店的拜访计划</span>
          </div>
          <svg-icon icon-class="wenhao" class-name="icon-tip" /> </el-tooltip
      ></span>
      <span
        :class="(!StoreText && 'active ') + (fourshowdisable && ' no-click')"
        @click="changeStore()"
        >{{ StoreText ? '异动门店' : '关闭异动门店' }}
        <el-tooltip placement="top">
          <div slot="content">
            <span>展示异动门店的数据。异动类型如下：</span><br />
            <span>未计划：无区域归属及服务日的门店；</span><br />
            <span>新店：上月1日之后创建的门店（选择手动分配新店时出现）</span
            ><br />
            <span>门店定位调整：定位被调整的门店（通过手动调整门店定位点）</span
            ><br />
            <span>拜访频率异常：拜访频率与服务标准不符的门店；</span><br />
            <span
              >无服务日：ai划区建线，调整区域导致有归属但无服务日的门店/未参与规划中的无服务日的门店手动加入到可规划门店
            </span>
          </div>
          <svg-icon icon-class="wenhao" class-name="icon-tip" /> </el-tooltip
      ></span>
      <!-- 路线生成后 -->
      <span
        v-auth="'lineplan:build:mapshow:initialpoint'"
        v-show="ServiceButton && showbutton && changeLineButton"
        :class="(sartText && 'active ') + (startPoint && ' no-click')"
        @click="getstarPoint"
        >{{ !sartText ? '设置起始点' : '完成起始点设置'
        }}<el-tooltip placement="top">
          <div slot="content">
            <span>对已生成的路线设置起始点</span>
          </div>
          <svg-icon icon-class="wenhao" class-name="icon-tip" /> </el-tooltip
      ></span>
      <!-- 还原片区显示前置条件：非AI-AI路线规划模式，路线未生成时 -->
      <span
        v-show="
          !ServiceButton &&
            showbutton &&
            precinctsCode !== 'ai'
        "
        :class="Areashowdisable && ' no-click'"
        @click="OpenReduction"
        v-auth="'lineplan:buildmapshow:restorearea'"
        >还原片区<el-tooltip placement="top">
          <div slot="content">
            <span
              >非AI-AI路线规划模式，若有区域和点位调整，根据目前的点位归属可重算片区</span
            >
          </div>
          <svg-icon icon-class="wenhao" class-name="icon-tip" /> </el-tooltip
      ></span>
      <span
        v-auth="'lineplan:build:mapshow:createdays'"
        v-show="showBtn && showbutton"
        :class="fifshowdisable && ' no-click'"
        @click="openDialog"
        >生成服务日<el-tooltip placement="top">
          <div slot="content">
            <span>ai方式划区建线，若有区域调整，可重算服务日</span>
          </div>
          <svg-icon icon-class="wenhao" class-name="icon-tip" /> </el-tooltip
      ></span>
    </div>
    <el-dialog
      class="dialog-box"
      title="重要提示"
      append-to-body
      :visible.sync="dialogVisible"
      width="390px"
    >
      <svg-icon icon-class="icon_warningsmall" class="svg-icons"></svg-icon>
      <div class="dialog-content">
        生成服务日将使用AI重新计算，可能会重置当前计划的服务日现状，是否继续？
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createServiceDay" class="orange"
          >生成服务日</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Api from '@api/route/planpreview_api.js'
import { eventBus } from '@/util/eventBut.js'
export default {
  name: 'TopMeau',
  props: ['programId', 'orgId', 'edit', 'AllControl', 'ControlFunctionMutex'],
  data() {
    return {
      dayText: null,
      Store: true,
      Dot: true,
      StoreText: true,
      dialogVisible: false,
      routeDialogVisible: false,
      requestBoolean: false,
      clickStore: false,
      exchangeline: true,
      btnCtr: false,
      showBtn: false,
      showbutton: this.edit,
      oneshowdisable: false, //服务日对调禁用状态
      twoshowdisable: false, //批量选点禁用状态
      thereshowdisable: false,
      fourshowdisable: false, //异动门店禁用状态
      fifshowdisable: false, //生成服务日禁用状态
      Areashowdisable: false, //还原区域禁用状态
      precinctsCode: null,
      routeCode: null,
      sartText: false, //设置起始点样式状态
      startPoint: false //起始点禁用状态
    }
  },
  mounted() {
    this.dayText = this.operationalService
    const { precinctsCode, routeCode } = this.$route.query
    this.precinctsCode = precinctsCode
    this.routeCode = routeCode
  },
  computed: {
    ...mapGetters('routerPlanning', [
      'showIds',
      'operationalService',
      'nowPostId',
      'ServiceButton',
      'mapViewId',
      'viewMapSalesTypeMap',
      'saleTypeKey',
      'jobLayer',
      'pointVal',
      'Stockpile',
      'changeLineButton'
    ]),
    ...mapGetters('map', ['organizationId']),
    ...mapGetters('common', ['currentMessage'])
  },
  watch: {
    edit(newvalue) {
      if (!newvalue) {
        this.showbutton = false
      }
    },
    Stockpile(newval) {
      this.oneshowdisable = newval && !this.AllControl.get('DaySerive')
      this.twoshowdisable = newval && !this.AllControl.get('StoreChange')
      this.thereshowdisable = newval && !this.AllControl.get('MoreChange')
      this.fourshowdisable = newval && !this.AllControl.get('DotaChange')
      this.fifshowdisable = newval && !this.AllControl.get('Generateday')
      this.Areashowdisable = newval && !this.AllControl.get('areaReduction')
      this.startPoint = newval && !this.AllControl.get('startPoint')
      this.clickStore = newval && !this.AllControl.get('adjustMent')
    },
    dayText(newvalue) {
      this.$store.commit('routerPlanning/SET_OPERATIONAL_SERVICE', newvalue)
    },
    currentMessage() {
      if (this.currentMessage) {
        let currentMessage = JSON.parse(this.currentMessage)
        if (currentMessage.bussinessCode === '104') {
          if (
            this.viewMapSalesTypeMap.has(
              currentMessage.areaLineMsg.salesTypeCode
            )
          ) {
            let viewMapSalesTypeMap = this.viewMapSalesTypeMap
            let nowType = this.viewMapSalesTypeMap.get(
              currentMessage.areaLineMsg.salesTypeCode
            )
            nowType = {
              ...nowType,
              createServiceDayStatus: false,
              noDaySize: 0
            }
            this.requestBoolean = false
            viewMapSalesTypeMap.set(
              currentMessage.areaLineMsg.salesTypeCode,
              nowType
            )
            this.$store.commit(
              'routerPlanning/SET_VIEW_MAP_SALES_TYPE_MAP',
              viewMapSalesTypeMap
            )
            this.$store.commit(
              'routerPlanning/SET_SALE_TYPE_KEY',
              new Date().getTime()
            )
          }
        }
      }
    },
    saleTypeKey() {
      if (this.saleTypeKey) {
        if (this.viewMapSalesTypeMap.has(this.nowPostId)) {
          let SalesTypeMap = this.viewMapSalesTypeMap.get(this.nowPostId)
          if (
            this.$route.query.routeCode
          ) {
            if (
              SalesTypeMap.routeStatus === '2' ||
              SalesTypeMap.routeStatus === '3' ||
              SalesTypeMap.routeStatus === '1'
            ) {
              this.showBtn = false
            } else {
              this.showBtn = true
            }
          }
        }
      }
    }
  },
  methods: {
    openDialog() {
      if (!this.AllControl.get('Generateday')) {
        return
      }
      if (this.showIds.length < 1) {
        this.$message({ message: '请先展开业代岗位', type: 'warning' })
        return
      }
      this.dialogVisible = true
    },
    changeDay() {
      if (!this.AllControl.get('DaySerive')) {
        return
      }
      if (this.showIds.length < 1 && this.dayText) {
        this.$message({ message: '请先展开业代岗位', type: 'warning' })
        return
      }
      this.dayText = !this.dayText
      if (!this.dayText) {
        this.ControlFunctionMutex('DaySerive', true)
        this.twoshowdisable = true
        this.thereshowdisable = true
        this.fourshowdisable = true
        this.fifshowdisable = true
        this.Areashowdisable = true
        if (!this.AllControl.get('DaySerive')) {
          return
        }
        this.$store.commit('routerPlanning/SET_LEGEND_POINT', 2)
        if (!this.jobLayer.includes('已计划')) {
          const newdata = [...this.jobLayer]
          newdata.push('已计划')
          this.$store.dispatch('routerPlanning/setLegendJobLayer', newdata)
        }
      } else {
        this.$emit('changeDay', false)
        this.ControlFunctionMutex('DaySerive', false)
        this.twoshowdisable = false
        this.thereshowdisable = false
        this.fourshowdisable = false
        this.fifshowdisable = false
        this.Areashowdisable = false
      }
    },
    OpenTip() {
      if (!this.clickStore) {
        this.ControlFunctionMutex('addNewarea', true)
        this.fourshowdisable = true
        this.startPoint = true
        this.exchangeline = false
        this.$confirm('此次调整将永久清除当前业代路线，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.ControlFunctionMutex('addNewarea', false)
            this.fourshowdisable = false
            this.startPoint = false
            this.exchangeline = true
            this.getStore()
          })
          .catch(() => {
            this.ControlFunctionMutex('addNewarea', false)
            this.fourshowdisable = false
            this.startPoint = false
            this.exchangeline = true
            this.$message({
              type: 'info',
              message: '已取消调整'
            })
          })
      }
    },
    OpenReduction() {
      if (!this.Areashowdisable) {
        this.$confirm('此次操作将永久还原当前片区，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            //调用还原片区接口
            Api.get_create_precinct({
              org_id: this.organizationId,
              pre_plan_no: this.mapViewId,
              sales_type: this.nowPostId
            }).then(res => {
              if (res.code === '200') {
                this.$message({ message: res.message, type: 'success' })
              }
              if(res.code === '504') {
                // 线路已被其他账号生成 需重新更新
                location. reload()
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      }
    },
    getstarPoint() {
      if (!this.AllControl.get('startPoint')) {
        return
      }
      // 设置起始点
      if (!this.sartText) {
        this.sartText = !this.sartText
        this.$emit('getstarPoint',this.sartText)
        this.ControlFunctionMutex('startPoint', true)
        this.$parent.$refs.Customer.showPointButton(true)
        this.oneshowdisable = true
        this.thereshowdisable = true
        this.fourshowdisable = true
        this.fifshowdisable = true
        this.Areashowdisable = true
        this.clickStore = true
        if (!this.jobLayer.includes('已计划')) {
          const newdata = [...this.jobLayer]
          newdata.push('已计划')
          this.$store.dispatch('routerPlanning/setLegendJobLayer', newdata)
        }
        this.$store.dispatch('routerPlanning/setLegendPoint', 1)
      } else {
        if(this.$parent.$refs.Customer.originList.size>0){
          this.$confirm('此操作设置起始点并重新生成路线, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$parent.$refs.Customer.getPointList(false)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消设置'
            });
            this.$parent.$refs.Customer.clearPoint()
          });
        }
        this.startSeetPoint()
      }
    },
    startSeetPoint(){
        this.sartText = !this.sartText
        this.$parent.$refs.Customer.showPointButton(false)
        this.$emit('getstarPoint',this.sartText)
        this.ControlFunctionMutex('startPoint', false)
        this.oneshowdisable = false
        this.thereshowdisable = false
        this.fourshowdisable = false
        this.fifshowdisable = false
        this.Areashowdisable = false
        this.clickStore = false
    },
    getStore() {
      // 操作其他功能互斥
      if (!this.AllControl.get('StoreChange')) {
        return
      }
      // 是否展示路线调整按钮
      if (this.ServiceButton) {
        if (!this.AllControl.get('LineButton')) {
          return
        }
        // 路线已生成
        // ******调用重新生成路线接口
        Api.get_clear_line({
          jobId: this.nowPostId,
          programId: this.programId
        })
          .then(res => {
            if (res.code === '200') {
              this.$message({ message: '路线调整成功', type: 'success' })
              eventBus.$emit('closeAllDot')
              eventBus.$emit('getRoutePosition')
              this.$store.dispatch('routerPlanning/setServiceButton', false)
            }
            if(res.code === '504') {
              // 线路已被其他账号生成 需重新更新
              location. reload()
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        // 没有展开任何业代时，提示消息
        if (this.showIds.length < 1 && this.Store) {
          this.$message({ message: '请先展开业代岗位', type: 'warning' })
          return
        }
        this.Store = !this.Store
        if (!this.Store) {
          this.ControlFunctionMutex('StoreChange', true)
          this.oneshowdisable = true
          this.thereshowdisable = true
          this.fourshowdisable = true
          this.fifshowdisable = true
          this.Areashowdisable = true
        } else {
          this.ControlFunctionMutex('StoreChange', false)
          this.oneshowdisable = false
          this.thereshowdisable = false
          this.fourshowdisable = false
          this.fifshowdisable = false
          this.Areashowdisable = false
        }
        if (this.Store) {
          // console.log('路线调整1')
          this.$parent.whetherStoreEdit = false
        } else {
          // console.log('门店调整2')
          this.$parent.whetherStoreEdit = true
          if (!this.jobLayer.includes('已计划')) {
            this.jobLayer.push('已计划')
            this.$store.dispatch(
              'routerPlanning/setLegendJobLayer',
              this.jobLayer
            )
          }
        }
      }
    },
    changeDot() {
      if (!this.AllControl.get('MoreChange')) {
        return
      }
      if (this.showIds.length < 1 && this.Dot) {
        this.$message({ message: '请先展开业代岗位', type: 'warning' })
        return
      }
      this.Dot = !this.Dot
      if (!this.Dot) {
        if (!this.jobLayer.includes('已计划')) {
          const newdata = [...this.jobLayer]
          newdata.push('已计划')
          this.$store.dispatch('routerPlanning/setLegendJobLayer', newdata)
        }
        this.ControlFunctionMutex('MoreChange', true)
        this.oneshowdisable = true
        this.twoshowdisable = true
        this.fourshowdisable = true
        this.fifshowdisable = true
        this.Areashowdisable = true
      } else {
        this.ControlFunctionMutex('MoreChange', false)
        this.oneshowdisable = false
        this.twoshowdisable = false
        this.fourshowdisable = false
        this.fifshowdisable = false
        this.Areashowdisable = false
      }
      this.$emit('changePoint', !this.Dot)
      this.StoreText = true
      this.$emit('changeStores', !this.StoreText)
    },
    changeStore() {
      if (!this.AllControl.get('DotaChange')) {
        return
      }
      if (this.showIds.length < 1 && this.StoreText) {
        this.$message({ message: '请先展开业代岗位', type: 'warning' })
        return
      }
      this.StoreText = !this.StoreText
      if (!this.StoreText) {
        this.ControlFunctionMutex('DotaChange', true)
        this.oneshowdisable = true
        this.twoshowdisable = true
        this.thereshowdisable = true
        this.fifshowdisable = true
        this.Areashowdisable = true
        this.clickStore = true
        this.startPoint = true
      } else {
        this.ControlFunctionMutex('DotaChange', false)
        this.oneshowdisable = false
        this.twoshowdisable = false
        this.thereshowdisable = false
        this.fifshowdisable = false
        this.Areashowdisable = false
        this.clickStore = false
        this.startPoint = false
      }
      this.$emit('changeStores', !this.StoreText)

      this.Dot = true
      this.$emit('changePoint', !this.Dot)
    },
    // 生成服务日
    createServiceDay() {
      let message = {
        bussinessCode: '104',
        msg: '当前业代开始生成服务日',
        areaLineMsg: {
          orgId: this.organizationId,
          salesTypeCode: this.nowPostId,
          prePlanNo: this.mapViewId
        },
        status: 12,
        sendBySelf: true
      }
      Api.createServiceDay({
        org_id: this.organizationId,
        pre_plan_no: this.mapViewId,
        sales_type_code: this.nowPostId
      }).then(res => {
        // debugger
        if (res.code === '200') {
          message.status = 12
        } else if (res.code ==='504'){
          // 线路已被其他账号生成 需重新更新
          location. reload()
        }else {
          message.status = 13
        }
      })
      this.dialogVisible = false
      this.$store.commit(
        'routerPlanning/SET_SALE_TYPE_KEY',
        new Date().getTime()
      )

      // 给自己发条消息
      this.$store.commit('common/WEB_SOCKET_MSG', JSON.stringify(message))
    }
  }
}
</script>
<style lang="scss" scoped>
.main_top {
  display: flex;
  width: calc(100% - 340px);
  height: 41px;
  background: #0a2757;
  box-shadow: 1px 0px 0px 0px #7f8ea7;
  border-top: 1px solid #7f8ea7;
  border-left: 1px solid #7f8ea7;
  position: absolute;
  z-index: 1;
  right: 0px;
}
.button {
  display: inline-block;
  height: 22px;
  line-height: 22px;
  border: 1px solid #8199a4;
  background: #102f63;
  border-radius: 5px;
  align-content: center;
  margin: 10px 0 10px 15px;
  .active {
    font-size: 12px;
    text-align: center;
    cursor: pointer;
    position: relative;
    width: 112px;
    background: #930cea;
    color: #ffffff;
  }
  .no-click {
    color: grey;
    cursor: not-allowed;
  }
  .allow-click {
    color: #fff;
    cursor: pointer;
  }
  span {
    font-size: 12px;
    color: #ffffff;
    text-align: center;
    display: inline-block;
    cursor: pointer;
    width: 112px;
    position: relative;
    &::after {
      border-right: 1px solid #8199a4;
      content: '';
      position: absolute;
      right: 0px;
      height: 22px;
    }
    &:last-child {
      &::after {
        border: none;
      }
    }
  }
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
