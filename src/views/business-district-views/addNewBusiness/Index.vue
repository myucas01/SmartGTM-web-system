<template>
  <div class="addbox">
    <div class="centertbox">
      <div class="stepbox">
        <p
          v-for="(item, index) in pagelist"
          :key="index"
          :icon="item.key"
          :title="item.value"
          :class="
            (active > item.status ? 'active' : '') +
              (active == item.status ? 'onstatus' : '') +
              ' stepitem'
          "
        >
          <span class="iconbox" @click="getclick(index)">
            <i class="el-icon-success icons" v-show="active > item.status"></i>
            <p class="activeicons" v-show="active == item.status"></p>
            <p class="defultbox" v-show="active < item.status"></p>
            {{ item.value }}
          </span>
        </p>
      </div>
      <div class="detailBox">
        <CommonBasicDetail
          v-show="active == 0"
          :opentype="opentype"
          :status="null"
          :businessTitle="businessTitle"
          :CommonForm="Fromdata.CommonForm"
          @changeFromValue="addCommonForm"
          :configSave="configSave"
        ></CommonBasicDetail>
        <CheckTarget
          v-show="active == 0"
          :opentype="opentype"
          :businessTitle="businessTitle"
          :CheckTargetForm="Fromdata.CheckTargetForm"
          @changeFromValue="addCheckTargetForm"
          :configSave="configSave"
        ></CheckTarget>
        <GradingStandard
          v-show="active == 1 && Fromdata.CheckTargetForm"
          :opentype="opentype"
          :businessTitle="businessTitle"
          @changeFromValue="addGradingForm"
          :CheckTargetForm="Fromdata.CheckTargetForm"
          :GradingForm="Fromdata.GradingForm"
          :configSave="configSave"
          :oldPrevel="oldPrevel"
        ></GradingStandard>
        <ScopeLayout
          v-show="active == 2"
          :opentype="opentype"
          :businessTitle="businessTitle"
          @changeFromValue="addScopeForm"
          :addScopeForm="Fromdata.addScopeForm"
          :configSave="configSave"
        ></ScopeLayout>
      </div>
      <span class="buttonbox">
        <el-button style="margin-top: 12px;" @click="before" size="small">{{
          active == 0 ? '取消' : '上一步'
        }}</el-button>
        <el-button
          type="primary"
          style="margin-top: 12px;"
          :disabled="!canSava"
          @click="next"
          size="small"
          >{{ active == 2 ? '创建完成' : '确认，下一步' }}</el-button
        >
      </span>
    </div>
  </div>
