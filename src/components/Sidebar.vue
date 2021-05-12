<template>
  <nav
    :class="$store.state.show == 1 ? 'show' : ''"
    @mouseenter="changeIsNavs(1)"
    @mouseleave="changeIsNavs(0)"
  >
    <h2>
      <img class="logo" src="/img/logo.png" />
      <img class="title-img" src="/img/sidebar-title.png" />
    </h2>

    <div class="first-level" v-show="$store.state.step == 1">
      <a class="to-gtm-btn" href="/index">Smart GTM</a>
      <div class="nav-btn">
        <a
          v-for="(item, i) in nav"
          :key="i"
          href="javascript:void(0);"
          @click="changeNavPage({ link: item.name, step: 2, show: 1 })"
        >
          <img src="/img/icon/nav-icon1.png" />
          <span>{{ item.menuName }}</span>
        </a>
      </div>
    </div>

    <div class="second-level" v-show="$store.state.step == 2">
      <a
        class="to-gtm-btn"
        href="javascript:void(0);"
        @click="changeNavPage({ step: 1, show: 1 })"
      >
        Smart GTM {{ navDataCurrent.menuName }}
      </a>
      <ul class="outer-ul">
        <li
          v-for="(item, i) in navDataCurrent.list"
          :key="i"
          :class="item.cur ? 'cur' : ''"
        >
          <h3>
            <a href="javascript:void(0);" @click="toChannel(item)">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#iconicon_dash"></use>
              </svg>
              <span>{{ item.menuName }}</span>
              <i
                v-if="item.url == '' || item.url == null"
                class="el-icon-arrow-down"
              ></i>
            </a>
          </h3>
          <ul v-show="!item.url && item.open == 1" class="sub-nav">
            <li v-for="(subitem, j) in item.list" :key="j">
              <a
                v-if="subitem.menuName != '客户规模'"
                :class="subitem.cur ? 'subcur' : ''"
                href="javascript:void(0);"
                @click="toChannel(subitem)"
                >{{ subitem.menuName }}</a
              >
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
export default {
  name: '',
  data() {
    return {
      isNav: 1,
      nav: JSON.parse(window.localStorage.getItem('menuList')).filter(t => {
        return t.menuName != '系统管理'
      }),
      navDataCurrent: {},
      urlAStr: '',
      urlBStr: ''
    }
  },
  beforeMount() {
    const arr = window.location.pathname.split('/')
    this.urlAStr = arr[1]
    this.urlBStr = arr[2]
    if (
      this.urlAStr == 'organize-boundaries' ||
      this.urlAStr == 'business-navigate' ||
      this.urlAStr == 'route-planning'
    ) {
      this.changeNavPage({ link: this.urlAStr, step: 2, show: 1 })
      this.triggerNav()
    }
  },
  mounted() {},
  methods: {
    changeIsNavs() {
      this.isNav = this.isNav == 1 ? 0 : 1
      this.$store.dispatch('changeIsNav')
      // this.$store.commit('changeIsNav', this.isNav)
    },
    changeNavPage(value) {
      if (value.link) {
        // this.navDataCurrent = this.nav.filter(item => {
        //   return item.name == value.link
        // })[0]
        const c = (this.navDataCurrent = this.nav.filter(item => {
          return item.name == value.link
        })[0])
        c.list.map(citem => {
          citem.open = 0
        })
        this.navDataCurrent = c
      }
      this.$store.commit('changeNav', { step: value.step, show: value.show })
    },
    toChannel(o) {
      if (o.url) {
        // location.href = `${o.url}`
        console.log('asdfasdfsd')
        this.$router.push(o.url)
      } else {
        this.navDataCurrent.list.map(item => {
          item.open = item.menuName == o.menuName ? 1 : 0
        })
      }
    },
    // tosubitemurl() {
    //   subitem.url
    // },
    triggerNav() {
      this.navDataCurrent.list.map((c, cIdx) => {
        c.cur = false
        if (c.url && c.name == this.urlBStr) {
          c.cur = true
        } else if (c.list) {
          c.list.map((w, wIdx) => {
            if (w.name == this.urlBStr) {
              this.navDataCurrent.list[cIdx].cur = true
              this.navDataCurrent.list[cIdx].open = 1
              this.navDataCurrent.list[cIdx].list[wIdx].cur = true
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
nav {
  position: absolute;
  width: 0px;
  height: 100vh;
  overflow: hidden;
  top: 0;
  left: 0;
  z-index: 10000;
  background: #001529;
  color: rgba(255, 255, 255, 1);
  transition: width 0.3s;
  -moz-transition: width 0.3s; /* Firefox 4 */
  -webkit-transition: width 0.3s; /* Safari and Chrome */
  -o-transition: width 0.3s;
  h2 {
    width: 256px;
    height: 50px;
    vertical-align: middle;
    background: #0a2757;
    text-align: left;
    i {
      float: left;
      margin: 11px 14px 0;
      font-size: 24px;
    }
    img {
      float: left;
      display: inline-block;
    }
    .logo {
      margin: 8px 12px 0;
      display: block;
      width: 32px;
    }
    .title-img {
      margin-top: 13px;
      width: 149px;
    }
  }
  .first-level {
    width: 256px;
    .to-gtm-btn {
      position: relative;
      padding-left: 13px;
      height: 50px;
      line-height: 50px;
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      text-align: left;
    }
  }
  .second-level {
    .to-gtm-btn {
      position: relative;
      margin-bottom: 4px;
      padding-left: 40px;
      display: block;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
    }
    .to-gtm-btn:before {
      position: absolute;
      display: inline-block;
      width: 12px;
      height: 12px;
      line-height: 12px;
      top: 14px;
      left: 14px;
      content: '<';
      color: #fff;
    }
    .outer-ul {
      li {
        margin-top: 8px;
        // height: 40px;
        h3 {
          height: 40px;
          a {
            display: block;
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            font-weight: 400;
            color: #ffffff;
            .icon {
              padding: 14px 17px 0 25px;
            }
            span {
            }
            i:before {
              float: right;
              margin: 0;
              padding: 12px 10px 0 12px;
              width: 12px;
              height: 12px;
              display: block;
            }
          }
          a:hover,
          a.cur {
            background: #7909c1;
          }
        }
        ul li {
          a {
            padding-left: 57px;
            display: block;
            height: 40px;
            line-height: 40px;
          }
          a:hover {
            background: #4e19a0;
          }
        }
        a:hover,
        a.cur {
          background: #7909c1;
        }
      }
      li.cur {
        h3 a {
          background: #7909c1;
        }
        ul {
          display: block;
          a.subcur {
            background: #4e19a0;
          }
        }
      }
    }
  }
  .nav-btn {
    padding: 16px 12px 0;
    width: 232px;
    display: flex;
    flex-wrap: wrap;
    background: #000c17;
    a {
      margin: 0 11px 20px 0;
      display: inline-block;
      flex-basis: calc(33% - 11px);
      width: 33%;
      height: 58px;
      text-align: center;
      color: #fff;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.4);
      font-size: 12px;
      img {
        float: left;
        margin: 10px 0 5px 24px;
        display: inline-block;
        width: 20px;
        height: 20px;
      }
      span {
        float: left;
        display: block;
        width: 100%;
        line-height: 17px;
        text-align: center;
      }
    }
    a:nth-child(3n) {
      margin-right: 0;
    }
  }
  ul {
    li {
      a {
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
      }
    }
  }
}
nav.show {
  width: 256px;
}
</style>
