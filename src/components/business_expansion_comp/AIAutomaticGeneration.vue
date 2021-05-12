<template>
  <div class="AIAutomaticGenerationBox">
    <div class="StoresBox">
      <div class="StoresContentBox">
        <div class="storesName">
          <p class="p1">店群名称</p>
          <el-input
            placeholder="请输入种子店群名称（字数限制30字以内）"
            maxlength="30"
            v-model="storesName"
            size="small"
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
        <div class="selectBox">
          <p class="p1">行销公司</p>
          <el-cascader
            v-model="selectValue"
            :options="aiConpanyData"
            :props="{
              multiple: false,
              emitPath: false,
              label: 'orgName',
              value: 'orgId'
            }"
            collapse-tags
            clearable
            filterable
            size="small"
            popper-class="orgPopover"
            class="smart_select_deep select-options"
          >
          </el-cascader>
        </div>
        <div class="SplitRule">
          <span class="SplitRuleTitle"
            >拆分规则
            <p>
              （筛选比例：根据销量高低，选取TOP一定比例的门店作为种子门店。）
            </p></span
          >
          <div class="splitRuleContent">
            <el-radio-group
              v-model="splitRuleValue"
              v-if="splitRuleData.length > 0"
            >
            <!-- :class="item.aiRatio === 'y' ? 'radioBackground' : ''" -->
              <el-radio-button
                v-for="item in splitRuleData"
                :key="item.id"
                :label="item.splitRatio + '%'"
                :class="(item.aiRatio === 'y' && splitRuleValue === item.splitRatio + '%') ? 'radioBackground' : ''"
                border
              >
              <!-- <svg class="icon svg-icon" v-if="item.aiRatio === 'y'" aria-hidden="true">
                  <use xlink:href="#iconbg_ai"></use>
              </svg> -->
              </el-radio-button>
            </el-radio-group>
            <div class="zhanwei" v-else>
              <div class="zhanweiIner"></div>
              <div class="zhanweiIner"></div>
              <div class="zhanweiIner"></div>
            </div>
            <div class="down">
              <span
                v-for="itm in splitRuleData"
                :key="itm.id"
                :class="itm.aiRatio === 'y' ? 'downImg' : ''"
              >
                <img
                  v-if="itm.aiRatio === 'y'"
                  src="/img/icon_bg_ai.png"
                  alt="占位"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footerBox">
      <el-button
        type="primary"
        :disabled="disabled"
        size="small"
        @click="generate"
        >确定</el-button
      >
    </div>
  </div>
