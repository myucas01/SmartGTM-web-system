<template>
  <!-- 商圈对比和商圈截图按钮 -->
  <div class="business-cut-screen-and-compare">
    <div class="item-btn" @click="handleCompare">商圈对比</div>
    <div
      class="item-btn"
      @click="screenImgFunction('business-preview-wrapper', '400')"
    >
      商圈截图
    </div>
  </div>
</template>

<script>
import screenImg from '@/util/screenImg.js'
export default {
  name: 'cutScreenAndCompare',
  computed: {
    orgLevel() {
      return this.$store.state.businessPreview.orgLevel
    }
  },
  methods: {
    handleCompare() {
      this.$router.push({
        path: 'contrast',
        query: {
          // proNo: '2021Q11357531621502627840', // 方案id
          // orgId: '8263383099946881608',
          // orgName: '上海行销公司',
          // bccNo: '457975646' // 商圈编码
          proNo: this.$route.query.proNumber,
          orgId: this.$store.state.map.organizationId,
          orgName: this.$store.state.map.organizationName,
          bccNo: this.orgLevel
            ? ''
            : this.$store.state.businessPreview.businessNo
        }
      })
    },
		// 商圈截图
		screenImgFunction(id, width) {
			screenImg(id, width)
		}
  }
}
</script>

<style lang="scss" scoped>
.business-cut-screen-and-compare {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  width: 160px;
  height: 28px;
  background: #0a2757;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.46);
  .item-btn {
    flex: 1;
    font-size: 12px;
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    line-height: 28px;
    &:last-child {
      border-left: 1px solid rgba(255, 255, 255, 0.46);
    }
  }
}
</style>
