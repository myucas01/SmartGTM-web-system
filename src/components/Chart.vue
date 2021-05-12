<template>
  <chart :options="options" :autoResize="true" ref='thisChart'></chart>
</template>

<script>
import Vue from 'vue';
import ECharts from 'vue-echarts';
Vue.component('chart', ECharts);

export default {
  name: 'echartsWrapper',
  props: {
    options: {},
  },
  created() {},
}
</script>

<style lang="scss" scoped>
.echarts {
  width: 100% !important;
  height: 100% !important;
}
</style>