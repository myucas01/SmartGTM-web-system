<!--
    售点拓展：首页
-->
<template>
  <keep-alive>
    <div class="ExpansionBox" v-if="domStatus === true">
      <div class="top_title">
        <div class="title_left">
          <h1 class="h1">创建商机门店</h1>
          <p class="p1">为了更好的寻找高商机特征门店</p>
        </div>
        <div class="mendianBtn">
          <el-button @click="clickTo('店群详情')"
            ><img src="/img/storeDetailsBtn.png" alt=""
          /></el-button>
        </div>
      </div>
      <div class="contentBox">
        <div class="content_top">
          <img
            class="btnImage cursor"
            src="/img/seedStore.png"
            @click="clickTo('种子门店')"
            alt=""
          />
          <img class="backgrImage" src="/img/transiBackground1.png" alt="" />
          <img
            class="centerImage cursor"
            src="/img/GAIAComputer.png"
            alt=""
            @click="clickTo('GAIA门店')"
          />
          <img class="backgrImage" src="/img/transiBackground2.png" alt="" />
          <img
            class="btnImage cursor"
            src="/img/businessStore.png"
            @click="clickTo('商机门店')"
            alt=""
          />
        </div>
        <div class="content_bottom">
          <div class="first flex">
            <img
              src="/img/seedStore2.png"
              class="cursor"
              @click="clickTo('种子门店')"
              alt=""
            />
            <p class="p2">
              一旦您从自身系统收集了数据 <br />
              您就可以开始创建自己的新的<br />
              种子门店了
            </p>
          </div>
          <div class="second flex">
            <span>
              <p class="line1"></p>
              <img
                src="/img/icona-gaia.png"
                class="cursor"
                @click="clickTo('GAIA门店')"
                alt=""
              />
              <p class="line2"></p>
            </span>
            <p class="p2 text">
              根据你的数据，GAIA会在他们自己<br />的数据库中筛选与你当前的种子门<br />店有相同或相似的店群
            </p>
          </div>
          <div class="tredth flex">
            <img
              src="/img/businessStore2.png"
              class="cursor"
              @click="clickTo('商机门店')"
              alt=""
            />
            <p class="p2">
              GAIA创造了一个拓展店群包你<br />可以用来扩大你的门店业务获<br />得更高效益
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- <seed-store v-else-if='domStatus === false' ref="seedStore"></seed-store> -->
  </keep-alive>
</template>

<script>
// import seedStore from '../../components/business_expansion_comp/SeedStore'
export default {
  name: '',
  title() {
    return ''
  },
  data() {
    return {
      domStatus: true
    }
  },
  components: {
    // seedStore
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.commit('addTabs', {
        title: '售点拓展',
        link: '/business-expansion/index',
        on: true,
        needCatch: true
      })
    })
  },
  created() {},
  mounted() {},
  methods: {
    clickTo(item) {
      switch (item) {
        case '店群详情':
          this.$router.push('/business-expansion/store-community-list')
          break
        case '种子门店':
          // this.domStatus = false
          this.$router.push('/business-expansion/seed-store')
          break
        case '商机门店':
          this.$router.push('/business-expansion/business-opportunity-store')
          break
        case 'GAIA门店':
          this.$router.push('/business-expansion/gaia-store')
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
.ExpansionBox {
  width: 100%;
  height: 100%;
  position: relative;
  .top_title {
    position: relative;
    width: 100%;
    height: 90px;
    .title_left {
      margin-top: 45px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .h1 {
        font-size: 32px;
        color: #000000;
      }
      .p1 {
        margin-top: 15px;
        font-size: 20px;
      }
    }
    .mendianBtn {
      position: absolute;
      right: 25px;
      top: 0;
      ::v-deep .el-button {
        height: 32px;
        width: 128px;
        padding: 0px;
        img {
          height: 32px;
          width: 128px;
        }
      }
    }
  }
  .contentBox {
    width: 1098px;
    margin: 0 auto;
    margin-top: 49px;
    .content_top {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .btnImage {
        width: 270px;
        height: 270px;
      }
      .backgrImage {
        flex: 1;
        height: 40px;
      }
      .centerImage {
        width: 175px;
        height: 160px;
      }
      .cursor {
        cursor: pointer;
      }
    }
    .content_bottom {
      width: 100%;
      display: flex;
      flex-direction: row;
      margin-top: 45px;
      .first {
        width: 170px;
        margin-left: 45px;
        img {
          width: 148px;
          height: 42px;
          margin-bottom: 16px;
        }
        .cursor {
          cursor: pointer;
        }
      }
      .second {
        flex: 1;
        span {
          width: 100%;
          height: 42px;
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-bottom: 16px;
          img {
            width: 148px;
            height: 42px;
          }
          .cursor {
            cursor: pointer;
          }
          .line1 {
            display: flex;
            width: 44%;
            height: 0px;
            border-top: 1px solid #bbbec4;
          }
          .line2 {
            display: flex;
            flex: 1;
            height: 0px;
            border-top: 1px solid #bbbec4;
          }
        }
        .text {
          margin-left: 12%;
        }
      }
      .tredth {
        width: 180px;
        margin-right: 55px;
        img {
          width: 148px;
          height: 42px;
          margin-bottom: 16px;
        }
        .cursor {
          cursor: pointer;
        }
      }
      .flex {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .p2 {
        font-size: 13px;
        color: #495060;
      }
    }
  }
}
</style>