</template>
<script>
import CommonBasicDetail from './CommonBasicDetail.vue'
import GradingStandard from './GradingStandard.vue'
import CheckTarget from './CheckTarget.vue'
import ScopeLayout from './ScopeLayout.vue'
import BUSINESS_DISTRICT_API from '@api/business_district_api.js'
export default {
  data() {
    return {
      active: 0,
      opentype: 'addnew',
      businessTitle: null,
      pagelist: [
        {
          value: '选择分级指标',
          icon: 'el-icon-success',
          status: 0
        },
        {
          value: '设置标准',
          icon: 'el-icon-success',
          status: 1
        },
        {
          value: '选择布局范围',
          icon: 'el-icon-success',
          status: 2
        }
      ],
      Fromdata: {
        CommonForm: '',
        CheckTargetForm: '',
        GradingForm: '',
        addScopeForm: ''
      },
      oldPrevel: 1,
      configSave: true,
      canSava: true,
      targetChecks: [], //分级指标勾选情况
      proStandards: [] //分级标准集合
    }
  },
  components: {
    CommonBasicDetail,
    GradingStandard,
    CheckTarget,
    ScopeLayout
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.$store.commit('addTabs', {
        title: '新建方案',
        link: decodeURIComponent(vm.$route.fullPath),
        on: true,
        needCatch: true
      })
    })
  },
  methods: {
    getclick(value) {
      this.active = value
    },
    before() {
      // 流程后退一步
      if (this.active == 0) {
        this.closeaddTabs()
        // this.$router.push({
        //   path: '/business-district/business-district-scheme-list'
        // })
      }
      if (this.active-- < 1) this.active = 0
    },
    next() {
      // 流程前进一步
      if (this.active == 0) {
        // 判断第一步必填项及处理值
        if (this.Fromdata.CommonForm.name === '') {
          this.$message({ message: '必填项不能为空', type: 'warning' })
          return false
        }
        let newData = [],
          BccData = [],
          ShowData = []
        this.Fromdata.CheckTargetForm.forEach(item => {
          item.selectBcc === 'y' && BccData.push(item.selectBcc)
          item.selectShow === 'y' && ShowData.push(item.selectShow)
          if (item.selectBcc === 'y' || item.selectShow === 'y') {
            let newItem = {
              selectBcc: item.selectBcc,
              selectShow: item.selectShow,
              targetNo: item.targetNo
            }
            newData.push(newItem)
          }
        })
        if (BccData.length < 1 || ShowData.length < 1) {
          this.$message({
            message: '至少添加一项分级指标和可视化显示数据',
            type: 'warning'
          })
          return false
        }
        this.targetChecks = newData
      }
      if (this.active == 1) {
        // 判断第二部必填项及处理值
        let promptMessage = []
        if (this.Fromdata.GradingForm.length > 0) {
          this.Fromdata.GradingForm.forEach(item => {
            // 判断以及商圈
            const newData = item.proTargets.filter(
              Targesitem => Targesitem.minNum === '' || Targesitem.maxNum === ''
            )
            const newoneData = item.proTargets.filter(
              Targesitem => Targesitem.minNum === ''
            )
            if (
              ((newData.length > 0 || item.standardName === '') &&
                item.proLevel != 1) ||
              ((newoneData.length > 0 || item.standardName === '') &&
                item.proLevel == 1) ||
              !item.isCore
            ) {
              promptMessage.push(false)
            }
          })
          if (promptMessage.length > 0) {
            this.$message({
              message: '分级标准必填项不能为空',
              type: 'warning'
            })
            return
          }
          let newcheckData = []
          for (let i = 0; i < this.Fromdata.GradingForm.length; i++) {
            for (
              let j = 0;
              j < this.Fromdata.GradingForm[i].proTargets.length;
              j++
            ) {
              const oneDta = this.Fromdata.GradingForm[i + 1]
              if (oneDta) {
                // （1）----判断大于等于<小于
                const samllValue = oneDta.proTargets[j].minNum
                const bigValue = oneDta.proTargets[j].maxNum
                if (Number(samllValue) >= Number(bigValue)) {
                  newcheckData.push(false)
                }
              }
            }
          }
          if (newcheckData.length > 0) {
            this.$message({
              message: '分级标准：商圈级别有输入值未满足：大于等于 < 小于',
              type: 'warning',
              duration: 3000
            })
            return
          }
        } else {
          this.$message({
            message: '分级标准必填项不能为空',
            type: 'warning'
          })
          return
        }
      }
      if (this.active == 2) {
        if (this.Fromdata.addScopeForm.length < 1) {
          this.$message({
            message: '至少勾选一个营业部',
            type: 'warning'
          })
          return
        }
        // 调用创建商圈接口
        this.getBccUpset()
        return
      }
      if (this.active++ > 1) this.active = 0
    },
    addCommonForm(value) {
      //添加基本信息
      this.Fromdata.CommonForm = value
    },
    addCheckTargetForm(value) {
      //添加指标表单
      this.Fromdata.CheckTargetForm = value
    },
    addGradingForm(value) {
      //添加分级标准
      let proStandards = []
      let newitem
      if (value.length > 0) {
        value.forEach(item => {
          if (item.showbox) {
            let newTarges = []
            item.childen.forEach(childItem => {
              if (childItem.showvalue) {
                const maxData = childItem.childlist[1]
                  ? childItem.childlist[1].value
                  : ''
                const ninData = childItem.childlist[0].value
                let newchild = {
                  targetNo: childItem.targetNo,
                  maxNum: maxData,
                  minNum: ninData
                }
                newTarges.push(newchild)
                newitem = {
                  proLevel: JSON.stringify(item.index),
                  standardName: item.name,
                  proTargets: newTarges,
                  isCore: item.isCore
                }
              }
            })
            proStandards.push(newitem)
            this.proStandards = proStandards
          }
        })
      }
      this.Fromdata.GradingForm = this.proStandards
    },
    addScopeForm(value) {
      //添加布局范围
      this.Fromdata.addScopeForm = value
    },
    getBccUpset() {
      this.canSava = false
      // ******调用创建商圈接口
      let newPramas = {
        isUpdate: '0',
        orgIds: this.Fromdata.addScopeForm,
        proDate: this.Fromdata.CommonForm.year,
        proId: this.proId,
        proName: this.Fromdata.CommonForm.name,
        proQuarter: this.Fromdata.CommonForm.quarter,
        proStandards: this.proStandards,
        proStatus: JSON.stringify(this.Fromdata.CommonForm.status),
        targetChecks: this.targetChecks
      }
      BUSINESS_DISTRICT_API.get_bcc_upset(newPramas)
        .then(async res => {
          if (res.code === '200') {
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            setTimeout(() => {
              this.closeaddTabs()
            }, 1000)
          }
        })
        .catch(err => {
          console.log(err)
        })
      setTimeout(() => {
        this.canSava = true
      }, 3000)
    },
    closeaddTabs() {
      let newPages = JSON.parse(sessionStorage.getItem('pages'))
      let newitem = newPages.filter(
        item => item.link == '/business-district/addNewBusiness'
      )
      if (newitem.length > 0) {
        let obj = newitem[0]
        let clc = {
          path: obj.path,
          pam: obj.pam
        }
        let current = {
          path: this.$route.path,
          pam: this.$route.query
        }
        this.$nextTick(() => {
          this.$store.commit('closeTabs', {
            clc,
            current
          })
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-step__title.is-process {
  font-weight: 300;
  color: #930cea;
}
::v-deep .el-step__title.is-success {
  font-weight: 300;
  color: #19be6b;
}
::v-deep .el-step__title.is-wait {
  font-weight: 300;
  color: rgba(0, 0, 0, 0.45);
}
.addbox {
  flex: 1;
  padding: 40px;
  background-color: #f0f2f5;
  .centertbox {
    width: 1200px;
    margin: auto;
    .detailBox {
      height: calc(100vh - 220px);
      display: block;
    }
    .stepbox {
      display: flex;
      justify-content: space-around;
      color: rgba(0, 0, 0, 0.45);
      font-size: 12px;
      .active {
        color: #19be6b;
      }
      .onstatus {
        color: #930cea;
      }
      .stepitem {
        cursor: pointer;
        position: relative;
        width: 160px;
        text-align: center;
        display: flex;
        &:after {
          content: '';
          height: 1px;
          width: 200px;
          background-color: #ced3dd;
          display: block;
          position: absolute;
          right: -200px;
          top: 8px;
        }
        &:last-child {
          &:after {
            content: '';
            height: 0px;
            width: 0px;
          }
        }
        .iconbox {
          display: flex;
          align-content: center;
          justify-content: space-around;
        }
        .defultbox {
          width: 16px;
          height: 16px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 16px;
          display: inline-block;
          margin-right: 5px;
        }
      }
      .icons {
        font-size: 18px;
        margin-right: 5px;
      }
      .activeicons {
        width: 16px;
        height: 16px;
        border: 1px solid #930cea;
        border-radius: 16px;
        display: inline-block;
        margin-right: 5px;
        position: relative;
        &:after {
          content: '';
          width: 10px;
          height: 10px;
          margin: 3px;
          border-radius: 10px;
          position: absolute;
          background-color: #930cea;
          top: 0px;
          left: 0px;
        }
      }
    }
    .buttonbox {
      text-align: center;
      display: block;
      .el-button--small {
        padding: 9px 35px;
      }
    }
  }
}
</style>
