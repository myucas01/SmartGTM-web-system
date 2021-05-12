<template>
  <!-- 数据总览 -->
  <el-table
    class="smart_table_deep"
    :data="tableData"
    size="mini"
    border
    height="100%"
  >
    <el-table-column
      fixed
      prop="jobName"
      label="岗位"
      width="150px"
      align="center"
    ></el-table-column>
    <el-table-column
      prop="perSon"
      width="180px"
      label="区域编码(人员)"
      align="center"
    >
      <template slot-scope="scope">
        {{ scope.row.areaName }}<span v-if="scope.row.saleName">（</span
        >{{ scope.row.saleName }}<span v-if="scope.row.saleName"> ）</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="rountSum"
      label="路线数量"
      align="center"
    ></el-table-column>
    <!--    <el-table-column label="各销量段售点统计(点)">-->
    <!--      <el-table-column label="A" prop="sellA"></el-table-column>-->
    <!--      <el-table-column label="B" prop="sellB"></el-table-column>-->
    <!--      <el-table-column label="批发" prop="Allsell"></el-table-column>-->
    <!--    </el-table-column>-->
    <!-- <el-table-column label="有冰箱" align="center">
      <el-table-column label="高表现" prop="highOutputValue"></el-table-column>
      <el-table-column label="潜力" prop="potential"></el-table-column>
      <el-table-column label="基础" prop="basis"></el-table-column>
      <el-table-column label="低表现" prop="lowPerformance"></el-table-column>
    </el-table-column>
    <el-table-column label="无冰箱" align="center">
      <el-table-column label="高表现" prop="noHighOutputValue"></el-table-column>
      <el-table-column label="潜力" prop="noPotential"></el-table-column>
      <el-table-column label="基础" prop="noBasis"></el-table-column>
      <el-table-column label="低表现" prop="noLowPerformance"></el-table-column>
    </el-table-column> -->
    <!-- <el-table-column label="分级售点统计(点)" align="center">
      <el-table-column label="A" prop="acount"></el-table-column>
      <el-table-column label="B" prop="bcount"></el-table-column>
      <el-table-column label="其他" prop="wholeSale"></el-table-column>
    </el-table-column> -->
    <el-table-column prop="total" label="合计" align="center"></el-table-column>
    <el-table-column
      prop="avgTotal"
      label="平均每日客户数"
      width="120px"
      align="center"
    ></el-table-column>
    <el-table-column label="预计平均每月业绩" align="center">
      <el-table-column label="销量(箱)" prop="performance" align="center">
        <template slot-scope="scope">
          {{ scope.row.performance | numFormat }}
        </template>
      </el-table-column>
      <el-table-column label="金额(元)" prop="performanceValue" align="center">
        <template slot-scope="scope">
          {{ scope.row.performanceValue | numFormat }}
        </template>
      </el-table-column>
    </el-table-column>
    <!-- <el-table-column label="预计平均每日工作时长(小时)" align="center">
      <el-table-column
        label="在店时长"
        prop="avgShopTimes"
        align="center"
      ></el-table-column>
      <el-table-column
        label="路程时长 "
        prop="avgRouteTime"
        align="center"
      ></el-table-column>
      <el-table-column
        label="合计"
        prop="avgTimeTotal"
        align="center"
      ></el-table-column>
    </el-table-column> -->
    <!-- <el-table-column label="各拜访频次售点统计(点)" align="center">
      <el-table-column
        label="1周1访"
        prop="yy"
        align="center"
      ></el-table-column>
      <el-table-column
        label="1周2访"
        prop="yl"
        align="center"
      ></el-table-column>
      <el-table-column
        label="1周3访"
        prop="ys"
        align="center"
      ></el-table-column>
    </el-table-column> -->
    <!-- <el-table-column label="操作" fixed="right" width="100" align="center">
      <template slot-scope="scope">
        <el-button
          @click="handleClick(scope.row)"
          type="text"
          size="small"
          v-if="!scope.row.btnShow"
          >查看</el-button
        >
      </template>
    </el-table-column> -->
  </el-table>
</template>
<script>
export default {
  name: 'previewAll',
  props: ['tableData'],
  data() {
    return {}
  },
  methods: {
    handleClick(row) {
      console.log('查看数据')
      console.log(row)
      let titleName = row.areaName
      if (row.saleName) {
        titleName = row.areaName + '(' + row.saleName + ')'
      }
      this.$emit('tabData', 'Secondary', titleName, row.areaId)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-table__header thead.is-group th {
  padding: 2px 0px;
}
::v-deep .el-table__body td {
  padding: 0px;
}
</style>
