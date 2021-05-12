<!--
    商机导航容器
-->
<template>
  <div class="business-expansion-layout" id="business_expansion_layout">
    <!--售点拓展-->
    <router-view />
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
  methods: {}
}
</script>

<style scoped lang="scss">
.business-expansion-layout {
  flex: 1;
  display: flex;
  width: 100%;
}
</style>
