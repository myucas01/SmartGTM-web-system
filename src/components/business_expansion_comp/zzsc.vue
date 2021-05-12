<template>
  <div class="zzscBox">
    <div class="stepBox">
      <el-steps direction="vertical" :active="active" finish-status="success">
        <el-step></el-step>
        <el-step></el-step>
        <el-step></el-step>
      </el-steps>
    </div>
    <div class="contentBox">
      <div class="fieldBox">
        <div class="fieldTtitleBox">
          <p>请将门店必要字段准备好</p>
          <el-tooltip class="item" effect="light" placement="bottom-start">
            <div slot="content">
              我们会将这些信息与相应GAIA门店进行匹配,门店名单中<br />的信息被称为"识别信息"(如店门,地址),您可以将鼠标悬停<br />在这些识别信息上,以显示格式规则和正确的栏标题
            </div>
            <p>?</p>
          </el-tooltip>
        </div>
        <div class="fieldContentBox">
          <template v-for="(item, index) in tipTab">
            <el-tooltip
              class="item"
              effect="light"
              placement="bottom-start"
              :key="index"
            >
              <div slot="content" v-if="item.tipText.length !== 0">
                {{ item.tipText.substring(0, 25) }}<br />{{
                  item.tipText.substring(25, item.tipText.length - 1)
                }}
              </div>
              <div slot="content" v-if="item.tipText.length === 0">
                暂时没有说明
              </div>
              <span :class="{ essentialStyle: item.essential }">
                {{ item.name }}</span
              >
            </el-tooltip>
          </template>
        </div>
      </div>
      <div class="upDataBox">
        <div class="upDataTtitleBox">
          <p>上传种子门店文件</p>
          <el-tooltip class="item" effect="light" placement="bottom-start">
            <div slot="content">
              <!-- 门店名单可以是包含上面提到识别信息的CSV、XLSX和TXT<br />文件。要获得最佳匹配率,请遵守GAIA的格式规则,同<br />时使用尽可能多的识别信息,或者,您可以下载我们的<br />文件模板,以便系统更轻松地匹配您的识别信息 -->
              门店名单可以是包含上面提到识别信息的CSV文件。<br />要获得最佳匹配率,请遵守GAIA的格式规则,同<br />时使用尽可能多的识别信息,或者,您可以下载我们的<br />文件模板,以便系统更轻松地匹配您的识别信息
            </div>
            <p>?</p>
          </el-tooltip>
          <a href="/api/expand/business/store/template/download">
            <div class="muban">
              <img src="/img/download2x.png" alt="" />
              <p>下载模板</p>
            </div>
          </a>
        </div>
        <div class="upDataContentBox">
          <el-upload
            class="upload-demo"
            drag
            action="/api/expand/upload"
            :file-list="fileList"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              <em>
                <img src="/img/updata2x.png" alt="" />
                上传种子门店文件</em
              >
            </div>
            <div class="el-upload__tip" slot="tip">可将文件拖放至此区域</div>
          </el-upload>
        </div>
      </div>
      <div class="StoresBox">
        <div class="StoresTtitleBox">
          <p>请填写店群名称</p>
          <el-tooltip class="item" effect="light" placement="bottom-start">
            <div slot="content">用于命名并描述该店群</div>
            <p>?</p>
          </el-tooltip>
        </div>
        <div class="StoresContentBox">
          <div class="storesName">
            <p class="p1">店群名称</p>
            <el-input
              placeholder="请输入种子店群名称（字数限制30字以内）"
              maxlength="30"
              v-model="storesName"
            ></el-input>
          </div>
          <div class="miaoshu">
            <span class="miaoshutittle">
              门店描述
              <i
                class="el-icon-arrow-down"
                v-if="textAreaShow"
                @click="textAreaShow = !textAreaShow"
              ></i>
              <i
                class="el-icon-arrow-up"
                v-if="!textAreaShow"
                @click="textAreaShow = !textAreaShow"
              ></i>
            </span>
            <el-input
              type="textarea"
              v-if="textAreaShow"
              placeholder="请输入内容"
              v-model="textarea"
            >
            </el-input>
          </div>
        </div>
      </div>
    </div>
    <div class="footerBox">
      <el-button
        type="primary"
        :disabled="active !== 3"
        size="small"
        @click="generate"
        >确定</el-button
      >
    </div>
  </div>
