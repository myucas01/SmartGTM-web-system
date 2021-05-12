<template>
    <div class="colorBox">
        <div class="lableBox">
            <span class="lable font-white">填充颜色:</span>
            <span class="font-white">{{ color }}</span>
            <el-color-picker
                    v-model="color"
                    class="input"
                    size="small"
                    @change="colorChange"
            ></el-color-picker>
        </div>
        <div class="lableBox">
            <span class="lable font-white">填充不透明度:</span>
            <span class="font-white" style="margin-right: 10px"
            >{{ opacityVal }}%</span
            >
            <el-slider
                    v-model="opacityVal"
                    :show-tooltip="false"
                    class="input"
                    @change="colorChange"
            ></el-slider>
        </div>
        <div class="lableBox">
            <span class="lable font-white">图标:</span>
            <div class="input" style="height: 30px">
                <imgSelect :params="iconType" @iconChange="iconsChange"></imgSelect>
            </div>
        </div>
    </div>
</template>
<script>
  import imgSelect from './imgSelect.vue'

  export default {
    data() {
      return {
        color: '', //填充色
        opacityVal: 50, // 填充透明度
        iconType: null, //图标类型
        styleId: '',//展示效果配置Id
      }
    },
    components: {
      imgSelect,
    },
    props: ['orgId','orgType'],
    mounted() {
      this.getStyle(this.orgId,this.orgType)
    },
    methods: {
      //获取展示样式
      getStyle(orgId,orgType) {
        let url = '/api/boundary/orgstyle/show/effect'
        // let
        this.$fetch
          .get(url, {
            isLoading: false,
            orgId: orgId,
            type: orgType ? orgType :''
          })
          .then((res) => {
            if (res.code == 200) {
              console.log(res)
              if(res.data){
                this.color = res.data.color
                // this.orgColor=res.data.color
                this.opacityVal = res.data.opacity ? res.data.opacity : 50
                this.iconType = res.data.icon ? res.data.icon : '1'
                this.styleId = res.data.styleId
              }else{
                this.color = ''
                // this.orgColor=res.data.color
                this.opacityVal = 50
                this.iconType = '1'
              }
            }
            this.$emit('orgColor', res.data?res.data:{
              color:'',
              opacity:50,
              icon:'1'
            })
          })
          .catch((error) => {
            console.log(error.message)
          })
      },
      iconsChange(val) {
        this.$set(this, "iconType", val.id);
        this.$emit('iconChange',this.iconType)
      },
      colorChange(){
        this.$emit('colorChange',this.color,this.opacityVal)
      },
      submitStyle(){
        let url = '/api/boundary/orgstyle/update/style'
        // let
        this.$fetch
          .post(url, {
            orgId: this.orgId,
            colors: [this.color],
            opacity:this.opacityVal,
            icon:this.iconType,
            styleId:this.styleId,
            isLoading: false
          })
          .then((res) => {
            if (res.code == 200) {
              // this.$router.replace(this.backRoute)
              this.$emit('styleBack')
            }
          })
          .catch((error) => {
            console.log(error.message)
          })
      },
    }
  }
</script>
<style scoped lang="scss">
    .colorBox {
        background-color: #162d68;
        padding: 10px 15px 0;

        .lableBox {
            display: flex;
            align-items: center;
            margin-bottom: 10px;

            .lable {
                width: 80px;
            }

            .input {
                flex: 1;
                margin-left: 5px;
            }
        }
    }
</style>
