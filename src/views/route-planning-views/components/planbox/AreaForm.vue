<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :append-to-body="true"
  >
    <span slot="title" class="header-title">
      数据总览
      <el-tooltip placement="top">
        <div slot="content">数据总览</div>
        <span class="question">
          <svg
            t="1585551311735"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5000"
            width="16"
            height="16"
          >
            <path
              d="M512 113.406976c-219.789312 0-398.601216 178.816-398.601216 398.61248 0 219.773952 178.811904 398.573568 398.601216 398.573568s398.601216-178.799616 398.601216-398.573568C910.601216 292.224 731.789312 113.406976 512 113.406976zM552.2176 803.094528l-80.04608 0 0-80.04608 80.04608 0L552.2176 803.094528zM679.120896 446.205952c-11.713536 21.086208-34.623488 46.728192-68.722688 76.92288-22.908928 20.303872-37.874688 35.275776-44.904448 44.904448-7.027712 9.632768-12.237824 20.694016-15.618048 33.188864-3.386368 12.494848-5.339136 32.799744-5.85728 60.913664L476.4672 662.135808c-0.262144-9.371648-0.390144-16.400384-0.390144-21.086208 0-27.588608 3.904512-51.406848 11.713536-71.455744 5.723136-15.09376 14.96576-30.321664 27.722752-45.683712 9.371648-11.190272 26.222592-27.529216 50.566144-49.00352 24.337408-21.476352 40.15104-38.590464 47.44192-51.347456 7.284736-12.750848 10.933248-26.68032 10.933248-41.780224 0-27.332608-10.677248-51.347456-32.018432-72.042496-21.348352-20.69504-47.509504-31.041536-78.485504-31.041536-29.937664 0-54.928384 9.370624-74.970112 28.11392-20.047872 18.742272-33.188864 48.026624-39.437312 87.855104l-72.237056-8.590336c6.504448-53.359616 25.832448-94.230528 57.985024-122.606592 32.146432-28.36992 74.641408-42.560512 127.488-42.560512 55.964672 0 100.606976 15.227904 133.931008 45.683712 33.317888 30.456832 49.980416 67.295232 49.980416 110.502912C696.691712 402.082816 690.835456 425.120768 679.120896 446.205952z"
              fill="#d4d4d4"
              p-id="5001"
            ></path>
          </svg>
        </span>
      </el-tooltip>
    </span>
    <AllData :tableData="tableData"></AllData>
  </el-dialog>
</template>

<script>
import AllData from './AllData' // 数据总览
export default {
  props: [
    'tableData',
    'seconDaryData',
    'threeLevelData',
    'Secondary',
    'threeLevel'
  ],
  data() {
    return {
      dialogVisible: false
    }
  },
  components: { AllData },
  methods: {
    handleClose() {
      this.dialogVisible = false
    },
    tabData(data1, data2, data3) {
      this.$emit('tabData', data1, data2, data3)
    }
  }
}
</script>

<style scoped lang="scss">
.smart_table_deep {
  height: 100%;
}
::v-deep .el-dialog {
  background-color: #0a2757;
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 20px !important;
  .el-dialog__header {
    padding: 0;
    height: 40px;
    line-height: 40px;
    text-align: center;

    .header-title {
      color: #ffffff;
      font-size: 16px;
    }

    .el-dialog__headerbtn {
      top: 0;
      font-size: 20px;

      .el-dialog__close {
        color: #ffffff;
      }
    }
  }

  .el-dialog__body {
    padding: 4px 0px;
    flex: 1;
    overflow: hidden;
  }

  .el-dialog__footer {
    padding: 10px;

    .dialog-footer {
      width: 100%;

      span {
        font-size: 12px;
        color: #ffffff;
        width: 83px;
        height: 24px;
        line-height: 24px;
        display: inline-block;
        text-align: center;
        cursor: pointer;

        &:last-child {
          background-color: #930cea;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
