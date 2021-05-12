<template>
  <div class="business-district-layout">
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
  created() {
    this.$store.dispatch('map/setSearchType', ['map', 'org', 'business_store'])
  },
  mounted() { },
  methods: {},
}
</script>

<style scoped lang="scss">
.business-district-layout {
  flex: 1;
  display: flex;
}
</style>
