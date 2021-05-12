<template>
  <div class="tab">
    <div>
      <div class="scrollbar">
        <el-button v-for="(item, idx) in getTab"
                   :key="idx"
                   :type="item.on ? 'primary' : ''"
                   @click="toPages(item.link)">{{ item.title }}
          <i @click.stop="closePages(item)"
             class="el-icon-close"></i>
        </el-button>
      </div>
    </div>
    <em v-show="tabsNum >= 7">{{ tabsNum }}</em>
  </div>
</template>
<script>
export default {
  name: 'Tab',
  computed: {
    getTab() {
      return this.$store.state.tabs
    },
    tabsNum() {
      return this.$store.state.tabs.length || 0
    }
  },
  methods: {
    toPages(link) {
      this.$nextTick(() => {
        this.$router.push(link)
      })
    },
    closePages(obj) {
      let clc = {
        path: obj.path,
        pam: obj.pam,
        isPathNameCheck: obj.isPathNameCheck
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
  }
}
</script>
<style scoped lang="scss">
.tab {
  overflow: hidden;
  position: relative;
  height: 48px;
  text-align: left;
  display: flex;
  > div {
    flex: 1;
    overflow: hidden;
    .scrollbar {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      position: relative;
      padding-top: 10px;
      height: 38px;
      text-align: left;
      margin: 0 8px;
      button {
        margin-left: 12px;
        height: 28px;
        padding: 6px 12px;
        color: #fff;
        background: rgba(1, 39, 100, 0.46);
        border-radius: 4px;
        border: 1px solid rgba(4, 75, 136, 1);
        span {
          line-height: 16px;
          height: 16px;
        }
      }
      .el-button--primary {
        background: #7134ef;
        border: 1px solid #7134ef;
      }
      i {
        margin-left: 10px;
        color: #ced3dd;
      }
    }
  }
  em {
    margin: 10px 8px 0 0;
    width: 26px;
    height: 26px;
    line-height: 26px;
    background: rgba(19, 55, 115, 1);
    border-radius: 4px;
    border: 1px solid rgba(4, 75, 136, 1);
    font-size: 14px;
    font-weight: 400;
    font-style: normal;
    color: rgba(255, 255, 255, 1);
    text-align: center;
  }
}
.tab > div ::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px !important; /*高宽分别对应横竖滚动条的尺寸*/
  height: 10px !important;
}
.tab:before {
  position: absolute;
  left: 0;
  top: 9px;
  content: '.';
  text-indent: -9999px;
  display: block;
  width: 1px;
  height: 30px;
  background: #fff;
}
.tab:after {
  position: absolute;
  right: 0;
  top: 9px;
  content: '.';
  text-indent: -9999px;
  display: block;
  width: 1px;
  height: 30px;
  background: #fff;
}
</style>
