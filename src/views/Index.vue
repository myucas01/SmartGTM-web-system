<template>
  <div class="index">
    <Entry />
  </div>
</template>

<script>
import Entry from '@/components/Entry.vue'
export default {
  name: 'Index',
  components: {
    Entry
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.commit('addTabs', {
        title: '• 首页',
        link: '/index',
        on: true,
        needCatch: true
      })
    })
  }
}
</script>
<style lang="scss" scoped>
.index {
  display: flex;
  width: 100%;
}
.index > div {
  flex: 1;
  width: 100%;
}
</style>
