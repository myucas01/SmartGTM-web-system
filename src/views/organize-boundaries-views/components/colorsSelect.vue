<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-19 15:54:27
 * @LastEditTime: 2019-09-27 15:39:34
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="selectCombo">
    <div class="selectP">
      <p>
        <span class="colors" v-for="(el,i) in checkColors" :key="i" :style="{'background':el}"></span>
      </p>
      <el-select
        style="color:rgba(0,0,0,0)"
        v-model="checkValue"
        id="colorSelectInput"
        size="small"
        placeholder=" "
        class="selectInput smart_select_deep"
        @change="valueChange"
      >
        <el-option v-for="(item,index) in colorArr" :key="item.id" :label="item.name" :value="index">
          <span
            class="colors"
            v-for="(el,i) in (item.color || '').split(',')"
            :key="i"
            :style="{'background':el}"
          ></span>
<!--          <i class="selectMask el-icon-edit-outline" @click.stop="dialogTableVisibleS(index)"></i>-->
        </el-option>
      </el-select>
    </div>
    <ColorPop :dialogTableVisible.sync="dialogTableVisible" :checkOneColors='ColorPopData' @clickClose='close' />
  </div>
</template>

<script>
import ColorPop from "./colorPop.vue";
export default {
  name: "select",
  data() {
    return {
      optionShow: false,
      checkValue: [], //存放选中的id
      colorArr: [], //存放选中数组
      checkColors: [], //存放选中的颜色数组
      dialogTableVisible: false,
      ColorPopData: "{}"
    };
  },
  mounted() {
    let el = document.getElementById("colorSelectInput");
    el.style.cssText = "color:rgba(0,0,0,0);background: none;";
    this.init();
  },
  props: ["params"],
  watch: {
    params(val) {
      console.log(val)
      if (val) {
        this.checkValue=val.toString()
        this.checkColors=val.toString().split(',')
      }
    }
  },
  methods: {
    async init() {
      let url = '/api/boundary/orgstyle/color/list'
      // let
      this.$fetch
              .get(url, {
                orgId: this.orgId,
                type:''
              })
              .then((res) => {
                if (res.code == 200) {
                  this.$set(this, "colorArr", res.data);
                  this.setConfigId();
                }
              })
              .catch((error) => {
                console.log(error.message)
              })

    },
    setConfigId() {
      //根据父级组件传入的颜色，设置默认选中颜色
      this.colorArr.forEach((item, index) => {
        if (this.params == item.color) {
          this.valueChange(index);
          this.checkColors=item.color.split(',')
        }
      });
    },
    valueChange(i) {
      this.checkColors = (this.colorArr[i].color || '').split(",");
      this.$emit("colorsChange", this.colorArr[i]);
      //this.hideOption()
    },
    dialogTableVisibleS(i) {
      this.dialogTableVisible = true;
      let json = this.colorArr[i];
      this.ColorPopData = JSON.stringify(json);
    },
    close(value){
      console.log(value)
      this.dialogTableVisible = false;
    }
  },
  components: {
    ColorPop
  }
};
</script>

<style lang="scss" scoped>
.selectCombo {
  position: relative;
}
.options {
  position: absolute;
  background: #ffffff;
  width: 100%;
  z-index: 9999;
  color: #000000;
}
.colors {
  display: inline-block;
  width: 15px;
  height: 5px;
}
.selectMask {
  position: absolute;
  right: 5%;
  top: 30%;
  font-size: 15px;
  color: #959595;
}
.selectP {
  height: 30px;
}
.selectP p {
  line-height: 30px;
  height: 30px;
  padding: 0 15px;
  width: 90%;
  text-align: left;
}
.selectInput {
  float: left;
  background: none;
  position: relative;
  top: -30px;
}
</style>
