<template>
  <div class="bn-index">
    <h2>商圈布局</h2>
  </div>
</template>

<script>
export default {
  name: 'Index',
  title() {
    return '商圈布局'
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
.bn-index {
  display: flex;
  width: 100%;
  h2 {
    position: absolute;
    z-index: 10000;
    text-align: center;
    width: 100%;
  }
  > div {
    flex: 1;
    width: 100%;
  }
}
.tableBox {
  padding: 100px;
}
.selectBox {
  padding-top: 100px;
}
</style>
