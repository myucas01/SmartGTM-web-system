<template>
  <div class="ob-index">
    <div class="mainBox" :class="leftShow ? 'show' : ''">
      <div class="titleBox">
        <svg class="icon" aria-hidden="true" @click="leftShow = !leftShow">
          <use xlink:href="#iconicon_map_leftboard_shouqi"></use>
        </svg>
        边界设置/展示效果配置</div>

      <div class="infoBox">
        <div class="lableBox">
          <span class="lable font-white">组织名称:</span>
          <el-select size="small" class="smart_select_deep" v-model="organizeType" @change="changeType">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="lableBox">
          <span class="lable font-white">填充颜色:</span>
          <div style="height: 30px;">
            <colorsSelect @colorsChange="colorsChange" :params="colors"></colorsSelect>
          </div>
        </div>
        <div class="lableBox">
          <span class="lable font-white">填充不透明度:</span>
          <span class="font-white" style="margin-right: 10px;">{{colorOpacityVal}}%</span>
          <el-slider
            v-model="colorOpacityVal"
            :show-tooltip="false"
            class="input"
            @change="colorOpacityChange"
          ></el-slider>
        </div>
        <div class="lableBox">
          <span class="lable font-white">描边颜色:</span>
          <span class="font-white">{{borderColor}}</span>
          <el-color-picker v-model="borderColor" class="input" size="small" @change="borderChange"></el-color-picker>
        </div>
        <div class="lableBox">
          <span class="lable font-white">描边不透明度:</span>
          <span class="font-white" style="margin-right: 10px;">{{borderOpacityVal}}%</span>
          <el-slider
            v-model="borderOpacityVal"
            :show-tooltip="false"
            class="input"
            @change="borderOpacityChange"
          ></el-slider>
        </div>
        <div class="lableBox">
          <span class="lable font-white">描边粗细:</span>
          <div class="input" style="height: 30px;">
            <borderSelect @borderSizeChange="borderWeightChange"></borderSelect>
          </div>
        </div>
        <div class="lableBox">
          <span class="lable font-white">图标:</span>
          <div class="input" style="height: 30px;">
            <imgSelect @iconChange="iconChange" :params="iconType"></imgSelect>
          </div>
        </div>
      </div>

      <div class="btnBox">
        <el-button class="setBtn" type="primary" size="small" @click="submit">完成</el-button>
      </div>
    </div>
    <div class="icon_open" v-show="!leftShow" @click="leftShow = !leftShow">
      <svg class="icon" aria-hidden="true" >
        <use xlink:href="#iconicon_map_leftboard_zhankai"></use>
      </svg>
    </div>
    <MapCOMP ref="map"  @sendMapObj="setmap" />
  </div>
</template>

