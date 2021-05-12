<template>
  <div class="ovalbox">
    <div class="querybox">
      <span class="titlebox">{{ pagetitle }}</span>
      <span class="checkbox">
        <p
          v-for="(item, index) in titlelist"
          :key="index"
          @click="configItem(item.key)"
          :class="item.key == checkValue ? 'active' : ''"
        >
          {{ item.value }}
        </p>
      </span>
      <ConfigDetails
        :proId="proId"
        v-if="checkValue == 0"
        @getPageTitle="getPageTitle"
        @getFromData="getFromData"
        :configSave="configSave"
        ref="Config"
      ></ConfigDetails>
      <SeetingDetails
        v-else-if="checkValue == 1"
        :proId="proId"
        :proNumber="proNumber"
        :proYear="proYear"
        :proQuarter="proQuarter"
        :proName="proName"
      ></SeetingDetails>
    </div>
    <span class="buttonbox">
      <el-button
        style="margin-top: 12px;"
        @click="saveEdit"
        size="small"
        :type="showSavebutton && checkValue == 0 ? 'primary' : ''"
        :disabled="!canSava"
        v-if="showSavebutton && checkValue == 0"
        >保存</el-button
      >
      <el-button
        :type="checkValue == 0 ? '' : 'primary'"
        style="margin-top: 12px;"
        @click="cancelEdit"
        size="small"
        >{{ checkValue == 0 ? '取消' : '返回' }}</el-button
      >
    </span>
  </div>
</template>

<script>
import { Authorities } from '@/util/authority.js'
import ConfigDetails from './ConfigDetails.vue'
import SeetingDetails from './SeetingDetails.vue'
import BUSINESS_DISTRICT_API from '@api/business_district_api.js'
export default {
  name: 'Index',
  data() {
    return {
      titlelist: [
        {
          value: '配置基本信息',
          key: 0
        },
        {
          value: '商圈设置明细',
          key: 1
        }
      ],
      checkValue: 0,
      pagetitle: '',
      Fromdata: {},
      proId: '',
      targetChecks: [], //分级指标勾选情况
      oldPrams: null,
      proNumber: null,
      proYear: null,
      proQuarter: null,
      proName: null,
      configSave: false,
      showSavebutton: false,
      canSava: true
    }
  },
  components: {
    ConfigDetails,
    SeetingDetails
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const { proName } = vm.$route.query
      // 通过 `vm` 访问组件实例
      vm.$store.commit('addTabs', {
        title: proName,
        link: decodeURIComponent(vm.$route.fullPath),
        on: true,
        needCatch: true
      })
    })
  },
  created() {},
  mounted() {
    const { proId } = this.$route.query
    this.proId = proId
    this.showSaveButton(this.checkValue)
    this.configSave = Authorities('business:layout:basicinfo:save')
  },
  watch: {
    checkValue(newvalue) {
      this.showSaveButton(newvalue)
    }
  },
  methods: {
    configItem(value) {
      this.checkValue = value
    },
    async saveEdit() {
      if (this.checkValue == 0) {
        // 判断基本信息必填项
        if (this.Fromdata.CommonForm.name === '') {
          this.$message({ message: '必填项不能为空', type: 'warning' })
          return
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
        // 判断指标勾选必填
        if (BccData.length < 1 || ShowData.length < 1) {
          this.$message({
            message: '至少添加一项分级指标和可视化显示数据',
            type: 'warning'
          })
          return
        }
        this.targetChecks = newData
        // 判断商圈分级标准必填
        let promptMessage = []
        if (this.Fromdata.GradingForm.length > 0) {
          this.Fromdata.GradingForm.forEach(item => {
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
        // 判断布局范围必填
        if (this.Fromdata.addScopeForm.length < 1) {
          this.$message({
            message: '至少勾选一个营业部',
            type: 'warning'
          })
          return
        }
        this.canSava = false
        // 判断入参有无改动
        let newprams = {
          orgIds: this.Fromdata.addScopeForm,
          proDate: this.Fromdata.CommonForm.year,
          proId: this.proId,
          proName: this.Fromdata.CommonForm.name,
          proQuarter: this.Fromdata.CommonForm.quarter,
          proStandards: this.Fromdata.GradingForm,
          proStatus: this.Fromdata.CommonForm.status,
          targetChecks: this.targetChecks
        }
        this.oldPrams.proStandards.forEach((item, index) => {
          if (index == 0) {
            item.proTargets.forEach(newitem => {
              newitem.maxNum = ''
            })
          }
        })
        if (
          JSON.stringify(this.oldPrams.proStandards) ===
          JSON.stringify(newprams.proStandards)
        ) {
          newprams.isUpdate = '0'
        } else {
          newprams.isUpdate = '1'
        }
        // ******调用创建商圈接口
        await BUSINESS_DISTRICT_API.get_bcc_upset(newprams)
          .then(async res => {
            if (res.code === '200') {
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this.$refs.Config.getProjectInfo(this.proId)
              setTimeout(() => {
                this.$router.push({
                  path: 'ConfigDetails',
                  query: { proId: this.proId, proName: this.pagetitle }
                })
                window.location.reload()
                this.closeEditTabs()
              }, 1000)
            }
          })
          .catch(err => {
            console.log(err)
          })
        setTimeout(() => {
          this.canSava = true
        }, 3000)
      }
    },
    getPageTitle(value) {
      this.proNumber = value.proNo
      this.oldPrams = value
      this.proYear = value.proDate
      this.proQuarter = value.proQuarter
      this.proName = value.proName
      this.pagetitle = value.proName
    },
    getFromData(value) {
      this.Fromdata = value
    },
    cancelEdit() {
      this.closeEditTabs()
    },
    closeEditTabs() {
      let newPages = JSON.parse(sessionStorage.getItem('pages'))
      let newitem = newPages.filter(
        item => item.pam.proId == this.$route.query.proId
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
    },
    showSaveButton(value) {
      if (value == 0 && Authorities('business:layout:basicinfo:save')) {
        this.showSavebutton = true
      } else if (value == 1 && Authorities('business:layout:setinfo:save')) {
        this.showSavebutton = true
      } else {
        this.showSavebutton = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-input.is-disabled .el-input__inner {
  color: #606266;
}
::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
  border-color: #606266;
}
.ovalbox {
  flex: 1;
  width: 100%;
  padding: 40px;
  background-color: #f0f2f5;
}
.querybox {
  width: 1200px;
  margin: 0 auto;
}
.titlebox {
  margin: 0 auto 26px auto;
  color: #1e2840;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  display: block;
  height: 30px;
  line-height: 30px;
}
.checkbox {
  display: flex;
  height: 20px;
  line-height: 20px;
  background: #ffffff;
  padding: 10px 0 5px 0px;
  margin-bottom: 15px;
  border-bottom: 1px solid #ced3dd;
  border-radius: 2px;
  p {
    width: 150px;
    display: inline-block;
    text-align: center;
    font-size: 14px;
    color: #000000;
    cursor: pointer;
  }
  .active {
    color: #930cea;
    position: relative;
    &:before {
      content: '';
      width: 106px;
      height: 2px;
      background: #930cea;
      color: #930cea;
      display: block;
      bottom: -5px;
      position: absolute;
      left: 22px;
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
</style>
