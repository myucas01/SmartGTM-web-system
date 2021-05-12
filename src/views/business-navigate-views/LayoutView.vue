<!--
    商机导航容器
-->
<template>
  <div class="business-navigate-layout" id='business_navigate_layout'>
    <!--商机导航二级路由，默认进入售点盘点-->
    <router-view :key='$route.path'/>
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
.business-navigate-layout {
  flex: 1;
  display: flex;
}
</style>
