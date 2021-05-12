<template>
  <div class="business-fixed-wrapper">
    <div class="business-data-panel">
      <div class="business-title">商圈统计分析</div>
      <div class="business-group">
        <BasicInformation
          ref="infoChild"
          compontent-title="商圈基本信息"
          @update-BusinessDistrict="updateBusinessDistrictInfo"
        />
        <BusinessLevel
          style="position: relative"
          ref="businessLevelChild"
          :editBusinessDistrict="editBusinessDistrict"
          compontent-title="商圈等级"
        />
        <BusinessTag
          ref="businessTagChild"
          compontent-title="商圈指标"
          :editBusinessDistrict="editBusinessDistrict"
        />
        <!-- <AdministrativeScope
          compontent-title="行政范围边界"
          :AMap="mapObj"
        /> -->

        <div class="item-box">
          <div class="title-block" @click="handleSpread('range')">
            <i
              class="el-icon-caret-right"
              :class="{ active: isSpread.range }"
            ></i>
            <p class="text">行政边界范围</p>
          </div>
          <div class="content-block content-tree" v-show="isSpread.range">
            <el-tree
              :data="treeData"
              ref="orgTree"
              node-key="regionCode"
              :props="defaultProps"
              empty-text="暂无数据"
              class="smart_tree_deep"
              default-expand-all
            >
              <span class="custom-tree-node" slot-scope="{ data }">
                <span>{{ data.regionName }}</span>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
    </div>
    <div class="item-foot">
      <el-button type="primary" size="small" @click="goBack">返回</el-button>
      <el-button type="primary" size="small" @click="toEdit" v-auth="'business:layout:show:modify'">编辑</el-button>
    </div>
  </div>
</template>

<script>
// import Business_District_API from '@api/business-district/index'
import BUSINESS_DISTRICT_API from '@api/business_district_api'
import BasicInformation from '../components/BasicInformation'
import BusinessLevel from '../components/BusinessLevel'
import BusinessTag from '../components/BusinessTag'
// import AdministrativeScope from '../components/AdministrativeScope'

