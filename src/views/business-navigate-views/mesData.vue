<template>
  <div class="page">
    <div id="productTable"></div>
  </div>
</template>

<script>
import zh_json from '@/util/zh.json'
import { createScript } from '@/util'
export default {
  data() {
    return {
      tabsValue: '1',
      date: '',
      classType: '',
      classTypeList: [],
      dialogShow: false,
      productTable: '',
      conceptTable: '',
      sumList: [],
      dataList: []
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // 通过 `vm` 访问组件实例
      vm.$store.commit('addTabs', {
        title: `信息汇总表`,
        link: `/business-navigate/bidata`,
        on: false,
        needCatch: true
      })
    })
  },
  mounted() {
    let _this = this
    this.getdata()
    createScript('/js/webdatarocks.toolbar.min.js', () => {
      createScript('/js/webdatarocks.js', () => {
        _this.productTableCreat()
        // _this.conceptTableCreat()
      })
    })
    
  },
  methods: {
    submit() {
      this.dialogShow = true
    },

    getdata() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      console.log(loading)
      let url = '/api/bn/bi/store'
      this.$fetch
        .post(url, {
          isLoading: false
        })
        .then((res) => {
          if (res.code == 200) {
            console.log(res)
            let list = res.data
            let obj = {}
            for (let i in list[0]) {
              obj[i] = {
                type: 'string'
              }
            }
            list.unshift(obj)
            this.dataList = list
            setTimeout(() => {
              this.productTableCreat()
            }, 100)
            loading.close()
          }
        })
        .catch((error) => {
          loading.close()
          console.log(error.message)
        })
    },
    productTableCreat() {
      let _this = this
      console.log(_this.dataList)
      this.productTable = new WebDataRocks({
        container: '#productTable',
        height: '100%',
        beforetoolbarcreated: customizeToolbar,
        toolbar: true,
        report: {
          // formats: [
          //   {
          //     name: 'currency',
          //     decimalPlaces: 2,
          //     nullValue: '-',
          //     currencySymbol: '%',
          //     isPercent: true
          //   },
          //   {
          //     name: 'sum',
          //     decimalPlaces: 2,
          //     nullValue: '-'
          //   }
          // ],
          dataSource: {
            data: _this.dataList
          },
          options: {
            grid: {
              type: 'classic',
              title: _this.title,
              showReportFiltersArea: true,
              showTotals: 'off', //是否 显示小计
              showGrandTotals: 'off' //是否 显示总计
            },
            configuratorActive: false,
            showAggregationLabels: false,
            showDefaultSlice: false
          },
          cellData: {
            height: 500
          },
          slice: {
            rows: [
              // //默认选中 字段
              // {
              //   uniqueName: '产品-统计规格'
              // },
              // {
              //   uniqueName: '产品-品牌'
              // }
            ],
            columns: [
              // {
              //   uniqueName: '组织-行销公司',
              //   sort: 'asc'
              // }
            ],
            measures: [
              //计算值 配置
              // {
              //   uniqueName: '推算销额',
              //   aggregation: 'none',
              //   active:false,
              // },
              // {
              //   uniqueName: '同比销额',
              //   aggregation: 'sum',
              //   format: 'sum'
              // }
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
        global: {
          // replace this path with the path to your own translated file
          localization: zh_json
        }
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
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
  box-sizing: border-box;
  background: #00112d;
  .mr20 {
    margin-right: 20px;
  }
  .mr10 {
    margin-right: 10px;
  }
}
</style>