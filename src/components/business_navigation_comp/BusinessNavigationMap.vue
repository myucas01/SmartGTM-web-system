<template>
  <div id="business_navigation_map_container"></div>
</template>

<script>
import { AMap } from '@/plugins/AMap'
export default {
  name: 'Map',
  data() {
    return {
      organizeBoundariesData: {}
    }
  },
  props: ['organize_id', 'setMapStyle'],
  beforeMount() {},
  mounted() {
    this.init()
  },
  methods: {
    // 初始化地图对象
    init(lng = 102.488269, lat = 37.046516) {
      let businessNavigationMapObj = new AMap.Map(
        'business_navigation_map_container',
        {
          zoom: 10,
          center: [lng, lat],
          resizeEnable: true,
          mapStyle: `amap://styles/${this.setMapStyle}`
        }
      )
      this.$store.commit(
        'setBusinessNavigationMapObj',
        businessNavigationMapObj
      )
    }
    // organizeBoundaries() {
    // 	this.$fetch
    // 		.get("/api/v1/zone-construction/layer/organize-boundaries", {
    // 			organize_id: "7434299577672620146",
    // 		})
    // 		.then((res) => {
    // 			console.log(res);
    // 			if (res.code == 200) {
    // 				this.organizeBoundariesData = res.data;
    // 				this.init(
    // 					this.organizeBoundariesData[0].gdLng,
    // 					this.organizeBoundariesData[0].gdLat
    // 				);
    // 			}
    // 		});
    // },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#business_navigation_map_container {
  flex: 1;
}
</style>
