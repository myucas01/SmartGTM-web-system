<template>
  <div class="newBusiness">
    <div class="pagebox">
      <p class="title">
        {{ opentype !== 'addnew' ? businessTitle : '' }}商圈指标勾选
      </p>
      <div
        :class="
          'inforbox ' + (opentype !== 'addnew' ? 'configstyle' : 'newstyle')
        "
      >
        <p class="itembox">
          <span class="listtitle">
            <p
              v-for="(item, index) in titlelist"
              :key="index"
              :class="item.className + ' titletab'"
            >
              {{ item.name }}
              <el-checkbox
                v-model="item.value"
                v-show="item.check == 1"
                @change="getcheck(item)"
                :disabled="!configSave"
              ></el-checkbox>
            </p>
          </span>
          <span
            class="listitem"
            v-for="(item, titindex) in newChildList"
            :key="titindex"
          >
            <p class="table1 newtab">
              {{ item.name }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.tips"
                placement="right"
                v-show="item.tips"
                ><i class="el-icon-question incotips"></i>
              </el-tooltip>
            </p>
            <p class="table2 newtab">
              <el-select
                v-model="item.value"
                v-show="item.showvalue == 1"
                size="mini"
                placeholder="请选择"
                :disabled="!configSave"
              >
                <el-option
                  v-for="newitem in item.options"
                  :key="newitem.value"
                  :label="newitem.label"
                  :value="newitem.value"
                >
                </el-option>
              </el-select>
            </p>
            <p class="table3 newtab">
              <el-checkbox
                v-model="item.addcheck"
                v-show="item.showadd == 1"
                @change="getcheck(item)"
                :disabled="!configSave"
              ></el-checkbox>
            </p>
            <p class="table4 newtab">
              <el-checkbox
                v-model="item.showcheck"
                @change="getcheck(item)"
                :disabled="!configSave"
              ></el-checkbox>
            </p>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import BUSINESS_DISTRICT_API from '@api/business_district_api.js'
export default {
  name: 'Index',
  props: ['opentype', 'businessTitle', 'CheckTargetForm', 'configSave'],
  data() {
    return {
      nowYear: null,
      titlelist: [
        { name: '指标', check: 0, value: false, className: 'table1' },
        { name: '单位', check: 0, value: false, className: 'table2' },
        { name: '添加分级指标', check: 1, value: false, className: 'table3' },
        { name: '可视化显示数据', check: 1, value: false, className: 'table4' }
      ],
      childenlist: [],
      newChildList: []
    }
  },
  created() {},
  mounted() {
    this.getBccTarget()
    const data = new Date()
    this.nowYear = data.getFullYear()
  },
  watch: {
    childenlist: {
      deep: true,
      handler: function(newval) {
        this.disposeList(newval)
      }
    }
  },
  methods: {
    async getBccTarget() {
      // ******获取指标内容
      await BUSINESS_DISTRICT_API.get_bcc_target({isLoading:false})
        .then(async res => {
          if (res.code === '200') {
            let scopeData = await res.data
            if (res.data.length > 0) {
              scopeData.forEach(item => {
                let showadd, showdata, showvalue
                if (item.isBcc === 'y') {
                  showadd = 1
                } else {
                  showadd = 0
                }
                if (item.isShow === 'y') {
                  showdata = 1
                } else {
                  showdata = 0
                }
                if (item.targetUnit) {
                  showvalue = 1
                } else {
                  showvalue = 0
                }
                let newitem = {
                  name: item.targetName,
                  tips: item.targetTip,
                  value: item.targetUnit,
                  targetNo: item.targetNo,
                  showadd,
                  showdata,
                  showvalue,
                  showcheck: false,
                  addcheck: false,
                  options: [
                    {
                      lable: item.targetUnit,
                      value: item.targetUnit
                    }
                  ]
                }
                this.childenlist.push(newitem)
              })
              this.newChildList = this.childenlist
              this.getEditValue()
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.getCheckall()
    },
    getEditValue() {
      //如果是新增，则修改新增的值
      if (this.opentype !== 'addnew') {
        this.CheckTargetForm.forEach(item => {
          let newData = this.childenlist.filter(
            newitem => newitem.targetNo == item.targetNo
          )
          if (newData.length > 0) {
            const { selectBcc, selectShow, targetUnit } = item
            if (selectBcc == 'y') {
              newData[0].addcheck = true
            } else {
              newData[0].addcheck = false
            }
            if (selectShow == 'y') {
              newData[0].showcheck = true
            } else {
              newData[0].showcheck = false
            }
            newData[0].value = targetUnit
          }
        })
      }
    },
    getcheck(data) {
      // 判断添加分级指标是否全选
      if (data.name === '添加分级指标') {
        this.childenlist.forEach(item => {
          if (item.showadd == 1) {
            item.addcheck = data.value
          }
        })
      } else if (data.name === '可视化显示数据') {
        // 判断可视化显示数据是否全选
        this.childenlist.forEach(item => {
          if (item.showdata == 1) {
            item.showcheck = data.value
          }
        })
      } else {
        this.getCheckall()
      }
    },
    // 判断是否全选
    getCheckall() {
      // 判断添加分级指标是否全选
      const addnew = this.childenlist.filter(item => item.showadd == 1)
      if (addnew.length > 0) {
        const addvalue = addnew.every(newitem => newitem.addcheck)
        this.titlelist.filter(
          item => item.name === '添加分级指标'
        )[0].value = addvalue
      }
      // 判断可视化显示数据是否全选
      const datanew = this.childenlist.filter(item => item.showdata == 1)
      if (datanew.length > 0) {
        const datavalue = datanew.every(newitem => newitem.showcheck)
        this.titlelist.filter(
          item => item.name === '可视化显示数据'
        )[0].value = datavalue
      }
    },
    disposeList(data) {
      let newData = []
      data.forEach(item => {
        let newitem = {
          selectBcc: item.addcheck ? 'y' : 'n',
          selectShow: item.showcheck ? 'y' : 'n',
          targetNo: item.targetNo,
          targetName: item.name,
          tips: item.tips,
          targetUnit: item.value
        }
        newData.push(newitem)
      })
      this.$emit('changeFromValue', newData)
    }
  }
}
</script>

<style scoped lang="scss">
.newBusiness {
  display: block;
}
::-webkit-scrollbar-thumb {
  background-color: #dddee1 !important;
}
::-webkit-scrollbar-track {
  background-color: #f8f8f9 !important;
  border: 1px solid #e0e6ed;
  box-shadow: none;
  border-radius: 0;
}
.pagebox {
  background-color: #ffffff;
  margin: 15px 0;
  .title {
    padding: 10px 30px;
    text-align: left;
    border-bottom: 1px solid #ced3dd;
    color: #000;
    font-size: 14px;
    font-weight: 600;
  }
  .newstyle {
    padding: 20px 3%;
    height: calc(100vh - 620px);
    overflow-y: auto;
    display: block;
  }
  .configstyle {
    padding: 20px 3%;
    display: block;
  }
  .inforbox {
    .itembox {
      min-height: 80px;
      overflow: hidden;
      display: block;
    }
    .listtitle {
      height: 36px;
      display: flex;
    }
    .listitem {
      height: 46px;
      display: flex;
      &:last-child {
        border-bottom: 1px solid #e0e6ed;
      }
    }
    .table1 {
      flex: 1;
      border-left: 1px solid #e0e6ed;
      padding: 0 1%;
      float: left;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .incotips {
        font-size: 13px;
        color: #afafaf;
      }
    }
    .table2 {
      flex: 1;
      border-left: 1px solid #e0e6ed;
      padding: 0 1%;
      float: left;
    }
    .table3 {
      flex: 2;
      border-left: 1px solid #e0e6ed;
      text-indent: 60%;
      float: left;
    }
    .table4 {
      flex: 1;
      border-right: 1px solid #e0e6ed;
      padding: 0 1%;
      text-align: center;
      float: left;
    }
    .titletab {
      height: 35px;
      line-height: 35px;
      border-top: 1px solid #e0e6ed;
      background-color: #f8f8f9;
    }
    .newtab {
      height: 45px;
      line-height: 45px;
      border-top: 1px solid #e0e6ed;
      background-color: #ffffff;
    }
  }
}
</style>