export default {
  name: 'businessDataPanel',
  components: {
    BasicInformation,
    BusinessLevel,
    BusinessTag
    // AdministrativeScope
  },
  computed: {
    businessNo() {
      return this.$store.state.businessPreview.businessNo
    },
    orgId() {
      return this.$store.state.map.organizationId
    }
  },
  data() {
    return {
      data: '',
      isSpread: {
        base: true, //基本信息
        level: true, // 商圈等级
        label: true, // 商圈指标
        range: true // 行政边界范围
      },
      treeData: [],
      defaultProps: {
        children: 'regions',
        label: 'regionName',
        disabled: 'oseted'
      },
      editBusinessDistrict: '',
      detailDialog: false,
      operationCode: 'string' // 操作的code 对应 Navtools中code
    }
  },
  watch: {
    businessNo(val) {
      if (val) {
        // 商圈详情是否为预览状态
        this.$store.commit('businessPreview/setIsPreview', true)
        // 查看详情所需传参
        this.$store.commit(
          'businessPreview/SET_CHOOSE_BUSINESS',
          this.$route.query.proNumber
        )
        this.$refs.infoChild.getBasicInfo(val)
        this.getRegionTree()
      }
    }
  },
  mounted() {},
  methods: {
    // 获取行政树(status=1 预览模式)
    async getRegionTree() {
      // let result = await Business_District_API.businessRegionTree({
      //   orgId: this.orgId,
      //   proNo: this.$route.query.proNumber,
      //   businessNo: this.businessNo,
      //   status: '1'
      // })
      let result = await BUSINESS_DISTRICT_API.get_preview_region_tree_data({
        businessNo: this.businessNo,
      })
      if (result.code === '200') {
        this.treeData = result.data
      }
    },
    handleSpread(item) {
      this.isSpread[item] = !this.isSpread[item]
    },
    showDetail() {
      this.detailDialog = true
    },
    CloseDetailDialog(val) {
      this.detailDialog = val
    },
    toEdit() {
      this.$router.push({
        path: `create/${this.$route.query.proNumber}`,
        query: {
          orgId: this.$store.state.map.organizationId,
          proYear: this.$route.query.proYear,
          proQuarter: this.$route.query.proQuarter,
          proName: this.$route.query.proName
        }
      })
    },
    goBack() {
      // 设置组织层级为营业部
      this.$store.commit('businessPreview/setOrgLevel', '2')
    },
    // 编辑 商圈信息 赋值
    updateBusinessDistrictInfo(data) {
      this.editBusinessDistrict = data
      this.$refs.businessTagChild.targetTable = {
        targetList: this.editBusinessDistrict.targetVo,
        inventoryList: this.editBusinessDistrict.inventoryVo,
        businessName: this.editBusinessDistrict.businessName
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.business-fixed-wrapper {
  position: relative;
  .business-data-panel {
    width: 100%;
    height: calc(100vh - 100px);
    overflow-y: auto;

    .business-title {
      height: 40px;
      line-height: 40px;
      text-align: left;
      font-size: 18px;
      font-weight: 600;
      color: #ffffff;
      padding-left: 15px;
    }

    .business-group {
      .item-box {
        .title-block {
          height: 34px;
          background: #133773;
          text-align: left;
          position: relative;
          cursor: pointer;

          i.el-icon-caret-right {
            padding: 0 5px;
            transform: rotate(0deg);
            cursor: pointer;

            &.active {
              transition: transform 0.3s;
              transform: rotate(90deg);
            }
          }

          .text {
            display: inline-block;
            line-height: 34px;
            font-size: 13px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #ffffff;
            cursor: pointer;
          }

          .detail-btn {
            position: absolute;
            top: 6px;
            right: 6px;
            width: 64px;
            height: 22px;
            line-height: 22px;
            border-radius: 3px;
            opacity: 0.58;
            border: 1px solid #ffffff;
            text-align: center;
          }
        }

        .content-block {
          .content-item {
            display: flex;
            margin: 10px 15px;

            .label {
              width: 65px;
              font-size: 12px;
              color: rgba(255, 255, 255, 0.63);
            }

            .text-name {
              flex: 1;
              font-size: 16px;
              font-weight: 600;
              color: #ffffff;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }

            .text-base {
              flex: 1;
              font-size: 12px;

              .color {
                display: inline-block;
                width: 3px;
                height: 12px;
              }
            }

            .text-wrap {
              flex: 1;
              word-break: break-all;
            }

            .label2 {
              width: 110px;
              font-size: 12px;
              font-weight: 600;
            }

            .label3 {
              width: 110px;
              font-size: 12px;
            }

            .text-level {
              flex: 1;
              font-size: 14px;

              .color {
                display: inline-block;
                width: 3px;
                height: 12px;
              }
            }
          }

          .table-group {
            padding: 5px 13px;
            color: #fff;

            th {
              font-size: 12px;
              margin-top: 10px;
            }

            tr {
              margin-bottom: 15px;
            }

            td {
              padding: 3px 0;

              .drop-color {
                font-size: 12px;
                font-weight: 400;
                color: #19be6b;
                margin-right: 5px;
                display: inline-block;
                width: 30px;
              }

              .rise-color {
                color: #ed3f14;
                margin-right: 5px;
                display: inline-block;
                width: 30px;
              }

              .feedback-color {
                font-size: 13px;
                font-weight: 400;
                color: #e9c8ff;
                cursor: pointer;
              }
            }
          }

          .selling-box {
            padding-top: 10px;
            padding-left: 10px;

            .selling-box-header {
              width: 312px;
              height: 42px;
              background: #7c41f9;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              color: #ffffff;
              line-height: 42px;
              text-indent: 10px;
              position: relative;
              z-index: 10;
            }

            .selling-box-content {
              display: flex;
              width: 312px;
              max-height: 225px;
              overflow-y: auto;
              background: #540bb1;
              position: relative;
              top: -5px;
              padding-top: 15px;

              .selling-item {
                flex: 1;
                border-right: 1px solid #b095ff;
              }

              .selling-header {
                font-size: 12px;
                font-weight: bold;
                color: #ffffff;

                svg {
                  margin-right: 3px;
                  margin-left: 6px;
                }
              }

              .selling-uls {
                padding-left: 13px;

                .selling-lis {
                  span {
                    font-size: 12px;
                    font-weight: 400;
                    color: #ffffff;
                    line-height: 20px;
                  }

                  p {
                    font-size: 15px;
                    font-weight: 600;
                    color: #ffffff;
                  }
                }
              }
            }
          }
        }
        .content-tree {
          height: 300px;
          overflow-y: auto;
        }
      }
    }
  }
  .item-foot {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #0a2757;
    border-top: 1px solid #4b1f98;
    text-align: center;

    .el-button {
      width: 150px;

      &:first-child {
        background-color: #415982;
        border-color: #415982;
      }
    }
  }
}
</style>
