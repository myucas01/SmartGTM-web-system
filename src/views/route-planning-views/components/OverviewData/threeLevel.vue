<template>
  <!-- 查看路线门店 -->
  <el-table
    :data="tableData"
    border
    height="100%"
    size="mini"
    style="width: 100%"
    :cell-style="cellStyle"
    class="newtable"
    :header-cell-style='headStyle'
  >
    <el-table-column prop="areas" fixed label="所属区域" width="220" show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.areaName}}<span v-if="scope.row.saleName">（</span>{{scope.row.saleName}}<span v-if="scope.row.saleName"> ）</span>
      </template>
    </el-table-column>
    <el-table-column prop="storeCode" label="网络编码" width="100" show-overflow-tooltip></el-table-column>
    <el-table-column prop="visitSequence" label="拜访顺序" width="100" show-overflow-tooltip></el-table-column>
    <el-table-column prop="storeName" label="客户名称" width="100" show-overflow-tooltip></el-table-column>
    <el-table-column prop="storeAddress" min-width="300" label="地址"></el-table-column>
    <el-table-column prop="storeType" label="渠道" width="100" show-overflow-tooltip></el-table-column>
    <!-- <el-table-column prop="shelf" label="货架组数"></el-table-column> -->
    <el-table-column prop="visitFrequency" label="拜访频次" width="100" show-overflow-tooltip></el-table-column>
    <el-table-column
      width="130px"
      prop="visitDuration"
      label="在店时长(分钟/次)"
    ></el-table-column>
    <el-table-column prop="storeScale" fixed="right" label="销量段" width="100" show-overflow-tooltip></el-table-column>
    <!-- <el-table-column fixed="right" label="操作">三</el-table-column> -->
  </el-table>
</template>
<script>
export default {
  name: 'threeLevel',
  props: ['tableData'],
  data() {
    return {}
  },
  methods:{
    cellStyle(){
      let styleObj = {}
      styleObj = {
        'padding':'5px !important',
        'background': '#0a2757',
        'color': '#ffffff',
        'border-color': '#4f707f',
      }
      return styleObj
    },
    headStyle(){
      let styleObj = {}
      styleObj = {
        'padding':'6px !important',
        'background': '#4e19a0',
        'color': '#ffffff',
        'border-color': '#4f707f',
      }
      return styleObj
    }
  }
}
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
