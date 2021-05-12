<template>
  <div class="display-config-wrapper">
    <div class="display-config-wrap">
      <div class="display-title">展示效果配置</div>
      <div class="display-content">
        <div class="sub-title">展示效果配置</div>
        <div class="color-wrap">
          <div class="name-title">
            <div class="name">商圈级别</div>
          </div>
          <div class="color-group" v-for="(item, idx) in levelList" :key="idx">
            <div class="level-name" :title="item.proLevelName">{{ item.proLevelName }}</div>
            <el-color-picker
              v-model="item.rgba"
              show-alpha
              size="small"
              @change="handleColorChanged(idx)"
            ></el-color-picker>
          </div>
        </div>
      </div>
      <div class="display-footer">
        <el-button
          type="primary"
          @click="onSubmit"
          size="small"
          v-auth="'business:layout:preview:save'"
          >保存</el-button
        >
        <el-button @click="onCancel" size="small">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'displayConfig',
  data() {
    return {
      levelList: []
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.commit('addTabs', {
        title: '展示效果配置',
        link: to.fullPath,
        on: true,
        needCatch: true,
        isPathNameCheck: true
      })
    })
  },
  created() {
    this.getLevelList()
  },
  methods: {
    async getLevelList() {
      let url = '/api/business/grading/show/query'
      let params = { proNo: this.$route.query.proNo }
      await this.$fetch.get(url, params).then(res => {
        this.levelList = res.data
      })
      for (var i = 0; i < this.levelList.length; i++) {
        let item = this.levelList[i]
        // 如果没有proDiaphaneity值，默认为1
        const rgba = this.hexColorToRgba(
          item.proColor,
          item.proDiaphaneity || 1
        )
        this.$set(item, 'rgba', rgba)
      }
    },
    onSubmit() {
      let url = '/api/business/grading/show/upd'
      let params = this.levelList
      this.$fetch.post(url, params, false, true).then(res => {
        if (res.code == 200) {
          this.$message.success(res.message)
          this.$router.push('/business-district/business-district-scheme-list')
        }
      })
    },
    onCancel() {
      this.$router.push('/business-district/business-district-scheme-list')
    },
    handleColorChanged(idx) {
      const item = this.levelList[idx]
      const obj = this.rgbaToHexColor(item.rgba)
      this.levelList[idx].proColor = obj.hexColor
      this.levelList[idx].proDiaphaneity = obj.alpha
    },
    /**
     * 16进制颜色 转 rgba
     * @param hexColor #ffffff/#fff
     * @param alpha alpha通道-透明度
     * @returns {rgba(255, 255, 255, 1)}
     */
    hexColorToRgba(hexColor, alpha = 1) {
      hexColor = hexColor.replace('#', '')
      //用于分割16进制色彩通道的正则
      let reg = new RegExp('\\w{1,2}', 'g')
      if (hexColor.length < 4) {
        reg = new RegExp('\\w{1}', 'g')
      }
      //分割颜色通道
      let rgbaArray255 = hexColor.match(reg)
      rgbaArray255 = rgbaArray255.map(channel => {
        //计算每个通道的10进制值
        let colorVal = parseInt(channel, 16)
        return colorVal
      })
      return `rgba(${rgbaArray255.join(',')},${alpha})`
    },
    /**
     * rgba 转 16进制颜色和alpha值
     * @param rgba rgba(255, 255, 255, 1)
     * @returns {*{hexColor: '', alpha: ''}}
     */
    rgbaToHexColor(rgba = 'rgba(255, 255, 255, 1)') {
      // 删除空格-分隔出通道色值-转换成数组
      const trimStr = rgba.replace(/\s*/g, '')
      const rgbaStr = trimStr.split('(')[1].split(')')[0]
      const rgbaArray = rgbaStr.split(',')
      let obj = {
        hexColor: '#',
        alpha: ''
      }
      rgbaArray.forEach((chanel, index) => {
        if (index < 3) {
          let hexNum = Number(chanel).toString(16)
          // 部分通道数字小于10的情况进行补位
          obj.hexColor += hexNum.length === 1 ? '0' + hexNum : hexNum
        } else {
          obj.alpha = chanel
        }
      })
      return obj
    }
  }
}
</script>

<style lang="scss" scoped>
.display-config-wrapper {
  width: 100%;
  background: #f0f2f5;
  div {
    box-sizing: border-box;
  }
  .display-config-wrap {
    margin: 0 auto;
    width: 1194px;
    // position: relative;
    .display-title {
      height: 82px;
      line-height: 82px;
      text-align: center;
      font-size: 24px;
      font-weight: 600;
      color: #1e2840;
    }
    .display-content {
      height: calc(100vh - 210px);
      background: #ffffff;
      .sub-title {
        height: 40px;
        line-height: 40px;
        padding-left: 30px;
        font-size: 14px;
        font-weight: 600;
        color: #1c2438;
        box-shadow: 0px 1px 0px 0px #dddee1;
      }
      .color-wrap {
        height: calc(100% - 40px);
        padding: 20px 0 20px 60px;
        overflow-y: auto;
        .name-title {
          width: 260px;
          height: 50px;
          line-height: 50px;
          border: 1px solid #e0e6ed;
          .name {
            width: 223px;
            height: 32px;
            line-height: 32px;
            border-radius: 4px;
            border: 1px solid #dddee1;
            padding-left: 5px;
            font-size: 12px;
            color: #495060;
            margin: 9px 15px;
          }
        }
        .color-group {
          width: 260px;
          height: 62px;
          border: 1px solid #e0e6ed;
          border-top: none;
          line-height: 30px;
          padding: 15px;
          display: flex;
          .level-name {
            flex-basis: 180px;
            height: 32px;
            border-radius: 4px;
            border: 1px solid #dddee1;
            margin-right: 10px;
            padding-left: 5px;
            font-size: 12px;
            color: #495060;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .display-footer {
      // position: absolute;
      // bottom: 0;
      // left: 0;
      // width: 100%;
      height: 80px;
      line-height: 80px;
      text-align: center;
      // padding-top: 24px;
    }
  }
}
</style>
