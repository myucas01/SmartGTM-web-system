<template>
  <div class="dialogBox">
    <div class="mainBox">
      <header>
        <span>查看</span>
        <i class="el-icon-close" @click="close"></i>
      </header>
      <div class="body">
        <div class="infoBox boxStyle">
          <div class="title">
            <div class="left">
              <span class="name">
                <span v-if="!editName">{{ detailObj.storesName }}</span>
                <el-input
                  v-model="detailObj.storesName"
                  v-if="editName"
                  size="small"
                ></el-input>
                <i
                  class="el-icon-edit "
                  v-if="!editName"
                  @click="editName = true"
                ></i>
                <i
                  class="el-icon-check submitBtn"
                  v-if="editName"
                  @click="submitName"
                ></i>
              </span>
              <span v-if="detailObj.storesStatus == 1" class="state1 ml20"
                ><i class="el-icon-remove mr5"></i>处理中</span
              >
              <span v-if="detailObj.storesStatus == 2" class="state2 ml20"
                ><i class="el-icon-error mr5"></i>错误</span
              >
              <span v-if="detailObj.storesStatus == 3" class="state3 ml20"
                ><i class="el-icon-success mr5"></i>可用</span
              >
              <span class="formula ml20"
                ><i class="el-icon-s-custom" style="color: #a634ef"></i>
                <span v-if="detailObj.storesMethod == 'seeds_auto'"
                  >自主上传</span
                >
                <span v-if="detailObj.storesMethod == 'seeds_ai'"
                  >AI自动规划</span
                >
                <span v-if="detailObj.storesMethod == 'opportunity_auto'"
                  >自主拓展</span
                >
                <span v-if="detailObj.storesMethod == 'opportunity_ai'"
                  >AI自动拓展</span
                >
              </span>
            </div>
            <div class="right">
              <div>
                <span
                  class="typeCell"
                  :class="{
                    color1: detailObj.storesType == 'seed_store',
                    color2: detailObj.storesType == 'opportunity_store'
                  }"
                >
                  <svg
                    class="icon svg-icon"
                    aria-hidden="true"
                    v-show="detailObj.storesType == 'seed_store'"
                  >
                    <use xlink:href="#iconicon_zzmd"></use>
                  </svg>
                  <svg
                    class="icon svg-icon"
                    aria-hidden="true"
                    v-show="detailObj.storesType == 'opportunity_store'"
                  >
                    <use xlink:href="#iconicon_sjmd"></use>
                  </svg>
                  {{
                    detailObj.storesType == 'seed_store'
                      ? '种子门店'
                      : '商机门店'
                  }}
                </span>
              </div>
              <span class="ml20">ID: {{ id }}</span>
            </div>
          </div>
          <div class="center">
            <div class="cell">
              <span class="label">行销公司</span>
              <span class="commpanyName">{{ detailObj.orgName }}</span>
              <!-- <span class="commpanyMore" @click="commpanyMore = !commpanyMore">更多</span> -->
              <div class="moreBox" v-show="commpanyMore">
                <div class="item">江苏行销公司</div>
                <div class="item">江苏行销公司</div>
                <div class="item">安徽行销公司</div>
                <div class="item">江苏行销公司</div>
                <div class="item">江苏行销公司</div>
                <div class="item">安徽行销公司</div>
              </div>
            </div>
            <div class="cell">
              <span class="label">{{
                detailObj.storesType == 'seed_store'
                  ? '种子门店数'
                  : '商机门店数'
              }}</span>
              <span class="num">{{
                detailObj.storesNumUse ? detailObj.storesNumUse : '-'
              }}</span>
            </div>
            <div class="cell" v-if="detailObj.storesType == 'seed_store'">
              <span class="label">种子门店识别率</span>
              <span class="num">{{ detailObj.storesRate }}%</span>
            </div>
            <div
              class="cell"
              v-if="detailObj.storesMethod == 'opportunity_auto'"
            >
              <span class="label">使用种子店群名称</span>
              <span class="font">{{ detailObj.seedStoresName }}</span>
            </div>
          </div>
          <div class="content">
            <div
              class="editBtn"
              :class="{ textR: contentShow }"
              v-show="!contentShow"
            >
              <p style="margin-bottom: 5px;">{{ detailObj.storesDescribe }}</p>
              <i
                class="el-icon-edit"
                style="cursor: pointer"
                @click="contentShow = true"
              ></i>
              <span
                class="editFont"
                @click="contentShow = true"
                style="cursor: pointer"
                v-show="!detailObj.storesDescribe"
                >添加描述</span
              >
            </div>
            <div
              class="editBtn"
              :class="{ textR: contentShow }"
              v-show="contentShow"
            >
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model="detailObj.storesDescribe"
              >
              </el-input>
              <i class="el-icon-check submitBtn" @click="submitDescribe"></i>
            </div>
          </div>
        </div>
        <!-- 特征权重 -->
        <div
          class="weight boxStyle"
          v-if="detailObj.storesMethod == 'opportunity_ai'"
        >
          <div class="weight_title">特征权重</div>
          <div class="weight_info">
            <div
              class="cell"
              v-for="(item, index) in detailObj.features"
              :key="index"
            >
              <span class="label">{{ item.featureName }}</span>
              <span class="num">{{ item.featureValue }}</span>
            </div>
          </div>
        </div>
        <!-- 特征权重 -->
        <div
          class="weight boxStyle"
          v-if="detailObj.storesMethod == 'opportunity_auto'"
        >
          <div class="weight_title">所选标签</div>
          <div class="weight_info" style="height: 150px;overflow: auto;">
            <storeDetail :storeList="detailObj.storeCondition"></storeDetail>
          </div>
        </div>
        <div class="table boxStyle">
          <el-table
            :data="detailObj.operateLogs"
            style="width: 100%"
            height="200px"
            :header-cell-style="{
              background: '#FBEBFE',
              color: '#1C2438',
              height: '40px',
              padding: 0,
              fontSize: '14px'
            }"
          >
            <el-table-column label="操作记录">
              <template slot-scope="scope">
                <span class="tableTitle">操作</span><br />
                <span class="tableMes">{{ scope.row.logType }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="" label="">
              <template slot-scope="scope">
                <span class="tableTitle">详情</span><br />
                <span class="tableMes">{{ scope.row.logContent }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="" label="">
              <template slot-scope="scope">
                <span class="tableTitle">时间</span><br />
                <span class="tableMes">{{
                  scope.row.createTime ? scope.row.createTime : '-'
                }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <footer>
        <div>
          <el-button
            size="mini"
            class="storeImgbtn"
            @click="goStoreImg"
            v-if="detailObj.storesStatus == 3"
            >门店画像</el-button
          >
          <el-button
            size="mini"
            type="primary"
            style="background: #a634ef"
            @click="goStores"
            v-show="
              detailObj.storesType == 'seed_store' &&
                detailObj.storesStatus == 3
            "
            >售点拓展</el-button
          >
        </div>
        <div>
          <el-button
            size="mini"
            icon="el-icon-upload2"
            v-if="detailObj.storesType == 'opportunity_store'&&detailObj.storesStatus == 3"
            class="updatebtn"
            @click="push"
            >推送</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-delete"
            class="delbtn"
            @click="del"
            >删除</el-button
          >
        </div>
      </footer>
    </div>
  </div>
</template>
<script>
import storeDetail from './screenStoreDetail'
export default {
  props: ['id'],
  data() {
    return {
      contentShow: false,
      commpanyMore: false,
      detailObj: {
        storesStatus: 1
      },
      editName: false,
      lableList: []
    }
  },
  created() {
    this.getDetail()
  },
  components: {
    storeDetail
  },
  methods: {
    getDetail() {
      let url = '/api/expand/business/getStoresDetail'
      this.$fetch
        .get(url, {
          storesId: this.id
        })
        .then(res => {
          if (res.code == 200) {
            console.log(res)
            this.detailObj = res.data

            for (let i in this.detailObj.storeCondition) {
              this.lableList.push({
                id: this.detailObj.storeCondition[i].key,
                name: this.detailObj.storeCondition[i].name,
                child: this.detailObj.storeCondition[i].values,
                link: [this.detailObj.storeCondition.length],
                level: this.detailObj.storeCondition[i].list.length,
                childLink: this.detailObj.storeCondition[i].list
              })
            }
          }
        })
        .catch(error => {
          console.log(error.message)
        })
    },
    submitName() {
      this.editName = false
      this.submitDetail()
    },
    submitDescribe() {
      this.contentShow = false
      this.submitDetail()
    },
    submitDetail() {
      let url = '/api/expand/business/updateStoresDetail'
      this.$fetch
        .get(url, {
          storesId: this.id,
          storesDescribe: this.detailObj.storesDescribe,
          storesName: this.detailObj.storesName
        })
        .then(res => {
          if (res.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getDetail()
          }
        })
        .catch(error => {
          console.log(error.message)
        })
    },
    close() {
      this.$emit('close')
    },
    push() {
      this.$emit('push', this.detailObj, this.id)
    },
    del() {
      this.$emit('del', this.id)
    },
    goStoreImg() {
      this.$router.push(
        '/business-expansion/map?storesId=' +
          this.id +
          '&storeType=' +
          this.detailObj.storesType +
          '&orgId=' +
          this.detailObj.orgId
      )
    },
    goStores() {
      this.$router.push(
        '/business-expansion/store-autonomy-dev?storesId=' + this.id
      )
    }
  }
}
</script>
<style scoped lang="scss">
.dialogBox {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  .mainBox {
    width: 1200px;
    height: 80%;
    margin: 100px auto;
    border-radius: 2px;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    header {
      display: flex;
      justify-content: space-between;
      padding: 10px 20px;
      span {
        font-size: 16px;
        font-weight: 600;
        color: #263a4f;
        line-height: 16px;
      }
      i {
        font-size: 16px;
        color: #c0ccda;
        cursor: pointer;
      }
    }
    .body {
      padding: 0 20px 10px;
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
      .submitBtn {
        font-size: 16px;
        cursor: pointer;
        color: #19be6b;
        font-weight: bolder;
        margin-top: 10px;
      }
      .boxStyle {
        background: #ffffff;
        box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.2);
        border-radius: 2px;
        border: 1px solid #e6e6e6;
      }
      .infoBox {
        padding: 0 15px 5px;
        .title {
          padding: 10px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .left {
            display: flex;
            align-items: center;
          }
          .name {
            font-size: 18px;
            font-weight: 600;
            line-height: 25px;
            display: flex;
            align-items: center;
            flex: 1;
            overflow: hidden;
            span {
              color: #7909c1;
            }
            i {
              cursor: pointer;
              margin-left: 5px;
            }
          }
          .state {
            margin-left: 15px;
          }
          .right {
            display: flex;
            align-items: center;
          }
          .typeCell {
            display: block;
            text-align: center;
            width: 100px;
            height: 34px;
            line-height: 34px;
            border-radius: 2px;
            border: 1px solid #ff9900;
            &.color1 {
              border-color: #ff9900;
              color: #ff9900;
            }
            &.color2 {
              border-color: #a634ef;
              color: #a634ef;
            }
          }
        }
        .center {
          border-top: 0.5px solid #bbbec4;
          border-bottom: 0.5px solid #bbbec4;
          display: flex;
          align-items: center;
          padding: 10px 0;
          .cell {
            display: flex;
            align-items: center;
            margin-right: 40px;
            position: relative;
          }
          .label {
            font-size: 12px;
            font-weight: 600;
            color: #495060;
            margin-right: 10px;
          }
          .num {
            font-size: 24px;
            font-weight: bold;
            color: #a634ef;
            flex: 1;
          }
          .commpanyName {
            line-height: 32px;
            background: #a634ef;
            padding: 0 10px;
            color: #ffffff;
            border-radius: 2px;
          }
          .commpanyMore {
            font-size: 12px;
            font-weight: 500;
            color: #80848f;
            line-height: 17px;
            margin-left: 10px;
            cursor: pointer;
          }
          .moreBox {
            width: 116px;
            height: 70px;
            background: rgba(28, 36, 56, 0.8);
            border-radius: 2px;
            position: absolute;
            bottom: -75px;
            right: 0;
            overflow: auto;
            padding: 5px;
            box-sizing: border-box;
            .item {
              color: #ffffff;
              padding: 3px;
            }
          }
          .font {
            font-size: 14px;
            font-weight: 600;
            color: #a634ef;
            flex: 1;
          }
        }
        .content {
          margin-top: 15px;
          .el-textarea {
            font-size: 12px;
            font-weight: 400;
            color: #495060;
            line-height: 17px;
            textarea {
              min-height: 60px;
            }
          }
          .editBtn {
            text-align: left;
            margin-top: 10px;
            &.textR {
              text-align: right;
            }
            .editFont {
              font-size: 12px;
              font-weight: 400;
              color: #a634ef;
              line-height: 17px;
              margin-left: 5px;
              text-decoration: underline;
            }
          }
        }
      }
      .weight {
        margin-top: 15px;
        .weight_title {
          height: 40px;
          background: #fbebfe;
          line-height: 40px;
          font-size: 14px;
          font-weight: 600;
          color: #1c2438;
          padding-left: 15px;
        }
        .weight_info {
          display: flex;
          padding-left: 15px;
          .cell {
            display: flex;
            align-items: center;
            margin-right: 50px;
          }
          .label {
            font-size: 12px;
            font-weight: 600;
            color: #8b8f9a;
            line-height: 17px;
            margin-right: 10px;
          }
          .num {
            font-size: 24px;
            font-weight: bold;
            color: #a634ef;
            line-height: 33px;
          }
        }
      }
      .table {
        height: 230px;
        margin-top: 15px;
        .tableTitle {
          font-size: 14px;
          font-weight: 600;
          color: #495060;
          line-height: 20px;
        }
        .tableMes {
          font-size: 12px;
          font-weight: 400;
          color: #495060;
          line-height: 17px;
        }
      }
    }
    footer {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #d8e4f0;
      padding: 15px 20px;
      .el-button {
        &.storeImgbtn {
          background-color: #ffffff;
          border-color: #a634ef;
          color: #a634ef;
        }
        &.updatebtn {
          background-color: #e0f0ff;
          border-color: #2d8cf0;
          color: #2d8cf0;
        }
        &.delbtn {
          background-color: #fce8e3;
          border-color: #ed3f14;
          color: #ed3f14;
        }
        &.is-disabled {
          background-color: #dddee1;
          border-color: #dddee1;
          color: #bbbec4;
        }
      }
    }
  }
}
.state1 {
  color: #ff9900;
}
.state2 {
  color: #ed3f14;
}
.state3 {
  color: #19be6b;
}
.f12 {
  font-size: 12px;
}
.f14 {
  font-size: 14px;
}
.mr5 {
  margin-right: 5px;
}
.ml20 {
  margin-left: 20px;
}
</style>
