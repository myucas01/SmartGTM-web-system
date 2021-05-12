<!--
    dashboard容器
-->
<template>
  <div class="dashboard-layout">
    <!--商机导航二级路由，默认进入售点盘点-->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: '',
  title() {
    return ''
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style scoped lang="scss">
.dashboard-layout {
  width:100%;
  overflow-y: auto;
  background-color: #0a2757;
}
</style>
