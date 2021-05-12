<template>
  <div class="ob-index">
    <div class="mainBox" :class="leftShow ? 'show' : ''">
      <div class="titleBox">
        <svg class="icon" aria-hidden="true" @click="leftShow = !leftShow">
          <use xlink:href="#iconicon_map_leftboard_shouqi"></use>
        </svg>
        组织边界概况/{{ orgName }}-查看
      </div>
      <div style="padding: 15px 15px 0">
        <el-input
          class="smart_input_deep"
          v-model="searchName"
          size="small"
          placeholder="请输入内容"
          clearable
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <div class="switchBox">
          <span class="f14 font-white">组织边界底色</span>
          <el-switch v-model="colorSwitch" @change="switchChange"></el-switch>
        </div>
      </div>

      <div class="treeBox">
        <el-tree
          :data="treeData"
          show-checkbox
          node-key="orgId"
          class="smart_tree_deep"
          :expand-on-click-node="false"
          :check-strictly="checkStrictly"
          :filter-node-method="filterNode"
          :props="defaultProps"
          @check-change="changeTree"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
          ref="tree"
        >
          <span class="custom-tree-node" slot-scope="{ data }">
            <span style="margin-right: 5px"> {{ data.orgName }}</span>
            <div
              class="tree_node_right"
              style="display: flex; align-items: center"
            >
              <el-switch
                v-show="data.isAllOpen"
                v-model="data.open"
                @change="treeswitchChange($event, data)"
                size="mini"
              ></el-switch>
              <div style="width: 40px; margin-left: 5px">
                <span @click="() => changeShow(data)" v-if="data.show">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icondituyincang"></use>
                  </svg>
                  隐藏
                  <!--              {{ data.show ? '隐藏' : '显示' }}-->
                </span>
                <span
                  class="btn"
                  @click="() => changeShow(data)"
                  v-if="!data.show"
                >
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icondituxianshi"></use>
                  </svg>
                  显示
                </span>
              </div>
            </div>
          </span>
        </el-tree>
      </div>
      <div class="btnBox">
        <el-button class="backBtn" size="small" @click="goback">返回</el-button>
        <el-button
          class="setBtn"
          type="primary"
          size="small"
          @click="goPointEdit()"
          v-if="checkorgType == '3'"
          v-auth="'orgBorder:detail:show:anchorset'"
          >锚点设置
        </el-button>
        <el-button class="setBtn" type="primary" size="small" @click="goEdit()" v-auth="'orgBorder:detail:show:set'"
          >设置组织边界
        </el-button>
      </div>
    </div>
    <div class="icon_open" v-show="!leftShow" @click="leftShow = !leftShow">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#iconicon_map_leftboard_zhankai"></use>
      </svg>
    </div>
    <MapCOMP ref="map" @sendMapObj="setmap" />
  </div>
</template>

