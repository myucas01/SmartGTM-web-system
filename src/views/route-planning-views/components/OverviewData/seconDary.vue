<template>
  <!-- 查看区域门店 -->
  <el-table
    :data="tableData"
    size="mini"
    class="newtable"
    border
    height="100%"
    style="width: 100%"
    :cell-style="cellStyle"
    :header-cell-style='headStyle'
  >
    <el-table-column fixed prop="serviceDay" label="服务日"></el-table-column>
    <el-table-column
      prop="planVisitCount"
      label="计划拜访数(家)"
    ></el-table-column>
    <el-table-column label="预计平均每日工作时长(小时)">
      <el-table-column label="在店时长" prop="avgVisitDuration"></el-table-column>
      <el-table-column label="路程时长" prop="avgDistanceDuration"></el-table-column>
      <el-table-column label="合计" prop="durationCount"></el-table-column>
    </el-table-column>

    <el-table-column
      prop="performance"
      label="销量(箱)"
    ></el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button @click="SecondaryClick(scope.row)" type="text" size="small" v-if="!scope.row.btnShow"
          >查看</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: "seconDary",
  props:['tableData'],
  data() {
    return {
    };
  },
  methods: {
    SecondaryClick(row) {
      console.log("查看数据");
      console.log(row);
      this.$emit("tabData", "threeLevel",row.serviceDay,row.areaId,row.routeId);
    },
    cellStyle(){
      let styleObj = {}
      styleObj = {
        'padding':'0px !important',
        'background': '#0a2757',
        'color': '#ffffff',
        'border-color': '#4f707f',
      }
      return styleObj
    },
    headStyle(){
      let styleObj = {}
      styleObj = {
        'padding':'0px !important',
        'background': '#4e19a0',
        'color': '#ffffff',
        'border-color': '#4f707f',
      }
      return styleObj
    }
  },
};
</script>
<style lang="scss" scoped>
  .newtable {
    border: 1px solid rgb(79, 112, 127);
    background-color: rgb(10, 39, 87);
    ::-webkit-scrollbar-track{
      background-color: rgb(10, 39, 87);
      border-top: 1px solid rgb(79, 112, 127);
      border-radius: 0px;
      box-sizing: content-box;
    }
    ::-webkit-scrollbar-thumb{
      background-color: #8592aa;
    }
  }
</style>

