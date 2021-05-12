<template>
  <div>
    <p class="pagetitle" v-show="opentype == 'addnew'">请录入指标分级</p>
    <div class="pagebox">
      <div class="title">
        {{ opentype !== 'addnew' ? businessTitle : '' }}分级标准
      </div>
      <div
        :class="
          'inforbox ' +
            (opentype == 'addnew' ? 'newinforbox' : 'configinforbox')
        "
      >
        <span>
          <p class="selectName">商圈级别种类</p>
          <el-select
            v-model="value"
            size="mini"
            placeholder="请选择"
            @change="getChangeValue"
            :disabled="!configSave"
          >
            <el-option
              v-for="newitem in options"
              :key="newitem.value"
              :label="newitem.label"
              :value="newitem.value"
            >
            </el-option>
          </el-select>
        </span>
        <p class="itembox">
          <span class="listtitle">
            <p
              v-for="(item, index) in titlelist"
              :key="index"
              class="table1 titletab title"
              v-show="item.showvalue"
            >
              {{ item.name }}
              {{ item.targetUnit ? '(' + item.targetUnit + ')' : '' }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.tips"
                placement="top"
                v-show="item.name !== '商圈级别' && item.tips"
                ><i class="el-icon-question incotips"></i>
              </el-tooltip>
            </p>
          </span>
          <span
            v-for="(item, childenindex) in newchildenlist"
            :key="childenindex"
            class="listitem"
            v-show="item.showbox"
          >
            <p class="table1 newtab">
              <span class="starticon">*</span>
              <el-input
                v-model="item.name"
                size="mini"
                placeholder="请输入商圈级别名称"
                maxlength="20"
                :disabled="!configSave"
              ></el-input>
              <span class="starticon select">*</span>
               <el-select class="inSelect" size="mini" width="30" v-model="item.isCore" placeholder="请选择">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </p>
            <p
              class="table1 newtab"
              v-for="(newitem, newindex) in item.childen"
              :key="newindex"
              v-show="newitem.showvalue"
            >
              <span
                v-for="(valueitem, valueindex) in newitem.childlist"
                :key="valueindex"
                class="tableitembox"
              >
                <p class="itemtag" v-show="valueindex">-</p>
                <p class="itemtitle">{{ valueitem.key }}</p>
                <p class="starticon">*</p>
                <el-input
                  class="iteminput"
                  size="mini"
                  v-model="valueitem.value"
                  placeholder="整数"
                  maxlength="10"
                  @blur="getinput($event, valueitem)"
                  :disabled="!configSave"
                ></el-input>
              </span>
            </p>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: [
    'opentype',
    'businessTitle',
    'CheckTargetForm',
    'GradingForm',
    'oldPrevel',
    'configSave'
  ],
  data() {
    return {
      nowYear: null,
      titlelist: [],
      childenlist: [],
      newchildenlist: [],
      options: [],
      value: this.oldPrevel,
      checkData: [],
      typeOptions:[{
          value: 1,
          label: '城区'
        }, {
          value: 2,
          label: '乡镇'
        }]
    }
  },
  created() {},
  watch: {
    CheckTargetForm: {
      deep: true,
      handler: function(newval) {
        this.buildList(newval)
      }
    },
    newchildenlist: {
      deep: true,
      handler: function(newval) {
        setTimeout(() => {
          // 将分级指标数据赋值给入参
          this.$emit('changeFromValue', newval)
        }, 1000)
      }
    }
  },
  mounted() {
    this.buildList()
  },
  methods: {
    buildList() {
      let optionData = []
      let childData = []
      for (let i = 1; i < 11; i++) {
        optionData.push({
          lable: i,
          value: i
        })
        let newData = []
        let newName = ''
        let newisCore = null
        // *****【1】构建分级标准显示项的内容
        if (
          this.GradingForm &&
          this.GradingForm.length > 0 &&
          this.GradingForm[i - 1]
        ) {
          // （1）----如果是编辑，则将默认值赋值给分级标准输入框list
          const { standardName, proTargets, proLevel, isCore } = this.GradingForm[i - 1]
          newName = standardName
          newisCore = isCore
          if (Number(proLevel) == 1) {
            proTargets &&
              proTargets.forEach(item => {
                let newitem
                newitem = {
                  childlist: [
                    {
                      value: item.minNum,
                      key: '大于等于'
                    }
                  ],
                  targetNo: item.targetNo
                }
                newData.push(newitem)
              })
          } else {
            proTargets &&
              proTargets.forEach(item => {
                let newitem2
                const { minNum, maxNum } = item
                newitem2 = {
                  childlist: [
                    {
                      value: minNum,
                      key: '大于等于'
                    },
                    {
                      value: maxNum,
                      key: '小于'
                    }
                  ],
                  targetNo: item.targetNo
                }
                newData.push(newitem2)
              })
          }
        }
        // （2）----如果是新增，则构建分级标准list空值框
        childData.push({
          name: newName,
          childen: newData,
          isCore: newisCore,
          showbox: i <= this.value ? true : false,
          index: i
        })
      }
      this.options = optionData
      this.childenlist = childData
      // *****【2】再根据指标勾选判断方案列表显示
      this.getListData(this.CheckTargetForm)
    },
    getListData(list) {
      //*****【2】根据指标勾选判断方案列表显示
      let newData = [
        {
          name: '商圈级别',
          tips: '',
          showvalue: true,
          index: 0
        }
      ]
      let havechilden = [],
        onechilden = [],
        twoChilden = []
      if (list && list.length > 0) {
        list.forEach((item, index) => {
          if (item.selectBcc === 'y') {
            havechilden.push(item.targetNo)
          }
          // （1）----控制title显示的列表
          let newtitleitem = {
            name: item.targetName + '等级标准',
            tips: item.tips,
            showvalue: item.selectBcc == 'y' ? true : false,
            index: index + 1,
            targetNo: item.targetNo,
            targetUnit: item.targetUnit
          }
          newData.push(newtitleitem)
          // （2）----控制其他输入项的显示列表
          let oneitem = {
            childlist: [
              {
                value: '',
                key: '大于等于'
              }
            ],
            showvalue: false,
            index: index + 1,
            targetNo: item.targetNo,
            name: item.targetName
          }
          let twoitem = {
            childlist: [
              {
                value: '',
                key: '大于等于'
              },
              {
                value: '',
                key: '小于'
              }
            ],
            showvalue: false,
            index: index + 1,
            targetNo: item.targetNo,
            name: item.targetName
          }
          // 只有大于指标值的列表
          onechilden.push(oneitem)
          // 包含大于等于和小于指标值的列表
          twoChilden.push(twoitem)
        })
        // （3）----将列表赋值给demo
        this.titlelist = newData
        // （4）----将输入框值赋值给demo----根据商圈层级判断方案列表显示
        this.childenlist.forEach((childitem, index) => {
          // 处理没有指标标准时，构建指标标准的默认demo
          if (index == 0) {
            onechilden.forEach(oneitem => {
              const havaData = childitem.childen.filter(
                newitem => newitem.targetNo == oneitem.targetNo
              )
              if (havaData.length > 0) {
                oneitem.childlist = havaData[0].childlist
                oneitem.showvalue = havaData[0].showvalue
              }
            })
            childitem.childen = onechilden
          } else {
            let newtwoChilden = JSON.parse(JSON.stringify(twoChilden))
            newtwoChilden.forEach(twoitem => {
              const havaData = childitem.childen.filter(
                newitem => newitem.targetNo == twoitem.targetNo
              )
              if (havaData.length > 0) {
                twoitem.childlist = havaData[0].childlist
                twoitem.showvalue = havaData[0].showvalue
              }
            })
            childitem.childen = newtwoChilden
          }
          // 再根据勾选指标判断输入项的显示和隐藏
          childitem.childen.forEach(newitem => {
            if (havechilden.includes(newitem.targetNo)) {
              newitem.showvalue = true
            }
          })
          if (index < this.value) {
            childitem.showbox = true
          } else {
            childitem.showbox = false
          }
        })
      }
      this.newchildenlist = this.childenlist
      // *****【3】获取到输入项列表所有的值后，对列表值进行判断
      this.CalculatesVal(this.newchildenlist)
    },
    CalculatesVal(data) {
      // *****【3】获取到输入项列表所有的值后，对列表值进行判断
      let newcheckData = []
      if (data && this.CheckTargetForm) {
        for (let i = 0; i < data.length - 1; i++) {
          for (let j = 0; j < this.CheckTargetForm.length; j++) {
            const oneDta = data[i + 1].childen[j]
            const twoDta = data[i].childen[j]
            // 大于等于的值默认为0
            let newData = data[this.value-1].childen.filter(item => item.showvalue)
              if (newData.length > 0) {
                newData.forEach(item => {
                  let endvalue = item.childlist.filter(
                    item => item.key === '大于等于'
                  )
                  endvalue[0].value = 0
                })
              }
            if (oneDta && twoDta) {
              // （1）----上一级的小于等于下一级的大于等于
              oneDta.childlist.filter(
                item => item.key == '小于'
              )[0].value = twoDta.childlist.filter(
                item => item.key == '大于等于'
              )[0].value
              // （2）----判断大于等于<小于
              const samllValue = oneDta.childlist.filter(
                item => item.key === '大于等于'
              )[0].value
              const bigValue = oneDta.childlist.filter(
                item => item.key === '小于'
              )[0].value
              if (
                Number(samllValue) >= Number(bigValue) &&
                Number(samllValue) != 0 &&
                Number(bigValue) != 0
              ) {
                newcheckData.push(false)
              }
            }
          }
        }
      }
      this.checkData = newcheckData
    },
    getChangeValue() {
      this.buildList()
      // *****【3】获取到输入项列表所有的值后，对列表值进行判断
      this.CalculatesVal(this.newchildenlist)
    },
    getinput(e, item) {
      // *****【3】获取到输入项列表所有的值后，对列表值进行判断
      this.CalculatesVal(this.newchildenlist)
      // 对输入框的数字进行规则判断
      if (!/(^[0-9]\d*$)/.test(e.target.value) || this.checkData.length > 0) {
        this.$message({
          message:
            '分级标准所有输入值需满足:(1) 整数 (2) 同级别商圈输入值：大于等于 < 小于',
          type: 'warning',
          duration: 5000
        })
        e.target.value = ''
        item.value =''
        // 对输入框的数字进行规则判断
        this.CalculatesVal(this.newchildenlist)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.pagetitle {
  width: 173px;
  height: 33px;
  font-size: 24px;
  font-weight: 600;
  color: #1e2840;
  line-height: 33px;
  margin: 33px auto 27px auto;
  text-align: center;
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
  .newinforbox {
    height: calc(100vh - 390px);
    .itembox {
      display: block;
      width: 100%;
      border: 1px solid #e0e6ed;
      max-height: calc(100vh - 430px);
      overflow-x: auto;
      overflow-y: hidden;
    }
  }
  .configinforbox {
    display: block;
    .itembox {
      display: block;
      width: 100%;
      border: 1px solid #e0e6ed;
      overflow-x: auto;
      overflow-y: hidden;
    }
  }
  .inforbox {
    padding: 20px 3%;
    overflow: hidden;
    .starticon {
      color: red;
      margin: 0 2px;
      vertical-align: middle;
    }
    .selectName {
      display: inline-block;
      margin-right: 27px;
      margin-bottom: 20px;
    }
    .listtitle {
      height: 35px;
      display: flex;
      max-width: 1200px;
      font-weight: 600;
      border-bottom: 1px solid #e0e6ed;
      .title {
        justify-content: space-between;
      }
    }
    .listitem {
      height: 46px;
      display: flex;
      max-width: 1200px;
      &:last-child {
        .table1 {
          border-bottom: none;
        }
      }
    }
    .table1 {
      flex: 1;
      min-width: 320px;
      border-right: 1px solid #e0e6ed;
      border-bottom: 1px solid #e0e6ed;
      padding: 0 1%;
      float: left;
      display: flex;
      // justify-content: space-between;
      align-items: center;
      &:last-child {
        border-right: none;
      }
      .incotips {
        font-size: 13px;
        color: #afafaf;
      }
      .tableitembox {
        display: flex;
        justify-content: space-around;
      }
      .itemtitle {
        display: inline-block;
        color: #b1b1b1;
      }
      .itemtag {
        display: inline-block;
        margin: 0 5px;
        font-weight: bold;
      }
      .iteminput {
        display: inline-block;
        width: 100px;
        margin: 0 3px;
      }
    }
    .titletab {
      height: 35px;
      line-height: 35px;
      background-color: #f8f8f9;
    }
    .newtab {
      height: 45px;
      line-height: 45px;
      background-color: #ffffff;
      .select {
        margin-left: 15px;
      }
    }
  }
}
</style>