<script>
import MapCOMP from '@/components/Map.vue'
export default {
  name: 'organizeList',
  title() {
    return '组织树维护'
  },
  components: {
    MapCOMP
  },
  data() {
    return {
      leftShow: true,
      orgId: '',
      orgName: '',
      checkorgType: '',
      backId: '',
      checkStrictly: true,
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      colorSwitch: true,
      searchName: '',
      treeData: [],
      defaultProps: {
        children: 'list',
        label: 'orgName'
      },
      organizeIds: [], //在地图上显示范围的组织id
      drawDataList: [], //在地图上显示范围的组织对象
      AMap: '',
      MapColor: new Map(),
      MapBorder: new Map(),
      MapIcon: new Map(),
      MapName: new Map()
    }
  },
  created() {
    this.orgId = this.$route.query.orgId
    // this.backId = this.$route.query.backId
    this.orgName = this.$route.query.orgName
  },
  mounted() {
    this.getTree()
    this.$store.dispatch('map/setSearchType', ['map'])
    this.$store.dispatch('map/setMapOrganization', false)
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // 通过 `vm` 访问组件实例
      vm.$store.commit('addTabs', {
        title: `组织查看-${vm.$route.query.orgName}`,
        link: `/organize-boundaries/organize-detail?orgId=${vm.$route.query.orgId}&orgName=${vm.$route.query.orgName}`,
        on: false,
        needCatch: true
      })
    })
  },  
  watch: {
    searchName(val) {
      this.$refs.tree.filter(val)
    },
    $route: function (to, from) {
      if (to.name == 'OrganizeDetail' && to.fullPath !== from.fullPath) {
        this.orgId = this.$route.query.orgId
        // this.backId = this.$route.query.backId
        this.AMap.clearMap()
        this.getTree()
      }
    }
  },
  methods: {
    setmap(map) {
      this.AMap = map
    },
    filterNode(value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    getTree() {
      let url = '/api/boundary/orgstyle/list'
      this.$fetch.get(url, { orgId: this.orgId }).then((res) => {
        if (res.code == 200) {
          this.treeData = res.data
          this.setTreeShow(this.treeData)
          this.$refs.tree.setCheckedKeys([this.orgId])
          this.checkorgType = this.treeData[0].orgType
          console.log(this.checkorgType)
          if (this.treeData[0].gdBoundarJson) {
            this.$set(this.treeData[0], 'show', true)
            this.$set(this.treeData[0], 'isAllOpen', false)
            this.$set(this.treeData[0], 'open', false)
            this.drawOrganizeColor(this.treeData[0])
            this.drawOrganizeBorder(this.treeData[0])
            this.drawOrganizeName(this.treeData[0])
            this.drawDataList.push(this.treeData[0])
            this.organizeIds.push(this.treeData[0].orgId)
            
            
          } else {
            this.$message({
              message: '该组织暂无边界信息',
              type: 'warning'
            })
          }
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    treeswitchChange(event, data) {
      console.log(event)
      console.log(data)
      if (event) {
        this.nodeExpand(data)
      } else {
        this.$set(data, 'open', false)
        this.clearChildNode(data)
      }
    },
    setTreeShow(obj) {
      for (let i in obj) {
        this.$set(obj[i], 'show', false)
        if (obj[i].list) {
          this.setTreeShow(obj[i].list)
        }
      }
    },
    changeShow(data) {
      console.log(data)
      if (data.show) {
        this.$set(data, 'show', false)
        let index = this.organizeIds.indexOf(data.orgId)
        if (index > -1) {
          this.organizeIds.splice(index, 1)
        }
        this.drawDataList = this.drawDataList.filter(
          (item) => item.orgId != data.orgId
        )
        console.log(this.drawDataList)
        this.clearMapColor(data.orgId)
        this.clearMapBorder(data.orgId)
        this.clearMapName(data.orgId)
      } else {
        if (data.gdBoundarJson) {
          this.$set(data, 'show', true)
          this.drawDataList.push(data)
          this.organizeIds.push(data.orgId)
          this.drawOrganizeBorder(data)
          this.drawOrganizeName(data)
          if (this.colorSwitch) {
            this.drawOrganizeColor(data)
          }
        } else {
          this.$message({
            message: '该组织暂无边界信息',
            type: 'warning'
          })
        }
      }
    },
    switchChange(val) {
      console.log(val)
      console.log(this.drawDataList)
      if (val) {
        for (let i in this.drawDataList) {
          this.drawOrganizeColor(this.drawDataList[i])
        }
      } else {
        for (let i in this.organizeIds) {
          this.clearMapColor(this.organizeIds[i])
        }
      }
    },
    changeTree(node, check) {
      let currKey = node.orgId

      if (check) {
        this.$refs.tree.setCheckedKeys([currKey])
        this.checkorgType = node.orgType
        if (node.gdBoundarJson) {
          if (!node.show) {
            this.$set(node, 'show', true)
            this.drawOrganizeName(node)
            this.drawDataList.push(node)
            this.organizeIds.push(node.orgId)
            this.drawOrganizeBorder(node)
            if (this.colorSwitch) {
              this.drawOrganizeColor(node)
            }
          }
        } else {
          this.$message({
            message: '该组织暂无边界信息',
            type: 'warning'
          })
        }
      }
    },
    nodeExpand(data, node) {
      console.log(data)
      console.log(node)
      this.$set(data, 'isAllOpen', true)
      this.$set(data, 'open', true)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // data.isAllOpen = true

      // data.open = true
      let list = data.list
      setTimeout(() => {
        for (let i in list) {
          if (list[i].gdBoundarJson) {
            this.$set(list[i], 'show', true)
            this.drawDataList.push(list[i])
            this.organizeIds.push(list[i].orgId)
            this.drawOrganizeBorder(list[i])
            this.drawOrganizeName(list[i])
            if (this.colorSwitch) {
              this.drawOrganizeColor(list[i])
            }
          }
        }
        loading.close()
      }, 100)
      this.$forceUpdate()
    },
    nodeCollapse(data, node) {
      console.log(data)
      console.log(node)
      this.$set(data, 'isAllOpen', false)
      this.$set(data, 'open', false)
      this.clearChildNode(data)
    },
    clearChildNode(data) {
      let list = data.list
      for (let i in list) {
        if (list[i].show) {
          this.$set(list[i], 'show', false)
          let index = this.organizeIds.indexOf(list[i].orgId)
          if (index > -1) {
            this.organizeIds.splice(index, 1)
          }
          this.drawDataList = this.drawDataList.filter(
            (item) => item.orgId != list[i].orgId
          )
          this.clearMapColor(list[i].orgId)
          this.clearMapBorder(list[i].orgId)
          this.clearMapName(list[i].orgId)
        }
      }
    },
    drawOrganizeColor(option) {
      let opacity=option.opacity/100
      option.id = option.orgId
      option.color = option.color ? option.color : '#FF9D9D'
      option.fillColorOpacity =opacity?opacity: '0.5'
      let obj = {
        data: [option]
      }
      let mapOgj = this.$refs.map.drawColors(obj)
      this.MapColor.set(option.id, mapOgj)
      this.AMap.setFitView(mapOgj.PolygonArr)
    },
    clearMapColor(id) {
      let obj = this.MapColor.get(id)
      if (obj && obj.backColorPolygonArr) {
        obj.backColorPolygonArr.forEach((item) => {
          this.AMap.remove(item.geojson)
        })
        this.MapColor.delete(id)
      }
    },
    clearMapBorder(id) {
      let obj = this.MapBorder.get(id)
      if (obj && obj.borderPolygonArr) {
        obj.borderPolygonArr.forEach((item) => {
          this.AMap.remove(item.geojson)
        })
        this.MapBorder.delete(id)
      }
    },
    clearMapIcon(id) {
      let obj = this.MapIcon.get(id)
      if (obj) {
        obj.forEach((item) => {
          this.AMap.remove(item.marker)
        })
        this.MapIcon.delete(id)
      }
    },
    clearMapName(id) {
      let _this = this
      let obj = this.MapName.get(id)
      if (obj) {
        obj.forEach((item) => {
          _this.AMap.remove(item.text)
        })
        this.MapName.delete(id)
      }
    },
    drawOrganizeIcon(option) {
      option.id = option.orgId
      let obj = {
        data: [option]
      }
      let data = this.$refs.map.drawIcons(obj)
      this.MapIcon.set(option.id, data)
    },
    drawOrganizeName(option) {
      let style = {
        'border-width': 0,
        'text-align': 'center',
        'font-size': '16px',
        'font-weight': '600',
        color: '#000000',
        // 'text-shadow': '#FFF 1px 0 0,#FFF 0 1px 0,#FFF -1px 0 0,#FFF 0 -1px 0',
        'font-family':
          'MicrosoftYaHei, Microsoft YaHei Normal, Microsoft YaHei',
        'background-color': '#f0f8ff00'
      }
      option.id = option.orgId
      option.name = option.orgName
      console.log(option)
      let obj = {
        data: [option],
        style: style
      }
      let data = this.$refs.map.drawNames(obj)
      this.MapName.set(option.id, data)
    },
    drawOrganizeBorder(option) {
      option.id = option.orgId
      option.borderColor = option.borderColor ? option.borderColor : '#000000'
      option.borderColorOpacity = option.borderColorOpacity
        ? option.borderColorOpacity
        : 0.8
      let obj = {
        data: [option]
      }
      let data = this.$refs.map.drawBorders(obj)
      this.MapBorder.set(option.id, data)
    },
    goEdit() {
      let data = this.$refs.tree.getCheckedNodes()
      if (data.length == 0) {
        this.$message({
          message: '请选择组织',
          type: 'warning'
        })
        return
      }
      // this.$store.commit('addTabs', {
      //   title: `组织编辑-${this.$route.query.orgName}`,
      //   link:`/organize-boundaries/organize-detail?orgId=${this.$route.query.orgId}&orgName=${this.$route.query.orgName}`,
      //   update: '/organize-boundaries/organize-edit?orgId=' +
      //     data[0].orgId +
      //     '&orgName=' +
      //     data[0].orgName +
      //     '&orgType=' +
      //     data[0].orgType +
      //     '&type=detail' +
      //     '&backId=' +
      //     this.$route.query.orgId +
      //     '&backName=' +
      //     this.$route.query.orgName,
      //   on: false,
      //   needCatch: true
      // })
      this.$router.push(
        '/organize-boundaries/organize-edit?orgId=' +
          data[0].orgId +
          '&orgName=' +
          data[0].orgName +
          '&orgType=' +
          data[0].orgType +
          '&type=detail' +
          '&backId=' +
          this.$route.query.orgId +
          '&backName=' +
          this.$route.query.orgName
      )
    },
    goPointEdit() {
      // this.$store.commit('addTabs', {
      //   title: `组织锚点编辑-${this.$route.query.orgName}`,
      //   link:`/organize-boundaries/organize-detail?orgId=${this.$route.query.orgId}&orgName=${this.$route.query.orgName}`,
      //   update: '/organize-boundaries/organize-point-edit?orgId=' +
      //     data[0].orgId +
      //     '&orgName=' +
      //     data[0].orgName +
      //     '&orgType=' +
      //     data[0].orgType +
      //     '&type=detail' +
      //     '&backId=' +
      //     this.$route.query.orgId +
      //     '&backName=' +
      //     this.$route.query.orgName,
      //   on: false,
      //   needCatch: true
      // })
      let data = this.$refs.tree.getCheckedNodes()
      this.$router.push(
        '/organize-boundaries/organize-point-edit?orgId=' +
          data[0].orgId +
          '&orgName=' +
          data[0].orgName +
          '&orgType=' +
          data[0].orgType +
          '&type=detail' +
          '&backId=' +
          this.$route.query.orgId +
          '&backName=' +
          this.$route.query.orgName
      )
    },
    goback() {
      // this.$store.commit('addTabs', {
      //   title: `组织边界概况`,
      //   link: `/organize-boundaries/organize-detail?orgId=${this.$route.query.orgId}&orgName=${this.$route.query.orgName}`,
      //   update: `/organize-boundaries/organize-list`,
      //   on: false,
      //   needCatch: true
      // })
      this.$router.push('/organize-boundaries/organize-list')
    },
    getPath() {
      let path = ''
      let index = 0
      for (let i in this.$route.query) {
        index++
        console.log(index)
        console.log(i + ':' + this.$route.query[i])
        if (index == 1) {
          path = path + '?' + i + '=' + this.$route.query[i]
        } else {
          path = path + '&' + i + '=' + this.$route.query[i]
        }
        console.log(path)
      }
      return path
    },
  }
}
</script>

<style scoped lang="scss">
.icon_open {
  width: 40px;
  height: 40px;
  background-color: #8798b2;
  position: absolute;
  z-index: 1;
  font-size: 16px;
  line-height: 40px;
  text-align: center;
}

.ob-index {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;

  .btn {
    display: none;
  }

  &:hover {
    .btn {
      display: block;
    }
  }
}

.titleBox {
  background-color: #081f45;
  line-height: 40px;
  color: #ffffff;
  font-size: 14px;
  box-sizing: border-box;
  padding-left: 12px;
}

.mainBox {
  width: 0px;
  height: 100%;
  overflow: hidden;
  background-color: #0a2757;
  position: absolute;
  z-index: 1;
  flex-direction: column;
  transition: width 0.3s;
  -moz-transition: width 0.3s; /* Firefox 4 */
  -webkit-transition: width 0.3s; /* Safari and Chrome */
  -o-transition: width 0.3s;
  display: none;

  &.show {
    width: 330px;
    display: flex;
  }
}

.switchBox {
  height: 50px;
  display: flex;
  align-items: center;

  span {
    margin-right: 10px;
  }
}

.treeBox {
  padding: 0 12px;
  flex: 1;
  overflow: auto;
}

.btnBox {
  margin-top: 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;

  .backBtn {
    background-color: #415982;
    border-color: #415982;
    color: #ffffff;
    width: 105px;

    &:hover {
      background-color: #41598280;
    }
  }

  .setBtn {
    width: 189px;
  }
}
</style>
