<template>
  <div class="tableBox">
    <!--门店结构详情table-->
    <div class="detailTable detailTable1" v-if="typeId === '2'">
      <div class="store1">
        <div class="header">
          <div class="perHeader perHeader_1">渠道</div>
          <div class="perHeader perHeader_2">总点数</div>
          <div class="perHeader perHeader_3">比例（占一阶）</div>
        </div>
        <div class="storeDataList" v-if="tableData">
          <div class="storeType">
            <div class="storeTypeName">{{ tableData[0].route }}</div>
            <div class="storeNum">
              {{ tableData[0].routeCount | numFormat }}
            </div>
          </div>
          <div class="dataTable">
            <div
              class="dataTr"
              v-for="(item, index) in tableData.slice(0, 4)"
              :key="index"
            >
              <div class="dataTd">{{ item.channel }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel}`)">{{ item.channelCount | numFormat }}</div>
              <!-- <div class="dataTd">{{item.routeProportion}}</div> -->
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel}`)">{{ item.routeProportion }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="store2">
        <!-- <div class="header">
          <div class="perHeader perHeader_1">渠道</div>
          <div class="perHeader perHeader_2">总点数</div>
          <div class="perHeader perHeader_3">比例（占二阶）</div>
        </div> -->
        <div class="storeDataList" v-if="tableData">
          <div class="storeType">
            <div class="storeTypeName">{{ tableData[4].route }}</div>
            <div class="storeNum">
              {{ tableData[4].routeCount | numFormat }}
            </div>
          </div>
          <div class="dataTable">
            <div
              class="dataTr"
              v-for="(item, index) in tableData.slice(4, 8)"
              :key="index"
            >
              <div class="dataTd">{{ item.channel }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel==='其他特通'?otherTetong:item.channel}`)">{{ item.channelCount | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel==='其他特通'?otherTetong:item.channel}`)">{{ item.routeProportion | numFormat }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="store3">
        <div class="header">
          <div class="perHeader perHeader_1">渠道</div>
          <div class="perHeader perHeader_2">总点数</div>
          <div class="perHeader perHeader_3">比例（占二阶）</div>
        </div>
        <div class="storeDataList" v-if="tableData">
          <div class="storeType">
            <div class="storeTypeName">{{ tableData[8].route }}</div>
            <div class="storeNum">
              {{ tableData[8].routeCount | numFormat }}
            </div>
          </div>
          <div class="dataTable">
            <div
              class="dataTr"
              v-for="(item, index) in tableData.slice(8,12)"
              :key="index"
            >
              <div class="dataTd">{{ item.channel }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel==='其他二阶'?otheErjie:(item.channel==='特约批')?'特约士多批,特约特通批':item.channel}`)">{{ item.channelCount | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel==='其他二阶'?otheErjie:(item.channel==='特约批')?'特约士多批,特约特通批':item.channel}`)">{{ item.routeProportion | numFormat }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="store4">
        <div class="header">
          <div class="perHeader perHeader_1">渠道</div>
          <div class="perHeader perHeader_2">总点数</div>
          <div class="perHeader perHeader_3">比例（占MT）</div>
        </div>
        <div class="storeDataList" v-if="tableData">
          <div class="storeType">
            <div class="storeTypeName">{{ tableData[12].route }}</div>
            <div class="storeNum">
              {{ tableData[12].routeCount | numFormat }}
            </div>
          </div>
          <div class="dataTable">
            <div
              class="dataTr"
              v-for="(item, index) in tableData.slice(12,14)"
              :key="index"
            >
              <div class="dataTd">{{ item.channel }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel}`)">{{ item.channelCount | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel}`)">{{ item.routeProportion | numFormat }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--门店销量详情table-->
    <div class="detailTable detailTable2" v-if="typeId === '3'">
      <div class="store1">
        <div class="header">
          <div class="perHeader perHeader_1">渠道</div>
          <div class="perHeader perHeader_2">销量达标</div>
          <div class="perHeader perHeader_3">销量不达标</div>
        </div>
        <div class="storeDataList" v-if="tableData">
          <div class="storeType">
            <div class="storeTypeName">{{ tableData[0].route }}</div>
            <div class="storeNum">
              {{ tableData[0].routeDealCount | numFormat }}
            </div>
          </div>
          <div class="dataTable">
            <div
              class="dataTr"
              v-for="(item, index) in tableData.slice(0, 4)"
              :key="index"
            >
              <div class="dataTd">{{ item.channel }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel}&substandard=0`)">
                {{ item.upToSubstandardNumber | numFormat }}
              </div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel}&substandard=1`)">{{ item.substandardNumber | numFormat }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="store2">
        <!-- <div class="header">
					<div class="perHeader perHeader_4">渠道</div>
					<div class="perHeader perHeader_5">A类</div>
					<div class="perHeader perHeader_6">B类</div>
					<div class="perHeader perHeader_7">A类</div>
					<div class="perHeader perHeader_8">B类</div>
				</div> -->
        <div class="storeDataList" v-if="tableData">
          <div class="storeType">
            <div class="storeTypeName">{{ tableData[4].route }}</div>
            <div class="storeNum">
              {{ tableData[4].routeDealCount | numFormat }}
            </div>
          </div>
          <div class="dataTable">
            <div
              class="dataTr"
              v-for="(item, index) in tableData.slice(4, 8)"
              :key="index"
            >
              <div class="dataTd">{{ item.channel }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel==='其他特通'?otherTetong:item.channel}&substandard=0`)">
                {{ item.upToSubstandardNumber | numFormat }}
              </div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel==='其他特通'?otherTetong:item.channel}&substandard=1`)">
                {{ item.substandardNumber | numFormat }}
              </div>
              <!-- <div class="dataTd">{{item.substandardNumberA | numFormat}}</div> -->
              <!-- <div class="dataTd">{{item.substandardNumberB | numFormat}}</div> -->
            </div>
          </div>
        </div>
      </div>
      <div class="store3">
        <div class="storeDataList" v-if="tableData">
          <div class="storeType">
            <div class="storeTypeName">{{ tableData[8].route }}</div>
            <div class="storeNum">
              {{ tableData[8].routeDealCount | numFormat }}
            </div>
          </div>
          <div class="dataTable">
            <div
              class="dataTr"
              v-for="(item, index) in tableData.slice(8,12)"
              :key="index"
            >
              <div class="dataTd">{{ item.channel }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel==='其他二阶'?otheErjie:(item.channel==='特约批')?'特约士多批,特约特通批':item.channel}&substandard=0`)">
                {{ item.upToSubstandardNumber | numFormat }}
              </div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel==='其他二阶'?otheErjie:(item.channel==='特约批')?'特约士多批,特约特通批':item.channel}&substandard=1`)">{{ item.substandardNumber | numFormat }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="store4">
        <div class="storeDataList" v-if="tableData">
          <div class="storeType">
            <div class="storeTypeName">{{ tableData[12].route }}</div>
            <div class="storeNum">
              {{ tableData[12].routeDealCount | numFormat }}
            </div>
          </div>
          <div class="dataTable">
            <div
              class="dataTr"
              v-for="(item, index) in tableData.slice(12)"
              :key="index"
            >
              <div class="dataTd">{{ item.channel }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel}&substandard=0`)">
                {{ item.upToSubstandardNumber | numFormat }}
              </div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel}&substandard=1`)">{{ item.substandardNumber | numFormat }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--门店成交详情table-->
    <div class="detailTable detailTable3" v-if="typeId === '4'">
      <div class="store1">
        <div class="header">
          <div class="perHeader perHeader_1">渠道</div>
          <div class="perHeader perHeader_2">月月活</div>
          <div class="perHeader perHeader_3">双月活</div>
          <div class="perHeader perHeader_4">近期活跃</div>
          <div class="perHeader perHeader_5">连续两个月未成交</div>
          <div class="perHeader perHeader_6">未成交</div>
        </div>
        <div class="storeDataList" v-if="tableData">
          <div class="storeType">
            <div class="storeTypeName">{{ tableData[0].route }}</div>
            <div class="storeNum">
              {{ tableData[0].routeDealCount | numFormat }}
            </div>
          </div>
          <div class="dataTable">
            <div
              class="dataTr"
              v-for="(item, index) in tableData.slice(0, 4)"
              :key="index"
            >
              <div class="dataTd">{{ item.channel }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel}&dealStatus=1`)">{{ item.monthlyActive | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel}&dealStatus=2`)">{{ item.bimonthlyActive | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel}&dealStatus=3`)">{{ item.recentlyActive | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel}&dealStatus=4`)">{{ item.bimonthlyNoDeal | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel}&dealStatus=5`)">{{ item.noDeal | numFormat }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="store2">
        <div class="storeDataList" v-if="tableData">
          <div class="storeType">
            <div class="storeTypeName">{{ tableData[4].route }}</div>
            <div class="storeNum">
              {{ tableData[4].routeDealCount | numFormat }}
            </div>
          </div>
          <div class="dataTable">
            <div
              class="dataTr"
              v-for="(item, index) in tableData.slice(4, 8)"
              :key="index"
            >
              <div class="dataTd">{{ item.channel }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel==='其他特通'?otherTetong:item.channel}&dealStatus=1`)">{{ item.monthlyActive | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel==='其他特通'?otherTetong:item.channel}&dealStatus=2`)">{{ item.bimonthlyActive | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel==='其他特通'?otherTetong:item.channel}&dealStatus=3`)">{{ item.recentlyActive | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel==='其他特通'?otherTetong:item.channel}&dealStatus=4`)">{{ item.bimonthlyNoDeal | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel==='其他特通'?otherTetong:item.channel}&dealStatus=5`)">{{ item.noDeal | numFormat }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="store3">
        <div class="storeDataList" v-if="tableData">
          <div class="storeType">
            <div class="storeTypeName">{{ tableData[8].route }}</div>
            <div class="storeNum">
              {{ tableData[8].routeDealCount | numFormat }}
            </div>
          </div>
          <div class="dataTable">
            <div
              class="dataTr"
              v-for="(item, index) in tableData.slice(8,12)"
              :key="index"
            >
              <div class="dataTd">{{ item.channel }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel==='其他二阶'?otheErjie:(item.channel==='特约批')?'特约士多批,特约特通批':item.channel}&dealStatus=1`)">{{ item.monthlyActive | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel==='其他二阶'?otheErjie:(item.channel==='特约批')?'特约士多批,特约特通批':item.channel}&dealStatus=2`)">{{ item.bimonthlyActive | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel==='其他二阶'?otheErjie:(item.channel==='特约批')?'特约士多批,特约特通批':item.channel}&dealStatus=3`)">{{ item.recentlyActive | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel==='其他二阶'?otheErjie:(item.channel==='特约批')?'特约士多批,特约特通批':item.channel}&dealStatus=4`)">{{ item.bimonthlyNoDeal | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel==='其他二阶'?otheErjie:(item.channel==='特约批')?'特约士多批,特约特通批':item.channel}&dealStatus=5`)">{{ item.noDeal | numFormat }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="store4">
        <div class="storeDataList" v-if="tableData">
          <div class="storeType">
            <div class="storeTypeName">{{ tableData[12].route }}</div>
            <div class="storeNum">
              {{ tableData[12].routeDealCount | numFormat }}
            </div>
          </div>
          <div class="dataTable">
            <div
              class="dataTr"
              v-for="(item, index) in tableData.slice(12)"
              :key="index"
            >
              <div class="dataTd">{{ item.channel }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel}&dealStatus=1`)">{{ item.monthlyActive | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel}&dealStatus=2`)">{{ item.bimonthlyActive | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel}&dealStatus=3`)">{{ item.recentlyActive | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel}&dealStatus=4`)">{{ item.bimonthlyNoDeal | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`sale?storeType=${item.channel}&dealStatus=5`)">{{ item.noDeal | numFormat }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--门店问题详情table-->
    <div class="detailTable detailTable4" v-if="typeId === '5'">
      <div class="store1">
        <div class="header">
          <div class="perHeader perHeader_1">渠道</div>
          <div class="perHeader perHeader_2">销量不达标</div>
          <div class="perHeader perHeader_6 no">C类门店</div>
          <div class="perHeader perHeader_3">连续两个月未成交</div>
          <div class="perHeader perHeader_4">未成交</div>
          <div class="perHeader perHeader_5">数据异常门店</div>
        </div>
        <div class="storeDataList" v-if="tableData">
          <div class="storeType">
            <div class="storeTypeName">{{ tableData[0].route }}</div>
            <div class="storeNum">
              {{ tableData[0].routeProblemCount | numFormat }}
            </div>
          </div>
          <div class="dataTable">
            <div
              class="dataTr"
              v-for="(item, index) in tableData.slice(0, 4)"
              :key="index"
            >
              <div class="dataTd">{{ item.channel }}</div>
              <div class="dataTd cursor" @click="goRoute(`problem?storeType=${item.channel}&bsSubstandard=0`)">{{ item.substandardNumber | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`problem?storeType=${item.channel}&bsTwoMonthNoDeal=0`)">{{ item.bimonthlyNoDeal | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`problem?storeType=${item.channel}&bsNoDeal=0`)">{{ item.noDeal | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`problem?storeType=${item.channel}`)">{{ item.abnormal | numFormat }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="store2">
        <div class="storeDataList" v-if="tableData">
          <div class="storeType">
            <div class="storeTypeName">{{ tableData[4].route }}</div>
            <div class="storeNum">
              {{ tableData[4].routeProblemCount | numFormat }}
            </div>
          </div>
          <div class="dataTable">
            <div
              class="dataTr"
              v-for="(item, index) in tableData.slice(4, 8)"
              :key="index"
            >
              <div class="dataTd">{{ item.channel }}</div>
              <div class="dataTd cursor" @click="goRoute(`problem?storeType=${item.channel==='其他特通'?otherTetong:item.channel}&bsSubstandard=0`)">{{ item.substandardNumber | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`problem?storeType=${item.channel==='其他特通'?otherTetong:item.channel}&bsTwoMonthNoDeal=0`)">{{ item.bimonthlyNoDeal | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`problem?storeType=${item.channel==='其他特通'?otherTetong:item.channel}&bsNoDeal=0`)">{{ item.noDeal | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`problem?storeType=${item.channel==='其他特通'?otherTetong:item.channel}`)">{{ item.abnormal | numFormat }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="store3">
        <div class="storeDataList" v-if="tableData">
          <div class="storeType">
            <div class="storeTypeName">{{ tableData[8].route }}</div>
            <div class="storeNum">
              {{ tableData[8].routeProblemCount | numFormat }}
            </div>
          </div>
          <div class="dataTable">
            <div
              class="dataTr"
              v-for="(item, index) in tableData.slice(8,12)"
              :key="index"
            >
              <div class="dataTd">{{ item.channel }}</div>
              <div class="dataTd cursor" @click="goRoute(`problem?storeType=${item.channel==='其他二阶'?otheErjie:(item.channel==='特约批')?'特约士多批,特约特通批':item.channel}&bsSubstandard=0`)">{{ item.substandardNumber | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`problem?storeType=${item.channel==='其他二阶'?otheErjie:(item.channel==='特约批')?'特约士多批,特约特通批':item.channel}&bsTwoMonthNoDeal=0`)">{{ item.bimonthlyNoDeal | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`problem?storeType=${item.channel==='其他二阶'?otheErjie:(item.channel==='特约批')?'特约士多批,特约特通批':item.channel}&bsNoDeal=0`)">{{ item.noDeal | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`problem?storeType=${item.channel==='其他二阶'?otheErjie:(item.channel==='特约批')?'特约士多批,特约特通批':item.channel}`)">{{ item.abnormal | numFormat }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="store4">
        <div class="storeDataList" v-if="tableData">
          <div class="storeType">
            <div class="storeTypeName">{{ tableData[12].route }}</div>
            <div class="storeNum">
              {{ tableData[12].routeProblemCount | numFormat }}
            </div>
          </div>
          <div class="dataTable">
            <div
              class="dataTr"
              v-for="(item, index) in tableData.slice(12)"
              :key="index"
            >
              <div class="dataTd">{{ item.channel }}</div>
              <div class="dataTd cursor" @click="goRoute(`problem?storeType=${item.channel}&bsSubstandard=0`)">{{ item.substandardNumber | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`problem?storeType=${item.channel}&bsTwoMonthNoDeal=0`)">{{ item.bimonthlyNoDeal | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`problem?storeType=${item.channel}&bsNoDeal=0`)">{{ item.noDeal | numFormat }}</div>
              <div class="dataTd cursor" @click="goRoute(`problem?storeType=${item.channel}`)">{{ item.abnormal | numFormat }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'storeStructureTables',
  title() {
    return ''
  },
  data() {
    return {
      otherTetong:'中学校园,小学校园,景点,网吧,休闲/娱乐,运动场所,高速,高铁贵宾室,机场贵宾室,豪华酒店,经济酒店,码头,餐饮,特通其他,机构/办公,一阶客户自售',
      otheErjie:'厂矿批,工地批,机构办公批,交通站点批,E批发,酒店批,Snack批,餐饮批,景点乐园批,特通批其他,县城批,乡镇批'
    }
  },
  props: ['typeId', 'tableData','areaId'],
  watch: {
    tableData() {
      // console.log(val)
      // let tableData = []
      // if(val ) {
      // 	val.forEach(res => {
      // 		if( res && tableData.indexOf(res.route === -1) ) {
      // 			let tableJson = {
      // 			}
      // 		}
      // 	})
      // }
      // return tableData
    }
  },
  created() {},
  mounted() {
    // console.log('tableData', this.tableData)
  },
  methods: {
    /**
     * @description 点击table表格跳转到售点盘点
     * @param 
     */
    goRoute(item) {
      let url = `/business-navigate/${item}&orgId=${this.areaId}`

      this.$router.push(url)
    },
  }
}
</script>

<style scoped lang="scss" >
.tableBox {
  overflow-y: scroll;
  overflow-x: hidden;
  height: 27.3rem;
  border-radius: 1.4rem;
}
.detailTable {
  width: 73.9rem;
  // height: 45.2rem;
  border-radius: 1.4rem;
  //   float: left;
  //   margin-left: 1.5rem;
  background-color: #47059c;
  .header {
    overflow: hidden;
    background-color: #7134ef;
    line-height: 3.2rem;
    text-align: center;
    .perHeader {
      float: left;
      font-size: 1.8rem;
    }
    .perHeader ~ .perHeader {
      border-left: 0.1rem solid #979797;
    }
  }
  .storeDataList {
    overflow: hidden;
    border-bottom: 1px solid #979797;
    .storeType {
      float: left;
      text-align: center;
      width: 10.6rem;
      height: 10.3rem;
      font-size: 1.8rem;
      border-right: 0.1rem solid #979797;

      .storeTypeName {
        margin-top: 1.9rem;
      }
      .storeNum {
        margin-top: 0.5rem;
      }
    }
    .dataTable {
      float: left;
      .dataTr {
        height: 2.6rem;
        line-height: 2.6rem;
        overflow: hidden;
        text-align: center;
        font-size: 1.6rem;
        .dataTd {
          float: left;
        }
        .cursor {
          cursor: pointer;
        }
        .dataTd ~ .dataTd {
          border-left: 0.1rem solid #979797;
        }
      }
      .dataTr ~ .dataTr {
        border-top: 0.1rem solid #979797;
      }
    }
  }
}
.detailTable1 {
    .perHeader_1 {
      width: 22rem;
    }
    .perHeader_2 {
      width: 26.1rem;
    }
    .perHeader_3 {
      width: 25.4rem;
    }
  .store1 {
    .header {
      border-top-left-radius: 1.4rem;
      border-top-right-radius: 1.4rem;
    }
    .dataTable {
      .dataTd:nth-child(1) {
        width: 11.3rem;
      }
      .dataTd:nth-child(2) {
        width: 26.1rem;
      }
      .dataTd:nth-child(3) {
        width: 25.4rem;
      }
    }
  }
  .store2,.store3 {
    .header {
      border-radius: 0;
    }
    .dataTable {
      .dataTd:nth-child(1) {
        width: 11.3rem;
      }
      .dataTd:nth-child(2) {
        width: 26.1rem;
      }
      .dataTd:nth-child(3) {
        width: 25.4rem;
      }
    }
  }
  .store4  {
    .storeDataList {
      .storeType {
        height: 5.2rem;
        .storeTypeName {
          margin-top: 0.3rem;
        }
      }
      .dataTable {
        .dataTr {
          height: 2.6rem;
          line-height: 2.6rem;
          overflow: hidden;
          text-align: center;
          font-size: 1.6rem;
          .dataTd:nth-child(1) {
            width: 11.3rem;
          }
          .dataTd:nth-child(2) {
            width: 26.1rem;
          }
          .dataTd:nth-child(3) {
            width: 25.4rem;
          }
        }
      }
    }
  }
}
.detailTable2 {
  .store1 {
    .header {
      border-top-left-radius: 1.4rem;
      border-top-right-radius: 1.4rem;
    }
    .perHeader_1 {
      width: 22rem;
    }
    .perHeader_2 {
      width: 26.1rem;
    }
    .perHeader_3 {
      width: 25.5rem;
    }
    .dataTable {
      .dataTd:nth-child(1) {
        width: 11.3rem;
      }
      .dataTd:nth-child(2) {
        width: 26.1rem;
      }
      .dataTd:nth-child(3) {
        width: 25.5rem;
      }
    }
  }
  .store2, .store3 {
    .header {
      border-radius: 0;
    }
    .perHeader_4 {
      width: 20.1rem;
    }
    .perHeader_5 {
      width: 13rem;
    }
    .perHeader_6 {
      width: 13.2rem;
    }
    .perHeader_7 {
      width: 13.1rem;
    }
    .perHeader_8 {
      width: 13.9rem;
    }
    .dataTable {
      .dataTd:nth-child(1) {
        width: 11.3rem;
      }
      .dataTd:nth-child(2) {
        width: 26.1rem;
      }
      .dataTd:nth-child(3) {
        width: 25.5rem;
      }
    }
  }
  .store4 {
    .storeDataList {
      .storeType {
        height: 5.2rem;
        .storeTypeName {
          margin-top: 0.3rem;
        }
      }
      .dataTable {
        .dataTr {
          height: 2.6rem;
          line-height: 2.6rem;
          overflow: hidden;
          text-align: center;
          font-size: 1.6rem;
          .dataTd:nth-child(1) {
            width: 11.3rem;
          }
          .dataTd:nth-child(2) {
            width: 26.1rem;
          }
          .dataTd:nth-child(3) {
            width: 25.4rem;
          }
        }
      }
    }
  }
}
.detailTable3 {
  // height: 33.7rem;
  .store1,
  .store2, 
  .store3 {
    .header {
      border-top-left-radius: 1.4rem;
      border-top-right-radius: 1.4rem;
    }
    .storeType {
      height: 11.9rem;
      .storeTypeName {
        margin-top: 4rem;
      }
    }
    .perHeader_1 {
      width: 17.8rem;
    }
    .perHeader_2 {
      width: 8.8rem;
    }
    .perHeader_3 {
      width: 9.4rem;
    }
    .perHeader_4 {
      width: 10.1rem;
    }
    .perHeader_5 {
      width: 16.4rem;
    }
    .perHeader_6 {
      width: 10.4rem;
    }
    .dataTable {
      .dataTr {
        line-height: 2.98rem;
        height: 2.98rem;
      }
      .dataTd:nth-child(1) {
        width: 7.1rem;
      }
      .dataTd:nth-child(2) {
        width: 8.8rem;
      }
      .dataTd:nth-child(3) {
        width: 9.4rem;
      }
      .dataTd:nth-child(4) {
        width: 10.1rem;
      }
      .dataTd:nth-child(5) {
        width: 16.4rem;
      }
      .dataTd:nth-child(6) {
        width: 10.4rem;
      }
    }
  }
  .store4 {
    .storeDataList {
      .storeType {
       height: 5.2rem;
        .storeTypeName {
          margin-top: 0.3rem;
        }
      }
      .dataTable {
        .dataTr {
          height: 2.6rem;
          line-height: 2.6rem;
          overflow: hidden;
          text-align: center;
          font-size: 1.6rem;
          .dataTd:nth-child(1) {
            width: 7.1rem;
          }
          .dataTd:nth-child(2) {
            width: 8.8rem;
          }
          .dataTd:nth-child(3) {
            width: 9.4rem;
          }
          .dataTd:nth-child(4) {
            width: 10.1rem;
          }
          .dataTd:nth-child(5) {
            width: 16.4rem;
          }
          .dataTd:nth-child(6) {
            width: 10.4rem;
          }
        }
      }
    }
  }
}
.detailTable4 {
  // height: 33.7rem;
  .store1,
  .store2,
  .store3 {
    .header {
      border-top-left-radius: 1.4rem;
      border-top-right-radius: 1.4rem;
      .no {
        display: none;
      }
    }
    .storeType {
      height: 11.9rem;
      .storeTypeName {
        margin-top: 4rem;
      }
    }
    .perHeader_1 {
      width: 20rem;
    }
    .perHeader_2 {
      width: 12.4rem;
    }
    .perHeader_3 {
      width: 18rem;
    }
    .perHeader_4 {
      width: 8rem;
    }
    .perHeader_5 {
      width: 14.6rem;
    }
    .dataTable {
      .dataTr {
        line-height: 2.98rem;
        height: 2.98rem;
      }
      .dataTd:nth-child(1) {
        width: 9.3rem;
      }
      .dataTd:nth-child(2) {
        width: 12.4rem;
      }
      .dataTd:nth-child(3) {
        width: 18rem;
      }
      .dataTd:nth-child(4) {
        width: 8rem;
      }
      .dataTd:nth-child(5) {
        width: 14.6rem;
      }
    }
  }
  .store4 {
    .storeDataList {
      .storeType {
        height: 5.2rem;
        .storeTypeName {
          margin-top: 0.3rem;
        }
      }
      .dataTable {
        .dataTr {
          height: 2.6rem;
          line-height: 2.6rem;
          overflow: hidden;
          text-align: center;
          font-size: 1.6rem;
          .dataTd:nth-child(1) {
            width: 9.3rem;
          }
          .dataTd:nth-child(2) {
            width: 12.4rem;
          }
          .dataTd:nth-child(3) {
            width: 18rem;
          }
          .dataTd:nth-child(4) {
            width: 8rem;
          }
          .dataTd:nth-child(5) {
            width: 14.6rem;
          }
        }
      }
    }
  }
}
</style>
