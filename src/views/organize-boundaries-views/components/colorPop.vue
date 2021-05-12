<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-18 11:55:51
 * @LastEditTime: 2019-09-27 15:40:24
 * @LastEditors: Please set LastEditors
 -->
<template>
    <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" :before-close="closeDialog" >
        <div class="colorEdit">
                <div class="colorEditIn-title">
                    <h2>编辑配色方案</h2>
                </div>
                <div class="colorEditIn-option">
                    <el-input style='{color="#333"}' v-model="form.name" placeholder="自定义1"></el-input>
                </div>
                <div class="colorEditIn-container">
                    <div class="block" v-for="(item,index) in colors" :key="index">
                         <el-color-picker style='{ color-format="hex"}' v-model="colors[index]"></el-color-picker>
                    </div>
                </div>



        </div>
        <div class="colorEditIn-btn" slot="footer">
                    <el-button @click="closeDialog">取消</el-button>
                    <el-button @click='goSend' type="primary">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
  export default {
    data() {
      return {
        input: '',
        color: '',
        colors:[],
        form:{
          name: '',
          colors: ''
        }
      }
    },
    props:[
      'dialogTableVisible',
      'checkOneColors'
    ],
    watch:{
      checkOneColors(val){
        let json=JSON.parse(val)
        this.form=json
        console.log(json)
        this.colors=json.color.split(',')
      }
    },
    methods: {
      closeDialog(){
        this.$emit('clickClose', false)
      },
      goSend() {
        // this.form.colors=this.colors.join(",");
        // axios.patch(URLList.COLOR_PATCH,this.form).then(
        //     res=>{
        //       res.colors= this.colors
        //       res.name= this.form.name
        //       this.closeDialog()
        //       // AppContext.UI_SUIT["GroupShowDeploy"].getfrom()
        //       this.$parent.$parent.$parent.getfrom()
        //     }).catch(res=>{
        //   console.log(res)
        // })
      }
    },
    computed: {
    }
  }

</script>


<style scoped>
.colorEdit {
    height:440px;
}
.colorEditIn {
    position: absolute;
    background: #fff;
    width: 100%;
    height: 100%;
}
.colorEditIn-title {
    margin:25px 0 0 25px;
}
h2 {
    font-weight: bold;
    color: #000;
    font-size: 20px;
}
.colorEditIn-option{
    width: 70%;
    height: 30px;
    margin: 30px 0 20px 40px;
}
.border_change_info_div  /deep/.el-input__inner {
    color: #333 ;
}
/* /deep/.el-input .el-input__inner{
    color:#333;
} */
.colorEditIn-container {
    /* width: 100%; */
    padding: 0 35px;
    display: flex;
    flex-grow: row;
    justify-content: space-between;
    height: 200px;
    border-bottom: 3px solid #d8e4f0
}
.block {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    width: auto;
}
.el-color-picker{
    width: 40px;
    height: 40px;
    display:flex;
    justify-content: center;
    align-items: center;
}
.el-color-picker /deep/ .el-color-picker__trigger{
    width: 40px;
    height: 40px
}
.colorEditIn-btn {
    /* position: absolute; */
    /* right: 20px;
    bottom: 35px; */
    /* width: 120px; */
    height: 40px;
    display:flex;
    flex-grow:row;
    justify-content:flex-end
}
.el-button{

    color:#7489A0
}
.el-button--default:hover{
    background-color:#fff;
    color:#7489A0
}
.el-button--primary {
  border-color: rgba(0,0,0,0);
    background: #930CEA;
    color:#fff
}
</style>
<style>
    #textFont {
        color:rgba(10, 9, 9, 1) !important
    }
</style>
