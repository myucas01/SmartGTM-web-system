<template>
  <!-- 选择对调顺序的服务日 -->
  <div id='main_service' class="main_service" v-show="this.DatList.length > 0">
    <VueDragResize
      :w="20"
      :h="20"
      v-on:resizing="resize"
      v-on:dragging="resize"
      :isResizable="false"
    >
      <div class="box" :style="{ width: +vw + 'px', height: +vh + 'px' }">
        <span class="title">选择对调顺序的服务日</span>
        <span
          class="daybox"
          :class="
            item.label == Number(storeDay)
              ? 'hover'
              : item.label == Number(checkList[1])
              ? 'newhover'
              : ''
          "
          v-for="(item, index) in DatList"
          :key="index"
          @click="getDaylist(item)"
          >{{ item.title }}</span
        >
        <span class="dialog-footer">
          <el-button class="footerbutton" @click="closeModel">取 消</el-button>
          <el-button class="footerbutton" type="primary" @click="handleClose"
            >确 定</el-button
          >
        </span>
      </div>
    </VueDragResize>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Api from '@api/route/planpreview_api.js'
import VueDragResize from 'vue-drag-resize' //缩放、拖拽
import { eventBus } from '@/util/eventBut.js'
export default {
  props: [
    'showDayModel',
    'programId',
    'areaId',
    'storeDay',
    'hidePointStroke',
    'getPointStroke'
  ],
  data() {
    return {
      DatList: [],
      checkList: [],
      vw: 0,
      vh: 0,
      top: 0,
      left: 0
    }
  },
  computed: {
    ...mapGetters('routerPlanning', ['CoverDataArr', 'draftId', 'NowWeek'])
  },
  components: {
    VueDragResize
  },
  watch: {
    showDayModel(newValue) {
      if (newValue) {
        this.getselectday()
      }
      this.checkList = []
      this.checkList.push(Number(this.storeDay))
    }
  },
  mounted() {
    this.vw = 319 + 'px'
    this.vh = 162 + 'px'
  },
  methods: {
    getselectday() {
      Api.get_select_day({
        prePlanNo: this.programId,
        precinctNo: this.areaId
      })
        .then(res => {
          let dataList = []
          if (res.code === '200') {
            res.data.forEach(item => {
              let newValue
              switch (item) {
                case 1:
                  newValue = '周一'
                  break
                case 2:
                  newValue = '周二'
                  break
                case 3:
                  newValue = '周三'
                  break
                case 4:
                  newValue = '周四'
                  break
                case 5:
                  newValue = '周五'
                  break
                case 6:
                  newValue = '周六'
                  break
                case 7:
                  newValue = '周日'
                  break
              }
              const newitem = {
                label: item,
                title: newValue,
                value: false
              }
              dataList.push(newitem)
            })
            this.DatList = dataList
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleClose() {
      this.$emit('setServiceEdit',true)
      if (this.checkList.length === 2) {
        Api.get_service_day({
          prePlanNo: this.programId,
          precinctNo: this.areaId,
          currentServiceDay: this.checkList[0],
          targetServiceDay: this.checkList[1],
          visitWeek: Number(this.NowWeek)
        })
          .then(res => {
            // debugger
            if (res.code === '200') {
              this.$message({ message: res.message, type: 'success' })
              this.$emit('changeDay', false)
              eventBus.$emit('handle-node-click',this.areaId)
              this.hidePointStroke([])
            }
            if(res.code === '504') {
              // 线路已被其他账号生成 需重新更新
              location.reload()
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$message({ message: '请选择需要对调的服务日', type: 'warning' })
      }
    },
    closeModel() {
      this.$emit('setServiceEdit',true)
      this.checkList = []
      this.$emit('changeDay', false)
      // 关闭当前选中服务日
      this.hidePointStroke([])
      this.$emit('getNowServerDay', [])
    },
    getDaylist(data) {
      this.checkList = []
      this.checkList.push(Number(this.storeDay))
      this.checkList.push(data.label)
      // 储存当前选中服务日
      this.$emit('getNowServerDay', [this.storeDay, data.label.toString()])
      // 高亮展示当前选中服务日
      this.getPointStroke([this.storeDay, data.label.toString()])
    },
    resize(newRect) {
      this.vw = newRect.width
      this.vh = newRect.height
      this.top = newRect.top
      this.left = newRect.left
    }
  }
}
</script>
<style lang="scss" scoped>
.main_service {
  z-index: 999;
  position: absolute;
  top: 0px;
  left: 800px;
  .vdr.active:before {
    outline: none !important;
  }
  .box {
    display: block;
    width: 319px !important;
    height: 162px !important;
    background-color: #ffffff;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.04),
      0px 2px 3px 0px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
  }
  .title {
    font-size: 13px;
    font-weight: 600;
    color: #1f2d3d;
    padding: 16px;
    display: block;
  }
  .dialog-footer {
    height: 40px;
    display: block;
    text-align: right;
    padding-right: 16px;
    border-top: 1px solid #d8e4f0;
  }
  .footerbutton {
    margin-top: 3px;
    height: 25px;
    line-height: 3px;
  }
  .daybox {
    width: 45px;
    height: 22px;
    background: #ffffff;
    border-radius: 11px;
    border: 1px solid #979797;
    font-size: 11px;
    color: #1f2d3d;
    text-align: center;
    line-height: 22px;
    margin: 0 15px 15px 15px;
    display: inline-block;
    cursor: pointer;
  }
  .hover {
    background: rgba(153, 153, 153, 0.36);
  }
  .newhover {
    color: #ffffff;
    background: #930cea;
  }
}
</style>
