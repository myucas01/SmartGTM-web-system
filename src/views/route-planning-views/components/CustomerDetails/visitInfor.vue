<template>
  <div class="main_visit">
    <p class="top">
      <span class="visitlist" v-for="(item, index) in infor" :key="index">
        <p class="title">{{ item.key }}</p>
        ：
        <span style="width:90%; display:flex;">
          <p v-show="!editeStatu" class="infor">{{ item.value }}</p>
          <el-cascader
            v-if="editeStatu && item.type == 'cascader'"
            v-model="generationArr"
            :options="item.options"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange($event, item.key)"
          ></el-cascader>
          <el-select
            v-model="item.value"
            placeholder="请选择"
            size="mini"
            v-if="
              editeStatu && item.type == 'select' && item.key == '*拜访频次'
            "
            class="smart_select_deep"
            @change="handleChange($event, item.key)"
          >
            <el-option
              v-for="option in item.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
          <el-select
            v-model="severDay"
            placeholder="请选择"
            class="selectInput smart_select_deep"
            size="mini"
            multiple
            :multiple-limit="Number(updatainfor.visitRate)"
            v-if="editeStatu && item.key == '*所属服务日'"
          >
            <el-option
              v-for="(item, index) in Daylist"
              :key="index"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
          <span class="input" v-else-if="editeStatu && item.type == 'input'">
            <el-input
              v-model="item.options"
              placeholder="请输入内容"
              size="mini"
              class="smart_input_deep"
              @change="handleChange($event, item.key)"
            ></el-input
            >分钟/次
          </span>
        </span>
      </span>
    </p>
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
        v-auth= "'lineplan:build:mapshow:storedetail:updateinfo'"
        v-else-if="!editeStatu"
        type="primary"
        size="mini"
        :disabled="ServiceButton || !edit"
        @click="getEditer()"
        >编辑</el-button
      >
    </span>
  </div>
