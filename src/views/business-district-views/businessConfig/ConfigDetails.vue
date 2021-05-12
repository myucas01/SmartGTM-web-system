<template>
  <div class="configBox"  v-loading="is_show_loading">
    <CommonBasicDetail
      :opentype="opentype"
      :businessTitle="pagetitle"
      @changeFromValue="addCommonForm"
      :CommonForm="Fromdata.CommonForm"
      :configSave="configSave"
      v-if="Fromdata.CommonForm"
    ></CommonBasicDetail>
    <GradingStandard
      :opentype="opentype"
      :businessTitle="pagetitle"
      @changeFromValue="addGradingForm"
      :CheckTargetForm="Fromdata.CheckTargetForm"
      :GradingForm="Fromdata.GradingForm"
      :oldPrevel="oldPrevel"
      v-if="Fromdata.CheckTargetForm && oldPrevel"
      :configSave="configSave"
    ></GradingStandard>
    <CheckTarget
      @changeFromValue="addCheckTargetForm"
      :CheckTargetForm="Fromdata.CheckTargetForm"
      :opentype="opentype"
      :businessTitle="pagetitle"
      :configSave="configSave"
      v-if="Fromdata.CheckTargetForm"
    ></CheckTarget>
    <ScopeLayout
      @changeFromValue="addScopeForm"
      :opentype="opentype"
      :businessTitle="pagetitle"
      :addScopeForm="Fromdata.addScopeForm"
      :configSave="configSave"
      v-if="Fromdata.addScopeForm"
    ></ScopeLayout>
  </div>
</template>

<script>
import CommonBasicDetail from '../addNewBusiness/CommonBasicDetail.vue'
import GradingStandard from '../addNewBusiness/GradingStandard.vue'
import CheckTarget from '../addNewBusiness/CheckTarget.vue'
import ScopeLayout from '../addNewBusiness/ScopeLayout.vue'
import BUSINESS_DISTRICT_API from '@api/business_district_api.js'
export default {
  name: 'ConfigDetails',
  components: {
    CommonBasicDetail,
    GradingStandard,
    CheckTarget,
    ScopeLayout
  },
  data() {
    return {
      opentype: 'confingDetail',
      pagetitle: '',
      Fromdata: {
        CommonForm: null,
        CheckTargetForm: null,
        GradingForm: null,
        addScopeForm: null
      },
      oldPrevel: null,
      is_show_loading: false
    }
  },
  props: ['configSave'],
  created() {},
  mounted() {
    const { proId } = this.$route.query
    this.getProjectInfo(proId)
  },
  watch: {
    Fromdata: {
      deep: true,
      handler: function(newval) {
        this.$emit('getFromData', newval)
      }
    }
  },
  methods: {
    async getProjectInfo(proId) {
      this.is_show_loading = true
      // ******获取商圈配置基本信息
      await BUSINESS_DISTRICT_API.get_project_info({
        proId: proId,
        isLoading: false
      })
        .then(async res => {
          if (res.code === '200') {
            let newData = await res.data
            this.$emit('getPageTitle', newData)
            this.pagetitle = newData.proName
            this.Fromdata.CommonForm = {
              name: newData.proName,
              quarter: newData.proQuarter,
              year: newData.proDate,
              status: newData.proStatus
            }
            this.Fromdata.addScopeForm = newData.orgIds
            this.Fromdata.GradingForm = newData.proStandards
            this.Fromdata.CheckTargetForm = newData.targetChecks
            if (newData.proStandards.length > 0) {
              this.oldPrevel = newData.proStandards.length
            } else {
              this.oldPrevel = 1
            }
            this.is_show_loading = false
          }
        })
        .catch(err => {
          console.log(err)
        })
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
          }
        })
      }
      this.Fromdata.GradingForm = proStandards
    },
    addScopeForm(value) {
      //添加布局范围
      this.Fromdata.addScopeForm = value
    }
  }
}
</script>

<style scoped lang="scss">
.configBox {
  display: block;
  overflow-y: auto;
  width: 100%;
  height: calc(100vh - 290px);
  margin-bottom: 15px;
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
</style>