</template>
<script>
import businessExpansionApi from '../../../api/business-expansion_api.js'
export default {
  name: 'AIAutomaticGeneration',
  data() {
    return {
      storesName: '',
      textarea: '',
      textAreaShow: false,
      disabled: true,
      selectValue: '', //行销公司
      splitRuleValue: '',
      splitRuleData: []
    }
  },
  props: ['aiConpanyData'],
  watch: {
    storesName(val) {
      if (val !== '' && this.selectValue !== '') {
        this.disabled = false
      }
    },
    selectValue(val, oldval) {
      if (val !== '' && this.storesName !== '') {
        this.disabled = false
      }
      if (val !== oldval && val !== null) {
        // val = '6726787778379468170'
        this.getSplitRules(val)
      } else {
        console.log('空')
      }
    },
  },
  created() {},
  methods: {
    generate() {
      //使用post方法提交种子门店信息
      let params = {
        orgId: this.selectValue, //组织id
        splitRatio: this.splitRuleValue?(this.splitRuleValue).split('%')[0]:'', //拆分规则比例
        storesDescribe: this.textarea, //门店描述
        storesName: this.storesName //店群名称
      }
      businessExpansionApi.post_create(params).then((res) => {
        if(res.code === '200') {
            this.$emit('sucessMethods',res.data)
        }
        if( res.code !== '200' && res.code !== '50010') {
          this.$emit('failMethods')
        }
      })
    },
    getSplitRules(orgId) {
      //获取拆分规则
      businessExpansionApi.get_split_rules({ orgId: orgId }).then((res) => {
        this.splitRuleData = res
        for(let i=0;i<res.length;i++) {
          if(res[i].aiRatio === 'y') {
            this.splitRuleValue = res[i].splitRatio + '%'
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.AIAutomaticGenerationBox {
  .StoresBox {
    .StoresContentBox {
      .storesName {
        display: flex;
        flex-direction: row;
        .p1 {
          display: inline-block;
          width: 70px;
          height: 32px;
          line-height: 32px;
          font-weight: 700;
          color: #1f2d3d;
          margin-right: 20px;
        }
        ::v-deep.el-input {
          .el-input__inner {
            width: 78%;
          }
        }
      }
      .miaoshu {
        margin: 15px 0;
        .miaoshutittle {
          display: inline-block;
          margin-bottom: 5px;
          i {
            margin-left: 20px;
          }
        }
      }
      .selectBox {
        display: flex;
        flex-direction: row;
        margin-bottom: 17px;
        .p1 {
          display: inline-block;
          width: 70px;
          height: 32px;
          line-height: 32px;
          font-weight: 700;
          color: #1f2d3d;
          margin-right: 10px;
        }
        ::v-deep.el-input__inner {
          background: #fff;
          color: #a634ef;
          border-color: #dddee1;
        }
        ::v-deep.smart_select_deep {
          .is-focus{
            .el-input__suffix {
              .el-input__suffix-inner {
                .el-icon-arrow-down:before {
                  content: "\e778",

                }
                .is-reverse {
                  transform: rotateZ(0)
                }
              }
            }
          }

        }
      }
      .SplitRule {
        margin-bottom: 20px;
        .SplitRuleTitle {
          display: flex;
          flex-direction: row;
          color: #1c2438;
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 15px;
          p {
            font-weight: normal;
            color: #80848f;
            font-size: 10px;
            margin-left: 15px;
          }
        }
        .splitRuleContent {
          .el-radio-group {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            ::v-deep.el-radio-button {
              width: 96px;
              height: 53px;
            }
            ::v-deep.el-radio-button .el-radio-button__inner {
              width: 96px;
              border: 1px solid #a634ef;
              background: #fbebfe;
              border-radius: 4px;
              font-size: 27px;
              font-weight: bold;
              .icon {
                position: relative;
                z-index: 0;
                transform: scale(4);
    margin-right: -35px;
    padding-top: 3px;
    box-sizing: border-box;
              }
            }
            ::v-deep.el-radio-button.radioBackground .el-radio-button__inner {
              background-image: url('/img/bg_ai.png') !important;
              background-size: 100% 100% !important;
              background-repeat: repeat !important;
            }
            ::v-deep.el-radio-button__orig-radio:checked
              + .el-radio-button__inner {
              box-shadow: none;
              border: 1px solid #a634ef;
              background: #930cea;
              border-radius: 4px;
            }
            ::v-deep.el-radio-button__inner:hover {
              border-color: #930cea;
            }
          }
          .zhanwei {
            width: 100%;
            height: 77px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .zhanweiIner {
              width: 96px;
              height: 53px;
              background: #e6e4e4;
              animation-duration: 1.5s;
              animation-name: blink;
              animation-iteration-count: infinite;
            }
            @keyframes blink {
              0% {
                opacity: 0.4;
              }
              50% {
                opacity: 1;
              }
              100% {
                opacity: 0.4;
              }
            }

            @keyframes flush {
              0% {
                left: -100%;
              }

              50% {
                left: 0;
              }

              100% {
                left: 100%;
              }
            }
          }
          .down {
            margin-top: 5px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            span.downImg {
              img {
                width: 85px;
                height: 24px;
              }
            }
          }
        }
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
      top: 50%;
      margin-top: -16px;
    }
  }
}
</style>