</template>
<script>
import Api from '@api/route/planpreview_api.js'
import { mapGetters } from 'vuex'
import { eventBus } from '@/util/eventBut.js'
export default {
  name: 'VisitInfor',
  props: [
    'VisitInforData',
    'programId',
    'storeData',
    'getVisitInformation',
    'ServiceButton',
    'edit',
    'handlerClick'
  ],
  data() {
    return {
      // 列表展示数据
      areadata: [],
      Daylist: [
        {
          value: '1',
          label: '周一'
        },
        {
          value: '2',
          label: '周二'
        },
        {
          value: '3',
          label: '周三'
        },
        {
          value: '4',
          label: '周四'
        },
        {
          value: '5',
          label: '周五'
        },
        {
          value: '6',
          label: '周六'
        },
        {
          value: '7',
          label: '周日'
        }
      ],
      scaleList: [
        {
          value: '1',
          label: '一周一访'
        },
        {
          value: '2',
          label: '一周两访'
        },
        {
          value: '3',
          label: '一周三访'
        }
      ],
      infor: [],
      editeStatu: false,
      visitTimethreeType: false,
      updatainfor: {},
      severDay: null,
      postPrams: null,
      generationArr: null
    }
  },
  computed: {
    ...mapGetters('routerPlanning', [])
  },
  mounted() {
    this.init()
    this.getSalesPrecinct()
  },
  watch: {
    VisitInforData: {
      deep: true,
      handler: function(newval) {
        this.init(newval)
      }
    }
  },
  methods: {
    init(data) {
      let newData
      if (data) {
        newData = data
      } else {
        newData = this.VisitInforData
      }
      const {
        empName,
        precinctName,
        precinctNo,
        salesName,
        shopTime,
        visitRate,
        weekDay
      } = newData
      let nowRate
      switch (visitRate) {
        case '1':
          nowRate = '一'
          break
        case '2':
          nowRate = '二'
          break
        case '3':
          nowRate = '三'
          break
        default:
          nowRate = '一'
          break
      }
      this.severDay = weekDay.split(',')
      let newVisitRate = '一周' + nowRate + '访'
      this.generationArr = precinctNo
      this.updatainfor.shopTime = shopTime
      this.updatainfor.visitRate = visitRate || '1'
      const newvalue =
        (salesName || '暂无区域') +
        '>' +
        (precinctName || '暂无岗位') +
        (empName ? '>' + empName : '')
      const infor = [
        {
          key: '*所属岗位、区域',
          value: newvalue,
          options: [],
          type: 'cascader',
          id: 0
        },
        {
          key: '*拜访频次',
          value: newVisitRate || '暂无',
          options: [],
          type: 'select',
          id: 2
        },
        {
          key: '*所属服务日',
          value: weekDay || '暂无',
          options: [],
          type: 'select',
          id: 1
        },
        {
          key: '在店时长',
          value: shopTime ? shopTime + '分钟/次' : '暂无分钟/次',
          options: [],
          type: 'input',
          id: 3
        }
      ]
      this.infor = infor
      this.infor.forEach(item => {
        switch (item.id) {
          case 0: //所属岗位、区域
            item.options = this.areadata
            break
          case 1: //所属服务日
            item.options = this.Daylist
            break
          case 2: //拜访频次
            item.options = this.scaleList
            break
          case 3: //在店时长
            item.options = shopTime ? shopTime : ''
            break
        }
      })
    },
    getEditer(value) {
      if (value === 'save') {
        if (Number(this.updatainfor.visitRate) !== this.severDay.length) {
          this.$message({ message: '请选择完整的所属服务日', type: 'warning' })
          return
        }
        // 保存
        let newData = []
        this.severDay.forEach(item => {
          switch (item) {
            case '周一':
              item = '1'
              break
            case '周二':
              item = '2'
              break
            case '周三':
              item = '3'
              break
            case '周四':
              item = '4'
              break
            case '周五':
              item = '5'
              break
            case '周六':
              item = '6'
              break
            case '周日':
              item = '7'
              break
          }
          newData.push(item)
        })
        if (newData.filter(item => item === newData[0]).length > 1) {
          this.$message({ message: '多访不能选择相同服务日', type: 'warning' })
          return
        }
        let laseValue = newData.join(',')
        const params = {
          shopTime: this.updatainfor.shopTime,
          visitRate: this.updatainfor.visitRate,
          planId: this.programId, //  计划id
          storeId: this.storeData.storeId, //  门店id
          storeName: this.storeData.storeName, //  门店名
          storeNo: this.storeData.storeCode, //  门店编号
          precinctNo:
            typeof this.generationArr == 'string'
              ? this.generationArr
              : this.generationArr[1], //  门店编号
          weekDay: laseValue
        }
        Api.get_updata_information(params)
          .then(res => {
            if (res.code === '200') {
              this.$message({ message: res.message, type: 'success' })
              this.getVisitInformation(
                this.storeData.storeId,
                this.storeData.areaId
              )
              this.editeStatu = !this.editeStatu
              eventBus.$emit('handle-node-click','调整点位所属区域')
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
    },
    getSalesPrecinct() {
      Api.get_sales_precinct({
        planId: this.programId,
        isLoading: false
      })
        .then(res => {
          if (res.code == '200') {
            if (res.data.length > 0) {
              let newdata = []
              res.data.forEach(item => {
                let newchildren = []
                item.salesPrecinctList.forEach(newitem => {
                  const newsales = {
                    value: newitem.precinctNo,
                    label:
                      newitem.precinctName +
                      (newitem.empName ? '>' + newitem.empName : '')
                  }
                  newchildren.push(newsales)
                })
                const newlist = {
                  value: item.salesType,
                  label: item.salesName,
                  children: newchildren
                }
                newdata.push(newlist)
              })
              this.areadata = newdata
              this.init()
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleChange(e, value) {
      switch (value) {
        case '*所属岗位、区域':
          break
        case '*所属服务日':
          break
        case '*拜访频次':
          // visitRate
          this.updatainfor.visitRate = e
          break
        case '在店时长':
          this.updatainfor.shopTime = e
          break
        default:
          break
      }
    }
  }
}
</script>
<style scoped lang="scss">
.main_visit {
  width: 400px;
  .top {
    padding: 10px 10px;
  }
  .visitlist {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    align-items: center;
    .title {
      width: 30%;
      text-align: right;
    }
    .infor {
      width: 100%;
      font-weight: 600;
    }
  }
  .bottom {
    background: #0a2757;
    display: block;
    padding: 10px;
    text-align: right;
  }
}

::v-deep .el-select {
  width: 79%;
  display: inline-block;
}
.input {
  width: 100%;
  ::v-deep .el-input {
    width: 62%;
    display: inline-block;
    margin-right: 5px;
  }
}
::v-deep .el-cascader .el-input .el-input__inner {
  background-color: #102f63 !important;
  border-radius: 4px !important;
  border: 1px solid #8199a4 !important;
  color: #ffffff;
  height: 28px;
  line-height: 28px;
  width: 100%;
}
.smart_button_deep {
  background-color: #102f63 !important;
  border-radius: 4px !important;
  border: 1px solid #8199a4 !important;
  color: #ffffff;
}
</style>
