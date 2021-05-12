<template>
  <!-- 基础图层 -->
  <div class="content">
    <div v-for="(item, index) in basicData" :key="index" class="basicitem">
      <div class="items basicoption">
        <span
          v-for="(option, opindex) in item.options"
          :key="opindex"
          class="option"
          >{{ option }}</span
        >
      </div>
      <!-- 第一列选框 -->
      <div class="title">
        <span>{{ item.lable }}</span>
        <span class="items">
          <el-checkbox
            v-for="(checkitem, checkindex) in item.checkArr"
            v-model="checkitem.value"
            :key="checkindex"
            class="option smart_checkbox_deep"
            @change="handleChecked($event, checkitem, item.id, item.lable)"
          ></el-checkbox>
        </span>
      </div>
      <!-- 子列选框 -->
      <div
        v-for="(childitem, childindex) in item.child"
        :key="childindex"
        class="childoption"
      >
        <span :alt="childitem.lable">
          <svg-icon
            :icon-class="childitem.icon"
            :class-name="childitem.color"
          ></svg-icon>
          {{ childitem.lable }}
        </span>
        <span class="items">
          <el-checkbox
            v-for="(childoption, index) in childitem.checkArr"
            v-model="childoption.value"
            :key="index"
            class="option smart_checkbox_deep"
            @change="handleChecked($event, childoption, item.id, childitem.id)"
          ></el-checkbox>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BasicLayer',
  props: [
    'orgId',
    'AMap',
    'CoverDataArr',
    'LineDataArr',
    'NameDataArr',
    'PositionDataArr'
  ],
  data() {
    return {
      basicData: [] // 选框选项列表
    }
  },
  mounted() {
    // ******调用接口返回基础图层数据结构
    const basicData = [
      {
        options: ['名称', '位置', '边界', '范围', '全部'],
        lable: '组织架构',
        id: '0',
        checkArr: [
          {
            key: 'allname',
            value: false
          },
          {
            key: 'allposition',
            value: false
          },
          {
            key: 'allboundary',
            value: false
          },
          {
            key: 'allscope',
            value: false
          },
          {
            key: 'allcheck',
            value: false
          }
        ],
        child: [
          {
            lable: '营业所',
            icon: 'icon_layer_base_normal',
            id: 'yingyesuo',
            checkArr: [
              {
                key: 'name',
                value: false
              },
              {
                key: 'position',
                value: false
              },
              {
                key: 'boundary',
                value: false
              },
              {
                key: 'scope',
                value: false
              },
              {
                key: 'itemcheck',
                value: false
              }
            ]
          }
        ]
      },
      {
        options: ['名称', '边界', '全部'],
        lable: '行政区划',
        id: '1',
        checkArr: [
          {
            key: 'allname',
            value: false
          },
          {
            key: 'allboundary',
            value: false
          },
          {
            key: 'allcheck',
            value: false
          }
        ],
        child: [
          {
            lable: '县级市',
            icon: 'icon_layer_base_normal',

            id: 'cityData',
            checkArr: [
              {
                key: 'name',
                value: false
              },
              {
                key: 'boundary',
                value: false
              },
              {
                key: 'itemcheck',
                value: false
              }
            ]
          },
          {
            lable: '区、县',
            icon: 'icon_layer_base_normal',

            id: 'countyData',
            checkArr: [
              {
                key: 'name',
                value: false
              },
              {
                key: 'boundary',
                value: false
              },
              {
                key: 'itemcheck',
                value: false
              }
            ]
          },
          {
            lable: '乡、镇、街道',
            icon: 'icon_layer_base_normal',
            id: 'streetData',
            checkArr: [
              {
                key: 'name',
                value: false
              },
              {
                key: 'boundary',
                value: false
              },
              {
                key: 'itemcheck',
                value: false
              }
            ]
          }
        ]
      }
    ]
    this.basicData = basicData
  },
  methods: {
    handleChecked(value, data, id, childId) {
      const newData = this.basicData.filter(item => item.id == id)
      if (newData.length > 0) {
        const item = newData[0]
        if (item.id == id) {
          if (!value) {
            //取消勾选任意一项，全部勾选取消
            item.checkArr.forEach(smallitem => {
              if (smallitem.key == 'allcheck') {
                smallitem.value = false
              }
            })
          }
          switch (data.key) {
            case 'allcheck': //头部最后一列全选
              {
                item.checkArr.forEach(checkItme => {
                  checkItme.value = value
                })
                item.child.forEach(newItem => {
                  newItem.checkArr.forEach(samllitem => {
                    samllitem.value = value
                  })
                })
              }
              break
            case 'itemcheck': //右侧行全选
              {
                item.child.forEach(checkItme => {
                  if (checkItme.id === childId) {
                    checkItme.checkArr.forEach(samllitem => {
                      samllitem.value = value
                    })
                  }
                })
              }
              break
            case 'allname': // 名称全选
              {
                item.child.forEach(checkItme => {
                  checkItme.checkArr.forEach(item => {
                    if (item.key.indexOf('name') !== -1) {
                      item.value = value
                    }
                  })
                })
              }
              break
            case 'allposition': // 位置全选
              {
                item.child.forEach(checkItme => {
                  checkItme.checkArr.forEach(item => {
                    if (item.key.indexOf('position') !== -1) {
                      item.value = value
                    }
                  })
                })
              }
              break
            case 'allboundary': // 边界全选
              {
                item.child.forEach(checkItme => {
                  checkItme.checkArr.forEach(item => {
                    if (item.key.indexOf('boundary') !== -1) {
                      item.value = value
                    }
                  })
                })
              }
              break
            case 'allscope': // 范围全选
              {
                item.child.forEach(checkItme => {
                  checkItme.checkArr[3].value = value
                  checkItme.checkArr.forEach(item => {
                    if (item.key.indexOf('scope') !== -1) {
                      item.value = value
                    }
                  })
                })
              }
              break
            default:
              break
          }
        }
      }
      // 检查是否全部选中
      this.checkData(id)
      // ******调用接口监听地图数据
      this.getMapStyle(this.basicData, value)
    },
    getMapStyle(data) {
      data.forEach(item => {
        if (item.lable === '组织架构') {
          item.child.forEach(options => {
            if (options.lable === '营业所') {
              options.checkArr.forEach(child => {
                switch (child.key) {
                  case 'name':
                    this.traverseArr(
                      'NameDataArr',
                      this.orgId,
                      child.value,
                      'organization'
                    )
                    break
                  case 'position':
                    this.traverseArr(
                      'Positon',
                      this.orgId,
                      child.value,
                      'organization'
                    )
                    break
                  case 'boundary':
                    this.traverseArr(
                      'LineDataArr',
                      this.orgId,
                      child.value,
                      'organization'
                    )
                    break
                  case 'scope':
                    this.traverseArr(
                      'CoverDataArr',
                      this.orgId,
                      child.value,
                      'organization'
                    )
                    break
                  default:
                    break
                }
              })
            }
          })
        } else if (item.lable === '行政区划') {
          item.child.forEach(options => {
            options.checkArr.forEach(child => {
              switch (child.key) {
                case 'name':
                  this.traverseArr(
                    'NameDataArr',
                    options.id,
                    child.value,
                    'administration'
                  )
                  break
                case 'boundary':
                  this.traverseArr(
                    'LineDataArr',
                    options.id,
                    child.value,
                    'administration'
                  )
                  break
                default:
                  break
              }
            })
          })
        }
      })
    },
    checkData(id) {
      let checkBox = []
      const newData = this.basicData.filter(item => item.id == id)
      if (newData.length > 0) {
        const { child, checkArr } = newData[0]
        child.forEach(checkItme => {
          const { checkArr } = checkItme
          const itemcheck = checkArr.filter(item => item.key === 'itemcheck')[0]
          checkBox.push(...checkArr)
          // 右侧是否全选判断
          if (
            checkArr
              .filter(item => item.key !== 'itemcheck')
              .every(item => item.value)
          ) {
            itemcheck && (itemcheck.value = true)
          } else {
            itemcheck && (itemcheck.value = false)
          }
        })
        // 名称全选判断
        this.judgeAll(checkBox, 'name', 'allname', checkArr)
        // 位置全选判断
        this.judgeAll(checkBox, 'position', 'allposition', checkArr)
        // 边界全选判断
        this.judgeAll(checkBox, 'boundary', 'allboundary', checkArr)
        // 名称全选判断
        this.judgeAll(checkBox, 'scope', 'allscope', checkArr)
        // 全部全选判断
        const allcheck = checkArr.filter(item => item.key === 'allcheck')[0]
        if (checkBox.every(item => item.value)) {
          allcheck && (allcheck.value = true)
        } else {
          allcheck && (allcheck.value = false)
        }
      }
    },
    // 根据结果和选框name___遍历所有多选框显示效果
    judgeAll(data, checkValue, newValue, checkArr) {
      const newData = data.filter(item => item.key == checkValue)
      const checkData = checkArr.filter(item => item.key == newValue)[0]
      if (newData.length > 0 && newData.every(item => item.value)) {
        checkData && (checkData.value = true)
      } else {
        checkData && (checkData.value = false)
      }
    },
    traverseArr(typeArr, id, value, type) {
      if (typeArr === 'LineDataArr') {
        if (this.LineDataArr.size > 0) {
          for (let item of this.LineDataArr) {
            let data
            if (type === 'organization') {
              if (item[0] === id) {
                data = item[1]
              }
            } else if (type === 'administration') {
              if (item[0].includes(id)) {
                data = item[1]
              }
            }
            if (data) {
              if (value) {
                data[0] && this.AMap.add(data[0].geojson)
              } else {
                data[0] && this.AMap.remove(data[0].geojson)
              }
            }
          }
        }
      }
      if (typeArr === 'CoverDataArr') {
        if (this.CoverDataArr.size > 0) {
          for (let item of this.CoverDataArr) {
            let data
            if (type === 'organization') {
              if (item[0] === id) {
                data = item[1]
              }
            } else if (type === 'administration') {
              if (item[0].includes(id)) {
                data = item[1]
              }
            }
            if (data) {
              if (value) {
                data[0] && this.AMap.add(data[0].geojson)
              } else {
                data[0] && this.AMap.remove(data[0].geojson)
              }
            }
          }
        }
      }
      if (typeArr === 'NameDataArr') {
        if (this.NameDataArr.size > 0) {
          for (let item of this.NameDataArr) {
            let data
            if (type === 'organization') {
              if (item[0] === id) {
                data = item[1]
              }
            } else if (type === 'administration') {
              if (item[0].includes(id)) {
                data = item[1]
              }
            }
            if (data) {
              if (value) {
                data[0] && this.AMap.add(data[0].text)
              } else {
                data[0] && this.AMap.remove(data[0].text)
              }
            }
          }
        }
      }
      if (typeArr === 'Positon') {
        if (this.PositionDataArr.size > 0) {
          for (let item of this.PositionDataArr) {
            let data
            if (type === 'organization') {
              if (item[0] === id) {
                data = item[1]
              }
            } else if (type === 'administration') {
              if (item[0].includes(id)) {
                data = item[1]
              }
            }
            if (data) {
              if (value) {
                data && this.AMap.add(data)
              } else {
                data && this.AMap.remove(data)
              }
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
span {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 40%;
}
.basicitem {
  color: #ffffff;
  font-size: 13px;
  .basicoption {
    display: flex;
    height: 40px;
    line-height: 40px;
    justify-content: space-between;
    padding-right: 5px;
    width: 100% !important;
  }
  .title {
    display: flex;
    height: 36px;
    line-height: 36px;
    background: #133773;
    justify-content: space-between;
    padding-left: 12px;
  }
  .childoption {
    display: flex;
    font-size: 12px;
    height: 30px;
    background: #102f63;
    line-height: 30px;
    justify-content: space-between;
    padding-left: 12px;
  }
  .items {
    display: flex;
    justify-content: flex-end;
    width: 80%;
    .option {
      width: 24px;
      margin: 0 10px;
      font-size: 12px;
      text-align: center;
    }
  }
  .color_1 {
    background-color: #ffa300;
    width: 6px;
    margin-right: 3px;
  }
  .color_2 {
    background-color: #ffc605;
    width: 6px;
    margin-right: 3px;
  }
  .color_3 {
    background-color: #fae902;
    width: 6px;
    margin-right: 3px;
  }
  .color_4 {
    background-color: #00e7c0;
    width: 6px;
    margin-right: 3px;
  }
  .color_5 {
    background-color: #318ee9;
    width: 6px;
    margin-right: 3px;
  }
  .color_6 {
    background-color: #7ed321;
    width: 6px;
    margin-right: 3px;
  }
}
</style>
