<template>
  <div class="entry-box">
    <div class="entry-header">
      <span class="text-box">服务终端、掌控终端、决胜终端</span>
    </div>
    <div class="entry-content">
      <div class="content-outBox">
        <div
          class="content-inBox"
          v-for="(item, index) in dataList"
          :key="index"
          @click="clickBtn(item.jumpUrl)"
        >
          <img class="imgBox" :src="imgs[item.menuName]" alt="图片" />
          <p class="textBox">{{ item.menuName }}</p>
          <p class="textInfoBox">{{ item.copyName }}</p>
        </div>
      </div>
    </div>
    <div class="entry-footer">
      <p>© 2020 上海晶确科技有限公司</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Entry',
  data() {
    return {
      dataList: JSON.parse(window.localStorage.getItem('entryList')),
      imgs: {
        ['组织边界']: '/img/buss-district.png',
        ['网点分布']: '/img/networkS.png',
        ['售点拓展']: '/img/BusinessOpportunity.png',
        ['路线规划']: '/img/routerOptimization.png',
        ['商圈布局']: '/img/businessDistrict.png'
      }
    }
  },
  methods: {
    clickBtn(jumpUrl = '/index') {
      setTimeout(() => {
        var f = false
        var a = JSON.parse(window.sessionStorage.getItem('pages'))
        a.map(item => {
          if (item.link.includes(jumpUrl) && item.isPathNameCheck) {
            f = true
            // this.$router.push(item.link)
            location.href = item.link
            return
          }
        })
        if (!f) {
          setTimeout(() => {
            this.$router.push(jumpUrl)
          }, 50)
        }
      }, 50)
    }
  }
}
</script>
<style scoped lang="scss">
.entry-box {
  height: 100%;
  width: 100%;
  position: relative;
  .entry-header {
    height: 93px;
    display: flex;
    justify-content: center;
    align-items: center;
    .text-box {
      display: flex;
      flex-direction: row;
      font-size: 24px;
      color: #3a3a3a;
      font-weight: 600;
      letter-spacing: 3px;
      .text-p {
        letter-spacing: 3px;
        color: #bf4def;
      }
    }
  }
  .entry-content {
    width: 989px;
    height: 542px;
    background: #ffffff;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    margin: 0 auto;
    .content-outBox {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      // justify-content: space-around;
      padding: 10px 57px 0 57px;
      .content-inBox {
        margin: 20px 32px 0px 32px;
        width: 225px;
        height: 228px;
        border-radius: 4px;
        border: 1px solid #cccccc;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        .imgBox {
          width: 76px;
          height: 76px;
          margin-top: 40px;
        }
        .textBox {
          margin-top: 26px;
          color: #3a3a3a;
          font-size: 18px;
        }
        .textInfoBox {
          margin-top: 16px;
          color: #a4a4a4;
          font-size: 14px;
        }
      }
    }
  }
  .entry-footer {
    position: absolute;
    bottom: 64px;
    left: 0;
    width: 100%;
    p {
      width: 100%;
      text-align: center;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.58);
      line-height: 19px;
    }
  }
}
</style>
