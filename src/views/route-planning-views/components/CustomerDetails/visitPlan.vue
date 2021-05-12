<template>
  <div class="main_plan">
    <div class="top">
      <span class="data">
        <p class="datalist" v-for="(item, index) in DataList" :key="index">
          {{ item.value }}
        </p>
      </span>
      <span class="check">
        <p class="checklist" v-for="(Weekitem, odex) in WeekList" :key="odex">
          {{ Weekitem.value }}
        </p>
      </span>
      <span class="checkbox">
        <el-checkbox
          v-for="(checkitem, checkindex) in checkList"
          v-model="checkitem.value"
          :key="checkindex"
          :disabled="!editeStatu"
          class="option smart_checkbox_deep"
          @change="handleChecked($event, checkitem, checkList)"
        ></el-checkbox>
      </span>
    </div>
    <span class="bottom">
      <el-button
        class="smart_button_deep"
        v-show="editeStatu"
        size="mini"
        @click="getEditer()"
        >取消</el-button
      >
      <el-button
        v-if="editeStatu"
        type="primary"
        size="mini"
        @click="getEditer('save')"
        >保存</el-button
      >
      <el-button
        v-auth= "'lineplan:build:mapshow:storedetail:updatevisit'"
        v-else-if="!editeStatu"
        type="primary"
        size="mini"
        @click="getEditer()"
        :disabled="ServiceButton || !edit"
        >编辑</el-button
      >
    </span>
  </div>
</template>
<script>
import Api from '@api/route/planpreview_api.js'
import { eventBus } from '@/util/eventBut.js'
export default {
  name: 'VisitPlan',
  data() {
    return {
      WeekList: [
        { whatWeek: '1', value: '第一周' },
        { whatWeek: '2', value: '第二周' },
        { whatWeek: '3', value: '第三周' },
        { whatWeek: '4', value: '第四周' },
        { whatWeek: 'allDay', value: '全选' }
      ], // 拜访计划横坐标
      DataList: [
        { weekDay: 1, value: '周一' },
        { weekDay: 2, value: '周二' },
        { weekDay: 3, value: '周三' },
        { weekDay: 4, value: '周四' },
        { weekDay: 5, value: '周五' },
        { weekDay: 6, value: '周六' },
        { weekDay: 7, value: '周日' }
      ], // 拜访计划纵坐标
      checkList: [],
      editeStatu: false
    }
  },
  mounted() {
    this.init()
  },
  props: [
    'VisitPlanData',
    'programId',
    'storeData',
    'getVisitPlan',
    'ServiceButton',
    'edit',
    'handlerClick'
  ],
  watch: {
    VisitPlanData: {
      deep: true,
      handler: function(newval) {
        this.init(newval)
      }
    },
    checkList: {
      deep: true,
      handler: function(newval) {
        this.checkAllcheck(newval)
      }
    }
  },
  methods: {
    init(data) {
      let newData
      if (data) {
        this.checkList = []
        newData = data
      } else {
        newData = this.VisitPlanData
      }
      // 遍历选框数组
      // ******调用接口返回拜访计划选框数据
      this.WeekList.forEach(item => {
        let checkvalue = {}
        this.DataList.forEach(dataitem => {
          checkvalue = {
            Week: item.value,
            weeklabel: item.whatWeek,
            Data: dataitem.value,
            Datalabel: dataitem.weekDay,
            value: false
          }
          newData.forEach(visititem => {
            if (
              visititem.weekDay == dataitem.weekDay &&
              visititem.whatWeek == item.whatWeek
            ) {
              checkvalue.value = true
            }
          })
          this.checkList.push(checkvalue)
        })
      })
    },
    checkAllcheck(newval) {
      if (newval) {
        this.DataList.forEach(dataitem => {
          if (this.whetherAll(newval, dataitem.value).length < 1) {
            const data = this.checkList.filter(
              item => item.Data === dataitem.value && item.Week === '全选'
            )
            data[0].value = true
          }
        })
      }
    },
    whetherAll(newval, nowday) {
      const data = newval
        .filter(item => item.Data == nowday)
        .filter(item => !item.value && item.Week !== '全选')
      return data
    },
    handleChecked(e, item, dataList) {
      // checkbox选中vs取消
      if (item.Week == '全选') {
        // 全选操作
        dataList.forEach(newitem => {
          if (newitem.Data == item.Data) {
            newitem.value = e
          }
        })
      } else {
        // 普通操作
        if (!e) {
          dataList.forEach(newitem => {
            if (newitem.Data == item.Data && newitem.Week == '全选') {
              newitem.value = e
            }
          })
        }
      }
    },
    getEditer(data) {
      if (data === 'save') {
        let newResult = []
        this.checkList.forEach(item => {
          if (item.value == true && item.weeklabel != 'allDay') {
            const newitem = {
              weekDay: item.Datalabel,
              whatWeek: item.weeklabel
            }
            newResult.push(newitem)
          }
        })
        // 保存
        this.editeStatu = !this.editeStatu
        // ******调用接口更新拜访计划选框数据
        Api.get_updata_plan({
          storeId: this.storeData.storeId,
          planId: this.programId,
          storeName: this.storeData.storeName,
          storeNo: this.storeData.storeCode,
          areaId: this.storeData.areaId,
          visitPlanList: newResult
        })
          .then(res => {
            if (res.code === '200') {
              this.$message({ message: res.message, type: 'success' })
              this.getVisitPlan(this.storeData.storeId, this.storeData.areaId)
              eventBus.$emit('handle-node-click', this.storeData.areaId)
              this.handlerClick()
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
        // 取消
        this.editeStatu = !this.editeStatu
      }
    }
  }
}
</script>
<style scoped lang="scss">
.main_plan {
  width: 521px;
  .top {
    padding: 20px;
    .data {
      display: block;
      margin-left: 50px;
      .datalist {
        width: 60px;
        height: 30px;
        line-height: 30px;
        display: inline-block;
        text-align: center;
      }
    }
    .check {
      display: inline-block;
      width: 50px;
      .checklist {
        width: 50px;
        height: 30px;
        line-height: 30px;
        text-align: center;
      }
    }
    .checkbox {
      width: 425px;
      display: inline-block;
      .option {
        width: 60px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin: 0;
      }
    }
  }
  .bottom {
    background: #0a2757;
    display: block;
    padding: 10px;
    text-align: right;
  }
}
::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
  border-color: #2c3e50;
}
.smart_button_deep {
  background-color: #102f63 !important;
  border-radius: 4px !important;
  border: 1px solid #4f707f !important;
  color: #ffffff;
}
</style>
