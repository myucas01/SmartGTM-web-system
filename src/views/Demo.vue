<template>
  <div class="demo">
    svg-icon-demo:<svg-icon icon-class="gog-dot-com"
              class="svg-icon-demo"></svg-icon>
    <br />
    iconFont-demo:
    <svg class="icon"
         aria-hidden="true">
      <use xlink:href="#iconicon_xzp"></use>
    </svg>
    <div id="productTable"></div>
    <!-- <Map ref="map"
         @sendMapObj="setmap" /> -->
  </div>
</template>
<script>
// import Map from '@/components/Map.vue'
import { createScript } from '@/util'
export default {
  title() {
    return 'demo'
  },
  // components: {
  //   Map
  // },
  name: 'Demo',
  data() {
    return {
      AMap: ''
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.$store.commit('addTabs', {
        title: 'demo',
        link: '/demo',
        on: false,
        needCatch: true
      })
    })
  },
  mounted() {
    // console.log('map.getZoom():', this.$refs.map.getZoom())
    // var aa = [
    //   {
    //     geometry: {
    //       coordinates: [121.68422, 30.927065],
    //       type: 'Point'
    //     },
    //     type: 'Feature',
    //     properties: {
    //       typeIcon:
    //         'http://new-km_test.parramountain.com/smartgtm_static/icon_MA%402x.png',
    //       storeName: '华联浦东路39号',
    //       storeId: '6606215002890417411'
    //     }
    //   },
    //   {
    //     geometry: {
    //       coordinates: [121.56313, 30.98274],
    //       type: 'Point'
    //     },
    //     type: 'Feature',
    //     properties: {
    //       typeIcon:
    //         'http://new-km_test.parramountain.com/smartgtm_static/icon_MA%402x.png',
    //       storeName: '旺福家大昌中路38号',
    //       storeId: '6787800265174767387'
    //     }
    //   },
    //   {
    //     geometry: {
    //       coordinates: [121.583496, 30.923712],
    //       type: 'Point'
    //     },
    //     type: 'Feature',
    //     properties: {
    //       typeIcon:
    //         'http://new-km_test.parramountain.com/smartgtm_static/icon_MA%402x.png',
    //       storeName: '南奉公路联华2668号',
    //       storeId: '5681980751325903831'
    //     }
    //   },
    //   {
    //     geometry: {
    //       coordinates: [121.57636, 30.928226],
    //       type: 'Point'
    //     },
    //     type: 'Feature',
    //     properties: {
    //       typeIcon:
    //         'http://new-km_test.parramountain.com/smartgtm_static/icon_MA%402x.png',
    //       storeName: '北塘城市生活超市',
    //       storeId: '5806883517609315847'
    //     }
    //   },
    //   {
    //     geometry: {
    //       coordinates: [121.720215, 30.937927],
    //       type: 'Point'
    //     },
    //     type: 'Feature',
    //     properties: {
    //       typeIcon:
    //         'http://new-km_test.parramountain.com/smartgtm_static/icon_MA%402x.png',
    //       storeName: '沃天百联四团镇45号',
    //       storeId: '8396207722610836471'
    //     }
    //   },
    //   {
    //     geometry: {
    //       coordinates: [121.49491, 30.957064],
    //       type: 'Point'
    //     },
    //     type: 'Feature',
    //     properties: {
    //       typeIcon:
    //         'http://new-km_test.parramountain.com/smartgtm_static/icon_MA%402x.png',
    //       storeName: '佳客多嘉园路125号',
    //       storeId: '5427181474460147470'
    //     }
    //   },
    //   {
    //     geometry: {
    //       coordinates: [121.62223, 30.91352],
    //       type: 'Point'
    //     },
    //     type: 'Feature',
    //     properties: {
    //       typeIcon:
    //         'http://new-km_test.parramountain.com/smartgtm_static/icon_MA%402x.png',
    //       storeName: '田头超市南奉公路999弄296号',
    //       storeId: '7580397976534632972'
    //     }
    //   },
    //   {
    //     geometry: {
    //       coordinates: [121.73948, 30.892338],
    //       type: 'Point'
    //     },
    //     type: 'Feature',
    //     properties: {
    //       typeIcon:
    //         'http://new-km_test.parramountain.com/smartgtm_static/icon_MA%402x.png',
    //       storeName: '美惠全海旗路1475号',
    //       storeId: '6069346233967173835'
    //     }
    //   },
    //   {
    //     geometry: {
    //       coordinates: [121.442825, 30.990925],
    //       type: 'Point'
    //     },
    //     type: 'Feature',
    //     properties: {
    //       typeIcon:
    //         'http://new-km_test.parramountain.com/smartgtm_static/icon_MA%402x.png',
    //       storeName: '西渡巧购扶港路388号',
    //       storeId: '8738311298604301128'
    //     }
    //   },
    //   {
    //     geometry: {
    //       coordinates: [121.49156, 30.910622],
    //       type: 'Point'
    //     },
    //     type: 'Feature',
    //     properties: {
    //       typeIcon:
    //         'http://new-km_test.parramountain.com/smartgtm_static/icon_MA%402x.png',
    //       storeName: '百特麦尔百富路388弄55-60号',
    //       storeId: '8876014618255217319'
    //     }
    //   },
    //   {
    //     geometry: {
    //       coordinates: [],
    //       type: 'Polygon'
    //     },
    //     type: 'Feature',
    //     properties: {
    //       leafNode: true
    //     }
    //   }
    // ]
    // this.$refs.map.mapClustererTool(aa)
    let _this = this
    createScript('/js/webdatarocks.toolbar.min.js', () => {
      createScript('/js/webdatarocks.js', () => {
        _this.productTableCreat()
      })
    })
  },
  methods: {
    setmap(map) {
      this.AMap = map
    },
    productTableCreat() {
      // console.log(_this.dataList)
      // console.log(_this.sumList)
      this.productTable = new WebDataRocks({
        container: '#productTable',
        height: '100%',
        beforetoolbarcreated: customizeToolbar,
        toolbar: true,
        report: {
          formats: [
            {
              name: 'currency',
              decimalPlaces: 2,
              nullValue: '-',
              currencySymbol: '%',
              isPercent: true
            },
            {
              name: 'sum',
              decimalPlaces: 2,
              nullValue: '-'
            }
          ],
          dataSource: {
            data: []//_this.dataList
          },
          options: {
            grid: {
              type: 'classic',
              title: '123',
              showReportFiltersArea: true,
              showTotals: 'off' //是否 显示小计
            },
            general: {
              configuratorActive: false
            }
          },
          cellData: {
            height: 500
          },
          slice: {
            rows: [
              //默认选中 字段
              {
                uniqueName: '产品-统计规格'
              },
              {
                uniqueName: '产品-品牌'
              }
            ],
            columns: [
              {
                uniqueName: '组织-行销公司',
                sort: 'asc'
              }
            ],
            measures: [
              //计算值 配置
              {
                uniqueName: '推算销额',
                aggregation: 'average',
                format: 'currency'
              },
              {
                uniqueName: '同比销额',
                aggregation: 'sum',
                format: 'sum'
              }
            ],
            // measures: _this.sumList,
            drills: {
              //下钻
              drillAll: true,
              rows: [
                {
                  tuple: ['Business Type.Warehouse']
                }
              ]
            },
            expands: {
              //展开
              expandAll: true
            }
          }
        },
        // global: {
        //   // replace this path with the path to your own translated file
        //   localization: zh_json
        // }
      })
      //删除工具栏
      function customizeToolbar(toolbar) {
        var tabs = toolbar.getTabs() // get all tabs from the toolbar
        console.log(tabs)
        console.log(tabs) // delete the first tab)
        toolbar.getTabs = function () {
          delete tabs[0] // delete the first tab
          delete tabs[1] // delete the first tab
          delete tabs[2] // delete the first tab
          delete tabs[3].menu[0]
          delete tabs[3].menu[1]
          delete tabs[3].menu[3]
          return tabs
        }
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.demo {
  position: relative;
  display: flex;
  width: 100%;
  color: #ffffff;
  flex-direction: row-reverse;
  .svg-icon {
    width: 30px;
    height: 30px;
  }
  .icon {
    width: 40px;
    height: 40px;
  }
}
</style>