<script>
import MapCOMP from "@/components/Map.vue";
import imgSelect from "./components/imgSelect.vue";
import borderSelect from "./components/borderSelect.vue";
import colorsSelect from "./components/colorsSelect.vue";
import mapData from "@/assets/js/mapData";
export default {
  name: "ShowDeploy",
  title() {
    return "展示效果配置";
  },
  components: {
    MapCOMP,
    imgSelect,
    borderSelect,
    colorsSelect,
  },
  data() {
    return {
      leftShow: true,
      organizeType: '',
      colorList:'',
      colors:'',
      // colorId:'',
      colorsId:'',
      styleId:'',
      colorOpacityVal: 50,
      borderWidth:1,
      borderOpacityVal: 50,
      options: [
        {
          label: "行销公司",
          value: "1",
        },
        {
          label: "营业部",
          value: "2",
        },
        {
          label: "营业所",
          value: "3",
        },
      ],
      borderColor: "",
      iconType:null,
      searchName: "",
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      groupData: "",
      AMap: '',
      mapOgj: new Map(),
    };
  },
  created() {
    this.groupData = mapData.department;
    this.getData();
    this.getStyle()

  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.$store.commit('addTabs', {
        title: `展示效果配置`,
        link: `/organize-boundaries/show-deploy`,
        on: false,
        needCatch: true
      })
    })
  },
  mounted() {},
  watch: {
    searchName(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    getStyle() {
      let url = '/api/boundary/orgstyle/show/effectAuthority'
      // let
      this.$fetch
              .get(url, {
                orgId: '',
                type:this.organizeType
              })
              .then((res) => {
                if (res.code == 200) {
                  console.log(res)
                  let optionList=[]
                  for(let i in res.data.orgTypeList){
                    if(res.data.orgTypeList[i]=='1'){
                      optionList.push({
                        label: "行销公司",
                        value: "1",
                      })
                    }
                    if(res.data.orgTypeList[i]=='2'){
                      optionList.push({
                        label: "营业部",
                        value: "2",
                      })
                    }
                    if(res.data.orgTypeList[i]=='3'){
                      optionList.push({
                        label: "营业所",
                        value: "3",
                      })
                    }
                  }
                  this.options = optionList
                  if(!this.organizeType){
                     this.organizeType = this.options[0].value
                  }
                  this.colors=res.data.colors.toString()
                  this.colorsId=res.data.colorsId
                  this.styleId=res.data.styleId
                  this.colorOpacityVal=res.data.opacity
                  this.iconType=res.data.icon ? res.data.icon :'1'
                  this.borderOpacityVal=res.data.drawingOpacity ? res.data.drawingOpacity :50
                  this.borderColor=res.data.borderColor
                  this.borderWidth=res.data.borderSize
                  this.colorList = this.colors.split(',') 
                  console.log(this.colorList)
                  for (let i = 0; i < this.groupData.length; i++) {
                    this.groupData[i].borderColor = this.borderColor;
                    this.groupData[i].borderColorOpacity = this.borderOpacityVal / 100;
                    this.groupData[i].fillColorOpacity = this.colorOpacityVal / 100;
                    for (let x = 0; x < this.colorList.length; x++) {
                      this.groupData[i].fillColor = this.colorList[i];
                    }
                    this.groupData[i].borderWidth = this.borderWidth;
                    this.groupData[i].iconType = this.iconType;
                  }
                  this.drawCampany()
                  this.drawOrganizeColor()
                  this.drawOrganizeBorder()
                  this.drawOrganizeIcon()
                }
              })
              .catch((error) => {
                console.log(error.message)
              })
    },
    setmap(map) {
      this.AMap = map
    },
    changeType(){
      this.AMap.clearMap()
      this.initial()
      this.getStyle()
    },
    initial(){
      this.colorList=''
      this.colors=''
      this.colorOpacityVal=50
      this.borderColor=''
      this.borderOpacityVal=50
      this.borderWidth=1
      this.iconType=1
    },
    colorsChange(val) {
      console.log(val)
      this.colorsId=val.id
      this.colors = val.color
      this.colorList = val.color ? val.color.split(",") : [];
      for (let i = 0; i < this.groupData.length; i++) {
        for (let x = 0; x < this.colorList.length; x++) {
          this.groupData[i].fillColor = this.colorList[i];
          this.groupData[i].fillColorOpacity = this.colorOpacityVal / 100;
        }
      }
      this.drawOrganizeColor();
    },
    colorOpacityChange(val) {
      for (let i = 0; i < this.groupData.length; i++) {
        this.groupData[i].fillColorOpacity = val / 100;
      }
      this.drawOrganizeColor();
    },
    borderChange(val) {
      for (let i = 0; i < this.groupData.length; i++) {
        this.groupData[i].borderColor = val;
        this.groupData[i].borderColorOpacity = this.borderOpacityVal / 100;
      }
      this.drawOrganizeBorder();
    },
    borderOpacityChange(val) {
      for (let i = 0; i < this.groupData.length; i++) {
        this.groupData[i].borderColorOpacity = val / 100;
      }
      this.drawOrganizeBorder();
    },
    borderWeightChange(val) {
      console.log(val);
      this.borderWidth=val.value;
      for (let i = 0; i < this.groupData.length; i++) {
        this.groupData[i].borderWidth = val.value;
      }
      this.drawOrganizeBorder();
    },
    iconChange(val) {
      console.log(val);
      this.iconType=val.id
      for (let i = 0; i < this.groupData.length; i++) {
        this.groupData[i].iconType = val.id;
      }
      this.drawOrganizeIcon()
    },
    drawOrganizeIcon() {
      let obj = {
        data: this.groupData,
      };
      this.clearMap("icon");
      let data = this.$refs.map.drawIcons(obj);
      this.mapOgj.set("icon", data);
    },
    drawOrganizeColor() {
      let obj = {
        data: this.groupData,
      };
      this.clearMap("color");
      let data = this.$refs.map.drawColors(obj);
      this.mapOgj.set("color", data);
    },
    drawOrganizeBorder() {
      let obj = {
        data: this.groupData,
      };
      this.clearMap("border");
      let data = this.$refs.map.drawBorders(obj);
      this.mapOgj.set("border", data);
    },
    drawCampany(){
      let obj = {
        data:mapData.companyInfo,
      };
      let data = this.$refs.map.drawBorders(obj);
      this.AMap.setFitView(data.PolygonArr)
    },
    clearMap(key) {
      let _this = this;
      let obj = this.mapOgj.get(key);
      if (obj) {
        if (obj.backColorPolygonArr) {
          obj.backColorPolygonArr.forEach((item) => {
            _this.AMap.remove(item.geojson);
          });
        }
        if (obj.borderPolygonArr) {
          obj.borderPolygonArr.forEach((item) => {
            _this.AMap.remove(item.geojson);
          });
        }
        if (key=='icon') {
          obj.forEach((item) => {
            _this.AMap.remove(item.marker);
          });
        }
        this.mapOgj.delete(key);
      }
    },
    getData() {},
    submit(){
      let url = '/api/boundary/orgstyle/update/style'
      // let
      this.$fetch
              .post(url, {
                type: this.organizeType,
                colors: this.colorList,
                colorsId:this.colorsId,
                // colorId:this.colorId,
                styleId:this.styleId,
                opacity:this.colorOpacityVal,
                borderColor:this.borderColor,
                borderSize:this.borderWidth,
                drawingOpacity:this.borderOpacityVal,
                icon:this.iconType,
              })
              .then((res) => {
                if (res.code == 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                }
              })
              .catch((error) => {
                console.log(error.message)
              })
    }
  },
};
</script>

<style scoped lang="scss">
  .icon_open{
    width: 40px;
    height: 40px;
    background-color: #8798B2;
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
  font-size: 15px;
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
  &.show{
    width: 330px;
    display: flex;
  }
}
.infoBox {
  background-color: #162d68;
  padding: 10px 15px 0;
  .lableBox {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .input {
      flex: 1;
      margin-left: 5px;
    }
    .lable {
      margin-right: 10px;
      width: 80px;
    }
    .el-input {
      flex: 1;
    }
    .previewBtn {
      color: #f19316;
      margin-left: 5px;
      cursor: pointer;
    }
  }
}
.btnBox {
  margin-top: 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
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
    width: 100%;
  }
}
</style>
