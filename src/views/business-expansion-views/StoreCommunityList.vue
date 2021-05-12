<!--
    售点拓展：店群详情列表
-->
<template>
  <div class="StoreCommunityListBox">
    <!-- 筛选区域 -->
    <div class="headerBox">
      <el-button icon="el-icon-arrow-left" size="mini" @click="goBack"
        >返回</el-button
      >
      <div class="labelBox">
        <span>名称</span>
        <el-input
          size="mini"
          placeholder="请输入内容"
          suffix-icon="el-icon-search"
          v-model="storesName"
        >
        </el-input>
      </div>
      <div class="labelBox">
        <span>类型</span>
        <el-select v-model="storesType" placeholder="请选择" size="mini">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="labelBox">
        <span>状态</span>
        <el-select v-model="storesStatus" placeholder="请选择" size="mini">
          <el-option
            v-for="item in stateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <el-button
        size="mini"
        type="primary"
        @click="queryList"
        style="margin-left: 30px"
        >查询</el-button
      >
      <el-button size="mini" @click="resetForm">重置</el-button>
    </div>
    <div class="contentBox">
      <el-table
        :data="tableData"
        style="width: 100%"
        height="100%"
        :header-cell-style="{ background: '#F8F8F9' }"
      >
        <el-table-column label="名称" fixed="">
          <template slot-scope="scope">
            <div class="rowName">
              {{ scope.row.storesName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="180">
          <template slot-scope="scope">
            <span
              class="typeCell"
              :class="{
                color1: scope.row.storesType == 'seed_store',
                color2: scope.row.storesType == 'opportunity_store'
              }"
            >
              <svg
                class="icon svg-icon"
                aria-hidden="true"
                v-show="scope.row.storesType == 'seed_store'"
              >
                <use xlink:href="#iconicon_zzmd"></use>
              </svg>
              <svg
                class="icon svg-icon"
                aria-hidden="true"
                v-show="scope.row.storesType == 'opportunity_store'"
              >
                <use xlink:href="#iconicon_sjmd"></use>
              </svg>
              {{
                scope.row.storesType == 'seed_store' ? '种子门店' : '商机门店'
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="storesStatus" label="状态" width="200">
          <template slot-scope="scope">
            <div v-if="scope.row.storesStatus == 1" class="stateCell state1">
              <div class="f14 bold">
                <i class="el-icon-remove mr5"></i>处理中
              </div>
              <div class="f12">{{scope.row.storesStatusDescribe}}</div>
            </div>
            <div v-if="scope.row.storesStatus == 2" class="stateCell state2">
              <div class="f14 bold"><i class="el-icon-error mr5"></i>错误</div>
              <div class="f12">{{scope.row.storesStatusDescribe}}</div>
            </div>
            <div v-if="scope.row.storesStatus == 3" class="stateCell state3">
              <div class="f14 bold">
                <i class="el-icon-success mr5"></i>可用
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="storesNumUse" label="可用门店数" width="320">
          <template slot-scope="scope">
            <div style="display: flex; align-items: center">
              <div style="width: 200px; margin-right: 5px; overflow: hidden">
                <el-progress
                  color="#FF9900"
                  :show-text="showText"
                  :percentage="scope.row.storeRatio ? scope.row.storeRatio : 0"
                  v-if="scope.row.storesType == 'seed_store'"
                ></el-progress>
                <el-progress
                  :percentage="
                    scope.row.storeRatio ? scope.row.storeRatio : 0
                  "
                  :show-text="showText"
                  color="#AF3BF1"
                  v-if="scope.row.storesType == 'opportunity_store'"
                ></el-progress>
              </div>
              <div class="number">
                {{ scope.row.storesNumUse ? scope.row.storesNumUse : 0 }}
                <span v-if="scope.row.storesType == 'seed_store'"
                  >({{ scope.row.storeRatio }}%)</span
                >
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="创建时间" width="220">
          <template slot-scope="scope">
            <div>
              <span class="date">{{ scope.row.createTime }}</span>
              <div class="update">
                上次更新时间：{{
                  scope.row.updateTime ? scope.row.updateTime : '-'
                }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <div>
              <el-button
                size="mini"
                icon="el-icon-view"
                class="lookbtn"
                :disabled="scope.row.storesStatus == 1"
                @click="godetail(scope.row.id)"
                >查看</el-button
              >
              <el-button
                size="mini"
                icon="el-icon-upload2"
                class="updatebtn"
                v-if="scope.row.storesType == 'opportunity_store'"
                :disabled="
                  scope.row.storesStatus == 1 || scope.row.storesStatus == 2
                "
                @click="push(scope.row,scope.row.id)"
                >推送</el-button
              >
              <el-button
                size="mini"
                icon="el-icon-upload2"
                class="updatebtn"
                v-if="scope.row.storesType == 'seed_store'"
                :disabled="
                  scope.row.storesStatus == 1 || scope.row.storesStatus == 2
                "
                @click="goStores(scope.row.id)"
                >拓展</el-button
              >
              <el-button
                size="mini"
                icon="el-icon-delete"
                class="delbtn"
                :disabled="scope.row.storesStatus == 1"
                @click="del(scope.row.id)"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footerBox">
      <div class="page_Box">
        <div>
          <span class="pageIndex"
            >共{{ total }}条记录 第{{ pageNum }}页/共{{ totalPages }}页</span
          >
        </div>
        <div>
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[10, 20, 30, 100]"
            :page-size="pageSize"
            layout="prev, pager, next, sizes"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <detaildialog
      ref="dialog"
      :id="rowId"
      v-if="detailDialogShow"
      @close="closeDialog"
      @push="push"
      @del="del"
    ></detaildialog>
  </div>
</template>

<script>
import detaildialog from '../../components/business_expansion_comp/storeCommunityDialog'
import { mapGetters } from 'vuex'
export default {
  name: 'StoreCommunityList',
  title() {
    return ''
  },
  // beforeRouteEnter(to, from, next) {
  //   next((vm) => {
  //     vm.$store.commit('addTabs', {
  //       title: '店群清单',
  //       link: '/business-expansion/store-community-list',
  //       on: true,
  //       needCatch: true
  //     })
  //   })
  // },
  data() {
    return {
      showText: false,
      storesName: '',
      storesType: '',
      storesStatus: '',
      detailDialogShow: false,
      typeOptions: [
        {
          label: ' 种⼦⻔店',
          value: 'seed_store'
        },
        {
          label: ' 商机⻔店',
          value: 'opportunity_store'
        }
      ],
      stateOptions: [
        {
          label: ' 处理中',
          value: '1'
        },
        {
          label: ' 错误',
          value: '2'
        },
        {
          label: ' 可⽤',
          value: '3'
        }
      ],
      tableData: [],
      rowId: '',
      total: 0,
      pageNum: 1,
      pageSize: 10,
      totalPages: ''
    }
  },
  components: {
    detaildialog
  },
  created() {
    this.getList()
  },
  computed: {
            ...mapGetters('common', ['currentMessage'])
        },
  watch: {
            // 消息 监听 刷新 数据状态
            currentMessage() {
                if (this.currentMessage) {
                    let currentMessage = JSON.parse(this.currentMessage)
                    if (currentMessage.bussinessCode === '107'||currentMessage.bussinessCode === '108') {                        
                        this.getList()
                    }
                }
            }
        },
  mounted() {
    if (this.$route.query.id) {
      this.godetail(this.$route.query.id)
    }
  },
  methods: {
    goBack() {
      this.$router.push('/business-expansion/index')
    },
    getList() {
      let url = '/api/expand/seed/get-exp-stores'
      this.$fetch
        .get(url, {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          storesName: this.storesName,
          storesStatus: this.storesStatus,
          storesType: this.storesType
        })
        .then((res) => {
          if (res.code == 200) {
            for (let i in res.data.list) {
              // let num = res.data.list[i].storeRatio
              if (res.data.list[i].storeRatio) {
                res.data.list[i].storeRatio = Number(
                  res.data.list[i].storeRatio.slice(
                    0,
                    res.data.list[i].storeRatio.length - 1
                  )
                )
              } else {
                res.data.list[i].storeRatio = 0
              }
              console.log(res.data.list[i].storeRatio)
            }
            this.tableData = res.data.list
            this.total = res.data.total
            this.totalPages = res.data.pages
          }
        })
        .catch((error) => {
          console.log(error.message)
        })
    },
    handleSizeChange(val) {
      console.log(val)
      this.pageNum = 1
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(val)
      this.pageNum = val
      this.getList()
    },
    queryList() {
      this.pageNum = 1
      this.getList()
    },
    resetForm() {
      this.storesName = ''
      this.storesStatus = ''
      this.storesType = ''
      this.pageNum = 1
      this.getList()
    },
    godetail(id) {
      console.log(id)
      console.log('打开详情。。。')
      this.rowId = id
      this.detailDialogShow = true
      console.log(this.detailDialogShow)
    },
    goStores(id) {
      this.$router.push(
        '/business-expansion/business-opportunity-store?storesId=' + id
      )
    },
    closeDialog() {
      this.detailDialogShow = false
    },
    del(id) {
      console.log(id)
      console.log('删除。。。')
      this.$confirm(' 确认删除该店群么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.closeDialog()
          this.delSubmit(id)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    delSubmit(id) {
      let url = '/api/expand/business/deleteStoresDetail'
      this.$fetch
        .get(url, {
          storesId: id
        })
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          }
        })
        .catch((error) => {
          console.log(error.message)
        })
    },
    push(info,id) {
      this.$router.push(
        '/business-expansion/map?storesId=' +
          id +
          '&storeType=' +
          info.storesType +
          '&orgId=' +
          info.orgId
      )
      setTimeout(() => {
        this.$store.commit('businessExpansionModule/SET_IS_OPEN_EXPORT', true)
      }, 300)
    }
  }
}
</script>

<style scoped lang="scss">
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
.StoreCommunityListBox {
  width: 100%;
  position: relative;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  .headerBox {
    display: flex;
    padding: 10px 0;
    .labelBox {
      display: flex;
      align-items: center;
      margin-left: 30px;
      span {
        height: 20px;
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #80848f;
        line-height: 20px;
        margin-right: 10px;
      }
      .el-input {
        flex: 1;
      }
    }
  }
  .contentBox {
    // width: 100%;
    flex: 1;
    .rowName {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .number {
      font-size: 12px;
      font-weight: bold;
      color: #495060;
      line-height: 16px;
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
    .stateCell {
      .bold {
        font-weight: 500;
      }
    }
    .date {
      font-size: 14px;
      font-weight: 600;
      color: #495060;
      line-height: 20px;
    }
    .update {
      font-size: 10px;
      font-weight: 400;
      color: #495060;
      line-height: 14px;
    }

    .el-button {
      &.lookbtn {
        background-color: #fbebfe;
        border-color: #930cea;
        color: #930cea;
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
  .footerBox {
    height: 67px;
    width: 100%;
    border-top: 1px solid #e9eaec;
    .page_Box {
      display: flex;
      justify-content: space-between;
      padding: 20px 40px;
    }
    .pageIndex {
      font-size: 13px;
      font-weight: 400;
      color: #80848f;
      line-height: 32px;
    }
  }
  .dialogBox {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    .mainBox {
      width: 80%;
      height: 80%;
      position: absolute;
      top: 10%;
      left: 10%;
      background: #ffffff;
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
        }
      }
      .body {
        padding: 10px 20px;
        .infoBox {
          background: #ffffff;
          box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.2);
          border-radius: 2px;
          border: 1px solid #e6e6e6;
          padding: 0 15px;
          .title {
            padding: 10px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .name {
              font-size: 18px;
              font-weight: 600;
              color: #7909c1;
              line-height: 25px;
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
            justify-content: space-between;
            .cell {
              display: flex;
              align-items: center;
            }
            .label {
              font-size: 12px;
              font-weight: 600;
              color: #495060;
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
}
</style>