</template>
<script>
import businessExpansionApi from '../../../api/business-expansion_api.js'
// import qs from 'qs'
export default {
  name: 'zzsc',
  data() {
    return {
      active: 0,
      storesName: '', //门店名称
      textarea: '', //门店描述
      textAreaShow: false,
      fileList: [], //文件

      dropActive: false,
      tipTab: [
        {
          name: '店名',
          essential: true,
          tipText:
            '栏标题为name，我们接受店名全称，及以常见形式出现的店名缩写，例如，全家便利店，联华'
        },

        {
          name: '省',
          essential: true,
          tipText: '栏标题为province，我们接受符合国家区域划分的省、自治区、直辖市、特别行政区的名称，例如，江苏省'
        },
        {
          name: '市',
          essential: true,
          tipText: '栏标题为city，我们接受符合国家区域划分的地级市、地区、自治州、盟的名称，例如，苏州市'
        },
        {
          name: '区/县',
          essential: true,
          tipText: '栏标题为district，我们接受符合国家行政区域划分的市辖区、县级市、县、自治县、自治旗、林区、特区的名称，例如秦淮区'
        },
        {
          name: '街道',
          essential: false,
          tipText: '栏标题为street，我们接受符合国家区域划分的街道、镇、乡、民族乡、苏木、民族苏木、县辖区的名称，例如，曹家渡街道'
        },

        {
          name: '地址',
          essential: true,
          tipText:
            '栏标题为address,我们接受符合省市区路门牌号规范的地址,例如,江苏省南京市秦淮区大光路55-6号'
        },
        {
          name: '经度',
          essential: false,
          tipText: '栏标题为longitude,我们接受精确到小数点后6位,例如,116.402939'
        },
        {
          name: '纬度',
          essential: false,
          tipText: '栏标题为latitude,我们接受精确到小数点后6位,例如,39.968819'
        }
      ]
    }
  },
  watch: {
    storesName(val) {
      if (val !== '' && this.fileList.length > 0) {
        this.active = 3
      } else {
        this.active = 2
      }
    },
    fileList(newVal, oldVal) {
      if (
        oldVal.length === 0 &&
        newVal.length === 1 &&
        this.storesName === ''
      ) {
        this.storesName = newVal[0].name.substr(
          0,
          newVal[0].name.lastIndexOf('.')
        )
      }
      if (this.storesName !== '' && newVal.length > 0) {
        this.active = 3
      }
    }
  },
  mounted() {},
  methods: {
    submitUpload() {
      this.$refs.upload.submit()
    },
    async generate() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let fileData = new FormData()
      this.fileList.forEach((r) => {
        fileData.append(`files`, r.raw)
      })
        let seedName = this.storesName?this.storesName:''
        let storesDescribe = this.textarea?this.textarea:''
        fileData.append('seedName',seedName)
        fileData.append('storesDescribe',storesDescribe)
      await businessExpansionApi.upload_file(fileData).then((res) => {
        const { code, data } = res
        if (code == 200) {
          this.$message({
            type: 'success',
            message: data,
            showClose: true
          })
          this.$emit('sucessMethods',data)
        }
      })
      loading.close()
    },
    handleRemove(file, fileList) {
      if (fileList.length === 0) {
        this.active = 1
        this.fileList = fileList
      }
    },
    handleSuccess(response, file, fileList) {
      this.fileList = fileList
      this.active = 2
    },
    beforeUpload(file) {
      // 上传文件格式有误,CSV/XLSX/TXT文件
      // houzhui !== 'txt' && houzhui !== 'TXT' && houzhui !== 'xlsx' && houzhui !== 'XLSX' && houzhui !== 'csv' && houzhui !== 'CSV'
      let houzhui = file.name.substr(file.name.lastIndexOf('.') + 1)
      if (houzhui !== 'xlsx' && houzhui !== 'XLSX') {
        this.$message.error('上传文件格式有误,请选择excel文件')
        return false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.zzscBox {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  // position: relative;
  .stepBox {
    width: 32px;
    height: 200px;
    ::v-deep .el-step__head.is-process,
    ::v-deep .el-step__head.is-success {
      border-color: #a634ef;
      color: #a634ef;
    }
    ::v-deep .el-step__head.is-finish {
      border-color: #a634ef !important;
      color: #a634ef;
    }
  }
  .contentBox {
    flex: 1;
    // background: chartreuse;
    .fieldBox {
      margin-bottom: 30px;
      .fieldTtitleBox {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 15px;
      }
      .fieldContentBox {
        span {
          width: 40px;
          height: 20px;
          display: inline-block;
          line-height: 20px;
          text-align: center;
          margin-right: 10px;
          border-radius: 2px;
          color: #bbbec4;
          border: 1px solid #bbbec4;
        }
        .essentialStyle {
          color: #a634ef;
          border-color: #a634ef;
        }
      }
    }
    .upDataBox {
      height: 92px;
      .upDataTtitleBox {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 3px;
        .muban {
          display: flex;
          flex-direction: row;
          position: absolute;
          right: 0px;
          cursor: pointer;
          img {
            width: 14px;
            height: 14px;
            padding: 2px;
            color: #000;
          }
        }
      }
      .upDataContentBox {
        .drop-area {
          width: 130px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          color: #a634ef;
          background-color: #fff;
          border-radius: 4px;
          border: 1px solid #a634ef;
          font-size: 12px;
          em {
            img {
              width: 16px;
              height: 16px;
            }
          }
        }
        .drop-active {
          background-color: #afadad;
          border: 1px solid rgb(89, 18, 221);
        }
        ::v-deep .upload-demo {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          flex-wrap: wrap;

          .el-upload {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            .el-upload-dragger {
              width: 130px;
              height: 32px;
              background-color: #fff;
              border: 1px solid #a634ef;
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              .el-icon-upload {
                line-height: 32px;
                margin: 0px;
                font-size: 23px;
              }
              .el-icon-upload::before {
                content: '';
              }
              .el-upload__text {
                font-size: 12px;
                em {
                  img {
                    width: 16px;
                    height: 16px;
                  }
                }
              }
            }
            .is-dragover {
              background-color: #afadad !important;
              border: 2px dotted #dddee1;
            }
          }
          .el-upload__tip {
            width: 200px;
            margin-left: 10px;
          }
          .el-upload-list {
            height: 40px;
            width: 90%;
            overflow-y: auto;
            .el-upload-list__item {
              margin-top: 2px;
              font-size: 12px;
              height: 15px;
              line-height: 15px;
              background: #fbebfe !important;
              .el-upload-list__item-status-label {
                .el-icon-upload-success {
                  color: #a634ef !important;
                }
              }
              .el-icon-document:before {
                content: '\e77d';
                color: #a634ef;
              }
              .el-icon-close {
                top: 2px !important;
              }
              .el-upload-list__item-status-label {
                top: 1px !important;
              }
            }
          }
        }
      }
    }

    .StoresBox {
      .StoresTtitleBox {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 3px;
      }
      .StoresContentBox {
        .storesName {
          display: flex;
          flex-direction: row;
          .p1 {
            display: inline-block;
            width: 70px;
            height: 40px;
            line-height: 40px;
            font-weight: 700;
            color: #1f2d3d;
          }
        }
        .miaoshu {
          margin-bottom: 15px;
          .miaoshutittle {
            display: inline-block;
            margin-bottom: 5px;
          }
        }
      }
    }
    div {
      p:nth-of-type(1) {
        color: #495060;
        margin-right: 6px;
      }
      p:nth-of-type(2) {
        width: 14px;
        height: 14px;
        line-height: 14px;
        text-align: center;
        border-radius: 7px;
        color: #fff;
        background: #dddee1;
      }
    }
  }
  .footerBox {
    position: relative;
    // bottom: 0px;
    height: 58px;
    width: 100%;
    line-height: 58px;
    border-top: 1px solid #d8e4f0;
    .el-button {
      position: absolute;
      right: 0px;
      top: 25%;
      margin-top: -16pxf;
    }
  }
}
</style>