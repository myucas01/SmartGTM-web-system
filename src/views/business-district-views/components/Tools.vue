<!--工具栏-->
<template>
  <div class="tools-wrap">
    <div class="tools-content">
      <div  v-auth="'business:layout:set:contrast'" class="tools-wrap-item" @click="handleCompare">
         商圈对比
      </div>
      <div v-auth="'business:layout:set:screenshot'" class="tools-wrap-item" @click="screenImgFunction('business-wrap')">
        商圈截图
      </div>
    </div>
  </div>
</template>

<script>
import screenImg from '@/util/screenImg.js'
import {mapGetters} from 'vuex'

export default {
  name: 'tools',
  data() {
    return {
      toolsOptions: [],
      batchName: '批量网格选取',
      batchStatus: true,
      mouseTool: null,
      PolygonObj: '',
      MultiPolygon: '',
      polylineEditor: '',
      polyObj1: [],
      polyObj2: [],
      newMarkerList: [],
      newPolyMark: [],
      contextMenuObj: null,
      chooseShow: false
    }
  },
  props: ['AMap', 'newAMap'],
  computed: {
    ...mapGetters('businessPreview', ['operationCode', 'chooseBusinessMap', 'viewOrganize', 'chooseBusiness'])
  },
  methods: {
    // 商圈对比
    handleCompare() {
      if(this.chooseBusiness && this.chooseBusiness.length === 1) {
        this.$router.push({
          name: 'contrast',
          query: {
            proNo: this.viewOrganize.proNo,
            orgId: this.viewOrganize.orgId,
            orgName: this.viewOrganize.orgName,
            bccNo: this.chooseBusiness[0]
          }
        })
      } else {
        this.$message({
          message: '请选择1个商圈进行操作',
          type: 'warning'
        })
      }
    },
		// 商圈截图
		screenImgFunction(id) {
			screenImg(id)
		}
  }
}
</script>

<style scoped lang="less">
.tools-wrap {
  background-color: #0a2757;
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  border-radius: 4px;
  position: fixed;
  top: 56px;
  left: 357px;

  .tools-content {
    display: flex;
    height: 28px;
    line-height: 28px;
    background: #0a2757;
    border-radius: 4px;

    .tools-wrap-item {
      padding: 0 9px;
      position: relative;
      cursor: pointer;

      a {
        color: rgba(255, 255, 255, 0.6);
      }

      &:after {
        content: '';
        width: 1px;
        height: 19px;
        background-color: rgba(255, 255, 255, 0.6);
        position: absolute;
        top: 5px;
        right: 0;
      }

      &:last-child {
        &:after {
          display: none;
        }
      }
    }

    .active {
      background: #930CEA;
      color: #fff;
    }
  }
}
</style>