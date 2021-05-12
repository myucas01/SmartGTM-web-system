<template>
  <div class="SeedStorePage">
    <div class="headerBox">
      <span @click="goBack"
        ><i
          class="el-icon-arrow-left
"
        ></i>
        <p>返回</p></span
      >
    </div>
    <div class="contentBox">
      <div class="titleBox">
        选择上传种子门店方式
      </div>
      <div class="methodsBox">
        <!-- <div class="disMaskbox"></div> -->
        <img
          @click="methodsType1 = true"
          class="cursor"
          src="/img/icon_zzsc.png"
          alt=""
        />
        <img
          @click="methodsType2 = true"
          class="cursor"
          src="/img/icon_ai.png"
          alt=""
        />
      </div>
    </div>
    <el-dialog title="自主上传" :visible.sync="methodsType1" width="550px">
      <zzsc ref="zzsc" @sucessMethods="sucessMethods"></zzsc>
    </el-dialog>
    <el-dialog
      title="AI自动识别种子门店"
      :visible.sync="methodsType2"
      width="550px"
    >
      <automatic-generation
        ref="AutomaticGeneration"
        @failMethods="failMethods"
        @sucessMethods="sucessMethods"
        :aiConpanyData="aiConpanyData"
      ></automatic-generation>
    </el-dialog>

    <el-dialog
      :title="dialogStatus ? '成功' : '失败'"
      custom-class="dialogBox"
      :visible.sync="beforeSubmitShow"
      width="550px"
    >
      <span>
        <img src="/img/sucessImg.png" v-if="dialogStatus" alt="" />
        <img src="/img/wrongIMG.png" v-if="!dialogStatus" alt="" />
        {{ dialogStatus ? dialogInfo : '网络问题，种子门店上传失败！' }}
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus" @click="goRoute('店群详情')" size="small"
          >店群详情</el-button
        >
        <el-button v-if="dialogStatus" @click="goRoute('门店画像')" size="small"
          >门店画像</el-button
        >
        <el-button
          v-if="dialogStatus"
          type="primary"
          @click="goRoute('售点拓展')"
          size="small"
          >售点拓展</el-button
        >
        <el-button
          v-if="!dialogStatus"
          type="primary"
          @click="goRoute('重新上传')"
          size="small"
          >重新上传</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="计算中"
      custom-class="dialogBoxs"
      :visible.sync="calculationVisible"
      width="30%"
    >
      <div class="img"><img src="/img/undraw_loading.png" alt="" /></div>
      <div>预计还需要一小时计算完成…</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="calculationBtn">店群详情</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import zzsc from '../../components/business_expansion_comp/zzsc'
import AutomaticGeneration from '../../components/business_expansion_comp/AIAutomaticGeneration'
import businessExpansionApi from '../../../api/business-expansion_api.js'
export default {
  name: 'SeedStore',
  data() {
    return {
      methodsType1: false,
      methodsType2: false,
      beforeSubmitShow: false, //提交后弹窗控制状态
      dialogTitle: '完成', //提交后的弹窗标题
      dialogStatus: true, //是否成功,判断条件
      dialogImg: '/img/sucessImg.png',
      dialogInfo: '种子门店上传成功！', //提交后的弹窗标题\
      aiConpanyData: [], // AI自主上传页面行销公司数据
      seedInfo: {}, //种子门店返回值
      calculationVisible: false //跳转门店画像进行拦截
    }
  },
  components: {
    zzsc,
    AutomaticGeneration
  },
  mounted() {
    this.getConpany()
  },
  methods: {
    goBack() {
      //返回首页
      this.$router.push('/business-expansion/index')
    },
    goRoute(item) {
      //跳转路由
      switch (item) {
        case '店群详情':
          this.$router.push(`/business-expansion/store-community-list`)
          break
        case '门店画像':
          this.calculationVisible = true
          // this.$router.push(`/business-expansion/map?storesId=${this.seedInfo.id}&storeType=seed_store&orgId=${this.seedInfo.orgId}`)
          break
        case '售点拓展':
          this.$router.push(
            `/business-expansion/store-autonomy-dev?storesId=${this.seedInfo.id}`
          )
          break
        case '重新上传':
          console.log('重新上传')
          this.$router.push('/business-expansion/seed-store')
          break
      }
    },
    getConpany() {
      //获取行销公司列表
      businessExpansionApi.get_company({}).then(res => {
        this.aiConpanyData = res //获取行销公司列表
      })
    },
    calculationBtn() {
      this.$router.push(`/business-expansion/store-community-list`)
      setTimeout(() => {
        // this.beforeSubmitShow = false
        this.calculationVisible = false
        this.calculationVisible = false
      }, 50)
    },
    sucessMethods(data) {
      this.seedInfo = data
      this.methodsType1 = false
      this.methodsType2 = false
      setTimeout(() => {
        // this.beforeSubmitShow = true
        this.calculationVisible = true
        this.dialogStatus = true
      }, 1000)
    },
    failMethods() {
      this.methodsType2 = false
      setTimeout(() => {
        this.dialogStatus = false
        // this.beforeSubmitShow = true
        this.calculationVisible = true
      }, 1000)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.SeedStorePage {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .headerBox {
    width: 100%;
    margin: 21px 0 47px 0;
    padding-left: 14px;
    span {
      cursor: pointer;
      width: 80px;
      height: 32px;
      line-height: 32px;
      display: inline-block;
      border: 1px solid #dddee1;
      text-align: center;
      border-radius: 4px;
      font-size: 12px;
      color: #495060;
      p:nth-of-type(1) {
        display: inline;
        margin-left: 5px;
      }
    }
  }
  .contentBox {
    width: 100%;
    flex: 1;
    .titleBox {
      font-size: 32px;
      color: #000;
      text-align: center;
      margin-bottom: 59px;
    }
    .methodsBox {
      width: 100%;
      text-align: center;
      position: relative;
      img {
        display: inline-block;
        width: 209px;
        height: 270px;
        cursor: pointer;
        &:nth-of-type(2) {
          margin-left: 171px;
        }
      }
      .disMaskbox {
        display: inline-block;
        position: absolute;
        width: 209px;
        height: 270px;
        background: rgba(251, 247, 247, 0.3);
        border-radius: 4px;
        z-index: 1;
        box-shadow: 3px 3px 3px rgba(251, 247, 247, 0.3) inset;
        cursor: not-allowed;
      }
    }
  }
  ::v-deep.el-dialog__body {
    padding-top: 0px;
    padding-bottom: 0px;
  }
  ::v-deep.el-dialog__footer {
    margin-top: 10px;
    border-top: 1px solid #d8e4f0;
    .el-button--default {
      border-color: #a634ef;
      color: #a634ef;
    }
  }
  ::v-deep.el-dialog.dialogBox {
    ::v-deep.el-dialog__body {
      height: 115px !important;
      line-height: 115px !important;
    }
    img {
      display: inline-block;
      width: 34px !important;
      height: 34px !important;
      margin-right: 19px !important;
    }
  }
  ::v-deep.el-dialog.dialogBoxs .el-dialog__body {
    text-align: center;
    .img {
      width: 156px;
      height: 120;
      margin: 0 auto 20px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
