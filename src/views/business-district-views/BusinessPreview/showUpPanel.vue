<template>
  <div class="show-up-panel">
    <i class="el-icon-caret-top" @click="showDown"></i>
  </div>
</template>

<script>
export default {
  name: 'showUpPanel',
  methods: {
    showDown() {
      this.$emit('change', true);
    },
  }
}
</script>

<style lang="scss" scoped>
.show-up-panel {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 28px;
  height: 28px;
  line-height: 32px;
  background: #930cea;
  border-radius: 2px;
  text-align: center;
  // transform: rotate(180deg);
  z-index: 1;
  i {
    font-size: 20px;
    cursor: pointer;
  }
}
</style>